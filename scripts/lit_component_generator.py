#!/usr/bin/env python3
"""
Lit Component Generator
Converts Figma fingerprint data into Lit element components
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime


class LitComponentGenerator:
    """Generates Lit components from Figma fingerprints"""
    
    def __init__(self):
        print("🔧 INITIALIZING LIT COMPONENT GENERATOR")
        print("=" * 50)
    
    def vectorize_color(self, color: Dict[str, float]) -> str:
        """Convert Figma color to CSS color"""
        if not color:
            return "transparent"
        
        r = int(color.get('r', 0) * 255)
        g = int(color.get('g', 0) * 255)
        b = int(color.get('b', 0) * 255)
        a = color.get('a', 1.0)
        
        if a < 1.0:
            return f"rgba({r}, {g}, {b}, {a:.2f})"
        else:
            return f"rgb({r}, {g}, {b})"
    
    def vectorize_fills(self, fills: List[Dict[str, Any]]) -> str:
        """Convert fills to CSS background"""
        if not fills:
            return "transparent"
        
        css_fills = []
        for fill in fills:
            if fill.get('type') == 'SOLID':
                color = self.vectorize_color(fill.get('color', {}))
                css_fills.append(color)
            elif fill.get('type') == 'GRADIENT_LINEAR':
                # Handle linear gradients
                gradient_stops = []
                for stop in fill.get('gradientStops', []):
                    color = self.vectorize_color(stop.get('color', {}))
                    position = stop.get('position', 0) * 100
                    gradient_stops.append(f"{color} {position:.0f}%")
                
                angle = fill.get('rotation', 0)
                css_fills.append(f"linear-gradient({angle}deg, {', '.join(gradient_stops)})")
        
        return ', '.join(css_fills) if css_fills else 'transparent'
    
    def vectorize_strokes(self, strokes: List[Dict[str, Any]]) -> str:
        """Convert strokes to CSS border"""
        if not strokes:
            return "none"
        
        stroke = strokes[0]  # Take first stroke
        color = self.vectorize_color(stroke.get('color', {}))
        width = stroke.get('weight', 1)
        
        return f"{width}px solid {color}"
    
    def vectorize_effects(self, effects: List[Dict[str, Any]]) -> str:
        """Convert effects to CSS box-shadow"""
        if not effects:
            return "none"
        
        css_effects = []
        for effect in effects:
            if effect.get('type') == 'DROP_SHADOW':
                color = self.vectorize_color(effect.get('color', {}))
                offset_x = effect.get('offset', {}).get('x', 0)
                offset_y = effect.get('offset', {}).get('y', 0)
                blur = effect.get('radius', 0)
                spread = effect.get('spread', 0)
                
                css_effects.append(f"{offset_x}px {offset_y}px {blur}px {spread}px {color}")
            elif effect.get('type') == 'INNER_SHADOW':
                color = self.vectorize_color(effect.get('color', {}))
                offset_x = effect.get('offset', {}).get('x', 0)
                offset_y = effect.get('offset', {}).get('y', 0)
                blur = effect.get('radius', 0)
                
                css_effects.append(f"inset {offset_x}px {offset_y}px {blur}px {color}")
        
        return ', '.join(css_effects) if css_effects else 'none'
    
    def vectorize_text_style(self, style: Dict[str, Any]) -> str:
        """Convert text style to CSS"""
        css_styles = []
        
        if style.get('fontFamily'):
            css_styles.append(f"font-family: {style['fontFamily']};")
        
        if style.get('fontSize'):
            css_styles.append(f"font-size: {style['fontSize']}px;")
        
        if style.get('fontWeight'):
            css_styles.append(f"font-weight: {style['fontWeight']};")
        
        if style.get('lineHeightPx'):
            css_styles.append(f"line-height: {style['lineHeightPx']}px;")
        
        if style.get('textAlignHorizontal'):
            css_styles.append(f"text-align: {style['textAlignHorizontal'].lower()};")
        
        if style.get('letterSpacing'):
            css_styles.append(f"letter-spacing: {style['letterSpacing']}px;")
        
        return ' '.join(css_styles)
    
    def vectorize_layout(self, node: Dict[str, Any]) -> str:
        """Convert layout properties to CSS"""
        css_styles = []
        
        # Position
        if node.get('absoluteBoundingBox'):
            bbox = node['absoluteBoundingBox']
            css_styles.append(f"position: absolute;")
            css_styles.append(f"left: {bbox['x']}px;")
            css_styles.append(f"top: {bbox['y']}px;")
            css_styles.append(f"width: {bbox['width']}px;")
            css_styles.append(f"height: {bbox['height']}px;")
        
        # Auto layout
        if node.get('layoutMode') == 'HORIZONTAL':
            css_styles.append("display: flex;")
            css_styles.append("flex-direction: row;")
        elif node.get('layoutMode') == 'VERTICAL':
            css_styles.append("display: flex;")
            css_styles.append("flex-direction: column;")
        
        # Spacing
        if node.get('itemSpacing'):
            css_styles.append(f"gap: {node['itemSpacing']}px;")
        
        # Padding
        padding = []
        if node.get('paddingTop'):
            padding.append(f"{node['paddingTop']}px")
        else:
            padding.append("0px")
        
        if node.get('paddingRight'):
            padding.append(f"{node['paddingRight']}px")
        else:
            padding.append("0px")
        
        if node.get('paddingBottom'):
            padding.append(f"{node['paddingBottom']}px")
        else:
            padding.append("0px")
        
        if node.get('paddingLeft'):
            padding.append(f"{node['paddingLeft']}px")
        else:
            padding.append("0px")
        
        css_styles.append(f"padding: {padding[0]} {padding[1]} {padding[2]} {padding[3]};")
        
        # Alignment
        if node.get('primaryAxisAlignItems'):
            css_styles.append(f"justify-content: {node['primaryAxisAlignItems'].lower()};")
        
        if node.get('counterAxisAlignItems'):
            css_styles.append(f"align-items: {node['counterAxisAlignItems'].lower()};")
        
        # Border radius
        if node.get('cornerRadius'):
            css_styles.append(f"border-radius: {node['cornerRadius']}px;")
        
        return ' '.join(css_styles)
    
    def generate_component_name(self, figma_name: str) -> str:
        """Generate valid component name from Figma name"""
        # Convert to PascalCase
        name = re.sub(r'[^a-zA-Z0-9\s]', '', figma_name)
        name = re.sub(r'\s+', ' ', name).strip()
        words = name.split()
        return ''.join(word.capitalize() for word in words)
    
    def generate_css_styles(self, node: Dict[str, Any], prefix: str = "") -> Dict[str, str]:
        """Generate CSS styles for a node"""
        styles = {}
        
        # Visual properties
        if node.get('fills'):
            styles['background'] = self.vectorize_fills(node['fills'])
        
        if node.get('strokes'):
            styles['border'] = self.vectorize_strokes(node['strokes'])
        
        if node.get('effects'):
            styles['box-shadow'] = self.vectorize_effects(node['effects'])
        
        if node.get('cornerRadius'):
            styles['border-radius'] = f"{node['cornerRadius']}px"
        
        # Layout
        layout_styles = self.vectorize_layout(node)
        if layout_styles:
            # Parse layout styles into individual properties
            layout_lines = layout_styles.split(';')
            for line in layout_lines:
                if ':' in line:
                    prop, value = line.split(':', 1)
                    styles[prop.strip()] = value.strip()
        
        # Text styles
        if node.get('style'):
            text_styles = self.vectorize_text_style(node['style'])
            if text_styles:
                # Parse text styles into individual properties
                style_lines = text_styles.split(';')
                for line in style_lines:
                    if ':' in line:
                        prop, value = line.split(':', 1)
                        styles[prop.strip()] = value.strip()
        
        return styles
    
    def generate_lit_component(self, fingerprint: Dict[str, Any]) -> str:
        """Generate complete Lit component from fingerprint"""
        component_name = self.generate_component_name(fingerprint['name'])
        
        # Generate CSS for main component
        main_styles = self.generate_css_styles(fingerprint, component_name)
        
        # Generate HTML structure
        html_structure = self.generate_html_structure(fingerprint, component_name)
        
        # Generate CSS for all children
        child_css = self.generate_children_css(fingerprint.get('children', []), component_name)
        
        # Combine all CSS
        all_css = []
        
        # Main component styles
        if main_styles:
            css_props = []
            for prop, value in main_styles.items():
                css_props.append(f"  {prop}: {value};")
            all_css.append(f":host {{\n{chr(10).join(css_props)}\n}}")
        
        # Child styles
        all_css.extend(child_css)
        
        css_content = '\n\n'.join(all_css)
        
        # Generate Lit component
        component_template = f'''import {{ LitElement, html, css }} from 'lit';

/**
 * {component_name} Component
 * Generated from Figma design: {fingerprint['name']}
 * Generated at: {datetime.now().isoformat()}
 * Component ID: {fingerprint['id']}
 * Size: {fingerprint['size']['width']}x{fingerprint['size']['height']}px
 */
export class {component_name} extends LitElement {{
  static styles = css`
{css_content}
  `;

  static properties = {{
    // Component properties can be defined here
    expanded: {{ type: Boolean }},
    disabled: {{ type: Boolean }},
    variant: {{ type: String }}
  }};

  constructor() {{
    super();
    this.expanded = false;
    this.disabled = false;
    this.variant = 'default';
  }}

  render() {{
{html_structure}
  }}

  // Component methods
  toggleExpanded() {{
    this.expanded = !this.expanded;
    this.dispatchEvent(new CustomEvent('toggle', {{
      detail: {{ expanded: this.expanded }}
    }}));
  }}

  // Add more component methods as needed
}}

// Register the custom element
customElements.define('{component_name.lower()}-component', {component_name});
'''
        
        return component_template
    
    def generate_html_structure(self, node: Dict[str, Any], parent_name: str, indent: int = 2) -> str:
        """Generate HTML structure for a node"""
        indent_str = ' ' * indent
        
        if node.get('type') == 'TEXT':
            text_content = node.get('characters', '')
            return f"{indent_str}<span class='{parent_name.lower()}-text'>" + "{{ htmlSafe(`" + text_content + "`) }}" + "</span>"
        
        elif node.get('children'):
            # Container with children
            child_html = []
            for i, child in enumerate(node['children']):
                child_name = f"{parent_name.lower()}-child-{i}"
                child_html.append(self.generate_html_structure(child, child_name, indent + 2))
            
            return f"{indent_str}<div class='{parent_name.lower()}'>\n" + '\n'.join(child_html) + f"\n{indent_str}</div>"
        
        else:
            # Simple container
            return f"{indent_str}<div class='{parent_name.lower()}'></div>"
    
    def generate_children_css(self, children: List[Dict[str, Any]], parent_name: str) -> List[str]:
        """Generate CSS for all child elements"""
        css_rules = []
        
        for i, child in enumerate(children):
            child_name = f"{parent_name.lower()}-child-{i}"
            child_styles = self.generate_css_styles(child, child_name)
            
            if child_styles:
                css_props = []
                for prop, value in child_styles.items():
                    css_props.append(f"    {prop}: {value};")
                
                css_rules.append(f".{child_name} {{\n{chr(10).join(css_props)}\n  }}")
            
            # Recursively generate CSS for grandchildren
            if child.get('children'):
                child_css = self.generate_children_css(child['children'], child_name)
                css_rules.extend(child_css)
        
        return css_rules
    
    def save_component(self, component_code: str, component_name: str) -> str:
        """Save Lit component to file"""
        output_dir = Path("/home/muthu/projects/ids_design_knowledge/generated-components")
        output_dir.mkdir(exist_ok=True)
        
        filename = f"{component_name.lower()}.js"
        file_path = output_dir / filename
        
        with open(file_path, 'w') as f:
            f.write(component_code)
        
        return str(file_path)


def main():
    """Main function"""
    print("🔧 LIT COMPONENT GENERATOR")
    print("=" * 50)
    print("Generating Lit component from Figma fingerprint")
    print("")
    
    # Load the fingerprint
    fingerprint_file = "/home/muthu/projects/ids_design_knowledge/design-system-knowledge/accordion-fingerprint.json"
    
    print("📂 Loading fingerprint...")
    try:
        with open(fingerprint_file, 'r') as f:
            fingerprint = json.load(f)
        print(f"✅ Loaded fingerprint: {fingerprint['name']}")
    except Exception as e:
        print(f"❌ Failed to load fingerprint: {e}")
        return
    
    # Generate component
    generator = LitComponentGenerator()
    
    print("🔧 Generating Lit component...")
    component_code = generator.generate_lit_component(fingerprint)
    
    print(f"✅ Generated {len(component_code)} chars of component code")
    
    # Save component
    component_name = generator.generate_component_name(fingerprint['name'])
    file_path = generator.save_component(component_code, component_name)
    
    print(f"💾 Component saved: {file_path}")
    
    # Show preview
    print(f"\n📋 COMPONENT PREVIEW:")
    print(f"   Name: {component_name}")
    print(f"   File: {file_path}")
    print(f"   Lines: {len(component_code.split(chr(10)))}")
    
    print(f"\n🎉 COMPONENT GENERATION COMPLETED!")
    print("=" * 50)
    print("✅ Lit component ready for use!")


if __name__ == "__main__":
    main()
