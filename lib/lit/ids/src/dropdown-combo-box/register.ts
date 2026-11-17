import { registerElementSafely } from "../internal/registration.js";
import { IdsDropdownComboBox } from "./dropdown-combo-box.element.js";
import "../icon/register.js";
import "../badge/register.js";
import "../tooltip/register.js";

registerElementSafely("ids-dropdown-combo-box", IdsDropdownComboBox);

export { IdsDropdownComboBox };
