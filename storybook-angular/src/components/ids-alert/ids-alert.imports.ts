import { IdsAlertComponent } from "./ids-alert.component";
import { IdsAlertMessageComponent } from "./ids-alert-message.component";
import { IdsAlertTitleComponent } from "./ids-alert-title.component";
import { IdsAlertLinkComponent } from "./ids-alert-link.component";
import { IdsAlertActionComponent } from "./ids-alert-action.component";
import { IdsAlertGroupComponent } from "./ids-alert-group.component";
import { IdsAlertItemComponent } from "./ids-alert-item.component";

export const IDS_ALERT_IMPORTS = [
  IdsAlertComponent,
  IdsAlertMessageComponent,
  IdsAlertTitleComponent,
  IdsAlertLinkComponent,
  IdsAlertActionComponent,
  IdsAlertGroupComponent,
  IdsAlertItemComponent,
] as const;

export {
  IdsAlertComponent,
  IdsAlertMessageComponent,
  IdsAlertTitleComponent,
  IdsAlertLinkComponent,
  IdsAlertActionComponent,
  IdsAlertGroupComponent,
  IdsAlertItemComponent,
};
