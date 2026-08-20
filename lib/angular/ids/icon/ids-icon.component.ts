import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, ViewEncapsulation } from "@angular/core";
import { NgClass, NgStyle } from "@angular/common";
import {
  ICON_SPEC_ACCURATE_DEFAULTS,
  type IconVariant,
} from "@component-contracts/ids/icon.contract";

@Component({
  selector: "ids-icon",
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: "./ids-icon.component.html",
  styleUrl: "./ids-icon.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "className || ''",
    "[style.color]": "color || null",
    "[attr.data-ids]": "'ids-icon'",
    "[attr.data-shape]": "shape",
    "[attr.data-variant]": "variant",
    "[attr.data-missing]": "missing ? 'true' : null",
  },
})
export class IdsIconComponent {
  @Input() shape: string = ICON_SPEC_ACCURATE_DEFAULTS.shape;
  /** Alias for `shape` — used by templates that bind `[shapeName]`. */
  @Input() set shapeName(value: string) {
    this.shape = value;
  }
  get shapeName(): string {
    return this.shape;
  }
  @Input() color?: string = ICON_SPEC_ACCURATE_DEFAULTS.color;
  @Input() size: number | string = ICON_SPEC_ACCURATE_DEFAULTS.size;
  @Input() variant: IconVariant = ICON_SPEC_ACCURATE_DEFAULTS.variant;
  @Input() className?: string = ICON_SPEC_ACCURATE_DEFAULTS.className;
  @Input() title?: string = ICON_SPEC_ACCURATE_DEFAULTS.title;
  @Input() style?: Record<string, string> = ICON_SPEC_ACCURATE_DEFAULTS.style;
  missing = false;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  @HostBinding("style.width")
  get hostWidth(): string {
    return this.resolvedSize;
  }

  @HostBinding("style.height")
  get hostHeight(): string {
    return this.resolvedSize;
  }

  @HostBinding("style.display")
  readonly hostDisplay = "inline-flex";

  @HostBinding("style.flex-shrink")
  readonly hostFlexShrink = "0";

  @HostBinding("style.align-items")
  readonly hostAlignItems = "center";

  @HostBinding("style.justify-content")
  readonly hostJustifyContent = "center";

  @HostBinding("style.line-height")
  readonly hostLineHeight = "0";

  @HostBinding("style.overflow")
  readonly hostOverflow = "hidden";

  @HostBinding("style.vertical-align")
  readonly hostVerticalAlign = "middle";

  onAssetError(): void {
    this.missing = true;
    this.cdr.markForCheck();
  }

  get resolvedSize(): string {
    return typeof this.size === "number" ? `${this.size}px` : this.size;
  }

  get iconUrl(): string {
    return `/assets/icons/${this.shape}.svg`;
  }

  get hostClasses(): Record<string, boolean> {
    return {
      "ids-icon": true,
      [`ids-icon--${this.variant}`]: true,
      ...(this.className ? { [this.className]: true } : {}),
    };
  }

  get hostStyles(): Record<string, string> {
    const size = this.resolvedSize;
    const styles: Record<string, string> = {
      width: size,
      height: size,
    };

    if (this.color) {
      styles["--ids-icon-color"] = this.color;
      styles["color"] = this.color;
    }

    return styles;
  }

  get rootStyles(): Record<string, string> {
    const styles: Record<string, string> = {
      ...this.hostStyles,
      ...(this.style ?? {}),
    };

    if (this.variant !== "mask" || !this.shape) {
      return styles;
    }

    const maskUrl = `url(${this.iconUrl})`;
    return {
      ...styles,
      backgroundColor: "var(--ids-icon-color, currentColor)",
      "mask-image": maskUrl,
      "-webkit-mask-image": maskUrl,
    };
  }
}
