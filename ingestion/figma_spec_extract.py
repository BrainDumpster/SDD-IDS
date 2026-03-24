"""Walk Figma node JSON and variables into LLM-friendly spec fragments."""
from __future__ import annotations

import json
from typing import Any, Dict, List, Optional, Tuple


def _rgba(fill: Dict[str, Any]) -> str:
    c = fill.get("color") or {}
    r = int((c.get("r", 0) or 0) * 255)
    g = int((c.get("g", 0) or 0) * 255)
    b = int((c.get("b", 0) or 0) * 255)
    a = c.get("a", 1)
    if a is not None and float(a) < 1.0:
        return f"rgba({r},{g},{b},{a:.2f})"
    return f"#{r:02x}{g:02x}{b:02x}"


def _summarize_fills(fills: Any) -> List[str]:
    if not fills or not isinstance(fills, list):
        return []
    out: List[str] = []
    for f in fills[:5]:
        if not isinstance(f, dict) or not f.get("visible", True):
            continue
        t = f.get("type")
        if t == "SOLID" and f.get("color"):
            out.append(_rgba(f))
        elif t:
            out.append(str(t))
    return out


def _walk_node(
    node: Dict[str, Any],
    depth: int,
    max_depth: int,
    counter: List[int],
    max_nodes: int,
    lines: Dict[str, List[str]],
) -> None:
    if counter[0] >= max_nodes or depth > max_depth:
        return
    counter[0] += 1

    name = node.get("name", "")
    ntype = node.get("type", "")
    visible = node.get("visible", True)
    if not visible:
        pass

    bbox = node.get("absoluteBoundingBox")
    if bbox and isinstance(bbox, dict):
        w, h = bbox.get("width"), bbox.get("height")
        if w and h and ntype in ("FRAME", "COMPONENT", "INSTANCE", "RECTANGLE", "COMPONENT_SET"):
            lines["layout"].append(f"- **{name or ntype}** ({ntype}): {w:.0f}×{h:.0f}px")

    pad = []
    for k in ("paddingLeft", "paddingRight", "paddingTop", "paddingBottom"):
        if node.get(k) is not None:
            pad.append(f"{k.replace('padding', '')}={node.get(k)}")
    if pad:
        lines["layout"].append(f"- **{name or ntype}** padding: {', '.join(pad)}")

    if node.get("itemSpacing") is not None:
        lines["layout"].append(f"- **{name or ntype}** itemSpacing={node.get('itemSpacing')} ({node.get('layoutMode', 'AUTO')})")

    if node.get("cornerRadius") is not None:
        lines["layout"].append(f"- **{name or ntype}** cornerRadius={node.get('cornerRadius')}")

    chars = node.get("characters")
    if isinstance(chars, str) and chars.strip():
        preview = chars.strip().replace("\n", " ")[:120]
        style = node.get("style") or {}
        font = style.get("fontFamily", "")
        size = style.get("fontSize", "")
        lh = style.get("lineHeightPx") or style.get("lineHeightPercentFontSize", "")
        weight = style.get("fontWeight", "")
        lines["typography"].append(
            f"- Text “{preview}” — {font or 'font'} {size}px / {lh} / weight {weight}"
        )

    fills = _summarize_fills(node.get("fills"))
    if fills:
        lines["colors"].append(f"- **{name or ntype}** fill: {', '.join(fills)}")

    strokes = _summarize_fills(node.get("strokes"))
    if strokes:
        sw = node.get("strokeWeight", "")
        lines["colors"].append(f"- **{name or ntype}** stroke ({sw}px): {', '.join(strokes)}")

    if ntype in ("COMPONENT", "INSTANCE", "FRAME") and name:
        lines["anatomy"].append(f"- **{name}** ({ntype})")

    for ch in node.get("children") or []:
        if isinstance(ch, dict):
            _walk_node(ch, depth + 1, max_depth, counter, max_nodes, lines)


def extract_from_nodes_response(nodes_json: Dict[str, Any], node_id: str) -> Dict[str, List[str]]:
    """Extract categorized bullets from GET /files/{key}/nodes response."""
    nid = node_id.replace("-", ":")
    lines: Dict[str, List[str]] = {
        "layout": [],
        "typography": [],
        "colors": [],
        "anatomy": [],
    }
    nodes = nodes_json.get("nodes") or {}
    entry = nodes.get(nid)
    if not entry:
        for k, v in nodes.items():
            if k.replace("-", ":") == nid or k.replace(":", "-") == node_id.replace(":", "-"):
                entry = v
                break
    if not entry:
        return lines
    doc = entry.get("document")
    if not isinstance(doc, dict):
        return lines
    counter = [0]
    _walk_node(doc, 0, 12, counter, 400, lines)
    # dedupe while preserving order
    for k in lines:
        seen = set()
        uniq: List[str] = []
        for x in lines[k]:
            if x not in seen:
                seen.add(x)
                uniq.append(x)
        lines[k] = uniq[:80]
    return lines


def summarize_variables(variables_json: Dict[str, Any], limit: int = 60) -> List[str]:
    """Flatten variables into bullet lines for Tokens section."""
    bullets: List[str] = []
    vars_map = variables_json.get("variables") or {}
    collections = variables_json.get("variableCollections") or []

    coll_names: Dict[str, str] = {}
    for c in collections:
        cid = c.get("id")
        if cid:
            coll_names[cid] = c.get("name", "collection")

    for vid, v in list(vars_map.items())[:limit]:
        if not isinstance(v, dict):
            continue
        name = v.get("name", vid)
        resolved = v.get("resolvedType", v.get("type", ""))
        cid = v.get("variableCollectionId", "")
        cname = coll_names.get(cid, "")
        bullets.append(f"- `{name}` ({resolved}) — collection *{cname}*")
    return bullets


def build_figma_source_block(
    figma_url: str,
    file_key: str,
    node_id: str,
    node_name: str,
    map_path: str,
) -> str:
    return "\n".join(
        [
            f"- Figma component: **{node_name}** (`{node_id}`)",
            f"- File URL: {figma_url}",
            f"- File key: `{file_key}`",
            f"- Component map: `{map_path}`",
        ]
    )
