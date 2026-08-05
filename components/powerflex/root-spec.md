# PowerFlex Design System — Root Spec

> Programme-specific baseline for PowerFlex components. Overrides and augments the IDS token vocabulary where the PowerFlex Figma file diverges.

## Design System Identity

| Property | Value |
|---|---|
| Name | PowerFlex |
| Slug | powerflex |
| Framework Layer | framework-agnostic |
| Figma file key | 82bDP05ESsiiGe38p5TEQJ |
| Figma URL | [PowerFlex MCP Design System](https://www.figma.com/design/82bDP05ESsiiGe38p5TEQJ/PowerFlex-MCP-Design-System) |
| Component map | `data/powerflex-component-figma-map.json` |
| Components directory | `components/powerflex/` |
| Theme CSS | `components/powerflex-theme.css` |
| Root spec | `components/powerflex/root-spec.md` |
| Inheritance model | standalone (no IDS baseline) |

### Supported Generation Targets
- React, Angular, Vue, Lit, and any framework consuming CSS custom properties.

## Inheritance from IDS

PowerFlex does not inherit IDS anatomy for packaged components. Token naming follows the IDS convention (`--color-*`, `--corner-radius-*`, `--spacing-*`) so generators can reuse token parsers. The full IDS token dictionary is available in `components/ids/root-spec.md` and `components/ids-theme.css`.

## Color System

Semantic color tokens are defined in `components/powerflex-theme.css` and map PowerFlex Figma variables to CSS custom properties (e.g. `color/action/primary/default` → `--color-action-primary-default`). Components must reference tokens from `components/powerflex-theme.css` rather than hardcoding values.

## Typography, Spacing, Radius

Use IDS token names unless a PowerFlex Figma variable explicitly overrides them. The PowerFlex toggle uses `--corner-radius-radius-round` for the full-pill track, thumb, and focus ring.

## Interaction Baseline

- Focus indicators use `--toggle-focus-ring-color`.
- Keyboard operability: `Tab` for focus, `Space`/`Enter` for activation.
- Disabled states block interaction and use the disabled token set.

## Accessibility Baseline

- WCAG AA contrast targets.
- Semantic HTML first; ARIA only when semantic primitives are insufficient.
- Visible focus states required for keyboard users.

## Theming Mechanism

- CSS custom properties scoped to `html[data-design-system="powerflex"]` and `[data-theme="dark"]`.
- Component specs reference `components/powerflex-theme.css`.

## Source Mapping

| Source | File key / Path |
|---|---|
| PowerFlex MCP Design System | `82bDP05ESsiiGe38p5TEQJ` |
| Component map | `data/powerflex-component-figma-map.json` |
| Design system config | `config/design_systems/powerflex.yaml` |
