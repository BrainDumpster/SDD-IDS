/**
 * IDS Dropdown: Single-select — constants (shared model + single-select specifics).
 * Spec: components/ids/dropdown-single-select/design-spec.md
 * API:  lib/react/ids/dropdown-single-select
 */
import type { IdsDropdownDataIds, IdsDropdownOption } from "../dropdown-shared/index.js";

export {
  DROPDOWN_MENU_MIN_WIDTH,
  DROPDOWN_MENU_MAX_WIDTH,
  DROPDOWN_OPTION_ROW_HEIGHT,
  DROPDOWN_DEFAULT_MAX_VISIBLE_ITEMS,
  resolveDropdownSize as resolveSingleSelectSize,
  resolveDropdownMenuWidth as resolveSingleSelectMenuWidth,
  type IdsDropdownSize as IdsDropdownSingleSelectSize,
  type IdsDropdownMenuWidth as IdsDropdownSingleSelectMenuWidth,
} from "../dropdown-shared/index.js";

/** React `IdsDropdownSingleSelectOptionModel`. */
export type IdsDropdownSingleSelectOptionModel = IdsDropdownOption;

export const DROPDOWN_SINGLE_SELECT_TAG = "ids-dropdown-single-select";

/** `data-ids` contract — identical to the React wrapper. */
export const DROPDOWN_SINGLE_SELECT_DATA_IDS: IdsDropdownDataIds = {
  container: "ids-dropdown-single-select-container",
  fieldRow: "ids-dropdown-single-select-field-row",
  label: "ids-dropdown-single-select-label",
  field: "ids-dropdown-single-select",
  options: "ids-dropdown-single-select-options",
  option: "ids-dropdown-single-select-option",
};

export const DEFAULT_RESET_TO_DEFAULT_LABEL = "Reset to Default";
