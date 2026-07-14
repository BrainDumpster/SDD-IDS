---
name: design-spec-intake-wizard
description: Interactive wizard — ask programme, component, and Figma URLs one at a time, confirm, then create production-ready design-spec.md (IDS-native or programme standalone; IDE-agnostic when used with docs/design-spec-intake.md).
---

# Design-Spec Intake Wizard

Use when the user wants to **create a new** `design-spec.md` and has not already provided programme, component name, and Figma URLs in one message.

Pair with **`docs/design-spec-authoring-contract.md`** for full production-ready rules. For section depth after intake, follow **design-spec-blueprint** skill.

**Codegen goal:** Every finalized `design-spec.md` must be detailed enough that an AI agent can generate production UI from the spec alone — matching Figma without drift. Storybook **Spec Accurate Design** stories are not throwaway demos; they must use the same **canonical runtime API** and composition model as production code.

## Skill routing (choose before interview)

| Situation | Skill |
|-----------|-------|
| **IDS-only** component (`programme = ids`) | **This skill** — full spec from IDS Figma |
| **Programme-native** component (no IDS counterpart) | **This skill** — `specPattern: standalone` (see below) |
| **Programme fork** of IDS (same anatomy, programme token/layout/chrome deltas) | **design-spec-programme-inheritance** — not this wizard |

**Rule:** If the user confirms the component **inherits an IDS component family**, stop this wizard after step 3 and hand off to **design-spec-programme-inheritance** (`docs/design-spec-programme-inheritance.md`).

---

## Interview phase (strict)

**Do not** call Figma tools, edit files, or update `data/*-figma-map.json` until the user confirms the summary.

**One question per assistant message.** Wait for the user before the next question.

| Step | Ask | Notes |
|------|-----|--------|
| 1 | Which **programme / design system**? | `ids` or any slug from `config/design_systems/*.yaml`. Reject unknown names. |
| 2 | **Component display name**? | e.g. `Datagrid`, `Suggested Prompt`, `Chat Input Box` |
| 3 | **Inherits IDS component?** | **Skip when step 1 = `ids`.** Otherwise: `yes` / `no` / `unknown`. **`yes`** → hand off to **design-spec-programme-inheritance** (do not continue this wizard). **`no`** → standalone programme spec. **`unknown`** → ask: “Same Figma component-set / anatomy as an IDS component?” and route accordingly. |
| 4 | **Category** (optional)? | User may reply `skip` |
| 5 | **Main component URL(s)** (required)? | At least one; repeat: “Paste another main component URL or reply `done`” |
| 6 | **Element URL(s)** (optional)? | Repeat: “Paste another element URL or reply `done`” |
| 7 | **State URL(s)** (optional)? | Repeat until user replies `done` |
| 8 | **Storybook examples needed?** | `yes` / `no` — if `yes`, run phase includes Spec Generated stories (see **Storybook follow-up** below) |
| 9 | **Confirm summary** | Programme, slug, **`specPattern`** (`ids-native` \| `standalone`), `designSpecPath`, parsed fileKey/nodeIds **grouped by Main / Elements / States**, map file path. User must reply `yes` (or correct) before run phase |

**Figma URL buckets:** collect links in three groups — **Main component**, **Elements**, **States**. Multiple URLs per bucket are normal; user may paste several at once or one-by-one until `done` for that bucket. If the user pastes all inputs (including inherits IDS = no) in one message, skip to **confirm summary** (step 9).

Parse Figma URLs: extract `fileKey` from `/design/<fileKey>/`; `node-id` query param with `-` converted to `:` for API/MCP. First **main** URL’s node becomes primary `nodeId` / `mainComponentSetNodeId` in the map; additional main URLs are supplemental `*NodeId` fields.

**Fail-fast:** If any pasted Figma URL lacks a usable `node-id`, stop and ask the user to re-paste that link with `node-id=…`. Do not invent a node, guess from the file, or continue the run phase for that URL.

---

## Programme standalone spec (`specPattern: standalone`)

Use when step 3 = **`no`** — the component exists **only in the programme** Figma file (e.g. Synapse Chat Input Box, Suggested Prompt, Thinking).

### Must include

