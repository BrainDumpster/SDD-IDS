import { IdsRadioButtonGroupComponent } from "./ids-radio-button-group.component";
import { IdsRadioButtonComponent } from "./ids-radio-button.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";

/** Standalone imports for IDS Radio Button composition stories and app wiring. */
export const IDS_RADIO_BUTTON_IMPORTS = [
  IdsRadioButtonGroupComponent,
  IdsRadioButtonComponent,
  IdsIconComponent,
] as const;

export { IdsRadioButtonGroupComponent, IdsRadioButtonComponent };
