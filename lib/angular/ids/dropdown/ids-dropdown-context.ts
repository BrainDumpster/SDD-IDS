import { InjectionToken } from "@angular/core";
import type { IdsDropdownMode, IdsDropdownSelectionMode } from "./ids-dropdown.types";

export interface IdsDropdownContext {
  readonly mode: IdsDropdownMode;
  readonly selectionMode: IdsDropdownSelectionMode;
  readonly disabled: boolean;
  readonly selectedValues: readonly string[];
  /** Single-select: value restored by Reset to Default (radio mode). */
  readonly defaultValue?: string;
  readonly showSingleSelectRadio: boolean;
  /** React/spec `showRadio` with legacy fallback. */
  readonly resolvedShowRadio: boolean;
  isSelected(value: string): boolean;
  toggleValue(value: string): void;
  resetToDefault(): void;
  registerDescribedBy(id: string): void;
  unregisterDescribedBy(id: string): void;
  describedByIds(): string;
}

export const IDS_DROPDOWN_CONTEXT = new InjectionToken<IdsDropdownContext>("IDS_DROPDOWN_CONTEXT");
