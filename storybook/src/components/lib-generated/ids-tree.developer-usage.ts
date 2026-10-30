/** Developer usage + Docs tab copy for IDS Tree (React). */

export const TREE_DOCS_DESCRIPTION = `
## Overview

Hierarchical expandable list of tree items.

\`\`\`
IdsTree
  IdsTreeItem
  IdsTreeItemLabel
\`\`\`

Import from \`@ids/react/tree\`.

## Props

### \`IdsTreeProps\`

| Prop | Type | Default |
|------|------|---------|
| \`items\` | \`IdsTreeNode[]\` | — |
| \`children\` | \`ReactNode\` | — |
| \`selectedId\` | \`string\` | — |
| \`defaultSelectedId\` | \`string\` | — |
| \`defaultExpandedIds\` | \`string[]\` | — |
| \`showIcon\` | \`boolean\` | — |
| \`showBadge\` | \`boolean\` | — |
| \`className\` | \`string\` | — |

### \`IdsTreeItemProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | — |
| \`iconShape\` | \`string\` | — |
| \`badgeCount\` | \`number\` | — |
| \`showIcon\` | \`boolean\` | — |
| \`showBadge\` | \`boolean\` | — |
| \`children\` | \`ReactNode\` | — |

### \`IdsTreeItemLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onTreeItemClick\` | \`IdsTreeProps\` | \`(detail: TreeItemClickDetail) => void\` |
| \`onSelect\` | \`IdsTreeProps\` | \`(id: string) => void\` |
| \`onExpandChange\` | \`IdsTreeProps\` | \`(id: string, expanded: boolean) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsTree,
  IdsTreeItem,
  IdsTreeItemLabel,
} from "@ids/react/tree";
\`\`\`

### Usage

\`\`\`tsx
<IdsTree>
  {/* project children / slots per anatomy */}
</IdsTree>
\`\`\`
`.trim();

export const TREE_SOURCE_CODE = `import {
  IdsTree,
  IdsTreeItem,
  IdsTreeItemLabel,
} from "@ids/react/tree";

export function Example() {
  return (
    <IdsTree>
      {/* project children / slots */}
    </IdsTree>
  );
}`;
