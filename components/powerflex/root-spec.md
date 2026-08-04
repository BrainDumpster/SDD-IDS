# PowerFlex Design System — Root Spec

> Programme-level root spec for `components/powerflex/*` design specifications.  
> PowerFlex inherits the IDS token structure and scale system documented in `components/ids/root-spec.md` and `components/ids-theme.css`; this file records PowerFlex-specific programme identity and component aliases.

## Design System Identity

| Property | Value |
|---|---|
| Name | PowerFlex |
| Slug | `powerflex` |
| Framework Layer | framework-agnostic |
| Figma Component Library Key | `82bDP05ESsiiGe38p5TEQJ` |
| Figma Component Library URL | [PowerFlex MCP Design System](https://www.figma.com/design/82bDP05ESsiiGe38p5TEQJ/PowerFlex-MCP-Design-System) |
| Component map | `data/powerflex-component-figma-map.json` |
| Components directory | `components/powerflex/` |
| Theme CSS | `components/powerflex-theme.css` |
| IDS baseline root spec | `components/ids/root-spec.md` |
| IDS baseline theme CSS | `components/ids-theme.css` |

## Inheritance from IDS

PowerFlex is a standalone programme: it does **not** fork individual IDS components but re-uses the IDS token/primitive scale layer.  Component specs in `components/powerflex/<slug>/design-spec.md` must:

- Use `--corner-radius-*`, `--padding-*`, `--spacing-*` and `--font-*` scale tokens from `components/ids-theme.css`.
- Define PowerFlex-specific color aliases when the Figma evidence does not map to an existing IDS semantic token.
- Record all Figma node ids, bound variables and verification method in `## Source Mapping`.

## PowerFlex component aliases

| Alias | Token | Notes |
|---|---|---|
| `--text-box-control-radius` | `5px` | Figma `text-input` COMPONENT_SET `cornerRadius = 5.0` (node `2723:2611`) |
| `--text-box-focus-ring-radius` | `var(--corner-radius-radius-4)` | 4 px focus ring |
| `--text-box-border-width` | `1px` | 1 px stroke on `input-row` and `focus-ring` |

## Source Mapping

| Source | File key / path | Notes |
|---|---|---|
| Figma component library | `82bDP05ESsiiGe38p5TEQJ` | Packaged REST evidence used for all `components/powerflex` specs |
| IDS baseline root spec | `components/ids/root-spec.md` | Inherited scale and semantic token tables |
| IDS baseline theme CSS | `components/ids-theme.css` | Imported by `components/powerflex-theme.css` |
