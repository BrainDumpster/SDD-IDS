import type { ReactNode } from "react";

/** Marker props for declarative `<IdsTreeItem>` children of `IdsTree` (Mode B). */
export interface IdsTreeItemProps {
  /** Stable row id (required). */
  id: string;
  /** Visible label; omit when using `IdsTreeItemLabel` child. */
  label?: string;
  /** IDS icon slug (`assets/icons/<slug>.svg`). */
  iconShape?: string;
  /** Numeric badge; omit slot when undefined or 0. */
  badgeCount?: number;
  /** Per-row icon override. */
  showIcon?: boolean;
  /** Per-row badge override. */
  showBadge?: boolean;
  /** Nested `IdsTreeItem` and/or `IdsTreeItemLabel`. */
  children?: ReactNode;
}

/**
 * Declarative tree row (Mode B). Does not render standalone — `IdsTree` walks children.
 *
 * @example
 * <IdsTree>
 *   <IdsTreeItem id="t1" iconShape="folder-closed" badgeCount={1}>
 *     <IdsTreeItemLabel>Tree1</IdsTreeItemLabel>
 *     <IdsTreeItem id="t1-1"><IdsTreeItemLabel>Tree 1.1</IdsTreeItemLabel></IdsTreeItem>
 *   </IdsTreeItem>
 * </IdsTree>
 */
export function IdsTreeItem(_props: IdsTreeItemProps) {
  return null;
}

/** Label slot for declarative `IdsTreeItem` (maps to `tree-item-label`). */
export function IdsTreeItemLabel(_props: { children?: ReactNode }) {
  return null;
}

IdsTreeItem.displayName = "IdsTreeItem";
IdsTreeItemLabel.displayName = "IdsTreeItemLabel";
