"""Walk Figma node JSON and variables into LLM-friendly spec fragments."""
from __future__ import annotations

import json
import re
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


# ---------------------------------------------------------------------------
# Slot geometry (Figma-verified) extraction
# ---------------------------------------------------------------------------

SLOT_GEOMETRY_HEADING = "### Slot geometry (Figma-verified)"
SLOT_GEOMETRY_TABLE_HEADER = (
    "| Slot / layer | Property | Token / contract | Figma node | Live evidence |"
)
SLOT_GEOMETRY_RULES = """**Geometry authoring rules (mandatory):**
- Document **each** interactive shell separately: field/control, focus ring, menu/panel, inner action wrappers.
- Values must come from **live Figma** on the cited node (`get_variable_defs` preferred for radius bindings). Do **not** infer from `ids-theme.css`, sibling components (e.g. Button), or programme fork tables alone.
- When Figma binds `Corner Radius/radius-none` (0px), record **0px / square** — absence of `border-radius` in `get_design_context` output is not sufficient proof; call `get_variable_defs` on the Container node.
- Theme aliases (`--dropdown-control-radius`, etc.) document **implementation wiring** only after the Figma value is verified; alias resolved value must match the table.
- Programme fork specs: verify **programme** nodes for overrides; IDS baseline geometry inherits from the IDS spec table unless a delta row exists.
"""


def _pascal_case(name: str) -> str:
    """Convert a Figma node name to a PascalCase slot identifier."""
    parts = [p for p in re.split(r"[^\w]+", name) if p]
    return "".join(p[:1].upper() + p[1:] for p in parts)


def _css_var_name(token_name: str) -> str:
    return token_name.lower().replace(' ', '-').replace('/', '-')


def _build_variable_map(variables_json: Optional[Dict[str, Any]]) -> Dict[str, str]:
    """Map Figma variable IDs to ``Collection/name`` token names."""
    variable_map: Dict[str, str] = {}
    if not variables_json or not isinstance(variables_json, dict):
        return variable_map

    data = variables_json.get("meta") if isinstance(variables_json.get("meta"), dict) else variables_json
    variables = data.get("variables") or {}
    collections = data.get("variableCollections") or []

    coll_names: Dict[str, str] = {}
    if isinstance(collections, dict):
        for cid, c in collections.items():
            coll_names[cid] = c.get("name", "")
    else:
        for c in collections:
            cid = c.get("id")
            if cid:
                coll_names[cid] = c.get("name", "")

    def _register(var_id: str, var: Dict[str, Any]) -> None:
        name = var.get("name", var_id) if isinstance(var, dict) else var_id
        cid = var.get("variableCollectionId") if isinstance(var, dict) else None
        cname = coll_names.get(cid, "") if cid else ""
        semantic = f"{cname}/{name}" if cname else name
        variable_map[var_id] = semantic
        variable_map[f"VariableID:{var_id}"] = semantic

    for var_id, var in variables.items():
        if isinstance(var, dict):
            _register(var_id, var)

    if isinstance(collections, dict):
        for cid, c in collections.items():
            for var_id in c.get("variableIds") or []:
                if var_id in variables and var_id not in variable_map:
                    _register(var_id, variables[var_id])
    else:
        for c in collections:
            for var_id in c.get("variableIds") or []:
                if var_id in variables and var_id not in variable_map:
                    _register(var_id, variables[var_id])

    return variable_map


def _resolve_variable(bound_value: Any, variable_map: Dict[str, str]) -> Optional[str]:
    """Return the ``Collection/name`` token for a bound Figma variable alias."""
    if bound_value is None:
        return None
    if isinstance(bound_value, list):
        for v in bound_value:
            res = _resolve_variable(v, variable_map)
            if res:
                return res
        return None
    if isinstance(bound_value, dict):
        if bound_value.get("type") == "VARIABLE_ALIAS" or "id" in bound_value:
            var_id = bound_value.get("id")
            if var_id:
                return variable_map.get(var_id) or variable_map.get(
                    str(var_id).replace("VariableID:", "")
                )
    return None


def _resolve_bound_variable(
    node: Dict[str, Any], key: str, variable_map: Dict[str, str]
) -> Optional[str]:
    """Resolve a bound variable name for a given property on a node."""
    bound = node.get("boundVariables") or {}
    return _resolve_variable(bound.get(key), variable_map)


