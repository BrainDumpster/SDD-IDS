import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { type BadgeType } from "@component-contracts/ids/badge.contract";
import { IdsBadgeComponent } from "../badge/ids-badge.component";

@Component({
  selector: "ids-masthead-action-icon-button",
  standalone: true,
  imports: [IdsBadgeComponent],
  templateUrl: "./ids-masthead-action-icon-button.component.html",
  styleUrl: "./ids-masthead-action-icon-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsMastheadActionIconButtonComponent {
  @Input({ alias: "ariaLabel", required: true }) ariaLabel!: string;
  @Input() badgeCount?: number;
  @Input() badgeType: BadgeType = "critical";
  @Input() ariaExpanded?: boolean;

  get showBadge(): boolean {
    return typeof this.badgeCount === "number" && this.badgeCount > 0;
  }

  get badgeLabel(): string {
    if (!this.badgeCount || this.badgeCount <= 0) {
      return "";
    }
    return this.badgeCount > 99 ? "99+" : String(this.badgeCount);
  }
}
