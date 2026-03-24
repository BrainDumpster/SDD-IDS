#!/usr/bin/env python3
"""
Figma MCP Service
Runs the Figma MCP server as a service that can be called by pipelines
"""

import asyncio
import json
import logging
import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)


class FigmaMCPService:
    """
    Service that runs Figma MCP server and provides API for pipelines
    """
    
    def __init__(self):
        print("🚀 INITIALIZING FIGMA MCP SERVICE")
        print("=" * 50)
        
        self.session = None
        self._stdio_context = None
        self.figma_token = os.getenv("FIGMA_TOKEN")
        
        if not self.figma_token:
            raise RuntimeError("FIGMA_TOKEN not set in environment")
        
        print(f"🔑 Figma Token: ✅ Set ({self.figma_token[:10]}...)")
        print("=" * 50)
    
    async def start_service(self):
        """Start the Figma MCP service"""
        print("🚀 STARTING FIGMA MCP SERVICE")
        print("=" * 50)
        
        try:
            await self.connect()
            print("✅ Figma MCP Service started successfully!")
            print("📡 Ready to process Figma URL requests")
            print("=" * 50)
            return True
        except Exception as e:
            print(f"❌ Failed to start service: {e}")
            return False
    
    async def connect(self):
        """Connect to Figma MCP server"""
        from mcp.client.stdio import stdio_client, StdioServerParameters
        from mcp import ClientSession
        
        # Use full path to npx
        npx_path = "/usr/bin/npx"
        
        # Use proper StdioServerParameters object
        server_params = StdioServerParameters(
            command=npx_path,
            args=[
                "-y",
                "mcp-remote",
                "https://mcp.figma.com/mcp",
                "--static-oauth-client-metadata",
                '{"client_name":"Figma Service","client_uri":"http://100.65.144.93:8000"}'
            ],
            env={
                "FIGMA_TOKEN": self.figma_token,
                "NODE_EXTRA_CA_CERTS": "/etc/ssl/certs/ca-certificates.crt"
            }
        )
        
        # Store the context manager
        self._stdio_context = stdio_client(server_params)
        
        # Enter the context manager
        self.read, self.write = await self._stdio_context.__aenter__()
        
        # Create session
        self.session = ClientSession(self.read, self.write)
        await self.session.initialize()
        
        print("✅ Connected to Figma MCP server")
    
    async def get_design_context(self, figma_url: str) -> Optional[Dict[str, Any]]:
        """Get design context for a Figma URL"""
        if not self.session:
            raise RuntimeError("Service not connected - call start_service() first")
        
        try:
            print(f"🔍 Getting design context for: {figma_url[:50]}...")
            
            result = await self.session.call_tool(
                "get_design_context",
                arguments={"url": figma_url}
            )
            
            if result.content and result.content[0].text:
                data = json.loads(result.content[0].text)
                print(f"✅ Got {len(data)} chars of Figma data")
                return data
            else:
                print("❌ No data returned from Figma MCP server")
                return None
                
        except Exception as e:
            print(f"❌ Error getting design context: {e}")
            return None
    
    async def get_variables(self, figma_url: str) -> Optional[Dict[str, Any]]:
        """Get variables for a Figma URL"""
        if not self.session:
            raise RuntimeError("Service not connected - call start_service() first")
        
        try:
            print(f"🔍 Getting variables for: {figma_url[:50]}...")
            
            result = await self.session.call_tool(
                "get_variable_defs",
                arguments={"url": figma_url}
            )
            
            if result.content and result.content[0].text:
                data = json.loads(result.content[0].text)
                print(f"✅ Got {len(data)} chars of variables data")
                return data
            else:
                print("❌ No variables data returned")
                return None
                
        except Exception as e:
            print(f"❌ Error getting variables: {e}")
            return None
    
    async def close(self):
        """Close the service connection"""
        if self.session:
            await self.session.close()
        
        if self._stdio_context:
            await self._stdio_context.__aexit__(None, None, None)
        
        print("🔌 Figma MCP Service closed")


# Global service instance
_service_instance: Optional[FigmaMCPService] = None


async def get_service() -> FigmaMCPService:
    """Get or create the global service instance"""
    global _service_instance
    
    if _service_instance is None:
        _service_instance = FigmaMCPService()
        await _service_instance.start_service()
    
    return _service_instance


async def close_service():
    """Close the global service"""
    global _service_instance
    
    if _service_instance:
        await _service_instance.close()
        _service_instance = None


# Service API functions
async def get_figma_design_context(figma_url: str) -> Optional[Dict[str, Any]]:
    """API function to get design context"""
    service = await get_service()
    return await service.get_design_context(figma_url)


async def get_figma_variables(figma_url: str) -> Optional[Dict[str, Any]]:
    """API function to get variables"""
    service = await get_service()
    return await service.get_variables(figma_url)


if __name__ == "__main__":
    async def main():
        """Run the service"""
        print("🚀 FIGMA MCP SERVICE")
        print("=" * 50)
        print("Starting Figma MCP service...")
        print("Press Ctrl+C to stop")
        print("")
        
        service = FigmaMCPService()
        
        try:
            await service.start_service()
            
            # Keep the service running
            print("📡 Service is running. Press Ctrl+C to stop...")
            while True:
                await asyncio.sleep(1)
                
        except KeyboardInterrupt:
            print("\n🔌 Shutting down service...")
            await service.close()
            print("✅ Service stopped")
    
    asyncio.run(main())
