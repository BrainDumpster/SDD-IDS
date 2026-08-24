import React, { type ReactNode } from "react";

export interface IdsDropdownMultiSelectOptionsProps {
  children?: ReactNode;
}

/** Marker only — children must be `IdsDropdownMultiSelectOption` nodes. */
export function IdsDropdownMultiSelectOptions(
  _props: IdsDropdownMultiSelectOptionsProps,
) {
  return null;
}
IdsDropdownMultiSelectOptions.displayName = "IdsDropdownMultiSelectOptions";
