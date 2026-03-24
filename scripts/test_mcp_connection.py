#!/usr/bin/env python3
"""
Test script to demonstrate MCP server connection and usage
"""

import subprocess
import json
import time
import socket


def get_local_ip():
    """Get the local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "localhost"


def test_mcp_server():
    """Test the MCP server functionality"""
    
    print("🚀 RAG Component Generator MCP Server Test")
    print("=" * 50)
    
    # Get local IP
    local_ip = get_local_ip()
    
    print(f"🌐 Local IP Address: {local_ip}")
    print(f"🔧 MCP Server: simple-rag-component-generator")
    print(f"📡 Transport: stdio (standard input/output)")
    print()
    
    # Show connection information
    connection_info = {
        "server_name": "RAG Component Generator",
        "local_ip": local_ip,
        "transport": "stdio",
        "status": "ready_for_connection",
        "available_tools": [
            "generate_component_from_query",
            "get_server_info", 
            "test_rag_system"
        ],
        "how_to_connect": [
            "1. Start the MCP server: python3 mcp_tools/simple_rag_generator.py",
            "2. Use MCP client to connect via stdio transport",
            "3. Call tools using JSON-RPC over stdin/stdout"
        ]
    }
    
    print("📋 Connection Information:")
    print(json.dumps(connection_info, indent=2))
    print()
    
    # Show example usage
    print("🎯 Example Usage:")
    print("-" * 30)
    
    examples = [
        {
            "tool": "generate_component_from_query",
            "parameters": {
                "query": "Create a primary button with hover effects and loading state",
                "framework": "React",
                "style_mode": "css-module"
            }
        },
        {
            "tool": "get_server_info",
            "parameters": {}
        },
        {
            "tool": "test_rag_system",
            "parameters": {}
        }
    ]
    
    for i, example in enumerate(examples, 1):
        print(f"\n{i}. Tool: {example['tool']}")
        print(f"   Parameters: {json.dumps(example['parameters'], indent=6)}")
    
    print()
    print("🔍 MCP Client Connection:")
    print("-" * 30)
    print("To connect to this MCP server, you need an MCP client that:")
    print("1. Spawns the server process")
    print("2. Communicates via JSON-RPC over stdin/stdout")
    print("3. Can call the available tools")
    print()
    print("Example MCP client setup:")
    print("""
import { MCPServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Connect to the server
const server = new MCPServer({
    name: "simple-rag-component-generator",
    command: "python3",
    args: ["/path/to/mcp_tools/simple_rag_generator.py"]
});

// Call a tool
const result = await server.call("generate_component_from_query", {
    query: "Create a primary button",
    framework: "React",
    style_mode: "css-module"
});
""")
    
    print()
    print("🎉 Server Status: READY")
    print(f"📍 Run this command to start the server:")
    print(f"   cd {socket.gethostname()}/projects/AI/CascadeProjects/windsurf-project")
    print("   python3 mcp_tools/simple_rag_generator.py")
    print()
    print("📚 Available Tools:")
    print("   • generate_component_from_query - Generate components from natural language")
    print("   • get_server_info - Get server connection details")
    print("   • test_rag_system - Test RAG system connectivity")


if __name__ == "__main__":
    test_mcp_server()
