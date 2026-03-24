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

        page_content = payload.get("content", "")
        metadata = {k: v for k, v in payload.items() if k != "content"}

        return Document(page_content=page_content, metadata=metadata)


class DesignRetriever:

    def __init__(self):

        embedder = EmbeddingService().get_embedder()

        client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
        )

        self.vector_store = CustomQdrantStore(
            client=client,
            collection_name=settings.qdrant_collection or "design_knowledge",
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