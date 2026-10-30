import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import {
  TOOLTIP_API_DEFAULTS,
  type TooltipArrowAlign,
  type TooltipCloseReason,
  type TooltipSide,
} from "@component-contracts/ids/tooltip.contract";
import { IDS_TOOLTIP_CONTEXT, type IdsTooltipContext } from "./ids-tooltip-context";
import { IdsTooltipPanelComponent } from "./ids-tooltip-panel.component";
import { IdsTooltipTitleComponent } from "./ids-tooltip-title.component";
import { IdsTooltipTriggerComponent } from "./ids-tooltip-trigger.component";

let tooltipInstanceCounter = 0;

@Component({
  selector: "ids-tooltip",
  standalone: true,
  template: `
    <ng-content select="ids-tooltip-trigger" />
    <ng-content select="ids-tooltip-panel" />
  `,
  styleUrl: "./ids-tooltip.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: IDS_TOOLTIP_CONTEXT, useExisting: IdsTooltipComponent }],
  host: {
    class: "ids-tooltip-host",
    "[class.ids-tooltip-host--block]": 'triggerDisplay === "block"',
  },
})
export class IdsTooltipComponent
  implements IdsTooltipContext, AfterContentInit, AfterViewChecked, OnChanges, OnDestroy
{
  @ContentChild(IdsTooltipTriggerComponent) triggerSlot?: IdsTooltipTriggerComponent;
  @ContentChild(IdsTooltipPanelComponent) panelSlot?: IdsTooltipPanelComponent;
  @ContentChild(IdsTooltipTitleComponent, { descendants: true }) titleSlot?: IdsTooltipTitleComponent;

  @Input() side: TooltipSide = TOOLTIP_API_DEFAULTS.side;
  @Input() arrowAlign: TooltipArrowAlign = TOOLTIP_API_DEFAULTS.arrowAlign;
  /** @deprecated Use `arrowAlign`. */
  @Input() align?: TooltipArrowAlign;
  @Input() closable = TOOLTIP_API_DEFAULTS.closable;
  @Input() triggerDisplay: "inline" | "block" = TOOLTIP_API_DEFAULTS.triggerDisplay;
  @Input() hugContent = false;
  @Input() open?: boolean;
  @Input() defaultOpen = false;
  @Input() closeIconShapeName = "ctrl-close-16";

  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly closed = new EventEmitter<TooltipCloseReason>();

  readonly tooltipId = `ids-tooltip-${++tooltipInstanceCounter}`;

  isOpen = false;
  popupTop = 0;
  popupLeft = 0;
  positioned = false;

  private manuallyDismissed = false;
  private pointerInside = false;
  private controlled = false;
  private needsPositionUpdate = false;
  private positionFrameId: number | null = null;
  private leaveGraceTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    document.addEventListener("scroll", this.onScrollCapture, true);
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["open"]) {
      this.controlled = changes["open"].currentValue !== undefined;
      if (this.controlled) {
        this.isOpen = Boolean(this.open);
      }
    }
    if (changes["defaultOpen"]?.firstChange && !this.controlled) {
      this.isOpen = this.defaultOpen;
    }
    if ((changes["side"] || changes["arrowAlign"] || changes["align"]) && this.isOpen) {
      this.schedulePositionUpdate();
    }
  }

  ngAfterViewChecked(): void {
    if (this.isOpen && this.needsPositionUpdate) {
      this.updatePosition();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener("scroll", this.onScrollCapture, true);
    this.cancelPositionUpdate();
    this.clearLeaveGraceTimer();
    const popup = this.panelSlot?.host.nativeElement;
    if (popup?.parentElement === this.document.body) {
      popup.remove();
    }
  }

  private readonly onScrollCapture = (): void => {
    if (this.isOpen) {
      this.schedulePositionUpdate();
    }
  };

  get resolvedArrowAlign(): TooltipArrowAlign {
    return this.arrowAlign ?? this.align ?? "center";
  }

  get hasTitle(): boolean {
    return Boolean(this.titleSlot);
  }

  get popupClass(): string {
    return [
      "ids-tooltip__popup",
      this.closable ? "ids-tooltip__popup--closable" : "ids-tooltip__popup--standard",
      this.hasTitle ? "ids-tooltip__popup--with-title" : "ids-tooltip__popup--no-title",
      this.hugContent ? "ids-tooltip__popup--hug" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  get contentClass(): string {
    return this.closable
      ? "ids-tooltip__content ids-tooltip__content--closable"
      : "ids-tooltip__content";
  }

  get triggerDescribedBy(): string | null {
    return this.isOpen ? this.tooltipId : null;
  }

  onTriggerPointerEnter(): void {
    this.clearLeaveGraceTimer();
    this.setOpen(true);
  }

  onTriggerPointerLeave(): void {
    if (this.closable) {
      return;
    }
    this.scheduleCloseAfterGrace();
  }

  onTriggerFocusIn(): void {
    this.clearLeaveGraceTimer();
    this.setOpen(true);
  }

  onTriggerFocusOut(event: FocusEvent): void {
    if (this.closable) {
      return;
    }
    const next = event.relatedTarget as Node | null;
    const popup = this.panelSlot?.host.nativeElement;
    if (popup && next && popup.contains(next)) {
      return;
    }
    this.setOpen(false);
  }

  onPopupPointerEnter(): void {
    this.clearLeaveGraceTimer();
    this.pointerInside = true;
    if (!this.closable) {
      this.setOpen(true);
    }
  }

  onPopupPointerLeave(): void {
    this.pointerInside = false;
    if (!this.closable) {
      this.scheduleCloseAfterGrace();
    }
  }

  onPopupKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.closable) {
      this.dismiss("escape");
    }
  }

  onCloseClick(): void {
    this.dismiss("close-click");
  }

  @HostListener("window:resize")
  onWindowResize(): void {
    if (this.isOpen) {
      this.schedulePositionUpdate();
    }
  }

  dismiss(reason: TooltipCloseReason): void {
    this.manuallyDismissed = true;
    this.setOpen(false);
    this.closed.emit(reason);
  }

  private setOpen(nextOpen: boolean): void {
    if (this.controlled) {
      this.openChange.emit(nextOpen);
      return;
    }

    if (this.closable && !nextOpen && !this.manuallyDismissed) {
      return;
    }

    if (nextOpen) {
      this.manuallyDismissed = false;
    }

    if (this.isOpen === nextOpen) {
      return;
    }

    this.isOpen = nextOpen;
    this.openChange.emit(nextOpen);

    if (nextOpen) {
      this.positioned = false;
      this.schedulePositionUpdate();
    } else {
      this.positioned = false;
      this.cancelPositionUpdate();
      this.cdr.markForCheck();
    }
  }

  private schedulePositionUpdate(): void {
    this.needsPositionUpdate = true;
    this.cancelPositionUpdate();
    this.positionFrameId = requestAnimationFrame(() => {
      this.positionFrameId = requestAnimationFrame(() => {
        this.positionFrameId = null;
        this.updatePosition();
      });
    });
    this.cdr.markForCheck();
  }

  private cancelPositionUpdate(): void {
    if (this.positionFrameId !== null) {
      cancelAnimationFrame(this.positionFrameId);
      this.positionFrameId = null;
    }
    this.needsPositionUpdate = false;
  }

  private clearLeaveGraceTimer(): void {
    if (this.leaveGraceTimer !== null) {
      clearTimeout(this.leaveGraceTimer);
      this.leaveGraceTimer = null;
    }
  }

  private scheduleCloseAfterGrace(): void {
    this.clearLeaveGraceTimer();
    this.leaveGraceTimer = setTimeout(() => {
      this.leaveGraceTimer = null;
      if (!this.pointerInside) {
        this.setOpen(false);
      }
    }, 80);
  }

  private ensurePopupPortaled(): void {
    const popup = this.panelSlot?.host.nativeElement;
    if (!popup) {
      return;
    }
    const body = this.document.body;
    if (popup.parentElement !== body) {
      body.appendChild(popup);
    }
  }

  private updatePosition(): void {
    const trigger = this.triggerSlot?.host.nativeElement;
    const popup = this.panelSlot?.host.nativeElement;
    if (!trigger || !popup) {
      this.needsPositionUpdate = true;
      return;
    }

    this.ensurePopupPortaled();
    const triggerRect = trigger.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    if (popupRect.width === 0 || popupRect.height === 0) {
      this.needsPositionUpdate = true;
      return;
    }

    const gap = 16;
    const side = this.side;
    const align = this.resolvedArrowAlign;

    let top = 0;
    let left = 0;

    switch (side) {
      case "top":
        top = triggerRect.top - popupRect.height - gap;
        left = this.alignOnAxis(triggerRect, popupRect, align, "horizontal");
        break;
      case "bottom":
        top = triggerRect.bottom + gap;
        left = this.alignOnAxis(triggerRect, popupRect, align, "horizontal");
        break;
      case "left":
        left = triggerRect.left - popupRect.width - gap;
        top = this.alignOnAxis(triggerRect, popupRect, align, "vertical");
        break;
      case "right":
        left = triggerRect.right + gap;
        top = this.alignOnAxis(triggerRect, popupRect, align, "vertical");
        break;
      default:
        top = triggerRect.top - popupRect.height - gap;
        left = this.alignOnAxis(triggerRect, popupRect, "center", "horizontal");
        break;
    }

    this.popupTop = Math.round(top);
    this.popupLeft = Math.round(left);
    this.positioned = true;
    this.needsPositionUpdate = false;
    this.cdr.markForCheck();
  }

  private alignOnAxis(
    triggerRect: DOMRect,
    popupRect: DOMRect,
    align: TooltipArrowAlign,
    axis: "horizontal" | "vertical",
  ): number {
    if (axis === "horizontal") {
      switch (align) {
        case "start":
          return triggerRect.left;
        case "end":
          return triggerRect.right - popupRect.width;
        case "center":
        default:
          return triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
      }
    }

    switch (align) {
      case "start":
        return triggerRect.top;
      case "end":
        return triggerRect.bottom - popupRect.height;
      case "center":
      default:
        return triggerRect.top + triggerRect.height / 2 - popupRect.height / 2;
    }
  }
}