- Full **10 required `##` sections** starting with **`## Metadata`** (no IDS baseline block)
- Metadata: `Spec pattern: standalone`, `Design System: {display_name}`, `{theme_css_path}`, programme Figma nodes
- Anatomy, layout, tokens, states, interactions, API — all from **programme Figma evidence**
- **Composition model & canonical Runtime API** derived during live Figma analysis (see **Figma analysis → composition model & canonical API**)
- **Codegen Contract** subsections filled with concrete contracts (not cross-ref placeholders) per **Codegen-ready spec depth**
- Optional **`### Parent composition`** under Metadata when the component is consumed by a parent programme spec

### Must not include

- `## IDS baseline (layout, flow, contracts)`
- `### … programme deltas (vs IDS)` table
- `idsBaselineSpecPath` in figma map
- Copied IDS dimensions/tokens without programme Figma proof

### Map + registry

- Figma map: `specPattern: standalone`, `designSpecPath`, `mainComponentSetNodeId`, supplemental `*NodeId` fields
- Optionally upsert `data/programme-inheritance-registry.json` with `pattern: standalone` (no `idsBaselineSlug`)

### Scaffold

`scripts/design_spec_template.py` → **`PROGRAMME_STANDALONE_TEMPLATE`** (substitute `{programmeDisplayName}`, `{programmeSlug}`, `{themeCssPath}`, `{figmaMapPath}`, `{storybookTitlePrefix}` from programme yaml).

**Reference examples:** `components/synapse/suggested-prompt/design-spec.md`, `components/synapse/chatinputbox/design-spec.md`, `components/synapse/thinking/design-spec.md`.

---

## Run phase (after confirm)

Execute in order:

1. Load config: `config/design_systems/<slug>.yaml` → `components_dir`, `figma_map_path`, `theme_css_path`, `display_name`, `root_spec_path`, `alias_path` (if any).
2. Slugify component name; check `{alias_path}` when present.
3. `mkdir -p` `{components_dir}/{slug}/`.
4. Merge or append map entry (`designSpecPath`, `figmaUrl`, primary `nodeId` / `mainComponentSetNodeId`, `fileKey`, `specPattern`, supplemental `*NodeId` from all URL buckets). **Standalone:** omit `idsBaselineSpecPath`.
5. Scaffold if missing:
   - **`ids`** → `NEW_SPEC_TEMPLATE`
   - **programme standalone** → `PROGRAMME_STANDALONE_TEMPLATE`
6. **Live Figma** on **every** URL in all three buckets (main → elements → states; MCP preferred; REST if MCP unavailable — document method in spec). Enforce **Figma extraction gates** (below) on each URL, then run **Figma analysis → composition model** before writing prose sections.
7. Fill all required `##` sections with **codegen-ready depth** (see below); prefer `var(--...)` tokens from programme theme / root-spec. **Never invent UI** (see extraction gates).
8. Apply dark-states dedupe per authoring contract when light/dark tokens match.
9. Record verification evidence in **Metadata** and **Source Mapping** (include which bucket each screenshot / node came from).
10. Add **`### Slot geometry (Figma-verified)`** under Layout & Measurements (`get_variable_defs` on cited nodes for radius rows).
11. Set **Status: draft** until validation checklist passes; do not mark `active` with TBD.
12. Optionally save `data/design-spec-intake/sessions/<slug>-<YYYYMMDD>.yaml` with collected answers (audit only).

---

## Figma extraction gates (anti-drift, framework-agnostic)

These gates exist so a later codegen agent can rebuild the component from the spec **without opening Figma** and **without inventing chrome**. Skip or weaken a gate only when it does not reduce drift (e.g. skip a mermaid diagram when Anatomy + Deterministic structure already fix slot order).

### Per-URL mandatory MCP set

For **each** collected URL (Main, Elements, States), call and retain evidence from:

| Tool | Why it improves codegen |
|------|-------------------------|
| `get_screenshot` | Visual ground truth for that node/bucket (state grids, element close-ups) — **one screenshot per URL**, not one for the whole intake |
| `get_metadata` | Frame size, visible tree, bounding boxes |
| `get_variable_defs` | Semantic token bindings (authoritative names) |
| `get_design_context` | Hierarchy, styling patterns, nested instances, assets |

