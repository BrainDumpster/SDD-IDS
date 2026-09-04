# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Spec-Driven Design Intelligence System — extracts design system knowledge from Figma, generates framework-agnostic `design-spec.md` files, validates generated code, and supports optional LLM-based component generation from specs.

Supports multiple design systems via `DESIGN_SYSTEM` env var:
- **IDS** (default): Original IDS design system
- **DAP**: Program deltas layered on IDS (`components/DAP`, `components/dap-theme.css`)
- **Synapse**: Synapse design system with Base UI (`@base-ui-components/react`) as the React implementation layer

## Commands

```bash
# Install dependencies (uses uv — see pyproject.toml + requirements.txt)
uv pip install -r requirements.txt

# Optional: Ollama for LLM-based generation APIs
ollama serve
ollama pull llama3

# Figma Specs API (port 8001)
python api/figma_specs_api.py

# Enhanced Generation API (port 8002)
python api/enhanced_generation_api.py

# Sync programme theme CSS from Figma (FIGMA_TOKEN)
set -a && . ./.env && set +a
python3 scripts/sync_programme_themes_from_figma.py --with-root-spec

# Run tests
pytest tests/
```

## Architecture

### Data Flow
```
Figma → tokens/figma_spec_extractor.py → components/ids/<slug>/design-spec.md
     → tokens/figma_client.py (MCP) → token extraction/sync

design-spec.md + theme CSS → generation/ (prompt compilation) → code output
                          → validation/ (rules + tokens + structure) → report
```

### Key Subsystems

**Generation pipeline** (`generation/`): `ComponentGenerator` takes compiled context + framework + `StyleMode` enum and produces code via Ollama. `FigmaAwareGenerator` adds Figma spec awareness. `ThemeInjector` and `AutoRepairEngine` handle token injection and self-healing. Prompt compilation lives in `prompt_templates.py` and `figma_enhanced_prompts.py`.

**Validation engine** (`validation/`): `DesignValidator` orchestrates `RuleValidator`, `TokenValidator`, `StructureValidator`. `SeverityEngine` scores violations. `ReportBuilder` formats output. Entry point: `validate_design(component, code)`.

**Token management** (`tokens/`): Figma MCP client, token extraction/normalization, CSS syntax generation, component-token mapping. `figma_spec_extractor.py` pulls full component specs from Figma.

**Knowledge layer** (`knowledge/`): Component registry, rule models, pattern graphs, schema building for the design system knowledge base.

### API Ports
| API | Port | Module |
|-----|------|--------|
| Figma Specs | 8001 | `api/figma_specs_api.py` |
| Enhanced Generation | 8002 | `api/enhanced_generation_api.py` |

### Important Data Files
- `data/component-figma-map.json` — IDS / DAP component → Figma URL + node ID. **Read this first** when working with any IDS component's Figma data.
- `data/synapse-component-figma-map.json` — Synapse component → Figma node IDs (~80 entries).
- `data/synapse-baseui-mapping.json` — maps each Synapse component to its Base UI implementation strategy.
- `data/synapse-component-registry.json` — Synapse component anatomy, states, variants, tokens.
- `data/synapse-rules.json` — Synapse design system rules (31 rules).
- `data/synapse-allowed-tokens.json` — flat list of valid Synapse CSS variable names (209 tokens).
- `rules.json` — IDS design system rules (accessibility, layout) with severity levels.
- `components/ids/<slug>/design-spec.md` — IDS Figma-aligned component specifications.
- `components/synapse/<slug>/design-spec.md` — Synapse component specifications.
- `components/ids-theme.css` — IDS global CSS variables (light + dark; `data-design-system="ids"`).
- `components/synapse-theme.css` — Synapse global CSS variables (light + dark themes).

### Design System Abstraction
- `config/design_system_config.py` — `DesignSystemConfig` dataclass + `load_design_system()` factory.
- `config/design_systems/ids.yaml` / `dap.yaml` / `synapse.yaml` — per-design-system YAML configs.
- All pipeline modules accept config-driven paths (rules, tokens, registry).
- `generation/framework_adapters/` — `BaseUIAdapter`, `ReactCSSAdapter`, `AngularAdapter`.
- `validation/baseui_validator.py` — Base UI compliance checks for Synapse React generation.
- `StyleMode.BASE_UI_CSS` — new style mode for Base UI + CSS Modules generation.

## Design-Spec Workflow (from Cursor rules)

The primary workflow is creating/maintaining `components/ids/<slug>/design-spec.md` with maximum Figma fidelity. Implementation/codegen is **optional** — only when explicitly requested.

1. Read `data/component-figma-map.json` to get the component's `figmaUrl` and `nodeId`.
2. Figma semantic variables (`var(--...)`) are authoritative for token naming.
3. Required spec sections: Metadata, Layout & Measurements, Tokens, States (Light Theme), States (Dark Theme), Interactions.
4. Never hardcode colors/spacing/typography — always reference CSS variables/design tokens.
5. Light and Dark state tables must be structurally parallel.
6. Global token CSS is built from Figma collections (priority: `Tokens` > `Primitive` > `Density Primitive`) and stored in `components/ids-theme.css` — shared across IDS components, not per-component.
7. **Composition API sync:** when adding group + projected children in Storybook/framework code, update the matching `design-spec.md` in the same change (see `docs/design-spec-authoring-contract.md` → **Composition pattern sync** and `.cursor/rules/composition-design-spec-sync.mdc`).
8. **Synapse Storybook:** React only (`storybook/` / `storybook-generated/synapse/`). Do not add Synapse examples under `storybook-angular/` unless explicitly requested.

## Environment

- Python 3.12+ (`.python-version` = 3.12)
- Config via `.env` (see `.env.example`). Key vars: `GITHUB_HOST`, `GITHUB_REPO`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `OLLAMA_HOST`, `FIGMA_TOKEN`, `DESIGN_SYSTEM`.
- All settings loaded in `config/settings.py` as a singleton `settings` object. `settings.design_system_config` lazy-loads the active `DesignSystemConfig`.
- `PYTHONPATH` must include project root (needed for imports like `from config.settings import settings`).
