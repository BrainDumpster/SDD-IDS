"""
Fetch and normalize Figma variables via REST endpoints:

- GET /v1/files/{file_key}/variables/published
- GET /v1/files/{file_key}/variables/local

The normalization produced by this module is designed to be consumed by
scripts that need to map vision-extracted hex colors to `var(--...)` tokens.
"""

from __future__ import annotations

from typing import Any, Dict, Iterable, List, Literal, Optional, Tuple

import requests

from config.settings import settings

FigmaColorTheme = Literal["light", "dark"]
VariableMode = Literal["published", "local", "both"]


BASE_URL = "https://api.figma.com/v1"


def _rgba_to_css_color(v: Dict[str, Any]) -> Optional[str]:
    """
    Convert a Figma color value dict {r,g,b,a} where r/g/b are 0..1 into:
    - #rrggbb for opaque colors
    - rgba(rr,gg,bb,aa) for semi-transparent colors
    """
    if not isinstance(v, dict):
        return None
    if not all(k in v for k in ("r", "g", "b")):
        return None
    r = int(round((v.get("r", 0) or 0) * 255))
    g = int(round((v.get("g", 0) or 0) * 255))
    b = int(round((v.get("b", 0) or 0) * 255))
    a = v.get("a", 1)

    try:
        a_f = float(a)
    except Exception:
        a_f = 1.0

    if a_f is not None and a_f < 1.0:
        return f"rgba({r},{g},{b},{a_f:.2f})"
    return f"#{r:02x}{g:02x}{b:02x}"


def _hex_from_css_color(css: str) -> Optional[str]:
    """
    Extract a #rrggbb from a normalized CSS color string.
    Returns None if the input isn't representable as a hex RGB color.
    """
    if not css:
        return None
    css = css.strip().lower()
    if css.startswith("#") and len(css) == 7:
        return css
    return None


def _normalize_code_syntax(code_syntax: Any) -> Optional[str]:
    """
    Figma returns `codeSyntax` often as:
      {"WEB": "var(--color-text-neutral)", ...}
    Sometimes it can be empty {}.
    """
    if code_syntax is None:
        return None
    if isinstance(code_syntax, str):
        return code_syntax.strip() or None
    if isinstance(code_syntax, dict):
        # Prefer WEB.
        web = code_syntax.get("WEB")
        if isinstance(web, str) and web.strip():
            return web.strip()
        # Otherwise, take the first non-empty value.
        for v in code_syntax.values():
            if isinstance(v, str) and v.strip():
                return v.strip()
    return None


def _theme_from_mode_name(mode_name: str) -> Optional[FigmaColorTheme]:
    """
    Map Figma variable mode name -> our Light/Dark theme label.
    Supports variants like "Light High Contrast".
    """
    n = (mode_name or "").strip().lower()
    if n.startswith("light"):
        return "light"
    if n.startswith("dark"):
        return "dark"
    return None


def _fetch_json(url: str, *, token: str, timeout_s: int) -> Dict[str, Any]:
    r = requests.get(url, headers={"X-Figma-Token": token}, timeout=timeout_s)
    r.raise_for_status()
    return r.json()


