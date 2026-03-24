#!/usr/bin/env python3
"""
Component Fingerprint Extractor
Extracts complete design fingerprint needed to recreate components
"""

import asyncio
import json
import logging
import os
import sys
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configure verbose logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)


class ComponentFingerprintExtractor:
    """
    Extracts complete component fingerprint from Figma API
    """
    
    def __init__(self):
        print("🔍 INITIALIZING COMPONENT FINGERPRINT EXTRACTOR")
        print("=" * 60)
        
        self.figma_token = os.getenv("FIGMA_TOKEN")
        self.base_url = "https://api.figma.com/v1"
        
        if not self.figma_token:
            raise RuntimeError("FIGMA_TOKEN not set in environment")
        
        print(f"🔑 Figma Token: ✅ Set ({self.figma_token[:10]}...)")
        print("=" * 60)
    
    def _extract_file_key_and_node_id(self, figma_url: str) -> tuple[str, str]:
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
    
    async def get_file_data(self, file_key: str) -> Dict[str, Any]:
        """Get complete file data from Figma API"""
        import aiohttp
        
        headers = {
            "X-Figma-Token": self.figma_token,
            "Content-Type": "application/json"
        }
        
        url = f"{self.base_url}/files/{file_key}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    raise RuntimeError(f"Figma API error: {response.status} - {error_text}")
    
    def find_node_in_document(self, node_id: str, document: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Recursively find a node in the document by ID"""
        if document.get('id') == node_id:
            return document
        
        if 'children' in document and document['children']:
            for child in document['children']:
                found = self.find_node_in_document(node_id, child)
                if found:
                    return found
        
        return None
    
    def extract_node_fingerprint(self, node: Dict[str, Any]) -> Dict[str, Any]:
        """Extract complete fingerprint from a node"""
        fingerprint = {
            # Basic info
            "id": node.get('id'),
            "name": node.get('name'),
            "type": node.get('type'),
            "visible": node.get('visible'),
            "locked": node.get('locked'),
            
            # Layout and positioning
            "absoluteBoundingBox": node.get('absoluteBoundingBox'),
            "relativeBoundingBox": node.get('relativeBoundingBox'),
            "size": {
                "width": node.get('absoluteBoundingBox', {}).get('width', 0),
                "height": node.get('absoluteBoundingBox', {}).get('height', 0)
            },
            "position": {
                "x": node.get('absoluteBoundingBox', {}).get('x', 0),
                "y": node.get('absoluteBoundingBox', {}).get('y', 0)
            },
            
            # Visual properties
            "fills": node.get('fills', []),
            "strokes": node.get('strokes', []),
            "strokeWeight": node.get('strokeWeight'),
            "strokeAlign": node.get('strokeAlign'),
            "strokeCap": node.get('strokeCap'),
            "strokeJoin": node.get('strokeJoin'),
            "cornerRadius": node.get('cornerRadius'),
            "cornerSmoothing": node.get('cornerSmoothing'),
            
            # Effects
            "effects": node.get('effects', []),
            
            # Text properties (if applicable)
            "characters": node.get('characters'),
            "style": node.get('style', {}),
            
            # Layout properties
            "layoutMode": node.get('layoutMode'),
            "layoutAlign": node.get('layoutAlign'),
            "layoutGrow": node.get('layoutGrow'),
            "layoutPositioning": node.get('layoutPositioning'),
            "primaryAxisSizingMode": node.get('primaryAxisSizingMode'),
            "counterAxisSizingMode": node.get('counterAxisSizingMode'),
            "primaryAxisAlignItems": node.get('primaryAxisAlignItems'),
            "counterAxisAlignItems": node.get('counterAxisAlignItems'),
            "counterAxisAlignContent": node.get('counterAxisAlignContent'),
            "primaryAxisAlignContent": node.get('primaryAxisAlignContent'),
            
            # Spacing
            "itemSpacing": node.get('itemSpacing'),
            "paddingLeft": node.get('paddingLeft'),
            "paddingRight": node.get('paddingRight'),
            "paddingTop": node.get('paddingTop'),
            "paddingBottom": node.get('paddingBottom'),
            
            # Constraints
            "constraints": node.get('constraints', {}),
            
            # Component properties
            "componentId": node.get('componentId'),
            "componentProperties": node.get('componentProperties', {}),
            
            # Auto layout
            "autoLayout": node.get('autoLayout'),
            
            # Children (recursively extracted)
            "children": []
        }
        
        # Extract children fingerprints recursively
        if 'children' in node and node['children']:
            for child in node['children']:
                child_fingerprint = self.extract_node_fingerprint(child)
                fingerprint['children'].append(child_fingerprint)
        
        return fingerprint
    
    async def get_component_fingerprint(self, figma_url: str) -> Dict[str, Any]:
        """Get complete component fingerprint"""
        try:
            file_key, node_id = self._extract_file_key_and_node_id(figma_url)
            
            print(f"🔍 Getting component fingerprint...")
            print(f"   File key: {file_key}")
            print(f"   Node ID: {node_id}")
            
            # Get complete file data
            print("   📡 Fetching file data...")
            file_data = await self.get_file_data(file_key)
            
            print(f"   ✅ Got file: {file_data.get('name', 'Unknown')}")
            
            # Find the specific node
            print("   🔍 Finding component node...")
            node = self.find_node_in_document(node_id, file_data['document'])
            
            if not node:
                raise RuntimeError(f"Node {node_id} not found in file {file_key}")
            
            print(f"   ✅ Found node: {node.get('name', 'Unknown')}")
            
            # Extract complete fingerprint
            print("   📋 Extracting fingerprint...")
            fingerprint = self.extract_node_fingerprint(node)
            
            # Add metadata
            fingerprint['metadata'] = {
                "file_key": file_key,
                "file_name": file_data.get('name', 'Unknown'),
                "figma_url": figma_url,
                "extracted_at": datetime.now().isoformat(),
                "schema_version": file_data.get('schemaVersion', 0),
                "styles": file_data.get('styles', {}),
                "components": file_data.get('components', {})
            }
            
            print(f"   ✅ Fingerprint extracted!")
            print(f"   📊 Size: {len(str(fingerprint))} chars")
            print(f"   🎨 Children: {len(fingerprint['children'])}")
            
            return fingerprint
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            raise
    
    async def save_fingerprint(self, fingerprint: Dict[str, Any], component_name: str) -> str:
        """Save fingerprint to file"""
        output_dir = Path("/home/muthu/projects/ids_design_knowledge/design-system-knowledge")
        output_dir.mkdir(exist_ok=True)
        
        filename = f"{component_name.lower().replace(' ', '-')}-fingerprint.json"
        file_path = output_dir / filename
        
        with open(file_path, 'w') as f:
            json.dump(fingerprint, f, indent=2)
        
        return str(file_path)


async def main():
    """Main function"""
    print("🔍 COMPONENT FINGERPRINT EXTRACTOR")
    print("=" * 60)
    print("Extracting complete design fingerprint for component recreation")
    print("")
    
    # Test with Accordion component
    figma_url = "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54535&m=dev"
    
    extractor = ComponentFingerprintExtractor()
    
    try:
        print("🎯 EXTRACTING FINGERPRINT FOR ACCORDION")
        print("=" * 40)
        
        fingerprint = await extractor.get_component_fingerprint(figma_url)
        
        # Show key fingerprint info
        print(f"\n📋 FINGERPRINT SUMMARY:")
        print(f"   Name: {fingerprint['name']}")
        print(f"   Type: {fingerprint['type']}")
        print(f"   Size: {fingerprint['size']['width']}x{fingerprint['size']['height']}")
        print(f"   Children: {len(fingerprint['children'])}")
        print(f"   Fills: {len(fingerprint['fills'])}")
        print(f"   Strokes: {len(fingerprint['strokes'])}")
        print(f"   Effects: {len(fingerprint['effects'])}")
        
        # Save fingerprint
        file_path = await extractor.save_fingerprint(fingerprint, "Accordion")
        print(f"\n💾 Fingerprint saved: {file_path}")
        
        print(f"\n🎉 FINGERPRINT EXTRACTION COMPLETED!")
        print("=" * 60)
        print("✅ Complete design fingerprint extracted for component recreation")
        
    except Exception as e:
        print(f"❌ Extraction failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
