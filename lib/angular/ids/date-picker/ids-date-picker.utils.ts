export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type CalendarCellType = "prev" | "current" | "next";

export interface CalendarCell {
  day: number;
  month: number;
  year: number;
  type: CalendarCellType;
}

export interface RangeBarLayout {
  left: number;
  width: number;
  isForward: boolean;
  isFullRow: boolean;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatDate(d: Date, format: string = "MM-DD-YYYY"): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();

  if (format === "DD/MM/YYYY") {
    return `${dd}/${mm}/${yyyy}`;
  }
  if (format === "YYYY-MM-DD") {
    return `${yyyy}-${mm}-${dd}`;
  }
  return `${mm}-${dd}-${yyyy}`;
}

export function parseDate(s: string, format: string = "MM-DD-YYYY"): Date | null {
  let m: RegExpMatchArray | null;

  if (format === "DD/MM/YYYY") {
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    const d = new Date(+m[3], +m[2] - 1, +m[1]);
    if (isNaN(d.getTime())) return null;
    return d;
  }
  if (format === "YYYY-MM-DD") {
    m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    if (isNaN(d.getTime())) return null;
    return d;
  }

  m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!m) return null;
  const d = new Date(+m[3], +m[1] - 1, +m[2]);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function buildCalendarGrid(viewYear: number, viewMonth: number): CalendarCell[][] {
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
