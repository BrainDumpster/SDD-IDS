/**
 * IDS Tree constants — design-spec + React `lib/react/ids/tree` parity.
 *
 * Live Figma (0bHk3XhrjFhowgFkz9yLr4, MCP 2026-11-13):
 *   Tree-Main 6 nodes `18571:102051`
 *   Tree-Element L1 default `18571:101904`, selected `18571:101909`
 *   L2 content x=36; L6-leaf content x=136
 */

/** Depth 0 = Figma level 1 (16px). Level-6 leaf uses 136px. */
export const ROW_PADDING_START_PX = [16, 36, 56, 76, 96, 116, 136] as const;

export const DEFAULT_ICON_SHAPE = "folder-closed" as const;
export const CHEVRON_ICON_SHAPE = "chev-down-thick" as const;

/** Spec / React reference: chevron + folder render at 12×12. */
export const TREE_ICON_SIZE_PX = 12 as const;

export const ROOT_PARENT_KEY = "__root__" as const;

/** Hierarchical tree node (Mode A — data-driven). */
export interface IdsTreeNode {
  id: string;
  label: string;
  children?: IdsTreeNode[];
  iconShape?: string;
  badgeCount?: number;
  showIcon?: boolean;
  showBadge?: boolean;
}

/** Emitted from root on label/icon activation (not chevron-only expand). */
export interface TreeItemClickDetail {
  id: string;
  label: string;
  depth: number;
  parentId?: string;
  hasChildren: boolean;
  selected: boolean;
  path: string[];
}

export type FlatRow = {
  node: IdsTreeNode;
  depth: number;
  parentId?: string;
  path: string[];
  isBranch: boolean;
  isExpanded: boolean;
  ariaLevel: number;
  ariaSetSize: number;
  ariaPosInSet: number;
};

export const TREE_RUNTIME_DEFAULTS = {
  showIcon: true,
  showBadge: true,
  ariaLabel: "Tree",
} as const;

export function rowPaddingStart(depth: number): number {
  const clamped = Math.min(
    Math.max(depth, 0),
    ROW_PADDING_START_PX.length - 1,
  );
  return ROW_PADDING_START_PX[clamped];
}

export type TreeIconBadgeOverrides = Pick<
  IdsTreeNode,
  "showIcon" | "showBadge" | "badgeCount"
>;

export function resolveShowIcon(
  node: TreeIconBadgeOverrides,
  treeDefault: boolean,
): boolean {
  return node.showIcon ?? treeDefault;
}

export function resolveShowBadge(
  node: TreeIconBadgeOverrides,
  treeDefault: boolean,
): boolean {
  if (node.showBadge === false) return false;
  if (node.showBadge === true) {
    return node.badgeCount != null && node.badgeCount > 0;
  }
  if (!treeDefault) return false;
  return node.badgeCount != null && node.badgeCount > 0;
}

export function flattenVisibleRows(
  nodes: IdsTreeNode[],
  expandedIds: Set<string>,
  depth = 0,
  parentId?: string,
  path: string[] = [],
): Omit<FlatRow, "ariaLevel" | "ariaSetSize" | "ariaPosInSet">[] {
  const out: Omit<FlatRow, "ariaLevel" | "ariaSetSize" | "ariaPosInSet">[] = [];
  for (const node of nodes) {
    const isBranch = Boolean(node.children?.length);
    const isExpanded = isBranch && expandedIds.has(node.id);
    out.push({ node, depth, parentId, path, isBranch, isExpanded });
    if (isExpanded && node.children) {
      out.push(
        ...flattenVisibleRows(node.children, expandedIds, depth + 1, node.id, [
          ...path,
          node.id,
        ]),
      );
    }
  }
  return out;
}

export function enrichRowsWithAria(
  rows: Omit<FlatRow, "ariaLevel" | "ariaSetSize" | "ariaPosInSet">[],
): FlatRow[] {
  const groups = new Map<string, typeof rows>();
  for (const row of rows) {
    const key = row.parentId ?? ROOT_PARENT_KEY;
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }
  return rows.map((row) => {
    const key = row.parentId ?? ROOT_PARENT_KEY;
    const siblings = groups.get(key) ?? [];
    const posInSet = siblings.findIndex((s) => s.node.id === row.node.id) + 1;
    return {
      ...row,
      ariaLevel: row.depth + 1,
      ariaSetSize: siblings.length,
      ariaPosInSet: posInSet,
    };
  });
}
