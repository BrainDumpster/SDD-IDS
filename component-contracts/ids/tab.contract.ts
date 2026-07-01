/**
 * IDS Tab — framework-agnostic spec contract.
 * Source: `components/ids/tab/design-spec.md`
 *
 * Codegen and reference ports must import overflow math and defaults from here
 * (do not duplicate constants in framework implementations).
 */
export const IDS_TAB_DESIGN_SPEC_PATH = "components/ids/tab/design-spec.md" as const;

export type TabType = "primary" | "secondary";
export type TabSurface = "elevated" | "transparent";

export interface IdsTabItemInput {
  id: string;
  label: string;
  content: string;
  iconSlug?: string;
  badgeCount?: number;
  hasAlert?: boolean;
  disabled?: boolean;
}

export const TAB_API_DEFAULTS = {
  type: "secondary" as TabType,
  surface: "elevated" as TabSurface,
  allowAddTab: false,
  addTabLabel: "Add Tab",
  moreLabel: "More",
  overflow: true,
  minTabWidth: 80,
  maxTabWidth: 250,
} as const;

/** Width reserved for the More trigger when computing visible tab slots. */
export const TAB_OVERFLOW_MORE_TRIGGER_RESERVE_PX = 84 as const;

/** Minimum visible tab slots when overflow mode is active. */
export const TAB_OVERFLOW_MIN_VISIBLE_SLOTS = 1 as const;

/** Narrow host width for overflow verification demos (secondary + primary). */
export const TAB_OVERFLOW_DEMO_WIDTH = 560 as const;

/** Estimate add-tab affordance width for overflow slot calculation. */
export function estimateTabAddTabReservePx(addTabLabel: string): number {
  return Math.min(220, Math.max(56, 36 + addTabLabel.length * 8));
}

export interface TabOverflowVisibleCountInput {
  containerWidth: number;
  itemCount: number;
  overflow?: boolean;
  allowAddTab?: boolean;
  addTabLabel?: string;
  minTabWidth?: number;
  /** When set, overrides `estimateTabAddTabReservePx` (e.g. Synapse fixed 36px add tab). */
  addTabReservePx?: number;
}

/**
 * Framework-agnostic overflow visible-slot count.
 * Must match `## Codegen Contract → Behavior contract` in the Tab design spec.
 */
export function computeTabOverflowVisibleCount({
  containerWidth,
  itemCount,
  overflow = TAB_API_DEFAULTS.overflow,
  allowAddTab = TAB_API_DEFAULTS.allowAddTab,
  addTabLabel = TAB_API_DEFAULTS.addTabLabel,
  minTabWidth = TAB_API_DEFAULTS.minTabWidth,
  addTabReservePx,
}: TabOverflowVisibleCountInput): number {
  if (!overflow || itemCount <= 0) {
    return itemCount;
  }

  const perTab = Math.max(minTabWidth, TAB_API_DEFAULTS.minTabWidth);
  const addWidth = allowAddTab
    ? (addTabReservePx ?? estimateTabAddTabReservePx(addTabLabel))
    : 0;
  const moreWidth = TAB_OVERFLOW_MORE_TRIGGER_RESERVE_PX;
  const available = containerWidth - addWidth - moreWidth;

  if (available <= 0) {
    return TAB_OVERFLOW_MIN_VISIBLE_SLOTS;
  }

  const maxVisible = Math.max(
    TAB_OVERFLOW_MIN_VISIBLE_SLOTS,
    Math.floor(available / perTab),
  );

  return Math.min(maxVisible, itemCount);
}

/** Returns overflow menu items: hidden tabs minus the active tab when active is hidden. */
export function computeTabOverflowMenuItems<T extends { id: string }>(
  hiddenItems: readonly T[],
  activeItemId: string,
): T[] {
  return hiddenItems.filter((item) => item.id !== activeItemId);
}

export const TAB_SPEC_DEMO_ITEMS: IdsTabItemInput[] = [
  { id: "overview", label: "Overview", content: "Overview tab content area." },
  {
    id: "security",
    label: "Security",
    content: "Security tab content area.",
    iconSlug: "shield-encrypt-alt",
  },
  {
    id: "alerts",
    label: "Alerts",
    content: "Alerts tab content area with related data.",
  },
];

export const TAB_SPEC_OVERFLOW_ITEMS: IdsTabItemInput[] = [
  { id: "summary", label: "Summary", content: "Summary content." },
  { id: "details", label: "Details", content: "Details content." },
  { id: "settings", label: "Settings", content: "Settings content." },
  { id: "activity", label: "Activity", content: "Activity content." },
  { id: "audit", label: "Audit Trail", content: "Audit trail content." },
  { id: "integrations", label: "Integrations", content: "Integrations content." },
  { id: "policies", label: "Policies", content: "Policies content." },
];

/** Spec Accurate Design: secondary variant, elevated surface, three tabs, overview active. */
export const TAB_SPEC_ACCURATE_DEFAULTS = {
  ...TAB_API_DEFAULTS,
  defaultActiveItemId: "overview",
  items: TAB_SPEC_DEMO_ITEMS,
} as const;

/** @deprecated Use composition (`TabItem` children inside `TabRoot`). */
export type IdsTabItemsProp = IdsTabItemInput[];
