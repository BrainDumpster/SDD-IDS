#!/usr/bin/env python3
"""
Regenerate IDS global theme CSS from Figma local variables (REST).

Uses GET https://api.figma.com/v1/files/{file_key}/variables/local
Requires FIGMA_TOKEN (e.g. `set -a && . ./.env && set +a`).

Figma file: IDS exploration with variables (see config/design_systems/ids.yaml).

Writes:
- components/ids-theme.css

Optional: also refresh ids/root-spec.md variable tables:
  python3 scripts/sync_ids_root_spec_from_figma.py --write
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from figma_theme_sync import IDS_CONFIG, figma_token_from_env, sync_programme_theme


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="Print token counts only")
    args = ap.parse_args()

    try:
        token = figma_token_from_env()
    except RuntimeError as e:
        print(str(e), file=sys.stderr)
        return 1

    counts = sync_programme_theme(IDS_CONFIG, figma_token=token, dry_run=args.dry_run)
    if args.dry_run:
        print(counts)
        return 0

    for path in IDS_CONFIG.output_paths:
        print(f"Wrote {path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
