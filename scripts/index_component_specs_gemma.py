#!/usr/bin/env python3
"""
Index component design specs into Qdrant for RAG search using embeddinggemma
"""

import os
import sys
import json
import asyncio
from pathlib import Path
from typing import List, Dict, Any
import logging
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from config.settings import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ComponentSpecIndexer:
    def __init__(self):
        self.qdrant_client = QdrantClient(
            host=settings.qdrant_host or "localhost",
            port=settings.qdrant_port,
        )
        self.collection_name = "component_specs"
        # embeddinggemma typically produces 768-dimensional vectors
        self.vector_size = 768
        
    async def create_collection(self):
        """Create Qdrant collection for component specs"""
        try:
            # Check if collection exists
            collections = self.qdrant_client.get_collections().collections
            collection_names = [c.name for c in collections]
            
            if self.collection_name not in collection_names:
                self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE)
                )
                logger.info(f"Created collection: {self.collection_name}")
            else:
                logger.info(f"Collection {self.collection_name} already exists")
        except Exception as e:
            logger.error(f"Error creating collection: {e}")
            
    def get_embedding(self, text: str) -> List[float]:
        """Get embedding using embeddinggemma"""
        try:
            # Create a temporary file with the text
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
                f.write(text)
                temp_file = f.name
            
            # Run embeddinggemma
            result = subprocess.run(
                ['embeddinggemma', temp_file],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Parse the output (assuming it returns space-separated values)
            embedding = [float(x) for x in result.stdout.strip().split()]
            
            # Clean up temp file
            os.unlink(temp_file)
            
            return embedding
            
        except Exception as e:
            logger.error(f"Error getting embedding: {e}")
            # Return zero vector as fallback
            return [0.0] * self.vector_size
            
    def load_component_specs(self) -> List[Dict[str, Any]]:
        """Load all component design specs from the components directory"""
        specs = []
        components_dir = Path("/home/muthu/projects/AI/CascadeProjects/windsurf-project/components")
        
        for component_dir in components_dir.iterdir():
            if not component_dir.is_dir():
                continue
                
            design_spec_file = component_dir / "design-spec.mdx"
            if not design_spec_file.exists():
                continue
                
            try:
                with open(design_spec_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Extract metadata from the content
                metadata = self.extract_metadata(content, component_dir.name)
                
                specs.append({
                    "id": len(specs) + 1,
                    "component": component_dir.name,
                    "content": content,
                    "metadata": metadata
                })
                
            except Exception as e:
                logger.error(f"Error loading spec for {component_dir.name}: {e}")
                
        logger.info(f"Loaded {len(specs)} component specs")
        return specs
        
    def extract_metadata(self, content: str, component_name: str) -> Dict[str, Any]:
        """Extract metadata from MDX content"""
        metadata = {"component": component_name}
        
        lines = content.split('\n')
        for line in lines:
            if line.startswith('## Metadata'):
                # Extract metadata from the following lines
                metadata_section = []
                i = lines.index(line) + 1
                while i < len(lines) and not lines[i].startswith('##'):
                    metadata_section.append(lines[i])
                    i += 1
                
                for meta_line in metadata_section:
                    if ':' in meta_line and not meta_line.startswith(' '):
                        key, value = meta_line.split(':', 1)
                        key = key.strip().replace(' ', '_').lower()
                        value = value.strip()
                        metadata[key] = value
                        
                break
                
        return metadata
        
    async def index_specs(self, specs: List[Dict[str, Any]]):
        """Index component specs into Qdrant"""
        try:
            points = []
            
            for spec in specs:
                # Combine content and metadata for embedding
                text_to_embed = f"{spec['component']}: {spec['metadata'].get('category', '')}. {spec['content'][:1000]}"
                
                # Get embedding
                embedding = self.get_embedding(text_to_embed)
                
                point = PointStruct(
                    id=spec['id'],
                    vector=embedding,
                    payload={
                        "component": spec['component'],
                        "content": spec['content'],
                        "metadata": spec['metadata']
                    }
                )
                points.append(point)
                
            # Batch insert points
            batch_size = 10
            for i in range(0, len(points), batch_size):
                batch = points[i:i + batch_size]
                self.qdrant_client.upsert(
                    collection_name=self.collection_name,
                    points=batch
                )
                logger.info(f"Indexed batch {i//batch_size + 1}/{(len(points) + batch_size - 1)//batch_size}")
                
            logger.info(f"Successfully indexed {len(points)} component specs")
            
        except Exception as e:
            logger.error(f"Error indexing specs: {e}")
            
    async def run(self):
        """Run the indexing process"""
        logger.info("Starting component spec indexing...")
        
        # Create collection
        await self.create_collection()
        
        # Load specs
        specs = self.load_component_specs()
        
        if not specs:
            logger.warning("No component specs found to index")
            return
            
        # Index specs
        await self.index_specs(specs)
        
        logger.info("Indexing completed successfully!")

async def main():
    indexer = ComponentSpecIndexer()
    await indexer.run()

if __name__ == "__main__":
    asyncio.run(main())
