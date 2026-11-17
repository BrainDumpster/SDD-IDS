import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
  CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS,
  type CheckboxGroupOrientation,
} from "@component-contracts/ids/checkbox.contract";
import { IdsErrorComponent, IdsErrorTextComponent } from "../error";
import { IdsFormLabelComponent } from "../form-label/ids-form-label.component";
import {
  IDS_CHECKBOX_GROUP_CONTEXT,
  type CheckboxGroupLabelPosition,
  type IdsCheckboxGroupContext,
} from "./ids-checkbox-group-context";

let checkboxGroupUid = 0;

@Component({
  selector: "ids-checkbox-group",
  standalone: true,
  imports: [IdsFormLabelComponent, IdsErrorComponent, IdsErrorTextComponent],
  templateUrl: "./ids-checkbox-group.component.html",
  styleUrl: "./ids-checkbox-group.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IDS_CHECKBOX_GROUP_CONTEXT, useExisting: IdsCheckboxGroupComponent }],
})
export class IdsCheckboxGroupComponent implements IdsCheckboxGroupContext {
  private readonly uid = ++checkboxGroupUid;

  @Input() disabled = CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() orientation: CheckboxGroupOrientation =
    CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS.orientation;
  @Input() name?: string;
  @Input() idPrefix?: string;
  /** Form label text for the whole group. */
  @Input() label?: string;
  /** When false, hide the form label and use `ariaLabel` for the accessible name. */
  @Input() showLabel = true;
  /** Accessible name when no visible label is rendered. */
  @Input() ariaLabel?: string;
  /** Form label position relative to options. */
  @Input() labelPosition: CheckboxGroupLabelPosition = "left";
  /** Renders `*` in the form label and sets `aria-required` on the group. */
  @Input() required = false;
  /** When truthy, shows the shared form-label info icon (`showInfoIcon`). */
  @Input() labelIcon: unknown;
  /** Group-wide error; cascades to children and renders `errorText`. */
  @Input() error = false;
  /** Validation error message when `error` is true. */
  @Input() errorText?: string;

  get shouldRenderLabel(): boolean {
    return this.showLabel && Boolean(this.label);
  }

  get hasErrorMessage(): boolean {
    return Boolean(this.error && this.errorText);
  }

  get labelId(): string {
    return `ids-checkbox-group-${this.uid}-label`;
  }

  get errorId(): string {
    return `ids-checkbox-group-${this.uid}-error`;
  }

  get showInfoIcon(): boolean {
    return Boolean(this.labelIcon);
  }
}
