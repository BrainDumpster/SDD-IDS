from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

from qdrant_client import QdrantClient
from embeddings.embedding_service import EmbeddingService
from config.settings import settings


app = FastAPI(
    title="Design System Search API",
    description="Search API for website - uses Qdrant instead of GitHub API"
)

# Initialize Qdrant client and embeddings
client = QdrantClient(host=settings.qdrant_host, port=settings.qdrant_port, https=False)
embedder = EmbeddingService().get_embedder()


class SearchRequest(BaseModel):
    query: str
    top_k: int = 10


class SearchResult(BaseModel):
    name: str
    link: str


class SearchResponse(BaseModel):
    results: List[SearchResult]


@app.post("/design/search", response_model=SearchResponse)
def search_design_system(request: SearchRequest):
    """
    Search design system content using Qdrant instead of GitHub API.
    Returns results in the same format as the existing GitHub search API.
    """
    
    import time
    search_id = int(time.time() * 1000)
    print(f"\n🔍 [{search_id}] Search query: '{request.query}'")
    print(f"🔍 [{search_id}] Top k: {request.top_k}")
    
    # Test embedding generation
    try:
        query_embedding = embedder.embed_query(request.query)
        print(f"✅ [{search_id}] Embedding generated successfully")
        print(f"✅ [{search_id}] Embedding length: {len(query_embedding)}")
        print(f"✅ [{search_id}] First 5 values: {query_embedding[:5]}")
        print(f"✅ [{search_id}] Last 5 values: {query_embedding[-5:]}")
        
        # Check if embedding is all zeros (indicates problem)
        if all(abs(x) < 0.001 for x in query_embedding):
            print(f"⚠️ [{search_id}] WARNING: Embedding appears to be all zeros!")
            print(f"⚠️ [{search_id}] This indicates Ollama embedding service is not working properly")
            
    except Exception as e:
        print(f"❌ [{search_id}] Embedding generation failed: {e}")
        print(f"❌ [{search_id}] Stack trace: {type(e).__name__}: {e}")
        return SearchResponse(results=[])
    
    # Search Qdrant directly with higher limit to get diverse results
    try:
        print(f"🔍 [{search_id}] Searching Qdrant collection...")
        # Get more results initially to filter for diversity
        search_results = client.search(
            collection_name=settings.qdrant_collection or "design_knowledge",
            query_vector=query_embedding,
            limit=request.top_k * 5,  # Get 5x more to analyze ranking
            with_payload=True,
            with_vectors=False
        )
        print(f"✅ [{search_id}] Found {len(search_results)} raw results from Qdrant")
        
        # Analyze ranking quality
        print(f"📊 [{search_id}] Top {min(10, len(search_results))} results by score:")
        for i, result in enumerate(search_results[:10]):
            payload = result.payload
            if "metadata" in payload and isinstance(payload["metadata"], dict):
                source = payload["metadata"].get("source", "Unknown")
                content = payload.get("page_content", "")[:50]
                print(f"   {i+1}. [{result.score:.4f}] {source}")
                print(f"      {content}...")
        
        # Filter results to ensure diversity (avoid same source multiple times)
        filtered_results = []
        seen_sources = set()
        
        for result in search_results:
            payload = result.payload
            if "metadata" in payload and isinstance(payload["metadata"], dict):
                source_path = payload["metadata"].get("source")
                if source_path and source_path not in seen_sources:
                    filtered_results.append(result)
                    seen_sources.add(source_path)
                    
                    # Stop when we have enough diverse results
                    if len(filtered_results) >= request.top_k:
                        break
        
        search_results = filtered_results
        print(f"✅ [{search_id}] Filtered to {len(search_results)} diverse results")
        
        # Analyze results
        if len(search_results) == 0:
            print(f"⚠️ [{search_id}] No results found - collection might be empty or search failed")
            return SearchResponse(results=[])
            
        # Print detailed info about first few results
        for i, result in enumerate(search_results[:3]):
            print(f"📄 [{search_id}] Result {i+1}:")
            print(f"   Score: {result.score:.6f}")
            print(f"   ID: {result.id}")
            payload = result.payload
            print(f"   Payload keys: {list(payload.keys())}")
            
            if "metadata" in payload and isinstance(payload["metadata"], dict):
                metadata = payload["metadata"]
                source_path = metadata.get("source")
                print(f"   Source: {source_path}")
                content = payload.get("page_content", "")
                print(f"   Content preview: {content[:50]}...")
            else:
                print(f"   ❌ No valid metadata found")
        
        # Check if all scores are identical (indicates embedding problem)
        if len(search_results) > 1:
            scores = [r.score for r in search_results]
            if all(abs(score - scores[0]) < 0.001 for score in scores):
                print(f"⚠️ [{search_id}] WARNING: All scores are identical ({scores[0]:.6f})")
                print(f"⚠️ [{search_id}] This strongly indicates embedding generation is not working")
        
    except Exception as e:
        print(f"❌ [{search_id}] Qdrant search failed: {e}")
        print(f"❌ [{search_id}] Stack trace: {type(e).__name__}: {e}")
        return SearchResponse(results=[])
    
    # Convert to website search format
    results = []
    seen_sources = set()  # Avoid duplicates (double-check)
    
    for i, result in enumerate(search_results):
        payload = result.payload
        
        if "metadata" in payload and isinstance(payload["metadata"], dict):
            metadata = payload["metadata"]
            source_path = metadata.get("source")
            
            if source_path and source_path not in seen_sources:
                # Extract meaningful name from content
                content = payload.get("page_content", "")
                
                # Try to extract a better name
                name = extract_meaningful_name(content, source_path)
                
                # Create result in website format
                search_result = SearchResult(
                    name=name,
                    link=source_path  # This matches the GitHub file path
                )
                results.append(search_result)
                seen_sources.add(source_path)
                print(f"✅ [{search_id}] Added result: {source_path} -> {name}")
        else:
            print(f"❌ [{search_id}] Skipped result {i+1} - no valid metadata")
    
    print(f"🎯 [{search_id}] Final results: {len(results)} items")
    print(f"🎯 [{search_id}] Sources found: {list(seen_sources)}")
    
    return SearchResponse(results=results)


