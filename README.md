# SDD-IDS — Spec-Driven Design Intelligence System

A RAG-powered platform that extracts design system knowledge from Figma, generates framework-agnostic `design-spec.md` files, and serves them to downstream AI coding agents and development teams.

## What It Does

- **Extracts** component specs from Figma via MCP tools (tokens, states, anatomy, measurements)
- **Generates** framework-agnostic `design-spec.md` files — the canonical deliverable for any developer (React, Angular, Vue, native)
- **Validates** generated code against design system rules and tokens
- **Indexes** design system documentation (MDX from GitHub Enterprise) into Qdrant vectors for RAG
- **Answers** design system questions via chat agent and semantic search API

Supports multiple design systems via `DESIGN_SYSTEM` env var:
- **IDS** (default): Original IDS design system (`components/ids`, `components/ids-theme.css`)
- **Synapse**: Synapse design system with Base UI (`@base-ui-components/react`) as the React implementation layer
- **DAP**: Program-specific deltas layered on IDS baseline specs and tokens (`components/DAP`, `components/dap-theme.css`)

## Create a new design-spec (intake wizard)

Non-coders and developers can create production-ready `design-spec.md` files from Figma using a **chat wizard** — no YAML, no local form. Works in **Cursor**, **Windsurf Cascade**, and **Windsurf Devin** (see Devin notes in the doc).

**Full guide:** [`docs/design-spec-intake.md`](docs/design-spec-intake.md)  
**Authoring rules (IDE-agnostic):** [`docs/design-spec-authoring-contract.md`](docs/design-spec-authoring-contract.md)

### Which wizard? (pick first)

