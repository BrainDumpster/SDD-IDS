<!-- ds:inherits root-spec -->
# Powerflex Design System — Root Spec

> Programme specification inheriting IDS baseline from `components/ids/root-spec.md`.
> All `components/powerflex/<slug>/design-spec.md` files are programme-native unless marked ids-fork in the inheritance registry.

## Design System Identity

| Property | Value |
|---|---|
| Name | Powerflex |
| Parent Design System | IDS (`components/ids/root-spec.md`, `components/ids-theme.css`) |
| Framework Layer | framework-agnostic |
| Figma Component Library Key | `HIbl2AgqTSdR9STZueMvTH` |
| Figma URL (reference) | https://www.figma.com/design/HIbl2AgqTSdR9STZueMvTH/DAP-Design-Library |
| Component map | `data/powerflex-component-figma-map.json` |
| Components directory | `components/powerflex/` |
| Theme mechanism | CSS custom properties + `@import` of donor IDS theme |
| Programme theme CSS | `components/powerflex-theme.css` |
| Donor theme CSS | `components/ids-theme.css` |

### Supported Generation Targets

- React
- Angular
- Vue
- Lit
- Other frameworks that can consume CSS variables and semantic state contracts

## Color System

Powerflex uses **IDS-compatible semantic token naming** resolved through `components/powerflex-theme.css`, which imports `components/ids-theme.css`.

For the authoritative semantic/primitive token tables, spacing scale, typography roles, elevation, motion, and accessibility baselines, see **[IDS Root Spec](../ids/root-spec.md)**.

## Theme Import Rule

Storybook **Spec Generated / Powerflex** stories **must** import exactly:

```text
components/powerflex-theme.css
```

Do not import only the donor IDS theme file when the programme theme wrapper exists.
