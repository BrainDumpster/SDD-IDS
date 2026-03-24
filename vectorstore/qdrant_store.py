from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from langchain_community.vectorstores import Qdrant
from config.settings import settings

class QdrantStore:

    def __init__(self, embedder):

        # Use proper Qdrant client initialization with host and port
        client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
            https=False,
        )
        self.collection_name = settings.qdrant_collection

        print(f"🔍 Initializing QdrantStore for collection: {self.collection_name}")
        print(f"🔍 Qdrant connection: {settings.qdrant_host}:{settings.qdrant_port}")

        # Check if collection exists, create only if it doesn't exist
        try:
            collections = client.get_collections().collections
            print(f"🔍 Found {len(collections)} collections: {[c.name for c in collections]}")
            
            collection_exists = any(
                collection.name == self.collection_name 
                for collection in collections
            )
            
            if not collection_exists:
                print(f"🆕 Creating collection '{self.collection_name}' with 768 dimensions...")
                client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=768, distance=Distance.COSINE)
                )
                print(f"✅ Collection '{self.collection_name}' created successfully")
            else:
                print(f"♻️ Collection '{self.collection_name}' already exists, reusing it")
                
                # Get collection info to show it's working
                try:
                    collection_info = client.get_collection(self.collection_name)
                    print(f"📊 Collection info: {collection_info.points_count} points")
                except Exception as info_error:
                    print(f"⚠️ Could not get collection info: {info_error}")
                
        except Exception as e:
            print(f"❌ Error checking/creating collection: {e}")
            # Fallback: try to create collection
            try:
                print(f"🔄 Attempting to create collection '{self.collection_name}'...")
                client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=768, distance=Distance.COSINE)
                )
                print(f"✅ Collection '{self.collection_name}' created successfully")
            except Exception as create_error:
                print(f"❌ Failed to create collection: {create_error}")
                raise

        self.store = Qdrant(
            client=client,
            collection_name=self.collection_name,
            embeddings=embedder
        )

    def add_documents(self, docs):

        print(f"📝 Adding {len(docs)} documents to collection '{self.collection_name}'")
        try:
            self.store.add_documents(docs)
            print(f"✅ Successfully added {len(docs)} documents")
        except Exception as e:
            print(f"❌ Error adding documents: {e}")
            raise
    
    def delete_component(self, component):
        self.store.delete(
            collection_name=self.collection_name,
            points_selector={
                "filter": {
                    "must": [
                        {"key": "component", "match": {"value": component}}
                    ]
                }
            }
        )

    def get_store(self):

        return self.store