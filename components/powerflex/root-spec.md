# PowerFlex Design System — Root Spec

> PowerFlex inherits the IDS root specification (`components/ids/root-spec.md`) as its baseline. This document records the inheritance and any PowerFlex-specific programme overrides.

## Design System Identity

| Property | Value |
|---|---|
| Name | PowerFlex |
| Framework Layer | framework-agnostic |
| Baseline design system | IDS (`components/ids/root-spec.md`) |
| Baseline theme CSS | `components/ids-theme.css` |
| Programme theme CSS | `components/powerflex-theme.css` |
| Figma Component File Key | `82bDP05ESsiiGe38p5TEQJ` |
| Component map | `data/powerflex-component-figma-map.json` |
| Components directory | `components/powerflex/` |
| Theme mechanism | CSS custom properties + theme mode selection |

### Inheritance statement

All sections not explicitly overridden below are inherited from `components/ids/root-spec.md`:
- Color System
- Typography Scale
- Spacing & Sizing
- Border Width
- Corner Radius
- Elevation System
- Opacity Scale
- Responsive Breakpoints
- Interaction Baseline
- Accessibility Baseline
- Theming Mechanism
- Variable Collections
- Codegen Baseline Contract

### Supported Generation Targets
- React
- Angular
- Vue
- Lit
- Other frameworks that can consume CSS variables and semantic state contracts

## PowerFlex Programme Overrides

| Layer | IDS baseline | PowerFlex override | Source |
|---|---|---|---|
| Brand blue (base) | `--color-background-controls-brand-base: #0672cb` | `#0076ce` | Figma `toggle` component set, track `default/on` fill |
| Brand blue (strong) | `--color-background-controls-brand-strong: #055fa9` | `#005da4` | Figma `toggle` hover/on track fill |
| Brand blue (stronger) | `--color-background-controls-brand-stronger: #044b86` | `#00447c` | Figma `toggle` active/on track fill |
| Gray (light) | `--color-background-gray-light: #eaeaea` | `#eeeeee` | Figma `toggle` off/default track fill |
| Gray (base) | `--color-background-gray-base: #757575` | `#888888` | Figma `toggle` off/hover track fill |
| Gray (strong) | `--color-background-gray-strong: #616161` | `#333333` | Figma `toggle` off/active track fill |
| Gray (lighter) | `--color-background-gray-lighter: #f4f4f4` | `#f4f4f4` | Figma `toggle` disabled track fill |

## Toggle-Specific Tokens

| Token | Value | Notes |
|---|---|---|
| `--toggle-control-radius` | `var(--corner-radius-radius-round)` | Track, thumb, and focus ring are fully rounded (`9999px` in Figma) |
| `--toggle-focus-ring-offset` | `3px` | Focus ring is 6px wider/taller than the track on each axis |
| `--toggle-thumb-offset` | `2px` | Thumb inset from the track edge in the `off` position |

## Source Mapping

| Source | Path / Key |
|---|---|
| PowerFlex config | `config/design_systems/powerflex.yaml` |
| PowerFlex component map | `data/powerflex-component-figma-map.json` |
| PowerFlex Figma file | `82bDP05ESsiiGe38p5TEQJ` |
| IDS baseline root spec | `components/ids/root-spec.md` |
