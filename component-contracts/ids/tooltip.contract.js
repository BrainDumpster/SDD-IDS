/**
 * IDS Tooltip — framework-agnostic spec contract.
 * Source: `components/ids/tooltip/design-spec.md`
 */
export const IDS_TOOLTIP_DESIGN_SPEC_PATH = "components/ids/tooltip/design-spec.md";
export const TOOLTIP_SIDES = ["top", "bottom", "left", "right"];
export const TOOLTIP_ARROW_ALIGNS = ["start", "center", "end"];
export const TOOLTIP_API_DEFAULTS = {
    side: "top",
    arrowAlign: "center",
    closable: false,
    triggerDisplay: "inline",
};
export const TOOLTIP_DEMO_BODY = "Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.";
/** Spec Accurate Design: top · start · standard hover tooltip with title + body slots. */
export const TOOLTIP_SPEC_ACCURATE_DEFAULTS = {
    ...TOOLTIP_API_DEFAULTS,
    arrowAlign: "start",
    title: "Tooltip Title",
    content: TOOLTIP_DEMO_BODY,
};
