/**
 * Progress bar constants — design-spec + edf-core mapping.
 */
export type IdsProgressBarLayoutType = "inline" | "with-label" | "indeterminate";
export type IdsProgressBarThickness = "thin" | "medium" | "thick";
export type IdsProgressBarState =
  | "in-progress"
  | "completed-success"
  | "completed-warning"
  | "failed-error";

/** edf-core status `type` values */
export type EdfProgressBarStatusType =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type EdfProgressBarSize = "sm" | "md" | "lg";
export type EdfDisplayValuePosition = "top" | "right";

export const LAYOUT_TYPES = new Set<IdsProgressBarLayoutType>([
  "inline",
  "with-label",
  "indeterminate",
]);

export const THICKNESSES = new Set<IdsProgressBarThickness>([
  "thin",
  "medium",
  "thick",
]);

export const STATES = new Set<IdsProgressBarState>([
  "in-progress",
  "completed-success",
  "completed-warning",
  "failed-error",
]);

export const EDF_STATUS_TYPES = new Set<string>([
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
]);

export const HELPER_ICON_BY_STATE: Record<
  Exclude<IdsProgressBarState, "in-progress">,
  string
> = {
  "completed-success": "status-ok-circ-solid",
  "completed-warning": "status-warn-tri-solid",
  "failed-error": "status-critical-square-solid",
};

export const HELPER_ICON_COLOR_BY_STATE: Record<
  Exclude<IdsProgressBarState, "in-progress">,
  string
> = {
  "completed-success": "var(--color-icon-alerting-success-base)",
  "completed-warning": "var(--color-icon-alerting-minor-base)",
  "failed-error": "var(--color-icon-alerting-critical-base)",
};

export function clampProgressValue(value: number | undefined): number {
  const n = typeof value === "number" && !Number.isNaN(value) ? value : 0;
  return Math.min(100, Math.max(0, n));
}

export function mapEdfSizeToThickness(size: string | undefined): IdsProgressBarThickness {
  switch (size) {
    case "sm":
      return "thin";
    case "lg":
      return "thick";
    case "md":
    default:
      return "medium";
  }
}

export function mapEdfTypeToState(type: string | undefined): IdsProgressBarState {
  switch (type) {
    case "success":
      return "completed-success";
    case "warning":
      return "completed-warning";
    case "danger":
      return "failed-error";
    case "info":
    case "neutral":
    default:
      return "in-progress";
  }
}
