import { registerElementSafely } from "../internal/registration.js";
import { IdsMasthead } from "./masthead.element.js";
import { IdsMastheadActionButtonContainer } from "./masthead-action-button-container.element.js";
import { IdsMastheadActionIconButton } from "./masthead-action-icon-button.element.js";
import { IdsMastheadAvatar } from "./masthead-avatar.element.js";
import "../badge/register.js";
import "../icon/register.js";
import "../tooltip/register.js";

registerElementSafely("ids-masthead", IdsMasthead);
registerElementSafely(
  "ids-masthead-action-button-container",
  IdsMastheadActionButtonContainer,
);
registerElementSafely(
  "ids-masthead-action-icon-button",
  IdsMastheadActionIconButton,
);
registerElementSafely("ids-masthead-avatar", IdsMastheadAvatar);

export {
  IdsMasthead,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
};
