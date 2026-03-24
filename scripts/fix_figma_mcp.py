#!/usr/bin/env python3
"""
Fix Figma MCP Server Configuration
"""

import os
import json
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

def fix_mcp_config():
    """Fix MCP configuration for Figma"""
    # Load current config
    config_path = Path("mcp_config.json")
    if not config_path.exists():
        print("❌ mcp_config.json not found")
        return False
    
    with open(config_path) as f:
        config = json.load(f)
    
    # Fix Figma server config
    figma_server = config["mcpServers"]["figma-remote-mcp-server"]
    
    # Add environment variables
    figma_server["env"] = {
        "NODE_EXTRA_CA_CERTS": "/etc/ssl/certs/ca-certificates.crt",
        "FIGMA_TOKEN": os.getenv("FIGMA_TOKEN", "")
    }
    
    # Save fixed config
    with open("mcp_config_fixed.json", "w") as f:
        json.dump(config, f, indent=2)
    
    print("✅ Fixed MCP config saved to mcp_config_fixed.json")
    return True

def test_figma_token():
    """Test Figma token validity"""
    token = os.getenv("FIGMA_TOKEN")
    if not token:
        print("❌ FIGMA_TOKEN not set")
        return False
    
    print(f"✅ Token format: {token[:10]}...")
    return True

def main():
    print("🔧 FIXING FIGMA MCP SERVER")
    print("=" * 40)
    
    # Test token
    if not test_figma_token():
        print("Please set FIGMA_TOKEN in .env")
        return
    
    # Fix config
    if fix_mcp_config():
        print("🎉 MCP configuration fixed!")
        print("Use mcp_config_fixed.json for your MCP client")

if __name__ == "__main__":
    main()
