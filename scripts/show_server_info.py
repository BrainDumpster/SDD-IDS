#!/usr/bin/env python3
"""
Script to display MCP server connection information
"""

import socket
import subprocess
import json
import sys
import os


def get_local_ip():
    """Get the local IP address"""
    try:
        # Connect to an external server to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "localhost"


def get_machine_info():
    """Get machine information"""
    try:
        hostname = socket.gethostname()
        return hostname
    except:
        return "unknown"


def show_server_info():
    """Display server connection information"""
    
    print("🚀 RAG Component Generator MCP Server Information")
    print("=" * 60)
    
    # Get network information
    local_ip = get_local_ip()
    hostname = get_machine_info()
    
    print(f"🌐 Server IP Address: {local_ip}")
    print(f"🖥️  Hostname: {hostname}")
    print(f"🔧 MCP Server Name: simple-rag-component-generator")
    print(f"📡 Transport Protocol: stdio (stdin/stdout)")
    print(f"🔌 Port: N/A (stdio transport - no network port)")
    print()
    
    print("📋 Connection Details:")
    print("-" * 30)
    print(f"• Server Type: MCP (Model Context Protocol)")
    print(f"• Transport: stdio (standard input/output)")
    print(f"• Process: python3 mcp_tools/simple_rag_generator.py")
    print(f"• Working Directory: {os.getcwd()}")
    print()
    
    print("🔧 Available Tools:")
    print("-" * 30)
    tools = [
        "generate_component_from_query - Generate components from natural language",
        "get_server_info - Get server connection details", 
        "test_rag_system - Test RAG system connectivity"
    ]
    
    for tool in tools:
        print(f"• {tool}")
    print()
    
    print("🎯 How to Connect:")
    print("-" * 30)
    print("This MCP server uses stdio transport, which means:")
    print("1. No network port is used (communication via stdin/stdout)")
    print("2. Client must spawn the server process")
    print("3. Communication happens via JSON-RPC messages")
    print()
    
    print("📝 MCP Client Setup:")
    print("-" * 30)
    print("""
# Example MCP client configuration
{
  "mcpServers": {
    "rag-component-generator": {
      "command": "python3",
      "args": ["/home/muthu/projects/AI/CascadeProjects/windsurf-project/mcp_tools/simple_rag_generator.py"],
      "cwd": "/home/muthu/projects/AI/CascadeProjects/windsurf-project"
    }
  }
}
""")
    
    print("🔍 Example Tool Calls:")
    print("-" * 30)
    examples = [
        {
            "tool": "generate_component_from_query",
            "params": {
                "query": "Create a primary button with hover effects",
                "framework": "React",
                "style_mode": "css-module"
            }
        },
        {
            "tool": "get_server_info",
            "params": {}
        }
    ]
    
    for i, example in enumerate(examples, 1):
        print(f"{i}. Tool: {example['tool']}")
        print(f"   Parameters: {json.dumps(example['params'], indent=6)}")
        print()
    
    print("🎉 Server Status Information:")
    print("-" * 30)
    status_info = {
        "server_name": "RAG Component Generator",
        "local_ip": local_ip,
        "hostname": hostname,
        "transport": "stdio",
        "port": "N/A (stdio transport)",
        "status": "Ready to start",
        "command_to_start": f"cd {os.getcwd()} && python3 mcp_tools/simple_rag_generator.py",
        "connection_type": "Process-based (no network port)"
    }
    
    print(json.dumps(status_info, indent=2))
    print()
    
    print("🚀 To Start the Server:")
    print("-" * 30)
    print(f"Command: python3 mcp_tools/simple_rag_generator.py")
    print(f"Directory: {os.getcwd()}")
    print()
    print("The server will start and wait for MCP client connections via stdio.")
    print("No network port will be bound - this is a process-based MCP server.")


def start_server_with_info():
    """Start the server and show connection info"""
    
    print("🚀 Starting RAG Component Generator MCP Server...")
    print("=" * 60)
    
    # Show connection info first
    show_server_info()
    
    print("\n" + "=" * 60)
    print("🔧 Starting MCP Server Process...")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    # Start the server
    try:
        server_script = os.path.join(os.getcwd(), "mcp_tools", "simple_rag_generator.py")
        subprocess.run([sys.executable, server_script], cwd=os.getcwd())
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--start":
        start_server_with_info()
    else:
        show_server_info()
