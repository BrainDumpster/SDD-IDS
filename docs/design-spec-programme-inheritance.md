# Programme inheritance design-spec process

Use this when a **programme layer** (Synapse, DAP, …) reuses an **IDS** component family in Figma but designers changed tokens, spacing, radius, borders, or slots.

**Output:** a **full** `components/<programme>/<slug>/design-spec.md` with a **baseline pointer + programme deltas table** — not a deltas-only file.

Works in **Cursor** (invoke skill or paste prompt), **Windsurf**, and **Devin** (one-shot after inputs).

---

## When to use this (not the plain intake wizard)

| Situation | Use |
|-----------|-----|
| New IDS-only component, no programme fork | [design-spec-intake.md](design-spec-intake.md) |
| **Synapse / DAP** component inherits IDS anatomy + API | **This process** |
| Programme-native UI (no IDS counterpart) | Plain intake wizard → **standalone** spec |

---

## Programmes supported today

Resolved from `config/design_systems/<programme>.yaml`:

| Programme | Spec folder | Figma map | Theme CSS | Storybook group | IDS baseline |
|-----------|-------------|-----------|-----------|-----------------|--------------|
| **Synapse** | `components/synapse` | `data/synapse-component-figma-map.json` | `components/synapse-theme.css` | `Spec Generated/Synapse/...` | `components/ids` |
| **DAP** | `components/DAP` | `data/component-figma-map.json` | `components/dap-theme.css` | `Spec Generated/DAP/...` | `components/ids` |
| **IDS** | `components/ids` | `data/component-figma-map.json` | `components/ids-theme.css` | `Spec Generated/IDS/...` | — (use plain intake) |

Registry of completed / pending forks: [`data/programme-inheritance-registry.json`](../data/programme-inheritance-registry.json).

---

## Figma URL intake (your usual pattern)

Provide programme Figma links in **three buckets**. The agent live-verifies **every** URL in all three buckets (MCP: `get_metadata`, `get_design_context`, `get_variable_defs`).

| Bucket | What it is | Required? | Examples |
|--------|------------|-----------|----------|
| **Main component** | Component set, composed instance, or documentation frame | **At least one** | `ModalDialog-Main`, expanded/collapsed rail |
| **Elements** | Sub-component sets, slots, inline actions | Recommended | `.Modal-Element-Content`, primary row set, footer button |
| **States** | Variant rows, state matrices, type axes | Recommended | `Type=Destructive`, hover/selected primary icon |

**Multiple URLs per bucket:** paste several links in one message, or add one at a time until you reply **`done`** for that bucket.

**Parse rule:** `node-id=43461-175960` → `43461:175960` for MCP and the spec.

**Map file:** the first **main** URL’s node becomes `nodeId` / `mainComponentSetNodeId` in the programme figma map; element/state nodes are stored as supplemental `*NodeId` fields.

---

## Base prompt (copy into a new agent chat)

### Wizard mode (agent asks what’s missing)

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

### Cursor shortcut

```text
@design-spec-programme-inheritance Generate a programme inheritance design-spec. Ask one question at a time, confirm before run.
```

### Expert one-shot — paste all URLs in three blocks (recommended for you)

```text
Run programme inheritance design-spec RUN phase (confirm summary first).

Programme: Synapse
Component display name: Modal Dialog
IDS baseline: Modal — components/ids/modal/design-spec.md
Storybook: no

Main component URL(s):
- https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=43461-175960&m=dev

Element URL(s):
- https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11348-62999&m=dev
- done

State URL(s):
- https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=43461-175961&m=dev
- https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=43461-176040&m=dev
- done

Rules: full spec with IDS baseline + programme deltas table; live Figma MCP on every URL above; Status draft.
```

### Left Nav example (three buckets)

```text
Programme: Synapse
Component: Left Nav
IDS baseline: Main Menu/Left — components/ids/main-menu-left/design-spec.md

Main component URL(s):
- …?node-id=47807-8153  (MainMenu-Left-Main set)
- …?node-id=47807-8154  (State=Expanded instance, optional)

Element URL(s):
- …?node-id=47807-8058   (primary row set)
- …?node-id=47807-8043   (primary icon collapsed)
- …?node-id=47807-8028   (secondary row)
- …?node-id=50516-35461  (New Chat / Left Nav Button)
- done

State URL(s):
- …?node-id=47807-8054   (collapsed hover)
- …?node-id=47807-8050   (collapsed selected)
- done
```

