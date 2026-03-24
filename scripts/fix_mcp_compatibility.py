#!/usr/bin/env python3
"""
Fix MCP Compatibility Issues
Updates the Figma client to work with MCP 1.26.0
"""

import os
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def fix_figma_client():
    """Fix the Figma client for MCP 1.26.0 compatibility"""
    print("🔧 FIXING FIGMA CLIENT COMPATIBILITY")
    print("=" * 50)
    
    figma_client_path = Path("tokens/figma_client.py")
    
    if not figma_client_path.exists():
        print("❌ figma_client.py not found")
        return False
    
    # Read current content
    with open(figma_client_path) as f:
        content = f.read()
    
    # Fix for MCP 1.26.0 - use correct imports
    fixed_content = content.replace(
        "from mcp.client.streamable_http import streamable_http_client",
        "from mcp.client.stdio import StdioServerParameters"
    ).replace(
        "async with streamable_http_client(self.figma_url) as (read, write, get_session_id):",
        """server_params = StdioServerParameters(
            command="npx",
            args=[
                "-y",
                "mcp-remote",
                "https://mcp.figma.com/mcp",
                "--static-oauth-client-metadata",
                '{"client_name":"Design Intelligence","client_uri":"http://100.65.144.93:8000"}'
            ],
            env={
                "FIGMA_TOKEN": os.getenv("FIGMA_TOKEN"),
                "NODE_EXTRA_CA_CERTS": "/etc/ssl/certs/ca-certificates.crt"
            }
        )
        
        async with StdioServer(server_params) as (read, write):"""
    ).replace(
        "from mcp import ClientSession, AsyncExitStack",
        "from mcp import ClientSession, StdioServer"
    ).replace(
        "async with AsyncExitStack() as exit_stack:",
        "async with StdioServer(server_params) as (read, write):"
    )
    
    # Save fixed content
    with open(figma_client_path, 'w') as f:
        f.write(fixed_content)
    
    print("✅ Fixed figma_client.py for MCP 1.26.0")
    return True

def update_figma_spec_extractor():
    """Update Figma spec extractor for compatibility"""
    print("\n🔧 UPDATING FIGMA SPEC EXTRACTOR")
    print("-" * 40)
    
    extractor_path = Path("tokens/figma_spec_extractor.py")
    
    if not extractor_path.exists():
        print("❌ figma_spec_extractor.py not found")
        return False
    
    # Read current content
    with open(extractor_path) as f:
        content = f.read()
    
    # Fix imports for MCP 1.26.0
    fixed_content = content.replace(
        "from mcp.client.streamable_http import streamable_http_client",
        "from mcp.client.stdio import StdioServerParameters"
    )
    
    # Save fixed content
    with open(extractor_path, 'w') as f:
        f.write(fixed_content)
    
    print("✅ Updated figma_spec_extractor.py")
    return True

def install_mcp_dependencies():
    """Install required MCP dependencies"""
    print("\n📦 INSTALLING MCP DEPENDENCIES")
    print("-" * 40)
    
    import subprocess
    
    try:
        # Install stdio client
        result = subprocess.run([
            "uv", "pip", "install", "mcp[stdio]"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ MCP stdio client installed")
            return True
        else:
            print(f"❌ Installation failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Installation error: {e}")
        return False

def test_environment():
    """Test environment setup"""
    print("\n🧪 TESTING ENVIRONMENT")
    print("-" * 30)
    
    # Load environment
    from dotenv import load_dotenv
    load_dotenv()
    
    figma_token = os.getenv("FIGMA_TOKEN")
    print(f"🔑 Figma Token: {'✅ Set' if figma_token else '❌ Missing'}")
    
    if figma_token:
        print(f"   Format: {figma_token[:10]}...")
    
    return figma_token is not None

def main():
    """Main function"""
    print("🔧 MCP COMPATIBILITY FIX")
    print("=" * 50)
    print("Fixing Figma MCP for MCP 1.26.0")
    print("")
    
    # Test environment
    if not test_environment():
        print("❌ Environment not ready")
        print("Set FIGMA_TOKEN in .env")
        return
    
    # Install dependencies
    if not install_mcp_dependencies():
        print("❌ Could not install dependencies")
        return
    
    # Fix Figma client
    if fix_figma_client():
        print("✅ Figma client fixed")
    
    # Update spec extractor
    if update_figma_spec_extractor():
        print("✅ Spec extractor updated")
    
    print("\n🎉 MCP COMPATIBILITY FIXED!")
    print("=" * 50)
    print("Now run:")
    print("   python scripts/enhanced_figma_specs_pipeline.py")

if __name__ == "__main__":
    main()
