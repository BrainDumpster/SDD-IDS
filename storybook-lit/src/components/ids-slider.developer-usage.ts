/** Developer usage + Docs tab copy for IDS Lit Slider. */

export const SLIDER_DOCS_DESCRIPTION = `
## Overview

Numeric range input with single or dual thumbs.

Lit \`ids-slider\` from \`@ids/core/slider\` — API aligned with
\`@ids/react/slider\` / \`components/ids/slider/design-spec.md\`.

## Props

| Prop | Type | Default |
|------|------|---------|
| \`mode\` | \`single \\| range\` | \`single\` |
| \`min\` | \`number\` | \`0\` |
| \`max\` | \`number\` | \`100\` |
| \`step\` | \`number\` | \`1\` |
| \`value\` | \`number \\| [number, number]\` | — (controlled) |
| \`defaultValue\` | \`number \\| [number, number]\` | — |
| \`disabled\` | \`boolean\` | \`false\` |
| \`showStepper\` | \`boolean\` | \`false\` |
| \`showTicks\` | \`boolean\` | \`false\` (OR with showStepper) |
| \`stepperFrequency\` | \`number\` | falls back to \`step\` |
| \`showValueLabel\` | \`boolean\` | \`true\` |
| \`showValueInput\` | \`boolean\` | \`false\` |
| \`minLabel\` | \`string\` | — |
| \`maxLabel\` | \`string\` | — |

## Events

| Event | Detail |
|-------|--------|
| \`value-change\` | \`number \\| [number, number]\` (React \`onValueChange\`) |
| \`value-commit\` | \`number \\| [number, number]\` (React \`onValueCommit\`) |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const SLIDER_SOURCE_CODE = `import "@ids/core/slider/register.js";

<ids-slider
  mode="single"
  min="0"
  max="100"
  .defaultValue=\${50}
  minlabel="0"
  maxlabel="100"
  showvaluelabel
></ids-slider>`;
