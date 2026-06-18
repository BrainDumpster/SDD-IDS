#!/usr/bin/env python3
"""Resolve layered design-spec paths for programme ids-fork codegen."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from config.design_system_config import load_design_system
from generation.component_context_compiler import ComponentContextCompiler


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Resolve IDS baseline + programme design-spec layers for codegen.",
    )
    parser.add_argument(
        "--component",
        "-c",
        required=True,
        help="Programme component slug (e.g. app-shell, left-nav, modal).",
    )
    parser.add_argument(
        "--programme",
        "-p",
        default=os.getenv("DESIGN_SYSTEM", "synapse"),
        help="Design system / programme name (default: DESIGN_SYSTEM or synapse).",
    )
    parser.add_argument(
        "--compose",
        action="store_true",
        help="Print merged spec text (same as ComponentContextCompiler.compile).",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit machine-readable JSON (inheritance + layer paths).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    cfg = load_design_system(args.programme)
    compiler = ComponentContextCompiler(config=cfg, enable_rag=False)
    context = compiler.compile(args.component, "resolve design spec layers")

    if args.json:
        payload = {
            "spec_inheritance": context.get("spec_inheritance"),
            "layer_precedence": context.get("layer_precedence"),
            "spec_layers": [
                {
                    "layer": layer["layer"],
                    "path": layer["path"],
                    "exists": layer["exists"],
                    "required": layer["required"],
                    "bytes": len(layer.get("content") or ""),
                }
                for layer in context.get("spec_layers", [])
            ],
            "theme_layers": [
                {"layer": layer["layer"], "path": layer["path"], "exists": layer["exists"]}
                for layer in context.get("theme_layers", [])
            ],
            "validation_issues": context.get("validation_issues", []),
        }
        print(json.dumps(payload, indent=2))
        return 0

    inheritance = context.get("spec_inheritance")
    print(f"Programme: {args.programme}")
    print(f"Component: {args.component}")
    if inheritance:
        print(f"Pattern: {inheritance.get('pattern')}")
        print(f"IDS baseline: {inheritance.get('ids_baseline_spec_path')}")
        print(f"Programme spec: {inheritance.get('programme_spec_path')}")
        print("Resolution order:")
        for step in inheritance.get("resolution_order", []):
            print(f"  - {step}")
    print(f"Layer precedence: {context.get('layer_precedence')}")
    print("\nSpec layers:")
    for layer in context.get("spec_layers", []):
        flag = "OK" if layer.get("exists") else "MISSING"
        print(f"  [{flag}] {layer['layer']}: {layer['path']}")

    issues = context.get("validation_issues") or []
    if issues:
        print("\nValidation issues:")
        for issue in issues:
            print(f"  - {issue}")

    if args.compose:
        print("\n--- merged spec (truncated preview) ---\n")
        spec = context.get("spec") or ""
        print(spec[:4000])
        if len(spec) > 4000:
            print(f"\n... ({len(spec) - 4000} more characters)")

    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
