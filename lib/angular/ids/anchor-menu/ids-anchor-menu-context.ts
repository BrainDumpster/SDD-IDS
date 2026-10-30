import { InjectionToken } from "@angular/core";
import type { IdsAnchorMenuItemComponent } from "./ids-anchor-menu-item.component";

export interface IdsAnchorMenuContext {
  readonly title: string;
  readonly sticky: boolean;
  /** Reveal truncated labels with the browser `title` instead of IdsTooltip. */
  readonly nativeTooltip: boolean;
  /** Auto-flipped IdsTooltip side based on the menu's viewport position. */
  readonly tooltipSide: "left" | "right";
  readonly activeHref: string | undefined;
  readonly activeIndicatorTopPx: number | null;
  isActive(href: string): boolean;
  canNavigate(href: string): boolean;
  selectItem(item: IdsAnchorMenuItemComponent, event?: Event): void;
  onItemKeydown(event: KeyboardEvent, item: IdsAnchorMenuItemComponent): void;
  onItemFocus(item: IdsAnchorMenuItemComponent): void;
  itemTabIndex(item: IdsAnchorMenuItemComponent): number;
  registerItems(items: readonly IdsAnchorMenuItemComponent[]): void;
  notifyChange(): void;
}

export const IDS_ANCHOR_MENU_CONTEXT = new InjectionToken<IdsAnchorMenuContext>(
  "IDS_ANCHOR_MENU_CONTEXT",
);
