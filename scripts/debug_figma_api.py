#!/usr/bin/env python3
"""
Debug Figma API
Debugs the Figma API response to understand what data we're getting
"""

import asyncio
import json
import logging
import os
import sys
import time
from pathlib import Path
from datetime import datetime

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


async def debug_figma_api():
    """Debug Figma API response"""
    print("🔍 DEBUGGING FIGMA API")
    print("=" * 50)
    
    # Test with Accordion component
    figma_url = "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54535&m=dev"
    
    print(f"🎯 DEBUGGING URL: {figma_url}")
    print("-" * 40)
    
    # Import and initialize Figma API client
    try:
        from tokens.figma_client import FigmaAPIClient
        print("✅ Figma API client imported")
        
        client = FigmaAPIClient()
        print("✅ Figma API client initialized")
        
    except Exception as e:
        print(f"❌ Failed to initialize Figma API client: {e}")
        return
    
    try:
        print("\n🔄 Testing direct API call...")
        start_time = time.time()
        
        # Extract file key and node ID
        file_key, node_id = client._extract_file_key_and_node_id(figma_url)
        print(f"📋 Extracted - File key: {file_key}")
        print(f"📋 Extracted - Node ID: {node_id}")
        
        # Test direct API call for nodes
        print(f"\n🔍 Testing get_file_nodes API call...")
        nodes_data = await client.get_file_nodes(file_key, [node_id])
        
        print(f"📊 Nodes API response:")
        print(f"   Status: {'Success' if 'nodes' in nodes_data else 'Failed'}")
        print(f"   Keys: {list(nodes_data.keys())}")
        
        if 'nodes' in nodes_data:
            print(f"   Node keys: {list(nodes_data['nodes'].keys())}")
            if node_id in nodes_data['nodes']:
                node_data = nodes_data['nodes'][node_id]
                print(f"   Node found: {node_data.get('name', 'Unknown')}")
                print(f"   Node type: {node_data.get('type', 'Unknown')}")
                print(f"   Node data keys: {list(node_data.keys())}")
            else:
                print(f"   Node NOT found: {node_id}")
        
        # Test direct API call for file info
        print(f"\n🔍 Testing get_file API call...")
        file_data = await client.get_file(file_key)
        
        print(f"📊 File API response:")
        print(f"   Status: {'Success' if 'document' in file_data else 'Failed'}")
        print(f"   Keys: {list(file_data.keys())}")
        
        if 'document' in file_data:
            print(f"   Document name: {file_data.get('name', 'Unknown')}")
            print(f"   File data keys: {list(file_data.keys())}")
            
            # Look for components in the file
            if 'components' in file_data:
                components = file_data['components']
                print(f"   Components found: {len(components)}")
                if components:
                    print(f"   Component keys: {list(components.keys())}")
        
        total_time = time.time() - start_time
        print(f"\n🎉 DEBUG COMPLETED!")
        print(f"   Total time: {total_time:.1f}s")
        print("=" * 50)
            
    except Exception as e:
        print(f"❌ Error during debug: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        try:
            client.close()
            print("🔌 Figma API client closed")
        except:
            pass


async def main():
    """Main function"""
    print("🔍 FIGMA API DEBUG")
    print("=" * 50)
    print("Debugging Figma API response to understand data structure")
    print("")
    
    await debug_figma_api()


if __name__ == "__main__":
    asyncio.run(main())
