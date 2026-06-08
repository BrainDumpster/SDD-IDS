# Synapse design specs when IDS is the base

Portable workflow for Synapse components that reuse the same Figma component family as IDS with programme-specific token, layout, or chrome changes.

**Canonical references:**
- Left Nav: [`components/synapse/left-nav/design-spec.md`](../components/synapse/left-nav/design-spec.md) ← [`components/ids/main-menu-left/design-spec.md`](../components/ids/main-menu-left/design-spec.md)
- Modal Dialog: [`components/synapse/modal/design-spec.md`](../components/synapse/modal/design-spec.md) ← [`components/ids/modal/design-spec.md`](../components/ids/modal/design-spec.md)

**Pattern registry:** [`data/programme-inheritance-registry.json`](../data/programme-inheritance-registry.json) (filter `programme: synapse`)

**User process (all programmes):** [`design-spec-programme-inheritance.md`](design-spec-programme-inheritance.md)

## When to use IDS-fork vs standalone

| Signal | Pattern | Example |
|--------|---------|---------|
| Same Figma component-set name / anatomy as IDS | **ids-fork** | Left Nav (`MainMenu-Left-Main`) |
| Synapse-only slots or composition | **ids-fork** or **standalone** (if deltas are large) | Left Nav `NewChatAction` (ids-fork) |
| Different product UI / no IDS counterpart | **standalone** | Masthead, Chat Area |

See the decision tree in the intake wizard skill and [`config/design_systems/synapse.yaml`](../config/design_systems/synapse.yaml) (`baseline_components_dir: components/ids`).

## File layout

- **Always** create `components/synapse/<slug>/design-spec.md` (all 10 required `##` sections per [`design-spec-authoring-contract.md`](design-spec-authoring-contract.md)).
- **Never** ship a deltas-only markdown file — deltas live inside the full spec.
- **Never** blind-copy the IDS spec — live-verify **Synapse** Figma nodes (`Td1bnsvRj1PCGs9RVJkIvJ`).

## Required spec structure (IDS-fork)

1. **`## IDS baseline (layout, flow, contracts)`** — pointer to IDS spec, shared implementation, Synapse wrapper.
2. **`## Metadata`** — Synapse Figma nodes, `synapse-theme.css`, verification evidence, `Spec pattern: ids-fork`.
3. **`### Synapse programme deltas (vs IDS)`** — table of every verified difference (omit identical rows).
4. **Remaining sections** — full values where Synapse differs; `(Same as IDS …)` references elsewhere.
5. **`## Source Mapping`** — both IDS parity reference and Synapse validated nodes.

Scaffold: `scripts/design_spec_template.py` → `SYNAPSE_IDS_FORK_TEMPLATE`.

## Per-component workflow

1. Register pattern in `data/programme-inheritance-registry.json`.
2. Read IDS `components/ids/<slug>/design-spec.md`.
3. Live Figma MCP on Synapse nodes: `get_metadata`, `get_design_context`, `get_variable_defs`.
4. Build programme deltas table (layout, chrome, tokens, states, anatomy, API defaults).
5. Write Synapse spec (Status `draft` → `active` when checklist passes).
6. Implementation: shared component + `programme="synapse"` CSS and/or thin wrapper.
7. Storybook: `Spec Generated/Synapse/<Name>` with **Spec Accurate Design** using Synapse Figma sample data.
8. Update `data/synapse-component-figma-map.json` (`designSpecPath`, element node IDs).

## Theme vs spec

| Layer | Responsibility |
|-------|----------------|
| Component spec | Semantic `var(--token-name)` per slot/state |
| `components/synapse-theme.css` | Resolved Light/Dark values, Synapse aliases |
| `components/synapse/root-spec.md` | Programme-wide token catalog |

## Storybook

| Programme | Meta title |
|-----------|------------|
| Synapse | `Spec Generated/Synapse/<Component Display Name>` |

Import `components/synapse-theme.css` in the story file.

## Agent skill

For step-by-step execution in Cursor, load **design-spec-programme-inheritance** (`.cursor/skills/design-spec-programme-inheritance/SKILL.md`) or **design-spec-synapse-ids-fork** for Synapse-only detail.

## Walkthrough: Synapse Modal (IDS-fork)

**User URL:** `https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=43461-175960&m=dev`

| Step | Action |
|------|--------|
| 1 | Pattern = **ids-fork** (`ModalDialog-Main` parallels IDS `Modal-Main` / dialog matrix) |
| 2 | IDS baseline = [`components/ids/modal/design-spec.md`](../components/ids/modal/design-spec.md) |
| 3 | MCP on `43461:175960` (set), `43461:175961` (Non-Alerting), `43461:176040` (Destructive) |
| 4 | Deltas: radius 16px, border neutral-light, dialog fixed 640px, header padding — see spec table |
| 5 | Write [`components/synapse/modal/design-spec.md`](../components/synapse/modal/design-spec.md) |
| 6 | Map `Modal Dialog` in `synapse-component-figma-map.json` → same `designSpecPath` |
| 7 | `single-page` / `multi-page` scenarios inherit IDS until Synapse usage nodes are verified |

**Inheritance rule:** Scenarios **not** present in the Synapse Figma node you verified stay referenced to IDS spec sections — do not copy IDS dimensions into Synapse spec without a Synapse node proof.
