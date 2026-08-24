import { IdsCheckboxComponent } from "./ids-checkbox.component";
import { IdsCheckboxGroupComponent } from "./ids-checkbox-group.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_CHECKBOX_IMPORTS = [
  IdsCheckboxGroupComponent,
  IdsCheckboxComponent,
  IdsIconComponent,
] as const;

export { IdsCheckboxGroupComponent, IdsCheckboxComponent };
