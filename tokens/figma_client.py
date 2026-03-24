import asyncio
import json
import re
from typing import Dict, Any, Optional
from urllib.parse import urlparse, parse_qs

from config.settings import settings


class FigmaAPIClient:
    """Client for interacting with Figma REST API directly"""
    
    def __init__(self):
        self.figma_token = settings.figma_token
        self.base_url = "https://api.figma.com/v1"
        
        if not self.figma_token:
            raise RuntimeError("FIGMA_TOKEN not set in environment (.env)")
    
    def _extract_file_key_and_node_id(self, figma_url: str) -> tuple[str, str]:
        """Extract file key and node ID from Figma URL"""
        # Parse URL to extract file key and node ID
        # Example: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54535&m=dev
        
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
    
    async def get_file_nodes(self, file_key: str, node_ids: list[str]) -> Dict[str, Any]:
        """Get specific nodes from Figma file"""
        import aiohttp
        
        headers = {
            "X-Figma-Token": self.figma_token,
            "Content-Type": "application/json"
        }
        
        # Convert node IDs to the format expected by Figma API
        node_ids_str = ",".join(node_ids)
        url = f"{self.base_url}/files/{file_key}/nodes"
        params = {"ids": node_ids_str}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, params=params) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    raise RuntimeError(f"Figma API error: {response.status} - {error_text}")
    
    async def get_file(self, file_key: str) -> Dict[str, Any]:
        """Get entire Figma file"""
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
    
    async def get_component_spec(self, figma_url: str) -> Dict[str, Any]:
        """Get essential component specification from Figma"""
        try:
            file_key, node_id = self._extract_file_key_and_node_id(figma_url)
            
            print(f"🔍 Getting component spec from Figma API...")
            print(f"   File key: {file_key}")
            print(f"   Node ID: {node_id}")
            
            # Get the specific node only (not entire file)
            nodes_data = await self.get_file_nodes(file_key, [node_id])
            
            if "nodes" not in nodes_data or node_id not in nodes_data["nodes"]:
                raise RuntimeError(f"Node {node_id} not found in file {file_key}")
            
            node_data = nodes_data["nodes"][node_id]
            
            # Extract essential component information only
            spec = {
                "name": node_data.get("name", "Unknown"),
                "type": node_data.get("type", "Unknown"),
                "id": node_data.get("id", node_id),
                "file_key": file_key,
                "figma_url": figma_url,
                "node_data": {
                    "name": node_data.get("name"),
                    "type": node_data.get("type"),
                    "id": node_data.get("id"),
                    "visible": node_data.get("visible"),
                    "locked": node_data.get("locked"),
                    "componentId": node_data.get("componentId"),
                    "absoluteBoundingBox": node_data.get("absoluteBoundingBox"),
                    "relativeBoundingBox": node_data.get("relativeBoundingBox"),
                    "fills": node_data.get("fills", []),
                    "strokes": node_data.get("strokes", []),
                    "effects": node_data.get("effects", []),
                    "textData": node_data.get("characters", {}),
                    "styles": node_data.get("styles", {}),
                    "constraints": node_data.get("constraints", {}),
                    "layoutAlign": node_data.get("layoutAlign"),
                    "layoutMode": node_data.get("layoutMode"),
                    "itemSpacing": node_data.get("itemSpacing"),
                    "padding": node_data.get("padding"),
                    "cornerRadius": node_data.get("cornerRadius"),
                    "strokeWeight": node_data.get("strokeWeight"),
                    "strokeAlign": node_data.get("strokeAlign"),
                    "strokeCap": node_data.get("strokeCap"),
                    "strokeJoin": node_data.get("strokeJoin")
                },
                "extracted_at": str(asyncio.get_event_loop().time())
            }
            
            print(f"✅ Got component spec: {spec['name']}")
            return spec
            
        except Exception as e:
            print(f"❌ Error getting component spec: {e}")
            raise
    
    async def get_variables(self, figma_url: str) -> str:
        """Get design variables for a Figma URL (legacy method)"""
        try:
            spec = await self.get_component_spec(figma_url)
            return json.dumps(spec, indent=2)
        except Exception as e:
            print(f"❌ Error getting variables: {e}")
            return "{}"
    
    async def get_design_context(self, figma_url: str) -> Dict[str, Any]:
        """Get complete design context for a Figma URL"""
        return await self.get_component_spec(figma_url)
    
    def close(self):
        """Close the client (no-op for API client)"""
        pass
