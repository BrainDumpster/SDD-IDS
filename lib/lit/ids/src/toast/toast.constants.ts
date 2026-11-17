/**
 * Toast constants — from `components/ids/toast/design-spec.md`
 * and React `lib/react/ids/toast` API.
 */

export type IdsToastType =
  | "info"
  | "critical"
  | "major-warning"
  | "minor-warning"
  | "success";

export type IdsToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type IdsToastCloseReason = "close-click" | "timeout" | "programmatic";

export type IdsToastRole = "status" | "alert";

export interface IdsToastLink {
  label: string;
  href?: string;
  /** Angular-oriented; when present with href, prefer this. */
  routerLink?: string | string[];
  target?: "_self" | "_blank" | "_parent" | "_top";
  onClick?: (event: MouseEvent) => void;
}

export interface IdsToastQueueItem {
  id: string;
  type?: IdsToastType | string;
  message: string;
  duration?: number;
  closable?: boolean;
  link?: IdsToastLink;
  role?: IdsToastRole;
}

export const TOAST_TYPES = [
  "info",
  "critical",
  "major-warning",
  "minor-warning",
  "success",
] as const satisfies readonly IdsToastType[];

export const TOAST_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const satisfies readonly IdsToastPosition[];

const TOAST_TYPE_SET = new Set<IdsToastType>(TOAST_TYPES);
const TOAST_POSITION_SET = new Set<IdsToastPosition>(TOAST_POSITIONS);

export const TOAST_TYPE_ICON: Record<IdsToastType, string> = {
  info: "info-circ-solid",
  critical: "status-critical-square-solid",
  "major-warning": "status-error-diamond-solid",
  "minor-warning": "status-warn-tri-solid",
  success: "status-ok-circ-solid",
};

export const DEFAULT_DURATION = 8000;
export const DEFAULT_MAX_VISIBLE = 3;
export const DEFAULT_POSITION: IdsToastPosition = "top-right";
export const DEFAULT_TYPE: IdsToastType = "info";
export const DEFAULT_ROLE: IdsToastRole = "status";

/** Boolean default `true` — attribute presence → true; `"false"` → false; absent → true. */
export const defaultTrueBooleanConverter = {
  fromAttribute: (value: string | null): boolean =>
    value === null ? true : value !== "false",
  toAttribute: (value: boolean): string | null => (value ? "" : "false"),
};

export function resolveToastType(value: unknown): IdsToastType {
  if (typeof value === "string" && TOAST_TYPE_SET.has(value as IdsToastType)) {
    return value as IdsToastType;
  }
  return DEFAULT_TYPE;
}

export function resolveToastDuration(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    return DEFAULT_DURATION;
  }
  return value;
}

export function resolveToastPosition(value: unknown): IdsToastPosition {
  if (
    typeof value === "string" &&
    TOAST_POSITION_SET.has(value as IdsToastPosition)
  ) {
    return value as IdsToastPosition;
  }
  return DEFAULT_POSITION;
}

export function resolveToastMaxVisible(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 1) {
    return Math.floor(value);
  }
  return DEFAULT_MAX_VISIBLE;
}

export function resolveToastRole(value: unknown): IdsToastRole {
  return value === "alert" ? "alert" : DEFAULT_ROLE;
}

export function warnMissingToastIcon(shape: string): void {
  if (typeof console !== "undefined" && typeof console.warn === "function") {
    console.warn(`[IdsToast] Missing icon asset for shape "${shape}".`);
  }
}
