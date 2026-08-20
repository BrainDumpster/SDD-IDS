import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { IdsAvatarComponent } from "../avatar/ids-avatar.component";

/**
 * Masthead account control — button chrome around `ids-avatar`.
 *
 * @example
 * ```html
 * <ids-masthead-avatar [initials]="'JD'" ariaLabel="User settings" />
 * <ids-masthead-avatar [icon]="'user-single'" ariaLabel="User settings" />
 * ```
 */
@Component({
  selector: "ids-masthead-avatar",
  standalone: true,
  imports: [IdsAvatarComponent],
  templateUrl: "./ids-masthead-avatar.component.html",
  styleUrl: "./ids-masthead-avatar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsMastheadAvatarComponent {
  @Input() initials?: string;
  /** Icon asset slug (e.g. `user-single`). Takes precedence over `initials`. */
  @Input() icon?: string;
  @Input() imageSrc?: string;
  @Input() imageAlt = "User avatar";
  @Input({ alias: "ariaLabel", required: true }) ariaLabel!: string;
  @Input() ariaExpanded?: boolean;

  /**
   * Priority matches `ids-avatar`: imageSrc → icon → initials.
   * Initials phrase only when showing initials.
   */
  get computedAriaLabel(): string {
    if (this.imageSrc || this.icon) {
      return this.ariaLabel;
    }
    if (this.initials) {
      return `User initials ${this.initials}`;
    }
    return this.ariaLabel;
  }
}
