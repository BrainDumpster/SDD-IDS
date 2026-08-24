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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  APP_LAUNCHER_DEFAULT_PRODUCT_ICON,
  APP_LAUNCHER_TRIGGER_ICON,
  type IdsAppLauncherProduct,
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
export class IdsAppLauncherComponent implements OnInit, OnDestroy {
  @Input() products: IdsAppLauncherProduct[] = [];
  @Input() triggerVariant: IdsAppLauncherTriggerVariant = "default";
  @Input() sideOffset = 8;
  @Input() columns = 2;
  @Input() ariaLabel = "App launcher";
  @Input() defaultOpen = false;
  @Input() openInput?: boolean;

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

  get rows(): IdsAppLauncherProduct[][] {
    const cols = Math.max(1, this.columns);
    const rows: IdsAppLauncherProduct[][] = [];
    for (let i = 0; i < this.products.length; i += cols) {
      rows.push(this.products.slice(i, i + cols));
    }
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
