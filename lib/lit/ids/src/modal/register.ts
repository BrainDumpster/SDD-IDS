import { registerElementSafely } from "../internal/registration.js";
import { IdsModal } from "./modal.element.js";
import {
  IdsModalClose,
  IdsModalContent,
  IdsModalDescription,
  IdsModalFooter,
  IdsModalHeader,
  IdsModalTabs,
  IdsModalTitle,
} from "./modal-parts.element.js";
import "../button/register.js";
import "../icon/register.js";
import "../tab/register.js";

registerElementSafely("ids-modal", IdsModal);
registerElementSafely("ids-modal-close", IdsModalClose);
registerElementSafely("ids-modal-header", IdsModalHeader);
registerElementSafely("ids-modal-title", IdsModalTitle);
registerElementSafely("ids-modal-description", IdsModalDescription);
registerElementSafely("ids-modal-tabs", IdsModalTabs);
registerElementSafely("ids-modal-content", IdsModalContent);
registerElementSafely("ids-modal-footer", IdsModalFooter);

export {
  IdsModal,
  IdsModalClose,
  IdsModalHeader,
  IdsModalTitle,
  IdsModalDescription,
  IdsModalTabs,
  IdsModalContent,
  IdsModalFooter,
};
