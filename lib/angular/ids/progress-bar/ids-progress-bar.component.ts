import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  PROGRESS_BAR_RUNTIME_DEFAULTS,
  type IdsProgressBarState,
  type IdsProgressBarThickness,
  type IdsProgressBarType,
} from "@component-contracts/ids/progress-bar.contract";
import {
  clampProgressBarValue,
  helperIconSlugForState,
  resolveProgressBarState,
  resolveProgressBarThickness,
  resolveProgressBarType,
  resolveShowHelperText,
} from "./ids-progress-bar.utils";

@Component({
  selector: "ids-progress-bar",
  standalone: true,
  imports: [NgTemplateOutlet, IdsIconComponent],
  templateUrl: "./ids-progress-bar.component.html",
  styleUrl: "./ids-progress-bar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    "[class]": "rootClassName",
    "[attr.data-ids]": "'ids-progress-bar'",
    "[attr.data-type]": "resolvedType",
    "[attr.data-thickness]": "resolvedThickness",
    "[attr.data-state]": "resolvedState",
    "[attr.data-value-full]": 'valueFull ? "true" : null',
    "[attr.role]": "'progressbar'",
    "[attr.aria-valuemin]": "isIndeterminate ? null : 0",
    "[attr.aria-valuemax]": "isIndeterminate ? null : 100",
    "[attr.aria-valuenow]": "isIndeterminate ? null : clampedValue",
    "[attr.aria-label]": "ariaLabel",
    "[style.--progress-clip]": "progressClip",
  },
})
export class IdsProgressBarComponent {
  @Input() value: number | string = PROGRESS_BAR_RUNTIME_DEFAULTS.value;
  @Input() label?: string;
  @Input() helperText?: string;
  @Input() showHelperText: boolean | string =
    PROGRESS_BAR_RUNTIME_DEFAULTS.showHelperText;
  @Input() type: IdsProgressBarType | string = PROGRESS_BAR_RUNTIME_DEFAULTS.type;
  @Input() thickness: IdsProgressBarThickness | string =
    PROGRESS_BAR_RUNTIME_DEFAULTS.thickness;
  @Input() state: IdsProgressBarState | string =
    PROGRESS_BAR_RUNTIME_DEFAULTS.state;
  @Input() className?: string;

  get resolvedType(): IdsProgressBarType {
    return resolveProgressBarType(this.type);
  }

  get resolvedThickness(): IdsProgressBarThickness {
    return resolveProgressBarThickness(this.thickness);
  }

  get resolvedState(): IdsProgressBarState {
    return resolveProgressBarState(this.state);
  }

  get clampedValue(): number {
    return clampProgressBarValue(this.value);
  }

  get isIndeterminate(): boolean {
    return this.resolvedType === "indeterminate";
  }

  get isWithLabel(): boolean {
    return this.resolvedType === "with-label";
  }

  get isInline(): boolean {
    return this.resolvedType === "inline";
  }

  get showPercentage(): boolean {
    return !this.isIndeterminate;
  }

  get percentLabel(): string {
    return `${Math.round(this.clampedValue)}%`;
  }

  get progressClip(): string {
    return this.isIndeterminate ? "0%" : `${this.clampedValue}%`;
  }

  get valueFull(): boolean {
    return !this.isIndeterminate && this.clampedValue >= 100;
  }

  get ariaLabel(): string {
    return this.label ?? "Progress";
  }

  get showHelperRow(): boolean {
    return (
      resolveShowHelperText(this.showHelperText) &&
      this.helperText != null &&
      String(this.helperText) !== ""
    );
  }

  get helperIconSlug(): string | undefined {
    return helperIconSlugForState(this.resolvedState);
  }

  get showHelperIcon(): boolean {
    return this.helperIconSlug != null;
  }

  get indicatorWidth(): string | null {
    return this.isIndeterminate ? null : `${this.clampedValue}%`;
  }

  get rootClassName(): string {
    const classes = [
      "ids-progress-bar",
      `ids-progress-bar--${this.resolvedThickness}`,
      `ids-progress-bar--${this.resolvedState}`,
    ];
    if (this.isIndeterminate) {
      classes.push("ids-progress-bar--indeterminate");
    }
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }
}
