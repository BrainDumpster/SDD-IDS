#!/usr/bin/env python3
"""
Shared Figma variables/local → programme theme CSS sync.

Used by:
- scripts/sync_synapse_theme_from_figma.py
- scripts/sync_ids_theme_from_figma.py
- scripts/sync_programme_themes_from_figma.py
"""

from __future__ import annotations

import os
import re
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional, Set, Tuple

import requests

BASE_URL = "https://api.figma.com/v1"
PROJECT = Path(__file__).resolve().parent.parent

_BORDER_WIDTH_SUFFIX = {
    "default": "border-1",
    "thick": "border-2",
    "strong": "border-4",
    "heavy": "border-6",
    "none": "border-none",
}

CssEmitMode = Literal["root", "ids_scoped"]


@dataclass(frozen=True)
class ProgrammeThemeConfig:
    programme: str
    figma_file_key: str
    output_paths: Tuple[Path, ...]
    figma_label: str
    collection_notes: str
    semantic_base_collections: Tuple[str, ...]
    semantic_overlay_collections: Tuple[str, ...] = ("Tokens",)
    shadow_collection: str = "Tokens"
    sizes_collections: Tuple[str, ...] = ("Sizes",)
    primitive_collections: Tuple[str, ...] = ("Primitive",)
    css_emit_mode: CssEmitMode = "root"
    design_system_slug: str = ""
    include_ids_shadow_aliases: bool = False
    prefer_path_tokens: bool = False
    header_extra: Tuple[str, ...] = ()


SYNAPSE_CONFIG = ProgrammeThemeConfig(
    programme="synapse",
    figma_file_key="Td1bnsvRj1PCGs9RVJkIvJ",
    output_paths=(
        PROJECT / "components" / "synapse-theme.css",
        PROJECT / "storybook" / "src" / "synapse-theme.css",
    ),
    figma_label="Synapse Hi-Fi components",
    collection_notes="Color Mode + Tokens (semantic + shadows), Primitive, Sizes",
    semantic_base_collections=("Color Mode",),
    semantic_overlay_collections=("Tokens",),
    sizes_collections=("Sizes",),
    css_emit_mode="root",
    include_ids_shadow_aliases=True,
)

IDS_CONFIG = ProgrammeThemeConfig(
    programme="ids",
    figma_file_key="VZJ48bbVYrIynw8DdSukWw",
    output_paths=(PROJECT / "components" / "ids-theme.css",),
    figma_label="IDS exploration with variables",
    collection_notes="Semantic + Tokens (semantic + shadows), Primitive, Density Token / Shape floats",
    semantic_base_collections=("Semantic",),
    semantic_overlay_collections=("Tokens",),
    sizes_collections=("Sizes", "Density Token", "Shape"),
    primitive_collections=("Primitive", "Primitive color"),
    css_emit_mode="ids_scoped",
    design_system_slug="ids",
    include_ids_shadow_aliases=True,
    prefer_path_tokens=True,
    header_extra=(
        " * Scoped: html/body[data-design-system=\"ids\"] (+ [data-theme=\"dark\"]).",
        " * Import in Storybook/apps with data-design-system=\"ids\" on html/body.",
    ),
)


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
    return s.replace("%", "")


def _sanitize_css_token(token: str) -> str:
    t = token.replace("m<ajor", "major")
    t = re.sub(r"(\d+)%", r"\1", t)
    if "%" in t:
        t = t.replace("%", "-pct")
    return t


def _path_name_to_token(name: str) -> str:
    parts = [_sanitize_path_part(p) for p in name.split("/") if p.strip()]
    return _sanitize_css_token("--" + "-".join(parts))


def _normalize_shadow_token(token: str) -> str:
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
    mapped = _BORDER_WIDTH_SUFFIX.get(m.group(1))
    return f"--border-width-{mapped}" if mapped else token


def _token_for_variable(v: Dict[str, Any], *, prefer_path: bool = False) -> str:
    path_tok = _path_name_to_token(v.get("name") or "")
    web_raw = _web_token_from_code_syntax(v.get("codeSyntax"))
    web_tok = _sanitize_css_token(web_raw) if web_raw else None
    if prefer_path and web_tok and web_tok != path_tok:
        return path_tok
    raw = _path_name_to_token(v.get("name") or "")
    return _remap_border_width_token(_normalize_shadow_token(web_tok or raw))


def fetch_local_variables(file_key: str, token: str, *, attempts: int = 4) -> Dict[str, Any]:
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


