import { registerElementSafely } from "../internal/registration.js";
import { IdsTextBox } from "./text-box.element.js";
import { IdsTextboxContainer } from "./textbox-container.element.js";
import "../icon/register.js";
import "../tooltip/register.js";
import "../control/register.js";

registerElementSafely("ids-text-box", IdsTextBox);
registerElementSafely("ids-textbox-container", IdsTextboxContainer);

export { IdsTextBox, IdsTextboxContainer };
