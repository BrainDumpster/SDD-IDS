import { IdsIconComponent } from "../icon/ids-icon.component";
import { IdsProgressBarComponent } from "./ids-progress-bar.component";

export const IDS_PROGRESS_BAR_IMPORTS = [
  IdsProgressBarComponent,
  IdsIconComponent,
] as const;

export { IdsProgressBarComponent };
export {
  resolveProgressBarType,
  resolveProgressBarThickness,
  resolveProgressBarState,
  clampProgressBarValue,
  resolveShowHelperText,
  helperIconSlugForState,
} from "./ids-progress-bar.utils";
