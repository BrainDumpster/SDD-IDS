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

/**
 * How the user last interacted with the page, used to tell a click apart from a
 * Tab when a field takes focus.
 *
 * Tracked on the document rather than on the control: a `keydown` for Tab fires
 * on the field being LEFT, never on the one being entered, and focus can reach
 * the field without a `pointerdown` on it (clicking the label, `focus()` from
 * code). A per-control flag reads the next field's Tab as a click and drops the
 * keyboard focus ring.
 */
let lastInputModality: FocusModality = "keyboard";
let modalityTracked = false;

function trackInputModality(): void {
  if (modalityTracked || typeof document === "undefined") return;
  modalityTracked = true;
  document.addEventListener(
    "pointerdown",
    () => {
      lastInputModality = "pointer";
    },
    true,
  );
  document.addEventListener(
    "keydown",
    () => {
      lastInputModality = "keyboard";
    },
    true,
  );
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
   * Figma: "Select text when in focus". Keyboard focus only, same for text input
   * and text area. `true` (default) selects the whole value; `false` puts the
   * caret at the end, for values usually edited in part (IP address, path).
   * A previous selection is never restored; a click keeps its own caret.
   */
  @Input() selectOnFocus: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.selectOnFocus;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;

  @Output() readonly valueChange = new EventEmitter<string>();

  /** Set while focused; drives `data-focus-modality` (keyboard adds the ring). */
  focusModality: FocusModality | null = null;
  private internalValue = "";
  private generatedId = `ids-text-box-${Math.random().toString(36).slice(2, 9)}`;

  constructor(private readonly cdr: ChangeDetectorRef) {
    trackInputModality();
  }

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
    // Clicking a field that is ALREADY focused fires no focus event, so the
    // modality set when it was tabbed into would keep the ring up.
    if ((event.currentTarget as HTMLElement).contains(document.activeElement)) {
      this.focusModality = "pointer";
      this.cdr.markForCheck();
    }
  }

  onFocus(event: FocusEvent): void {
    const byPointer = lastInputModality === "pointer";
    this.focusModality = byPointer ? "pointer" : "keyboard";
    this.cdr.markForCheck();
    // A click already placed the caret where the user aimed — leave it alone.
    if (byPointer) return;
    const field = event.target as HTMLInputElement | HTMLTextAreaElement;
    const applySelection = () => {
      // A fast Tab can move on before the next frame; leave that field alone.
      if (document.activeElement !== field) return;
      if (this.selectOnFocus) {
        field.select();
        return;
      }
      // `email`, `number` and similar types have no caret API and throw on
      // `setSelectionRange`; they keep the browser's own Tab behaviour.
      if (field.selectionStart === null) return;
      const end = field.value.length;
      field.setSelectionRange(end, end);
    };
    // Browsers select the whole value when you Tab into a field, and some do it
    // after this handler runs. Apply it now so there is no flash of highlighted
    // text, then again on the next frame so the result sticks either way.
    applySelection();
    requestAnimationFrame(applySelection);
  }

  onBlur(): void {
    this.focusModality = null;
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
