<!-- auto:generated:start -->
# IDS Design System — Root Spec

> Global IDS specification for spec-driven, framework-agnostic component generation.
> All `components/ids/<slug>/design-spec.md` files inherit this baseline and only override component-specific behavior.

<!-- ds:section id=identity -->
## Design System Identity

| Property | Value |
|---|---|
| Name | IDS |
| Framework Layer | framework-agnostic |
| Figma Component Library Key | `0bHk3XhrjFhowgFkz9yLr4` |
| Figma Variables Library Key | `r0Ex6TumqcR3HINamsfXCV` |
| Variables Library URL | [IDS Variables Library](https://www.figma.com/design/r0Ex6TumqcR3HINamsfXCV/IDS-Variables-Library) |
| Component map | `data/component-figma-map.json` |
| Components directory | `components/ids/` |
| Theme mechanism | CSS custom properties + theme mode selection |

### Supported Generation Targets
- React
- Angular
- Vue
- Lit
- Other frameworks that can consume CSS variables and semantic state contracts

<!-- ds:section id=color-system -->
## Color System

All component styling must use semantic tokens (`var(--...)`), not hardcoded color values.
Semantic color tokens resolve to different values in **Light** vs **Dark** themes. **Primitive** palette tokens are static across themes (foundation values referenced by semantic tokens or rare direct use in specs).

Semantic and primitive tables below are auto-synced from the centralized **IDS Variables Library** (`r0Ex6TumqcR3HINamsfXCV`) via REST export on the IDS Design Library (`0bHk3XhrjFhowgFkz9yLr4`). Core semantic summaries in this section may lag the synced tables; prefer the Figma-derived sections when values differ.

### Core Semantic Background Tokens

| Token | Light | Dark |
|---|---|---|
| `--color-background-surface-component` | `#ffffff` | `#111619` |
| `--color-background-surface-primary` | `#f4f4f4` | `#111619` |
| `--color-background-brand-base` | `#0672cb` | `#509cda` |
| `--color-background-brand-strong` | `#055fa9` | `#97c4e9` |
| `--color-background-brand-lighter-slate` | `#ebf4fb` | `#1e262c` |
| `--color-background-controls-base` | `#0672cb` | `#0672cb` |
| `--color-background-controls-strong` | `#055fa9` | `#055fa9` |
| `--color-background-controls-lighter` | `#ebf4fb` | `#022541` |
| `--color-background-gray-light` | `#eaeaea` | `#393939` |
| `--color-background-gray-base` | `#757575` | `#9e9e9e` |
| `--color-background-gray-neutral-light` | `#eaeaea` | `#34414c` |
| `--color-background-gray-neutral-dark` | `#616161` | `#8898a5` |
| `--color-background-masthead-base` | `#0672cb` | `#1e262c` |
| `--color-background-masthead-strong` | `#055fa9` | `#34414c` |
| `--color-background-masthead-stronger` | `#044b86` | `#455666` |

### Core Border Tokens

| Token | Light | Dark |
|---|---|---|
| `--color-border-gray-neutral-base` | `#757575` | `#8898a5` |
| `--color-border-brand-base` | `#0672cb` | `#509cda` |
| `--color-border-brand-strong` | `#055fa9` | `#97c4e9` |
| `--color-border-gray-neutral-strong` | `#252525` | `#b8c1c9` |
| `--color-border-gray-disabled` | `#757575` | `#9e9e9e` |
| `--color-border-gray-neutral-light` | `#c5c5c5` | `#34414c` |
| `--color-border-brand-transparent-brand` | `rgba(255,255,255,0.00)` | `#509cda` |
| `--color-border-gray-neutral-transparent-base` | `rgba(255,255,255,0.00)` | `#8898a5` |

### Core Text Tokens

| Token | Light | Dark |
|---|---|---|
| `--color-text-gray-white` | `#ffffff` | `#ffffff` |
| `--color-text-gray-black` | `#252525` | `#252525` |
| `--color-text-gray-neutral` | `#4d4d4d` | `#b8c1c9` |
| `--color-text-gray-neutral-strong` | `#252525` | `#e6e9ec` |
| `--color-text-brand-strong` | `#055fa9` | `#97c4e9` |
| `--color-text-gray-disabled` | `#757575` | `#c5c5c5` |

### Core Icon Tokens

| Token | Light | Dark |
|---|---|---|
| `--color-icon-gray-white` | `#ffffff` | `#ffffff` |
| `--color-icon-gray-inverse` | `#ffffff` | mode-specific |
| `--color-icon-gray-neutral-base` | `#4d4d4d` | mode-specific |
| `--color-icon-brand-base` | `#0672cb` | `#509cda` |
| `--color-icon-brand-strong` | `#055fa9` | `#97c4e9` |
| `--color-icon-gray-disabled` | `#757575` | `#c5c5c5` |
| `--color-icon-alerting-info-base` | `#005ece` | mode-specific |
| `--color-icon-alerting-major-base` | `#ed6400` | mode-specific |
| `--color-icon-alerting-minor-base` | `#ffc700` | mode-specific |
| `--color-icon-alerting-critical-base` | `#af0000` | mode-specific |

### Alerting Semantic Tokens (Common IDS)

| Token | Light | Dark |
|---|---|---|
| `--color-background-alerting-critical-base` | `#af0000` | mode-specific |
| `--color-background-alerting-critical-strong` | mode-specific | `#910000` |
| `--color-background-alerting-critical-stronger` | mode-specific | `#730000` |
| `--color-background-alerting-minor-base` | `#ffc700` | mode-specific |
| `--color-background-alerting-success-base` | `#1b8500` | mode-specific |
| `--color-border-alerting-critical-transparent-base` | `#af000000` | `#dd9494` |
| `--color-border-alerting-critical-base-white` | `#af0000` | mode-specific |
| `--color-border-alerting-major-base-white` | `#ed6400` | mode-specific |
| `--color-border-alerting-minor-base` | `#9c622e` | mode-specific |
| `--color-border-alerting-info-base-white` | `#005ece` | mode-specific |
| `--color-text-gray-black` | `#252525` | `#252525` |

<!-- ds:section id=primitive-static -->
### Primitive palette (Figma — `Primitive` collection, COLOR)

> Auto-synced from Figma `GET /v1/files/r0Ex6TumqcR3HINamsfXCV/variables/local` (canonical source: [IDS Variables Library](https://www.figma.com/design/r0Ex6TumqcR3HINamsfXCV/IDS-Variables-Library)). Token column uses `codeSyntax.WEB` when present, otherwise a CSS name derived from the Figma variable path.

#### Single-mode (same value in all modes)

| Token | Value |
|---|---|
| `--alert-blue-100` | `#ebf2fb` |
| `--alert-blue-200` | `#d9e7f8` |
| `--alert-blue-300` | `#94bbea` |
| `--alert-blue-400` | `#4c8edd` |
| `--alert-blue-500` | `#005ece` |
| `--alert-blue-600` | `#004eab` |
| `--alert-blue-700` | `#003e88` |
| `--alert-blue-800` | `#002e65` |
| `--alert-blue-900` | `#001e42` |
| `--alert-green-100` | `#edf5eb` |
| `--alert-green-200` | `#ddedd9` |
| `--alert-green-300` | `#9fcc94` |
| `--alert-green-400` | `#5faa4c` |
| `--alert-green-500` | `#1b8500` |
| `--alert-green-600` | `#166e00` |
| `--alert-green-700` | `#125800` |
| `--alert-green-800` | `#0d4100` |
| `--alert-green-900` | `#092b00` |
| `--alert-orange-100` | `#fef3eb` |
| `--alert-orange-200` | `#fce8d9` |
| `--alert-orange-300` | `#f7be94` |
| `--alert-orange-400` | `#f2934c` |
| `--alert-orange-500` | `#ed6400` |
| `--alert-orange-600` | `#c55300` |
| `--alert-orange-700` | `#9c4200` |
| `--alert-orange-800` | `#743100` |
| `--alert-orange-900` | `#4c2000` |
| `--alert-red-100` | `#f9ebeb` |
| `--alert-red-200` | `#f3d9d9` |
| `--alert-red-300` | `#dd9494` |
| `--alert-red-400` | `#c74c4c` |
| `--alert-red-500` | `#af0000` |
| `--alert-red-600` | `#910000` |
| `--alert-red-700` | `#730000` |
| `--alert-red-800` | `#560000` |
| `--alert-red-900` | `#380000` |
| `--alert-yellow-100` | `#fffbeb` |
| `--alert-yellow-200` | `#fff7d9` |
| `--alert-yellow-300` | `#ffe794` |
| `--alert-yellow-400` | `#ffd84c` |
| `--alert-yellow-500` | `#ffc700` |
| `--alert-yellow-600` | `#e5a51a` |
| `--alert-yellow-700` | `#c48429` |
| `--alert-yellow-800` | `#9c622e` |
| `--alert-yellow-900` | `#6d4028` |
| `--secondary-palette-berry-100` | `#f7ebf2` |
| `--secondary-palette-berry-200` | `#f1d9e7` |
| `--secondary-palette-berry-300` | `#d894bd` |
| `--secondary-palette-berry-400` | `#bd4c90` |
| `--secondary-palette-berry-500` | `#a10061` |
| `--secondary-palette-berry-600` | `#860051` |
| `--secondary-palette-berry-700` | `#6a0040` |
| `--secondary-palette-berry-800` | `#4f0030` |
| `--secondary-palette-berry-900` | `#34001f` |
| `--secondary-palette-teal-100` | `#ebf5f7` |
| `--secondary-palette-teal-200` | `#d9ecf0` |
| `--secondary-palette-teal-300` | `#94cad6` |
| `--secondary-palette-teal-400` | `#4ca7bb` |
| `--secondary-palette-teal-500` | `#00819e` |
| `--secondary-palette-teal-600` | `#006b83` |
| `--secondary-palette-teal-700` | `#005568` |
| `--secondary-palette-teal-800` | `#003f4d` |
| `--secondary-palette-teal-900` | `#002933` |
| `--secondary-palette-violet-100` | `#f5ebf9` |
| `--secondary-palette-violet-200` | `#ebd9f4` |
| `--secondary-palette-violet-300` | `#c894e1` |
| `--secondary-palette-violet-400` | `#a34dcd` |
| `--secondary-palette-violet-500` | `#7c01b7` |
| `--secondary-palette-violet-600` | `#670198` |
| `--secondary-palette-violet-700` | `#520179` |
| `--secondary-palette-violet-800` | `#3d005a` |
| `--secondary-palette-violet-900` | `#28003b` |
| `--ui-palette-brand-100` | `#ebf4fb` |
| `--ui-palette-brand-200` | `#daeaf7` |
| `--ui-palette-brand-300` | `#97c4e9` |
| `--ui-palette-brand-400` | `#509cda` |
| `--ui-palette-brand-500` | `#0672cb` |
| `--ui-palette-brand-600` | `#055fa9` |
| `--ui-palette-brand-700` | `#044b86` |
| `--ui-palette-brand-800` | `#033864` |
| `--ui-palette-brand-900` | `#022541` |
| `--ui-palette-gray-100` | `#f4f4f4` |
| `--ui-palette-gray-200` | `#eaeaea` |
| `--ui-palette-gray-300` | `#c5c5c5` |
| `--ui-palette-gray-400` | `#9e9e9e` |
| `--ui-palette-gray-500` | `#757575` |
| `--ui-palette-gray-600` | `#616161` |
| `--ui-palette-gray-700` | `#4d4d4d` |
| `--ui-palette-gray-800` | `#393939` |
| `--ui-palette-gray-900` | `#252525` |
| `--ui-palette-slate-100` | `#f2f3f5` |
| `--ui-palette-slate-200` | `#e6e9ec` |
| `--ui-palette-slate-300` | `#b8c1c9` |
| `--ui-palette-slate-400` | `#8898a5` |
| `--ui-palette-slate-500` | `#566c7f` |
| `--ui-palette-slate-600` | `#455666` |
| `--ui-palette-slate-700` | `#34414c` |
| `--ui-palette-slate-800` | `#1e262c` |
| `--ui-palette-slate-900` | `#111619` |
| `--white` | `#ffffff` |

<!-- ds:section id=tokens-color -->
### Color Modes collection — COLOR (Figma — `Color Modes`)

> Semantic color tokens from IDS Variables Library (`Color Modes`, Light/Dark). Token column uses `codeSyntax.WEB`. Values resolved after alias chains.

| Token | Light | Dark |
|---|---|---|
| `--annotation` | `#e8178a` | `#f174b9` |
| `--color-background-alerting-critical-base` | `#af0000` | `#c74c4c` |
| `--color-background-alerting-critical-light` | `#f3d9d9` | `#f3d9d9` |
| `--color-background-alerting-critical-lighter` | `#f9ebeb` | `#380000` |
| `--color-background-alerting-critical-strong` | `#910000` | `#af0000` |
| `--color-background-alerting-critical-stronger` | `#730000` | `#910000` |
| `--color-background-alerting-info-base` | `#005ece` | `#4c8edd` |
| `--color-background-alerting-info-light` | `#d9e7f8` | `#d9e7f8` |
| `--color-background-alerting-info-lighter` | `#ebf2fb` | `#001e42` |
| `--color-background-alerting-info-strong` | `#004eab` | `#005ece` |
| `--color-background-alerting-info-stronger` | `#003e88` | `#004eab` |
| `--color-background-alerting-major-base` | `#ed6400` | `#ed6400` |
| `--color-background-alerting-major-base-alt` | `#ed6400` | `#f2934c` |
| `--color-background-alerting-major-light` | `#fce8d9` | `#fce8d9` |
| `--color-background-alerting-major-lighter` | `#fef3eb` | `#4c2000` |
| `--color-background-alerting-major-strong` | `#ed6400` | `#c55300` |
| `--color-background-alerting-major-stronger` | `#9c4200` | `#9c4200` |
| `--color-background-alerting-minor-base` | `#ffc700` | `#ffc700` |
| `--color-background-alerting-minor-base-alt` | `#ffc700` | `#ffd84c` |
| `--color-background-alerting-minor-light` | `#fff7d9` | `#fff7d9` |
| `--color-background-alerting-minor-lighter` | `#fffbeb` | `#6d4028` |
| `--color-background-alerting-minor-strong` | `#e5a51a` | `#e5a51a` |
| `--color-background-alerting-minor-stronger` | `#c48429` | `#c48429` |
| `--color-background-alerting-success-base` | `#1b8500` | `#5faa4c` |
| `--color-background-alerting-success-light` | `#ddedd9` | `#ddedd9` |
| `--color-background-alerting-success-lighter` | `#edf5eb` | `#092b00` |
| `--color-background-alerting-success-strong` | `#166e00` | `#1b8500` |
| `--color-background-alerting-success-stronger` | `#125800` | `#166e00` |
| `--color-background-brand-base` | `#0672cb` | `#509cda` |
| `--color-background-brand-light-slate` | `#daeaf7` | `#34414c` |
| `--color-background-brand-lighter-slate` | `#ebf4fb` | `#1e262c` |
| `--color-background-brand-strong` | `#055fa9` | `#97c4e9` |
| `--color-background-brand-stronger` | `#044b86` | `#daeaf7` |
| `--color-background-controls-base` | `#0672cb` | `#0672cb` |
| `--color-background-controls-light` | `#daeaf7` | `#033864` |
| `--color-background-controls-lighter` | `#ebf4fb` | `#022541` |
| `--color-background-controls-strong` | `#055fa9` | `#055fa9` |
| `--color-background-controls-stronger` | `#044b86` | `#044b86` |
| `--color-background-gray-base` | `#757575` | `#9e9e9e` |
| `--color-background-gray-light` | `#eaeaea` | `#393939` |
| `--color-background-gray-lighter` | `#f4f4f4` | `#393939` |
| `--color-background-gray-neutral-base` | `#757575` | `#8898a5` |
| `--color-background-gray-neutral-light` | `#eaeaea` | `#34414c` |
| `--color-background-gray-neutral-light-alt` | `#eaeaea` | `#1e262c` |
| `--color-background-gray-neutral-lighter` | `#f4f4f4` | `#1e262c` |
| `--color-background-gray-neutral-strong` | `#4d4d4d` | `#566c7f` |
| `--color-background-gray-neutral-stronger` | `#252525` | `#b8c1c9` |
| `--color-background-gray-strong` | `#616161` | `#ffffff` |
| `--color-background-gray-stronger` | `#252525` | `#ffffff` |
| `--color-background-masthead-base` | `#0672cb` | `#1e262c` |
| `--color-background-masthead-strong` | `#055fa9` | `#34414c` |
| `--color-background-masthead-stronger` | `#044b86` | `#455666` |
| `--color-background-secondary-berry-base` | `#a10061` | `#bd4c90` |
| `--color-background-secondary-berry-light` | `#f1d9e7` | `#6a0040` |
| `--color-background-secondary-berry-lighter` | `#f7ebf2` | `#34001f` |
| `--color-background-secondary-berry-strong` | `#860051` | `#d894bd` |
| `--color-background-secondary-berry-stronger` | `#6a0040` | `#f1d9e7` |
| `--color-background-secondary-teal-base` | `#00819e` | `#4ca7bb` |
| `--color-background-secondary-teal-base-alt` | `#00819e` | `#00819e` |
| `--color-background-secondary-teal-light` | `#d9ecf0` | `#005568` |
| `--color-background-secondary-teal-lighter` | `#ebf5f7` | `#002933` |
| `--color-background-secondary-teal-strong` | `#006b83` | `#94cad6` |
| `--color-background-secondary-teal-stronger` | `#005568` | `#d9ecf0` |
| `--color-background-secondary-violet-base` | `#7c01b7` | `#a34dcd` |
| `--color-background-secondary-violet-base-strong` | `#7c01b7` | `#c894e1` |
| `--color-background-secondary-violet-light` | `#ebd9f4` | `#520179` |
| `--color-background-secondary-violet-lighter` | `#f5ebf9` | `#28003b` |
| `--color-background-secondary-violet-strong` | `#670198` | `#c894e1` |
| `--color-background-secondary-violet-stronger` | `#520179` | `#ebd9f4` |
| `--color-background-surface-black` | `#252525` | `#252525` |
| `--color-background-surface-component` | `#ffffff` | `#111619` |
| `--color-background-surface-component-light` | `#f4f4f4` | `#1e262c` |
| `--color-background-surface-overlay` | `rgba(37,37,37,0.65)` | `rgba(17,22,25,0.75)` |
| `--color-background-surface-primary` | `#f4f4f4` | `#111619` |
| `--color-background-surface-secondary` | `#ffffff` | `#1e262c` |
| `--color-background-surface-white` | `#ffffff` | `#ffffff` |
| `--color-border-alerting-critical-base` | `#af0000` | `#dd9494` |
| `--color-border-alerting-critical-base-transparent` | `#af0000` | `rgba(221,148,148,0.00)` |
| `--color-border-alerting-critical-base-white` | `#af0000` | `#ffffff` |
| `--color-border-alerting-critical-light` | `#dd9494` | `#c74c4c` |
| `--color-border-alerting-critical-lighter` | `#f3d9d9` | `#c74c4c` |
| `--color-border-alerting-critical-transparent-base` | `rgba(175,0,0,0.00)` | `#dd9494` |
| `--color-border-alerting-info-base` | `#005ece` | `#94bbea` |
| `--color-border-alerting-info-base-transparent` | `#005ece` | `rgba(148,187,234,0.00)` |
| `--color-border-alerting-info-base-white` | `#005ece` | `#ffffff` |
| `--color-border-alerting-info-light` | `#94bbea` | `#4c8edd` |
| `--color-border-alerting-info-transparent-base` | `rgba(0,94,206,0.00)` | `#94bbea` |
| `--color-border-alerting-major-base` | `#ed6400` | `#f7be94` |
| `--color-border-alerting-major-base-transparent` | `#ed6400` | `rgba(247,190,148,0.00)` |
| `--color-border-alerting-major-base-white` | `#ed6400` | `#ffffff` |
| `--color-border-alerting-major-light` | `#f7be94` | `#f2934c` |
| `--color-border-alerting-major-transparent-base` | `rgba(237,100,0,0.00)` | `#f7be94` |
| `--color-border-alerting-minor-base` | `#e5a51a` | `#ffc700` |
| `--color-border-alerting-minor-strong` | `#9c622e` | `#9c622e` |
| `--color-border-alerting-minor-strong-transparent` | `#9c622e` | `rgba(255,255,255,0.00)` |
| `--color-border-alerting-minor-strong-white` | `#9c622e` | `#ffffff` |
| `--color-border-alerting-minor-transparent-white` | `rgba(255,199,0,0.00)` | `#ffffff` |
| `--color-border-alerting-success-base` | `#1b8500` | `#9fcc94` |
| `--color-border-alerting-success-base-transparent` | `#1b8500` | `rgba(159,204,148,0.00)` |
| `--color-border-alerting-success-base-white` | `#1b8500` | `#ffffff` |
| `--color-border-alerting-success-light` | `#9fcc94` | `#5faa4c` |
| `--color-border-alerting-success-transparent-base` | `rgba(27,133,0,0.00)` | `#9fcc94` |
| `--color-border-brand-base` | `#0672cb` | `#509cda` |
| `--color-border-brand-base-neutral` | `#0672cb` | `#8898a5` |
| `--color-border-brand-light` | `#97c4e9` | `#509cda` |
| `--color-border-brand-strong` | `#055fa9` | `#97c4e9` |
| `--color-border-brand-transparent-brand` | `rgba(255,255,255,0.00)` | `#509cda` |
| `--color-border-gray-black` | `#252525` | `#252525` |
| `--color-border-gray-disabled` | `#757575` | `#9e9e9e` |
| `--color-border-gray-neutral-base` | `#757575` | `#8898a5` |
| `--color-border-gray-neutral-inverse` | `#ffffff` | `#1e262c` |
| `--color-border-gray-neutral-light` | `#c5c5c5` | `#34414c` |
| `--color-border-gray-neutral-light-base` | `#c5c5c5` | `#566c7f` |
| `--color-border-gray-neutral-lighter` | `#eaeaea` | `#1e262c` |
| `--color-border-gray-neutral-strong` | `#4d4d4d` | `#8898a5` |
| `--color-border-gray-neutral-stronger` | `#252525` | `#b8c1c9` |
| `--color-border-gray-neutral-transparent-base` | `rgba(255,255,255,0.00)` | `#8898a5` |
| `--color-border-gray-white` | `#ffffff` | `#ffffff` |
| `--color-border-secondary-berry-base` | `#a10061` | `#bd4c90` |
| `--color-border-secondary-berry-light` | `#bd4c90` | `#6a0040` |
| `--color-border-secondary-berry-lighter` | `#d894bd` | `#bd4c90` |
| `--color-border-secondary-berry-strong` | `#4f0030` | `#f1d9e7` |
| `--color-border-secondary-teal-base` | `#00819e` | `#4ca7bb` |
| `--color-border-secondary-teal-light` | `#4ca7bb` | `#005568` |
| `--color-border-secondary-teal-lighter` | `#94cad6` | `#4ca7bb` |
| `--color-border-secondary-teal-strong` | `#003f4d` | `#d9ecf0` |
| `--color-border-secondary-violet-base` | `#7c01b7` | `#a34dcd` |
| `--color-border-secondary-violet-base-strong` | `#7c01b7` | `#c894e1` |
| `--color-border-secondary-violet-light` | `#c894e1` | `#a34dcd` |
| `--color-border-secondary-violet-strong` | `#670198` | `#c894e1` |
| `--color-data-vis-categorial-category-1` | `#044b86` | `#97c4e9` |
| `--color-data-vis-categorial-category-2` | `#97c4e9` | `#055fa9` |
| `--color-data-vis-categorial-category-3` | `#a10061` | `#bd4c90` |
| `--color-data-vis-categorial-category-4` | `#00819e` | `#4ca7bb` |
| `--color-data-vis-categorial-category-5` | `#670198` | `#c894e1` |
| `--color-data-vis-categorial-category-6` | `#5faa4c` | `#1b8500` |
| `--color-data-vis-categorial-category-7` | `#c55300` | `#f7be94` |
| `--color-data-vis-categorial-category-8` | `#c894e1` | `#670198` |
| `--color-gradient-overflow-horizontal-end` | `rgba(244,244,244,0.00)` | `rgba(17,22,25,0.00)` |
| `--color-gradient-overflow-horizontal-inverse-end` | `rgba(255,255,255,0.00)` | `rgba(17,22,25,0.00)` |
| `--color-gradient-overflow-horizontal-inverse-start` | `#ffffff` | `#111619` |
| `--color-gradient-overflow-horizontal-middle` | `rgba(244,244,244,0.90)` | `rgba(17,22,25,0.90)` |
| `--color-gradient-overflow-horizontal-start` | `#f4f4f4` | `#111619` |
| `--color-gradient-overflow-vertical---scrollbar-end` | `rgba(255,255,255,0.00)` | `rgba(17,22,25,0.00)` |
| `--color-gradient-overflow-vertical---scrollbar-middle` | `rgba(182,182,182,0.30)` | `rgba(17,22,25,0.40)` |
| `--color-gradient-overflow-vertical---scrollbar-start` | `rgba(117,117,117,0.60)` | `#111619` |
| `--color-gradient-overflow-vertical-end` | `rgba(255,255,255,0.00)` | `rgba(17,22,25,0.40)` |
| `--color-gradient-overflow-vertical-start` | `rgba(182,182,182,0.40)` | `#111619` |
| `--color-icon-alerting-critical-base` | `#af0000` | `#c74c4c` |
| `--color-icon-alerting-critical-strong` | `#910000` | `#dd9494` |
| `--color-icon-alerting-info-base` | `#005ece` | `#4c8edd` |
| `--color-icon-alerting-info-base-alt` | `#005ece` | `#005ece` |
| `--color-icon-alerting-major-base` | `#ed6400` | `#ed6400` |
| `--color-icon-alerting-major-base-strong` | `#c55300` | `#f7be94` |
| `--color-icon-alerting-major-strong` | `#9c4200` | `#f2934c` |
| `--color-icon-alerting-minor-base` | `#ffc700` | `#ffc700` |
| `--color-icon-alerting-minor-strong` | `#c48429` | `#ffc700` |
| `--color-icon-alerting-minor-stronger` | `#6d4028` | `#ffc700` |
| `--color-icon-alerting-minor-stronger-alt` | `#6d4028` | `#6d4028` |
| `--color-icon-alerting-success-base` | `#1b8500` | `#5faa4c` |
| `--color-icon-alerting-success-base-alt` | `#1b8500` | `#1b8500` |
| `--color-icon-brand-base` | `#0672cb` | `#509cda` |
| `--color-icon-brand-strong` | `#055fa9` | `#97c4e9` |
| `--color-icon-brand-stronger` | `#044b86` | `#daeaf7` |
| `--color-icon-gray-black` | `#252525` | `#252525` |
| `--color-icon-gray-disabled` | `#757575` | `#9e9e9e` |
| `--color-icon-gray-inverse` | `#ffffff` | `#252525` |
| `--color-icon-gray-neutral-accessible` | `#757575` | `#8898a5` |
| `--color-icon-gray-neutral-base` | `#4d4d4d` | `#8898a5` |
| `--color-icon-gray-neutral-light` | `#616161` | `#b8c1c9` |
| `--color-icon-gray-neutral-strong` | `#252525` | `#b8c1c9` |
| `--color-icon-gray-white` | `#ffffff` | `#ffffff` |
| `--color-icon-secondary-berry-base` | `#a10061` | `#bd4c90` |
| `--color-icon-secondary-berry-strong` | `#6a0040` | `#d894bd` |
| `--color-icon-secondary-berry-stronger` | `#4f0030` | `#f1d9e7` |
| `--color-icon-secondary-teal-base` | `#00819e` | `#4ca7bb` |
| `--color-icon-secondary-teal-strong` | `#005568` | `#94cad6` |
| `--color-icon-secondary-teal-stronger` | `#003f4d` | `#d9ecf0` |
| `--color-icon-secondary-violet-base` | `#7c01b7` | `#a34dcd` |
| `--color-icon-secondary-violet-strong` | `#670198` | `#c894e1` |
| `--color-icon-secondary-violet-stronger` | `#3d005a` | `#ebd9f4` |
| `--color-static-brand-100` | `#ebf4fb` | `#ebf4fb` |
| `--color-static-brand-200` | `#daeaf7` | `#daeaf7` |
| `--color-static-brand-300` | `#97c4e9` | `#97c4e9` |
| `--color-static-brand-400` | `#509cda` | `#509cda` |
| `--color-static-brand-500` | `#0672cb` | `#0672cb` |
| `--color-static-brand-600` | `#055fa9` | `#055fa9` |
| `--color-static-brand-700` | `#044b86` | `#044b86` |
| `--color-static-brand-800` | `#033864` | `#033864` |
| `--color-static-brand-900` | `#022541` | `#022541` |
| `--color-static-gray-100` | `#f4f4f4` | `#f4f4f4` |
| `--color-static-gray-200` | `#eaeaea` | `#eaeaea` |
| `--color-static-gray-300` | `#c5c5c5` | `#c5c5c5` |
| `--color-static-gray-400` | `#9e9e9e` | `#9e9e9e` |
| `--color-static-gray-500` | `#757575` | `#757575` |
| `--color-static-gray-600` | `#616161` | `#616161` |
| `--color-static-gray-700` | `#4d4d4d` | `#4d4d4d` |
| `--color-static-gray-800` | `#393939` | `#393939` |
| `--color-static-gray-900` | `#252525` | `#252525` |
| `--color-static-gray-white` | `#ffffff` | `#ffffff` |
| `--color-text-alerting-critical-base` | `#af0000` | `#dd9494` |
| `--color-text-alerting-critical-strong` | `#910000` | `#dd9494` |
| `--color-text-alerting-info-base` | `#004eab` | `#94bbea` |
| `--color-text-alerting-info-strong` | `#002e65` | `#d9e7f8` |
| `--color-text-alerting-major-strong` | `#9c4200` | `#f2934c` |
| `--color-text-alerting-major-stronger` | `#743100` | `#fce8d9` |
| `--color-text-alerting-minor-strong` | `#6d4028` | `#ffc700` |
| `--color-text-alerting-minor-strong-alt` | `#6d4028` | `#6d4028` |
| `--color-text-alerting-success-base` | `#166e00` | `#9fcc94` |
| `--color-text-alerting-success-strong` | `#0d4100` | `#ddedd9` |
| `--color-text-brand-base` | `#0672cb` | `#509cda` |
| `--color-text-brand-strong` | `#055fa9` | `#97c4e9` |
| `--color-text-gray-black` | `#252525` | `#252525` |
| `--color-text-gray-disabled` | `#757575` | `#9e9e9e` |
| `--color-text-gray-inverse` | `#ffffff` | `#252525` |
| `--color-text-gray-neutral` | `#4d4d4d` | `#b8c1c9` |
| `--color-text-gray-neutral-strong` | `#252525` | `#e6e9ec` |
| `--color-text-gray-white` | `#ffffff` | `#ffffff` |
| `--color-text-link-brand-base` | `#055fa9` | `#509cda` |
| `--color-text-link-brand-light` | `#daeaf7` | `#daeaf7` |
| `--color-text-link-brand-lighter` | `#ebf4fb` | `#ebf4fb` |
| `--color-text-link-brand-strong` | `#044b86` | `#97c4e9` |
| `--color-text-link-brand-stronger` | `#033864` | `#daeaf7` |
| `--color-text-secondary-berry-base` | `#a10061` | `#bd4c90` |
| `--color-text-secondary-berry-strong` | `#6a0040` | `#d894bd` |
| `--color-text-secondary-berry-stronger` | `#34001f` | `#f1d9e7` |
| `--color-text-secondary-teal-base` | `#00819e` | `#4ca7bb` |
| `--color-text-secondary-teal-strong` | `#005568` | `#94cad6` |
| `--color-text-secondary-teal-stronger` | `#002933` | `#d9ecf0` |
| `--color-text-secondary-violet-base` | `#7c01b7` | `#a34dcd` |
| `--color-text-secondary-violet-strong` | `#520179` | `#c894e1` |
| `--color-text-secondary-violet-stronger` | `#28003b` | `#ebd9f4` |
| `--shadow-drop-shadow-16-color` | `rgba(37,37,37,0.08)` | `rgba(17,22,25,0.08)` |
| `--shadow-drop-shadow-2-color` | `rgba(37,37,37,0.08)` | `rgba(17,22,25,0.08)` |
| `--shadow-drop-shadow-32-color` | `rgba(37,37,37,0.08)` | `rgba(17,22,25,0.08)` |
| `--shadow-drop-shadow-4-color` | `rgba(37,37,37,0.08)` | `rgba(17,22,25,0.08)` |
| `--shadow-drop-shadow-8-color` | `rgba(37,37,37,0.08)` | `rgba(17,22,25,0.08)` |

<!-- ds:section id=tokens-float -->
### Tokens collection — FLOAT (Figma — `Tokens`, e.g. shadow geometry)

| Token | Value |
|---|---|

<!-- ds:section id=density-primitive -->
### Density Primitive (Figma — `Density Primitive`, FLOAT)

> Vertical padding tokens for table density modes. These are not `--scale-*` names; use as documented in component specs.

| Figma variable name | Value |
|---|---|

*Primitive FLOAT (non-color) in `Primitive` collection:*

| Figma variable name | Value |
|---|---|
| Opacity/0% | `0` |
| Opacity/10% | `10` |
| Opacity/100% | `100` |
| Opacity/20% | `20` |
| Opacity/30% | `30` |
| Opacity/40% | `40` |
| Opacity/50% | `50` |
| Opacity/60% | `60` |
| Opacity/70% | `70` |
| Opacity/80% | `80` |
| Opacity/90% | `90` |
| Scale/-1 | `-1` |
| Scale/0 | `0` |
| Scale/1 | `1` |
| Scale/10 | `10` |
| Scale/112 | `112` |
| Scale/12 | `12` |
| Scale/120 | `120` |
| Scale/128 | `128` |
| Scale/14 | `14` |
| Scale/144 | `144` |
| Scale/16 | `16` |
| Scale/18 | `18` |
| Scale/2 | `2` |
| Scale/20 | `20` |
| Scale/20 | `20` |
| Scale/22 | `22` |
| Scale/24 | `24` |
| Scale/256 | `256` |
| Scale/26 | `26` |
| Scale/28 | `28` |
| Scale/32 | `32` |
| Scale/34 | `34` |
| Scale/36 | `36` |
| Scale/4 | `4` |
| Scale/40 | `40` |
| Scale/44 | `44` |
| Scale/48 | `48` |
| Scale/512 | `512` |
| Scale/52 | `52` |
| Scale/56 | `56` |
| Scale/58 | `58` |
| Scale/6 | `6` |
| Scale/60 | `60` |
| Scale/64 | `64` |
| Scale/72 | `72` |
| Scale/8 | `8` |
| Scale/80 | `80` |
| Scale/88 | `88` |
| Scale/96 | `96` |
| UI Icon Spacing/icon-14 | `14` |
| UI Icon Spacing/icon-16 | `16` |
| UI Icon Spacing/icon-18 | `18` |
| UI Icon Spacing/icon-22 | `22` |
| UI Icon Spacing/icon-24 | `24` |
| UI Icon Spacing/icon-28 | `28` |
| UI Icon Spacing/icon-32 | `32` |
| UI Icon Spacing/icon-48 | `48` |

<!-- ds:section id=typography -->
## Typography Scale

- Primary family: **Roboto**
- Common text styles used across IDS nodes:
  - `Body 1`: 16 / 24
  - `Body 2`: 14 / 20
  - `Body 2 Medium`: 14 / 20, weight 500
  - `Body 3`: 12 / 18
  - `Header 6`: 18 / 25
  - `Header 5`: 24 / 32
  - `Header 4`: 28 / 34
  - `Display 1`: 72 / 88, light

<!-- ds:section id=spacing -->
## Spacing & Sizing

Use semantic scale tokens throughout generated output.

- Spacing examples used in IDS specs:
  - `--spacing-space-2`, `--spacing-space-4`, `--spacing-space-8`, `--spacing-space-12`, `--spacing-space-16`
- Padding examples used in IDS specs:
  - `--padding-padding-4`, `--padding-padding-8`, `--padding-padding-10`, `--padding-padding-16`
- Sizing examples used in IDS specs:
  - `--sizing-size-32`, `--sizing-size-40`

### Figma-derived layout tokens

> The previous `--scale-*` table was a generic placeholder. This file’s Figma **local variables** export uses **Density Primitive** FLOAT rows (above, under Density Primitive) and **Tokens** FLOAT rows for shadow geometry. For `--scale-*` / `--opacity-*` in CSS, regenerate `components/theme.css` from Figma or extend extraction to the **Density Token** collection if needed.

<!-- ds:section id=border -->
## Border Width

| Token | Value |
|---|---|
| `--border-width-border-1` | `1px` |
| `--border-width-border-2` | `2px` |

<!-- ds:section id=corner-radius -->
## Corner Radius

| Token | Value |
|---|---|
| `--corner-radius-radius-2` | `2px` |
| `--corner-radius-radius-4` | `4px` |
| `--corner-radius-radius-8` | `8px` |
| `--corner-radius-radius-12` | `12px` |

<!-- ds:section id=elevation -->
## Elevation System

| Level | Shadow Contract | Use Cases |
|---|---|---|
| 0 | none | flat controls, lists, layout containers |
| 1 | subtle drop shadow | cards, hover-raised surfaces |
| 2 | medium drop shadow | popovers, tooltips |
| 3 | strong drop shadow | overlay emphasis |
| 4 | multi-layer modal shadow | dialogs, modals, high-elevation overlays |

- IDS dialog-level references include layered drop shadows equivalent to Level 4.

<!-- ds:section id=opacity -->
## Opacity Scale

Use opacity tokens when a component requires translucent overlays or states. *(These rows are not part of the Figma local-variables sync block above; keep aligned with `components/theme.css` when that file is regenerated.)*

| Token | Value |
|---|---|
| `--opacity-0` | `0` |
| `--opacity-10` | `0.1` |
| `--opacity-20` | `0.2` |
| `--opacity-30` | `0.3` |
| `--opacity-40` | `0.4` |
| `--opacity-50` | `0.5` |
| `--opacity-60` | `0.6` |
| `--opacity-70` | `0.7` |
| `--opacity-80` | `0.8` |
| `--opacity-90` | `0.9` |
| `--opacity-100` | `1` |

<!-- ds:section id=breakpoints -->
## Responsive Breakpoints

From IDS config (`config/design_systems/ids.yaml`):

| Name | Min Width |
|---|---|
| sm | `576px` |
| md | `768px` |
| lg | `992px` |
| xl | `1200px` |

<!-- ds:section id=interactions-baseline -->
## Interaction Baseline

All IDS components inherit these baseline rules unless component specs override:

- Focus indicators must be visible and use brand focus token (`--color-border-brand-base`) with tokenized border widths.
- Keyboard support:
  - `Tab` for focus traversal
  - `Enter` / `Space` for activation where applicable
  - `Escape` for dismissible overlays
- Hover and press states must be token-driven and not required for core task completion.
- Disabled state must block interaction and use disabled token set for border/background/text/icon.

### Icon Resolution Baseline (Framework-Agnostic)

Use this contract for every IDS component spec and for any framework target that consumes IDS design tokens.

- When a component requires an icon, generators must **first** look for an existing framework or library `Icon` component in the target codebase.
- Generators must **inspect** that `Icon` component’s public API and bind the design-spec icon using the **real** shape or name input prop (for example `name`, `icon`, `shape`, or `glyph`) rather than assuming a fixed prop key.
- Icon lookup must prefer **canonical** icon names from the component `design-spec.md` first, then any **declared fallback** icon names in that same spec.
- Raw SVG or image fallback is allowed **only** when no compatible icon component or named icon asset is available in the target project.

**Asset path baseline (when specs reference files, not only names):** resolve icons from `assets/icons/<slug>.svg` unless the component spec documents a different stable slug-to-path mapping.

<!-- ds:section id=accessibility-baseline -->
## Accessibility Baseline

- WCAG AA contrast targets (4.5:1 normal text, 3:1 large text/non-text UI where applicable).
- All interactive controls are keyboard operable.
- Semantic HTML first; ARIA only when semantic primitives are insufficient.
- Visible focus state required for keyboard users.
- State changes must be perceivable to assistive technologies.

<!-- ds:section id=theming -->
## Theming Mechanism

- IDS tokens are semantic CSS custom properties resolved per theme mode.
- Component implementations must avoid hardcoded values when a semantic token exists.
- Global IDS token stylesheet:
  - `components/ids-theme.css` (sync: `python3 scripts/sync_ids_theme_from_figma.py`)
- When `components/ids-theme.css` is regenerated from Figma, this root-spec remains the normative semantic contract for generators.

### Scale tokens vs component layout aliases

| Layer | Responsibility | Example |
|---|---|---|
| **Scale tokens** | Figma/root-spec catalog of foundational layout values | `--corner-radius-radius-2`, `--padding-padding-16`, `--spacing-space-8` |
| **Component layout aliases** | Stable per-component names in `ids-theme.css`; programmes override the **same alias** in programme theme CSS | `--button-control-radius`, `--dropdown-control-radius`, `--dropdown-menu-radius`, `--card-control-radius`, `--modal-control-radius`, `--progress-bar-control-radius`, `--date-picker-control-radius`, `--time-picker-control-radius`, `--text-box-control-radius`, `--toast-control-radius`, `--tooltip-control-radius` |
| **IDS component spec** | References component aliases in Layout & Measurements and Codegen Contract | `border-radius: var(--button-control-radius)` |
| **Programme fork spec** | Programme deltas table: which aliases differ (resolved scale token in parentheses) | Synapse: `--button-control-radius` → `radius-4` |
| **Programme theme CSS** | Redefines alias values (`components/synapse-theme.css`, `components/dap-theme.css`) | `--button-control-radius: var(--corner-radius-radius-4)` |

Reference implementations: [`components/ids/button/design-spec.md`](button/design-spec.md), [`components/ids/card/design-spec.md`](card/design-spec.md), [`components/ids/date-picker/design-spec.md`](date-picker/design-spec.md), [`components/ids/time-picker/design-spec.md`](time-picker/design-spec.md).

<!-- ds:section id=variable-collections -->
## Variable Collections (Figma)

Canonical definitions live in **[IDS Variables Library](https://www.figma.com/design/r0Ex6TumqcR3HINamsfXCV/IDS-Variables-Library)** (`r0Ex6TumqcR3HINamsfXCV`). REST sync and component work use the IDS Design Library (`0bHk3XhrjFhowgFkz9yLr4`), which subscribes to the published library.

Collections:
- **Tokens** — semantic, theme-aware (Light / Dark). Maps primarily to `--color-*` semantic CSS variables used in component specs.
- **Primitive** — base palette values (static across themes). Maps to `--color-static-*`, `--alert-*`, `--ui-palette-*`, `--secondary-palette-*`, `--opacity-*`, and foundational scales.
- **Sizes** — layout/size FLOAT tokens (radius, spacing, typography sizes where defined).
- Typography and effect styles used in IDS component frames.

## Codegen Baseline Contract

- All `components/ids/<slug>/design-spec.md` files inherit this root contract.
- Component spec can override only component-specific anatomy, variant matrix, and interaction nuances.
- Generators must:
  - Preserve semantic token names from specs.
  - Keep Light/Dark state tables structurally parallel.
  - Use deterministic state naming (`default`, `hover`, `press`, `focus-visible`, `disabled`).
  - Emit validation errors for missing required tokens/props/accessibility labels.

## Source Mapping

| Source | Location |
|---|---|
| IDS component map | `data/component-figma-map.json` |
| IDS config | `config/design_systems/ids.yaml` |
| IDS component specs | `components/ids/<slug>/design-spec.md` |
| Figma variables → root-spec tables | `scripts/sync_ids_root_spec_from_figma.py` (requires `FIGMA_TOKEN`) |
| Figma variables → theme CSS | `scripts/sync_ids_theme_from_figma.py` (requires `FIGMA_TOKEN`) |

### Figma variable source (last live REST sync)

| Source | File key | URL |
|---|---|---|
| IDS Variables Library (canonical) | `r0Ex6TumqcR3HINamsfXCV` | [IDS Variables Library](https://www.figma.com/design/r0Ex6TumqcR3HINamsfXCV/IDS-Variables-Library) |
| IDS Design Library (REST export) | `0bHk3XhrjFhowgFkz9yLr4` | [IDS Design Library](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library) |

Variable tables and `components/ids-theme.css` are synced via `GET /v1/files/0bHk3XhrjFhowgFkz9yLr4/variables/local` because the Variables Library file is not REST-exportable with the current token.
<!-- auto:generated:end -->