def _token_contract(
    token_name: Optional[str], raw_value: Any, unit: str = "px"
) -> str:
    """Format the Token / contract cell value."""
    if token_name:
        css = _css_var_name(token_name)
        if raw_value is not None:
            if isinstance(raw_value, (int, float)):
                return f"`var(--{css})` ({raw_value}{unit})"
            return f"`var(--{css})` ({raw_value})"
        return f"`var(--{css})`"
    if raw_value is not None:
        if isinstance(raw_value, (int, float)):
            return f"{raw_value}{unit}"
        return str(raw_value)
    return "—"


def _variant_props(path_names: List[str]) -> Dict[str, str]:
    """Parse Figma variant property key=value pairs from the path names."""
    props: Dict[str, str] = {}
    for name in path_names:
        for part in name.split(","):
            if "=" in part:
                key, value = part.split("=", 1)
                props[key.strip().lower()] = value.strip().lower()
    return props


def _detect_size(path_names: List[str]) -> str:
    """Derive a size label from variant properties in the path."""
    props = _variant_props(path_names)
    size_map: Dict[str, str] = {
        "xs": "xs",
        "small": "small",
        "medium": "medium",
        "large": "large",
        "xl": "xl",
        "compact": "compact",
        "expanded": "expanded",
    }
    size = size_map.get(props.get("size", ""))
    icon_only = props.get("icon only") == "yes"
    if icon_only:
        return f"icon-only {size}" if size else "icon-only"
    return size or "default"


_SIZE_ORDER = {
    "default": 0,
    "xs": 1,
    "small": 2,
    "medium": 3,
    "large": 4,
    "xl": 5,
    "compact": 2.5,
    "expanded": 4.5,
    "icon-only": 10,
    "icon-only xs": 10.5,
    "icon-only small": 11,
    "icon-only medium": 12,
    "icon-only large": 13,
    "icon-only xl": 14.5,
}


def _size_sort_key(size_label: str) -> float:
    return _SIZE_ORDER.get(size_label, 100 + len(size_label))


_SKIP_SLOT = "__skip_slot__"


def _slot_label(
    name: str,
    ntype: str,
    component_pascal: str,
    path_names: Optional[List[str]] = None,
    node: Optional[Dict[str, Any]] = None,
) -> str:
    """Map a Figma node name to a canonical slot / layer name."""
    lower = name.lower()
    props = _variant_props(path_names or [])
    has_icon = props.get("icon") == "yes" or props.get("icon only") == "yes"

    # Component/Instance variants with property-laden names are the component root itself.
    if ntype in ("COMPONENT", "INSTANCE", "FRAME") and ("=" in name or "," in name):
        return f"{component_pascal}Root" if component_pascal else _pascal_case(name)

    if "focus" in lower or "ring" in lower or "outline" in lower:
        return "FocusRing"
    if "overlay" in lower:
        return "Overlay"
    if ntype == "TEXT":
        # The main text inside a component is its label slot.
        if component_pascal and (
            "label" in lower
            or "text" in lower
            or "title" in lower
            or lower == component_pascal.lower()
            or lower == "button"
        ):
            return f"{component_pascal}Label"
        return f"{component_pascal}Label" if component_pascal else _pascal_case(name)

    # Treat common icon-y layer names as icon slots, but only when the variant
    # actually renders an icon. Skip unrelated vector glyphs.
    is_icon_name = (
        "icon" in lower
        or any(k in lower for k in ("gear", "settings", "arrow", "chevron", "svg", "image"))
    )
    if is_icon_name:
        if not has_icon:
            return _SKIP_SLOT
        if "leading" in lower or "start" in lower or "left" in lower:
            return f"{component_pascal}LeadingIcon" if component_pascal else _pascal_case(name)
        if "trailing" in lower or "end" in lower or "right" in lower:
            return f"{component_pascal}TrailingIcon" if component_pascal else _pascal_case(name)
        return f"{component_pascal}Icon" if component_pascal else _pascal_case(name)

    # "base" is a common nested vector name for a component\'s icon glyph.
    if lower == "base" and ntype in ("VECTOR", "RECTANGLE", "SHAPE"):
        if has_icon:
            return f"{component_pascal}Icon" if component_pascal else _pascal_case(name)
        return _SKIP_SLOT

    # Fallback: small geometry-only instances/vectors that are children of a
    # variant root are treated as the component icon glyph.
    bbox = node.get("absoluteBoundingBox") if node else None
    is_small_icon = (
        bbox
        and bbox.get("width", 0) <= 32
        and bbox.get("height", 0) <= 32
        and node.get("paddingLeft") is None
        and node.get("cornerRadius") is None
        and ntype in ("INSTANCE", "COMPONENT", "VECTOR", "RECTANGLE", "SHAPE")
        and any("=" in n or "," in n for n in (path_names or []))
    )
    if is_small_icon:
        return f"{component_pascal}Icon" if component_pascal else _pascal_case(name)

    if "root" in lower:
        return _pascal_case(name)
    if (
        "container" in lower
        or "background" in lower
        or "field" in lower
        or "control" in lower
    ):
        return f"{component_pascal}Root" if component_pascal else _pascal_case(name)
    if component_pascal and _pascal_case(name).lower() == component_pascal.lower():
        return f"{component_pascal}Root"
    return _pascal_case(name) or "Shell"


