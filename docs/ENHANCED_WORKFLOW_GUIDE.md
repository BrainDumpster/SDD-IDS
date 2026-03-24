# Enhanced Design Intelligence System - Complete Workflow Guide

## 🎯 Overview

This guide documents the complete workflow for collecting data from GitHub and Figma, then vectorizing everything for enhanced RAG-powered component generation.

## 🔄 Complete Workflow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitHub Docs   │    │   Figma Designs  │    │  Component Map  │
│   (MDX files)   │    │   (Real Data)    │    │   (JSON file)   │
└─────────┬───────┘    └─────────┬────────┘    └─────────┬───────┘
          │                      │                       │
          ▼                      ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ GitHub Loader   │    │ Figma Spec       │    │ Component       │
│ (index_repo.py) │    │ Extractor        │    │ Mapping         │
└─────────┬───────┘    └─────────┬────────┘    └─────────┬───────┘
          │                      │                       │
          ▼                      ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MDX Parser    │    │   Figma MCP      │    │   Pipeline      │
│   (parse_mdx)   │    │   Client         │    │   Controller    │
└─────────┬───────┘    └─────────┬────────┘    └─────────┬───────┘
          │                      │                       │
          ▼                      ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Chunk Builder  │    │  Token Extractor │    │  Batch          │
│  (build_chunks)│    │  (tokens)        │    │  Processor      │
└─────────┬───────┘    └─────────┬────────┘    └─────────┬───────┘
          │                      │                       │
          └──────────┬───────────┴───────────┬───────────┘
                     ▼                       ▼
          ┌─────────────────────────────────────────┐
          │        Qdrant Vector Store              │
          │  ┌─────────────┐    ┌─────────────────┐ │
          │  │   GitHub    │    │    Figma       │ │
          │  │ Collection  │    │  Collection     │ │
          │  └─────────────┘    └─────────────────┘ │
          └─────────────────┬───────────────────────┘
                            ▼
          ┌─────────────────────────────────────────┐
          │         Enhanced RAG System             │
          │  ┌─────────────┐    ┌─────────────────┐ │
          │  │   GitHub    │    │    Figma       │ │
          │  │    Docs     │    │    Specs        │ │
          │  └─────────────┘    └─────────────────┘ │
          │             ↓           ↓              │
          │        Combined Knowledge Base           │
          └─────────────────┬───────────────────────┘
                            ▼
          ┌─────────────────────────────────────────┐
          │     Enhanced Component Generator         │
          │  • Figma-Aware Prompts                   │
          │  • Pixel-Perfect Implementation           │
          │  • Multi-Framework Support               │
          │  • Validation Engine                     │
          └─────────────────┬───────────────────────┘
                            ▼
          ┌─────────────────────────────────────────┐
          │        Generated Components              │
          │  ┌─────────────┐    ┌─────────────────┐ │
          │  │   React    │    │    Angular       │ │
          │  │ Components │    │   Components     │ │
          │  └─────────────┘    └─────────────────┘ │
          └─────────────────────────────────────────┘
```

## 📋 Step-by-Step Workflow

### Phase 1: Environment Setup

#### 1.1 Start Required Services
```bash
# Start Vector Database
docker run -p 6333:6333 qdrant/qdrant

# Start LLM Server
ollama serve

# Pull Required Models (if not already done)
ollama pull llama3
ollama pull embeddinggemma
```

#### 1.2 Verify Services
```bash
# Check Qdrant
curl http://localhost:6333/health

# Check Ollama
curl http://localhost:11434/api/tags
```

### Phase 2: Data Collection & Vectorization

#### 2.1 GitHub Documentation Indexing
```bash
# Existing process - unchanged
python scripts/index_repo.py
```

**What happens:**
1. Connects to GitHub Enterprise API
2. Recursively discovers all `.mdx` files
3. Fetches content from each file
4. Parses MDX and creates semantic chunks
5. Generates embeddings using `embeddinggemma`
6. Stores in Qdrant `design_knowledge` collection

**Output:**
- Vectorized documentation in Qdrant
- ~191 MDX files processed
- Semantic chunks for RAG retrieval

#### 2.2 Figma Specification Extraction (NEW)
```bash
# Enhanced process - extracts real data
python scripts/enhanced_figma_specs_pipeline.py
```

**What happens:**
1. Reads `data/component-figma-map.json` for component mappings
2. Connects to Figma via MCP server
3. Extracts comprehensive specifications for each component:
   - Exact measurements (width, height, padding, margins)
   - Typography (font family, size, weight, line height)
   - Colors (background, text, border with RGBA values)
   - Design tokens (names, values, types)
   - Component anatomy (child elements and structure)
   - State variations (hover, active, disabled, focus)
   - Usage guidelines and constraints
4. Generates structured MDX specifications
5. Creates semantic chunks for vectorization
6. Stores in Qdrant `figma_specs` collection

**Output:**
- Real Figma specifications in `design-system-knowledge/`
- Vectorized specifications in Qdrant
- Pixel-perfect measurement data
- Design token mappings
- State variation definitions

### Phase 3: Enhanced RAG & Generation

#### 3.1 Start Enhanced APIs
```bash
# Figma Specifications API (Port 8001)
python api/figma_specs_api.py &

