export const IDS_STATUS_BAR_DESIGN_SPEC_PATH = "components/ids/status-bar/design-spec.md";

export const IDS_STATUS_BAR_FIGMA_NODES = {
  main: "15412:10699",
  elementsSeverityLarge: "15405:10610",
  elementsSeveritySmall: "15412:9261",
  elementsInventory: "15405:9692",
  elementsSeveritySelected: "15405:10991",
  elementsInventorySelected: "15405:9923",
  elementsSeverityDisabled: "15405:11115",
  overflowIcon: "18544:13477",
  overflowContainer: "18544:13502",
  severityWithTotal: "18545:12347",
  severityNoTotal: "18545:12349",
  severityOverflowBeginning: "18545:12351",
  severityOverflowMiddle: "18545:12350",
  severityOverflowEnd: "18545:12352",
  severityStates: "18545:12348",
  inventoryWithIcons: "18545:12343",
  inventoryNoIcons: "18545:12344",
  inventoryOverflowBeginning: "18545:12341",
  inventoryOverflowMiddle: "18545:12340",
  inventoryOverflowEnd: "18545:12342",
  inventoryStatus: "18545:12345",
  inventoryStates: "18545:12346",
} as const;

/** @deprecated Use IdsStatusBarBarType */
export type IdsStatusBarType = "status-large" | "status-small" | "inventory";

export type IdsStatusBarBarType = "severity-health-large" | "severity-health-small" | "inventory";

export type IdsStatusBarItemState = "default" | "hover" | "press" | "selected" | "disabled";

/** `none` — display only; `single` — radio-like one selection; `multiple` — checkbox-like toggle. */
export type IdsStatusBarSelectionMode = "none" | "single" | "multiple";

export type IdsStatusBarOverflowScenario = "auto" | "beginning" | "middle" | "end";

export type IdsStatusBarSeverity =
  | "critical"
  | "warning"
  | "success"
  | "informational"
  | "in-progress"
  | "scheduled"
  | "canceling"
  | "canceled"
  | "skipped"
  | "unknown";

export type IdsStatusBarInventoryStatus = "critical" | "warning" | "in-progress" | "default";

export interface IdsStatusBarTotalData {
  value: number | string;
  label?: string;
  category?: string;
}

interface IdsStatusBarItemBase {
  id: string;
  value: number | string;
  label: string;
  state?: IdsStatusBarItemState;
  selected?: boolean;
  disabled?: boolean;
}

export interface IdsStatusBarSeverityItemData extends IdsStatusBarItemBase {
  kind: "severity";
  severity: IdsStatusBarSeverity;
  category?: string;
}

export interface IdsStatusBarInventoryItemData extends IdsStatusBarItemBase {
  kind: "inventory";
  status?: IdsStatusBarInventoryStatus;
  iconShapeName?: string;
}

export type IdsStatusBarItemData = IdsStatusBarSeverityItemData | IdsStatusBarInventoryItemData;

export interface IdsStatusBarSelectionChangeDetail {
  /** Selected item ids after the interaction. */
  selectedIds: string[];
  /** Full item payloads for `selectedIds` (stable order follows `items`). */
  selectedItems: IdsStatusBarItemData[];
  /** Item that was clicked or activated. */
  changedItem: IdsStatusBarItemData;
  /** Whether `changedItem` is selected after the interaction. */
  selected: boolean;
}

/** @deprecated Use IdsStatusBarItemData with kind discriminator */
export interface IdsStatusBarItemContract {
  id: string;
  value: number | string;
  category?: string;
  label: string;
  severity?: IdsStatusBarSeverity;
  state?: IdsStatusBarItemState;
  iconShapeName?: string;
}

export function toLegacyStatusBarType(barType: IdsStatusBarBarType): IdsStatusBarType {
  if (barType === "severity-health-small") return "status-small";
  if (barType === "inventory") return "inventory";
  return "status-large";
}

export function fromLegacyStatusBarType(type: IdsStatusBarType): IdsStatusBarBarType {
  if (type === "status-small") return "severity-health-small";
  if (type === "inventory") return "inventory";
  return "severity-health-large";
}
