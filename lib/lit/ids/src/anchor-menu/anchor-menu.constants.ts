/**
 * Anchor Menu constants — from `components/ids/anchor-menu/design-spec.md`
 * and React API `lib/react/ids/anchor-menu`.
 *
 * Live Figma (file VZJ48bbVYrIynw8DdSukWw, MCP 2026-11-10):
 *   Component `11067:54486`, Element `11955:229729`, Example `11955:229709`
 */

export interface IdsAnchorMenuItem {
  label: string;
  href: string;
  active?: boolean;
}

export const ANCHOR_MENU_RUNTIME_DEFAULTS = {
  title: "On this page",
  header: true,
  sticky: true,
  scrollOffset: 24,
  nativeTooltip: false,
} as const;

/** Figma `AnchorMenu-Example` (`11955:229709`) — first section selected; Header layer hidden. */
export const ANCHOR_MENU_SPEC_DEMO_ITEMS: IdsAnchorMenuItem[] = [
  { label: "Overview", href: "#overview", active: true },
  { label: "Types", href: "#types" },
  { label: "Anatomy", href: "#anatomy" },
  { label: "Usage Rules", href: "#usage-rules" },
  { label: "States and Colors", href: "#states-and-colors" },
  { label: "Redlines", href: "#redlines" },
];

export function hasNavigableHref(href: unknown): href is string {
  return typeof href === "string" && href.trim() !== "";
}

export function sectionIdFromHref(href: string): string | null {
  if (!href.startsWith("#") || href.length < 2) return null;
  return href.slice(1);
}

export function normalizeAnchorMenuItems(
  value: unknown,
): IdsAnchorMenuItem[] {
  if (!Array.isArray(value)) return [];
  const items: IdsAnchorMenuItem[] = [];
  for (const entry of value) {
    if (entry == null || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const label = record.label;
    if (typeof label !== "string") continue;
    const href = typeof record.href === "string" ? record.href : "";
    const item: IdsAnchorMenuItem = { label, href };
    if (record.active === true) item.active = true;
    items.push(item);
  }
  return items;
}

export function resolveActiveHref(
  items: IdsAnchorMenuItem[],
  controlled: string | undefined,
): string | undefined {
  if (controlled !== undefined) return controlled;
  const marked = items.find((item) => item.active);
  return marked?.href;
}