def _is_variant_container(name: str, node: Dict[str, Any] | None = None) -> bool:
    """Exclude variant/spec frames that are not themselves slots.

    A node that already has its own geometry (bbox, radius, padding) is a real
    slot even if its name looks like a variant property list.
    """
    has_geometry = bool(
        node
        and (
            node.get("absoluteBoundingBox")
            or node.get("cornerRadius") is not None
            or node.get("paddingLeft") is not None
        )
    )
    if has_geometry:
        return False
    lower = name.lower()
    return (
        "=" in name
        or "," in name
        or lower.startswith("variant")
        or "size=" in lower
        or "state=" in lower
    )


def _collect_slot_nodes(
    node: Dict[str, Any],
    component_pascal: str,
    variable_map: Dict[str, str],
    ancestors: Optional[List[str]] = None,
    depth: int = 0,
    max_depth: int = 12,
    counter: Optional[List[int]] = None,
    max_nodes: int = 500,
) -> List[Dict[str, Any]]:
    """Recursively collect candidate slot nodes from a Figma document tree."""
    if counter is None:
        counter = [0]
    if counter[0] >= max_nodes or depth > max_depth:
        return []
    counter[0] += 1

    name = node.get("name", "")
    ntype = node.get("type", "")
    # Hidden nodes (e.g. focus rings) still carry geometry; include them.
    if ancestors is None:
        ancestors = []

    collected: List[Dict[str, Any]] = []
    is_candidate = False
    if ntype in ("FRAME", "COMPONENT", "INSTANCE", "RECTANGLE", "VECTOR", "TEXT"):
        if ntype == "TEXT":
            is_candidate = True
        elif node.get("absoluteBoundingBox"):
            is_candidate = True
        elif node.get("cornerRadius") is not None:
            is_candidate = True
        elif any(
            node.get(k) is not None
            for k in (
                "paddingLeft",
                "paddingRight",
                "paddingTop",
                "paddingBottom",
                "itemSpacing",
            )
        ):
            is_candidate = True

    if is_candidate and not _is_variant_container(name, node) and depth >= 1:
        slot = _slot_label(name, ntype, component_pascal, ancestors + [name], node)
        size = _detect_size(ancestors + [name])
        collected.append(
            {
                "name": name,
                "type": ntype,
                "slot": slot,
                "size": size,
                "node_id": node.get("id", ""),
                "node": node,
                "depth": depth,
            }
        )
        # Don\'t recurse into collected icon instances/components; their child
        # vectors (e.g. \"base\") are not separate slots.
        if slot.endswith("Icon") and ntype in ("INSTANCE", "COMPONENT"):
            return collected

    for ch in node.get("children") or []:
        if isinstance(ch, dict):
            collected.extend(
                _collect_slot_nodes(
                    ch,
                    component_pascal,
                    variable_map,
                    ancestors + [name],
                    depth + 1,
                    max_depth,
                    counter,
                    max_nodes,
                )
            )

    return collected


def _add_row(
    rows: Dict[Tuple[str, str], Dict[str, Dict[str, Any]]],
    slot: str,
    prop: str,
    size: str,
    value: Any,
    node_id: str,
    token_name: Optional[str] = None,
) -> None:
    key = (slot, prop)
    if key not in rows:
        rows[key] = {}
    rows[key][size] = {"value": value, "node_id": node_id, "token_name": token_name}


