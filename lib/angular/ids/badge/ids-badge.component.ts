import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
  BADGE_SPEC_ACCURATE_DEFAULTS,
  type BadgeType,
} from "@component-contracts/ids/badge.contract";
import {
  IdsTooltipBodyComponent,
  IdsTooltipComponent,
  IdsTooltipPanelComponent,
  IdsTooltipTriggerComponent,
  IdsTooltipArrowComponent,
} from "../tooltip";

type BadgeSizeClass = "single-digit" | "two-digits" | "three-plus-digits";

@Component({
  selector: "ids-badge",
  standalone: true,
  imports: [
    IdsTooltipComponent,
    IdsTooltipTriggerComponent,
    IdsTooltipPanelComponent,
    IdsTooltipBodyComponent,
    IdsTooltipArrowComponent,
  ],
  templateUrl: "./ids-badge.component.html",
  styleUrl: "./ids-badge.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsBadgeComponent {
  @Input() value: string | number = BADGE_SPEC_ACCURATE_DEFAULTS.value;
  @Input() type: BadgeType = BADGE_SPEC_ACCURATE_DEFAULTS.type;
  @Input() ariaLabel?: string;

  get valueText(): string {
    return String(this.value);
  }

  /** Design-spec / React: numeric values greater than 999 truncate to `1K`. */
  get isLargeNumber(): boolean {
    const numericValue = Number(this.value);
    return !Number.isNaN(numericValue) && numericValue > 999;
  }

  get displayText(): string {
    return this.isLargeNumber ? "1K" : this.valueText;
  }

  get resolvedAriaLabel(): string | null {
    if (this.ariaLabel) return this.ariaLabel;
    if (this.isLargeNumber) return this.valueText;
    return null;
  }

  get sizeClass(): BadgeSizeClass {
    const len = this.displayText.length;
    if (len <= 1) {
      return "single-digit";
    }
    if (len === 2) {
      return "two-digits";
    }
    return "three-plus-digits";
  }
}
