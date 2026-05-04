#!/usr/bin/env python3
"""
Regenerate Synapse global theme CSS from Figma local variables (REST).

Uses GET https://api.figma.com/v1/files/{file_key}/variables/local
Requires FIGMA_TOKEN (e.g. `set -a && . ./.env && set +a`).

Collections:
- Color Mode — semantic COLOR (Light / Dark)
- Tokens — supplemental COLOR (excluding Shadow/*) + shadow COLOR + shadow FLOAT geometry
- Primitive — static palette / scale / opacity (merged across duplicate-named collections)
- Sizes — layout FLOAT

Writes:
- components/synapse-theme.css
- storybook/src/synapse-theme.css

Then run: python scripts/rebuild_specs.py --root-only
"""

from __future__ import annotations

import argparse
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple

import requests

BASE_URL = "https://api.figma.com/v1"
SYNAPSE_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ"
PROJECT = Path(__file__).resolve().parent.parent
OUT_COMPONENTS = PROJECT / "components" / "synapse-theme.css"
OUT_STORYBOOK = PROJECT / "storybook" / "src" / "synapse-theme.css"

# Figma Sizes path "Border Width/border-default" -> --border-width-border-default;
# map last segment to legacy token suffix (matches synapse-allowed-tokens.json).
_BORDER_WIDTH_SUFFIX = {
    "default": "border-1",
    "thick": "border-2",
    "strong": "border-4",
    "heavy": "border-6",
    "none": "border-none",
}


def _rgba_to_css_color(v: Dict[str, Any]) -> Optional[str]:
    if not isinstance(v, dict) or not all(k in v for k in ("r", "g", "b")):
        return None
    r = int(round((v.get("r", 0) or 0) * 255))
    g = int(round((v.get("g", 0) or 0) * 255))
    b = int(round((v.get("b", 0) or 0) * 255))
    a = v.get("a", 1)
    try:
        a_f = float(a)
    except Exception:
        a_f = 1.0
    if a_f < 1.0:
        return f"rgba({r},{g},{b},{a_f:.2f})"
    return f"#{r:02x}{g:02x}{b:02x}"


def _sanitize_path_part(part: str) -> str:
    s = part.strip().lower().replace(" ", "-")
    s = s.replace("%", "")
    return s


def _path_name_to_token(name: str) -> str:
    parts = [_sanitize_path_part(p) for p in name.split("/") if p.strip()]
    return "--" + "-".join(parts)


def _normalize_shadow_token(token: str) -> str:
    """
    Figma sometimes emits duplicated segments, e.g.
    --shadow-shadow-4-drop-shadow-4-x -> --shadow-drop-shadow-4-x
    """
    m = re.match(r"^--shadow-shadow-(\d+)-drop-shadow-\1-(.+)$", token)
    if m:
        return f"--shadow-drop-shadow-{m.group(1)}-{m.group(2)}"
    return token


def _web_token_from_code_syntax(code_syntax: Any) -> Optional[str]:
    if not isinstance(code_syntax, dict):
        return None
    web = code_syntax.get("WEB")
    if not isinstance(web, str):
        return None
    web = web.strip()
    m = re.match(r"^var\(\s*(--[\w-]+)\s*\)$", web, re.IGNORECASE)
    if m:
        return _normalize_shadow_token(m.group(1))
    if web.startswith("--"):
        return _normalize_shadow_token(web)
    return None


def _remap_border_width_token(token: str) -> str:
    m = re.match(r"^--border-width-border-([\w-]+)$", token)
    if not m:
        return token
    suf = m.group(1)
    mapped = _BORDER_WIDTH_SUFFIX.get(suf)
    if not mapped:
        return token
    return f"--border-width-{mapped}"


def _token_for_variable(v: Dict[str, Any]) -> str:
    web = _web_token_from_code_syntax(v.get("codeSyntax"))
    if web:
        return web
    raw = _path_name_to_token(v.get("name") or "")
    return _remap_border_width_token(_normalize_shadow_token(raw))


def _fetch_local(file_key: str, token: str, *, attempts: int = 4) -> Dict[str, Any]:
    url = f"{BASE_URL}/files/{file_key}/variables/local"
    last: Optional[BaseException] = None
    for i in range(attempts):
        try:
            r = requests.get(url, headers={"X-Figma-Token": token}, timeout=180)
            r.raise_for_status()
            return r.json()
        except (requests.RequestException, ValueError) as e:
            last = e
            time.sleep(2 + i * 3)
    raise RuntimeError(f"Figma variables fetch failed after {attempts} attempts: {last}")


