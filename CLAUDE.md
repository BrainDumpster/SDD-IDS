# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Design Intelligence System — a RAG-powered platform that indexes design system documentation (MDX from GitHub Enterprise), stores it in Qdrant vectors, and uses it for:
- Answering design system questions via chat agent
- Generating UI component code (React CSS Modules/CSS-in-JS/Base UI, Angular SCSS)
- Extracting component specs from Figma and producing `design-spec.mdx` files
- Validating generated code against design system rules and tokens
- Semantic search for a design system website

Supports multiple design systems via `DESIGN_SYSTEM` env var:
- **IDS** (default): Original IDS design system
- **DAP**: Program deltas layered on IDS (`components/DAP`, `components/dap-theme.css`)
- **Synapse**: Synapse design system with Base UI (`@base-ui-components/react`) as the React implementation layer

## Commands

```bash
# Install dependencies (uses uv — see pyproject.toml + requirements.txt)
uv pip install -r requirements.txt

# Required services
docker run -p 6333:6333 qdrant/qdrant          # vector DB
ollama serve                                     # LLM backend
ollama pull llama3 && ollama pull embeddinggemma  # models

# Index MDX docs from GitHub Enterprise into Qdrant
python scripts/index_repo.py

# Index canonical component design specs (high-priority chunks)
python scripts/index_component_specs.py

# RAG API (port 8000)
uvicorn api.rag_api:app --host 0.0.0.0 --port 8000 --reload

# Search API (port 8005) — website semantic search replacement
python -m api.search_api

# Figma Specs API (port 8001)
python api/figma_specs_api.py

# Enhanced Generation API (port 8002)
python api/enhanced_generation_api.py

# MCP server (streamable, port 8080)
python mcp_tools/streamable_mcp_server.py

# Design chat agent (interactive CLI)
python agent/design_chat.py

# Run tests
pytest tests/
python test_search_api.py
python test_api_formats.py
```

## Architecture

### Data Flow
```
GitHub Enterprise MDX → ingestion/ (fetch/parse/chunk) → embeddings/ (Ollama embeddinggemma 768d)
    → vectorstore/qdrant_store.py → Qdrant collection "design_knowledge"

Figma → tokens/figma_spec_extractor.py → components/ids/<slug>/design-spec.mdx → vector store
     → tokens/figma_client.py (MCP) → token extraction/sync

User query → rag/design_rag.py (component detection + retrieval) → Ollama llama3 → answer
          → api/rag_api.py (FastAPI) or agent/design_chat.py (CLI)
```

### Key Subsystems

**Ingestion pipeline** (`pipeline/index_pipeline.py`): Orchestrates GitHub loader → MDX parser → chunk builder → embedding → Qdrant storage. Tracks indexed files via `index_registry.json` and `storage/document_registry.py`.

**RAG layer** (`rag/`): `ComponentDetector` identifies which component a question targets; `DesignRetriever` does filtered semantic search; `DesignRAG` ties them together with LLM answer generation.

**Generation pipeline** (`generation/`): `ComponentGenerator` takes compiled context + framework + `StyleMode` enum and produces code via Ollama. `FigmaAwareGenerator` adds Figma spec awareness. `ThemeInjector` and `AutoRepairEngine` handle token injection and self-healing. Prompt compilation lives in `prompt_templates.py` and `figma_enhanced_prompts.py`.

**Validation engine** (`validation/`): `DesignValidator` orchestrates `RuleValidator`, `TokenValidator`, `StructureValidator`. `SeverityEngine` scores violations. `ReportBuilder` formats output. Entry point: `validate_design(component, code)`.

**Token management** (`tokens/`): Figma MCP client, token extraction/normalization, CSS syntax generation, component-token mapping. `figma_spec_extractor.py` pulls full component specs from Figma.

**Knowledge layer** (`knowledge/`): Component registry, rule models, pattern graphs, schema building for the design system knowledge base.

### API Ports
| API | Port | Module |
|-----|------|--------|
| RAG Query | 8000 | `api/rag_api.py` |
| Figma Specs | 8001 | `api/figma_specs_api.py` |
| Enhanced Generation | 8002 | `api/enhanced_generation_api.py` |
| Search | 8005 | `api/search_api.py` |
| MCP Streamable | 8080 | `mcp_tools/streamable_mcp_server.py` |

### Important Data Files
- `data/component-figma-map.json` — IDS / DAP component → Figma URL + node ID. **Read this first** when working with any IDS component's Figma data.
- `data/synapse-component-figma-map.json` — Synapse component → Figma node IDs (~80 entries).
- `data/synapse-baseui-mapping.json` — maps each Synapse component to its Base UI implementation strategy.
- `data/synapse-component-registry.json` — Synapse component anatomy, states, variants, tokens.
- `data/synapse-rules.json` — Synapse design system rules (31 rules).
- `data/synapse-allowed-tokens.json` — flat list of valid Synapse CSS variable names (209 tokens).
- `rules.json` — IDS design system rules (accessibility, layout) with severity levels.
- `components/ids/<slug>/design-spec.mdx` — IDS Figma-aligned component specifications.
- `components/synapse/<slug>/design-spec.mdx` — Synapse component specifications.
- `components/ids-theme.css` — IDS global CSS variables (light + dark; `data-design-system="ids"`).
- `components/synapse-theme.css` — Synapse global CSS variables (light + dark themes).

### Design System Abstraction
- `config/design_system_config.py` — `DesignSystemConfig` dataclass + `load_design_system()` factory.
- `config/design_systems/ids.yaml` / `dap.yaml` / `synapse.yaml` — per-design-system YAML configs.
- All pipeline modules accept config-driven paths (rules, tokens, registry, collection name).
- `generation/framework_adapters/` — `BaseUIAdapter`, `ReactCSSAdapter`, `AngularAdapter`.
- `validation/baseui_validator.py` — Base UI compliance checks for Synapse React generation.
- `StyleMode.BASE_UI_CSS` — new style mode for Base UI + CSS Modules generation.

## Design-Spec Workflow (from Cursor rules)

The primary workflow is creating/maintaining `components/ids/<slug>/design-spec.mdx` with maximum Figma fidelity. Implementation/codegen is **optional** — only when explicitly requested.

1. Read `data/component-figma-map.json` to get the component's `figmaUrl` and `nodeId`.
2. Figma semantic variables (`var(--...)`) are authoritative for token naming.
3. Required spec sections: Metadata, Layout & Measurements, Tokens, States (Light Theme), States (Dark Theme), Interactions.
4. Never hardcode colors/spacing/typography — always reference CSS variables/design tokens.
5. Light and Dark state tables must be structurally parallel.
6. Global token CSS is built from Figma collections (priority: `Tokens` > `Primitive` > `Density Primitive`) and stored in `components/ids-theme.css` — shared across IDS components, not per-component.

## Environment

- Python 3.12+ (`.python-version` = 3.12)
- Config via `.env` (see `.env.example`). Key vars: `GITHUB_HOST`, `GITHUB_REPO`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `OLLAMA_HOST`, `QDRANT_HOST`, `FIGMA_TOKEN`, `DESIGN_SYSTEM`.
- All settings loaded in `config/settings.py` as a singleton `settings` object. `settings.design_system_config` lazy-loads the active `DesignSystemConfig`.
- `PYTHONPATH` must include project root (set in Dockerfile, needed for imports like `from config.settings import settings`).
- Embedding dimension: 768 (embeddinggemma). Qdrant distance: COSINE.
