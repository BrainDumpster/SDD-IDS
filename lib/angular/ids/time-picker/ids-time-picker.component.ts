/**
 * IDS Time Picker — Angular port of `lib/react/ids/time-picker`.
 * Source: `components/ids/time-picker/design-spec.md`
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  TIME_PICKER_SPEC_ACCURATE_DEFAULTS,
  type TimePickerClockType,
  type TimePickerSize,
} from "@component-contracts/ids/time-picker.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { cx } from "../../shared/utils/cx";
import {
  formatTime12,
  formatTime24,
  pad2,
  parseTime12,
  parseTime24,
  wrapValue,
  type TimePeriod,
} from "./ids-time-picker.utils";

@Component({
  selector: "ids-time-picker",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  templateUrl: "./ids-time-picker.component.html",
  styleUrl: "./ids-time-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsTimePickerComponent implements OnChanges {
  @Input() value: string | null = null;
  @Input() size: TimePickerSize = TIME_PICKER_SPEC_ACCURATE_DEFAULTS.size;
  @Input() placeholder = TIME_PICKER_SPEC_ACCURATE_DEFAULTS.placeholder;
  @Input() label?: string;
  @Input() required = TIME_PICKER_SPEC_ACCURATE_DEFAULTS.required;
  @Input() formatHint: string = TIME_PICKER_SPEC_ACCURATE_DEFAULTS.formatHint;
  @Input() clockType: TimePickerClockType = TIME_PICKER_SPEC_ACCURATE_DEFAULTS.clockType;
  @Input() showSeconds = TIME_PICKER_SPEC_ACCURATE_DEFAULTS.showSeconds;
  @Input() disabled = TIME_PICKER_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() error = TIME_PICKER_SPEC_ACCURATE_DEFAULTS.error;
  @Input() errorMessage?: string;
  @Input() forceOpen?: boolean;

  @Output() readonly onChange = new EventEmitter<string | null>();

  @ViewChild("rootRef") rootRef?: ElementRef<HTMLElement>;

  mouseActivated = false;
  open = this.forceOpen ?? false;
  inputText = this.value ?? "";
  hour12 = 9;
  minute = 30;
  second = 0;
  period: TimePeriod = "PM";
  hour24 = 13;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["value"] || changes["clockType"]) {
      if (this.value !== undefined && this.value !== null) {
        this.inputText = this.value;
        if (this.clockType === "12h") {
          const parsed = parseTime12(this.value);
          if (parsed) {
            this.hour12 = parsed.hour;
            this.minute = parsed.minute;
            this.second = parsed.second;
            this.period = parsed.period;
          }
        } else {
          const parsed = parseTime24(this.value);
          if (parsed) {
            this.hour24 = parsed.hour;
            this.minute = parsed.minute;
            this.second = parsed.second;
          }
        }
      }
    }
    if (changes["forceOpen"] && this.forceOpen === true) {
      this.open = true;
    }
  }

  get formatted(): string {
    if (this.clockType === "12h") {
      return formatTime12(this.hour12, this.minute, this.second, this.period, this.showSeconds);
    }
    return formatTime24(this.hour24, this.minute, this.second, this.showSeconds);
  }

  get fieldClasses(): string {
    return cx(
      "fieldContainer",
      this.size === "large" ? "sizeLarge" : "sizeSmall",
      this.disabled && "disabled",
      this.error && "error",
      this.open && "open",
      this.mouseActivated && "mouseActivated",
    );
  }

  get showFormatHint(): boolean {
    return this.formatHint !== "" && !this.error;
  }

  get inputFilled(): boolean {
    return this.inputText.trim().length > 0;
  }

  get hourDisplay(): string {
    return this.clockType === "12h" ? String(this.hour12) : String(this.hour24);
  }

  commit(text: string): void {
    this.inputText = text;
    this.onChange.emit(text || null);
  }

  applyFromColumns(): void {
    this.commit(this.formatted);
  }

  handleRootKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.open) {
      this.open = false;
      this.applyFromColumns();
    }
  }

  onInput(event: Event): void {
    this.inputText = (event.target as HTMLInputElement).value;
  }

  onInputBlur(): void {
    this.mouseActivated = false;
    if (this.inputText.trim()) this.commit(this.inputText.trim());
  }

  toggleOpen(event?: Event): void {
    event?.stopPropagation();
    if (this.disabled || this.forceOpen === true) return;
    this.open = !this.open;
    this.cdr.markForCheck();
  }

  onClockMouseDown(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      window.getSelection()?.removeAllRanges();
    }
  }

  bumpHour(delta: number): void {
    if (this.clockType === "12h") {
      this.hour12 = wrapValue(this.hour12 + delta, 1, 12);
    } else {
      this.hour24 = wrapValue(this.hour24 + delta, 0, 23);
    }
  }

  bumpMinute(delta: number): void {
    this.minute = wrapValue(this.minute + delta, 0, 59);
  }

  bumpSecond(delta: number): void {
    this.second = wrapValue(this.second + delta, 0, 59);
  }

  togglePeriod(): void {
    this.period = this.period === "AM" ? "PM" : "AM";
  }

  pad2(n: number): string {
    return pad2(n);
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMouseDown(event: MouseEvent): void {
    if (!this.open || this.forceOpen === true) return;
    if (this.rootRef?.nativeElement.contains(event.target as Node)) return;
    this.open = false;
    this.applyFromColumns();
    this.cdr.markForCheck();
  }
}
