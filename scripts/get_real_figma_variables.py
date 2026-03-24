#!/usr/bin/env python3
"""
Get real Figma variables using the MCP server
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))


async def get_real_variables():
    """Get actual variables from Figma using MCP"""
    
    try:
        # Import MCP functions
        from mcp0_get_metadata import get_metadata
        from mcp0_get_variable_defs import get_variable_defs
        
        file_key = "0bHk3XhrjFhowgFkz9yLr4"
        
        print("🔗 Connecting to Figma MCP...")
        
        # Get metadata to find variable collections
        print("📋 Getting file metadata...")
        metadata = get_metadata(
            clientFrameworks="unknown",
            clientLanguages="unknown",
            fileKey=file_key,
            nodeId="0:1"
        )
        
        print("✅ Metadata retrieved successfully")
        print(f"📊 Metadata keys: {list(metadata.keys()) if isinstance(metadata, dict) else 'Not a dict'}")
        
        # Try to get variable definitions
        print("\n🎯 Getting variable definitions...")
        try:
            variable_defs = get_variable_defs(
                clientFrameworks="unknown",
                clientLanguages="unknown",
                fileKey=file_key,
                nodeId="0:1"
            )
            
            print("✅ Variable definitions retrieved successfully")
            print(f"📊 Variables found: {len(variable_defs) if isinstance(variable_defs, dict) else 'Not a dict'}")
            
            if isinstance(variable_defs, dict):
                print("\n🎨 Variable Definitions:")
                for key, value in list(variable_defs.items())[:10]:  # Show first 10
                    print(f"   {key}: {value}")
                if len(variable_defs) > 10:
                    print(f"   ... and {len(variable_defs) - 10} more")
            
        except Exception as e:
            print(f"❌ Error getting variable definitions: {e}")
        
        return metadata
        
    except Exception as e:
        print(f"❌ Error connecting to Figma MCP: {e}")
        return None


if __name__ == "__main__":
    asyncio.run(get_real_variables())
