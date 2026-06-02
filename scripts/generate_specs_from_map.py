import argparse
import json
import re
import sys
from pathlib import Path

_SCRIPTS_DIR = Path(__file__).resolve().parent
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))

from design_spec_template import NEW_SPEC_TEMPLATE


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def parse_args():
    parser = argparse.ArgumentParser(description="Generate component design specs from mapping JSON")
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing design-spec.md files if present",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    map_path = Path("data/component-figma-map.json")
    components_root = Path("components/ids")
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
        out_file = out_dir / "design-spec.md"

        if out_file.exists() and not args.overwrite:
            print(f"⏭️ Skipping existing spec: {out_file}")
            continue

        content = NEW_SPEC_TEMPLATE.format(
            component=component,
            category=category,
            figmaUrl=figma_url,
            nodeId=node_id,
        )

        out_file.write_text(content)
        print(f"✅ Wrote {out_file}")


if __name__ == "__main__":
    main()
