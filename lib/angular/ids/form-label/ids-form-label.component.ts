import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
  FORM_LABEL_RUNTIME_DEFAULTS,
  type IdsFormLabelSize,
} from "@component-contracts/ids/form-label.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  resolveFormLabelBoolean,
  resolveFormLabelSize,
} from "./ids-form-label.utils";

@Component({
  selector: "ids-form-label",
  standalone: true,
  imports: [IdsIconComponent],
  templateUrl: "./ids-form-label.component.html",
  styleUrl: "./ids-form-label.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: "display: contents",
  },
})
export class IdsFormLabelComponent {
  /** Label text content. */
  @Input() label = "";
  /** Visual size mapped to Figma `Size` 24/32/40. Default `md`. Unknown → `md`. */
  @Input() size: IdsFormLabelSize | string = FORM_LABEL_RUNTIME_DEFAULTS.size;
  /** Render trailing required marker `*`. Default `false`. */
  @Input() required: boolean | string = FORM_LABEL_RUNTIME_DEFAULTS.required;
  /** Render the `info-circ-solid` info icon. Default `false`. */
  @Input() showInfoIcon: boolean | string =
    FORM_LABEL_RUNTIME_DEFAULTS.showInfoIcon;
  /** Accessible name for the info icon; when empty the icon is decorative. */
  @Input() infoLabel?: string;
  /** Associates the label to a control `id` (native `<label for>`). */
  @Input() htmlFor?: string;
  @Input() className?: string;

  get resolvedSize(): IdsFormLabelSize {
    return resolveFormLabelSize(this.size);
  }

  get isRequired(): boolean {
    return resolveFormLabelBoolean(this.required);
  }

  get isInfoIconShown(): boolean {
    return resolveFormLabelBoolean(this.showInfoIcon);
  }

  get iconDecorative(): boolean {
    return this.infoLabel == null || this.infoLabel.trim() === "";
  }

  get rootClassName(): string {
    const classes = ["ids-form-label", `ids-form-label--${this.resolvedSize}`];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }
}