def _collect_meta(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
    meta = payload.get("meta") or {}
    variables = meta.get("variables") or {}
    collections = meta.get("variableCollections") or {}
    vars_by_id: Dict[str, Any] = {}
    for _vid, v in variables.items():
        if isinstance(v, dict) and v.get("id"):
            vars_by_id[v["id"]] = v
    return variables, collections, vars_by_id


def _collection_name(collections: Dict[str, Any], collection_id: str) -> str:
    c = collections.get(collection_id) or {}
    return c.get("name") or ""


def _light_dark_mode_ids(collection: Dict[str, Any]) -> Tuple[Optional[str], Optional[str]]:
    light_id: Optional[str] = None
    dark_id: Optional[str] = None
    for m in collection.get("modes") or []:
        n = (m.get("name") or "").strip().lower()
        mid = m.get("modeId")
        if not mid:
            continue
        if n.startswith("light"):
            light_id = mid
        elif n.startswith("dark"):
            dark_id = mid
    return light_id, dark_id


def _first_mode_id(collection: Dict[str, Any]) -> Optional[str]:
    modes = collection.get("modes") or []
    if not modes:
        return None
    return modes[0].get("modeId")


def _resolve_color(
    raw_val: Any,
    mid: str,
    vars_by_id: Dict[str, Any],
    *,
    visited: Set[str],
    depth: int = 0,
) -> Optional[Dict[str, Any]]:
    if depth > 14:
        return None
    if isinstance(raw_val, dict) and raw_val.get("type") == "VARIABLE_ALIAS":
        aid = raw_val.get("id")
        if not aid or aid in visited:
            return None
        visited.add(aid)
        ref = vars_by_id.get(aid)
        if not isinstance(ref, dict):
            return None
        ref_vals = ref.get("valuesByMode") or {}
        nxt = ref_vals.get(mid)
        if nxt is None and ref_vals:
            nxt = next(iter(ref_vals.values()))
        return _resolve_color(nxt, mid, vars_by_id, visited=visited, depth=depth + 1)
    if isinstance(raw_val, dict) and "r" in raw_val:
        return raw_val
    return None


def _color_string_for_mode(
    v: Dict[str, Any], mid: Optional[str], vars_by_id: Dict[str, Any]
) -> Optional[str]:
    if not mid:
        return None
    raw_modes = v.get("valuesByMode") or {}
    raw_val = raw_modes.get(mid)
    if raw_val is None and raw_modes:
        raw_val = next(iter(raw_modes.values()))
    visited: Set[str] = set()
    vid = v.get("id")
    if isinstance(vid, str):
        visited.add(vid)
    resolved = _resolve_color(raw_val, mid, vars_by_id, visited=visited)
    return _rgba_to_css_color(resolved) if resolved else None


def _resolve_float_raw(
    raw_val: Any,
    mid: str,
    vars_by_id: Dict[str, Any],
    *,
    visited: Set[str],
    depth: int = 0,
) -> Optional[float]:
    if depth > 18:
        return None
    if isinstance(raw_val, (int, float)):
        return float(raw_val)
    if isinstance(raw_val, dict) and raw_val.get("type") == "VARIABLE_ALIAS":
        aid = raw_val.get("id")
        if not aid or aid in visited:
            return None
        visited.add(aid)
        ref = vars_by_id.get(aid)
        if not isinstance(ref, dict):
            return None
        ref_vals = ref.get("valuesByMode") or {}
        nxt = ref_vals.get(mid)
        if nxt is None and ref_vals:
            nxt = next(iter(ref_vals.values()))
        return _resolve_float_raw(nxt, mid, vars_by_id, visited=visited, depth=depth + 1)
    return None


def _float_for_mode(v: Dict[str, Any], mid: Optional[str], vars_by_id: Dict[str, Any]) -> Optional[float]:
    if not mid:
        return None
    raw_modes = v.get("valuesByMode") or {}
    raw_val = raw_modes.get(mid)
    if raw_val is None and raw_modes:
        raw_val = next(iter(raw_modes.values()))
    visited: Set[str] = set()
    vid = v.get("id")
    if isinstance(vid, str):
        visited.add(vid)
    return _resolve_float_raw(raw_val, mid, vars_by_id, visited=visited)


def _format_size_float(token: str, val: float) -> str:
    if token.startswith("--opacity-"):
        if val > 1.0:
            return str(round(val / 100.0, 2)).rstrip("0").rstrip(".") if val % 10 else str(val / 100.0)
        return str(int(val)) if val == int(val) else str(val)
    if val == int(val):
        return f"{int(val)}px"
    return f"{val}px"


def _merge_color_mode_and_tokens_nonshadow(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    acc: Dict[str, Tuple[Optional[str], Optional[str]]],
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        cname = _collection_name(collections, cid)
        if cname not in ("Color Mode", "Tokens"):
            continue
        if v.get("resolvedType") != "COLOR":
            continue
        if (v.get("name") or "").startswith("Shadow/"):
            continue
        coll = collections.get(cid) or {}
        lid, did = _light_dark_mode_ids(coll)
        if not lid or not did:
            continue
        token = _token_for_variable(v)
        if not token.startswith("--"):
            continue
        lt = _color_string_for_mode(v, lid, vars_by_id)
        dk = _color_string_for_mode(v, did, vars_by_id)
        if cname == "Color Mode":
            if token not in acc:
                acc[token] = (lt, dk)
        else:
            # Tokens override Color Mode when names clash, but keep Color Mode
            # if Tokens aliases point to unpublished library variables (unresolvable).
            if lt is None and dk is None:
                continue
            acc[token] = (lt, dk)


def _merge_tokens_shadow_colors(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    acc: Dict[str, Tuple[Optional[str], Optional[str]]],
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        if _collection_name(collections, cid) != "Tokens":
            continue
        if v.get("resolvedType") != "COLOR":
            continue
        if not (v.get("name") or "").startswith("Shadow/"):
            continue
        coll = collections.get(cid) or {}
        lid, did = _light_dark_mode_ids(coll)
        if not lid or not did:
            continue
        token = _token_for_variable(v)
        if not token.startswith("--shadow"):
            continue
        lt = _color_string_for_mode(v, lid, vars_by_id)
        dk = _color_string_for_mode(v, did, vars_by_id)
        acc[token] = (lt, dk)


def _merge_tokens_shadow_geometry(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    acc: Dict[str, str],
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        if _collection_name(collections, cid) != "Tokens":
            continue
        if v.get("resolvedType") != "FLOAT":
            continue
        if not (v.get("name") or "").startswith("Shadow/"):
            continue
        coll = collections.get(cid) or {}
        lid, did = _light_dark_mode_ids(coll)
        mid = lid or did
        if not mid:
            continue
        token = _token_for_variable(v)
        if not token.startswith("--shadow"):
            continue
        fv = _float_for_mode(v, mid, vars_by_id)
        if fv is None:
            continue
        acc[token] = _format_size_float(token, fv)


def _merge_sizes(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    acc: Dict[str, str],
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        if _collection_name(collections, cid) != "Sizes":
            continue
        if v.get("resolvedType") != "FLOAT":
            continue
        coll = collections.get(cid) or {}
        mid = _first_mode_id(coll)
        if not mid:
            continue
        token = _token_for_variable(v)
        if not token.startswith("--"):
            continue
        fv = _float_for_mode(v, mid, vars_by_id)
        if fv is None:
            continue
        acc[token] = _format_size_float(token, fv)


def _merge_primitives(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    colors: Dict[str, str],
    floats: Dict[str, str],
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        if _collection_name(collections, cid) != "Primitive":
            continue
        coll = collections.get(cid) or {}
        mid = _first_mode_id(coll)
        if not mid:
            continue
        rt = v.get("resolvedType")
        token = _token_for_variable(v)
        if not token.startswith("--"):
            continue
        if rt == "COLOR":
            hx = _color_string_for_mode(v, mid, vars_by_id)
            if hx:
                colors[token] = hx
        elif rt == "FLOAT":
            fv = _float_for_mode(v, mid, vars_by_id)
            if fv is not None:
                floats[token] = _format_size_float(token, fv)


def _dedupe_known_typos(colors_ld: Dict[str, Tuple[Optional[str], Optional[str]]]) -> None:
    typo = "--color-backtground-alerting-success-1"
    ok = "--color-background-alerting-success-1"
    if ok in colors_ld and typo in colors_ld:
        del colors_ld[typo]


def _ensure_icon_standard_gray(
    colors_ld: Dict[str, Tuple[Optional[str], Optional[str]]],
    prim_colors: Dict[str, str],
) -> None:
    key = "--icon-standard-gray"
    if key in colors_ld:
        return
    g600 = prim_colors.get("--ui-palette-gray-600")
    if g600:
        colors_ld[key] = (g600, g600)


def build_theme_maps(payload: Dict[str, Any]) -> Tuple[
    Dict[str, Tuple[Optional[str], Optional[str]]],
    Dict[str, str],
    Dict[str, str],
    Dict[str, str],
]:
    variables, collections, vars_by_id = _collect_meta(payload)

    colors_ld: Dict[str, Tuple[Optional[str], Optional[str]]] = {}
    _merge_color_mode_and_tokens_nonshadow(variables, collections, vars_by_id, colors_ld)
    _merge_tokens_shadow_colors(variables, collections, vars_by_id, colors_ld)
    _dedupe_known_typos(colors_ld)

    shadow_geom: Dict[str, str] = {}
    _merge_tokens_shadow_geometry(variables, collections, vars_by_id, shadow_geom)

    sizes: Dict[str, str] = {}
    _merge_sizes(variables, collections, vars_by_id, sizes)

    prim_colors: Dict[str, str] = {}
    prim_floats: Dict[str, str] = {}
    _merge_primitives(variables, collections, vars_by_id, prim_colors, prim_floats)

    _ensure_icon_standard_gray(colors_ld, prim_colors)

    return colors_ld, shadow_geom, sizes, prim_colors, prim_floats


def _emit_css(
    colors_ld: Dict[str, Tuple[Optional[str], Optional[str]]],
    shadow_geom: Dict[str, str],
    sizes: Dict[str, str],
    prim_colors: Dict[str, str],
    prim_floats: Dict[str, str],
) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    lines: List[str] = []
    lines.append("/*")
    lines.append(" * Synapse Design System — Global Theme Tokens")
    lines.append(' * Auto-extracted from Figma "Synapse Hi Fi components" variables.')
    lines.append(" * Collections: Color Mode + Tokens (semantic + shadows), Primitive, Sizes.")
    lines.append(f" * Last REST sync: {now}")
    lines.append(" *")
    lines.append(" * Typography: Roboto (Regular 400, Medium 500)")
    lines.append(" * Light theme = :root (default)")
    lines.append(' * Dark theme = [data-theme="dark"]')
    lines.append(" */")
    lines.append("")
    lines.append("@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');")
    lines.append("")
    lines.append("/* ========================================================")
    lines.append("   BASE TYPOGRAPHY")
    lines.append("   ======================================================== */")
    lines.append("")
    lines.append("*, *::before, *::after {")
    lines.append("  box-sizing: border-box;")
    lines.append("}")
    lines.append("")
    lines.append("html, body {")
    lines.append("  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;")
    lines.append("  font-size: var(--font-size-body-2);")
    lines.append("  font-weight: 400;")
    lines.append("  line-height: var(--font-line-height-line-height-20);")
    lines.append("  color: var(--color-text-neutral-strong);")
    lines.append("  -webkit-font-smoothing: antialiased;")
    lines.append("  -moz-osx-font-smoothing: grayscale;")
    lines.append("}")
    lines.append("")
    lines.append("/* ========================================================")
    lines.append("   LIGHT THEME (default)")
    lines.append("   ======================================================== */")
    lines.append("")
    lines.append(":root {")

    lines.append("  /* --- Semantic colors (Light) --- */")
    for token in sorted(colors_ld.keys()):
        lt, _dk = colors_ld[token]
        if lt:
            lines.append(f"  {token}: {lt};")

    lines.append("")
    lines.append("  /* --- Shadows (geometry + color, Light) --- */")
    for token in sorted(shadow_geom.keys()):
        lines.append(f"  {token}: {shadow_geom[token]};")

    lines.append("")
    lines.append("  /* --- Sizes (Spacing, Padding, Corner Radius, Font, etc.) --- */")
    for token in sorted(sizes.keys()):
        lines.append(f"  {token}: {sizes[token]};")

    lines.append("")
    lines.append("  /* --- Primitive Palette (static, not theme-dependent) --- */")
    for token in sorted(prim_colors.keys()):
        lines.append(f"  {token}: {prim_colors[token]};")
    for token in sorted(prim_floats.keys()):
        lines.append(f"  {token}: {prim_floats[token]};")

    lines.append("}")
    lines.append("")
    lines.append("")
    lines.append("/* ========================================================")
    lines.append("   DARK THEME")
    lines.append("   ======================================================== */")
    lines.append("")
    lines.append('[data-theme="dark"] {')

    for token in sorted(colors_ld.keys()):
        lt, dk = colors_ld[token]
        if dk and dk != lt:
            lines.append(f"  {token}: {dk};")

    lines.append("}")
    lines.append("")
    return "\n".join(lines) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="Print counts only")
    args = ap.parse_args()

    token = os.environ.get("FIGMA_TOKEN", "").strip()
    if not token:
        print("FIGMA_TOKEN is not set", file=sys.stderr)
        return 1

    payload = _fetch_local(SYNAPSE_FILE_KEY, token)
    colors_ld, shadow_geom, sizes, prim_colors, prim_floats = build_theme_maps(payload)

    if args.dry_run:
        print(
            "colors_ld",
            len(colors_ld),
            "shadow_geom",
            len(shadow_geom),
            "sizes",
            len(sizes),
            "prim_c",
            len(prim_colors),
            "prim_f",
            len(prim_floats),
        )
        return 0

    css = _emit_css(colors_ld, shadow_geom, sizes, prim_colors, prim_floats)
    OUT_COMPONENTS.write_text(css, encoding="utf-8")
    OUT_STORYBOOK.write_text(css, encoding="utf-8")
    print(f"Wrote {OUT_COMPONENTS}", file=sys.stderr)
    print(f"Wrote {OUT_STORYBOOK}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
