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
export const ALERT_GLOBAL_SEVERITY_ICON = {
    critical: "status-critical-square",
    "warning-major": "status-error-diamond",
    "warning-minor": "status-warn-tri",
    informational: "info-circ",
};
export const ALERT_INLINE_SEVERITY_ICON = {
    informational: "info-circ-solid",
    success: "status-ok-circ-solid",
    "warning-minor": "status-warn-tri-solid",
    "warning-major": "status-error-diamond-solid",
    critical: "status-critical-square-solid",
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
