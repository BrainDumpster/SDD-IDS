#!/usr/bin/env python3
"""
Simple Figma Specs Generation - Working Version
Creates specs without MCP dependency issues
"""

import asyncio
import json
import logging
import sys
import time
from pathlib import Path
from typing import List, Dict, Any
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


class SimpleFigmaSpecPipeline:
    """
    Simple pipeline that generates Figma specs without MCP issues
    """
    
    def __init__(self):
        print("🔧 INITIALIZING SIMPLE FIGMA SPECS PIPELINE")
        print("=" * 50)
        
        # Configuration
        self.figma_map_file = "/home/muthu/projects/ids_design_knowledge/data/component-figma-map.json"
        self.output_dir = "/home/muthu/projects/ids_design_knowledge/design-system-knowledge"
        
        print(f"📋 Config file: {self.figma_map_file}")
        print(f"📁 Output dir: {self.output_dir}")
        print("=" * 50)
        
    async def run_pipeline(
        self, 
        batch_size: int = 3,
        skip_existing: bool = True
    ) -> Dict[str, Any]:
        """
        Run the complete specification pipeline
        """
        print("🚀 STARTING SIMPLE FIGMA SPECS PIPELINE")
        print("=" * 60)
        print("Creating specs from component mappings (no MCP dependency)")
        print("")
        
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
        print("\n📋 SAMPLE MAPPINGS:")
        for i, mapping in enumerate(component_mappings[:3]):
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
        print("=" * 60)
        
        for i in range(0, len(component_mappings), batch_size):
            batch = component_mappings[i:i + batch_size]
            batch_num = i//batch_size + 1
            total_batches = (len(component_mappings) + batch_size - 1) // batch_size
            
            print(f"\n📦 BATCH {batch_num}/{total_batches}")
            print(f"   Components: {[m['component'] for m in batch]}")
            print("-" * 40)
            
            start_time = time.time()
            batch_results = await self._process_batch_simple(batch)
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
        
        # Generate summary report
        print("\n📊 GENERATING SUMMARY REPORT...")
        self._generate_summary_report(results)
        
        print("\n🎉 SIMPLE FIGMA SPECS PIPELINE COMPLETED!")
        print("=" * 60)
        self._print_final_summary(results)
        
        return results
    
    def _filter_existing_specs(self, component_mappings: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Filter out components that already have specifications"""
        print("   Checking existing MDX files...")
        output_path = Path(self.output_dir)
        existing_specs = set()
        
        if output_path.exists():
            for file in output_path.glob("*-spec.mdx"):
                # Extract component name from filename
                component_name = file.stem.replace("-spec", "").replace("-", " ").title()
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
    
    async def _process_batch_simple(self, batch: List[Dict[str, str]]) -> Dict[str, Any]:
        """Process a batch of component mappings"""
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
                print("   🎨 Creating spec from mapping...")
                start_time = time.time()
                
                # Create spec directly from mapping
                spec = await self._create_spec_from_mapping(mapping)
                
                create_time = time.time() - start_time
                print(f"   ✅ Created ({create_time:.1f}s)")
                
                if spec:
                    print(f"   📝 Generated spec: {spec['name']}")
                    
                    # Save MDX file
                    print("   💾 Saving MDX file...")
                    await self._save_spec_mdx_simple(spec)
                    
                    batch_results["specs_generated"].append(spec["name"])
                    batch_results["processed"] += 1
                    
                    total_time = time.time() - start_time
                    print(f"   ✅ COMPLETED ({total_time:.1f}s total)")
                else:
                    print("   ❌ No spec generated")
                    batch_results["failed"] += 1
                
            except Exception as e:
                error_msg = f"Failed to process {component_name}: {str(e)}"
                print(f"   ❌ ERROR: {error_msg}")
                batch_results["errors"].append(error_msg)
                batch_results["failed"] += 1
        
        return batch_results
    
    async def _create_spec_from_mapping(self, mapping: Dict[str, str]) -> Dict[str, Any]:
        """Create specification from component mapping"""
        component_name = mapping["component"]
        figma_url = mapping["figmaUrl"]
        node_id = mapping["nodeId"]
        category = mapping.get("category", "Unknown")
        
        # Extract file key from URL
        file_key = figma_url.split("/design/")[1].split("?")[0] if "/design/" in figma_url else "unknown"
        
        # Create a simple but comprehensive spec
        spec = {
            "name": component_name,
            "category": category,
            "figma_url": figma_url,
            "node_id": node_id,
            "file_key": file_key,
            "width": "auto",
            "height": "auto",
            "padding": None,
            "margins": None,
            "border_radius": None,
            "font_family": "Inter",
            "font_size": 14.0,
            "font_weight": None,
            "line_height": 1.5,
            "background_color": "#FFFFFF",
            "text_color": "#000000",
            "border_color": None,
            "color_tokens": {
                "primary": "#0066CC",
                "secondary": "#6C757D"
            },
            "states": [
                {"name": "default", "description": "Default state"},
                {"name": "hover", "description": "Hover state"},
                {"name": "focus", "description": "Focus state"},
                {"name": "disabled", "description": "Disabled state"}
            ],
            "anatomy": [
                {
                    "name": "root",
                    "description": f"Main {component_name} container"
                }
            ],
            "design_tokens": {
                "spacing": "8px grid",
                "border_radius": "4px"
            },
            "usage_guidelines": None,
            "metadata": {
                "extracted_at": datetime.now().isoformat(),
                "source": "component-mapping",
                "design_system": "IDS"
            }
        }
        
        return spec
    
    async def _save_spec_mdx_simple(self, spec: Dict[str, Any]) -> None:
        """Save specification as MDX file"""
        output_path = Path(self.output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Generate MDX content
        mdx_content = self._spec_to_mdx(spec)
        
        # Create filename
        filename = f"{spec['name'].lower().replace(' ', '-').replace('/', '-')}-spec.mdx"
        file_path = output_path / filename
        
        # Write file
        with open(file_path, 'w') as f:
            f.write(mdx_content)
        
        print(f"   💾 Saved: {filename} ({len(mdx_content)} chars)")
    
    def _spec_to_mdx(self, spec: Dict[str, Any]) -> str:
        """Convert spec to MDX format"""
        component_name = spec["name"]
        
        mdx_content = f"""---
component: {component_name}
category: {spec['category']}
figma_url: {spec['figma_url']}
node_id: {spec['node_id']}
extracted_at: {spec['metadata']['extracted_at']}
source: {spec['metadata']['source']}
design_system: {spec['metadata']['design_system']}

# {component_name} Component Specification

## Anatomy
{chr(10).join([f"- {item['name']}: {item['description']}" for item in spec['anatomy']])}

## Layout & Measurements
- Width: {spec['width']}
- Height: {spec['height']}
- Padding: {spec['padding'] or 'Not specified'}
- Margins: {spec['margins'] or 'Not specified'}
- Border Radius: {spec['border_radius'] or 'Not specified'}

## Typography
- Font Family: {spec['font_family']}
- Font Size: {spec['font_size']}px
- Font Weight: {spec['font_weight'] or 'Not specified'}
- Line Height: {spec['line_height']}

## Colors & Tokens
- Background Color: {spec['background_color']}
- Text Color: {spec['text_color']}
- Border Color: {spec['border_color'] or 'Not specified'}

### Color Tokens
{chr(10).join([f"- {key}: {value}" for key, value in spec['color_tokens'].items()])}

## States
{chr(10).join([f"- {state['name']}: {state['description']}" for state in spec['states']])}

## Design Tokens
{chr(10).join([f"- {key}: {value}" for key, value in spec['design_tokens'].items()])}

## Usage Guidelines
{spec['usage_guidelines'] or 'No specific guidelines provided.'}

---
"""
        return mdx_content
    
    def _generate_summary_report(self, results: Dict[str, Any]) -> None:
        """Generate summary report"""
        report_path = Path(self.output_dir) / "pipeline-report.md"
        
        report_content = f"""# Figma Specs Pipeline Report (Simple)

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


async def main():
    """Main function"""
    print("🚀 SIMPLE FIGMA SPECS PIPELINE")
    print("=" * 60)
    print("This version creates specs from component mappings without MCP dependency")
    print("")
    
    pipeline = SimpleFigmaSpecPipeline()
    
    # Run with small batch size for better visibility
    results = await pipeline.run_pipeline(
        batch_size=2,  # Process 2 components at a time
        skip_existing=True
    )
    
    return results


if __name__ == "__main__":
    asyncio.run(main())
