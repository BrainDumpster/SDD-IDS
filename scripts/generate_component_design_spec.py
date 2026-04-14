#!/usr/bin/env python3
"""
Generate consolidated `components/ids/{slug}/design-spec.mdx` from:
  - Figma REST API (nodes + variables) using `figmaUrl` + `nodeId` from
    `data/component-figma-map.json` (file key is parsed from each URL, not from FIGMA_FILE_KEY).
  - Documentation MDX (local `components/ids/{slug}/` and/or GitHub `content/<slug>/` on branch `main` by default — see GITHUB_REF)
  - Ollama vision for each relative image, routed by MDX heading context.
    Unmatched headings become dynamic `##` sections in the spec (see `section_routes`).

Example:
  python scripts/generate_component_design_spec.py --component Accordion
  python scripts/generate_component_design_spec.py --component Accordion --docs-source both
  python scripts/generate_component_design_spec.py --component Accordion --no-dynamic-headings
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import defaultdict
from collections.abc import Callable
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IDS_COMPONENTS = ROOT / "components" / "ids"
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def ids_component_dir(slug: str) -> Path:
    """Prefer ``components/ids/<slug>``; fall back to legacy flat ``components/<slug>``."""
    modern = IDS_COMPONENTS / slug
    if modern.is_dir():
        return modern
    legacy = ROOT / "components" / slug
    if legacy.is_dir():
        return legacy
    return modern


def ids_spec_out_dir(slug: str) -> Path:
    """Write consolidated specs under ``components/ids/<slug>``."""
    return IDS_COMPONENTS / slug

from config.settings import settings  # noqa: E402
from ingestion.design_spec_composer import compose_design_spec_mdx  # noqa: E402
from ingestion.figma_spec_extract import (  # noqa: E402
    extract_from_nodes_response,
    summarize_variables,
)
from ingestion.figma_sync_client import FigmaSyncClient, extract_file_key_and_node_id  # noqa: E402
from ingestion.github_loader import GithubLoader  # noqa: E402
from ingestion.github_mdx_text import (  # noqa: E402
    extract_prose_from_mdx_file,
    merge_github_doc_sections,
)
from ingestion.mdx_heading_context import extract_images_with_heading_context  # noqa: E402
from ingestion.ollama_vision import describe_design_image  # noqa: E402
from ingestion.path_resolve import resolve_relative_to_mdx  # noqa: E402
from ingestion.section_routes import route_section  # noqa: E402


def component_slug(name: str) -> str:
    s = name.lower().replace("&", " and ")
    s = re.sub(r"[/]+", "-", s)
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"[^a-z0-9-]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "component"


def load_map(path: Path) -> list:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def _map_display_path(p: Path) -> str:
    try:
        return p.resolve().relative_to(ROOT.resolve()).as_posix()
    except ValueError:
        return str(p)


def find_entry(rows: list, component: str) -> dict | None:
    for row in rows:
        if row.get("component") == component:
            return row
    return None


def _category_slug(category: str) -> str:
    """Map map.json category (e.g. Formelements) to a path segment."""
    s = category.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "general"


def _github_path_prefixes(
    component_name: str,
    slug: str,
    category: str | None = None,
) -> list[str]:
    """
    ids-content layout: `tree/main/content/<slug>/` (e.g. content/button).
    All pages live under repo folder `content/`.
    """
    c, s = component_name, slug
    # Primary: flat under content/ (matches content/button, content/accordion, …)
    paths: list[str] = [
        f"content/{s}",
        f"content/{c}",
    ]
    if category:
        cat = _category_slug(category)
        paths.extend(
            [
                f"content/{cat}/{c}",
                f"content/{cat}/{s}",
                f"content/components/{cat}/{c}",
                f"content/components/{cat}/{s}",
            ]
        )
    paths.extend(
        [
            f"content/components/{c}",
            f"content/components/{s}",
            f"content/pages/{c}",
            f"content/pages/{s}",
            f"content/pages/components/{c}",
            f"content/pages/components/{s}",
            f"content/docs/{c}",
            f"content/docs/{s}",
            f"components/ids/{c}",
            f"components/ids/{s}",
            f"components/{c}",
            f"components/{s}",
        ]
    )
    return paths


def _mdx_files_under_content_for_component(
    loader: GithubLoader,
    slug: str,
    component_name: str,
) -> list[dict]:
    """
    List all MDX under `content/` and keep files whose path is under
    `content/<slug>/` or `content/<component-segment>/`.
    Used when no direct prefix returned files.
    """
    all_mdx = loader.list_mdx_under_prefix("content")
    if not all_mdx:
        return []
    slug_l = slug.lower()
    name_seg = component_name.lower().replace(" ", "-").replace("/", "-")
    out: list[dict] = []
    for f in all_mdx:
        path = (f.get("path") or "").replace("\\", "/")
        parts = [p for p in path.split("/") if p]
        if len(parts) < 2 or parts[0].lower() != "content":
            continue
        seg = parts[1].lower()
        if seg == slug_l or seg == name_seg:
            out.append(f)
    return out


def _merged_github_prefixes(
    component_name: str,
    slug: str,
    extras: list[str],
    category: str | None = None,
) -> list[str]:
    """User/env paths first, then defaults. De-duplicated."""
    seen: set[str] = set()
    out: list[str] = []
    for p in [*extras, *_github_path_prefixes(component_name, slug, category)]:
        p = (p or "").strip().strip("/")
        if p and p not in seen:
            seen.add(p)
            out.append(p)
    return out


def _github_asset_candidates(mdx_repo_path: str, resolved_repo_rel: str) -> list[str]:
    """
    Build candidate repo paths for image assets referenced from MDX in ids-content.

    Rules:
    - Try MDX-relative resolved path first.
    - Component pages: content/<component>/assets/images/components/... -> content/assets/images/components/...
    - Other pages: content/<page>/assets/images/... -> content/assets/images/...
    """
    cand: list[str] = []

    def add(p: str) -> None:
        p = (p or "").strip().strip("/")
        if p and p not in cand:
            cand.append(p)

    add(resolved_repo_rel)

    parts = [p for p in resolved_repo_rel.strip("/").split("/") if p]
    # Expected resolved path shape for relative assets from content/<x>/*.mdx:
    # content/<x>/assets/images/...
    if len(parts) >= 4 and parts[0] == "content" and parts[2] == "assets":
        # content/<x>/assets/images/...
        if len(parts) >= 6 and parts[3] == "images" and parts[4] == "components":
            add("/".join(["content", "assets", "images", "components", *parts[5:]]))
        elif parts[3] == "images":
            add("/".join(["content", "assets", "images", *parts[4:]]))

    return cand


def _remap_github_asset_to_content_assets_images(resolved_repo_rel: str) -> str:
    """
    Make asset paths deterministic for output:
    - content/<page>/assets/images/<rest> -> content/assets/images/<rest>
    This keeps design-spec references aligned with where the files actually live.
    """
    p = (resolved_repo_rel or "").strip().strip("/")
    marker = "/assets/images/"
    if marker not in p:
        return p
    if p.startswith("content/assets/images/"):
        return p
    # Split at first occurrence.
    before, after = p.split(marker, 1)
    if not after:
        return p
    return "content/assets/images/" + after


def _append_vision_from_mdx(
    vision_by_section: defaultdict[str, list[str]],
    mdx_text: str,
    rel_mdx_path: str,
    *,
    use_vision: bool,
    vision_model: str | None,
    ollama_host: str | None,
    component_name: str,
    dynamic_heading_fallback: bool,
    image_fetch: Callable[[str], bytes | None],
    source_tag: str,
) -> None:
    images = extract_images_with_heading_context(mdx_text, rel_mdx_path)
    for img in images:
        resolved = resolve_relative_to_mdx(rel_mdx_path, img.path)
        if not resolved:
            continue
        resolved_display = (
            _remap_github_asset_to_content_assets_images(resolved)
            if source_tag == "github"
            else resolved
        )
        raw = image_fetch(resolved)
        if raw is None:
            print(
                f"⚠️ [{source_tag}] Missing image: {resolved_display} (from {img.path})"
            )
            continue
        target = route_section(
            img.section_titles,
            dynamic_heading_fallback=dynamic_heading_fallback,
        )
        ctx = " > ".join(img.section_titles) if img.section_titles else "(root)"

        if not use_vision:
            vision_by_section[target].append(
                f"- *(Vision skipped)* `{resolved_display}` under *{ctx}* [{source_tag}]"
            )
            continue

        try:
            out = describe_design_image(
                raw,
                section_context=ctx,
                component_name=component_name,
                alt=img.alt,
                host=ollama_host,
                model=vision_model,
            )
            vision_by_section[target].append(
                f"*Image `{resolved_display}` — {ctx} [{source_tag}]*\n\n{out}"
            )
        except Exception as e:
            print(f"❌ Ollama vision failed for {resolved}: {e}")
            vision_by_section["Documentation imagery"].append(
                f"- Vision error for `{resolved}` [{source_tag}]: `{e}`"
            )


def _dedupe_keep_order(lines: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for ln in lines:
        key = ln.strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(ln)
    return out


def _merge_docs_with_precedence(
    github_doc_by_section: dict[str, list[str]],
    local_doc_by_section: dict[str, list[str]],
) -> tuple[dict[str, list[str]], dict[str, list[str]]]:
    """
    Docs-first policy:
    - prefer GitHub docs lines
    - append unique local lines as fallback context
    - emit conflict notes when both exist but are not equal
    """
    canonical: dict[str, list[str]] = {}
    conflicts: dict[str, list[str]] = {}
    for section in sorted(set(github_doc_by_section) | set(local_doc_by_section)):
        gh = _dedupe_keep_order(github_doc_by_section.get(section, []))
        local = _dedupe_keep_order(local_doc_by_section.get(section, []))
        if gh and local:
            gh_norm = [x.strip().lower() for x in gh]
            local_norm = [x.strip().lower() for x in local]
            if gh_norm != local_norm:
                conflicts[section] = [
                    f"{section}: docs-first applied (GitHub prioritized over local where content diverged)."
                ]
        merged = _dedupe_keep_order([*gh, *local])
        if merged:
            canonical[section] = merged
    return canonical, conflicts


def collect_vision_for_component(
    slug: str,
    component_name: str,
    *,
    use_vision: bool,
    vision_model: str | None,
    ollama_host: str | None,
    docs_source: str,
    dynamic_heading_fallback: bool,
    github_prefix_extras: list[str] | None = None,
    category: str | None = None,
) -> tuple[dict[str, list[str]], dict[str, list[str]], dict[str, list[str]], dict[str, list[str]]]:
    vision_by_section: defaultdict[str, list[str]] = defaultdict(list)
    github_doc_by_section: defaultdict[str, list[str]] = defaultdict(list)
    local_doc_by_section: defaultdict[str, list[str]] = defaultdict(list)

    if docs_source in ("local", "both"):
        comp_dir = ids_component_dir(slug)
        if comp_dir.is_dir():
            for mdx_path in sorted(comp_dir.glob("*.mdx")):
                if mdx_path.name == "design-spec.mdx":
                    continue
                text = mdx_path.read_text(encoding="utf-8")
                rel = mdx_path.relative_to(ROOT).as_posix()
                merge_github_doc_sections(
                    local_doc_by_section,
                    extract_prose_from_mdx_file(text, rel),
                )

                def fetch_local(repo_rel: str) -> bytes | None:
                    p = ROOT / repo_rel
                    return p.read_bytes() if p.is_file() else None

                _append_vision_from_mdx(
                    vision_by_section,
                    text,
                    rel,
                    use_vision=use_vision,
                    vision_model=vision_model,
                    ollama_host=ollama_host,
                    component_name=component_name,
                    dynamic_heading_fallback=dynamic_heading_fallback,
                    image_fetch=fetch_local,
                    source_tag="local",
                )
        elif docs_source == "local":
            print(f"⚠️ Local docs dir missing: {comp_dir}")

    if docs_source in ("github", "both"):
        if not settings.github_host or not settings.github_repo or not settings.github_token:
            print("⚠️ GitHub env not set (GITHUB_HOST, GITHUB_REPO, GITHUB_PERSONAL_ACCESS_TOKEN); skipping GitHub docs")
        else:
            loader = GithubLoader()
            seen_mdx: set[str] = set()

            def ingest_github_mdx_file(finfo: dict) -> None:
                path = finfo.get("path", "")
                if not path or path in seen_mdx:
                    return
                if path.rstrip("/").split("/")[-1] == "design-spec.mdx":
                    return
                seen_mdx.add(path)
                text = loader.fetch_file(finfo.get("download_url", ""))
                if not text:
                    return
                merge_github_doc_sections(
                    github_doc_by_section,
                    extract_prose_from_mdx_file(text, path),
                )

                def fetch_github_for_mdx(repo_rel: str) -> bytes | None:
                    for candidate in _github_asset_candidates(path, repo_rel):
                        blob = loader.fetch_repo_path(candidate)
                        if blob is not None:
                            return blob
                    return None

                _append_vision_from_mdx(
                    vision_by_section,
                    text,
                    path,
                    use_vision=use_vision,
                    vision_model=vision_model,
                    ollama_host=ollama_host,
                    component_name=component_name,
                    dynamic_heading_fallback=dynamic_heading_fallback,
                    image_fetch=fetch_github_for_mdx,
                    source_tag="github",
                )

            for prefix in _merged_github_prefixes(
                component_name, slug, github_prefix_extras or [], category=category
            ):
                files = loader.list_mdx_under_prefix(prefix)
                if not files:
                    continue
                for finfo in files:
                    ingest_github_mdx_file(finfo)

            if not seen_mdx:
                print(
                    "🔎 No MDX under prefix paths; scanning full `content/` tree for this component…"
                )
                for finfo in _mdx_files_under_content_for_component(
                    loader, slug, component_name
                ):
                    ingest_github_mdx_file(finfo)

    canonical_docs, conflict_notes = _merge_docs_with_precedence(
        dict(github_doc_by_section),
        dict(local_doc_by_section),
    )
    return (
        dict(vision_by_section),
        canonical_docs,
        dict(local_doc_by_section),
        conflict_notes,
    )


def main() -> int:
    ap = argparse.ArgumentParser(description="Generate consolidated design-spec.mdx")
    ap.add_argument("--component", required=True, help='Name as in component-figma-map, e.g. "Accordion"')
    ap.add_argument("--map", type=Path, default=ROOT / "data" / "component-figma-map.json")
    ap.add_argument("--skip-figma", action="store_true", help="Do not call Figma API")
    ap.add_argument("--no-vision", action="store_true", help="Skip Ollama; still list image locations")
    ap.add_argument("--vision-model", default=None, help="Override OLLAMA_VISION_MODEL")
    ap.add_argument(
        "--docs-source",
        choices=("local", "github", "both"),
        default="local",
        help="Where to read MDX + images (GitHub scans multiple paths under `content/` — see _github_path_prefixes)",
    )
    ap.add_argument(
        "--no-dynamic-headings",
        action="store_true",
        help="If an image's heading path matches no rule, send it to Documentation imagery only",
    )
    ap.add_argument(
        "--github-prefix",
        action="append",
        default=[],
        metavar="PATH",
        help="Extra repo path to list MDX under (before defaults). Repeat for multiple. "
        "Or set GITHUB_COMPONENT_DOCS_PREFIX in .env for a single path.",
    )
    args = ap.parse_args()

    rows = load_map(args.map)
    entry = find_entry(rows, args.component)
    if not entry:
        print(f"❌ Component '{args.component}' not found in {args.map}")
        return 1

    slug = component_slug(args.component)
    figma_url = entry.get("figmaUrl") or entry.get("figma_url", "")
    category = entry.get("category", "Unknown")
    node_id_raw = entry.get("nodeId") or entry.get("node_id", "")

    figma_anatomy: list[str] = []
    figma_layout: list[str] = []
    figma_typography: list[str] = []
    figma_colors: list[str] = []
    variable_bullets: list[str] = []
    file_key = ""
    node_id_api = ""

    if not args.skip_figma:
        try:
            fk, nid = extract_file_key_and_node_id(figma_url)
            file_key, node_id_api = fk, nid
            client = FigmaSyncClient()
            nodes_json = client.get_file_nodes(file_key, [node_id_raw.replace(":", "-")])
            frag = extract_from_nodes_response(nodes_json, node_id_api)
            figma_anatomy = frag.get("anatomy", [])
            figma_layout = frag.get("layout", [])
            figma_typography = frag.get("typography", [])
            figma_colors = frag.get("colors", [])
            vars_json = client.get_variables(file_key)
            variable_bullets = summarize_variables(vars_json, limit=80)
        except Exception as e:
            print(f"❌ Figma extraction failed: {e}")
            return 1
    else:
        file_key = "(skipped)"
        node_id_api = node_id_raw.replace("-", ":") if node_id_raw else ""

    gh_extras = list(args.github_prefix or [])
    env_gh = os.getenv("GITHUB_COMPONENT_DOCS_PREFIX", "").strip().strip("/")
    if env_gh:
        gh_extras.insert(0, env_gh)

    vision_by_section, docs_by_section, local_doc_by_section, conflict_notes_by_section = collect_vision_for_component(
        slug,
        args.component,
        use_vision=not args.no_vision,
        vision_model=args.vision_model or settings.ollama_vision_model,
        ollama_host=settings.ollama_host,
        docs_source=args.docs_source,
        dynamic_heading_fallback=not args.no_dynamic_headings,
        github_prefix_extras=gh_extras,
        category=category,
    )

    mdx = compose_design_spec_mdx(
        component_name=args.component,
        category=category,
        figma_url=figma_url,
        node_id_display=node_id_raw or node_id_api,
        file_key=file_key,
        figma_anatomy=figma_anatomy,
        figma_layout=figma_layout,
        figma_typography=figma_typography,
        figma_colors=figma_colors,
        variable_bullets=variable_bullets,
        vision_by_section=vision_by_section,
        docs_by_section=docs_by_section,
        local_doc_by_section=local_doc_by_section,
        conflict_notes_by_section=conflict_notes_by_section,
        map_path=_map_display_path(args.map),
    )

    out_dir = ids_spec_out_dir(slug)
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "design-spec.mdx"
    out_path.write_text(mdx, encoding="utf-8")
    print(f"✅ Wrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