**Blocking:** missing `node-id`, empty/unusable node tree, or missing root frame width/height → fix the URL / re-fetch before writing that bucket’s contracts. Prefer `get_design_context` on the root of each URL plus major sections when the frame is large (cap ~8 sections per URL to avoid noise).

Screenshots are **evidence**, not a substitute for tokens, geometry tables, or the element inventory.

### Element inventory → Anatomy lock

Before writing **Anatomy** / **Codegen Contract → Deterministic structure**:

1. Build a complete **visible-element inventory** from metadata (every visible node: type, parent/section, optional bbox).
2. Record an **explicit inventory count**.
3. Map inventory rows → PascalCase anatomy slots (compound reused DS instances stay as composition dependencies — do not flatten inventively).
4. **Lock:** inventory count and ordered slots must match Anatomy and the Deterministic structure tree. Missing or extra slots vs Figma = drift; fix the spec, do not invent filler UI.

Agent-internal inventory is enough; promote a short table into the spec when the tree is large or ambiguous.

### Complete token category coverage (`var(--...)` only)

Under **Tokens** (and linked state/geometry rows), cover every category that Figma evidence shows — **still using semantic `var(--token-name)` as the contract**. Do **not** switch implementation guidance to hardcoded hex/px.

| Category | Spec expectation |
|----------|------------------|
| Colors | Semantic fill / text / icon / border vars; resolved light/dark values as **evidence only** |
| Typography | Font/size/weight/line-height/letter-spacing via type tokens / role vars |
| Spacing | Padding, margin, gap via spacing vars or documented spacing tokens |
| Borders | Width, color, radius via border/radius vars (radius rows also in Slot geometry with node + `get_variable_defs`) |
| Shadows / elevation | Only when present in Figma — document the semantic shadow/elevation var; omit the category if Figma has none |

**Blocking for Status: active:** a Figma-visible style with no documented `var(--...)` (or explicit “not bound — cite node + follow-up”) is incomplete. Never “approximate” with invented tokens or raw colors in codegen guidance.

### No new UI invention

- Spec and codegen must only include slots, variants, icons, and chrome **observed** in Figma (Main / Elements / States) or explicitly mapped reused DS components.
- Do not add decorative wrappers, extra buttons, placeholder labels, or layout chrome “for completeness.”
- If Figma is ambiguous, record the ambiguity + node id and keep **Status: draft** — do not guess.

### Structure diagrams (optional, when they reduce drift)

Add a **mermaid** (or equivalent line) diagram in **Anatomy** and/or **Codegen Contract → Deterministic structure** when the component is compound, nested, or list+item — so codegen agents see parent→child order at a glance.

- Diagram nodes/edges must match Figma-verified slot names and order (same PascalCase ids).
- Skip the diagram when a numbered Anatomy list + Deterministic structure tree already make order unambiguous.
- Diagrams illustrate **structure only** — not new UI.

---

## Figma analysis → composition model & canonical API

While fetching `get_screenshot`, `get_design_context`, `get_metadata`, and `get_variable_defs` from **every** URL bucket, the agent **must analyze** the live node tree — not only transcribe dimensions and tokens.

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

---

## Codegen-ready spec depth (anti-drift)

The `design-spec.md` is the **single source of truth** for spec-driven codegen. Vague or cross-reference-only sections cause implementation drift. Every required section must contain concrete, testable contracts.

### Minimum depth per section

| Section | Required codegen detail |
|---------|-------------------------|
| **Metadata** | Verification evidence, `Spec pattern`, theme CSS path, optional **Parent composition** link, Storybook path when requested |
| **Anatomy** | Numbered slot list in **render order**; PascalCase slot ids; optional vs required; inventory-locked; optional mermaid when nest/list order is easy to misread |
| **Layout & Measurements** | Per-slot tables; sample-only vs runtime width rules (`fit-content`, `100%`, `min-height`); **`### Slot geometry (Figma-verified)`** |
| **Tokens** | Semantic `var(--...)` only — complete categories present in Figma (colors, type, spacing, borders/radius, shadows); resolved values as evidence, never as codegen substitutes |
| **States** | Full matrix per interactive slot; `default \| hover \| press \| focus-visible \| disabled` — cross-check against States-bucket screenshots |
| **Interactions** | Trigger → behavior table; state transitions; keyboard paths |
| **Composition & API** | **`### Runtime API`** tables: inputs (type, default, description), outputs (event + payload), variants; user configuration model when data-driven |
| **Codegen Contract** | **Concrete** subsections — not “see Anatomy” placeholders. Deterministic structure tree (diagram if needed), full variant matrix, per-slot style contract, behavior, a11y, assets, fallbacks |
| **Source Mapping** | File key, node ids per variant/state **and URL bucket**, MCP method (incl. screenshots taken), reproducible extraction path |

