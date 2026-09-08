#!/usr/bin/env python3
"""
Enrich `### Component dependencies (codegen)` with peer **component** rows.

Policy: only peers that are **explicitly cited** via:
  - `components/<programme>/<slug>/design-spec.md` (slug folder must exist), or
  - `compose|reuse|delegate … IDS <KnownName>` where KnownName maps via NAME_TO_SLUG, or
  - `<KnownName> dependency spec:` with KnownName in NAME_TO_SLUG

Never invent peers from assets/icons alone. Never invent unknown kebab slugs from prose.

Usage:
  python3 scripts/enrich_component_dependencies.py [--dry-run] [--clean-invalid]
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPONENTS = ROOT / "components"
HEADING = "### Component dependencies (codegen)"

NAME_TO_SLUG = {
    "button": "button",
    "icon": "icon",
    "tooltip": "tooltip",
    "checkbox": "checkbox",
    "radio button": "radio-button",
    "radio": "radio-button",
    "badge": "badge",
    "tag": "tag",
    "masthead": "masthead",
    "modal": "modal",
    "dialog": "modal",
    "pagination": "pagination",
    "text box": "text-box",
    "textbox": "text-box",
    "text input": "text-box",
    "dropdown": "dropdown-single-select",
    "dropdown single select": "dropdown-single-select",
    "dropdown single-select": "dropdown-single-select",
    "dropdown: single-select": "dropdown-single-select",
    "dropdown multiselect": "dropdown-multiselect",
    "dropdown multi-select": "dropdown-multiselect",
    "dropdown combo box": "dropdown-combo-box",
    "combobox": "dropdown-combo-box",
    "date picker": "date-picker",
    "time picker": "time-picker",
    "toggle switch": "toggle-switch",
    "progress bar": "progress-bar",
    "detail panel": "detail-panel",
    "app shell": "app-shell",
    "app launcher": "app-launcher",
    "whats new": "whats-new",
    "footer": "footer",
    "card": "card",
    "search": "search",
    "slider": "slider",
    "datagrid": "datagrid",
    "main menu left": "main-menu-left",
    "main-menu-left": "main-menu-left",
    "segmented button": "segmented-button",
    "helper": "helper",
}


def known_slugs() -> set[str]:
    slugs = set(NAME_TO_SLUG.values())
    for p in COMPONENTS.rglob("design-spec.md"):
        slugs.add(p.parent.name)
    slugs.add("icon")  # lib peer may lack IDS design-spec
    return slugs


KNOWN = known_slugs()


def find_specs() -> list[Path]:
    return sorted(COMPONENTS.rglob("design-spec.md"))


def self_slug(path: Path) -> tuple[str, str]:
    parts = path.relative_to(COMPONENTS).parts
    return parts[0], parts[-2]


def peer_exists(slug: str) -> bool:
    if slug == "icon":
        return (ROOT / "lib/react/ids/icon").is_dir() or any(
            (COMPONENTS / prog / "icon" / "design-spec.md").is_file()
            for prog in ("ids", "synapse", "DAP")
        )
    return any(
        (COMPONENTS / prog / slug / "design-spec.md").is_file()
        for prog in ("ids", "synapse", "DAP", "powerflex")
    )


def extract_peers(text: str, programme: str, self: str) -> dict[str, dict]:
    peers: dict[str, dict] = {}

    def add(slug: str, *, required: bool, notes: str) -> None:
        if slug == self or slug not in KNOWN:
            return
        if not peer_exists(slug) and slug != "icon":
            return
        public = "Ids" + "".join(p.title() for p in slug.split("-"))
        prev = peers.get(slug)
        if prev is None:
            peers[slug] = {"required": required, "public": public, "notes": notes}
            return
        peers[slug]["required"] = prev["required"] or required
        if notes not in prev["notes"]:
            peers[slug]["notes"] = f"{prev['notes']}; {notes}"

    for m in re.finditer(
        r"components/([a-zA-Z0-9_-]+)/([a-z0-9][a-z0-9-]*)/design-spec\.md",
        text,
    ):
        slug = m.group(2)
        window = text[max(0, m.start() - 100) : m.end() + 60]
        required = bool(
            re.search(r"\b(must|MUST|required|compose|delegate|reuses?)\b", window, re.I)
        )
        # Optional when window says optional
        if re.search(r"\boptional\b", window, re.I):
            required = False
        add(slug, required=required, notes=f"Cited `components/{m.group(1)}/{slug}/design-spec.md`.")

    for m in re.finditer(
        r"(?:compose|reuses?|delegate(?:s|d)?\s+to)\s+(?:the\s+)?IDS\s+\*{0,2}([A-Za-z][A-Za-z0-9: /-]{0,40}?)\*{0,2}"
        r"(?=\s|,|\.|\)|$|\n)",
        text,
        re.I,
    ):
        raw = re.sub(r"\s+", " ", m.group(1)).strip(" *:")
        key = raw.lower()
        slug = NAME_TO_SLUG.get(key)
        if slug:
            add(slug, required=True, notes=f"Named via compose/reuse IDS {raw}.")

    for m in re.finditer(
        r"\*\*?([A-Za-z][A-Za-z0-9 /-]*?)\*\*?\s+dependency(?:\s+spec)?\s*:",
        text,
    ):
        key = m.group(1).strip().lower()
        slug = NAME_TO_SLUG.get(key)
        if slug:
            add(slug, required=True, notes=f"Declared as {m.group(1)} dependency.")

    for m in re.finditer(
        r"^[-*]\s+([A-Za-z][A-Za-z0-9 /-]*?)\s+dependency(?:\s+spec)?\s*:",
        text,
        re.M,
    ):
        key = m.group(1).strip().lower()
        slug = NAME_TO_SLUG.get(key)
        if slug:
            add(slug, required=True, notes=f"Declared as {m.group(1)} dependency.")

    # Explicit runtime / nested component names (not free-prose guessing)
    if re.search(r"\bIdsButton\b", text):
        add(
            "button",
            required=True,
            notes="Named `IdsButton` in this spec.",
        )
    if re.search(
        r"(?:nested\s+)?IDS\s+`?Button`?\s+component|"
        r"uses IDS Button|"
        r"IDS tertiary(?:\s+icon-only)?\s+`?Button`?|"
        r"IDS small tertiary button|"
        r"reuses IDS Button|"
        r"inherits the IDS `?Button`? state",
        text,
        re.I,
    ):
        add(
            "button",
            required=True,
            notes="Named IDS Button composition/reuse in this spec.",
        )

    if re.search(r"\bIdsIcon\b", text):
        add("icon", required=True, notes="Named `IdsIcon` in this spec.")
    if re.search(
        r"shared\s+Icon\s+primitive|"
        r"through the shared\s+`?Icon`?|"
        r"shared system primitives\s*\(`Icon`|"
        r"compose\s+`?Icon`?|"
        r"Icons use shared\s+`?Icon`?|"
        r"programme\s+\*\*`Icon`\*\*\s+primitive|"
        r"`Icon`\s+primitive",
        text,
        re.I,
    ):
        add(
            "icon",
            required=True,
            notes="Named shared Icon primitive / composition in this spec.",
        )

    if re.search(r"\bIdsTooltip\b", text):
        # optional unless also MUST nearby — default required when IdsTooltip is the contract
        add("tooltip", required=True, notes="Named `IdsTooltip` in this spec.")
    if re.search(r"\bIdsHelper\b|compose\s+`?IdsHelper`?", text):
        if "helper" in KNOWN or peer_exists("helper"):
            add("helper", required=True, notes="Named IdsHelper composition in this spec.")

    return peers


def parse_table_rows(block: str) -> list[tuple[str, str, str]]:
    """Return list of (kind, full_row_line)."""
    out = []
    for line in block.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 2:
            continue
        kind = cells[0].lower()
        if kind not in {"asset", "component"}:
            continue
        out.append((kind, line.rstrip()))
    return out


def component_id_from_row(row: str) -> str | None:
    cells = [c.strip() for c in row.strip().strip("|").split("|")]
    if len(cells) < 2:
        return None
    id_cell = cells[1]
    m = re.match(r"`([a-z0-9][a-z0-9-]*)`", id_cell)
    return m.group(1) if m else None


def rebuild_section(existing_rows: list[tuple[str, str]], peer_rows: list[str]) -> str:
    by_key: dict[str, str] = {}
    for kind, row in existing_rows:
        if kind == "component":
            slug = component_id_from_row(row)
            # Drop invalid component rows when cleaning/rebuilding
            if slug is None or (slug not in KNOWN and slug != "icon"):
                continue
            if not peer_exists(slug) and slug != "icon":
                continue
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        key = f"{kind}:{cells[1]}"
        by_key[key] = row

    for row in peer_rows:
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        key = f"{cells[0].lower()}:{cells[1]}"
        by_key[key] = row

    assets = [v for k, v in sorted(by_key.items()) if k.startswith("asset:")]
    comps = [v for k, v in sorted(by_key.items()) if k.startswith("component:")]
    ordered = assets + comps

    if not ordered:
        return f"""{HEADING}

