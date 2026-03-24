#!/usr/bin/env python3
"""
Figma Integration Demo Script
Demonstrates the complete Figma-to-code pipeline
"""

import asyncio
import json
import sys
from pathlib import Path

from tokens.figma_spec_extractor import FigmaSpecExtractor, generate_all_specs
from scripts.enhanced_figma_specs_pipeline import EnhancedSpecPipeline
from generation.figma_aware_generator import FigmaAwareGenerator
from generation.style_modes import StyleMode


async def demo_single_component():
    """Demo: Generate single component from Figma"""
    print("🎨 Demo: Single Component Generation")
    print("=" * 50)
    
    # Example: Generate Accordion component
    component_mapping = {
        "component": "Accordion",
        "figmaUrl": "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54535&m=dev",
        "nodeId": "11067-54535",
        "category": "Formelements"
    }
    
    try:
        # 1️⃣ Extract Figma specification
        print("1️⃣ Extracting Figma specification...")
        extractor = FigmaSpecExtractor()
        spec = await extractor.extract_component_spec(
            component_name=component_mapping["component"],
            figma_url=component_mapping["figmaUrl"],
            node_id=component_mapping["nodeId"],
            category=component_mapping["category"]
        )
        
        print(f"✅ Extracted spec for {spec.name}")
        print(f"   Dimensions: {spec.width}x{spec.height}px")
        print(f"   Font: {spec.font_family} {spec.font_size}px")
        print(f"   States: {len(spec.states) if spec.states else 0}")
        
        # 2️⃣ Generate React component
        print("\n2️⃣ Generating React component...")
        generator = FigmaAwareGenerator()
        
        react_result = generator.generate_with_figma_specs(
            figma_spec=spec,
            framework="React",
            style_mode=StyleMode.CSS_MODULE
        )
        
        validation_score = react_result.get("metadata", {}).get("validation", {}).get("score", 0)
        print(f"✅ Generated React component with validation score: {validation_score}/100")
        
        # 3️⃣ Generate Angular component
        print("\n3️⃣ Generating Angular component...")
        
        angular_result = generator.generate_with_figma_specs(
            figma_spec=spec,
            framework="Angular",
            style_mode=StyleMode.ANGULAR_SCSS
        )
        
        angular_validation = angular_result.get("metadata", {}).get("validation", {}).get("score", 0)
        print(f"✅ Generated Angular component with validation score: {angular_validation}/100")
        
        # 4️⃣ Save results
        output_dir = Path("/home/muthu/projects/ids_design_knowledge/demo-output")
        output_dir.mkdir(exist_ok=True)
        
        # Save React component
        if "component" in react_result:
            react_file = output_dir / "Accordion.tsx"
            with open(react_file, 'w') as f:
                f.write(react_result["component"])
            print(f"💾 Saved React component to {react_file}")
        
        if "css" in react_result:
            css_file = output_dir / "Accordion.module.css"
            with open(css_file, 'w') as f:
                f.write(react_result["css"])
            print(f"💾 Saved React CSS to {css_file}")
        
        # Save Angular component
        if "component_ts" in angular_result:
            ts_file = output_dir / "accordion.component.ts"
            with open(ts_file, 'w') as f:
                f.write(angular_result["component_ts"])
            print(f"💾 Saved Angular TS to {ts_file}")
        
        if "component_html" in angular_result:
            html_file = output_dir / "accordion.component.html"
            with open(html_file, 'w') as f:
                f.write(angular_result["component_html"])
            print(f"💾 Saved Angular HTML to {html_file}")
        
        if "component_scss" in angular_result:
            scss_file = output_dir / "accordion.component.scss"
            with open(scss_file, 'w') as f:
                f.write(angular_result["component_scss"])
            print(f"💾 Saved Angular SCSS to {scss_file}")
        
        print(f"\n🎉 Demo completed! Check {output_dir} for generated files.")
        
    except Exception as e:
        print(f"❌ Demo failed: {e}")
        import traceback
        traceback.print_exc()


