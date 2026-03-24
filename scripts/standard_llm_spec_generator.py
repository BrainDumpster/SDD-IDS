#!/usr/bin/env python3
"""
Standard LLM-Friendly Spec Generator
Creates component specifications following the exact schema provided
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime


class StandardLLMSpecGenerator:
    """Generates LLM-friendly component specifications following standard schema"""
    
    def __init__(self):
        print("📝 INITIALIZING STANDARD LLM-FRIENDLY SPEC GENERATOR")
        print("=" * 70)
    
    def vectorize_color(self, color: Dict[str, float]) -> Dict[str, Any]:
        """Convert Figma color to standard color format"""
        if not color:
            return {"hex": "transparent", "token": "transparent"}
        
        r = color.get('r', 0)
        g = color.get('g', 0)
        b = color.get('b', 0)
        a = color.get('a', 1.0)
        
        hex_color = f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}"
        
        return {
            "r": r,
            "g": g,
            "b": b,
            "a": a,
            "hex": hex_color,
            "token": f"var(--color-{hex_color.lstrip('#')})"
        }
    
    def extract_layout(self, node: Dict[str, Any]) -> Dict[str, Any]:
        """Extract layout properties following standard schema"""
        layout = {
            "display": "block",
            "direction": "column",
            "padding": {"top": {}, "right": {}, "bottom": {}, "left": {}},
            "gap": {},
            "sizing": {"width": "fixed", "height": "fixed", "maxWidth": {}},
            "alignment": {"horizontal": "left", "vertical": "top"}
        }
        
        # Layout mode
        if node.get('layoutMode') == 'HORIZONTAL':
            layout["direction"] = "row"
            layout["display"] = "flex"
        elif node.get('layoutMode') == 'VERTICAL':
            layout["direction"] = "column"
            layout["display"] = "flex"
        
        # Padding
        padding_values = []
        if node.get('paddingTop') is not None:
            padding_values.append(node['paddingTop'])
        if node.get('paddingRight') is not None:
            padding_values.append(node['paddingRight'])
        if node.get('paddingBottom') is not None:
            padding_values.append(node['paddingBottom'])
        if node.get('paddingLeft') is not None:
            padding_values.append(node['paddingLeft'])
        
        if padding_values:
            avg_padding = sum(padding_values) / len(padding_values)
            layout["padding"] = {
                "top": {"value": node.get('paddingTop', avg_padding) or avg_padding, "token": f"var(--space-{int(node.get('paddingTop') or avg_padding)})"},
                "right": {"value": node.get('paddingRight', avg_padding) or avg_padding, "token": f"var(--space-{int(node.get('paddingRight') or avg_padding)})"},
                "bottom": {"value": node.get('paddingBottom', avg_padding) or avg_padding, "token": f"var(--space-{int(node.get('paddingBottom') or avg_padding)})"},
                "left": {"value": node.get('paddingLeft', avg_padding) or avg_padding, "token": f"var(--space-{int(node.get('paddingLeft') or avg_padding)})"}
            }
        
        # Gap
        if node.get('itemSpacing'):
            gap_value = node['itemSpacing']
            layout["gap"] = {
                "value": gap_value,
                "token": f"var(--stack-gap-{int(gap_value)})"
            }
        
        # Sizing
        if node.get('absoluteBoundingBox'):
            bbox = node['absoluteBoundingBox']
            layout["sizing"] = {
                "width": "fixed",
                "height": "fixed",
                "maxWidth": {
                    "value": bbox.get('width', 0),
                    "token": f"var(--container-{int(bbox.get('width', 0))})"
                }
            }
        
        # Alignment
        if node.get('primaryAxisAlignItems'):
            align_map = {
                "MIN": "flex-start",
                "CENTER": "center",
                "MAX": "flex-end",
                "SPACE_BETWEEN": "space-between"
            }
            layout["alignment"]["horizontal"] = align_map.get(node['primaryAxisAlignItems'], "left")
        
        return layout
    
    def extract_appearance(self, node: Dict[str, Any]) -> Dict[str, Any]:
        """Extract appearance properties following standard schema"""
        appearance = {
            "fills": [],
            "borders": {
                "radius": {},
                "width": {},
                "color": {"hex": "transparent", "token": "transparent"}
            },
            "effects": [],
            "opacity": {"value": 1, "token": "var(--opacity-opaque)"}
        }
        
        # Fills
        if node.get('fills'):
            for fill in node['fills']:
                if fill.get('type') == 'SOLID':
                    color_data = self.vectorize_color(fill.get('color', {}))
                    appearance["fills"].append({
                        "type": "SOLID",
                        "color": color_data,
                        "hex": color_data["hex"],
                        "token": color_data["token"]
                    })
                elif fill.get('type') == 'GRADIENT_LINEAR':
                    appearance["fills"].append({
                        "type": "GRADIENT",
                        "token": "var(--gradient-primary)"
                    })
        
        # Borders
        if node.get('cornerRadius'):
            radius_value = node['cornerRadius']
            appearance["borders"]["radius"] = {
                "value": radius_value,
                "token": f"var(--radius-{int(radius_value)})"
            }
        
        if node.get('strokeWeight'):
            width_value = node['strokeWeight']
            appearance["borders"]["width"] = {
                "value": width_value,
                "token": f"var(--border-{int(width_value)})"
            }
        
        if node.get('strokes'):
            for stroke in node['strokes']:
                if stroke.get('type') == 'SOLID':
                    color_data = self.vectorize_color(stroke.get('color', {}))
                    appearance["borders"]["color"] = {
                        "hex": color_data["hex"],
                        "token": color_data["token"]
                    }
        
        # Effects
        if node.get('effects'):
            for effect in node['effects']:
                if effect.get('type') == 'DROP_SHADOW':
                    appearance["effects"].append({
                        "type": "DROP_SHADOW",
                        "token": "var(--shadow-subtle)"
                    })
                elif effect.get('type') == 'INNER_SHADOW':
                    appearance["effects"].append({
                        "type": "INNER_SHADOW",
                        "token": "var(--shadow-inner)"
                    })
        
        return appearance
    
    def extract_content(self, node: Dict[str, Any]) -> Dict[str, Any]:
        """Extract content properties following standard schema"""
        content = {
            "type": node.get('type', 'FRAME'),
            "typography": {},
            "svgPath": None
        }
        
        # Text content
        if node.get('characters'):
            content["textValue"] = node['characters']
            content["type"] = "TEXT"
        
        # Typography
        if node.get('style'):
            style = node['style']
            content["typography"] = {
                "fontFamily": style.get('fontFamily', 'Inter'),
                "fontSize": {
                    "value": style.get('fontSize', 14),
                    "token": f"var(--text-{int(style.get('fontSize', 14))})"
                },
                "fontWeight": {
                    "value": style.get('fontWeight', 400),
                    "token": f"var(--font-weight-{style.get('fontWeight', 400)})"
                },
                "lineHeight": {
                    "value": style.get('lineHeightPx', 20),
                    "token": f"var(--line-height-{int(style.get('lineHeightPx', 20))})"
                },
                "letterSpacing": {
                    "value": style.get('letterSpacing', 0),
                    "token": f"var(--ls-{int(style.get('letterSpacing', 0))})"
                }
            }
        
        # SVG path for vectors
        if node.get('type') == 'VECTOR':
            # This would need more complex SVG path extraction
            content["svgPath"] = "M0,0 L10,10 L20,0 Z"  # Placeholder
        
        return content
    
    def extract_interactivity(self, node: Dict[str, Any]) -> Dict[str, Any]:
        """Extract interactivity properties following standard schema"""
        interactivity = {
            "href": None,
            "hoverState": False,
            "cursor": "default"
        }
        
        # Check for interactive indicators
        name = node.get('name', '').lower()
        if 'hover' in name or 'active' in name or 'focus' in name:
            interactivity["hoverState"] = True
            interactivity["cursor"] = "pointer"
        
        # Check if it's an instance (likely interactive)
        if node.get('type') == 'INSTANCE':
            interactivity["cursor"] = "pointer"
            interactivity["hoverState"] = True
        
        return interactivity
    
    def extract_children(self, node: Dict[str, Any], depth: int = 0) -> List[Dict[str, Any]]:
        """Extract children recursively following standard schema"""
        children = []
        
        if depth > 3:  # Limit depth for context
            return children
        
        if node.get('children'):
            for child in node['children'][:5]:  # Limit to 5 children for context
                child_spec = self.generate_standard_spec(child, depth + 1)
                children.append(child_spec)
        
        return children
    
    def generate_standard_spec(self, node: Dict[str, Any], depth: int = 0) -> Dict[str, Any]:
        """Generate component specification following standard schema"""
        
        spec = {
            "metadata": {
                "name": node.get('name', 'Unknown'),
                "componentId": node.get('componentId', node.get('id', '')),
                "nodeId": node.get('id', ''),
                "platform": "WEB"
            },
            
            "layout": self.extract_layout(node),
            
            "appearance": self.extract_appearance(node),
            
            "content": self.extract_content(node),
            
            "interactivity": self.extract_interactivity(node),
            
            "children": self.extract_children(node, depth)
        }
        
        return spec
    
    def save_spec(self, spec: Dict[str, Any], component_name: str) -> str:
        """Save standard specification"""
        output_dir = Path("/home/muthu/projects/ids_design_knowledge/design-system-knowledge")
        output_dir.mkdir(exist_ok=True)
        
        filename = f"{component_name.lower().replace(' ', '-')}-standard-spec.json"
        file_path = output_dir / filename
        
        with open(file_path, 'w') as f:
            json.dump(spec, f, indent=2)
        
        return str(file_path)


def main():
    """Main function"""
    print("📝 STANDARD LLM-FRIENDLY SPEC GENERATOR")
    print("=" * 70)
    print("Creating component specifications following standard schema")
    print("")
    
    # Load fingerprint
    fingerprint_file = "/home/muthu/projects/ids_design_knowledge/design-system-knowledge/accordion-fingerprint.json"
    
    print("📂 Loading fingerprint...")
    try:
        with open(fingerprint_file, 'r') as f:
            fingerprint = json.load(f)
        print(f"✅ Loaded fingerprint: {fingerprint['name']}")
    except Exception as e:
        print(f"❌ Failed to load fingerprint: {e}")
        return
    
    # Generate standard specification
    generator = StandardLLMSpecGenerator()
    
    print("📝 Generating standard LLM-friendly specification...")
    spec = generator.generate_standard_spec(fingerprint)
    
    print(f"✅ Generated spec with {len(str(spec))} chars")
    
    # Save specification
    component_name = fingerprint['name']
    file_path = generator.save_spec(spec, component_name)
    
    print(f"💾 Standard specification saved: {file_path}")
    
    # Show preview
    print(f"\n📋 STANDARD SPECIFICATION PREVIEW:")
    print(f"   Component: {spec['metadata']['name']}")
    print(f"   Type: {spec['content']['type']}")
    print(f"   Platform: {spec['metadata']['platform']}")
    print(f"   Layout: {spec['layout']['display']} {spec['layout']['direction']}")
    print(f"   Fills: {len(spec['appearance']['fills'])}")
    print(f"   Children: {len(spec['children'])}")
    
    print(f"\n🎉 STANDARD SPECIFICATION GENERATION COMPLETED!")
    print("=" * 70)
    print("✅ Standard LLM-friendly specification ready for AI generation!")


if __name__ == "__main__":
    main()
