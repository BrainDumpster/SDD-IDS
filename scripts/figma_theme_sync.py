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
CollectionMode = Literal["light_dark", "single", "multi_mode"]
EmitBucket = Literal["semantic", "primitive", "sizes", "density"]

_DENSITY_MODE_SUFFIX: Dict[str, str] = {
    "standard": "",
    "loose": "-loose",
    "compact": "-compact",
}


@dataclass(frozen=True)
class CollectionSyncProfile:
    """Sync every resolvable variable in a Figma collection (renames + new vars included)."""

    name: str
    mode: CollectionMode = "single"
    emit_bucket: EmitBucket = "sizes"
    overlay: bool = False
    prefer_local: bool = True
    collection_id_hint: str = ""
    mode_suffixes: Tuple[Tuple[str, str], ...] = ()


@dataclass(frozen=True)
class ProgrammeThemeConfig:
    programme: str
    figma_file_key: str
    output_paths: Tuple[Path, ...]
    figma_label: str
    collection_profiles: Tuple[CollectionSyncProfile, ...]
    excluded_collection_names: Tuple[str, ...] = ()
    css_emit_mode: CssEmitMode = "root"
    design_system_slug: str = ""
    include_ids_shadow_aliases: bool = False
    prefer_path_tokens: bool = True
    remap_border_width_tokens: bool = True
    header_extra: Tuple[str, ...] = ()

    @property
    def collection_notes(self) -> str:
        return ", ".join(p.name for p in self.collection_profiles)


SYNAPSE_COLLECTION_PROFILES: Tuple[CollectionSyncProfile, ...] = (
    CollectionSyncProfile("Primitive", mode="single", emit_bucket="primitive", prefer_local=True),
    CollectionSyncProfile(
        "Color Mode",
        mode="light_dark",
        emit_bucket="semantic",
        overlay=False,
        prefer_local=True,
    ),
    CollectionSyncProfile(
        "Tokens",
        mode="light_dark",
        emit_bucket="semantic",
        overlay=True,
        prefer_local=False,
    ),
    CollectionSyncProfile(
        "Sizes",
        mode="single",
        emit_bucket="sizes",
        prefer_local=True,
        collection_id_hint="50960:24167",
    ),
    CollectionSyncProfile(
        "Table density",
        mode="multi_mode",
        emit_bucket="density",
        prefer_local=True,
        mode_suffixes=tuple(_DENSITY_MODE_SUFFIX.items()),
    ),
)

SYNAPSE_CONFIG = ProgrammeThemeConfig(
    programme="synapse",
    figma_file_key="Td1bnsvRj1PCGs9RVJkIvJ",
    output_paths=(
        PROJECT / "components" / "synapse-theme.css",
        PROJECT / "storybook" / "src" / "synapse-theme.css",
    ),
    figma_label="Synapse Hi-Fi components",
    collection_profiles=SYNAPSE_COLLECTION_PROFILES,
    excluded_collection_names=(
        "M3",
        "Semantic",
        "Component",
        "Collection 1",
        "Collection",
        "4a) Type Size",
        "Shape",
        "Color mode",
        "1. Color modes",
        "Table Density",
        "Table/primitive",
        "_Primitives",
    ),
    css_emit_mode="root",
    include_ids_shadow_aliases=True,
    prefer_path_tokens=True,
    remap_border_width_tokens=False,
)

# IDS-fork Storybook/specs may reference numeric border-width aliases.
SYNAPSE_BORDER_WIDTH_LEGACY_ALIASES: Dict[str, str] = {
    "--border-width-border-1": "var(--border-width-border-default)",
    "--border-width-border-2": "var(--border-width-border-thick)",
    "--border-width-border-4": "var(--border-width-border-strong)",
    "--border-width-border-6": "var(--border-width-border-heavy)",
}

FIGMA_SIZES_COLLECTION_ID = "50960:24167"

# Canonical variable definitions live in IDS Variables Library (not REST-exportable).
# REST sync uses IDS Design Library, which subscribes to the published library.
IDS_VARIABLE_LIBRARY_KEY = "r0Ex6TumqcR3HINamsfXCV"
IDS_REST_EXPORT_FILE_KEY = "0bHk3XhrjFhowgFkz9yLr4"

