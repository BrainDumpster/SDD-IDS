import { Component, Input, inject } from "@angular/core";
import { IDS_ALERT_CONTEXT } from "./ids-alert-context";

@Component({
  selector: "ids-alert-link",
  standalone: true,
  template: `
    @if (href) {
      <a [class]="linkClass()" [href]="href" (click)="onLinkActivate($event)">
        {{ label }}
      </a>
    } @else {
      <button type="button" [class]="linkButtonClass()" (click)="onLinkActivate($event)">
        {{ label }}
      </button>
    }
  `,
})
export class IdsAlertLinkComponent {
  private readonly ctx = inject(IDS_ALERT_CONTEXT, { optional: true });

  @Input({ required: true }) label!: string;
  @Input() href = "";

  linkClass(): string {
    return this.ctx?.linkClass() ?? "ids-alert__link";
  }

  linkButtonClass(): string {
    return this.ctx?.linkButtonClass() ?? "ids-alert__link-button";
  }

  onLinkActivate(event: MouseEvent): void {
    this.ctx?.onLinkActivate(event);
  }
}
