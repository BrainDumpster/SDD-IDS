/** Developer usage + Docs tab copy for IDS Tab (React). */

export const TAB_DOCS_DESCRIPTION = `
## Overview

Tabbed navigation with tab buttons and corresponding content panels.

\`\`\`
IdsTab
  IdsTabs
  IdsTabButton
  IdsTabContent
\`\`\`

Import from \`@ids/react/tab\`.

## Props

### \`IdsTabItemInput\`

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

### \`IdsTabsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`items\` | \`IdsTabItemInput[]\` | — |
| \`type\` | \`IdsTabsType \\| string\` | — |
| \`variant\` | \`IdsTabsType \\| string\` | — |
| \`surface\` | \`IdsTabsSurface \\| "white" \\| string\` | — |
| \`activeItemId\` | \`string\` | — |
| \`defaultActiveItemId\` | \`string\` | — |
| \`allowAddTab\` | \`boolean\` | — |
| \`addTabLabel\` | \`string\` | — |
| \`overflow\` | \`boolean\` | — |
| \`moreLabel\` | \`string\` | — |
| \`className\` | \`string\` | — |

### \`IdsTabProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`disabled\` | \`boolean\` | — |
| \`closable\` | \`boolean\` | — |
| \`iconSlug\` | \`string\` | — |
| \`badgeCount\` | \`number\` | — |
| \`hasAlert\` | \`boolean\` | — |
| \`children\` | \`ReactNode\` | — |

### \`IdsTabButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`IdsTabContentProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onActiveItemChange\` | \`IdsTabsProps\` | \`(id: string) => void\` |
| \`onTabSelect\` | \`IdsTabsProps\` | \`(payload: { id: string; label: string }) => void\` |
| \`onAddTab\` | \`IdsTabsProps\` | \`() => void\` |
| \`onOverflowSelection\` | \`IdsTabsProps\` | \`(id: string) => void\` |
| \`onItemsChange\` | \`IdsTabsProps\` | \`(items: IdsTabItemInput[]) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsTab,
  IdsTabs,
  IdsTabButton,
  IdsTabContent,
} from "@ids/react/tab";
\`\`\`

### Usage

\`\`\`tsx
<IdsTab>
  {/* project children / slots per anatomy */}
</IdsTab>
\`\`\`
`.trim();

export const TAB_SOURCE_CODE = `import {
  IdsTab,
  IdsTabs,
  IdsTabButton,
  IdsTabContent,
} from "@ids/react/tab";

export function Example() {
  return (
    <IdsTab>
      {/* project children / slots */}
    </IdsTab>
  );
}`;
