#!/usr/bin/env python3
"""
Complete Figma MCP Test and Fix
"""

import asyncio
import json
import os
import sys
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

async def test_figma_mcp_connection():
    """Test Figma MCP connection with proper configuration"""
    print("🧪 TESTING FIGMA MCP CONNECTION")
    print("=" * 50)
    
    figma_token = os.getenv("FIGMA_TOKEN")
    figma_url = "https://mcp.figma.com/mcp"
    
    print(f"🔑 Token: {'✅ Set' if figma_token else '❌ Missing'}")
    print(f"🌐 URL: {figma_url}")
    
    if not figma_token:
        print("❌ No Figma token available")
        return False
    
    try:
        # Try different MCP import methods
        try:
            from mcp.client.stdio import StdioServerParameters
            from mcp import ClientSession, StdioServer
            print("✅ Using stdio MCP client")
            return await test_stdio_mcp(figma_token)
        except ImportError:
            print("⚠️ stdio client not available, trying http...")
            
        try:
            from mcp.client.streamable_http import streamable_http_client
            from mcp import ClientSession, AsyncExitStack
            print("✅ Using http MCP client")
            return await test_http_mcp(figma_token, figma_url)
        except ImportError as e:
            print(f"❌ MCP import failed: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Connection test failed: {e}")
        return False

async def test_stdio_mcp(figma_token):
    """Test stdio MCP connection"""
    try:
        from mcp.client.stdio import StdioServerParameters
        from mcp import ClientSession, StdioServer
        
        server_params = StdioServerParameters(
            command="npx",
            args=[
                "-y",
                "mcp-remote",
                "https://mcp.figma.com/mcp",
                "--static-oauth-client-metadata",
                '{"client_name":"Design Intelligence","client_uri":"http://100.65.144.93:8000"}'
            ],
            env={
                "FIGMA_TOKEN": figma_token,
                "NODE_EXTRA_CA_CERTS": "/etc/ssl/certs/ca-certificates.crt"
            }
        )
        
        async with StdioServer(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                print("✅ MCP session initialized")
                
                # Test tool call
                result = await session.call_tool(
                    "get_variable_defs",
                    arguments={"url": "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54535&m=dev"}
                )
                
                print("✅ Tool call successful")
                return True
                
    except Exception as e:
        print(f"❌ stdio MCP test failed: {e}")
        return False

async def test_http_mcp(figma_token, figma_url):
    """Test HTTP MCP connection"""
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
            
            # Test tool call
            result = await session.call_tool(
                "get_variable_defs",
                arguments={"url": "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54535&m=dev"}
            )
            
            print("✅ Tool call successful")
            return True
            
    except Exception as e:
        print(f"❌ HTTP MCP test failed: {e}")
        return False

def create_working_mcp_config():
    """Create working MCP configuration"""
    print("\n📝 CREATING WORKING MCP CONFIG")
    print("=" * 50)
    
    figma_token = os.getenv("FIGMA_TOKEN")
    
    config = {
        "mcpServers": {
            "figma-remote-mcp-server": {
                "command": "npx",
                "args": [
                    "-y",
                    "mcp-remote",
                    "https://mcp.figma.com/mcp",
                    "--static-oauth-client-metadata",
                    '{"client_name":"Design Intelligence","client_uri":"http://100.65.144.93:8000"}'
                ],
                "disabled": False,
                "env": {
                    "FIGMA_TOKEN": figma_token,
                    "NODE_EXTRA_CA_CERTS": "/etc/ssl/certs/ca-certificates.crt"
                }
            },
            "github-docker": {
                "command": "docker",
                "args": [
                    "run",
                    "-i",
                    "--rm",
                    "-v",
                    "/etc/ssl/certs:/etc/ssl/certs:ro",
                    "-e",
                    "GITHUB_PERSONAL_ACCESS_TOKEN",
                    "-e",
                    "GITHUB_HOST=https://eos2git.cec.lab.emc.com",
                    "-e",
                    "GITHUB_REPO=data-manager/ids-content",
                    "ghcr.io/github/github-mcp-server"
                ],
                "disabled": False,
                "env": {
                    "GITHUB_PERSONAL_ACCESS_TOKEN": os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN"),
                    "GITHUB_HOST": os.getenv("GITHUB_HOST"),
                    "GITHUB_REPO": os.getenv("GITHUB_REPO")
                }
            }
        }
    }
    
    # Save config
    with open("mcp_config_working.json", "w") as f:
        json.dump(config, f, indent=2)
    
    print("✅ Working config saved to mcp_config_working.json")
    return True

async def main():
    """Main function"""
    print("🔧 COMPLETE FIGMA MCP FIX")
    print("=" * 50)
    
    # Test connection
    connection_ok = await test_figma_mcp_connection()
    
    # Create working config
    create_working_mcp_config()
    
    print("\n📊 RESULTS")
    print("=" * 50)
    print(f"MCP Connection: {'✅ Success' if connection_ok else '❌ Failed'}")
    
    if connection_ok:
        print("\n🎉 Figma MCP is working!")
        print("Run: python scripts/enhanced_figma_specs_pipeline.py")
    else:
        print("\n⚠️ MCP connection failed")
        print("Try:")
        print("1. Use mcp_config_working.json")
        print("2. Check Figma token permissions")
        print("3. Verify internet connectivity")

if __name__ == "__main__":
    asyncio.run(main())
