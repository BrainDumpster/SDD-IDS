/**
 * IDS Tab constants — from `components/ids/tab/design-spec.md`
 * + `component-contracts/ids/tab.contract.ts` + React `lib/react/ids/tab`.
 */

export type IdsTabsType = "primary" | "secondary";
export type IdsTabsSurface = "elevated" | "transparent";

export interface IdsTabItemInput {
  id: string;
  label: string;
  content: string;
  iconSlug?: string;
  badgeCount?: number;
  hasAlert?: boolean;
  closable?: boolean;
  disabled?: boolean;
}

export interface IdsTabSelectPayload {
  id: string;
  label: string;
}

export const TAB_API_DEFAULTS = {
  type: "secondary" as IdsTabsType,
  surface: "elevated" as IdsTabsSurface,
  allowAddTab: false,
  addTabLabel: "Add Tab",
  moreLabel: "More",
  overflow: true,
} as const;

export const TAB_OVERFLOW_MORE_ICON_SLUG = "arrow-tri-down-solid" as const;
export const TAB_OVERFLOW_MORE_ICON_SIZE_PX = 10 as const;
export const TAB_OVERFLOW_MORE_TRIGGER_RESERVE_PX = 84 as const;
export const TAB_ADD_ICON_SLUG = "state-add-circ-solid" as const;
export const TAB_CLOSE_ICON_SLUG = "ctrl-close-16" as const;
export const TAB_ALERT_ICON_SLUG = "status-critical-circ-solid-16" as const;

export const PLACEHOLDER_ITEM: IdsTabItemInput = {
  id: "placeholder",
  label: "Tab",
  content: "Placeholder content",
};

export function resolveType(type: unknown, variant: unknown): IdsTabsType {
  const raw = type ?? variant;
  return raw === "primary" ? "primary" : "secondary";
}

export function resolveSurface(surface: unknown): IdsTabsSurface {
  if (surface === "transparent") return "transparent";
  // Legacy alias `white` → elevated
  return "elevated";
}

export function firstEnabledId(
  items: IdsTabItemInput[],
  preferred?: string,
): string {
  if (preferred && items.some((t) => t.id === preferred && !t.disabled)) {
    return preferred;
  }
  const enabled = items.find((t) => !t.disabled);
  return enabled?.id ?? items[0]?.id ?? PLACEHOLDER_ITEM.id;
}

export function normalizeItems(
  items: IdsTabItemInput[] | undefined | null,
): IdsTabItemInput[] {
  if (!items || items.length === 0) return [{ ...PLACEHOLDER_ITEM }];
  return items;
}
