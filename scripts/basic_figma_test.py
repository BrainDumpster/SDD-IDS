#!/usr/bin/env python3
"""
Basic Figma API Test
Tests basic Figma API calls with minimal output
"""

import asyncio
import json
import os
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()


async def basic_figma_test():
    """Basic test of Figma API"""
    print("🧪 BASIC FIGMA API TEST")
    print("=" * 30)
    
    figma_token = os.getenv("FIGMA_TOKEN")
    
    if not figma_token:
        print("❌ FIGMA_TOKEN not set")
        return
    
    print(f"🔑 Token: {figma_token[:10]}...")
    
    # Test file info
    file_key = "VZJ48bbVYrIynw8DdSukWw"
    url = f"https://api.figma.com/v1/files/{file_key}"
    
    headers = {
        "X-Figma-Token": figma_token,
        "Content-Type": "application/json"
    }
    
    print(f"\n📡 Testing file API...")
    
    try:
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                print(f"   Status: {response.status}")
                
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✅ Success! Got {len(str(data))} chars")
                    print(f"   File name: {data.get('name', 'Unknown')}")
                    
                    if 'document' in data:
                        doc = data['document']
                        print(f"   Document type: {doc.get('type', 'Unknown')}")
                        print(f"   Has children: {'children' in doc and len(doc['children']) > 0}")
                        
                        if 'children' in doc and doc['children']:
                            print(f"   Children count: {len(doc['children'])}")
                            
                            # Look for Accordion component
                            for i, child in enumerate(doc['children'][:5]):
                                name = child.get('name', 'Unknown')
                                comp_type = child.get('type', 'Unknown')
                                print(f"   Child {i+1}: {name} ({comp_type})")
                                
                                if 'Accordion' in name:
                                    print(f"   🎯 FOUND ACCORDION: {name}")
                                    print(f"   ID: {child.get('id', 'Unknown')}")
                                    print(f"   Type: {comp_type}")
                                    
                                    # Show some properties
                                    if 'absoluteBoundingBox' in child:
                                        bbox = child['absoluteBoundingBox']
                                        print(f"   Size: {bbox.get('width', 0)}x{bbox.get('height', 0)}")
                                    
                                    break
                    
                else:
                    error_text = await response.text()
                    print(f"   ❌ Error: {error_text}")
    
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    print(f"\n🎉 TEST COMPLETED!")
    print("=" * 30)


async def main():
    """Main function"""
    await basic_figma_test()


if __name__ == "__main__":
    asyncio.run(main())
