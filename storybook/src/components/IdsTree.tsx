import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { Icon } from "./Icon";
import styles from "./IdsTree.module.css";
import {
  IdsTreeItem,
  IdsTreeItemLabel,
  type IdsTreeItemProps,
} from "./IdsTreeItem";

/** Depth 0 = Figma level 1 (16px start padding). */
const ROW_PADDING_START_PX = [16, 36, 56, 76, 96, 116, 136] as const;

const DEFAULT_ICON_SHAPE = "folder-closed";
const ROOT_PARENT_KEY = "__root__";

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

/** Emitted from `IdsTree` root on label/icon activation (not chevron-only expand). */
export interface TreeItemClickDetail {
  id: string;
  label: string;
  depth: number;
  parentId?: string;
  hasChildren: boolean;
  selected: boolean;
  path: string[];
}

export interface IdsTreeProps {
  /** Mode A: hierarchical data. Mutually exclusive with compositional `children`. */
  items?: IdsTreeNode[];
  /** Mode B: nested `IdsTreeItem` / `IdsTreeItemLabel` (no `items`). */
  children?: ReactNode;
  selectedId?: string;
  defaultSelectedId?: string;
  defaultExpandedIds?: string[];
  showIcon?: boolean;
  showBadge?: boolean;
  onTreeItemClick?: (detail: TreeItemClickDetail) => void;
  /** @deprecated Prefer `onTreeItemClick`. */
  onSelect?: (id: string) => void;
  onExpandChange?: (id: string, expanded: boolean) => void;
}

type FlatRow = {
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

export function IdsTree({
  items: itemsProp,
  children,
  selectedId: selectedIdProp,
  defaultSelectedId,
  defaultExpandedIds = [],
  showIcon: treeShowIcon = true,
  showBadge: treeShowBadge = true,
  onTreeItemClick,
  onSelect,
  onExpandChange,
}: IdsTreeProps) {
  const items = useMemo(() => {
    if (itemsProp != null && itemsProp.length > 0) {
      return itemsProp;
    }
    return treeItemsFromChildren(children);
  }, [itemsProp, children]);

  const [selectedIdUncontrolled, setSelectedIdUncontrolled] = useState(
    defaultSelectedId ?? items[0]?.id ?? "",
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds),
  );
  const [focusedId, setFocusedId] = useState<string | null>(
    () => defaultSelectedId ?? items[0]?.id ?? null,
  );

  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const selectedId = selectedIdProp ?? selectedIdUncontrolled;

  const rows = useMemo(
    () => enrichRowsWithAria(flattenVisibleRows(items, expandedIds)),
    [items, expandedIds],
  );

  useEffect(() => {
    if (rows.length === 0) {
      setFocusedId(null);
      return;
    }
    if (!focusedId || !rows.some((r) => r.node.id === focusedId)) {
      const fallback =
        (defaultSelectedId && rows.find((r) => r.node.id === defaultSelectedId)?.node.id) ||
        rows[0]?.node.id ||
        null;
      setFocusedId(fallback);
    }
  }, [rows, focusedId, defaultSelectedId]);

  useEffect(() => {
    if (!focusedId) return;
    rowRefs.current.get(focusedId)?.focus();
  }, [focusedId, rows]);

  const toggleExpanded = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        const expanded = !next.has(id);
        if (expanded) next.add(id);
        else next.delete(id);
        onExpandChange?.(id, expanded);
        return next;
      });
    },
    [onExpandChange],
  );

  const emitClick = useCallback(
    (
      node: IdsTreeNode,
      depth: number,
      parentId: string | undefined,
      path: string[],
      isBranch: boolean,
    ) => {
      if (selectedIdProp === undefined) {
        setSelectedIdUncontrolled(node.id);
      }
      setFocusedId(node.id);
      const detail: TreeItemClickDetail = {
        id: node.id,
        label: node.label,
        depth,
        parentId,
        hasChildren: isBranch,
        selected: true,
        path: [...path, node.id],
      };
      onTreeItemClick?.(detail);
      onSelect?.(node.id);
    },
    [onSelect, onTreeItemClick, selectedIdProp],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      if (rows.length === 0) return;

      const index = rows.findIndex((r) => r.node.id === focusedId);
      const currentIndex = index >= 0 ? index : 0;
      const row = rows[currentIndex];

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          if (currentIndex < rows.length - 1) {
            setFocusedId(rows[currentIndex + 1].node.id);
          }
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          if (currentIndex > 0) {
            setFocusedId(rows[currentIndex - 1].node.id);
          }
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          if (row.isBranch && !row.isExpanded) {
            toggleExpanded(row.node.id);
          } else if (currentIndex < rows.length - 1) {
            setFocusedId(rows[currentIndex + 1].node.id);
          }
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          if (row.isBranch && row.isExpanded) {
            toggleExpanded(row.node.id);
          } else if (row.parentId) {
            setFocusedId(row.parentId);
          }
          break;
        }
        case "Enter":
        case " ": {
          event.preventDefault();
          emitClick(row.node, row.depth, row.parentId, row.path, row.isBranch);
          break;
        }
        default:
          break;
      }
    },
    [emitClick, focusedId, rows, toggleExpanded],
  );

  return (
    <ul
      className={styles.root}
      role="tree"
      aria-label="Tree"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={(e) => {
        if (e.target !== e.currentTarget || !focusedId) return;
        const first = rows[0]?.node.id;
        if (first) setFocusedId(first);
      }}
    >
      {rows.map((row) => (
        <TreeRow
          key={row.node.id}
          row={row}
          isSelected={selectedId === row.node.id}
          isFocused={focusedId === row.node.id}
          treeShowIcon={treeShowIcon}
          treeShowBadge={treeShowBadge}
          rowRef={(el) => {
            if (el) rowRefs.current.set(row.node.id, el);
            else rowRefs.current.delete(row.node.id);
          }}
          onActivate={() =>
            emitClick(row.node, row.depth, row.parentId, row.path, row.isBranch)
          }
          onToggleExpand={() => toggleExpanded(row.node.id)}
          onFocusRow={() => setFocusedId(row.node.id)}
        />
      ))}
    </ul>
  );
}

