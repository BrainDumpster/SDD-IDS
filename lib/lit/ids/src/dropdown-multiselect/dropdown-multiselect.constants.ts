/**
 * IDS Dropdown: Multiselect — constants (shared model + multiselect specifics).
 * Spec: components/ids/dropdown-multiselect/design-spec.md
 * API:  lib/react/ids/dropdown-multiselect
 */
import type { IdsDropdownDataIds, IdsDropdownOption } from "../dropdown-shared/index.js";

export {
  DROPDOWN_MENU_MIN_WIDTH,
  DROPDOWN_MENU_MAX_WIDTH,
  DROPDOWN_OPTION_ROW_HEIGHT,
  DROPDOWN_DEFAULT_MAX_VISIBLE_ITEMS,
  resolveDropdownSize as resolveMultiSelectSize,
  resolveDropdownMenuWidth as resolveMultiSelectMenuWidth,
  type IdsDropdownSize as IdsDropdownMultiSelectSize,
  type IdsDropdownMenuWidth as IdsDropdownMultiSelectMenuWidth,
} from "../dropdown-shared/index.js";

/** React `IdsDropdownMultiSelectOptionModel`. */
export type IdsDropdownMultiSelectOptionModel = IdsDropdownOption;

export const DROPDOWN_MULTISELECT_TAG = "ids-dropdown-multiselect";

/** `data-ids` contract — identical to the React wrapper. */
export const DROPDOWN_MULTISELECT_DATA_IDS: IdsDropdownDataIds = {
  container: "ids-dropdown-multiselect-container",
  fieldRow: "ids-dropdown-multiselect-field-row",
  label: "ids-dropdown-multiselect-label",
  field: "ids-dropdown-multiselect",
  options: "ids-dropdown-multiselect-options",
  option: "ids-dropdown-multiselect-option",
};

export const DEFAULT_SELECT_ALL_LABEL = "Select All";
export const DEFAULT_CLEAR_ALL_LABEL = "Clear All";
