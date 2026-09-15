/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/dropdown-combo-box`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsDropdownComboBox as SynapseDropdownComboBox,
  IdsDropdownComboBoxCompound as SynapseDropdownComboBoxCompound,
  type IdsDropdownComboBoxProps as SynapseDropdownComboBoxProps,
  type IdsDropdownComboBoxOption as SynapseDropdownComboBoxOption,
  type IdsDropdownComboBoxMode as SynapseDropdownComboBoxMode,
  type IdsDropdownComboBoxSize as SynapseDropdownComboBoxSize,
  type IdsDropdownComboBoxMenuWidth as SynapseDropdownComboBoxMenuWidth,
} from "../../ids/dropdown-combo-box";
export {
  IdsComboboxOptions as SynapseComboboxOptions,
  type IdsComboboxOptionsProps as SynapseComboboxOptionsProps,
} from "../../ids/dropdown-combo-box";
export {
  IdsComboboxOption as SynapseComboboxOption,
  type IdsComboboxOptionProps as SynapseComboboxOptionProps,
} from "../../ids/dropdown-combo-box";
