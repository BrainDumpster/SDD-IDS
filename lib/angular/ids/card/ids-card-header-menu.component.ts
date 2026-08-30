/**
 * CardFilter overflow menu — Figma `.Card-Element-OverflowMenu` `15718:197531`.
 * Composes lib `IdsIcon` (`overflow-menu-dots`). Popup portaled to `document.body`.
 */

import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import type { IdsCardMenuOption } from "./ids-card.types";

let menuIdSeq = 0;

function firstEnabledIndex(options: IdsCardMenuOption[]): number {
  const idx = options.findIndex((o) => !o.disabled);
  return idx >= 0 ? idx : 0;
}

function nextEnabledIndex(
  options: IdsCardMenuOption[],
  from: number,
  delta: number,
): number {
  if (options.length === 0) return 0;
  let i = from;
  for (let step = 0; step < options.length; step += 1) {
    i = (i + delta + options.length) % options.length;
    if (!options[i]?.disabled) return i;
  }
  return from;
}

@Component({
  selector: "ids-card-header-menu",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  templateUrl: "./ids-card-header-menu.component.html",
  styleUrl: "./ids-card-header-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    style: "display: contents",
  },
})
export class IdsCardHeaderMenuComponent implements OnDestroy {
  @Input({ required: true }) options!: IdsCardMenuOption[];
  /** Card root element — collision boundary + max overlay height. */
  @Input() cardRoot: HTMLElement | null = null;
  @Input() triggerAriaLabel = "Card options";

  @Output() readonly optionSelected = new EventEmitter<string>();

  @ViewChild("triggerBtn", { read: ElementRef })
  private triggerBtn?: ElementRef<HTMLButtonElement>;

  @ViewChild("popupEl", { read: ElementRef })
  private popupEl?: ElementRef<HTMLUListElement>;

  readonly menuId = `ids-card-menu-${++menuIdSeq}`;

  open = false;
  maxHeight = 280;
  highlighted = 0;
  coords: { top: number; left: number } | null = null;

  private resizeObserver: ResizeObserver | null = null;
  private unlistenPointerDown: (() => void) | null = null;
  private unlistenResize: (() => void) | null = null;
  private unlistenScroll: (() => void) | null = null;
  private lastPortaledPopup: HTMLElement | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly renderer: Renderer2,
  ) {}

  get popupStyle(): Record<string, string> | null {
    if (!this.coords) return null;
    return {
      position: "fixed",
      top: `${this.coords.top}px`,
      left: `${this.coords.left}px`,
      maxHeight: `${this.maxHeight}px`,
    };
  }

  ngOnDestroy(): void {
    this.teardownOpenListeners();
    this.removePortaledPopup();
  }

  onTriggerClick(): void {
    if (this.open) {
      this.close();
    } else {
      this.openMenu();
    }
  }

  onTriggerKeyDown(event: KeyboardEvent): void {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!this.open) this.openMenu();
    }
  }

  onPopupKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
      this.triggerBtn?.nativeElement.focus();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.highlighted = nextEnabledIndex(this.options, this.highlighted, 1);
      this.focusHighlightedItem();
      this.cdr.markForCheck();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.highlighted = nextEnabledIndex(this.options, this.highlighted, -1);
      this.focusHighlightedItem();
      this.cdr.markForCheck();
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      this.highlighted = firstEnabledIndex(this.options);
      this.focusHighlightedItem();
      this.cdr.markForCheck();
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      this.highlighted = nextEnabledIndex(this.options, this.options.length, -1);
      this.focusHighlightedItem();
      this.cdr.markForCheck();
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const opt = this.options[this.highlighted];
      if (opt) this.selectOption(opt);
    }
  }

  onItemMouseEnter(index: number, opt: IdsCardMenuOption): void {
    if (!opt.disabled) {
      this.highlighted = index;
      this.cdr.markForCheck();
    }
  }

  selectOption(opt: IdsCardMenuOption): void {
    if (opt.disabled) return;
    this.optionSelected.emit(opt.value);
    this.close();
    this.triggerBtn?.nativeElement.focus();
  }

  private openMenu(): void {
    this.recomputeMaxHeight();
    const trigger = this.triggerBtn?.nativeElement;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      const popupWidth = 186;
      const left = Math.min(
        Math.max(4, rect.right - popupWidth),
        window.innerWidth - popupWidth - 4,
      );
      this.coords = { top: rect.bottom + 4, left };
    }
    this.open = true;
    this.highlighted = firstEnabledIndex(this.options);
    this.bindOpenListeners();
    this.cdr.detectChanges();
    this.attachPopupToBody();
    requestAnimationFrame(() => {
      this.recomputeMaxHeight();
      this.positionPopup();
      this.focusHighlightedItem();
      this.cdr.markForCheck();
    });
  }

  private close(): void {
    this.open = false;
    this.coords = null;
    this.teardownOpenListeners();
    this.removePortaledPopup();
    this.cdr.markForCheck();
  }

  private attachPopupToBody(): void {
    const el = this.popupEl?.nativeElement;
    if (!el || typeof document === "undefined") return;
    if (el.parentElement !== document.body) {
      this.renderer.appendChild(document.body, el);
    }
    this.lastPortaledPopup = el;
  }

  private recomputeMaxHeight(): void {
    const root = this.cardRoot;
    if (!root) return;
    const header = root.querySelector<HTMLElement>("[data-card-header]");
    const footer = root.querySelector<HTMLElement>("[data-card-footer]");
    const headerH = header?.offsetHeight ?? 0;
    const footerH = footer?.offsetHeight ?? 0;
    const paddingFudge = 12;
    const next = root.clientHeight - headerH - footerH - paddingFudge;
    this.maxHeight = Math.max(96, next);
  }

  private positionPopup(): void {
    const trigger = this.triggerBtn?.nativeElement;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const popupWidth = Math.max(
      186,
      this.popupEl?.nativeElement.offsetWidth ?? 186,
    );
    const left = Math.min(
      Math.max(4, rect.right - popupWidth),
      window.innerWidth - popupWidth - 4,
    );
    this.coords = { top: rect.bottom + 4, left };
  }

  private focusHighlightedItem(): void {
    const items =
      this.popupEl?.nativeElement.querySelectorAll<HTMLElement>(
        "[role='menuitem']",
      );
    items?.[this.highlighted]?.focus();
  }

  private bindOpenListeners(): void {
    this.teardownOpenListeners();

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (this.triggerBtn?.nativeElement.contains(target)) return;
      if (this.popupEl?.nativeElement.contains(target)) return;
      this.close();
    };
    document.addEventListener("mousedown", onPointerDown);
    this.unlistenPointerDown = () =>
      document.removeEventListener("mousedown", onPointerDown);

    const onResize = () => {
      this.recomputeMaxHeight();
      this.positionPopup();
      this.cdr.markForCheck();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    this.unlistenResize = () => window.removeEventListener("resize", onResize);
    this.unlistenScroll = () =>
      window.removeEventListener("scroll", onResize, true);

    const root = this.cardRoot;
    if (root && typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(onResize);
      this.resizeObserver.observe(root);
    }
  }

  private teardownOpenListeners(): void {
    this.unlistenPointerDown?.();
    this.unlistenPointerDown = null;
    this.unlistenResize?.();
    this.unlistenResize = null;
    this.unlistenScroll?.();
    this.unlistenScroll = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private removePortaledPopup(): void {
    const el = this.popupEl?.nativeElement ?? this.lastPortaledPopup;
    if (el?.parentElement) {
      this.renderer.removeChild(el.parentElement, el);
    }
    this.lastPortaledPopup = null;
  }
}
