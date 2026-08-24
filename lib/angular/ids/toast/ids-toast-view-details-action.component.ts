import { Component, Input, ViewEncapsulation, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IdsButtonComponent } from "../button/ids-button.component";
import { IDS_TOAST_ITEM_CONTEXT } from "./ids-toast-context";

@Component({
  selector: "ids-toast-view-details-action",
  standalone: true,
  imports: [CommonModule, IdsButtonComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    @if (resolvedLabel) {
      @if (hasHref) {
        <a
          class="ids-toast-view-details-anchor"
          data-ids="ids-toast-view-details"
          [href]="resolvedHref"
          [attr.target]="resolvedTarget || null"
          [attr.rel]="resolvedTarget === '_blank' ? 'noopener noreferrer' : null"
          (click)="onActivate($event)"
        >
          {{ resolvedLabel }}
        </a>
      } @else {
        <ids-button
          class="ids-toast-view-details"
          data-ids="ids-toast-view-details"
          variant="tertiary"
          size="sm"
          type="button"
          (clicked)="onActivate($event)"
        >
          {{ resolvedLabel }}
        </ids-button>
      }
    }
  `,
})
export class IdsToastViewDetailsActionComponent {
  readonly toast = inject(IDS_TOAST_ITEM_CONTEXT);

  @Input() label = "";
  @Input() href = "";
  @Input() routerLink?: string | string[];
  @Input() target?: "_self" | "_blank" | "_parent" | "_top";

  get resolvedLabel(): string {
    return this.label || this.toast.resolvedLink?.label || "";
  }

  get preferRouter(): boolean {
    return this.routerLink != null || this.toast.preferRouter;
  }

  get hasHref(): boolean {
    if (this.preferRouter) {
      return false;
    }
    return Boolean(this.href || this.toast.hasHref);
  }

  get resolvedHref(): string | undefined {
    return this.href || this.toast.resolvedLink?.href;
  }

  get resolvedTarget(): "_self" | "_blank" | "_parent" | "_top" | undefined {
    return this.target ?? this.toast.resolvedLink?.target;
  }

  onActivate(event: MouseEvent): void {
    this.toast.onViewDetailsActivate(event);
  }
}