def _merge_raw_by_name(
    published_vars: Dict[str, Any],
    local_vars: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Merge variable payloads by variable "name".

    Prefer published when present, but keep local values when published omits
    values for a variable.
    """
    published_by_name = {
        (v or {}).get("name"): v for v in published_vars.values() if isinstance(v, dict)
    }
    local_by_name = {
        (v or {}).get("name"): v for v in local_vars.values() if isinstance(v, dict)
    }

    merged: Dict[str, Any] = {}
    for name in set(local_by_name) | set(published_by_name):
        pv = published_by_name.get(name)
        lv = local_by_name.get(name)
        if pv and isinstance(pv, dict) and lv and isinstance(lv, dict):
            # Keep local values if published valuesByMode is missing/empty.
            pv_vals = pv.get("valuesByMode")
            if not pv_vals:
                merged[name] = {**pv, "valuesByMode": lv.get("valuesByMode")}
            else:
                merged[name] = pv
        else:
            merged[name] = pv if pv is not None else lv

    # Drop any accidental None keys.
    merged.pop(None, None)
    return merged


def fetch_variables(
    file_key: str,
    mode: VariableMode = "both",
    *,
    timeout_s: int = 120,
) -> List[Dict[str, Any]]:
    """
    Fetch variables and normalize into a list.

    Returned variable dict shape:
      - name
      - id
      - resolvedType
      - variableCollectionId
      - variableCollectionName
      - codeSyntax (preferred WEB var(--...))
      - codeSyntaxByTheme (fallback when codeSyntax missing)
      - valuesByMode (modeId -> normalized color string, e.g. #rrggbb or rgba(...))
      - valuesByTheme (light/dark -> normalized color string)
    """
    if not settings.figma_token:
        raise RuntimeError("FIGMA_TOKEN is not set")

    token = settings.figma_token
    published_url = f"{BASE_URL}/files/{file_key}/variables/published"
    local_url = f"{BASE_URL}/files/{file_key}/variables/local"

    published_payload: Dict[str, Any] = {}
    local_payload: Dict[str, Any] = {}

    if mode in ("published", "both"):
        published_payload = _fetch_json(published_url, token=token, timeout_s=timeout_s)
    if mode in ("local", "both"):
        local_payload = _fetch_json(local_url, token=token, timeout_s=timeout_s)

    published_vars = (published_payload.get("meta") or {}).get("variables") or {}
    local_vars = (local_payload.get("meta") or {}).get("variables") or {}
    published_cols = (published_payload.get("meta") or {}).get("variableCollections") or {}
    local_cols = (local_payload.get("meta") or {}).get("variableCollections") or {}

    # Mode id -> theme label (Light/Dark) is driven by variableCollections.modes.
    # Prefer local mode metadata (published may be empty).
    cols_for_modes = local_cols or published_cols or {}
    mode_id_to_theme: Dict[str, FigmaColorTheme] = {}
    for _cid, c in cols_for_modes.items():
        for m in c.get("modes") or []:
            mid = m.get("modeId")
            theme = _theme_from_mode_name(m.get("name") or "")
            if mid and theme:
                mode_id_to_theme[mid] = theme

    def collection_name_for(collection_id: str) -> str:
        all_cols = local_cols or published_cols or {}
        c = (all_cols or {}).get(collection_id) or {}
        return c.get("name", "") or ""

    # Merge by token name.
    if mode == "both":
        raw_by_name = _merge_raw_by_name(published_vars, local_vars)
    elif mode == "published":
        raw_by_name = {((v or {}).get("name")): v for v in published_vars.values() if isinstance(v, dict)}
    else:
        raw_by_name = {((v or {}).get("name")): v for v in local_vars.values() if isinstance(v, dict)}

    # Build id -> raw variable mapping for alias resolution.
    vars_by_id: Dict[str, Any] = {}
    for _id, rv in {**local_vars, **published_vars}.items():
        if isinstance(rv, dict):
            vars_by_id[_id] = rv

    out: List[Dict[str, Any]] = []
    for _name, v in raw_by_name.items():
        if not isinstance(v, dict):
            continue
        resolved_type = v.get("resolvedType")
        values_by_mode_raw = v.get("valuesByMode") or {}

        def resolve_alias(mid: str, raw_val: Any, *, visited: set[str], depth: int = 0) -> Any:
            """
            Resolve VARIABLE_ALIAS chains until we reach a value that looks like
            a direct RGBA dict, or until we run out / hit a cycle.
            """
            if depth > 10:
                return raw_val
            if isinstance(raw_val, dict) and raw_val.get("type") == "VARIABLE_ALIAS":
                alias_id = raw_val.get("id")
                if not alias_id or alias_id in visited:
                    return raw_val
                ref_var = vars_by_id.get(alias_id)
                if not isinstance(ref_var, dict):
                    return raw_val
                visited.add(alias_id)
                ref_vals = ref_var.get("valuesByMode") or {}
                # Prefer the same modeId; if absent, fall back to first available.
                next_raw = ref_vals.get(mid)
                if next_raw is None and ref_vals:
                    next_raw = next(iter(ref_vals.values()))
                return resolve_alias(mid, next_raw, visited=visited, depth=depth + 1)
            return raw_val

        values_by_mode: Dict[str, str] = {}
        values_by_theme: Dict[FigmaColorTheme, str] = {}

        for mid, raw_val in values_by_mode_raw.items():
            if resolved_type == "COLOR":
                visited: set[str] = set()
                current_id = v.get("id")
                if isinstance(current_id, str):
                    visited.add(current_id)
                resolved_val = resolve_alias(mid, raw_val, visited=visited)

                css_color = _rgba_to_css_color(resolved_val if isinstance(resolved_val, dict) else {})
                if css_color:
                    values_by_mode[mid] = css_color
                # If we can't resolve to an RGBA-like dict, skip; we don't want
                # to silently turn it into #000000.
                theme = mode_id_to_theme.get(mid)
                if theme and css_color:
                    values_by_theme[theme] = css_color
            else:
                # Keep non-color values as stringified form; patcher currently
                # only needs COLOR values.
                resolved_val = resolve_alias(mid, raw_val, visited={v.get("id")})
                values_by_mode[mid] = str(resolved_val)
                theme = mode_id_to_theme.get(mid)
                if theme:
                    values_by_theme[theme] = values_by_mode[mid]

        code_syntax = _normalize_code_syntax(v.get("codeSyntax"))

        # Fallback: if Figma doesn't provide codeSyntax, derive a token
        # from the resolved hex value.
        code_syntax_by_theme: Dict[FigmaColorTheme, str] = {}
        if code_syntax:
            code_syntax_by_theme = {}
        else:
            for theme, color_str in values_by_theme.items():
                hx = _hex_from_css_color(color_str)
                if hx:
                    # Repo convention used elsewhere: `var(--color-<hex>)`.
                    code_syntax_by_theme[theme] = f"var(--color-{hx.lstrip('#')})"

        out.append(
            {
                "name": v.get("name") or _name,
                "id": v.get("id"),
                "resolvedType": resolved_type,
                "variableCollectionId": v.get("variableCollectionId"),
                "variableCollectionName": collection_name_for(v.get("variableCollectionId", "")),
                "codeSyntax": code_syntax,
                "codeSyntaxByTheme": code_syntax_by_theme,
                "valuesByMode": values_by_mode,
                "valuesByTheme": values_by_theme,
            }
        )

    return out

