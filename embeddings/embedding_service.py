from langchain_community.embeddings import OllamaEmbeddings
from config.settings import settings

class EmbeddingService:

    def __init__(self):

        self.embedder = OllamaEmbeddings(
            model=settings.embed_model,
            base_url=settings.ollama_host,
        )

    def get_embedder(self):

        return self.embedder