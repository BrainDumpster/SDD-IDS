import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { NgStyle } from "@angular/common";
import { ERROR_ICON_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/error.contract";
import { idsAssetUrl } from "../../../shared/ids-assets-base.js";

@Component({
  selector: "ids-error-icon",
  standalone: true,
  imports: [NgStyle],
  templateUrl: "./ids-error-icon.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsErrorIconComponent {
  @Input() shape: string = ERROR_ICON_SPEC_ACCURATE_DEFAULTS.shape;
  @Input() size: number = ERROR_ICON_SPEC_ACCURATE_DEFAULTS.size;
  @Input() className?: string = ERROR_ICON_SPEC_ACCURATE_DEFAULTS.className;

  get resolvedSize(): string {
    return `${this.size}px`;
  }

  get iconUrl(): string {
    return idsAssetUrl(`icons/${this.shape}.svg`);
  }

  get maskStyles(): Record<string, string> {
    const size = this.resolvedSize;
    return {
      width: size,
      height: size,
      "mask-image": `url(${this.iconUrl})`,
      "-webkit-mask-image": `url(${this.iconUrl})`,
    };
  }
}
