/**
 * Developer usage for IDS Lit Checkbox (design-spec + Angular/React API parity).
 */
export const CHECKBOX_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-checkbox\` / \`ids-checkbox-group\` — binary or partial selection from
\`components/ids/checkbox/design-spec.md\`. Preferred composition: projected
\`ids-checkbox\` children inside \`ids-checkbox-group\`.

**Labels** are projected light-DOM \`<label>\` children (not string props):

- Group form label → direct \`<label>\` child of \`ids-checkbox-group\`
- Option label → direct \`<label>\` child of \`ids-checkbox\`

## Props (\`ids-checkbox\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| — | child \`<label>\` | projected option label | required unless datagrid + \`ariaLabel\` |
| \`showLabel\` | \`showlabel\` | \`boolean\` | \`true\` |
| \`ariaLabel\` | \`arialabel\` | \`string\` | — |
| \`checked\` | \`checked\` | \`boolean\` | uncontrolled when omitted |
| \`defaultChecked\` | \`defaultchecked\` | \`boolean\` | \`false\` |
| \`partial\` | \`partial\` | \`boolean\` | \`false\` (ARIA \`mixed\`) |
| \`disabled\` | \`disabled\` | \`boolean\` | \`false\` |
| \`error\` | \`error\` | \`boolean\` | \`false\` |
| \`helperText\` | \`helpertext\` | \`string\` | — |
| \`name\` / \`value\` / \`id\` | same | \`string\` | — |
| \`density\` | \`density\` | \`default \\| datagrid\` | \`default\` |
| \`simulateFocusVisible\` | \`simulatefocusvisible\` | \`boolean\` | docs only |
| \`dataState\` | \`data-state\` | demo state | docs only |

## Props (\`ids-checkbox-group\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| — | child \`<label>\` | projected form label | required for visible group label |
| \`showLabel\` | \`showlabel\` | \`boolean\` | \`true\` |
| \`ariaLabel\` | \`arialabel\` | \`string\` | — |
| \`labelPosition\` | \`labelposition\` | \`left \\| top\` | \`left\` |
| \`required\` | \`required\` | \`boolean\` | \`false\` |
| \`labelIcon\` | \`labelicon\` | \`boolean\` | \`false\` |
| \`error\` / \`errorText\` | \`error\` / \`errortext\` | group validation | — |
| \`orientation\` | \`orientation\` | \`vertical \\| horizontal\` | \`vertical\` |
| \`disabled\` | \`disabled\` | cascades to children | \`false\` |
| \`name\` / \`idPrefix\` | \`name\` / \`idprefix\` | shared form ids | — |

## Events

| Event | Detail |
|-------|--------|
| \`checked-change\` | \`boolean\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const CHECKBOX_SOURCE_CODE = `<ids-checkbox-group labelposition="left">
  <label>Options:</label>
  <ids-checkbox>
    <label>Accept terms and conditions</label>
  </ids-checkbox>
</ids-checkbox-group>`;
