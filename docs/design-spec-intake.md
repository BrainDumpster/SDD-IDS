# Design-spec intake wizard

Create production-ready, framework-agnostic `design-spec.md` files by pasting one **starter prompt** into your AI agent. The agent asks questions one at a time, you answer, confirm, then it runs (folders, map, live Figma, spec file).

Works in **Cursor**, **Windsurf Cascade**, and **Windsurf Devin** (see Devin notes below). Full rules: [design-spec-authoring-contract.md](design-spec-authoring-contract.md).

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
Run the design-spec intake wizard: ask me each required question one at a time, wait for my answer, then show a summary for confirmation. After I confirm, generate a production-ready framework-agnostic design-spec. Follow docs/design-spec-authoring-contract.md and docs/design-spec-intake.md (portable wizard rules). Do not call Figma or write files until I confirm the summary.
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
| 9 | Storybook framework? (`react` / `angular` / `both`) — **skip when step 8 = `no`**. Synapse: `react` only. |
| 10 | Summary for confirm (`specPattern`, `designSpecPath`, node IDs grouped by Main / Elements / States, Storybook plan + framework) — reply **`yes`** to proceed |

## After confirmation

The agent will:

- Create `components/<programme-dir>/<slug>/` if missing (see [authoring contract](design-spec-authoring-contract.md))
- Set **`specPattern`** in the Figma map: omit for IDS-native; `standalone` when programme-native; use [programme inheritance](design-spec-programme-inheritance.md) for `ids-fork`
- Update the Figma component map (primary `nodeId` from first main URL; supplemental nodes from extra main / element / state URLs)
- Fetch **live Figma** (MCP or REST) on **every** URL in all three buckets
- Write or update `design-spec.md` with **Status: draft**
- If Storybook = **yes**: add or update **Spec Generated** stories per framework choice — **React** (`storybook-generated/...`), **Angular** (`storybook-angular/src/generated/...`), or **both** — with primary story **Spec Accurate Design** in each package

Review the diff and iterate in chat if any checklist item is incomplete.

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

1. Run the interview in **Cascade or Cursor** through step 10, **or** paste all answers in one message:

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
Storybook framework: n/a
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
Storybook framework: react
Confirm: yes
```

2. In Devin, paste the confirmed summary plus:

```text
Execute the design-spec intake RUN phase only: create dirs, update map, live Figma, write design-spec.md per docs/design-spec-authoring-contract.md. Output path: components/ids/spinner/design-spec.md
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
6. After confirm: mkdir programme + slug dirs → map entry (`specPattern` when programme) → scaffold (`NEW_SPEC_TEMPLATE` or `PROGRAMME_STANDALONE_TEMPLATE`) → live Figma → all 10 `##` sections → evidence in Metadata + Source Mapping → Status `draft`.
7. Storybook `yes` → ask framework (`react` / `angular` / `both`; Synapse = `react` only) → after the spec: **Spec Generated** group + **Spec Accurate Design** primary story per selected package (see **Storybook examples**).

## Storybook examples (when you answer `yes`)

At step 9, choose **React**, **Angular**, or **Both**. Examples must follow repo conventions (see [README — Spec Accurate Design](../README.md#spec-accurate-design-examples-ids)):

| Rule | Value |
|------|--------|
| Sidebar group | **Spec Generated** — `Spec Generated/IDS/<Component>`, `Spec Generated/DAP/<Component>`, or `Spec Generated/Synapse/<Component>` |
| Primary story name | **Spec Accurate Design** |
| Source of truth | `design-spec.md` (tokens, layout, states, API defaults) |
| React output | `storybook-generated/<programme>/src/components/<Component>.stories.tsx` |
| Angular output | `storybook-angular/src/generated/<programme>/src/components/<Component>.stories.ts` (IDS/DAP only) |
| React theme CSS | One import in story file: `components/ids-theme.css`, `components/dap-theme.css`, or `components/synapse-theme.css` |
| Angular theme CSS | Loaded globally via `storybook-angular/.storybook/preview.js` |

**Synapse:** React only — do not add Synapse under `storybook-angular/` unless explicitly requested.

Do not publish spec-driven examples under generic Storybook folders. Optional extra stories (state matrix, collapsed, etc.) sit under the same **Spec Generated** title.

Generators: `generation/deterministic_storybook/`, `scripts/strict_spec_storybook_gate.py` when available. Add `--framework Angular` for Angular or both.

### Troubleshooting Storybook

**`importers[path] is not a function`:** The dev server built its story import map at startup. If you add or move a story file while Storybook is already running (common for `storybook-generated/`), the sidebar index can list the story but the runtime importer is missing.

1. Stop every Storybook process (check port **6006** — a stale instance is a frequent cause).
2. From `storybook/`: `pnpm dev:clean` (or `npm run dev:clean`).
3. Open the URL Storybook prints (use that port only).
4. Navigate to **Spec Generated → IDS → Tree → Spec Accurate Design**.

Hand-authored intake stories may live under `storybook/src/components/` (for example `IdsTree.stories.tsx`) so they share the main story glob; deterministic gate output still uses `storybook-generated/`.

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
