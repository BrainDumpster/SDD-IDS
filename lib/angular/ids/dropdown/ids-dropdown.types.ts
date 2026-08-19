export type IdsDropdownMode =
  | "combobox-single"
  | "combobox-multi"
  | "single-select"
  | "multi-select";

export type IdsDropdownSelectionMode = "single" | "multi" | "none";

export type IdsDropdownSize = "small" | "large";

export interface IdsDropdownMenuItemModel {
  id?: string;
  label: string;
  value?: string;
  disabled?: boolean;
  kind?: "item" | "section" | "divider";
  selectable?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
  onClick?: () => void;
}
