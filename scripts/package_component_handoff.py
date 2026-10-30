#!/usr/bin/env python3
"""
Package design-spec handoff bundles into a zip archive.

Resolves components for a programme (design system), collects specs, contracts,
theme CSS, Storybook Spec Accurate Design examples, optional Storybook reference
sources, nested composition dependencies, and writes a manifest.

Usage:
  python3 scripts/package_component_handoff.py \\
    --programme synapse \\
    --components Topology \\
    --output-dir ./dist \\
    --output-name topology-handoff-v1

  python3 scripts/package_component_handoff.py \\
    -p synapse -c Topology -o ./dist -n topology-handoff-v1

  # Blueprint-only (specs + contracts, no Storybook reference):
  python3 scripts/package_component_handoff.py \\
    -p synapse -c Button -o ./dist -n button-handoff-v1 --skip-reference

Reference implementation deps (Button, Icon, Slider, …) are included by default when
reference sources are bundled. Use --skip-reference-deps for the component folder only.
"""

from __future__ import annotations

import argparse
import io
import json
import re
import sys
import zipfile
from contextlib import contextmanager
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Iterator

# Repo root on PYTHONPATH when invoked from project root
from config.design_system_config import load_design_system

_DEFAULT_REPO_ROOT = Path(__file__).resolve().parent.parent
_root_override: Path | None = None

# Paths referenced inside markdown / specs / README tables
PATH_PATTERN = re.compile(
    r"(?<![\w./-])((?:components|storybook-generated|storybook|assets|data)/"
    r"[\w./\-]+\.(?:md|css|ts|tsx|json|svg))"
)

SPEC_REL_PATTERN = re.compile(
    r"^components/([^/]+)/(.+)/design-spec\.md$",
    re.IGNORECASE,
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


def _repo_root() -> Path:
    return (_root_override or _DEFAULT_REPO_ROOT).resolve()


def _components_root() -> Path:
    return _repo_root() / "storybook" / "src" / "components"


def _icons_root() -> Path:
    return _repo_root() / "assets" / "icons"


@contextmanager
def override_repo_root(path: Path | None) -> Iterator[None]:
    """Temporarily resolve all package paths against ``path`` (e.g. collab REPO_ROOT)."""
    global _root_override
    previous = _root_override
    _root_override = path.resolve() if path is not None else None
    try:
        yield
    finally:
        _root_override = previous


# Back-compat aliases used by older callers / tests
REPO_ROOT = _DEFAULT_REPO_ROOT
COMPONENTS_ROOT = _DEFAULT_REPO_ROOT / "storybook" / "src" / "components"
ICONS_ROOT = _DEFAULT_REPO_ROOT / "assets" / "icons"


@dataclass
class ComponentResolution:
    query: str
    slug: str
    map_entry: dict[str, Any] | None
    design_spec_path: Path
    component_dir: Path
    programme: str = ""
    nested: bool = False
    role: str = "primary"  # primary | baseline | nested


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
    alias_path = _repo_root() / "data" / f"{programme}-component-aliases.json"
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


def _load_figma_map(programme: str) -> list[dict[str, Any]]:
    try:
        cfg = load_design_system(programme)
        figma_map_path = _repo_root() / cfg.figma_map_path
    except Exception:  # noqa: BLE001
        figma_map_path = _repo_root() / "data" / f"{programme}-component-figma-map.json"
        if programme.lower() == "ids":
            figma_map_path = _repo_root() / "data" / "component-figma-map.json"
        elif programme.lower() == "dap":
            figma_map_path = _repo_root() / "data" / "component-figma-map.json"

    if not figma_map_path.is_file():
        return []
    loaded = _load_json(figma_map_path)
    return loaded if isinstance(loaded, list) else []


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
        design_spec = _repo_root() / str(entry["designSpecPath"])
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
        programme=programme.lower(),
        nested=False,
    )


def _resolution_from_spec_path(
    design_spec: Path,
    programme_folder: str,
    *,
    role: str = "nested",
) -> ComponentResolution:
    slug = design_spec.parent.name
    figma_map = _load_figma_map(programme_folder)
    aliases = _load_aliases(programme_folder)
    entry = _find_map_entry(slug, figma_map, aliases)
    return ComponentResolution(
        query=slug,
        slug=slug,
        map_entry=entry,
        design_spec_path=design_spec,
        component_dir=design_spec.parent,
        programme=programme_folder.lower(),
        nested=role != "primary",
        role=role,
    )


