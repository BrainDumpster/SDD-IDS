from ingestion.github_loader import GithubLoader
from ingestion.mdx_parser import parse_mdx
from ingestion.chunk_builder import build_chunks

from embeddings.embedding_service import EmbeddingService
from vectorstore.qdrant_store import QdrantStore

from storage.document_registry import DocumentRegistry
from utils.file_hash import compute_hash


class IndexPipeline:

    def run(self, repo_path):

        loader = GithubLoader()

        embedder = EmbeddingService().get_embedder()

        vector_store = QdrantStore(embedder)

        registry = DocumentRegistry()

        print(f"🚀 Starting indexing pipeline for: {repo_path}")
        
        files = loader.list_files(repo_path)
        print(f"📁 Found {len(files)} total files")

        mdx_files = [f for f in files if f["name"].endswith(".mdx")]
        print(f"📄 Found {len(mdx_files)} MDX files to process")
        
        if len(mdx_files) == 0:
            print("⚠️ No MDX files found! Check repository path and GitHub settings.")
            return "No files to process"

        processed_count = 0
        for i, f in enumerate(mdx_files):

            print(f"🔄 [{i+1}/{len(mdx_files)}] Processing: {f['path']}")

            try:
                html = loader.fetch_file(f["download_url"])
                print(f"✅ Fetched file: {len(html)} characters")

                file_hash = compute_hash(html)

                if not registry.is_changed(f["path"], file_hash):
                    print(f"⏭️ Skipped {f['path']} (unchanged)")
                    continue

                print(f"🔍 Parsing MDX content...")
                sections = parse_mdx(html)
                print(f"✅ Parsed {len(sections)} sections")

                component = f["name"].replace(".mdx","")

                docs = build_chunks(component, sections, f["path"])
                print(f"✅ Built {len(docs)} document chunks")

                # Skip delete since we're recreating the collection
                # vector_store.delete_component(component)

                print(f"💾 Adding documents to vector store...")
                vector_store.add_documents(docs)
                print(f"✅ Added {len(docs)} documents for {component}")
                
                processed_count += 1
                print(f"📊 Progress: {processed_count}/{len(mdx_files)} files processed")
                
            except Exception as e:
                print(f"❌ Error processing {f['path']}: {e}")
                import traceback
                traceback.print_exc()
                continue

        print(f"🎉 Indexing complete! Processed {processed_count} files")
        return f"Processed {processed_count} files"