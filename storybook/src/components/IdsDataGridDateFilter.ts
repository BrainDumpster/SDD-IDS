export type IdsDataGridDateFilterMode =
  | "all"
  | "last-24-hours"
  | "last-week"
  | "last-month"
  | "last-year"
  | "specific-date"
  | "custom-range";

export interface IdsDataGridDateFilterState {
  mode: IdsDataGridDateFilterMode;
  specificDate?: Date | null;
  rangeStartDate?: Date | null;
  rangeEndDate?: Date | null;
}

export const IDS_DATAGRID_DATE_MODE_LABELS: Record<IdsDataGridDateFilterMode, string> = {
  all: "All",
  "last-24-hours": "Last 24 hours",
  "last-week": "Last week",
  "last-month": "Last month",
  "last-year": "Last year",
  "specific-date": "Specific date",
  "custom-range": "Custom date range",
};

export const IDS_DATAGRID_DATE_FILTER_MODES: IdsDataGridDateFilterMode[] = [
  "all",
  "last-24-hours",
  "last-week",
  "last-month",
  "last-year",
  "specific-date",
  "custom-range",
];

export function defaultIdsDataGridDateFilterState(): IdsDataGridDateFilterState {
  return {
    mode: "all",
    specificDate: null,
    rangeStartDate: null,
    rangeEndDate: null,
  };
}

export function isIdsDataGridDateFilterActive(state: IdsDataGridDateFilterState): boolean {
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

function formatShortDateNoYear(d: Date): string {
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
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

/** Date-only summary for preset rows (Figma `37822:90838`). */
export function formatIdsDataGridDateFilterSummary(
  state: IdsDataGridDateFilterState,
  now: Date = new Date(),
): string | null {
  const anchorStart = new Date(2020, 0, 12);

  switch (state.mode) {
    case "all":
      return `${formatShortDateNoYear(anchorStart)} ${anchorStart.getFullYear()} - Now`;
    case "last-24-hours": {
      const end = new Date(now);
      const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return `${formatShortDateNoYear(start)} - ${formatShortDateNoYear(end)}`;
    }
    case "last-week": {
      const end = new Date(now);
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return `${formatShortDateNoYear(start)} - ${formatShortDateNoYear(end)}`;
    }
    case "last-month": {
      const end = new Date(now);
      const start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      return `${formatShortDateNoYear(start)} - ${formatShortDateNoYear(end)}`;
    }
    case "last-year": {
      const end = new Date(now);
      const start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      return `${formatShortDate(start)} - ${formatShortDate(end)}`;
    }
    case "specific-date":
      return state.specificDate ? formatShortDate(state.specificDate) : null;
    case "custom-range": {
      const start = state.rangeStartDate ? formatShortDate(state.rangeStartDate) : "—";
      const end = state.rangeEndDate ? formatShortDate(state.rangeEndDate) : "—";
      if (!state.rangeStartDate && !state.rangeEndDate) return null;
      return `${start} - ${end}`;
    }
    default:
      return null;
  }
}

function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function endOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
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

/** Applies date-only filter to a single cell value (column filter model). */
export function matchesIdsDataGridDateFilter(
  cellValue: unknown,
  state: IdsDataGridDateFilterState,
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
      if (!state.specificDate) return true;
      return cellTs >= startOfDay(state.specificDate) && cellTs <= endOfDay(state.specificDate);
    }
    case "custom-range": {
      const start = state.rangeStartDate ? startOfDay(state.rangeStartDate) : null;
      const end = state.rangeEndDate ? endOfDay(state.rangeEndDate) : null;
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
