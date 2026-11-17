import { registerElementSafely } from "../internal/registration.js";
import { IdsControlHelper } from "./control-helper.element.js";
import { IdsControlError } from "./control-error.element.js";
import "../icon/register.js";

registerElementSafely("ids-control-helper", IdsControlHelper);
registerElementSafely("ids-control-error", IdsControlError);

export { IdsControlHelper, IdsControlError };
