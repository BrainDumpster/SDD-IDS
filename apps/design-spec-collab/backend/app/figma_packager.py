"""Fetch + compact Figma evidence for the client package (server-side, no LLM)."""

from __future__ import annotations

import logging
from typing import Any

import requests

from .config import settings

logger = logging.getLogger(__name__)


def _summarize_node(node: dict[str, Any], depth: int = 0) -> dict[str, Any]:
    if depth > 4:
        return {"name": node.get("name"), "truncated": True}
    kids = node.get("children") or []
    out: dict[str, Any] = {
        "id": node.get("id"),
        "name": node.get("name"),
        "type": node.get("type"),
    }
    bb = node.get("absoluteBoundingBox") or {}
    if bb:
        out["width"] = bb.get("width")
        out["height"] = bb.get("height")
    if kids:
        out["children"] = [_summarize_node(c, depth + 1) for c in kids[:12]]
        if len(kids) > 12:
            out["childrenTruncated"] = len(kids) - 12
    return out


def _fetch_nodes_live(file_key: str, node_id: str) -> dict[str, Any]:
    if not settings.figma_token:
        raise RuntimeError("FIGMA_TOKEN is required for FIGMA_MODE=live")
    nid = node_id.replace("-", ":")
    url = f"https://api.figma.com/v1/files/{file_key}/nodes"
    r = requests.get(
        url,
        headers={"X-Figma-Token": settings.figma_token},
        params={"ids": nid},
        timeout=120,
    )
    r.raise_for_status()
    data = r.json()
    nodes = data.get("nodes") or {}
    entry = nodes.get(nid) or next(iter(nodes.values()), None)
    if not entry:
        return {"fileKey": file_key, "nodeId": nid, "error": "node not found"}
    doc = entry.get("document") or {}
    return {
        "fileKey": file_key,
        "nodeId": nid,
        "name": doc.get("name"),
        "structure": _summarize_node(doc),
    }


def _stub_bucket(bucket: str, items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out = []
    for i, item in enumerate(items):
        out.append(
            {
                "fileKey": item.get("file_key") or item.get("fileKey"),
                "nodeId": item.get("node_id") or item.get("nodeId"),
                "url": item.get("url"),
                "name": f"stub-{bucket}-{i + 1}",
                "structure": {
                    "name": f"Stub {bucket} frame",
                    "type": "FRAME",
                    "width": 320 if bucket != "main" else 640,
                    "height": 48 if bucket == "main" else 40,
                    "children": [
                        {"name": "Label", "type": "TEXT"},
                        {"name": "Container", "type": "FRAME"},
                    ],
                },
                "mode": "stub",
            }
        )
    return out


def build_figma_evidence(preview: dict[str, Any]) -> dict[str, Any]:
    """
    Build compact evidence from intake preview.figma buckets.
    preview['figma'] = { main: [...], elements: [...], states: [...] }
    """
    figma = preview.get("figma") or {}
    mode = (settings.figma_mode or "stub").lower()
    evidence: dict[str, Any] = {"mode": mode, "buckets": {}}

    for bucket in ("main", "elements", "states"):
        items = figma.get(bucket) or []
        # Pydantic dump may be list of dicts with file_key/node_id
        normalized = []
        for it in items:
            if isinstance(it, dict):
                normalized.append(it)
            else:
                normalized.append(
                    {
                        "url": getattr(it, "url", None),
                        "file_key": getattr(it, "file_key", None),
                        "node_id": getattr(it, "node_id", None),
                    }
                )

        if mode != "live":
            evidence["buckets"][bucket] = _stub_bucket(bucket, normalized)
            continue

        fetched = []
        for it in normalized:
            fk = it.get("file_key") or it.get("fileKey")
            nid = it.get("node_id") or it.get("nodeId")
            if not fk or not nid:
                fetched.append({"error": "missing file_key/node_id", "raw": it})
                continue
            try:
                fetched.append(_fetch_nodes_live(str(fk), str(nid)))
            except Exception as exc:  # noqa: BLE001
                logger.warning("Figma fetch failed %s/%s: %s", fk, nid, exc)
                fetched.append(
                    {
                        "fileKey": fk,
                        "nodeId": nid,
                        "error": str(exc),
                    }
                )
        evidence["buckets"][bucket] = fetched

    # Required design-spec sections for client + review
    evidence["required_sections"] = [
        "Metadata",
        "Layout & Measurements",
        "Tokens",
        "States (Light Theme)",
        "States (Dark Theme)",
        "Interactions",
        "Composition & API (runtime)",
        "Codegen Contract (Framework-Agnostic Blueprint)",
        "Source Mapping",
    ]
    return evidence
