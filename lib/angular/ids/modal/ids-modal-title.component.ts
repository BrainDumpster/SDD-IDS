import { Component, inject, ViewEncapsulation } from "@angular/core";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";

/** Modal title slot — projects into header chrome (`Header 5`). */
@Component({
  selector: "ids-modal-title",
  standalone: true,
  template: `<h2 [id]="modal.titleId" class="ids-modal__title"><ng-content /></h2>`,
  styles: [`:host { display: contents; }`],
  encapsulation: ViewEncapsulation.None,
})
export class IdsModalTitleComponent {
  readonly modal = inject(IDS_MODAL_CONTEXT);
}
