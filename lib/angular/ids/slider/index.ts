import { IdsSliderComponent } from "./ids-slider.component";
import { IdsTextBoxComponent } from "../text-box/ids-text-box.component";

export const IDS_SLIDER_IMPORTS = [IdsSliderComponent, IdsTextBoxComponent] as const;

export { IdsSliderComponent };
export {
  resolveSliderMode,
  normalizeStep,
  normalizeFrequency,
  toArrayValue,
  toOutputValue,
} from "./ids-slider.utils";
