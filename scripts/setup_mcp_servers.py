#!/usr/bin/env python3
"""
Setup and Test MCP Servers
"""

import asyncio
import json
import os
from pathlib import Path


def check_mcp_requirements():
    """Check if MCP requirements are installed"""
    print("🔍 CHECKING MCP REQUIREMENTS")
    print("=" * 40)
    
    try:
        import mcp
        print("✅ MCP package installed")
    except ImportError:
        print("❌ MCP package not installed")
        print("Install with: uv pip install mcp")
        return False
    
    try:
        from mcp.client.streamable_http import streamable_http_client
        print("✅ MCP streamable HTTP client available")
    except ImportError:
        print("❌ MCP streamable client not available")
        return False
    
    return True


def setup_figma_mcp():
    """Setup Figma MCP server configuration"""
    print("\n🎨 SETTING UP FIGMA MCP SERVER")
    print("=" * 40)
    
    # Check if we have Figma credentials
    figma_token = os.getenv("FIGMA_TOKEN")
    if not figma_token or figma_token == "your_figma_token_here":
        print("⚠️ No Figma token configured")
        print("Set FIGMA_TOKEN in your .env file")
        print("Get token from: https://www.figma.com/developers/api#access-tokens")
        return False
    
    print("✅ Figma token found")
    return True


def setup_github_mcp():
    """Setup GitHub MCP server configuration"""
    print("\n📚 SETTING UP GITHUB MCP SERVER")
    print("=" * 40)
    
    # Check GitHub configuration
    github_token = os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
    github_host = os.getenv("GITHUB_HOST")
    github_repo = os.getenv("GITHUB_REPO")
    
    if not all([github_token, github_host, github_repo]):
        print("⚠️ GitHub configuration incomplete")
        print("Required: GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_HOST, GITHUB_REPO")
        return False
    
    print("✅ GitHub configuration complete")
    print(f"   Host: {github_host}")
    print(f"   Repo: {github_repo}")
    return True


def create_updated_mcp_config():
    """Create updated MCP configuration"""
    print("\n📝 CREATING UPDATED MCP CONFIG")
    print("=" * 40)
    
    config = {
        "mcpServers": {
            "figma-remote-mcp-server": {
                "args": [
                    "-y",
                    "mcp-remote",
                    "https://mcp.figma.com/mcp",
                    "--static-oauth-client-metadata",
                    "{\"client_name\":\"Design Intelligence\",\"client_uri\":\"http://localhost:8000\"}"
                ],
                "command": "npx",
                "disabled": False,
                "env": {
                    "NODE_EXTRA_CA_CERTS": "/etc/ssl/certs/ca-certificates.crt",
                    "FIGMA_TOKEN": "${FIGMA_TOKEN}"
                }
            },
            "github-docker": {
                "args": [
                    "run",
                    "-i",
                    "--rm",
                    "-v",
                    "/etc/ssl/certs:/etc/ssl/certs:ro",
                    "-e",
                    "GITHUB_PERSONAL_ACCESS_TOKEN",
                    "-e",
                    "GITHUB_HOST=https://eos2git.cec.lab.emc.com",
                    "-e",
                    "GITHUB_REPO=your-org/your-repo",
                    "ghcr.io/github/github-mcp-server"
                ],
                "command": "docker",
                "disabled": False,
                "env": {
                    "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}",
                    "GITHUB_HOST": "${GITHUB_HOST}",
                    "GITHUB_REPO": "${GITHUB_REPO}"
                }
            },
        }
    }
    
    # Write updated config
    config_path = Path("mcp_config_updated.json")
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"✅ Created updated config: {config_path}")
    print("   This config:")
    print("   - Uses environment variables for tokens")
    print("   - Updates client name for Figma")
    print("   - Fixes GitHub repository path")
    
    return config_path


def create_env_template():
    """Create environment template"""
    print("\n📄 CREATING ENVIRONMENT TEMPLATE")
    print("=" * 40)
    
    env_template = """# Design Intelligence System Environment
# Copy this to .env and update with your values

# GitHub Configuration
GITHUB_PERSONAL_ACCESS_TOKEN=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
GITHUB_HOST=https://eos2git.cec.lab.emc.com
GITHUB_REPO=your-org/your-repo

# Figma Configuration
# Get token from: https://www.figma.com/developers/api#access-tokens
FIGMA_TOKEN=figd_your_figma_token_here

# Ollama Configuration
OLLAMA_HOST=http://127.0.0.1:11434
LLM_MODEL=llama3
"""
    
    env_path = Path(".env.template")
    with open(env_path, 'w') as f:
        f.write(env_template)
    
    print(f"✅ Created environment template: {env_path}")
    print("   Copy to .env and update with your actual values")
    
    return env_path


def test_mcp_connection():
    """Test MCP connection"""
    print("\n🧪 TESTING MCP CONNECTION")
    print("=" * 40)
    
    try:
        from mcp.client.streamable_http import streamable_http_client
        from mcp import ClientSession, AsyncExitStack
        
        async def test_connection():
            print("🔗 Testing Figma MCP connection...")
            
            exit_stack = AsyncExitStack()
            read, write, get_session_id = await exit_stack.enter_async_context(
                streamable_http_client("https://mcp.figma.com/mcp")
            )
            
            session = await exit_stack.enter_async_context(ClientSession(read, write))
            await session.initialize()
            
            # Test basic functionality
            try:
                result = await session.call_tool(
                    "get_variable_defs", 
                    arguments={"url": "https://www.figma.com/design/test"}
                )
                print("✅ Figma MCP connection successful")
                print(f"   Response: {result.content[0].text if result.content else 'No content'}")
                return True
            except Exception as e:
                print(f"❌ Figma MCP tool call failed: {e}")
                return False
            finally:
                await exit_stack.aclose()
        
        return asyncio.run(test_connection())
        
    except Exception as e:
        print(f"❌ MCP connection test failed: {e}")
        return False


def main():
    """Main setup function"""
    print("🔧 MCP SERVER SETUP")
    print("=" * 50)
    
    # Check requirements
    if not check_mcp_requirements():
        print("\n❌ Please install MCP requirements first")
        return
    
    # Check configurations
    figma_ok = setup_figma_mcp()
    github_ok = setup_github_mcp()
    
    if not figma_ok or not github_ok:
        print("\n⚠️ Please fix configuration before continuing")
        return
    
    # Create updated files
    config_path = create_updated_mcp_config()
    env_path = create_env_template()
    
    # Test connection (optional)
    print("\n🧪 Test MCP connection? (y/N): ", end="")
    response = input().strip().lower()
    
    if response == 'y':
        test_mcp_connection()
    
    print("\n🎉 SETUP COMPLETED!")
    print("=" * 50)
    print("Next steps:")
    print(f"1. Update environment: cp {env_path} .env")
    print("2. Add your actual Figma token to .env")
    print("3. Update GitHub repository path in .env")
    print("4. Use updated MCP config: {config_path}")
    print("5. Restart your IDE/MCP client")
    print("")
    print("📚 Full documentation: docs/FIGMA_INTEGRATION_GUIDE.md")


if __name__ == "__main__":
    main()
