#!/usr/bin/env python3
"""
Script to start the RAG Component Generator in Streamable mode
"""

import subprocess
import sys
import os
import time
import socket
import requests
from pathlib import Path


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


def check_dependencies():
    """Check if required dependencies are available"""
    print("🔍 Checking dependencies...")
    
    # Check Python modules
    try:
        import mcp
        print("✅ MCP module available")
    except ImportError:
        print("❌ MCP module not found. Install with: pip install mcp")
        return False
    
    # Check Ollama
    try:
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Ollama available")
        else:
            print("❌ Ollama not running. Start with: ollama serve")
            return False
    except FileNotFoundError:
        print("❌ Ollama not installed. Install from: https://ollama.ai")
        return False
    
    # Check required models
    try:
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
        if "llama3" in result.stdout and "embeddinggemma" in result.stdout:
            print("✅ Required models available")
        else:
            print("⚠️  Required models missing. Pull with:")
            print("   ollama pull llama3")
            print("   ollama pull embeddinggemma")
    except:
        print("❌ Could not check Ollama models")
        return False
    
    return True


def start_ollama():
    """Start Ollama server if not running"""
    print("🚀 Starting Ollama server...")
    try:
        # Check if Ollama is already running
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Ollama already running")
            return True
        
        # Start Ollama in background
        subprocess.Popen(["ollama", "serve"], 
                         stdout=subprocess.DEVNULL, 
                         stderr=subprocess.DEVNULL)
        
        # Wait for Ollama to start
        print("⏳ Waiting for Ollama to start...")
        for i in range(30):  # Wait up to 30 seconds
            try:
                result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
                if result.returncode == 0:
                    print("✅ Ollama started successfully")
                    return True
            except:
                pass
            time.sleep(1)
        
        print("❌ Failed to start Ollama")
        return False
        
    except Exception as e:
        print(f"❌ Error starting Ollama: {e}")
        return False


def start_streamable_server():
    """Start the streamable MCP server"""
    print("🚀 Starting Streamable RAG Component Generator...")
    
    # Get server info
    local_ip = get_local_ip()
    
    print(f"🌐 Server IP: {local_ip}")
    print(f"🔌 Port: 8080")
    print(f"📡 Transport: HTTP (Streamable mode)")
    print(f"🔧 MCP Tools: generate_component_from_query, get_streamable_server_info, test_streamable_system")
    print()
    
    print("📋 Streamable Configuration:")
    print("-" * 40)
    print(f"• Service Type: Streamable HTTP API")
    print(f"• Endpoint: http://{local_ip}:8080")
    print(f"• Health Check: http://{local_ip}:8080/health")
    print(f"• API Docs: http://{local_ip}:8080/docs")
    print(f"• WebSocket: ws://{local_ip}:8080/ws")
    print()
    
    print("🎯 Available Endpoints:")
    print("-" * 40)
    print("• POST /mcp/call - Call MCP tools via HTTP")
    print("• GET /health - Health check endpoint")
    print("• GET /ready - Readiness check")
    print("• GET /metrics - Prometheus metrics")
    print("• GET /docs - API documentation")
    print("• WS /ws - WebSocket for real-time updates")
    print()
    
    print("🔗 HTTP API Usage:")
    print("-" * 40)
    print(f"curl -X POST http://{local_ip}:8080/mcp/call \\")
    print("  -H 'Content-Type: application/json' \\")
    print("  -d '{\"tool\": \"generate_component_from_query\", \"parameters\": {\"query\": \"Create a button\", \"framework\": \"React\", \"style_mode\": \"css-module\"}}'")
    print()
    
    print("🐳 Docker Deployment:")
    print("-" * 40)
    print("docker build -t rag-component-generator .")
    print("docker run -p 8080:8080 rag-component-generator")
    print()
    
    print("☸️  Kubernetes Deployment:")
    print("-" * 40)
    print("kubectl apply -f streamable-config.yaml")
    print()
    
    print("🚀 Starting server...")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    # Start the streamable server
    try:
        server_script = Path(__file__).parent.parent / "mcp_tools" / "streamable_mcp_server.py"
        subprocess.run([sys.executable, str(server_script)], cwd=Path(__file__).parent.parent)
    except KeyboardInterrupt:
        print("\n👋 Streamable server stopped by user")
    except Exception as e:
        print(f"❌ Error starting streamable server: {e}")


def show_streamable_info():
    """Show streamable configuration information"""
    
    print("🌊 Streamable RAG Component Generator Configuration")
    print("=" * 60)
    
    local_ip = get_local_ip()
    
    print("📋 Streamable Features:")
    print("-" * 30)
    print("• HTTP REST API endpoint")
    print("• Load balancing support")
    print("• Health checks and monitoring")
    print("• Container deployment ready")
    print("• Kubernetes integration")
    print("• WebSocket real-time updates")
    print("• Prometheus metrics")
    print("• API documentation")
    print()
    
    print("🔧 Configuration Files:")
    print("-" * 30)
    print("• Dockerfile - Container configuration")
    print("• streamable-config.yaml - Kubernetes deployment")
    print("• mcp_tools/streamable_mcp_server.py - Streamable server")
    print()
    
    print("🚀 Deployment Options:")
    print("-" * 30)
    print("1. Local Development:")
    print(f"   python3 scripts/start_streamable_server.py")
    print()
    print("2. Docker Container:")
    print("   docker build -t rag-component-generator .")
    print("   docker run -p 8080:8080 rag-component-generator")
    print()
    print("3. Kubernetes:")
    print("   kubectl apply -f streamable-config.yaml")
    print("   kubectl get svc rag-component-generator")
    print()
    
    print("📡 Endpoints:")
    print("-" * 30)
    print(f"• HTTP API: http://{local_ip}:8080")
    print(f"• Health: http://{local_ip}:8080/health")
    print(f"• Metrics: http://{local_ip}:8080/metrics")
    print(f"• Docs: http://{local_ip}:8080/docs")
    print()
    
    print("🎯 MCP Tool Usage (HTTP):")
    print("-" * 30)
    print("POST /mcp/call")
    print('Content-Type: application/json')
    print('{')
    print('  "tool": "generate_component_from_query",')
    print('  "parameters": {')
    print('    "query": "Create a primary button",')
    print('    "framework": "React",')
    print('    "style_mode": "css-module"')
    print('  }')
    print('}')


def main():
    """Main entry point"""
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--info":
            show_streamable_info()
            return
        elif sys.argv[1] == "--check":
            if check_dependencies():
                print("✅ All dependencies satisfied")
            else:
                print("❌ Missing dependencies")
                sys.exit(1)
            return
    
    # Check dependencies
    if not check_dependencies():
        print("❌ Dependencies not satisfied. Use --check for details.")
        sys.exit(1)
    
    # Start Ollama if needed
    if not start_ollama():
        print("❌ Failed to start Ollama")
        sys.exit(1)
    
    # Start streamable server
    start_streamable_server()


if __name__ == "__main__":
    main()
