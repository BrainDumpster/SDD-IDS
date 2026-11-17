import { IdsCheckboxComponent } from "./ids-checkbox.component";
import { IdsCheckboxGroupComponent } from "./ids-checkbox-group.component";
import { IdsErrorComponent, IdsErrorTextComponent } from "../error";
import { IdsFormLabelComponent } from "../form-label/ids-form-label.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_CHECKBOX_IMPORTS = [
  IdsCheckboxGroupComponent,
  IdsCheckboxComponent,
  IdsFormLabelComponent,
  IdsErrorComponent,
  IdsErrorTextComponent,
  IdsIconComponent,
] as const;

export { IdsCheckboxGroupComponent, IdsCheckboxComponent };
export type { CheckboxGroupLabelPosition } from "./ids-checkbox-group-context";
