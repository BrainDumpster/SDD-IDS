/** Developer usage + Docs tab copy for IDS Lit Main Menu Left. */

export const MAIN_MENU_LEFT_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-main-menu-left\` — left navigation rail from
\`components/ids/main-menu-left/design-spec.md\`.

**Composable Mode B (preferred):** nest \`ids-main-menu-left-item\` (Tree-style).
Nested items become secondary children of the parent primary row.

**Mode A:** \`.items\` (\`MainMenuLeftPrimaryItem[]\`) — when non-empty, slotted
Mode B is ignored.

Icons via Lit \`ids-icon\`; truncated labels use \`ids-tooltip\`.

Live Figma (file \`0bHk3XhrjFhowgFkz9yLr4\`): Expanded \`11099:56218\`,
Collapsed \`11099:56206\`, Primary \`11099:56244\`, PrimaryIcon \`11099:56230\`,
Secondary \`11099:56237\`.

## Composition

\`\`\`html
<ids-main-menu-left defaultselecteditemid="dashboard" .expanded=\${true}>
  <ids-main-menu-left-item id="dashboard" name="Dashboard" icon-name="home"></ids-main-menu-left-item>
  <ids-main-menu-left-item id="infra" name="Infrastructure" icon-name="network-share">
    <ids-main-menu-left-item id="a" name="Secondary A"></ids-main-menu-left-item>
    <ids-main-menu-left-item id="b" name="Secondary B"></ids-main-menu-left-item>
  </ids-main-menu-left-item>
</ids-main-menu-left>
\`\`\`

## Props (\`ids-main-menu-left\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`items\` | — (property) | \`MainMenuLeftPrimaryItem[]\` | \`[]\` |
| \`logo\` | — (property) | \`MainMenuLeftLogo?\` | — |
| \`expanded\` | \`expanded\` | \`boolean\` | \`true\` |
| \`defaultSelectedItemId\` | \`defaultselecteditemid\` | \`string?\` | — |
| \`forceStates\` | \`forcestates\` | \`boolean\` | \`false\` |
| \`ariaLabel\` | \`arialabel\` | \`string\` | \`"Main menu left"\` |
| \`onExpandedChange\` | — (property) | \`(expanded: boolean) => void\` | — |
| \`onNavigate\` | — (property) | \`(target: MainMenuLeftNavigationTarget) => void\` | — |
| \`onSelected\` | — (property) | \`(detail: MainMenuLeftSelectionDetail) => void\` | — |

## Events

| Event | Callback prop | Detail |
|-------|---------------|--------|
| \`ids-expanded-change\` / \`onExpandedChange\` | \`onExpandedChange\` | \`{ expanded: boolean }\` / \`boolean\` |
| \`ids-navigate\` / \`onNavigate\` | \`onNavigate\` | \`MainMenuLeftNavigationTarget\` |
| \`ids-selected\` / \`onSelected\` | \`onSelected\` | \`MainMenuLeftSelectionDetail\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const MAIN_MENU_LEFT_SOURCE_CODE = `<ids-main-menu-left
  defaultselecteditemid="dashboard"
  .expanded=\${true}
  .items=\${[...]}
  .onExpandedChange=\${(expanded) => console.log("onExpandedChange", expanded)}
  .onNavigate=\${(target) => console.log("onNavigate", target)}
  .onSelected=\${(detail) => console.log("onSelected", detail)}
></ids-main-menu-left>`;
