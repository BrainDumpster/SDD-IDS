/**
 * Developer usage for IDS Lit Radio Button (design-spec / Angular API).
 */
export const RADIO_BUTTON_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-radio-button-group\` + \`ids-radio-button\` — composition API from
\`components/ids/radio-button/design-spec.md\` (Angular parity).

edf-core uses a different slotted \`ids-radio-wrapper\` form pattern; this port
follows the design-spec group + item API. Each item must be inside a group.

## Props (\`ids-radio-button-group\`)

| Prop | Type | Default |
|------|------|---------|
| \`name\` | \`string\` | required (shared radio name) |
| \`value\` | \`string\` | controlled when set |
| \`defaultValue\` | \`string\` | \`option1\` |
| \`disabled\` | \`boolean\` | cascade |
| \`orientation\` | \`vertical \\| horizontal\` | \`vertical\` |
| \`id\` | \`string\` | id prefix |

## Props (\`ids-radio-button\`)

| Prop | Type | Notes |
|------|------|-------|
| \`value\` / \`label\` | \`string\` | required |
| \`disabled\` / \`error\` | \`boolean\` | |
| \`helperText\` | \`string\` | |
| \`simulatedState\` | \`hover \\| focus-visible\` | docs only |

## Events

| Event | Detail |
|-------|--------|
| \`value-change\` | \`string\` (on group) |

## Theme

\`\`\`ts
import "@ids/lit/ids-theme.css";
import { applyIdsTheme } from "@ids/lit/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const RADIO_BUTTON_SOURCE_CODE = `<ids-radio-button-group name="ids-radio-default" defaultValue="option1">
  <ids-radio-button value="option1" label="Option 1"></ids-radio-button>
  <ids-radio-button value="option2" label="Option 2"></ids-radio-button>
  <ids-radio-button value="option3" label="Option 3"></ids-radio-button>
</ids-radio-button-group>`;
