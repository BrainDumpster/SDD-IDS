"""Fetch + compact Figma evidence for the client package (server-side, no LLM).

Modes:
- stub: synthetic evidence
- mcp: official Figma MCP (optional; may fail without OAuth)
- rest: enriched Figma REST packaging (deployable with FIGMA_TOKEN)

REST enrichment reuses existing repo helpers **as-is** (no edits to those modules):
- ingestion.figma_sync_client.FigmaSyncClient
- ingestion.figma_spec_extract.extract_from_nodes_response
- ingestion.figma_spec_extract.summarize_variables

IDE + Figma MCP plugin flows are untouched.
"""

from __future__ import annotations

import logging
import sys
from typing import Any

import requests

from .config import settings
from .figma_mcp_client import (
    fetch_node_via_mcp,
    figma_mcp_public_contract,
    mcp_configured,
)

logger = logging.getLogger(__name__)

# Cap sizes so session payloads stay usable for client LLMs.
_MAX_VAR_BULLETS = 160
_MAX_SPEC_LINES = 200
_MAX_SLOT_ROWS = 80
_MAX_IMAGE_NODES = 12


def _ensure_repo_on_path() -> None:
    root = str(settings.repo_root.resolve())
    if root not in sys.path:
        sys.path.insert(0, root)


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


def _bound_var_names(node: dict[str, Any]) -> list[str]:
    bound = node.get("boundVariables") or {}
    names: list[str] = []
    if not isinstance(bound, dict):
        return names
    for _prop, binding in bound.items():
        items = binding if isinstance(binding, list) else [binding]
        for item in items:
            if not isinstance(item, dict):
                continue
            # REST often returns {type, id}; name may be absent.
            name = item.get("name") or item.get("id")
            if name:
                names.append(str(name))
    return names[:8]


def _slot_geometry_rows(doc: dict[str, Any], *, limit: int = _MAX_SLOT_ROWS) -> list[dict[str, Any]]:
    """Build Slot-geometry-ready rows from REST node document (collab-only)."""
    rows: list[dict[str, Any]] = []

    def walk(node: dict[str, Any], depth: int = 0) -> None:
        if len(rows) >= limit or depth > 10:
            return
        ntype = node.get("type") or ""
        name = node.get("name") or ntype
        if ntype in (
            "FRAME",
            "COMPONENT",
            "INSTANCE",
            "COMPONENT_SET",
            "RECTANGLE",
            "GROUP",
        ):
            bb = node.get("absoluteBoundingBox") or {}
            row: dict[str, Any] = {
                "slot": name,
                "nodeId": node.get("id"),
                "type": ntype,
                "width": bb.get("width"),
                "height": bb.get("height"),
            }
            if node.get("cornerRadius") is not None:
                row["borderRadius"] = node.get("cornerRadius")
            radii = node.get("rectangleCornerRadii")
            if radii:
                row["rectangleCornerRadii"] = radii
            bound_names = _bound_var_names(node)
            if bound_names:
                row["boundVariableHints"] = bound_names
                # Prefer semantic CSS var naming when the binding already looks like a token path
                css_hints = []
                for n in bound_names:
                    s = str(n)
                    if s.startswith("--"):
                        css_hints.append(f"var({s})")
                    elif "/" in s or s.lower().startswith("color") or "radius" in s.lower():
                        css_hints.append(s)
                if css_hints:
                    row["tokenHints"] = css_hints[:6]
            pads = {
                k: node.get(k)
                for k in (
                    "paddingLeft",
                    "paddingRight",
                    "paddingTop",
                    "paddingBottom",
                )
                if node.get(k) is not None
            }
            if pads:
                row["padding"] = pads
            if node.get("itemSpacing") is not None:
                row["itemSpacing"] = node.get("itemSpacing")
            if node.get("layoutMode"):
                row["layoutMode"] = node.get("layoutMode")
            if node.get("strokeWeight") is not None:
                row["strokeWeight"] = node.get("strokeWeight")
            bound = _bound_var_names(node)
            if bound:
                row["boundVariables"] = bound
            rows.append(row)
        for ch in node.get("children") or []:
            if isinstance(ch, dict):
                walk(ch, depth + 1)

    if isinstance(doc, dict):
        walk(doc)
    return rows


