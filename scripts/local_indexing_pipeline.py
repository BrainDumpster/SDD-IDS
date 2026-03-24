#!/usr/bin/env python3
"""
Local Indexing Pipeline - Pull from GitHub and extract from Figma
"""

import asyncio
import json
import os
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from ingestion.github_loader import GithubLoader
from ingestion.mdx_parser import parse_mdx
from ingestion.chunk_builder import build_chunks
from embeddings.embedding_service import EmbeddingService
from vectorstore.qdrant_store import QdrantStore
from storage.document_registry import DocumentRegistry
from utils.file_hash import compute_hash
from scripts.enhanced_figma_specs_pipeline import EnhancedSpecPipeline


class LocalIndexingPipeline:
    """
    Pipeline that pulls from GitHub and extracts from Figma
    """
    
    def __init__(self):
        self.github_loader = GithubLoader()
        self.embedder = EmbeddingService().get_embedder()
        self.vector_store = QdrantStore(self.embedder)
        self.registry = DocumentRegistry()
        self.figma_pipeline = EnhancedSpecPipeline()
    
    async def run_phase_2(self):
        """
        Phase 2: Pull from GitHub + Extract from Figma
        """
        print("🚀 Starting Phase 2: GitHub + Figma Data Collection")
        print("=" * 60)
        
        # Step 1: Pull from GitHub
        print("\n📚 STEP 1: PULLING FROM GITHUB")
        print("-" * 40)
        github_results = await self._index_github_content()
        
        # Step 2: Extract from Figma
        print("\n🎨 STEP 2: EXTRACTING FROM FIGMA")
        print("-" * 40)
        figma_results = await self._extract_figma_specs()
        
        # Summary
        print("\n📊 PHASE 2 SUMMARY")
        print("=" * 40)
        print(f"GitHub Content: {github_results['processed']} files processed")
        print(f"Figma Specs: {figma_results['processed']} components processed")
        print(f"Total Vectorized: {github_results['processed'] + figma_results['processed']} items")
        
        return {
            "github": github_results,
            "figma": figma_results,
            "total": github_results['processed'] + figma_results['processed']
        }
    
    async def _index_github_content(self):
        """
        Index GitHub content (pull fresh from remote)
        """
        try:
            # List files from GitHub
            files = self.github_loader.list_files("")
            print(f"📁 Found {len(files)} files from GitHub")
            
            # Filter MDX files
            mdx_files = [f for f in files if f["name"].endswith(".mdx")]
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
                    sections = parse_mdx(content)
                    print(f"✅ Parsed: {len(sections)} sections")
                    
                    # Create chunks
                    component = file_info["name"].replace(".mdx", "")
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
    
    async def _extract_figma_specs(self):
        """
        Extract Figma specifications
        """
        try:
            # Run enhanced Figma pipeline
            results = await self.figma_pipeline.run_pipeline(
                batch_size=5,
                skip_existing=False  # Force fresh extraction
            )
            
            return {
                "processed": results["processed"],
                "errors": results.get("errors", []),
                "total_components": results["total_components"]
            }
            
        except Exception as e:
            print(f"❌ Figma extraction failed: {e}")
            return {"processed": 0, "errors": [str(e)], "total_components": 0}
    
    def verify_vector_store(self):
        """
        Verify what's in the vector store
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
                
                # Check counts
                for collection_name in collection_names:
                    try:
                        count_response = requests.get(f"http://100.65.144.93:6333/collections/{collection_name}/count")
                        if count_response.status_code == 200:
                            count = count_response.json()["result"]["count"]
                            print(f"   {collection_name}: {count} documents")
                    except:
                        print(f"   {collection_name}: Unable to get count")
                
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
    print("🔄 LOCAL INDEXING PIPELINE")
    print("=" * 50)
    print("Phase 2: GitHub + Figma Data Collection")
    print("")
    
    pipeline = LocalIndexingPipeline()
    
    # Run Phase 2
    results = await pipeline.run_phase_2()
    
    # Verify vector store
    pipeline.verify_vector_store()
    
    # Final summary
    print("\n🎉 PHASE 2 COMPLETED!")
    print("=" * 50)
    print(f"✅ Total items vectorized: {results['total']}")
    print(f"✅ GitHub content: {results['github']['processed']} files")
    print(f"✅ Figma specs: {results['figma']['processed']} components")
    print("")
    print("🚀 Ready for Phase 3: Enhanced RAG + Code Generation")
    print("   Start APIs:")
    print("   python api/figma_specs_api.py &")
    print("   python api/enhanced_generation_api.py &")
    print("")
    print("📊 Test with:")
    print("   python scripts/figma_integration_demo.py single")


if __name__ == "__main__":
    asyncio.run(main())
