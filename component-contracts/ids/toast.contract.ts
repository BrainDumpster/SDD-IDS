/**
 * IDS Toast — framework-agnostic spec contract.
 * Source: `components/ids/toast/design-spec.md`
 */
export const IDS_TOAST_DESIGN_SPEC_PATH = "components/ids/toast/design-spec.md" as const;

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
  /** Angular-oriented; when present with href, prefer this (React hosts may map to router). */
  routerLink?: string | string[];
  target?: "_self" | "_blank" | "_parent" | "_top";
  onClick?: (event: MouseEvent) => void;
}

/** Viewport queue row — same shape as `lib/react/ids/toast` `IdsToastQueueItem`. */
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

export const TOAST_TYPE_SET = new Set<IdsToastType>(TOAST_TYPES);

export const TOAST_TYPE_ICON: Record<IdsToastType, string> = {
  info: "info-circ-solid",
  critical: "status-critical-square-solid",
  "major-warning": "status-error-diamond-solid",
  "minor-warning": "status-warn-tri-solid",
  success: "status-ok-circ-solid",
};

export const TOAST_TYPE_ICON_COLOR: Record<IdsToastType, string> = {
  info: "var(--color-icon-alerting-info-base)",
  critical: "var(--color-icon-alerting-critical-base)",
  "major-warning": "var(--color-icon-alerting-major-base)",
  "minor-warning": "var(--color-icon-alerting-minor-base)",
  success: "var(--color-icon-alerting-success-base)",
};

export const TOAST_TYPE_BORDER: Record<IdsToastType, string> = {
  info: "var(--color-border-alerting-info-base-white)",
  critical: "var(--color-border-alerting-critical-base-white)",
  "major-warning": "var(--color-border-alerting-major-base-white)",
  "minor-warning": "var(--color-border-alerting-minor-base)",
  success: "var(--color-border-alerting-success-base-white)",
};

export const TOAST_API_DEFAULTS = {
  type: "info" as IdsToastType,
  duration: 8000,
  closable: true,
  role: "status" as IdsToastRole,
  position: "top-right" as IdsToastPosition,
  maxVisible: 3,
  queueStrategy: "FIFO" as const,
} as const;

export const TOAST_SPEC_ACCURATE_MESSAGE =
  "This is a temporary and brief notification following a user action." as const;

export const TOAST_SPEC_ACCURATE_LINK_LABEL = "View Details" as const;

/** Spec Accurate Design: info · message · view details · closable. */
export const TOAST_SPEC_ACCURATE_DEFAULTS = {
  ...TOAST_API_DEFAULTS,
  message: TOAST_SPEC_ACCURATE_MESSAGE,
  link: {
    label: TOAST_SPEC_ACCURATE_LINK_LABEL,
  } as IdsToastLink,
} as const;
