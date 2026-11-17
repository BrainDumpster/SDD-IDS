import { registerElementSafely } from "../internal/registration.js";
import { IdsBadge } from "./badge.element.js";
import "../tooltip/register.js";

registerElementSafely("ids-badge", IdsBadge);

export { IdsBadge };
