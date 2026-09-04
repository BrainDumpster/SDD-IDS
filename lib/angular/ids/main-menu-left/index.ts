import { IdsMainMenuLeftComponent } from "./ids-main-menu-left.component";
import { IdsMainMenuLeftItemComponent } from "./ids-main-menu-left-item.component";
import { IdsMainMenuLeftItemsAdapterComponent } from "./ids-main-menu-left-items-adapter.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_MAIN_MENU_LEFT_IMPORTS = [
  IdsMainMenuLeftComponent,
  IdsMainMenuLeftItemComponent,
  IdsMainMenuLeftItemsAdapterComponent,
  IdsIconComponent,
] as const;

export {
  IdsMainMenuLeftComponent,
  IdsMainMenuLeftItemComponent,
  IdsMainMenuLeftItemsAdapterComponent,
};
