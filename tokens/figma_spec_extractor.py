"""
Enhanced Figma Specification Extractor
Extracts comprehensive component specifications from Figma designs
"""

import json
import asyncio
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from pathlib import Path

from mcp.client.stdio import StdioServerParameters
from tokens.figma_client import FigmaMCPClient
from tokens.token_extractor import TokenExtractor


@dataclass
class ComponentSpec:
    """Comprehensive component specification from Figma"""
    name: str
    category: str
    figma_url: str
    node_id: str
    
    # Layout & Measurements
    width: Optional[float] = None
    height: Optional[float] = None
    padding: Optional[Dict[str, float]] = None
    margins: Optional[Dict[str, float]] = None
    border_radius: Optional[float] = None
    
    # Typography
    font_family: Optional[str] = None
    font_size: Optional[float] = None
    font_weight: Optional[str] = None
    line_height: Optional[float] = None
    
    # Colors & Tokens
    background_color: Optional[str] = None
    text_color: Optional[str] = None
    border_color: Optional[str] = None
    color_tokens: Optional[Dict[str, str]] = None
    
    # States
    states: Optional[List[Dict[str, Any]]] = None
    
    # Anatomy
    anatomy: Optional[List[Dict[str, Any]]] = None
    
    # Tokens
    design_tokens: Optional[Dict[str, Any]] = None
    
    # Usage Guidelines
    usage_guidelines: Optional[str] = None


