/**
 * IDS Alert — framework-agnostic spec contract.
 * Source: `components/ids/alert/design-spec.md`
 */
export const IDS_ALERT_DESIGN_SPEC_PATH = "components/ids/alert/design-spec.md";
export const ALERT_API_DEFAULTS = {
    display: "inline",
    severity: "informational",
    density: "compact",
    dismissible: true,
};
export const ALERT_SPEC_ACCURATE_MESSAGE = "This is informational inline alert text for context.";
/** Spec Accurate Design: inline · informational · compact · dismissible. */
export const ALERT_SPEC_ACCURATE_DEFAULTS = {
    ...ALERT_API_DEFAULTS,
    message: ALERT_SPEC_ACCURATE_MESSAGE,
};
export const ALERT_GLOBAL_STATUS_ICON = {
    critical: { shape: "status-critical-square-solid-ko", variant: "img" },
    "warning-major": {
        shape: "status-error-diamond-solid-ko",
        variant: "mask",
        color: "var(--color-icon-gray-white)",
    },
    "warning-minor": { shape: "status-warn-tri-solid", variant: "img" },
    informational: { shape: "info-circ-solid-ko", variant: "img" },
};
export const ALERT_INLINE_STATUS_ICON = {
    informational: { shape: "info-circ-solid", variant: "img" },
    success: { shape: "status-ok-circ-solid", variant: "img" },
    "warning-minor": { shape: "status-warn-tri-solid", variant: "img" },
    "warning-major": { shape: "status-error-diamond-solid", variant: "img" },
    critical: { shape: "status-critical-square-solid", variant: "img" },
};
export const ALERT_GLOBAL_SEVERITY_ICON = {
    critical: ALERT_GLOBAL_STATUS_ICON.critical.shape,
    "warning-major": ALERT_GLOBAL_STATUS_ICON["warning-major"].shape,
    "warning-minor": ALERT_GLOBAL_STATUS_ICON["warning-minor"].shape,
    informational: ALERT_GLOBAL_STATUS_ICON.informational.shape,
};
export const ALERT_INLINE_SEVERITY_ICON = {
    informational: ALERT_INLINE_STATUS_ICON.informational.shape,
    success: ALERT_INLINE_STATUS_ICON.success.shape,
    "warning-minor": ALERT_INLINE_STATUS_ICON["warning-minor"].shape,
    "warning-major": ALERT_INLINE_STATUS_ICON["warning-major"].shape,
    critical: ALERT_INLINE_STATUS_ICON.critical.shape,
};
/** Sample set for Storybook global carousel — one `ids-alert` banner, swapped content. */
export const ALERT_CAROUSEL_DEMO_ITEMS = [
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
];
