/**
 * Compositional option marker for IdsDropdownComboBox (Mode B).
 *
 * Path: `lib/react/ids/dropdown-combo-box`
 * Source: `components/ids/dropdown-combo-box/design-spec.md`
 */

import React, { type ReactNode } from "react";

export interface IdsComboboxOptionProps {
  id: string;
  label: string;
  disabled?: boolean;
  /** Ignored at runtime — options are collected by the container. */
  children?: ReactNode;
}

/** Marker only — rendered by `IdsDropdownComboBox` as a listbox option. */
export function IdsComboboxOption(_props: IdsComboboxOptionProps) {
  return null;
}
IdsComboboxOption.displayName = "IdsComboboxOption";
