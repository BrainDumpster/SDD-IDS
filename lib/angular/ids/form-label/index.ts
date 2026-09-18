import { IdsFormLabelComponent } from "./ids-form-label.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_FORM_LABEL_IMPORTS = [
  IdsFormLabelComponent,
  IdsIconComponent,
] as const;

export { IdsFormLabelComponent };
export {
  resolveFormLabelBoolean,
  resolveFormLabelSize,
} from "./ids-form-label.utils";
