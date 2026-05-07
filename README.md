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
- **DAP**: Program-specific deltas layered on top of IDS baseline specs and tokens

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

## Using Design Specs As Source Of Truth

Production-ready component specs under `components/synapse/<slug>/design-spec.mdx` are intended for spec-driven generation across frameworks (React, Angular, Vue, Lit, and others), provided generators follow the spec contract sections.

### Read order for generation

For any component `<slug>`, parse in this order:

1. `components/synapse/root-spec.mdx`
2. `components/synapse-theme.css`
3. `components/synapse/<slug>/design-spec.mdx`
4. Referenced assets (for example `assets/icons/*.svg`)

### Required sections in component specs

- `Metadata`
- `Anatomy`
- `Layout & Measurements`
- `Tokens`
- `States (Light Theme)`
- `States (Dark Theme)`
- `Interactions`
- `Composition & API (runtime)`
- `Codegen Contract (Framework-Agnostic Blueprint)`
- `Source Mapping`

### Root spec vs component spec

- `root-spec.mdx`: shared design-system baseline (global tokens, typography, spacing, elevation, baseline interactions/accessibility).
- component `design-spec.mdx`: deterministic per-component contract and overrides.
- `synapse-theme.css`: concrete token values for light/dark resolution.

Generator rule:
- Use component values first;
- inherit from root when not overridden;
- resolve styles through CSS variables from `synapse-theme.css`.

## IDS Baseline + Program Overrides

The generator now supports a layered model where IDS is always the base.

Layer precedence used at runtime:
1. program component delta (`components/<program>/<slug>/design-spec.mdx`) — optional
2. program root delta (`components/<program>/root-spec.mdx`) — optional but recommended
3. IDS component baseline (`components/ids/<slug>/design-spec.mdx`) — required
4. IDS root baseline (`components/ids/root-spec.mdx`) — required

Theme precedence used at runtime:
1. `components/ids-theme.css`
2. `components/<program>-theme.css` (or `components/<program>/theme.css`)

### What happens when a program has no separate component spec?

If `components/<program>/<slug>/design-spec.mdx` does not exist, codegen still works by combining:
- `components/ids/<slug>/design-spec.mdx` (baseline component behavior/contract)
- `components/<program>/root-spec.mdx` (program-level visual/behavior deltas)
- `components/ids-theme.css` + program theme file (token value overrides)

This is the recommended mode when program deltas are centralized in root spec instead of per-component files.

### Concrete DAP example (no component delta file)

For DAP Button, if there is no `components/DAP/button/design-spec.mdx`, generator still resolves:
1. `components/ids/root-spec.mdx`
2. `components/ids/button/design-spec.mdx`
3. `components/DAP/root-spec.mdx` (button deltas in Program Delta Register)
4. `components/ids-theme.css`
5. `components/dap-theme.css`

This allows DAP to inherit IDS behavior and override only visual/contract deltas in root + theme files.

### How a program should add its own components or override IDS

For a new program `<program>`:
1. Add config file `config/design_systems/<program>.yaml` with layered paths:
   - `baseline_components_dir: components/ids`
   - `baseline_root_spec_path: components/ids/root-spec.mdx`
   - `baseline_theme_css_path: components/ids-theme.css`
   - `program_components_dir: components/<program>`
   - `program_root_spec_path: components/<program>/root-spec.mdx`
   - `program_theme_css_path: components/<program>-theme.css` (or equivalent)
2. Put global deltas in `components/<program>/root-spec.mdx` (layout, typography, visual attributes, interaction deltas, variant constraints).
3. Put token value deltas in `components/<program>-theme.css`.
4. Create `components/<program>/<slug>/design-spec.mdx` only when the component is truly program-specific or needs a dedicated per-component delta contract.
5. Set `DESIGN_SYSTEM=<program>` before running generation.

## Generation Folder Roles

The `generation/` folder contains runtime codegen orchestration and adapters (not generated output artifacts):

- `generation/component_context_compiler.py`
  - Builds layered context for each component.
  - Composes IDS baseline + program deltas + theme layers.
  - Adds layer validation diagnostics (required layers, inherits marker, hardcoded drift checks).
- `generation/prompt_templates.py`
  - Defines prompt rules/templates and context injection.
  - Injects `PRECEDENCE RULES`, `IDS BASELINE`, `PROGRAM DELTAS`, and `THEME LAYERS`.
- `generation/component_generator.py`
  - Calls the LLM with compiled prompt/context.
  - Parses structured output sections (`COMPONENT`, `CSS`, etc.).
- `generation/generation_pipeline.py`
  - High-level orchestrator: compile context -> generate -> repair/validate.
- `generation/theme_injector.py`
  - Materializes theme layers in deterministic order (IDS theme first, program theme second).
- `generation/auto_repair_engine.py`
  - Post-generation auto-repair loop driven by validation feedback.
- `generation/rag_component_generator.py`
  - RAG-aware generation path using retrieved design knowledge context.
- `generation/figma_aware_generator.py` and `generation/figma_enhanced_prompts.py`
  - Figma-context-aware generation helpers/prompts.
- `generation/framework_adapters/*`
  - Framework-specific shaping/adaptation (`react_css_adapter.py`, `angular_adapter.py`, `base_ui_adapter.py`).
- `generation/style_modes.py`
  - Enumerates supported style output modes.

### Assets (icons/images) contract

When component specs reference assets:

- resolve the exact slug-to-file mapping declared in the spec;
- include the mapped files in the final app bundle (public/static/import pipeline);
- do not silently substitute missing assets.

### Framework-agnostic expectations

Framework syntax can vary, but generated output must preserve:

- deterministic anatomy/slot order
- variant and state matrix
- per-slot tokenized styling
- interaction behavior
- accessibility semantics
- fallback/error rules

