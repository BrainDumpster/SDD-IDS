import { InjectionToken } from "@angular/core";
import type { DetailPanelAttachMode } from "@component-contracts/ids/detail-panel.contract";

export interface IdsDetailPanelContext {
  readonly attachMode: DetailPanelAttachMode;
  readonly expanded: boolean;
  readonly bodyId: string;
  readonly toggleIcon: string;
  readonly toggleAriaLabel: string;
  toggle(): void;
  onToggleKeydown(event: KeyboardEvent): void;
}

export const IDS_DETAIL_PANEL_CONTEXT = new InjectionToken<IdsDetailPanelContext>(
  "IDS_DETAIL_PANEL_CONTEXT",
);
