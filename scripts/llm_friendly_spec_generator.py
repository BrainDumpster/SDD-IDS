#!/usr/bin/env python3
"""
LLM-Friendly Spec Generator
Creates concise, context-friendly component specifications
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime


class LLMSpecGenerator:
    """Generates LLM-friendly component specifications"""
    
    def __init__(self):
        print("📝 INITIALIZING LLM-FRIENDLY SPEC GENERATOR")
        print("=" * 60)
    
    def vectorize_color(self, color: Dict[str, float]) -> str:
        """Convert Figma color to hex color"""
        if not color:
            return "transparent"
        
        r = int(color.get('r', 0) * 255)
        g = int(color.get('g', 0) * 255)
        b = int(color.get('b', 0) * 255)
        a = color.get('a', 1.0)
        
        if a < 1.0:
            return f"rgba({r}, {g}, {b}, {a:.2f})"
        else:
            return f"#{r:02x}{g:02x}{b:02x}"
    
    def extract_design_tokens(self, node: Dict[str, Any]) -> Dict[str, Any]:
        """Extract design tokens from node"""
        tokens = {}
        
        # Color tokens
        if node.get('fills'):
            fills = node['fills']
            if fills and fills[0].get('type') == 'SOLID':
                color = fills[0]['color']
                tokens['background'] = self.vectorize_color(color)
        
        # Typography tokens
        if node.get('style'):
            style = node['style']
            if style.get('fontFamily'):
                tokens['fontFamily'] = style['fontFamily']
            if style.get('fontSize'):
                tokens['fontSize'] = f"{style['fontSize']}px"
            if style.get('fontWeight'):
                tokens['fontWeight'] = str(style['fontWeight'])
            if style.get('lineHeightPx'):
                tokens['lineHeight'] = f"{style['lineHeightPx']}px"
            if style.get('textAlignHorizontal'):
                tokens['textAlign'] = style['textAlignHorizontal'].lower()
        
        # Layout tokens
        if node.get('absoluteBoundingBox'):
            bbox = node['absoluteBoundingBox']
            tokens['width'] = f"{bbox['width']}px"
            tokens['height'] = f"{bbox['height']}px"
        
        # Border tokens
        if node.get('cornerRadius'):
            tokens['borderRadius'] = f"{node['cornerRadius']}px"
        
        if node.get('strokeWeight'):
            tokens['borderWidth'] = f"{node['strokeWeight']}px"
        
        return tokens
    
    def extract_component_structure(self, node: Dict[str, Any], depth: int = 0) -> Dict[str, Any]:
        """Extract component structure recursively"""
        structure = {
            'name': node.get('name', 'Unknown'),
            'type': node.get('type', 'Unknown'),
            'tokens': self.extract_design_tokens(node),
            'children': []
        }
        
        # Add text content if present
        if node.get('characters'):
            structure['text'] = node['characters']
        
        # Recursively extract children (limit depth for context)
        if depth < 3 and node.get('children'):
            for child in node['children'][:5]:  # Limit to 5 children for context
                child_structure = self.extract_component_structure(child, depth + 1)
                structure['children'].append(child_structure)
        
        return structure
    
    def extract_interactive_states(self, node: Dict[str, Any]) -> List[str]:
        """Extract interactive states from component name and structure"""
        states = []
        name = node.get('name', '').lower()
        
        # Look for state indicators in name
        if 'hover' in name:
            states.append('hover')
        if 'active' in name:
            states.append('active')
        if 'disabled' in name:
            states.append('disabled')
        if 'expanded' in name:
            states.append('expanded')
        if 'collapsed' in name:
            states.append('collapsed')
        
        # Look for variants in children
        if node.get('children'):
            child_names = [child.get('name', '').lower() for child in node['children']]
            if 'expanded' in ' '.join(child_names):
                states.append('expanded')
            if 'collapsed' in ' '.join(child_names):
                states.append('collapsed')
        
        return states
    
    def extract_usage_patterns(self, node: Dict[str, Any]) -> Dict[str, Any]:
        """Extract usage patterns from component"""
        patterns = {}
        
        # Component type
        comp_type = node.get('type', '').lower()
        if comp_type == 'frame':
            patterns['componentType'] = 'container'
        elif comp_type == 'text':
            patterns['componentType'] = 'text'
        elif comp_type == 'instance':
            patterns['componentType'] = 'instance'
        else:
            patterns['componentType'] = comp_type
        
        # Layout mode
        if node.get('layoutMode'):
            patterns['layout'] = node['layoutMode'].lower()
        
        # Interactive elements
        if node.get('children'):
            child_types = [child.get('type', '').lower() for child in node['children']]
            if 'instance' in child_types:
                patterns['hasInteractiveElements'] = True
            if 'text' in child_types:
                patterns['hasTextContent'] = True
        
        return patterns
    
    def generate_llm_spec(self, fingerprint: Dict[str, Any]) -> Dict[str, Any]:
        """Generate LLM-friendly specification"""
        
        # Extract key information
        main_structure = self.extract_component_structure(fingerprint)
        states = self.extract_interactive_states(fingerprint)
        patterns = self.extract_usage_patterns(fingerprint)
        
        # Create LLM-friendly spec
        spec = {
            'component': {
                'name': fingerprint['name'],
                'type': fingerprint['type'],
                'id': fingerprint['id'],
                'size': fingerprint['size'],
                'description': f"{fingerprint['name']} component from IDS design system"
            },
            
            'designTokens': {
                'primary': self.extract_design_tokens(fingerprint),
                'typography': self._extract_typography_tokens(fingerprint),
                'colors': self._extract_color_tokens(fingerprint),
                'spacing': self._extract_spacing_tokens(fingerprint)
            },
            
            'structure': {
                'main': main_structure,
                'keyElements': self._extract_key_elements(fingerprint),
                'hierarchy': self._extract_hierarchy(fingerprint)
            },
            
            'states': {
                'available': states,
                'default': 'default',
                'interactive': len(states) > 0
            },
            
            'usage': {
                'patterns': patterns,
                'variants': self._extract_variants(fingerprint),
                'examples': self._extract_examples(fingerprint)
            },
            
            'implementation': {
                'framework': 'lit',
                'cssProperties': self._extract_css_properties(fingerprint),
                'componentProperties': ['expanded', 'disabled', 'variant'],
                'events': ['toggle', 'change']
            },
            
            'metadata': {
                'source': 'figma',
                'fileKey': fingerprint['metadata']['file_key'],
                'extractedAt': datetime.now().isoformat(),
                'version': '1.0.0'
            }
        }
        
        return spec
    
    def _extract_typography_tokens(self, node: Dict[str, Any]) -> Dict[str, str]:
        """Extract typography tokens"""
        tokens = {}
        
        def extract_from_node(n):
            if n.get('style'):
                style = n['style']
                if style.get('fontFamily'):
                    tokens['fontFamily'] = style['fontFamily']
                if style.get('fontSize'):
                    tokens['fontSize'] = f"{style['fontSize']}px"
                if style.get('fontWeight'):
                    tokens['fontWeight'] = str(style['fontWeight'])
                if style.get('lineHeightPx'):
                    tokens['lineHeight'] = f"{style['lineHeightPx']}px"
            
            if n.get('children'):
                for child in n['children']:
                    extract_from_node(child)
        
        extract_from_node(node)
        return tokens
    
    def _extract_color_tokens(self, node: Dict[str, Any]) -> Dict[str, str]:
        """Extract color tokens"""
        colors = {}
        
        def extract_from_node(n):
            if n.get('fills'):
                for fill in n['fills']:
                    if fill.get('type') == 'SOLID':
                        color = self.vectorize_color(fill['color'])
                        colors['background'] = color
            
            if n.get('strokes'):
                for stroke in n['strokes']:
                    if stroke.get('type') == 'SOLID':
                        color = self.vectorize_color(stroke['color'])
                        colors['border'] = color
            
            if n.get('children'):
                for child in n['children']:
                    extract_from_node(child)
        
        extract_from_node(node)
        return colors
    
    def _extract_spacing_tokens(self, node: Dict[str, Any]) -> Dict[str, str]:
        """Extract spacing tokens"""
        spacing = {}
        
        if node.get('itemSpacing'):
            spacing['gap'] = f"{node['itemSpacing']}px"
        
        if node.get('paddingTop'):
            spacing['paddingTop'] = f"{node['paddingTop']}px"
        if node.get('paddingRight'):
            spacing['paddingRight'] = f"{node['paddingRight']}px"
        if node.get('paddingBottom'):
            spacing['paddingBottom'] = f"{node['paddingBottom']}px"
        if node.get('paddingLeft'):
            spacing['paddingLeft'] = f"{node['paddingLeft']}px"
        
        return spacing
    
    def _extract_key_elements(self, node: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract key elements from component"""
        key_elements = []
        
        def extract_from_node(n, depth=0):
            if depth > 2:  # Limit depth
                return
            
            if n.get('type') in ['TEXT', 'INSTANCE', 'COMPONENT']:
                element = {
                    'name': n.get('name', 'Unknown'),
                    'type': n.get('type', 'Unknown'),
                    'tokens': self.extract_design_tokens(n)
                }
                
                if n.get('characters'):
                    element['text'] = n['characters']
                
                key_elements.append(element)
            
            if n.get('children'):
                for child in n['children'][:3]:  # Limit children
                    extract_from_node(child, depth + 1)
        
        extract_from_node(node)
        return key_elements
    
    def _extract_hierarchy(self, node: Dict[str, Any]) -> List[str]:
        """Extract component hierarchy"""
        hierarchy = []
        
        def extract_from_node(n, depth=0):
            if depth > 3:  # Limit depth
                return
            
            name = n.get('name', 'Unknown')
            node_type = n.get('type', 'Unknown')
            hierarchy.append(f"{'  ' * depth}{name} ({node_type})")
            
            if n.get('children'):
                for child in n['children'][:5]:  # Limit children
                    extract_from_node(child, depth + 1)
        
        extract_from_node(node)
        return hierarchy
    
    def _extract_variants(self, node: Dict[str, Any]) -> List[str]:
        """Extract component variants"""
        variants = ['default']
        
        # Look for variant indicators in children
        if node.get('children'):
            child_names = [child.get('name', '').lower() for child in node['children']]
            
            if 'expanded' in ' '.join(child_names):
                variants.append('expanded')
            if 'collapsed' in ' '.join(child_names):
                variants.append('collapsed')
            if 'hover' in ' '.join(child_names):
                variants.append('hover')
            if 'disabled' in ' '.join(child_names):
                variants.append('disabled')
        
        return variants
    
    def _extract_examples(self, node: Dict[str, Any]) -> List[str]:
        """Extract usage examples"""
        examples = []
        
        if node.get('children'):
            for child in node['children'][:3]:  # Limit examples
                name = child.get('name', 'Unknown')
                if 'example' in name.lower() or 'demo' in name.lower():
                    examples.append(name)
        
        if not examples:
            examples = ['Default usage', 'With content', 'Expanded state']
        
        return examples
    
    def _extract_css_properties(self, node: Dict[str, Any]) -> List[str]:
        """Extract CSS properties needed"""
        properties = ['display', 'position', 'width', 'height', 'background', 
                     'color', 'font-family', 'font-size', 'font-weight', 
                     'line-height', 'text-align', 'border', 'border-radius',
                     'padding', 'margin', 'gap', 'flex-direction', 'justify-content',
                     'align-items']
        
        return properties
    
    def save_spec(self, spec: Dict[str, Any], component_name: str) -> str:
        """Save LLM-friendly specification"""
        output_dir = Path("/home/muthu/projects/ids_design_knowledge/design-system-knowledge")
        output_dir.mkdir(exist_ok=True)
        
        filename = f"{component_name.lower().replace(' ', '-')}-llm-spec.json"
        file_path = output_dir / filename
        
        with open(file_path, 'w') as f:
            json.dump(spec, f, indent=2)
        
        return str(file_path)


def main():
    """Main function"""
    print("📝 LLM-FRIENDLY SPEC GENERATOR")
    print("=" * 60)
    print("Creating concise, context-friendly component specification")
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
    
    # Generate LLM-friendly spec
    generator = LLMSpecGenerator()
    
    print("📝 Generating LLM-friendly specification...")
    spec = generator.generate_llm_spec(fingerprint)
    
    print(f"✅ Generated spec with {len(str(spec))} chars")
    
    # Save specification
    component_name = fingerprint['name']
    file_path = generator.save_spec(spec, component_name)
    
    print(f"💾 Specification saved: {file_path}")
    
    # Show preview
    print(f"\n📋 SPECIFICATION PREVIEW:")
    print(f"   Component: {spec['component']['name']}")
    print(f"   Type: {spec['component']['type']}")
    print(f"   States: {', '.join(spec['states']['available'])}")
    print(f"   Tokens: {len(spec['designTokens']['primary'])} properties")
    print(f"   Structure: {len(spec['structure']['keyElements'])} key elements")
    
    print(f"\n🎉 SPECIFICATION GENERATION COMPLETED!")
    print("=" * 60)
    print("✅ LLM-friendly specification ready for AI generation!")


if __name__ == "__main__":
    main()
