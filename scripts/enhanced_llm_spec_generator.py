#!/usr/bin/env python3
"""
Enhanced LLM-Friendly Spec Generator
Creates concise, context-friendly component specifications with design system variables
"""

import asyncio
import json
import os
import re
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime

# Load environment variables
from dotenv import load_dotenv
load_dotenv()


class EnhancedLLMSpecGenerator:
    """Generates LLM-friendly component specifications with design system variables"""
    
    def __init__(self):
        print("📝 INITIALIZING ENHANCED LLM-FRIENDLY SPEC GENERATOR")
        print("=" * 70)
        
        self.figma_token = os.getenv("FIGMA_TOKEN")
        self.base_url = "https://api.figma.com/v1"
        
        if not self.figma_token:
            raise RuntimeError("FIGMA_TOKEN not set in environment")
        
        print(f"🔑 Figma Token: ✅ Set ({self.figma_token[:10]}...)")
        print("=" * 70)
    
    async def get_file_variables(self, file_key: str) -> Dict[str, Any]:
        """Get design system variables from Figma file"""
        import aiohttp
        
        headers = {
            "X-Figma-Token": self.figma_token,
            "Content-Type": "application/json"
        }
        
        url = f"{self.base_url}/files/{file_key}/variables"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    print(f"❌ Error fetching variables: {error_text}")
                    return {}
    
    def extract_file_key_and_node_id(self, figma_url: str) -> tuple[str, str]:
        """Extract file key and node ID from Figma URL"""
        # Extract file key from URL path
        path_parts = figma_url.split('/')
        file_key = None
        for part in path_parts:
            if part and len(part) > 10 and part.isalnum():
                file_key = part
                break
        
        # Extract node ID from query parameters
        node_id = None
        if '?' in figma_url:
            query_part = figma_url.split('?')[1]
            for param in query_part.split('&'):
                if param.startswith('node-id='):
                    node_id = param.split('=')[1]
                    # Convert hyphens to colons for Figma API compatibility
                    node_id = node_id.replace('-', ':')
                    break
        
        if not file_key or not node_id:
            raise ValueError(f"Could not extract file key and node ID from URL: {figma_url}")
        
        return file_key, node_id
    
    def create_variable_mapping(self, variables_data: Dict[str, Any]) -> Dict[str, str]:
        """Create mapping from variable IDs to variable names"""
        variable_map = {}
        
        if 'variableCollections' in variables_data:
            for collection in variables_data['variableCollections']:
                collection_name = collection.get('name', 'Unknown')
                
                if 'modes' in collection and collection['modes']:
                    mode_id = collection['modes'][0]['modeId']
                    
                    if 'variableIds' in collection:
                        for var_id in collection['variableIds']:
                            if var_id in variables_data.get('variables', {}):
                                var = variables_data['variables'][var_id]
                                var_name = var.get('name', 'Unknown')
                                
                                # Create semantic variable name
                                semantic_name = f"{collection_name}/{var_name}"
                                variable_map[var_id] = semantic_name
                                
                                # Also map with VariableID prefix
                                variable_map[f"VariableID:{var_id}"] = semantic_name
        
        return variable_map
    
    def vectorize_color_with_variables(self, color: Dict[str, float], bound_variables: Dict[str, Any], variable_map: Dict[str, str]) -> str:
        """Convert Figma color to CSS color or variable reference"""
        if bound_variables and 'color' in bound_variables:
            var_info = bound_variables['color']
            if var_info.get('type') == 'VARIABLE_ALIAS' and 'id' in var_info:
                var_id = var_info['id']
                
                # Remove VariableID prefix if present
                clean_var_id = var_id.replace('VariableID:', '')
                
                if clean_var_id in variable_map:
                    var_name = variable_map[clean_var_id]
                    # Convert to CSS variable format
                    css_var_name = var_name.replace('/', '-').replace(' ', '-').lower()
                    return f"var(--{css_var_name})"
        
        # Fallback to hex color
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
    
    def extract_design_tokens_with_variables(self, node: Dict[str, Any], variable_map: Dict[str, str]) -> Dict[str, Any]:
        """Extract design tokens from node using variables"""
        tokens = {}
        
        # Color tokens with variables
        if node.get('fills'):
            fills = node['fills']
            if fills and fills[0].get('type') == 'SOLID':
                color = fills[0]['color']
                bound_vars = node.get('boundVariables', {})
                tokens['background'] = self.vectorize_color_with_variables(color, bound_vars, variable_map)
        
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
        
        # Stroke color with variables
        if node.get('strokes'):
            strokes = node['strokes']
            if strokes and strokes[0].get('type') == 'SOLID':
                color = strokes[0]['color']
                bound_vars = node.get('boundVariables', {})
                tokens['borderColor'] = self.vectorize_color_with_variables(color, bound_vars, variable_map)
        
        return tokens
    
    def extract_component_structure_with_variables(self, node: Dict[str, Any], variable_map: Dict[str, str], depth: int = 0) -> Dict[str, Any]:
        """Extract component structure recursively with variables"""
        structure = {
            'name': node.get('name', 'Unknown'),
            'type': node.get('type', 'Unknown'),
            'tokens': self.extract_design_tokens_with_variables(node, variable_map),
            'children': []
        }
        
        # Add text content if present
        if node.get('characters'):
            structure['text'] = node['characters']
        
        # Recursively extract children (limit depth for context)
        if depth < 3 and node.get('children'):
            for child in node['children'][:5]:  # Limit to 5 children for context
                child_structure = self.extract_component_structure_with_variables(child, variable_map, depth + 1)
                structure['children'].append(child_structure)
        
        return structure
    
    def extract_color_tokens_with_variables(self, node: Dict[str, Any], variable_map: Dict[str, str]) -> Dict[str, str]:
        """Extract color tokens with variables"""
        colors = {}
        bound_vars = node.get('boundVariables', {})
        
        def extract_from_node(n):
            if n.get('fills'):
                for fill in n['fills']:
                    if fill.get('type') == 'SOLID':
                        color = fill['color']
                        node_bound_vars = n.get('boundVariables', {})
                        colors['background'] = self.vectorize_color_with_variables(color, node_bound_vars, variable_map)
            
            if n.get('strokes'):
                for stroke in n['strokes']:
                    if stroke.get('type') == 'SOLID':
                        color = stroke['color']
                        node_bound_vars = n.get('boundVariables', {})
                        colors['border'] = self.vectorize_color_with_variables(color, node_bound_vars, variable_map)
            
            if n.get('children'):
                for child in n['children']:
                    extract_from_node(child)
        
        extract_from_node(node)
        return colors
    
    async def generate_enhanced_llm_spec(self, fingerprint: Dict[str, Any]) -> Dict[str, Any]:
        """Generate enhanced LLM-friendly specification with variables"""
        
        # Get file key for variables
        figma_url = fingerprint['metadata']['figma_url']
        file_key, _ = self.extract_file_key_and_node_id(figma_url)
        
        print(f"🔍 Fetching design system variables for file: {file_key}")
        
        # Get variables from Figma API
        variables_data = await self.get_file_variables(file_key)
        
        # Create variable mapping
        variable_map = self.create_variable_mapping(variables_data)
        print(f"✅ Found {len(variable_map)} design system variables")
        
        # Extract key information with variables
        main_structure = self.extract_component_structure_with_variables(fingerprint, variable_map)
        
        # Create enhanced LLM-friendly spec
        spec = {
            'component': {
                'name': fingerprint['name'],
                'type': fingerprint['type'],
                'id': fingerprint['id'],
                'size': fingerprint['size'],
                'description': f"{fingerprint['name']} component from IDS design system with design system variables"
            },
            
            'designTokens': {
                'primary': self.extract_design_tokens_with_variables(fingerprint, variable_map),
                'typography': self._extract_typography_tokens(fingerprint),
                'colors': self.extract_color_tokens_with_variables(fingerprint, variable_map),
                'spacing': self._extract_spacing_tokens(fingerprint),
                'variables': {
                    'count': len(variable_map),
                    'mapping': dict(list(variable_map.items())[:10])  # Show first 10 for context
                }
            },
            
            'structure': {
                'main': main_structure,
                'keyElements': self._extract_key_elements_with_variables(fingerprint, variable_map),
                'hierarchy': self._extract_hierarchy(fingerprint)
            },
            
            'states': {
                'available': self._extract_interactive_states(fingerprint),
                'default': 'default',
                'interactive': len(self._extract_interactive_states(fingerprint)) > 0
            },
            
            'usage': {
                'patterns': self._extract_usage_patterns(fingerprint),
                'variants': self._extract_variants(fingerprint),
                'examples': self._extract_examples(fingerprint)
            },
            
            'implementation': {
                'framework': 'lit',
                'cssProperties': self._extract_css_properties(fingerprint),
                'componentProperties': ['expanded', 'disabled', 'variant'],
                'events': ['toggle', 'change'],
                'cssVariables': True
            },
            
            'metadata': {
                'source': 'figma',
                'fileKey': fingerprint['metadata']['file_key'],
                'extractedAt': datetime.now().isoformat(),
                'version': '1.0.0',
                'hasDesignSystemVariables': True,
                'variableCount': len(variable_map)
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
    
    def _extract_key_elements_with_variables(self, node: Dict[str, Any], variable_map: Dict[str, str]) -> List[Dict[str, Any]]:
        """Extract key elements from component with variables"""
        key_elements = []
        
        def extract_from_node(n, depth=0):
            if depth > 2:  # Limit depth
                return
            
            if n.get('type') in ['TEXT', 'INSTANCE', 'COMPONENT']:
                element = {
                    'name': n.get('name', 'Unknown'),
                    'type': n.get('type', 'Unknown'),
                    'tokens': self.extract_design_tokens_with_variables(n, variable_map)
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
    
    def _extract_interactive_states(self, node: Dict[str, Any]) -> List[str]:
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
    
    def _extract_usage_patterns(self, node: Dict[str, Any]) -> Dict[str, Any]:
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
        """Save enhanced LLM-friendly specification"""
        output_dir = Path("/home/muthu/projects/ids_design_knowledge/design-system-knowledge")
        output_dir.mkdir(exist_ok=True)
        
        filename = f"{component_name.lower().replace(' ', '-')}-enhanced-llm-spec.json"
        file_path = output_dir / filename
        
        with open(file_path, 'w') as f:
            json.dump(spec, f, indent=2)
        
        return str(file_path)


async def main():
    """Main function"""
    print("📝 ENHANCED LLM-FRIENDLY SPEC GENERATOR")
    print("=" * 70)
    print("Creating concise, context-friendly component specification with design system variables")
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
    
    # Generate enhanced LLM-friendly spec
    generator = EnhancedLLMSpecGenerator()
    
    print("📝 Generating enhanced LLM-friendly specification with design system variables...")
    spec = await generator.generate_enhanced_llm_spec(fingerprint)
    
    print(f"✅ Generated spec with {len(str(spec))} chars")
    print(f"🎨 Design system variables: {spec['designTokens']['variables']['count']}")
    
    # Save specification
    component_name = fingerprint['name']
    file_path = generator.save_spec(spec, component_name)
    
    print(f"💾 Enhanced specification saved: {file_path}")
    
    # Show preview
    print(f"\n📋 ENHANCED SPECIFICATION PREVIEW:")
    print(f"   Component: {spec['component']['name']}")
    print(f"   Type: {spec['component']['type']}")
    print(f"   States: {', '.join(spec['states']['available'])}")
    print(f"   Tokens: {len(spec['designTokens']['primary'])} properties")
    print(f"   Structure: {len(spec['structure']['keyElements'])} key elements")
    print(f"   Variables: {spec['designTokens']['variables']['count']} design system variables")
    print(f"   CSS Variables: {spec['implementation']['cssVariables']}")
    
    print(f"\n🎉 ENHANCED SPECIFICATION GENERATION COMPLETED!")
    print("=" * 70)
    print("✅ Enhanced LLM-friendly specification with design system variables ready for AI generation!")


if __name__ == "__main__":
    asyncio.run(main())
