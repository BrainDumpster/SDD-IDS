/**
 * IDS Anchor Menu — framework-agnostic spec contract.
 * Source: `components/ids/anchor-menu/design-spec.md`
 */
export const IDS_ANCHOR_MENU_DESIGN_SPEC_PATH =
  "components/ids/anchor-menu/design-spec.md" as const;

export interface IdsAnchorMenuItemInput {
  label: string;
  href: string;
  active?: boolean;
}

export const ANCHOR_MENU_API_DEFAULTS = {
  title: "On this page",
  sticky: true,
} as const;

/** Figma `AnchorMenu-Example` (`11955:229709`) — first section selected; Header layer hidden. */
export const ANCHOR_MENU_SPEC_DEMO_ITEMS: IdsAnchorMenuItemInput[] = [
  { label: "Overview", href: "#overview", active: true },
  { label: "Types", href: "#types" },
  { label: "Anatomy", href: "#anatomy" },
  { label: "Usage Rules", href: "#usage-rules" },
  { label: "States and Colors", href: "#states-and-colors" },
  { label: "Redlines", href: "#redlines" },
];

export const ANCHOR_MENU_SPEC_ACCURATE_DEFAULTS = {
  ...ANCHOR_MENU_API_DEFAULTS,
  header: false,
  items: ANCHOR_MENU_SPEC_DEMO_ITEMS,
} as const;
