import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import { NgClass } from "@angular/common";
import {
  PAGINATION_SPEC_ACCURATE_DEFAULTS,
  type IdsPaginationBackground,
  type IdsPaginationCollapseSlot,
  type IdsPaginationDropdownState,
  type IdsPaginationResponsiveMode,
} from "@component-contracts/ids/pagination.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";

const DEFAULT_COLLAPSE_ORDER: IdsPaginationCollapseSlot[] = ["results-per-page"];
const COLLAPSE_SLOTS = new Set<IdsPaginationCollapseSlot>([
  "results-per-page",
  "page-input",
  "first-last-buttons",
]);

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizePageSizeOptions(options: number[] | undefined): number[] {
  if (!options || options.length === 0) {
    return [...PAGINATION_SPEC_ACCURATE_DEFAULTS.pageSizeOptions];
  }
  const uniquePositive = Array.from(
    new Set(options.filter((value) => Number.isFinite(value) && value > 0)),
  );
  return uniquePositive.length > 0
    ? uniquePositive
    : [...PAGINATION_SPEC_ACCURATE_DEFAULTS.pageSizeOptions];
}

function resolveResponsiveMode(
  value: IdsPaginationResponsiveMode | string | undefined,
): IdsPaginationResponsiveMode {
  return value === "keep-inline" ? "keep-inline" : "auto";
}

function resolveCollapseOrder(
  value: IdsPaginationCollapseSlot[] | undefined,
): IdsPaginationCollapseSlot[] {
  if (!value || value.length === 0) return [...DEFAULT_COLLAPSE_ORDER];
  const filtered = value.filter((slot) => COLLAPSE_SLOTS.has(slot));
  return filtered.length > 0 ? filtered : [...DEFAULT_COLLAPSE_ORDER];
}

function defaultPageCountText(_currentPage: number, totalPages: number): string {
  if (totalPages <= 1) return "1 page";
  return `of ${totalPages}`;
}

type PerPageMenuPlacement = "below" | "above";
type PaginationMenuPos = { top: number; left: number; width: number };

