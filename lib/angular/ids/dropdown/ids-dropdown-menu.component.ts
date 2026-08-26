import { NgStyle } from "@angular/common";
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  inject,
} from "@angular/core";
import { Subscription } from "rxjs";
import { idsAssetUrl } from "../../../shared/ids-assets-base.js";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_DROPDOWN_CONTEXT } from "./ids-dropdown-context";
import { IdsDropdownMenuFooterComponent } from "./ids-dropdown-menu-footer.component";
import { IdsDropdownMenuGroupComponent } from "./ids-dropdown-menu-group.component";
import { IdsDropdownMenuItemComponent } from "./ids-dropdown-menu-item.component";
import { IdsDropdownTagComponent } from "./ids-dropdown-tag.component";
import { IdsDropdownTriggerShellComponent } from "./ids-dropdown-trigger-shell.component";
import type { IdsDropdownMenuItemModel, IdsDropdownSelectionMode } from "./ids-dropdown.types";

/** IDS field + menu minimum width (Figma / design-spec). */
const DROPDOWN_MENU_MIN_WIDTH_PX = 186;
const VIEWPORT_EDGE_PADDING_PX = 8;
/** Figma attached-dropdown: overlap popup top border with field bottom border. */
const DEFAULT_SIDE_OFFSET_PX = -1;
/** Option row min-height (large) — used for `maxVisibleItems` scroll math. */
const OPTION_ROW_HEIGHT_PX = 40;

let listboxIdCounter = 0;

type PopupHorizontalAlign = "start" | "end";
type PopupPlacement = "below" | "above";

