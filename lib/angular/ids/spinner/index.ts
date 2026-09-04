import { IdsSpinnerComponent } from "./ids-spinner.component";

export const IDS_SPINNER_IMPORTS = [IdsSpinnerComponent] as const;

export { IdsSpinnerComponent };
export {
  resolveSpinnerAriaLive,
  resolveSpinnerLabel,
  resolveSpinnerLabelVisibility,
  resolveSpinnerMode,
  resolveSpinnerSize,
} from "./ids-spinner.utils";
