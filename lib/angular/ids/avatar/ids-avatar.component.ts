import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import {
  AVATAR_SPEC_ACCURATE_DEFAULTS,
} from "@component-contracts/ids/avatar.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";

/**
 * Presentational avatar chip — initials, icon slug, or photo.
 *
 * @example
 * ```html
 * <ids-avatar [icon]="'user-single'"></ids-avatar>
 * <ids-avatar [initials]="'JD'"></ids-avatar>
 * ```
 *
 * Priority: `imageSrc` → `icon` → `initials`.
 */
@Component({
  selector: "ids-avatar",
  standalone: true,
  imports: [IdsIconComponent],
  templateUrl: "./ids-avatar.component.html",
  styleUrl: "./ids-avatar.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ids-avatar-host",
    "[attr.data-ids]": "'ids-avatar'",
    "[attr.data-mode]": "mode",
  },
})
export class IdsAvatarComponent {
  /** Two-letter (or short) initials shown when no `icon` / `imageSrc`. */
  @Input() initials?: string;

  /** Icon asset slug (e.g. `user-single`) — renders via `ids-icon`. */
  @Input() icon?: string;

  /** Photo URL — fills the chip when set. */
  @Input() imageSrc?: string;

  @Input() imageAlt: string = AVATAR_SPEC_ACCURATE_DEFAULTS.imageAlt;

  /** Chip diameter in px (default 32). */
  @Input() size: number | string = AVATAR_SPEC_ACCURATE_DEFAULTS.size;

  /** Glyph size in px when using `icon` (default 16). */
  @Input() iconSize: number | string = AVATAR_SPEC_ACCURATE_DEFAULTS.iconSize;

  get mode(): "photo" | "icon" | "initials" | "empty" {
    if (this.imageSrc) return "photo";
    if (this.icon) return "icon";
    if (this.initials) return "initials";
    return "empty";
  }

  get resolvedSize(): string {
    return typeof this.size === "number" ? `${this.size}px` : this.size;
  }

  get resolvedIconSize(): number {
    if (typeof this.iconSize === "number") return this.iconSize;
    const parsed = Number.parseInt(String(this.iconSize), 10);
    return Number.isFinite(parsed) ? parsed : AVATAR_SPEC_ACCURATE_DEFAULTS.iconSize;
  }
}
