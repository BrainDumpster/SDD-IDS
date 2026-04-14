#!/usr/bin/env python3
"""Index canonical component design-spec sections into Qdrant for RAG search."""

import sys
import asyncio
import re
from pathlib import Path
from typing import List, Dict, Any
import logging

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from sentence_transformers import SentenceTransformer

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
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.collection_name = "component_specs"
        self.section_priority = {
            "Executive Summary": 5,
            "Overview": 5,
            "Purpose & Usage": 5,
            "Anatomy": 4,
            "Layout & Measurements": 4,
            "Typography": 3,
            "Tokens": 5,
            "States (Light Theme)": 4,
            "States (Dark Theme)": 3,
            "Interactions": 4,
            "Accessibility": 5,
            "Variants": 4,
            "Behavior & Guidelines": 4,
            "API & Contract": 5,
            "Implementation Notes": 4,
            "Troubleshooting": 3,
            "Related Links": 2,
        }
        
    async def create_collection(self):
        """Create Qdrant collection for component specs"""
        try:
            # Check if collection exists
            collections = self.qdrant_client.get_collections().collections
            collection_names = [c.name for c in collections]
            
            if self.collection_name not in collection_names:
                self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
                )
                logger.info(f"Created collection: {self.collection_name}")
            else:
                logger.info(f"Collection {self.collection_name} already exists")
        except Exception as e:
            logger.error(f"Error creating collection: {e}")
            
    def _discover_design_spec_paths(self) -> List[Path]:
        """Return paths to ``design-spec.mdx`` for IDS (``components/ids``) and Synapse."""
        found: List[Path] = []
        ids_root = ROOT / "components" / "ids"
        if ids_root.is_dir():
            for component_dir in sorted(ids_root.iterdir()):
                if component_dir.is_dir():
                    spec_file = component_dir / "design-spec.mdx"
                    if spec_file.is_file():
                        found.append(spec_file)
        syn_root = ROOT / "components" / "synapse"
        if syn_root.is_dir():
            for component_dir in sorted(syn_root.iterdir()):
                if component_dir.is_dir():
                    spec_file = component_dir / "design-spec.mdx"
                    if spec_file.is_file():
                        found.append(spec_file)
        # Legacy: flat ``components/<slug>/`` (excluding container dirs)
        legacy_root = ROOT / "components"
        skip = {"synapse", "ids"}
        if legacy_root.is_dir():
            for component_dir in sorted(legacy_root.iterdir()):
                if component_dir.is_dir() and component_dir.name not in skip:
                    spec_file = component_dir / "design-spec.mdx"
                    if spec_file.is_file():
                        found.append(spec_file)
        return found

    def load_component_specs(self) -> List[Dict[str, Any]]:
        """Load all component design specs from local components directory."""
        specs = []
        spec_paths = self._discover_design_spec_paths()
        if not spec_paths:
            logger.warning("No design-spec.mdx files found under components/ids or components/synapse")
            return specs

        for spec_file in spec_paths:
            component_dir = spec_file.parent
            try:
                with open(spec_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Parse metadata from the spec
                metadata = self.parse_metadata(content)

                specs.append({
                    "component": metadata.get("Component", component_dir.name),
                    "category": metadata.get("Category", "Unknown"),
                    "figma_url": metadata.get("Figma", ""),
                    "node_id": metadata.get("Node ID", ""),
                    "content": content,
                    "file_path": str(spec_file),
                    "tokens": self.extract_tokens(content),
                    "states": self.extract_states(content),
                    "accessibility": self.extract_accessibility(content),
                    "variants": self.extract_variants(content)
                })
            except Exception as e:
                logger.error(f"Error loading spec from {spec_file}: {e}")

        logger.info(f"Loaded {len(specs)} component specs")
        return specs
        
    def parse_metadata(self, content: str) -> Dict[str, str]:
        """Parse metadata from MDX content"""
        metadata = {}
        lines = content.split('\n')
        
        in_metadata = False
        for line in lines:
            line = line.strip()
            if line == "## Metadata":
                in_metadata = True
                continue
            elif line.startswith("##") and in_metadata:
                break
            elif in_metadata and line.startswith("-"):
                # Parse metadata items like "- Component: Button"
                parts = line[1:].split(":", 1)
                if len(parts) == 2:
                    key = parts[0].strip()
                    value = parts[1].strip()
                    metadata[key] = value
                    
        return metadata
        
    def extract_tokens(self, content: str) -> List[str]:
        """Extract CSS tokens from content"""
        tokens = []
        lines = content.split('\n')
        
        for line in lines:
            if 'var(--' in line and '=' in line:
                # Extract tokens like "- Brand base: `var(--color-background-controls-brand-base)` = #0076ce"
                if 'var(--' in line:
                    token_start = line.find('var(--')
                    token_end = line.find(')', token_start)
                    if token_end > token_start:
                        token = line[token_start:token_end + 1]
                        tokens.append(token)
                        
        return tokens
        
    def extract_states(self, content: str) -> List[str]:
        """Extract state information from content"""
        states = []
        lines = content.split('\n')
        
        in_states_table = False
        for line in lines:
            if "## States" in line:
                in_states_table = True
                continue
            elif line.startswith("##") and in_states_table:
                break
            elif in_states_table and line.strip():
                states.append(line.strip())
                
        return states
        
    def extract_accessibility(self, content: str) -> List[str]:
        """Extract accessibility information from content"""
        accessibility = []
        lines = content.split('\n')
        
        in_accessibility = False
        for line in lines:
            if "## Accessibility" in line:
                in_accessibility = True
                continue
            elif line.startswith("##") and in_accessibility:
                break
            elif in_accessibility and line.strip().startswith("-"):
                accessibility.append(line.strip())
                
        return accessibility
        
    def extract_variants(self, content: str) -> List[str]:
        """Extract variant information from content"""
        variants = []
        lines = content.split('\n')
        
        in_variants = False
        for line in lines:
            if "## Variants" in line:
                in_variants = True
                continue
            elif line.startswith("##") and in_variants:
                break
            elif in_variants and line.strip().startswith("-"):
                variants.append(line.strip())
                
        return variants
        
    def split_sections(self, content: str) -> List[Dict[str, str]]:
        """Split MDX by H2 headings so retrieval can target sections."""
        sections: List[Dict[str, str]] = []
        current_title = "Document"
        current_lines: List[str] = []
        for line in content.split("\n"):
            if line.startswith("## "):
                if current_lines:
                    sections.append(
                        {"title": current_title, "content": "\n".join(current_lines).strip()}
                    )
                current_title = line[3:].strip()
                current_lines = []
                continue
            current_lines.append(line)
        if current_lines:
            sections.append({"title": current_title, "content": "\n".join(current_lines).strip()})
        return [s for s in sections if s["content"]]

    def create_embedding(self, text: str) -> List[float]:
        """Create embedding for text"""
        return self.embedding_model.encode(text, convert_to_tensor=False).tolist()
        
    async def index_specs(self):
        """Index component specs into Qdrant"""
        await self.create_collection()
        
        specs = self.load_component_specs()
        
        points = []
        point_id = 1
        for spec in specs:
            for section in self.split_sections(spec["content"]):
                title = section["title"]
                priority = self.section_priority.get(title, 1)
                searchable_text = (
                    f"Component: {spec['component']}\n"
                    f"Category: {spec['category']}\n"
                    f"Section: {title}\n"
                    f"Priority: {priority}\n"
                    f"Content: {section['content'][:2000]}"
                )
                embedding = self.create_embedding(searchable_text)
                point = PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload={
                        "component": spec["component"],
                        "category": spec["category"],
                        "section": title,
                        "section_priority": priority,
                        "doc_type": "canonical_design_spec",
                        "figma_url": spec["figma_url"],
                        "node_id": spec["node_id"],
                        "content": section["content"],
                        "file_path": spec["file_path"],
                        "tokens": spec["tokens"],
                        "states": spec["states"],
                        "accessibility": spec["accessibility"],
                        "variants": spec["variants"],
                    },
                )
                points.append(point)
                point_id += 1
            
        # Index points in batches
        batch_size = 10
        for i in range(0, len(points), batch_size):
            batch = points[i:i + batch_size]
            self.qdrant_client.upsert(
                collection_name=self.collection_name,
                points=batch
            )
            logger.info(f"Indexed batch {i//batch_size + 1}/{(len(points) + batch_size - 1)//batch_size}")
            
        logger.info(f"Successfully indexed {len(points)} section chunks from component specs")

async def main():
    """Main function"""
    indexer = ComponentSpecIndexer()
    await indexer.index_specs()
    print("Component specs indexing completed!")

if __name__ == "__main__":
    asyncio.run(main())
