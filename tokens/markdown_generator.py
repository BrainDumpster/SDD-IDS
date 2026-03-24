import json
from pathlib import Path

class MarkdownGenerator:
    """
    Generates RAG-optimized Markdown files for the design system.
    """
    def __init__(self, output_base_path: str = "design-system-knowledge/tokens"):
        self.output_path = Path(output_base_path)
        self.output_path.mkdir(parents=True, exist_ok=True)

    def _generate_table(self, title: str, variables: list, mode_map: dict) -> str:
        """Helper to create an LLM-friendly markdown table."""
        md = f"# {title}\n\n"
        md += "This document contains design tokens for LLM context and RAG systems.\n\n"
        md += "| Token Name | Collection | Mode | Value | Description |\n"
        md += "| :--- | :--- | :--- | :--- | :--- |\n"
        
        for var in variables:
            name = var.get('name', 'N/A')
            desc = var.get('description', 'No description provided').replace('\n', ' ')
            
            for mode_id, value in var.get('valuesByMode', {}).items():
                mode_info = mode_map.get(mode_id, {"name": "Default", "collection_name": "Local"})
                mode_name = mode_info["name"]
                coll_name = mode_info["collection_name"]
                
                # Format value (handles hex, rgba, or numbers)
                formatted_value = f"`{value}`"
                
                md += f"| {name} | {coll_name} | {mode_name} | {formatted_value} | {desc} |\n"
        
        return md

    def write_token_files(self, extracted_data: dict):
        """
        Saves tokens to individual markdown files based on resolvedType.
        """
        variables = extracted_data.get("variables", [])
        mode_map = extracted_data.get("mode_map", {})

        # Grouping variables by type
        categories = {
            "COLOR": "colors.md",
            "FLOAT": "spacing.md", # Usually spacing/sizing
            "STRING": "typography.md", # Often used for font-families/weights
            "BOOLEAN": "visibility.md"
        }

        for var_type, filename in categories.items():
            filtered_vars = [v for v in variables if v.get('resolvedType') == var_type]
            
            if filtered_vars:
                content = self._generate_table(var_type.capitalize(), filtered_vars, mode_map)
                file_path = self.output_path / filename
                file_path.write_text(content, encoding="utf-8")
                print(f"📄 Generated: {file_path}")

