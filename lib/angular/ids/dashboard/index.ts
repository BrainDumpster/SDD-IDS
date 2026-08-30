import { IdsDashboardComponent } from "./ids-dashboard.component";
import { IdsDashboardGridComponent } from "./ids-dashboard-grid.component";
import { IdsDashboardItemComponent } from "./ids-dashboard-item.component";
import { IDS_CARD_IMPORTS } from "../card/index";

export const IDS_DASHBOARD_IMPORTS = [
  IdsDashboardComponent,
  IdsDashboardGridComponent,
  IdsDashboardItemComponent,
  ...IDS_CARD_IMPORTS,
] as const;

export {
  IdsDashboardComponent,
  IdsDashboardGridComponent,
  IdsDashboardItemComponent,
};

export {
  IDS_DASHBOARD_CONTEXT,
} from "./ids-dashboard.context";
export type { IdsDashboardRuntimeContext } from "./ids-dashboard.context";
export type { IdsDashboardSlotName } from "./ids-dashboard.types";
