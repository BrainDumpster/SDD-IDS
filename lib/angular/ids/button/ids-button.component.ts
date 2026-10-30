import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  EventEmitter,
  Input,
  OnChanges,
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
export class IdsButtonComponent implements OnChanges {
  readonly leadingIcon = contentChild(IdsIconComponent);

  @Input() variant: ButtonVariant = BUTTON_SPEC_ACCURATE_DEFAULTS.variant;
  @Input() size: ButtonSize = BUTTON_SPEC_ACCURATE_DEFAULTS.size;
  @Input() disabled = BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() loading = BUTTON_SPEC_ACCURATE_DEFAULTS.loading;
  @Input() iconOnly: boolean = BUTTON_SPEC_ACCURATE_DEFAULTS.iconOnly;
  /** Required when `iconOnly` is true (or Ghost Neutral). */
  @Input() ariaLabel = "";
  @Input() type: "button" | "submit" | "reset" = "button";

  @Output() readonly clicked = new EventEmitter<MouseEvent>();

  keyboardPressed = false;

  ngOnChanges(): void {
    if (this.resolvedIconOnly && !this.ariaLabel?.trim()) {
      throw new Error("IdsButton: `ariaLabel` is required when `iconOnly` is true.");
    }
  }

  get variantClass(): string {
    if (this.variant === "destructive") return "danger";
    if (this.variant === "ghost" || this.variant === "ghostNeutral") {
      return "ghost-neutral";
    }
    return this.variant;
  }

  get hasLeadingIcon(): boolean {
    return Boolean(this.leadingIcon()) && this.variant !== "destructive";
  }

  get resolvedIconOnly(): boolean {
    if (this.variant === "destructive") return false;
    if (this.variant === "ghost" || this.variant === "ghostNeutral") return true;
    return this.iconOnly;
  }

  /** Icon-only square: sm 24×24 / md 32×32 / lg 40×40; glyph 12 / 14 / 16. */
  get resolvedSize(): ButtonSize {
    return this.size;
  }

  onClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled || this.loading) return;
    if (event.key === " " || event.key === "Enter") {
      this.keyboardPressed = true;
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === " " || event.key === "Enter") {
      this.keyboardPressed = false;
    }
  }

  onBlur(): void {
    this.keyboardPressed = false;
  }
}
