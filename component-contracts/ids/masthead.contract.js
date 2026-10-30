/**
 * IDS Masthead — framework-agnostic spec contract.
 * Source: `components/ids/masthead/design-spec.md`
 */
export const IDS_MASTHEAD_DESIGN_SPEC_PATH = "components/ids/masthead/design-spec.md";
export const MASTHEAD_CODEGEN_ANATOMY = [
    "MastheadRoot",
    "MastheadBrandSlot",
    "MastheadActionsSlot",
];
/** Enforced left → right order within `MastheadActionsSlot`. */
export const MASTHEAD_ACTION_ICON_ORDER = [
    "search-16",
    "alert-bell-16",
    "jobs-queue-stack",
    "setting-gear-16",
    "help-circ-16",
    "grid-square-9-16",
    "avatar",
];
export const MASTHEAD_HELP_ICON_SLUG = "help-circ-16";
export const MASTHEAD_USER_ICON_SLUG = "user-single";
export const MASTHEAD_APP_LAUNCHER_ICON_SLUG = "grid-square-9-16";
export const MASTHEAD_PRODUCT_LOGO_SLUG = "appic-dp-cloud-blue";
export const MASTHEAD_SPEC_ACCURATE_DEFAULTS = {
    productName: "Synapse",
    avatarInitials: "DT",
    avatarAriaLabel: "User settings",
    helpAriaLabel: "Help",
};
