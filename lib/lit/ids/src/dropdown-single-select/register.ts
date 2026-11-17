import { registerElementSafely } from "../internal/registration.js";
import { IdsDropdownSingleSelect } from "./dropdown-single-select.element.js";
import "../icon/register.js";
import "../badge/register.js";
import "../tooltip/register.js";

registerElementSafely("ids-dropdown-single-select", IdsDropdownSingleSelect);

export { IdsDropdownSingleSelect };
