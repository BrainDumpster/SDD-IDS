/**
 * IDS Time Picker — shared constants & time helpers.
 * Spec: components/ids/time-picker/design-spec.md
 * API: lib/react/ids/time-picker
 *
 * Live Figma (2026-11-10): TimePicker-Main `42159:132203`,
 * TimePicker-Element-Dropdown `42159:132108`.
 */

export type IdsTimePickerSize = "large" | "small";
export type IdsTimePickerClockType = "12h" | "24h";
export type IdsTimePickerPeriod = "AM" | "PM";

/** Above DataGrid column filter shell (`filterMenuLayer` z-index 10000). */
export const TIME_PORTAL_Z_INDEX = 10050;

export const WHEEL_STEP_PX = 24;

export function resolveSize(size: string): IdsTimePickerSize {
  return size === "small" ? "small" : "large";
}

export function resolveClockType(clockType: string): IdsTimePickerClockType {
  return clockType === "24h" ? "24h" : "12h";
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function wrap(n: number, min: number, max: number): number {
  if (n > max) return min;
  if (n < min) return max;
  return n;
}

export function parseTime12(
  value: string,
): { hour: number; minute: number; second: number; period: IdsTimePickerPeriod } | null {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  const second = m[3] ? Number(m[3]) : 0;
  const period = m[4].toUpperCase() as IdsTimePickerPeriod;
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
  period: IdsTimePickerPeriod,
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

export function isValidTimeText(
  text: string,
  clockType: IdsTimePickerClockType,
): boolean {
  if (!text.trim()) return true;
  return clockType === "12h"
    ? parseTime12(text) !== null
    : parseTime24(text) !== null;
}
