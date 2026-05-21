# Design-spec intake wizard

Create production-ready, framework-agnostic `design-spec.mdx` files by pasting one **starter prompt** into your AI agent. The agent asks questions one at a time, you answer, confirm, then it runs (folders, map, live Figma, spec file).

Works in **Cursor**, **Windsurf Cascade**, and **Windsurf Devin** (see Devin notes below). Full rules: [design-spec-authoring-contract.md](design-spec-authoring-contract.md).

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
| 1 | Programme: **IDS**, **DAP**, or **Synapse** |
| 2 | Component display name |
| 3 | Category (optional — you can say `skip`) |
| 4 | Figma **component** URL (required) |
| 5 | Figma **element** URLs (optional — repeat until you say `done`) |
| 6 | Figma **state** URLs (optional — until `done`) |
| 7 | Storybook examples needed? (`yes` / `no`) — if `yes`, see [Storybook examples](#storybook-examples-when-you-answer-yes) |
| 8 | Summary for confirm (`designSpecPath`, nodes, Storybook plan) — reply **`yes`** to proceed |

## After confirmation

The agent will:

- Create `components/<programme-dir>/<slug>/` if missing (see [authoring contract](design-spec-authoring-contract.md))
- Update the Figma component map
- Fetch **live Figma** (MCP or REST)
- Write or update `design-spec.mdx` with **Status: draft**
- If Storybook = **yes**: add or update `storybook-generated/...` under **Spec Generated**, with primary story **Spec Accurate Design**

Review the diff and iterate in chat if any checklist item is incomplete.

## Run by IDE

### Cursor Agent

1. Open SDD-IDS workspace.
2. New Agent chat → paste **base prompt** (or `@design-spec-intake-wizard`).
3. Answer each question; ensure **Figma MCP** is enabled for live verification.
4. Reply `yes` on the summary.
5. Review `components/.../<slug>/design-spec.mdx`.

### Windsurf Cascade

1. Same as Cursor — paste **base prompt** (Cascade does not load `.cursor/skills` automatically; the prompt references `docs/`).
2. Enable Figma MCP in Windsurf if available.
3. Multi-turn Q&A works the same as Cursor.

### Windsurf Devin

Devin works best with **one task** after inputs are known:

1. Run the interview in **Cascade or Cursor** through step 8, **or** paste all answers in one message:

```text
Programme: IDS
Component: Spinner
Category: skip
Component Figma URL: https://www.figma.com/design/...
Element URLs: done
State URLs: done
Storybook: no
Confirm: yes
```

2. In Devin, paste the confirmed summary plus:

```text
Execute the design-spec intake RUN phase only: create dirs, update map, live Figma, write design-spec.mdx per docs/design-spec-authoring-contract.md. Output path: components/ids/spinner/design-spec.mdx
```

## Prerequisites

- SDD-IDS repository cloned and opened as the workspace root
- **Figma MCP** connected (recommended), or `FIGMA_TOKEN` in `.env` for REST fallback
- For upgrades to existing specs, use [design-spec-blueprint](../.cursor/skills/design-spec-blueprint/SKILL.md) instead of the wizard

## Portable wizard rules (for non-Cursor agents)

When executing the wizard without the Cursor skill file:

1. **One question per message** during the interview.
2. **No Figma, no file writes** until the user confirms the summary with `yes`.
3. Valid programmes: **IDS** → `components/ids`, **DAP** → `components/DAP`, **Synapse** → `components/synapse`.
4. After confirm: mkdir programme + slug dirs → map entry → scaffold if needed → live Figma → all 10 `##` sections → evidence in Metadata + Source Mapping → Status `draft`.
5. Storybook `yes` → after the spec: **Spec Generated** group + **Spec Accurate Design** primary story (see **Storybook examples**).

## Storybook examples (when you answer `yes`)

Examples must follow repo conventions (see [README — Spec Accurate Design](../README.md#spec-accurate-design-examples-ids)):

| Rule | Value |
|------|--------|
| Sidebar group | **Spec Generated** — `Spec Generated/IDS/<Component>` or `Spec Generated/DAP/<Component>` |
| Primary story name | **Spec Accurate Design** |
| Source of truth | `design-spec.mdx` (tokens, layout, states, API defaults) |
| Theme CSS | One import: `components/ids-theme.css` or `components/dap-theme.css` |

Do not publish spec-driven examples under generic Storybook folders. Optional extra stories (state matrix, collapsed, etc.) sit under the same **Spec Generated** title.

Generators: `generation/deterministic_storybook/`, `scripts/strict_spec_storybook_gate.py` when available.

### Troubleshooting Storybook

**`importers[path] is not a function`:** The dev server built its story import map at startup. If you add or move a story file while Storybook is already running (common for `storybook-generated/`), the sidebar index can list the story but the runtime importer is missing.

1. Stop every Storybook process (check port **6006** — a stale instance is a frequent cause).
2. From `storybook/`: `pnpm dev:clean` (or `npm run dev:clean`).
3. Open the URL Storybook prints (use that port only).
4. Navigate to **Spec Generated → IDS → Tree → Spec Accurate Design**.

Hand-authored intake stories may live under `storybook/src/components/` (for example `IdsTree.stories.tsx`) so they share the main story glob; deterministic gate output still uses `storybook-generated/`.

**IDS Tree** supports **Mode A** (`items: TreeNode[]`) and **Mode B** (nested `<tree-item>` / `<tree-item-label>`); root emits **`onTreeItemClick`** with `TreeItemClickDetail` (see `components/ids/tree/design-spec.mdx`).

## Optional session log

The agent may save `data/design-spec-intake/sessions/<slug>-<date>.yaml` for audit. These files are gitignored.

## Related artifacts

| Artifact | Path |
|----------|------|
| Authoring contract | [design-spec-authoring-contract.md](design-spec-authoring-contract.md) |
| Blueprint / hardening | [.cursor/skills/design-spec-blueprint/SKILL.md](../.cursor/skills/design-spec-blueprint/SKILL.md) |
| Wizard skill (Cursor) | [.cursor/skills/design-spec-intake-wizard/SKILL.md](../.cursor/skills/design-spec-intake-wizard/SKILL.md) |
| Spec template | `scripts/design_spec_template.py` |
