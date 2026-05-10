#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent))

from sync_ids_root_spec_from_figma import (  # type: ignore
    _fetch_local,
    _replace_region,
    build_markdown,
)

IDS_AI_FILE_KEY = "rr8F0NGA6RNY9Z0cNeh3jh"
ROOT_SPEC = Path(__file__).resolve().parent.parent / "components" / "ids-ai" / "root-spec.mdx"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true", help=f"Write {ROOT_SPEC} (default: stdout)")
    args = ap.parse_args()

    token = os.environ.get("FIGMA_TOKEN", "").strip()
    if not token:
        print("FIGMA_TOKEN is not set", file=sys.stderr)
        return 1

    payload = _fetch_local(IDS_AI_FILE_KEY, token)
    md = build_markdown(
        payload,
        file_key_for_banner=IDS_AI_FILE_KEY,
        theme_color_collection="Color Mode",
        theme_color_heading=(
            "### Color Mode — COLOR (Figma — `Color Mode`, collection `41837:5099`)"
        ),
        theme_color_intro_md=(
            "> IDS-AI semantic Light/Dark colors from the **Color Mode** variable set (same source prioritized in "
            "`scripts/sync_ids_ai_theme_from_figma.py`). Full `--token` matrix for codegen; "
            "`Tokens` rows with the same name often alias unpublished libraries and resolve as `—` here.\n\n"
        ),
    )

    if not args.write:
        sys.stdout.write(md)
        return 0

    content = ROOT_SPEC.read_text(encoding="utf-8")
    start = "<!-- ds:section id=primitive-static -->"
    end = "<!-- ds:section id=typography -->"
    new_content = _replace_region(content, start, end, md + "\n")

    # Keep same spacing subsection replacement used in IDS root sync.
    scale_start = "### Primitive scale (`Density Primitive` / scale collection)\n\n"
    scale_end = "<!-- ds:section id=border -->"
    if scale_start in new_content and scale_end in new_content:
        si = new_content.find(scale_start)
        ei = new_content.find(scale_end)
        replacement = (
            "### Figma-derived layout tokens\n\n"
            "> The previous `--scale-*` table was a generic placeholder. "
            "This file’s Figma **local variables** export uses **Density Primitive** FLOAT rows (above, under Density Primitive) "
            "and **Tokens** FLOAT rows for shadow geometry. For `--scale-*` / `--opacity-*` in CSS, regenerate `components/ids-ai-theme.css` from Figma.\n\n"
        )
        new_content = new_content[:si] + replacement + new_content[ei:]

    # Update identity hints to IDS-AI.
    new_content = new_content.replace("| Name | IDS |", "| Name | IDS-AI |")
    new_content = re.sub(r"\| Figma File Key \| `[^`]+` \|", f"| Figma File Key | `{IDS_AI_FILE_KEY}` |", new_content)
    new_content = new_content.replace("`components/ids/`", "`components/ids-ai/`")

    ROOT_SPEC.write_text(new_content, encoding="utf-8")
    print(f"Wrote {ROOT_SPEC}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

