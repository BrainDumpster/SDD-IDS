#!/usr/bin/env python3
"""
Compare Old vs New Workflow for Data Collection and Vectorization
"""

import asyncio
import json
from pathlib import Path

def show_old_workflow():
    """Show the old workflow process"""
    print("📋 OLD WORKFLOW (Template-Based)")
    print("=" * 50)
    print("1. GitHub Documentation:")
    print("   python scripts/index_repo.py")
    print("   → Fetches MDX files from GitHub")
    print("   → Vectorizes in Qdrant")
    print("")
    print("2. Figma Specifications:")
    print("   python scripts/generate_specs_from_map.py")
    print("   → Creates TEMPLATE files only")
    print("   → NO real Figma data extracted")
    print("   → NO vectorization of Figma specs")
    print("")
    print("❌ LIMITATIONS:")
    print("   - Templates have no real measurements")
    print("   - No design tokens extracted")
    print("   - No state variations")
    print("   - No pixel-perfect generation")
    print("")

async def show_new_workflow():
    """Show the new enhanced workflow"""
    print("🚀 NEW WORKFLOW (Enhanced Figma Integration)")
    print("=" * 50)
    print("1. GitHub Documentation:")
    print("   python scripts/index_repo.py")
    print("   → Fetches MDX files from GitHub")
    print("   → Vectorizes in Qdrant")
    print("")
    print("2. Figma Specifications (NEW):")
    print("   python scripts/enhanced_figma_specs_pipeline.py")
    print("   → Extracts REAL data from Figma via MCP")
    print("   → Gets exact measurements, colors, typography")
    print("   → Extracts design tokens and states")
    print("   → Generates structured MDX specifications")
    print("   → Vectorizes in Qdrant for RAG")
    print("")
    print("3. Enhanced Code Generation (NEW):")
    print("   python api/enhanced_generation_api.py")
    print("   → Uses both GitHub docs + Figma specs")
    print("   → Generates pixel-perfect components")
    print("   → Validates against Figma measurements")
    print("   → Supports React + Angular")
    print("")
    print("✅ ADVANTAGES:")
    print("   - Real Figma data extraction")
    print("   - Pixel-perfect implementation")
    print("   - Design token integration")
    print("   - State variations generation")
    print("   - Multi-framework support")
    print("   - Quality validation")
    print("")

def show_file_comparison():
    """Show difference between old and new files"""
    print("📁 FILE COMPARISON")
    print("=" * 50)
    print("OLD TEMPLATE (generate_specs_from_map.py):")
    print("   components/ids/accordion/design-spec.mdx")
    print("   → Template with TODO sections")
    print("   → No real data")
    print("")
    print("NEW SPECIFICATIONS:")
    print("   design-system-knowledge/accordion-spec.mdx")
    print("   → Real measurements from Figma")
    print("   → Exact colors and typography")
    print("   → Design tokens extracted")
    print("   → State variations documented")
    print("")

async def demonstrate_extraction():
    """Demonstrate real Figma extraction"""
    print("🎨 FIGMA DATA EXTRACTION DEMO")
    print("=" * 50)
    
    try:
        from tokens.figma_spec_extractor import FigmaSpecExtractor
        
        print("Connecting to Figma...")
        extractor = FigmaSpecExtractor()
        
        # Example: Extract one component spec
        component_mapping = {
            "component": "Accordion",
            "figmaUrl": "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54535&m=dev",
            "nodeId": "11067-54535",
            "category": "Formelements"
        }
        
        print(f"Extracting spec for {component_mapping['component']}...")
        spec = await extractor.extract_component_spec(
            component_name=component_mapping["component"],
            figma_url=component_mapping["figmaUrl"],
            node_id=component_mapping["nodeId"],
            category=component_mapping["category"]
        )
        
        print("✅ REAL DATA EXTRACTED:")
        print(f"   Dimensions: {spec.width}x{spec.height}px")
        print(f"   Font: {spec.font_family} {spec.font_size}px")
        print(f"   Colors: {spec.background_color}, {spec.text_color}")
        print(f"   States: {len(spec.states) if spec.states else 0}")
        print(f"   Anatomy parts: {len(spec.anatomy) if spec.anatomy else 0}")
        print(f"   Design tokens: {len(spec.design_tokens) if spec.design_tokens else 0}")
        
        return True
        
    except Exception as e:
        print(f"❌ Demo failed (expected if services not running): {e}")
        return False

def show_usage_commands():
    """Show practical usage commands"""
    print("💡 PRACTICAL USAGE")
    print("=" * 50)
    print("QUICK START:")
    print("1. Start services:")
    print("   docker run -p 6333:6333 qdrant/qdrant")
    print("   ollama serve")
    print("")
    print("2. Collect and vectorize data:")
    print("   # GitHub documentation (existing)")
    print("   python scripts/index_repo.py")
    print("")
    print("   # Figma specifications (NEW)")
    print("   python scripts/enhanced_figma_specs_pipeline.py")
    print("")
    print("3. Generate components:")
    print("   # Start APIs")
    print("   python api/figma_specs_api.py &")
    print("   python api/enhanced_generation_api.py &")
    print("")
    print("   # Or run demo")
    print("   python scripts/figma_integration_demo.py single")
    print("")
    print("4. Check results:")
    print("   ls design-system-knowledge/  # Figma specs")
    print("   ls generated-components/    # Generated code")
    print("")

async def main():
    """Main comparison function"""
    print("🔄 WORKFLOW COMPARISON: Old vs New")
    print("=" * 60)
    print("")
    
    show_old_workflow()
    await show_new_workflow()
    show_file_comparison()
    
    # Try to demonstrate real extraction
    print("🎨 TESTING FIGMA EXTRACTION:")
    extraction_success = await demonstrate_extraction()
    
    if extraction_success:
        print("\n✅ Figma extraction working! New system ready.")
    else:
        print("\n⚠️ Start services first to test Figma extraction.")
    
    show_usage_commands()
    
    print("📊 SUMMARY:")
    print("OLD: GitHub docs + Template files")
    print("NEW: GitHub docs + Real Figma data + Enhanced generation")
    print("")
    print("🚀 MIGRATION: Just run the new pipeline alongside existing!")

if __name__ == "__main__":
    asyncio.run(main())
