#!/usr/bin/env python3
"""
Package design-spec handoff bundles into a zip archive.

Resolves components for a programme (design system), collects specs, contracts,
theme CSS, optional Storybook reference sources, and writes a manifest.

Usage:
  python3 scripts/package_component_handoff.py \\
    --programme synapse \\
    --components Topology \\
    --output-dir ./dist \\
    --output-name topology-handoff-v1

  python3 scripts/package_component_handoff.py \\
    -p synapse -c Topology -o ./dist -n topology-handoff-v1 \\
    --include-reference-deps --include-icons
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import zipfile
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Iterator

# Repo root on PYTHONPATH when invoked from project root
from config.design_system_config import load_design_system

REPO_ROOT = Path(__file__).resolve().parent.parent

# Paths referenced inside markdown / specs / README tables
PATH_PATTERN = re.compile(
    r"(?<![\w./-])((?:components|storybook|assets|data)/[\w./\-]+\.(?:md|css|ts|tsx|json|svg))"
)

# Do not pull these via markdown extraction (handoff adds figma excerpt separately).
PATH_EXTRACT_BLOCKLIST = {
    "data/component-figma-map.json",
    "data/synapse-component-figma-map.json",
    "data/programme-inheritance-registry.json",
}

MAP_PATH_SUFFIXES = (
    "designSpecPath",
    "idsBaselineSpecPath",
    "programDeltaSpecPath",
    "baselineSpecPath",
)
MAP_PATH_CONTAINS = ("SpecPath", "specPath")

IMPORT_PATTERN = re.compile(r"""from\s+['"](\.\./[^'"]+|\./[^'"]+)['"]""")
SHAPE_NAME_PATTERN = re.compile(r"""shapeName=["']([a-z0-9-]+)["']""")
ICON_SLUG_PATTERN = re.compile(r"""iconSlug=["']([a-z0-9-]+)["']""")

COMPONENTS_ROOT = REPO_ROOT / "storybook" / "src" / "components"
ICONS_ROOT = REPO_ROOT / "assets" / "icons"


@dataclass
class ComponentResolution:
    query: str
    slug: str
    map_entry: dict[str, Any] | None
    design_spec_path: Path
    component_dir: Path


@dataclass
class PackageResult:
    programme: str
    components: list[ComponentResolution]
    files: set[Path] = field(default_factory=set)
    warnings: list[str] = field(default_factory=list)
    missing: list[str] = field(default_factory=list)


def _slug_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.lower())


def _load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def _load_aliases(programme: str) -> dict[str, str]:
    alias_path = REPO_ROOT / "data" / f"{programme}-component-aliases.json"
    if not alias_path.is_file():
        return {}
    data = _load_json(alias_path)
    figma_to_slug = data.get("figma_to_slug", {})
    slug_to_figma: dict[str, str] = {}
    for figma_name, slug in figma_to_slug.items():
        slug_to_figma[_slug_key(slug)] = figma_name
        slug_to_figma[_slug_key(figma_name)] = figma_name
    return slug_to_figma


def _iter_map_entries(figma_map: list[dict[str, Any]]) -> Iterator[dict[str, Any]]:
    for entry in figma_map:
        if isinstance(entry, dict):
            yield entry


def _paths_from_map_entry(entry: dict[str, Any]) -> set[str]:
    found: set[str] = set()
    for key, value in entry.items():
        if not isinstance(value, str):
            continue
        if key in MAP_PATH_SUFFIXES or any(token in key for token in MAP_PATH_CONTAINS):
            if value.endswith((".md", ".css", ".ts", ".tsx", ".json", ".svg")):
                found.add(value)
        if key == "designSpecPath" and value.endswith(".md"):
            found.add(value)
    return found


def _find_map_entry(
    query: str,
    figma_map: list[dict[str, Any]],
    aliases: dict[str, str],
) -> dict[str, Any] | None:
    query_keys = {_slug_key(query)}
    canonical = aliases.get(_slug_key(query))
    if canonical:
        query_keys.add(_slug_key(canonical))

    for entry in _iter_map_entries(figma_map):
        component = str(entry.get("component", ""))
        spec_path = str(entry.get("designSpecPath", ""))
        spec_slug = spec_path.split("/")[-2] if "/" in spec_path else ""

        entry_keys = {_slug_key(component), _slug_key(spec_slug)}
        entry_keys.discard("")

        if query_keys & entry_keys:
            return entry
    return None


