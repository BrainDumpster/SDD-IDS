import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import type { IdsDropdownSize } from "./ids-dropdown.types";

@Component({
  selector: "ids-dropdown-trigger-shell",
  standalone: true,
  imports: [IdsIconComponent],
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
}
