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
  "non-alerting",
  "info",
  "success",
  "minor",
  "major",
  "critical",
] as const;
export type TagTone = (typeof TAG_TONES)[number];

export const TAG_VISUAL_STATES = [
  "default",
  "hover",
  "focus",
  "error",
  "disabled",
] as const;
export type TagVisualState = (typeof TAG_VISUAL_STATES)[number];

export const TAG_SPEC_ACCURATE_DEFAULTS = {
  label: "Tag",
  type: "read-only" as TagType,
  tone: "non-alerting" as TagTone,
  size: "small" as TagSize,
  visualState: "default" as TagVisualState,
  selected: false,
  showLabel: false,
  labelPrefix: "Label",
  closable: false,
  badgeCount: undefined as number | undefined,
} as const;

export const TAGS_GROUP_SPEC_ACCURATE_DEFAULTS = {
  wrap: true,
  ariaLabel: undefined as string | undefined,
} as const;

export type TagModel = typeof TAG_SPEC_ACCURATE_DEFAULTS;
