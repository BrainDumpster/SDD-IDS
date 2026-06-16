#!/usr/bin/env python3
"""
Sync programme theme CSS files from Figma variables/local (REST).

Requires FIGMA_TOKEN (e.g. `set -a && . ./.env && set +a`).

Programmes:
- synapse → components/synapse-theme.css (+ storybook copy)
- ids     → components/ids-theme.css
- dap     → no separate Figma file; uses IDS base — run `ids` then reconcile dap-theme.css

After Synapse sync, optionally refresh root-spec:
  python3 scripts/rebuild_specs.py --root-only

After IDS sync, optionally refresh ids/root-spec.md tables:
  python3 scripts/sync_ids_root_spec_from_figma.py --write
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from figma_theme_sync import IDS_CONFIG, SYNAPSE_CONFIG, figma_token_from_env, sync_programme_theme

PROJECT = Path(__file__).resolve().parent.parent


def _run_ids_root_spec_sync() -> int:
    script = PROJECT / "scripts" / "sync_ids_root_spec_from_figma.py"
    if not script.is_file():
        return 0
    print("Updating components/ids/root-spec.md Figma tables...", file=sys.stderr)
    return subprocess.call([sys.executable, str(script), "--write"])


def _run_synapse_root_spec_rebuild() -> int:
    script = PROJECT / "scripts" / "rebuild_specs.py"
    if not script.is_file():
        return 0
    print("Rebuilding components/synapse/root-spec.md from theme CSS...", file=sys.stderr)
    return subprocess.call([sys.executable, str(script), "--root-only"])


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--programme",
        choices=("synapse", "ids", "dap", "all"),
        default="all",
        help="Which programme theme(s) to sync (default: all)",
    )
    ap.add_argument("--dry-run", action="store_true", help="Print token counts only; do not write CSS")
    ap.add_argument(
        "--with-root-spec",
        action="store_true",
        help="Also refresh programme root-spec.md (IDS tables + Synapse rebuild)",
    )
    args = ap.parse_args()

    try:
        token = figma_token_from_env()
    except RuntimeError as e:
        print(str(e), file=sys.stderr)
        return 1

    programmes = []
    if args.programme in ("synapse", "all"):
        programmes.append(SYNAPSE_CONFIG)
    if args.programme in ("ids", "all"):
        programmes.append(IDS_CONFIG)

    exit_code = 0
    for config in programmes:
        print(f"Syncing {config.programme} from Figma ({config.figma_file_key})...", file=sys.stderr)
        counts = sync_programme_theme(config, figma_token=token, dry_run=args.dry_run)
        if args.dry_run:
            print(f"  {config.programme}: {counts}")
        else:
            for path in config.output_paths:
                print(f"  Wrote {path}", file=sys.stderr)

    if args.programme in ("dap", "all") and not args.dry_run:
        print(
            "DAP: components/dap-theme.css overlays IDS — no Figma file key. "
            "After IDS sync, review components/DAP/root-spec.md and dap-theme.css deltas.",
            file=sys.stderr,
        )

    if args.with_root_spec and not args.dry_run:
        if args.programme in ("ids", "all"):
            exit_code = exit_code or _run_ids_root_spec_sync()
        if args.programme in ("synapse", "all"):
            exit_code = exit_code or _run_synapse_root_spec_rebuild()

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
