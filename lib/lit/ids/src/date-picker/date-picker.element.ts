/**
 * IdsDatePicker — Lit web component.
 *
 * Tag: `ids-date-picker`
 * Spec: `components/ids/date-picker/design-spec.md`
 * API: `lib/react/ids/date-picker`
 *
 * Events:
 *   change       — { date: Date | null }
 *   range-change — { start: Date | null, end: Date | null }
 *   open-change  — { open: boolean }
 *
 * Live Figma (2026-11-06): `42159:132058`, `42159:133115`, `42159:132612`, `42159:132767`.
 */
import { LitElement, html, nothing, render } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref, createRef, type Ref } from "lit/directives/ref.js";
import "../button/register.js";
import "../icon/register.js";
import {
  CALENDAR_PORTAL_Z_INDEX,
  MONTH_NAMES,
  MONTH_OPTIONS,
  ROLL_REPEATS,
  WEEKDAYS,
  WEEKDAY_FULL,
  addDays,
  addMonths,
  addYears,
  buildCalendarGrid,
  dayKey,
  formatDate,
  isSameDay,
  ordered,
  parseDate,
  resolveSize,
  type CalendarCell,
  type IdsDatePickerRangeField,
  type IdsDatePickerSize,
} from "./date-picker.constants.js";
import {
  datePickerCalendarPortalStyles,
  datePickerStyles,
} from "./date-picker.styles.js";

let datePickerUid = 0;

export class IdsDatePicker extends LitElement {
  static override styles = [datePickerStyles];

  /** Currently selected date. Omit for uncontrolled; set `null`/Date to control. */
  @property({ attribute: false })
  value: Date | null | undefined = undefined;

  @property({ type: String, reflect: true })
  size: IdsDatePickerSize | string = "large";

  @property({ type: String })
  placeholder = "";

  @property({ type: String })
  label = "";

  /** `above` stacks the form label over the field (datagrid Date filter custom range). */
  @property({ type: String, reflect: true })
  labellayout: "inline" | "above" | string = "inline";

  @property({ type: Boolean, reflect: true })
  required = false;

  /** Input id; generated when empty. */
  @property({ type: String, attribute: "input-id" })
  inputId = "";

  @property({ type: String, attribute: "dateformat" })
  dateFormat = "MM-DD-YYYY";

  @property({ type: String, attribute: "formathint" })
  formatHint = "MM-DD-YYYY";

