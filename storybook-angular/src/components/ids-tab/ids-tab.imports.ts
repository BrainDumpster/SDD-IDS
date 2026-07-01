import { IdsTabComponent } from "./ids-tab.component";
import { IdsTabItemComponent } from "./ids-tab-item.component";
import { IdsTabPanelComponent } from "./ids-tab-panel.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";

/** Standalone imports for IDS Tab composition stories and app wiring. */
export const IDS_TAB_IMPORTS = [
  IdsTabComponent,
  IdsTabItemComponent,
  IdsTabPanelComponent,
  IdsIconComponent,
] as const;

export { IdsTabComponent, IdsTabItemComponent, IdsTabPanelComponent };
