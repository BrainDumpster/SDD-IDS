import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  TEXT_BOX_SPEC_ACCURATE_DEFAULTS,
  type TextBoxComponentType,
  type TextBoxSize,
  type TextBoxState,
} from "@component-contracts/ids/text-box.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";

type FocusModality = "keyboard" | "pointer";

@Component({
  selector: "ids-text-box",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  templateUrl: "./ids-text-box.component.html",
  styleUrl: "./ids-text-box.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsTextBoxComponent implements OnChanges {
  @Input() componentType: TextBoxComponentType =
    TEXT_BOX_SPEC_ACCURATE_DEFAULTS.componentType;
  @Input() size: TextBoxSize = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.size;
  /** Demo/testing override — runtime interaction still applies when not forced. */
  @Input() state: TextBoxState = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.state;
  @Input() placeholder = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.placeholder;
  @Input() value?: string;
  @Input() defaultValue = "";
  @Input() disabled = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() invalid = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.invalid;
  @Input() helperText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.helperText;
  @Input() errorText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.errorText;
  @Input() showHelperText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showHelperText;
  @Input() showIcon = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showIcon;
  @Input() iconName = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.iconName;
  @Input() id?: string;
  @Input() name?: string;
  @Input() rows = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.rows;
  @Input() inputType = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.inputType;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;

  @Output() readonly valueChange = new EventEmitter<string>();

  focusModality: FocusModality = "pointer";
  isFocused = false;
  private internalValue = "";
  private generatedId = `ids-text-box-${Math.random().toString(36).slice(2, 9)}`;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["defaultValue"] && this.value === undefined && !changes["defaultValue"].firstChange) {
      this.internalValue = this.defaultValue;
    }
    if (changes["defaultValue"]?.firstChange && this.value === undefined) {
      this.internalValue = this.defaultValue;
    }
  }

  get resolvedId(): string {
    return this.id ?? this.generatedId;
  }

  get helperId(): string {
    return `${this.resolvedId}-help`;
  }

  get computedInvalid(): boolean {
    return this.invalid || this.state === "error";
  }

  get visualState(): TextBoxState {
    if (this.disabled) {
      return "disabled";
    }
    if (this.computedInvalid) {
      return "error";
    }
    return this.state;
  }

  get shouldRenderHelper(): boolean {
    return this.showHelperText && (this.computedInvalid || Boolean(this.helperText));
  }

  get helperCopy(): string {
    return this.computedInvalid ? this.errorText : this.helperText;
  }

  get resolvedValue(): string {
    return this.value ?? this.internalValue;
  }

  get isTextArea(): boolean {
    return this.componentType === "text-area";
  }

  get describedBy(): string | undefined {
    if (this.shouldRenderHelper) {
      return this.ariaDescribedBy ?? this.helperId;
    }
    return this.ariaDescribedBy;
  }

  onPointerDown(): void {
    this.focusModality = "pointer";
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Tab") {
      this.focusModality = "keyboard";
    }
  }

  onFocus(): void {
    this.isFocused = true;
    this.cdr.markForCheck();
  }

  onBlur(): void {
    this.isFocused = false;
    this.cdr.markForCheck();
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (this.value === undefined) {
      this.internalValue = next;
    }
    this.valueChange.emit(next);
  }
}
