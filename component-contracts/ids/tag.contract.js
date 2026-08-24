/**
 * IDS Tag — framework-agnostic spec contract.
 * Source: `components/ids/tag/design-spec.md`
 */
export const IDS_TAG_DESIGN_SPEC_PATH = "components/ids/tag/design-spec.md";
export const TAG_TYPES = ["read-only", "clickable", "editable", "badge"];
export const TAG_SIZES = ["small", "large"];
export const TAG_TONES = [
    "none",
    "informational",
    "success",
    "minor",
    "major",
    "critical",
];
export const TAG_SPEC_ACCURATE_DEFAULTS = {
    label: "Tag",
    type: "read-only",
    tone: "none",
    size: "small",
    selected: false,
    disabled: false,
    error: false,
    focusVisible: false,
    focusOnText: false,
    showLabel: false,
    labelPrefix: "Label",
    badgeValue: undefined,
    leadingIconSlug: null,
    closeIconSlug: "shape-x-thick",
};
/** Demo/testing only — forces hover chrome in Storybook state matrices. */
export const TAG_DEMO_HOVER_DEFAULT = false;
export const TAGS_GROUP_SPEC_ACCURATE_DEFAULTS = {
    wrap: true,
    ariaLabel: undefined,
};
