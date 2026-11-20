import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsIconButtonComponent } from "../icon-button/ids-icon-button.component";
import { IDS_TOAST_ITEM_CONTEXT } from "./ids-toast-context";

@Component({
  selector: "ids-toast-close-action",
  standalone: true,
  imports: [IdsIconButtonComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    @if (toast.resolvedClosable) {
      <ids-icon-button
        class="ids-toast-close"
        data-ids="ids-toast-close"
        variant="tertiary"
        size="md"
        type="button"
        shape="shape-x"
        color="var(--color-icon-gray-white)"
        ariaLabel="Dismiss notification"
        (clicked)="toast.dismiss('close-click')"
      />
    }
  `,
})
export class IdsToastCloseActionComponent {
  readonly toast = inject(IDS_TOAST_ITEM_CONTEXT);
}
