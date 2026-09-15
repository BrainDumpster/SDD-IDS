/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/dropdown-multiselect`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsDropdownMultiSelect as SynapseDropdownMultiSelect,
  IdsDropdownMultiSelectCompound as SynapseDropdownMultiSelectCompound,
  type IdsDropdownMultiSelectProps as SynapseDropdownMultiSelectProps,
  type IdsDropdownMultiSelectOptionModel as SynapseDropdownMultiSelectOptionModel,
  type IdsDropdownMultiSelectSize as SynapseDropdownMultiSelectSize,
  type IdsDropdownMultiSelectMenuWidth as SynapseDropdownMultiSelectMenuWidth,
} from "../../ids/dropdown-multiselect";
export {
  IdsDropdownMultiSelectOptions as SynapseDropdownMultiSelectOptions,
  type IdsDropdownMultiSelectOptionsProps as SynapseDropdownMultiSelectOptionsProps,
} from "../../ids/dropdown-multiselect";
export {
  IdsDropdownMultiSelectOption as SynapseDropdownMultiSelectOption,
  type IdsDropdownMultiSelectOptionProps as SynapseDropdownMultiSelectOptionProps,
} from "../../ids/dropdown-multiselect";
