/**
 * IDS Segmented Button — framework-agnostic spec contract.
 * Source: `components/ids/segmented-button/design-spec.md`
 */
export const IDS_SEGMENTED_BUTTON_DESIGN_SPEC_PATH = "components/ids/segmented-button/design-spec.md";
export const SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS = {
    type: "text",
    selected: "option1",
    defaultSelected: "option1",
    disabled: false,
    ariaLabel: "Segmented options",
};
export const SEGMENTED_BUTTON_TEXT_DEMO_ITEMS = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
];
export const SEGMENTED_BUTTON_ICON_DEMO_ITEMS = [
    { value: "list", shape: "view-hamburger", ariaLabel: "List view" },
    { value: "tree", shape: "nav-tree", ariaLabel: "Tree view" },
    { value: "grid", shape: "view-sort-grid-solid", ariaLabel: "Grid view" },
];
