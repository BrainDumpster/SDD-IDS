import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from "@angular/core";
import { IdsBadgeComponent } from "../badge/ids-badge.component";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  IdsTooltipArrowComponent,
  IdsTooltipBodyComponent,
  IdsTooltipComponent,
  IdsTooltipHeaderComponent,
  IdsTooltipPanelComponent,
  IdsTooltipTitleComponent,
  IdsTooltipTriggerComponent,
} from "../tooltip";
import type { IdsDropdownSize } from "./ids-dropdown.types";

@Component({
  selector: "ids-dropdown-trigger-shell",
  standalone: true,
  imports: [
    IdsIconComponent,
    IdsBadgeComponent,
    IdsTooltipComponent,
    IdsTooltipTriggerComponent,
    IdsTooltipPanelComponent,
    IdsTooltipHeaderComponent,
    IdsTooltipTitleComponent,
    IdsTooltipBodyComponent,
    IdsTooltipArrowComponent,
  ],
  templateUrl: "./ids-dropdown-trigger-shell.component.html",
  styleUrl: "./ids-dropdown-trigger-shell.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-popup-open]": "null",
  },
})
export class IdsDropdownTriggerShellComponent {
  @Input() size: IdsDropdownSize = "large";
  @Input() disabled = false;
  @Input() error = false;
  /** Demo-only: simulates Figma hover border. */
  @Input() hover = false;
  /** Demo-only: keyboard focus ring. */
  @Input() focusVisible = false;
  /** True when the field shows selected option(s) — adds right padding to the content. */
  @Input() filled = false;

  /**
   * Multiselect field badge (React/spec `showSelectedBadge`).
   * Shows a count badge when `selectedLabels` is non-empty.
   */
  @Input() showSelectedBadge = true;
  /**
   * Multiselect selected-summary tooltip on the badge (React/spec `showSelectedTooltip`).
   * Only applies when the badge is shown.
   */
  @Input() showSelectedTooltip = true;
  /** Selected option labels — drives badge count and tooltip body. */
  @Input() selectedLabels: string[] = [];

  constructor(readonly cdr: ChangeDetectorRef) {}

  get selectedCount(): number {
    return this.selectedLabels?.length ?? 0;
  }

  get showBadge(): boolean {
    return this.showSelectedBadge && this.selectedCount > 0;
  }

  get selectedDisplay(): string {
    return (this.selectedLabels ?? []).join(", ");
  }

  get badgeType(): "default" | "disabled" {
    return this.disabled ? "disabled" : "default";
  }
}
