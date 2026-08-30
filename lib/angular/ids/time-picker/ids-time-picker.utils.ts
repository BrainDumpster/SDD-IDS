export type TimePeriod = "AM" | "PM";

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function parseTime12(
  value: string,
): { hour: number; minute: number; second: number; period: TimePeriod } | null {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  const second = m[3] ? Number(m[3]) : 0;
  const period = m[4].toUpperCase() as TimePeriod;
  if (hour < 1 || hour > 12 || minute > 59 || second > 59) return null;
  return { hour, minute, second, period };
}

export function parseTime24(
  value: string,
): { hour: number; minute: number; second: number } | null {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  const second = m[3] ? Number(m[3]) : 0;
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second };
}

export function formatTime12(
  hour: number,
  minute: number,
  second: number,
  period: TimePeriod,
  showSeconds: boolean,
): string {
  const base = `${hour}:${pad2(minute)}`;
  const withSec = showSeconds ? `${base}:${pad2(second)}` : base;
  return `${withSec} ${period}`;
}

export function formatTime24(
  hour: number,
  minute: number,
  second: number,
  showSeconds: boolean,
): string {
  const base = `${pad2(hour)}:${pad2(minute)}`;
  return showSeconds ? `${base}:${pad2(second)}` : base;
}

export function wrapValue(n: number, min: number, max: number): number {
  if (n > max) return min;
  if (n < min) return max;
  return n;
}
