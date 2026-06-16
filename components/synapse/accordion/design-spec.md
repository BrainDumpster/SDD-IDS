# Accordion Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Accordion** is an **ids-fork** of the IDS **Accordion** family. Item grouping, 4px left highlighter, chevron placement, form variant, expand modes, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/accordion/design-spec.md`](../ids/accordion/design-spec.md)
- **Shared implementation:** `storybook/src/components/IdsAccordion.tsx`, `IdsAccordion.module.css`
- **Theme CSS:** `components/synapse-theme.css` (no programme layout aliases)

**Figma scope:** Synapse Form Elements board `16551:26036` and component set `10962:89111` (`Accordion-Main`) — same structure as IDS exploration library.

## Metadata

| Property | Value |
|---|---|
| Component | Accordion |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `accordion` |
| Status | **active** |
| Version | 1.0.0 |
| Figma board node | `16551:26036` — [Accordion](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=16551-26036&m=dev) |
| Component set | `10962:89111` (`Accordion-Main`) |
| Chevron-left sample | `10962:89112` |
| Chevron-right sample | `10962:89118` |
| IDS Design Library colors | `42156:108639` (file `0bHk3XhrjFhowgFkz9yLr4`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_metadata`) + IDS baseline |
| Last verified | 2026-06-12 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Trigger height / padding | 40px, `12px 16px` | **Same** (inherit IDS) |
| 4px left highlighter | `var(--color-border-brand-base)` | **Same** |
| Chevron slug | `chev-down-thick` | **Same** |
| State tokens (hover/expanded/disabled) | IDS contract | **Same** |
| Runtime API | IDS contract | **Same** (inherit IDS) |

**No programme layout aliases.**

## Anatomy

Inherit IDS **Anatomy** — `AccordionRoot` → `AccordionItem` → `AccordionHeader` (single trigger surface) → `AccordionBody` → `AccordionContent`. See [`components/ids/accordion/design-spec.md`](../ids/accordion/design-spec.md).

## Layout & Measurements

Inherit IDS contiguous row model, trigger `40px` height, expanded panel padding `8px 24px 16px 40px`, optional content card, and focus ring from IDS **Layout & Measurements**.

## Tokens

Inherit IDS **Tokens** — surfaces, borders, typography, chevron icon slug.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/accordion/design-spec.md`](../ids/accordion/design-spec.md).

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** — single/multi expand, chevron rotation, keyboard roving focus, disabled skip.

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve `items`, `multiple`, `defaultValue`, `chevronPosition`, `variant`, and per-item fields from IDS **Composition & API (runtime)**. Reference contract: `storybook/src/spec-contracts/ids-accordion.contract.tsx`.

### Synapse-only runtime flags

None.

### Storybook defaults

Mirror IDS accordion scenarios under **Spec Generated/Synapse/Accordion** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/accordion/design-spec.md`](../ids/accordion/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| All slots / tokens | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS slot order: `AccordionRoot` → `AccordionItem[]` → header/trigger → panel/content (+ optional form/meta slots).

### Variant matrix

Inherit IDS: `variant` (`default | form`) × `chevronPosition` (`left | right`) × `single | multiple` expand × item state.

### Per-slot style contract

Inherit IDS **Codegen Contract → Per-slot style contract** — 4px left rail on open header+panel, no panel `border-top`, chevron via `chev-down-thick`.

### Behavior contract

Inherit IDS single/multi toggle rules, disabled blocking, border continuity.

### Accessibility contract

Inherit IDS `aria-expanded`, `aria-controls`, `role="region"`, keyboard model.

### Asset resolution + bundling contract

Inherit IDS `chev-down-thick` slug via shared `Icon` primitive.

### Fallback/error rules

Inherit IDS unknown chevron/variant, duplicate `value` warnings.

Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets.

### Validation checklist

- [x] IDS baseline linked; programme deltas state **no layout aliases**
- [x] Codegen Contract subsections concrete
- [x] Figma MCP evidence on `10962:89111`, board `16551:26036`
- [x] Storybook `Spec Generated/Synapse/Accordion` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `accordion`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/accordion/design-spec.md` — nodes `16551:26036`, `10962:89111` |
| Programme spec | `components/synapse/accordion/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Board | `16551:26036` |
| Component set | `10962:89111` |
| Implementation | `storybook/src/components/IdsAccordion.tsx` |
| Programme wrapper | `storybook/src/components/SynapseAccordion.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-accordion.contract.ts` |
| Storybook | `storybook/src/components/SynapseAccordion.stories.tsx` |
| Verification | Figma MCP `get_metadata` (2026-06-12) |