def _fetch_images_rest(file_key: str, node_ids: list[str]) -> dict[str, Any]:
    if not settings.figma_token or not node_ids:
        return {}
    ids = ",".join(n.replace("-", ":") for n in node_ids[:_MAX_IMAGE_NODES])
    url = f"https://api.figma.com/v1/images/{file_key}"
    r = requests.get(
        url,
        headers={"X-Figma-Token": settings.figma_token},
        params={"ids": ids, "format": "png", "scale": 2},
        timeout=120,
    )
    if r.status_code >= 400:
        return {"error": f"images HTTP {r.status_code}: {r.text[:200]}"}
    data = r.json() or {}
    return {
        "images": data.get("images") or {},
        "status": data.get("status"),
        "err": data.get("err"),
    }


def _fetch_variables_rest(file_key: str) -> dict[str, Any]:
    """
    Prefer ingestion helpers without modifying them.
    Falls back to direct REST if helper import/token wiring fails.
    """
    _ensure_repo_on_path()
    # Bridge collab token into process env so root helpers that read
    # config.settings / os.getenv see the same PAT (no helper edits).
    if settings.figma_token and not __import__("os").environ.get("FIGMA_TOKEN"):
        __import__("os").environ["FIGMA_TOKEN"] = settings.figma_token

    try:
        from ingestion.figma_variables_rest import fetch_variables

        normalized = fetch_variables(file_key, mode="both")
        compact = []
        for row in normalized[:_MAX_VAR_BULLETS]:
            compact.append(
                {
                    "name": row.get("name"),
                    "id": row.get("id"),
                    "resolvedType": row.get("resolvedType"),
                    "codeSyntax": row.get("codeSyntax"),
                    "valuesByTheme": row.get("valuesByTheme"),
                    "variableCollectionName": row.get("variableCollectionName"),
                }
            )
        return {"normalized": compact, "count": len(normalized)}
    except Exception as exc:  # noqa: BLE001
        logger.warning("fetch_variables helper failed for %s: %s", file_key, exc)

    # Fallback: FigmaSyncClient.get_variables + summarize_variables (unchanged helpers)
    try:
        from ingestion.figma_sync_client import FigmaSyncClient
        from ingestion.figma_spec_extract import summarize_variables

        client = FigmaSyncClient(token=settings.figma_token)
        raw = client.get_variables(file_key) or {}
        meta = raw.get("meta") or raw
        shaped = {
            "variables": meta.get("variables") or {},
            "variableCollections": list((meta.get("variableCollections") or {}).values())
            if isinstance(meta.get("variableCollections"), dict)
            else (meta.get("variableCollections") or []),
        }
        bullets = summarize_variables(shaped, limit=_MAX_VAR_BULLETS)
        return {"bullets": bullets, "rawMetaKeys": list((meta or {}).keys())[:12]}
    except Exception as exc:  # noqa: BLE001
        return {"error": str(exc)}


