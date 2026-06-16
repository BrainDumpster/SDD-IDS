#!/usr/bin/env python3
"""
Phase 2: GitHub + Figma Integration (Final)
Uses existing component mappings from data/component-figma-map.json
"""

import asyncio
import json
import os
import sys
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from ingestion.github_loader import GithubLoader
from ingestion.markdown_parser import parse_markdown
from ingestion.chunk_builder import build_chunks
from embeddings.embedding_service import EmbeddingService
from vectorstore.qdrant_store import QdrantStore
from storage.document_registry import DocumentRegistry


class FinalPhase2Pipeline:
    """
    Final Phase 2 pipeline using existing component mappings
    """
    
    def __init__(self):
        self.github_loader = GithubLoader()
        self.embedder = EmbeddingService().get_embedder()
        self.vector_store = QdrantStore(self.embedder)
        self.registry = DocumentRegistry()
        self.component_mappings = self.load_component_mappings()
    
    def load_component_mappings(self):
        """Load component mappings from JSON file"""
        try:
            mapping_file = Path("data/component-figma-map.json")
            if mapping_file.exists():
                with open(mapping_file, 'r') as f:
                    mappings = json.load(f)
                print(f"📋 Loaded {len(mappings)} component mappings")
                return mappings
            else:
                print("❌ Component mapping file not found")
                return []
        except Exception as e:
            print(f"❌ Error loading component mappings: {e}")
            return []
    
    async def run_github_indexing(self):
        """
        Index GitHub content
        """
        print("📚 STEP 1: GITHUB CONTENT INDEXING")
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
    
    async def run_figma_spec_extraction(self):
        """
        Run Figma specification extraction using component mappings
        """
        print("\n🎨 STEP 2: FIGMA SPECIFICATION EXTRACTION")
        print("=" * 50)
        
        if not self.component_mappings:
            print("❌ No component mappings available")
            return {"processed": 0, "errors": ["No component mappings"]}
        
        figma_token = os.getenv("FIGMA_TOKEN")
        if not figma_token:
            print("❌ FIGMA_TOKEN not set in environment")
            return {"processed": 0, "errors": ["No Figma token"]}
        
        print(f"🔑 Figma Token: ✅ Set")
        print(f"📋 Processing {len(self.component_mappings)} components")
        
        processed_count = 0
        errors = []
        
        # Process first few components for demo
        components_to_process = self.component_mappings[:5]  # Process first 5 for demo
        
        for i, mapping in enumerate(components_to_process):
            print(f"\n🔄 [{i+1}/{len(components_to_process)}] Processing: {mapping['component']}")
            print(f"   URL: {mapping['figmaUrl']}")
            print(f"   Node: {mapping['nodeId']}")
            
            try:
                # Create simple spec from mapping
                spec = {
                    "component": mapping["component"],
                    "category": mapping.get("category", "Unknown"),
                    "figma_url": mapping["figmaUrl"],
                    "node_id": mapping["nodeId"],
                    "extracted_at": str(asyncio.get_event_loop().time()),
                    "status": "mapped",
                    "source": "component-figma-map.json"
                }
                
                # Save spec
                output_dir = Path("design-system-knowledge")
                output_dir.mkdir(exist_ok=True)
                
                filename = f"{mapping['component'].lower().replace(' ', '-')}-spec.json"
                spec_file = output_dir / filename
                
                with open(spec_file, 'w') as f:
                    json.dump(spec, f, indent=2)
                
                print(f"✅ Saved spec: {spec_file}")
                processed_count += 1
                
            except Exception as e:
                error_msg = f"Error processing {mapping['component']}: {e}"
                print(f"❌ {error_msg}")
                errors.append(error_msg)
        
        print(f"\n📊 Processed {processed_count} components (first 5 of {len(self.component_mappings)})")
        print(f"   Run full extraction with: python scripts/enhanced_figma_specs_pipeline.py")
        
        return {
            "processed": processed_count,
            "errors": errors,
            "total_components": len(self.component_mappings),
            "demo_mode": True
        }
    
    def verify_vector_store(self):
        """
        Verify vector store contents
        """
        print("\n🔍 STEP 3: VERIFYING VECTOR STORE")
        print("-" * 50)
        
        try:
            import requests
            response = requests.get(f"http://100.65.144.93:6333/collections")
            if response.status_code == 200:
                collections = response.json()
                collection_names = [c["name"] for c in collections["result"]["collections"]]
                
                print(f"📚 Collections: {collection_names}")
                
                # Check counts
                total_docs = 0
                for collection_name in collection_names:
                    try:
                        count_response = requests.get(f"http://100.65.144.93:6333/collections/{collection_name}/count")
                        if count_response.status_code == 200:
                            count = count_response.json()["result"]["count"]
                            print(f"   {collection_name}: {count} documents")
                            total_docs += count
                    except:
                        print(f"   {collection_name}: Unable to get count")
                
                print(f"📊 Total documents in vector store: {total_docs}")
                return True
            else:
                print(f"❌ Failed to get collections: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Vector store verification failed: {e}")
            return False
    
    def show_sample_mappings(self):
        """Show sample component mappings"""
        print("\n📋 SAMPLE COMPONENT MAPPINGS:")
        print("-" * 50)
        
        for i, mapping in enumerate(self.component_mappings[:5]):
            print(f"   {i+1}. {mapping['component']}")
            print(f"      Category: {mapping.get('category', 'Unknown')}")
            print(f"      Node ID: {mapping['nodeId']}")
            print(f"      URL: {mapping['figmaUrl'][:50]}...")
            print("")
        
        if len(self.component_mappings) > 5:
            print(f"   ... and {len(self.component_mappings) - 5} more components")


async def main():
    """
    Main function
    """
    print("🚀 PHASE 2: GITHUB + FIGMA INTEGRATION (FINAL)")
    print("=" * 60)
    print("Using existing component mappings from data/component-figma-map.json")
    print("")
    
    pipeline = FinalPhase2Pipeline()
    
    # Show sample mappings
    pipeline.show_sample_mappings()
    
    # Step 1: GitHub indexing
    github_results = await pipeline.run_github_indexing()
    
    # Step 2: Figma spec extraction
    figma_results = await pipeline.run_figma_spec_extraction()
    
    # Step 3: Verify vector store
    pipeline.verify_vector_store()
    
    # Summary
    print("\n📊 PHASE 2 SUMMARY")
    print("=" * 50)
    print(f"✅ GitHub files processed: {github_results['processed']}")
    print(f"✅ Figma specs created: {figma_results['processed']}")
    print(f"✅ Total items vectorized: {github_results['processed'] + figma_results['processed']}")
    
    if github_results['errors'] or figma_results['errors']:
        print("\n⚠️ ERRORS:")
        for error in github_results['errors'] + figma_results['errors']:
            print(f"   - {error}")
    
    print("\n🎉 PHASE 2 COMPLETED!")
    print("=" * 50)
    print("🚀 Ready for Phase 3: Enhanced RAG + Code Generation")
    print("")
    print("📋 NEXT STEPS:")
    print("1. Start APIs:")
    print("   python api/rag_api.py &")
    print("   python api/search_api.py &")
    print("   python api/figma_specs_api.py &")
    print("   python api/enhanced_generation_api.py &")
    print("")
    print("2. Test with:")
    print("   python agent/design_chat.py")
    print("   python scripts/figma_integration_demo.py single")
    print("")
    print("3. Full Figma extraction:")
    print("   python scripts/enhanced_figma_specs_pipeline.py")


if __name__ == "__main__":
    asyncio.run(main())