def _baseline_spec_rels_from_entry(entry: dict[str, Any] | None) -> list[str]:
    """Inheritance source specs (ids-fork / programme delta → baseline component)."""
    if not entry:
        return []
    found: list[str] = []
    seen: set[str] = set()
    for key, value in entry.items():
        if not isinstance(value, str):
            continue
        if not value.endswith("design-spec.md"):
            continue
        key_l = key.lower()
        if key in ("idsBaselineSpecPath", "baselineSpecPath") or (
            "baselinespecpath" in key_l.replace("_", "")
        ):
            rel = value.strip().lstrip("./")
            if rel and rel not in seen:
                seen.add(rel)
                found.append(rel)
    return found


def _component_folder_candidates(programme: str) -> list[str]:
    prog = programme.lower()
    if prog == "dap":
        return ["DAP", "dap"]
    return [prog]


def _ensure_programme_foundation(programme_folder: str, result: PackageResult) -> None:
    """Always include root-spec + theme CSS for a programme represented in the bundle."""
    root = _repo_root()
    prog = programme_folder.lower()

    for folder in _component_folder_candidates(prog):
        _add_path_if_exists(root / "components" / folder / "root-spec.md", result)

    theme_fallbacks = {
        "ids": ["components/ids-theme.css", "components/theme.css"],
        "synapse": ["components/synapse-theme.css"],
        "dap": ["components/dap-theme.css"],
    }
    for theme_rel in theme_fallbacks.get(prog, [f"components/{prog}-theme.css"]):
        _add_path_if_exists(root / theme_rel, result)

    try:
        cfg = load_design_system(prog)
    except Exception:  # noqa: BLE001
        return
    for rel in (
        cfg.theme_css_path,
        cfg.program_theme_css_path,
        cfg.root_spec_path,
        cfg.program_root_spec_path,
        cfg.baseline_theme_css_path,
        cfg.baseline_root_spec_path,
    ):
        if not rel:
            continue
        path = root / rel
        if path.is_file():
            result.files.add(path.resolve())
        elif rel.endswith("theme.css") and "ids" in rel.replace("ids-theme", ""):
            # Legacy yaml may say components/theme.css — prefer ids-theme.css
            _add_path_if_exists(root / "components" / "ids-theme.css", result)


def _extract_paths_from_text(text: str) -> set[str]:
    return set(PATH_PATTERN.findall(text))


def _parse_spec_rel(rel: str) -> tuple[str, str] | None:
    """Return (programme_folder_lower, slug) for a components/.../design-spec.md path."""
    match = SPEC_REL_PATTERN.match(rel.replace("\\", "/").lstrip("./"))
    if not match:
        return None
    folder = match.group(1).lower()
    if folder.endswith(".css"):
        return None
    rest = match.group(2)
    slug = rest.split("/")[-1]
    return folder, slug


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
    contracts_root = _repo_root() / "storybook" / "src" / "spec-contracts"
    prog = programme.lower()

    component_contract_dir = contracts_root / slug
    if component_contract_dir.is_dir():
        for path in component_contract_dir.rglob("*"):
            if path.is_file():
                collected.add(path)

    for path in contracts_root.glob(f"{prog}-{slug}*.ts"):
        if path.is_file():
            collected.add(path)

    for path in contracts_root.glob(f"{prog}-{slug}*.contract.ts"):
        if path.is_file():
            collected.add(path)

    return collected


def _pascal_case_slug(slug: str) -> str:
    return "".join(part.capitalize() for part in slug.split("-") if part)


def _storybook_programme_dirs(programme: str) -> list[str]:
    prog = programme.lower()
    dirs = [prog]
    if prog == "dap":
        dirs.append("DAP")
    return list(dict.fromkeys(dirs))


