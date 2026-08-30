import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_TOAST_ITEM_CONTEXT } from "./ids-toast-context";

@Component({
  selector: "ids-toast-icon-container",
  standalone: true,
  imports: [IdsIconComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <div class="ids-toast-icon-container" data-ids="ids-toast-icon-container">
      <ids-icon
        [shapeName]="toast.iconShape"
        variant="img"
        [size]="16"
        className="ids-toast-status-icon"
      />
    </div>
  `,
})
export class IdsToastIconContainerComponent {
  readonly toast = inject(IDS_TOAST_ITEM_CONTEXT);
}
