# Design-spec intake wizard

Create production-ready, framework-agnostic `design-spec.md` files by pasting one **starter prompt** into your AI agent. The agent asks questions one at a time, you answer, confirm, then it runs (folders, map, live Figma, spec file).

Works in **Cursor**, **Windsurf Cascade**, and **Windsurf Devin** (see Devin notes below). Full rules: [design-spec-authoring-contract.md](design-spec-authoring-contract.md).

**Codegen goal:** Every finalized `design-spec.md` must be detailed enough that an AI agent can generate production UI from the spec alone — matching Figma without drift. Storybook **Spec Accurate Design** stories are not throwaway demos; they must use the same **canonical runtime API** and composition model as production code.

## Three spec paths (pick one)

| Path | When | Skill / doc | `specPattern` |
|------|------|-------------|---------------|
| **IDS-native** | New component in IDS Figma only | **This wizard** (`@design-spec-intake-wizard`) | (none / ids-native) |
| **Programme fork** | Programme reuses IDS anatomy with token/layout/chrome deltas | [Programme inheritance](design-spec-programme-inheritance.md) (`@design-spec-programme-inheritance`) | `ids-fork` |
| **Programme standalone** | Programme-only UI, no IDS counterpart | **This wizard** with **`Inherits IDS: no`** | `standalone` |

## Routing: inheritance vs standalone

When the component **inherits IDS** but uses **programme Figma** (token/layout/chrome deltas), use the inheritance process instead of this wizard:

- **Doc:** [design-spec-programme-inheritance.md](design-spec-programme-inheritance.md)
- **Cursor:** `@design-spec-programme-inheritance` or paste the **inheritance base prompt** from that doc
- **Figma URLs:** same three buckets as this wizard — **Main component** (one or many), **Elements**, **States**