## Spec-Driven Generation Quickstart

### For developers

1. Open `components/synapse/<slug>/design-spec.mdx`.
2. Implement from `Composition & API` + `Codegen Contract`.
3. Use only semantic tokens (`var(--...)`) from `synapse-theme.css`.
4. Validate against the component's checklist.

### For agents

Prompt guidance:

- treat `root-spec.mdx`, `synapse-theme.css`, and component `design-spec.mdx` as canonical;
- do not invent styles/behaviors not present in spec;
- if information is missing, return explicit gaps instead of guessing.

### For MCP server / API flows

- resolve source node from `data/synapse-component-figma-map.json`;
- preserve `Source Mapping` metadata in generated outputs;
- return code + contract checklist pass/fail status.

## Production-Ready Gate

Before auto-generation, verify:

- `Codegen Contract` exists and is deterministic.
- Light/Dark state structures are parallel.
- Prop/event contract and defaults are explicit.
- Asset mapping and bundling rules are explicit (if assets exist).
- Fallback/error behavior is defined.
- Validation checklist is actionable.

## Reusing Specs In Another Repository

You can copy these design specs to another repository and generate components (styles + interactions + accessibility), as long as the target repository includes the required dependencies of the spec.

### Minimum files to copy

- `components/synapse/root-spec.mdx`
- `components/synapse-theme.css` (or an equivalent token file with the same variables)
- `components/synapse/<slug>/design-spec.mdx`
- any referenced assets (for example `assets/icons/*.svg`)

### Portability requirements

- Token variables referenced by the spec must exist in the target repo.
- Asset slug-to-file mapping must be preserved.
- The generator/agent must treat spec contracts as canonical and not invent missing values.

### Copy-paste prompt template for AI agents

Use this template in the target repository:

```
Generate <framework> component(s) from the provided design spec.

Source of truth (in order):
1) root-spec.mdx
2) theme CSS variables file
3) component design-spec.mdx
4) referenced assets (icons/images)

Requirements:
- Implement full Composition/API and Codegen Contract.
- Include styles, interactions, states (light/dark), and accessibility behavior.
- Use semantic tokens (var(--...)) only; do not hardcode drift-prone values.
- Preserve slot/anatomy order and variant matrix exactly.
- If any token/asset/contract data is missing, return a gap list and stop guessing.
```

## Framework-Agnostic Component Generation Guide

Use the following files as the minimum generation inputs:
- component baseline spec: `components/ids/<slug>/design-spec.mdx`
- IDS baseline root spec: `components/ids/root-spec.mdx`
- IDS theme: `components/ids-theme.css`
- optional program root delta: `components/<program>/root-spec.mdx`
- optional program theme delta: `components/<program>-theme.css`
- optional program component delta: `components/<program>/<slug>/design-spec.mdx`

For machine-consumable handoff between agents:
- contract doc: `data/agent-generation-contract.md`
- contract schema: `data/agent-generation-contract.schema.json`

### Prompt example: IDS baseline only

```text
Generate a framework-agnostic component implementation plan and then code for Button.

Source-of-truth (highest to lowest):
1) components/ids/button/design-spec.mdx
2) components/ids/root-spec.mdx

Theme:
1) components/ids-theme.css

Requirements:
- Preserve anatomy, variants, states, interactions, and accessibility contract.
- Use semantic tokens only (var(--...)); do not hardcode visual values.
- Include fallback behavior for unknown variant/size and missing icon assets.
- Output sections:
  === COMPONENT ===
  === CSS ===
```

### Prompt example: IDS baseline + program deltas (DAP)

```text
Generate DAP Button from layered design specs.

Layer precedence (highest to lowest):
1) components/DAP/root-spec.mdx   # Program Delta Register contains Button deltas
2) components/ids/button/design-spec.mdx
3) components/ids/root-spec.mdx

Theme precedence:
1) components/ids-theme.css
2) components/dap-theme.css

Requirements:
- Apply DAP visual deltas from Program Delta Register.
- Keep IDS behavior and accessibility unless overridden by DAP root-spec.
- Use only semantic CSS tokens.
- Return:
  === COMPONENT ===
  === CSS ===
```

### Prompt example: with program-specific component delta

```text
Generate <program> <component> using layered specs.

Layer precedence:
1) components/<program>/<slug>/design-spec.mdx
2) components/<program>/root-spec.mdx
3) components/ids/<slug>/design-spec.mdx
4) components/ids/root-spec.mdx

Theme precedence:
1) components/ids-theme.css
2) components/<program>-theme.css

Enforce:
- full variant/state matrix
- interaction and keyboard contracts
- accessibility requirements
- token-only visual properties
```

### Expected output quality

When the above inputs are present, generated components should be framework-agnostic in behavior and visually consistent with the design spec contract. Differences should be limited to framework syntax and project scaffolding conventions.

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
│   ├── synapse.yaml                # Synapse config
│   └── dap.yaml                    # DAP config (IDS baseline + DAP deltas)
└── settings.py                     # Global settings (env vars, paths)
```

Key layered config fields (`synapse.yaml`, `dap.yaml`):
- `baseline_components_dir`, `baseline_root_spec_path`, `baseline_theme_css_path`
- `program_components_dir`, `program_root_spec_path`, `program_theme_css_path`
- precedence during generation: program component delta > program root delta > IDS component > IDS root

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
│   ├── ids/
│   │   └── <slug>/design-spec.mdx  # IDS component specs (from `data/component-figma-map.json`)
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
- `DESIGN_SYSTEM=synapse` for Synapse pipeline
- `DESIGN_SYSTEM=dap` for DAP pipeline (IDS baseline + DAP overrides)
- default when unset: `DESIGN_SYSTEM=ids`
