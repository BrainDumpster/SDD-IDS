import { IdsErrorComponent } from "./ids-error.component";
import { IdsErrorIconComponent } from "./ids-error-icon.component";
import { IdsErrorTextComponent } from "./ids-error-text.component";

/** Import this array wherever ids-error composition markup is used. */
export const IDS_ERROR_IMPORTS = [
  IdsErrorComponent,
  IdsErrorIconComponent,
  IdsErrorTextComponent,
] as const;

export { IdsErrorComponent, IdsErrorIconComponent, IdsErrorTextComponent };
