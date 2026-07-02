import { IdsButtonComponent } from "../ids-button/ids-button.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IdsTooltipComponent } from "./ids-tooltip.component";
import { IdsTooltipBodyComponent } from "./ids-tooltip-body.component";
import { IdsTooltipTitleComponent } from "./ids-tooltip-title.component";
/** Standalone imports for IDS Tooltip composition stories and app wiring. */
export const IDS_TOOLTIP_IMPORTS = [
    IdsTooltipComponent,
    IdsTooltipTitleComponent,
    IdsTooltipBodyComponent,
    IdsButtonComponent,
    IdsIconComponent,
];
export { IdsTooltipComponent, IdsTooltipTitleComponent, IdsTooltipBodyComponent };
