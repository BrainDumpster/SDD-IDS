/**
 * Developer usage for IDS Lit Accordion (edf-core API + design-spec visuals).
 */
export const ACCORDION_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-accordion\` — a root with one \`ids-accordion-panel\` per section. Each panel
holds an \`ids-accordion-title\` (header/trigger) and an \`ids-accordion-content\` (body).
Visuals come from \`components/ids/accordion/design-spec.md\`.

## Root props (\`ids-accordion\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`multiplePanelOpen\` / \`multiple\` | \`multiple\` | \`boolean\` | \`false\` |
| \`chevronPosition\` | \`chevron-position\` | \`left \\| right\` | \`left\` |
| \`defaultValue\` | — (property) | \`string[]\` | \`[]\` |
| \`width\` | — (property) | \`number \\| string\` | fluid \`100%\` (min \`240px\`) |
| \`maxWidth\` | — (property) | \`number \\| string\` | unset |
| \`panelMaxHeight\` | — (property) | \`number \\| string\` | unset (panel grows) |

Numbers are treated as px; strings are any CSS length.

## Panel props (\`ids-accordion-panel\`)

| Prop | Attribute | Notes |
|------|-----------|-------|
| \`value\` | \`value\` | stable id — required for \`defaultValue\` and \`value-change\` |
| \`active\` | \`active\` | open on render |
| \`accordionPanelDisabled\` | \`accordionpaneldisabled\` | non-interactive |

## Events

| Event | Detail | When |
|-------|--------|------|
| \`value-change\` | \`{ openValues: string[] }\` | a panel opens or closes |

## Keyboard

\`Enter\` / \`Space\` toggle the focused header · \`Home\` / \`End\` move focus to the first / last enabled header.

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const ACCORDION_SOURCE_CODE = `<ids-accordion>
  <ids-accordion-panel value="section1" active>
    <ids-accordion-title>Network configuration</ids-accordion-title>
    <ids-accordion-content>
      Configure network policies and service endpoints for this workspace.
    </ids-accordion-content>
  </ids-accordion-panel>
  <ids-accordion-panel value="section2">
    <ids-accordion-title>Security controls</ids-accordion-title>
    <ids-accordion-content>
      Manage access rules, authentication options, and audit controls.
    </ids-accordion-content>
  </ids-accordion-panel>
</ids-accordion>`;
