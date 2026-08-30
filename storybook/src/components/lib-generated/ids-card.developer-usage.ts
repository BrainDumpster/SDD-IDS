/** Developer usage + Docs tab copy for IDS Card (React). */

export const CARD_DOCS_DESCRIPTION = `
## Overview

Content container with title, optional overflow menu, and projected body content.

\`\`\`
IdsCard
  IdsCardSecondaryTitle
  IdsCardTextContent
  IdsCardKeyValueContent
  IdsCardHeaderOverflowMenu
\`\`\`

Import from \`@ids/react/card\`.

## Props

### \`IdsCardProps\`

| Prop | Type | Default |
|------|------|---------|
| \`title\` | \`string\` | — |
| \`secondaryTitle\` | \`ReactNode\` | — |
| \`headerMeta\` | \`ReactNode\` | — |
| \`header\` | \`ReactNode\` | — |
| \`additionalFilter\` | \`ReactNode\` | — |
| \`children\` | \`ReactNode\` | required |
| \`footer\` | \`ReactNode\` | — |
| \`actions\` | \`IdsCardAction[]\` | — |
| \`showButtons\` | \`boolean\` | — |
| \`menuOptions\` | \`IdsCardMenuOption[]\` | — |
| \`showOverflowMenu\` | \`boolean\` | — |
| \`showOverFlowMenu\` | \`boolean\` | — |
| \`showDivider\` | \`boolean\` | — |
| \`size\` | \`IdsCardSize\` | — |
| \`elevated\` | \`boolean\` | — |
| \`outlined\` | \`boolean\` | — |
| \`className\` | \`string\` | — |

### \`IdsCardHeaderOverflowMenuProps\`

| Prop | Type | Default |
|------|------|---------|
| \`options\` | \`IdsCardMenuOption[]\` | required |
| \`cardRef\` | \`RefObject<HTMLElement \\| null>\` | required |
| \`triggerAriaLabel\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOptionSelected\` | \`IdsCardProps\` | \`(value: string) => void\` |
| \`onOptionSelected\` | \`IdsCardHeaderOverflowMenuProps\` | \`(value: string) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsCard,
  IdsCardSecondaryTitle,
  IdsCardTextContent,
  IdsCardKeyValueContent,
  IdsCardHeaderOverflowMenu,
} from "@ids/react/card";
\`\`\`

### Usage

\`\`\`tsx
<IdsCard>
  {/* project children / slots per anatomy */}
</IdsCard>
\`\`\`
`.trim();

export const CARD_SOURCE_CODE = `import {
  IdsCard,
  IdsCardSecondaryTitle,
  IdsCardTextContent,
  IdsCardKeyValueContent,
  IdsCardHeaderOverflowMenu,
} from "@ids/react/card";

export function Example() {
  return (
    <IdsCard>
      {/* project children / slots */}
    </IdsCard>
  );
}`;
