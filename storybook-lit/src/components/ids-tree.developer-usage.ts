/** Developer usage + Docs tab copy for IDS Lit Tree. */

export const TREE_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-tree\` — hierarchical navigation from
\`components/ids/tree/design-spec.md\`.

**Composable Mode B (preferred):** nest \`ids-tree-item\` / \`ids-tree-item-label\`.
Each item renders its own row and projects nested items into a \`role="group"\`.

**Mode A:** \`.items\` (\`IdsTreeNode[]\`) — root synthesizes the same nested
item composition (including deep children).

API aligned with React \`lib/react/ids/tree\`. Icons via Lit \`ids-icon\`.
Optional count badge via Lit \`ids-badge\` (omitted when \`badgeCount\` is absent/\`0\`
or \`showBadge\` is false).

Live Figma (file \`0bHk3XhrjFhowgFkz9yLr4\`): Tree-Main \`18571:102051\`,
Tree-Element L1 default \`18571:101904\`, selected \`18571:101909\`.

## Composition

\`\`\`html
<ids-tree default-selected-id="t1" .defaultExpandedIds=\${["t1", "t1-1"]}>
  <ids-tree-item id="t1" icon-shape="folder-closed" badge-count="1">
    <ids-tree-item-label>Tree1</ids-tree-item-label>
    <ids-tree-item id="t1-1" badge-count="2">
      <ids-tree-item-label>Tree 1.1</ids-tree-item-label>
      <ids-tree-item id="t1-1-1">
        <ids-tree-item-label>Tree 1.1.1</ids-tree-item-label>
      </ids-tree-item>
    </ids-tree-item>
  </ids-tree-item>
  <ids-tree-item id="t2">
    <ids-tree-item-label>Tree2</ids-tree-item-label>
  </ids-tree-item>
</ids-tree>
\`\`\`

## Props (\`ids-tree\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`items\` | — (property) | \`IdsTreeNode[]\` | \`[]\` |
| \`selectedId\` | \`selected-id\` | \`string?\` | — |
| \`defaultSelectedId\` | \`default-selected-id\` | \`string?\` | — |
| \`defaultExpandedIds\` | — (property) | \`string[]\` | \`[]\` |
| \`showIcon\` | \`show-icon\` | \`boolean\` | \`true\` |
| \`showBadge\` | \`show-badge\` | \`boolean\` | \`true\` |
| \`ariaLabel\` | \`aria-label\` | \`string\` | \`"Tree"\` |
| \`onTreeItemClick\` | — (property) | \`(detail: TreeItemClickDetail) => void\` | — |
| \`onExpandChange\` | — (property) | \`(id: string, expanded: boolean) => void\` | — |
| \`onSelect\` | — (property) | \`(id: string) => void\` | — (deprecated) |

## Props (\`ids-tree-item\`)

| Prop | Attribute | Type |
|------|-----------|------|
| \`id\` | \`id\` | \`string\` (required) |
| \`label\` | \`label\` | \`string?\` (or \`ids-tree-item-label\` child) |
| \`iconShape\` | \`icon-shape\` | \`string?\` |
| \`badgeCount\` | \`badge-count\` | \`number?\` |
| \`showIcon\` | \`show-icon\` | \`boolean?\` |
| \`showBadge\` | \`show-badge\` | \`boolean?\` |

## Events

| Event | Callback prop | Detail |
|-------|---------------|--------|
| \`tree-item-click\` | \`onTreeItemClick\` | \`TreeItemClickDetail\` |
| \`expand-change\` | \`onExpandChange\` | \`{ id: string, expanded: boolean }\` |
| \`select\` | \`onSelect\` | \`string\` (deprecated) |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const TREE_SOURCE_CODE = `<ids-tree
  default-selected-id="t1"
  .defaultExpandedIds=\${["t1"]}
  .onTreeItemClick=\${(detail) => console.log("onTreeItemClick", detail)}
>
  <ids-tree-item id="t1" icon-shape="folder-closed" badge-count="1">
    <ids-tree-item-label>Tree1</ids-tree-item-label>
    <ids-tree-item id="t1-1" badge-count="2">
      <ids-tree-item-label>Tree 1.1</ids-tree-item-label>
      <ids-tree-item id="t1-1-1">
        <ids-tree-item-label>Tree 1.1.1</ids-tree-item-label>
      </ids-tree-item>
    </ids-tree-item>
  </ids-tree-item>
  <ids-tree-item id="t2">
    <ids-tree-item-label>Tree2</ids-tree-item-label>
  </ids-tree-item>
</ids-tree>`;
