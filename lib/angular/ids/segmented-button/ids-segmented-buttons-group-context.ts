import { InjectionToken } from "@angular/core";
import type { SegmentedButtonSimulatedState, SegmentedButtonType } from "@component-contracts/ids/segmented-button.contract";

export interface IdsSegmentedButtonsSegment {
  readonly segmentValue: string;
  disabled: boolean;
  simulatedState?: SegmentedButtonSimulatedState;
  getChangeMeta(): { type: "text"; label: string } | { type: "icon"; ariaLabel: string };
}

export interface IdsSegmentedButtonsContext {
  readonly type: SegmentedButtonType;
  isSelected(value: string): boolean;
  isItemDisabled(item: IdsSegmentedButtonsSegment): boolean;
  select(value: string): void;
  optionId(value: string): string;
  simulatedStateAttr(state?: SegmentedButtonSimulatedState): string | null;
  onItemKeydown(event: KeyboardEvent, item: IdsSegmentedButtonsSegment): void;
  itemTabIndex(item: IdsSegmentedButtonsSegment): number;
  onItemFocus(item: IdsSegmentedButtonsSegment): void;
  notifySelectionChange(): void;
}

export const IDS_SEGMENTED_BUTTONS_CONTEXT = new InjectionToken<IdsSegmentedButtonsContext>(
  "IDS_SEGMENTED_BUTTONS_CONTEXT",
);
