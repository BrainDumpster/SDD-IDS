/** IDS Get Started — runtime defaults from `components/ids/get-started/design-spec.md`. */

export const IDS_GET_STARTED_DESIGN_SPEC_PATH =
  "components/ids/get-started/design-spec.md";

export const GET_STARTED_OVERFLOW_PAGE_OPTIONS = [
  "single",
  "page1",
  "page2",
] as const;

export type GetStartedOverflowPage =
  (typeof GET_STARTED_OVERFLOW_PAGE_OPTIONS)[number];

export const GET_STARTED_CARD_STATE_OPTIONS = [
  "not-completed",
  "completed",
  "required",
] as const;

export type GetStartedCardState =
  (typeof GET_STARTED_CARD_STATE_OPTIONS)[number];

export const GET_STARTED_DEFAULTS = {
  title: "Get Started",
  subtitle:
    "Pre-configure key areas within the product below before launching the application.",
  skipButtonText: "Skip",
  configureButtonText: "Configure",
  productName: "Product Name",
  overflow: false,
  sequential: false,
  overflowPage: "single" as GetStartedOverflowPage,
  showMasthead: true,
  headerActionsDisabled: false,
} as const;

/** Figma `12189:233185` — Overflow=False, Sequential=False, Single-Page */
export const GET_STARTED_SPEC_ACCURATE_DEFAULTS = {
  ...GET_STARTED_DEFAULTS,
  overflow: false,
  sequential: false,
  overflowPage: "single" as GetStartedOverflowPage,
  showMasthead: true,
} as const;

export const GET_STARTED_CARD_SCROLL_STEP = 345;

export const GET_STARTED_HONEYCOMB_SRC = "/assets/images/honeycomb.png";
