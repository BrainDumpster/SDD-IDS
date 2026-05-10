#!/usr/bin/env python3
from __future__ import annotations

import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional, Set, Tuple

import requests

BASE_URL = "https://api.figma.com/v1"
IDS_AI_FILE_KEY = "rr8F0NGA6RNY9Z0cNeh3jh"
PROJECT = Path(__file__).resolve().parent.parent
OUT_THEME = PROJECT / "components" / "ids-ai-theme.css"

# Higher number means higher precedence during token-name collisions.
# IDS-AI semantic colors are authored in "Color Mode" (Light/Dark); entries in "Tokens"
# often alias remote library variables that are not present in variables/local, so
# resolution fails and light values would be dropped if Tokens wins. Prefer Color Mode
# when the same --token name exists in both (see Figma file variable set Color Mode).
COLLECTION_PRIORITY = {
    "Color Mode": 600,
    "Tokens": 500,
    "Primitive": 400,
    "Density Primitive": 300,
    "Semantic": 250,
    "Primitive color": 240,
}

AccumVal = Tuple[Optional[str], Optional[str], Optional[str], int, bool]


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
    parts = [p.strip().lower().replace(" ", "-") for p in (name or "").split("/") if p.strip()]
    return "--" + "-".join(parts)


def _sanitize_token(token: str) -> str:
    """Normalize path- / codeSyntax-derived tokens for valid CSS custom properties."""
    t = token.replace("m<ajor", "major")
    # Figma opacity paths often use "0%", "10%", … — `%` is not a valid identifier char.
    t = re.sub(r"(\d+)%", r"\1", t)
    if "%" in t:
        t = t.replace("%", "-pct")
    return t


def _token_for_variable(v: Dict[str, Any]) -> str:
    """
    Prefer path-derived `--token` when it disagrees with codeSyntax.WEB.
    Figma sometimes binds the wrong WEB name (e.g. Neutral-Light → var(--color-icon-neutral)),
    which would collide with Color/Icon/Neutral and corrupt Light theme values.
    """
    path_tok = _sanitize_token(_path_name_to_token(v.get("name", "")))
    web_raw = _web_token_from_code_syntax(v.get("codeSyntax"))
    web_tok = _sanitize_token(web_raw) if web_raw else None
    if web_tok and web_tok != path_tok:
        return path_tok
    return web_tok or path_tok


def _figma_name_has_typo_char(v: Dict[str, Any]) -> bool:
    return "<" in str(v.get("name") or "")


def _fetch_local(file_key: str, token: str) -> Dict[str, Any]:
    url = f"{BASE_URL}/files/{file_key}/variables/local"
    r = requests.get(url, headers={"X-Figma-Token": token}, timeout=180)
    r.raise_for_status()
    return r.json()


def _mode_kind(name: str) -> Optional[str]:
    n = (name or "").strip().lower()
    if n.startswith("light"):
        return "light"
    if n.startswith("dark"):
        return "dark"
    return None


def _resolve_any(
    raw_val: Any,
    mode_id: str,
    vars_by_id: Dict[str, Any],
    *,
    visited: Set[str],
    depth: int = 0,
) -> Optional[Any]:
    if depth > 16:
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
        nxt = ref_vals.get(mode_id)
        if nxt is None and ref_vals:
            nxt = next(iter(ref_vals.values()))
        return _resolve_any(nxt, mode_id, vars_by_id, visited=visited, depth=depth + 1)
    return raw_val


def _format_value(token: str, resolved_type: str, val: Any) -> Optional[str]:
    if val is None:
        return None
    if resolved_type == "COLOR":
        return _rgba_to_css_color(val) if isinstance(val, dict) else None
    if resolved_type == "BOOLEAN":
        return "true" if bool(val) else "false"
    if resolved_type == "STRING":
        return str(val)
    if resolved_type == "FLOAT":
        if not isinstance(val, (int, float)):
            return None
        fv = float(val)
        if token.startswith("--opacity-"):
            if fv > 1.0:
                return f"{fv/100.0:g}"
            return f"{fv:g}"
        if "font-weight" in token:
            return f"{int(fv) if fv.is_integer() else fv:g}"
        if token.endswith("-z-index") or token.startswith("--z-index-"):
            return f"{int(fv) if fv.is_integer() else fv:g}"
        return f"{int(fv)}px" if fv.is_integer() else f"{fv:g}px"
    return str(val)


def _ids_ai_semantic_alias_declarations(accum: Dict[str, AccumVal]) -> list[str]:
    """
    IDS-AI baseline: specs use canonical semantic names; Figma WEB exports may omit
    bare aliases and only emit numbered tokens (e.g. *-info-1). Emit var() aliases
    in the default (light) block only — dark overrides on numbered tokens still apply.
    """
    pairs: list[tuple[str, str]] = [
        ("--color-background-alerting-info", "--color-background-alerting-info-1"),
        ("--color-background-alerting-success", "--color-background-alerting-success-1"),
        ("--color-icon-alerting-info", "--color-icon-alerting-info-1"),
        ("--color-icon-alerting-success", "--color-icon-alerting-success-1"),
        ("--color-border-alerting-warning-accessible", "--color-border-alerting-minor-minor"),
    ]
    lines: list[str] = [
        "",
        "  /* IDS-AI semantic aliases: spec-canonical → Figma export (when bare name missing) */",
    ]
    for canonical, source in pairs:
        if source not in accum:
            continue
        if canonical in accum:
            continue
        lines.append(f"  {canonical}: var({source});")
    if len(lines) <= 2:
        return []
    return lines


