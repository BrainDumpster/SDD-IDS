#!/usr/bin/env python3
"""
Build IDS theme CSS and root-spec variable tables from a Figma MCP compact export.

Reads:
  storage/figma-exports/ids/compact-export.json

Writes:
  components/ids-theme.css
  components/ids/root-spec.md  (variable table region only, unless --css-only)

The compact export must contain Figma local-variables metadata compatible with
scripts/figma_theme_sync.py (either {"meta": {...}} or top-level variables +
variableCollections). Typically produced by fetching IDS Variables Library
(r0Ex6TumqcR3HINamsfXCV) via Figma MCP and saving the REST-shaped payload.

Token naming (Color Modes):
  - Shadow/* → always path-derived (--shadow-drop-shadow-2-x)
  - Other vars → WEB codeSyntax when present and unclaimed, else path-derived
  - Border width → --border-width-border-default + legacy numeric aliases
  - Table Density / UI Icon Size Modes → per-mode suffixed tokens
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

sys.path.insert(0, str(Path(__file__).resolve().parent))

from figma_theme_sync import (  # noqa: E402
    IDS_CONFIG,
    IDS_VARIABLE_LIBRARY_KEY,
    build_theme_maps,
    emit_theme_css,
)
from sync_ids_root_spec_from_figma import (  # noqa: E402
    ROOT_SPEC,
    build_markdown,
    update_root_spec_metadata,
)

PROJECT = Path(__file__).resolve().parent.parent
DEFAULT_EXPORT = PROJECT / "storage" / "figma-exports" / "ids" / "compact-export.json"
DEFAULT_THEME = PROJECT / "components" / "ids-theme.css"

LAYOUT_ALIASES_MARKER = (
    "  /* --- Component layout aliases (IDS defaults; programmes override same names) --- */"
)
DARK_LAYOUT_MARKER = "  /* --- Component layout aliases (unchanged) --- */"


def normalize_mcp_export(data: Dict[str, Any]) -> Dict[str, Any]:
    """Accept REST payload or compact {variables, variableCollections} wrapper."""
    if isinstance(data.get("meta"), dict):
        meta = data["meta"]
        if "variables" in meta and "variableCollections" in meta:
            return data
    if "variables" in data and "variableCollections" in data:
        return {"meta": {"variables": data["variables"], "variableCollections": data["variableCollections"]}}
    raise ValueError(
        "compact-export.json must include meta.variables + meta.variableCollections "
        "(or top-level variables + variableCollections)"
    )


def load_export(path: Path) -> Dict[str, Any]:
    with path.open(encoding="utf-8") as f:
        return normalize_mcp_export(json.load(f))


def extract_layout_aliases_block(css: str, *, dark: bool = False) -> Optional[str]:
    marker = DARK_LAYOUT_MARKER if dark else LAYOUT_ALIASES_MARKER
    start = css.find(marker)
    if start == -1:
        return None
    end = css.find("\n}", start)
    if end == -1:
        return None
    return css[start:end].rstrip() + "\n"


def inject_layout_aliases(css: str, light_block: str, dark_block: Optional[str] = None) -> str:
    dark_block = dark_block or light_block.replace(
        "Component layout aliases (IDS defaults; programmes override same names)",
        "Component layout aliases (unchanged)",
    )

    light_close = "\n}\n\n/* ========================================================\n   DARK THEME"
    idx = css.find(light_close)
    if idx == -1:
        raise RuntimeError("Could not locate light theme closing brace in generated CSS")
    css = css[:idx] + "\n" + light_block + css[idx:]

    dark_shadow = "  /* --- IDS dropdown shadow aliases (dark) --- */"
    d_idx = css.find(dark_shadow)
    if d_idx == -1:
        dark_close = css.rfind("\n}")
        if dark_close == -1:
            raise RuntimeError("Could not locate dark theme closing brace in generated CSS")
        return css[:dark_close] + "\n" + dark_block + css[dark_close:]

    return css[:d_idx] + dark_block + css[d_idx:]


def patch_mcp_header(css: str, *, sync_date: str, collection_stats: Dict[str, int]) -> str:
    stat_bits = ", ".join(f"{name}={count}" for name, count in collection_stats.items())
    lines = css.splitlines()
    out: list[str] = []
    for line in lines:
        if line.startswith(" * Auto-extracted from Figma"):
            out.append(' * Auto-extracted from Figma "IDS Variables Library" variables (MCP export).')
            continue
        if line.startswith(" * Last REST sync:"):
            out.append(f" * Last MCP sync: {sync_date}")
            continue
        if line.startswith(" * Synced variables:"):
            out.append(f" * Synced variables: {stat_bits}.")
            continue
        if line.startswith(" * Sync:"):
            out.append(" * Sync: python3 scripts/build_ids_theme_from_mcp_export.py")
            continue
        if line.startswith(" * Strategy:"):
            out.append(
                " * Strategy: MCP compact export; Color Modes WEB when unclaimed; Shadow/* path-only."
            )
            continue
        if line.startswith(" * REST export via IDS Design Library"):
            continue
        out.append(line)
    return "\n".join(out) + "\n"


def build_ids_theme_css(
    payload: Dict[str, Any],
    *,
    existing_theme_path: Optional[Path] = None,
    sync_date: Optional[str] = None,
) -> Tuple[str, Dict[str, int]]:
    (
        colors_ld,
        shadow_geom,
        sizes,
        density,
        icon_size,
        prim_colors,
        prim_other,
        semantic_invariant,
        collection_stats,
    ) = build_theme_maps(payload, IDS_CONFIG)

    sync_date = sync_date or date.today().isoformat()
    css = emit_theme_css(
        IDS_CONFIG,
        colors_ld,
        shadow_geom,
        sizes,
        density,
        prim_colors,
        prim_other,
        semantic_invariant,
        icon_size=icon_size,
        collection_stats=collection_stats,
        sync_timestamp=f"{sync_date}T00:00:00Z",
    )
    css = patch_mcp_header(css, sync_date=sync_date, collection_stats=collection_stats)

    existing_path = existing_theme_path or DEFAULT_THEME
    if existing_path.is_file():
        existing = existing_path.read_text(encoding="utf-8")
        light_block = extract_layout_aliases_block(existing, dark=False)
        dark_block = extract_layout_aliases_block(existing, dark=True)
        if light_block:
            css = inject_layout_aliases(css, light_block, dark_block)

    return css, collection_stats


def update_root_spec_from_payload(
    payload: Dict[str, Any],
    root_spec_path: Path,
    *,
    verification_date: Optional[str] = None,
) -> None:
    verification_date = verification_date or date.today().isoformat()
    md = build_markdown(payload, file_key_for_banner=IDS_VARIABLE_LIBRARY_KEY)
    content = root_spec_path.read_text(encoding="utf-8")

    start = "<!-- ds:section id=primitive-static -->"
    end = "<!-- ds:section id=typography -->"
    i = content.find(start)
    j = content.find(end)
    if i == -1 or j == -1 or j <= i:
        raise RuntimeError(f"Could not find root-spec replacement region ({start!r} → {end!r})")

    new_content = content[:i] + md + "\n" + content[j:]
    new_content = update_root_spec_metadata(new_content, verification_date=verification_date)
    root_spec_path.write_text(new_content, encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--export",
        type=Path,
        default=DEFAULT_EXPORT,
        help=f"MCP compact export JSON (default: {DEFAULT_EXPORT})",
    )
    ap.add_argument(
        "--theme",
        type=Path,
        default=DEFAULT_THEME,
        help=f"Output theme CSS (default: {DEFAULT_THEME})",
    )
    ap.add_argument(
        "--root-spec",
        type=Path,
        default=Path(ROOT_SPEC),
        help=f"Root spec markdown (default: {ROOT_SPEC})",
    )
    ap.add_argument("--css-only", action="store_true", help="Only write ids-theme.css")
    ap.add_argument("--spec-only", action="store_true", help="Only update root-spec.md")
    ap.add_argument("--dry-run", action="store_true", help="Print counts only; do not write files")
    ap.add_argument(
        "--sync-date",
        default=date.today().isoformat(),
        help="Verification/sync date for headers (default: today)",
    )
    args = ap.parse_args()

    if not args.export.is_file():
        print(f"Export not found: {args.export}", file=sys.stderr)
        return 1

    payload = load_export(args.export)

    if args.dry_run:
        stats = build_theme_maps(payload, IDS_CONFIG)[-1]
        print(json.dumps(stats, indent=2))
        return 0

    write_css = not args.spec_only
    write_spec = not args.css_only

    if write_css:
        css, stats = build_ids_theme_css(
            payload,
            existing_theme_path=args.theme if args.theme.is_file() else None,
            sync_date=args.sync_date,
        )
        args.theme.parent.mkdir(parents=True, exist_ok=True)
        args.theme.write_text(css, encoding="utf-8")
        print(f"Wrote {args.theme} ({sum(stats.values())} variables across collections)", file=sys.stderr)

    if write_spec:
        update_root_spec_from_payload(
            payload,
            args.root_spec,
            verification_date=args.sync_date,
        )
        print(f"Wrote {args.root_spec}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
