#!/usr/bin/env python3
"""Write a Figma MCP variable chunk JSON file from stdin or a path argument."""
from __future__ import annotations

import json
import sys
from pathlib import Path


def normalize_chunk(data: dict) -> dict:
    """Standard chunk: {collection, vars:[[name,type,modeValues,webSyntax[,id]]]}"""
    vars_out = []
    for row in data.get("vars") or []:
        if len(row) >= 4:
            vars_out.append(row[:5] if len(row) >= 5 else row[:4])
    return {"collection": data["collection"], "vars": vars_out}


def main() -> None:
    out_path = Path(sys.argv[1])
    if len(sys.argv) > 2:
        raw = Path(sys.argv[2]).read_text(encoding="utf-8")
    else:
        raw = sys.stdin.read()
    data = json.loads(raw)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(normalize_chunk(data), separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {out_path} ({len(data.get('vars', []))} vars)")


if __name__ == "__main__":
    main()
