#!/usr/bin/env python3
"""
Get all Figma variable collections from the file
"""

import sys
import asyncio
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from tokens.figma_client import FigmaClient

async def get_collections():
    """Get all variable collections from Figma"""
    
    client = FigmaClient()
    
    # Get all variable data
    data = await client.get_variables()
    
    print("🔍 Figma Variable Data Structure:")
    print(f"Keys: {list(data.keys())}")
    
    if "result" in data:
        content = data["result"]["content"]
        print(f"Content keys: {list(content.keys())}")
        
        if "meta" in content:
            meta = content["meta"]
            print(f"Meta keys: {list(meta.keys())}")
            
            if "variableCollections" in meta:
                collections = meta["variableCollections"]
                print(f"\n📚 Found {len(collections)} variable collections:")
                
                for collection_id, collection_info in collections.items():
                    print(f"\n📦 Collection: {collection_info.get('name', 'Unknown')}")
                    print(f"   ID: {collection_id}")
                    print(f"   Description: {collection_info.get('description', 'No description')}")
                    
            if "variables" in meta:
                variables = meta["variables"]
                print(f"\n🎯 Found {len(variables)} variables:")
                
                # Group variables by collection
                by_collection = {}
                for var_id, var_info in variables.items():
                    collection_id = var_info.get("variableCollectionId", "unknown")
                    if collection_id not in by_collection:
                        by_collection[collection_id] = []
                    by_collection[collection_id].append(var_info)
                
                for collection_id, vars_in_collection in by_collection.items():
                    print(f"\n📋 Collection {collection_id} ({len(vars_in_collection)} variables):")
                    for var in vars_in_collection[:5]:  # Show first 5
                        print(f"   - {var.get('name', 'Unknown')}: {var.get('resolvedType', 'Unknown')}")
                    if len(vars_in_collection) > 5:
                        print(f"   ... and {len(vars_in_collection) - 5} more")
    
    return data

if __name__ == "__main__":
    asyncio.run(get_collections())