class FigmaSpecExtractor:
    """
    Extracts comprehensive component specifications from Figma designs
    """
    
    def __init__(self):
        self.figma_client = FigmaMCPClient()
        self.token_extractor = TokenExtractor()
    
    async def extract_component_spec(
        self, 
        component_name: str, 
        figma_url: str, 
        node_id: str,
        category: str = "Unknown"
    ) -> ComponentSpec:
        """
        Extract comprehensive specification for a single component
        
        Args:
            component_name: Name of the component
            figma_url: Figma design URL
            node_id: Specific node ID for the component
            category: Component category
            
        Returns:
            ComponentSpec with all extracted information
        """
        print(f"🔍 Extracting spec for {component_name} from {figma_url}")
        
        # Connect to Figma MCP
        await self.figma_client.connect()
        
        try:
            # Get design variables and context
            figma_data = await self.figma_client.get_variables(figma_url)
            figma_json = json.loads(figma_data) if figma_data else {}
            
            # Extract design tokens
            design_tokens = self.token_extractor.extract(figma_json)
            
            # Parse node-specific information
            node_info = self._extract_node_info(figma_json, node_id)
            
            # Build comprehensive spec
            spec = ComponentSpec(
                name=component_name,
                category=category,
                figma_url=figma_url,
                node_id=node_id,
                **node_info,
                design_tokens=design_tokens
            )
            
            print(f"✅ Extracted spec for {component_name}")
            return spec
            
        except Exception as e:
            print(f"❌ Error extracting spec for {component_name}: {e}")
            raise
        finally:
            await self.figma_client.disconnect()
    
    def _extract_node_info(self, figma_data: Dict, node_id: str) -> Dict[str, Any]:
        """
        Extract node-specific information from Figma data
        
        Args:
            figma_data: Raw Figma data
            node_id: Target node ID
            
        Returns:
            Dictionary with extracted node information
        """
        node_info = {}
        
        try:
            # Find the specific node
            target_node = self._find_node_by_id(figma_data, node_id)
            
            if not target_node:
                print(f"⚠️ Node {node_id} not found in Figma data")
                return node_info
            
            # Extract layout information
            node_info.update(self._extract_layout_info(target_node))
            
            # Extract typography information
            node_info.update(self._extract_typography_info(target_node))
            
            # Extract color information
            node_info.update(self._extract_color_info(target_node))
            
            # Extract anatomy information
            node_info['anatomy'] = self._extract_anatomy(target_node)
            
            # Extract state variations
            node_info['states'] = self._extract_states(target_node)
            
            # Extract usage guidelines
            node_info['usage_guidelines'] = self._extract_usage_guidelines(target_node)
            
        except Exception as e:
            print(f"⚠️ Error extracting node info: {e}")
        
        return node_info
    
    def _find_node_by_id(self, figma_data: Dict, node_id: str) -> Optional[Dict]:
        """Find a specific node by ID in Figma data"""
        if 'document' in figma_data:
            return self._search_node_recursive(figma_data['document'], node_id)
        return None
    
    def _search_node_recursive(self, node: Dict, node_id: str) -> Optional[Dict]:
        """Recursively search for node by ID"""
        if node.get('id') == node_id:
            return node
        
        if 'children' in node:
            for child in node['children']:
                result = self._search_node_recursive(child, node_id)
                if result:
                    return result
        
        return None
    
    def _extract_layout_info(self, node: Dict) -> Dict[str, Any]:
        """Extract layout and measurement information"""
        layout_info = {}
        
        # Basic dimensions
        if 'absoluteBoundingBox' in node:
            bbox = node['absoluteBoundingBox']
            layout_info['width'] = bbox.get('width')
            layout_info['height'] = bbox.get('height')
        
        # Padding and margins
        if 'constraints' in node:
            layout_info['constraints'] = node['constraints']
        
        # Border radius
        if 'cornerRadius' in node:
            layout_info['border_radius'] = node['cornerRadius']
        
        # Auto layout properties
        if 'autoLayout' in node:
            auto_layout = node['autoLayout']
            layout_info['padding'] = {
                'top': auto_layout.get('paddingTop', 0),
                'right': auto_layout.get('paddingRight', 0),
                'bottom': auto_layout.get('paddingBottom', 0),
                'left': auto_layout.get('paddingLeft', 0)
            }
            layout_info['spacing'] = auto_layout.get('itemSpacing', 0)
        
        return layout_info
    
    def _extract_typography_info(self, node: Dict) -> Dict[str, Any]:
        """Extract typography information"""
        typo_info = {}
        
        if 'style' in node:
            style = node['style']
            typo_info['font_family'] = style.get('fontFamily')
            typo_info['font_size'] = style.get('fontSize')
            typo_info['font_weight'] = style.get('fontWeight')
            typo_info['line_height'] = style.get('lineHeight')
        
        return typo_info
    
    def _extract_color_info(self, node: Dict) -> Dict[str, Any]:
        """Extract color information"""
        color_info = {}
        
        # Background color
        if 'fills' in node and node['fills']:
            fill = node['fills'][0] if node['fills'] else {}
            if 'color' in fill:
                color = fill['color']
                rgba = f"rgba({int(color['r']*255)}, {int(color['g']*255)}, {int(color['b']*255)}, {color['a']})"
                color_info['background_color'] = rgba
        
        # Text color
        if 'style' in node and 'fills' in node['style']:
            text_fills = node['style']['fills']
            if text_fills and 'color' in text_fills[0]:
                color = text_fills[0]['color']
                rgba = f"rgba({int(color['r']*255)}, {int(color['g']*255)}, {int(color['b']*255)}, {color['a']})"
                color_info['text_color'] = rgba
        
        # Border color
        if 'strokes' in node and node['strokes']:
            stroke = node['strokes'][0] if node['strokes'] else {}
            if 'color' in stroke:
                color = stroke['color']
                rgba = f"rgba({int(color['r']*255)}, {int(color['g']*255)}, {int(color['b']*255)}, {color['a']})"
                color_info['border_color'] = rgba
        
        return color_info
    
    def _extract_anatomy(self, node: Dict) -> List[Dict[str, Any]]:
        """Extract component anatomy (child elements)"""
        anatomy = []
        
        if 'children' in node:
            for child in node['children']:
                part = {
                    'name': child.get('name', 'Unknown'),
                    'type': child.get('type', 'Unknown'),
                    'visible': child.get('visible', True),
                    'position': child.get('absoluteBoundingBox', {}),
                    'properties': {}
                }
                
                # Add specific properties based on type
                if child.get('type') == 'TEXT':
                    part['properties']['text'] = child.get('characters', '')
                elif child.get('type') == 'RECTANGLE':
                    part['properties']['size'] = child.get('absoluteBoundingBox', {})
                
                anatomy.append(part)
        
        return anatomy
    
    def _extract_states(self, node: Dict) -> List[Dict[str, Any]]:
        """Extract state variations"""
        states = []
        
        # Look for component properties or variants
        if 'componentPropertyDefinitions' in node:
            properties = node['componentPropertyDefinitions']
            
            for prop_name, prop_def in properties.items():
                if prop_def.get('type') == 'VARIANT':
                    values = prop_def.get('variantOptions', [])
                    for value in values:
                        states.append({
                            'name': value,
                            'property': prop_name,
                            'type': 'variant'
                        })
        
        # Default states
        default_states = [
            {'name': 'default', 'type': 'state'},
            {'name': 'hover', 'type': 'state'},
            {'name': 'active', 'type': 'state'},
            {'name': 'disabled', 'type': 'state'},
            {'name': 'focus', 'type': 'state'}
        ]
        
        states.extend(default_states)
        return states
    
    def _extract_usage_guidelines(self, node: Dict) -> str:
        """Extract usage guidelines from node description or comments"""
        guidelines = []
        
        if 'description' in node:
            guidelines.append(node['description'])
        
        # Look for guideline annotations in name
        name = node.get('name', '')
        if 'guideline' in name.lower() or 'usage' in name.lower():
            guidelines.append(f"Component: {name}")
        
        return '\n'.join(guidelines) if guidelines else "Follow design system guidelines for proper usage."
    
    async def extract_batch_specs(
        self, 
        component_mappings: List[Dict[str, str]]
    ) -> List[ComponentSpec]:
        """
        Extract specifications for multiple components
        
        Args:
            component_mappings: List of component mapping dictionaries
            
        Returns:
            List of ComponentSpec objects
        """
        specs = []
        
        for mapping in component_mappings:
            try:
                spec = await self.extract_component_spec(
                    component_name=mapping['component'],
                    figma_url=mapping['figmaUrl'],
                    node_id=mapping['nodeId'],
                    category=mapping.get('category', 'Unknown')
                )
                specs.append(spec)
                
            except Exception as e:
                print(f"❌ Failed to extract spec for {mapping['component']}: {e}")
                continue
        
        return specs
    
    def spec_to_mdx(self, spec: ComponentSpec) -> str:
        """
        Convert ComponentSpec to MDX format
        
        Args:
            spec: ComponentSpec object
            
        Returns:
            MDX formatted string
        """
        mdx_content = f"""# {spec.name} Design Specification

## Metadata
- Component: {spec.name}
- Category: {spec.category}
- Figma: {spec.figma_url}
- Node ID: {spec.node_id}

## Overview
{spec.usage_guidelines or 'Component specification extracted from Figma design.'}

## Anatomy
"""
        
        # Add anatomy information
        if spec.anatomy:
            for part in spec.anatomy:
                mdx_content += f"- **{part['name']}**: {part['type']} - {part.get('properties', {})}\n"
        else:
            mdx_content += "- Basic component structure\n"
        
        mdx_content += """
## Layout & Measurements
"""
        
        # Add layout information
        if spec.width and spec.height:
            mdx_content += f"- Dimensions: {spec.width}x{spec.height}px\n"
        
        if spec.padding:
            mdx_content += f"- Padding: {spec.padding}\n"
        
        if spec.border_radius:
            mdx_content += f"- Border Radius: {spec.border_radius}px\n"
        
        mdx_content += """
## Tokens

### Typography
"""
        
        # Add typography information
        if spec.font_family:
            mdx_content += f"- Font Family: {spec.font_family}\n"
        
        if spec.font_size:
            mdx_content += f"- Font Size: {spec.font_size}px\n"
        
        if spec.font_weight:
            mdx_content += f"- Font Weight: {spec.font_weight}\n"
        
        if spec.line_height:
            mdx_content += f"- Line Height: {spec.line_height}\n"
        
        mdx_content += """
### Colors
"""
        
        # Add color information
        if spec.background_color:
            mdx_content += f"- Background: {spec.background_color}\n"
        
        if spec.text_color:
            mdx_content += f"- Text Color: {spec.text_color}\n"
        
        if spec.border_color:
            mdx_content += f"- Border Color: {spec.border_color}\n"
        
        # Add design tokens
        if spec.design_tokens:
            mdx_content += "\n### Design Tokens\n"
            for token in spec.design_tokens:
                mdx_content += f"- {token['name']}: {token['value']}\n"
        
        mdx_content += """
## States (Light Theme)
"""
        
        # Add states information
        if spec.states:
            for state in spec.states:
                mdx_content += f"- **{state['name']}**: {state['type']}\n"
        
        from scripts.design_spec_template import DARK_STATES_BOILERPLATE

        mdx_content += """
## States (Dark Theme)

""" + DARK_STATES_BOILERPLATE + """

## Interactions
- TODO: pointer/keyboard behaviors from Figma variants.

## Composition & API (runtime)
- TODO: props, events, variants.

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
- TODO: slot tree from anatomy.

### Variant matrix
- TODO: variant axes from Figma.

### Validation checklist
- [ ] TODO: codegen QA items

## Source Mapping
- Figma: see Metadata
- Node ID: see Metadata
"""
        
        return mdx_content


