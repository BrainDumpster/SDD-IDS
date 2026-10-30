import { IdsTooltipComponent } from "./ids-tooltip.component";
import { IdsTooltipTriggerComponent } from "./ids-tooltip-trigger.component";
import { IdsTooltipPanelComponent } from "./ids-tooltip-panel.component";
import { IdsTooltipHeaderComponent } from "./ids-tooltip-header.component";
import { IdsTooltipTitleComponent } from "./ids-tooltip-title.component";
import { IdsTooltipBodyComponent } from "./ids-tooltip-body.component";
import { IdsTooltipCloseComponent } from "./ids-tooltip-close.component";
import { IdsTooltipArrowComponent } from "./ids-tooltip-arrow.component";
import { IdsButtonComponent } from "../button/ids-button.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_TOOLTIP_IMPORTS = [
  IdsTooltipComponent,
  IdsTooltipTriggerComponent,
  IdsTooltipPanelComponent,
  IdsTooltipHeaderComponent,
  IdsTooltipTitleComponent,
  IdsTooltipBodyComponent,
  IdsTooltipCloseComponent,
  IdsTooltipArrowComponent,
  IdsButtonComponent,
  IdsIconComponent,
] as const;

export {
  IdsTooltipComponent,
  IdsTooltipTriggerComponent,
  IdsTooltipPanelComponent,
  IdsTooltipHeaderComponent,
  IdsTooltipTitleComponent,
  IdsTooltipBodyComponent,
  IdsTooltipCloseComponent,
  IdsTooltipArrowComponent,
};
