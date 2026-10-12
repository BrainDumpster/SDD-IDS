import { registerElementSafely } from "../internal/registration.js";
import { IdsCheckbox } from "./checkbox.element.js";
import { IdsCheckboxGroup } from "./checkbox-group.element.js";
import "../icon/register.js";

registerElementSafely("ids-checkbox", IdsCheckbox);
registerElementSafely("ids-checkbox-group", IdsCheckboxGroup);

export { IdsCheckbox, IdsCheckboxGroup };
