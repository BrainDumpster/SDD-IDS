/**
 * Developer usage for IDS Lit Segmented Button
 * (design-spec Composition API + Angular / Storybook example parity).
 */
export const SEGMENTED_BUTTON_DOCS_DESCRIPTION = `
## Overview

Lit compound segmented control from \`components/ids/segmented-button/design-spec.md\`.
Tags and selection API match Angular / design-spec Composition
(\`selected\` / \`defaultSelected\` / \`selected-change\`).
React lib aliases \`value\` / \`defaultValue\` are also accepted.

\`\`\`
ids-segmented-buttons
  ids-segmented-text[]   (type="text", 2–5)
  ids-segmented-icon[]   (type="icon", 2–3)
\`\`\`

## Props

### \`ids-segmented-buttons\`

| Prop | Type | Default |
|------|------|---------|
| \`type\` | \`"text" \\| "icon"\` | \`text\` |
| \`selected\` | \`string\` | — (controlled) |
| \`defaultSelected\` | \`string\` | \`option1\` |
| \`value\` | \`string\` | — (React alias of \`selected\`) |
| \`defaultValue\` | \`string\` | — (React alias of \`defaultSelected\`) |
| \`ariaLabel\` | \`string\` | \`Segmented options\` |
| \`ariaLabelledby\` | \`string\` | — |

### \`ids-segmented-text\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`selected\` | \`boolean\` | — (uncontrolled hint) |
| \`title\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | — |
| \`simulatedState\` | \`hover \\| press \\| focus-visible\` | — (QA only) |

### \`ids-segmented-icon\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string\` | required |
| \`shape\` | \`string\` | — (slug → \`ids-icon\`) |
| \`ariaLabel\` | \`string\` | required |
| \`selected\` | \`boolean\` | — |
| \`title\` | \`string\` | — |
| \`color\` | \`string\` | — |
| \`simulatedState\` | \`hover \\| press \\| focus-visible\` | — (QA only) |
| default slot | custom SVG / IconSlot | wins over \`shape\` |

## Events

| Event | Detail |
|-------|--------|
| \`selected-change\` | \`string\` (selected value) — Angular \`selectedChange\` |
| \`change\` | \`{ value: string; meta: { type: "text"; label } \\| { type: "icon"; ariaLabel } }\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`

## Import

\`\`\`ts
import "@ids/core/segmented-button/register.js";
\`\`\`
`.trim();

export const SEGMENTED_BUTTON_SOURCE_CODE = `<ids-segmented-buttons
  type="text"
  defaultSelected="option1"
  ariaLabel="Segmented options"
>
  <ids-segmented-text value="option1" label="Option 1"></ids-segmented-text>
  <ids-segmented-text value="option2" label="Option 2"></ids-segmented-text>
</ids-segmented-buttons>`;
