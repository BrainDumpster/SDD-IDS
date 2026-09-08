#!/usr/bin/env python3
"""
Backfill `### Component dependencies (codegen)` into every design-spec.md.

Policy (no guessing):
- Only add asset rows when the spec already mentions iconSlug / asset(s)/icons paths.
- Never invent peer `component` rows from free prose.
- If nothing asset-like is declared, insert an empty declared table note (no Kind=asset|component rows).

Usage:
  python3 scripts/backfill_component_dependencies.py
  python3 scripts/backfill_component_dependencies.py --dry-run
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPONENTS = ROOT / "components"

HEADING = "### Component dependencies (codegen)"

SECTION_NONE = f"""{HEADING}

Machine-readable for MCP / agents (**spec-declared only**; applies to every component). Do not invent peers.

_No assets or peer components declared in this spec._

| Kind | Id | Required | Notes |
|------|-----|----------|-------|

"""

SECTION_ASSET_TMPL = f"""{HEADING}

Machine-readable for MCP / agents (**spec-declared only**; applies to every component). Assets are not peer components unless a `component` row is listed.

| Kind | Id | Required | Notes |
|------|-----|----------|-------|
{{rows}}

"""


def find_specs() -> list[Path]:
    return sorted(COMPONENTS.rglob("design-spec.md"))


def detect_asset_rows(text: str) -> list[str]:
    rows: list[str] = []
    seen: set[str] = set()

    has_icon_slug = bool(re.search(r"`?iconSlug`?", text))
    path_m = re.search(
        r"`((?:/?assets?/icons/)[^`]+)`|"
        r"((?:/?assets?/icons/)<[^>\s]+>\.svg)|"
        r"((?:/?assets?/icons/)[a-zA-Z0-9_./\-<>]+)",
        text,
    )
    template = "/asset/icons/<iconSlug>.svg"
    if path_m:
        template = next(g for g in path_m.groups() if g).strip("`")

    if has_icon_slug or path_m:
        key = f"asset:iconSlug:{template}"
        if key not in seen:
            seen.add(key)
            rows.append(
                f"| asset | `iconSlug` → `{template}` | optional | "
                "From existing Asset resolution / iconSlug mentions. "
                "Not an Icon peer unless a `component` row is added. |"
            )

    for m in re.finditer(
        r"Resolve\s+[^\n]*?from\s+`((?:/?assets?/)[^`]+)`",
        text,
        flags=re.IGNORECASE,
    ):
        path = m.group(1)
        if "icon" in path.lower() and rows:
            continue
        key = f"asset:path:{path}"
        if key in seen:
            continue
        seen.add(key)
        prop = "iconSlug" if "icon" in path.lower() else "asset"
        rows.append(
            f"| asset | `{prop}` → `{path}` | optional | "
            "From existing Resolve…from path in this spec. |"
        )

    return rows


def insert_section(text: str, section: str) -> str:
    if HEADING in text:
        return text

    # Prefer after Asset resolution block, before Fallback/error
    fallback = re.search(
        r"\n(?=###\s+Fallback/error rules\b)",
        text,
        flags=re.IGNORECASE,
    )
    if fallback:
        i = fallback.start() + 1
        return text[:i] + section + text[i:]

    asset = re.search(
        r"(###\s+Asset resolution[^\n]*\n(?:.*?\n)*?)(?=\n###\s+|\n##\s+)",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if asset:
        i = asset.end()
        # asset.end may sit at start of next heading; insert before it
        return text[:i] + "\n" + section + text[i:]

    codegen = re.search(
        r"(##\s+Codegen Contract[^\n]*\n)",
        text,
        flags=re.IGNORECASE,
    )
    if codegen:
        # Append near end of codegen — before ## Source Mapping if present
        source = re.search(r"\n##\s+Source Mapping\b", text)
        if source and source.start() > codegen.start():
            i = source.start() + 1
            return text[:i] + section + "\n" + text[i:]
        return text.rstrip() + "\n\n" + section

    return text.rstrip() + "\n\n" + section


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    updated = 0
    skipped = 0
    asset_filled = 0
    empty_filled = 0

    for path in find_specs():
        text = path.read_text(encoding="utf-8")
        if HEADING in text:
            skipped += 1
            continue

        rows = detect_asset_rows(text)
        if rows:
            section = SECTION_ASSET_TMPL.format(rows="\n".join(rows))
            asset_filled += 1
        else:
            section = SECTION_NONE
            empty_filled += 1

        new_text = insert_section(text, section)
        if new_text == text:
            print(f"WARN: could not insert: {path}")
            continue

        rel = path.relative_to(ROOT)
        if args.dry_run:
            print(f"DRY {rel} ({'asset' if rows else 'none'})")
        else:
            path.write_text(new_text, encoding="utf-8")
            print(f"OK  {rel} ({'asset' if rows else 'none'})")
        updated += 1

    print(
        f"\nupdated={updated} skipped_existing={skipped} "
        f"asset_rows={asset_filled} none={empty_filled} dry_run={args.dry_run}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