def _collect_storybook_generated(programme: str, slug: str) -> set[Path]:
    """Spec Accurate Design stories under storybook-generated/."""
    collected: set[Path] = set()
    pascal = _pascal_case_slug(slug)
    root = _repo_root()

    for prog in _storybook_programme_dirs(programme):
        base = root / "storybook-generated" / prog / "src"
        story = base / "components" / f"{pascal}.stories.tsx"
        if story.is_file():
            collected.add(story)
        # Related generated artifacts for this component stem
        components_dir = base / "components"
        if components_dir.is_dir():
            for path in components_dir.glob(f"{pascal}*"):
                if path.is_file():
                    collected.add(path)
        hash_path = base / "spec-contracts" / f"{slug}.spec-layer-hash.json"
        if hash_path.is_file():
            collected.add(hash_path)
        # Nested folder stories (e.g. topology children)
        nested_stories = base / "components" / slug
        if nested_stories.is_dir():
            for path in nested_stories.rglob("*"):
                if path.is_file() and path.suffix in {".ts", ".tsx", ".css", ".json"}:
                    collected.add(path)

    return collected


def _impl_name_candidates(slug: str, map_entry: dict[str, Any] | None) -> list[str]:
    candidates: list[str] = []
    if map_entry:
        raw = str(map_entry.get("component", "")).strip()
        if raw:
            for token in re.split(r"[/\s]+", raw):
                token = token.strip()
                if token:
                    candidates.append(token.replace(" ", ""))
            compact = re.sub(r"[^a-zA-Z0-9]", "", raw)
            if compact:
                candidates.append(compact)
    pascal = _pascal_case_slug(slug)
    candidates.extend([pascal, f"Synapse{pascal}", f"Ids{pascal}"])

    seen: set[str] = set()
    ordered: list[str] = []
    for name in candidates:
        if name and name not in seen:
            seen.add(name)
            ordered.append(name)
    return ordered


def _collect_reference_impl(
    slug: str,
    map_entry: dict[str, Any] | None,
    include_tests: bool,
) -> set[Path]:
    collected: set[Path] = set()
    components_root = _components_root()
    allowed_suffixes = {".ts", ".tsx", ".css", ".module.css"}
    if include_tests:
        allowed_suffixes.add(".test.ts")

    def add_stem_files(stem: str) -> None:
        for suffix in (".tsx", ".ts", ".module.css", ".css"):
            path = components_root / f"{stem}{suffix}"
            if path.is_file() and (path.suffix in allowed_suffixes or path.name.endswith(".module.css")):
                collected.add(path)
        stories = components_root / f"{stem}.stories.tsx"
        if include_tests and stories.is_file():
            collected.add(stories)

    impl_dir = components_root / slug
    if impl_dir.is_dir():
        for path in impl_dir.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix in allowed_suffixes or path.name.endswith(".module.css"):
                collected.add(path)

    for name in _impl_name_candidates(slug, map_entry):
        add_stem_files(name)

    add_stem_files(f"{slug}-icons")

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
    components_root = _components_root()
    queue: list[tuple[Path, int]] = [(path, 0) for path in seed_files if path.is_file()]
    seen: set[Path] = set()

    while queue:
        path, depth = queue.pop(0)
        if path in seen or not path.is_file():
            continue
        seen.add(path)

        try:
            path.relative_to(components_root)
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


def _collect_icon_slugs_from_paths(paths: Iterable[Path]) -> set[str]:
    """Discover icon slugs from any packaged .ts/.tsx sources (component-agnostic)."""
    slugs: set[str] = set()
    icons_root = _icons_root()
    contract_string_pattern = re.compile(r':\s*"([a-z0-9]+(?:-[a-z0-9]+)*)"')

    for path in paths:
        if not path.is_file() or path.suffix not in {".ts", ".tsx"}:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        candidates = (
            SHAPE_NAME_PATTERN.findall(text)
            + ICON_SLUG_PATTERN.findall(text)
            + contract_string_pattern.findall(text)
        )
        for slug in candidates:
            if (icons_root / f"{slug}.svg").is_file():
                slugs.add(slug)
    return slugs


