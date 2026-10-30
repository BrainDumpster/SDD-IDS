/**
 * IDS Badge — framework-agnostic spec contract.
 * Full contract: `components/ids/badge/design-spec.md`
 */
export const IDS_BADGE_DESIGN_SPEC_PATH = "components/ids/badge/design-spec.md" as const;

export const BADGE_TYPES = [
  "default",
  "critical",
  "warning",
  "disabled",
  "success",
] as const;

export type BadgeType = (typeof BADGE_TYPES)[number];

export const BADGE_SPEC_ACCURATE_DEFAULTS = {
  value: 8,
  type: "default" as BadgeType,
  ariaLabel: undefined as string | undefined,
} as const;

export type BadgeModel = typeof BADGE_SPEC_ACCURATE_DEFAULTS;
