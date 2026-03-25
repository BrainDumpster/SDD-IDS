# SDD-IDS — Spec-Driven Design Intelligence System

A RAG-powered platform that extracts design system knowledge from Figma, generates framework-agnostic `design-spec.mdx` files, and serves them to downstream AI coding agents and development teams.

## What It Does

- **Extracts** component specs from Figma via MCP tools (tokens, states, anatomy, measurements)
- **Generates** framework-agnostic `design-spec.mdx` files — the canonical deliverable for any developer (React, Angular, Vue, native)
- **Validates** generated code against design system rules and tokens
- **Indexes** design system documentation (MDX from GitHub Enterprise) into Qdrant vectors for RAG
- **Answers** design system questions via chat agent and semantic search API

Supports multiple design systems via `DESIGN_SYSTEM` env var:
- **IDS** (default): Original IDS design system
- **Synapse**: Synapse design system with Base UI (`@base-ui-components/react`) as the React implementation layer

## Spec Pipeline

The primary output is a hierarchy of design specs that downstream agents consume:

```
components/synapse/
├── root-spec.mdx              # Global: tokens, typography, elevation, breakpoints, baselines
├── button/design-spec.mdx     # Component override: anatomy, states, tokens, interactions
├── dialog/design-spec.mdx
├── table/design-spec.mdx
└── ... (46 components)
```

**Root spec** (`root-spec.mdx`) centralizes everything shared across all components:
- ~175 semantic color tokens (light/dark) grouped by role (background, border, text, icon, shadow, gradient)
- ~146 primitive palette tokens (alert, UI palette, secondary palette)
- Typography scale (Roboto, header-1 through body-3 with sizes + line heights)
- Spacing, sizing, padding, corner radius, border width tokens
- 5-level elevation system with shadow token sets
- Responsive breakpoints (mobile through large)
- Interaction baseline (focus, keyboard, mouse, touch)
- Accessibility baseline (WCAG AA, contrast, ARIA, screen readers)
- Theming mechanism (CSS custom properties + `data-theme`)
- Framework options (React + Base UI, Angular, Lit)

**Component specs** inherit from root and only document overrides:
- Component-specific anatomy, tokens, states (light + dark)
- 22 Tier 1 components have detailed interaction sections (keyboard, behaviors, ARIA)
- Remaining 24 components inherit root baseline
- All specs include `<!-- ds:inherits root-spec -->` marker

### Generate Specs

```bash
# Full regeneration (root + 46 components + registry + verification)
python scripts/rebuild_specs.py --verify

# Root spec only
python scripts/rebuild_specs.py --root-only

# Single component
python scripts/rebuild_specs.py --component button

# Audit (check for stale specs, token drift)
python scripts/synapse_spec_audit.py --once
python scripts/synapse_spec_audit.py --once --fix    # auto-regenerate stale specs
python scripts/synapse_spec_audit.py --watch          # persistent watcher (port 8099)

# Generate layout measurement skeleton (populate via Figma MCP)
python scripts/figma_layout_enricher.py --skeleton
```

## Data Files

| File | Purpose |
|---|---|
| `data/synapse-component-figma-map.json` | Figma node IDs for ~80 components across all pages |
| `data/synapse-component-registry.json` | Component anatomy, states, variants, tokens (46 entries) |
| `data/synapse-component-aliases.json` | Figma display name to CSS slug mapping + developer aliases |
| `data/synapse-interaction-templates.json` | 22 Tier 1 component interaction patterns (keyboard, ARIA, behaviors) |
| `data/synapse-figma-layout-cache.json` | Cached Figma measurements (skeleton, enriched via MCP) |
| `data/synapse-allowed-tokens.json` | 209 valid Synapse CSS variable names |
| `data/synapse-baseui-mapping.json` | Component to Base UI implementation strategy |
| `data/synapse-rules.json` | 31 design system rules |
| `components/synapse-theme.css` | Global CSS variables from Figma (light + dark themes) |

## Configuration

Design system abstraction via YAML configs:

```
config/
├── design_system_config.py         # DesignSystemConfig dataclass + loader
├── design_systems/
│   ├── ids.yaml                    # IDS design system config
│   └── synapse.yaml                # Synapse config
└── settings.py                     # Global settings (env vars, paths)
```

Key `synapse.yaml` fields:
- `framework_options`: React + Base UI, Angular, Lit Web Components
- `typography`: Roboto scale (header-1 through body-3 with sizes + line heights)
- `breakpoints`: mobile (576px) through large (1441px)
- `elevation_levels`: 5-level shadow system mapped to use cases
- `root_spec_path`, `alias_path`, `interaction_templates_path`, `layout_cache_path`

## Setup