def _collect_icon_assets(slugs: Iterable[str]) -> set[Path]:
    collected: set[Path] = set()
    icons_root = _icons_root()
    for slug in slugs:
        icon_path = icons_root / f"{slug}.svg"
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
    root = _repo_root()
    file_rels = {str(path.relative_to(root)) for path in files}
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
    root = _repo_root()
    for rel in relative_paths:
        rel = rel.strip().lstrip("./")
        if not rel or not _should_include_extracted_path(rel, programme):
            continue
        absolute = (root / rel).resolve()
        try:
            absolute.relative_to(root)
        except ValueError:
            result.warnings.append(f"Skipped path outside repo: {rel}")
            continue
        if absolute.is_file():
            result.files.add(absolute)
        else:
            result.missing.append(rel)


def _add_path(path: Path, result: PackageResult) -> None:
    root = _repo_root()
    if path.is_file():
        result.files.add(path.resolve())
    else:
        try:
            result.missing.append(str(path.relative_to(root)))
        except ValueError:
            result.missing.append(str(path))


def _add_path_if_exists(path: Path, result: PackageResult) -> None:
    if path.is_file():
        result.files.add(path.resolve())


def _collect_supporting_files(
    resolution: ComponentResolution,
    *,
    include_reference: bool,
    include_tests: bool,
) -> set[Path]:
    """Contracts + Spec Accurate Design + optional reference impl for one component."""
    collected: set[Path] = set()
    prog = resolution.programme or "ids"
    collected |= _collect_contracts(resolution.slug, prog)
    collected |= _collect_storybook_generated(prog, resolution.slug)
    if include_reference:
        collected |= _collect_reference_impl(
            resolution.slug, resolution.map_entry, include_tests
        )
    return collected


def _append_component_unique(
    result: PackageResult,
    resolution: ComponentResolution,
) -> None:
    key = ((resolution.programme or "").lower(), resolution.slug)
    for existing in result.components:
        if ((existing.programme or "").lower(), existing.slug) == key:
            # Prefer baseline/primary role over nested when upgrading
            if existing.role == "nested" and resolution.role in {"baseline", "primary"}:
                existing.role = resolution.role
                existing.nested = resolution.role != "primary"
            return
    result.components.append(resolution)


def _ingest_resolution(
    resolution: ComponentResolution,
    result: PackageResult,
    *,
    programme: str,
    include_reference: bool,
    include_tests: bool,
    parsed_texts: list[str],
    map_entries_for_zip: list[dict[str, Any]],
    supported_spec_paths: set[Path],
    ingest_baselines: bool = True,
) -> None:
    """Add markdown tree, map paths, supporting files, and inherited baselines."""
    if resolution.map_entry and resolution.map_entry not in map_entries_for_zip:
        map_entries_for_zip.append(resolution.map_entry)

    if resolution.programme:
        _ensure_programme_foundation(resolution.programme, result)

    for md_path in _collect_markdown_tree(resolution.component_dir):
        result.files.add(md_path.resolve())
        parsed_texts.append(md_path.read_text(encoding="utf-8"))

    if resolution.map_entry:
        for rel in _paths_from_map_entry(resolution.map_entry):
            _resolve_repo_paths([rel], result, programme=programme)

    for support_path in _collect_supporting_files(
        resolution,
        include_reference=include_reference,
        include_tests=include_tests,
    ):
        result.files.add(support_path.resolve())

    supported_spec_paths.add(resolution.design_spec_path.resolve())

    if not ingest_baselines:
        return

    baseline_rels = _baseline_spec_rels_from_entry(resolution.map_entry)
    # ids-fork without explicit path: try same slug under components/ids/
    if (
        not baseline_rels
        and resolution.map_entry
        and str(resolution.map_entry.get("specPattern") or "").lower() == "ids-fork"
        and (resolution.programme or programme).lower() != "ids"
    ):
        candidate = f"components/ids/{resolution.slug}/design-spec.md"
        if (_repo_root() / candidate).is_file():
            baseline_rels = [candidate]

    root = _repo_root()
    for baseline_rel in baseline_rels:
        abs_path = (root / baseline_rel.strip().lstrip("./")).resolve()
        if not abs_path.is_file():
            result.missing.append(baseline_rel)
            continue
        if abs_path in supported_spec_paths:
            # Still ensure foundation if we already have the file as a bare path
            parsed = _parse_spec_rel(baseline_rel.strip().lstrip("./"))
            if parsed:
                _ensure_programme_foundation(parsed[0], result)
            continue
        try:
            rel = abs_path.relative_to(root).as_posix()
        except ValueError:
            continue
        parsed = _parse_spec_rel(rel)
        if not parsed:
            result.files.add(abs_path)
            continue
        prog_folder, _slug = parsed
        baseline_res = _resolution_from_spec_path(abs_path, prog_folder, role="baseline")
        _append_component_unique(result, baseline_res)
        _ingest_resolution(
            baseline_res,
            result,
            programme=programme,
            include_reference=include_reference,
            include_tests=include_tests,
            parsed_texts=parsed_texts,
            map_entries_for_zip=map_entries_for_zip,
            supported_spec_paths=supported_spec_paths,
            ingest_baselines=False,
        )


