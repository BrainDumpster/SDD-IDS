import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import {
  SPINNER_RUNTIME_DEFAULTS,
  type IdsSpinnerAriaLive,
  type IdsSpinnerLabelVisibility,
  type IdsSpinnerMode,
  type IdsSpinnerSize,
} from "@component-contracts/ids/spinner.contract";
import {
  resolveSpinnerAriaLive,
  resolveSpinnerLabel,
  resolveSpinnerLabelVisibility,
  resolveSpinnerMode,
  resolveSpinnerSize,
} from "./ids-spinner.utils";

@Component({
  selector: "ids-spinner",
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: "./ids-spinner.component.html",
  styleUrl: "./ids-spinner.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: "display: contents",
  },
})
export class IdsSpinnerComponent {
  @Input() size: IdsSpinnerSize | string = SPINNER_RUNTIME_DEFAULTS.size;
  @Input() mode: IdsSpinnerMode | string = SPINNER_RUNTIME_DEFAULTS.mode;
  @Input() label: string = SPINNER_RUNTIME_DEFAULTS.label;
  @Input() labelVisibility: IdsSpinnerLabelVisibility | string =
    SPINNER_RUNTIME_DEFAULTS.labelVisibility;
  @Input() ariaLive: IdsSpinnerAriaLive | string =
    SPINNER_RUNTIME_DEFAULTS.ariaLive;
  @Input() tabIndex: number | string | null | undefined;
  @Input() className?: string;

  get resolvedSize(): IdsSpinnerSize {
    return resolveSpinnerSize(this.size);
  }

  get resolvedMode(): IdsSpinnerMode {
    return resolveSpinnerMode(this.mode);
  }

  get resolvedLabel(): string {
    return resolveSpinnerLabel(this.label);
  }

  get resolvedLabelVisibility(): IdsSpinnerLabelVisibility {
    return resolveSpinnerLabelVisibility(
      this.resolvedSize,
      this.resolvedMode,
      this.labelVisibility,
    );
  }

  get resolvedAriaLive(): IdsSpinnerAriaLive {
    return resolveSpinnerAriaLive(this.ariaLive);
  }

  get showVisibleInline(): boolean {
    return this.resolvedLabelVisibility === "visible-inline";
  }

  get showVisibleBelow(): boolean {
    return this.resolvedLabelVisibility === "visible-below";
  }

  get showSrOnly(): boolean {
    return this.resolvedLabelVisibility === "sr-only";
  }

  get rootClassName(): string {
    const classes = [
      "ids-spinner",
      `ids-spinner--${this.resolvedSize}`,
      `ids-spinner--${this.resolvedMode}`,
    ];
    if (this.showVisibleInline) {
      classes.push("ids-spinner--layout-inline");
    }
    if (this.showVisibleBelow) {
      classes.push("ids-spinner--layout-stack");
    }
    if (this.showSrOnly) {
      classes.push("ids-spinner--layout-sr-only");
    }
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }
}