def _resolve_component(
    query: str,
    programme: str,
    components_dir: Path,
    figma_map: list[dict[str, Any]],
    aliases: dict[str, str],
) -> ComponentResolution:
    entry = _find_map_entry(query, figma_map, aliases)
    design_spec: Path | None = None

    if entry and entry.get("designSpecPath"):
        design_spec = REPO_ROOT / str(entry["designSpecPath"])
    else:
        slug = _slug_key(query)
        # Try folder names with common separators
        for folder in (slug, query.lower().replace(" ", "-"), query.lower()):
            candidate = components_dir / folder / "design-spec.md"
            if candidate.is_file():
                design_spec = candidate
                break

    if design_spec is None or not design_spec.is_file():
        raise FileNotFoundError(
            f"Could not resolve component '{query}' for programme '{programme}'. "
            "Check spelling or add a figma-map entry with designSpecPath."
        )

    slug = design_spec.parent.name
    return ComponentResolution(
        query=query,
        slug=slug,
        map_entry=entry,
        design_spec_path=design_spec,
        component_dir=design_spec.parent,
    )


def _extract_paths_from_text(text: str) -> set[str]:
    return set(PATH_PATTERN.findall(text))


def _collect_markdown_tree(component_dir: Path) -> set[Path]:
    collected: set[Path] = set()
    if not component_dir.is_dir():
        return collected
    for path in component_dir.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".md", ".mdx"}:
            collected.add(path)
    return collected


def _collect_contracts(slug: str, programme: str) -> set[Path]:
    collected: set[Path] = set()
    contracts_root = REPO_ROOT / "storybook" / "src" / "spec-contracts"

    component_contract_dir = contracts_root / slug
    if component_contract_dir.is_dir():
        for path in component_contract_dir.rglob("*"):
            if path.is_file():
                collected.add(path)

    for path in contracts_root.glob(f"{programme}-{slug}*.ts"):
        if path.is_file():
            collected.add(path)

    for path in contracts_root.glob(f"{programme}-{slug}*.contract.ts"):
        if path.is_file():
            collected.add(path)

    return collected


def _collect_reference_impl(slug: str, include_tests: bool) -> set[Path]:
    collected: set[Path] = set()
    impl_dir = COMPONENTS_ROOT / slug
    if not impl_dir.is_dir():
        return collected

    allowed_suffixes = {".ts", ".tsx", ".css", ".module.css"}
    if include_tests:
        allowed_suffixes.add(".test.ts")

    for path in impl_dir.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix in allowed_suffixes or path.name.endswith(".module.css"):
            collected.add(path)
    return collected


def _resolve_relative_import(specifier: str, from_file: Path) -> list[Path]:
    if not specifier.startswith("."):
        return []
    raw = (from_file.parent / specifier).resolve()
    candidates: list[Path] = []
    if raw.suffix in {".ts", ".tsx", ".css"}:
        candidates.append(raw)
    else:
        candidates.extend(
            [
                Path(f"{raw}{suffix}")
                for suffix in (".tsx", ".ts", ".module.css", ".css")
            ]
        )
    return [path for path in candidates if path.is_file()]


def _collect_reference_deps(
    seed_files: set[Path],
    *,
    max_depth: int = 5,
) -> set[Path]:
    """Transitive Storybook sibling imports (../Button, ../Slider, …)."""
    collected: set[Path] = set()
    queue: list[tuple[Path, int]] = [(path, 0) for path in seed_files if path.is_file()]
    seen: set[Path] = set()

    while queue:
        path, depth = queue.pop(0)
        if path in seen or not path.is_file():
            continue
        seen.add(path)

        try:
            path.relative_to(COMPONENTS_ROOT)
        except ValueError:
            continue

        collected.add(path)
        if depth >= max_depth or path.suffix not in {".ts", ".tsx"}:
            continue

        text = path.read_text(encoding="utf-8", errors="replace")
        for match in IMPORT_PATTERN.finditer(text):
            for resolved in _resolve_relative_import(match.group(1), path):
                if resolved not in seen:
                    queue.append((resolved, depth + 1))

    return collected


