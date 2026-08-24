/**
 * IDS Segmented Button — framework-agnostic spec contract.
 * Source: `components/ids/segmented-button/design-spec.md`
 */
export const IDS_SEGMENTED_BUTTON_DESIGN_SPEC_PATH =
  "components/ids/segmented-button/design-spec.md" as const;

export type SegmentedButtonType = "text" | "icon";

export type SegmentedButtonSimulatedState = "hover" | "press" | "focus-visible";

export const SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS = {
  type: "text" as SegmentedButtonType,
  selected: "option1",
  defaultSelected: "option1",
  disabled: false,
  ariaLabel: "Segmented options",
} as const;

export const SEGMENTED_BUTTON_TEXT_DEMO_ITEMS = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
] as const;

export const SEGMENTED_BUTTON_ICON_DEMO_ITEMS = [
  { value: "list", shape: "view-hamburger", ariaLabel: "List view" },
  { value: "tree", shape: "nav-tree", ariaLabel: "Tree view" },
  { value: "grid", shape: "view-sort-grid-solid", ariaLabel: "Grid view" },
] as const;

/** @deprecated Use composition (`ids-segmented-text` / `ids-segmented-icon` inside `ids-segmented-buttons`). */
export interface SegmentedButtonSegmentText {
  value: string;
  label: string;
  disabled?: boolean;
  simulatedState?: SegmentedButtonSimulatedState;
}

/** @deprecated Use composition (`ids-segmented-icon` inside `ids-segmented-buttons`). */
export interface SegmentedButtonSegmentIcon {
  value: string;
  shape: string;
  ariaLabel: string;
  disabled?: boolean;
  simulatedState?: SegmentedButtonSimulatedState;
}

export type SegmentedButtonChangeMeta =
  | { type: "text"; label: string }
  | { type: "icon"; ariaLabel: string };
