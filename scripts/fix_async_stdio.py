#!/usr/bin/env python3
"""
Fix Async Stdio Client Implementation
"""

import os
from pathlib import Path

def fix_figma_client_async():
    """Fix figma_client.py with proper async context manager"""
    print("🔧 FIXING ASYNC STDIO CLIENT")
    print("=" * 40)
    
    file_path = Path("tokens/figma_client.py")
    
    new_content = '''import asyncio
import os
from mcp.client.stdio import stdio_client
from mcp import ClientSession


class FigmaMCPClient:
    """Client for interacting with Figma MCP server using stdio"""
    
    def __init__(self):
        self.session = None
        self.figma_token = os.getenv("FIGMA_TOKEN")
        self._stdio_context = None
    
    async def connect(self):
        """Connect to Figma MCP server via stdio"""
        if not self.figma_token:
            raise RuntimeError("FIGMA_TOKEN not set in environment")
        
        # Use stdio_client with proper async context manager
        server_params = {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote",
                "https://mcp.figma.com/mcp",
                "--static-oauth-client-metadata",
                '{"client_name":"Design Intelligence","client_uri":"http://100.65.144.93:8000"}'
            ],
            "env": {
                "FIGMA_TOKEN": self.figma_token,
                "NODE_EXTRA_CA_CERTS": "/etc/ssl/certs/ca-certificates.crt"
            }
        }
        
        # Store the context manager
        self._stdio_context = stdio_client(server_params)
        
        # Enter the context manager
        self.read, self.write = await self._stdio_context.__aenter__()
        
        # Create session
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
        
        if self._stdio_context:
            await self._stdio_context.__aexit__(None, None, None)
'''
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    
    print("✅ figma_client.py fixed with proper async context manager")

def main():
    """Main function"""
    fix_figma_client_async()
    
    print("\n🎉 ASYNC STDIO CLIENT FIXED!")
    print("=" * 40)
    print("Now test with:")
    print("   python scripts/enhanced_figma_specs_pipeline.py")

if __name__ == "__main__":
    main()
