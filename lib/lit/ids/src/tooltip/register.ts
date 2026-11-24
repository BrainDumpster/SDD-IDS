import { registerElementSafely } from "../internal/registration.js";
import { IdsTooltip } from "./tooltip.element.js";
import { IdsTooltipTrigger } from "./tooltip-trigger.element.js";
import { IdsTooltipPanel } from "./tooltip-panel.element.js";
import { IdsTooltipBody } from "./tooltip-body.element.js";
import { IdsTooltipHeader } from "./tooltip-header.element.js";
import { IdsTooltipClose } from "./tooltip-close.element.js";

registerElementSafely("ids-tooltip", IdsTooltip);
registerElementSafely("ids-tooltip-trigger", IdsTooltipTrigger);
registerElementSafely("ids-tooltip-panel", IdsTooltipPanel);
registerElementSafely("ids-tooltip-body", IdsTooltipBody);
registerElementSafely("ids-tooltip-header", IdsTooltipHeader);
registerElementSafely("ids-tooltip-close", IdsTooltipClose);

export {
  IdsTooltip,
  IdsTooltipTrigger,
  IdsTooltipPanel,
  IdsTooltipBody,
  IdsTooltipHeader,
  IdsTooltipClose,
};
