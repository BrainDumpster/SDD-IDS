#!/usr/bin/env python3
"""
Get all Figma variable collections and their variables
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))


async def get_all_collections():
    """Get all variable collections from Figma"""
    
    try:
        # Import MCP functions
        from mcp0_get_variable_defs import get_variable_defs
        
        file_key = "0bHk3XhrjFhowgFkz9yLr4"
        
        print("🔍 Getting all Figma variable collections...")
        print("📋 This simulates figma.variables.getLocalVariableCollections()")
        
        # Try different node IDs to get comprehensive variable data
        node_ids_to_try = [
            "1:106",  # Main Typography frame
            "8347:14143",  # Color frame
            "41864:6764",  # Variable group
            "41864:6765",  # Another variable group
            "41864:6766",  # Another variable group
            "41864:6767",  # Another variable group
            "41864:6768",  # Another variable group
            "41864:6769",  # Another variable group
            "41864:6770",  # Another variable group
            "41864:6771",  # Another variable group
            "41864:6772",  # Another variable group
            "41864:6773",  # Another variable group
            "41864:6774",  # Another variable group
            "41864:6775",  # Another variable group
            "41864:6776",  # Another variable group
            "41864:6777",  # Another variable group
            "41864:6778",  # Another variable group
            "41864:6779",  # Another variable group
            "41864:6780",  # Another variable group
            "41864:6781",  # Another variable group
            "41864:6782",  # Another variable group
            "41864:6783",  # Another variable group
            "41864:6784",  # Group 2
            "41864:6789",  # Group 3
        ]
        
        all_collections = {}
        total_variables = 0
        
        for node_id in node_ids_to_try:
            try:
                print(f"\n🔎 Checking node: {node_id}")
                variables = get_variable_defs(
                    clientFrameworks="unknown",
                    clientLanguages="unknown",
                    fileKey=file_key,
                    nodeId=node_id
                )
                
                if variables and len(variables) > 0:
                    # Create collection name based on node ID
                    collection_name = f"Collection_{node_id.replace(':', '-')}"
                    all_collections[collection_name] = {
                        "node_id": node_id,
                        "variables": variables,
                        "count": len(variables)
                    }
                    total_variables += len(variables)
                    print(f"✅ Found {len(variables)} variables")
                    
            except Exception as e:
                print(f"❌ Error with node {node_id}: {e}")
                continue
        
        # Consolidate and display results
        print(f"\n📊 CONSOLIDATED OUTPUT:")
        print(f"=" * 50)
        print(f"🎯 Total Collections Found: {len(all_collections)}")
        print(f"🔢 Total Variables Found: {total_variables}")
        print(f"=" * 50)
        
        # Group variables by type
        color_vars = {}
        typography_vars = {}
        other_vars = {}
        
        for collection_name, collection_data in all_collections.items():
            print(f"\n📦 {collection_name} ({collection_data['count']} variables):")
            
            for var_name, var_value in collection_data['variables'].items():
                # Categorize variables
                if 'color' in var_name.lower() or var_value.startswith('#'):
                    color_vars[var_name] = var_value
                    category = "🎨 COLOR"
                elif 'font' in var_value.lower() or 'Font(' in var_value:
                    typography_vars[var_name] = var_value
                    category = "📝 TYPOGRAPHY"
                else:
                    other_vars[var_name] = var_value
                    category = "🔧 OTHER"
                
                print(f"  {category}: {var_name} = {var_value[:100]}{'...' if len(str(var_value)) > 100 else ''}")
        
        # Summary by category
        print(f"\n📋 SUMMARY BY CATEGORY:")
        print(f"=" * 30)
        print(f"🎨 Color Variables: {len(color_vars)}")
        print(f"📝 Typography Variables: {len(typography_vars)}")
        print(f"🔧 Other Variables: {len(other_vars)}")
        
        # Show unique color values
        if color_vars:
            print(f"\n🎨 UNIQUE COLORS ({len(set(color_vars.values()))}):")
            for color in sorted(set(color_vars.values())):
                print(f"  {color}")
        
        # Show font families
        if typography_vars:
            font_families = set()
            for var_value in typography_vars.values():
                if 'Font(' in var_value:
                    import re
                    match = re.search(r'family: "([^"]+)"', var_value)
                    if match:
                        font_families.add(match.group(1))
            
            print(f"\n📝 FONT FAMILIES ({len(font_families)}):")
            for font in sorted(font_families):
                print(f"  {font}")
        
        return {
            "collections": all_collections,
            "total_collections": len(all_collections),
            "total_variables": total_variables,
            "categories": {
                "color": color_vars,
                "typography": typography_vars,
                "other": other_vars
            }
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


if __name__ == "__main__":
    asyncio.run(get_all_collections())
