import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsIconButtonComponent } from "../icon-button/ids-icon-button.component";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";

/** Composable close control — projects into header chrome (`IdsModal.Close` parity). */
@Component({
  selector: "ids-modal-close",
  standalone: true,
  imports: [IdsIconButtonComponent],
  styles: [`:host { display: contents; }`],
  template: `
    <ids-icon-button
      variant="ghostNeutral"
      size="md"
      shape="shape-x"
      ariaLabel="Close"
      (clicked)="modal.closeModal()"
    />
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsModalCloseComponent {
  readonly modal = inject(IDS_MODAL_CONTEXT);
}
