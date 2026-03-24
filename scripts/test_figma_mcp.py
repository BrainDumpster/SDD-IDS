#!/usr/bin/env python3
"""
Test Figma MCP server connection
"""

import subprocess
import json
import asyncio
import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

async def test_figma_mcp():
    """Test Figma MCP server connection"""
    
    # Use full paths for Node.js commands
    mcp_remote_path = "/home/muthu/.nvm/versions/node/v22.17.1/bin/mcp-remote"
    
    cmd = [
        mcp_remote_path,
        "https://mcp.figma.com/mcp",
        "--static-oauth-client-metadata",
        '{"client_name":"Windsurf","client_uri":"https://windsurf.ai"}'
    ]
    
    process = None
    try:
        print("🚀 Starting Figma MCP server...")
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env={"NODE_EXTRA_CA_CERTS": "/etc/ssl/certs/ca-certificates.crt"}
        )
        
        # Wait a bit for startup
        await asyncio.sleep(2)
        
        # Check if process is still running
        if process.returncode is not None:
            print(f"❌ Process exited with code: {process.returncode}")
            stderr_output = await process.stderr.read()
            if stderr_output:
                print(f"Stderr: {stderr_output.decode()}")
            return
        
        # Initialize request
        init_request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "clientInfo": {"name": "test-client", "version": "1.0.0"}
            }
        }
        
        print("📡 Sending initialization request...")
        init_data = json.dumps(init_request) + "\n"
        process.stdin.write(init_data.encode())
        await process.stdin.drain()
        
        # Read response with timeout
        try:
            response_line = await asyncio.wait_for(process.stdout.readline(), timeout=15)
            if response_line:
                response = json.loads(response_line.decode().strip())
                print("✅ MCP Server connected!")
                print(f"Response: {response}")
                
                # Get tools list
                tools_request = {
                    "jsonrpc": "2.0",
                    "id": 2,
                    "method": "tools/list",
                    "params": {}
                }
                
                print("🔧 Getting available tools...")
                tools_data = json.dumps(tools_request) + "\n"
                process.stdin.write(tools_data.encode())
                await process.stdin.drain()
                
                tools_response_line = await asyncio.wait_for(process.stdout.readline(), timeout=10)
                if tools_response_line:
                    tools_response = json.loads(tools_response_line.decode().strip())
                    if 'result' in tools_response:
                        tools = tools_response['result'].get('tools', [])
                        print(f"📋 Found {len(tools)} tools:")
                        for tool in tools[:5]:  # Show first 5
                            print(f"  - {tool.get('name', 'Unknown')}: {tool.get('description', 'No description')[:50]}...")
                    else:
                        print(f"❌ Tools list failed: {tools_response}")
                
            else:
                print("❌ No response from MCP server")
                
        except asyncio.TimeoutError:
            print("❌ Timeout waiting for MCP response")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        
        # Check stderr for more info
        if process:
            try:
                stderr_output = await process.stderr.read()
                if stderr_output:
                    print(f"Stderr: {stderr_output.decode()}")
            except:
                pass
                
    finally:
        if process:
            try:
                process.terminate()
                await asyncio.wait_for(process.wait(), timeout=5)
            except:
                try:
                    process.kill()
                    await asyncio.wait_for(process.wait(), timeout=2)
                except:
                    pass

if __name__ == "__main__":
    asyncio.run(test_figma_mcp())
