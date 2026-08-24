import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsButtonComponent } from "../button/ids-button.component";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_TOAST_ITEM_CONTEXT } from "./ids-toast-context";

@Component({
  selector: "ids-toast-close-action",
  standalone: true,
  imports: [IdsButtonComponent, IdsIconComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    @if (toast.resolvedClosable) {
      <ids-button
        class="ids-toast-close"
        data-ids="ids-toast-close"
        variant="tertiary"
        size="md"
        [iconOnly]="true"
        type="button"
        ariaLabel="Dismiss notification"
        (clicked)="toast.dismiss('close-click')"
      >
        <ids-icon
          shapeName="shape-x"
          variant="mask"
          color="var(--color-icon-gray-white)"
          [size]="12"
          className="ids-toast-close-icon"
        />
      </ids-button>
    }
  `,
})
export class IdsToastCloseActionComponent {
  readonly toast = inject(IDS_TOAST_ITEM_CONTEXT);
}
