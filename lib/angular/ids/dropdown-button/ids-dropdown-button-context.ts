import { InjectionToken } from "@angular/core";
import type {
  DropdownButtonSize,
  DropdownButtonStyle,
  IdsDropdownButtonSelection,
} from "@component-contracts/ids/dropdown-button.contract";

export interface IdsDropdownButtonTriggerApi {
  markForCheck(): void;
  focusTrigger(): void;
}

export interface IdsDropdownButtonMenuApi {
  readonly menuId: string;
  markForCheck(): void;
  focusFirstEnabledItem(): void;
  focusLastEnabledItem(): void;
}

export interface IdsDropdownButtonContext {
  readonly buttonStyle: DropdownButtonStyle;
  readonly size: DropdownButtonSize;
  readonly disabled: boolean;
  readonly isOpen: boolean;
  readonly menuId: string | null;
  registerTrigger(trigger: IdsDropdownButtonTriggerApi): void;
  registerMenu(menu: IdsDropdownButtonMenuApi): void;
  toggleFromTrigger(): void;
  openFromTrigger(focusTarget?: "first" | "last"): void;
  closeMenu(options?: { focusTrigger?: boolean }): void;
  selectItem(selection: IdsDropdownButtonSelection): void;
}

export const IDS_DROPDOWN_BUTTON_CONTEXT = new InjectionToken<IdsDropdownButtonContext>(
  "IDS_DROPDOWN_BUTTON_CONTEXT",
);
