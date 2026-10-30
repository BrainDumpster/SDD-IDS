import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import {
  ICON_SPEC_ACCURATE_DEFAULTS,
  type IconVariant,
} from "@component-contracts/ids/icon.contract";
import { idsAssetUrl } from "../../../shared/ids-assets-base.js";

/**
 * IDS Icon — mask/img/inline (React IdsIcon parity).
 *
 * Mask URL is applied via native `style.setProperty` because Angular's style
 * sanitizer strips `url(...)` from HostBinding / NgStyle (symptoms: solid
 * colored squares instead of glyphs).
 */
@Component({
  selector: "ids-icon",
  standalone: true,
  templateUrl: "./ids-icon.component.html",
  styleUrl: "./ids-icon.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-ids]": "'ids-icon'",
    "[attr.data-shape]": "shape",
    "[attr.data-variant]": "resolvedVariant",
    "[attr.data-missing]": "missing ? 'true' : null",
  },
})
export class IdsIconComponent implements OnInit, OnChanges {
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

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly host: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.applyMaskStyles();
  }

  /** Inline without a registry → mask (matches React fallback). */
  get resolvedVariant(): IconVariant {
    if (this.variant === "inline") return "mask";
    return this.variant;
  }

  @HostBinding("class")
  get hostClassList(): string {
    return [
      "ids-icon",
      `ids-icon--${this.resolvedVariant}`,
      this.className,
      this.missing ? "ids-icon--missing" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  @HostBinding("style.width")
  get hostWidth(): string {
    return this.resolvedSize;
  }

  @HostBinding("style.height")
  get hostHeight(): string {
    return this.resolvedSize;
  }

  @HostBinding("style.display")
  get hostDisplay(): string {
    return this.resolvedVariant === "mask" ? "inline-block" : "inline-flex";
  }

  @HostBinding("style.flex-shrink")
  readonly hostFlexShrink = "0";

  @HostBinding("style.vertical-align")
  readonly hostVerticalAlign = "middle";

  @HostBinding("style.box-sizing")
  readonly hostBoxSizing = "border-box";

  @HostBinding("style.line-height")
  readonly hostLineHeight = "0";

  @HostBinding("style.color")
  get hostColor(): string | null {
    return this.color || null;
  }

  @HostBinding("style.--ids-icon-color")
  get hostIconColorVar(): string | null {
    return this.color || null;
  }

  @HostBinding("style.background-color")
  get hostBackgroundColor(): string | null {
    if (this.resolvedVariant !== "mask" || !this.shape || this.missing) return null;
    return "var(--ids-icon-color, currentColor)";
  }

  @HostBinding("attr.role")
  get hostRole(): string {
    return this.title ? "img" : "presentation";
  }

  @HostBinding("attr.aria-label")
  get hostAriaLabel(): string | null {
    return this.title || null;
  }

  @HostBinding("attr.aria-hidden")
  get hostAriaHidden(): string | null {
    return this.title ? null : "true";
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.applyMaskStyles();
  }

  onAssetError(): void {
    this.missing = true;
    this.applyMaskStyles();
    this.cdr.markForCheck();
  }

  get resolvedSize(): string {
    return typeof this.size === "number" ? `${this.size}px` : this.size;
  }

  get iconUrl(): string {
    return idsAssetUrl(`icons/${this.shape}.svg`);
  }

  /** Apply mask via DOM — Angular HostBinding sanitizes away `url(...)`. */
  private applyMaskStyles(): void {
    const el = this.host.nativeElement;
    const useMask =
      this.resolvedVariant === "mask" && Boolean(this.shape) && !this.missing;

    if (!useMask) {
      el.style.removeProperty("mask-image");
      el.style.removeProperty("-webkit-mask-image");
      el.style.removeProperty("mask-size");
      el.style.removeProperty("-webkit-mask-size");
      el.style.removeProperty("mask-repeat");
      el.style.removeProperty("-webkit-mask-repeat");
      el.style.removeProperty("mask-position");
      el.style.removeProperty("-webkit-mask-position");
      return;
    }

    const mask = `url("${this.iconUrl}")`;
    el.style.setProperty("mask-image", mask);
    el.style.setProperty("-webkit-mask-image", mask);
    el.style.setProperty("mask-size", "contain");
    el.style.setProperty("-webkit-mask-size", "contain");
    el.style.setProperty("mask-repeat", "no-repeat");
    el.style.setProperty("-webkit-mask-repeat", "no-repeat");
    el.style.setProperty("mask-position", "center");
    el.style.setProperty("-webkit-mask-position", "center");
  }
}
