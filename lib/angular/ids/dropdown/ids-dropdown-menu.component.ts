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
  @Input() showSingleSelectRadio = false;
  @Input() showSelectAllClearAll = false;
  @Input() selectAllLabel = "Select All";
  @Input() clearAllLabel = "Clear All";
  @Input() selectAllChecked = false;
  @Input() selectAllIndeterminate = false;
  @Input() clearAllDisabled = false;
  @Input() selectedValues: string[] = [];
  @Input() maxHeight?: number;
  @Input() sideOffset = 0;
  @Input() matchTriggerWidth = true;
  @Input() defaultOpen = false;
  @Input() showSearch = false;
  @Input() searchValue = "";
  @Input() searchPlaceholder = "Search";
  @Input() showSelectedPanel = false;
  @Input() showSelectedExpanded?: boolean;
  @Input() defaultShowSelectedExpanded = false;
  @Input() showSelectedLabel = "Show Selected";
  @Input() hideSelectedLabel = "Hide Selected";
  @Input() fullWidth = true;
  /** Space-separated id refs — set by `ids-dropdown` when helper/error slots register. */
  @Input() describedBy = "";

  get triggerAriaDescribedBy(): string | null {
    const ids = this.dropdown?.describedByIds() || this.describedBy;
    return ids || null;
  }

  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly searchValueChange = new EventEmitter<string>();
  @Output() readonly selectAllClick = new EventEmitter<void>();
  @Output() readonly clearAllClick = new EventEmitter<void>();
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
  }

  ngAfterContentInit(): void {
    if (this.dropdown) {
      this.selectionMode = this.dropdown.selectionMode;
      this.showSingleSelectRadio = this.dropdown.showSingleSelectRadio;
      this.selectedValues = [...this.dropdown.selectedValues];
      this.disabled = this.dropdown.disabled;
    }

    this.bindGroupListeners();
    this.rebuildResolvedItems();

    this.groupQuery.changes.subscribe(() => {
      this.bindGroupListeners();
      this.rebuildResolvedItems();
    });
    this.directItemQuery.changes.subscribe(() => this.rebuildResolvedItems());
  }

  ngAfterViewInit(): void {
    const el = this.triggerMeasure?.nativeElement;
    if (!el || !this.matchTriggerWidth) {
      return;
    }
    const updateLayout = () => this.updatePopupLayout();
    updateLayout();
    this.resizeObserver = new ResizeObserver(updateLayout);
    this.resizeObserver.observe(el);
    const field = el.querySelector(".field");
    if (field instanceof HTMLElement) {
      this.resizeObserver.observe(field);
    }
    this.rebuildResolvedItems();
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

  get selectedTagItems(): { value: string; label: string }[] {
    return this.resolvedSelectedValues.map((value) => {
      const item = this.resolvedItems.find((entry) => entry.value === value || entry.label === value);
      return { value, label: item?.label ?? value };
    });
  }

  get effectivePopupWidth(): number | undefined {
    if (!this.matchTriggerWidth || !this.triggerWidth) {
      return undefined;
    }
    return Math.max(this.triggerWidth, DROPDOWN_MENU_MIN_WIDTH_PX);
  }

  get popupStyle(): Record<string, string> {
    const width = this.effectivePopupWidth;
    if (!width) {
      return {};
    }
    const px = `${width}px`;
    return {
      width: px,
      minWidth: px,
      maxWidth: px,
      "--dropdown-trigger-width": px,
    };
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
    if (!this.maxHeight) {
      return undefined;
    }
    return { maxHeight: `${this.maxHeight}px`, overflowY: "auto" };
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
      queueMicrotask(() => this.updatePopupLayout());
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
    this.selectAllClick.emit();
  }

  onClearAll(): void {
    this.clearAllClick.emit();
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
    if (!this.matchTriggerWidth) {
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
