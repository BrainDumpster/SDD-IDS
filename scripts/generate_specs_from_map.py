import argparse
import json
import re
from pathlib import Path

TEMPLATE = """# {component} Design Spec

## Metadata
- Component: {component}
- Category: {category}
- Figma: {figmaUrl}
- Node ID: {nodeId}

## Anatomy
- TODO: list slots/parts (e.g., header, body, icon)

## Layout & Measurements
- TODO: dimensions, padding, spacing, icon sizes, recommended widths/heights

## Typography
- TODO: headings, body text sizes/weights/line heights

## Tokens
- TODO: backgrounds, borders, text, icons, focus, links, shadows

## States (Light Theme)
| Area | State | Background | Border | Text/Icon |
| --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | TODO |

## States (Dark Theme)
- TODO: note token parity and any specific overrides

## Interactions
- TODO: pointer/keyboard behaviors, focus ring spec

## Accessibility
- TODO: roles, aria attributes, keyboard expectations

## Variants
- TODO: list supported variants; note token parity

## Behavior & Guidelines
- TODO: usage guidance and do/don't

## Token Gaps / Notes
- TODO: note missing tokens or fallback guidance

## Deliverable Checklist
- TODO: list key implementation checks

## Source Mapping
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "{component}" (category "{category}"; node "{nodeId}")
"""


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def parse_args():
    parser = argparse.ArgumentParser(description="Generate component design specs from mapping JSON")
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing design-spec.mdx files if present",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    map_path = Path("data/component-figma-map.json")
    components_root = Path("components")
    components_root.mkdir(exist_ok=True)

    data = json.loads(map_path.read_text())

    for entry in data:
        component = entry["component"]
        category = entry.get("category", "")
        figma_url = entry.get("figmaUrl", "")
        node_id = entry.get("nodeId", "")

        slug = slugify(component)
        out_dir = components_root / slug
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / "design-spec.mdx"

        if out_file.exists() and not args.overwrite:
            print(f"⏭️ Skipping existing spec: {out_file}")
            continue

        content = TEMPLATE.format(
            component=component,
            category=category,
            figmaUrl=figma_url,
            nodeId=node_id,
        )

        out_file.write_text(content)
        print(f"✅ Wrote {out_file}")


if __name__ == "__main__":
    main()