def _expand_nested_from_files(
    result: PackageResult,
    *,
    programme: str,
    include_reference: bool,
    include_tests: bool,
    parsed_texts: list[str],
    map_entries_for_zip: list[dict[str, Any]],
    supported_spec_paths: set[Path],
    max_depth: int = 5,
) -> None:
    """BFS: fully package supporting files for every discovered design-spec.md."""
    root = _repo_root()

    depth = 0
    while depth < max_depth:
        discovered: list[tuple[str, Path]] = []
        for path in list(result.files):
            if path.suffix.lower() not in {".md", ".mdx"}:
                continue
            if path.name != "design-spec.md":
                continue
            resolved = path.resolve()
            if resolved in supported_spec_paths:
                continue
            try:
                rel = resolved.relative_to(root).as_posix()
            except ValueError:
                continue
            parsed = _parse_spec_rel(rel)
            if not parsed:
                continue
            prog_folder, _slug = parsed
            discovered.append((prog_folder, resolved))

        if not discovered:
            break

        texts_before = len(parsed_texts)
        for prog_folder, spec_path in discovered:
            if spec_path in supported_spec_paths:
                continue
            # Inherited source from another programme → baseline; else nested composition
            role = "baseline" if prog_folder.lower() != programme.lower() else "nested"
            resolution = _resolution_from_spec_path(spec_path, prog_folder, role=role)
            _append_component_unique(result, resolution)
            _ingest_resolution(
                resolution,
                result,
                programme=programme,
                include_reference=include_reference,
                include_tests=include_tests,
                parsed_texts=parsed_texts,
                map_entries_for_zip=map_entries_for_zip,
                supported_spec_paths=supported_spec_paths,
                ingest_baselines=True,
            )

        for text in parsed_texts[texts_before:]:
            _resolve_repo_paths(_extract_paths_from_text(text), result, programme=programme)

        depth += 1


def build_package(
    programme: str,
    component_queries: list[str],
    *,
    include_reference: bool = True,
    include_reference_deps: bool = True,
    include_icons: bool = False,
    include_tests: bool = True,
    include_agent_contract: bool = True,
    repo_root: Path | None = None,
    expand_nested: bool = True,
) -> PackageResult:
    with override_repo_root(repo_root):
        return _build_package_inner(
            programme,
            component_queries,
            include_reference=include_reference,
            include_reference_deps=include_reference_deps,
            include_icons=include_icons,
            include_tests=include_tests,
            include_agent_contract=include_agent_contract,
            expand_nested=expand_nested,
        )


