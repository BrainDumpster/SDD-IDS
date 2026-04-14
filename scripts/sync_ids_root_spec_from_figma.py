#!/usr/bin/env python3
"""
Sync variable tables in components/ids/root-spec.mdx from Figma local variables.

Requires FIGMA_TOKEN in the environment (e.g. `set -a && . ./.env && set +a`).

Figma file (IDS exploration with variables):
https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from typing import Any, Dict, List, Optional, Tuple

import requests

BASE_URL = "https://api.figma.com/v1"
IDS_FILE_KEY = "VZJ48bbVYrIynw8DdSukWw"
ROOT_SPEC = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "components",
    "ids",
    "root-spec.mdx",
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


def _web_token_from_code_syntax(code_syntax: Any) -> Optional[str]:
    if not isinstance(code_syntax, dict):
        return None
    web = code_syntax.get("WEB")
    if not isinstance(web, str):
        return None
    web = web.strip()
    m = re.match(r"^var\(\s*(--[\w-]+)\s*\)$", web, re.IGNORECASE)
    if m:
        return m.group(1)
    if web.startswith("--"):
        return web
    return None


def _path_name_to_token(name: str) -> str:
    parts = [p.strip().lower().replace(" ", "-") for p in name.split("/") if p.strip()]
    return "--" + "-".join(parts)


def _theme_from_mode_name(mode_name: str) -> Optional[str]:
    n = (mode_name or "").strip().lower()
    if n.startswith("light"):
        return "light"
    if n.startswith("dark"):
        return "dark"
    return None


def _fetch_local(file_key: str, token: str) -> Dict[str, Any]:
    url = f"{BASE_URL}/files/{file_key}/variables/local"
    r = requests.get(url, headers={"X-Figma-Token": token}, timeout=120)
    r.raise_for_status()
    return r.json()


def _resolve_color(
    raw_val: Any,
    mid: str,
    vars_by_id: Dict[str, Any],
    *,
    visited: set[str],
    depth: int = 0,
) -> Optional[Dict[str, Any]]:
    if depth > 12:
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


def _collect_variables(
    payload: Dict[str, Any],
) -> Tuple[Dict[str, Any], Dict[str, Any], Dict[str, str], Any]:
    meta = payload.get("meta") or {}
    variables = meta.get("variables") or {}
    collections = meta.get("variableCollections") or {}

    vars_by_id: Dict[str, Any] = {}
    for vid, v in variables.items():
        if isinstance(v, dict) and v.get("id"):
            vars_by_id[v["id"]] = v

    mode_id_to_theme: Dict[str, str] = {}
    for _cid, c in collections.items():
        for m in c.get("modes") or []:
            mid = m.get("modeId")
            theme = _theme_from_mode_name(m.get("name") or "")
            if mid and theme:
                mode_id_to_theme[mid] = theme

    def collection_name(collection_id: str) -> str:
        c = collections.get(collection_id) or {}
        return c.get("name") or ""

    return variables, vars_by_id, mode_id_to_theme, collection_name


def _variable_rows(
    variables: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    mode_id_to_theme: Dict[str, str],
    collection_name,
    *,
    collection_filter: str,
    resolved_type: Optional[str] = None,
) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for _vid, v in variables.items():
        if not isinstance(v, dict):
            continue
        if collection_name(v.get("variableCollectionId", "")) != collection_filter:
            continue
        if resolved_type and v.get("resolvedType") != resolved_type:
            continue
        web = _web_token_from_code_syntax(v.get("codeSyntax"))
        token = web or _path_name_to_token(v.get("name") or "")
        rows.append(
            {
                "name": v.get("name"),
                "token": token,
                "resolvedType": v.get("resolvedType"),
                "raw": v,
            }
        )
    return rows


def _color_light_dark(
    v: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    mode_id_to_theme: Dict[str, str],
) -> Tuple[Optional[str], Optional[str]]:
    raw_modes = v.get("valuesByMode") or {}
    light_hex: Optional[str] = None
    dark_hex: Optional[str] = None
    for mid, raw_val in raw_modes.items():
        theme = mode_id_to_theme.get(mid)
        visited: set[str] = set()
        vid = v.get("id")
        if isinstance(vid, str):
            visited.add(vid)
        resolved = _resolve_color(raw_val, mid, vars_by_id, visited=visited)
        hx = _rgba_to_css_color(resolved) if resolved else None
        if theme == "light" and hx:
            light_hex = hx
        elif theme == "dark" and hx:
            dark_hex = hx
    if light_hex is None and dark_hex is None and raw_modes:
        mid = next(iter(raw_modes.keys()))
        visited = set()
        vid = v.get("id")
        if isinstance(vid, str):
            visited.add(vid)
        resolved = _resolve_color(raw_modes[mid], mid, vars_by_id, visited=visited)
        hx = _rgba_to_css_color(resolved) if resolved else None
        return hx, hx
    return light_hex, dark_hex


def _float_display(v: Dict[str, Any]) -> str:
    raw_modes = v.get("valuesByMode") or {}
    if not raw_modes:
        return ""
    val = next(iter(raw_modes.values()))
    if isinstance(val, (int, float)):
        if float(val).is_integer():
            return str(int(val))
        return str(val)
    return str(val)


def _md_table_color_ld(headers: str, rows: List[Tuple[str, str, str]]) -> str:
    lines = [headers, "|---|---|---|"]
    for token, light, dark in rows:
        lines.append(f"| `{token}` | `{light}` | `{dark}` |")
    return "\n".join(lines) + "\n"


def _md_table_color_value(headers: str, rows: List[Tuple[str, str]]) -> str:
    lines = [headers, "|---|---|"]
    for token, val in rows:
        lines.append(f"| `{token}` | `{val}` |")
    return "\n".join(lines) + "\n"


def _md_table_two(headers: str, rows: List[Tuple[str, str]]) -> str:
    lines = [headers, "|---|---|"]
    for a, b in rows:
        lines.append(f"| {a} | `{b}` |")
    return "\n".join(lines) + "\n"


def build_markdown(payload: Dict[str, Any]) -> str:
    variables, vars_by_id, mode_id_to_theme, collection_name = _collect_variables(payload)  # type: ignore[misc]

    parts: List[str] = []
    parts.append(
        "<!-- ds:section id=primitive-static -->\n"
        "### Primitive palette (Figma — `Primitive` collection, COLOR)\n\n"
        f"> Auto-synced from Figma `GET /v1/files/{IDS_FILE_KEY}/variables/local`. "
        "Token column uses `codeSyntax.WEB` when present, otherwise a CSS name derived from the Figma variable path.\n\n"
    )

    prim_colors = _variable_rows(
        variables,
        vars_by_id,
        mode_id_to_theme,
        collection_name,
        collection_filter="Primitive",
        resolved_type="COLOR",
    )
    prim_colors.sort(key=lambda r: r["token"])
    # Figma may define duplicate paths; keep first row per token key.
    _seen_prim: set[str] = set()
    _deduped: List[Dict[str, Any]] = []
    for r in prim_colors:
        t = r["token"]
        if t in _seen_prim:
            continue
        _seen_prim.add(t)
        _deduped.append(r)
    prim_colors = _deduped

    single: List[Tuple[str, str]] = []
    dual: List[Tuple[str, str, str]] = []
    for r in prim_colors:
        v = r["raw"]
        lt, dk = _color_light_dark(v, vars_by_id, mode_id_to_theme)
        tok = r["token"]
        if lt and dk and lt.lower() == dk.lower():
            single.append((tok, lt))
        elif lt or dk:
            dual.append((tok, lt or "—", dk or "—"))
        else:
            dual.append((tok, "—", "—"))

    if single:
        parts.append("#### Single-mode (same value in all modes)\n\n")
        parts.append(
            _md_table_color_value("| Token | Value |", single),
        )
    if dual:
        parts.append("#### Theme-aware within Primitive collection\n\n")
        parts.append(_md_table_color_ld("| Token | Light | Dark |", dual))

    # Primitive color
    pc = _variable_rows(
        variables,
        vars_by_id,
        mode_id_to_theme,
        collection_name,
        collection_filter="Primitive color",
        resolved_type="COLOR",
    )
    if pc:
        parts.append("\n<!-- ds:section id=primitive-color -->\n### Primitive color (Figma — `Primitive color` collection)\n\n")
        pc.sort(key=lambda r: r["token"])
        _seen_pc: set[str] = set()
        rows2: List[Tuple[str, str, str]] = []
        for r in pc:
            t = r["token"]
            if t in _seen_pc:
                continue
            _seen_pc.add(t)
            lt, dk = _color_light_dark(r["raw"], vars_by_id, mode_id_to_theme)
            rows2.append((t, lt or "—", dk or "—"))
        parts.append(_md_table_color_ld("| Token | Light | Dark |", rows2))

    # Semantic
    sem = _variable_rows(
        variables,
        vars_by_id,
        mode_id_to_theme,
        collection_name,
        collection_filter="Semantic",
        resolved_type="COLOR",
    )
    if sem:
        parts.append("\n<!-- ds:section id=semantic-color -->\n### Semantic (Figma — `Semantic` collection, COLOR)\n\n")
        sem.sort(key=lambda r: r["token"])
        _seen_sem: set[str] = set()
        rows3: List[Tuple[str, str, str]] = []
        for r in sem:
            t = r["token"]
            if t in _seen_sem:
                continue
            _seen_sem.add(t)
            lt, dk = _color_light_dark(r["raw"], vars_by_id, mode_id_to_theme)
            rows3.append((t, lt or "—", dk or "—"))
        parts.append(_md_table_color_ld("| Token | Light | Dark |", rows3))

    # Tokens COLOR appendix
    tok_c = _variable_rows(
        variables,
        vars_by_id,
        mode_id_to_theme,
        collection_name,
        collection_filter="Tokens",
        resolved_type="COLOR",
    )
    tok_c.sort(key=lambda r: r["token"])
    _seen_tc: set[str] = set()
    _tok_c_u: List[Dict[str, Any]] = []
    for r in tok_c:
        t = r["token"]
        if t in _seen_tc:
            continue
        _seen_tc.add(t)
        _tok_c_u.append(r)
    tok_c = _tok_c_u

    parts.append(
        "\n<!-- ds:section id=tokens-color -->\n"
        "### Tokens collection — COLOR (Figma — `Tokens`)\n\n"
        "> Semantic color tokens from the IDS file. One row per variable; values resolved after alias chains.\n\n"
    )
    rows_t: List[Tuple[str, str, str]] = []
    for r in tok_c:
        lt, dk = _color_light_dark(r["raw"], vars_by_id, mode_id_to_theme)
        rows_t.append((r["token"], lt or "—", dk or "—"))
    parts.append(_md_table_color_ld("| Token | Light | Dark |", rows_t))

    # Tokens FLOAT (shadows)
    tok_f = _variable_rows(
        variables,
        vars_by_id,
        mode_id_to_theme,
        collection_name,
        collection_filter="Tokens",
        resolved_type="FLOAT",
    )
    tok_f.sort(key=lambda r: r["token"])
    parts.append(
        "\n<!-- ds:section id=tokens-float -->\n"
        "### Tokens collection — FLOAT (Figma — `Tokens`, e.g. shadow geometry)\n\n"
    )
    rows_f: List[Tuple[str, str]] = []
    for r in tok_f:
        web = r["token"]
        rows_f.append((web, _float_display(r["raw"])))
    parts.append(_md_table_color_value("| Token | Value |", rows_f))

    # Density Primitive
    dens = _variable_rows(
        variables,
        vars_by_id,
        mode_id_to_theme,
        collection_name,
        collection_filter="Density Primitive",
        resolved_type="FLOAT",
    )
    dens.sort(key=lambda r: r["name"] or "")
    parts.append(
        "\n<!-- ds:section id=density-primitive -->\n"
        "### Density Primitive (Figma — `Density Primitive`, FLOAT)\n\n"
        "> Vertical padding tokens for table density modes. These are not `--scale-*` names; use as documented in component specs.\n\n"
    )
    rows_d: List[Tuple[str, str]] = []
    for r in dens:
        rows_d.append((r["name"] or "—", _float_display(r["raw"])))
    parts.append(_md_table_two("| Figma variable name | Value |", rows_d))

    parts.append(
        "\n*Primitive FLOAT (non-color) in `Primitive` collection:*\n\n"
    )
    prim_f = _variable_rows(
        variables,
        vars_by_id,
        mode_id_to_theme,
        collection_name,
        collection_filter="Primitive",
        resolved_type="FLOAT",
    )
    prim_f.sort(key=lambda r: r["name"] or "")
    rows_pf: List[Tuple[str, str]] = [(r["name"] or "—", _float_display(r["raw"])) for r in prim_f]
    parts.append(_md_table_two("| Figma variable name | Value |", rows_pf))

    return "".join(parts)


def _replace_region(content: str, start: str, end: str, new_body: str) -> str:
    i = content.find(start)
    j = content.find(end)
    if i == -1 or j == -1 or j <= i:
        raise SystemExit(f"Could not find replacement region. start={start!r} end={end!r}")
    return content[:i] + new_body + content[j:]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--write",
        action="store_true",
        help=f"Write {ROOT_SPEC} (default: print markdown to stdout only)",
    )
    args = ap.parse_args()

    token = os.environ.get("FIGMA_TOKEN", "").strip()
    if not token:
        print("FIGMA_TOKEN is not set", file=sys.stderr)
        return 1

    payload = _fetch_local(IDS_FILE_KEY, token)
    md = build_markdown(payload)

    if not args.write:
        sys.stdout.write(md)
        return 0

    with open(ROOT_SPEC, "r", encoding="utf-8") as f:
        content = f.read()

    start = "<!-- ds:section id=primitive-static -->"
    end = "<!-- ds:section id=typography -->"
    block = md + "\n"
    new_content = _replace_region(content, start, end, block)

    # Replace primitive scale subsection inside spacing
    scale_start = "### Primitive scale (`Density Primitive` / scale collection)\n\n"
    scale_end = "<!-- ds:section id=border -->"
    if scale_start in new_content and scale_end in new_content:
        si = new_content.find(scale_start)
        ei = new_content.find(scale_end)
        replacement = (
            "### Figma-derived layout tokens\n\n"
            "> The previous `--scale-*` table was a generic placeholder. "
            "This file’s Figma **local variables** export uses **Density Primitive** FLOAT rows (above, under Density Primitive) "
            "and **Tokens** FLOAT rows for shadow geometry. For `--scale-*` / `--opacity-*` in CSS, regenerate `components/theme.css` from Figma or extend extraction to the **Density Token** collection if needed.\n\n"
        )
        new_content = new_content[:si] + replacement + new_content[ei:]

    with open(ROOT_SPEC, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Wrote {ROOT_SPEC}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
