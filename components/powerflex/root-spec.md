# Powerflex Design System — Root Spec

> Programme specification inheriting IDS baseline tokens and global contracts.
> Donor baseline: [`components/ids/root-spec.md`](../ids/root-spec.md)
> Theme: [`components/powerflex-theme.css`](../powerflex-theme.css) (imports [`components/ids-theme.css`](../ids-theme.css))

## Design System Identity

| Property | Value |
|---|---|
| Name | Powerflex |
| Parent Design System | IDS (baseline specs + donor theme import) |
| Framework Layer | framework-agnostic |
| Figma file key | `HIbl2AgqTSdR9STZueMvTH` (DAP Design Library — programme component source) |
| Component map | `data/powerflex-component-figma-map.json` |
| Components directory | `components/powerflex/` |
| Theme mechanism | CSS custom properties + `data-theme` + `data-design-system="powerflex"` |
| Donor root spec | `components/ids/root-spec.md` |
| Donor theme CSS | `components/ids-theme.css` |

### Supported Generation Targets

- React
- Angular
- Vue
- Lit
- Other frameworks that can consume CSS variables and semantic state contracts

<!-- ds:inherits root-spec -->

## Inheritance contract

All semantic tokens, typography, color system, spacing, elevation, and global interaction contracts **inherit from** [`components/ids/root-spec.md`](../ids/root-spec.md) unless explicitly overridden in this file or in a Powerflex component `design-spec.md`.

Powerflex theme CSS (`components/powerflex-theme.css`) imports the IDS donor theme and may add programme-scoped overrides under `[data-design-system="powerflex"]`.

*(No programme-wide token overrides at bootstrap.)*
