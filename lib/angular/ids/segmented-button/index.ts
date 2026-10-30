import { IdsSegmentedButtonsComponent } from "./ids-segmented-buttons.component";
import { IdsSegmentedTextComponent } from "./ids-segmented-text.component";
import { IdsSegmentedIconComponent } from "./ids-segmented-icon.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_SEGMENTED_BUTTON_IMPORTS = [
  IdsSegmentedButtonsComponent,
  IdsSegmentedTextComponent,
  IdsSegmentedIconComponent,
  IdsIconComponent,
] as const;

export { IdsSegmentedButtonsComponent, IdsSegmentedTextComponent, IdsSegmentedIconComponent };
