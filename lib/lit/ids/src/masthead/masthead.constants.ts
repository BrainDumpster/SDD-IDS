/**
 * IDS Masthead — constants from design-spec / React IdsMasthead.
 * Spec: `components/ids/masthead/design-spec.md`
 * Figma: Masthead-Main `10130:29493` (Product Icon=No `10130:29494`, Yes `10130:29512`)
 */

import type { IdsBadgeType } from "../badge/badge.constants.js";

/** Product name truncates / tooltips after this character count (spec). */
export const PRODUCT_NAME_TOOLTIP_CHARS = 45;

export const MASTHEAD_ACTIONS_ARIA_LABEL = "Masthead actions";

export type IdsMastheadBadgeType =
  | "default"
  | "controls"
  | "critical"
  | "warning"
  | "disabled"
  | "success";

const BADGE_TYPES = new Set<IdsMastheadBadgeType>([
  "default",
  "controls",
  "critical",
  "warning",
  "disabled",
  "success",
]);

/** Spec default for action-icon badges. */
export const MASTHEAD_ACTION_BADGE_DEFAULT: IdsMastheadBadgeType = "critical";

/** Map masthead badgeType → IdsBadge (unknown / controls → default). */
export function resolveMastheadBadgeType(value: unknown): IdsBadgeType {
  if (value === "critical" || value === "warning" || value === "disabled" || value === "success") {
    return value;
  }
  if (typeof value === "string" && BADGE_TYPES.has(value as IdsMastheadBadgeType)) {
    return "default";
  }
  return "default";
}

export function formatBadgeLabel(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

export function shouldShowBadge(count: unknown): boolean {
  return typeof count === "number" && Number.isFinite(count) && count > 0;
}

/** Non-empty string for productName attribute / property. */
export function resolveProductName(value: unknown): string {
  if (value == null) return "";
  return String(value);
}

export function productNameNeedsTooltip(name: string): boolean {
  return name.length > PRODUCT_NAME_TOOLTIP_CHARS;
}
