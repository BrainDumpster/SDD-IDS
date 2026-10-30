import { InjectionToken } from "@angular/core";
import type { IdsAlertItemComponent } from "./ids-alert-item.component";

export interface IdsAlertGroupContext {
  readonly activeIndex: number;
  isActive(item: IdsAlertItemComponent): boolean;
}

export const IDS_ALERT_GROUP_CONTEXT = new InjectionToken<IdsAlertGroupContext>(
  "IDS_ALERT_GROUP_CONTEXT",
);
