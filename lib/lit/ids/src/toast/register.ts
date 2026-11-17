import { registerElementSafely } from "../internal/registration.js";
import { IdsToastItem } from "./toast-item.element.js";
import { IdsToastViewport } from "./toast-viewport.element.js";
import "../icon/register.js";

registerElementSafely("ids-toast-item", IdsToastItem);
registerElementSafely("ids-toast-viewport", IdsToastViewport);

export { IdsToastItem, IdsToastViewport };
