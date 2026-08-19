import { IdsMastheadComponent } from "./ids-masthead.component";
import { IdsMastheadLogoComponent } from "./ids-masthead-logo.component";
import { IdsMastheadActionButtonContainerComponent } from "./ids-masthead-action-button-container.component";
import { IdsMastheadActionIconButtonComponent } from "./ids-masthead-action-icon-button.component";
import { IdsMastheadAvatarComponent } from "./ids-masthead-avatar.component";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IdsBadgeComponent } from "../badge/ids-badge.component";

export const IDS_MASTHEAD_IMPORTS = [
  IdsMastheadComponent,
  IdsMastheadLogoComponent,
  IdsMastheadActionButtonContainerComponent,
  IdsMastheadActionIconButtonComponent,
  IdsMastheadAvatarComponent,
  IdsIconComponent,
  IdsBadgeComponent,
] as const;

export {
  IdsMastheadComponent,
  IdsMastheadLogoComponent,
  IdsMastheadActionButtonContainerComponent,
  IdsMastheadActionIconButtonComponent,
  IdsMastheadAvatarComponent,
};
