export type IdsDataGridDateTimeFilterMode =
  | "all"
  | "last-24-hours"
  | "last-week"
  | "last-month"
  | "last-year"
  | "specific-date"
  | "custom-range";

export interface IdsDataGridDateTimeFilterState {
  mode: IdsDataGridDateTimeFilterMode;
  specificDate?: Date | null;
  specificTime?: string | null;
  rangeStartDate?: Date | null;
  rangeStartTime?: string | null;
  rangeEndDate?: Date | null;
  rangeEndTime?: string | null;
}

export const IDS_DATAGRID_DATETIME_MODE_LABELS: Record<IdsDataGridDateTimeFilterMode, string> = {
  all: "All",
  "last-24-hours": "Last 24 hours",
  "last-week": "Last week",
  "last-month": "Last month",
  "last-year": "Last year",
  "specific-date": "Specific date",
  "custom-range": "Custom date and time range",
};

const MODES: IdsDataGridDateTimeFilterMode[] = [
  "all",
  "last-24-hours",
  "last-week",
  "last-month",
  "last-year",
  "specific-date",
  "custom-range",
];

export { MODES as IDS_DATAGRID_DATETIME_FILTER_MODES };

export function defaultIdsDataGridDateTimeFilterState(): IdsDataGridDateTimeFilterState {
  return {
    mode: "all",
    specificDate: null,
    specificTime: null,
    rangeStartDate: null,
    rangeStartTime: null,
    rangeEndDate: null,
    rangeEndTime: null,
  };
}

export function isIdsDataGridDateTimeFilterActive(
  state: IdsDataGridDateTimeFilterState,
): boolean {
  if (state.mode === "all") return false;
  if (
    state.mode === "last-24-hours" ||
    state.mode === "last-week" ||
    state.mode === "last-month" ||
    state.mode === "last-year"
  ) {
    return true;
  }
  if (state.mode === "specific-date") {
    return Boolean(state.specificDate);
  }
  if (state.mode === "custom-range") {
    return Boolean(state.rangeStartDate) || Boolean(state.rangeEndDate);
  }
  return false;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatShortDate(d: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
}

function formatShortDateWithComma(d: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()},`;
}

function formatTime12(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${pad2(m)} ${period}`;
}

/** Right-hand summary text for preset rows (Figma `.DataGrid-Elements-Filter-DateAndTimeItem`). */
export function formatIdsDataGridDateTimeFilterSummary(
  state: IdsDataGridDateTimeFilterState,
  now: Date = new Date(),
): string | null {
  const anchorStart = new Date(2020, 0, 12);

  switch (state.mode) {
    case "all":
      return `${formatShortDate(anchorStart)} - Now`;
    case "last-24-hours": {
      const end = new Date(now);
      const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return `${formatShortDateWithComma(start)} ${formatTime12(start)} - ${formatShortDateWithComma(end)} ${formatTime12(end)}`;
    }
    case "last-week": {
      const end = new Date(now);
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return `${formatShortDate(start)} - ${formatShortDate(end)}`;
    }
    case "last-month": {
      const end = new Date(now);
      const start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      return `${formatShortDate(start)} - ${formatShortDate(end)}`;
    }
    case "last-year": {
      const end = new Date(now);
      const start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      return `${formatShortDate(start)} - ${formatShortDate(end)}`;
    }
    case "specific-date": {
      if (!state.specificDate && !state.specificTime?.trim()) return null;
      const parts: string[] = [];
      if (state.specificDate) parts.push(formatShortDate(state.specificDate));
      if (state.specificTime?.trim()) parts.push(state.specificTime.trim());
      return parts.join(" ") || null;
    }
    case "custom-range": {
      const startParts: string[] = [];
      const endParts: string[] = [];
      if (state.rangeStartDate) startParts.push(formatShortDate(state.rangeStartDate));
      if (state.rangeStartTime?.trim()) startParts.push(state.rangeStartTime.trim());
      if (state.rangeEndDate) endParts.push(formatShortDate(state.rangeEndDate));
      if (state.rangeEndTime?.trim()) endParts.push(state.rangeEndTime.trim());
      if (!startParts.length && !endParts.length) return null;
      return `${startParts.join(" ") || "—"} - ${endParts.join(" ") || "—"}`;
    }
    default:
      return null;
  }
}

function parseTime12ToMinutes(value: string | null | undefined): number | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  const m = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = Number(m[2]);
  const period = m[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function combineDateAndTime(date: Date | null | undefined, time: string | null | undefined): number | null {
  if (!date) return null;
  const d = new Date(date);
  const minutes = parseTime12ToMinutes(time);
  if (minutes !== null) {
    d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d.getTime();
}

function parseCellDate(cellValue: unknown): number | null {
  if (cellValue instanceof Date && !Number.isNaN(cellValue.getTime())) {
    return cellValue.getTime();
  }
  if (typeof cellValue === "number" && Number.isFinite(cellValue)) {
    return cellValue;
  }
  const raw = String(cellValue ?? "").trim();
  if (!raw) return null;
  const t = Date.parse(raw);
  return Number.isFinite(t) ? t : null;
}

/** Applies date-time filter to a single cell value (column filter model). */
export function matchesIdsDataGridDateAndTimeFilter(
  cellValue: unknown,
  state: IdsDataGridDateTimeFilterState,
  now: Date = new Date(),
): boolean {
  if (state.mode === "all") return true;

  const cellTs = parseCellDate(cellValue);
  if (cellTs === null) return false;

  const nowTs = now.getTime();

  switch (state.mode) {
    case "last-24-hours":
      return cellTs >= nowTs - 24 * 60 * 60 * 1000 && cellTs <= nowTs;
    case "last-week":
      return cellTs >= nowTs - 7 * 24 * 60 * 60 * 1000 && cellTs <= nowTs;
    case "last-month": {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      return cellTs >= start.getTime() && cellTs <= nowTs;
    }
    case "last-year": {
      const start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      return cellTs >= start.getTime() && cellTs <= nowTs;
    }
    case "specific-date": {
      const target = combineDateAndTime(state.specificDate, state.specificTime);
      if (target === null) return true;
      if (!state.specificTime?.trim() && state.specificDate) {
        const dayStart = new Date(state.specificDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(state.specificDate);
        dayEnd.setHours(23, 59, 59, 999);
        return cellTs >= dayStart.getTime() && cellTs <= dayEnd.getTime();
      }
      return Math.abs(cellTs - target) < 60 * 1000;
    }
    case "custom-range": {
      const start = combineDateAndTime(state.rangeStartDate, state.rangeStartTime);
      const end = combineDateAndTime(state.rangeEndDate, state.rangeEndTime);
      if (start === null && end === null) return true;
      if (start !== null && end !== null) {
        const lo = Math.min(start, end);
        const hi = Math.max(start, end);
        return cellTs >= lo && cellTs <= hi;
      }
      if (start !== null) return cellTs >= start;
      return cellTs <= end!;
    }
    default:
      return true;
  }
}