def _topology_icon_slugs() -> set[str]:
    slugs: set[str] = {
        "arrow-reset",
        "full-screen",
        "save-disk",
        "grid-square-9-16",
        "arrow-drop-tri-caret",
        "state-add-circ-solid",
        "cluster-badge",
        "info-circ",
        "minimize",
        "ctrl-minimize-16",
        "shape-plus",
        "topology-legend-connected-to",
        "topology-legend-depends-on",
    }
    contract_paths = [
        REPO_ROOT / "storybook/src/spec-contracts/topology/synapse-topology-element.contract.ts",
        REPO_ROOT / "storybook/src/spec-contracts/topology/synapse-topology.contract.ts",
    ]
    for contract_path in contract_paths:
        if not contract_path.is_file():
            continue
        text = contract_path.read_text(encoding="utf-8", errors="replace")
        for match in re.finditer(r':\s*"([a-z0-9]+(?:-[a-z0-9]+)*)"', text):
            slug = match.group(1)
            if (ICONS_ROOT / f"{slug}.svg").is_file():
                slugs.add(slug)

    topology_dir = COMPONENTS_ROOT / "topology"
    if topology_dir.is_dir():
        for path in topology_dir.rglob("*.tsx"):
            text = path.read_text(encoding="utf-8", errors="replace")
            for slug in SHAPE_NAME_PATTERN.findall(text) + ICON_SLUG_PATTERN.findall(text):
                if (ICONS_ROOT / f"{slug}.svg").is_file():
                    slugs.add(slug)

    return slugs


def _collect_icon_assets(slugs: Iterable[str]) -> set[Path]:
    collected: set[Path] = set()
    for slug in slugs:
        icon_path = ICONS_ROOT / f"{slug}.svg"
        if icon_path.is_file():
            collected.add(icon_path)
    return collected


def _collect_agent_prompts(component_dirs: Iterable[Path]) -> set[Path]:
    collected: set[Path] = set()
    for directory in component_dirs:
        prompt_path = directory / "AGENT_PROMPT.md"
        if prompt_path.is_file():
            collected.add(prompt_path)
    return collected


def _filter_missing_paths(missing: list[str], files: set[Path]) -> list[str]:
    """Drop .ts paths when the matching .tsx exists (common doc typo)."""
    file_rels = {str(path.relative_to(REPO_ROOT)) for path in files}
    filtered: list[str] = []
    seen: set[str] = set()
    for rel in missing:
        if rel in seen:
            continue
        if rel.endswith(".ts") and rel[:-2] + "tsx" in file_rels:
            continue
        if rel.endswith(".stories.ts") and rel[:-2] + "tsx" in file_rels:
            continue
        seen.add(rel)
        filtered.append(rel)
    return filtered


def _should_include_extracted_path(rel: str, programme: str) -> bool:
    rel = rel.strip().lstrip("./")
    if rel in PATH_EXTRACT_BLOCKLIST:
        return False
    if rel.endswith("/root-spec.md") or rel.endswith("root-spec.md"):
        return False
    if rel == "components/dap-theme.css" and programme != "dap":
        return False
    if rel.startswith("data/") and rel.endswith(".json"):
        return False
    if rel.startswith("storybook/src/components/") and not rel.endswith(
        (".ts", ".tsx", ".css", ".module.css", ".test.ts")
    ):
        return False
    return True


def _resolve_repo_paths(
    relative_paths: Iterable[str],
    result: PackageResult,
    *,
    programme: str,
) -> None:
    for rel in relative_paths:
        rel = rel.strip().lstrip("./")
        if not rel or not _should_include_extracted_path(rel, programme):
            continue
        absolute = (REPO_ROOT / rel).resolve()
        try:
            absolute.relative_to(REPO_ROOT.resolve())
        except ValueError:
            result.warnings.append(f"Skipped path outside repo: {rel}")
            continue
        if absolute.is_file():
            result.files.add(absolute)
        else:
            result.missing.append(rel)


