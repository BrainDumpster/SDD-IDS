/**
 * Developer usage for IDS Lit Checkbox (design-spec / Angular API).
 */
export const CHECKBOX_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-checkbox\` + \`ids-checkbox-group\` — composition API from
\`components/ids/checkbox/design-spec.md\` (Angular / React parity).

edf-core uses a different slotted \`ids-checkbox-wrapper\` form pattern; this
port follows the design-spec group + item API.

## Props (\`ids-checkbox\`)

| Prop | Type | Default |
|------|------|---------|
| \`label\` | \`string\` | required for a11y |
| \`checked\` | \`boolean\` | uncontrolled when omitted |
| \`defaultChecked\` | \`boolean\` | \`false\` |
| \`indeterminate\` | \`boolean\` | \`false\` (Figma: Partial) |
| \`disabled\` | \`boolean\` | \`false\` |
| \`error\` | \`boolean\` | \`false\` |
| \`helperText\` | \`string\` | — |
| \`showLabel\` | \`boolean\` | \`true\` |
| \`density\` | \`default \\| datagrid\` | \`default\` |
| \`simulateFocusVisible\` | \`boolean\` | docs only |

## Props (\`ids-checkbox-group\`)

| Prop | Type | Default |
|------|------|---------|
| \`orientation\` | \`vertical \\| horizontal\` | \`vertical\` |
| \`disabled\` | \`boolean\` | cascade to items |
| \`name\` / \`idPrefix\` | \`string\` | shared form ids |

## Events

| Event | Detail |
|-------|--------|
| \`checked-change\` | \`boolean\` |

## Theme

\`\`\`ts
import "@ids/lit/ids-theme.css";
import { applyIdsTheme } from "@ids/lit/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const CHECKBOX_SOURCE_CODE = `<ids-checkbox-group>
  <ids-checkbox label="Accept terms and conditions"></ids-checkbox>
</ids-checkbox-group>`;
