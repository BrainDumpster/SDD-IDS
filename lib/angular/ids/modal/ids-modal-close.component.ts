import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IdsButtonComponent } from "../button/ids-button.component";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";

/** Composable close control — projects into header chrome (`IdsModal.Close` parity). */
@Component({
  selector: "ids-modal-close",
  standalone: true,
  imports: [IdsIconComponent, IdsButtonComponent],
  styles: [`:host { display: contents; }`],
  template: `
    <ids-button
      variant="ghostNeutral"
      size="md"
      [iconOnly]="true"
      ariaLabel="Close"
      (clicked)="modal.closeModal()"
    >
      <ids-icon shapeName="shape-x" variant="img" [size]="14" />
    </ids-button>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsModalCloseComponent {
  readonly modal = inject(IDS_MODAL_CONTEXT);
}
