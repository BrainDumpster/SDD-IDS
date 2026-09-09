/**
 * IDS App Launcher — Angular implementation for Masthead / App Shell composition.
 * Source: `components/ids/app-launcher/design-spec.md`
 * Spec Accurate sample: `triggerVariant="masthead"` + two products (App Shell design-spec).
 *
 * Popup is portaled to `document.body` so App Shell `overflow: hidden` cannot clip it
 * (React uses Popover.Portal + Positioner align="end").
 *
 * Portal nodes are tagged and removed on close/destroy so Storybook story changes
 * cannot leave an open panel behind.
 */
import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  APP_LAUNCHER_DEFAULT_PRODUCT_ICON,
  APP_LAUNCHER_TRIGGER_ICON,
  type IdsAppLauncherProduct,
  type IdsAppLauncherProgramme,
  type IdsAppLauncherTriggerVariant,
} from "./ids-app-launcher.types";

let launcherPortalSeq = 0;

@Component({
  selector: "ids-app-launcher",
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet, IdsIconComponent],
  templateUrl: "./ids-app-launcher.component.html",
  styleUrl: "./ids-app-launcher.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ids-app-launcher-host",
    "[attr.data-ids]": "'IdsAppLauncher'",
  },
})
export class IdsAppLauncherComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @Input() products: IdsAppLauncherProduct[] = [];
  /** Unknown → `ids`. Drives Synapse tile chrome on the portaled surface. */
  @Input() programme: IdsAppLauncherProgramme | string = "ids";
  @Input() triggerVariant: IdsAppLauncherTriggerVariant = "default";
  @Input() sideOffset = 8;
  @Input() columns = 2;
  @Input() ariaLabel = "App launcher";
  @Input() defaultOpen = false;
  @Input() openInput?: boolean;

  get resolvedProgramme(): IdsAppLauncherProgramme {
    return this.programme === "synapse" ? "synapse" : "ids";
  }

  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly productSelect = new EventEmitter<IdsAppLauncherProduct>();

  @ViewChild("triggerBtn", { read: ElementRef })
  private triggerBtn?: ElementRef<HTMLButtonElement>;

  @ViewChild("popupPanel", { read: ElementRef })
  private popupPanel?: ElementRef<HTMLElement>;

  readonly triggerIcon = APP_LAUNCHER_TRIGGER_ICON;
  readonly portalId = `ids-app-launcher-portal-${++launcherPortalSeq}`;

  get triggerIconColor(): string | undefined {
    return this.triggerVariant === "masthead"
      ? undefined
      : "var(--color-text-gray-neutral-strong)";
  }

  private internalOpen = false;
  popupStyle: Record<string, string> = {};

  private unlistenPointerDown: (() => void) | null = null;
  private unlistenKeydown: (() => void) | null = null;
  private unlistenResize: (() => void) | null = null;
  private unlistenScroll: (() => void) | null = null;
  /** Suppress outside-close for the opening pointer gesture. */
  private ignoreOutsideCloseUntil = 0;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly renderer: Renderer2,
  ) {
    this.internalOpen = this.defaultOpen;
  }

  get open(): boolean {
    return this.openInput !== undefined ? this.openInput : this.internalOpen;
  }

  /** Off-screen measurement labels (one per product) for the long-name reflow. */
  @ViewChildren("measureLabel")
  private measureLabels?: QueryList<ElementRef<HTMLElement>>;

  /** Body 2 line-height used to convert measured height into a line count. */
  private static readonly LABEL_LINE_HEIGHT = 20;

  /** Product keys whose name overflows its line budget → rendered full-width. */
  private fullWidthKeys = new Set<string>();

  reflowKey(product: IdsAppLauncherProduct, index: number): string {
    return product.id && product.id.trim() ? product.id : `idx-${index}`;
  }

  isFullWidth(product: IdsAppLauncherProduct, index: number): boolean {
    return this.fullWidthKeys.has(this.reflowKey(product, index));
  }

  /** Pack products into rows: a full-width (long-name) product takes its own row;
      the rest fill `columns`-per-row. No options region here, so no overflow. */
  get rows(): IdsAppLauncherProduct[][] {
    const cols = Math.max(1, this.columns);
    const rows: IdsAppLauncherProduct[][] = [];
    let current: IdsAppLauncherProduct[] = [];
    const flush = () => {
      if (current.length) {
        rows.push(current);
        current = [];
      }
    };
    this.products.forEach((product, index) => {
      if (this.isFullWidth(product, index)) {
        flush();
        rows.push([product]);
      } else {
        current.push(product);
        if (current.length === cols) flush();
      }
    });
    flush();
    return rows;
  }

  get useTwoProductLayout(): boolean {
    return this.products.length === 2;
  }

  get useSingleProductWidth(): boolean {
    return this.products.length === 1;
  }

  get useTwoProductInternalRail(): boolean {
    return this.useTwoProductLayout;
  }

  productIconSlug(product: IdsAppLauncherProduct): string {
    if (product.iconSlug === null || product.iconSlug === "") {
      return APP_LAUNCHER_DEFAULT_PRODUCT_ICON;
    }
    return product.iconSlug ?? APP_LAUNCHER_DEFAULT_PRODUCT_ICON;
  }

  isNoIcon(product: IdsAppLauncherProduct): boolean {
    return product.iconSlug === "";
  }

  ngAfterViewChecked(): void {
    const labels = this.measureLabels;
    if (!labels) return;
    const next = new Set<string>();
    labels.forEach((ref) => {
      const el = ref.nativeElement;
      const key = el.dataset["reflowKey"];
      if (!key) return;
      const budget = el.dataset["reflowBudget"] === "3" ? 3 : 1;
      const lines = Math.round(
        el.scrollHeight / IdsAppLauncherComponent.LABEL_LINE_HEIGHT,
      );
      if (lines > budget) next.add(key);
    });
    const changed =
      next.size !== this.fullWidthKeys.size ||
      ![...next].every((k) => this.fullWidthKeys.has(k));
    if (changed) {
      this.fullWidthKeys = next;
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    if (typeof document === "undefined") return;
    // Capture phase so outside clicks close even when other handlers stopPropagation.
    const onPointerDown = (event: Event) => this.onDocumentPointerDown(event as PointerEvent);
    const onKeyDown = (event: Event) => {
      const keyEvent = event as KeyboardEvent;
      if (keyEvent.key === "Escape" && this.open) {
        this.setOpen(false);
      }
    };
    const onResize = () => {
      if (this.open) this.reposition();
    };
    const onScroll = () => {
      if (this.open) this.reposition();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    this.unlistenPointerDown = () => document.removeEventListener("pointerdown", onPointerDown, true);
    this.unlistenKeydown = () => document.removeEventListener("keydown", onKeyDown, true);
    this.unlistenResize = () => window.removeEventListener("resize", onResize);
    this.unlistenScroll = () => window.removeEventListener("scroll", onScroll, true);
  }

  ngOnDestroy(): void {
    this.unlistenPointerDown?.();
    this.unlistenKeydown?.();
    this.unlistenResize?.();
    this.unlistenScroll?.();
    this.unlistenPointerDown = null;
    this.unlistenKeydown = null;
    this.unlistenResize = null;
    this.unlistenScroll = null;
    this.removePortaledPopup();
  }

  toggle(): void {
    const next = !this.open;
    if (next && typeof performance !== "undefined") {
      // Opening click must not immediately count as an outside close.
      this.ignoreOutsideCloseUntil = performance.now() + 400;
    }
    this.setOpen(next);
  }

  setOpen(next: boolean): void {
    if (this.open === next) return;

    if (this.openInput === undefined) {
      this.internalOpen = next;
    }
    this.openChange.emit(next);
    this.cdr.detectChanges();

    if (next) {
      this.attachPopupToBody();
      requestAnimationFrame(() => {
        this.reposition();
        requestAnimationFrame(() => this.reposition());
      });
    } else {
      // Orphan guard — reparented nodes can survive Storybook story swaps.
      this.removePortaledPopup();
    }

    this.cdr.markForCheck();
  }

  onProductActivate(product: IdsAppLauncherProduct, event?: Event): void {
    this.productSelect.emit(product);
    if (!product.href) {
      event?.preventDefault();
    }
    this.setOpen(false);
  }

  /**
   * Cross-section Arrow-key navigation inside the open panel (like the dropdown
   * popup): products are a `columns`-wide grid (Left/Right within a row, Up/Down
   * across rows); the options list is vertical; at the grid/list boundary focus
   * crosses between the two sections (keyed off `data-focus-section`). The
   * options branch is null-safe, so a products-only launcher just navigates the
   * grid.
   */
  onPopupKeyDown(event: KeyboardEvent): void {
    if (
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) {
      return;
    }
    const popup = event.currentTarget as HTMLElement | null;
    if (!popup) return;
    const active = popup.ownerDocument.activeElement as HTMLElement | null;
    if (!active || !popup.contains(active)) return;

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusables = (node: Element | null): HTMLElement[] =>
      node ? Array.from(node.querySelectorAll<HTMLElement>(focusableSelector)) : [];

    const productsSection = popup.querySelector<HTMLElement>('[data-focus-section="products"]');
    const optionsSection = popup.querySelector<HTMLElement>('[data-focus-section="options"]');
    const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const dir = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const cols = Math.max(1, this.columns);
    const focus = (el?: HTMLElement): void => {
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      el.focus();
    };

    // Products grid.
    if (productsSection?.contains(active)) {
      const tiles = getFocusables(productsSection);
      const idx = tiles.indexOf(active);
      if (idx === -1) return;
      if (horizontal) {
        const nextIdx = idx + dir; // stay within the same row
        if (
          nextIdx >= 0 &&
          nextIdx < tiles.length &&
          Math.floor(nextIdx / cols) === Math.floor(idx / cols)
        ) {
          focus(tiles[nextIdx]);
        }
        return;
      }
      const nextIdx = idx + dir * cols; // move one row up/down
      if (nextIdx >= 0 && nextIdx < tiles.length) {
        focus(tiles[nextIdx]);
        return;
      }
      // Past the last grid row → first option (Down). Above the first row → stay.
      if (dir > 0) focus(getFocusables(optionsSection)[0]);
      return;
    }

    // Options list (vertical only).
    if (optionsSection?.contains(active)) {
      if (horizontal) return;
      const opts = getFocusables(optionsSection);
      const idx = opts.indexOf(active);
      if (idx === -1) return;
      const nextIdx = idx + dir;
      if (nextIdx >= 0 && nextIdx < opts.length) {
        focus(opts[nextIdx]);
        return;
      }
      // Above the first option → last product tile.
      if (dir < 0) {
        const tiles = getFocusables(productsSection);
        focus(tiles[tiles.length - 1]);
      }
    }
  }

  private onDocumentPointerDown(event: PointerEvent): void {
    if (!this.open) return;
    if (typeof performance !== "undefined" && performance.now() < this.ignoreOutsideCloseUntil) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Node)) return;

    const trigger = this.triggerBtn?.nativeElement;
    const popup =
      this.popupPanel?.nativeElement ??
      (typeof document !== "undefined"
        ? document.querySelector(`[data-app-launcher-portal="${this.portalId}"]`)
        : null);

    if (trigger?.contains(target)) return;
    if (popup instanceof Node && popup.contains(target)) return;

    // Close for any outside click (App Shell body, Storybook chrome in same frame, etc.).
    this.setOpen(false);
  }

  private attachPopupToBody(): void {
    const el = this.popupPanel?.nativeElement;
    if (!el || typeof document === "undefined") return;
    el.setAttribute("data-app-launcher-portal", this.portalId);
    if (el.parentElement !== document.body) {
      this.renderer.appendChild(document.body, el);
    }
  }

  /** Drop portaled popup from `document.body` (Storybook navigation safety). */
  private removePortaledPopup(): void {
    if (typeof document === "undefined") return;
    const el =
      this.popupPanel?.nativeElement ??
      document.querySelector(`[data-app-launcher-portal="${this.portalId}"]`);
    if (el?.parentElement) {
      this.renderer.removeChild(el.parentElement, el);
    }
  }

  private reposition(): void {
    const trigger = this.triggerBtn?.nativeElement;
    if (!trigger || typeof window === "undefined") return;
    const rect = trigger.getBoundingClientRect();
    const offset =
      this.triggerVariant === "masthead" ? Math.max(this.sideOffset, 1) : this.sideOffset;
    const panelWidth = this.useSingleProductWidth ? 150 : 298;
    // React Popover.Positioner align="end" — panel end aligns to trigger end.
    let left = rect.right - panelWidth;
    left = Math.max(8, Math.min(left, window.innerWidth - panelWidth - 8));
    let top = rect.bottom + offset;
    const approxPanelHeight = this.useTwoProductLayout ? 127 : 254;
    if (top + approxPanelHeight > window.innerHeight - 8) {
      top = Math.max(8, rect.top - approxPanelHeight - offset);
    }
    this.popupStyle = {
      position: "fixed",
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      zIndex: "10000",
      margin: "0",
    };
    this.cdr.markForCheck();
  }
}
