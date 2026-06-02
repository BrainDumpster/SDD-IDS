#!/usr/bin/env python3
"""
Migration Script: Move from old template-based system to enhanced Figma integration
"""

import asyncio
import json
import sys
from pathlib import Path


def check_prerequisites():
    """Check if required services are available"""
    print("🔍 CHECKING PREREQUISITES")
    print("=" * 40)
    
    # Check if Qdrant is running
    try:
        import requests
        response = requests.get("http://localhost:6333/health", timeout=5)
        if response.status_code == 200:
            print("✅ Qdrant vector database running")
        else:
            print("❌ Qdrant not responding correctly")
            return False
    except:
        print("❌ Qdrant not running (start: docker run -p 6333:6333 qdrant/qdrant)")
        return False
    
    # Check if Ollama is running
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            print("✅ Ollama LLM server running")
        else:
            print("❌ Ollama not responding correctly")
            return False
    except:
        print("❌ Ollama not running (start: ollama serve)")
        return False
    
    # Check if component mapping exists
    mapping_file = Path("data/component-figma-map.json")
    if mapping_file.exists():
        with open(mapping_file) as f:
            mappings = json.load(f)
        print(f"✅ Component mapping found ({len(mappings)} components)")
    else:
        print("❌ Component mapping not found")
        return False
    
    print("✅ All prerequisites met")
    return True


def backup_existing_data():
    """Backup existing template files"""
    print("\n💾 BACKING UP EXISTING DATA")
    print("=" * 40)
    
    components_dir = Path("components")
    if components_dir.exists():
        backup_dir = Path("components_backup")
        if backup_dir.exists():
            import shutil
            shutil.rmtree(backup_dir)
        
        import shutil
        shutil.copytree(components_dir, backup_dir)
        print(f"✅ Backed up existing templates to {backup_dir}")
    else:
        print("ℹ️ No existing templates to backup")


async def run_github_indexing():
    """Run GitHub documentation indexing"""
    print("\n📚 STEP 1: INDEXING GITHUB DOCUMENTATION")
    print("=" * 40)
    
    try:
        # Import and run the existing pipeline
        from pipeline.index_pipeline import IndexPipeline
        
        pipeline = IndexPipeline()
        result = pipeline.run("")
        
        print(f"✅ GitHub indexing completed: {result}")
        return True
        
    except Exception as e:
        print(f"❌ GitHub indexing failed: {e}")
        return False


async def run_figma_extraction():
    """Run enhanced Figma specification extraction"""
    print("\n🎨 STEP 2: EXTRACTING FIGMA SPECIFICATIONS")
    print("=" * 40)
    
    try:
        from scripts.enhanced_figma_specs_pipeline import EnhancedSpecPipeline
        
        pipeline = EnhancedSpecPipeline()
        results = await pipeline.run_pipeline(
            batch_size=5,
            skip_existing=True
        )
        
        print(f"✅ Figma extraction completed:")
        print(f"   Total: {results['total_components']}")
        print(f"   Processed: {results['processed']}")
        print(f"   Failed: {results['failed']}")
        print(f"   Success Rate: {(results['processed'] / results['total_components'] * 100):.1f}%")
        
        return results['processed'] > 0
        
    except Exception as e:
        print(f"❌ Figma extraction failed: {e}")
        print("💡 Make sure Figma MCP server is accessible")
        return False


def verify_output():
    """Verify that files were created"""
    print("\n📊 STEP 3: VERIFYING OUTPUT")
    print("=" * 40)
    
    # Check Figma specs
    specs_dir = Path("design-system-knowledge")
    if specs_dir.exists():
        spec_files = list(specs_dir.glob("*-spec.md"))
        print(f"✅ Generated {len(spec_files)} Figma specification files")
        
        # Show a sample
        if spec_files:
            sample = spec_files[0]
            print(f"   Sample: {sample.name}")
            with open(sample) as f:
                content = f.read()
                if "TODO:" not in content:
                    print("   ✅ Contains real data (no TODOs)")
                else:
                    print("   ⚠️ Still contains TODOs")
    else:
        print("❌ No Figma specifications generated")
        return False
    
    # Check vector store collections
    try:
        import requests
        collections = requests.get("http://localhost:6333/collections").json()
        collection_names = [c["name"] for c in collections["result"]["collections"]]
        
        print(f"✅ Vector store collections: {collection_names}")
        
        if "design_knowledge" in collection_names:
            print("   ✅ GitHub docs indexed")
        
        if "figma_specs" in collection_names:
            print("   ✅ Figma specs indexed")
        
    except Exception as e:
        print(f"⚠️ Could not verify vector store: {e}")
    
    return True


def show_next_steps():
    """Show what to do next"""
    print("\n🚀 NEXT STEPS")
    print("=" * 40)
    print("1. Test the enhanced system:")
    print("   python scripts/figma_integration_demo.py single")
    print("")
    print("2. Start the enhanced APIs:")
    print("   python api/figma_specs_api.py &")
    print("   python api/enhanced_generation_api.py &")
    print("")
    print("3. Generate components with Figma integration:")
    print("   # Via API")
    print("   curl -X POST 'http://localhost:8002/design/generate/figma-aware' \\")
    print("        -d '{\"component\": \"Accordion\", \"figma_url\": \"...\", \"node_id\": \"...\"}'")
    print("")
    print("   # Via Python")
    print("   python -c \"")
    print("   import asyncio")
    print("   from generation.figma_aware_generator import FigmaAwareGenerator")
    print("   # ... use the generator")
    print("   \"")
    print("")
    print("4. Check generated components:")
    print("   ls generated-components/react/")
    print("   ls generated-components/angular/")
    print("")
    print("📚 Full guide: docs/FIGMA_INTEGRATION_GUIDE.md")


async def main():
    """Main migration function"""
    print("🔄 MIGRATION TO ENHANCED FIGMA INTEGRATION")
    print("=" * 60)
    print("")
    
    # Check prerequisites
    if not check_prerequisites():
        print("\n❌ Please fix prerequisites before continuing")
        print("💡 See docs/FIGMA_INTEGRATION_GUIDE.md for setup instructions")
        sys.exit(1)
    
    # Backup existing data
    backup_existing_data()
    
    # Ask for confirmation
    print(f"\n⚠️ This will:")
    print("   1. Index GitHub documentation (existing process)")
    print("   2. Extract REAL Figma specifications (NEW)")
    print("   3. Vectorize both data sources for RAG")
    print("")
    
    response = input("Continue? (y/N): ").strip().lower()
    if response != 'y':
        print("❌ Migration cancelled")
        return
    
    # Step 1: GitHub indexing
    if not await run_github_indexing():
        print("\n❌ GitHub indexing failed - stopping migration")
        return
    
    # Step 2: Figma extraction
    if not await run_figma_extraction():
        print("\n❌ Figma extraction failed - check services and try again")
        return
    
    # Step 3: Verify output
    if not verify_output():
        print("\n⚠️ Some verification checks failed")
    
    # Show next steps
    show_next_steps()
    
    print("\n🎉 MIGRATION COMPLETED!")
    print("You now have enhanced Figma integration with real data extraction!")
    print("Your old template files are backed up in components_backup/")


if __name__ == "__main__":
    asyncio.run(main())
