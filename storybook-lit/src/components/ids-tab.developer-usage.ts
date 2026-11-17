/**
 * Developer usage for IDS Lit Tab (design-spec + React API parity).
 */
export const TAB_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-tabs\` — horizontal tabs with optional overflow \`More\`, add-tab, icons,
badges, and closable items. Visuals from \`components/ids/tab/design-spec.md\`.
API aligned with \`@ids/react/tab\` (\`IdsTabs\` / \`IdsTab\` / \`IdsTabButton\` /
\`IdsTabContent\`).

\`\`\`
ids-tabs
  ids-tab (repeatable)
    ids-tab-button
    ids-tab-content
\`\`\`

Or pass an \`.items\` array (convenience API).

## Root props (\`ids-tabs\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`items\` | — (property) | \`IdsTabItemInput[]\` | — |
| \`type\` | \`type\` | \`primary \\| secondary\` | \`secondary\` |
| \`variant\` | \`variant\` | alias of \`type\` (\`type\` wins) | — |
| \`surface\` | \`surface\` | \`elevated \\| transparent\` | \`elevated\` |
| \`activeItemId\` | \`activeitemid\` | \`string\` | controlled |
| \`defaultActiveItemId\` | \`defaultactiveitemid\` | \`string\` | first enabled |
| \`allowAddTab\` | \`allowaddtab\` | \`boolean\` | \`false\` |
| \`addTabLabel\` | \`addtablabel\` | \`string\` | \`Add Tab\` |
| \`overflow\` | \`overflow\` | \`boolean\` | \`true\` |
| \`moreLabel\` | \`morelabel\` | \`string\` | \`More\` |

## Item props (\`ids-tab\`)

| Prop | Attribute | Type |
|------|-----------|------|
| \`id\` | \`id\` | \`string\` (required) |
| \`disabled\` | \`disabled\` | \`boolean\` |
| \`closable\` | \`closable\` | \`boolean\` |
| \`iconSlug\` | \`iconslug\` | \`string\` |
| \`badgeCount\` | \`badgecount\` | \`number\` |
| \`hasAlert\` | \`hasalert\` | \`boolean\` |

## Events

| Event | Detail | When |
|-------|--------|------|
| \`active-item-change\` | \`string\` (id) | active tab changes |
| \`tab-select\` | \`{ id, label }\` | user selects a tab |
| \`add-tab\` | — | add-tab control clicked |
| \`overflow-selection\` | \`string\` (id) | item chosen from More menu |
| \`items-change\` | \`IdsTabItemInput[]\` | close removes a tab |

## Keyboard

\`ArrowLeft\` / \`ArrowRight\` move among visible tabs · \`Home\` / \`End\` jump ·
\`Enter\` / \`Space\` activate.

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const TAB_SOURCE_CODE = `<ids-tabs type="secondary" defaultactiveitemid="overview">
  <ids-tab id="overview">
    <ids-tab-button>Overview</ids-tab-button>
    <ids-tab-content>Overview tab content area.</ids-tab-content>
  </ids-tab>
  <ids-tab id="security" iconslug="shield-encrypt-alt">
    <ids-tab-button>Security</ids-tab-button>
    <ids-tab-content>Security tab content area.</ids-tab-content>
  </ids-tab>
  <ids-tab id="alerts">
    <ids-tab-button>Alerts</ids-tab-button>
    <ids-tab-content>Alerts tab content area with related data.</ids-tab-content>
  </ids-tab>
</ids-tabs>`;