def _merge_semantic_colors(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    acc: Dict[str, Tuple[Optional[str], Optional[str]]],
    config: ProgrammeThemeConfig,
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        cname = _collection_name(collections, cid)
        if cname not in config.semantic_base_collections + config.semantic_overlay_collections:
            continue
        if v.get("resolvedType") != "COLOR":
            continue
        if (v.get("name") or "").startswith("Shadow/"):
            continue
        coll = collections.get(cid) or {}
        lid, did = _light_dark_mode_ids(coll)
        if not lid or not did:
            continue
        token = _token_for_variable(v, prefer_path=config.prefer_path_tokens)
        if not token.startswith("--"):
            continue
        lt = _color_string_for_mode(v, lid, vars_by_id)
        dk = _color_string_for_mode(v, did, vars_by_id)
        if cname in config.semantic_base_collections:
            if token not in acc:
                acc[token] = (lt, dk)
        else:
            if lt is None and dk is None:
                continue
            prev = acc.get(token)
            merged_lt = lt if lt is not None else (prev[0] if prev else None)
            merged_dk = dk if dk is not None else (prev[1] if prev else None)
            if merged_lt is None and merged_dk is None:
                continue
            acc[token] = (merged_lt, merged_dk)


def _merge_shadow_colors(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    acc: Dict[str, Tuple[Optional[str], Optional[str]]],
    config: ProgrammeThemeConfig,
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        if _collection_name(collections, cid) != config.shadow_collection:
            continue
        if v.get("resolvedType") != "COLOR":
            continue
        if not (v.get("name") or "").startswith("Shadow/"):
            continue
        coll = collections.get(cid) or {}
        lid, did = _light_dark_mode_ids(coll)
        if not lid or not did:
            continue
        token = _token_for_variable(v, prefer_path=config.prefer_path_tokens)
        if not token.startswith("--shadow"):
            continue
        lt = _color_string_for_mode(v, lid, vars_by_id)
        dk = _color_string_for_mode(v, did, vars_by_id)
        acc[token] = (lt, dk)


def _merge_shadow_geometry(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    acc: Dict[str, str],
    config: ProgrammeThemeConfig,
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        if _collection_name(collections, cid) != config.shadow_collection:
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
        token = _token_for_variable(v, prefer_path=config.prefer_path_tokens)
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
    config: ProgrammeThemeConfig,
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        cname = _collection_name(collections, cid)
        if cname not in config.sizes_collections:
            continue
        if v.get("resolvedType") != "FLOAT":
            continue
        if (v.get("name") or "").startswith("Shadow/"):
            continue
        coll = collections.get(cid) or {}
        mid = _first_mode_id(coll)
        if not mid:
            continue
        token = _token_for_variable(v, prefer_path=config.prefer_path_tokens)
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
    config: ProgrammeThemeConfig,
) -> None:
    for v in variables.values():
        if not isinstance(v, dict):
            continue
        cid = v.get("variableCollectionId")
        if _collection_name(collections, cid) not in config.primitive_collections:
            continue
        coll = collections.get(cid) or {}
        mid = _first_mode_id(coll)
        if not mid:
            continue
        rt = v.get("resolvedType")
        token = _token_for_variable(v, prefer_path=config.prefer_path_tokens)
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
    for key in list(colors_ld.keys()):
        if "<" in key:
            del colors_ld[key]


def _ids_shadow_alias_lines(shadow_geom: Dict[str, str]) -> List[str]:
    lines: List[str] = []
    for suffix in ("blur", "color", "spread", "x", "y"):
        canonical = f"--shadow-drop-shadow-4-{suffix}"
        alias = f"--shadow-shadow-4-drop-shadow-4-{suffix}"
        lines.append(f"  {alias}: var({canonical});")
    return lines


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


def build_theme_maps(
    payload: Dict[str, Any], config: ProgrammeThemeConfig
) -> Tuple[
    Dict[str, Tuple[Optional[str], Optional[str]]],
    Dict[str, str],
    Dict[str, str],
    Dict[str, str],
    Dict[str, str],
]:
    variables, collections, vars_by_id = _collect_meta(payload)

    colors_ld: Dict[str, Tuple[Optional[str], Optional[str]]] = {}
    _merge_semantic_colors(variables, collections, vars_by_id, colors_ld, config)
    _merge_shadow_colors(variables, collections, vars_by_id, colors_ld, config)
    _dedupe_known_typos(colors_ld)

    shadow_geom: Dict[str, str] = {}
    _merge_shadow_geometry(variables, collections, vars_by_id, shadow_geom, config)

    sizes: Dict[str, str] = {}
    _merge_sizes(variables, collections, vars_by_id, sizes, config)

    prim_colors: Dict[str, str] = {}
    prim_floats: Dict[str, str] = {}
    _merge_primitives(variables, collections, vars_by_id, prim_colors, prim_floats, config)

    _ensure_icon_standard_gray(colors_ld, prim_colors)

    return colors_ld, shadow_geom, sizes, prim_colors, prim_floats


def _emit_token_block(lines: List[str], token_values: Dict[str, str]) -> None:
    for token in sorted(token_values.keys()):
        lines.append(f"  {token}: {token_values[token]};")


def emit_theme_css(
    config: ProgrammeThemeConfig,
    colors_ld: Dict[str, Tuple[Optional[str], Optional[str]]],
    shadow_geom: Dict[str, str],
    sizes: Dict[str, str],
    prim_colors: Dict[str, str],
    prim_floats: Dict[str, str],
) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    lines: List[str] = []
    display = config.programme.upper() if config.programme == "ids" else config.programme.capitalize()
    lines.append("/*")
    lines.append(f" * {display} Design System — Global Theme Tokens")
    lines.append(f' * Auto-extracted from Figma "{config.figma_label}" variables.')
    lines.append(f" * Collections: {config.collection_notes}.")
    lines.append(f" * Last REST sync: {now}")
    lines.append(" *")
    lines.append(" * Sync: python3 scripts/sync_programme_themes_from_figma.py")
    lines.append(" *        (or programme-specific sync_*.py)")
    for extra in config.header_extra:
        lines.append(extra)
    if config.css_emit_mode == "root":
        lines.append(" * Light theme = :root (default)")
        lines.append(' * Dark theme = [data-theme="dark"]')
    lines.append(" */")
    lines.append("")

    if config.css_emit_mode == "root":
        lines.append("@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');")
        lines.append("")
        lines.append("*, *::before, *::after { box-sizing: border-box; }")
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

    def light_selector() -> str:
        if config.css_emit_mode == "ids_scoped":
            ds = config.design_system_slug
            return f'html[data-design-system="{ds}"], body[data-design-system="{ds}"]'
        return ":root"

    def dark_selector() -> str:
        if config.css_emit_mode == "ids_scoped":
            ds = config.design_system_slug
            return (
                f'html[data-design-system="{ds}"][data-theme="dark"], '
                f'body[data-design-system="{ds}"][data-theme="dark"]'
            )
        return '[data-theme="dark"]'

    lines.append("/* ========================================================")
    lines.append("   LIGHT THEME (default)")
    lines.append("   ======================================================== */")
    lines.append("")
    lines.append(f"{light_selector()} {{")

    lines.append("  /* --- Primitive palette --- */")
    _emit_token_block(lines, prim_colors)
    _emit_token_block(lines, prim_floats)

    lines.append("  /* --- Semantic colors (light) --- */")
    light_semantic = {
        t: lt for t, (lt, _dk) in colors_ld.items() if lt and not t.startswith("--shadow")
    }
    _emit_token_block(lines, light_semantic)

    lines.append("  /* --- Shadows (geometry + color, light) --- */")
    light_shadow_color = {t: lt for t, (lt, _dk) in colors_ld.items() if t.startswith("--shadow") and lt}
    _emit_token_block(lines, shadow_geom)
    _emit_token_block(lines, light_shadow_color)

    if config.include_ids_shadow_aliases:
        lines.append("  /* --- IDS dropdown shadow aliases --- */")
        lines.extend(_ids_shadow_alias_lines(shadow_geom))

    lines.append("  /* --- Sizes --- */")
    _emit_token_block(lines, sizes)

    lines.append("}")
    lines.append("")

    lines.append("/* ========================================================")
    lines.append("   DARK THEME")
    lines.append("   ======================================================== */")
    lines.append("")
    lines.append(f"{dark_selector()} {{")

    if config.css_emit_mode == "ids_scoped":
        lines.append("  /* --- Primitive palette (unchanged) --- */")
        _emit_token_block(lines, prim_colors)
        _emit_token_block(lines, prim_floats)

    lines.append("  /* --- Semantic + shadow colors (dark) --- */")
    if config.css_emit_mode == "ids_scoped":
        dark_semantic = {
            t: (dk if dk is not None else lt)
            for t, (lt, dk) in colors_ld.items()
            if (lt or dk) and not t.startswith("--shadow")
        }
        _emit_token_block(lines, dark_semantic)
        dark_shadow = {
            t: (dk if dk is not None else lt)
            for t, (lt, dk) in colors_ld.items()
            if t.startswith("--shadow") and (lt or dk)
        }
        _emit_token_block(lines, dark_shadow)
    else:
        for token in sorted(colors_ld.keys()):
            lt, dk = colors_ld[token]
            if dk and dk != lt:
                lines.append(f"  {token}: {dk};")

    if config.css_emit_mode == "ids_scoped":
        lines.append("  /* --- Sizes (unchanged) --- */")
        _emit_token_block(lines, sizes)

    if config.include_ids_shadow_aliases:
        lines.append("  /* --- IDS dropdown shadow aliases (dark) --- */")
        lines.extend(_ids_shadow_alias_lines(shadow_geom))

    lines.append("}")
    lines.append("")
    return "\n".join(lines)


def sync_programme_theme(
    config: ProgrammeThemeConfig,
    *,
    figma_token: str,
    dry_run: bool = False,
) -> Dict[str, int]:
    payload = fetch_local_variables(config.figma_file_key, figma_token)
    colors_ld, shadow_geom, sizes, prim_colors, prim_floats = build_theme_maps(payload, config)
    counts = {
        "colors_ld": len(colors_ld),
        "shadow_geom": len(shadow_geom),
        "sizes": len(sizes),
        "prim_colors": len(prim_colors),
        "prim_floats": len(prim_floats),
    }
    if dry_run:
        return counts

    css = emit_theme_css(config, colors_ld, shadow_geom, sizes, prim_colors, prim_floats)
    for path in config.output_paths:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(css, encoding="utf-8")
    return counts


def figma_token_from_env() -> str:
    token = os.environ.get("FIGMA_TOKEN", "").strip()
    if not token:
        raise RuntimeError("FIGMA_TOKEN is not set (e.g. set -a && . ./.env && set +a)")
    return token
