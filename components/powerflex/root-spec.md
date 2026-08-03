<!-- auto:generated:start -->
# PowerFlex Design System — Root Spec

> PowerFlex inherits the IDS token baseline and root-spec semantics. This file documents the programme identity and verified component aliases; for full token tables see `components/ids/root-spec.md` and `components/ids-theme.css`.

## Design System Identity

| Property | Value |
|---|---|
| Name | PowerFlex |
| Framework Layer | framework-agnostic |
| Figma Component Library Key | `82bDP05ESsiiGe38p5TEQJ` |
| Figma Component Library URL | [PowerFlex MCP Design System](https://www.figma.com/design/82bDP05ESsiiGe38p5TEQJ/PowerFlex-MCP-Design-System) |
| Component map | `data/powerflex-component-figma-map.json` |
| Components directory | `components/powerflex/` |
| Theme mechanism | CSS custom properties + IDS theme import |

## Inheritance from IDS

- Base semantic colours, typography, spacing, and primitive tokens are sourced from `components/ids-theme.css`.
- Programme-specific component aliases are overridden in `components/powerflex-theme.css`.
- When a PowerFlex component is standalone, its `design-spec.md` is a full spec with no IDS baseline section.

## Supported Generation Targets

- React
- Angular
- Vue
- Lit
- Other frameworks that consume CSS variables and semantic state contracts

## PowerFlex Token Strategy

| Layer | Responsibility | Example |
|---|---|---|
| IDS base tokens | Foundation colours, typography, spacing | `--color-background-component`, `--corner-radius-radius-4` |
| Programme theme CSS | PowerFlex attribute wrapper + component aliases | `components/powerflex-theme.css` |
| Component spec | References aliases and semantic tokens | `components/powerflex/text-box/design-spec.md` |

## Source Mapping

| Source | Location |
|---|---|
| PowerFlex component map | `data/powerflex-component-figma-map.json` |
| PowerFlex config | `config/design_systems/powerflex.yaml` |
| PowerFlex component specs | `components/powerflex/<slug>/design-spec.md` |
| IDS baseline tokens | `components/ids-theme.css` / `components/ids/root-spec.md` |

<!-- auto:generated:end -->
