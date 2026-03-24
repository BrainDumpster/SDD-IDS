#!/usr/bin/env python3
"""
Figma API Pipeline
Uses the Figma REST API directly to fetch component specifications
"""

import asyncio
import json
import logging
import os
import sys
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configure verbose logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)


class FigmaAPIPipeline:
    """
    Pipeline that uses Figma REST API to fetch specifications
    """
    
    def __init__(self):
        print("🚀 INITIALIZING FIGMA API PIPELINE")
        print("=" * 60)
        
        # Configuration
        self.figma_map_file = "/home/muthu/projects/ids_design_knowledge/data/component-figma-map.json"
        self.output_dir = "/home/muthu/projects/ids_design_knowledge/design-system-knowledge"
        
        print(f"📋 Config file: {self.figma_map_file}")
        print(f"📁 Output dir: {self.output_dir}")
        print("=" * 60)
        
    async def run_pipeline(
        self, 
        batch_size: int = 3,
        skip_existing: bool = True
    ) -> Dict[str, Any]:
        """
        Run the complete Figma specifications pipeline using API
        """
        print("🚀 STARTING FIGMA API PIPELINE")
        print("=" * 70)
        print("📊 PRODUCTION PIPELINE - USING FIGMA REST API")
        print("Will fetch complete design data for all components")
        print("")
        
        # Import the Figma API client
        try:
            from tokens.figma_client import FigmaAPIClient
            print("✅ Figma API client imported")
        except ImportError as e:
            print(f"❌ Failed to import Figma API client: {e}")
            return {"error": str(e)}
        
        # Initialize client
        try:
            client = FigmaAPIClient()
            print("✅ Figma API client initialized")
        except Exception as e:
            print(f"❌ Failed to initialize Figma API client: {e}")
            return {"error": str(e)}
        
        # Load component mappings
        print("📂 Loading component mappings...")
        try:
            with open(self.figma_map_file, 'r') as f:
                component_mappings = json.load(f)
            print(f"✅ Loaded {len(component_mappings)} component mappings")
        except Exception as e:
            print(f"❌ Failed to load mappings: {e}")
            return {"error": str(e)}
        
        # Show sample mappings
        print(f"\n📋 SAMPLE MAPPINGS TO PROCESS:")
        for i, mapping in enumerate(component_mappings[:5]):
            print(f"   {i+1}. {mapping['component']} -> {mapping['nodeId']}")
        
        # Filter existing specs if requested
        if skip_existing:
            print("\n🔍 Checking for existing specs...")
            component_mappings = self._filter_existing_specs(component_mappings)
            print(f"✅ After filtering: {len(component_mappings)} components to process")
        
        # Process in batches
        results = {
            "total_components": len(component_mappings),
            "processed": 0,
            "failed": 0,
            "skipped": 0,
            "specs_generated": [],
            "errors": []
        }
        
        print(f"\n🔄 Starting batch processing (batch size: {batch_size})")
        print("=" * 70)
        
        try:
            for i in range(0, len(component_mappings), batch_size):
                batch = component_mappings[i:i + batch_size]
                batch_num = i//batch_size + 1
                total_batches = (len(component_mappings) + batch_size - 1) // batch_size
                
                print(f"\n📦 BATCH {batch_num}/{total_batches}")
                print(f"   Components: {[m['component'] for m in batch]}")
                print("-" * 50)
                
                start_time = time.time()
                batch_results = await self._process_batch_api(batch, client)
                batch_time = time.time() - start_time
                
                # Update results
                results["processed"] += batch_results["processed"]
                results["failed"] += batch_results["failed"]
                results["specs_generated"].extend(batch_results["specs_generated"])
                results["errors"].extend(batch_results["errors"])
                
                print(f"\n✅ BATCH {batch_num} COMPLETED ({batch_time:.1f}s)")
                print(f"   Processed: {batch_results['processed']}")
                print(f"   Failed: {batch_results['failed']}")
                
                if batch_results["errors"]:
                    print("   Errors:")
                    for error in batch_results["errors"][:3]:  # Show first 3 errors
                        print(f"     - {error}")
        
        finally:
            # Close the client
            print("\n🔌 Closing Figma API client...")
            client.close()
            print("✅ Client closed")
        
        # Generate summary report
        print("\n📊 GENERATING SUMMARY REPORT...")
        self._generate_summary_report(results)
        
        print("\n🎉 FIGMA API PIPELINE COMPLETED!")
        print("=" * 70)
        self._print_final_summary(results)
        
        return results
    
    def _filter_existing_specs(self, component_mappings: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Filter out components that already have specifications"""
        print("   Checking existing JSON spec files...")
        output_path = Path(self.output_dir)
        existing_specs = set()
        
        if output_path.exists():
            for file in output_path.glob("*-api-spec.json"):
                # Extract component name from filename
                component_name = file.stem.replace("-api-spec", "").replace("-", " ").title()
                existing_specs.add(component_name)
                print(f"     Found: {component_name}")
        
        filtered = []
        for mapping in component_mappings:
            if mapping["component"] not in existing_specs:
                filtered.append(mapping)
            else:
                print(f"     Skipping: {mapping['component']} (already exists)")
        
        print(f"   Found {len(existing_specs)} existing specs, filtering them out")
        return filtered
    
    async def _process_batch_api(self, batch: List[Dict[str, str]], client) -> Dict[str, Any]:
        """Process a batch of component mappings using Figma API"""
        batch_results = {
            "processed": 0,
            "failed": 0,
            "specs_generated": [],
            "errors": []
        }
        
        for i, mapping in enumerate(batch):
            component_name = mapping["component"]
            print(f"\n🔄 [{i+1}/{len(batch)}] Processing: {component_name}")
            print(f"   URL: {mapping['figmaUrl'][:50]}...")
            print(f"   Node: {mapping['nodeId']}")
            
            try:
                print("   🎨 Fetching complete Figma specification via API...")
                start_time = time.time()
                
                # Fetch complete Figma specification via API
                figma_spec = await client.get_component_spec(mapping["figmaUrl"])
                
                fetch_time = time.time() - start_time
                print(f"   ✅ Fetched ({fetch_time:.1f}s)")
                
                if figma_spec:
                    print(f"   📝 Got {len(str(figma_spec))} chars of Figma data")
                    
                    # Create comprehensive spec
                    spec = {
                        "name": component_name,
                        "category": mapping.get("category", "Unknown"),
                        "figma_url": mapping["figmaUrl"],
                        "node_id": mapping["nodeId"],
                        "extracted_at": datetime.now().isoformat(),
                        "source": "figma-rest-api",
                        "design_system": "IDS",
                        "has_real_figma_data": True,
                        "figma_spec": figma_spec,  # Include all real Figma data
                        "data_size": len(str(figma_spec)),
                        "component_type": figma_spec.get("type", "Unknown"),
                        "file_key": figma_spec.get("file_key", "Unknown")
                    }
                    
                    print(f"   📝 Generated complete spec: {spec['name']}")
                    
                    # Save JSON spec
                    print("   💾 Saving JSON spec...")
                    await self._save_spec_json(spec)
                    
                    batch_results["specs_generated"].append(component_name)
                    batch_results["processed"] += 1
                    
                    total_time = time.time() - start_time
                    print(f"   ✅ COMPLETED ({total_time:.1f}s total)")
                else:
                    print("   ❌ No spec data received")
                    batch_results["failed"] += 1
                
            except Exception as e:
                error_msg = f"Failed to process {component_name}: {str(e)}"
                print(f"   ❌ ERROR: {error_msg}")
                batch_results["errors"].append(error_msg)
                batch_results["failed"] += 1
        
        return batch_results
    
    async def _save_spec_json(self, spec: Dict[str, Any]) -> None:
        """Save specification as JSON file"""
        output_path = Path(self.output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Create filename
        filename = f"{spec['name'].lower().replace(' ', '-').replace('/', '-')}-api-spec.json"
        file_path = output_path / filename
        
        # Write JSON file
        with open(file_path, 'w') as f:
            json.dump(spec, f, indent=2)
        
        print(f"   💾 Saved: {filename} ({len(str(spec))} chars)")
    
    def _generate_summary_report(self, results: Dict[str, Any]) -> None:
        """Generate summary report"""
        report_path = Path(self.output_dir) / "pipeline-report.md"
        
        report_content = f"""# Figma API Pipeline Report

Generated: {datetime.now().isoformat()}

## Summary
- Total Components: {results['total_components']}
- Processed: {results['processed']}
- Failed: {results['failed']}
- Success Rate: {results['processed'] / results['total_components'] * 100:.1f}%

## Generated Specs
{chr(10).join([f"- {spec}" for spec in results['specs_generated']])}

## Errors
{chr(10).join([f"- {error}" for error in results['errors']])}

## Pipeline Details
- **Source**: Figma REST API
- **Method**: Direct API calls to figma.com/v1
- **Data**: Real Figma design data (nodes, files, styles, components)
- **Format**: JSON specifications with complete design context
- **Authentication**: X-Figma-Token header
"""
        
        with open(report_path, 'w') as f:
            f.write(report_content)
        
        print(f"📄 Report saved: {report_path}")
    
    def _print_final_summary(self, results: Dict[str, Any]) -> None:
        """Print final summary"""
        print(f"📊 FINAL RESULTS:")
        print(f"   Total components: {results['total_components']}")
        print(f"   Successfully processed: {results['processed']}")
        print(f"   Failed: {results['failed']}")
        print(f"   Success rate: {results['processed'] / results['total_components'] * 100:.1f}%")
        
        if results['specs_generated']:
            print(f"\n✅ Generated specs ({len(results['specs_generated'])}):")
            for spec in results['specs_generated'][:5]:  # Show first 5
                print(f"   - {spec}")
            if len(results['specs_generated']) > 5:
                print(f"   ... and {len(results['specs_generated']) - 5} more")
        
        if results['errors']:
            print(f"\n❌ Errors ({len(results['errors'])}):")
            for error in results['errors'][:3]:  # Show first 3 errors
                print(f"   - {error}")
        
        print(f"\n🎉 PIPELINE COMPLETED SUCCESSFULLY!")
        print("=" * 70)
        print(f"📁 All specifications saved to: {self.output_dir}")
        print(f"📊 Ready for enhanced component generation!")


async def main():
    """Main function"""
    print("🚀 FIGMA API PIPELINE")
    print("=" * 70)
    print("🎨 PRODUCTION PIPELINE - USING FIGMA REST API")
    print("Will fetch complete design data for all components")
    print("")
    
    pipeline = FigmaAPIPipeline()
    
    # Run the complete pipeline
    results = await pipeline.run_pipeline(
        batch_size=2,  # Process 2 components at a time
        skip_existing=True
    )
    
    return results


if __name__ == "__main__":
    asyncio.run(main())