@Component({
  selector: "ids-dropdown-menu",
  standalone: true,
  imports: [NgStyle, IdsIconComponent, IdsDropdownTagComponent],
  templateUrl: "./ids-dropdown-menu.component.html",
  styleUrl: "./ids-dropdown-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: IDS_DROPDOWN_CONTEXT,
      useFactory: () => inject(IDS_DROPDOWN_CONTEXT, { skipSelf: true, optional: true }),
    },
  ],
  host: {
    class: "ids-dropdown-menu",
    "[attr.data-popup-open]": "isOpen && !disabled ? true : null",
    "[attr.data-popup-side]": "isOpen && !disabled ? popupPlacement : null",
    "[class.ids-dropdown-menu--full-width]": "fullWidth",
  },
})
export class IdsDropdownMenuComponent
  implements OnChanges, AfterViewInit, AfterContentInit, OnDestroy
{
  private readonly dropdown = inject(IDS_DROPDOWN_CONTEXT, { optional: true });
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @ViewChild("triggerMeasure") triggerMeasure?: ElementRef<HTMLElement>;
  @ViewChild("compositionSource") compositionSource?: ElementRef<HTMLElement>;
  @ViewChild("searchIconEl") searchIconEl?: ElementRef<HTMLElement>;

  @ContentChild(IdsDropdownTriggerShellComponent) triggerShell?: IdsDropdownTriggerShellComponent;
  @ContentChildren(IdsDropdownMenuGroupComponent, { descendants: false })
  groupQuery!: QueryList<IdsDropdownMenuGroupComponent>;
  @ContentChildren(IdsDropdownMenuItemComponent, { descendants: false })
  directItemQuery!: QueryList<IdsDropdownMenuItemComponent>;
  @ContentChild(IdsDropdownMenuFooterComponent) footer?: IdsDropdownMenuFooterComponent;

  /** Imperative fallback when composition children are absent. */
  @Input() items: IdsDropdownMenuItemModel[] = [];

  @Input() disabled = false;
  @Input() selectionMode: IdsDropdownSelectionMode = "none";
  /** @deprecated Prefer `showRadio` (React/spec name). */
  @Input() showSingleSelectRadio = false;
  /** Spec/React alias for radio option visuals. When set, wins over `showSingleSelectRadio`. */
  @Input() showRadio?: boolean | null;
  @Input() showSelectAllClearAll = false;
  /** Spec/React: single-select Clear All row below search when a value is selected. */
  @Input() showClearAll = false;
  @Input() selectAllLabel = "Select All";
  @Input() clearAllLabel = "Clear All";
  @Input() selectAllChecked = false;
  @Input() selectAllIndeterminate = false;
  @Input() clearAllDisabled = false;
  @Input() selectedValues: string[] = [];
  @Input() maxHeight?: number;
  /**
   * Spec/React: option rows shown before the list scrolls. Default `6`.
   * Overridden when `maxHeight` is set explicitly.
   */
  @Input() maxVisibleItems = 6;
  @Input() sideOffset = DEFAULT_SIDE_OFFSET_PX;
  /** @deprecated Prefer `menuWidth` (React/spec name). */
  @Input() matchTriggerWidth = true;
  /**
   * Spec/React menu width mode.
   * `"trigger"` (default) = match field width; `"content"` = grow to widest option.
   * When set, overrides `matchTriggerWidth`.
   */
  @Input() menuWidth?: "trigger" | "content" | string;
  @Input() defaultOpen = false;
  /** @deprecated Prefer `searchable` (React/spec name). */
  @Input() showSearch = false;
  /** Spec/React alias — enables search row. When set, wins over `showSearch`. */
  @Input() searchable?: boolean | null;
  @Input() searchValue = "";
  @Input() searchPlaceholder = "Search";
  /** Spec/React: empty-search row label. */
  @Input() noResultsLabel = "No results found";
  @Input() showSelectedPanel = false;
  @Input() showSelectedExpanded?: boolean;
  @Input() defaultShowSelectedExpanded = false;
  @Input() showSelectedLabel = "Show Selected";
  @Input() hideSelectedLabel = "Hide Selected";
  @Input() fullWidth = true;
  /** Space-separated id refs — set by `ids-dropdown` when helper/error slots register. */
  @Input() describedBy = "";
  /** Spec/React a11y — forwarded to the trigger button. */
  @Input() ariaLabel?: string;
  @Input() ariaInvalid = false;
  @Input() listboxId = `ids-dropdown-listbox-${++listboxIdCounter}`;

  get triggerAriaDescribedBy(): string | null {
    const ids = this.dropdown?.describedByIds() || this.describedBy;
    return ids || null;
  }

  /** Resolved radio visibility (React `showRadio` preferred). */
  get resolvedShowRadio(): boolean {
    return this.showRadio ?? this.showSingleSelectRadio;
  }

  /** Resolved search row visibility (React `searchable` preferred). */
  get resolvedSearchable(): boolean {
    return this.searchable ?? this.showSearch;
  }

  /** Resolved trigger-width matching (React `menuWidth` preferred). */
  get resolvedMatchTriggerWidth(): boolean {
    if (this.menuWidth === "content") return false;
    if (this.menuWidth === "trigger") return true;
    return this.matchTriggerWidth;
  }

  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly searchValueChange = new EventEmitter<string>();
  /** Emits visible option values while filtering; `undefined` when no filter (React parity). */
  @Output() readonly selectAllClick = new EventEmitter<string[] | undefined>();
  /** Emits visible option values while filtering; `undefined` when no filter (React parity). */
  @Output() readonly clearAllClick = new EventEmitter<string[] | undefined>();
  @Output() readonly showSelectedExpandedChange = new EventEmitter<boolean>();
  @Output() readonly removeSelectedTag = new EventEmitter<string>();
  @Output() readonly showSelectedPanelClear = new EventEmitter<void>();

  isOpen = false;
  triggerWidth?: number;
  popupAlignment: PopupHorizontalAlign = "start";
  popupPlacement: PopupPlacement = "below";
  internalShowSelectedExpanded = false;
  resolvedItems: IdsDropdownMenuItemModel[] = [];
  private resizeObserver?: ResizeObserver;
  private groupItemSubscriptions: Subscription[] = [];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get resolvedSelectedValues(): string[] {
    if (this.dropdown?.selectedValues) {
      return [...this.dropdown.selectedValues];
    }
    return this.selectedValues;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["defaultOpen"] && changes["defaultOpen"].firstChange) {
      this.isOpen = this.defaultOpen && !this.disabled;
    }
    if (changes["defaultShowSelectedExpanded"]?.firstChange) {
      this.internalShowSelectedExpanded = this.defaultShowSelectedExpanded;
    }
    if (changes["disabled"] && this.disabled) {
      this.isOpen = false;
    }
    if (changes["items"]) {
      this.rebuildResolvedItems();
    }
    if (changes["selectedValues"]) {
      this.syncTriggerShellFilled();
    }
  }

  ngAfterContentInit(): void {
    if (this.dropdown) {
      this.selectionMode = this.dropdown.selectionMode;
      this.showSingleSelectRadio = this.dropdown.resolvedShowRadio;
      this.selectedValues = [...this.dropdown.selectedValues];
      this.disabled = this.dropdown.disabled;
    }

    this.bindGroupListeners();
    this.rebuildResolvedItems();
    this.syncTriggerShellFilled();

    this.groupQuery.changes.subscribe(() => {
      this.bindGroupListeners();
      this.rebuildResolvedItems();
    });
    this.directItemQuery.changes.subscribe(() => this.rebuildResolvedItems());
  }

  ngAfterViewInit(): void {
    const el = this.triggerMeasure?.nativeElement;
    if (el && this.resolvedMatchTriggerWidth) {
      const updateLayout = () => this.updatePopupLayout();
      updateLayout();
      this.resizeObserver = new ResizeObserver(updateLayout);
      this.resizeObserver.observe(el);
      const field = el.querySelector(".field");
      if (field instanceof HTMLElement) {
        this.resizeObserver.observe(field);
      }
    }
    this.rebuildResolvedItems();
    if (this.isOpen) {
      queueMicrotask(() => this.applySearchIconMask());
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.groupItemSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  @HostListener("window:resize")
  onWindowResize(): void {
    if (this.isOpen) {
      this.updatePopupLayout();
    }
  }

  get footerActionLabel(): string | undefined {
    return this.footer?.actionLabel;
  }

  get isShowSelectedExpandedControlled(): boolean {
    return this.showSelectedExpanded !== undefined;
  }

  get isShowSelectedExpanded(): boolean {
    return this.isShowSelectedExpandedControlled
      ? Boolean(this.showSelectedExpanded)
      : this.internalShowSelectedExpanded;
  }

  get showSearchClear(): boolean {
    return Boolean(this.searchValue?.length);
  }

  get hasSearchQuery(): boolean {
    return (this.searchValue ?? "").trim().length > 0;
  }

  /** Filtered options (case-insensitive contains) — sections/dividers hidden while searching. */
  get displayedItems(): IdsDropdownMenuItemModel[] {
    if (!this.resolvedSearchable || !this.hasSearchQuery) {
      return this.resolvedItems;
    }
    const query = this.searchValue.trim().toLowerCase();
    return this.resolvedItems.filter((item) => {
      if (item.kind === "section" || item.kind === "divider") {
        return false;
      }
      return item.label.toLowerCase().includes(query);
    });
  }

  get showNoResults(): boolean {
    return this.resolvedSearchable && this.hasSearchQuery && this.displayedItems.length === 0;
  }

  get optionRowCount(): number {
    return this.displayedItems.filter(
      (item) => item.kind !== "section" && item.kind !== "divider",
    ).length;
  }

  /** Select All / Clear All row — hidden while searching if fewer than 2 matches. */
  get showSelectAllRow(): boolean {
    return this.showSelectAllClearAll && (!this.hasSearchQuery || this.optionRowCount >= 2);
  }

  /**
   * Single-select Clear All (spec `showClearAll`): below search when a value is
   * selected; hidden while a search query is active (Figma / React parity).
   */
  get showSingleClearAllRow(): boolean {
    return (
      this.selectionMode === "single" &&
      this.showClearAll &&
      this.resolvedSelectedValues.length > 0 &&
      !this.hasSearchQuery
    );
  }

  get showSelectedPanelVisible(): boolean {
    return (
      this.showSelectedPanel &&
      this.selectionMode === "multi" &&
      this.resolvedSelectedValues.length > 0 &&
      !this.showNoResults
    );
  }

  get visibleSelectableValues(): string[] {
    return this.displayedItems
      .filter((item) => item.kind !== "section" && item.kind !== "divider" && item.selectable)
      .map((item) => item.value ?? item.label);
  }

  get effectiveSelectAllChecked(): boolean {
    if (!this.hasSearchQuery) {
      return this.selectAllChecked;
    }
    const visible = this.visibleSelectableValues;
    return (
      visible.length > 0 &&
      visible.every((value) => this.resolvedSelectedValues.includes(value))
    );
  }

  get effectiveSelectAllIndeterminate(): boolean {
    if (!this.hasSearchQuery) {
      return this.selectAllIndeterminate;
    }
    const visible = this.visibleSelectableValues;
    const some = visible.some((value) => this.resolvedSelectedValues.includes(value));
    return some && !this.effectiveSelectAllChecked;
  }

  get effectiveClearAllDisabled(): boolean {
    if (!this.hasSearchQuery) {
      return this.clearAllDisabled;
    }
    return !this.visibleSelectableValues.some((value) =>
      this.resolvedSelectedValues.includes(value),
    );
  }

  get selectedTagItems(): { value: string; label: string }[] {
    return this.resolvedSelectedValues.map((value) => {
      const item = this.resolvedItems.find((entry) => entry.value === value || entry.label === value);
      return { value, label: item?.label ?? value };
    });
  }

  get effectivePopupWidth(): number | undefined {
    if (!this.resolvedMatchTriggerWidth || !this.triggerWidth) {
      return undefined;
    }
    return Math.max(this.triggerWidth, DROPDOWN_MENU_MIN_WIDTH_PX);
  }

  get popupStyle(): Record<string, string> {
    const style: Record<string, string> = {};
    const width = this.effectivePopupWidth;
    if (width) {
      const px = `${width}px`;
      style.width = px;
      style.minWidth = px;
      style.maxWidth = px;
      style["--dropdown-trigger-width"] = px;
    }
    // Combobox popup min-height (Figma): search only 212; search + Select All 252.
    if (this.resolvedSearchable) {
      style.minHeight = this.showSelectAllRow ? "252px" : "212px";
    }
    return style;
  }

  get positionerStyle(): Record<string, string> | undefined {
    const width = this.effectivePopupWidth;
    if (!width) {
      return { marginTop: `${this.sideOffset}px` };
    }
    const px = `${width}px`;
    return {
      width: px,
      minWidth: px,
      maxWidth: px,
      "--dropdown-trigger-width": px,
      marginTop: `${this.sideOffset}px`,
    };
  }

  get optionsScrollStyle(): Record<string, string> | undefined {
    const threshold = this.maxVisibleItems;
    const effectiveMaxHeight = this.maxHeight ?? threshold * OPTION_ROW_HEIGHT_PX;
    if (this.optionRowCount > threshold || this.maxHeight != null) {
      return { maxHeight: `${effectiveMaxHeight}px`, overflowY: "auto" };
    }
    return undefined;
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) {
      return;
    }
    const target = event.target as Node | null;
    if (target && this.elementRef.nativeElement.contains(target)) {
      return;
    }
    this.setOpen(false);
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this.isOpen) {
      this.setOpen(false);
    }
  }

  toggleOpen(): void {
    if (this.disabled) {
      return;
    }
    this.setOpen(!this.isOpen);
  }

  setOpen(next: boolean): void {
    if (this.disabled && next) {
      return;
    }
    this.isOpen = next;
    this.openChange.emit(next);
    if (next) {
      queueMicrotask(() => {
        this.updatePopupLayout();
        this.applySearchIconMask();
      });
    }
    this.cdr.markForCheck();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue = value;
    this.searchValueChange.emit(value);
    this.cdr.markForCheck();
  }

  onSearchClear(): void {
    this.searchValue = "";
    this.searchValueChange.emit("");
    this.cdr.markForCheck();
  }

  onSelectAll(): void {
    this.selectAllClick.emit(this.hasSearchQuery ? this.visibleSelectableValues : undefined);
  }

  onClearAll(): void {
    this.clearAllClick.emit(this.hasSearchQuery ? this.visibleSelectableValues : undefined);
    // Multi-select Clear All collapses the menu (Figma combo-box / React parity).
    // Single-select Clear All keeps the menu open (spec).
    if (this.selectionMode === "multi") {
      this.setOpen(false);
    }
  }

  /** Apply search glyph mask via DOM — Angular sanitizes `url(...)` in bindings. */
  private applySearchIconMask(): void {
    const el = this.searchIconEl?.nativeElement;
    if (!el) {
      return;
    }
    const mask = `url("${idsAssetUrl("icons/search-16.svg")}")`;
    el.style.setProperty("mask-image", mask);
    el.style.setProperty("-webkit-mask-image", mask);
    el.style.setProperty("mask-size", "contain");
    el.style.setProperty("-webkit-mask-size", "contain");
    el.style.setProperty("mask-repeat", "no-repeat");
    el.style.setProperty("-webkit-mask-repeat", "no-repeat");
    el.style.setProperty("mask-position", "center");
    el.style.setProperty("-webkit-mask-position", "center");
  }

  onFooterAction(): void {
    this.footer?.action.emit();
  }

  toggleShowSelectedExpanded(): void {
    const next = !this.isShowSelectedExpanded;
    if (!this.isShowSelectedExpandedControlled) {
      this.internalShowSelectedExpanded = next;
    }
    this.showSelectedExpandedChange.emit(next);
    this.cdr.markForCheck();
  }

  onPanelClear(): void {
    if (this.showSelectedPanelClear.observed) {
      this.showSelectedPanelClear.emit();
    } else {
      this.clearAllClick.emit();
    }
  }

  onItemClick(item: IdsDropdownMenuItemModel, event: Event): void {
    event.stopPropagation();
    if (item.disabled) {
      return;
    }
    item.onClick?.();
    if (this.selectionMode === "single") {
      this.setOpen(false);
    }
    this.cdr.markForCheck();
  }

  isSelectableItem(item: IdsDropdownMenuItemModel): boolean {
    return Boolean(item.selectable && (this.selectionMode === "single" || this.selectionMode === "multi"));
  }

  isItemSelected(item: IdsDropdownMenuItemModel): boolean {
    if (item.selected !== undefined) {
      return item.selected;
    }
    return item.value ? this.resolvedSelectedValues.includes(item.value) : false;
  }

  itemRole(item: IdsDropdownMenuItemModel): string {
    return this.selectionMode === "multi" ? "menuitemcheckbox" : "menuitemradio";
  }

  itemAriaChecked(item: IdsDropdownMenuItemModel, selected: boolean): boolean | "mixed" {
    if (this.selectionMode === "multi" && item.indeterminate) {
      return "mixed";
    }
    return selected;
  }

  private bindGroupListeners(): void {
    this.groupItemSubscriptions.forEach((sub) => sub.unsubscribe());
    this.groupItemSubscriptions = [];
    for (const group of this.groupQuery ?? []) {
      const sub = group.itemQuery.changes.subscribe(() => this.rebuildResolvedItems());
      this.groupItemSubscriptions.push(sub);
    }
  }

  private rebuildResolvedItems(): void {
    const groups = this.groupQuery?.toArray() ?? [];
    const directItems = this.directItemQuery?.toArray() ?? [];
    const composed: IdsDropdownMenuItemModel[] = [];

    const compositionRoot = this.compositionSource?.nativeElement;
    if (compositionRoot) {
      for (const node of Array.from(compositionRoot.children)) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }
        const tag = node.tagName.toLowerCase();
        if (tag === "ids-dropdown-menu-group") {
          const group = groups.find((entry) => entry.elementRef.nativeElement === node);
          if (group) {
            composed.push(...this.withSelectionHandlers(group.toMenuModels()));
          }
          continue;
        }
        if (tag === "ids-dropdown-menu-item") {
          const item = directItems.find((entry) => entry.elementRef.nativeElement === node);
          if (item) {
            composed.push(this.withSelectionHandler(item.toMenuModel()));
          }
        }
      }
    }

    if (composed.length > 0) {
      this.resolvedItems = composed;
    } else if (this.items.length > 0) {
      this.resolvedItems = this.items.map((item) => this.withSelectionHandler(item));
    } else if (groups.length > 0 || directItems.length > 0) {
      this.resolvedItems = [
        ...groups.flatMap((group) => this.withSelectionHandlers(group.toMenuModels())),
        ...directItems.map((item) => this.withSelectionHandler(item.toMenuModel())),
      ];
    } else {
      this.resolvedItems = [];
    }

    this.cdr.markForCheck();
  }

  private withSelectionHandlers(models: IdsDropdownMenuItemModel[]): IdsDropdownMenuItemModel[] {
    return models.map((model) => this.withSelectionHandler(model));
  }

  private withSelectionHandler(model: IdsDropdownMenuItemModel): IdsDropdownMenuItemModel {
    if (model.kind === "section" || model.kind === "divider" || !model.selectable || !model.value) {
      return model;
    }
    const value = model.value;
    return {
      ...model,
      onClick: () => this.dropdown?.toggleValue(value),
    };
  }

  private updatePopupLayout(): void {
    if (!this.resolvedMatchTriggerWidth) {
      return;
    }

    const measureRoot = this.triggerMeasure?.nativeElement;
    if (!measureRoot) {
      return;
    }

    const fieldEl = measureRoot.querySelector(".field");
    const measureTarget =
      fieldEl instanceof HTMLElement ? fieldEl : measureRoot;
    const nextWidth = Math.round(measureTarget.getBoundingClientRect().width);
    const popupWidth = Math.max(nextWidth, DROPDOWN_MENU_MIN_WIDTH_PX);
    const nextAlign = this.resolvePopupAlignment(measureTarget, popupWidth, nextWidth);
    const nextPlacement = this.resolvePopupPlacement(measureTarget);

    const changed =
      this.triggerWidth !== nextWidth ||
      this.popupAlignment !== nextAlign ||
      this.popupPlacement !== nextPlacement;

    this.triggerWidth = nextWidth;
    this.popupAlignment = nextAlign;
    this.popupPlacement = nextPlacement;

    if (changed) {
      this.cdr.markForCheck();
    }
  }

  /** Keep trigger shell `filled` in sync with selection (React parity). */
  syncTriggerShellFilled(): void {
    if (!this.triggerShell) {
      return;
    }
    this.triggerShell.filled = this.resolvedSelectedValues.length > 0;
    this.triggerShell.cdr.markForCheck();
    this.cdr.markForCheck();
  }

  private resolvePopupAlignment(
    measureTarget: HTMLElement,
    popupWidth: number,
    triggerWidth: number,
  ): PopupHorizontalAlign {
    // Wider popup than trigger: anchor popup right edge to trigger right edge.
    if (popupWidth > triggerWidth) {
      return "end";
    }

    const rect = measureTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const pad = VIEWPORT_EDGE_PADDING_PX;

    const overflowsRight = rect.left + popupWidth > viewportWidth - pad;
    const fitsWhenRightAligned = rect.right - popupWidth >= pad;

    if (overflowsRight && fitsWhenRightAligned) {
      return "end";
    }

    return "start";
  }

  private resolvePopupPlacement(measureTarget: HTMLElement): PopupPlacement {
    const rect = measureTarget.getBoundingClientRect();
    const estimatedHeight = this.maxHeight ?? 220;
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_EDGE_PADDING_PX;
    const spaceAbove = rect.top - VIEWPORT_EDGE_PADDING_PX;
    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      return "above";
    }
    return "below";
  }
}