| Situation | Use | `specPattern` |
|-----------|-----|---------------|
| New **IDS-only** component | **Intake wizard** (this section) | `ids-native` |
| **Programme fork** — same anatomy as IDS, programme token/layout/chrome changes | [**Programme inheritance**](#programme-inheritance-design-spec-any-programme-from-ids) | `ids-fork` |
| **Programme-native** UI — no IDS counterpart (e.g. Synapse Chat Input Box, Suggested Prompt) | **Intake wizard** with **`Inherits IDS: no`** | `standalone` |

### How to use the intake wizard in Cursor

1. **Open SDD-IDS** in Cursor (Figma MCP enabled, or `FIGMA_TOKEN` in `.env`).
2. **Start a new agent chat** and invoke `@design-spec-intake-wizard` or paste the [base prompt](#base-prompt-paste-into-a-new-agent-chat) below.
3. **Answer one question per turn** until the agent shows a summary:
   - Programme / design system (`ids`, `synapse`, `dap`, or any registered slug)
   - Component display name
   - **Inherits IDS component?** (skip when programme = IDS) — `yes` / `no` / `unknown`
     - **`yes`** → agent hands off to [`@design-spec-programme-inheritance`](#programme-inheritance-design-spec-any-programme-from-ids)
     - **`no`** → **standalone** programme spec (no IDS baseline section)
   - Category (optional)
   - Figma URLs in three buckets — **Main component** (one or many), **Elements**, **States** (reply `done` when finished with each bucket)
   - Storybook: `yes` / `no`
4. **Reply `yes`** on the summary. The agent creates `components/<programme>/<slug>/`, updates the Figma map, runs live Figma MCP on every URL, and writes `design-spec.md` with **Status: draft**.

**Standalone programme specs** (`Inherits IDS: no`): full spec from programme Figma only — no `## IDS baseline` block, no programme deltas table. Metadata includes `Spec pattern: standalone`. See [authoring contract — Programme standalone](docs/design-spec-authoring-contract.md#programme-standalone-no-ids-inheritance). Examples: [`components/synapse/suggested-prompt/design-spec.md`](components/synapse/suggested-prompt/design-spec.md).

### Base prompt (paste into a new agent chat)

Open the SDD-IDS repo as your workspace, start a new agent session, and paste:

```text
Run the design-spec intake wizard: ask me each required question one at a time, wait for my answer, then show a summary for confirmation. After I confirm, generate a production-ready framework-agnostic design-spec. Follow docs/design-spec-authoring-contract.md and docs/design-spec-intake.md (portable wizard rules). Do not call Figma or write files until I confirm the summary.
```

**Cursor shortcut:**

```text
@design-spec-intake-wizard Start the design-spec intake wizard.
```

**Programme standalone shortcut** (when you already know there is no IDS counterpart):

```text
@design-spec-intake-wizard Start the intake wizard. Programme: synapse. Component: Suggested Prompt. Inherits IDS: no.
```

If Storybook = **yes**, examples are generated under **Spec Generated** with primary story **Spec Accurate Design** ([details](docs/design-spec-intake.md#storybook-examples-when-you-answer-yes)).

| Artifact | Path |
|----------|------|
| Intake guide + Devin/Cascade steps | [`docs/design-spec-intake.md`](docs/design-spec-intake.md) |
| Production-ready contract | [`docs/design-spec-authoring-contract.md`](docs/design-spec-authoring-contract.md) |
| Wizard skill (Cursor) | [`.cursor/skills/design-spec-intake-wizard/SKILL.md`](.cursor/skills/design-spec-intake-wizard/SKILL.md) |
| Programme inheritance skill (Cursor) | [`.cursor/skills/design-spec-programme-inheritance/SKILL.md`](.cursor/skills/design-spec-programme-inheritance/SKILL.md) |
| Blueprint / hardening | [`.cursor/skills/design-spec-blueprint/SKILL.md`](.cursor/skills/design-spec-blueprint/SKILL.md) |
| Standalone scaffold template | [`scripts/design_spec_template.py`](scripts/design_spec_template.py) → `PROGRAMME_STANDALONE_TEMPLATE` |

**Prerequisites:** Figma MCP in the IDE (recommended) or `FIGMA_TOKEN` in `.env` for REST fallback.

## Generate UI code with an AI agent (non-developer guide)

After a `design-spec.md` exists, you can ask an AI agent to **turn the spec into real UI code** (for example a React component and its styles). The agent reads the spec files — it should not guess colours, spacing, or behaviour.

Works in **Cursor**, **Windsurf Cascade**, and similar IDEs. You do **not** need to run Python scripts or APIs for a basic chat-based workflow.

### Two ways to work

| Approach | Best for | What you need |
|----------|----------|----------------|
| **A. Full SDD-IDS repo open** | Teams maintaining specs inside this project | Clone/open SDD-IDS; agent reads files from `components/…` automatically |
| **B. Portable spec bundle only** | Teams generating in **their own app repo** without cloning SDD-IDS | Copy only the files listed in [Portable bundle](#portable-spec-bundle-generate-without-cloning-sdd-ids) into their project |

### What you tell the agent (inputs)

You only need to decide these in plain language:

| Input | What it means | Example |
|-------|----------------|---------|
| **Programme** | Design system flavour | IDS, Synapse, or DAP |
| **Component** | Which UI piece to build | Button, Card, App Launcher |
| **Target framework** | Where the code will run | React, Angular, Vue, Lit |
| **Style approach** (optional) | How styles are written | CSS Modules, SCSS, Base UI + CSS |

You **do not** paste Figma URLs again if the design spec was already created and verified. Figma is for **creating** specs; **code generation** uses the spec + theme files.

**Optional:** say whether you want a **Storybook preview story** (visual check only — separate from production app code).

### Step by step (full repo — approach A)

1. Open the **SDD-IDS** workspace in your AI IDE.
2. Confirm the component has a `design-spec.md` (use the [intake wizard](#create-a-new-design-spec-intake-wizard) first if not).
3. Start a **new agent chat**.
4. Paste a [generation prompt](#copy-paste-prompts) below.
5. Review the output; ask the agent to fix anything that does not match the spec.

### What the agent reads (you do not paste these manually)

When SDD-IDS is open, the agent loads layers **in order** (most specific wins):

1. Programme component spec — e.g. `components/synapse/button/design-spec.md` (if it exists)
2. Programme root rules — e.g. `components/synapse/root-spec.md` (if it exists)
3. IDS component spec — e.g. `components/ids/button/design-spec.md`
4. IDS root rules — `components/ids/root-spec.md`
5. Theme CSS — `components/ids-theme.css`, then programme theme (e.g. `components/synapse-theme.css`)

### Portable spec bundle (generate without cloning SDD-IDS)

If your team works in **another repository**, copy only the **design contract files** for the component(s) you need. You do **not** need Qdrant, Ollama, Figma MCP, or the rest of SDD-IDS to generate code from specs.

**Suggested folder in your app repo** (keep the same relative paths so prompts stay simple):

```text
design-contract/
├── ids/
│   ├── root-spec.md
│   └── <slug>/design-spec.md
├── ids-theme.css
├── synapse/                    # only if programme = Synapse
│   ├── root-spec.md            # if your programme has one
│   └── <slug>/design-spec.md   # programme fork or full spec
├── synapse-theme.css           # only if programme = Synapse
├── dap/                        # only if programme = DAP
│   └── root-spec.md
├── dap-theme.css               # only if programme = DAP
└── assets/icons/               # only icons referenced in the spec
```

**Minimum files by programme**

| Programme | Always copy | Also copy when… |
|-----------|-------------|-----------------|
| **IDS** | `components/ids/root-spec.md`, `components/ids-theme.css`, `components/ids/<slug>/design-spec.md`, any `assets/icons/…` referenced in the spec | — |
| **Synapse (IDS fork)** | IDS files above **plus** `components/synapse/<slug>/design-spec.md`, `components/synapse-theme.css` | Synapse overrides IDS — both layers are required |
| **Synapse (standalone)** | `components/synapse/root-spec.md` (if present), `components/synapse-theme.css`, `components/synapse/<slug>/design-spec.md`, assets | No IDS baseline |
| **DAP** | IDS baseline files **plus** `components/DAP/root-spec.md`, `components/dap-theme.css` | Optional `components/DAP/<slug>/design-spec.md` only if that component has a dedicated delta spec |

**Optional but helpful:** `data/agent-generation-contract.md` — short rules agents can follow for layered precedence and validation.

**In your app repo**

1. Paste the [portable bundle prompt](#copy-paste-prompts) into a new agent chat (your **app** workspace, not SDD-IDS).
2. Point the agent at your `design-contract/` folder paths.
3. Ensure your app loads the theme CSS (or maps the same `var(--…)` tokens in your build).
4. Copy any referenced icons into your app’s asset pipeline.

**What you do *not* need to copy:** `storybook/`, `generation/`, `rag/`, vector DB, `.env` Figma tokens, or full `data/` maps — unless you want Storybook parity inside SDD-IDS itself.

### Copy-paste prompts

**Full repo (SDD-IDS open):**

```text
Generate a <React | Angular | Vue | Lit> implementation for <Component Name> using our design specs in this repo.

Programme: <IDS | Synapse | DAP>
Use the layered spec files and theme CSS for this programme. The design spec is the single source of truth.
Use only semantic tokens (var(--...)); do not hardcode colours, spacing, or typography.
Implement all states, interactions, and accessibility rules from the spec.
If anything is missing, list gaps — do not guess.
```

**Portable bundle (your app repo only):**

```text
Generate a <React | Angular | Vue | Lit> component for <Component Name> from the design contract in ./design-contract/.

Read in this order (highest priority first):
1) design-contract/<programme>/<slug>/design-spec.md  (if present)
2) design-contract/<programme>/root-spec.md            (if present)
3) design-contract/ids/<slug>/design-spec.md
4) design-contract/ids/root-spec.md

Theme CSS (load in this order):
1) design-contract/ids-theme.css
2) design-contract/<programme>-theme.css               (if present)

Requirements:
- Follow Composition & API and Codegen Contract sections exactly.
- Use var(--...) only; no hardcoded visual values.
- Include icons from design-contract/assets/icons/ per the spec asset table.
- If a token or asset is missing, return a gap list and stop.
```

### Storybook vs production code

| Output | Purpose |
|--------|---------|
| **Spec Accurate Design** story (in SDD-IDS `storybook-generated/`) | Visual proof that the spec is complete — created when intake Storybook = **yes** |
| **Component in your app** | Separate agent step — use the prompts above in your product repository |

### When to create a spec first

| Situation | First step | Then generate code |
|-----------|------------|-------------------|
| No spec yet | Pick wizard from [Which wizard?](#which-wizard-pick-first) — [intake](#create-a-new-design-spec-intake-wizard) or [programme inheritance](#programme-inheritance-design-spec-any-programme-from-ids) | Prompts above |
| Spec already in SDD-IDS | Copy portable bundle **or** open full repo | Prompts above |

Machine-readable handoff for tooling: [`data/agent-generation-contract.md`](data/agent-generation-contract.md).

## Programme inheritance design-spec (any programme from IDS)

Use when a **programme layer** reuses an IDS component family in Figma but has programme-specific token, layout, radius, border, or slot changes. A **programme** is any design system defined in `config/design_systems/<slug>.yaml` that layers on IDS (for example `synapse`, `dap` — not limited to those two).

**Output:** a full `components/<programme>/<slug>/design-spec.md` with an **IDS baseline pointer** + **programme deltas table** (never a deltas-only file).

**Skill:** [`.cursor/skills/design-spec-programme-inheritance/SKILL.md`](.cursor/skills/design-spec-programme-inheritance/SKILL.md)  
**Full guide:** [`docs/design-spec-programme-inheritance.md`](docs/design-spec-programme-inheritance.md)

### When to use this skill

| Situation | Use this skill? |
|-----------|-----------------|
| New IDS-only component | No — use [intake wizard](#create-a-new-design-spec-intake-wizard) |
| Programme fork of an IDS component (same anatomy, different tokens/layout) | **Yes** |
| Programme-native UI with no IDS counterpart | No — use intake wizard → **standalone** spec |

### How to use the skill in Cursor

1. **Open SDD-IDS** in Cursor (Figma MCP enabled, or `FIGMA_TOKEN` in `.env`).
2. **Start a new agent chat.**
3. **Invoke the skill** with `@design-spec-programme-inheritance` or paste one of the [prompts below](#programme-inheritance-prompts).
4. **Answer one question per turn** until the agent shows a summary:
   - Programme slug (e.g. `synapse`, `dap`, or any registered yaml)
   - Component display name
   - IDS baseline component (or `unknown` — agent looks it up)
   - Programme Figma URLs in three buckets: **Main component**, **Elements**, **States** (reply `done` when finished with each bucket)
   - Storybook: `yes` / `no`
5. **Reply `yes`** on the summary. The agent then:
   - Reads the IDS baseline spec (`components/ids/<slug>/design-spec.md`)
   - Runs live Figma MCP on **programme** nodes (not IDS-only)
   - Builds the `{Display name} programme deltas (vs IDS)` table
   - Writes the full programme spec and updates the figma map + [`programme-inheritance-registry.json`](data/programme-inheritance-registry.json)

**If you already have all inputs**, skip the interview: paste the [expert one-shot](#programme-inheritance-prompts) from the full guide (programme, component, IDS baseline, all three URL blocks). The agent still confirms before writing files.

**New programme?** Add `config/design_systems/<slug>.yaml` (with `baseline_components_dir: components/ids` and a distinct `components_dir`) and register it in `data/programme-inheritance-registry.json` before running the skill.

### What the skill produces

Each generated spec includes:

- `## IDS baseline (layout, flow, contracts)` — pointer to the IDS spec
- `### {Programme} programme deltas (vs IDS)` — table of **verified** differences only
- All 10 required `##` sections (Anatomy, Layout, Tokens, States, Interactions, Codegen Contract, …)
- Live Figma evidence in Metadata + Source Mapping
- `Status: draft` until the validation checklist passes

Reference examples: [`components/synapse/left-nav/design-spec.md`](components/synapse/left-nav/design-spec.md), [`components/synapse/modal/design-spec.md`](components/synapse/modal/design-spec.md).

### Programme inheritance prompts

#### Wizard mode (one question at a time)

```text
Run the programme inheritance design-spec process.

Follow docs/design-spec-programme-inheritance.md and docs/design-spec-authoring-contract.md.
Load the design-spec-programme-inheritance skill.

Ask me ONE question per message until you have:
  programme, component name, IDS baseline (if known),
  Main component URL(s), Element URL(s), State URL(s),
  Storybook yes/no.

For Elements and States: repeat “paste another URL or reply done” until I say done for each bucket.
Show a summary (all parsed node IDs by bucket) and wait for my yes before Figma calls or file writes.
```

#### Cursor shortcut

```text
@design-spec-programme-inheritance Generate a programme inheritance design-spec. Ask one question at a time, confirm before run.
```

#### Expert one-shot (all URLs ready)

Paste programme, component, IDS baseline, and Figma URLs in three blocks. Template: [`docs/design-spec-programme-inheritance.md#expert-one-shot--paste-all-urls-in-three-blocks-recommended-for-you`](docs/design-spec-programme-inheritance.md#expert-one-shot--paste-all-urls-in-three-blocks-recommended-for-you).

| Artifact | Path |
|----------|------|
| Programme inheritance guide + one-shot prompts | [`docs/design-spec-programme-inheritance.md`](docs/design-spec-programme-inheritance.md) |
| Programme inheritance skill | [`.cursor/skills/design-spec-programme-inheritance/SKILL.md`](.cursor/skills/design-spec-programme-inheritance/SKILL.md) |
| Synapse walkthrough (examples only) | [`docs/design-spec-synapse-ids-fork.md`](docs/design-spec-synapse-ids-fork.md) |
| Fork registry | [`data/programme-inheritance-registry.json`](data/programme-inheritance-registry.json) |
| Scaffold template | [`scripts/design_spec_template.py`](scripts/design_spec_template.py) → `PROGRAMME_IDS_FORK_TEMPLATE` |
| Example spec (active) | [`components/synapse/left-nav/design-spec.md`](components/synapse/left-nav/design-spec.md) |
| Example spec (draft) | [`components/synapse/modal/design-spec.md`](components/synapse/modal/design-spec.md) |

## Spec Pipeline

The primary output is a hierarchy of design specs that downstream agents consume:

```
components/synapse/
├── root-spec.md              # Global: tokens, typography, elevation, breakpoints, baselines
├── button/design-spec.md     # Component override: anatomy, states, tokens, interactions
├── dialog/design-spec.md
├── table/design-spec.md
└── ... (46 components)
```

**Root spec** (`root-spec.md`) centralizes everything shared across all components:
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

## Component implementation guides

Per-component README files document regeneration, reference implementations, and implementation pitfalls. Start from the design spec, then use the component README for hands-on work.

| Component | README | Design spec |
|---|---|---|
| **Datagrid** (IDS) | [`components/ids/datagrid/README.md`](components/ids/datagrid/README.md) | [`components/ids/datagrid/design-spec.md`](components/ids/datagrid/design-spec.md) |

Add a row to this table when you introduce a `README.md` next to a component spec (same pattern as Datagrid).

## Using Design Specs As Source Of Truth

Production-ready component specs under `components/synapse/<slug>/design-spec.md` are intended for spec-driven generation across frameworks (React, Angular, Vue, Lit, and others), provided generators follow the spec contract sections.

### Read order for generation

For any component `<slug>`, parse in this order:

1. `components/synapse/root-spec.md`
2. `components/synapse-theme.css`
3. `components/synapse/<slug>/design-spec.md`
4. Referenced assets (for example `assets/icons/*.svg`)

### Required sections in component specs

Top-level `##` sections (use this order):

1. `Metadata`
2. `Anatomy`
3. `Layout & Measurements`
4. `Tokens`
5. `States (Light Theme)`
6. `States (Dark Theme)`
7. `Interactions`
8. `Composition & API (runtime)`
9. `Codegen Contract (Framework-Agnostic Blueprint)`
10. `Source Mapping`

Component-specific material (for example display modes, link contracts, typography tables) should live under the nearest parent as `###` subsections—not as extra top-level `##` headings.

Under **Codegen Contract**, use these standard `###` titles when applicable:

- `Deterministic structure`
- `Variant matrix`
- `Per-slot style contract`
- `Behavior contract`
- `Accessibility contract`
- `Asset resolution + bundling contract`
- `Fallback/error rules`
- `Validation checklist`

Reference: `components/ids/alert/design-spec.md` and `components/ids/accordion/design-spec.md`.

### Design-spec tooling & generators

Scripts and templates that create or maintain `components/ids/<slug>/design-spec.md` with the canonical section contract above.

| Artifact | Path | Role |
|---|---|---|
| Canonical template & bootstrap blocks | `scripts/design_spec_template.py` | `NEW_SPEC_TEMPLATE` (IDS), `PROGRAMME_STANDALONE_TEMPLATE` (programme-native), `PROGRAMME_IDS_FORK_TEMPLATE` (inheritance) |
| Heading normalizer | `scripts/normalize_design_spec_headings.py` | Reorder `##` sections, rename Codegen `###` titles, reparent stray `##` blocks; add Composition/Codegen stubs for legacy specs |
| Map-driven scaffold | `scripts/generate_specs_from_map.py` | Create `design-spec.md` from `data/component-figma-map.json` (`--overwrite` to replace existing) |
| Docs-first composer | `ingestion/design_spec_composer.py` | Compose specs from GitHub docs + Figma extraction (outputs canonical `##` / `###` layout) |
| Figma → MDX extractor | `tokens/figma_spec_extractor.py` | `spec_to_mdx()` output uses canonical section names (extend for full blueprint depth) |
| Spec contract validation | `validation/spec_contract_parser.py` | Checks required `##` sections (used by gates and QA) |
| Intake wizard (IDS + programme standalone) | `.cursor/skills/design-spec-intake-wizard/SKILL.md` | Interactive Q&A → confirm → `design-spec.md`; `standalone` when `Inherits IDS: no`; see `docs/design-spec-intake.md` |
| Programme inheritance wizard | `.cursor/skills/design-spec-programme-inheritance/SKILL.md` | Programme fork from IDS baseline + deltas (`ids-fork`); see `docs/design-spec-programme-inheritance.md` |
| Authoring skill | `.cursor/skills/design-spec-blueprint/SKILL.md` | Agent workflow: Figma verification, required sections, production-ready gate |
| States dark dedupe | `scripts/dedupe_states_dark_theme.py` | Replace duplicate **States (Dark Theme)** tables when identical token-only matrices exist under Light (dry-run by default; `--apply` to write) |

**States (Light / Dark) — default for new specs**

- Put the full state matrix in **States (Light Theme)** when light and dark share the same semantic `var(--...)` names.
- Under **States (Dark Theme)**, use the standard pointer in `DARK_STATES_BOILERPLATE` (`scripts/design_spec_template.py`): dark resolved values come from `components/ids-theme.css`, program theme overlays, and `[data-theme="dark"]`.
- Keep a full **States (Dark Theme)** table only when dark rows use different `var(--...)` than light.
- Do not auto-dedupe specs whose state cells use authoritative `#hex` / `rgb()` literals without `var(--...)` (the dedupe script skips them).

```bash
# List specs with identical token-only Light/Dark state tables
python3 scripts/dedupe_states_dark_theme.py

# Apply standard Dark pointer section
python3 scripts/dedupe_states_dark_theme.py --apply
```

**Spec Accurate Design examples (IDS)**

Reference Storybook stories named **Spec Accurate Design** document the canonical spec → UI parity target for codegen and visual QA:

| Component | Spec | Stories | Component README |
|---|---|---|---|
| Datagrid | [`components/ids/datagrid/design-spec.md`](components/ids/datagrid/design-spec.md) | `storybook-generated/ids/src/components/Datagrid.stories.tsx` | [`components/ids/datagrid/README.md`](components/ids/datagrid/README.md) |
| Main Menu/Left | [`components/ids/main-menu-left/design-spec.md`](components/ids/main-menu-left/design-spec.md) | `storybook-generated/ids/src/components/MainMenuLeft.stories.tsx` | [`components/ids/main-menu-left/README.md`](components/ids/main-menu-left/README.md) |

Regenerate Main Menu/Left stories after spec changes:

```bash
export DESIGN_SYSTEM=ids
python3 scripts/strict_spec_storybook_gate.py --component main-menu-left --spec-only --deterministic-story
```

**Normalize headings** (from repository root). Does **not** delete body text—only moves sections and renames headings:

```bash
# All IDS component specs under components/ids/
python3 scripts/normalize_design_spec_headings.py

# Only specs that lacked Codegen Contract before this run
python3 scripts/normalize_design_spec_headings.py --legacy-only
```

- **Blueprint specs** (already had Codegen): reorder, standardize Codegen `###` titles, reparent extras (e.g. `## Typography` → `### Typography` under **Tokens**).
- **Legacy specs**: same pass, plus **Codegen bootstrap** (cross-refs to Anatomy / Interactions / Variants), **Composition & API** stub when missing, and **Deliverable Checklist** → **Codegen → Validation checklist**.

**Scaffold new specs from the component map:**

```bash
python3 scripts/generate_specs_from_map.py --overwrite
```

Replace Codegen cross-refs with concrete contracts when hardening a spec for production (`Status: active`). See `.cursor/skills/design-spec-blueprint/SKILL.md`.

### Root spec vs component spec

- `root-spec.md`: shared design-system baseline (global tokens, typography, spacing, elevation, baseline interactions/accessibility).
- component `design-spec.md`: deterministic per-component contract and overrides.
- `synapse-theme.css`: concrete token values for light/dark resolution.

Generator rule:
- Use component values first;
- inherit from root when not overridden;
- resolve styles through CSS variables from `synapse-theme.css`.

## IDS Baseline + Program Overrides

The generator now supports a layered model where IDS is always the base.

Layer precedence used at runtime:
1. program component delta (`components/<program>/<slug>/design-spec.md`) — optional
2. program root delta (`components/<program>/root-spec.md`) — optional but recommended
3. IDS component baseline (`components/ids/<slug>/design-spec.md`) — required
4. IDS root baseline (`components/ids/root-spec.md`) — required

Theme precedence used at runtime:
1. `components/ids-theme.css`
2. `components/<program>-theme.css` (or `components/<program>/theme.css`)

### What happens when a program has no separate component spec?

If `components/<program>/<slug>/design-spec.md` does not exist, codegen still works by combining:
- `components/ids/<slug>/design-spec.md` (baseline component behavior/contract)
- `components/<program>/root-spec.md` (program-level visual/behavior deltas)
- `components/ids-theme.css` + program theme file (token value overrides)

This is the recommended mode when program deltas are centralized in root spec instead of per-component files.

### Concrete DAP example (no component delta file)

For DAP Button, if there is no `components/DAP/button/design-spec.md`, generator still resolves:
1. `components/ids/root-spec.md`
2. `components/ids/button/design-spec.md`
3. `components/DAP/root-spec.md` (button deltas in Program Delta Register)
4. `components/ids-theme.css`
5. `components/dap-theme.css`

This allows DAP to inherit IDS behavior and override only visual/contract deltas in root + theme files.

### How a program should add its own components or override IDS

For a new program `<program>`:
1. Add config file `config/design_systems/<program>.yaml` with layered paths:
   - `baseline_components_dir: components/ids`
   - `baseline_root_spec_path: components/ids/root-spec.md`
   - `baseline_theme_css_path: components/ids-theme.css`
   - `program_components_dir: components/<program>`
   - `program_root_spec_path: components/<program>/root-spec.md`
   - `program_theme_css_path: components/<program>-theme.css` (or equivalent)
2. Put global deltas in `components/<program>/root-spec.md` (layout, typography, visual attributes, interaction deltas, variant constraints).
3. Put token value deltas in `components/<program>-theme.css`.
4. Create `components/<program>/<slug>/design-spec.md` only when the component is truly program-specific or needs a dedicated per-component delta contract.
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

1. Open `components/synapse/<slug>/design-spec.md`.
2. Implement from `Composition & API` + `Codegen Contract`.
3. Use only semantic tokens (`var(--...)`) from `synapse-theme.css`.
4. Validate against the component's checklist.

### For agents

Prompt guidance:

- treat `root-spec.md`, `synapse-theme.css`, and component `design-spec.md` as canonical;
- do not invent styles/behaviors not present in spec;
- if information is missing, return explicit gaps instead of guessing.

### For MCP server / API flows

- resolve source node from `data/synapse-component-figma-map.json`;
- preserve `Source Mapping` metadata in generated outputs;
- return code + contract checklist pass/fail status.

## Production-Ready Gate

Before auto-generation, verify:

- `### Slot geometry (Figma-verified)` table under Layout & Measurements (`python3 scripts/validate_spec_geometry_gate.py --component <slug>`).
- `Codegen Contract` exists and is deterministic.
- Light/Dark state structures are parallel.
- Prop/event contract and defaults are explicit.
- Asset mapping and bundling rules are explicit (if assets exist).
- Fallback/error behavior is defined.
- Validation checklist is actionable.

## Reusing Specs In Another Repository

See **[Generate UI code with an AI agent → Portable spec bundle](#portable-spec-bundle-generate-without-cloning-sdd-ids)** for the full file checklist, folder layout, and copy-paste agent prompt.

**Portability requirements (summary):**

- Token variables referenced by the spec must exist in the target repo (via copied theme CSS or equivalent).
- Asset slug-to-file mapping must be preserved (`assets/icons/…`).
- The agent must treat spec contracts as canonical and not invent missing values.

## Framework-Agnostic Component Generation Guide

Use the following files as the minimum generation inputs:
- component baseline spec: `components/ids/<slug>/design-spec.md`
- IDS baseline root spec: `components/ids/root-spec.md`
- IDS theme: `components/ids-theme.css`
- optional program root delta: `components/<program>/root-spec.md`
- optional program theme delta: `components/<program>-theme.css`
- optional program component delta: `components/<program>/<slug>/design-spec.md`

For machine-consumable handoff between agents:
- contract doc: `data/agent-generation-contract.md`
- contract schema: `data/agent-generation-contract.schema.json`

## Strict Spec-to-Storybook Zero-Drift Gate

To enforce spec-first generation and prevent Storybook drift:

- `design-spec.md` (plus layered root/theme specs) is the only source of truth.
- Generated Storybook artifacts are written to a separate root (`generated_storybook_dir`) and **must not** overwrite legacy `storybook/`.
- Story files include a spec-layer hash marker and are validated for freshness.

### Generated output location

Configure per design system in `config/design_systems/*.yaml`:

- `generated_storybook_dir` (for example `storybook-generated/ids`)
- `strict_storybook_gate` (`true` to enforce stale-hash failures in CI)

### Gate command

Run strict gate for one component:

```bash
python scripts/strict_spec_storybook_gate.py --component button --framework React --style-mode css-module
```

Run in spec-only mode (no RAG/retrieval dependency):

```bash
python scripts/strict_spec_storybook_gate.py --component button --spec-only
```

Run for all components in the baseline components directory:

```bash
python scripts/strict_spec_storybook_gate.py --all --framework React --style-mode css-module
```

Run with Storybook build check:

```bash
python scripts/strict_spec_storybook_gate.py --all --build-storybook
```

### Step-by-step: generate code from design-spec (with scripts/actions)

Use this workflow when you want deterministic, repeatable generation from `design-spec.md` + layered root/theme contracts.

1. **Select design system context**
   - IDS baseline:
     - `export DESIGN_SYSTEM=ids`
   - Program-over-IDS (example DAP):
     - `export DESIGN_SYSTEM=dap`

2. **Confirm source-of-truth files are present**
   - Baseline component spec: `components/ids/<slug>/design-spec.md`
   - Baseline root spec: `components/ids/root-spec.md`
   - Baseline theme: `components/ids-theme.css`
   - Program root delta (optional/program mode): `components/<program>/root-spec.md`
   - Program theme delta (optional/program mode): `components/<program>-theme.css`
   - Program component delta (optional): `components/<program>/<slug>/design-spec.md`

3. **Generate deterministic Storybook from layered specs** (root Storybook **Spec Generated** is **IDS** and **DAP** only; each story imports **`components/ids-theme.css`** or **`components/dap-theme.css`**. Running the gate for **`DESIGN_SYSTEM=ids`** on **`toast`** also syncs `Toast.module.css` from the IDS toast spec.)
   - Single component:
     - `DESIGN_SYSTEM=ids python scripts/strict_spec_storybook_gate.py --component <slug> --spec-only --deterministic-story`
     - DAP: `DESIGN_SYSTEM=dap python scripts/strict_spec_storybook_gate.py --component <slug> --spec-only --deterministic-story`
   - Example:
     - `DESIGN_SYSTEM=ids python scripts/strict_spec_storybook_gate.py --component button --spec-only --deterministic-story`

4. **(Optional) run all baseline components**
   - `python scripts/strict_spec_storybook_gate.py --all --spec-only --deterministic-story`

5. **Validate generated output artifacts**
   - Stories:
     - `storybook-generated/ids/...` or `storybook-generated/dap/...` (see `generated_storybook_dir` in `config/design_systems/*.yaml`)
   - Spec hash contract:
     - `storybook-generated/<design-system>/src/spec-contracts/<slug>.spec-layer-hash.json`
   - Generated stories now include a **TokenInspector** section (token name + live resolved preview) for designer-friendly review.

6. **Build Storybook as final gate**
   - React: `cd storybook && pnpm build`
   - Angular: `cd storybook-angular && npm run build`
   - or from root via gate:
     - `python scripts/strict_spec_storybook_gate.py --component button --framework React --spec-only --deterministic-story --build-storybook`
     - `python scripts/strict_spec_storybook_gate.py --component button --framework Angular --spec-only --deterministic-story --build-storybook`

7. **Generate framework code (agent-driven) using same layered inputs**
   - Use:
     - `data/agent-generation-contract.md`
     - `data/agent-generation-contract.schema.json`
   - Instruct agent to ingest (in order):
     1) component `design-spec.md`
     2) root-spec layer(s)
     3) theme file layer(s)
     4) asset contracts (icons/images)
   - Enforce outputs through validation (`validation/spec_contract_parser.py`, `validation/spec_storybook_validators.py`, `validation/design_validator.py`).

8. **When specs change**
   - Re-run the same `strict_spec_storybook_gate.py` command for impacted components.
   - Spec hash drift + validators ensure story updates remain zero-drift with contracts.

The Storybook **Theme** toolbar (`storybook/.storybook/preview.tsx`) sets `data-theme` and `data-design-system` so canvas chrome uses each system’s `var(--color-background-surface-1)` for light/dark. **Spec Generated** stories each import **one** program theme: **`components/ids-theme.css`** (IDS) or **`components/dap-theme.css`** (DAP). Global preview loads **ids-theme**, **dap-theme**, and **synapse-theme** for legacy/manual stories.

### Toast `Toast.module.css` (spec-driven)

When you change `components/ids/toast/design-spec.md`, regenerate the shared Storybook implementation CSS:

```bash
DESIGN_SYSTEM=ids python scripts/strict_spec_storybook_gate.py --component toast --spec-only --deterministic-story
```

### Design Team Mode (recommended for external consumers)

If your goal is to publish design contracts that other teams/agents consume in their own stacks, use this interpretation:

- **Source of truth remains the layered specs**
  - `design-spec.md` + `root-spec.md` + theme CSS layers are canonical.
- **Deterministic Storybook is a validation harness** for **IDS** and **DAP** contracts (`storybook-generated/ids`, `storybook-generated/dap`). Stories prove `design-spec.md` is consumable for accurate codegen when paired with the matching program theme CSS only.
- **Current generated stories still render existing Storybook components**
  - This is expected today and does not invalidate spec-driven story generation.
  - It means story scenarios are spec-driven, while rendered implementation may still come from `storybook/src/components/...`.
- **Publishing guidance for downstream teams**
  - Treat `design-spec.md` as the normative design contract.
  - Treat interaction/runtime implementation details as consumer-owned unless explicitly marked mandatory in spec.
  - Share spec hash artifacts (`storybook-generated/<design-system>/src/spec-contracts/*.spec-layer-hash.json`) so consumers can track drift.

### What the gate validates automatically (per component)

- required spec sections exist and are parseable
- story coverage includes required variant/state references
- strict token hygiene (no hardcoded color literals in generated CSS)
- behavior scenario coverage (for scenario-driven components such as overflow `Beginning|Middle|End`)
- story freshness via `spec_hash` marker against current layered spec inputs
- idempotent regeneration (stable generated output)
- legacy isolation (no writes to `storybook/`)

### Prompt example: IDS baseline only

```text
Generate a framework-agnostic component implementation plan and then code for Button.

Source-of-truth (highest to lowest):
1) components/ids/button/design-spec.md
2) components/ids/root-spec.md

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
1) components/DAP/root-spec.md   # Program Delta Register contains Button deltas
2) components/ids/button/design-spec.md
3) components/ids/root-spec.md

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
1) components/<program>/<slug>/design-spec.md
2) components/<program>/root-spec.md
3) components/ids/<slug>/design-spec.md
4) components/ids/root-spec.md

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
# Programme theme CSS from Figma variables (FIGMA_TOKEN)
set -a && . ./.env && set +a
python3 scripts/sync_programme_themes_from_figma.py --with-root-spec
# See docs/theme-sync-from-figma.md

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
| `data/component-figma-map.json` | IDS / DAP component → Figma URLs and node IDs (primary map for `DESIGN_SYSTEM=ids` / `dap`) |
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
         ├── build_root_spec() ──► components/synapse/root-spec.md
         └── build_component_spec() ──► components/synapse/<slug>/design-spec.md
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
│   │   └── <slug>/design-spec.md  # IDS component specs (from `data/component-figma-map.json`)
│   └── synapse/
│       ├── root-spec.md   # Global design system spec
│       └── <slug>/design-spec.md  # 46 component override specs
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

Isolated Storybook packages per framework (separate `node_modules`, separate ports):

| Framework | Package | Port | Generated stories |
|-----------|---------|------|-------------------|
| React | `storybook/` | 6006 | `storybook-generated/<programme>/` |
| Angular | `storybook-angular/` | 6007 | `storybook-angular/src/generated/<programme>/` |

Shared component API contracts: `component-contracts/` (types, defaults, sample data).

```bash
# React
cd storybook
pnpm install
pnpm dev        # http://localhost:6006

# Angular
cd storybook-angular
npm install
npm run dev     # http://localhost:6007

# Generate Angular spec story (example: IDS Button)
python scripts/strict_spec_storybook_gate.py --component button --framework Angular --spec-only --deterministic-story

# Build gates
cd storybook && pnpm build
cd storybook-angular && npm run build
```

## Environment

- Python 3.12+ (`.python-version` = 3.12)
- Node.js + pnpm (for Storybook)
- Config via `.env` (see `.env.example`)
- Embedding dimension: 768 (embeddinggemma), Qdrant distance: COSINE
- `DESIGN_SYSTEM=synapse` for Synapse pipeline
- `DESIGN_SYSTEM=dap` for DAP pipeline (IDS baseline + DAP overrides)
- default when unset: `DESIGN_SYSTEM=ids`
