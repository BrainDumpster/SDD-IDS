import React, { type ReactNode } from "react";

export interface IdsDropdownSingleSelectOptionProps {
  id: string;
  label: string;
  disabled?: boolean;
  /** `section` / `divider` map to DropdownMenu row kinds (Anatomy SectionHeaderRow). */
  kind?: "option" | "section" | "divider";
  children?: ReactNode;
}

/** Marker only — collected by `IdsDropdownSingleSelect`. */
export function IdsDropdownSingleSelectOption(
  _props: IdsDropdownSingleSelectOptionProps,
) {
  return null;
}
IdsDropdownSingleSelectOption.displayName = "IdsDropdownSingleSelectOption";
