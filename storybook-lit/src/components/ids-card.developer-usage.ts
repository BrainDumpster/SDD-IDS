/**
 * Developer usage for IDS Lit Card (design-spec + React/Angular API parity).
 */
export const CARD_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-card\` — surface container with header, body, and optional footer from
\`components/ids/card/design-spec.md\`. API aligned with \`@ids/react/card\` and
Angular \`ids-card\`.

\`\`\`
ids-card
  ids-card-secondary-title   (slot="secondary-title")
  ids-card-text-content      (default slot / body)
  ids-card-key-value-content (default slot / body)
\`\`\`

## Props

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`title\` | \`card-title\` | \`string\` | — |
| \`secondaryTitle\` | \`secondarytitle\` | \`string\` | — |
| \`headerMeta\` | \`headermeta\` | \`string\` | — |
| \`showButtons\` | \`showbuttons\` | \`boolean\` | \`false\` |
| \`showOverflowMenu\` | \`showoverflowmenu\` | \`boolean\` | \`false\` |
| \`showDivider\` | \`showdivider\` | \`boolean\` | \`true\` (property bind for \`false\`) |
| \`size\` | \`size\` | \`span-1 \\| span-2 \\| span-3\` | \`span-1\` |
| \`menuOptions\` | — (property) | \`IdsCardMenuOption[]\` | \`[]\` |
| \`actions\` | — (property) | \`IdsCardAction[]\` | \`[]\` |

## Slots

| Slot | Purpose |
|------|---------|
| (default) | CardBody content |
| \`header\` | Full custom header replace |
| \`secondary-title\` | Projected secondary title |
| \`header-meta\` | Rich meta before kebab |
| \`additional-filter\` | CardAdditionalFilter |
| \`footer\` | Custom footer when \`actions\` unset |

## Events

| Event | Detail |
|-------|--------|
| \`option-selected\` | \`{ value: string }\` |
| \`action-click\` | \`{ action: IdsCardAction }\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`

Border cascade uses \`var(--card-border-color, var(--color-border-gray-neutral-base))\`.
`.trim();

export const CARD_SOURCE_CODE = `<ids-card
  card-title="Card Title"
  showoverflowmenu
  showbuttons
  .menuOptions=\${[...]}
  .actions=\${[...]}
  .showDivider=\${true}
>
  <ids-card-text-content sectiontitle="Section Title">
    Body copy…
  </ids-card-text-content>
</ids-card>`;
