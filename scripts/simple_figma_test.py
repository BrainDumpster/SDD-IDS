#!/usr/bin/env python3
"""
Simple Figma API Test
Tests basic Figma API calls to understand the data structure
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


async def simple_figma_test():
    """Simple test of Figma API"""
    print("🧪 SIMPLE FIGMA API TEST")
    print("=" * 50)
    
    # Test with direct HTTP requests to Figma API
    figma_token = os.getenv("FIGMA_TOKEN")
    
    if not figma_token:
        print("❌ FIGMA_TOKEN not set")
        return
    
    print(f"🔑 Figma Token: {figma_token[:10]}...")
    
    # Test file info
    file_key = "VZJ48bbVYrIynw8DdSukWw"
    url = f"https://api.figma.com/v1/files/{file_key}"
    
    headers = {
        "X-Figma-Token": figma_token,
        "Content-Type": "application/json"
    }
    
    print(f"\n📡 Testing file info API...")
    print(f"   URL: {url}")
    print(f"   Headers: X-Figma-Token: {figma_token[:10]}...")
    
    try:
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                print(f"   Status: {response.status}")
                
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✅ Success! Got {len(str(data))} chars")
                    print(f"   Keys: {list(data.keys())}")
                    
                    # Show basic info
                    print(f"\n📋 FILE INFO:")
                    print(f"   Name: {data.get('name', 'Unknown')}")
                    print(f"   Last modified: {data.get('lastModified', 'Unknown')}")
                    
                    # Look for document structure
                    if 'document' in data:
                        doc = data['document']
                        print(f"   Document type: {type(doc)}")
                        print(f"   Document keys: {list(doc.keys()) if isinstance(doc, dict) else 'Not a dict'}")
                        
                        # Look for children
                        if hasattr(doc, 'children') and doc['children']:
                            print(f"   Children: {len(doc['children'])}")
                            
                            # Look for first few children
                            for i, child in enumerate(doc['children'][:3]):
                                print(f"   Child {i+1}: {child.get('name', 'Unknown')} ({child.get('type', 'Unknown')})")
                    
                else:
                    print("   ❌ No document data")
                
            error_text = await response.text()
            print(f"   ❌ Error: {error_text}")
    
    except Exception as e:
        print(f"❌ Request failed: {e}")
        import traceback
        traceback.print_exc()
    
    print(f"\n🎉 SIMPLE TEST COMPLETED!")
    print("=" * 50)


async def main():
    """Main function"""
    print("🧪 SIMPLE FIGMA API TEST")
    print("=" * 50)
    print("Testing basic Figma API calls")
    print("")
    
    await simple_figma_test()


if __name__ == "__main__":
    asyncio.run(main())
