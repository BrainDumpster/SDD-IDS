# Card Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Card** shares the IDS **Card** component family (`CardRoot`, optional header, body, footer). Anatomy, padding signatures, state tokens, and runtime API match the IDS spec unless noted in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/card/design-spec.md`](../ids/card/design-spec.md)
- **Shared implementation:** `storybook/src/components/Card.tsx`, `Card.module.css`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--card-control-radius`)

## Metadata
- Component: Card
- Design System: Synapse
- Category: Components
- Spec pattern: **ids-fork**
- IDS baseline slug: `card`
- Status: **draft**
- Version: 1.0.0
- Figma file: [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components)
- File key: `Td1bnsvRj1PCGs9RVJkIvJ`
- Main component: [50419:259141](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50419-259141&m=dev)
- Verification method: Figma map + theme alias contract (radius `10px` / `--corner-radius-radius-10`)
- Theme CSS: `components/synapse-theme.css`

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Control corner radius | `var(--card-control-radius)` → `var(--corner-radius-radius-8)` | **same alias** → **`var(--corner-radius-radius-10)`** (10px) via `components/synapse-theme.css` |
| Header / body / footer padding | IDS signatures | **Same** (inherit IDS) |
| Variant / state color tokens | IDS semantic tokens | **Same semantic `var(--...)` names** |

## Anatomy

Deterministic slot order (IDS-aligned):

1. `CardRoot` — shell with `border-radius: var(--card-control-radius)`
2. optional `CardHeader` — title row and/or overflow menu
3. `CardBody` — primary content
4. optional `CardFooter` — actions or metadata

## Layout & Measurements

- **Corner radius:** **`var(--card-control-radius)`** (Synapse theme resolves to `var(--corner-radius-radius-10)` / 10px)
- Header padding: `var(--padding-padding-16)` / `var(--padding-padding-8)` (inherit IDS)
- Body padding: `var(--padding-padding-8)` `var(--padding-padding-16)` (inherit IDS)
- Footer padding: inherit IDS contract
- Minimum height: `120px` (inherit IDS)

## Tokens

### Layout aliases (theme-resolvable)

Same alias names as IDS; resolved values overridden in `components/synapse-theme.css`:

- `--card-control-radius` → `var(--corner-radius-radius-10)`

### Colors (inherit IDS)

See IDS [`card`](../ids/card/design-spec.md) **Tokens** and **States** tables.

## States (Light Theme)

Same semantic token mapping as IDS — see IDS spec. Resolved values come from `components/synapse-theme.css`.

## States (Dark Theme)

Same semantic token mapping as IDS — see IDS spec.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/card/design-spec.md`](../ids/card/design-spec.md).

## Composition & API (runtime)

Inherit IDS **Composition & API (runtime)** — `title`, `header`, `children`, `footer`, `menuOptions`, `elevated`, `outlined`, etc.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

1. `CardRoot` (`border-radius: var(--card-control-radius)`; Synapse theme → 10px)
2. optional `CardHeader`
3. `CardBody`
4. optional `CardFooter`

### Theme & programme resolution

- Emit **`var(--card-control-radius)`** in component CSS; import **`components/synapse-theme.css`** for Synapse targets.
- Do **not** hardcode `10px` or `var(--corner-radius-radius-10)` in component stylesheets.

### Validation checklist

- [ ] `border-radius` uses `var(--card-control-radius)`
- [ ] Synapse theme defines alias override to `var(--corner-radius-radius-10)`
- [ ] IDS baseline padding and color tokens preserved

## Source Mapping

| Source | Location |
|---|---|
| IDS baseline | `components/ids/card/design-spec.md` |
| Synapse Figma node | `50419:259141` — `data/synapse-component-figma-map.json` |
| Theme alias | `components/synapse-theme.css` → `--card-control-radius` |
| Implementation | `storybook/src/components/Card.tsx` |
