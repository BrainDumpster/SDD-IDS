/** Developer usage + Docs tab copy for IDS Tab (React). */

export const SYNAPSE_TAB_DOCS_DESCRIPTION = `
## Overview

Synapse Tab is an IDS-fork façade over \`lib/react/ids/tab\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/tab\`.

Tabbed navigation with tab buttons and corresponding content panels.

\`\`\`
SynapseTab
  SynapseTabs
  SynapseTabButton
  SynapseTabContent
\`\`\`

Import from \`@synapse/react/tab\`.

## Props

### \`SynapseTabItemInput\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`content\` | \`ReactNode\` | required |
| \`iconSlug\` | \`string\` | — |
| \`badgeCount\` | \`number\` | — |
| \`hasAlert\` | \`boolean\` | — |
| \`closable\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |

### \`SynapseTabsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`items\` | \`SynapseTabItemInput[]\` | — |
| \`type\` | \`SynapseTabsType \\| string\` | — |
| \`variant\` | \`SynapseTabsType \\| string\` | — |
| \`surface\` | \`SynapseTabsSurface \\| "white" \\| string\` | — |
| \`activeItemId\` | \`string\` | — |
| \`defaultActiveItemId\` | \`string\` | — |
| \`allowAddTab\` | \`boolean\` | — |
| \`addTabLabel\` | \`string\` | — |
| \`overflow\` | \`boolean\` | — |
| \`moreLabel\` | \`string\` | — |
| \`className\` | \`string\` | — |

### \`SynapseTabProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`disabled\` | \`boolean\` | — |
| \`closable\` | \`boolean\` | — |
| \`iconSlug\` | \`string\` | — |
| \`badgeCount\` | \`number\` | — |
| \`hasAlert\` | \`boolean\` | — |
| \`children\` | \`ReactNode\` | — |

### \`SynapseTabButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`SynapseTabContentProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onActiveItemChange\` | \`SynapseTabsProps\` | \`(id: string) => void\` |
| \`onTabSelect\` | \`SynapseTabsProps\` | \`(payload: { id: string; label: string }) => void\` |
| \`onAddTab\` | \`SynapseTabsProps\` | \`() => void\` |
| \`onOverflowSelection\` | \`SynapseTabsProps\` | \`(id: string) => void\` |
| \`onItemsChange\` | \`SynapseTabsProps\` | \`(items: SynapseTabItemInput[]) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseTab,
  SynapseTabs,
  SynapseTabButton,
  SynapseTabContent,
} from "@synapse/react/tab";
\`\`\`

### Usage

\`\`\`tsx
<SynapseTab>
  {/* project children / slots per anatomy */}
</SynapseTab>
\`\`\`
`.trim();

export const SYNAPSE_TAB_SOURCE_CODE = `import {
  SynapseTab,
  SynapseTabs,
  SynapseTabButton,
  SynapseTabContent,
} from "@synapse/react/tab";

export function Example() {
  return (
    <SynapseTab>
      {/* project children / slots */}
    </SynapseTab>
  );
}`;
