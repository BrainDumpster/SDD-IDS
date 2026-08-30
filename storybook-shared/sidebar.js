/**
 * Shared Storybook sidebar roots — shown in both React and Angular Storybooks.
 * Add future common sections here (e.g. "Guidelines", "Resources") and wire
 * matching stories under `storybook-shared/<slug>/` + thin framework CSF wrappers.
 */
export const SHARED_SIDEBAR_ROOTS = ["Foundations"];

/** Sort order within Foundations. */
export const FOUNDATIONS_SECTION_ORDER = ["Icons", "Design tokens"];

/** Sort order within Foundations / Design tokens. */
export const DESIGN_TOKEN_STORY_ORDER = [
  "Overview",
  "Modes",
  "Primitives",
  "Semantic",
  "Components",
];
