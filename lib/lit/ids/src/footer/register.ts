import { registerElementSafely } from "../internal/registration.js";
import { IdsFooter } from "./footer.element.js";
import "../icon/register.js";
import "../button/register.js";
import "../tooltip/register.js";
import "../toast/register.js";

registerElementSafely("ids-footer", IdsFooter);

export { IdsFooter };