@Component({
  selector: "ids-pagination",
  standalone: true,
  imports: [NgClass, IdsIconComponent],
  templateUrl: "./ids-pagination.component.html",
  styleUrl: "./ids-pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsPaginationComponent implements OnChanges, AfterViewInit, OnDestroy {
  readonly navIconSize = 16;
  readonly caretIconSize = 10;
  readonly caretIconShape = "arrow-drop-tri-caret";
  readonly firstPageIconShape = "double-chev-left";
  readonly previousPageIconShape = "chev-left";
  readonly nextPageIconShape = "chev-right";
  readonly lastPageIconShape = "double-chev-right";

  @ViewChild("root") rootRef?: ElementRef<HTMLElement>;
  @ViewChild("perPageTrigger") perPageTrigger?: ElementRef<HTMLButtonElement>;
  @ViewChild("perPageMenu") perPageMenu?: ElementRef<HTMLUListElement>;

  @Input() currentPage = PAGINATION_SPEC_ACCURATE_DEFAULTS.currentPage;
  @Input() totalPages = PAGINATION_SPEC_ACCURATE_DEFAULTS.totalPages;
  @Input() pageSize = PAGINATION_SPEC_ACCURATE_DEFAULTS.pageSize;
  @Input() pageSizeOptions: number[] = [
    ...PAGINATION_SPEC_ACCURATE_DEFAULTS.pageSizeOptions,
  ];
  @Input() showPerPage = PAGINATION_SPEC_ACCURATE_DEFAULTS.showPerPage;
  /** When `false`, hides first/last nav buttons (Storybook override; React lib always shows unless responsively collapsed). */
  @Input() showFirstLast = PAGINATION_SPEC_ACCURATE_DEFAULTS.showFirstLast;
  /** Demo/testing only — forces per-page menu open state and placement. */
  @Input() dropdownState: IdsPaginationDropdownState =
    PAGINATION_SPEC_ACCURATE_DEFAULTS.dropdownState;
  @Input() background: IdsPaginationBackground =
    PAGINATION_SPEC_ACCURATE_DEFAULTS.background;
  @Input() embeddedInDatagrid = false;
  @Input() disabled = PAGINATION_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() responsiveMode: IdsPaginationResponsiveMode =
    PAGINATION_SPEC_ACCURATE_DEFAULTS.responsiveMode;
  @Input() collapseOrder: IdsPaginationCollapseSlot[] = [
    ...PAGINATION_SPEC_ACCURATE_DEFAULTS.collapseOrder,
  ];
  @Input() summaryFormatter?: (currentPage: number, totalPages: number) => string;

  @Output() readonly pageChange = new EventEmitter<number>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();
  @Output() readonly firstPageNavigate = new EventEmitter<void>();
  @Output() readonly previousPageNavigate = new EventEmitter<void>();
  @Output() readonly nextPageNavigate = new EventEmitter<void>();
  @Output() readonly lastPageNavigate = new EventEmitter<void>();

  perPageMenuOpen = false;
  menuPlacement: PerPageMenuPlacement = "below";
  pageInputValue = String(this.currentPage);
  collapseLevel = 0;
  perPageMenuPos: PaginationMenuPos | null = null;

  private resizeObserver?: ResizeObserver;
  private overlayRepositionCleanup: (() => void) | null = null;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get safeTotalPages(): number {
    return Math.max(1, this.totalPages);
  }

  get safeCurrentPage(): number {
    return clamp(this.currentPage, 1, this.safeTotalPages);
  }

  get safePageSizeOptions(): number[] {
    return normalizePageSizeOptions(this.pageSizeOptions);
  }

  get safePageSize(): number {
    return this.safePageSizeOptions.includes(this.pageSize)
      ? this.pageSize
      : this.safePageSizeOptions[0];
  }

  get atFirstPage(): boolean {
    return this.safeCurrentPage <= 1;
  }

  get atLastPage(): boolean {
    return this.safeCurrentPage >= this.safeTotalPages;
  }

  get isSinglePage(): boolean {
    return this.safeTotalPages <= 1;
  }

  get resolvedResponsiveMode(): IdsPaginationResponsiveMode {
    return resolveResponsiveMode(this.responsiveMode);
  }

  get resolvedCollapseOrder(): IdsPaginationCollapseSlot[] {
    return resolveCollapseOrder(this.collapseOrder);
  }

  get resolvedPerPageDropdownState(): IdsPaginationDropdownState {
    if (this.dropdownState !== "collapsed") {
      return this.dropdownState;
    }
    if (!this.perPageMenuOpen) return "collapsed";
    return this.menuPlacement === "above" ? "expanded-above" : "expanded-below";
  }

  get collapsedSlots(): Set<IdsPaginationCollapseSlot> {
    return new Set(this.resolvedCollapseOrder.slice(0, this.collapseLevel));
  }

  get renderResultsGroup(): boolean {
    return this.showPerPage && !this.collapsedSlots.has("results-per-page");
  }

  get pageInputCollapsed(): boolean {
    return this.collapsedSlots.has("page-input");
  }

  get firstLastCollapsed(): boolean {
    return !this.showFirstLast || this.collapsedSlots.has("first-last-buttons");
  }

  get countText(): string {
    return (
      this.summaryFormatter?.(this.safeCurrentPage, this.safeTotalPages) ??
      defaultPageCountText(this.safeCurrentPage, this.safeTotalPages)
    );
  }

  get caretIconColor(): string {
    return this.disabled
      ? "var(--color-icon-gray-disabled)"
      : "var(--color-icon-gray-neutral-base)";
  }

  get rootClass(): Record<string, boolean> {
    return {
      rootWhite: this.background === "white",
      rootNone: this.background === "none",
      rootGray: this.background === "gray",
      rootEmbedded: this.embeddedInDatagrid,
    };
  }

  ngOnChanges(): void {
    this.pageInputValue = String(this.safeCurrentPage);
    if (this.resolvedPerPageDropdownState !== "collapsed") {
      this.perPageMenuOpen = true;
      this.bindOverlayRepositionListeners();
      this.scheduleOverlayPortalAndPosition();
    }
    this.scheduleResponsiveCheck();
  }

  ngAfterViewInit(): void {
    this.setupResponsiveObserver();
    this.scheduleResponsiveCheck();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.unbindOverlayRepositionListeners();
  }

  goToPage(nextPage: number): void {
    if (this.disabled) return;
    const clamped = clamp(nextPage, 1, this.safeTotalPages);
    this.pageInputValue = String(clamped);
    this.pageChange.emit(clamped);
  }

  onFirstPage(): void {
    if (this.disabled || this.atFirstPage) return;
    this.firstPageNavigate.emit();
    this.goToPage(1);
  }

  onPreviousPage(): void {
    if (this.disabled || this.atFirstPage) return;
    this.previousPageNavigate.emit();
    this.goToPage(this.safeCurrentPage - 1);
  }

  onNextPage(): void {
    if (this.disabled || this.atLastPage) return;
    this.nextPageNavigate.emit();
    this.goToPage(this.safeCurrentPage + 1);
  }

  onLastPage(): void {
    if (this.disabled || this.atLastPage) return;
    this.lastPageNavigate.emit();
    this.goToPage(this.safeTotalPages);
  }

  onPageInputChange(value: string): void {
    this.pageInputValue = value.replace(/[^\d]/g, "");
  }

  commitPageInput(): void {
    const parsed = Number.parseInt(this.pageInputValue, 10);
    if (!Number.isFinite(parsed)) {
      this.pageInputValue = String(this.safeCurrentPage);
      return;
    }
    this.goToPage(parsed);
  }

  onPageInputKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.commitPageInput();
      (event.target as HTMLInputElement | null)?.blur();
    }
  }

  togglePerPageMenu(): void {
    if (this.disabled) return;
    this.perPageMenuOpen = !this.perPageMenuOpen;
    if (this.perPageMenuOpen) {
      this.bindOverlayRepositionListeners();
      this.scheduleOverlayPortalAndPosition();
    } else {
      this.closePerPageMenu();
    }
    this.cdr.markForCheck();
  }

  closePerPageMenu(): void {
    if (this.dropdownState !== "collapsed") return;
    this.perPageMenuOpen = false;
    this.perPageMenuPos = null;
    this.unbindOverlayRepositionListeners();
    this.cdr.markForCheck();
  }

  selectPageSize(size: number): void {
    this.pageSizeChange.emit(size);
    this.closePerPageMenu();
  }

  @HostListener("document:keydown", ["$event"])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== "Escape" || this.resolvedPerPageDropdownState === "collapsed") {
      return;
    }
    this.closePerPageMenu();
    this.perPageTrigger?.nativeElement.focus();
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMouseDown(event: MouseEvent): void {
    if (this.resolvedPerPageDropdownState === "collapsed") return;
    const target = event.target as Node | null;
    if (!target) return;
    if (this.perPageTrigger?.nativeElement.contains(target)) return;
    if (this.perPageMenu?.nativeElement.contains(target)) return;
    if ((target as HTMLElement).closest?.("[data-ids-pagination-per-page-menu]")) return;
    this.closePerPageMenu();
  }

  @HostListener("window:resize")
  @HostListener("window:scroll")
  onViewportChange(): void {
    if (this.resolvedPerPageDropdownState !== "collapsed") {
      this.syncMenuPlacement();
      this.updatePerPageMenuPos();
      this.cdr.markForCheck();
    }
  }

  private syncMenuPlacement(): void {
    if (this.dropdownState === "expanded-above") {
      this.menuPlacement = "above";
      return;
    }
    if (this.dropdownState === "expanded-below") {
      this.menuPlacement = "below";
      return;
    }

    const trigger = this.perPageTrigger?.nativeElement;
    if (!trigger) {
      this.menuPlacement = "below";
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : rect.bottom + 200;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedMenuHeight = Math.max(
      this.perPageMenu?.nativeElement.offsetHeight ?? 0,
      this.safePageSizeOptions.length * 40,
    );

    this.menuPlacement =
      spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? "above" : "below";
  }

  private updatePerPageMenuPos(): void {
    const trigger = this.perPageTrigger?.nativeElement;
    const menu = this.perPageMenu?.nativeElement;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = rect.width;
    const left = rect.left;
    if (this.resolvedPerPageDropdownState === "expanded-above") {
      const menuHeight = menu?.getBoundingClientRect().height ?? 0;
      this.perPageMenuPos = { top: rect.top + 1 - menuHeight, left, width };
      return;
    }
    this.perPageMenuPos = { top: rect.top + rect.height - 1, left, width };
  }

  private portalToBody(el: HTMLElement | undefined): void {
    if (el && el.parentElement !== document.body) {
      document.body.appendChild(el);
    }
  }

  private scheduleOverlayPortalAndPosition(): void {
    requestAnimationFrame(() => {
      if (this.resolvedPerPageDropdownState === "collapsed") return;
      this.syncMenuPlacement();
      this.portalToBody(this.perPageMenu?.nativeElement);
      this.updatePerPageMenuPos();
      this.cdr.markForCheck();

      requestAnimationFrame(() => {
        if (this.resolvedPerPageDropdownState === "collapsed") return;
        this.updatePerPageMenuPos();
        this.cdr.markForCheck();
      });
    });
  }

  private bindOverlayRepositionListeners(): void {
    if (this.overlayRepositionCleanup) return;
    const onUpdate = () => {
      if (this.resolvedPerPageDropdownState === "collapsed") return;
      this.syncMenuPlacement();
      this.updatePerPageMenuPos();
      this.cdr.markForCheck();
    };
    window.addEventListener("resize", onUpdate);
    window.addEventListener("scroll", onUpdate, true);
    this.overlayRepositionCleanup = () => {
      window.removeEventListener("resize", onUpdate);
      window.removeEventListener("scroll", onUpdate, true);
      this.overlayRepositionCleanup = null;
    };
  }

  private unbindOverlayRepositionListeners(): void {
    this.overlayRepositionCleanup?.();
    this.overlayRepositionCleanup = null;
  }

  private setupResponsiveObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;

    if (this.resolvedResponsiveMode !== "auto") {
      this.collapseLevel = 0;
      return;
    }

    const root = this.rootRef?.nativeElement;
    if (!root || typeof ResizeObserver === "undefined") return;

    this.resizeObserver = new ResizeObserver(() => {
      this.collapseLevel = 0;
      this.cdr.markForCheck();
      requestAnimationFrame(() => this.checkResponsiveCollapse());
    });
    this.resizeObserver.observe(root);
  }

  private scheduleResponsiveCheck(): void {
    requestAnimationFrame(() => {
      if (this.resolvedResponsiveMode !== "auto") {
        this.collapseLevel = 0;
        this.cdr.markForCheck();
        return;
      }
      this.collapseLevel = 0;
      this.checkResponsiveCollapse();
    });
  }

  private checkResponsiveCollapse(): void {
    if (this.resolvedResponsiveMode !== "auto") return;
    const root = this.rootRef?.nativeElement;
    if (!root) return;
    if (root.scrollWidth <= root.clientWidth + 1) {
      this.cdr.markForCheck();
      return;
    }
    const order = this.resolvedCollapseOrder;
    if (this.collapseLevel < order.length) {
      this.collapseLevel += 1;
      this.cdr.markForCheck();
      requestAnimationFrame(() => this.checkResponsiveCollapse());
    }
  }
}
