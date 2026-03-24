import os
import json
from pathlib import Path
from typing import Dict, List, Any


class RecursiveDocumentationGenerator:
    
    def __init__(self, output_dir="design-system-knowledge"):
        self.output_dir = Path(output_dir)
        self.ensure_directories()
        
    def ensure_directories(self):
        """Create necessary directories"""
        dirs = [
            self.output_dir,
            self.output_dir / "pages",
            self.output_dir / "components", 
            self.output_dir / "frames",
            self.output_dir / "tokens"
        ]
        
        for dir_path in dirs:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def generate_documentation(self, exploration_data: Dict[str, Any]):
        """Generate comprehensive documentation from exploration data"""
        
        print(f"📚 Generating documentation for {exploration_data['total_nodes']} nodes...")
        
        # Generate pages documentation
        self.generate_pages_docs(exploration_data["pages"])
        
        # Generate frames documentation  
        self.generate_frames_docs(exploration_data["frames"])
        
        # Generate components documentation
        self.generate_components_docs(exploration_data["components"])
        
        # Generate index
        self.generate_index(exploration_data)
        
        print(f"✅ Documentation generated in {self.output_dir}")
    
    def generate_pages_docs(self, pages: List[Dict[str, Any]]):
        """Generate documentation for each page"""
        
        for page in pages:
            filename = f"page-{self.sanitize_name(page['name'])}.md"
            filepath = self.output_dir / "pages" / filename
            
            content = f"""# {page['name']}

**Page ID:** {page['id']}  
**Type:** {page['type']}  
**Depth:** {page['depth']}  
**Path:** {page['path']}

## Overview
This is the main {page['name'].lower()} page containing {len(page['children'])} child elements.

## Child Elements
{self.generate_child_list(page['children'])}

## Structure
```
{page['name']} (Page)
├── Typography
├── Color  
└── Design Variables
```

---

*Generated from Figma file: {page['id']}*
"""
            
            with open(filepath, 'w') as f:
                f.write(content)
            
            print(f"  📄 Generated page: {filename}")
    
    def generate_frames_docs(self, frames: List[Dict[str, Any]]):
        """Generate documentation for each frame"""
        
        for frame in frames:
            filename = f"frame-{self.sanitize_name(frame['name'])}.md"
            filepath = self.output_dir / "frames" / filename
            
            content = f"""# {frame['name']} Frame

**Frame ID:** {frame['id']}  
**Type:** {frame['type']}  
**Depth:** {frame['depth']}  
**Path:** {frame['path']}

## Overview
This frame contains {len(frame['children'])} design elements and is part of the design system.

## Child Elements
{self.generate_child_list(frame['children'])}

## Usage
This frame is used for:
- Design token definitions
- Component specifications
- Style guidelines

---

*Generated from Figma file: {frame['id']}*
"""
            
            with open(filepath, 'w') as f:
                f.write(content)
            
            print(f"  🖼️ Generated frame: {filename}")
    
    def generate_components_docs(self, components: List[Dict[str, Any]]):
        """Generate detailed documentation for each component"""
        
        for component in components:
            filename = f"component-{self.sanitize_name(component['name'])}.md"
            filepath = self.output_dir / "components" / filename
            
            # Generate variables table
            variables_table = self.generate_variables_table(component.get('variables', {}))
            
            content = f"""# {component['name']}

**Component ID:** {component['id']}  
**Type:** {component['type']}  
**Depth:** {component['depth']}  
**Path:** {component['path']}

## Overview
This component defines design tokens and variables used throughout the design system.

## Variables & Tokens
{variables_table}

## Implementation Guidelines

### CSS Usage
```css
/* Example usage */
.my-component {{
  color: var(--color-primary);
  font-size: var(--font-size-header1);
  spacing: var(--spacing-medium);
}}
```

### Design System Integration
This component should be used as reference for:
- Maintaining design consistency
- Ensuring proper token usage
- Following established patterns

---

*Generated from Figma file: {component['id']}*
"""
            
            with open(filepath, 'w') as f:
                f.write(content)
            
            print(f"  🧩 Generated component: {filename}")
    
    def generate_variables_table(self, variables: Dict[str, str]) -> str:
        """Generate a markdown table for variables"""
        
        if not variables:
            return "No variables defined for this component."
        
        table = "| Token | Value | CSS Variable | Usage |\n"
        table += "|------|------|------|------|\n"
        
        for token_name, value in variables.items():
            css_var = f"--{token_name.lower().replace(' ', '-')}"
            usage = f"var({css_var})"
            table += f"| {token_name} | {value} | `{css_var}` | `{usage}` |\n"
        
        return table
    
    def generate_child_list(self, children: List[str]) -> str:
        """Generate a list of child elements"""
        
        if not children:
            return "No child elements."
        
        list_items = []
        for child_id in children[:10]:  # Limit to first 10 for readability
            list_items.append(f"- Child ID: {child_id}")
        
        if len(children) > 10:
            list_items.append(f"- ... and {len(children) - 10} more elements")
        
        return "\n".join(list_items)
    
    def generate_index(self, exploration_data: Dict[str, Any]):
        """Generate an index file with overview"""
        
        index_content = f"""# Design System Documentation

**Total Nodes Explored:** {exploration_data['total_nodes']}  
**Pages:** {len(exploration_data['pages'])}  
**Frames:** {len(exploration_data['frames'])}  
**Components:** {len(exploration_data['components'])}

## 📚 Documentation Structure

### Pages
{self.generate_index_links(exploration_data['pages'], 'pages')}

### Frames  
{self.generate_index_links(exploration_data['frames'], 'frames')}

### Components
{self.generate_index_links(exploration_data['components'], 'components')}

### Tokens
- [Color Tokens](tokens/color.md)
- [Typography Tokens](tokens/typography.md)  
- [Spacing Tokens](tokens/spacing.md)

## 🔄 Generation Process

This documentation was generated by recursively exploring the Figma file structure:
1. **Page Discovery**: Identified all top-level pages
2. **Frame Exploration**: Explored each frame and its children
3. **Component Analysis**: Extracted variables and design tokens
4. **Documentation Generation**: Created structured markdown files

## 📋 Quick Reference

### Design Tokens
- **Colors**: Brand colors, semantic colors, and UI colors
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Margin, padding, and layout spacing values
- **Borders**: Border radius and border styles

### Components
- **Typography System**: Headers, body text, and text styles
- **Color System**: Primary, secondary, and accent colors
- **Layout System**: Grids, spacing, and positioning

---

*This documentation is automatically generated from the Figma design system.*
*Last updated: {self.get_current_timestamp()}*
"""
        
        index_path = self.output_dir / "README.md"
        with open(index_path, 'w') as f:
            f.write(index_content)
        
        print(f"  📋 Generated index: README.md")
    
    def generate_index_links(self, items: List[Dict[str, Any]], category: str) -> str:
        """Generate index links for a category"""
        
        if not items:
            return "No items in this category."
        
        links = []
        for item in items:
            name = self.sanitize_name(item['name'])
            if category == 'pages':
                links.append(f"- [{item['name']}](pages/page-{name}.md)")
            elif category == 'frames':
                links.append(f"- [{item['name']}](frames/frame-{name}.md)")
            elif category == 'components':
                links.append(f"- [{item['name']}](components/component-{name}.md)")
        
        return "\n".join(links)
    
    def sanitize_name(self, name: str) -> str:
        """Sanitize name for file usage"""
        return name.lower().replace(' ', '-').replace('/', '-').replace('--', 'brand')
    
    def get_current_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
