import { InjectionToken } from "@angular/core";
import type { CheckboxGroupOrientation } from "@component-contracts/ids/checkbox.contract";

export type CheckboxGroupLabelPosition = "left" | "top";

export interface IdsCheckboxGroupContext {
  readonly disabled: boolean;
  readonly orientation: CheckboxGroupOrientation;
  readonly error: boolean;
  readonly name?: string;
  readonly idPrefix?: string;
}

export const IDS_CHECKBOX_GROUP_CONTEXT = new InjectionToken<IdsCheckboxGroupContext>(
  "IDS_CHECKBOX_GROUP_CONTEXT",
);
