import {
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
  type IdsPaginationDropdownState,
} from "@component-contracts/ids/pagination.contract";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizePositiveOptions(options: number[]): number[] {
  const uniquePositive = Array.from(
    new Set(options.filter((value) => Number.isFinite(value) && value > 0)),
  );
  return uniquePositive.length > 0 ? uniquePositive : [25, 50, 75, 100];
}

type PaginationMenuPos = { top: number; left: number; width: number };

@Component({
  selector: "ids-pagination",
  standalone: true,
  imports: [NgClass, IdsIconComponent],
  templateUrl: "./ids-pagination.component.html",
  styleUrl: "./ids-pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsPaginationComponent implements OnChanges, OnDestroy {
  readonly navIconSize = 16;
  readonly caretIconSize = 10;

  @ViewChild("perPageTrigger") perPageTrigger?: ElementRef<HTMLButtonElement>;
  @ViewChild("perPageMenuLayer") perPageMenuLayer?: ElementRef<HTMLElement>;
  @ViewChild("pageOffsetTrigger") pageOffsetTrigger?: ElementRef<HTMLButtonElement>;
  @ViewChild("pageOffsetMenuLayer") pageOffsetMenuLayer?: ElementRef<HTMLElement>;

  @Input() currentPage = PAGINATION_SPEC_ACCURATE_DEFAULTS.currentPage;
  @Input() totalPages = PAGINATION_SPEC_ACCURATE_DEFAULTS.totalPages;
  @Input() pageSize = PAGINATION_SPEC_ACCURATE_DEFAULTS.pageSize;
  @Input() pageSizeOptions: number[] = [
    ...PAGINATION_SPEC_ACCURATE_DEFAULTS.pageSizeOptions,
  ];
  @Input() pageOffsetOptions: number[] | null = null;
  @Input() showPerPage = PAGINATION_SPEC_ACCURATE_DEFAULTS.showPerPage;
  @Input() showFirstLast = PAGINATION_SPEC_ACCURATE_DEFAULTS.showFirstLast;
  @Input() showPageOffset = PAGINATION_SPEC_ACCURATE_DEFAULTS.showPageOffset;
  @Input() dropdownState: IdsPaginationDropdownState =
    PAGINATION_SPEC_ACCURATE_DEFAULTS.dropdownState;
  @Input() pageOffsetDropdownState: IdsPaginationDropdownState =
    PAGINATION_SPEC_ACCURATE_DEFAULTS.pageOffsetDropdownState;
  @Input() background: IdsPaginationBackground =
    PAGINATION_SPEC_ACCURATE_DEFAULTS.background;
  @Input() embeddedInDatagrid = false;
  @Input() disabled = PAGINATION_SPEC_ACCURATE_DEFAULTS.disabled;

  @Output() readonly pageChange = new EventEmitter<number>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();
  @Output() readonly firstPageNavigate = new EventEmitter<void>();
  @Output() readonly previousPageNavigate = new EventEmitter<void>();
  @Output() readonly nextPageNavigate = new EventEmitter<void>();
  @Output() readonly lastPageNavigate = new EventEmitter<void>();

  perPageMenuOpen = false;
  pageOffsetMenuOpen = false;
  pageInputValue = String(this.currentPage);
  perPageMenuPos: PaginationMenuPos | null = null;
  pageOffsetMenuPos: PaginationMenuPos | null = null;

  private overlayRepositionCleanup: (() => void) | null = null;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get safeTotalPages(): number {
    return Math.max(1, this.totalPages);
  }

  get safeCurrentPage(): number {
    return clamp(this.currentPage, 1, this.safeTotalPages);
  }

  get safePageSizeOptions(): number[] {
    return normalizePositiveOptions(this.pageSizeOptions);
  }

  get safePageSize(): number {
    return this.safePageSizeOptions.includes(this.pageSize)
      ? this.pageSize
      : this.safePageSizeOptions[0];
  }

  get offsetOptions(): number[] {
    if (this.pageOffsetOptions && this.pageOffsetOptions.length > 0) {
      return normalizePositiveOptions(this.pageOffsetOptions).map((value) =>
        clamp(value, 1, this.safeTotalPages),
      );
    }
    return Array.from({ length: this.safeTotalPages }, (_, index) => index + 1);
  }

  get atFirstPage(): boolean {
    return this.safeCurrentPage <= 1;
  }

  get atLastPage(): boolean {
    return this.safeCurrentPage >= this.safeTotalPages;
  }

  get resolvedPerPageDropdownState(): IdsPaginationDropdownState {
    if (this.dropdownState !== "collapsed") {
      return this.dropdownState;
    }
    return this.perPageMenuOpen ? "expanded-below" : "collapsed";
  }

  get resolvedPageOffsetDropdownState(): IdsPaginationDropdownState {
    if (this.pageOffsetDropdownState !== "collapsed") {
      return this.pageOffsetDropdownState;
    }
    return this.pageOffsetMenuOpen ? "expanded-below" : "collapsed";
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
      this.bindOverlayRepositionListeners();
      this.scheduleOverlayPortalAndPosition("perPage");
    }
    if (this.resolvedPageOffsetDropdownState !== "collapsed") {
      this.bindOverlayRepositionListeners();
      this.scheduleOverlayPortalAndPosition("pageOffset");
    }
  }

  ngOnDestroy(): void {
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
    this.closePageOffsetMenu();
    this.perPageMenuOpen = !this.perPageMenuOpen;
    if (this.perPageMenuOpen) {
      this.bindOverlayRepositionListeners();
      this.scheduleOverlayPortalAndPosition("perPage");
    } else {
      this.closePerPageMenu();
    }
    this.cdr.markForCheck();
  }

  closePerPageMenu(): void {
    this.perPageMenuOpen = false;
    this.perPageMenuPos = null;
    if (this.resolvedPageOffsetDropdownState === "collapsed") {
      this.unbindOverlayRepositionListeners();
    }
    this.cdr.markForCheck();
  }

  selectPageSize(size: number): void {
    this.pageSizeChange.emit(size);
    this.closePerPageMenu();
  }

  togglePageOffsetMenu(): void {
    if (this.disabled) return;
    this.closePerPageMenu();
    this.pageOffsetMenuOpen = !this.pageOffsetMenuOpen;
    if (this.pageOffsetMenuOpen) {
      this.bindOverlayRepositionListeners();
      this.scheduleOverlayPortalAndPosition("pageOffset");
    } else {
      this.closePageOffsetMenu();
    }
    this.cdr.markForCheck();
  }

  closePageOffsetMenu(): void {
    this.pageOffsetMenuOpen = false;
    this.pageOffsetMenuPos = null;
    if (this.resolvedPerPageDropdownState === "collapsed") {
      this.unbindOverlayRepositionListeners();
    }
    this.cdr.markForCheck();
  }

  selectPageOffset(page: number): void {
    this.goToPage(page);
    this.closePageOffsetMenu();
  }

  onPerPageTriggerBlur(event: FocusEvent): void {
    const nextTarget = event.relatedTarget as HTMLElement | null;
    if (nextTarget?.closest("[data-ids-pagination-per-page-menu]")) return;
    this.closePerPageMenu();
  }

  onPageOffsetTriggerBlur(event: FocusEvent): void {
    const nextTarget = event.relatedTarget as HTMLElement | null;
    if (nextTarget?.closest("[data-ids-pagination-page-offset-menu]")) return;
    this.closePageOffsetMenu();
  }

  @HostListener("window:resize")
  @HostListener("window:scroll")
  onViewportChange(): void {
    if (this.resolvedPerPageDropdownState !== "collapsed") {
      this.updatePerPageMenuPos();
    }
    if (this.resolvedPageOffsetDropdownState !== "collapsed") {
      this.updatePageOffsetMenuPos();
    }
    this.cdr.markForCheck();
  }

  private updatePerPageMenuPos(): void {
    const trigger = this.perPageTrigger?.nativeElement;
    const menu = this.perPageMenuLayer?.nativeElement;
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

  private updatePageOffsetMenuPos(): void {
    const trigger = this.pageOffsetTrigger?.nativeElement;
    const menu = this.pageOffsetMenuLayer?.nativeElement;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = rect.width;
    const left = rect.left;
    if (this.resolvedPageOffsetDropdownState === "expanded-above") {
      const menuHeight = menu?.getBoundingClientRect().height ?? 0;
      this.pageOffsetMenuPos = { top: rect.top + 1 - menuHeight, left, width };
      return;
    }
    this.pageOffsetMenuPos = { top: rect.top + rect.height - 1, left, width };
  }

  private portalToBody(el: HTMLElement | undefined): void {
    if (el && el.parentElement !== document.body) {
      document.body.appendChild(el);
    }
  }

  private scheduleOverlayPortalAndPosition(kind: "perPage" | "pageOffset"): void {
    requestAnimationFrame(() => {
      if (kind === "perPage" && this.resolvedPerPageDropdownState === "collapsed") return;
      if (kind === "pageOffset" && this.resolvedPageOffsetDropdownState === "collapsed") return;

      if (kind === "perPage") {
        this.portalToBody(this.perPageMenuLayer?.nativeElement);
        this.updatePerPageMenuPos();
      } else {
        this.portalToBody(this.pageOffsetMenuLayer?.nativeElement);
        this.updatePageOffsetMenuPos();
      }
      this.cdr.markForCheck();

      requestAnimationFrame(() => {
        if (kind === "perPage" && this.resolvedPerPageDropdownState === "collapsed") return;
        if (kind === "pageOffset" && this.resolvedPageOffsetDropdownState === "collapsed") return;
        if (kind === "perPage") {
          this.updatePerPageMenuPos();
        } else {
          this.updatePageOffsetMenuPos();
        }
        this.cdr.markForCheck();
      });
    });
  }

  private bindOverlayRepositionListeners(): void {
    if (this.overlayRepositionCleanup) return;
    const onUpdate = () => {
      let changed = false;
      if (this.resolvedPerPageDropdownState !== "collapsed") {
        this.updatePerPageMenuPos();
        changed = true;
      }
      if (this.resolvedPageOffsetDropdownState !== "collapsed") {
        this.updatePageOffsetMenuPos();
        changed = true;
      }
      if (changed) this.cdr.markForCheck();
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
}
