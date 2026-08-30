import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  TOAST_API_DEFAULTS,
  TOAST_TYPE_ICON,
  type IdsToastCloseReason,
  type IdsToastLink,
  type IdsToastRole,
  type IdsToastType,
} from "@component-contracts/ids/toast.contract";
import { cx } from "../../shared/utils/cx";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  IDS_TOAST_ITEM_CONTEXT,
  type IdsToastItemContext,
} from "./ids-toast-context";
import { IdsToastIconContainerComponent } from "./ids-toast-icon-container.component";
import { IdsToastMessageComponent } from "./ids-toast-message.component";
import { IdsToastViewDetailsActionComponent } from "./ids-toast-view-details-action.component";
import { IdsToastCloseActionComponent } from "./ids-toast-close-action.component";
import {
  resolveToastDuration,
  resolveToastType,
  warnMissingToastIcon,
} from "./ids-toast.utils";

@Component({
  selector: "ids-toast-item",
  standalone: true,
  imports: [
    CommonModule,
    IdsIconComponent,
    IdsToastViewDetailsActionComponent,
    IdsToastCloseActionComponent,
  ],
  templateUrl: "./ids-toast-item.component.html",
  styleUrl: "./ids-toast-item.component.scss",
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: IDS_TOAST_ITEM_CONTEXT, useExisting: IdsToastItemComponent }],
})
export class IdsToastItemComponent
  implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy, IdsToastItemContext
{
  @ContentChild(IdsToastIconContainerComponent) iconSlot?: IdsToastIconContainerComponent;
  @ContentChild(IdsToastMessageComponent) messageSlot?: IdsToastMessageComponent;
  @ContentChild(IdsToastViewDetailsActionComponent)
  viewDetailsSlot?: IdsToastViewDetailsActionComponent;
  @ContentChild(IdsToastCloseActionComponent) closeSlot?: IdsToastCloseActionComponent;

  @Input() id?: string;
  @Input() type: IdsToastType | string = TOAST_API_DEFAULTS.type;
  @Input({ required: true }) message!: string;
  @Input() duration: number = TOAST_API_DEFAULTS.duration;
  @Input() closable: boolean = TOAST_API_DEFAULTS.closable;
  @Input() link?: IdsToastLink;
  @Input() role: IdsToastRole = TOAST_API_DEFAULTS.role;
  @Input() className?: string;

  @Output() readonly onClose = new EventEmitter<{ id?: string; reason: IdsToastCloseReason }>();
  @Output() readonly onTimeout = new EventEmitter<{ id?: string }>();

  hasIconSlot = false;
  hasMessageSlot = false;
  hasViewDetailsSlot = false;
  hasCloseSlot = false;
  queuedVisible = true;
  dismissed = false;

