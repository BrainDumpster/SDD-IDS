import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from embeddings.embedding_service import EmbeddingService
from ingestion.chunk_builder import build_chunks
from ingestion.mdx_parser import parse_mdx
from pipeline.index_pipeline import IndexPipeline
from storage.document_registry import DocumentRegistry
from utils.file_hash import compute_hash
from vectorstore.qdrant_store import QdrantStore

if __name__ == "__main__":
    # Clear document registry for fresh indexing
    print("🔄 Clearing document registry...")
    registry = DocumentRegistry()
    registry.clear()  # Clear all existing records
    print("✅ Document registry cleared")
    
    pipeline = IndexPipeline()
    # Try the root directory first to see what's available
    repo_path = "content"  # Root directory
    result = pipeline.run(repo_path)
    print(f"🎉 Indexing result: {result}")

    # --- Temporary: index local accordion.mdx for component generation ---
    local_mdx = Path("accordion.mdx")
    if local_mdx.exists():
        print("📎 Temporarily indexing local accordion.mdx...")
        text = local_mdx.read_text(encoding="utf-8")
        file_hash = compute_hash(text)

        if registry.is_changed(str(local_mdx), file_hash):
            sections = parse_mdx(text)
            component = local_mdx.stem
            docs = build_chunks(component, sections, str(local_mdx))

            vector_store = QdrantStore(EmbeddingService().get_embedder())
            vector_store.add_documents(docs)
            registry.update(str(local_mdx), file_hash, len(docs))
            registry.save()
            print(f"✅ Added {len(docs)} docs for accordion")
        else:
            print("⏭️ Skipped accordion.mdx (unchanged)")
    else:
        print("⚠️ accordion.mdx not found locally; skipping temporary indexing")
    # --- End temporary block ---