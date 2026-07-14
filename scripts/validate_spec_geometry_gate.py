#!/usr/bin/env python3
"""Validate design-spec.md files for Figma-verified slot geometry (anti drift gate)."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from validation.spec_contract_parser import SpecContractParser


def discover_specs(components_root: Path) -> list[Path]:
    return sorted(components_root.glob("**/design-spec.md"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Slot geometry (Figma-verified) tables in design specs")
    parser.add_argument("--component", help="Component slug (e.g. dropdown-single-select)")
    parser.add_argument("--programme", default="ids", help="Programme folder under components/ (ids, synapse, DAP)")
    parser.add_argument("--all", action="store_true", help="Scan all design-spec.md under components/")
    parser.add_argument("--warn-only", action="store_true", help="Report issues but exit 0")
    args = parser.parse_args()

    if args.all:
        spec_paths = discover_specs(PROJECT_ROOT / "components")
    elif args.component:
        spec_paths = [PROJECT_ROOT / "components" / args.programme / args.component / "design-spec.md"]
    else:
        parser.error("Provide --component <slug> or --all")
        return 2

    checker = SpecContractParser()
    failed = 0
    warned = 0

    for path in spec_paths:
        if not path.exists():
            print(f"MISSING {path}")
            failed += 1
            continue
        text = path.read_text(encoding="utf-8")
        result = checker.validate_slot_geometry_gate(text, strict=True)
        rel = path.relative_to(PROJECT_ROOT)
        if result.ok and not result.warnings:
            print(f"OK   {rel}")
            continue
        if result.ok and result.warnings:
            print(f"WARN {rel}")
            for w in result.warnings:
                print(f"  - {w}")
            warned += 1
            continue
        print(f"FAIL {rel}")
        for err in result.errors:
            print(f"  - {err}")
        for w in result.warnings:
            print(f"  - {w}")
        failed += 1

    if failed:
        print(f"\n{failed} spec(s) failed geometry gate")
        return 0 if args.warn_only else 1
    if warned:
        print(f"\n{warned} spec(s) passed with warnings")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
