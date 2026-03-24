#!/usr/bin/env python3
"""
Test Figma MCP Connection
"""

import asyncio
import os
import sys
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

async def test_figma_mcp():
    """Test Figma MCP connection"""
    print("🧪 TESTING FIGMA MCP CONNECTION")
    print("=" * 50)
    
    # Check environment
    figma_token = os.getenv("FIGMA_TOKEN")
    figma_url = os.getenv("FIGMA_MCP_URL")
    
    print(f"🔑 Figma Token: {'✅ Set' if figma_token else '❌ Missing'}")
    print(f"🌐 Figma URL: {figma_url}")
    
    if not figma_token:
        print("❌ FIGMA_TOKEN not set in environment")
        return False
    
    try:
        from mcp.client.streamable_http import streamable_http_client
        from mcp import ClientSession, AsyncExitStack
        
        async with AsyncExitStack() as exit_stack:
            read, write, get_session_id = await exit_stack.enter_async_context(
                streamable_http_client(figma_url)
            )
            
            session = await exit_stack.enter_async_context(ClientSession(read, write))
            await session.initialize()
            
            print("✅ MCP session initialized")
            
            # Test basic functionality
            try:
                result = await session.call_tool(
                    "get_variable_defs", 
                    arguments={"url": "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54535&m=dev"}
                )
                print("✅ Figma MCP tool call successful")
                print(f"   Response type: {type(result)}")
                if result.content:
                    print(f"   Response: {result.content[0].text[:200]}...")
                else:
                    print("   No content returned")
                return True
            except Exception as e:
                print(f"❌ Figma MCP tool call failed: {e}")
                return False
            finally:
                await exit_stack.aclose()
        
    except ImportError as e:
        print(f"❌ MCP import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False


async def test_simple_figma_call():
    """Test simple HTTP call to Figma API"""
    print("\n🌐 TESTING DIRECT FIGMA API")
    print("=" * 50)
    
    figma_token = os.getenv("FIGMA_TOKEN")
    if not figma_token:
        print("❌ No Figma token available")
        return False
    
    try:
        import httpx
        
        headers = {
            "X-Figma-Token": figma_token,
            "Content-Type": "application/json"
        }
        
        # Test getting file info
        url = "https://api.figma.com/v1/files/11067-54535"
        response = httpx.get(url, headers=headers)
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Direct Figma API call successful")
            data = response.json()
            print(f"   File name: {data.get('name', 'Unknown')}")
            return True
        else:
            print(f"❌ API call failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Direct API test failed: {e}")
        return False


async def main():
    """Main test function"""
    print("🧪 FIGMA CONNECTION TEST")
    print("=" * 50)
    
    # Test MCP connection
    mcp_success = await test_figma_mcp()
    
    # Test direct API
    api_success = await test_simple_figma_call()
    
    print("\n📊 RESULTS SUMMARY")
    print("=" * 50)
    print(f"MCP Connection: {'✅ Success' if mcp_success else '❌ Failed'}")
    print(f"Direct API: {'✅ Success' if api_success else '❌ Failed'}")
    
    if mcp_success:
        print("\n🎉 Figma integration ready!")
        print("Run: python scripts/enhanced_figma_specs_pipeline.py")
    elif api_success:
        print("\n⚠️ Direct API works but MCP has issues")
        print("Check MCP server configuration")
    else:
        print("\n❌ Both MCP and API failed")
        print("Check Figma token and permissions")
    
    print("\n📋 TROUBLESHOOTING:")
    print("1. Ensure token has 'file:read' permissions")
    print("2. Check token format (should start with 'figd_')")
    print("3. Verify Figma file access")


if __name__ == "__main__":
    asyncio.run(main())
