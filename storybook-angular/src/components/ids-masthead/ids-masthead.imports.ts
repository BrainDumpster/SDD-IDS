import { IdsMastheadComponent } from "./ids-masthead.component";
import { IdsMastheadLogoComponent } from "./ids-masthead-logo.component";
import { IdsMastheadActionButtonContainerComponent } from "./ids-masthead-action-button-container.component";
import { IdsMastheadActionIconButtonComponent } from "./ids-masthead-action-icon-button.component";
import { IdsMastheadAvatarComponent } from "./ids-masthead-avatar.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IdsBadgeComponent } from "../ids-badge/ids-badge.component";

/** Import this array wherever masthead composition markup is used. */
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