def _combine_per_size(items: Dict[str, Dict[str, Any]]) -> str:
    """Turn a {size: {value, token_name}} map into one Token / contract cell string."""
    if not items:
        return "—"

    values = {it["value"] for it in items.values()}
    tokens = {it.get("token_name") for it in items.values() if it.get("token_name")}

    # If every size resolves to the same raw value, collapse to a single entry.
    if len(values) == 1:
        token = next(iter(tokens), None)
        return _token_contract(token, next(iter(values)), unit="px")

    ordered = sorted(items.items(), key=lambda x: _size_sort_key(x[0]))
    parts: List[str] = []
    for size_label, it in ordered:
        contract = _token_contract(it.get("token_name"), it["value"], unit="px")
        parts.append(f"{size_label} {contract}")
    return "; ".join(parts)


def _representative_node_id(
    items: Dict[str, Dict[str, Any]], context_node_id: str
) -> str:
    """Pick the most specific Figma node id for a group of size rows."""
    node_ids = {it["node_id"] for it in items.values() if it.get("node_id")}
    if len(node_ids) == 1:
        return node_ids.pop()
    return context_node_id


def _format_evidence(node_id: str, context_node_id: str) -> str:
    return (
        f"`get_variable_defs` on `{node_id}`; "
        f"`get_design_context` on `{context_node_id}`"
    )


def _extract_slot_rows_from_node(
    record: Dict[str, Any],
    rows: Dict[Tuple[str, str], Dict[str, Dict[str, Any]]],
    variable_map: Dict[str, str],
    context_node_id: str,
) -> None:
    """Populate rows from a single collected slot node."""
    node = record["node"]
    slot = record["slot"]
    size = record["size"]
    node_id = record["node_id"] or context_node_id
    ntype = record["type"]
    bbox = node.get("absoluteBoundingBox") or {}

    is_root = slot.endswith("Root")
    is_shell = is_root or slot in ("FocusRing", "Overlay")

    # Border radius (required for any shell)
    corner = node.get("cornerRadius")
    corner_token = _resolve_bound_variable(node, "cornerRadius", variable_map)
    if corner is not None:
        _add_row(rows, slot, "border-radius", size, corner, node_id, corner_token)
    elif corner_token:
        _add_row(rows, slot, "border-radius", size, 0, node_id, corner_token)
    elif is_shell:
        _add_row(rows, slot, "border-radius", size, 0, node_id)

    # Dimensions
    height = bbox.get("height")
    width = bbox.get("width")
    if height is not None and is_root:
        _add_row(rows, slot, "min-height", size, int(round(height)), node_id)
    elif width is not None and height is not None and (
        slot.endswith("Icon") or slot in ("FocusRing", "Overlay") or ntype in ("VECTOR", "RECTANGLE")
    ):
        _add_row(
            rows,
            slot,
            "width × height",
            size,
            f"{int(round(width))}px × {int(round(height))}px",
            node_id,
        )

    # Padding and icon-label gap belong to the root shell only.
    pt = node.get("paddingTop")
    pb = node.get("paddingBottom")
    pl = node.get("paddingLeft")
    pr = node.get("paddingRight")

    if is_root and pt is not None and pb is not None:
        if pt == pb:
            token = _resolve_bound_variable(node, "paddingTop", variable_map)
            if not token:
                token = _resolve_bound_variable(node, "paddingBottom", variable_map)
            _add_row(rows, slot, "vertical padding", size, int(round(pt)), node_id, token)
        else:
            _add_row(
                rows,
                slot,
                "vertical padding",
                size,
                f"top {pt}px / bottom {pb}px",
                node_id,
            )

    if is_root and pl is not None and pr is not None:
        if pl == pr:
            token = _resolve_bound_variable(node, "paddingLeft", variable_map)
            if not token:
                token = _resolve_bound_variable(node, "paddingRight", variable_map)
            _add_row(rows, slot, "horizontal padding", size, int(round(pl)), node_id, token)
        else:
            _add_row(
                rows,
                slot,
                "horizontal padding",
                size,
                f"left {pl}px / right {pr}px",
                node_id,
            )

    # Item spacing (icon-label gap etc.)
    spacing = node.get("itemSpacing")
    if is_root and spacing is not None:
        token = _resolve_bound_variable(node, "itemSpacing", variable_map)
        _add_row(rows, slot, "icon-label gap", size, int(round(spacing)), node_id, token)

    # Typography
    if ntype == "TEXT":
        style = node.get("style") or {}
        font_size = style.get("fontSize")
        font_weight = style.get("fontWeight")
        font_family = style.get("fontFamily")
        line_height_px = style.get("lineHeightPx")
        line_height_pct = style.get("lineHeightPercentFontSize")

        if font_size and line_height_px:
            line_height = int(round(line_height_px))
        elif font_size and line_height_pct:
            line_height = int(round(font_size * (line_height_pct / 100.0)))
        else:
            line_height = line_height_px or line_height_pct

        size_token = _resolve_bound_variable(node, "fontSize", variable_map)
        weight_token = _resolve_bound_variable(node, "fontWeight", variable_map)
        line_height_token = _resolve_bound_variable(node, "lineHeight", variable_map)

        token_parts = [t for t in [size_token, line_height_token, weight_token] if t]
        token_str = f" ({', '.join(token_parts)})" if token_parts else ""

        typography_value = (
            f"{font_family or 'font'} {int(round(font_size))}px"
            f"/{int(round(line_height)) if line_height else '—'}"
            f" weight {font_weight or '—'}{token_str}"
        )
        _add_row(rows, slot, "typography", size, typography_value, node_id)