  @property({ type: String, attribute: "helpertext" })
  helperText = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String, attribute: "errormessage" })
  errorMessage = "";

  @property({ attribute: false })
  minDate?: Date;

  @property({ attribute: false })
  maxDate?: Date;

  @property({ attribute: false })
  disabledDates: Date[] = [];

  @property({ type: Boolean, attribute: "rangemode", reflect: true })
  rangeMode = false;

  @property({ attribute: false })
  rangeStart: Date | null | undefined = undefined;

  @property({ attribute: false })
  rangeEnd: Date | null | undefined = undefined;

  @property({ type: String, attribute: "rangefield" })
  rangeField: IdsDatePickerRangeField | "" = "";

  /** Storybook/demo — force calendar open. */
  @property({ type: Boolean, attribute: "forceopen", reflect: true })
  forceOpen = false;

  /** Portal calendar to `document.body` (default true). */
  @property({ type: Boolean, attribute: "popupportal" })
  popupPortal = true;

  @state() private internalValue: Date | null = null;
  @state() private open = false;
  @state() private inputText = "";
  @state() private viewMonth = new Date().getMonth();
  @state() private viewYear = new Date().getFullYear();
  @state() private monthDropdownOpen = false;
  @state() private yearDropdownOpen = false;
  @state() private internalRangeStart: Date | null = null;
  @state() private internalRangeEnd: Date | null = null;
  @state() private hoverDate: Date | null = null;
  @state() private calendarPos: { top: number; left: number } | null = null;
  @state() private focusedDate: Date | null = null;
  @state() private inputError: string | null = null;

  @query(".fieldContainer") private fieldEl!: HTMLDivElement | null;
  @query(".calendarIconBtn") private calendarBtnEl!: HTMLButtonElement | null;
  @query(".positionWrapper") private anchorEl!: HTMLDivElement | null;

  private readonly uid = ++datePickerUid;
  private readonly today = new Date();
  private portalEl: HTMLDivElement | null = null;
  private calendarPopupEl: HTMLDivElement | null = null;
  private portalStylesAdopted = false;
  private didMountFocus = false;
  private positionListenersBound = false;
  private outsideListenersBound = false;
  private monthListRef: Ref<HTMLDivElement> = createRef();
  private yearListRef: Ref<HTMLDivElement> = createRef();
  private monthRowHeight = 32;
  private yearRowHeight = 32;
  private valueControlled = false;
  private rangeStartControlled = false;
  private rangeEndControlled = false;
  private lastFocusedDayKey: string | null = null;

  private get resolvedInputId(): string {
    return this.inputId || `ids-date-picker-${this.uid}`;
  }

  private get hintId(): string {
    return `${this.resolvedInputId}-hint`;
  }

  private get errorId(): string {
    return `${this.resolvedInputId}-error`;
  }

  private get shortcutsId(): string {
    return `${this.resolvedInputId}-shortcuts`;
  }

  private get monthListId(): string {
    return `${this.resolvedInputId}-months`;
  }

  private get yearListId(): string {
    return `${this.resolvedInputId}-years`;
  }

  private get selectedDate(): Date | null {
    return this.valueControlled ? (this.value ?? null) : this.internalValue;
  }

  private get effectiveRangeStart(): Date | null {
    return this.rangeStartControlled
      ? (this.rangeStart ?? null)
      : this.internalRangeStart;
  }

  private get effectiveRangeEnd(): Date | null {
    return this.rangeEndControlled
      ? (this.rangeEnd ?? null)
      : this.internalRangeEnd;
  }

  private get effectivePlaceholder(): string {
    return this.placeholder || this.dateFormat;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-date-picker");
    this.addEventListener("keydown", this.onRootKeyDown);
    if (this.forceOpen) this.open = true;
  }

  override disconnectedCallback(): void {
    this.removeEventListener("keydown", this.onRootKeyDown);
    this.teardownOutsideListeners();
    this.teardownPositionListeners();
    this.destroyPortal();
    super.disconnectedCallback();
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("value")) {
      this.valueControlled = this.value !== undefined;
      if (this.valueControlled) {
        this.internalValue = this.value ?? null;
        if (!(this.rangeMode && this.rangeField)) {
          this.inputText = this.value
            ? formatDate(this.value, this.dateFormat)
            : "";
        }
        this.inputError = null;
      }
    }
    if (changed.has("rangeStart")) {
      this.rangeStartControlled = this.rangeStart !== undefined;
    }
    if (changed.has("rangeEnd")) {
      this.rangeEndControlled = this.rangeEnd !== undefined;
    }
    if (
      changed.has("rangeMode") ||
      changed.has("rangeField") ||
      changed.has("rangeStart") ||
      changed.has("rangeEnd") ||
      changed.has("dateFormat")
    ) {
      if (this.rangeMode && this.rangeField) {
        const endpoint =
          this.rangeField === "start"
            ? this.effectiveRangeStart
            : this.effectiveRangeEnd;
        this.inputText = endpoint
          ? formatDate(endpoint, this.dateFormat)
          : "";
      }
    }
    if (changed.has("forceOpen") && this.forceOpen !== undefined) {
      this.open = Boolean(this.forceOpen);
    }
    if (changed.has("dateFormat") && this.selectedDate && !(this.rangeMode && this.rangeField)) {
      this.inputText = formatDate(this.selectedDate, this.dateFormat);
    }
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);

    const openToggled =
      changed.has("open") || (changed.has("forceOpen") && this.open);

    if (openToggled) {
      if (this.open) {
        const seed =
          this.selectedDate ?? this.effectiveRangeStart ?? this.today;
        const seedMonth = seed.getMonth();
        const seedYear = seed.getFullYear();
        if (this.viewMonth !== seedMonth) this.viewMonth = seedMonth;
        if (this.viewYear !== seedYear) this.viewYear = seedYear;
        if (!this.focusedDate) {
          this.focusedDate = new Date(
            seed.getFullYear(),
            seed.getMonth(),
            seed.getDate(),
          );
        }
        this.setupOutsideListeners();
        if (this.popupPortal) {
          this.setupPositionListeners();
          this.syncCalendarPortal();
          this.updateCalendarPosition();
        } else {
          this.destroyPortal();
        }
      } else {
        this.focusedDate = null;
        this.lastFocusedDayKey = null;
        this.monthDropdownOpen = false;
        this.yearDropdownOpen = false;
        this.teardownOutsideListeners();
        this.teardownPositionListeners();
        this.destroyPortal();
      }
    }

    const portalContentChanged =
      this.open &&
      this.popupPortal &&
      (changed.has("viewMonth") ||
        changed.has("viewYear") ||
        changed.has("monthDropdownOpen") ||
        changed.has("yearDropdownOpen") ||
        changed.has("focusedDate") ||
        changed.has("hoverDate") ||
        changed.has("internalRangeStart") ||
        changed.has("internalRangeEnd") ||
        changed.has("rangeStart") ||
        changed.has("rangeEnd") ||
        changed.has("internalValue") ||
        changed.has("value") ||
        changed.has("disabledDates") ||
        changed.has("minDate") ||
        changed.has("maxDate"));

    // Position-only updates must not call updateCalendarPosition again — that
    // previously assigned a new {top,left} object every time and infinite-looped.
    if (portalContentChanged) {
      this.syncCalendarPortal();
      this.updateCalendarPosition();
    } else if (this.open && this.popupPortal && changed.has("calendarPos")) {
      this.syncCalendarPortal();
    }

    if (this.open && this.focusedDate && this.didMountFocus) {
      const key = dayKey(this.focusedDate);
      if (key !== this.lastFocusedDayKey) {
        this.lastFocusedDayKey = key;
        const root = this.popupPortal
          ? this.calendarPopupEl
          : this.renderRoot;
        const el = root?.querySelector<HTMLElement>(`[data-day="${key}"]`);
        el?.focus();
      }
    }
    if (!this.didMountFocus) this.didMountFocus = true;

    if (changed.has("monthDropdownOpen") && this.monthDropdownOpen) {
      requestAnimationFrame(() =>
        this.centerRollingList(
          this.monthListRef.value,
          true,
          this.viewMonth,
          MONTH_OPTIONS.length,
        ),
      );
    }
    if (changed.has("yearDropdownOpen") && this.yearDropdownOpen) {
      const years = this.yearOptions();
      requestAnimationFrame(() =>
        this.centerRollingList(
          this.yearListRef.value,
          false,
          this.viewYear,
          years.length,
          years.findIndex((o) => o.value === this.viewYear),
        ),
      );
    }
  }

  private emitChange(date: Date | null): void {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { date },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitRangeChange(start: Date | null, end: Date | null): void {
    this.dispatchEvent(
      new CustomEvent("range-change", {
        detail: { start, end },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitOpenChange(open: boolean): void {
    this.dispatchEvent(
      new CustomEvent("open-change", {
        detail: { open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setOpen(next: boolean): void {
    if (this.open === next) return;
    this.open = next;
    this.emitOpenChange(next);
  }

  private commitRange(s: Date | null, e: Date | null): void {
    this.internalRangeStart = s;
    this.internalRangeEnd = e;
    this.hoverDate = null;
    this.emitRangeChange(s, e);
  }

  private isDateDisabled(d: Date): boolean {
    if (this.minDate && d < this.minDate) return true;
    if (this.maxDate && d > this.maxDate) return true;
    return (this.disabledDates ?? []).some((dd) => isSameDay(dd, d));
  }

  private selectDate(d: Date): void {
    this.inputError = null;
    if (this.rangeMode) {
      const rangeStart = this.effectiveRangeStart;
      const rangeEnd = this.effectiveRangeEnd;
      if (this.rangeField) {
        if (rangeStart && rangeEnd) this.commitRange(d, null);
        else if (rangeStart) this.commitRange(...ordered(rangeStart, d));
        else if (rangeEnd) this.commitRange(...ordered(d, rangeEnd));
        else this.commitRange(d, null);
        return;
      }
      if (!rangeStart || (rangeStart && rangeEnd)) this.commitRange(d, null);
      else this.commitRange(rangeStart, d);
      return;
    }
    this.internalValue = d;
    this.inputText = formatDate(d, this.dateFormat);
    this.setOpen(false);
    this.emitChange(d);
  }

  private pickFromCalendar(d: Date): void {
    this.selectDate(d);
    if (!this.rangeMode) this.calendarBtnEl?.focus();
  }

  private closeCalendar(returnFocus = true): void {
    this.setOpen(false);
    this.monthDropdownOpen = false;
    this.yearDropdownOpen = false;
    if (returnFocus) this.calendarBtnEl?.focus();
  }

  private isInRange(d: Date): boolean {
    if (!this.rangeMode || !this.effectiveRangeStart) return false;
    const effectiveEnd = this.effectiveRangeEnd || this.hoverDate;
    if (!effectiveEnd) return false;
    const start = this.effectiveRangeStart.getTime();
    const end = effectiveEnd.getTime();
    const t = d.getTime();
    return t >= Math.min(start, end) && t <= Math.max(start, end);
  }

  private isRangeEndpoint(d: Date, which: "start" | "end"): boolean {
    if (!this.rangeMode || !this.effectiveRangeStart) return false;
    const rangeStart = this.effectiveRangeStart;
    const effectiveEnd = this.effectiveRangeEnd || this.hoverDate;
    if (!effectiveEnd) {
      return which === "start" && isSameDay(d, rangeStart);
    }
    const lo =
      rangeStart.getTime() <= effectiveEnd.getTime() ? rangeStart : effectiveEnd;
    const hi =
      rangeStart.getTime() <= effectiveEnd.getTime() ? effectiveEnd : rangeStart;
    return which === "start" ? isSameDay(d, lo) : isSameDay(d, hi);
  }

  private computeRangeBar(row: CalendarCell[]): {
    left: number;
    width: number;
    isForward: boolean;
    isFullRow: boolean;
  } | null {
    if (!this.rangeMode || !this.effectiveRangeStart) return null;
    const effectiveEnd = this.effectiveRangeEnd || this.hoverDate;
    if (!effectiveEnd) return null;
    const lo = Math.min(
      this.effectiveRangeStart.getTime(),
      effectiveEnd.getTime(),
    );
    const hi = Math.max(
      this.effectiveRangeStart.getTime(),
      effectiveEnd.getTime(),
    );
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
    return {
      left: firstIdx * (cellSize + gap),
      width: count * cellSize + (count - 1) * gap,
      isForward: this.effectiveRangeStart.getTime() <= effectiveEnd.getTime(),
      isFullRow: firstIdx === 0 && lastIdx === 6,
    };
  }

  private commitTypedRangeEndpoint(text: string): void {
    const isStart = this.rangeField === "start";
    const rangeStart = this.effectiveRangeStart;
    const rangeEnd = this.effectiveRangeEnd;
    if (!text) {
      this.inputError = null;
      if (isStart ? rangeStart : rangeEnd) {
        this.commitRange(
          isStart ? null : rangeStart,
          isStart ? rangeEnd : null,
        );
      }
      return;
    }
    const d = parseDate(text, this.dateFormat);
    if (!d || this.isDateDisabled(d)) {
      this.inputError = d
        ? "Date unavailable"
        : `Invalid date, use ${this.formatHint || this.dateFormat}`;
      return;
    }
    if (isStart && rangeEnd && d.getTime() > rangeEnd.getTime()) {
      this.inputError = "'Start' date must be before 'End' date";
      return;
    }
    if (!isStart && rangeStart && d.getTime() < rangeStart.getTime()) {
      this.inputError = "'End' date must be after 'Start' date";
      return;
    }
    this.inputError = null;
    this.inputText = formatDate(d, this.dateFormat);
    this.viewMonth = d.getMonth();
    this.viewYear = d.getFullYear();
    this.commitRange(isStart ? d : rangeStart, isStart ? rangeEnd : d);
  }

  private handleInputBlur(): void {
    const text = this.inputText.trim();
    if (this.rangeMode && this.rangeField) {
      this.commitTypedRangeEndpoint(text);
      return;
    }
    if (!text) {
      this.inputError = null;
      return;
    }
    const d = parseDate(this.inputText, this.dateFormat);
    if (d && !this.isDateDisabled(d)) {
      this.selectDate(d);
      this.viewMonth = d.getMonth();
      this.viewYear = d.getFullYear();
    } else {
      this.inputError = d
        ? "Date unavailable"
        : `Invalid date, use ${this.formatHint || this.dateFormat}`;
    }
  }

  private yearOptions(): { value: number; label: string }[] {
    const start = this.viewYear - 10;
    return Array.from({ length: 21 }, (_, i) => ({
      value: start + i,
      label: String(start + i),
    }));
  }

  private centerRollingList(
    el: HTMLDivElement | undefined,
    cyclic: boolean,
    selectedValue: number,
    n: number,
    baseIdxOverride?: number,
  ): void {
    if (!el) return;
    const rowH =
      (el.firstElementChild as HTMLElement | null)?.offsetHeight || 32;
    if (cyclic) this.monthRowHeight = rowH;
    else this.yearRowHeight = rowH;
    const repeats = cyclic ? ROLL_REPEATS : 1;
    const middleCopy = cyclic ? Math.floor(repeats / 2) : 0;
    const options = cyclic ? MONTH_OPTIONS : this.yearOptions();
    const baseIdx =
      baseIdxOverride ??
      Math.max(
        0,
        options.findIndex((o) => o.value === selectedValue),
      );
    const idx = middleCopy * n + baseIdx;
    el.scrollTop = idx * rowH - (el.clientHeight - rowH) / 2;
  }

  private onRollingScroll(cyclic: boolean, n: number, event: Event): void {
    if (!cyclic) return;
    const el = event.currentTarget as HTMLDivElement;
    const rowH = cyclic ? this.monthRowHeight : this.yearRowHeight;
    const cycle = n * rowH;
    if (el.scrollTop < cycle) el.scrollTop += cycle;
    else if (el.scrollTop > cycle * (ROLL_REPEATS - 2)) el.scrollTop -= cycle;
  }

  private updateCalendarPosition(): void {
    const anchor = this.anchorEl;
    if (!anchor || !this.popupPortal) return;
    const rect = anchor.getBoundingClientRect();
    const popup = this.calendarPopupEl;
    const popupWidth = popup?.offsetWidth ?? 280;
    const popupHeight = popup?.offsetHeight ?? 340;
    const margin = 8;
    let top = rect.bottom - 1;
    let left = rect.right - popupWidth;
    left = Math.min(left, window.innerWidth - popupWidth - margin);
    left = Math.max(0, left);
    if (top + popupHeight > window.innerHeight - margin) {
      const above = rect.top - popupHeight + 1;
      if (above >= margin) top = above;
    }
    if (
      this.calendarPos &&
      this.calendarPos.top === top &&
      this.calendarPos.left === left
    ) {
      return;
    }
    this.calendarPos = { top, left };
  }

  private onWindowReposition = (): void => {
    if (!this.open || !this.popupPortal) return;
    this.updateCalendarPosition();
  };

  private setupPositionListeners(): void {
    if (this.positionListenersBound) return;
    this.positionListenersBound = true;
    window.addEventListener("resize", this.onWindowReposition);
    window.addEventListener("scroll", this.onWindowReposition, true);
    requestAnimationFrame(() => {
      this.updateCalendarPosition();
      requestAnimationFrame(() => this.updateCalendarPosition());
    });
  }

  private teardownPositionListeners(): void {
    if (!this.positionListenersBound) return;
    this.positionListenersBound = false;
    window.removeEventListener("resize", this.onWindowReposition);
    window.removeEventListener("scroll", this.onWindowReposition, true);
  }

  private onDocumentPointerDown = (event: MouseEvent): void => {
    const target = event.target as Node;
    if (this.contains(target)) return;
    if (this.renderRoot.contains(target)) return;
    if (this.calendarPopupEl?.contains(target)) return;
    if (this.portalEl?.contains(target)) return;
    this.closeCalendar(false);
  };

  private setupOutsideListeners(): void {
    if (this.outsideListenersBound) return;
    this.outsideListenersBound = true;
    document.addEventListener("mousedown", this.onDocumentPointerDown);
  }

  private teardownOutsideListeners(): void {
    if (!this.outsideListenersBound) return;
    this.outsideListenersBound = false;
    document.removeEventListener("mousedown", this.onDocumentPointerDown);
  }

  private ensurePortal(): HTMLDivElement {
    if (!this.portalEl) {
      this.portalEl = document.createElement("div");
      this.portalEl.setAttribute("data-ids", "ids-date-picker-calendar-portal");
      this.portalEl.className = "ids-date-picker-calendar-portal";
      document.body.appendChild(this.portalEl);
    }
    return this.portalEl;
  }

  private destroyPortal(): void {
    if (this.portalEl) {
      render(nothing, this.portalEl);
      this.portalEl.remove();
      this.portalEl = null;
    }
    this.calendarPopupEl = null;
  }

  private adoptPortalStyles(doc: Document): void {
    if (this.portalStylesAdopted) return;
    const sheet = datePickerCalendarPortalStyles.styleSheet;
    if (sheet && "adoptedStyleSheets" in doc) {
      try {
        if (!doc.adoptedStyleSheets.includes(sheet)) {
          doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
        }
        this.portalStylesAdopted = true;
      } catch {
        /* fall through */
      }
    }
  }

  private syncCalendarPortal(): void {
    if (!this.open || this.disabled || !this.popupPortal) {
      this.destroyPortal();
      return;
    }
    const host = this.ensurePortal();
    this.adoptPortalStyles(host.ownerDocument);
    const needInline = !this.portalStylesAdopted;
    render(
      html`
        ${needInline
          ? html`<style>
              ${datePickerCalendarPortalStyles.cssText}
            </style>`
          : nothing}
        ${this.renderCalendarPopup(true)}
      `,
      host,
    );
    this.calendarPopupEl = host.querySelector<HTMLDivElement>(".calendarPopup");
  }

  private onRootKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      event.stopPropagation();
      this.closeCalendar();
    }
  };

  private getFocusableEls(root: HTMLElement | null): HTMLElement[] {
    if (!root) return [];
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex="0"]',
      ),
    ).filter((el) => el.offsetParent !== null);
  }

  private onDialogKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.closeCalendar();
      return;
    }
    if (event.shiftKey && (event.key === "M" || event.key === "m")) {
      event.preventDefault();
      this.yearDropdownOpen = false;
      this.monthDropdownOpen = true;
      return;
    }
    if (event.shiftKey && (event.key === "Y" || event.key === "y")) {
      event.preventDefault();
      this.monthDropdownOpen = false;
      this.yearDropdownOpen = true;
      return;
    }
    if (event.key === "Tab") {
      const root = this.popupPortal
        ? this.calendarPopupEl
        : this.renderRoot.querySelector<HTMLElement>(".calendarPopup");
      const els = this.getFocusableEls(root);
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  private onGridKeyDown = (event: KeyboardEvent): void => {
    if (!this.focusedDate) return;
    let next: Date | null = null;
    switch (event.key) {
      case "ArrowLeft":
        next = addDays(this.focusedDate, -1);
        break;
      case "ArrowRight":
        next = addDays(this.focusedDate, 1);
        break;
      case "ArrowUp":
        next = addDays(this.focusedDate, -7);
        break;
      case "ArrowDown":
        next = addDays(this.focusedDate, 7);
        break;
      case "Home":
        next = addDays(this.focusedDate, -this.focusedDate.getDay());
        break;
      case "End":
        next = addDays(this.focusedDate, 6 - this.focusedDate.getDay());
        break;
      case "PageUp":
        next = event.shiftKey
          ? addYears(this.focusedDate, -1)
          : addMonths(this.focusedDate, -1);
        break;
      case "PageDown":
        next = event.shiftKey
          ? addYears(this.focusedDate, 1)
          : addMonths(this.focusedDate, 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!this.isDateDisabled(this.focusedDate)) {
          this.pickFromCalendar(this.focusedDate);
        }
        return;
      default:
        return;
    }
    if (next) {
      event.preventDefault();
      this.focusedDate = next;
      this.viewMonth = next.getMonth();
      this.viewYear = next.getFullYear();
    }
  };

  private renderRollingList(
    id: string,
    options: { value: number; label: string }[],
    selectedValue: number,
    cyclic: boolean,
    listRef: Ref<HTMLDivElement>,
    onSelect: (value: number) => void,
  ) {
    const repeats = cyclic ? ROLL_REPEATS : 1;
    const middleCopy = cyclic ? Math.floor(repeats / 2) : 0;
    const n = options.length;
    const rendered: { value: number; label: string }[] = [];
    for (let r = 0; r < repeats; r++) rendered.push(...options);

    return html`
      <div
        ${ref(listRef)}
        id=${id}
        class="overlayDropdown"
        @scroll=${(e: Event) => this.onRollingScroll(cyclic, n, e)}
        @click=${(e: Event) => e.stopPropagation()}
      >
        ${rendered.map((o, idx) => {
          const isRepeat = Math.floor(idx / n) !== middleCopy;
          return html`
            <button
              type="button"
              class=${classMap({
                overlayOption: true,
                selectedOption: o.value === selectedValue,
              })}
              aria-current=${!isRepeat && o.value === selectedValue
                ? "true"
                : nothing}
              aria-hidden=${isRepeat ? "true" : nothing}
              tabindex=${isRepeat ? -1 : 0}
              @click=${(e: Event) => {
                e.stopPropagation();
                onSelect(o.value);
              }}
            >
              ${o.label}
            </button>
          `;
        })}
      </div>
    `;
  }

  private renderCalendarPopup(portaled: boolean) {
    const todayUnavailable = this.isDateDisabled(this.today);
    const calendarGrid = buildCalendarGrid(this.viewYear, this.viewMonth);
    const yearOptions = this.yearOptions();
    const posStyle =
      portaled && this.calendarPos
        ? {
            top: `${this.calendarPos.top}px`,
            left: `${this.calendarPos.left}px`,
            zIndex: String(CALENDAR_PORTAL_Z_INDEX),
          }
        : portaled
          ? { visibility: "hidden" as const }
          : {};

    return html`
      <div
        class=${classMap({
          calendarPopup: true,
          calendarPopupPortaled: portaled,
        })}
        style=${styleMap(posStyle)}
        role="dialog"
        aria-modal="true"
        aria-label="Choose date"
        aria-describedby=${this.shortcutsId}
        @keydown=${this.onDialogKeyDown}
        @mousedown=${portaled
          ? (e: Event) => e.stopPropagation()
          : nothing}
      >
        <span id=${this.shortcutsId} class="visuallyHidden">
          Use the arrow keys to move between dates. Shift+M opens the month
          list, Shift+Y opens the year list.
        </span>
        <div class="calendarHeader">
          <div class="headerDropdowns">
            <span class="dropdownWrap">
              <button
                type="button"
                class=${classMap({
                  dropdownButton: true,
                  menuOpen: this.monthDropdownOpen,
                })}
                aria-expanded=${this.monthDropdownOpen}
                aria-controls=${this.monthDropdownOpen
                  ? this.monthListId
                  : nothing}
                aria-label="Month"
                aria-keyshortcuts="Shift+M"
                title="Month (Shift+M)"
                @click=${() => {
                  this.monthDropdownOpen = !this.monthDropdownOpen;
                  this.yearDropdownOpen = false;
                }}
              >
                ${MONTH_NAMES[this.viewMonth]}
                <ids-icon
                  class="caretIcon"
                  shape="arrow-drop-tri-caret"
                  size="10"
                ></ids-icon>
              </button>
              ${this.monthDropdownOpen
                ? this.renderRollingList(
                    this.monthListId,
                    MONTH_OPTIONS,
                    this.viewMonth,
                    true,
                    this.monthListRef,
                    (m) => {
                      this.viewMonth = m;
                      this.monthDropdownOpen = false;
                    },
                  )
                : nothing}
            </span>
            <span class="dropdownWrap">
              <button
                type="button"
                class=${classMap({
                  dropdownButton: true,
                  yearBtn: true,
                  menuOpen: this.yearDropdownOpen,
                })}
                aria-expanded=${this.yearDropdownOpen}
                aria-controls=${this.yearDropdownOpen
                  ? this.yearListId
                  : nothing}
                aria-label="Year"
                aria-keyshortcuts="Shift+Y"
                title="Year (Shift+Y)"
                @click=${() => {
                  this.yearDropdownOpen = !this.yearDropdownOpen;
                  this.monthDropdownOpen = false;
                }}
              >
                ${this.viewYear}
                <ids-icon
                  class="caretIcon"
                  shape="arrow-drop-tri-caret"
                  size="10"
                ></ids-icon>
              </button>
              ${this.yearDropdownOpen
                ? this.renderRollingList(
                    this.yearListId,
                    yearOptions,
                    this.viewYear,
                    false,
                    this.yearListRef,
                    (y) => {
                      this.viewYear = y;
                      this.yearDropdownOpen = false;
                    },
                  )
                : nothing}
            </span>
          </div>
          <div class="navButtons">
            <ids-button
              variant="ghostNeutral"
              size="small"
              icononly
              iconslug="chev-left-thick"
              arialabel="Previous month"
              @ids-button-click=${() => {
                if (this.viewMonth === 0) {
                  this.viewMonth = 11;
                  this.viewYear -= 1;
                } else {
                  this.viewMonth -= 1;
                }
              }}
            ></ids-button>
            <ids-button
              variant="ghostNeutral"
              size="small"
              icononly
              iconslug="chev-right-thick"
              arialabel="Next month"
              @ids-button-click=${() => {
                if (this.viewMonth === 11) {
                  this.viewMonth = 0;
                  this.viewYear += 1;
                } else {
                  this.viewMonth += 1;
                }
              }}
            ></ids-button>
          </div>
        </div>

        <div class="dateSection">
          <div class="dateContent" role="grid" aria-label="Calendar">
            <div class="weekDayRow">
              ${WEEKDAYS.map(
                (d) => html`<span class="weekDayLabel">${d}</span>`,
              )}
            </div>
            <div class="dateGrid" @keydown=${this.onGridKeyDown}>
              ${calendarGrid.map((row) => {
                const bar = this.computeRangeBar(row);
                return html`
                  <div class="dateRow" role="row">
                    ${bar
                      ? html`<div
                          class=${classMap({
                            rangeBar: true,
                            fullRow: bar.isFullRow,
                            forward: !bar.isFullRow && bar.isForward,
                            reverse: !bar.isFullRow && !bar.isForward,
                          })}
                          style=${styleMap({
                            left: `${bar.left}px`,
                            width: `${bar.width}px`,
                          })}
                        ></div>`
                      : nothing}
                    ${row.map((cell) => {
                      const cellDate = new Date(
                        cell.year,
                        cell.month,
                        cell.day,
                      );
                      const isUnavailable = this.isDateDisabled(cellDate);
                      const isSelected =
                        !isUnavailable &&
                        (this.rangeMode
                          ? this.isRangeEndpoint(cellDate, "start") ||
                            this.isRangeEndpoint(cellDate, "end")
                          : isSameDay(cellDate, this.selectedDate));
                      const isToday = isSameDay(cellDate, this.today);
                      const isAdjacentMonth = cell.type !== "current";
                      const inRange =
                        !isUnavailable && this.isInRange(cellDate);
                      const isFocusTarget = isSameDay(
                        cellDate,
                        this.focusedDate,
                      );
                      const ariaLabel = [
                        `${WEEKDAY_FULL[cellDate.getDay()]}, ${MONTH_NAMES[cell.month]} ${cell.day}, ${cell.year}`,
                        isToday ? "today" : "",
                        isSelected ? "selected" : "",
                        isUnavailable ? "unavailable" : "",
                      ]
                        .filter(Boolean)
                        .join(", ");
                      return html`
                        <div
                          class=${classMap({
                            dateCell: true,
                            selected: isSelected,
                            unavailable: isUnavailable,
                            rangeStart:
                              this.rangeMode &&
                              !isUnavailable &&
                              this.isRangeEndpoint(cellDate, "start"),
                            rangeEnd:
                              this.rangeMode &&
                              !isUnavailable &&
                              this.isRangeEndpoint(cellDate, "end"),
                          })}
                          role="gridcell"
                          data-day=${dayKey(cellDate)}
                          aria-label=${ariaLabel}
                          aria-selected=${isSelected || inRange
                            ? "true"
                            : "false"}
                          aria-disabled=${isUnavailable ? "true" : nothing}
                          tabindex=${isFocusTarget ? 0 : -1}
                          @click=${() => {
                            if (isUnavailable) return;
                            if (isAdjacentMonth) {
                              this.viewMonth = cell.month;
                              this.viewYear = cell.year;
                            }
                            this.focusedDate = cellDate;
                            this.pickFromCalendar(cellDate);
                          }}
                          @mouseenter=${() => {
                            if (
                              this.rangeMode &&
                              this.effectiveRangeStart &&
                              !this.effectiveRangeEnd &&
                              !isUnavailable
                            ) {
                              this.hoverDate = cellDate;
                            }
                          }}
                          @mouseleave=${() => {
                            if (this.rangeMode) this.hoverDate = null;
                          }}
                        >
                          <div
                            class=${classMap({
                              dateCellContainer: true,
                              todayType: isToday,
                            })}
                          >
                            <span
                              class=${classMap({
                                dateLabel: true,
                                adjacentMonth: isAdjacentMonth,
                              })}
                              >${cell.day}</span
                            >
                            ${isToday
                              ? html`<div class="todayIndicator"></div>`
                              : nothing}
                          </div>
                          <div class="focusRing"></div>
                        </div>
                      `;
                    })}
                  </div>
                `;
              })}
            </div>
          </div>
          <button
            type="button"
            class="todayLink"
            ?disabled=${todayUnavailable}
            @click=${() => {
              if (todayUnavailable) return;
              this.viewMonth = this.today.getMonth();
              this.viewYear = this.today.getFullYear();
              this.pickFromCalendar(this.today);
            }}
          >
            Today
          </button>
        </div>
      </div>
    `;
  }

  override render() {
    const size = resolveSize(this.size);
    const rangeFieldError =
      this.rangeMode &&
      this.rangeField === "end" &&
      this.effectiveRangeEnd &&
      !this.effectiveRangeStart
        ? "'Start' date field cannot be empty"
        : null;
    const showError =
      this.error || Boolean(this.inputError) || Boolean(rangeFieldError);
    const shownErrorMessage = this.error
      ? this.errorMessage
      : (this.inputError ?? rangeFieldError);
    const showFormatHint = Boolean(this.formatHint) && !showError;
    const describedBy =
      [
        showError && shownErrorMessage ? this.errorId : null,
        showFormatHint ? this.hintId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const fieldClasses = {
      fieldContainer: true,
      sizeLarge: size === "large",
      sizeSmall: size === "small",
      disabled: this.disabled,
      error: showError,
      open: this.open,
    };

    return html`
      ${this.label
        ? html`
            <span class="label">
              <span
                class=${classMap({
                  formLabel: true,
                  sizeLg: size === "large",
                  sizeMd: size === "small",
                })}
                data-ids="ids-form-label"
              >
                <label class="formLabelGroup" for=${this.resolvedInputId}>
                  <span class="formLabelText">${this.label}</span>
                  ${this.required
                    ? html`<span class="formLabelMarker" aria-hidden="true"
                        >*</span
                      >`
                    : nothing}
                </label>
              </span>
            </span>
          `
        : nothing}
      <div class="inputGroup">
        <div class="positionWrapper">
          <div class=${classMap(fieldClasses)}>
            <input
              id=${this.resolvedInputId}
              type="text"
              class="textInput"
              placeholder=${this.effectivePlaceholder}
              .value=${this.inputText}
              ?disabled=${this.disabled}
              aria-label=${this.label ? nothing : "Date"}
              aria-required=${this.required ? "true" : nothing}
              aria-invalid=${showError ? "true" : nothing}
              aria-describedby=${ifDefined(describedBy)}
              @input=${(e: Event) => {
                this.inputText = (e.target as HTMLInputElement).value;
                if (this.inputError) this.inputError = null;
              }}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  this.handleInputBlur();
                }
              }}
              @blur=${() => this.handleInputBlur()}
            />
            <button
              type="button"
              class=${classMap({
                calendarIconBtn: true,
                sizeLarge: size === "large",
                sizeSmall: size === "small",
              })}
              aria-label="Choose date"
              aria-haspopup="dialog"
              aria-expanded=${this.open ? "true" : "false"}
              ?disabled=${this.disabled}
              @click=${() => {
                if (!this.disabled) this.setOpen(!this.open);
              }}
            >
              <ids-icon shape="calendar-simple-16" size="16"></ids-icon>
            </button>
          </div>
          ${!this.popupPortal && this.open && !this.disabled
            ? this.renderCalendarPopup(false)
            : nothing}
        </div>
        ${showFormatHint
          ? html`<span class="formatHint" id=${this.hintId}
              >${this.formatHint}</span
            >`
          : nothing}
        ${showError && shownErrorMessage
          ? html`<span class="errorMessage" id=${this.errorId} role="alert">
              <ids-icon
                shape="status-critical-square-solid"
                variant="img"
                size="16"
                style="flex-shrink:0"
              ></ids-icon>
              ${shownErrorMessage}
            </span>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-date-picker": IdsDatePicker;
  }
}
