import { registerElementSafely } from "../internal/registration.js";
import { IdsRadioButton } from "./radio-button.element.js";
import { IdsRadioButtonGroup } from "./radio-button-group.element.js";
import "../icon/register.js";

registerElementSafely("ids-radio-button", IdsRadioButton);
registerElementSafely("ids-radio-button-group", IdsRadioButtonGroup);

export { IdsRadioButton, IdsRadioButtonGroup };