def extract_meaningful_name(content, source_path):
    """Extract a meaningful name from content or source path"""
    
    # Try to get title from content
    lines = content.split('\n')
    
    # Look for markdown headers (# Title)
    for line in lines:
        line = line.strip()
        if line.startswith('# '):
            return line.replace('# ', '').strip()
        elif line.startswith('## '):
            return line.replace('## ', '').strip()
    
    # Look for title-like patterns
    for line in lines[:10]:  # Check first 10 lines
        line = line.strip()
        if len(line) > 10 and len(line) < 100:
            # Skip very short or very long lines
            if not line.startswith('```') and not line.startswith('<') and not line.startswith('*'):
                return line
    
    # Fallback to source path
    if source_path:
        # Extract meaningful name from path
        path_parts = source_path.split('/')
        if len(path_parts) > 1:
            # Get the folder name (component name)
            component = path_parts[-2]
            # Convert to title case
            name = component.replace('-', ' ').replace('_', ' ').title()
            return name
    
    # Last resort
    return content[:50] + "..." if len(content) > 50 else content


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "search-api"}


@app.get("/debug")
def debug_system():
    """Debug endpoint to test system components"""
    import time
    
    debug_info = {
        "timestamp": int(time.time() * 1000),
        "components": {}
    }
    
    # Test Qdrant connection
    try:
        collections = client.get_collections()
        debug_info["components"]["qdrant"] = {
            "status": "connected",
            "collections": [c.name for c in collections.collections]
        }
        
        # Check our collection
        collection_info = client.get_collection(settings.qdrant_collection or "design_knowledge")
        debug_info["components"]["collection"] = {
            "name": settings.qdrant_collection or "design_knowledge",
            "points": collection_info.points_count,
            "status": "found"
        }
        
        # Sample some documents to see what's actually in the collection
        sample_docs = client.scroll(
            collection_name=settings.qdrant_collection or "design_knowledge",
            limit=5,
            with_payload=True
        )[0]
        
        debug_info["components"]["sample_documents"] = []
        for i, doc in enumerate(sample_docs):
            payload = doc.payload
            doc_info = {
                "id": str(doc.id),
                "content_preview": payload.get("page_content", "")[:100] + "...",
                "metadata": payload.get("metadata", {}),
                "source": payload.get("metadata", {}).get("source", "No source")
            }
            debug_info["components"]["sample_documents"].append(doc_info)
        
    except Exception as e:
        debug_info["components"]["qdrant"] = {
            "status": "error",
            "error": str(e)
        }
    
    # Test embeddings
    try:
        test_query = "accordion usage"
        embedding = embedder.embed_query(test_query)
        debug_info["components"]["embeddings"] = {
            "status": "working",
            "test_query": test_query,
            "embedding_length": len(embedding),
            "sample_values": embedding[:3]
        }
        
        # Check for zero embedding
        if all(abs(x) < 0.001 for x in embedding):
            debug_info["components"]["embeddings"]["warning"] = "Embedding appears to be all zeros!"
            
    except Exception as e:
        debug_info["components"]["embeddings"] = {
            "status": "error",
            "error": str(e)
        }
    
    # Test sample search
    try:
        test_embedding = embedder.embed_query("datagrid")
        search_results = client.search(
            collection_name=settings.qdrant_collection or "design_knowledge",
            query_vector=test_embedding,
            limit=10,  # Get more results to see what's available
            with_payload=True
        )
        
        debug_info["components"]["search_test"] = {
            "status": "working",
            "results_found": len(search_results),
            "top_score": search_results[0].score if search_results else None,
            "sample_sources": [],
            "all_scores": [r.score for r in search_results]
        }
        
        print(f"🔍 Debug search for 'datagrid' found {len(search_results)} results:")
        for result in search_results:
            payload = result.payload
            if "metadata" in payload and isinstance(payload["metadata"], dict):
                source = payload["metadata"].get("source")
                content = payload.get("page_content", "")
                if source:
                    debug_info["components"]["search_test"]["sample_sources"].append({
                        "source": source,
                        "content_preview": content[:50] + "...",
                        "score": result.score
                    })
                    print(f"  - {source} (score: {result.score:.4f})")
                    
    except Exception as e:
        debug_info["components"]["search_test"] = {
            "status": "error",
            "error": str(e)
        }
    
    return debug_info


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