# Utility function for batch processing
async def generate_all_specs(
    figma_map_file: str = "/home/muthu/projects/ids_design_knowledge/data/component-figma-map.json",
    output_dir: str = "/home/muthu/projects/ids_design_knowledge/design-system-knowledge"
) -> List[ComponentSpec]:
    """
    Generate specifications for all components in the mapping file
    
    Args:
        figma_map_file: Path to component-figma-map.json
        output_dir: Directory to save generated MDX files
        
    Returns:
        List of generated ComponentSpec objects
    """
    # Load component mappings
    with open(figma_map_file, 'r') as f:
        component_mappings = json.load(f)
    
    # Create extractor
    extractor = FigmaSpecExtractor()
    
    # Extract all specs
    specs = await extractor.extract_batch_specs(component_mappings)
    
    # Save MDX files
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    for spec in specs:
        mdx_content = extractor.spec_to_mdx(spec)
        filename = f"{spec.name.lower().replace(' ', '-').replace('/', '-')}-spec.mdx"
        file_path = output_path / filename
        
        with open(file_path, 'w') as f:
            f.write(mdx_content)
        
        print(f"💾 Saved spec: {file_path}")
    
    return specs


if __name__ == "__main__":
    # Test the extractor
    asyncio.run(generate_all_specs())
