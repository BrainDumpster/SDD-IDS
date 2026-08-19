/**
 * IDS Alert — framework-agnostic spec contract.
 * Source: `components/ids/alert/design-spec.md`
 */
export const IDS_ALERT_DESIGN_SPEC_PATH = "components/ids/alert/design-spec.md" as const;

export type AlertDisplay = "global" | "inline";

export type AlertGlobalSeverity =
  | "critical"
  | "warning-major"
  | "warning-minor"
  | "informational";

export type AlertInlineSeverity = AlertGlobalSeverity | "success";

export type AlertSeverity = AlertGlobalSeverity | AlertInlineSeverity;

export type AlertDensity = "compact" | "detailed";

export interface AlertCarouselInput {
  currentItem: number;
  totalItems: number;
}

export interface AlertLinkInput {
  label: string;
  href?: string;
  routerLink?: string | readonly unknown[];
}

export const ALERT_API_DEFAULTS = {
  display: "inline" as AlertDisplay,
  severity: "informational" as AlertInlineSeverity,
  density: "compact" as AlertDensity,
  dismissible: true,
} as const;

export const ALERT_SPEC_ACCURATE_MESSAGE =
  "This is informational inline alert text for context." as const;

/** Spec Accurate Design: inline · informational · compact · dismissible. */
export const ALERT_SPEC_ACCURATE_DEFAULTS = {
  ...ALERT_API_DEFAULTS,
  message: ALERT_SPEC_ACCURATE_MESSAGE,
} as const;

/** Shared `ids-icon` / `Icon` binding for leading status glyphs (design-spec States). */
export type AlertStatusIconBinding = {
  shape: string;
  variant: "img" | "mask" | "inline";
  color?: string;
};

export const ALERT_GLOBAL_STATUS_ICON: Record<AlertGlobalSeverity, AlertStatusIconBinding> = {
  critical: { shape: "status-critical-square-solid-ko", variant: "img" },
  "warning-major": {
    shape: "status-error-diamond-solid-ko",
    variant: "mask",
    color: "var(--color-icon-gray-white)",
  },
  "warning-minor": { shape: "status-warn-tri-solid", variant: "img" },
  informational: { shape: "info-circ-solid-ko", variant: "img" },
};

export const ALERT_INLINE_STATUS_ICON: Record<AlertInlineSeverity, AlertStatusIconBinding> = {
  informational: { shape: "info-circ-solid", variant: "img" },
  success: { shape: "status-ok-circ-solid", variant: "img" },
  "warning-minor": { shape: "status-warn-tri-solid", variant: "img" },
  "warning-major": { shape: "status-error-diamond-solid", variant: "img" },
  critical: { shape: "status-critical-square-solid", variant: "img" },
};

export const ALERT_GLOBAL_SEVERITY_ICON: Record<AlertGlobalSeverity, string> = {
  critical: ALERT_GLOBAL_STATUS_ICON.critical.shape,
  "warning-major": ALERT_GLOBAL_STATUS_ICON["warning-major"].shape,
  "warning-minor": ALERT_GLOBAL_STATUS_ICON["warning-minor"].shape,
  informational: ALERT_GLOBAL_STATUS_ICON.informational.shape,
};

export const ALERT_INLINE_SEVERITY_ICON: Record<AlertInlineSeverity, string> = {
  informational: ALERT_INLINE_STATUS_ICON.informational.shape,
  success: ALERT_INLINE_STATUS_ICON.success.shape,
  "warning-minor": ALERT_INLINE_STATUS_ICON["warning-minor"].shape,
  "warning-major": ALERT_INLINE_STATUS_ICON["warning-major"].shape,
  critical: ALERT_INLINE_STATUS_ICON.critical.shape,
};

/** Logical items for global multi-alert carousel demos (`AlertGroup` pattern). */
export interface AlertCarouselDemoItem {
  severity: AlertGlobalSeverity;
  message: string;
  linkLabel?: string;
  actionLabel?: string;
}

/** Sample set for Storybook global carousel — one `ids-alert` banner, swapped content. */
export const ALERT_CAROUSEL_DEMO_ITEMS: readonly AlertCarouselDemoItem[] = [
  {
    severity: "critical",
    message: "Critical outage: immediate action required in region us-east-1.",
    linkLabel: "View status page",
    actionLabel: "Retry",
  },
  {
    severity: "warning-major",
    message: "Major degradation detected for alerting service.",
    linkLabel: "Learn more",
  },
  {
    severity: "warning-minor",
    message: "Minor warning: configuration drift found in workspace sync.",
  },
  {
    severity: "informational",
    message: "Multiple active alerts are available. Review the alert center.",
    linkLabel: "Open alert center",
    actionLabel: "Acknowledge",
  },
  {
    severity: "informational",
    message: "Scheduled maintenance window starts at 02:00 UTC.",
    linkLabel: "Open schedule",
  },
] as const;
