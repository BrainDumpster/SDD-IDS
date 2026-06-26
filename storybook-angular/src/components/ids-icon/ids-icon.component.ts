import { Component, Input } from "@angular/core";
import { NgClass } from "@angular/common";

export type IdsIconVariant = "img" | "mask";

/**
 * IDS icon — loads SVG assets from `/assets/icons/<shapeName>.svg`.
 * Prefer `variant="img"` (default); mask is reserved for rare tint cases.
 */
@Component({
  selector: "ids-icon",
  standalone: true,
  imports: [NgClass],
  template: `
    @if (variant === "mask") {
      <span
        class="ids-icon__mask"
        [ngClass]="className"
        [style.mask-image]="maskImage"
        aria-hidden="true"
      ></span>
    } @else {
      <img
        class="ids-icon__asset"
        [ngClass]="className"
        [src]="src"
        alt=""
        aria-hidden="true"
      />
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        flex-shrink: 0;
        line-height: 0;
        box-sizing: border-box;
        color: inherit;
      }

      .ids-icon__asset {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .ids-icon__mask {
        display: block;
        width: 100%;
        height: 100%;
        background-color: currentColor;
        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
        -webkit-mask-size: contain;
      }
    `,
  ],
  host: {
    class: "ids-icon",
    "[style.width.px]": "size",
    "[style.height.px]": "size",
  },
})
export class IdsIconComponent {
  @Input({ required: true }) shapeName!: string;
  @Input() size = 16;
  @Input() variant: IdsIconVariant = "img";
  @Input() className = "";

  get src(): string {
    return `/assets/icons/${this.shapeName}.svg`;
  }

  get maskImage(): string {
    return `url(${this.src})`;
  }
}
