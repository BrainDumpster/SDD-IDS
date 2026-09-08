#!/usr/bin/env python3
"""Assemble chunk JSON exports into storage/figma-exports/ids/compact-export.json."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple

PROJECT = Path(__file__).resolve().parent.parent
OUT = PROJECT / "storage" / "figma-exports" / "ids"
CHUNKS = OUT / "chunks"

COLLECTIONS = {
    "Primitive": {
        "id": "VariableCollectionId:41837:5094",
        "modes": [{"modeId": "41837:1", "name": "Mode 1"}],
        "defaultModeId": "41837:1",
    },
    "Color Modes": {
        "id": "VariableCollectionId:41837:5099",
        "modes": [
            {"modeId": "42803:1", "name": "Light"},
            {"modeId": "42803:2", "name": "Dark"},
        ],
        "defaultModeId": "42803:1",
    },
    "Table Density": {
        "id": "VariableCollectionId:42199:67231",
        "modes": [
            {"modeId": "42199:3", "name": "Standard"},
            {"modeId": "42199:4", "name": "Loose"},
            {"modeId": "42199:5", "name": "Compact"},
        ],
        "defaultModeId": "42199:3",
    },
    "Sizes": {
        "id": "VariableCollectionId:46922:933",
        "modes": [{"modeId": "46922:0", "name": "Mode 1"}],
        "defaultModeId": "46922:0",
    },
    "UI Icon Size Modes": {
        "id": "VariableCollectionId:47168:1261",
        "modes": [
            {"modeId": "47168:1", "name": "14px"},
            {"modeId": "47168:2", "name": "16px"},
            {"modeId": "47168:3", "name": "18px"},
            {"modeId": "47168:4", "name": "22px"},
            {"modeId": "47168:5", "name": "24px"},
            {"modeId": "47168:6", "name": "28px"},
            {"modeId": "47168:7", "name": "32px"},
            {"modeId": "47168:8", "name": "48px"},
        ],
        "defaultModeId": "47168:1",
    },
}


def slug(s: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()


def mode_name_to_id(coll_name: str) -> Dict[str, str]:
    return {m["name"]: m["modeId"] for m in COLLECTIONS[coll_name]["modes"]}


def convert_rows(coll_name: str, rows: List[list]) -> Tuple[Dict[str, Any], List[str]]:
    coll = COLLECTIONS[coll_name]
    cid = coll["id"]
    name_to_id = mode_name_to_id(coll_name)
    variables: Dict[str, Any] = {}
    var_ids: List[str] = []
    for i, row in enumerate(rows):
        name, rtype, values = row[0], row[1], row[2]
        web = row[3] if len(row) > 3 else ""
        vid = f"VariableID:mcp:{slug(coll_name)}:{i}"
        values_by_mode: Dict[str, Any] = {}
        for mode_name, val in values.items():
            mid = name_to_id.get(mode_name)
            if mid is None:
                for k, v in name_to_id.items():
                    if k.lower() == str(mode_name).lower():
                        mid = v
                        break
            if mid is None:
                raise KeyError(f"Unknown mode {mode_name!r} in {coll_name}")
            values_by_mode[mid] = val
        code_syntax: Dict[str, str] = {}
        if isinstance(web, str) and web.strip():
            code_syntax["WEB"] = web.strip()
        variables[vid] = {
            "id": vid,
            "name": name,
            "key": vid,
            "variableCollectionId": cid,
            "resolvedType": rtype,
            "valuesByMode": values_by_mode,
            "codeSyntax": code_syntax,
            "remote": False,
            "hiddenFromPublishing": False,
        }
        var_ids.append(vid)
    return variables, var_ids


def main() -> int:
    all_rows: Dict[str, List[list]] = {}
    for path in sorted(CHUNKS.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        coll = data["collection"]
        if coll not in COLLECTIONS:
            raise SystemExit(f"Unknown collection in {path.name}: {coll}")
        all_rows.setdefault(coll, []).extend(data["vars"])
        print(f"loaded {path.name}: {coll} +{len(data['vars'])} (total {len(all_rows[coll])})")

    missing = [n for n in COLLECTIONS if n not in all_rows]
    if missing:
        raise SystemExit(f"Missing collections: {missing}")

    variables: Dict[str, Any] = {}
    variable_collections: Dict[str, Any] = {}
    for coll_name, rows in all_rows.items():
        vars_map, var_ids = convert_rows(coll_name, rows)
        variables.update(vars_map)
        meta = COLLECTIONS[coll_name]
        variable_collections[meta["id"]] = {
            "id": meta["id"],
            "name": coll_name,
            "key": meta["id"],
            "modes": meta["modes"],
            "defaultModeId": meta["defaultModeId"],
            "variableIds": var_ids,
            "remote": False,
        }

    payload = {
        "status": 200,
        "error": False,
        "meta": {"variables": variables, "variableCollections": variable_collections},
        "source": {
            "fileKey": "r0Ex6TumqcR3HINamsfXCV",
            "method": "Figma MCP use_figma",
            "date": "2026-07-29",
        },
    }
    out_path = OUT / "compact-export.json"
    out_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(
        f"Wrote {out_path} vars={len(variables)} collections={len(variable_collections)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
