import React, { type ReactNode } from "react";

export interface IdsDropdownMultiSelectOptionProps {
  id: string;
  label: string;
  disabled?: boolean;
  kind?: "option" | "section" | "divider";
  children?: ReactNode;
}

/** Marker only — collected by `IdsDropdownMultiSelect`. */
export function IdsDropdownMultiSelectOption(
  _props: IdsDropdownMultiSelectOptionProps,
) {
  return null;
}
IdsDropdownMultiSelectOption.displayName = "IdsDropdownMultiSelectOption";
