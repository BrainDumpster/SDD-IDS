export const IDS_STATUS_BAR_DESIGN_SPEC_PATH = "components/ids/status-bar/design-spec.md";

export const IDS_STATUS_BAR_FIGMA_NODES = {
  main: "15412:10699",
  elementsSmall: "15412:9261",
  elementsCategory: "15405:9692",
  overflowIcon: "18544:13477",
  overflowContainer: "18544:13502",
  variations: "43206:189639",
} as const;

export type IdsStatusBarType = "status-large" | "status-small" | "inventory";
export type IdsStatusBarItemState = "default" | "hover" | "press" | "selected" | "disabled";
export type IdsStatusBarSeverity =
  | "critical"
  | "warning"
  | "success"
  | "in-progress"
  | "scheduled"
  | "canceling"
  | "canceled"
  | "skipped"
  | "unknown";

/**
 * Inventory items only render a severity badge for these statuses in Figma
 * (Default/Complete/Not Applicable = no badge). Status-bar items still use the
 * full `IdsStatusBarSeverity` set; other severities on an inventory item are
 * ignored (no badge rendered).
 */
export type IdsInventoryStatus = Extract<IdsStatusBarSeverity, "critical" | "warning" | "in-progress">;

export const INVENTORY_BADGE_SEVERITIES: readonly IdsStatusBarSeverity[] = [
  "critical",
  "warning",
  "in-progress",
];

export interface IdsStatusBarItemContract {
  id: string;
  value: number | string;
  category?: string;
  label: string;
  severity?: IdsStatusBarSeverity;
  state?: IdsStatusBarItemState;
  iconShapeName?: string;
}
