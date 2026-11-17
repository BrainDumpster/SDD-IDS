import { registerElementSafely } from "../internal/registration.js";
import { IdsCard } from "./card.element.js";
import { IdsCardKeyValueContent } from "./card-key-value-content.element.js";
import { IdsCardSecondaryTitle } from "./card-secondary-title.element.js";
import { IdsCardTextContent } from "./card-text-content.element.js";
import "../button/register.js";
import "../icon/register.js";

registerElementSafely("ids-card", IdsCard);
registerElementSafely("ids-card-secondary-title", IdsCardSecondaryTitle);
registerElementSafely("ids-card-text-content", IdsCardTextContent);
registerElementSafely("ids-card-key-value-content", IdsCardKeyValueContent);

export {
  IdsCard,
  IdsCardSecondaryTitle,
  IdsCardTextContent,
  IdsCardKeyValueContent,
};
