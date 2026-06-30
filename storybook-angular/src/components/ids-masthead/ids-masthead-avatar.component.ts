import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "ids-masthead-avatar",
  standalone: true,
  templateUrl: "./ids-masthead-avatar.component.html",
  styleUrl: "./ids-masthead-avatar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsMastheadAvatarComponent {
  @Input() initials?: string;
  @Input() imageSrc?: string;
  @Input() imageAlt = "User avatar";
  @Input({ alias: "ariaLabel", required: true }) ariaLabel!: string;
  @Input() ariaExpanded?: boolean;

  get computedAriaLabel(): string {
    if (this.initials) {
      return `User initials ${this.initials}`;
    }
    return this.ariaLabel;
  }
}
