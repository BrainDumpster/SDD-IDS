/**
 * IDS Link — framework-agnostic spec contract.
 * Full contract: `components/ids/link/design-spec.md`
 */
export const IDS_LINK_DESIGN_SPEC_PATH = "components/ids/link/design-spec.md" as const;

export const LINK_TYPES = ["standalone", "inline", "dark-bg"] as const;
export type IdsLinkType = (typeof LINK_TYPES)[number];

export const LINK_DATA_STATES = [
  "default",
  "hover",
  "press",
  "focus-visible",
] as const;
export type IdsLinkDataState = (typeof LINK_DATA_STATES)[number];

export const LINK_TARGETS = ["_self", "_blank", "_parent", "_top"] as const;
export type IdsLinkTarget = (typeof LINK_TARGETS)[number];

/** External icon asset from design-spec (`pop-up-square-corner-big`, 16px). */
export const LINK_EXTERNAL_ICON_SHAPE = "pop-up-square-corner-big" as const;
export const LINK_EXTERNAL_ICON_SIZE = 16 as const;

/** Runtime defaults from Composition & API (React + Angular lib). */
export const LINK_RUNTIME_DEFAULTS = {
  type: "standalone" as IdsLinkType,
  label: "Link",
  showExternalLinkIcon: false,
  target: "_self" as IdsLinkTarget,
  disabled: false,
} as const;

/** Spec Accurate Design: standalone default label link. */
export const LINK_SPEC_ACCURATE_DEFAULTS = {
  type: "standalone" as IdsLinkType,
  label: "This is a link",
  href: "#",
  showExternalLinkIcon: false,
  target: "_self" as IdsLinkTarget,
  disabled: false,
} as const;

export type LinkModel = typeof LINK_SPEC_ACCURATE_DEFAULTS;
