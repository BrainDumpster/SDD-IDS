import { InjectionToken } from "@angular/core";
import type { IdsDashboardCardHost } from "../card/ids-card.context";

export interface IdsDashboardRuntimeContext extends IdsDashboardCardHost {
  readonly showDividerInCard: boolean;
  readonly dragEnabled: boolean;
  readonly dragKey: string | null;
  readonly overKey: string | null;
  onItemDragStart(itemKey: string, event: DragEvent): void;
  onItemDragOver(itemKey: string, event: DragEvent): void;
  onItemDrop(itemKey: string, event: DragEvent): void;
  onItemDragEnd(): void;
}

export const IDS_DASHBOARD_CONTEXT =
  new InjectionToken<IdsDashboardRuntimeContext>("IDS_DASHBOARD_CONTEXT");
