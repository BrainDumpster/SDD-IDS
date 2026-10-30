import type { ReactNode } from "react";

export type IdsDatagridTreeRowSelection = "none" | "checkbox" | "radio";

export interface IdsDatagridTreeNode {
  id: string;
  label: string;
  values?: Record<string, ReactNode>;
  children?: IdsDatagridTreeNode[];
  iconSlug?: string;
}

export interface FlatIdsDatagridTreeRow {
  id: string;
  label: string;
  values: Record<string, ReactNode>;
  level: number;
  hasChildren: boolean;
  iconSlug?: string;
}

export function flattenIdsDatagridTree(
  nodes: IdsDatagridTreeNode[],
  expandedIds: ReadonlySet<string>,
  level = 0,
): FlatIdsDatagridTreeRow[] {
  const rows: FlatIdsDatagridTreeRow[] = [];
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
      rows.push(...flattenIdsDatagridTree(node.children!, expandedIds, level + 1));
    }
  }
  return rows;
}

export function collectIdsDatagridTreeNodeIds(nodes: IdsDatagridTreeNode[]): Set<string> {
  const ids = new Set<string>();
  const walk = (list: IdsDatagridTreeNode[]) => {
    for (const node of list) {
      ids.add(node.id);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(nodes);
  return ids;
}
