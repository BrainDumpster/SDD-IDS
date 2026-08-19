import { InjectionToken } from "@angular/core";
import type { TooltipArrowAlign, TooltipCloseReason, TooltipSide } from "@component-contracts/ids/tooltip.contract";

export interface IdsTooltipContext {
  readonly side: TooltipSide;
  readonly resolvedArrowAlign: TooltipArrowAlign;
  readonly closable: boolean;
  readonly hasTitle: boolean;
  readonly isOpen: boolean;
  readonly tooltipId: string;
  readonly popupTop: number;
  readonly popupLeft: number;
  readonly positioned: boolean;
  readonly hugContent: boolean;
  readonly closeIconShapeName: string;
  readonly triggerDescribedBy: string | null;
  readonly contentClass: string;
  readonly popupClass: string;
  onTriggerPointerEnter(): void;
  onTriggerPointerLeave(): void;
  onTriggerFocusIn(): void;
  onTriggerFocusOut(event: FocusEvent): void;
  onPopupPointerEnter(): void;
  onPopupPointerLeave(): void;
  onPopupKeydown(event: KeyboardEvent): void;
  onCloseClick(): void;
  dismiss(reason: TooltipCloseReason): void;
}

export const IDS_TOOLTIP_CONTEXT = new InjectionToken<IdsTooltipContext>("IDS_TOOLTIP_CONTEXT");
