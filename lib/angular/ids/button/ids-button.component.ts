import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  BUTTON_SPEC_ACCURATE_DEFAULTS,
  type ButtonSize,
  type ButtonVariant,
} from "@component-contracts/ids/button.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";

@Component({
  selector: "ids-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ids-button.component.html",
  styleUrl: "./ids-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsButtonComponent {
  readonly leadingIcon = contentChild(IdsIconComponent);

  @Input() variant: ButtonVariant = BUTTON_SPEC_ACCURATE_DEFAULTS.variant;
  @Input() size: ButtonSize = BUTTON_SPEC_ACCURATE_DEFAULTS.size;
  @Input() disabled = BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() loading = BUTTON_SPEC_ACCURATE_DEFAULTS.loading;
  @Input() iconOnly: boolean = BUTTON_SPEC_ACCURATE_DEFAULTS.iconOnly;
  @Input() ariaLabel = "";
  @Input() type: "button" | "submit" | "reset" = "button";

  @Output() readonly clicked = new EventEmitter<MouseEvent>();

  get variantClass(): string {
    return this.variant === "destructive" ? "danger" : this.variant;
  }

  get hasLeadingIcon(): boolean {
    return Boolean(this.leadingIcon()) && this.variant !== "destructive";
  }

  get resolvedIconOnly(): boolean {
    return this.iconOnly && this.variant !== "destructive";
  }

  onClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
