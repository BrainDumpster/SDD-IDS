/**
 * IDS Tag — framework-agnostic spec contract.
 * Source: `components/ids/tag/design-spec.md`
 */
export const IDS_TAG_DESIGN_SPEC_PATH = "components/ids/tag/design-spec.md" as const;

export const TAG_TYPES = ["read-only", "clickable", "editable", "badge"] as const;
export type TagType = (typeof TAG_TYPES)[number];

export const TAG_SIZES = ["small", "large"] as const;
export type TagSize = (typeof TAG_SIZES)[number];

export const TAG_TONES = [
  "none",
  "informational",
  "success",
  "minor",
  "major",
  "critical",
] as const;
export type TagTone = (typeof TAG_TONES)[number];

export const TAG_SPEC_ACCURATE_DEFAULTS = {
  label: "Tag",
  type: "read-only" as TagType,
  tone: "none" as TagTone,
  size: "small" as TagSize,
  selected: false,
  disabled: false,
  error: false,
  focusVisible: false,
  focusOnText: false,
  showLabel: false,
  labelPrefix: "Label",
  badgeValue: undefined as string | number | undefined,
  leadingIconSlug: null as string | null,
  closeIconSlug: "shape-x-thick",
} as const;

/** Demo/testing only — forces hover chrome in Storybook state matrices. */
export const TAG_DEMO_HOVER_DEFAULT = false as const;

export const TAGS_GROUP_SPEC_ACCURATE_DEFAULTS = {
  wrap: true,
  ariaLabel: undefined as string | undefined,
} as const;

export type TagModel = typeof TAG_SPEC_ACCURATE_DEFAULTS;
