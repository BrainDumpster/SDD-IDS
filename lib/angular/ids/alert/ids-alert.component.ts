import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ALERT_GLOBAL_STATUS_ICON,
  ALERT_INLINE_STATUS_ICON,
  ALERT_SPEC_ACCURATE_DEFAULTS,
  type AlertCarouselInput,
  type AlertDensity,
  type AlertDisplay,
  type AlertGlobalSeverity,
  type AlertInlineSeverity,
  type AlertLinkInput,
} from "@component-contracts/ids/alert.contract";
import { IDS_ALERT_CONTEXT, type IdsAlertContext } from "./ids-alert-context";
import { IdsAlertMessageComponent } from "./ids-alert-message.component";
import { IdsAlertTitleComponent } from "./ids-alert-title.component";
import { IdsAlertLinkComponent } from "./ids-alert-link.component";
import { IdsAlertActionComponent } from "./ids-alert-action.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

@Component({
  selector: "ids-alert",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  templateUrl: "./ids-alert.component.html",
  styleUrl: "./ids-alert.component.scss",
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: IDS_ALERT_CONTEXT, useExisting: IdsAlertComponent }],
})
export class IdsAlertComponent implements AfterContentInit, IdsAlertContext {
  @ContentChild(IdsAlertMessageComponent) messageSlot?: IdsAlertMessageComponent;
  @ContentChild(IdsAlertMessageComponent, { read: ElementRef })
  private messageHost?: ElementRef<HTMLElement>;
  @ContentChild(IdsAlertTitleComponent) titleSlot?: IdsAlertTitleComponent;
  @ContentChild(IdsAlertTitleComponent, { read: ElementRef })
  private titleHost?: ElementRef<HTMLElement>;
  @ContentChild(IdsAlertLinkComponent) linkSlot?: IdsAlertLinkComponent;
  @ContentChild(IdsAlertActionComponent) actionSlot?: IdsAlertActionComponent;

  @Input() display: AlertDisplay = ALERT_SPEC_ACCURATE_DEFAULTS.display;
  @Input() severity: AlertGlobalSeverity | AlertInlineSeverity =
    ALERT_SPEC_ACCURATE_DEFAULTS.severity;
  /** Shorthand when `ids-alert-message` is not projected. */
  @Input() message: string = ALERT_SPEC_ACCURATE_DEFAULTS.message;
  /** Shorthand when `ids-alert-title` is not projected. */
  @Input() title = "";
  @Input() density: AlertDensity = ALERT_SPEC_ACCURATE_DEFAULTS.density;
  @Input() link: AlertLinkInput | null = null;
  @Input() linkLabel = "";
  @Input() linkHref = "";
  @Input() actionLabel = "";
  @Input() dismissible: boolean | null = ALERT_SPEC_ACCURATE_DEFAULTS.dismissible;
  @Input() carousel: AlertCarouselInput | null = null;

  @Output() readonly action = new EventEmitter<void>();
  @Output() readonly dismiss = new EventEmitter<void>();
  @Output() readonly linkClick = new EventEmitter<MouseEvent>();
  @Output() readonly carouselPrevious = new EventEmitter<void>();
  @Output() readonly carouselNext = new EventEmitter<void>();

  dismissed = false;
  hasMessageSlot = false;
  hasTitleSlot = false;

  ngAfterContentInit(): void {
    this.hasMessageSlot = Boolean(this.messageSlot);
    this.hasTitleSlot = Boolean(this.titleSlot);
  }

  get isGlobal(): boolean {
    return this.display === "global";
  }

  get resolvedLink(): AlertLinkInput | null {
    if (this.linkSlot) {
      return { label: this.linkSlot.label, href: this.linkSlot.href || undefined };
    }
    if (this.link) {
      return this.link;
    }
    if (this.linkLabel) {
      return { label: this.linkLabel, href: this.linkHref || undefined };
    }
    return null;
  }

  get resolvedActionLabel(): string {
    return this.actionSlot?.label || this.actionLabel;
  }

  get showAction(): boolean {
    return Boolean(this.resolvedActionLabel);
  }

  get showLink(): boolean {
    return Boolean(this.resolvedLink?.label);
  }

  get showCarousel(): boolean {
    return this.isGlobal && Boolean(this.carousel);
  }

  get showDismissGlobal(): boolean {
    const allowed = this.dismissible ?? true;
    const sev = this.severity as AlertGlobalSeverity;
    return allowed && (sev !== "critical" || (this.showCarousel && !this.showAction));
  }

  get showDismissInline(): boolean {
    const allowed = this.dismissible ?? true;
    return allowed && this.severity !== "critical";
  }

  get showTitle(): boolean {
    return !this.isGlobal && this.density === "detailed" && (this.hasTitleSlot || Boolean(this.title));
  }

  get showTitleRow(): boolean {
    return this.showTitle && this.showAction;
  }

  get showActionInTitleRow(): boolean {
    return !this.isGlobal && this.density === "detailed" && this.showTitle && this.showAction;
  }

  get showActionInTrailing(): boolean {
    return this.showAction && !this.showActionInTitleRow;
  }

  get showTrailing(): boolean {
    return !this.isGlobal && (this.showActionInTrailing || this.showDismissInline);
  }

  get useMessageSlot(): boolean {
    return this.hasMessageSlot;
  }

  get resolvedMessage(): string {
    if (this.hasMessageSlot) {
      const slotText = this.messageHost?.nativeElement?.textContent?.trim();
      if (slotText) {
        return slotText;
      }
    }
    return this.message;
  }

  get resolvedTitle(): string {
    if (this.hasTitleSlot) {
      return this.titleHost?.nativeElement?.textContent?.trim() ?? "";
    }
    return this.title;
  }

  get carouselCounter(): string {
    if (!this.carousel) {
      return "";
    }
    const current = Math.max(1, this.carousel.currentItem);
    const total = Math.max(1, this.carousel.totalItems);
    return `${current} of ${total}`;
  }

  get statusIcon() {
    if (this.isGlobal) {
      return ALERT_GLOBAL_STATUS_ICON[this.severity as AlertGlobalSeverity];
    }
    return ALERT_INLINE_STATUS_ICON[this.severity as AlertInlineSeverity];
  }

  /** @deprecated Use `statusIcon.shape` — kept for template/docs compatibility. */
  statusIconSlug(): string {
    return this.statusIcon.shape;
  }

  onDismissClick(): void {
    this.dismissed = true;
    this.dismiss.emit();
  }

  onLinkActivate(event: MouseEvent): void {
    this.linkClick.emit(event);
  }

  linkClass(): string {
    return this.isGlobal ? "ids-alert__link" : "ids-alert__inline-link";
  }

  linkButtonClass(): string {
    return this.isGlobal ? "ids-alert__link-button" : "ids-alert__inline-link-button";
  }
}
