import { IdsToastItemComponent } from "./ids-toast-item.component";
import { IdsToastIconContainerComponent } from "./ids-toast-icon-container.component";
import { IdsToastMessageComponent } from "./ids-toast-message.component";
import { IdsToastViewDetailsActionComponent } from "./ids-toast-view-details-action.component";
import { IdsToastCloseActionComponent } from "./ids-toast-close-action.component";
import { IdsToastViewportComponent } from "./ids-toast-viewport.component";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IdsButtonComponent } from "../button/ids-button.component";

export const IDS_TOAST_IMPORTS = [
  IdsToastViewportComponent,
  IdsToastItemComponent,
  IdsToastIconContainerComponent,
  IdsToastMessageComponent,
  IdsToastViewDetailsActionComponent,
  IdsToastCloseActionComponent,
  IdsIconComponent,
  IdsButtonComponent,
] as const;

export {
  IdsToastViewportComponent,
  IdsToastItemComponent,
  IdsToastIconContainerComponent,
  IdsToastMessageComponent,
  IdsToastViewDetailsActionComponent,
  IdsToastCloseActionComponent,
};
export {
  resolveToastType,
  resolveToastDuration,
  resolveToastPosition,
  resolveToastMaxVisible,
} from "./ids-toast.utils";
