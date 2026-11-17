/**
 * Breadcrumb constants — from `components/ids/breadcrumb/design-spec.md`
 * and Storybook React `IdsBreadcrumb` API (`storybook/src/components/IdsBreadcrumb.tsx`).
 *
 * Note: `lib/react/ids/breadcrumb` does not exist; the React reference lives in Storybook.
 */

export interface IdsBreadcrumbItem {
  label: string;
  href?: string;
}

export const BREADCRUMB_RUNTIME_DEFAULTS = {
  maxVisibleItems: 3,
  truncateBelowPx: 24,
  revertAtOrAbovePx: 48,
} as const;

export function normalizeBreadcrumbItems(
  value: unknown,
): IdsBreadcrumbItem[] {
  if (!Array.isArray(value)) return [];
  const items: IdsBreadcrumbItem[] = [];
  for (const entry of value) {
    if (entry == null || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const label = record.label;
    if (typeof label !== "string" || label.trim() === "") continue;
    const item: IdsBreadcrumbItem = { label };
    if (typeof record.href === "string" && record.href.trim() !== "") {
      item.href = record.href;
    }
    items.push(item);
  }
  return items;
}

export function resolveMaxVisibleItems(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) {
    return BREADCRUMB_RUNTIME_DEFAULTS.maxVisibleItems;
  }
  return Math.floor(n);
}

export function applyLabelCap(
  items: readonly IdsBreadcrumbItem[],
  labelCap: number | null,
): IdsBreadcrumbItem[] {
  if (labelCap == null) return [...items];
  return items.map((item) => {
    if (item.label.length <= labelCap) return item;
    return { ...item, label: `${item.label.slice(0, labelCap)}...` };
  });
}
