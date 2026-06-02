#!/usr/bin/env python3
"""
Phase 2: Simple GitHub Content Indexing
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from ingestion.github_loader import GithubLoader
from ingestion.markdown_parser import parse_markdown
from ingestion.chunk_builder import build_chunks
from embeddings.embedding_service import EmbeddingService
from vectorstore.qdrant_store import QdrantStore


class SimpleGitHubPipeline:
    """
    Simple pipeline that indexes GitHub content
    """
    
    def __init__(self):
        self.github_loader = GithubLoader()
        self.embedder = EmbeddingService().get_embedder()
        self.vector_store = QdrantStore(self.embedder)
    
    async def run_indexing(self):
        """
        Run GitHub indexing
        """
        print("📚 GITHUB CONTENT INDEXING")
        print("=" * 50)
        
        try:
            # List files from GitHub
            files = self.github_loader.list_files("")
            print(f"📁 Found {len(files)} files from GitHub")
            
            # Filter MDX files
            mdx_files = [f for f in files if f["name"].endswith(".md")]
            print(f"📄 Found {len(mdx_files)} MDX files to process")
            
            if len(mdx_files) == 0:
                print("⚠️ No MDX files found in GitHub repository")
                return {"processed": 0, "errors": []}
            
            processed_count = 0
            errors = []
            
            for i, file_info in enumerate(mdx_files):
                print(f"🔄 [{i+1}/{len(mdx_files)}] Processing: {file_info['path']}")
                
                try:
                    # Fetch content from GitHub
                    content = self.github_loader.fetch_file(file_info["download_url"])
                    print(f"✅ Fetched: {len(content)} characters")
                    
                    # Parse MDX
                    sections = parse_markdown(content)
                    print(f"✅ Parsed: {len(sections)} sections")
                    
                    # Create chunks
                    component = file_info["name"].replace(".md", "")
                    docs = build_chunks(component, sections, file_info["path"])
                    print(f"✅ Built: {len(docs)} document chunks")
                    
                    # Add to vector store
                    self.vector_store.add_documents(docs)
                    print(f"✅ Added: {len(docs)} documents to vector store")
                    
                    processed_count += 1
                    
                except Exception as e:
                    error_msg = f"Error processing {file_info['path']}: {e}"
                    print(f"❌ {error_msg}")
                    errors.append(error_msg)
            
            return {
                "processed": processed_count,
                "errors": errors,
                "total_files": len(mdx_files)
            }
            
        except Exception as e:
            print(f"❌ GitHub indexing failed: {e}")
            return {"processed": 0, "errors": [str(e)], "total_files": 0}
    
    def verify_vector_store(self):
        """
        Verify vector store
        """
        print("\n🔍 VERIFYING VECTOR STORE")
        print("-" * 40)
        
        try:
            import requests
            response = requests.get(f"http://100.65.144.93:6333/collections")
            if response.status_code == 200:
                collections = response.json()
                collection_names = [c["name"] for c in collections["result"]["collections"]]
                
                print(f"📚 Collections: {collection_names}")
                
                # Check design_knowledge collection
                if "design_knowledge" in collection_names:
                    try:
                        count_response = requests.get(f"http://100.65.144.93:6333/collections/design_knowledge/count")
                        if count_response.status_code == 200:
                            count = count_response.json()["result"]["count"]
                            print(f"   design_knowledge: {count} documents")
                    except:
                        print(f"   design_knowledge: Unable to get count")
                else:
                    print("   design_knowledge: Collection not found")
                
                return True
            else:
                print(f"❌ Failed to get collections: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Vector store verification failed: {e}")
            return False


async def main():
    """
    Main function
    """
    print("📚 PHASE 2: GITHUB CONTENT INDEXING")
    print("=" * 50)
    print("(Figma integration can be added later with proper authentication)")
    print("")
    
    pipeline = SimpleGitHubPipeline()
    
    # Run GitHub indexing
    results = await pipeline.run_indexing()
    
    # Verify vector store
    pipeline.verify_vector_store()
    
    # Final summary
    print("\n🎉 GITHUB INDEXING COMPLETED!")
    print("=" * 50)
    print(f"✅ Total files processed: {results['processed']}")
    print(f"✅ Total errors: {len(results['errors'])}")
    print("")
    print("🚀 Ready for Phase 3: Enhanced RAG + Code Generation")
    print("   Start APIs:")
    print("   python api/rag_api.py &")
    print("   python api/search_api.py &")
    print("")
    print("📊 Test with:")
    print("   python agent/design_chat.py")
    
    if results['errors']:
        print("\n⚠️ ERRORS ENCOUNTERED:")
        for error in results['errors']:
            print(f"   - {error}")
    
    print("\n📋 NEXT STEPS:")
    print("1. Fix GitHub repository path in .env")
    print("2. Get Figma token and add to .env")
    print("3. Use mcp_config_fixed.json for MCP servers")
    print("4. Run enhanced pipeline when ready")


if __name__ == "__main__":
    asyncio.run(main())
