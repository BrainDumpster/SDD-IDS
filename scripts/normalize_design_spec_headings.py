#!/usr/bin/env python3
"""
Normalize IDS design-spec.md section order and headings.

- Blueprint specs: reorder ## sections, rename Codegen ### titles, reparent extra ## blocks.
- Legacy specs (no Codegen Contract): same normalization plus Composition stub and
  Codegen bootstrap (cross-refs to existing Anatomy/Interactions/Variants content).

Does not edit paragraph/list/table body text except ### heading renames under Codegen.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

_SCRIPTS_DIR = Path(__file__).resolve().parent
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))

from design_spec_template import (
    CANONICAL_H2_ORDER,
    CODEGEN_BOOTSTRAP,
    CODEGEN_TITLE,
    COMPOSITION_STUB,
    COMPOSITION_TITLE,
)

ANATOMY_STUB = """Document component parts in deterministic order. Add one bullet per slot (root, label, icon, etc.).

"""

REPO_ROOT = Path(__file__).resolve().parents[1]
IDS_DIR = REPO_ROOT / "components" / "ids"

# Extra ## sections -> (parent canonical title, ### title)
REPARENT: dict[str, tuple[str, str]] = {
    "Typography": ("Tokens", "Typography"),
    "Accessibility": ("Interactions", "Accessibility"),
    "Variants": (COMPOSITION_TITLE, "Variants"),
    "Behavior & Guidelines": ("Interactions", "Behavior & guidelines"),
    "Token Gaps / Notes": ("Tokens", "Token gaps and notes"),
    "Deliverable Checklist": (CODEGEN_TITLE, "Validation checklist"),
    "Validation Checklist": (CODEGEN_TITLE, "Validation checklist"),
    "Display modes": (COMPOSITION_TITLE, "Display modes"),
    "Component composition (fully component-based)": ("Anatomy", "Component composition"),
    "Link contract (framework-agnostic, required for Angular `routerLink`)": (
        COMPOSITION_TITLE,
        "Link contract",
    ),
    "Link Contract (framework-agnostic)": (COMPOSITION_TITLE, "Link contract"),
    "Reusable component generation contract": (
        CODEGEN_TITLE,
        "Reusable component generation contract",
    ),
    "Production-ready SDD gate": (CODEGEN_TITLE, "Production-ready SDD gate"),
    "Storybook reference": ("Source Mapping", "Storybook reference"),
    "Storybook proof & codegen consumers": (
        "Source Mapping",
        "Storybook proof and codegen consumers",
    ),
    "Storybook Generation Contract": ("Source Mapping", "Storybook generation contract"),
    "Responsiveness": ("Layout & Measurements", "Responsiveness"),
    "IDS Design Library — color crosswalk (Light, node `42156:108639`)": (
        "Tokens",
        "IDS Design Library color crosswalk (Light, node `42156:108639`)",
    ),
    "Icon primitive & asset delivery (codegen)": (
        CODEGEN_TITLE,
        "Icon primitive and asset delivery",
    ),
    "Framework-Agnostic Component Tree": ("Anatomy", "Framework-agnostic component tree"),
    "Column filter menu (L-frame baseline)": ("Anatomy", "Column filter menu (L-frame baseline)"),
    "Table Layout Algorithm (codegen)": (
        "Layout & Measurements",
        "Table layout algorithm (codegen)",
    ),
    # Composer / older generator headings
    "Executive Summary": ("Metadata", "Executive summary"),
    "Overview": ("Metadata", "Overview"),
    "Purpose & Usage": ("Metadata", "Purpose and usage"),
    "API & Contract": (COMPOSITION_TITLE, "Runtime API"),
    "Implementation Notes": (CODEGEN_TITLE, "Implementation notes"),
    "Troubleshooting": (CODEGEN_TITLE, "Troubleshooting"),
    "Related Links": ("Source Mapping", "Related links"),
    "Source Conflict Notes": ("Source Mapping", "Source conflict notes"),
    "Documentation imagery": ("Source Mapping", "Documentation imagery"),
}

CODEGEN_H3_RENAMES: dict[str, str] = {
    "Deterministic slot schema": "Deterministic structure",
    "Deterministic slot order": "Deterministic structure",
    "Deterministic anatomy": "Deterministic structure",
    "Supported matrix": "Variant matrix",
    "Style contract": "Per-slot style contract",
    "Per-slot styling rules": "Per-slot style contract",
    "Per-slot style contract (tokenized)": "Per-slot style contract",
    "Behavior rules": "Behavior contract",
    "Accessibility rules": "Accessibility contract",
    "Asset + bundling contract": "Asset resolution + bundling contract",
    "Asset resolution + bundling contract (Icon type)": "Asset resolution + bundling contract",
    "Validation checklist (pass/fail)": "Validation checklist",
    "Deliverable checklist": "Validation checklist",
    "Table layout behavior contract (generators)": "Table layout behavior contract",
    "Behavior + accessibility contract": "Behavior and accessibility contract",
}

CODEGEN_BOLD_RENAMES: dict[str, str] = {
    "Deterministic slot schema:": "Deterministic structure:",
    "- Deterministic slot schema:": "Deterministic structure:",
}


def split_h2_sections(text: str) -> tuple[str, list[tuple[str, str]]]:
    parts = re.split(r"\n(?=## )", text)
    preamble = parts[0]
    sections: list[tuple[str, str]] = []
    for part in parts[1:]:
        if not part.startswith("## "):
            continue
        first_nl = part.find("\n")
        if first_nl == -1:
            title = part[3:].strip()
            body = ""
        else:
            title = part[3:first_nl].strip()
            body = part[first_nl + 1 :]
        sections.append((title, body))
    return preamble, sections


def normalize_codegen_subheadings(text: str) -> str:
    lines = text.splitlines(keepends=True)
    out: list[str] = []
    in_codegen = False
    for line in lines:
        if line.startswith(f"## {CODEGEN_TITLE}"):
            in_codegen = True
            out.append(line)
            continue
        if in_codegen and line.startswith("## "):
            in_codegen = False

        if in_codegen:
            m3 = re.match(r"^(###\s+)(.+?)\s*$", line)
            if m3:
                prefix, title = m3.group(1), m3.group(2).strip()
                new_title = CODEGEN_H3_RENAMES.get(title, title)
                out.append(f"{prefix}{new_title}\n")
                continue
            stripped = line.rstrip("\n")
            for old, new in CODEGEN_BOLD_RENAMES.items():
                if stripped == old or stripped.startswith(old):
                    line = line.replace(old, new, 1)
                    break
            m_bullet = re.match(r"^(-\s+)(Deterministic slot schema:)\s*$", line)
            if m_bullet:
                line = f"{m_bullet.group(1)}Deterministic structure:\n"
        out.append(line)
    return "".join(out)


def merge_sections(
    sections: dict[str, str], reparented: dict[str, list[tuple[str, str]]]
) -> dict[str, str]:
    for parent, blocks in reparented.items():
        if parent not in sections:
            sections[parent] = ""
        extra = ""
        for h3_title, body in blocks:
            block = f"\n### {h3_title}\n{body}"
            if not body.endswith("\n"):
                block += "\n"
            extra += block
        sections[parent] = sections[parent].rstrip("\n") + extra + "\n"
    return sections


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    had_codegen = CODEGEN_TITLE in text

    preamble, section_list = split_h2_sections(text)
    sections: dict[str, str] = {}
    reparented: dict[str, list[tuple[str, str]]] = {}

    for title, body in section_list:
        if title in CANONICAL_H2_ORDER:
            if title in sections:
                sections[title] += "\n" + body
            else:
                sections[title] = body
            continue
        if title in REPARENT:
            parent, h3 = REPARENT[title]
            reparented.setdefault(parent, []).append((h3, body))
            continue
        reparented.setdefault(COMPOSITION_TITLE, []).append((title, body))

    if "Anatomy" not in sections:
        sections["Anatomy"] = ANATOMY_STUB

    if COMPOSITION_TITLE not in sections:
        sections[COMPOSITION_TITLE] = COMPOSITION_STUB

    if CODEGEN_TITLE not in sections:
        sections[CODEGEN_TITLE] = CODEGEN_BOOTSTRAP

    sections = merge_sections(sections, reparented)

    out_parts = [preamble.rstrip("\n") + "\n\n"]
    for title in CANONICAL_H2_ORDER:
        if title not in sections:
            continue
        body = sections[title]
        out_parts.append(f"## {title}\n")
        if body:
            out_parts.append(body if body.endswith("\n") else body + "\n")

    new_text = "".join(out_parts)
    new_text = normalize_codegen_subheadings(new_text)

    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalize IDS design-spec.md headings and section order.")
    parser.add_argument(
        "--legacy-only",
        action="store_true",
        help="Only process specs that lack Codegen Contract before normalization",
    )
    args = parser.parse_args()

    changed: list[Path] = []
    for path in sorted(IDS_DIR.glob("*/design-spec.md")):
        if args.legacy_only:
            text = path.read_text(encoding="utf-8")
            if CODEGEN_TITLE in text:
                continue
        if process_file(path):
            changed.append(path.relative_to(REPO_ROOT))

    label = "legacy " if args.legacy_only else ""
    print(f"Updated {len(changed)} {label}files:")
    for p in changed:
        print(f"  - {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