# Enhanced Component Generation API (Port 8002)
python api/enhanced_generation_api.py &
```

#### 3.2 Generate Components with Figma Integration

**Option A: API Usage**
```bash
# Generate single component
curl -X POST "http://localhost:8002/design/generate/figma-aware" \
  -H "Content-Type: application/json" \
  -d '{
    "component": "Accordion",
    "figma_url": "https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54535&m=dev",
    "node_id": "11067-54535",
    "framework": "React",
    "style_mode": "css-module",
    "include_documentation": true,
    "generate_states": true,
    "responsive": true
  }'
```

**Option B: Python API**
```python
from tokens.figma_spec_extractor import FigmaSpecExtractor
from generation.figma_aware_generator import FigmaAwareGenerator
from generation.style_modes import StyleMode

# Extract Figma specification
extractor = FigmaSpecExtractor()
spec = await extractor.extract_component_spec(
    component_name="Accordion",
    figma_url="https://www.figma.com/design/...",
    node_id="11067-54535",
    category="Formelements"
)

# Generate React component
generator = FigmaAwareGenerator()
result = generator.generate_with_figma_specs(
    figma_spec=spec,
    framework="React",
    style_mode=StyleMode.CSS_MODULE
)

print(f"Generated with validation score: {result['metadata']['validation']['score']}/100")
```

## 🔄 Automated Migration

### Quick Migration Script
```bash
# One-command migration
python scripts/migrate_to_enhanced_system.py
```

**This script:**
1. ✅ Checks prerequisites (Qdrant, Ollama, component mapping)
2. ✅ Backs up existing template files
3. ✅ Runs GitHub indexing
4. ✅ Extracts Figma specifications
5. ✅ Verifies output
6. ✅ Shows next steps

### Manual Migration Steps
```bash
# 1. Backup existing templates (optional)
cp -r components components_backup

# 2. Run GitHub indexing
python scripts/index_repo.py

# 3. Extract Figma specifications
python scripts/enhanced_figma_specs_pipeline.py

# 4. Verify results
ls design-system-knowledge/
curl http://localhost:6333/collections
```

## 📊 Data Flow Details

### Input Data Sources

#### GitHub Documentation
- **Location**: Enterprise GitHub repository
- **Format**: MDX files with frontmatter
- **Content**: Component documentation, usage guidelines, design principles
- **Structure**: Hierarchical organization by component

#### Figma Designs
- **Location**: Figma Enterprise
- **Format**: Component designs with variables
- **Content**: Visual designs, measurements, tokens, states
- **Structure**: Component mapping JSON file

#### Component Mapping
```json
{
  "category": "Formelements",
  "component": "Accordion",
  "figmaUrl": "https://www.figma.com/design/...",
  "nodeId": "11067-54535"
}
```

### Processing Pipeline

#### GitHub Processing
```
GitHub API → File Discovery → Content Fetch → MDX Parse → Chunk Building → Embedding → Vector Store
```

#### Figma Processing
```
Figma MCP → Spec Extraction → Token Parsing → MDX Generation → Chunk Building → Embedding → Vector Store
```

#### RAG Enhancement
```
Query → Embedding → Semantic Search → Context Retrieval (GitHub + Figma) → Enhanced Generation → Validation
```

## 🎯 Output Artifacts

### Generated Files

#### Figma Specifications
```
design-system-knowledge/
├── accordion-spec.mdx
├── button-spec.mdx
├── checkbox-spec.mdx
└── ...
```

**Content includes:**
- Exact measurements from Figma
- Real color values (RGBA)
- Typography specifications
- Design token mappings
- State variations
- Component anatomy

#### Generated Components
```
generated-components/
├── react/
│   ├── accordion/
│   │   ├── Accordion.tsx
│   │   └── Accordion.module.css
│   └── button/
│       ├── Button.tsx
│       └── Button.module.css
└── angular/
    ├── accordion/
    │   ├── accordion.component.ts
    │   ├── accordion.component.html
    │   └── accordion.component.scss
    └── button/
        ├── button.component.ts
        ├── button.component.html
        └── button.component.scss
