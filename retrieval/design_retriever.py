from typing import Optional, List
from langchain_community.vectorstores import Qdrant
from qdrant_client import QdrantClient
from langchain_core.documents import Document

from config.settings import settings
from embeddings.embedding_service import EmbeddingService


class CustomQdrantStore(Qdrant):
    """Maps Qdrant payload content → page_content"""

    def _document_from_scored_point(
        self, scored_point, collection_name, content_payload_key, metadata_payload_key
    ):
        payload = scored_point.payload or {}

        page_content = payload.get("page_content", "") or payload.get("content", "")
        
        # Handle nested metadata structure
        metadata = {}
        if "metadata" in payload and isinstance(payload["metadata"], dict):
            # Extract from nested metadata
            metadata = payload["metadata"]
        else:
            # Extract all non-content fields as metadata
            metadata = {k: v for k, v in payload.items() if k not in ["content", "page_content"]}

        return Document(page_content=page_content, metadata=metadata)


class DesignRetriever:

    def __init__(self, collection_name=None):

        embedder = EmbeddingService().get_embedder()

        client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
            https=False,
        )

        # Allow explicit override; otherwise use settings (which may be
        # design-system-aware via design_system_config).
        resolved_collection = collection_name or settings.qdrant_collection or "design_knowledge"

        self.vector_store = CustomQdrantStore(
            client=client,
            collection_name=resolved_collection,
            embeddings=embedder
        )

    # Backward compatible retriever
    def get_retriever(self):
        return self.vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 5}
        )

    # 🔹 NEW: Hybrid retrieval with metadata filters
    def search(
        self,
        query: str,
        component: Optional[str] = None,
        section: Optional[str] = None,
        doc_type: Optional[str] = None,
        top_k: int = 8
    ) -> List[Document]:

        filters = []

        if component:
            filters.append({
                "key": "component",
                "match": {"value": component}
            })

        if section:
            filters.append({
                "key": "section",
                "match": {"value": section}
            })

        if doc_type:
            filters.append({
                "key": "doc_type",
                "match": {"value": doc_type}
            })

        qdrant_filter = {"must": filters} if filters else None

        return self.vector_store.similarity_search(
            query=query,
            k=top_k,
            filter=qdrant_filter
        )