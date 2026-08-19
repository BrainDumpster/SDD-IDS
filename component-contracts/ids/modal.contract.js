/**
 * IDS Modal — framework-agnostic spec contract.
 * Source: `components/ids/modal/design-spec.md`
 */
export const IDS_MODAL_DESIGN_SPEC_PATH = "components/ids/modal/design-spec.md";
/** Figma `11348:63064` size matrix (width × height reference). */
export const MODAL_SIZE_DIMENSIONS = {
    large: { width: 1600, height: 826 },
    medium: { width: 1280, height: 667 },
    small: { width: 960, height: 497 },
    "x-small": { width: 640, height: 328 },
};
export const MODAL_DIALOG_TYPE_ICON = {
    critical: "status-critical-square-solid",
    destructive: "status-critical-square-solid",
    warning: "status-warn-tri-solid",
    major: "status-error-diamond-solid",
    informational: "info-circ-solid",
};
/** Dialog types that render a two-button footer (tertiary + primary). */
export const MODAL_TWO_BUTTON_DIALOG_TYPES = [
    "warning",
    "major",
    "critical",
    "destructive",
];
export const MODAL_API_DEFAULTS = {
    scenario: "dialog",
    type: "non-alerting",
    size: "medium",
    closable: true,
    scrollBar: false,
    tabs: false,
    footerCheckbox: false,
    fullScreen: false,
    enablePrimaryAction: true,
    enableTertiaryAction: true,
};
export const MODAL_COMPOSITION_SLOT_ORDER = [
    "modalTitle",
    "modalBody",
    "modalFooter",
];
/** Top-level modal DOM/codegen order (mirrors design-spec Codegen Contract). */
export const MODAL_CODEGEN_ANATOMY = [
    "overlay",
    "surface",
    "modalRoot",
    "modalTitle",
    "modalBody",
    "modalFooter",
];
/**
 * All main-area UI must render inside `modalBody` / `bodyContentShell`.
 * Forbidden: projecting components on `surface` between header and footer.
 */
export const MODAL_BODY_CONTAINMENT_RULE = "All main-area components (Tabs, inputs, forms, panels, markup, etc.) must be descendants of modalBody / bodyContentShell — never direct children of surface or modalRoot.";
/**
 * Internal `modalBody` structure. `projectedContent` is the catch-all for any
 * main-area component; multi-page tabStrip/pagePanel are included when tabs=true.
 */
export const MODAL_BODY_CODEGEN_ANATOMY = [
    "description?",
    "bodyContentShell",
    "projectedContent*",
];
export const MODAL_FIGMA_BODY = "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.";
/** Spec Accurate Design: dialog · non-alerting · medium · closable · single primary action. */
export const MODAL_SPEC_ACCURATE_DEFAULTS = {
    ...MODAL_API_DEFAULTS,
    scenario: "dialog",
    type: "non-alerting",
    size: "large",
    title: "Non-Alerting",
    description: MODAL_FIGMA_BODY,
    primaryActionLabel: "Close",
    tertiaryActionLabel: undefined,
    enableTertiaryAction: false,
};
/** Demo pages for multi-page usage stories. */
export const MODAL_MULTI_PAGE_DEMO_PAGES = [
    { id: "details", label: "Details", content: "Page 1 content: overview details and context." },
    { id: "settings", label: "Settings", content: "Page 2 content: configurable settings and options." },
    { id: "review", label: "Review", content: "Page 3 content: final review before apply." },
    {
        id: "audit",
        label: "Audit Trail",
        content: "Optional hidden page content via overflow.",
    },
    {
        id: "integrations",
        label: "Integrations",
        content: "Optional hidden page content via overflow.",
    },
];
