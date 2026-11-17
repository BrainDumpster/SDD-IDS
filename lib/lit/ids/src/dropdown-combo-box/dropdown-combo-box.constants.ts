/**
 * IDS Dropdown: Combo box — constants (shared model + combo specifics).
 * Spec: components/ids/dropdown-combo-box/design-spec.md
 * API:  lib/react/ids/dropdown-combo-box
 */
import type { IdsDropdownDataIds } from "../dropdown-shared/index.js";

export {
  DROPDOWN_MENU_MIN_WIDTH,
  DROPDOWN_MENU_MAX_WIDTH,
  DROPDOWN_OPTION_ROW_HEIGHT,
  DROPDOWN_DEFAULT_MAX_VISIBLE_ITEMS,
  resolveDropdownSize as resolveComboBoxSize,
  resolveDropdownMenuWidth as resolveComboBoxMenuWidth,
  type IdsDropdownSize as IdsDropdownComboBoxSize,
  type IdsDropdownMenuWidth as IdsDropdownComboBoxMenuWidth,
} from "../dropdown-shared/index.js";

export type IdsDropdownComboBoxMode = "combobox-single" | "combobox-multi";

/** React `IdsDropdownComboBoxOption` (`{ id, label, disabled? }` — no section / divider kinds). */
export interface IdsDropdownComboBoxOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export const DROPDOWN_COMBO_BOX_TAG = "ids-dropdown-combo-box";

/** Unknown → `combobox-single` (spec fallback). */
export function resolveComboBoxMode(value: unknown): IdsDropdownComboBoxMode {
  return value === "combobox-multi" ? "combobox-multi" : "combobox-single";
}

/** `data-ids` contract — identical to the React wrapper (`ids-combobox-*`). */
export const DROPDOWN_COMBO_BOX_DATA_IDS: IdsDropdownDataIds = {
  container: "ids-combobox-container",
  fieldRow: "ids-combobox-field-row",
  label: "ids-combobox-label",
  field: "ids-combobox",
  options: "ids-combobox-options",
  option: "ids-combobox-option",
};

export const DEFAULT_COMBO_RESET_TO_DEFAULT_LABEL = "Reset to Default";
