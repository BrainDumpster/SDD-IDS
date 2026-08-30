/**
 * IDS Date Picker — Angular port of `lib/react/ids/date-picker`.
 * Source: `components/ids/date-picker/design-spec.md`
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
import { DATE_PICKER_SPEC_ACCURATE_DEFAULTS, type DatePickerSize } from "@component-contracts/ids/date-picker.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { cx } from "../../shared/utils/cx";
import {
  buildCalendarGrid,
  formatDate,
  isSameDay,
  MONTH_NAMES,
  parseDate,
  WEEKDAYS,
  type CalendarCell,
  type RangeBarLayout,
} from "./ids-date-picker.utils";

const CALENDAR_PORTAL_Z_INDEX = 10050;

@Component({
  selector: "ids-date-picker",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  templateUrl: "./ids-date-picker.component.html",
  styleUrl: "./ids-date-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDatePickerComponent implements OnChanges {
  @Input() value: Date | null = DATE_PICKER_SPEC_ACCURATE_DEFAULTS.value;
  @Input() size: DatePickerSize = DATE_PICKER_SPEC_ACCURATE_DEFAULTS.size;
  @Input() placeholder?: string;
  @Input() label?: string;
  @Input() required = DATE_PICKER_SPEC_ACCURATE_DEFAULTS.required;
  @Input() dateFormat: string = DATE_PICKER_SPEC_ACCURATE_DEFAULTS.dateFormat;
  @Input() formatHint: string = DATE_PICKER_SPEC_ACCURATE_DEFAULTS.formatHint;
  @Input() helperText?: string;
  @Input() disabled = DATE_PICKER_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() error = DATE_PICKER_SPEC_ACCURATE_DEFAULTS.error;
  @Input() errorMessage?: string;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() disabledDates: Date[] = [];
  @Input() rangeMode = DATE_PICKER_SPEC_ACCURATE_DEFAULTS.rangeMode;
  @Input() rangeStart?: Date | null;
  @Input() rangeEnd?: Date | null;
  @Input() forceOpen?: boolean;
  @Input() forceState?: string;
  @Input() popupPortal = DATE_PICKER_SPEC_ACCURATE_DEFAULTS.popupPortal;

  @Output() readonly onChange = new EventEmitter<Date | null>();
  @Output() readonly onRangeChange = new EventEmitter<{ start: Date | null; end: Date | null }>();

  readonly monthNames = MONTH_NAMES;
  readonly weekdays = WEEKDAYS;
  readonly today = new Date();

  internalValue: Date | null = this.value;
  open = this.forceOpen ?? false;
  inputText = this.value ? formatDate(this.value, this.dateFormat) : "";
  viewMonth = this.value?.getMonth() ?? this.today.getMonth();
  viewYear = this.value?.getFullYear() ?? this.today.getFullYear();
  monthDropdownOpen = false;
  yearDropdownOpen = false;
  internalRangeStart: Date | null = this.rangeStart ?? null;
  internalRangeEnd: Date | null = this.rangeEnd ?? null;
  hoverDate: Date | null = null;
  mouseActivated = false;
  calendarPos: { top: number; left: number } | null = null;

  @ViewChild("rootRef") rootRef?: ElementRef<HTMLElement>;
  @ViewChild("anchorRef") anchorRef?: ElementRef<HTMLElement>;
  @ViewChild("calendarPopupRef") calendarPopupRef?: ElementRef<HTMLElement>;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["value"] || changes["dateFormat"]) {
      this.internalValue = this.value;
      this.inputText = this.value ? formatDate(this.value, this.dateFormat) : "";
    }
    if (changes["forceOpen"] && this.forceOpen === true) {
      this.open = true;
    }
    if (changes["rangeStart"] && this.rangeStart !== undefined) {
      this.internalRangeStart = this.rangeStart;
    }
    if (changes["rangeEnd"] && this.rangeEnd !== undefined) {
      this.internalRangeEnd = this.rangeEnd;
    }
  }

  get effectivePlaceholder(): string {
    return this.placeholder ?? this.dateFormat;
  }

  get resolvedRangeStart(): Date | null {
    return this.rangeStart !== undefined ? this.rangeStart : this.internalRangeStart;
  }

  get resolvedRangeEnd(): Date | null {
    return this.rangeEnd !== undefined ? this.rangeEnd : this.internalRangeEnd;
  }

  get calendarGrid(): CalendarCell[][] {
    return buildCalendarGrid(this.viewYear, this.viewMonth);
  }

  get yearRange(): number[] {
    const start = this.viewYear - 3;
    return Array.from({ length: 7 }, (_, i) => start + i);
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

  get calendarPopupClasses(): string {
    return cx("calendarPopup", this.popupPortal && "calendarPopupPortaled");
  }

  get calendarPopupStyle(): Record<string, string> | null {
    if (!this.popupPortal || !this.calendarPos) return null;
    return {
      top: `${this.calendarPos.top}px`,
      left: `${this.calendarPos.left}px`,
      zIndex: String(CALENDAR_PORTAL_Z_INDEX),
    };
  }

  isDateDisabled(d: Date): boolean {
    if (this.minDate && d < this.minDate) return true;
    if (this.maxDate && d > this.maxDate) return true;
    return this.disabledDates.some((dd) => isSameDay(dd, d));
  }

  isInRange(d: Date): boolean {
    if (!this.rangeMode || !this.resolvedRangeStart) return false;
    const effectiveEnd = this.resolvedRangeEnd || this.hoverDate;
    if (!effectiveEnd) return false;
    const start = this.resolvedRangeStart.getTime();
    const end = effectiveEnd.getTime();
    const t = d.getTime();
    return t >= Math.min(start, end) && t <= Math.max(start, end);
  }

  isRangeEndpoint(d: Date, which: "start" | "end"): boolean {
    if (!this.rangeMode || !this.resolvedRangeStart) return false;
    const effectiveEnd = this.resolvedRangeEnd || this.hoverDate;
    if (!effectiveEnd) return which === "start" && isSameDay(d, this.resolvedRangeStart);
    const lo = this.resolvedRangeStart.getTime() <= effectiveEnd.getTime() ? this.resolvedRangeStart : effectiveEnd;
    const hi = this.resolvedRangeStart.getTime() <= effectiveEnd.getTime() ? effectiveEnd : this.resolvedRangeStart;
    if (which === "start") return isSameDay(d, lo);
    return isSameDay(d, hi);
  }

  computeRangeBar(row: CalendarCell[]): RangeBarLayout | null {
    if (!this.rangeMode || !this.resolvedRangeStart) return null;
    const effectiveEnd = this.resolvedRangeEnd || this.hoverDate;
    if (!effectiveEnd) return null;

    const lo = Math.min(this.resolvedRangeStart.getTime(), effectiveEnd.getTime());
    const hi = Math.max(this.resolvedRangeStart.getTime(), effectiveEnd.getTime());

    let firstIdx = -1;
    let lastIdx = -1;
    for (let i = 0; i < row.length; i++) {
      const t = new Date(row[i].year, row[i].month, row[i].day).getTime();
      if (t >= lo && t <= hi) {
        if (firstIdx === -1) firstIdx = i;
        lastIdx = i;
      }
    }
    if (firstIdx === -1) return null;

    const cellSize = 32;
    const gap = 4;
    const count = lastIdx - firstIdx + 1;
    const left = firstIdx * (cellSize + gap);
    const width = count * cellSize + (count - 1) * gap;
    const isForward = this.resolvedRangeStart.getTime() <= effectiveEnd.getTime();
    const isFullRow = firstIdx === 0 && lastIdx === 6;
    return { left, width, isForward, isFullRow };
  }

  cellClasses(cell: CalendarCell): string {
    const cellDate = new Date(cell.year, cell.month, cell.day);
    const unavailable = this.isDateDisabled(cellDate);
    const selected =
      !unavailable &&
      (this.rangeMode
        ? this.isRangeEndpoint(cellDate, "start") || this.isRangeEndpoint(cellDate, "end")
        : isSameDay(cellDate, this.internalValue));
    return cx(
      "dateCell",
      selected && "selected",
      unavailable && "unavailable",
      this.rangeMode && !unavailable && this.isRangeEndpoint(cellDate, "start") && "rangeStart",
      this.rangeMode && !unavailable && this.isRangeEndpoint(cellDate, "end") && "rangeEnd",
    );
  }

  cellDate(cell: CalendarCell): Date {
    return new Date(cell.year, cell.month, cell.day);
  }

  isToday(cell: CalendarCell): boolean {
    return isSameDay(this.cellDate(cell), this.today);
  }

  isAdjacentMonth(cell: CalendarCell): boolean {
    return cell.type !== "current";
  }

  cellAriaSelected(cell: CalendarCell): boolean {
    const d = this.cellDate(cell);
    const unavailable = this.isDateDisabled(d);
    const selected =
      !unavailable &&
      (this.rangeMode
        ? this.isRangeEndpoint(d, "start") || this.isRangeEndpoint(d, "end")
        : isSameDay(d, this.internalValue));
    return selected || (!unavailable && this.isInRange(d));
  }

  selectDate(d: Date): void {
    if (this.rangeMode) {
      if (!this.resolvedRangeStart || (this.resolvedRangeStart && this.resolvedRangeEnd)) {
        this.internalRangeStart = d;
        this.internalRangeEnd = null;
        this.hoverDate = null;
        this.onRangeChange.emit({ start: d, end: null });
      } else {
        this.internalRangeEnd = d;
        this.hoverDate = null;
        this.onRangeChange.emit({ start: this.resolvedRangeStart, end: d });
      }
      this.cdr.markForCheck();
      return;
    }
    this.internalValue = d;
    this.inputText = formatDate(d, this.dateFormat);
    this.open = false;
    this.onChange.emit(d);
    this.cdr.markForCheck();
  }

  onCellClick(cell: CalendarCell): void {
    const cellDate = this.cellDate(cell);
    if (this.isDateDisabled(cellDate)) return;
    if (this.isAdjacentMonth(cell)) {
      this.viewMonth = cell.month;
      this.viewYear = cell.year;
    }
    this.selectDate(cellDate);
  }

  onCellMouseEnter(cell: CalendarCell): void {
    const cellDate = this.cellDate(cell);
    if (this.rangeMode && this.resolvedRangeStart && !this.resolvedRangeEnd && !this.isDateDisabled(cellDate)) {
      this.hoverDate = cellDate;
    }
  }

  onCellMouseLeave(): void {
    if (this.rangeMode) this.hoverDate = null;
  }

  onCellKeyDown(event: KeyboardEvent, cell: CalendarCell): void {
    if ((event.key === "Enter" || event.key === " ") && !this.isDateDisabled(this.cellDate(cell))) {
      event.preventDefault();
      this.onCellClick(cell);
    }
  }

  handleInputBlur(): void {
    this.mouseActivated = false;
    if (this.inputText.trim()) {
      const d = parseDate(this.inputText, this.dateFormat);
      if (d && !this.isDateDisabled(d)) {
        this.selectDate(d);
        this.viewMonth = d.getMonth();
        this.viewYear = d.getFullYear();
      }
    }
  }

  toggleOpen(event?: Event): void {
    event?.stopPropagation();
    if (this.disabled || this.forceOpen === true) return;
    this.open = !this.open;
    if (!this.open) {
      this.monthDropdownOpen = false;
      this.yearDropdownOpen = false;
    } else {
      queueMicrotask(() => this.updateCalendarPosition());
    }
    this.cdr.markForCheck();
  }

  handleRootKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.open) {
      this.open = false;
      this.monthDropdownOpen = false;
      this.yearDropdownOpen = false;
    }
  }

  toggleMonthDropdown(): void {
    this.monthDropdownOpen = !this.monthDropdownOpen;
    this.yearDropdownOpen = false;
  }

  toggleYearDropdown(): void {
    this.yearDropdownOpen = !this.yearDropdownOpen;
    this.monthDropdownOpen = false;
  }

  selectMonth(index: number, event: Event): void {
    event.stopPropagation();
    this.viewMonth = index;
    this.monthDropdownOpen = false;
  }

  selectYear(year: number, event: Event): void {
    event.stopPropagation();
    this.viewYear = year;
    this.yearDropdownOpen = false;
  }

  prevMonth(): void {
    if (this.viewMonth === 0) {
      this.viewMonth = 11;
      this.viewYear -= 1;
    } else {
      this.viewMonth -= 1;
    }
  }

  nextMonth(): void {
    if (this.viewMonth === 11) {
      this.viewMonth = 0;
      this.viewYear += 1;
    } else {
      this.viewMonth += 1;
    }
  }

  goToday(): void {
    this.viewMonth = this.today.getMonth();
    this.viewYear = this.today.getFullYear();
    this.selectDate(this.today);
  }

  onInput(event: Event): void {
    this.inputText = (event.target as HTMLInputElement).value;
  }

  updateCalendarPosition(): void {
    const anchor = this.anchorRef?.nativeElement;
    if (!anchor || !this.popupPortal) return;
    const rect = anchor.getBoundingClientRect();
    const popup = this.calendarPopupRef?.nativeElement;
    const popupWidth = popup?.offsetWidth ?? 280;
    const popupHeight = popup?.offsetHeight ?? 340;
    const margin = 8;
    let top = rect.bottom - 1;
    let left = rect.right - popupWidth;
    left = Math.max(margin, Math.min(left, window.innerWidth - popupWidth - margin));
    if (top + popupHeight > window.innerHeight - margin) {
      const above = rect.top - popupHeight + 1;
      if (above >= margin) top = above;
    }
    if (this.calendarPos?.top === top && this.calendarPos?.left === left) return;
    this.calendarPos = { top, left };
    this.cdr.markForCheck();
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMouseDown(event: MouseEvent): void {
    if (!this.open || this.forceOpen === true) return;
    const target = event.target as Node;
    if (this.rootRef?.nativeElement.contains(target)) return;
    if (this.calendarPopupRef?.nativeElement.contains(target)) return;
    this.open = false;
    this.monthDropdownOpen = false;
    this.yearDropdownOpen = false;
    this.cdr.markForCheck();
  }

  @HostListener("window:resize")
  @HostListener("window:scroll")
  onWinChange(): void {
    if (this.open && this.popupPortal) this.updateCalendarPosition();
  }
}
