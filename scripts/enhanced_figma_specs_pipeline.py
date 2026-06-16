#!/usr/bin/env python3
"""
Enhanced Figma Specifications Generation Pipeline
Automated batch processing of component specifications from Figma
"""

import asyncio
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

from tokens.figma_spec_extractor import FigmaSpecExtractor, ComponentSpec, generate_all_specs
from embeddings.embedding_service import EmbeddingService
from vectorstore.qdrant_store import QdrantStore
from storage.document_registry import DocumentRegistry
from utils.file_hash import compute_hash


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class EnhancedSpecPipeline:
    """
    Enhanced pipeline for generating and indexing Figma component specifications
    """
    
    def __init__(self):
        self.extractor = FigmaSpecExtractor()
        self.embedder = EmbeddingService().get_embedder()
        self.vector_store = QdrantStore(self.embedder)
        self.registry = DocumentRegistry()
        
        # Configuration
        self.figma_map_file = "/home/muthu/projects/ids_design_knowledge/data/component-figma-map.json"
        self.output_dir = "/home/muthu/projects/ids_design_knowledge/design-system-knowledge"
        self.spec_collection_name = "figma_specs"
        
    async def run_pipeline(
        self, 
        batch_size: int = 10,
        skip_existing: bool = True
    ) -> Dict[str, Any]:
        """
        Run the complete specification pipeline
        
        Args:
            batch_size: Number of components to process in each batch
            skip_existing: Whether to skip components that already have specs
            
        Returns:
            Pipeline execution results
        """
        logger.info("🚀 Starting Enhanced Figma Specs Pipeline")
        
        # Load component mappings
        with open(self.figma_map_file, 'r') as f:
            component_mappings = json.load(f)
        
        logger.info(f"📋 Found {len(component_mappings)} component mappings")
        
        # Filter existing specs if requested
        if skip_existing:
            component_mappings = self._filter_existing_specs(component_mappings)
            logger.info(f"📋 After filtering: {len(component_mappings)} components to process")
        
        # Process in batches
        results = {
            "total_components": len(component_mappings),
            "processed": 0,
            "failed": 0,
            "skipped": 0,
            "specs_generated": [],
            "errors": []
        }
        
        for i in range(0, len(component_mappings), batch_size):
            batch = component_mappings[i:i + batch_size]
            logger.info(f"🔄 Processing batch {i//batch_size + 1}: {len(batch)} components")
            
            batch_results = await self._process_batch(batch)
            
            # Update results
            results["processed"] += batch_results["processed"]
            results["failed"] += batch_results["failed"]
            results["specs_generated"].extend(batch_results["specs_generated"])
            results["errors"].extend(batch_results["errors"])
            
            logger.info(f"✅ Batch completed: {batch_results['processed']} processed, {batch_results['failed']} failed")
        
        # Generate summary report
        self._generate_summary_report(results)
        
        logger.info("🎉 Enhanced Figma Specs Pipeline completed")
        return results
    
    def _filter_existing_specs(self, component_mappings: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Filter out components that already have specifications"""
        output_path = Path(self.output_dir)
        existing_specs = set()
        
        if output_path.exists():
            for file in output_path.glob("*-spec.md"):
                # Extract component name from filename
                component_name = file.stem.replace("-spec", "").replace("-", " ").title()
                existing_specs.add(component_name)
        
        filtered = []
        for mapping in component_mappings:
            if mapping["component"] not in existing_specs:
                filtered.append(mapping)
        
        logger.info(f"📝 Found {len(existing_specs)} existing specs, filtering them out")
        return filtered
    
    async def _process_batch(self, batch: List[Dict[str, str]]) -> Dict[str, Any]:
        """Process a batch of component mappings"""
        batch_results = {
            "processed": 0,
            "failed": 0,
            "specs_generated": [],
            "errors": []
        }
        
        for mapping in batch:
            try:
                spec = await self._generate_single_spec(mapping)
                if spec:
                    # Save MDX file
                    await self._save_spec_mdx(spec)
                    
                    # Index in vector store
                    await self._index_spec(spec)
                    
                    batch_results["specs_generated"].append(spec.name)
                    batch_results["processed"] += 1
                    
                    logger.info(f"✅ Generated spec for {spec.name}")
                
            except Exception as e:
                error_msg = f"Failed to process {mapping['component']}: {str(e)}"
                batch_results["errors"].append(error_msg)
                batch_results["failed"] += 1
                logger.error(f"❌ {error_msg}")
        
        return batch_results
    
    async def _generate_single_spec(self, mapping: Dict[str, str]) -> Optional[ComponentSpec]:
        """Generate specification for a single component"""
        spec = await self.extractor.extract_component_spec(
            component_name=mapping["component"],
            figma_url=mapping["figmaUrl"],
            node_id=mapping["nodeId"],
            category=mapping.get("category", "Unknown")
        )
        
        return spec
    
    async def _save_spec_mdx(self, spec: ComponentSpec) -> None:
        """Save specification as MDX file"""
        output_path = Path(self.output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Generate MDX content
        mdx_content = self.extractor.spec_to_mdx(spec)
        
        # Create filename
        filename = f"{spec.name.lower().replace(' ', '-').replace('/', '-')}-spec.md"
        file_path = output_path / filename
        
        # Add metadata header
        metadata = f"""---
component: {spec.name}
category: {spec.category}
figma_url: {spec.figma_url}
node_id: {spec.node_id}
generated_at: {datetime.now().isoformat()}
spec_version: 1.0
---

"""
        
        full_content = metadata + mdx_content
        
        # Write file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(full_content)
        
        logger.debug(f"💾 Saved spec: {file_path}")
    
    async def _index_spec(self, spec: ComponentSpec) -> None:
        """Index specification in vector store for RAG"""
        # Convert spec to searchable text
        searchable_content = self._spec_to_searchable_text(spec)
        
        # Create document chunks
        chunks = self._create_chunks(spec, searchable_content)
        
        # Add to vector store
        if chunks:
            self.vector_store.add_documents(chunks)
            logger.debug(f"🔍 Indexed {len(chunks)} chunks for {spec.name}")
    
    def _spec_to_searchable_text(self, spec: ComponentSpec) -> str:
        """Convert specification to searchable text"""
        content_parts = [
            f"Component: {spec.name}",
            f"Category: {spec.category}",
            f"Overview: {spec.usage_guidelines or ''}",
        ]
        
        if spec.anatomy:
            content_parts.append("Anatomy:")
            for part in spec.anatomy:
                content_parts.append(f"- {part['name']}: {part['type']}")
        
        if spec.width and spec.height:
            content_parts.append(f"Dimensions: {spec.width}x{spec.height}px")
        
        if spec.padding:
            content_parts.append(f"Padding: {spec.padding}")
        
        if spec.font_family:
            content_parts.append(f"Font: {spec.font_family} {spec.font_size or ''}px")
        
        if spec.states:
            content_parts.append("States:")
            for state in spec.states:
                content_parts.append(f"- {state['name']}: {state['type']}")
        
        if spec.design_tokens:
            content_parts.append("Design Tokens:")
            for token in spec.design_tokens:
                content_parts.append(f"- {token['name']}: {token['value']}")
        
        return "\n".join(content_parts)
    
    def _create_chunks(self, spec: ComponentSpec, content: str) -> List[Dict[str, Any]]:
        """Create document chunks for vector storage"""
        chunks = []
        
        # Create metadata
        metadata = {
            "component": spec.name,
            "category": spec.category,
            "source": f"figma-spec-{spec.name.lower().replace(' ', '-')}",
            "type": "figma_spec",
            "figma_url": spec.figma_url,
            "node_id": spec.node_id,
            "generated_at": datetime.now().isoformat()
        }
        
        # Split content into chunks (simple approach for now)
        chunk_size = 1000
        for i in range(0, len(content), chunk_size):
            chunk_content = content[i:i + chunk_size]
            
            chunk = {
                "page_content": chunk_content,
                "metadata": metadata.copy()
            }
            chunks.append(chunk)
        
        return chunks
    
    def _generate_summary_report(self, results: Dict[str, Any]) -> None:
        """Generate a summary report of the pipeline execution"""
        report = f"""
# Figma Specification Pipeline Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary
- Total Components: {results['total_components']}
- Successfully Processed: {results['processed']}
- Failed: {results['failed']}
- Success Rate: {(results['processed'] / results['total_components'] * 100):.1f}%

## Generated Specifications
"""
        
        for spec_name in results['specs_generated']:
            report += f"- ✅ {spec_name}\n"
        
        if results['errors']:
            report += "\n## Errors\n"
            for error in results['errors']:
                report += f"- ❌ {error}\n"
        
        # Save report
        report_path = Path(self.output_dir) / "pipeline-report.md"
        with open(report_path, 'w') as f:
            f.write(report)
        
        logger.info(f"📊 Pipeline report saved to {report_path}")
    
    async def regenerate_spec(self, component_name: str) -> bool:
        """
        Regenerate specification for a single component
        
        Args:
            component_name: Name of component to regenerate
            
        Returns:
            True if successful, False otherwise
        """
        logger.info(f"🔄 Regenerating spec for {component_name}")
        
        # Find component mapping
        with open(self.figma_map_file, 'r') as f:
            component_mappings = json.load(f)
        
        mapping = None
        for m in component_mappings:
            if m["component"] == component_name:
                mapping = m
                break
        
        if not mapping:
            logger.error(f"Component {component_name} not found in mapping")
            return False
        
        try:
            # Generate new spec
            spec = await self._generate_single_spec(mapping)
            
            # Save and index
            await self._save_spec_mdx(spec)
            await self._index_spec(spec)
            
            logger.info(f"✅ Successfully regenerated spec for {component_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to regenerate spec for {component_name}: {e}")
            return False
    
    async def sync_all_specs(self) -> Dict[str, Any]:
        """
        Synchronize all specifications with latest Figma designs
        
        Returns:
            Sync operation results
        """
        logger.info("🔄 Starting full specification sync")
        
        # Run pipeline without skipping existing
        return await self.run_pipeline(skip_existing=False)


# CLI interface
async def main():
    """Main CLI interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Enhanced Figma Specs Pipeline")
    parser.add_argument("--batch-size", type=int, default=10, help="Batch size for processing")
    parser.add_argument("--skip-existing", action="store_true", help="Skip existing specifications")
    parser.add_argument("--regenerate", type=str, help="Regenerate specific component")
    parser.add_argument("--sync-all", action="store_true", help="Sync all specifications")
    
    args = parser.parse_args()
    
    pipeline = EnhancedSpecPipeline()
    
    if args.regenerate:
        success = await pipeline.regenerate_spec(args.regenerate)
        print(f"Regeneration {'successful' if success else 'failed'}")
    
    elif args.sync_all:
        results = await pipeline.sync_all_specs()
        print(f"Sync completed: {results['processed']}/{results['total_components']} processed")
    
    else:
        results = await pipeline.run_pipeline(
            batch_size=args.batch_size,
            skip_existing=args.skip_existing
        )
        print(f"Pipeline completed: {results['processed']}/{results['total_components']} processed")


if __name__ == "__main__":
    asyncio.run(main())
