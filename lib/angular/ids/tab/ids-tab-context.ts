import { InjectionToken } from "@angular/core";
import type { TabSurface, TabType } from "@component-contracts/ids/tab.contract";
import type { IdsTabItemComponent } from "./ids-tab-item.component";

export interface IdsTabContext {
  readonly type: TabType;
  readonly surface: TabSurface;
  isActive(item: IdsTabItemComponent): boolean;
  isVisible(item: IdsTabItemComponent): boolean;
  selectVisible(item: IdsTabItemComponent): void;
  selectHidden(item: IdsTabItemComponent): void;
  tabId(item: IdsTabItemComponent): string;
  panelId(item: IdsTabItemComponent): string;
  onTabKeydown(event: KeyboardEvent, item: IdsTabItemComponent): void;
  tabTabIndex(item: IdsTabItemComponent): number;
  onTabFocus(item: IdsTabItemComponent): void;
  minTabWidth: number;
  maxTabWidth: number;
}

export const IDS_TAB_CONTEXT = new InjectionToken<IdsTabContext>("IDS_TAB_CONTEXT");
