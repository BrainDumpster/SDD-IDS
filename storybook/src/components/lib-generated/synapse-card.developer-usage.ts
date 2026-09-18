/** Developer usage + Docs tab copy for IDS Card (React). */

export const SYNAPSE_CARD_DOCS_DESCRIPTION = `
## Overview

Synapse Card is an IDS-fork façade over \`lib/react/ids/card\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/card\`.

Content container with title, optional overflow menu, and projected body content.

\`\`\`
SynapseCard
  SynapseCardSecondaryTitle
  SynapseCardTextContent
  SynapseCardKeyValueContent
  SynapseCardHeaderOverflowMenu
\`\`\`

Import from \`@synapse/react/card\`.

## Props

### \`SynapseCardProps\`

| Prop | Type | Default |
|------|------|---------|
| \`title\` | \`string\` | — |
| \`secondaryTitle\` | \`ReactNode\` | — |
| \`headerMeta\` | \`ReactNode\` | — |
| \`header\` | \`ReactNode\` | — |
| \`additionalFilter\` | \`ReactNode\` | — |
| \`children\` | \`ReactNode\` | required |
| \`footer\` | \`ReactNode\` | — |
| \`actions\` | \`SynapseCardAction[]\` | — |
| \`showButtons\` | \`boolean\` | — |
| \`menuOptions\` | \`SynapseCardMenuOption[]\` | — |
| \`showOverflowMenu\` | \`boolean\` | — |
| \`showOverFlowMenu\` | \`boolean\` | — |
| \`showDivider\` | \`boolean\` | — |
| \`size\` | \`SynapseCardSize\` | — |
| \`elevated\` | \`boolean\` | — |
| \`outlined\` | \`boolean\` | — |
| \`className\` | \`string\` | — |

### \`SynapseCardHeaderOverflowMenuProps\`

| Prop | Type | Default |
|------|------|---------|
| \`options\` | \`SynapseCardMenuOption[]\` | required |
| \`cardRef\` | \`RefObject<HTMLElement \\| null>\` | required |
| \`triggerAriaLabel\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOptionSelected\` | \`SynapseCardProps\` | \`(value: string) => void\` |
| \`onOptionSelected\` | \`SynapseCardHeaderOverflowMenuProps\` | \`(value: string) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseCard,
  SynapseCardSecondaryTitle,
  SynapseCardTextContent,
  SynapseCardKeyValueContent,
  SynapseCardHeaderOverflowMenu,
} from "@synapse/react/card";
\`\`\`

### Usage

\`\`\`tsx
<SynapseCard>
  {/* project children / slots per anatomy */}
</SynapseCard>
\`\`\`
`.trim();

export const SYNAPSE_CARD_SOURCE_CODE = `import {
  SynapseCard,
  SynapseCardSecondaryTitle,
  SynapseCardTextContent,
  SynapseCardKeyValueContent,
  SynapseCardHeaderOverflowMenu,
} from "@synapse/react/card";

export function Example() {
  return (
    <SynapseCard>
      {/* project children / slots */}
    </SynapseCard>
  );
}`;
