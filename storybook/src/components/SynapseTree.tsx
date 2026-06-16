import {
  IdsTree,
  IdsTreeItem,
  IdsTreeItemLabel,
  type IdsTreeNode,
  type IdsTreeProps,
  type TreeItemClickDetail,
} from "./IdsTree";

export type SynapseTreeProps = Omit<IdsTreeProps, "programme">;

/**
 * Synapse Tree — `IdsTree` with `programme="synapse"` (Figma `11067:54609`).
 * Selected rows use neutral-strong text and 2px radius; no brand fill or leading rail.
 */
export function SynapseTree(props: SynapseTreeProps) {
  return <IdsTree programme="synapse" {...props} />;
}

export {
  IdsTreeItem as SynapseTreeItem,
  IdsTreeItemLabel as SynapseTreeItemLabel,
  type IdsTreeNode as SynapseTreeNode,
  type TreeItemClickDetail as SynapseTreeItemClickDetail,
};