### Forbidden in production-ready specs

- Placeholder prose: “Document runtime props…”, “See Anatomy when present”, “TBD”, “sample only” without a runtime rule
- Codegen Contract subsections that only cross-reference other sections without restating the contract
- Hardcoded colors/spacing in implementation guidance (tokens only — `var(--...)` remains authoritative)
- Invented UI, slots, icons, or layout chrome not present in Figma evidence
- Storybook args that do not map to documented Runtime API props
- Undocumented variant axes visible in Figma component sets

### Drift-prevention checklist (agent self-check before `active`)

- [ ] Every intake URL had the mandatory MCP set (incl. per-URL screenshot) or a documented REST fallback
- [ ] Element inventory count locks to Anatomy and **Deterministic structure** (no missing/extra slots vs Figma)
- [ ] Anatomy slot order matches **Codegen Contract → Deterministic structure** tree (and any structure diagram)
- [ ] Token categories visible in Figma are documented with semantic `var(--...)` (no hex/px codegen contracts)
- [ ] Every Figma variant property maps to a named prop or slot with cited node id
- [ ] Runtime API is complete enough to implement the component without opening Figma
- [ ] No UI / chrome in the spec that was not observed in Main / Elements / States (or a cited reused DS component)
- [ ] Demo-only props are labeled; production path does not depend on them
- [ ] Spec Accurate Design defaults (if Storybook requested) are written in the spec, not only in the story file
- [ ] Parent/child composition documented when component is nested or data-driven
- [ ] Validation checklist items are pass/fail and cover geometry, API, states, and a11y

After intake, run **design-spec-blueprint** hardening (`validate_spec_geometry_gate.py`, normalizer) before marking **Status: active**.

---

## Storybook follow-up (when step 8 = yes)

After `design-spec.md` is written, generate or update Storybook using the **Spec Accurate Design** principle under the **Spec Generated** group.

**Production reuse rule:** The Storybook component file must export the same **canonical runtime API** documented in **Composition & API (runtime)**. Stories demonstrate that API with Figma-accurate defaults — they do not introduce a parallel or simplified prop surface. Production apps import the same component module as Spec Accurate Design.

**Meta title:** `Spec Generated/{DisplayName}/<Component Display Name>` — use programme `display_name` from yaml (e.g. `IDS`, `DAP`, `Synapse`).

**Primary story (required):**

- Story **name:** `Spec Accurate Design`
- Export name: `SpecAccurateDesign` (camelCase convention)
- Args and layout must match the spec (especially any **`### Spec Accurate Design story defaults`** in **Composition & API**); use `var(--...)` only
- Story args must use **canonical** prop names from Runtime API (`children`, `items`, `name` — not legacy or story-only aliases unless documented as aliases)

**Theme import** in the `.stories.tsx` file: programme `{theme_css_path}` only (one import).

**Do not** place spec-driven examples under generic groups (e.g. `Components/...`) or omit the Spec Accurate Design story.

**Implementation:** use `generation/deterministic_storybook/` patterns and `scripts/strict_spec_storybook_gate.py` when available.

Record generated story path in spec **Metadata**. Add validation checklist item for Spec Accurate Design under Spec Generated.

---

## Devin / single-shot mode

If the user says they use Devin or paste **all answers at once**, skip multi-turn interview: parse their block (include **`Inherits IDS: yes | no`** for non-IDS programmes), show confirm summary once, then run phase on `yes`. If `Inherits IDS: yes`, hand off to programme inheritance run phase instead.

---

## Windsurf / no Cursor skills

Behavior is identical when the user pastes the **starter prompt** from `docs/design-spec-intake.md` and you follow this skill’s interview + run rules from that doc’s portable appendix.

---

## Delegation

After the spec file exists, upgrades and hardening use **design-spec-blueprint** skill (normalizer, dedupe scripts, production-ready gate).
