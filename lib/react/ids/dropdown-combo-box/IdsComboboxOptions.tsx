/**
 * Compositional options list marker for IdsDropdownComboBox (Mode B).
 *
 * Anatomy: combobox-container → combobox → combobox-options → combobox-option*
 *
 * Path: `lib/react/ids/dropdown-combo-box`
 * Source: `components/ids/dropdown-combo-box/design-spec.md`
 */

import React, { type ReactNode } from "react";

export interface IdsComboboxOptionsProps {
  children?: ReactNode;
}

/** Marker only — children must be `IdsComboboxOption` nodes collected by the container. */
export function IdsComboboxOptions(_props: IdsComboboxOptionsProps) {
  return null;
}
IdsComboboxOptions.displayName = "IdsComboboxOptions";
