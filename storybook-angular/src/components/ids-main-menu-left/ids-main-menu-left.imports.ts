import { IdsMainMenuLeftComponent } from "./ids-main-menu-left.component";
import {
  IdsMainMenuLeftChildrenComponent,
  IdsMainMenuLeftGroupComponent,
  IdsMainMenuLeftItemComponent,
  IdsMainMenuLeftItemIconComponent,
  IdsMainMenuLeftLogoComponent,
} from "./ids-main-menu-left-item.component";
import { IdsMainMenuLeftItemsAdapterComponent } from "./ids-main-menu-left-items-adapter.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";

/** Import this array wherever main menu left composition markup is used. */
export const IDS_MAIN_MENU_LEFT_IMPORTS = [
  IdsMainMenuLeftComponent,
  IdsMainMenuLeftLogoComponent,
  IdsMainMenuLeftItemComponent,
  IdsMainMenuLeftItemIconComponent,
  IdsMainMenuLeftGroupComponent,
  IdsMainMenuLeftChildrenComponent,
  IdsMainMenuLeftItemsAdapterComponent,
  IdsIconComponent,
] as const;

export {
  IdsMainMenuLeftComponent,
  IdsMainMenuLeftLogoComponent,
  IdsMainMenuLeftItemComponent,
  IdsMainMenuLeftItemIconComponent,
  IdsMainMenuLeftGroupComponent,
  IdsMainMenuLeftChildrenComponent,
};