```bash
# Python dependencies (uses uv)
uv pip install -r requirements.txt

# Required services (for RAG features)
docker run -p 6333:6333 qdrant/qdrant          # vector DB
ollama serve                                     # LLM backend
ollama pull llama3 && ollama pull embeddinggemma  # models

# Environment
cp .env.example .env
# Edit .env: FIGMA_TOKEN, GITHUB_HOST, GITHUB_REPO, GITHUB_PERSONAL_ACCESS_TOKEN
```

## APIs

| API | Port | Module | Purpose |
|---|---|---|---|
| RAG Query | 8000 | `api/rag_api.py` | Design system Q&A |
| Figma Specs | 8001 | `api/figma_specs_api.py` | Figma spec extraction |
| Enhanced Generation | 8002 | `api/enhanced_generation_api.py` | Framework-aware code gen |
| Search | 8005 | `api/search_api.py` | Semantic search for website |
| MCP Streamable | 8080 | `mcp_tools/streamable_mcp_server.py` | MCP tool server |
| Audit Status | 8099 | `scripts/synapse_spec_audit.py` | Spec audit status (watch mode) |

## Architecture

```
Figma (MCP tools)
  │
  ├──► tokens/figma_spec_extractor.py ──► components/synapse-theme.css
  │
  └──► scripts/rebuild_specs.py
         ├── parse_theme() ──► token categorization
         ├── build_root_spec() ──► components/synapse/root-spec.mdx
         └── build_component_spec() ──► components/synapse/<slug>/design-spec.mdx
              ├── CSS modules (storybook/src/components/*.module.css)
              ├── synapse-component-aliases.json (name resolution)
              ├── synapse-interaction-templates.json (keyboard/ARIA)
              └── synapse-figma-layout-cache.json (measurements)

GitHub Enterprise MDX
  │
  └──► ingestion/ (parse/chunk) ──► embeddings/ ──► Qdrant
                                                       │
  User query ──► rag/ (component detection + retrieval) ┘──► LLM ──► answer
             ──► generation/ (prompt compilation) ──► code output
             ──► validation/ (rules + tokens + structure) ──► report
```

### Key Subsystems

- **Spec pipeline** (`scripts/rebuild_specs.py`): Root spec + 46 component override specs from CSS modules, Figma map, theme CSS, interaction templates, and layout cache
- **Audit agent** (`scripts/synapse_spec_audit.py`): Persistent watcher or single-pass auditor that detects stale specs, invalid tokens, hardcoded values
- **Ingestion** (`pipeline/index_pipeline.py`): GitHub MDX fetch, parse, chunk, embed, store in Qdrant
- **RAG** (`rag/`): Component detection, filtered semantic search, LLM answer generation
- **Generation** (`generation/`): Framework-aware code gen with Base UI, Angular, CSS Modules adapters
- **Validation** (`validation/`): Rule + token + structure validation with severity scoring
- **Token management** (`tokens/`): Figma MCP client, token extraction, CSS syntax generation

## Project Structure

```
├── agent/                  # Chat agents (design_chat.py, rag_agent.py)
├── api/                    # FastAPI servers (RAG, search, figma specs, generation)
├── components/
│   ├── synapse-theme.css   # Global CSS variables (light + dark)
│   └── synapse/
│       ├── root-spec.mdx   # Global design system spec
│       └── <slug>/design-spec.mdx  # 46 component override specs
├── config/
│   ├── design_system_config.py     # DesignSystemConfig dataclass
│   ├── design_systems/             # Per-DS YAML configs
│   └── settings.py                 # Global settings
├── data/                   # JSON data files (figma map, registry, aliases, etc.)
├── generation/             # Code generation (adapters, prompts, theme injection)
├── ingestion/              # GitHub MDX ingestion, Figma spec extraction
├── knowledge/              # Component registry, pattern graphs, schema
├── mcp_tools/              # MCP server implementation
├── pipeline/               # Orchestration (index, rules, knowledge)
├── rag/                    # RAG chain (component detection, retrieval)
├── retrieval/              # Semantic search, reranking
├── rules/                  # Rule extraction, filtering, confidence scoring
├── scripts/                # CLI tools (rebuild_specs, audit, enricher, indexing)
├── storybook/              # 46 Synapse component implementations (React + CSS Modules)
├── tokens/                 # Figma token management (extraction, sync, mapping)
├── validation/             # Design validation engine (rules, tokens, structure)
└── requirements.txt
```

## Storybook

46 Synapse component implementations with CSS Modules, used as the source of truth for token extraction:

```bash
cd storybook
pnpm install
pnpm dev        # dev server
pnpm build      # production build
```

## Environment

- Python 3.12+ (`.python-version` = 3.12)
- Node.js + pnpm (for Storybook)
- Config via `.env` (see `.env.example`)
- Embedding dimension: 768 (embeddinggemma), Qdrant distance: COSINE
- `DESIGN_SYSTEM=synapse` for Synapse pipeline (default: IDS)
