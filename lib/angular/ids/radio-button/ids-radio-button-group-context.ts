import { InjectionToken } from "@angular/core";
import type { IdsRadioButtonComponent } from "./ids-radio-button.component";
import type {
  RadioButtonOrientation,
  RadioButtonSimulatedState,
} from "@component-contracts/ids/radio-button.contract";

export type RadioButtonGroupLabelPosition = "left" | "top";

export interface IdsRadioButtonGroupContext {
  readonly name: string;
  readonly disabled: boolean;
  readonly error: boolean;
  readonly orientation: RadioButtonOrientation;
  isSelected(value: string): boolean;
  isItemDisabled(item: IdsRadioButtonComponent): boolean;
  select(value: string): void;
  optionId(value: string): string;
  simulatedStateAttr(state?: RadioButtonSimulatedState): string | null;
  onItemKeydown(event: KeyboardEvent, item: IdsRadioButtonComponent): void;
  itemTabIndex(item: IdsRadioButtonComponent): number;
  onItemFocus(item: IdsRadioButtonComponent): void;
  registerItems(items: readonly IdsRadioButtonComponent[]): void;
  notifySelectionChange(): void;
}

export const IDS_RADIO_BUTTON_GROUP_CONTEXT = new InjectionToken<IdsRadioButtonGroupContext>(
  "IDS_RADIO_BUTTON_GROUP_CONTEXT",
);