  private remainingMs = TOAST_API_DEFAULTS.duration as number;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private timerStartedAt: number | null = null;
  private timerPaused = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly host: ElementRef<HTMLElement>,
  ) {}

  ngAfterContentInit(): void {
    this.hasIconSlot = Boolean(this.iconSlot);
    this.hasMessageSlot = Boolean(this.messageSlot);
    this.hasViewDetailsSlot = Boolean(this.viewDetailsSlot);
    this.hasCloseSlot = Boolean(this.closeSlot);
    this.remainingMs = this.resolvedDuration;
    this.startTimer();
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    const shape = this.iconShape;
    const missing = this.host.nativeElement.querySelector(
      `[data-ids="ids-icon"][data-shape="${shape}"][data-missing="true"]`,
    );
    if (missing) {
      warnMissingToastIcon(shape);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["duration"] && !changes["duration"].firstChange) {
      this.remainingMs = this.resolvedDuration;
      this.timerPaused = false;
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  @HostBinding("class")
  get hostClass(): string {
    return cx("ids-toast-item", this.className);
  }

  @HostBinding("attr.data-ids")
  readonly dataIds = "ids-toast-item";

  @HostBinding("attr.data-type")
  get dataType(): IdsToastType {
    return this.resolvedType;
  }

  @HostBinding("attr.role")
  get hostRole(): IdsToastRole {
    return this.resolvedRole;
  }

  @HostBinding("attr.tabindex")
  readonly tabIndex = -1;

  @HostBinding("attr.hidden")
  get hiddenAttr(): string | null {
    return this.dismissed || !this.queuedVisible ? "" : null;
  }

  @HostListener("mouseenter")
  onMouseEnter(): void {
    this.pauseTimer();
  }

  @HostListener("mouseleave")
  onMouseLeave(): void {
    this.resumeTimer();
  }

  @HostListener("focusin")
  onFocusIn(): void {
    this.pauseTimer();
  }

  @HostListener("focusout", ["$event"])
  onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.host.nativeElement.contains(next)) {
      return;
    }
    this.resumeTimer();
  }

  @HostListener("keydown", ["$event"])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== "Escape") {
      return;
    }
    const active = document.activeElement;
    if (active && this.host.nativeElement.contains(active)) {
      event.preventDefault();
      this.dismiss("close-click");
    }
  }

  get resolvedId(): string | undefined {
    return this.id;
  }

  get resolvedType(): IdsToastType {
    return resolveToastType(this.type);
  }

  get resolvedMessage(): string {
    return this.message;
  }

  get resolvedClosable(): boolean {
    return this.closable;
  }

  get resolvedLink(): IdsToastLink | null {
    return this.link ?? null;
  }

  get resolvedRole(): IdsToastRole {
    return this.role === "alert" ? "alert" : "status";
  }

  get iconShape(): string {
    return TOAST_TYPE_ICON[this.resolvedType];
  }

  get showLink(): boolean {
    return Boolean(this.resolvedLink?.label);
  }

  get preferRouter(): boolean {
    return this.resolvedLink?.routerLink != null;
  }

  get hasHref(): boolean {
    return Boolean(this.resolvedLink?.href) && !this.preferRouter;
  }

  get showFallbackViewDetails(): boolean {
    return !this.hasViewDetailsSlot && this.showLink;
  }

  get showFallbackClose(): boolean {
    return !this.hasCloseSlot && this.resolvedClosable;
  }

  get resolvedDuration(): number {
    return resolveToastDuration(this.duration);
  }

  setQueuedVisible(visible: boolean): void {
    const wasVisible = this.queuedVisible;
    this.queuedVisible = visible;
    if (!wasVisible && visible) {
      this.remainingMs = this.resolvedDuration;
      this.timerPaused = false;
      this.startTimer();
    }
    if (wasVisible && !visible) {
      this.clearTimer();
    }
    this.cdr.markForCheck();
  }

  dismiss(reason: IdsToastCloseReason): void {
    if (this.dismissed) {
      return;
    }
    this.dismissed = true;
    this.clearTimer();
    this.onClose.emit({ id: this.resolvedId, reason });
    if (reason === "timeout") {
      this.onTimeout.emit({ id: this.resolvedId });
    }
    this.cdr.markForCheck();
  }

  onViewDetailsActivate(event: MouseEvent): void {
    this.resolvedLink?.onClick?.(event);
  }

  private startTimer(): void {
    this.clearTimer();
    if (this.dismissed || !this.queuedVisible) {
      return;
    }
    const duration = this.resolvedDuration;
    if (duration <= 0 || this.timerPaused) {
      return;
    }
    this.timerStartedAt = Date.now();
    this.timerId = setTimeout(() => this.dismiss("timeout"), this.remainingMs);
  }

  private pauseTimer(): void {
    if (this.resolvedDuration <= 0 || this.timerPaused) {
      return;
    }
    this.timerPaused = true;
    if (this.timerStartedAt != null) {
      const elapsed = Date.now() - this.timerStartedAt;
      this.remainingMs = Math.max(0, this.remainingMs - elapsed);
    }
    this.clearTimer();
  }

  private resumeTimer(): void {
    if (this.resolvedDuration <= 0) {
      return;
    }
    this.timerPaused = false;
    this.startTimer();
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.timerStartedAt = null;
  }
}
