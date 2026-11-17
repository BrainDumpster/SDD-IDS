import { IdsRadioButtonGroupComponent } from "./ids-radio-button-group.component";
import { IdsRadioButtonComponent } from "./ids-radio-button.component";
import { IdsErrorComponent, IdsErrorTextComponent } from "../error";
import { IdsFormLabelComponent } from "../form-label/ids-form-label.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_RADIO_BUTTON_IMPORTS = [
  IdsRadioButtonGroupComponent,
  IdsRadioButtonComponent,
  IdsFormLabelComponent,
  IdsErrorComponent,
  IdsErrorTextComponent,
  IdsIconComponent,
] as const;

export { IdsRadioButtonGroupComponent, IdsRadioButtonComponent };
export type { RadioButtonGroupLabelPosition } from "./ids-radio-button-group-context";
