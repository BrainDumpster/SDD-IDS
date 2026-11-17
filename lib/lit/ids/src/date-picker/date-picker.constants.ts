/**
 * IDS Date Picker — shared constants & date helpers.
 * Spec: components/ids/date-picker/design-spec.md
 * API: lib/react/ids/date-picker
 */

export type IdsDatePickerSize = "large" | "small";
export type IdsDatePickerRangeField = "start" | "end";

export const CALENDAR_PORTAL_Z_INDEX = 10050;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const WEEKDAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const MONTH_OPTIONS = MONTH_NAMES.map((label, value) => ({ value, label }));

/** How many times a cyclic list is repeated so it can scroll seamlessly both ways. */
export const ROLL_REPEATS = 7;

export type CalendarCell = {
  day: number;
  month: number;
  year: number;
  type: "prev" | "current" | "next";
};

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Add months, clamping the day to the last valid day of the target month. */
export function addMonths(d: Date, n: number): Date {
  const y = d.getFullYear();
  const m = d.getMonth() + n;
  const targetY = y + Math.floor(m / 12);
  const targetM = ((m % 12) + 12) % 12;
  const day = Math.min(d.getDate(), getDaysInMonth(targetY, targetM));
  return new Date(targetY, targetM, day);
}

export function addYears(d: Date, n: number): Date {
  const targetY = d.getFullYear() + n;
  const day = Math.min(d.getDate(), getDaysInMonth(targetY, d.getMonth()));
  return new Date(targetY, d.getMonth(), day);
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** The two dates in chronological order. */
export function ordered(a: Date, b: Date): [Date, Date] {
  return a.getTime() <= b.getTime() ? [a, b] : [b, a];
}

export function formatDate(d: Date, format = "MM-DD-YYYY"): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  if (format === "DD/MM/YYYY") return `${dd}/${mm}/${yyyy}`;
  if (format === "YYYY-MM-DD") return `${yyyy}-${mm}-${dd}`;
  return `${mm}-${dd}-${yyyy}`;
}

/**
 * Parse a date string against the active format. Accepts separators `-` `/` `.`
 * whitespace. Rejects overflow dates via round-trip check.
 */
export function parseDate(s: string, format = "MM-DD-YYYY"): Date | null {
  const parts = s.trim().split(/[-/.\s]+/).filter(Boolean);
  if (parts.length !== 3) return null;
  if (parts.some((p) => !/^\d+$/.test(p))) return null;

  let yStr: string;
  let mo: number;
  let da: number;
  if (format === "YYYY-MM-DD") {
    [yStr] = parts;
    mo = +parts[1];
    da = +parts[2];
  } else if (format === "DD/MM/YYYY") {
    da = +parts[0];
    mo = +parts[1];
    yStr = parts[2];
  } else {
    mo = +parts[0];
    da = +parts[1];
    yStr = parts[2];
  }

  if (yStr.length !== 4) return null;
  const y = +yStr;
  if (mo < 1 || mo > 12 || da < 1 || da > 31) return null;

  const d = new Date(y, mo - 1, da);
  if (Number.isNaN(d.getTime())) return null;
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== da) {
    return null;
  }
  return d;
}

export function resolveSize(value: unknown): IdsDatePickerSize {
  return value === "small" ? "small" : "large";
}

export function buildCalendarGrid(
  viewYear: number,
  viewMonth: number,
): CalendarCell[][] {
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1);
  const rows: CalendarCell[][] = [];
  let row: CalendarCell[] = [];

  for (let i = 0; i < firstDay; i++) {
    const d = prevMonthDays - firstDay + 1 + i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    row.push({ day: d, month: m, year: y, type: "prev" });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    row.push({ day: d, month: viewMonth, year: viewYear, type: "current" });
    if (row.length === 7) {
      rows.push(row);
      row = [];
    }
  }

  if (row.length > 0) {
    let nextDay = 1;
    const nm = viewMonth === 11 ? 0 : viewMonth + 1;
    const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
    while (row.length < 7) {
      row.push({ day: nextDay++, month: nm, year: ny, type: "next" });
    }
    rows.push(row);
  }

  while (rows.length < 6) {
    const lastRow = rows[rows.length - 1];
    const lastCell = lastRow[lastRow.length - 1];
    let startDay = lastCell.day + 1;
    let nm = lastCell.month;
    let ny = lastCell.year;
    const daysInThatMonth = getDaysInMonth(ny, nm);
    if (startDay > daysInThatMonth) {
      startDay = 1;
      nm = nm === 11 ? 0 : nm + 1;
      ny = nm === 0 ? ny + 1 : ny;
    }
    const newRow: CalendarCell[] = [];
    for (let i = 0; i < 7; i++) {
      const ddim = getDaysInMonth(ny, nm);
      if (startDay > ddim) {
        startDay = 1;
        nm = nm === 11 ? 0 : nm + 1;
        ny = nm === 0 ? ny + 1 : ny;
      }
      newRow.push({ day: startDay++, month: nm, year: ny, type: "next" });
    }
    rows.push(newRow);
  }

  return rows;
}
