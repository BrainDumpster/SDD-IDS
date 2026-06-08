"""Shared canonical section titles and bootstrap blocks for IDS design-spec.md files."""

from __future__ import annotations

CODEGEN_TITLE = "Codegen Contract (Framework-Agnostic Blueprint)"
COMPOSITION_TITLE = "Composition & API (runtime)"

CANONICAL_H2_ORDER = [
    "Metadata",
    "Anatomy",
    "Layout & Measurements",
    "Tokens",
    "States (Light Theme)",
    "States (Dark Theme)",
    "Interactions",
    COMPOSITION_TITLE,
    CODEGEN_TITLE,
    "Source Mapping",
]

COMPOSITION_STUB = """Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.

"""

DARK_STATES_BOILERPLATE_SYNAPSE = """Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in theme CSS:

- `components/synapse-theme.css`

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*
"""

DARK_STATES_BOILERPLATE = """Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*
"""

CODEGEN_BOOTSTRAP = """### Deterministic structure
Follow **Anatomy** (same slot order). Codegen must emit stable PascalCase slot identifiers aligned with anatomy labels.

### Variant matrix
See **Composition & API (runtime) → Variants** when present; otherwise document variant axes in this subsection during spec hardening.

### Per-slot style contract
Resolve backgrounds, borders, typography, and icons from **Tokens** and **States (Light Theme)** / **States (Dark Theme)** using `var(--...)` only.

### Behavior contract
See **Interactions** and **Interactions → Behavior & guidelines**.

### Accessibility contract
See **Interactions → Accessibility**.

### Asset resolution + bundling contract
When icons are used, resolve from `assets/icons/<slug>.svg` through the shared Icon primitive; document slugs in this spec when known.

### Fallback/error rules
- Unknown variant or state → fall back to the documented default variant.
- Missing required content → validation error at codegen boundary (do not silently omit required slots).

"""

NEW_SPEC_TEMPLATE = (
"""# {component} Design Spec

## Metadata
- Component: {component}
- Category: {category}
- Figma: {figmaUrl}
- Node ID: {nodeId}
- Version: 1.0.0
- Description: TODO one-line summary of the component
- Status: draft
- Created: TODO
- Updated: TODO

## Anatomy
- TODO: list slots/parts in deterministic order (e.g., root, label, icon)

## Layout & Measurements
- TODO: dimensions, padding, spacing, icon sizes, responsive width behavior

## Tokens
### Typography
- TODO: headings, body text sizes/weights/line heights

### Colors and surfaces
- TODO: backgrounds, borders, text, icons, focus, links, shadows (`var(--...)` only)

## States (Light Theme)
| Area | State | Background | Border | Text/Icon |
| --- | --- | --- | --- | --- |
| TODO | default | TODO | TODO | TODO |

## States (Dark Theme)

"""
    + DARK_STATES_BOILERPLATE
    + """

## Interactions
- TODO: pointer/keyboard behaviors, focus ring spec

### Accessibility
- TODO: roles, aria attributes, keyboard expectations

### Behavior & guidelines
- TODO: usage guidance and do/don't

## Composition & API (runtime)
### Variants
- TODO: list supported variants and option axes

### Runtime API
- TODO: props, events, defaults

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
- TODO: ordered slot tree for codegen

### Variant matrix
- TODO: all valid variant/option combinations

### Per-slot style contract
- TODO: token mapping per slot

### Behavior contract
- TODO: state transitions, triggers, timers

### Accessibility contract
- TODO: roles, keyboard, ARIA

### Asset resolution + bundling contract
- TODO: icon slugs and bundling rules, or N/A

### Fallback/error rules
- TODO: unknown variant/token/asset handling

### Validation checklist
- [ ] TODO: pass/fail items for codegen QA

## Source Mapping
- Design source: Figma URL above
- Component map entry: `data/component-figma-map.json` → component "{component}" (category "{category}"; node "{nodeId}")
"""
)

SYNAPSE_IDS_FORK_TEMPLATE = (
"""# {component} Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **{component}** is the same component family as IDS **{idsComponent}**. Layout, interaction contracts, and shared slot geometry match the IDS spec unless noted in **Synapse programme deltas** below.

- **IDS source of truth:** [`{idsSpecPath}`]({idsSpecPath})
- **Shared implementation:** `{sharedImplementation}`
- **Synapse wrapper (if any):** `{synapseWrapper}`

## Metadata
- Component: {component}
- Design System: Synapse
- Category: {category}
- Spec pattern: ids-fork
- IDS baseline slug: {idsSlug}
- Figma file: {figmaUrl}
- File key: `{fileKey}`
- Main component set node: `{nodeId}`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Last verified: TODO
- Status: draft
- Version: 1.0.0
- Theme CSS: `components/synapse-theme.css`

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| TODO | TODO | TODO |

## Anatomy
(Same slot order as IDS [`{idsSlug}`]({idsSpecPath}) unless noted above.)

## Layout & Measurements
(Same flow as IDS except rows in **Synapse programme deltas**.)

## Tokens
### Surfaces and borders
- TODO: Synapse-specific tokens only; inherit unchanged typography from IDS spec

## States (Light Theme)
(Document rows that differ from IDS; identical rows inherit IDS state matrix.)

## States (Dark Theme)

"""
    + DARK_STATES_BOILERPLATE_SYNAPSE
    + """

## Interactions
(Same as IDS unless noted in **Synapse programme deltas**.)

### Accessibility
- TODO

### Behavior & guidelines
- TODO

## Composition & API (runtime)
(Inherit IDS types from shared implementation; document Synapse-only props.)

## Codegen Contract (Framework-Agnostic Blueprint)
"""
    + CODEGEN_BOOTSTRAP
    + """
### Validation checklist
- [ ] IDS contract referenced; programme deltas table complete
- [ ] Live Figma MCP evidence on Synapse nodes
- [ ] Storybook `Spec Generated/Synapse/{component}` with **Spec Accurate Design**

## Source Mapping
- Design source: Synapse Hi-Fi `{fileKey}`
- Validated nodes: `{nodeId}`
- IDS parity reference: `{idsSpecPath}`
- Registry: `data/programme-inheritance-registry.json` → `{synapseSlug}`
- Component map: `data/synapse-component-figma-map.json` → {component}
"""
)
