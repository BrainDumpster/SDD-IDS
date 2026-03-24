#!/usr/bin/env python3
"""
Complete MCP Fix - Update all references to use stdio client
"""

import os
import re
from pathlib import Path

def fix_figma_client_complete():
    """Complete fix for figma_client.py"""
    print("🔧 COMPLETE FIX: figma_client.py")
    print("-" * 40)
    
    file_path = Path("tokens/figma_client.py")
    
    with open(file_path) as f:
        content = f.read()
    
    # Complete rewrite for stdio client
    new_content = '''import asyncio
import os
from mcp.client.stdio import StdioServerParameters
from mcp import ClientSession, StdioServer


class FigmaMCPClient:
    """Client for interacting with Figma MCP server using stdio"""
    
    def __init__(self):
        self.session = None
        self.figma_token = os.getenv("FIGMA_TOKEN")
    
    async def connect(self):
        """Connect to Figma MCP server via stdio"""
        if not self.figma_token:
            raise RuntimeError("FIGMA_TOKEN not set in environment")
        
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
                "FIGMA_TOKEN": self.figma_token,
                "NODE_EXTRA_CA_CERTS": "/etc/ssl/certs/ca-certificates.crt"
            }
        )
        
        self.read, self.write = await StdioServer(server_params).__aenter__()
        self.session = ClientSession(self.read, self.write)
        await self.session.initialize()
    
    async def get_variables(self, figma_url: str):
        """Retrieves design context/variables using the MCP server."""
        if not self.session:
            await self.connect()
        
        result = await self.session.call_tool(
            "get_variable_defs", 
            arguments={"url": figma_url}
        )
        
        return result.content[0].text if result.content else "{}"
    
    async def close(self):
        """Close the connection"""
        if self.session:
            await self.session.close()
'''
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    
    print("✅ figma_client.py completely rewritten")

def fix_figma_spec_extractor_complete():
    """Complete fix for figma_spec_extractor.py"""
    print("\n🔧 COMPLETE FIX: figma_spec_extractor.py")
    print("-" * 40)
    
    file_path = Path("tokens/figma_spec_extractor.py")
    
    with open(file_path) as f:
        content = f.read()
    
    # Remove any remaining streamable_http_client imports
    content = re.sub(
        r'from mcp\.client\.streamable_http import.*?\n',
        '',
        content,
        flags=re.MULTILINE
    )
    
    # Add stdio import at the top
    if 'from mcp.client.stdio import StdioServerParameters' not in content:
        content = content.replace(
            'from tokens.figma_client import FigmaMCPClient',
            'from mcp.client.stdio import StdioServerParameters\nfrom tokens.figma_client import FigmaMCPClient'
        )
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print("✅ figma_spec_extractor.py imports fixed")

def test_figma_connection_simple():
    """Simple test of Figma connection"""
    print("\n🧪 TESTING FIGMA CONNECTION")
    print("-" * 40)
    
    try:
        from tokens.figma_client import FigmaMCPClient
        
        async def test():
            client = FigmaMCPClient()
            try:
                await client.connect()
                print("✅ Figma MCP connection successful")
                await client.close()
                return True
            except Exception as e:
                print(f"❌ Connection failed: {e}")
                return False
        
        import asyncio
        return asyncio.run(test())
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def main():
    """Main function"""
    print("🔧 COMPLETE MCP FIX")
    print("=" * 50)
    print("Updating all MCP references to use stdio client")
    print("")
    
    # Fix figma_client.py
    fix_figma_client_complete()
    
    # Fix figma_spec_extractor.py
    fix_figma_spec_extractor_complete()
    
    # Test connection
    if test_figma_connection_simple():
        print("\n🎉 MCP FIX COMPLETE!")
        print("=" * 50)
        print("Now run:")
        print("   python scripts/enhanced_figma_specs_pipeline.py")
    else:
        print("\n⚠️ Connection test failed")
        print("Check Figma token and MCP setup")

if __name__ == "__main__":
    main()
