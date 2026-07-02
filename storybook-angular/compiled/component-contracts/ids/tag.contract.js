/**
 * IDS Tag — framework-agnostic spec contract.
 * Source: `components/ids/tag/design-spec.md`
 */
export const IDS_TAG_DESIGN_SPEC_PATH = "components/ids/tag/design-spec.md";
export const TAG_TYPES = ["read-only", "clickable", "editable", "badge"];
export const TAG_SIZES = ["small", "large"];
export const TAG_TONES = [
    "non-alerting",
    "info",
    "success",
    "minor",
    "major",
    "critical",
];
export const TAG_VISUAL_STATES = [
    "default",
    "hover",
    "focus",
    "error",
    "disabled",
];
export const TAG_SPEC_ACCURATE_DEFAULTS = {
    label: "Tag",
    type: "read-only",
    tone: "non-alerting",
    size: "small",
    visualState: "default",
    selected: false,
    showLabel: false,
    labelPrefix: "Label",
    closable: false,
    badgeCount: undefined,
};
export const TAGS_GROUP_SPEC_ACCURATE_DEFAULTS = {
    wrap: true,
    ariaLabel: undefined,
};