function flattenVisibleRows(
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

function enrichRowsWithAria(
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

function treeItemsFromChildren(children: ReactNode): IdsTreeNode[] {
  const nodes: IdsTreeNode[] = [];
  Children.forEach(children, (child) => {
    const parsed = parseTreeItemElement(child);
    if (parsed) nodes.push(parsed);
  });
  return nodes;
}

function parseTreeItemElement(child: ReactNode): IdsTreeNode | null {
  if (!isValidElement(child) || child.type !== IdsTreeItem) {
    return null;
  }
  const props = child.props as IdsTreeItemProps;
  if (!props.id) return null;

  const label =
    props.label?.trim() ||
    extractLabelFromTreeItemChildren(props.children) ||
    props.id;

  const nestedItems: IdsTreeNode[] = [];
  Children.forEach(props.children, (nested) => {
    const parsed = parseTreeItemElement(nested);
    if (parsed) nestedItems.push(parsed);
  });

  return {
    id: props.id,
    label,
    iconShape: props.iconShape,
    badgeCount: props.badgeCount,
    showIcon: props.showIcon,
    showBadge: props.showBadge,
    children: nestedItems.length > 0 ? nestedItems : undefined,
  };
}

function extractLabelFromTreeItemChildren(children: ReactNode): string {
  let text = "";
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== IdsTreeItemLabel) return;
    const labelChild = child as ReactElement<{ children?: ReactNode }>;
    text = flattenText(labelChild.props.children);
  });
  return text.trim();
}

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return flattenText(props.children);
  }
  return "";
}

function rowPaddingStart(depth: number): number {
  const clamped = Math.min(Math.max(depth, 0), ROW_PADDING_START_PX.length - 1);
  return ROW_PADDING_START_PX[clamped];
}

function resolveShowIcon(node: IdsTreeNode, treeDefault: boolean): boolean {
  return node.showIcon ?? treeDefault;
}

function resolveShowBadge(node: IdsTreeNode, treeDefault: boolean): boolean {
  if (node.showBadge === false) return false;
  if (node.showBadge === true) return node.badgeCount != null && node.badgeCount > 0;
  if (!treeDefault) return false;
  return node.badgeCount != null && node.badgeCount > 0;
}

function TreeRow({
  row,
  isSelected,
  isFocused,
  treeShowIcon,
  treeShowBadge,
  rowRef,
  onActivate,
  onToggleExpand,
  onFocusRow,
}: {
  row: FlatRow;
  isSelected: boolean;
  isFocused: boolean;
  treeShowIcon: boolean;
  treeShowBadge: boolean;
  rowRef: (el: HTMLLIElement | null) => void;
  onActivate: () => void;
  onToggleExpand: () => void;
  onFocusRow: () => void;
}) {
  const { node, depth, isBranch, isExpanded } = row;
  const paddingStart = rowPaddingStart(depth);
  const showIcon = resolveShowIcon(node, treeShowIcon);
  const showBadge = resolveShowBadge(node, treeShowBadge);
  const iconShape = node.iconShape ?? DEFAULT_ICON_SHAPE;

  return (
    <li
      ref={rowRef}
      className={[
        styles.row,
        isSelected ? styles.rowSelected : "",
        isFocused ? styles.rowFocused : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="treeitem"
      tabIndex={isFocused ? 0 : -1}
      aria-expanded={isBranch ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={row.ariaLevel}
      aria-setsize={row.ariaSetSize}
      aria-posinset={row.ariaPosInSet}
      style={{ paddingLeft: paddingStart }}
      onFocus={onFocusRow}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        onFocusRow();
        onActivate();
      }}
    >
      {isBranch ? (
        <button
          type="button"
          className={styles.chevronButton}
          aria-label={isExpanded ? "Collapse branch" : "Expand branch"}
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
        >
          <Icon
            shapeName="chev-down-thick"
            className={[styles.chevron, isExpanded ? styles.chevronExpanded : ""]
              .filter(Boolean)
              .join(" ")}
            style={{ width: 12, height: 12 }}
            color={isSelected ? "var(--color-icon-brand-base)" : "var(--color-icon-neutral)"}
          />
        </button>
      ) : (
        <span className={styles.chevronSpacer} aria-hidden />
      )}

      {showIcon ? (
        <button
          type="button"
          className={styles.chevronButton}
          aria-label={`Select ${node.label}`}
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            onFocusRow();
            onActivate();
          }}
        >
          <Icon
            shapeName={iconShape}
            className={styles.folderIcon}
            style={{ width: 12, height: 12 }}
            color={isSelected ? "var(--color-icon-brand-base)" : "var(--color-icon-neutral)"}
          />
        </button>
      ) : null}

      <div className={styles.labelCluster}>
        <button
          type="button"
          className={styles.labelButton}
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            onFocusRow();
            onActivate();
          }}
        >
          <span className={styles.label} title={node.label}>
            {node.label}
          </span>
        </button>
        {showBadge ? (
          <span className={styles.badge} aria-hidden>
            {node.badgeCount}
          </span>
        ) : null}
      </div>
    </li>
  );
}

export { IdsTreeItem, IdsTreeItemLabel };

/** @deprecated Use `IdsTree` for spec-driven work. */
export const Tree = IdsTree;
export type TreeNode = IdsTreeNode;
export type TreeProps = IdsTreeProps;