When the component is **programme-native** (no IDS counterpart — e.g. Chat Input Box, Suggested Prompt), stay on **this wizard** and answer **`Inherits IDS: no`** → `specPattern: standalone`. See [Programme standalone (no IDS inheritance)](design-spec-authoring-contract.md#programme-standalone-no-ids-inheritance) in the authoring contract.

---

## Base prompt (copy this)

Paste into a **new agent chat** with the SDD-IDS repository open:

```text
Run the design-spec intake wizard: ask me each required question one at a time, wait for my answer, then show a summary for confirmation. After I confirm, generate a production-ready framework-agnostic design-spec. Follow docs/design-spec-authoring-contract.md and docs/design-spec-intake.md (portable wizard rules, Figma composition model analysis, codegen-ready spec depth). Do not call Figma or write files until I confirm the summary.
```

### Cursor shortcut

In Cursor Agent you can also invoke:

```text
@design-spec-intake-wizard Start the design-spec intake wizard.
```

The agent should still ask **one question per message** and wait for confirmation before running.

### Shorter variant (experts)

If you already know programme and component and will paste all Figma URLs in the next message:

```text
Run the design-spec intake wizard. I will provide programme, component name, and Figma URLs in my next message—then confirm before you run.
```

## What the agent will ask

| # | Question |
|---|----------|
| 1 | Programme / design system: **IDS** or any registered programme slug (`synapse`, `dap`, …) |
| 2 | Component display name |
| 3 | **Inherits IDS component?** (skip if programme = IDS) — `yes` / `no` / `unknown`. **`yes`** → [programme inheritance](design-spec-programme-inheritance.md). **`no`** → standalone programme spec. |
| 4 | Category (optional — you can say `skip`) |
| 5 | Figma **main component** URL(s) (required — at least one; repeat until `done`) |
| 6 | Figma **element** URL(s) (optional — repeat until you say `done`) |
| 7 | Figma **state** URL(s) (optional — until `done`) |
| 8 | Storybook examples needed? (`yes` / `no`) — if `yes`, see [Storybook examples](#storybook-examples-when-you-answer-yes) |
| 9 | Summary for confirm (`specPattern`, `designSpecPath`, node IDs grouped by Main / Elements / States, Storybook plan) — reply **`yes`** to proceed |

## After confirmation

The agent will:

- Create `components/<programme-dir>/<slug>/` if missing (see [authoring contract](design-spec-authoring-contract.md))
- Set **`specPattern`** in the Figma map: omit for IDS-native; `standalone` when programme-native; use [programme inheritance](design-spec-programme-inheritance.md) for `ids-fork`
- Update the Figma component map (primary `nodeId` from first main URL; supplemental nodes from extra main / element / state URLs)
- Fetch **live Figma** (MCP or REST) on **every** URL in all three buckets; during each fetch, run [Figma analysis → composition model](#figma-analysis--composition-model--canonical-api)
- Write or update `design-spec.md` with [codegen-ready depth](#codegen-ready-spec-depth-anti-drift) and **Status: draft**
- If Storybook = **yes**: add or update `storybook-generated/...` under **Spec Generated**, with primary story **Spec Accurate Design** (same canonical API as production — see [Storybook examples](#storybook-examples-when-you-answer-yes))

Review the diff and iterate in chat if any checklist item is incomplete.

## Figma analysis → composition model & canonical API

While fetching design context (`get_design_context`, `get_metadata`, `get_variable_defs`) from **every** URL bucket, the agent **must analyze** the live node tree — not only transcribe dimensions and tokens.

### What to look for

| Signal in Figma | Spec action |
|-----------------|-------------|
| **Component set** + variant properties | Enumerate axes in **Composition & API → Variants** and **Codegen Contract → Variant matrix**; cite node id per variant value |
| **Nested component instances** (Button, Icon, Tag, etc.) | Record as **composition dependencies**; prefer reusing existing design-system components over re-implementing slots |
| **Repeated sibling frames** (list rows, chips, menu items, cards) | Derive **item type** + **list/container** composition (`SuggestedPrompt` + `SuggestedPromptList`, `items[]` on parent) |
| **Optional slots** (icon on/off, trailing action, badge) | Model as boolean props or optional slots in anatomy; document default when absent |
| **Parent frame context** (chip inside input, row inside menu) | Add **`### Parent composition`** under Metadata when consumed by another spec; document parent prop mapping |
| **Auto-layout / grouping** | Translate to deterministic slot order in **Anatomy** and **Codegen Contract → Deterministic structure** |
| **Instance swaps / boolean layers** | Map to canonical prop names (`showIcon`, `aiGradient`, `expanded`) — stable across frameworks |
| **Existing Storybook or repo component** matching Figma instance | Link canonical API to that export; do not invent a parallel prop surface |

### Derive the composition model

Before writing **Composition & API** or **Codegen Contract**:

1. **Classify** the component: atomic (single interactive surface), compound (root + children), or container (renders user data via `items` / `children`).
2. **Name slots** in PascalCase aligned with anatomy (`SuggestedPromptRoot`, `SuggestedPromptLabel`, …) — same names in Codegen Contract tree.
3. **Define canonical runtime API** — props, events, and data shapes a production app would pass (arrays, discriminated unions, controlled vs uncontrolled patterns). This API is what codegen **and** Spec Accurate Design stories use.
4. **Separate demo-only controls** from runtime API: `forceStates`, `visualState`, `data-visual-state`, `data-state` → document explicitly as **Storybook / QA overrides only**; they must not be required for production.
5. **Enumerate valid combinations** in the variant matrix (no “usually” or “as needed”).
6. When Figma shows multiple layout modes (vertical list vs wrap, expanded vs collapsed rail), each mode gets an explicit prop value and layout contract.

### Canonical API rules (production = Storybook)

- **One API surface:** Spec Accurate Design story args must be a subset of the documented **Runtime API** — no story-only prop names unless flagged demo-only.
- **Stable identifiers:** Document id derivation rules when Figma labels are user-defined (`id` from slugified `name`, disambiguation suffixes).
- **Event payloads:** Define output shapes (`onSelected`, `onNavigate`, `onSelect(label)`) with field lists — not “fires on click”.
- **Defaults for codegen parity:** When a Figma frame implies a default selection or expanded state, add **`### Spec Accurate Design story defaults`** under **Composition & API** with exact values (see `components/ids/main-menu-left/design-spec.md`).
- **Composition helpers:** When the design implies a list of repeated items, document both the **item** component contract and the **list** wrapper (gap, layout axis, who owns click handlers).

**Reference examples:** `components/synapse/suggested-prompt/design-spec.md` (item + list + parent mapping), `components/ids/main-menu-left/design-spec.md` (tree data model + canonical vs legacy fields), `components/synapse/topology/design-spec.md` (large composed graph + story defaults).

## Codegen-ready spec depth (anti-drift)

The `design-spec.md` is the **single source of truth** for spec-driven codegen. Vague or cross-reference-only sections cause implementation drift. Every required section must contain concrete, testable contracts.

### Minimum depth per section

| Section | Required codegen detail |
|---------|-------------------------|
| **Metadata** | Verification evidence, `Spec pattern`, theme CSS path, optional **Parent composition** link, Storybook path when requested |
| **Anatomy** | Numbered slot list in **render order**; PascalCase slot ids; note optional vs required slots |
| **Layout & Measurements** | Per-slot tables; sample-only vs runtime width rules (`fit-content`, `100%`, `min-height`); **`### Slot geometry (Figma-verified)`** |
| **Tokens** | Semantic `var(--...)` only; typography/spacing/radius per role or slot |
| **States** | Full matrix per interactive slot; `default \| hover \| press \| focus-visible \| disabled` |
| **Interactions** | Trigger → behavior table; state transitions; keyboard paths |
| **Composition & API** | **`### Runtime API`** tables: inputs (type, default, description), outputs (event + payload), variants; user configuration model when data-driven |
| **Codegen Contract** | **Concrete** subsections — not “see Anatomy” placeholders. Deterministic structure tree, full variant matrix, per-slot style contract, behavior, a11y, assets, fallbacks |
| **Source Mapping** | File key, node ids per variant/state, MCP method, reproducible extraction path |

### Forbidden in production-ready specs

- Placeholder prose: “Document runtime props…”, “See Anatomy when present”, “TBD”, “sample only” without a runtime rule
- Codegen Contract subsections that only cross-reference other sections without restating the contract
- Hardcoded colors/spacing in implementation guidance (tokens only)
- Storybook args that do not map to documented Runtime API props
- Undocumented variant axes visible in Figma component sets

### Drift-prevention checklist (agent self-check before `active`)

- [ ] Anatomy slot order matches **Codegen Contract → Deterministic structure** tree
- [ ] Every Figma variant property maps to a named prop or slot with cited node id
- [ ] Runtime API is complete enough to implement the component without opening Figma
- [ ] Demo-only props are labeled; production path does not depend on them
- [ ] Spec Accurate Design defaults (if Storybook requested) are written in the spec, not only in the story file
- [ ] Parent/child composition documented when component is nested or data-driven
- [ ] Validation checklist items are pass/fail and cover geometry, API, states, and a11y

After intake, run [design-spec-blueprint](../.cursor/skills/design-spec-blueprint/SKILL.md) hardening (`validate_spec_geometry_gate.py`, normalizer) before marking **Status: active**.

## Run by IDE

### Cursor Agent

1. Open SDD-IDS workspace.
2. New Agent chat → paste **base prompt** (or `@design-spec-intake-wizard`).
3. Answer each question; ensure **Figma MCP** is enabled for live verification.
4. Reply `yes` on the summary.
5. Review `components/.../<slug>/design-spec.md`.

### Windsurf Cascade

1. Same as Cursor — paste **base prompt** (Cascade does not load `.cursor/skills` automatically; the prompt references `docs/`).
2. Enable Figma MCP in Windsurf if available.
3. Multi-turn Q&A works the same as Cursor.

### Windsurf Devin

Devin works best with **one task** after inputs are known:

1. Run the interview in **Cascade or Cursor** through step 9, **or** paste all answers in one message:

```text
Programme: IDS
Component: Spinner
Inherits IDS: n/a
Category: skip
Main component URL(s):
- https://www.figma.com/design/...
- done
Element URLs: done
State URLs: done
Storybook: no
Confirm: yes
```

Programme standalone example:

```text
Programme: synapse
Component: Suggested Prompt
Inherits IDS: no
Category: Components
Main component URL(s):
- https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/...?node-id=48467-26158
- done
Element URLs: done
State URLs:
- …?node-id=48467-26157
- …?node-id=53325-277102
- done
Storybook: yes
Confirm: yes
```

2. In Devin, paste the confirmed summary plus:

```text
Execute the design-spec intake RUN phase only: create dirs, update map, live Figma, write design-spec.md per docs/design-spec-authoring-contract.md and docs/design-spec-intake.md (composition model + codegen-ready depth). Output path: components/ids/spinner/design-spec.md
```

## Prerequisites

- SDD-IDS repository cloned and opened as the workspace root
- **Figma MCP** connected (recommended), or `FIGMA_TOKEN` in `.env` for REST fallback
- For upgrades to existing specs, use [design-spec-blueprint](../.cursor/skills/design-spec-blueprint/SKILL.md) instead of the wizard

## Portable wizard rules (for non-Cursor agents)

When executing the wizard without the Cursor skill file:

1. **One question per message** during the interview.
2. **No Figma, no file writes** until the user confirms the summary with `yes`.
3. **Route first:** programme = `ids` → IDS-native spec; programme ≠ `ids` and **inherits IDS** → [programme inheritance](design-spec-programme-inheritance.md); **does not inherit IDS** → `specPattern: standalone` (intake wizard continues).
4. Valid programmes: resolve from `config/design_systems/*.yaml` (`ids`, `synapse`, `dap`, …).
5. Figma URLs in three buckets — **Main component** (one or many), **Elements**, **States** — live-verify every URL.
6. After confirm: mkdir programme + slug dirs → map entry (`specPattern` when programme) → scaffold (`NEW_SPEC_TEMPLATE` or `PROGRAMME_STANDALONE_TEMPLATE`) → live Figma with [composition model analysis](#figma-analysis--composition-model--canonical-api) → all 10 `##` sections at [codegen-ready depth](#codegen-ready-spec-depth-anti-drift) → `### Slot geometry (Figma-verified)` → evidence in Metadata + Source Mapping → Status `draft`.
7. Storybook `yes` → after the spec: **Spec Generated** group + **Spec Accurate Design** primary story using the same canonical Runtime API as production (see [Storybook examples](#storybook-examples-when-you-answer-yes)).

## Storybook examples (when you answer `yes`)

Examples must follow repo conventions (see [README — Spec Accurate Design](../README.md#spec-accurate-design-examples-ids)). Agents must treat this as a **required run-phase step**, not optional polish. Full procedure: **`.cursor/skills/design-spec-intake-wizard/SKILL.md` → Storybook follow-up**.

**Production reuse rule:** The Storybook component file must export the same **canonical runtime API** documented in **Composition & API (runtime)**. Stories demonstrate that API with Figma-accurate defaults — they do not introduce a parallel or simplified prop surface. Production apps import the same component module as Spec Accurate Design.

| Rule | Value |
|------|--------|
| Sidebar group | **Spec Generated** — `Spec Generated/IDS/<Component>`, `Spec Generated/DAP/<Component>`, or `Spec Generated/Synapse/<Component>` |
| Primary story name | **Spec Accurate Design** (`export const SpecAccurateDesign`) |
| Source of truth | `design-spec.md` (tokens, layout, states, API defaults — including **`### Spec Accurate Design story defaults`**) |
| Story args | Canonical Runtime API prop names only (`children`, `items`, `name` — not story-only aliases unless documented) |
| Theme CSS | One import: `components/ids-theme.css`, `components/dap-theme.css`, or `components/synapse-theme.css` |
| Output | Prefer `storybook-generated/<programme>/src/components/<PascalName>.stories.tsx` |

Do not publish spec-driven examples under generic Storybook folders. Optional extra stories (state matrix, collapsed, etc.) sit under the same **Spec Generated** title.

### Deterministic generation (agent must)

1. Add/update `generation/deterministic_storybook/.../<slug>.py` and register in `engine.py` `REGISTRY`.
2. Run:
   ```bash
   DESIGN_SYSTEM=<programme> python3 scripts/strict_spec_storybook_gate.py \
     --component <kebab-slug> \
     --spec-only \
     --deterministic-story
   ```
3. Require **STRICT GATE PASSED**; record story + generator paths in spec Metadata.
4. Do not end intake with Storybook=`yes` and only a hand file under `storybook/src` and no registry entry.

Hand-authored intake stories may temporarily live under `storybook/src/components/` for hot-reload; migrate to the deterministic gate + `storybook-generated/` before calling intake complete when Storybook was requested.

### Troubleshooting Storybook

**`importers[path] is not a function`:** The dev server built its story import map at startup. If you add or move a story file while Storybook is already running (common for `storybook-generated/`), the sidebar index can list the story but the runtime importer is missing.

1. Stop every Storybook process (check port **6006** — a stale instance is a frequent cause).
2. From `storybook/`: `pnpm dev:clean` (or `npm run dev:clean`).
3. Open the URL Storybook prints (use that port only).
4. Navigate to **Spec Generated → … → Spec Accurate Design**.

**IDS Tree** supports **Mode A** (`items: TreeNode[]`) and **Mode B** (nested `<tree-item>` / `<tree-item-label>`); root emits **`onTreeItemClick`** with `TreeItemClickDetail` (see `components/ids/tree/design-spec.md`).

## Optional session log

The agent may save `data/design-spec-intake/sessions/<slug>-<date>.yaml` for audit. These files are gitignored.

## Related artifacts

| Artifact | Path |
|----------|------|
| Authoring contract | [design-spec-authoring-contract.md](design-spec-authoring-contract.md) |
| Blueprint / hardening | [.cursor/skills/design-spec-blueprint/SKILL.md](../.cursor/skills/design-spec-blueprint/SKILL.md) |
| Wizard skill (Cursor) | [.cursor/skills/design-spec-intake-wizard/SKILL.md](../.cursor/skills/design-spec-intake-wizard/SKILL.md) |
| Programme inheritance | [design-spec-programme-inheritance.md](design-spec-programme-inheritance.md) · [.cursor/skills/design-spec-programme-inheritance/SKILL.md](../.cursor/skills/design-spec-programme-inheritance/SKILL.md) |
| Spec templates | `scripts/design_spec_template.py` — `NEW_SPEC_TEMPLATE`, `PROGRAMME_STANDALONE_TEMPLATE`, `PROGRAMME_IDS_FORK_TEMPLATE` |