def _ids_ai_dark_semantic_alias_declarations() -> list[str]:
    """
    Dark-mode values Figma variables/local sometimes omits while specs expect a contrast flip
    (aligned with legacy IDS theme dark block).
    """
    lines: list[str] = [
        "",
        "  /* IDS-AI dark semantic fills: spec parity when Figma omits dark mode entry */",
        "  --color-icon-neutral-strong: #b8c1c9;",
        "  --color-text-neutral-strong: #e6e9ec;",
    ]
    return lines


def build_css_from_accum(
    accum: Dict[str, AccumVal], *, now: str
) -> str:
    lines = [
        f"/* Auto-generated from IDS-AI Figma variables/local ({IDS_AI_FILE_KEY}) */",
        f"/* Last sync: {now} */",
        "/* Light theme: default block below (matches Figma Color Mode → Light). Dark: [data-theme=\"dark\"] overrides. */",
        "/* Variable set priority on name collisions: Color Mode > Tokens (remote Token aliases often unresolved locally). */",
        "",
        'html[data-design-system="ids-ai"],',
        'body[data-design-system="ids-ai"],',
        'html[data-design-system="dap"],',
        'body[data-design-system="dap"] {',
    ]
    for token in sorted(accum.keys()):
        light, dark, single, _, _ = accum[token]
        base = light or single or dark
        if base:
            lines.append(f"  {token}: {base};")
    lines.extend(_ids_ai_semantic_alias_declarations(accum))
    lines.append("}")
    lines.append("")
    lines.append('html[data-design-system="ids-ai"][data-theme="dark"],')
    lines.append('body[data-design-system="ids-ai"][data-theme="dark"],')
    lines.append('html[data-design-system="dap"][data-theme="dark"],')
    lines.append('body[data-design-system="dap"][data-theme="dark"] {')
    for token in sorted(accum.keys()):
        light, dark, _single, _, _ = accum[token]
        if dark and dark != light:
            lines.append(f"  {token}: {dark};")
    lines.extend(_ids_ai_dark_semantic_alias_declarations())
    lines.append("}")
    lines.append("")
    return "\n".join(lines)


def build_css(payload: Dict[str, Any]) -> str:
    meta = payload.get("meta") or {}
    variables = meta.get("variables") or {}
    collections = meta.get("variableCollections") or {}

    vars_by_id: Dict[str, Any] = {}
    for _k, v in variables.items():
        if isinstance(v, dict) and v.get("id"):
            vars_by_id[v["id"]] = v

    mode_kind_by_id: Dict[str, str] = {}
    for _cid, c in collections.items():
        for m in c.get("modes") or []:
            mid = m.get("modeId")
            mk = _mode_kind(m.get("name") or "")
            if mid and mk:
                mode_kind_by_id[mid] = mk

    accum: Dict[str, AccumVal] = {}

    for _vid, v in variables.items():
        if not isinstance(v, dict):
            continue
        token = _token_for_variable(v)
        if not token.startswith("--"):
            continue
        cid = v.get("variableCollectionId")
        cname = (collections.get(cid) or {}).get("name", "")
        priority = COLLECTION_PRIORITY.get(cname, 100)
        rtype = str(v.get("resolvedType") or "")
        values_by_mode = v.get("valuesByMode") or {}
        from_typo_name = _figma_name_has_typo_char(v)

        light_val: Optional[str] = None
        dark_val: Optional[str] = None
        single_val: Optional[str] = None

        for mid, raw in values_by_mode.items():
            visited: Set[str] = set()
            vid = v.get("id")
            if isinstance(vid, str):
                visited.add(vid)
            resolved = _resolve_any(raw, mid, vars_by_id, visited=visited)
            fmt = _format_value(token, rtype, resolved)
            if not fmt:
                continue
            mk = mode_kind_by_id.get(mid)
            if mk == "light":
                light_val = fmt
            elif mk == "dark":
                dark_val = fmt
            elif single_val is None:
                single_val = fmt

        if light_val is None and dark_val is None and single_val is None:
            continue

        prev = accum.get(token)
        if prev:
            _pl, _pd, _ps, prev_pri, prev_typo = prev
            if from_typo_name:
                continue
            if not prev_typo and prev_pri > priority:
                continue
        accum[token] = (light_val, dark_val, single_val, priority, from_typo_name)

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return build_css_from_accum(accum, now=now)


def main() -> int:
    token = os.environ.get("FIGMA_TOKEN", "").strip()
    if not token:
        print("FIGMA_TOKEN is not set", file=sys.stderr)
        return 1
    payload = _fetch_local(IDS_AI_FILE_KEY, token)
    css = build_css(payload)
    OUT_THEME.write_text(css, encoding="utf-8")
    print(f"Wrote {OUT_THEME}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

