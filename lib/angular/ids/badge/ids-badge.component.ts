import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
  BADGE_SPEC_ACCURATE_DEFAULTS,
  type BadgeType,
} from "@component-contracts/ids/badge.contract";

type BadgeSizeClass = "single-digit" | "two-digits" | "three-plus-digits";

@Component({
  selector: "ids-badge",
  standalone: true,
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

  get sizeClass(): BadgeSizeClass {
    const len = this.valueText.length;
    if (len <= 1) {
      return "single-digit";
    }
    if (len === 2) {
      return "two-digits";
    }
    return "three-plus-digits";
  }
}
