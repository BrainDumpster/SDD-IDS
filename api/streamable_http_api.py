"""
HTTP API wrapper for Streamable RAG Component Generator
Provides REST endpoints for MCP tools
"""

import asyncio
import json
import sys
from pathlib import Path
from typing import Any, Dict
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import socket

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from mcp_tools.streamable_mcp_server import (
    generate_component_from_query,
    get_streamable_server_info,
    test_streamable_system
)

# Create FastAPI app
app = FastAPI(
    title="RAG Component Generator API",
    description="Streamable HTTP API for RAG-powered component generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "RAG Component Generator",
        "version": "1.0.0",
        "mode": "streamable",
        "endpoints": {
            "mcp_call": "/mcp/call",
            "health": "/health",
            "ready": "/ready",
            "metrics": "/metrics",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "rag-component-generator",
        "mode": "streamable"
    }


@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    try:
        # Test if MCP tools are working
        result = test_streamable_system()
        return {
            "status": "ready",
            "service": "rag-component-generator",
            "tools_available": True,
            "test_results": result["test_results"]["status"]
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service not ready: {str(e)}")


@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    metrics_data = {
        "rag_generator_requests_total": 0,
        "rag_generator_errors_total": 0,
        "rag_generator_uptime_seconds": 0
    }
    
    # Format as Prometheus metrics
    metrics_text = ""
    for key, value in metrics_data.items():
        metrics_text += f"# HELP {key} {key}\n"
        metrics_text += f"# TYPE {key} counter\n"
        metrics_text += f"{key} {value}\n"
    
    return JSONResponse(content=metrics_text, media_type="text/plain")


@app.post("/mcp/call")
async def mcp_call(request: Dict[str, Any]):
    """MCP tool call endpoint"""
    try:
        tool_name = request.get("tool")
        parameters = request.get("parameters", {})
        
        if not tool_name:
            raise HTTPException(status_code=400, detail="Tool name is required")
        
        # Route to appropriate tool
        if tool_name == "generate_component_from_query":
            result = generate_component_from_query(
                query=parameters.get("query", ""),
                framework=parameters.get("framework", "React"),
                style_mode=parameters.get("style_mode", "css-module")
            )
        elif tool_name == "get_streamable_server_info":
            result = get_streamable_server_info()
        elif tool_name == "test_streamable_system":
            result = test_streamable_system()
        else:
            raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")
        
        return {
            "status": "success",
            "tool": tool_name,
            "result": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling tool: {str(e)}")


@app.get("/mcp/tools")
async def list_tools():
    """List available MCP tools"""
    return {
        "tools": [
            {
                "name": "generate_component_from_query",
                "description": "Generate components from natural language",
                "parameters": {
                    "query": "string (required)",
                    "framework": "string (React|Angular, optional)",
                    "style_mode": "string (css-module|css-in-js|angular-scss, optional)"
                }
            },
            {
                "name": "get_streamable_server_info",
                "description": "Get server connection information",
                "parameters": {}
            },
            {
                "name": "test_streamable_system",
                "description": "Test the streamable RAG system",
                "parameters": {}
            }
        ]
    }


@app.get("/info")
async def server_info():
    """Get server information"""
    return get_streamable_server_info()


def get_local_ip():
    """Get local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "localhost"


async def start_http_server():
    """Start the HTTP API server"""
    
    local_ip = get_local_ip()
    port = 8080
    
    print(f"🌐 Starting HTTP API server on http://{local_ip}:{port}")
    print(f"📚 API Documentation: http://{local_ip}:{port}/docs")
    print(f"🔍 ReDoc Documentation: http://{local_ip}:{port}/redoc")
    
    # Start uvicorn server
    config = uvicorn.Config(
        app=app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
    
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(start_http_server())