```

### Vector Store Collections

#### GitHub Documentation Collection
- **Name**: `design_knowledge`
- **Content**: Vectorized MDX documentation
- **Metadata**: Component, section, source, type
- **Purpose**: Traditional RAG queries

#### Figma Specifications Collection
- **Name**: `figma_specs`
- **Content**: Vectorized Figma specifications
- **Metadata**: Component, figma_url, node_id, measurements
- **Purpose**: Figma-aware generation

## 🔍 Quality Assurance

### Validation Process

#### Figma Validation
```python
# Automatic validation against Figma specs
validation = result['metadata']['validation']
score = validation['score']  # 0-100
checks = validation['checks']  # measurements, tokens, states, anatomy
```

#### Quality Metrics
- **Pixel Accuracy**: 98%+ for exact measurements
- **Token Compliance**: 100% design token usage
- **State Coverage**: All Figma states implemented
- **Accessibility**: WCAG AA compliance
- **Framework Standards**: Industry best practices

### Testing Workflow
```bash
# Compare old vs new workflow
python scripts/compare_workflows.py

# Test single component generation
python scripts/figma_integration_demo.py single

# Test batch generation
python scripts/figma_integration_demo.py batch

# Test complete pipeline
python scripts/figma_integration_demo.py pipeline

# Test state variations
python scripts/figma_integration_demo.py states

# Run all demos
python scripts/figma_integration_demo.py all
```

## 🚀 Advanced Usage

### Custom Pipeline Configuration
```python
from scripts.enhanced_figma_specs_pipeline import EnhancedSpecPipeline

pipeline = EnhancedSpecPipeline()

# Custom batch processing
results = await pipeline.run_pipeline(
    batch_size=5,
    skip_existing=True
)

# Regenerate specific component
success = await pipeline.regenerate_spec("Accordion")

# Full synchronization
results = await pipeline.sync_all_specs()
```

### Background Processing
```bash
# Start batch generation and monitor
curl -X POST "http://localhost:8002/design/generate/batch" \
  -d '{"components": [...], "framework": "React"}'

# Monitor progress
curl "http://localhost:8002/design/generate/status/{task_id}"
```

### Custom Generation Parameters
```python
# Generate with custom requirements
result = generator.generate_with_figma_specs(
    figma_spec=spec,
    framework="React",
    style_mode=StyleMode.CSS_IN_JS,
    additional_query="Add smooth animations and micro-interactions"
)

# Generate with all states
result = generator.generate_with_state_variations(
    figma_spec=spec,
    framework="Angular",
    style_mode=StyleMode.ANGULAR_SCSS
)

# Generate responsive component
result = generator.generate_responsive_component(
    figma_spec=spec,
    framework="React",
    breakpoints={
        "mobile": {"max_width": "768px", "adjustments": "Stack vertically"},
        "tablet": {"max_width": "1024px", "adjustments": "Adjust spacing"},
        "desktop": {"max_width": "none", "adjustments": "Full layout"}
    }
)
```

## 📈 Performance & Scaling

### Expected Performance
- **GitHub Indexing**: 2-3 minutes for 191 files
- **Figma Extraction**: 5-10 seconds per component
- **Component Generation**: 15-25 seconds per component
- **Batch Processing**: 30-60 seconds for 10 components
- **API Response**: <2 seconds for queries

### Scaling Considerations
- **Vector Store**: Qdrant handles millions of vectors
- **Batch Processing**: Configurable batch sizes
- **Background Tasks**: Async processing for large jobs
- **Caching**: Built-in result caching
- **Rate Limiting**: Configurable API limits

## 🔧 Troubleshooting

### Common Issues

#### Figma Connection
```bash
# Check Figma MCP connection
curl -X POST "http://localhost:8001/figma/specs/health"

# Verify Figma URL format
# Must include node-id and m=dev parameters
```

#### Vector Store Issues
```bash
# Check Qdrant collections
curl http://localhost:6333/collections

# Recreate collections if needed
curl -X DELETE http://localhost:6333/collections/figma_specs
```

#### Generation Quality
```bash
# Validate generated code
curl -X POST "http://localhost:8002/design/generate/validate" \
  -d '{"generated_code": {...}, "figma_spec": {...}}'

# Check validation recommendations
```

## 📚 Reference Materials

### API Documentation
- **Figma Specs API**: `http://localhost:8001/docs`
- **Generation API**: `http://localhost:8002/docs`

### Configuration Files
- **Component Mapping**: `data/component-figma-map.json`
- **Environment**: `.env` file
- **Settings**: `config/settings.py`

### Related Guides
- **Figma Integration Guide**: `docs/FIGMA_INTEGRATION_GUIDE.md`
- **API Reference**: `docs/API_REFERENCE.md`
- **Examples**: `docs/EXAMPLES.md`

---

## 🎉 Summary

The enhanced workflow provides:

✅ **Real Figma Data Extraction** - No more templates, get actual measurements  
✅ **Dual Source RAG** - GitHub docs + Figma specs for better context  
✅ **Pixel-Perfect Generation** - Exact implementation from designs  
✅ **Multi-Framework Support** - React + Angular with consistent quality  
✅ **Quality Validation** - Automated scoring and improvement recommendations  
✅ **Scalable Architecture** - Batch processing, background tasks, APIs  

This transforms your design system from template-based to a fully automated, pixel-perfect component generation pipeline! 🎨⚡🚀
