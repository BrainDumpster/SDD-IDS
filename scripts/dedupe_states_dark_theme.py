#!/usr/bin/env python3
"""Replace duplicate States (Dark Theme) markdown tables when identical to Light (token-only cells).

Conservative rules:
- Both sections must contain at least one markdown table.
- Normalized table text (after stripping (#RRGGBB)-style parentheticals) must match exactly.
- Skip files where any table cell uses literal #hex / rgb() without var(-- (authoritative literals).

See README.md (Design-spec tooling — states dedupe).
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.design_spec_template import DARK_STATES_BOILERPLATE  # noqa: E402


def _extract_h2_span(text: str, title: str) -> tuple[int, int] | None:
    m = re.search(rf"^## {re.escape(title)}\s*$", text, flags=re.M)
    if not m:
        return None
    start = m.start()
    rest = text[m.end() :]
    n = re.search(r"^## [^#\s]", rest, flags=re.M)
    end = m.end() + (n.start() if n else len(rest))
    return start, end


def _table_blocks(section_body: str) -> list[str]:
    lines = section_body.splitlines()
    blocks: list[list[str]] = []
    cur: list[str] = []
    for line in lines:
        s = line.strip()
        if s.startswith("|"):
            cur.append(s)
        else:
            if cur:
                blocks.append(cur)
                cur = []
    if cur:
        blocks.append(cur)
    return ["\n".join(b) for b in blocks]


def _strip_sample_hex_parentheticals(s: str) -> str:
    return re.sub(r"\s*\([^)]*#[0-9a-fA-F]{3,8}[^)]*\)", "", s, flags=re.I)


def _normalize_table_block(block: str) -> str:
    return "\n".join(_strip_sample_hex_parentheticals(line).strip() for line in block.splitlines())


def _cell_has_literal_color_without_var(cell: str) -> bool:
    c = cell.strip()
    if not c or re.fullmatch(r"[\-|—:]+", c):
        return False
    if "var(--" in c or "`var(--" in c:
        return False
    if re.search(r"#[0-9a-fA-F]{3,8}\b", c, re.I):
        return True
    if re.search(r"\brgba?\s*\(", c, re.I):
        return True
    return False


def _tables_token_safe(tables: list[str]) -> bool:
    for block in tables:
        for line in block.splitlines():
            if not line.strip().startswith("|"):
                continue
            cells = [c.strip() for c in line.strip("|").split("|")]
            for cell in cells:
                if _cell_has_literal_color_without_var(cell):
                    return False
    return True


def _should_dedupe(light_body: str, dark_body: str) -> bool:
    lt, dt = _table_blocks(light_body), _table_blocks(dark_body)
    if not lt or not dt:
        return False
    nl = "\n\n".join(_normalize_table_block(b) for b in lt)
    nd = "\n\n".join(_normalize_table_block(b) for b in dt)
    if nl != nd:
        return False
    return _tables_token_safe(lt + dt)


def _process_file(path: Path, *, apply: bool) -> str | None:
    text = path.read_text(encoding="utf-8")
    if "## States (Light Theme)" not in text or "## States (Dark Theme)" not in text:
        return None
    sp_light = _extract_h2_span(text, "States (Light Theme)")
    sp_dark = _extract_h2_span(text, "States (Dark Theme)")
    if not sp_light or not sp_dark:
        return None
    light_body = text[sp_light[0] : sp_light[1]]
    light_body = re.sub(r"^## States \(Light Theme\)\s*\n?", "", light_body, count=1, flags=re.M)
    dark_body = text[sp_dark[0] : sp_dark[1]]
    dark_body = re.sub(r"^## States \(Dark Theme\)\s*\n?", "", dark_body, count=1, flags=re.M)
    if not _should_dedupe(light_body.strip(), dark_body.strip()):
        return None
    rel = path.relative_to(ROOT)
    if apply:
        new_dark = f"## States (Dark Theme)\n\n{DARK_STATES_BOILERPLATE}\n"
        out = text[: sp_dark[0]] + new_dark + text[sp_dark[1] :]
        path.write_text(out, encoding="utf-8")
    return str(rel)


def main() -> int:
    ap = argparse.ArgumentParser(description="Dedupe identical States (Dark Theme) markdown tables.")
    ap.add_argument(
        "roots",
        nargs="*",
        default=["components/ids", "components/DAP", "components/synapse"],
        type=str,
        help="Directories under repo root to scan (default: ids, DAP, synapse).",
    )
    ap.add_argument("--apply", action="store_true", help="Write changes (default: dry-run).")
    args = ap.parse_args()
    hits: list[str] = []
    for r in args.roots:
        root = ROOT / r
        if not root.is_dir():
            continue
        for path in sorted(root.rglob("design-spec.md")):
            rel = _process_file(path, apply=args.apply)
            if rel:
                hits.append(rel)
    for h in hits:
        print(h)
    print(f"total: {len(hits)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
