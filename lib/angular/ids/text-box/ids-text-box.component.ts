import {
  ChangeDetectionStrategy,
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

type TextField = HTMLInputElement | HTMLTextAreaElement;

/** `selectTextOnFocus`: select the whole value, or put the caret at the end. */
function applyFocusSelection(field: TextField, selectAll: boolean): void {
  // A fast Tab or click can move focus on before this runs; leave that field alone.
  if (document.activeElement !== field) return;
  if (selectAll) {
    field.select();
    return;
  }
  // `email`, `number` and similar types have no caret API and throw on
  // `setSelectionRange`; they keep the browser's own behaviour.
  if (field.selectionStart === null) return;
  const end = field.value.length;
  field.setSelectionRange(end, end);
}

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
  @Input() placeholder: string = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.placeholder;
  @Input() value?: string;
  @Input() defaultValue = "";
  @Input() disabled: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() invalid: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.invalid;
  @Input() helperText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.helperText;
  @Input() errorText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.errorText;
  @Input() showHelperText: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showHelperText;
  @Input() showIcon: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showIcon;
  @Input() iconName = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.iconName;
  @Input() id?: string;
  @Input() name?: string;
  @Input() rows = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.rows;
  @Input() inputType: string = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.inputType;
  /**
   * Figma: "Select text when in focus". Applies however the field takes focus —
   * a click (Selected) or Tab / Shift+Tab — on text input and text area alike.
   * `true` (default) selects the whole value; `false` puts the caret at the end,
   * for values usually edited in part (IP address, path). `null` leaves the caret
   * to the browser: the option is for Text Box / Text Area only, so components
   * that embed the field (Slider) pass it. A previous selection is never restored.
   */
  @Input() selectTextOnFocus: boolean | null = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.selectTextOnFocus;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;

  @Output() readonly valueChange = new EventEmitter<string>();

  private internalValue = "";
  private generatedId = `ids-text-box-${Math.random().toString(36).slice(2, 9)}`;

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

  onPointerDown(event: PointerEvent): void {
    const field = event.currentTarget as TextField;
    // Already focused: no focus event follows, the click just moves the caret.
    if (this.selectTextOnFocus == null || document.activeElement === field) return;
    // A click focuses on press, then the browser drops the caret under the
    // pointer on release, wiping what onFocus applied. Apply it again after.
    document.addEventListener("pointerup", () => this.placeFocusSelection(field), { once: true });
  }

  onFocus(event: FocusEvent): void {
    this.placeFocusSelection(event.target as TextField);
  }

  private placeFocusSelection(field: TextField): void {
    const selectAll = this.selectTextOnFocus;
    if (selectAll == null) return;
    const apply = () => applyFocusSelection(field, selectAll);
    // Browsers select the whole value when you Tab into a field, and some do it
    // after this handler runs. Apply it now so there is no flash of highlighted
    // text, then again on the next frame so the result sticks either way.
    apply();
    requestAnimationFrame(apply);
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (this.value === undefined) {
      this.internalValue = next;
    }
    this.valueChange.emit(next);
  }
}
