import type { ReactNode } from "react";

/** Embedded selection chrome inside the tree column (Figma `37721:114734` tree variants). */
export type IdsDataGridTreeRowSelection = "none" | "checkbox" | "radio";

export interface IdsDataGridTreeNode {
  id: string;
  /** Primary label in the tree column (Figma `.Cell Item` text). */
  label: string;
  /** Values for non-tree columns, keyed by `IdsDataGridColumn.key`. */
  values?: Record<string, ReactNode>;
  children?: IdsDataGridTreeNode[];
  /** Leading row icon slug when `treeShowRowIcon` is true (default `folder-closed`). */
  iconSlug?: string;
}

export interface FlatIdsDataGridTreeRow {
  id: string;
  label: string;
  values: Record<string, ReactNode>;
  level: number;
  hasChildren: boolean;
  iconSlug?: string;
}

export function flattenIdsDataGridTree(
  nodes: IdsDataGridTreeNode[],
  expandedIds: ReadonlySet<string>,
  level = 0,
): FlatIdsDataGridTreeRow[] {
  const rows: FlatIdsDataGridTreeRow[] = [];
  for (const node of nodes) {
    const hasChildren = Boolean(node.children?.length);
    rows.push({
      id: node.id,
      label: node.label,
      values: node.values ?? {},
      level,
      hasChildren,
      iconSlug: node.iconSlug,
    });
    if (hasChildren && expandedIds.has(node.id)) {
      rows.push(...flattenIdsDataGridTree(node.children!, expandedIds, level + 1));
    }
  }
  return rows;
}

export function collectIdsDataGridTreeNodeIds(nodes: IdsDataGridTreeNode[]): Set<string> {
  const ids = new Set<string>();
  const walk = (list: IdsDataGridTreeNode[]) => {
    for (const node of list) {
      ids.add(node.id);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(nodes);
  return ids;
}
