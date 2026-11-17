import { registerElementSafely } from "../internal/registration.js";
import { IdsDropdownMultiSelect } from "./dropdown-multiselect.element.js";
import "../icon/register.js";
import "../badge/register.js";
import "../tooltip/register.js";

registerElementSafely("ids-dropdown-multiselect", IdsDropdownMultiSelect);

export { IdsDropdownMultiSelect };
