---
name: design-spec-intake-wizard
description: Interactive wizard — ask programme, component, and Figma URLs one at a time, confirm, then create production-ready design-spec.md (IDS-native or programme standalone; IDE-agnostic when used with docs/design-spec-intake.md).
---

# Design-Spec Intake Wizard

Use when the user wants to **create a new** `design-spec.md` and has not already provided programme, component name, and Figma URLs in one message.

Pair with **`docs/design-spec-authoring-contract.md`** for full production-ready rules. For section depth after intake, follow **design-spec-blueprint** skill.

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

---

## Programme standalone spec (`specPattern: standalone`)

Use when step 3 = **`no`** — the component exists **only in the programme** Figma file (e.g. Synapse Chat Input Box, Suggested Prompt, Thinking).

### Must include

- Full **10 required `##` sections** starting with **`## Metadata`** (no IDS baseline block)
- Metadata: `Spec pattern: standalone`, `Design System: {display_name}`, `{theme_css_path}`, programme Figma nodes
- Anatomy, layout, tokens, states, interactions, API — all from **programme Figma evidence**
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
6. **Live Figma** on **every** URL in all three buckets (main → elements → states; MCP preferred; REST if MCP unavailable — document method in spec).
7. Fill all required `##` sections; prefer `var(--...)` tokens from programme theme / root-spec.
8. Apply dark-states dedupe per authoring contract when light/dark tokens match.
9. Record verification evidence in **Metadata** and **Source Mapping**.
10. Add **`### Slot geometry (Figma-verified)`** under Layout & Measurements (`get_variable_defs` on cited nodes for radius rows).
11. Set **Status: draft** until validation checklist passes; do not mark `active` with TBD.
12. Optionally save `data/design-spec-intake/sessions/<slug>-<YYYYMMDD>.yaml` with collected answers (audit only).

---

## Storybook follow-up (when step 8 = yes)

After `design-spec.md` is written, generate or update Storybook using the **Spec Accurate Design** principle under the **Spec Generated** group.

**Meta title:** `Spec Generated/{DisplayName}/<Component Display Name>` — use programme `display_name` from yaml (e.g. `IDS`, `DAP`, `Synapse`).

**Primary story (required):**

- Story **name:** `Spec Accurate Design`
- Export name: `SpecAccurateDesign` (camelCase convention)
- Args and layout must match the spec (especially any **Spec Accurate Design story defaults** in the spec); use `var(--...)` only

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
