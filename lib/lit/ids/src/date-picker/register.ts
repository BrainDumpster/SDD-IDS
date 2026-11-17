import { registerElementSafely } from "../internal/registration.js";
import { IdsDatePicker } from "./date-picker.element.js";
import "../button/register.js";
import "../icon/register.js";

registerElementSafely("ids-date-picker", IdsDatePicker);

export { IdsDatePicker };
