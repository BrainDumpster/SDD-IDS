/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/tree`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsTree as SynapseTree,
  IdsTreeItem as SynapseTreeItem,
  IdsTreeItemLabel as SynapseTreeItemLabel,
  type IdsTreeNode as SynapseTreeNode,
  type IdsTreeProps as SynapseTreeProps,
  type IdsTreeItemProps as SynapseTreeItemProps,
  type IdsTreeItemLabelProps as SynapseTreeItemLabelProps,
  type TreeItemClickDetail as SynapseTreeItemClickDetail,
} from "../../ids/tree";
