import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";

/** Composable close control — projects into header chrome (`IdsModal.Close` parity). */
@Component({
  selector: "ids-modal-close",
  standalone: true,
  imports: [IdsIconComponent],
  styles: [`:host { display: contents; }`],
  template: `
    <button
      type="button"
      class="ids-modal__close"
      aria-label="Close"
      (click)="modal.closeModal()"
    >
      <ids-icon shapeName="shape-x" variant="img" [size]="16" />
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsModalCloseComponent {
  readonly modal = inject(IDS_MODAL_CONTEXT);
}
