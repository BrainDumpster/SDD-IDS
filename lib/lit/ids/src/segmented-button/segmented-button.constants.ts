/**
 * IDS Segmented Button constants — from design-spec + component-contracts.
 * Source: `components/ids/segmented-button/design-spec.md`
 */

export type SegmentedButtonType = "text" | "icon";

export type SegmentedButtonSimulatedState =
  | "hover"
  | "press"
  | "focus-visible";

export type SegmentedButtonChangeMeta =
  | { type: "text"; label: string }
  | { type: "icon"; ariaLabel: string };

export const SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS = {
  type: "text" as SegmentedButtonType,
  selected: "option1",
  defaultSelected: "option1",
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

/** Icon slug → `assets/icons/<shape>.svg`. */
export const SEGMENTED_BUTTON_SHAPE_PATTERN = /^[a-z0-9-]+$/;

export function isValidSegmentedCount(
  type: SegmentedButtonType,
  count: number,
): boolean {
  if (type === "text") return count >= 2 && count <= 5;
  return count >= 2 && count <= 3;
}