def _add_path(path: Path, result: PackageResult) -> None:
    if path.is_file():
        result.files.add(path.resolve())
    else:
        result.missing.append(str(path.relative_to(REPO_ROOT)))


def build_package(
    programme: str,
    component_queries: list[str],
    *,
    include_reference: bool = True,
    include_reference_deps: bool = False,
    include_icons: bool = False,
    include_tests: bool = True,
    include_agent_contract: bool = True,
) -> PackageResult:
    cfg = load_design_system(programme)
    components_dir = cfg.resolve(cfg.components_dir)

    figma_map_path = cfg.resolve(cfg.figma_map_path)
    figma_map: list[dict[str, Any]] = []
    if figma_map_path.is_file():
        loaded = _load_json(figma_map_path)
        if isinstance(loaded, list):
            figma_map = loaded

    aliases = _load_aliases(programme)
    result = PackageResult(programme=programme, components=[])

    # Themes
    for theme_rel in (cfg.theme_css_path, cfg.program_theme_css_path, cfg.baseline_theme_css_path):
        if theme_rel:
            _add_path(cfg.resolve(theme_rel), result)

    if include_agent_contract:
        agent_contract = REPO_ROOT / "data" / "agent-generation-contract.md"
        _add_path(agent_contract, result)

    parsed_texts: list[str] = []
    map_entries_for_zip: list[dict[str, Any]] = []

    for query in component_queries:
        resolution = _resolve_component(query, programme, components_dir, figma_map, aliases)
        result.components.append(resolution)
        if resolution.map_entry:
            map_entries_for_zip.append(resolution.map_entry)

        # Component markdown tree
        for md_path in _collect_markdown_tree(resolution.component_dir):
            result.files.add(md_path.resolve())
            parsed_texts.append(md_path.read_text(encoding="utf-8"))

        # Map-declared paths
        if resolution.map_entry:
            for rel in _paths_from_map_entry(resolution.map_entry):
                _resolve_repo_paths([rel], result, programme=programme)

        # ids-fork baseline
        if resolution.map_entry:
            baseline = resolution.map_entry.get("idsBaselineSpecPath")
            if isinstance(baseline, str):
                _resolve_repo_paths([baseline], result, programme=programme)

        # Contracts + reference implementation
        for contract_path in _collect_contracts(resolution.slug, programme):
            result.files.add(contract_path.resolve())

        if include_reference:
            for impl_path in _collect_reference_impl(resolution.slug, include_tests):
                result.files.add(impl_path.resolve())

    for prompt_path in _collect_agent_prompts(c.component_dir for c in result.components):
        result.files.add(prompt_path.resolve())

    if include_reference and include_reference_deps:
        seeds = {path for path in result.files if str(path).startswith(str(COMPONENTS_ROOT))}
        for dep_path in _collect_reference_deps(seeds):
            result.files.add(dep_path.resolve())

    if include_icons:
        icon_slugs = _topology_icon_slugs()
        for icon_path in _collect_icon_assets(icon_slugs):
            result.files.add(icon_path.resolve())

    # Parse collected markdown for cross-references (embedded specs, contracts, assets)
    for text in parsed_texts:
        _resolve_repo_paths(_extract_paths_from_text(text), result, programme=programme)

    # One transitive pass for newly discovered design specs only
    for path in list(result.files):
        if path.suffix.lower() not in {".md", ".mdx"}:
            continue
        if "design-spec.md" not in path.name:
            continue
        _resolve_repo_paths(
            _extract_paths_from_text(path.read_text(encoding="utf-8")),
            result,
            programme=programme,
        )

    result.missing = _filter_missing_paths(result.missing, result.files)
    result._map_entries = map_entries_for_zip  # type: ignore[attr-defined]
    result._package_flags = {  # type: ignore[attr-defined]
        "includeReference": include_reference,
        "includeReferenceDeps": include_reference_deps,
        "includeIcons": include_icons,
        "includeTests": include_tests,
    }
    return result