def _build_package_inner(
    programme: str,
    component_queries: list[str],
    *,
    include_reference: bool,
    include_reference_deps: bool,
    include_icons: bool,
    include_tests: bool,
    include_agent_contract: bool,
    expand_nested: bool,
) -> PackageResult:
    programme = programme.strip().lower()
    cfg = load_design_system(programme)
    root = _repo_root()
    components_dir = root / cfg.components_dir

    figma_map = _load_figma_map(programme)
    aliases = _load_aliases(programme)
    result = PackageResult(programme=programme, components=[])

    # Programme + baseline foundations (themes / root-specs) — optional files only
    _ensure_programme_foundation(programme, result)
    if programme != "ids":
        _ensure_programme_foundation("ids", result)

    # Also honour yaml theme/root paths (including baseline_*) without hard-failing missing legacy paths
    for theme_rel in (cfg.theme_css_path, cfg.program_theme_css_path, cfg.baseline_theme_css_path):
        if theme_rel:
            path = root / theme_rel
            if path.is_file():
                result.files.add(path.resolve())
            elif Path(theme_rel).name == "theme.css":
                _add_path_if_exists(root / "components" / "ids-theme.css", result)

    for root_rel in (cfg.root_spec_path, cfg.program_root_spec_path, cfg.baseline_root_spec_path):
        if root_rel:
            _add_path_if_exists(root / root_rel, result)

    if include_agent_contract:
        agent_contract = root / "data" / "agent-generation-contract.md"
        _add_path(agent_contract, result)

    parsed_texts: list[str] = []
    map_entries_for_zip: list[dict[str, Any]] = []
    supported_spec_paths: set[Path] = set()

    for query in component_queries:
        resolution = _resolve_component(query, programme, components_dir, figma_map, aliases)
        resolution.programme = programme
        resolution.role = "primary"
        resolution.nested = False
        _append_component_unique(result, resolution)
        _ingest_resolution(
            resolution,
            result,
            programme=programme,
            include_reference=include_reference,
            include_tests=include_tests,
            parsed_texts=parsed_texts,
            map_entries_for_zip=map_entries_for_zip,
            supported_spec_paths=supported_spec_paths,
            ingest_baselines=True,
        )

    for prompt_path in _collect_agent_prompts(c.component_dir for c in result.components):
        result.files.add(prompt_path.resolve())

    # Parse collected markdown for cross-references
    for text in parsed_texts:
        _resolve_repo_paths(_extract_paths_from_text(text), result, programme=programme)

    # One transitive pass for newly discovered design-spec path refs
    for path in list(result.files):
        if path.suffix.lower() not in {".md", ".mdx"}:
            continue
        if path.name != "design-spec.md":
            continue
        _resolve_repo_paths(
            _extract_paths_from_text(path.read_text(encoding="utf-8")),
            result,
            programme=programme,
        )

    if expand_nested:
        _expand_nested_from_files(
            result,
            programme=programme,
            include_reference=include_reference,
            include_tests=include_tests,
            parsed_texts=parsed_texts,
            map_entries_for_zip=map_entries_for_zip,
            supported_spec_paths=supported_spec_paths,
        )

    if include_reference and include_reference_deps:
        components_root = _components_root()
        seeds = {
            path
            for path in result.files
            if path.is_file()
            and str(path).startswith(str(components_root))
        }
        for dep_path in _collect_reference_deps(seeds):
            result.files.add(dep_path.resolve())

    if include_icons:
        icon_slugs = _collect_icon_slugs_from_paths(result.files)
        for icon_path in _collect_icon_assets(icon_slugs):
            result.files.add(icon_path.resolve())

    # Foundations for every programme that ended up in the package
    programmes_seen = {(c.programme or programme).lower() for c in result.components}
    programmes_seen.add(programme)
    for prog in programmes_seen:
        _ensure_programme_foundation(prog, result)

    result.missing = _filter_missing_paths(result.missing, result.files)
    # Drop resolved legacy theme.css missing if ids-theme.css is present
    root_files = {str(p.relative_to(root)) for p in result.files}
    if "components/ids-theme.css" in root_files:
        result.missing = [m for m in result.missing if m != "components/theme.css"]

    result._map_entries = map_entries_for_zip  # type: ignore[attr-defined]
    result._package_flags = {  # type: ignore[attr-defined]
        "includeReference": include_reference,
        "includeReferenceDeps": include_reference_deps,
        "includeIcons": include_icons,
        "includeTests": include_tests,
        "expandNested": expand_nested,
        "includeStorybookGenerated": True,
        "includeInheritanceBaselines": True,
    }
    result._baseline_slugs = [  # type: ignore[attr-defined]
        c.slug for c in result.components if c.role == "baseline"
    ]
    result._nested_slugs = [  # type: ignore[attr-defined]
        c.slug for c in result.components if c.role == "nested"
    ]
    return result


