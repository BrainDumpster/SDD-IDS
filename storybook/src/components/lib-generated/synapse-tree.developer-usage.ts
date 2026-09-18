/** Developer usage + Docs tab copy for IDS Tree (React). */

export const SYNAPSE_TREE_DOCS_DESCRIPTION = `
## Overview

Synapse Tree is an IDS-fork façade over \`lib/react/ids/tree\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/tree\`.

Hierarchical expandable list of tree items.

\`\`\`
SynapseTree
  SynapseTreeItem
  SynapseTreeItemLabel
\`\`\`

Import from \`@synapse/react/tree\`.

## Props

### \`SynapseTreeProps\`

| Prop | Type | Default |
|------|------|---------|
| \`items\` | \`SynapseTreeNode[]\` | — |
| \`children\` | \`ReactNode\` | — |
| \`selectedId\` | \`string\` | — |
| \`defaultSelectedId\` | \`string\` | — |
| \`defaultExpandedIds\` | \`string[]\` | — |
| \`showIcon\` | \`boolean\` | — |
| \`showBadge\` | \`boolean\` | — |
| \`className\` | \`string\` | — |

### \`SynapseTreeItemProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | — |
| \`iconShape\` | \`string\` | — |
| \`badgeCount\` | \`number\` | — |
| \`showIcon\` | \`boolean\` | — |
| \`showBadge\` | \`boolean\` | — |
| \`children\` | \`ReactNode\` | — |

### \`SynapseTreeItemLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onTreeItemClick\` | \`SynapseTreeProps\` | \`(detail: TreeItemClickDetail) => void\` |
| \`onSelect\` | \`SynapseTreeProps\` | \`(id: string) => void\` |
| \`onExpandChange\` | \`SynapseTreeProps\` | \`(id: string, expanded: boolean) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseTree,
  SynapseTreeItem,
  SynapseTreeItemLabel,
} from "@synapse/react/tree";
\`\`\`

### Usage

\`\`\`tsx
<SynapseTree>
  {/* project children / slots per anatomy */}
</SynapseTree>
\`\`\`
`.trim();

export const SYNAPSE_TREE_SOURCE_CODE = `import {
  SynapseTree,
  SynapseTreeItem,
  SynapseTreeItemLabel,
} from "@synapse/react/tree";

export function Example() {
  return (
    <SynapseTree>
      {/* project children / slots */}
    </SynapseTree>
  );
}`;
