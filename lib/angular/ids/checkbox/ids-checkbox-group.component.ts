import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
  CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS,
  type CheckboxGroupOrientation,
} from "@component-contracts/ids/checkbox.contract";
import {
  IDS_CHECKBOX_GROUP_CONTEXT,
  type IdsCheckboxGroupContext,
} from "./ids-checkbox-group-context";

@Component({
  selector: "ids-checkbox-group",
  standalone: true,
  templateUrl: "./ids-checkbox-group.component.html",
  styleUrl: "./ids-checkbox-group.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IDS_CHECKBOX_GROUP_CONTEXT, useExisting: IdsCheckboxGroupComponent }],
})
export class IdsCheckboxGroupComponent implements IdsCheckboxGroupContext {
  @Input() disabled = CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() orientation: CheckboxGroupOrientation =
    CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS.orientation;
  @Input() name?: string;
  @Input() idPrefix?: string;
}
