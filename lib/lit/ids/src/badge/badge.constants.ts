/**
 * Badge constants — from `components/ids/badge/design-spec.md`
 * and React `lib/react/ids/badge` API.
 */

export type IdsBadgeType =
  | "default"
  | "critical"
  | "warning"
  | "disabled"
  | "success";

export type IdsBadgeDigitSize = 1 | 2 | 3;

const BADGE_TYPES = new Set<IdsBadgeType>([
  "default",
  "critical",
  "warning",
  "disabled",
  "success",
]);

/** Unknown `type` → `default` (design-spec fallback). */
export function resolveType(value: unknown): IdsBadgeType {
  if (typeof value === "string" && BADGE_TYPES.has(value as IdsBadgeType)) {
    return value as IdsBadgeType;
  }
  return "default";
}

/** Container tag for BadgeContainer; unknown → `span`. */
export function resolveAs(value: unknown): string {
  if (typeof value === "string" && /^[a-z][a-z0-9]*$/i.test(value)) {
    return value.toLowerCase();
  }
  return "span";
}

/**
 * Values greater than 999 truncate to `1K` (React / design-spec Interactions).
 * Full value is shown in `ids-tooltip` (hugContent) on hover/focus.
 */
export function resolveDisplayText(value: string | number): {
  valueText: string;
  displayText: string;
  isLargeNumber: boolean;
} {
  const valueText = String(value);
  const numericValue = Number(value);
  const isLargeNumber = !Number.isNaN(numericValue) && numericValue > 999;
  return {
    valueText,
    displayText: isLargeNumber ? "1K" : valueText,
    isLargeNumber,
  };
}

export function digitSize(displayText: string): IdsBadgeDigitSize {
  const count = displayText.length;
  if (count <= 1) return 1;
  if (count === 2) return 2;
  return 3;
}