---

## Interview order (wizard)

| # | Question |
|---|----------|
| 1 | Programme: **Synapse** or **DAP** |
| 2 | Component display name |
| 3 | IDS baseline component (or `unknown`) |
| 4 | **Main component URL(s)** — one or many; reply `done` when finished |
| 5 | **Element URL(s)** — repeat until `done` |
| 6 | **State URL(s)** — repeat until `done` |
| 7 | Storybook: **yes** / **no** |
| 8 | **Summary** — all node IDs by bucket; reply **`yes`** to run |

If you already paste all three URL blocks in message 1, skip to summary (step 8).

If you omit the IDS baseline, the agent looks up `data/component-figma-map.json` and programme alias files.

---

## What the agent will do (after you reply `yes`)

```mermaid
flowchart TD
  A[Confirm inputs] --> B[Read IDS baseline spec]
  B --> C[Live Figma MCP on programme nodes]
  C --> D[Build programme deltas table]
  D --> E[Write full programme design-spec.md]
  E --> F[Update figma map + inheritance registry]
  F --> G{Storybook yes?}
  G -->|yes| H[Spec Generated programme story]
  G -->|no| I[Done]
```

1. **Classify pattern** — `ids-fork` (same Figma family) vs `standalone`
2. **Read IDS spec** — anatomy, API, states, codegen contract
3. **Live Figma MCP** on **every programme URL** (main → elements → states):
   - **Main:** structure, variant axes, default dimensions
   - **Elements:** per-slot padding, typography, token bindings
   - **States:** state matrix rows; `get_variable_defs` per variant
4. **Delta table** — compare MCP results to IDS spec (layout, chrome, tokens, states, anatomy, API)
5. **Write spec** — all 10 `##` sections; scaffold from `SYNAPSE_IDS_FORK_TEMPLATE` (works for any programme; rename section to “Programme deltas”)
6. **Update map** — `designSpecPath`, `specPattern`, `idsBaselineSpecPath`, node IDs
7. **Register** — `data/programme-inheritance-registry.json`
8. **Storybook** (optional) — `Spec Accurate Design` under `Spec Generated/<Programme>/...`

---

## Spec shape (every programme)

```markdown
## <Baseline> baseline (layout, flow, contracts)
… inherits IDS unless programme deltas …

## Metadata
- Spec pattern: ids-fork
- Programme: Synapse | DAP
- IDS baseline slug: …

### <Programme> programme deltas (vs IDS)
| Topic | IDS | Synapse/DAP |
…

## Anatomy … ## Source Mapping
(both IDS parity ref + programme Figma evidence)
```

**Rules**

- Never blind-copy IDS dimensions into the programme spec without programme Figma proof.
- Scenarios **not** in the programme Figma node you verified → inherit IDS section by reference.
- Token **names** in spec; resolved values in programme theme CSS.

---

## Programme-specific notes

### Synapse

- Detail: [design-spec-synapse-ids-fork.md](design-spec-synapse-ids-fork.md)
- Examples: Left Nav, Modal Dialog
- Implementation: shared component + `programme="synapse"` when applicable

### DAP

- Same inheritance rules; deltas may be fewer (inline “DAP override” in Layout is acceptable for small diffs).
- Folder: `components/DAP/<slug>/`
- Often shares IDS Figma file with DAP theme overlay — still verify live nodes if DAP has a separate frame.

---

## After the spec exists

| Goal | Action |
|------|--------|
| Review deltas | Open `### … programme deltas (vs IDS)` table |
| Mark production-ready | Pass validation checklist → `Status: active` |
| Implementation | Ask explicitly: “implement Synapse Modal with programme flag” |
| Storybook | Ask: “add Spec Generated/Synapse/Modal story” |
| Drift check | Re-run Figma MCP after library token changes |

---

## Related artifacts

| Artifact | Path |
|----------|------|
| **This process** | `docs/design-spec-programme-inheritance.md` |
| Agent skill | `.cursor/skills/design-spec-programme-inheritance/SKILL.md` |
| Synapse detail | `docs/design-spec-synapse-ids-fork.md` |
| Authoring contract | `docs/design-spec-authoring-contract.md` |
| Plain new-spec wizard | `docs/design-spec-intake.md` |
| Registry | `data/programme-inheritance-registry.json` |
| Template | `scripts/design_spec_template.py` → `SYNAPSE_IDS_FORK_TEMPLATE` |
