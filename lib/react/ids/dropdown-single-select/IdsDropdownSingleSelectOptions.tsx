import React, { type ReactNode } from "react";

export interface IdsDropdownSingleSelectOptionsProps {
  children?: ReactNode;
}

/** Marker only — children must be `IdsDropdownSingleSelectOption` nodes. */
export function IdsDropdownSingleSelectOptions(
  _props: IdsDropdownSingleSelectOptionsProps,
) {
  return null;
}
IdsDropdownSingleSelectOptions.displayName = "IdsDropdownSingleSelectOptions";
