# Powerflex Design System — Root Spec

> Powerflex inherits the IDS token architecture. This root spec documents the programme identity; refer to `components/ids/root-spec.md` for the full token tables and baseline contracts.

## Design System Identity

| Property | Value |
|---|---|
| Name | Powerflex |
| Display name | Powerflex |
| Framework layer | framework-agnostic |
| Theme CSS | `components/powerflex-theme.css` |
| Components directory | `components/powerflex/` |
| Figma map | `data/powerflex-component-figma-map.json` |
| Config | `config/design_systems/powerflex.yaml` |
| IDS baseline root spec | `components/ids/root-spec.md` |
| IDS baseline theme CSS | `components/ids-theme.css` |

## Supported Generation Targets

- React
- Angular
- Vue
- Lit
- Any framework consuming CSS custom properties and semantic state contracts

## Theming Mechanism

- IDS tokens are loaded first via `@import url("ids-theme.css")`.
- Powerflex-specific aliases are defined under `[data-design-system="powerflex"]`.
- Component specs use `var(--...)` and resolve to IDS values unless a Powerflex override is defined.

## Codegen Baseline

- All `components/powerflex/<slug>/design-spec.md` files are full standalone specs.
- Generators must preserve semantic token names, maintain parallel Light/Dark state tables, and emit validation errors for missing required tokens, props, or accessibility labels.
- Refer to `components/ids/root-spec.md` for core color, spacing, and interaction baselines.
