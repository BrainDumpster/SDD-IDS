import { InjectionToken } from "@angular/core";
import type { TooltipArrowAlign, TooltipSide } from "@component-contracts/ids/tooltip.contract";

export interface IdsTooltipContext {
  readonly side: TooltipSide;
  readonly arrowAlign: TooltipArrowAlign;
  readonly closable: boolean;
  readonly hasTitle: boolean;
}

export const IDS_TOOLTIP_CONTEXT = new InjectionToken<IdsTooltipContext>("IDS_TOOLTIP_CONTEXT");