# Programme layout aliases — not Figma global variables; ids-fork deltas referencing Sizes tokens.
SYNAPSE_PROGRAMME_LAYOUT_ALIASES: Dict[str, str] = {
    "--button-control-radius": "var(--corner-radius-radius-4)",
    "--button-focus-ring-radius": "var(--corner-radius-radius-6)",
    "--button-focus-ring-offset": "3px",
    "--dropdown-control-radius": "var(--corner-radius-radius-4)",
    "--dropdown-focus-ring-radius": "var(--corner-radius-radius-4)",
    "--dropdown-menu-radius": "var(--corner-radius-radius-4)",
    "--checkbox-control-radius": "var(--corner-radius-radius-2)",
    "--checkbox-label-font-weight": "400",
    "--radio-label-font-weight": "400",
    "--segmented-button-control-radius": "var(--corner-radius-radius-2)",
    "--alert-action-control-radius": "var(--corner-radius-radius-2)",
    "--card-control-radius": "var(--corner-radius-radius-10)",
    "--modal-control-radius": "var(--corner-radius-radius-16)",
    "--progress-bar-control-radius": "var(--corner-radius-radius-2)",
    "--date-picker-control-radius": "var(--corner-radius-radius-4)",
    "--date-picker-focus-ring-radius": "var(--corner-radius-radius-4)",
    "--time-picker-control-radius": "var(--corner-radius-radius-4)",
    "--time-picker-focus-ring-radius": "var(--corner-radius-radius-4)",
    "--text-box-control-radius": "var(--corner-radius-radius-4)",
    "--text-box-focus-ring-radius": "var(--corner-radius-radius-4)",
    "--toast-control-radius": "var(--corner-radius-radius-8)",
    "--tooltip-control-radius": "var(--corner-radius-radius-8)",
    "--suggested-prompt-radius": "var(--corner-radius-radius-8)",
    "--chat-input-shell-radius": "var(--corner-radius-radius-20)",
    "--chat-input-button-radius": "var(--corner-radius-radius-24)",
    "--chat-input-prompt-radius": "var(--suggested-prompt-radius)",
    "--chat-input-focus-ring-offset": "var(--scale-4)",
    "--chat-input-focus-ring-radius": "var(--corner-radius-radius-24)",
    "--chat-input-shell-min-height": "92px",
    "--chat-input-shell-max-height": "320px",
    "--chat-input-textarea-max-height": "252px",
}

IDS_COLLECTION_PROFILES: Tuple[CollectionSyncProfile, ...] = (
    CollectionSyncProfile("Primitive", mode="single", emit_bucket="primitive", prefer_local=True),
    CollectionSyncProfile(
        "Tokens",
        mode="light_dark",
        emit_bucket="semantic",
        overlay=False,
        prefer_local=True,
    ),
    CollectionSyncProfile("Sizes", mode="single", emit_bucket="sizes", prefer_local=True),
)