def _find_document(
    nodes_json: Dict[str, Any], node_id: str
) -> Optional[Dict[str, Any]]:
    """Return the document node for a normalized node id from a Figma nodes response."""
    if not isinstance(nodes_json, dict):
        return None
    nodes = nodes_json.get("nodes") or {}
    for k, v in nodes.items():
        if k.replace("-", ":") == node_id:
            return v.get("document")
    return None


def extract_slot_geometry(
    nodes_json: Dict[str, Any],
    variables_json: Optional[Dict[str, Any]],
    file_key: str,
    node_id: str,
    component_name: Optional[str] = None,
) -> str:
    """
    Build the ``### Slot geometry (Figma-verified)`` table for a component.

    Expects ``nodes_json`` from the Figma REST ``GET /v1/files/{key}/nodes``
    endpoint and ``variables_json`` from ``GET /v1/files/{key}/variables``.
    """
    variable_map = _build_variable_map(variables_json)
    context_node_id = node_id.replace("-", ":")
    doc = _find_document(nodes_json, context_node_id)
    if not isinstance(doc, dict):
        return (
            f"{SLOT_GEOMETRY_HEADING}\n\n{SLOT_GEOMETRY_TABLE_HEADER}\n"
            f"| --- | --- | --- | --- | --- |\n"
            f"| TODO | — | — | `{context_node_id}` | Figma node not found in REST response |\n\n"
            f"{SLOT_GEOMETRY_RULES}"
        )

    component_pascal = _pascal_case(component_name or doc.get("name", "Component"))
    records = _collect_slot_nodes(doc, component_pascal, variable_map)
    rows: Dict[Tuple[str, str], Dict[str, Dict[str, Any]]] = {}

    for record in records:
        _extract_slot_rows_from_node(record, rows, variable_map, context_node_id)

    if not rows:
        return (
            f"{SLOT_GEOMETRY_HEADING}\n\n{SLOT_GEOMETRY_TABLE_HEADER}\n"
            f"| --- | --- | --- | --- | --- |\n"
            f"| TODO | border-radius | — | `{context_node_id}` | `get_variable_defs` / `get_design_context` on that node |\n\n"
            f"{SLOT_GEOMETRY_RULES}"
        )

    lines = [
        SLOT_GEOMETRY_HEADING,
        "",
        SLOT_GEOMETRY_TABLE_HEADER,
        "| --- | --- | --- | --- | --- |",
    ]
    order = {
        "border-radius": 0,
        "min-height": 1,
        "vertical padding": 2,
        "horizontal padding": 3,
        "icon-label gap": 4,
        "width × height": 5,
        "typography": 6,
    }
    sorted_rows = sorted(
        rows.items(),
        key=lambda kv: (kv[0][0], order.get(kv[0][1], 99)),
    )
    for (slot, prop), items in sorted_rows:
        token_cell = _combine_per_size(items)
        node_id_cell = _representative_node_id(items, context_node_id)
        evidence = _format_evidence(node_id_cell, context_node_id)
        lines.append(
            f"| {slot} | {prop} | {token_cell} | `{node_id_cell}` | {evidence} |"
        )

    lines.append("")
    lines.append(SLOT_GEOMETRY_RULES)
    return "\n".join(lines)
