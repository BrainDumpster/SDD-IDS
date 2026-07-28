# Powerflex Design System — Root Spec

> Powerflex inherits the IDS design-system baseline documented in `components/ids/root-spec.md`. This file records the Powerflex programme identity and points codegen/validation tools to the programme-specific theme and component directories.

## Design System Identity

| Property | Value |
|---|---|
| Name | powerflex |
| Display name | Powerflex |
| Framework Layer | framework-agnostic |
| Baseline root spec | `components/ids/root-spec.md` |
| Baseline theme CSS | `components/ids-theme.css` |
| Programme theme CSS | `components/powerflex-theme.css` |
| Programme components directory | `components/powerflex/` |
| Component map | `data/powerflex-component-figma-map.json` |

## Inheritance Notes

- All base semantic color, typography, spacing, and radius contracts from `components/ids/root-spec.md` apply unless overridden in `components/powerflex-theme.css`.
- Component specs under `components/powerflex/<slug>/design-spec.md` are standalone for Powerflex-native components and take precedence over any IDS component with the same slug.
- Token names in Powerflex specs should prefer `var(--...)` references from `components/powerflex-theme.css` and the IDS baseline.
