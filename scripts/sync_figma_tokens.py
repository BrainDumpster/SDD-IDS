import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from tokens.token_sync_pipeline import TokenSyncPipeline

async def main():
    # 1. Configuration
    figma_url = os.getenv("FIGMA_FILE_URL")
    # Change this if your local server command is different (e.g., "npx figma-remote-mcp-server")
    server_command = "figma-remote-mcp-server" 
    
    if not figma_url:
        print("❌ Error: FIGMA_FILE_URL environment variable is missing.")
        print("Usage: export FIGMA_FILE_URL='your_url' && python scripts/sync_figma_tokens.py")
        return

    # 2. Execution
    print(f"Connecting to local MCP server: {server_command}...")
    pipeline = TokenSyncPipeline(figma_url)
    
    # We override the client inside the pipeline or pass the command 
    # (Assuming Pipeline takes figma_url and handles client init)
    await pipeline.run()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nSync cancelled by user.")