IDS_CONFIG = ProgrammeThemeConfig(
    programme="ids",
    figma_file_key=IDS_REST_EXPORT_FILE_KEY,
    output_paths=(PROJECT / "components" / "ids-theme.css",),
    figma_label="IDS Variables Library",
    collection_profiles=IDS_COLLECTION_PROFILES,
    css_emit_mode="ids_scoped",
    design_system_slug="ids",
    include_ids_shadow_aliases=True,
    prefer_path_tokens=True,
    remap_border_width_tokens=True,
    header_extra=(
        f" * Canonical Figma file: IDS Variables Library ({IDS_VARIABLE_LIBRARY_KEY}).",
        f" * REST export via IDS Design Library ({IDS_REST_EXPORT_FILE_KEY}).",
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


def _token_for_variable(
    v: Dict[str, Any],
    *,
    prefer_path: bool = False,
    remap_border_width: bool = True,
) -> str:
    path_tok = _path_name_to_token(v.get("name") or "")
    web_raw = _web_token_from_code_syntax(v.get("codeSyntax"))
    web_tok = _sanitize_css_token(web_raw) if web_raw else None
    if prefer_path and web_tok and web_tok != path_tok:
        chosen = path_tok
    else:
        chosen = _normalize_shadow_token(web_tok or path_tok)
    return _remap_border_width_token(chosen) if remap_border_width else chosen


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


def _resolve_scalar_raw(
    raw_val: Any,
    mid: str,
    vars_by_id: Dict[str, Any],
    *,
    visited: Set[str],
    depth: int = 0,
) -> Any:
    if depth > 18:
        return None
    if isinstance(raw_val, (str, bool, int, float)):
        return raw_val
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
        return _resolve_scalar_raw(nxt, mid, vars_by_id, visited=visited, depth=depth + 1)
    return None


def _string_for_mode(v: Dict[str, Any], mid: Optional[str], vars_by_id: Dict[str, Any]) -> Optional[str]:
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
    resolved = _resolve_scalar_raw(raw_val, mid, vars_by_id, visited=visited)
    if resolved is None:
        return None
    return str(resolved)


def _boolean_for_mode(v: Dict[str, Any], mid: Optional[str], vars_by_id: Dict[str, Any]) -> Optional[str]:
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
    resolved = _resolve_scalar_raw(raw_val, mid, vars_by_id, visited=visited)
    if isinstance(resolved, bool):
        return "1" if resolved else "0"
    if isinstance(resolved, (int, float)):
        return "1" if resolved else "0"
    return None


def _format_string_css(val: str) -> str:
    stripped = val.strip()
    if stripped.lower() in ("true", "false"):
        return stripped.lower()
    escaped = stripped.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{escaped}'"


def _format_size_float(token: str, val: float) -> str:
    if token.startswith("--opacity-"):
        if val > 1.0:
            return str(round(val / 100.0, 2)).rstrip("0").rstrip(".") if val % 10 else str(val / 100.0)
        return str(int(val)) if val == int(val) else str(val)
    if val == int(val):
        return f"{int(val)}px"
    return f"{val}px"


def _pick_canonical_collection_id(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    profile: CollectionSyncProfile,
) -> Optional[str]:
    """Pick one collection id when duplicate names exist (local vs published library)."""
    candidates: List[Tuple[int, int, str]] = []
    for cid, coll in collections.items():
        if (coll.get("name") or "") != profile.name:
            continue
        if profile.collection_id_hint and profile.collection_id_hint not in cid:
            continue
        count = sum(1 for v in variables.values() if v.get("variableCollectionId") == cid)
        if count == 0:
            continue
        remote = 1 if coll.get("remote") else 0
        candidates.append((count, remote, cid))
    if not candidates:
        return None
    candidates.sort(
        key=lambda row: (
            row[1] if profile.prefer_local else -row[1],
            -row[0],
        )
    )
    return candidates[0][2]


def _mode_suffix_map(profile: CollectionSyncProfile) -> Dict[str, str]:
    if profile.mode_suffixes:
        return dict(profile.mode_suffixes)
    return _DENSITY_MODE_SUFFIX


def _density_token_for_mode(base_token: str, mode_name: str, suffix_map: Dict[str, str]) -> str:
    suffix = suffix_map.get(mode_name.strip().lower())
    if suffix is None or not suffix:
        return base_token
    return f"{base_token}{suffix}"


def _is_shadow_token(token: str, v: Dict[str, Any]) -> bool:
    return token.startswith("--shadow") or (v.get("name") or "").startswith("Shadow/")


def _token_for_config(v: Dict[str, Any], config: ProgrammeThemeConfig) -> str:
    return _token_for_variable(
        v,
        prefer_path=config.prefer_path_tokens,
        remap_border_width=config.remap_border_width_tokens,
    )


def _store_light_dark_color(
    acc: Dict[str, Tuple[Optional[str], Optional[str]]],
    token: str,
    lt: Optional[str],
    dk: Optional[str],
    *,
    overlay: bool,
) -> None:
    if not overlay:
        if token not in acc:
            acc[token] = (lt, dk)
        return
    if lt is None and dk is None:
        return
    prev = acc.get(token)
    merged_lt = lt if lt is not None else (prev[0] if prev else None)
    merged_dk = dk if dk is not None else (prev[1] if prev else None)
    if merged_lt is None and merged_dk is None:
        return
    acc[token] = (merged_lt, merged_dk)


def _merge_profile_light_dark(
    profile: CollectionSyncProfile,
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    config: ProgrammeThemeConfig,
    colors_ld: Dict[str, Tuple[Optional[str], Optional[str]]],
    shadow_geom: Dict[str, str],
    invariant: Dict[str, str],
) -> int:
    cid = _pick_canonical_collection_id(variables, collections, profile)
    if not cid:
        return 0
    coll = collections.get(cid) or {}
    lid, did = _light_dark_mode_ids(coll)
    if not lid or not did:
        return 0
    synced = 0
    for v in variables.values():
        if not isinstance(v, dict) or v.get("variableCollectionId") != cid:
            continue
        token = _token_for_config(v, config)
        if not token.startswith("--"):
            continue
        rt = v.get("resolvedType")
        if rt == "COLOR":
            lt = _color_string_for_mode(v, lid, vars_by_id)
            dk = _color_string_for_mode(v, did, vars_by_id)
            if lt is None and dk is None:
                continue
            _store_light_dark_color(colors_ld, token, lt, dk, overlay=profile.overlay)
            synced += 1
        elif rt == "FLOAT":
            fv = _float_for_mode(v, lid, vars_by_id)
            if fv is None:
                fv = _float_for_mode(v, did, vars_by_id)
            if fv is None:
                continue
            formatted = _format_size_float(token, fv)
            if _is_shadow_token(token, v):
                if token not in shadow_geom:
                    shadow_geom[token] = formatted
                    synced += 1
            elif token not in invariant:
                invariant[token] = formatted
                synced += 1
        elif rt == "STRING":
            sv = _string_for_mode(v, lid, vars_by_id) or _string_for_mode(v, did, vars_by_id)
            if sv is None or token in invariant:
                continue
            invariant[token] = _format_string_css(sv)
            synced += 1
        elif rt == "BOOLEAN":
            bv = _boolean_for_mode(v, lid, vars_by_id) or _boolean_for_mode(v, did, vars_by_id)
            if bv is None or token in invariant:
                continue
            invariant[token] = bv
            synced += 1
    return synced


def _merge_profile_single(
    profile: CollectionSyncProfile,
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    config: ProgrammeThemeConfig,
    target: Dict[str, str],
    *,
    color_acc: Optional[Dict[str, str]] = None,
) -> int:
    cid = _pick_canonical_collection_id(variables, collections, profile)
    if not cid:
        return 0
    coll = collections.get(cid) or {}
    mid = _first_mode_id(coll)
    if not mid:
        return 0
    synced = 0
    for v in variables.values():
        if not isinstance(v, dict) or v.get("variableCollectionId") != cid:
            continue
        token = _token_for_config(v, config)
        if not token.startswith("--"):
            continue
        rt = v.get("resolvedType")
        if rt == "COLOR":
            hx = _color_string_for_mode(v, mid, vars_by_id)
            if not hx:
                continue
            bucket = color_acc if color_acc is not None else target
            if token not in bucket:
                bucket[token] = hx
                synced += 1
        elif rt == "FLOAT":
            fv = _float_for_mode(v, mid, vars_by_id)
            if fv is None or token in target:
                continue
            target[token] = _format_size_float(token, fv)
            synced += 1
        elif rt == "STRING":
            sv = _string_for_mode(v, mid, vars_by_id)
            if sv is None or token in target:
                continue
            target[token] = _format_string_css(sv)
            synced += 1
        elif rt == "BOOLEAN":
            bv = _boolean_for_mode(v, mid, vars_by_id)
            if bv is None or token in target:
                continue
            target[token] = bv
            synced += 1
    return synced


def _merge_profile_multi_mode(
    profile: CollectionSyncProfile,
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    config: ProgrammeThemeConfig,
    target: Dict[str, str],
) -> int:
    cid = _pick_canonical_collection_id(variables, collections, profile)
    if not cid:
        return 0
    coll = collections.get(cid) or {}
    suffix_map = _mode_suffix_map(profile)
    synced = 0
    for v in variables.values():
        if not isinstance(v, dict) or v.get("variableCollectionId") != cid:
            continue
        base_token = _token_for_config(v, config)
        if not base_token.startswith("--"):
            continue
        rt = v.get("resolvedType")
        for mode in coll.get("modes") or []:
            mode_name = (mode.get("name") or "").strip()
            mode_id = mode.get("modeId")
            if not mode_id:
                continue
            token = _density_token_for_mode(base_token, mode_name, suffix_map)
            if token in target:
                continue
            if rt == "FLOAT":
                fv = _float_for_mode(v, mode_id, vars_by_id)
                if fv is None:
                    continue
                target[token] = _format_size_float(token, fv)
                synced += 1
            elif rt == "STRING":
                sv = _string_for_mode(v, mode_id, vars_by_id)
                if sv is None:
                    continue
                target[token] = _format_string_css(sv)
                synced += 1
            elif rt == "BOOLEAN":
                bv = _boolean_for_mode(v, mode_id, vars_by_id)
                if bv is None:
                    continue
                target[token] = bv
                synced += 1
            elif rt == "COLOR":
                hx = _color_string_for_mode(v, mode_id, vars_by_id)
                if hx is None:
                    continue
                target[token] = hx
                synced += 1
    return synced


def _sync_collections_from_profiles(
    variables: Dict[str, Any],
    collections: Dict[str, Any],
    vars_by_id: Dict[str, Any],
    config: ProgrammeThemeConfig,
) -> Tuple[
    Dict[str, Tuple[Optional[str], Optional[str]]],
    Dict[str, str],
    Dict[str, str],
    Dict[str, str],
    Dict[str, str],
    Dict[str, str],
    Dict[str, str],
    Dict[str, int],
]:
    colors_ld: Dict[str, Tuple[Optional[str], Optional[str]]] = {}
    shadow_geom: Dict[str, str] = {}
    sizes: Dict[str, str] = {}
    density: Dict[str, str] = {}
    prim_colors: Dict[str, str] = {}
    prim_other: Dict[str, str] = {}
    semantic_invariant: Dict[str, str] = {}
    stats: Dict[str, int] = {}

    base_profiles = [p for p in config.collection_profiles if p.mode == "light_dark" and not p.overlay]
    overlay_profiles = [p for p in config.collection_profiles if p.mode == "light_dark" and p.overlay]
    other_profiles = [p for p in config.collection_profiles if p.mode != "light_dark"]

    for profile in base_profiles + overlay_profiles:
        stats[profile.name] = _merge_profile_light_dark(
            profile,
            variables,
            collections,
            vars_by_id,
            config,
            colors_ld,
            shadow_geom,
            semantic_invariant,
        )

    for profile in other_profiles:
        if profile.emit_bucket == "primitive":
            count = _merge_profile_single(
                profile,
                variables,
                collections,
                vars_by_id,
                config,
                prim_other,
                color_acc=prim_colors,
            )
        elif profile.emit_bucket == "sizes":
            count = _merge_profile_single(
                profile, variables, collections, vars_by_id, config, sizes
            )
        elif profile.emit_bucket == "density":
            count = _merge_profile_multi_mode(
                profile, variables, collections, vars_by_id, config, density
            )
        else:
            count = 0
        stats[profile.name] = count

    return colors_ld, shadow_geom, sizes, density, prim_colors, prim_other, semantic_invariant, stats


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
    Dict[str, str],
    Dict[str, str],
    Dict[str, int],
]:
    variables, collections, vars_by_id = _collect_meta(payload)

    (
        colors_ld,
        shadow_geom,
        sizes,
        density,
        prim_colors,
        prim_other,
        semantic_invariant,
        stats,
    ) = _sync_collections_from_profiles(variables, collections, vars_by_id, config)
    _dedupe_known_typos(colors_ld)
    _ensure_icon_standard_gray(colors_ld, prim_colors)

    return (
        colors_ld,
        shadow_geom,
        sizes,
        density,
        prim_colors,
        prim_other,
        semantic_invariant,
        stats,
    )


def _emit_token_block(lines: List[str], token_values: Dict[str, str]) -> None:
    for token in sorted(token_values.keys()):
        lines.append(f"  {token}: {token_values[token]};")


def emit_theme_css(
    config: ProgrammeThemeConfig,
    colors_ld: Dict[str, Tuple[Optional[str], Optional[str]]],
    shadow_geom: Dict[str, str],
    sizes: Dict[str, str],
    density: Dict[str, str],
    prim_colors: Dict[str, str],
    prim_other: Dict[str, str],
    semantic_invariant: Dict[str, str],
    *,
    collection_stats: Optional[Dict[str, int]] = None,
) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    lines: List[str] = []
    display = config.programme.upper() if config.programme == "ids" else config.programme.capitalize()
    lines.append("/*")
    lines.append(f" * {display} Design System — Global Theme Tokens")
    lines.append(f' * Auto-extracted from Figma "{config.figma_label}" variables.')
    lines.append(f" * Collections: {config.collection_notes}.")
    if collection_stats:
        stat_bits = ", ".join(f"{name}={count}" for name, count in collection_stats.items())
        lines.append(f" * Synced variables: {stat_bits}.")
    lines.append(f" * Last REST sync: {now}")
    lines.append(" * Strategy: full collection export (COLOR/FLOAT/STRING/BOOLEAN); Figma path → token name.")
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

    lines.append("  /* --- Primitive (Figma collection Primitive) --- */")
    _emit_token_block(lines, prim_colors)
    _emit_token_block(lines, prim_other)

    lines.append("  /* --- Semantic (Figma Color Mode + Tokens, light) --- */")
    light_semantic = {
        t: lt for t, (lt, _dk) in colors_ld.items() if lt and not t.startswith("--shadow")
    }
    _emit_token_block(lines, light_semantic)
    _emit_token_block(lines, semantic_invariant)

    lines.append("  /* --- Shadows (geometry + color, light) --- */")
    light_shadow_color = {t: lt for t, (lt, _dk) in colors_ld.items() if t.startswith("--shadow") and lt}
    _emit_token_block(lines, shadow_geom)
    _emit_token_block(lines, light_shadow_color)

    if config.include_ids_shadow_aliases:
        lines.append("  /* --- IDS dropdown shadow aliases --- */")
        lines.extend(_ids_shadow_alias_lines(shadow_geom))

    lines.append(f"  /* --- Sizes (Figma collection {FIGMA_SIZES_COLLECTION_ID}) --- */")
    _emit_token_block(lines, sizes)
    if config.programme == "synapse" and not config.remap_border_width_tokens:
        lines.append("  /* --- Sizes: legacy border-width numeric aliases (IDS-fork compat) --- */")
        for alias, target in sorted(SYNAPSE_BORDER_WIDTH_LEGACY_ALIASES.items()):
            lines.append(f"  {alias}: {target};")

    if density:
        lines.append("  /* --- Table density (Standard / Loose / Compact modes) --- */")
        _emit_token_block(lines, density)

    if config.programme == "synapse":
        lines.append("  /* --- Programme layout aliases (ids-fork; reference Sizes tokens above) --- */")
        _emit_token_block(lines, SYNAPSE_PROGRAMME_LAYOUT_ALIASES)

    lines.append("}")
    lines.append("")

    lines.append("/* ========================================================")
    lines.append("   DARK THEME")
    lines.append("   ======================================================== */")
    lines.append("")
    lines.append(f"{dark_selector()} {{")

    if config.css_emit_mode == "ids_scoped":
        lines.append("  /* --- Primitive (unchanged) --- */")
        _emit_token_block(lines, prim_colors)
        _emit_token_block(lines, prim_other)

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
    (
        colors_ld,
        shadow_geom,
        sizes,
        density,
        prim_colors,
        prim_other,
        semantic_invariant,
        collection_stats,
    ) = build_theme_maps(payload, config)
    counts = {
        "colors_ld": len(colors_ld),
        "shadow_geom": len(shadow_geom),
        "sizes": len(sizes),
        "density": len(density),
        "prim_colors": len(prim_colors),
        "prim_other": len(prim_other),
        "collections": collection_stats,
    }
    if dry_run:
        return counts

    css = emit_theme_css(
        config,
        colors_ld,
        shadow_geom,
        sizes,
        density,
        prim_colors,
        prim_other,
        semantic_invariant,
        collection_stats=collection_stats,
    )
    for path in config.output_paths:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(css, encoding="utf-8")
    return counts


def figma_token_from_env() -> str:
    token = os.environ.get("FIGMA_TOKEN", "").strip()
    if not token:
        raise RuntimeError("FIGMA_TOKEN is not set (e.g. set -a && . ./.env && set +a)")
    return token
