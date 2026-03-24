import asyncio
import os
from .figma_client import FigmaMCPClient
from .token_extractor import TokenExtractor
from .markdown_generator import MarkdownGenerator

class TokenSyncPipeline:
    """
    Orchestrates the flow from Figma MCP extraction to Markdown generation.
    """
    def __init__(self, figma_url: str):
        self.figma_url = figma_url
        self.client = FigmaMCPClient()
        self.extractor = TokenExtractor()
        self.generator = MarkdownGenerator()

    async def run(self):
        print(f"🚀 Starting sync for: {self.figma_url}")
        
        try:
            # 1. Connect to MCP Server
            await self.client.connect()
            
            # 2. Fetch raw variable data
            print("Fetching variables via MCP...")
            raw_data = await self.client.get_variables(self.figma_url)
            
            # 3. Extract and structure data
            print("Extracting collections and modes...")
            extracted_data = self.extractor.extract(raw_data)
            
            # 4. Generate Markdown files
            print("Generating LLM-friendly documentation...")
            self.generator.write_token_files(extracted_data)
            
            print("✨ Pipeline completed successfully.")
            
        except Exception as e:
            print(f"❌ Pipeline failed: {str(e)}")
        finally:
            await self.client.disconnect()
