/**
 * IDS Avatar — framework-agnostic contract.
 * Visual contract aligned with Masthead User Settings chip
 * (`components/ids/masthead/design-spec.md` → Avatar chip).
 */
export const IDS_AVATAR_DESIGN_SPEC_PATH = "components/ids/masthead/design-spec.md" as const;

export const AVATAR_DEFAULT_ICON_SLUG = "user-single" as const;

export const AVATAR_SPEC_ACCURATE_DEFAULTS = {
  initials: "JD",
  icon: AVATAR_DEFAULT_ICON_SLUG,
  imageAlt: "User avatar",
  size: 32,
  iconSize: 16,
} as const;

export type AvatarModel = typeof AVATAR_SPEC_ACCURATE_DEFAULTS;
