#!/usr/bin/env python3
"""
Export IDS Foundations token catalogs for Storybook from components/ids-theme.css.

Source of truth mirrors Figma IDS Variables Library collections:
  - Primitive  → Foundations / Design tokens / Primitives
  - Color Modes, Sizes, Shadows → Foundations / Design tokens / Semantic

Usage:
  python3 scripts/export_ids_foundation_tokens.py
"""

from __future__ import annotations

import json
import re
from collections import OrderedDict
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
THEME_CSS = PROJECT / "components" / "ids-theme.css"
OUT_JSON = PROJECT / "storybook-shared" / "foundations" / "foundation-tokens.json"
OUT_JS = PROJECT / "storybook-shared" / "foundations" / "foundation-tokens.js"
ICONS_DIR = PROJECT / "assets" / "icons"


def parse_block(text: str) -> OrderedDict[str, str]:
    props: OrderedDict[str, str] = OrderedDict()
    for m in re.finditer(r"(--[\w-]+)\s*:\s*([^;]+);", text):
        props[m.group(1)] = m.group(2).strip()
    return props


def parse_sections(block: str) -> OrderedDict[str, OrderedDict[str, str]]:
    sections: OrderedDict[str, OrderedDict[str, str]] = OrderedDict()
    cur: str | None = None
    for line in block.splitlines():
        cm = re.search(r"/\*\s*---\s*(.*?)\s*---\s*\*/", line)
        if cm:
            cur = cm.group(1).strip()
            sections[cur] = OrderedDict()
            continue
        pm = re.match(r"\s*(--[\w-]+)\s*:\s*([^;]+);", line)
        if pm and cur is not None:
            sections[cur][pm.group(1)] = pm.group(2).strip()
    return sections


def primitive_group(name: str) -> str:
    n = name[2:] if name.startswith("--") else name
    rules = (
        ("alert-", "Alert"),
        ("secondary-palette-", "Secondary Palette"),
        ("ui-palette-", "UI Palette"),
        ("opacity-", "Opacity"),
        ("scale-", "Scale"),
        ("typography-", "Typography"),
        ("ui-icon-spacing-", "UI Icon Spacing"),
        ("white", "White"),
    )
    for prefix, group in rules:
        if n == prefix.rstrip("-") or n.startswith(prefix):
            return group
    return "Other"


def semantic_group(name: str) -> str:
    n = name[2:] if name.startswith("--") else name
    if n == "annotation":
        return "Annotation"
    m = re.match(r"color-([a-z]+)-", n)
    if m:
        cat = m.group(1)
        mapping = {
            "background": "Color / Background",
            "border": "Color / Border",
            "text": "Color / Text",
            "icon": "Color / Icon",
            "focus": "Color / Focus",
            "shadow": "Color / Shadow",
            "chart": "Color / Chart",
            "link": "Color / Link",
            "overlay": "Color / Overlay",
            "data": "Color / Data",
            "gradient": "Color / Gradient",
            "static": "Color / Static",
        }
        return mapping.get(cat, f"Color / {cat.title()}")
    if n.startswith("shadow-"):
        return "Shadow"
    return "Other"


def main() -> None:
    css = THEME_CSS.read_text(encoding="utf-8")
    light_m = re.search(
        r'html\[data-design-system="ids"\],\s*body\[data-design-system="ids"\]\s*\{(.*?)\n\}',
        css,
        re.S,
    )
    dark_m = re.search(
        r'html\[data-design-system="ids"\]\[data-theme="dark"\].*?\{(.*?)\n\}',
        css,
        re.S,
    )
    if not light_m or not dark_m:
        raise SystemExit("Could not parse light/dark blocks from ids-theme.css")

    dark = parse_block(dark_m.group(1))
    sections = parse_sections(light_m.group(1))

    prim_key = next(k for k in sections if k.lower().startswith("primitive"))
    sem_key = next(k for k in sections if "semantic" in k.lower() or "color mode" in k.lower())
    sizes_key = next((k for k in sections if k.lower().startswith("sizes")), None)
    comp_key = next((k for k in sections if "component layout" in k.lower()), None)

    prim_groups: OrderedDict[str, list] = OrderedDict()
    for tok, val in sections[prim_key].items():
        prim_groups.setdefault(primitive_group(tok), []).append({"name": tok, "value": val})

    sem_groups: OrderedDict[str, list] = OrderedDict()
    for tok, val in sections[sem_key].items():
        sem_groups.setdefault(semantic_group(tok), []).append(
            {"name": tok, "light": val, "dark": dark.get(tok, val)}
        )

    if sizes_key:
        sem_groups["Sizes"] = [
            {"name": k, "light": v, "dark": dark.get(k, v)}
            for k, v in sections[sizes_key].items()
        ]
    for k, sec in sections.items():
        if "shadow" in k.lower() and "semantic" not in k.lower():
            label = k.split("(")[0].strip()
            if label == "Shadows":
                sem_groups[label] = [
                    {"name": n, "light": v, "dark": dark.get(n, v)} for n, v in sec.items()
                ]

    component_groups: OrderedDict[str, list] = OrderedDict()
    if comp_key:
        component_groups["Component layout aliases"] = [
            {"name": k, "value": v} for k, v in sections[comp_key].items()
        ]
    for k, sec in sections.items():
        if "shadow" in k.lower() and "semantic" not in k.lower():
            label = k.split("(")[0].strip()
            if label != "Shadows":
                component_groups[label] = [{"name": n, "value": v} for n, v in sec.items()]

    icons = sorted(p.stem for p in ICONS_DIR.glob("*.svg"))

    data = {
        "source": {
            "themeCss": "components/ids-theme.css",
            "figmaCollections": {
                "primitives": "Primitive",
                "semantic": "Color Modes",
            },
            "variablesLibrary": (
                "https://www.figma.com/design/r0Ex6TumqcR3HINamsfXCV/IDS-Variables-Library"
            ),
        },
        "primitives": [{"group": g, "tokens": t} for g, t in prim_groups.items()],
        "semantic": [{"group": g, "tokens": t} for g, t in sem_groups.items()],
        "components": [{"group": g, "tokens": t} for g, t in component_groups.items()],
        "icons": icons,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(data, indent=2) + "\n"
    OUT_JSON.write_text(payload, encoding="utf-8")
    OUT_JS.write_text(
        "/** Auto-generated by scripts/export_ids_foundation_tokens.py — do not edit. */\n"
        f"export default {json.dumps(data, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT_JSON.relative_to(PROJECT)}")
    print(f"Wrote {OUT_JS.relative_to(PROJECT)}")
    print(
        f"  Primitive={sum(len(g['tokens']) for g in data['primitives'])} "
        f"Semantic={sum(len(g['tokens']) for g in data['semantic'])} "
        f"Icons={len(icons)}"
    )


if __name__ == "__main__":
    main()
