"""
Figma Layout Enricher
=====================
Extracts layout measurements from Figma nodes via MCP tools and writes
them to a cache file consumed by rebuild_specs.py.

Usage:
    python scripts/figma_layout_enricher.py           # extract all, skip if cache fresh
    python scripts/figma_layout_enricher.py --force    # force re-extraction
    python scripts/figma_layout_enricher.py --component button  # single component

Requires: Figma MCP server running (figma-bridge).
Falls back gracefully if MCP is unavailable — cache simply stays stale.

Note: This script is designed to be called by a Claude Code agent that has
access to figma_get_nodes / figma_get_children MCP tools. When run standalone,
it generates a skeleton cache that can be manually populated or enriched
via MCP calls in a conversation context.
"""

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
FIGMA_MAP = PROJECT / "data" / "synapse-component-figma-map.json"
CACHE_PATH = PROJECT / "data" / "synapse-figma-layout-cache.json"

MAX_AGE_HOURS = 24


def slugify(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def load_cache() -> dict:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text())
    return {}


def save_cache(cache: dict):
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CACHE_PATH, "w") as f:
        json.dump(cache, f, indent=2)


def is_stale(entry: dict) -> bool:
    """Check if a cache entry is older than MAX_AGE_HOURS."""
    extracted_at = entry.get("extracted_at")
    if not extracted_at:
        return True
    try:
        ts = datetime.fromisoformat(extracted_at.replace("Z", "+00:00"))
        age = (datetime.now(timezone.utc) - ts).total_seconds() / 3600
        return age > MAX_AGE_HOURS
    except (ValueError, TypeError):
        return True


def extract_layout_from_node(node: dict) -> dict:
    """Extract layout measurements from a Figma node response."""
    layout = {}

    # Bounding box
    bbox = node.get("absoluteBoundingBox", {})
    if bbox:
        layout["width"] = bbox.get("width")
        layout["height"] = bbox.get("height")

    # Padding (auto-layout properties)
    layout["padding"] = {
        "top": node.get("paddingTop", 0),
        "right": node.get("paddingRight", 0),
        "bottom": node.get("paddingBottom", 0),
        "left": node.get("paddingLeft", 0),
    }

    # Corner radius
    layout["border_radius"] = node.get("cornerRadius", 0)

    # Item spacing
    layout["item_spacing"] = node.get("itemSpacing", 0)

    return layout


def extract_typography_from_node(node: dict) -> list:
    """Extract typography info from text nodes in a component."""
    results = []
    _walk_for_text(node, results)
    return results


def _walk_for_text(node: dict, results: list):
    """Recursively find text nodes."""
    if node.get("type") == "TEXT":
        style = node.get("style", {})
        results.append({
            "text": node.get("characters", ""),
            "font": style.get("fontFamily", "Roboto"),
            "size": style.get("fontSize"),
            "weight": style.get("fontWeight", 400),
            "line_height": style.get("lineHeightPx"),
        })

    for child in node.get("children", []):
        _walk_for_text(child, results)


def extract_variants_from_set(node: dict) -> dict:
    """Extract per-variant measurements from a COMPONENT_SET's children."""
    variants = {}
    for child in node.get("children", []):
        # Variant name from component properties or name
        name = child.get("name", "")
        # Parse variant properties like "Size=sm, State=default"
        variant_key = name
        props = child.get("componentPropertyDefinitions", {})
        if not props:
            # Try to parse from name like "Size=sm, Style=primary"
            parts = [p.strip() for p in name.split(",")]
            for part in parts:
                if "=" in part:
                    key, val = part.split("=", 1)
                    if key.strip().lower() in ("size", "scale"):
                        variant_key = val.strip().lower()
                        break

        layout = extract_layout_from_node(child)
        bbox = child.get("absoluteBoundingBox", {})

        variants[variant_key] = {
            "height": bbox.get("height"),
            "width": bbox.get("width"),
            "padding": layout.get("padding"),
            "font_size": None,  # Would need text child inspection
        }

    return variants


def build_skeleton_cache(figma_map: list) -> dict:
    """
    Build a skeleton cache with empty layout data for all components.
    This can be enriched later via MCP calls.
    """
    cache = {}
    seen_slugs = set()

    for entry in figma_map:
        slug = slugify(entry["component"])
        if slug in seen_slugs or not entry.get("nodeId"):
            continue
        seen_slugs.add(slug)

        cache[slug] = {
            "extracted_at": None,
            "figma_node_id": entry["nodeId"],
            "figma_component": entry["component"],
            "layout": {},
            "variants": {},
            "typography": [],
        }

    return cache


def main():
    parser = argparse.ArgumentParser(description="Figma Layout Enricher")
    parser.add_argument("--force", action="store_true", help="Force re-extraction even if cache is fresh")
    parser.add_argument("--component", help="Only extract for a single component")
    parser.add_argument("--skeleton", action="store_true", help="Generate skeleton cache without MCP calls")
    args = parser.parse_args()

    if not FIGMA_MAP.exists():
        print(f"ERROR: Figma map not found: {FIGMA_MAP}")
        return

    figma_map = json.loads(FIGMA_MAP.read_text())
    cache = load_cache()

    if args.skeleton:
        skeleton = build_skeleton_cache(figma_map)
        # Merge with existing cache (don't overwrite existing data)
        for slug, entry in skeleton.items():
            if slug not in cache:
                cache[slug] = entry
        save_cache(cache)
        print(f"Skeleton cache written: {len(cache)} components -> {CACHE_PATH}")
        return

    # Without MCP access, we can only create/update the skeleton
    # When run interactively with Claude Code, MCP calls would be made here
    print("Layout enricher: MCP-based extraction requires interactive Claude Code session.")
    print("Use --skeleton to generate empty cache, or run in a Claude Code conversation")
    print("where figma_get_nodes / figma_get_children MCP tools are available.")

    if not cache:
        print("\nGenerating skeleton cache...")
        cache = build_skeleton_cache(figma_map)
        save_cache(cache)
        print(f"Skeleton cache written: {len(cache)} components -> {CACHE_PATH}")


if __name__ == "__main__":
    main()
