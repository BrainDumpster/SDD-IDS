/**
 * IDS Dropdown Button — framework-agnostic spec contract.
 * Source: `components/ids/dropdown-button/design-spec.md`
 */
export const IDS_DROPDOWN_BUTTON_DESIGN_SPEC_PATH =
  "components/ids/dropdown-button/design-spec.md" as const;

export type DropdownButtonStyle = "primary" | "secondary" | "tertiary";
export type DropdownButtonSize = "small" | "medium" | "large";

export interface IdsDropdownButtonMenuItemInput {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface IdsDropdownButtonSelection {
  value: string;
  label: string;
}

export const DROPDOWN_BUTTON_TRIGGER_ICON = "settings-gear-detailed" as const;
export const DROPDOWN_BUTTON_CARET_ICON = "arrow-drop-tri-caret" as const;

export const DROPDOWN_BUTTON_SPEC_MENU_ITEMS: readonly IdsDropdownButtonMenuItemInput[] = [
  { value: "option-1", label: "Option 1" },
  { value: "option-2", label: "Option 2" },
  { value: "option-3", label: "Option 3" },
] as const;

export const DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS = {
  buttonStyle: "primary" as DropdownButtonStyle,
  size: "medium" as DropdownButtonSize,
  disabled: false,
  defaultOpen: false,
  label: "Dropdown Button",
  showLeadingIcon: false,
  iconOnly: false,
  ariaLabel: "Dropdown Button",
  items: DROPDOWN_BUTTON_SPEC_MENU_ITEMS,
} as const;
