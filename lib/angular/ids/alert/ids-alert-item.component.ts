import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Input,
  inject,
} from "@angular/core";
import type { AlertGlobalSeverity } from "@component-contracts/ids/alert.contract";
import { IdsAlertMessageComponent } from "./ids-alert-message.component";
import { IdsAlertLinkComponent } from "./ids-alert-link.component";
import { IdsAlertActionComponent } from "./ids-alert-action.component";
import { IDS_ALERT_GROUP_CONTEXT } from "./ids-alert-group-context";

/**
 * One logical global alert item — projected into the group's single `ids-alert` chrome.
 * Maps to spec `AlertItem` / Clarity `clr-alert-item`.
 */
@Component({
  selector: "ids-alert-item",
  standalone: true,
  template: `
    <ng-content select="ids-alert-message" />
    <ng-content select="ids-alert-link" />
    <ng-content select="ids-alert-action" />
  `,
})
export class IdsAlertItemComponent implements AfterContentInit {
  private readonly group = inject(IDS_ALERT_GROUP_CONTEXT, { optional: true });

  @ContentChild(IdsAlertMessageComponent, { read: ElementRef })
  private messageRef?: ElementRef<HTMLElement>;
  @ContentChild(IdsAlertLinkComponent) private linkSlot?: IdsAlertLinkComponent;
  @ContentChild(IdsAlertActionComponent) private actionSlot?: IdsAlertActionComponent;

  @Input({ required: true }) severity!: AlertGlobalSeverity;
  /** Shorthand when `ids-alert-message` is not projected. */
  @Input() message = "";
  @Input() linkLabel = "";
  @Input() linkHref = "";
  @Input() actionLabel = "";

  itemIndex = 0;
  private messageFromSlot = "";

  @HostBinding("class.ids-alert-item")
  readonly itemClass = true;

  @HostBinding("attr.hidden")
  get hiddenAttr(): string {
    return "";
  }

  @HostBinding("attr.aria-hidden")
  get ariaHidden(): string {
    return "true";
  }

  ngAfterContentInit(): void {
    this.syncFromSlots();
  }

  refreshFromSlots(): void {
    this.syncFromSlots();
  }

  get resolvedMessage(): string {
    return this.messageFromSlot || this.message;
  }

  get resolvedLinkLabel(): string {
    return this.linkSlot?.label || this.linkLabel;
  }

  get resolvedLinkHref(): string {
    return this.linkSlot?.href || this.linkHref;
  }

  get resolvedActionLabel(): string {
    return this.actionSlot?.label || this.actionLabel;
  }

  isActive(): boolean {
    return this.group?.isActive(this) ?? false;
  }

  setItemIndex(index: number): void {
    this.itemIndex = index;
  }

  private syncFromSlots(): void {
    const el = this.messageRef?.nativeElement;
    this.messageFromSlot = el?.textContent?.trim() ?? "";
  }
}
