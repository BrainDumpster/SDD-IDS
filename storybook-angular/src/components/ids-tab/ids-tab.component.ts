import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  TAB_API_DEFAULTS,
  TAB_SPEC_ACCURATE_DEFAULTS,
  computeTabOverflowMenuItems,
  computeTabOverflowVisibleCount,
  type TabSurface,
  type TabType,
} from "@component-contracts/ids/tab.contract";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_TAB_CONTEXT, type IdsTabContext } from "./ids-tab-context";
import { IdsTabItemComponent } from "./ids-tab-item.component";

@Component({
  selector: "ids-tab",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  templateUrl: "./ids-tab.component.html",
  styleUrl: "./ids-tab.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IDS_TAB_CONTEXT, useExisting: IdsTabComponent }],
})
export class IdsTabComponent
  implements OnInit, OnChanges, AfterContentInit, AfterViewInit, OnDestroy, IdsTabContext
{
  readonly addIconSlug = "state-add-circ-solid";
  readonly moreIconSlug = "arrow-tri-down-solid";

  @ContentChildren(IdsTabItemComponent) itemQuery!: QueryList<IdsTabItemComponent>;

  @ViewChild("listWrapRef") listWrapRef?: ElementRef<HTMLElement>;

  @Input() type: TabType = TAB_SPEC_ACCURATE_DEFAULTS.type;
  /** Backward-compatible alias of `type`; `type` wins when both are set. */
  @Input() variant?: TabType;
  @Input() surface: TabSurface = TAB_SPEC_ACCURATE_DEFAULTS.surface;
  @Input() activeItemId?: string;
  @Input() defaultActiveItemId = TAB_SPEC_ACCURATE_DEFAULTS.defaultActiveItemId;
  @Input() allowAddTab = TAB_API_DEFAULTS.allowAddTab;
  @Input() addTabLabel = TAB_API_DEFAULTS.addTabLabel;
  @Input() moreLabel = TAB_API_DEFAULTS.moreLabel;
  @Input() overflow = TAB_API_DEFAULTS.overflow;
  @Input() minTabWidth = TAB_API_DEFAULTS.minTabWidth;
  @Input() maxTabWidth = TAB_API_DEFAULTS.maxTabWidth;

  @Output() readonly activeItemChange = new EventEmitter<string>();
  @Output() readonly tabSelect = new EventEmitter<{ id: string; label: string }>();
  @Output() readonly addTab = new EventEmitter<void>();
  @Output() readonly overflowSelection = new EventEmitter<string>();

  visibleCount = 0;
  overflowOpen = false;
  overflowLabel: string | null = null;

  private items: IdsTabItemComponent[] = [];
  private internalActiveId: string = TAB_SPEC_ACCURATE_DEFAULTS.defaultActiveItemId;
  private focusedIndex = 0;
  private resizeObserver?: ResizeObserver;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.isControlled) {
      this.internalActiveId = this.resolveInitialActiveId();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["activeItemId"] && this.activeItemId !== undefined) {
      this.internalActiveId = this.activeItemId;
      this.cdr.markForCheck();
    }
    if (changes["defaultActiveItemId"] && this.activeItemId === undefined) {
      this.internalActiveId = this.resolveInitialActiveId();
      this.cdr.markForCheck();
    }
  }

  ngAfterContentInit(): void {
    this.bindItems();
    this.itemQuery.changes.subscribe(() => this.bindItems());
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.setupResizeObserver());
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  get resolvedType(): TabType {
    return this.type ?? this.variant ?? TAB_API_DEFAULTS.type;
  }

  get isControlled(): boolean {
    return this.activeItemId !== undefined;
  }

  get resolvedActiveId(): string {
    return this.isControlled ? (this.activeItemId ?? "") : this.internalActiveId;
  }

  get visibleItems(): IdsTabItemComponent[] {
    if (!this.overflow || this.items.length <= this.visibleCount) {
      return this.items;
    }
    return this.items.slice(0, this.visibleCount);
  }

  get hiddenItems(): IdsTabItemComponent[] {
    if (!this.overflow || this.items.length <= this.visibleCount) {
      return [];
    }
    return this.items.slice(this.visibleCount);
  }

  get overflowMenuItems(): IdsTabItemComponent[] {
    const refs = this.hiddenItems.map((item) => ({ id: item.itemId, item }));
    return computeTabOverflowMenuItems(refs, this.resolvedActiveId).map((row) => row.item);
  }

  get activeItem(): IdsTabItemComponent | undefined {
    return this.items.find((item) => item.itemId === this.resolvedActiveId) ?? this.items[0];
  }

  get overflowTriggerSelected(): boolean {
    return this.overflowLabel !== null;
  }

  isActive(item: IdsTabItemComponent): boolean {
    return item.itemId === this.resolvedActiveId;
  }

  isVisible(item: IdsTabItemComponent): boolean {
    return this.visibleItems.includes(item);
  }

  selectVisible(item: IdsTabItemComponent): void {
    if (item.disabled) {
      return;
    }
    this.activateItem(item);
    this.overflowLabel = null;
  }

  selectHidden(item: IdsTabItemComponent): void {
    if (item.disabled) {
      return;
    }
    this.activateItem(item);
    this.overflowLabel = item.label;
    this.overflowSelection.emit(item.itemId);
    this.overflowOpen = false;
    this.cdr.detectChanges();
  }

  tabId(item: IdsTabItemComponent): string {
    return `ids-tab-${item.itemId}`;
  }

  panelId(item: IdsTabItemComponent): string {
    return `ids-tab-panel-${item.itemId}`;
  }

  onTabKeydown(event: KeyboardEvent, item: IdsTabItemComponent): void {
    const visible = this.visibleItems;
    const enabled = visible.filter((row) => !row.disabled);
    if (!enabled.length) {
      return;
    }

    const currentPos = enabled.indexOf(item);
    let target = item;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        target = enabled[(currentPos + 1) % enabled.length];
        break;
      case "ArrowLeft":
        event.preventDefault();
        target = enabled[(currentPos - 1 + enabled.length) % enabled.length];
        break;
      case "Home":
        event.preventDefault();
        target = enabled[0];
        break;
      case "End":
        event.preventDefault();
        target = enabled[enabled.length - 1];
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        this.selectVisible(item);
        return;
      default:
        return;
    }

    this.focusedIndex = visible.indexOf(target);
    document.getElementById(this.tabId(target))?.focus();
  }

  tabTabIndex(item: IdsTabItemComponent): number {
    const visible = this.visibleItems;
    const index = visible.indexOf(item);
    return index === this.focusedIndex ? 0 : -1;
  }

  onTabFocus(item: IdsTabItemComponent): void {
    this.focusedIndex = this.visibleItems.indexOf(item);
  }

  toggleOverflowMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const willOpen = !this.overflowOpen;
    if (willOpen && this.overflowMenuItems.length === 0) {
      return;
    }
    this.overflowOpen = willOpen;
    this.cdr.detectChanges();
  }

  closeOverflowMenu(): void {
    this.overflowOpen = false;
    this.cdr.markForCheck();
  }

  onAddTabClick(): void {
    this.addTab.emit();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (!this.overflowOpen) {
      return;
    }
    const target = event.target as Node | null;
    if (!target) {
      return;
    }
    const moreRoot = this.listWrapRef?.nativeElement.querySelector(".ids-tab__more");
    if (moreRoot?.contains(target)) {
      return;
    }
    this.closeOverflowMenu();
    this.cdr.detectChanges();
  }

  private setupResizeObserver(): void {
    const list = this.listWrapRef?.nativeElement;
    if (!list) {
      return;
    }

    this.resizeObserver?.disconnect();

    if (typeof ResizeObserver === "undefined") {
      this.applyVisibleCount(this.items.length);
      return;
    }

    const recompute = () => {
      const available = list.clientWidth;
      if (available <= 0) {
        requestAnimationFrame(() => recompute());
        return;
      }
      const next = computeTabOverflowVisibleCount({
        containerWidth: available,
        itemCount: this.items.length,
        overflow: this.overflow,
        allowAddTab: this.allowAddTab,
        addTabLabel: this.addTabLabel,
        minTabWidth: this.minTabWidth,
      });
      this.applyVisibleCount(next);
    };

    recompute();
    this.resizeObserver = new ResizeObserver(() => recompute());
    this.resizeObserver.observe(list);
  }

  private applyVisibleCount(next: number): void {
    if (next === this.visibleCount) {
      return;
    }
    this.visibleCount = next;
    if (this.hiddenItems.length === 0 && this.overflowLabel !== null) {
      this.overflowLabel = null;
    }
    this.cdr.markForCheck();
  }

  private bindItems(): void {
    this.items = this.itemQuery.toArray();
    if (!this.items.some((item) => item.itemId === this.resolvedActiveId)) {
      this.internalActiveId = this.resolveInitialActiveId();
    }
    this.visibleCount = this.items.length;
    requestAnimationFrame(() => this.setupResizeObserver());
    this.cdr.markForCheck();
  }

  private resolveInitialActiveId(): string {
    const preferred = this.defaultActiveItemId;
    const preferredItem = this.items.find((item) => item.itemId === preferred && !item.disabled);
    if (preferredItem) {
      return preferredItem.itemId;
    }
    return this.items.find((item) => !item.disabled)?.itemId ?? "";
  }

  private activateItem(item: IdsTabItemComponent): void {
    if (!this.isControlled) {
      this.internalActiveId = item.itemId;
    }
    this.activeItemChange.emit(item.itemId);
    this.tabSelect.emit({ id: item.itemId, label: item.label });
    this.cdr.markForCheck();
  }
}
