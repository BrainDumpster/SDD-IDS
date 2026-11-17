"""Figma MCP HTTP client (portal-style: FIGMA_MCP_URL + Bearer FIGMA_TOKEN).

Server-side tool calls only — no LLM. Used while packaging session evidence.
"""

from __future__ import annotations

import json
import logging
from typing import Any

import httpx

from .config import settings

logger = logging.getLogger(__name__)

MCP_TOOLS = (
    "get_metadata",
    "get_variable_defs",
    "get_design_context",
    "get_screenshot",
)


class FigmaMcpError(RuntimeError):
    pass


def mcp_configured() -> tuple[bool, list[str]]:
    missing: list[str] = []
    if not settings.figma_token:
        missing.append("FIGMA_TOKEN")
    if not (settings.figma_mcp_url or "").strip():
        missing.append("FIGMA_MCP_URL")
    return (len(missing) == 0, missing)


def figma_mcp_public_contract() -> dict[str, Any]:
    """Safe-to-publish MCP contract for the client agent (no secrets)."""
    return {
        "server": "figma",
        "type": "http",
        "url": (settings.figma_mcp_url or "https://api.figma.com/mcp").rstrip("/"),
        "tools": list(MCP_TOOLS),
        "authNote": (
            "Server packages Figma evidence using FIGMA_TOKEN on the collab backend. "
            "Client agents must not connect Figma MCP or request Figma authentication."
        ),
        "requiredCalls": [
            "get_screenshot",
            "get_metadata",
            "get_variable_defs",
            "get_design_context",
        ],
        "portalParity": (
            "Live Figma on EVERY Main / Elements / States URL (MCP preferred): "
            "get_screenshot, get_metadata, get_variable_defs, get_design_context."
        ),
    }


def _headers() -> dict[str, str]:
    if not settings.figma_token:
        raise FigmaMcpError("FIGMA_TOKEN is not set")
    # Personal access tokens (figd_*) must use X-Figma-Token.
    # Authorization: Bearer is for OAuth tokens and returns 401 for figd_*.
    token = settings.figma_token.strip()
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }
    if token.startswith("figd_"):
        headers["X-Figma-Token"] = token
    else:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def _parse_rpc_response(text: str) -> Any:
    """Parse JSON-RPC or SSE data: lines."""
    text = (text or "").strip()
    if not text:
        return None
    if text.startswith("{"):
        return json.loads(text)
    # SSE: look for data: {...}
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("data:"):
            payload = line[5:].strip()
            if payload and payload != "[DONE]":
                try:
                    return json.loads(payload)
                except json.JSONDecodeError:
                    continue
    # last JSON object in stream
    last = None
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("{"):
            try:
                last = json.loads(s)
            except json.JSONDecodeError:
                pass
    return last


def call_tool(name: str, arguments: dict[str, Any], *, timeout: float = 120.0) -> Any:
    """
    Call a Figma MCP tool over HTTP JSON-RPC (tools/call).
    Matches portal AgentOptions mcp_servers.figma transport (HTTP + Bearer).
    """
    ok, missing = mcp_configured()
    if not ok:
        raise FigmaMcpError("Figma MCP not configured: " + ", ".join(missing))

    url = settings.figma_mcp_url.rstrip("/")
    # Some gateways want /mcp path already in settings; keep as-is.
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": name, "arguments": arguments},
    }
    with httpx.Client(timeout=timeout) as client:
        res = client.post(url, headers=_headers(), json=payload)
        if res.status_code >= 400:
            raise FigmaMcpError(
                f"MCP {name} HTTP {res.status_code}: {res.text[:400]}"
            )
        data = _parse_rpc_response(res.text)
        if data is None:
            raise FigmaMcpError(f"MCP {name}: empty response")
        if isinstance(data, dict) and data.get("error"):
            raise FigmaMcpError(f"MCP {name} error: {data['error']}")
        result = data.get("result") if isinstance(data, dict) else data
        return _normalize_tool_result(result)


def _normalize_tool_result(result: Any) -> Any:
    if result is None:
        return None
    if isinstance(result, dict) and "content" in result:
        parts = result.get("content") or []
        texts: list[str] = []
        for p in parts:
            if isinstance(p, dict) and p.get("text"):
                texts.append(str(p["text"]))
            elif isinstance(p, str):
                texts.append(p)
        if not texts:
            return result
        joined = "\n".join(texts)
        try:
            return json.loads(joined)
        except json.JSONDecodeError:
            return {"text": joined[:50000], "truncated": len(joined) > 50000}
    if isinstance(result, (dict, list)):
        return result
    return {"value": result}


def fetch_node_via_mcp(figma_url: str, *, file_key: str, node_id: str) -> dict[str, Any]:
    """Run the portal-preferred MCP tool set for one Figma URL (no LLM)."""
    nid = node_id.replace("-", ":")
    args_url = {"url": figma_url}
    args_ids = {"fileKey": file_key, "nodeId": nid}
    out: dict[str, Any] = {
        "url": figma_url,
        "fileKey": file_key,
        "nodeId": nid,
        "source": "figma_mcp",
        "mcpUrl": settings.figma_mcp_url,
        "tools": {},
        "errors": {},
    }

    for tool in ("get_metadata", "get_variable_defs", "get_design_context"):
        try:
            try:
                out["tools"][tool] = call_tool(tool, args_url)
            except FigmaMcpError:
                out["tools"][tool] = call_tool(tool, args_ids)
        except Exception as exc:  # noqa: BLE001
            logger.warning("MCP %s failed for %s: %s", tool, figma_url[:80], exc)
            out["errors"][tool] = str(exc)

    # Screenshot is optional / larger — best-effort
    try:
        try:
            out["tools"]["get_screenshot"] = call_tool("get_screenshot", args_url)
        except FigmaMcpError:
            out["tools"]["get_screenshot"] = call_tool("get_screenshot", args_ids)
    except Exception as exc:  # noqa: BLE001
        out["errors"]["get_screenshot"] = str(exc)

    if not out["tools"] and out["errors"]:
        raise FigmaMcpError(
            "All MCP tools failed: " + "; ".join(out["errors"].values())
        )
    return out
