# PowerFlex — Root Spec

PowerFlex inherits the IDS design-system token model. Refer to `components/ids/root-spec.md` for the full primitive/semantic token tables, color system, and generation targets. The file you are reading documents PowerFlex-specific identity and the Text Box component tokens.

## Design System Identity

| Property | Value |
|---|---|
| Name | PowerFlex |
| Framework Layer | framework-agnostic |
| Figma Component Library Key | `82bDP05ESsiiGe38p5TEQJ` |
| Component map | `data/powerflex-component-figma-map.json` |
| Components directory | `components/powerflex/` |
| Theme CSS | `components/powerflex-theme.css` |
| Root spec | `components/powerflex/root-spec.md` |
| Inherited root spec | `components/ids/root-spec.md` |

## PowerFlex Text Box tokens

| Token | Light | Dark |
|---|---|---|
| `--text-box-control-radius` | `5px` | `5px` |
| `--text-box-focus-ring-radius` | `4px` | `4px` |
| `--text-box-background` | `#ffffff` | `#111619` |
| `--text-box-background-disabled` | `#f4f4f4` | `#1e262c` |
| `--text-box-border-default` | `#888888` | `#8898a5` |
| `--text-box-border-hover` | `#333333` | `#e6e9ec` |
| `--text-box-border-active` | `#0076ce` | `#509cda` |
| `--text-box-border-error` | `#af0000` | `#dd9494` |
| `--text-box-text` | `#333333` | `#e6e9ec` |
| `--text-box-text-disabled` | `#777777` | `#c5c5c5` |
| `--text-box-placeholder` | `#888888` | `#8898a5` |
| `--text-box-focus-ring` | `#0076ce` | `#509cda` |
| `--text-box-icon-error` | `#af0000` | `#c74c4c` |
| `--text-box-error-text` | `#af0000` | `#dd9494` |

## Notes

- The PowerFlex Text Box is a **standalone** component; it does not inherit the IDS `text-box` spec.
- The `themeAlias` for this component is `--text-box-control-radius` and `--text-box-focus-ring-radius`.
