import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ICON_BUTTON_SPEC_ACCURATE_DEFAULTS,
  type IconButtonSize,
  type IconButtonVariant,
} from "@component-contracts/ids/icon-button.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";

@Component({
  selector: "ids-icon-button",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  templateUrl: "./ids-icon-button.component.html",
  styleUrl: "./ids-icon-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsIconButtonComponent implements OnChanges {
  @Input() variant: IconButtonVariant = ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.variant;
  @Input() size: IconButtonSize = ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.size;
  @Input() disabled = ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() loading = ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.loading;
  /** Required accessible name. */
  @Input() ariaLabel: string = ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel;
  /**
   * Required icon name — forwarded to `ids-icon` `[shape]`.
   * Glyph size: sm 12 / md 14 / lg 16.
   */
  @Input() shape: string = ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.shape;
  /** Optional icon color override — forwarded to the inner `ids-icon` `[color]`. */
  @Input() color?: string;
  @Input() type: "button" | "submit" | "reset" = "button";

  /**
   * Successful activation (design-spec `onClick`).
   * Same contract as `ids-button` `(clicked)` — blocked when disabled/loading.
   */
  @Output() readonly clicked = new EventEmitter<MouseEvent>();

  keyboardPressed = false;

  ngOnChanges(): void {
    if (!this.ariaLabel?.trim()) {
      throw new Error("IdsIconButton: `ariaLabel` is required.");
    }
    if (!this.shape?.trim()) {
      throw new Error("IdsIconButton: `shape` (icon name) is required.");
    }
  }

  get variantClass(): string {
    if (this.variant === "ghost" || this.variant === "ghostNeutral") {
      return "ghost-neutral";
    }
    return this.variant;
  }

  /** Glyph px: small 12 / medium 14 / large 16. */
  get glyphSize(): number {
    if (this.size === "sm") return 12;
    if (this.size === "md") return 14;
    return 16;
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