Machine-readable for MCP / agents (**spec-declared only**; applies to every component).

_No assets or peer components declared in this spec._

| Kind | Id | Required | Notes |
|------|-----|----------|-------|

"""

    return f"""{HEADING}

Machine-readable for MCP / agents (**spec-declared only**; applies to every component). Assets are not peer components unless a `component` row is listed.

| Kind | Id | Required | Notes |
|------|-----|----------|-------|
{chr(10).join(ordered)}

"""


def replace_section(text: str, new_section: str) -> str:
    m = re.search(
        rf"{re.escape(HEADING)}\n(.*?)(?=\n###\s+|\n##\s+|\Z)",
        text,
        flags=re.S,
    )
    if not m:
        return text
    return text[: m.start()] + new_section + text[m.end() :]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument(
        "--clean-invalid",
        action="store_true",
        help="Drop component rows whose slug is unknown / missing (always on with enrich).",
    )
    args = ap.parse_args()

    changed = 0
    for path in find_specs():
        programme, slug = self_slug(path)
        text = path.read_text(encoding="utf-8")
        if HEADING not in text:
            continue

        m = re.search(
            rf"{re.escape(HEADING)}\n(.*?)(?=\n###\s+|\n##\s+|\Z)",
            text,
            flags=re.S,
        )
        if not m:
            continue

        existing = parse_table_rows(m.group(0))
        peers = extract_peers(text, programme, slug)

        peer_rows = []
        for peer_slug, meta in sorted(peers.items()):
            req = "required" if meta["required"] else "optional"
            peer_rows.append(
                f"| component | `{peer_slug}` (`{meta['public']}`) | {req} | {meta['notes']} |"
            )

        new_section = rebuild_section(existing, peer_rows)
        new_text = replace_section(text, new_section)
        if new_text == text:
            continue

        rel = path.relative_to(ROOT)
        if args.dry_run:
            print(f"DRY {rel} peers={list(peers)}")
        else:
            path.write_text(new_text, encoding="utf-8")
            print(f"OK  {rel} peers={list(peers)}")
        changed += 1

    print(f"\nfiles_changed={changed} dry_run={args.dry_run}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
