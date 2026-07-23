# Powerflex Design System — Root Spec

> Global Powerflex specification for spec-driven, framework-agnostic component generation.
> Semantic tokens inherit from **IDS** via `components/ids/root-spec.md` and `components/ids-theme.css`.
> Programme theme entry: `components/powerflex-theme.css` (`@import "./ids-theme.css"`).
> All `components/powerflex/<slug>/design-spec.md` files are **standalone** programme specs (no IDS baseline section).

## Design System Identity

| Property | Value |
|---|---|
| Name | Powerflex |
| Donor design system | IDS |
| Donor root spec | `components/ids/root-spec.md` |
| Donor theme CSS | `components/ids-theme.css` |
| Programme theme CSS | `components/powerflex-theme.css` |
| Figma component library | DAP Design Library (`HIbl2AgqTSdR9STZueMvTH`) |
| Component map | `data/powerflex-component-figma-map.json` |
| Components directory | `components/powerflex/` |
| Theme mechanism | CSS custom properties + `data-theme` + `data-design-system="powerflex"` |

### Supported Generation Targets

- React
- Angular
- Vue
- Lit
- Other frameworks that can consume CSS variables and semantic state contracts

## Color System

All component styling must use semantic tokens (`var(--...)`), not hardcoded color values.
Powerflex resolves semantic color tokens through the imported IDS theme unless overridden in `components/powerflex-theme.css`.
Light and dark resolved values live in `components/ids-theme.css` under `[data-design-system="ids"]` and `[data-theme="dark"]`; Powerflex programme overrides apply under `[data-design-system="powerflex"]`.

Refer to `components/ids/root-spec.md` for the full IDS semantic and primitive token catalog.

## Programme Delta Register

### Button (Powerflex vs IDS donor baseline)

Delta source:

- Powerflex Figma matrix (main intake): https://www.figma.com/design/HIbl2AgqTSdR9STZueMvTH/DAP-Design-Library?node-id=9662-25120&m=dev (`9662:25120`)
- Cross-reference: DAP root spec `## Program Delta Register → Button` documents the same node with prior Figma MCP verification.

#### Layout deltas

- Button control radius family uses `var(--corner-radius-radius-4)` (`--button-control-radius` alias in `components/powerflex-theme.css`).
- Focus-visible outer ring: `var(--border-width-border-1)` stroke, `var(--button-focus-ring-offset)` (3px), ring radius `var(--button-focus-ring-radius)` aligned to 4px corner family.

#### Typography deltas

- No typography delta. Keep IDS baseline `Body 2` (`14/20`, weight `400`).

#### Style and visual-property deltas

- Runtime variant set: `primary | secondary | tertiary | destructive`.
- Size axis: `small | medium | large` (Figma matrix labels).
- Icon geometry: `16×16` leading icon; icon-only supported for `medium` and `large`.
- State behavior and paddings follow the variant × state × size matrix at node `9662:25120`.

#### Variable/token deltas

- Layout aliases overridden in programme theme:
  - `--button-control-radius` → `var(--corner-radius-radius-4)`
  - `--button-focus-ring-radius` → `var(--corner-radius-radius-4)`
  - `--button-focus-ring-offset` → `3px`
- Remaining color/spacing/border/text/icon tokens resolve through IDS donor theme unless future Powerflex theme deltas are added.

#### Component spec pointer

- Full standalone contract: `components/powerflex/button/design-spec.md`
