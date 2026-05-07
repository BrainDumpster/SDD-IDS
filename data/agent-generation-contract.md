# Agent Generation Contract (Framework-Agnostic)

Use this contract when an external agent (or another repository) generates code from design specs.

## 1) Required Inputs

- `root_spec_path`: baseline root spec path
- `component_spec_path`: component design-spec path
- `theme_css_paths`: ordered list of theme files (baseline first, program overrides second)
- `component_name`: canonical component name
- `target_framework`: `react | angular | vue | lit | other`
- `style_mode`: `css-module | css-in-js | scss | base-ui-css | other`

## 2) Optional Inputs

- `program_name`: e.g. `dap`
- `program_root_delta_path`: program root-spec path when deltas are centralized
- `program_component_delta_path`: optional program component delta spec
- `asset_map_path`: optional icon/image slug map
- `validation_checklist_path`: optional per-component checklist source

## 3) Layer Precedence

Apply this precedence strictly:
1. program component delta
2. program root delta
3. IDS component baseline
4. IDS root baseline

Theme precedence:
1. IDS theme
2. program theme override

## 4) Runtime Contract Requirements

Generated component must include:
- deterministic anatomy/slot order
- full variant/state matrix
- token-only styling (`var(--...)`)
- interaction behavior and keyboard contract
- accessibility semantics and required aria inputs
- fallback/error behavior for invalid variants/sizes/missing assets

## 5) Validation Gates (must pass)

- No hardcoded visual values when token exists (colors, spacing, radius, typography)
- Light/Dark state tables are structurally parallel
- Required API props/events/defaults are implemented
- Unknown variant/size fallback behavior is implemented
- Missing asset behavior is implemented

## 6) Standard Agent Prompt Template

```text
Generate <target_framework> component code for <component_name>.

Source-of-truth layers (highest to lowest):
1) <program_component_delta_path if exists>
2) <program_root_delta_path if exists>
3) <component_spec_path>
4) <root_spec_path>

Theme resolution order:
1) <baseline_theme_css_path>
2) <program_theme_css_path if exists>

Requirements:
- Follow the exact anatomy and variant/state matrix from layered specs.
- Use semantic CSS variables only; do not hardcode visual values.
- Implement interaction and accessibility contracts.
- Apply fallback/error rules for unknown variants/sizes and missing assets.
- Return framework output in structured sections:
  === COMPONENT ===
  === CSS ===   (or framework-equivalent style block)
```

