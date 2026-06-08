---
name: design-spec-intake-wizard
description: Interactive wizard — ask programme, component, and Figma URLs one at a time, confirm, then create production-ready design-spec.md (IDE-agnostic when used with docs/design-spec-intake.md).
---

# Design-Spec Intake Wizard

Use when the user wants to **create a new** `design-spec.md` and has not already provided programme, component name, and Figma URLs in one message.

Pair with **`docs/design-spec-authoring-contract.md`** for full production-ready rules. For section depth after intake, follow **design-spec-blueprint** skill.

**Synapse + IDS base:** when programme = Synapse and the component reuses an IDS Figma family, run **design-spec-synapse-ids-fork** after step 1 (do not blind-copy IDS spec). See `docs/design-spec-synapse-ids-fork.md`.

## Interview phase (strict)

**Do not** call Figma tools, edit files, or update `data/*-figma-map.json` until the user confirms the summary in step 8.

**One question per assistant message.** Wait for the user before the next question.

| Step | Ask | Notes |
|------|-----|--------|
| 1 | Which **programme**? | IDS, DAP, or Synapse only. Reject unknown names. |
| 2 | **Component display name**? | e.g. `Datagrid`, `Settings Menu` |
| 3 | **Category** (optional)? | User may reply `skip` |
| 4 | **Figma component URL** (required)? | Main component / component set |
| 5 | **Element URLs** (optional)? | Repeat: “Paste another element URL or reply `done`” |
| 6 | **State URLs** (optional)? | Repeat until user replies `done` |
| 7 | **Storybook examples needed?** | `yes` / `no` — if `yes`, run phase includes Spec Generated stories (see **Storybook follow-up** below) |
| 8 | **Confirm summary** | Programme, slug, `designSpecPath`, parsed fileKey/nodeIds for all URLs, map file path. User must reply `yes` (or correct) before run phase |

Parse Figma URLs: extract `fileKey` from `/design/<fileKey>/`; `node-id` query param with `-` converted to `:` for API/MCP.

## Run phase (after confirm)

Execute in order:

1. Load programme config: `config/design_systems/<ids|dap|synapse>.yaml` → `components_dir`, `figma_map_path`.
2. Slugify component name (lowercase, non-alphanumeric → `-`, collapse repeats).
3. `mkdir -p` `{components_dir}` and `{components_dir}/{slug}/`.
4. Merge or append map entry in the programme’s figma map JSON (`designSpecPath`, `figmaUrl`, `nodeId`, `fileKey`, supplemental `*NodeId` or structured nodes from element/state URLs).
5. If `design-spec.md` missing, scaffold from `scripts/design_spec_template.py` (`NEW_SPEC_TEMPLATE`).
6. **Live Figma** for component + each element/state node (MCP preferred; REST if MCP unavailable — document method in spec).
7. Fill all required `##` sections per authoring contract; prefer `var(--...)` tokens.
8. Apply dark-states dedupe per contract when light/dark tokens match.
9. Record verification evidence in **Metadata** and **Source Mapping**.
10. Set **Status: draft** until validation checklist passes; do not mark `active` with TBD.
11. Optionally save `data/design-spec-intake/sessions/<slug>-<YYYYMMDD>.yaml` with collected answers (audit only).

## Storybook follow-up (when step 7 = yes)

After `design-spec.md` is written, generate or update Storybook using the **Spec Accurate Design** principle under the **Spec Generated** group.

**Meta title (sidebar group):**

- IDS: `Spec Generated/IDS/<Component Display Name>`
- DAP: `Spec Generated/DAP/<Component Display Name>`

**Primary story (required):**

- Story **name:** `Spec Accurate Design`
- Export name: `SpecAccurateDesign` (camelCase convention)
- Args and layout must match the spec (especially any **Spec Accurate Design story defaults** in the spec); use `var(--...)` only

**Theme import** in the `.stories.tsx` file (one programme theme):

- IDS: `components/ids-theme.css`
- DAP: `components/dap-theme.css`

**Do not** place spec-driven examples under generic groups (e.g. `Components/...`) or omit the Spec Accurate Design story.

**Implementation:** use `generation/deterministic_storybook/` patterns and `scripts/strict_spec_storybook_gate.py` when available; reference [`components/ids/main-menu-left/design-spec.md`](../components/ids/main-menu-left/design-spec.md) + [`storybook-generated/ids/src/components/MainMenuLeft.stories.tsx`](../storybook-generated/ids/src/components/MainMenuLeft.stories.tsx).

Record generated story path in spec **Metadata**. Add validation checklist item for Spec Accurate Design under Spec Generated.

## Devin / single-shot mode

If the user says they use Devin or paste **all answers at once**, skip multi-turn interview: parse their block, show confirm summary once, then run phase on `yes`.

## Windsurf / no Cursor skills

Behavior is identical when the user pastes the **starter prompt** from `docs/design-spec-intake.md` and you follow this skill’s interview + run rules from that doc’s portable appendix.

## Delegation

After the spec file exists, upgrades and hardening use **design-spec-blueprint** skill (normalizer, dedupe scripts, production-ready gate).
