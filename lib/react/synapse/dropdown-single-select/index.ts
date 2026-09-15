/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/dropdown-single-select`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsDropdownSingleSelect as SynapseDropdownSingleSelect,
  IdsDropdownSingleSelectCompound as SynapseDropdownSingleSelectCompound,
  type IdsDropdownSingleSelectProps as SynapseDropdownSingleSelectProps,
  type IdsDropdownSingleSelectOptionModel as SynapseDropdownSingleSelectOptionModel,
  type IdsDropdownSingleSelectSize as SynapseDropdownSingleSelectSize,
  type IdsDropdownSingleSelectMenuWidth as SynapseDropdownSingleSelectMenuWidth,
} from "../../ids/dropdown-single-select";
export {
  IdsDropdownSingleSelectOptions as SynapseDropdownSingleSelectOptions,
  type IdsDropdownSingleSelectOptionsProps as SynapseDropdownSingleSelectOptionsProps,
} from "../../ids/dropdown-single-select";
export {
  IdsDropdownSingleSelectOption as SynapseDropdownSingleSelectOption,
  type IdsDropdownSingleSelectOptionProps as SynapseDropdownSingleSelectOptionProps,
} from "../../ids/dropdown-single-select";
