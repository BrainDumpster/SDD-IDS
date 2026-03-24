#!/usr/bin/env python3
"""Compare generated Accordion CSS vars against live Figma values."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path("/home/muthu/projects/ids_design_knowledge")
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ingestion.figma_sync_client import extract_file_key_and_node_id
from ingestion.figma_variables_rest import fetch_variables

MAP_PATH = ROOT / "data" / "component-figma-map.json"
DEFAULT_CSS = ROOT / "generated-components" / "accordion-global-vars.css"


def _load_accordion_figma_url() -> str:
    rows = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    accordion = next(r for r in rows if r.get("component") == "Accordion")
    return accordion["figmaUrl"]


def _parse_css_vars(css_text: str, selector: str) -> dict[str, str]:
    m = re.search(rf"{re.escape(selector)}\s*\{{(?P<body>.*?)\}}", css_text, flags=re.S)
    if not m:
        return {}
    body = m.group("body")
    out: dict[str, str] = {}
    for ln in body.splitlines():
        mm = re.search(r"^\s*(--[a-z0-9\-]+)\s*:\s*([^;]+)\s*;", ln.strip(), flags=re.I)
        if mm:
            out[mm.group(1).strip()] = mm.group(2).strip().upper()
    return out


def _figma_token_maps() -> tuple[dict[str, set[str]], dict[str, set[str]]]:
    file_key, _ = extract_file_key_and_node_id(_load_accordion_figma_url())
    vars_norm = fetch_variables(file_key, mode="both")

    light: dict[str, set[str]] = {}
    dark: dict[str, set[str]] = {}
    for v in vars_norm:
        code = v.get("codeSyntax")
        if not isinstance(code, str) or not code.startswith("var(--"):
            continue
        name = code[4:-1]
        vals = v.get("valuesByTheme") or {}
        lv = vals.get("light")
        dv = vals.get("dark")
        if lv is not None:
            light.setdefault(name, set()).add(str(lv).upper())
        if dv is not None:
            dark.setdefault(name, set()).add(str(dv).upper())
        elif lv is not None:
            dark.setdefault(name, set()).add(str(lv).upper())
    return light, dark


def main() -> int:
    ap = argparse.ArgumentParser(description="Check Accordion CSS token drift against Figma")
    ap.add_argument("--css", type=Path, default=DEFAULT_CSS)
    ap.add_argument("--strict", action="store_true", help="Exit non-zero on any mismatch")
    args = ap.parse_args()

    if not args.css.exists():
        raise SystemExit(f"CSS file not found: {args.css}")
    css = args.css.read_text(encoding="utf-8")

    css_light = _parse_css_vars(css, ":root")
    css_dark = _parse_css_vars(css, "[data-theme=\"dark\"], .theme-dark")
    figma_light, figma_dark = _figma_token_maps()

    checked = 0
    mismatches: list[str] = []
    missing_in_figma: list[str] = []

    for name, val in css_light.items():
        checked += 1
        fvs = figma_light.get(name)
        if fvs is None:
            missing_in_figma.append(f"light {name}={val}")
        elif val not in fvs:
            mismatches.append(f"light {name}: css={val} figma={sorted(fvs)}")

    for name, val in css_dark.items():
        checked += 1
        fvs = figma_dark.get(name)
        if fvs is None:
            missing_in_figma.append(f"dark {name}={val}")
        elif val not in fvs:
            mismatches.append(f"dark {name}: css={val} figma={sorted(fvs)}")

    print(f"checked vars: {checked}")
    print(f"mismatches: {len(mismatches)}")
    print(f"missing in figma map: {len(missing_in_figma)}")

    if mismatches:
        print("\n-- mismatches --")
        for row in mismatches[:200]:
            print(row)
    if missing_in_figma:
        print("\n-- missing in figma map --")
        for row in missing_in_figma[:200]:
            print(row)

    if args.strict and mismatches:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
