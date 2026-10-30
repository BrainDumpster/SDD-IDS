import { IdsModalComponent } from "./ids-modal.component";
import { IdsModalTitleComponent } from "./ids-modal-title.component";
import { IdsModalBodyComponent } from "./ids-modal-body.component";
import { IdsModalFooterComponent } from "./ids-modal-footer.component";
import { IdsModalCloseComponent } from "./ids-modal-close.component";
import { IdsButtonComponent } from "../button/ids-button.component";
import { IdsCheckboxComponent } from "../checkbox/ids-checkbox.component";
import { IdsTextBoxComponent } from "../text-box/ids-text-box.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_MODAL_IMPORTS = [
  IdsModalComponent,
  IdsModalTitleComponent,
  IdsModalBodyComponent,
  IdsModalFooterComponent,
  IdsModalCloseComponent,
  IdsButtonComponent,
  IdsCheckboxComponent,
  IdsTextBoxComponent,
  IdsIconComponent,
] as const;

export {
  IdsModalComponent,
  IdsModalTitleComponent,
  IdsModalBodyComponent,
  IdsModalFooterComponent,
  IdsModalCloseComponent,
};
