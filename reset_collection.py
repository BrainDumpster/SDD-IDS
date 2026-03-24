#!/usr/bin/env python3
"""
Reset Qdrant collection and re-index data
"""

import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent))

from qdrant_client import QdrantClient
from config.settings import settings
from pipeline.index_pipeline import IndexPipeline

def reset_and_reindex():
    print("🔄 Resetting Qdrant collection...")
    
    # Connect to Qdrant
    client = QdrantClient(host=settings.qdrant_host, port=settings.qdrant_port)
    collection_name = settings.qdrant_collection or "design_knowledge"
    
    try:
        # Delete existing collection
        client.delete_collection(collection_name)
        print(f"✅ Deleted collection: {collection_name}")
    except Exception as e:
        print(f"⚠️ Collection deletion failed (might not exist): {e}")
    
    # Run indexing pipeline
    print("🚀 Starting indexing pipeline...")
    pipeline = IndexPipeline()
    
    try:
        # Index the content directory
        repo_path = "content"
        result = pipeline.run(repo_path)
        print(f"✅ Indexing completed: {result}")
        
        # Verify the collection
        collection_info = client.get_collection(collection_name)
        print(f"✅ Collection now has {collection_info.points_count} points")
        
        # Sample some documents
        sample_docs = client.scroll(collection_name, limit=3, with_payload=True)[0]
        print("📄 Sample documents:")
        for i, doc in enumerate(sample_docs):
            payload = doc.payload
            source = payload.get("metadata", {}).get("source", "No source")
            content = payload.get("page_content", "")[:50]
            print(f"  {i+1}. {source}")
            print(f"     {content}...")
        
    except Exception as e:
        print(f"❌ Indexing failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    reset_and_reindex()
