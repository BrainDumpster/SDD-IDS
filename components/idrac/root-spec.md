<!-- auto:generated:start -->
# iDRAC Design System — Root Spec

> Global iDRAC specification for spec-driven, framework-agnostic component generation.
> All `components/idrac/<slug>/design-spec.md` files inherit this baseline and only override component-specific behavior.
> 
> **iDRAC baseline**: Inherits from IDS Design System root spec at `components/ids/root-spec.md`.

<!-- ds:section id=identity -->
## Design System Identity

|| Property | Value |
||---|---|
|| Name | iDRAC |
|| Framework Layer | framework-agnostic |
|| Baseline Programme | IDS |
|| Baseline Root Spec | `components/ids/root-spec.md` |
|| Baseline Theme CSS | `components/ids-theme.css` |
|| Figma Component Library Key | `0bHk3XhrjFhowgFkz9yLr4` (inherited from IDS) |
|| Figma Variables Library Key | `r0Ex6TumqcR3HINamsfXCV` (inherited from IDS) |
|| Variables Library URL | [IDS Variables Library](https://www.figma.com/design/r0Ex6TumqcR3HINamsfXCV/IDS-Variables-Library) |
|| Component map | `data/idrac-component-figma-map.json` |
|| Components directory | `components/idrac/` |
|| Theme mechanism | CSS custom properties + theme mode selection (inherited from IDS) |

### Supported Generation Targets
- React
- Angular
- Vue
- Lit
- Other frameworks that can consume CSS variables and semantic state contracts

<!-- ds:section id=color-system -->
## Color System

iDRAC inherits the complete color system from IDS baseline. All component styling must use semantic tokens (`var(--...)`), not hardcoded color values.

### Core Semantic Background Tokens (inherited from IDS)

|| Token | Light | Dark |
||---|---|---|
|| `--color-background-component` | `#ffffff` | `#111619` |
|| `--color-background-surface-1` | `#f4f4f4` | `#111619` |
|| `--color-background-brand-base` | `#0672cb` | `#509cda` |
|| `--color-background-brand-strong` | `#055fa9` | `#97c4e9` |
|| `--color-background-brand-lighter` | `#ebf4fb` | `#1e262c` |

### Core Border Tokens (inherited from IDS)

|| Token | Light | Dark |
||---|---|---|
|| `--color-border-accessible` | `#757575` | `#8898a5` |
|| `--color-border-brand-base` | `#0672cb` | `#509cda` |
|| `--color-border-neutral` | `#4d4d4d` | `#8898a5` |

### Core Text Tokens (inherited from IDS)

|| Token | Light | Dark |
||---|---|---|
|| `--color-text-white` | `#ffffff` | `#ffffff` |
|| `--color-text-black` | `#252525` | `#252525` |
|| `--color-text-neutral` | `#4d4d4d` | `#b8c1c9` |

### iDRAC Programme Overrides
Currently, iDRAC uses the complete IDS color system without programme-specific overrides. Add iDRAC-specific color tokens here when needed.

<!-- ds:section id=primitive-static -->
### Primitive palette (inherited from IDS)

> Full primitive palette inherited from IDS baseline. See `components/ids/root-spec.md` for complete reference.

<!-- ds:section id=tokens-color -->
### Tokens collection — COLOR (inherited from IDS)

> Full semantic color token collection inherited from IDS baseline. See `components/ids/root-spec.md` for complete reference.

<!-- ds:section id=typography -->
## Typography (inherited from IDS)

iDRAC inherits the complete typography system from IDS baseline. Font families, sizes, weights, and line heights are defined in the IDS root spec.

<!-- ds:section id=spacing -->
## Spacing & Sizing (inherited from IDS)

iDRAC inherits the complete spacing and sizing system from IDS baseline, including:
- Spacing tokens (space-1 through space-32)
- Padding tokens (padding-2 through padding-52)
- Border radius tokens (radius-2 through radius-12)
- Border width tokens (border-1, border-2)

<!-- ds:section id=shadows -->
## Shadows (inherited from IDS)

iDRAC inherits the complete shadow system from IDS baseline, including drop shadows for different elevation levels.

<!-- ds:section id=component-aliases -->
## Component Layout Aliases (inherited from IDS)

iDRAC inherits component-specific layout aliases from IDS baseline:

|| Token | Value |
||---|---|
|| `--button-control-radius` | var(--corner-radius-radius-2) |
|| `--button-focus-ring-radius` | var(--corner-radius-radius-4) |
|| `--dropdown-control-radius` | var(--corner-radius-radius-none) |
|| `--checkbox-control-radius` | var(--corner-radius-radius-2) |
|| `--card-control-radius` | var(--corner-radius-radius-none) |
|| `--modal-control-radius` | var(--corner-radius-radius-none) |

Add iDRAC-specific component aliases here when needed.

<!-- ds:section id=programme-specific -->
## iDRAC Programme Specific Guidelines

### Component Patterns
- iDRAC components follow the same structural patterns as IDS baseline
- Use semantic tokens from the inherited color system
- Maintain consistency with IDS interaction patterns

### Theme Application
- Apply `data-design-system="idrac"` to html or body element
- Use `[data-theme="dark"]` for dark theme variants
- Theme CSS: `components/idrac-theme.css` (thin wrapper importing IDS theme)

### Component Registration
- All iDRAC components are registered in `data/idrac-component-figma-map.json`
- Programme inheritance tracked in `data/programme-inheritance-registry.json`
- Spec pattern: `standalone` for iDRAC-native components