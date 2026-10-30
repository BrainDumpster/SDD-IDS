import type { IdsCardSize } from "../card/ids-card.types";

export function resolveBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function resolveCardSize(value: unknown): IdsCardSize {
  if (value === "span-2" || value === "span-3") return value;
  return "span-1";
}

export function dashboardItemKey(explicit: string | undefined, index: number): string {
  if (explicit != null && String(explicit).length > 0) {
    return String(explicit);
  }
  return `dashboard-item-${index}`;
}