async def demo_batch_generation():
    """Demo: Batch generate multiple components"""
    print("\n🚀 Demo: Batch Component Generation")
    print("=" * 50)
    
    # Sample batch (first 5 components from mapping)
    sample_components = [
        {
            "component": "Button",
            "figmaUrl": "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54539&m=dev",
            "nodeId": "11067-54539",
            "category": "Formelements"
        },
        {
            "component": "Checkbox",
            "figmaUrl": "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54543&m=dev",
            "nodeId": "11067-54543",
            "category": "Formelements"
        },
        {
            "component": "Tab",
            "figmaUrl": "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54530&m=dev",
            "nodeId": "11067-54530",
            "category": "Navigation"
        }
    ]
    
    try:
        print(f"🔄 Processing {len(sample_components)} components...")
        
        generator = FigmaAwareGenerator()
        
        # Convert to ComponentSpec objects
        extractor = FigmaSpecExtractor()
        specs = []
        
        for mapping in sample_components:
            print(f"📋 Extracting spec for {mapping['component']}...")
            spec = await extractor.extract_component_spec(
                component_name=mapping["component"],
                figma_url=mapping["figmaUrl"],
                node_id=mapping["nodeId"],
                category=mapping["category"]
            )
            specs.append(spec)
        
        # Generate batch
        results = generator.batch_generate(
            figma_specs=specs,
            framework="React",
            style_mode=StyleMode.CSS_MODULE
        )
        
        # Count successes
        successful = sum(1 for r in results if r["success"])
        print(f"\n✅ Batch generation completed: {successful}/{len(sample_components)} successful")
        
        # Show results summary
        for result in results:
            status = "✅" if result["success"] else "❌"
            validation_score = 0
            if result["success"]:
                validation_score = result["result"].get("metadata", {}).get("validation", {}).get("score", 0)
            print(f"   {status} {result['component']}: {validation_score}/100")
        
    except Exception as e:
        print(f"❌ Batch demo failed: {e}")
        import traceback
        traceback.print_exc()


async def demo_spec_pipeline():
    """Demo: Complete specification pipeline"""
    print("\n📋 Demo: Complete Specification Pipeline")
    print("=" * 50)
    
    try:
        # Run enhanced pipeline
        pipeline = EnhancedSpecPipeline()
        
        results = await pipeline.run_pipeline(
            batch_size=3,
            skip_existing=True
        )
        
        print(f"\n📊 Pipeline Results:")
        print(f"   Total Components: {results['total_components']}")
        print(f"   Processed: {results['processed']}")
        print(f"   Failed: {results['failed']}")
        print(f"   Success Rate: {(results['processed'] / results['total_components'] * 100):.1f}%")
        
        if results['specs_generated']:
            print(f"\n✅ Generated Specifications:")
            for spec_name in results['specs_generated']:
                print(f"   - {spec_name}")
        
        if results['errors']:
            print(f"\n❌ Errors:")
            for error in results['errors']:
                print(f"   - {error}")
        
    except Exception as e:
        print(f"❌ Pipeline demo failed: {e}")
        import traceback
        traceback.print_exc()


async def demo_state_variations():
    """Demo: Generate component with state variations"""
    print("\n🔄 Demo: State Variations Generation")
    print("=" * 50)
    
    try:
        # Extract Button spec (has multiple states)
        extractor = FigmaSpecExtractor()
        spec = await extractor.extract_component_spec(
            component_name="Button",
            figma_url="https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54539&m=dev",
            nodeId="11067-54539",
            category="Formelements"
        )
        
        print(f"📋 Button has {len(spec.states) if spec.states else 0} states")
        
        # Generate with states
        generator = FigmaAwareGenerator()
        
        result = generator.generate_with_state_variations(
            figma_spec=spec,
            framework="React",
            style_mode=StyleMode.CSS_MODULE
        )
        
        print(f"✅ Generated base component + {len(result.get('state_variations', {}))} state variations")
        
        # Show state variations
        for state_name in result.get('state_variations', {}).keys():
            print(f"   - {state_name} state")
        
    except Exception as e:
        print(f"❌ State variations demo failed: {e}")
        import traceback
        traceback.print_exc()


def print_usage():
    """Print usage instructions"""
    print("Figma Integration Demo Script")
    print("=" * 30)
    print("Usage:")
    print("  python figma_integration_demo.py [demo_type]")
    print("")
    print("Demo types:")
    print("  single     - Generate single component")
    print("  batch      - Generate multiple components")
    print("  pipeline   - Run complete specification pipeline")
    print("  states     - Generate with state variations")
    print("  all        - Run all demos")
    print("")
    print("Example:")
    print("  python figma_integration_demo.py single")


async def main():
    """Main demo function"""
    if len(sys.argv) < 2:
        print_usage()
        return
    
    demo_type = sys.argv[1].lower()
    
    print("🎨 Figma Integration Enhancement Demo")
    print("====================================")
    print(f"Running demo: {demo_type}")
    print("")
    
    if demo_type == "single":
        await demo_single_component()
    elif demo_type == "batch":
        await demo_batch_generation()
    elif demo_type == "pipeline":
        await demo_spec_pipeline()
    elif demo_type == "states":
        await demo_state_variations()
    elif demo_type == "all":
        await demo_single_component()
        await demo_batch_generation()
        await demo_spec_pipeline()
        await demo_state_variations()
    else:
        print(f"Unknown demo type: {demo_type}")
        print_usage()


if __name__ == "__main__":
    asyncio.run(main())
