"""
Extract component design specs from Figma via MCP and emit MDX design rules.

Usage:
    python scripts/extract_component_specs.py --component Button \
        --map data/component-figma-map.json

Notes:
- Uses the existing FigmaMCPClient and TokenExtractor to pull variables.
- Generates a per-component MDX spec at content/components/{component}/design-spec.md.
- Focuses on tokens + semantic CSS variable wiring; layout/spacing/etc. sections are included for future enrichment.
"""

import argparse
import asyncio
import json
from datetime import datetime
from pathlib import Path

from tokens.figma_client import FigmaMCPClient
from tokens.token_extractor import TokenExtractor
from tokens.css_syntax_generator import CSSSyntaxGenerator


def load_mapping(map_path: Path):
    if not map_path.exists():
        raise FileNotFoundError(f"Mapping file not found: {map_path}")
    data = json.loads(map_path.read_text())
    if not isinstance(data, list):
        raise ValueError("Component mapping file must be a list of entries")
    return data


def find_component(mapping, component_name: str):
    for entry in mapping:
        if entry.get("component", "").lower() == component_name.lower():
            return entry
    return None


def build_mdx(component: str, entry: dict, tokens: list) -> str:
    """Compose MDX content with tokens and placeholder sections."""

    header = "---\n"
    header += f"component: {component}\n"
    header += f"category: {entry.get('category', '')}\n"
    header += f"figma_url: {entry.get('figmaUrl', '')}\n"
    header += f"node_id: {entry.get('nodeId', '')}\n"
    header += f"generated_at: {datetime.utcnow().isoformat()}Z\n"
    header += "---\n\n"

    body = [header]
    body.append(f"# {component} Design Spec\n")
    body.append("Semantic tokens are referenced via `var(--token-name)` to support light/dark modes and global theming.\n")

    # Tokens section
    body.append("## Tokens\n")
    if tokens:
        body.append("| Name | Type | CSS Variable | Usage | Value | Collection |\n")
        body.append("| :--- | :--- | :--- | :--- | :--- | :--- |\n")
        for t in tokens:
            body.append(
                f"| {t.get('name','')} | {t.get('type','')} | {t.get('css_variable','')} | {t.get('css_usage','')} | {t.get('value','')} | {t.get('collection','')} |\n"
            )
    else:
        body.append("No tokens were returned from Figma for this component.\n")

    # Placeholder sections for future extraction
    body.append("\n## Layout & Spacing\n- TODO: Extract padding, margins, grid, alignment from Figma nodes.\n")
    body.append("\n## Typography\n- TODO: Extract font family, size, weight, line-height, letter-spacing.\n")
    body.append("\n## Colors\n- TODO: Map semantic colors and stateful surfaces/backgrounds.\n")
    body.append("\n## States & Interactions\n- TODO: Hover, focus, active, disabled, selected states with tokens.\n")
    body.append("\n## Accessibility\n- TODO: ARIA roles, focus order, contrast guidance.\n")
    body.append("\n## Anatomy\n- TODO: Identify slots/parts (icon, label, counter, etc.).\n")

    return "".join(body)


async def extract_and_write(component: str, map_path: Path):
    mapping = load_mapping(map_path)
    entry = find_component(mapping, component)
    if not entry:
        raise ValueError(f"Component '{component}' not found in mapping file {map_path}")

    client = FigmaMCPClient()
    extractor = TokenExtractor()
    css_gen = CSSSyntaxGenerator()

    await client.connect()
    try:
        print(f"🔌 Connected to Figma MCP at {client.url}")
        raw = await client.get_variables(entry.get("figmaUrl", ""))

        # raw may come back as JSON string; normalize to dict
        if isinstance(raw, str):
            raw = json.loads(raw)

        tokens = extractor.extract(raw)
        tokens = [css_gen.generate(t) for t in tokens]

        mdx = build_mdx(component, entry, tokens)

        out_dir = Path("content/components") / component
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / "design-spec.md"
        out_path.write_text(mdx, encoding="utf-8")
        print(f"✅ Wrote spec to {out_path}")
    finally:
        await client.disconnect()


def main():
    parser = argparse.ArgumentParser(description="Extract component specs from Figma and emit MDX")
    parser.add_argument("--component", default="Button", help="Component name to extract (default: Button)")
    parser.add_argument("--map", default="data/component-figma-map.json", help="Path to component mapping JSON")
    args = parser.parse_args()

    asyncio.run(extract_and_write(args.component, Path(args.map)))


if __name__ == "__main__":
    main()
