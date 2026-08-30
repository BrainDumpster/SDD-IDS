import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsCheckboxComponent } from "../checkbox/ids-checkbox.component";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";

/** Modal footer slot — projects action buttons (`ids-button`) and optional checkbox from root. */
@Component({
  selector: "ids-modal-footer",
  standalone: true,
  imports: [IdsCheckboxComponent],
  styles: [`:host { display: contents; }`],
  template: `
    <footer class="ids-modal__footer">
      @if (modal.footerCheckbox) {
        <div class="ids-modal__footer-start">
          <ids-checkbox [label]="modal.footerCheckboxLabel" [showLabel]="true" />
        </div>
      }

      <div class="ids-modal__actions">
        <ng-content />
      </div>
    </footer>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsModalFooterComponent {
  readonly modal = inject(IDS_MODAL_CONTEXT);
}
