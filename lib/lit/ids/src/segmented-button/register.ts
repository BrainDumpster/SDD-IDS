import { registerElementSafely } from "../internal/registration.js";
import { IdsSegmentedButtons } from "./segmented-buttons.element.js";
import { IdsSegmentedIcon } from "./segmented-icon.element.js";
import { IdsSegmentedText } from "./segmented-text.element.js";
import "../icon/register.js";

registerElementSafely("ids-segmented-buttons", IdsSegmentedButtons);
registerElementSafely("ids-segmented-text", IdsSegmentedText);
registerElementSafely("ids-segmented-icon", IdsSegmentedIcon);

export { IdsSegmentedButtons, IdsSegmentedText, IdsSegmentedIcon };