def write_zip(
    result: PackageResult,
    output_dir: Path,
    output_name: str,
) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    zip_path = output_dir / f"{output_name}.zip"

    manifest = {
        "programme": result.programme,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "packageFlags": getattr(result, "_package_flags", {}),
        "agentPrompt": "components/synapse/topology/AGENT_PROMPT.md"
        if any(
            (c.component_dir / "AGENT_PROMPT.md").is_file() for c in result.components
        )
        else None,
        "components": [
            {
                "query": c.query,
                "slug": c.slug,
                "designSpecPath": str(c.design_spec_path.relative_to(REPO_ROOT)),
                "figmaComponent": (c.map_entry or {}).get("component"),
            }
            for c in result.components
        ],
        "fileCount": 0,
        "files": [],
        "missing": result.missing,
        "warnings": result.warnings,
    }

    map_entries: list[dict[str, Any]] = getattr(result, "_map_entries", [])

    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for abs_path in sorted(result.files):
            rel = abs_path.relative_to(REPO_ROOT)
            archive.write(abs_path, rel.as_posix())
            manifest["files"].append(rel.as_posix())

        if map_entries:
            map_payload = json.dumps(map_entries, indent=2)
            map_name = f"data/{result.programme}-handoff-figma-map.json"
            archive.writestr(map_name, map_payload)
            manifest["files"].append(map_name)

        manifest["fileCount"] = len(manifest["files"])
        archive.writestr("HANDOFF_MANIFEST.json", json.dumps(manifest, indent=2))

    return zip_path


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Package component design-spec handoff files into a zip archive.",
    )
    parser.add_argument(
        "-p",
        "--programme",
        required=True,
        help="Design system / programme id (e.g. synapse, ids, dap).",
    )
    parser.add_argument(
        "-c",
        "--components",
        required=True,
        help="Comma-separated component names or slugs (e.g. Topology,button).",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        required=True,
        type=Path,
        help="Directory where the zip file will be written.",
    )
    parser.add_argument(
        "-n",
        "--output-name",
        required=True,
        help="Output zip base name without extension (e.g. topology-handoff-v1).",
    )
    parser.add_argument(
        "--include-reference-deps",
        action="store_true",
        help="Include Storybook shared components imported by reference impl (Button, Search, Slider, Icon, …).",
    )
    parser.add_argument(
        "--include-icons",
        action="store_true",
        help="Include assets/icons/*.svg slugs used by topology reference + contracts.",
    )
    parser.add_argument(
        "--skip-reference",
        action="store_true",
        help="Omit Storybook reference implementation sources.",
    )
    parser.add_argument(
        "--skip-tests",
        action="store_true",
        help="Omit *.test.ts files from reference implementation.",
    )
    parser.add_argument(
        "--skip-agent-contract",
        action="store_true",
        help="Omit data/agent-generation-contract.md from the bundle.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print resolved file list without creating the zip.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    component_queries = [part.strip() for part in args.components.split(",") if part.strip()]
    if not component_queries:
        print("Error: --components must list at least one component.", file=sys.stderr)
        return 1

    try:
        result = build_package(
            args.programme.strip().lower(),
            component_queries,
            include_reference=not args.skip_reference,
            include_reference_deps=args.include_reference_deps,
            include_icons=args.include_icons,
            include_tests=not args.skip_tests,
            include_agent_contract=not args.skip_agent_contract,
        )
    except FileNotFoundError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if args.dry_run:
        flags = getattr(result, "_package_flags", {})
        print(f"Programme: {result.programme}")
        print(f"Components: {', '.join(c.slug for c in result.components)}")
        if flags:
            print(f"Flags: {flags}")
        print(f"Files ({len(result.files)}):")
        for path in sorted(result.files):
            print(f"  {path.relative_to(REPO_ROOT)}")
        if result.missing:
            print(f"Missing ({len(result.missing)}):")
            for item in result.missing:
                print(f"  {item}")
        if result.warnings:
            print("Warnings:")
            for item in result.warnings:
                print(f"  {item}")
        return 0

    zip_path = write_zip(result, args.output_dir.resolve(), args.output_name)
    print(f"Created {zip_path}")
    print(f"  programme:   {result.programme}")
    print(f"  components:  {', '.join(c.slug for c in result.components)}")
    print(f"  files:       {len(result.files)} (+ manifest + figma map)")
    if result.missing:
        print(f"  missing:     {len(result.missing)} (see HANDOFF_MANIFEST.json)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