def _build_manifest(result: PackageResult) -> dict[str, Any]:
    root = _repo_root()
    return {
        "programme": result.programme,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "packageFlags": getattr(result, "_package_flags", {}),
        "agentPrompts": [
            str((c.component_dir / "AGENT_PROMPT.md").relative_to(root))
            for c in result.components
            if (c.component_dir / "AGENT_PROMPT.md").is_file()
        ]
        or None,
        "components": [
            {
                "query": c.query,
                "slug": c.slug,
                "programme": c.programme or result.programme,
                "role": c.role,
                "nested": c.nested,
                "designSpecPath": str(c.design_spec_path.relative_to(root)),
                "figmaComponent": (c.map_entry or {}).get("component"),
            }
            for c in result.components
        ],
        "baselineSlugs": getattr(result, "_baseline_slugs", []),
        "nestedSlugs": getattr(result, "_nested_slugs", []),
        "fileCount": 0,
        "files": [],
        "missing": result.missing,
        "warnings": result.warnings,
    }


def _write_zip_archive(result: PackageResult, archive: zipfile.ZipFile) -> dict[str, Any]:
    root = _repo_root()
    manifest = _build_manifest(result)
    map_entries: list[dict[str, Any]] = getattr(result, "_map_entries", [])

    for abs_path in sorted(result.files):
        rel = abs_path.relative_to(root)
        archive.write(abs_path, rel.as_posix())
        manifest["files"].append(rel.as_posix())

    if map_entries:
        map_payload = json.dumps(map_entries, indent=2)
        map_name = f"data/{result.programme}-handoff-figma-map.json"
        archive.writestr(map_name, map_payload)
        manifest["files"].append(map_name)

    manifest["fileCount"] = len(manifest["files"])
    archive.writestr("HANDOFF_MANIFEST.json", json.dumps(manifest, indent=2))
    return manifest


def write_zip(
    result: PackageResult,
    output_dir: Path,
    output_name: str,
    *,
    repo_root: Path | None = None,
) -> Path:
    with override_repo_root(repo_root):
        output_dir.mkdir(parents=True, exist_ok=True)
        zip_path = output_dir / f"{output_name}.zip"
        with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            _write_zip_archive(result, archive)
        return zip_path


def write_zip_bytes(
    result: PackageResult,
    *,
    repo_root: Path | None = None,
) -> bytes:
    """Build zip archive in memory (for HTTP download responses)."""
    with override_repo_root(repo_root):
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            _write_zip_archive(result, archive)
        return buffer.getvalue()


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
        "--skip-reference-deps",
        action="store_true",
        help=(
            "Omit transitive Storybook imports (Button, Icon, Slider, …). "
            "Default: include shared reference deps when reference sources are bundled."
        ),
    )
    parser.add_argument(
        "--include-icons",
        action="store_true",
        help="Include assets/icons/*.svg slugs referenced by packaged sources.",
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
        "--skip-nested",
        action="store_true",
        help="Do not expand nested composition dependency specs and their supporting files.",
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
            include_reference_deps=not args.skip_reference_deps,
            include_icons=args.include_icons,
            include_tests=not args.skip_tests,
            include_agent_contract=not args.skip_agent_contract,
            expand_nested=not args.skip_nested,
        )
    except FileNotFoundError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    root = _repo_root()
    if args.dry_run:
        flags = getattr(result, "_package_flags", {})
        print(f"Programme: {result.programme}")
        print(
            "Components: "
            + ", ".join(
                f"{c.programme or result.programme}/{c.slug}[{c.role}]"
                for c in result.components
            )
        )
        baselines = getattr(result, "_baseline_slugs", [])
        if baselines:
            print(f"Baselines: {', '.join(baselines)}")
        nested = getattr(result, "_nested_slugs", [])
        if nested:
            print(f"Nested: {', '.join(nested)}")
        if flags:
            print(f"Flags: {flags}")
        print(f"Files ({len(result.files)}):")
        for path in sorted(result.files):
            print(f"  {path.relative_to(root)}")
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
    print(f"  components:  {', '.join(f'{c.programme}/{c.slug}[{c.role}]' for c in result.components)}")
    baselines = getattr(result, "_baseline_slugs", [])
    if baselines:
        print(f"  baselines:   {', '.join(baselines)}")
    nested = getattr(result, "_nested_slugs", [])
    if nested:
        print(f"  nested:      {', '.join(nested)}")
    print(f"  files:       {len(result.files)} (+ manifest + figma map)")
    if result.missing:
        print(f"  missing:     {len(result.missing)} (see HANDOFF_MANIFEST.json)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