def _fetch_nodes_rest(file_key: str, node_id: str, *, enrich: bool = True) -> dict[str, Any]:
    if not settings.figma_token:
        raise RuntimeError("FIGMA_TOKEN is required for REST Figma fetch")
    nid = node_id.replace("-", ":")

    if not enrich:
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
            return {
                "fileKey": file_key,
                "nodeId": nid,
                "error": "node not found",
                "source": "figma_rest",
            }
        doc = entry.get("document") or {}
        return {
            "fileKey": file_key,
            "nodeId": nid,
            "name": doc.get("name"),
            "structure": _summarize_node(doc),
            "source": "figma_rest",
        }

    _ensure_repo_on_path()
    from ingestion.figma_spec_extract import extract_from_nodes_response
    from ingestion.figma_sync_client import FigmaSyncClient

    client = FigmaSyncClient(token=settings.figma_token)
    data = client.get_file_nodes(file_key, [nid])
    nodes = data.get("nodes") or {}
    entry = nodes.get(nid) or next(iter(nodes.values()), None)
    if not entry:
        return {
            "fileKey": file_key,
            "nodeId": nid,
            "error": "node not found",
            "source": "figma_rest_enriched",
        }
    doc = entry.get("document") or {}
    spec_fragments = extract_from_nodes_response(data, nid)
    # Trim fragment lists for payload size.
    trimmed = {
        k: (v[:_MAX_SPEC_LINES] if isinstance(v, list) else v)
        for k, v in (spec_fragments or {}).items()
    }

    image_payload = _fetch_images_rest(file_key, [nid])
    variables = _fetch_variables_rest(file_key)

    return {
        "fileKey": file_key,
        "nodeId": nid,
        "name": doc.get("name"),
        "structure": _summarize_node(doc),
        "source": "figma_rest_enriched",
        "verificationMethod": "Figma REST API",
        "tools": {
            # MCP-parity shaped keys so client prompts stay stable.
            "get_metadata": {
                "name": doc.get("name"),
                "type": doc.get("type"),
                "structure": _summarize_node(doc),
            },
            "get_design_context": trimmed,
            "get_variable_defs": variables,
            "get_screenshot": image_payload,
        },
        "slotGeometry": _slot_geometry_rows(doc),
        "specFragments": trimmed,
        "variables": variables,
        "screenshots": image_payload,
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
                "source": "stub",
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


def _normalize_items(items: list[Any]) -> list[dict[str, Any]]:
    normalized: list[dict[str, Any]] = []
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
    return normalized


def _looks_like_auth_error(message: str) -> bool:
    msg = (message or "").lower()
    return any(
        token in msg
        for token in (
            "401",
            "403",
            "unauthorized",
            "forbidden",
            "invalid access token",
            "figma_token",
            "x-figma-token",
            "token auth",
        )
    )


def _raise_if_server_auth_failed(evidence: dict[str, Any]) -> None:
    auth_errors: list[str] = []
    for bucket_rows in (evidence.get("buckets") or {}).values():
        for row in bucket_rows or []:
            message = str(row.get("error") or row.get("mcpFallbackError") or "")
            if message and _looks_like_auth_error(message):
                auth_errors.append(message)
    if auth_errors:
        sample = auth_errors[0]
        raise RuntimeError(
            "Server-side Figma packaging failed due to authentication/authorization. "
            "Fix the server Figma credentials or MCP access before starting a client session. "
            f"Sample error: {sample}"
        )


def _collect_node_errors(evidence: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for bucket, rows in (evidence.get("buckets") or {}).items():
        for i, row in enumerate(rows or []):
            if not isinstance(row, dict):
                continue
            err = row.get("error")
            if err:
                url = row.get("url") or row.get("nodeId") or i
                errors.append(f"{bucket}[{i}]: {err} ({url})")
    return errors


def _raise_if_packaging_incomplete(evidence: dict[str, Any]) -> None:
    """Do not hand clients a session with failed Main Figma evidence (non-stub)."""
    mode = (evidence.get("mode") or "").lower()
    if mode == "stub":
        return
    buckets = evidence.get("buckets") or {}
    main = buckets.get("main") or []
    if not main:
        raise RuntimeError(
            "Figma packaging incomplete: Main bucket is empty. "
            "Provide at least one Main Figma URL with node-id."
        )
    main_ok = [
        r
        for r in main
        if isinstance(r, dict) and not r.get("error") and r.get("structure")
    ]
    if not main_ok:
        errs = _collect_node_errors(evidence)
        sample = "; ".join(errs[:3]) if errs else "unknown error"
        raise RuntimeError(
            "Figma packaging incomplete: every Main node failed. "
            "Fix FIGMA_TOKEN / file access / node ids, then Start session again. "
            f"Errors: {sample}"
        )


def _evidence_completeness(evidence: dict[str, Any]) -> dict[str, Any]:
    buckets = evidence.get("buckets") or {}
    summary: dict[str, Any] = {"buckets": {}, "ok": True, "warnings": []}
    for name in ("main", "elements", "states"):
        rows = buckets.get(name) or []
        ok = sum(
            1
            for r in rows
            if isinstance(r, dict) and not r.get("error") and (r.get("structure") or r.get("tools"))
        )
        err = sum(1 for r in rows if isinstance(r, dict) and r.get("error"))
        summary["buckets"][name] = {"nodes": len(rows), "ok": ok, "errors": err}
        if name == "main" and ok == 0:
            summary["ok"] = False
        if name in ("elements", "states") and len(rows) == 0:
            summary["warnings"].append(
                f"No {name} URLs packaged — state/variant depth may be limited."
            )
        if err:
            summary["warnings"].append(f"{name}: {err} node(s) failed")
    return summary


def _fetch_one(it: dict[str, Any], *, mode: str) -> dict[str, Any]:
    fk = it.get("file_key") or it.get("fileKey")
    nid = it.get("node_id") or it.get("nodeId")
    url = it.get("url") or ""
    if not fk or not nid:
        return {"error": "missing file_key/node_id", "raw": it}

    if mode == "mcp":
        try:
            return fetch_node_via_mcp(str(url), file_key=str(fk), node_id=str(nid))
        except Exception as exc:  # noqa: BLE001
            logger.warning("MCP packaging failed, falling back to enriched REST: %s", exc)
            try:
                rest = _fetch_nodes_rest(str(fk), str(nid), enrich=True)
                rest["mcpFallbackError"] = str(exc)
                rest["url"] = url
                return rest
            except Exception as rest_exc:  # noqa: BLE001
                return {
                    "fileKey": fk,
                    "nodeId": nid,
                    "url": url,
                    "error": f"mcp: {exc}; rest: {rest_exc}",
                    "source": "failed",
                }

    if mode in ("rest", "live"):
        try:
            row = _fetch_nodes_rest(str(fk), str(nid), enrich=True)
            row["url"] = url
            return row
        except Exception as exc:  # noqa: BLE001
            return {
                "fileKey": fk,
                "nodeId": nid,
                "url": url,
                "error": str(exc),
                "source": "figma_rest",
            }

    return {"error": f"unknown FIGMA_MODE={mode}", "raw": it}


def build_figma_evidence(preview: dict[str, Any]) -> dict[str, Any]:
    """
    Build compact evidence from intake preview.figma buckets.
    FIGMA_MODE: stub | mcp | rest (live is alias of rest).
    """
    figma = preview.get("figma") or {}
    mode = (settings.figma_mode or "rest").strip().lower()
    if mode == "live":
        mode = "rest"

    evidence: dict[str, Any] = {
        "mode": mode,
        "buckets": {},
        "figma_mcp": figma_mcp_public_contract(),
        "packagingNote": (
            "Client must use this packaged figma_evidence only. "
            "Do not connect client-side Figma MCP or request Figma authentication."
        ),
    }

    if mode == "mcp":
        ok, missing = mcp_configured()
        evidence["mcpConfigured"] = ok
        if not ok:
            evidence["mcpMissing"] = missing

    # Cache variables once per file key within this packaging run.
    var_cache: dict[str, dict[str, Any]] = {}

    for bucket in ("main", "elements", "states"):
        items = _normalize_items(figma.get(bucket) or [])
        if mode == "stub":
            evidence["buckets"][bucket] = _stub_bucket(bucket, items)
            continue
        rows = []
        for it in items:
            row = _fetch_one(it, mode=mode)
            fk = str(row.get("fileKey") or it.get("file_key") or it.get("fileKey") or "")
            if (
                mode in ("rest", "live")
                and fk
                and isinstance(row.get("variables"), dict)
                and "error" not in row.get("variables", {})
            ):
                var_cache.setdefault(fk, row["variables"])
            elif mode in ("rest", "live") and fk and "variables" not in row:
                if fk not in var_cache:
                    var_cache[fk] = _fetch_variables_rest(fk)
                row["variables"] = var_cache[fk]
                tools = row.get("tools") if isinstance(row.get("tools"), dict) else {}
                tools["get_variable_defs"] = var_cache[fk]
                row["tools"] = tools
            rows.append(row)
        evidence["buckets"][bucket] = rows

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
    evidence["clientGuidance"] = {
        "usePackagedEvidenceOnly": True,
        "forbidClientFigmaAuth": True,
        "youAreTheAuthor": True,
        "preferKeys": [
            "tools.get_design_context",
            "tools.get_variable_defs",
            "tools.get_screenshot",
            "slotGeometry",
            "specFragments",
            "variables",
            "screenshots",
        ],
        "slotGeometryRequired": True,
        "sourceMappingRequired": True,
        "preferSemanticTokens": True,
        "verificationMethod": "Figma REST API" if mode == "rest" else "Figma MCP",
        "designSpecMustInclude": [
            "### Slot geometry (Figma-verified) under Layout & Measurements",
            "States tables with Background / Border / Text-Icon",
            "Codegen Contract with all required ### subsections",
            "Source Mapping with file key + node ids from this evidence",
        ],
    }
    evidence["completeness"] = _evidence_completeness(evidence)
    _raise_if_server_auth_failed(evidence)
    _raise_if_packaging_incomplete(evidence)
    return evidence
