import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewEncapsulation,
} from "@angular/core";
import {
  ANCHOR_MENU_API_DEFAULTS,
} from "@component-contracts/ids/anchor-menu.contract";
import {
  IDS_ANCHOR_MENU_CONTEXT,
  type IdsAnchorMenuContext,
} from "./ids-anchor-menu-context";
import { IdsAnchorMenuItemComponent } from "./ids-anchor-menu-item.component";

@Component({
  selector: "ids-anchor-menu",
  standalone: true,
  templateUrl: "./ids-anchor-menu.component.html",
  styleUrl: "./ids-anchor-menu.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IDS_ANCHOR_MENU_CONTEXT, useExisting: IdsAnchorMenuComponent }],
})
export class IdsAnchorMenuComponent
  implements OnInit, AfterContentInit, OnDestroy, IdsAnchorMenuContext
{
  @ContentChildren(IdsAnchorMenuItemComponent) itemQuery!: QueryList<IdsAnchorMenuItemComponent>;

  @Input() title = ANCHOR_MENU_API_DEFAULTS.title;
  @Input() sticky = ANCHOR_MENU_API_DEFAULTS.sticky;

  @Output() readonly itemClick = new EventEmitter<string>();

  activeHref: string | undefined;
  private items: IdsAnchorMenuItemComponent[] = [];
  private focusedIndex = 0;
  private scrollSpyBound = false;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.bindScrollSpy();
  }

  ngAfterContentInit(): void {
    this.bindItems();
    this.itemQuery.changes.subscribe(() => this.bindItems());
  }

  ngOnDestroy(): void {
    this.unbindScrollSpy();
  }

  get activeIndicatorTopPx(): number | null {
    const active = this.items.find((item) => this.isActive(item.href));
    if (!active) {
      return null;
    }
    return active.offsetTopPx;
  }

  registerItems(items: readonly IdsAnchorMenuItemComponent[]): void {
    this.items = [...items];
    if (this.focusedIndex >= this.items.length) {
      this.focusedIndex = Math.max(0, this.items.length - 1);
    }
    if (this.activeHref === undefined) {
      const marked = this.items.find((item) => item.active);
      if (marked && this.canNavigate(marked.href)) {
        this.activeHref = marked.href;
      }
    }
    this.notifyChange();
  }

  isActive(href: string): boolean {
    return this.activeHref !== undefined && this.activeHref === href;
  }

  canNavigate(href: string): boolean {
    return typeof href === "string" && href.trim().length > 0;
  }

  selectItem(item: IdsAnchorMenuItemComponent, event?: Event): void {
    if (!this.canNavigate(item.href)) {
      event?.preventDefault();
      return;
    }
    this.activeHref = item.href;
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.focusedIndex = index;
    }
    this.itemClick.emit(item.href);
    if (item.href.startsWith("#")) {
      event?.preventDefault();
      document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", item.href);
    }
    this.notifyChange();
  }

  onItemKeydown(event: KeyboardEvent, item: IdsAnchorMenuItemComponent): void {
    const index = this.items.indexOf(item);
    const enabledIndices = this.items
      .map((row, i) => (this.canNavigate(row.href) ? i : -1))
      .filter((i) => i >= 0);
    if (!enabledIndices.length) {
      return;
    }

    const currentPos = enabledIndices.indexOf(index);
    let targetIndex = index;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        targetIndex = enabledIndices[(Math.max(currentPos, 0) + 1) % enabledIndices.length];
        break;
      case "ArrowUp":
        event.preventDefault();
        targetIndex =
          enabledIndices[
            (Math.max(currentPos, 0) - 1 + enabledIndices.length) % enabledIndices.length
          ];
        break;
      case "Enter":
        event.preventDefault();
        this.selectItem(item, event);
        return;
      default:
        return;
    }

    this.focusedIndex = targetIndex;
    this.items[targetIndex]?.focusLink();
  }

  onItemFocus(item: IdsAnchorMenuItemComponent): void {
    this.focusedIndex = this.items.indexOf(item);
  }

  itemTabIndex(item: IdsAnchorMenuItemComponent): number {
    return this.canNavigate(item.href) ? 0 : -1;
  }

  notifyChange(): void {
    for (const item of this.items) {
      item.notifyChange();
    }
    this.cdr.markForCheck();
  }

  private bindItems(): void {
    this.registerItems(this.itemQuery.toArray());
  }

  private bindScrollSpy(): void {
    if (this.scrollSpyBound || typeof window === "undefined") {
      return;
    }
    window.addEventListener("scroll", this.onWindowScroll, { passive: true });
    this.scrollSpyBound = true;
  }

  private unbindScrollSpy(): void {
    if (!this.scrollSpyBound || typeof window === "undefined") {
      return;
    }
    window.removeEventListener("scroll", this.onWindowScroll);
    this.scrollSpyBound = false;
  }

  private readonly onWindowScroll = (): void => {
    const hashItems = this.items.filter(
      (item) => this.canNavigate(item.href) && item.href.startsWith("#"),
    );
    if (!hashItems.length) {
      return;
    }
    let current = hashItems[0]?.href;
    for (const item of hashItems) {
      const target = document.getElementById(item.href.slice(1));
      if (!target) {
        continue;
      }
      if (target.getBoundingClientRect().top <= 0) {
        current = item.href;
      }
    }
    if (current && current !== this.activeHref) {
      this.activeHref = current;
      this.notifyChange();
    }
  };
}
