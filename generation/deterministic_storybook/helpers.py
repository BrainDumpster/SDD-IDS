from __future__ import annotations

import json


def pascal_from_slug(slug: str) -> str:
    parts = [p for p in slug.replace("_", "-").split("-") if p]
    return "".join(p[:1].upper() + p[1:] for p in parts)


def ids_component_export_name(component_slug: str) -> str:
    return f"Ids{pascal_from_slug(component_slug)}"


def prefixed_component_export_name(component_slug: str, prefix: str) -> str:
    raw_prefix = (prefix or "Ids").strip() or "Ids"
    prefix_parts = [p for p in raw_prefix.replace("_", "-").split("-") if p]
    safe_prefix = "".join(p[:1].upper() + p[1:] for p in prefix_parts) or "Ids"
    return f"{safe_prefix}{pascal_from_slug(component_slug)}"


def ts_array(items: list[str]) -> str:
    return "[" + ", ".join(json.dumps(item) for item in items) + "]"
