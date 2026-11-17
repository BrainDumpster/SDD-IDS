/**
 * IDS Card types / resolvers — React `lib/react/ids/card` + design-spec parity.
 * Spec: `components/ids/card/design-spec.md`
 */

/** Dashboard / grid column span relative to a 3-column Dashboard grid. */
export type IdsCardSize = "span-1" | "span-2" | "span-3";

export interface IdsCardAction {
  id?: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface IdsCardKeyValueItem {
  id?: string;
  label: string;
  value: string;
  /** Optional leading icon slug (e.g. `folder-closed`) per Figma key-value rows. */
  iconSlug?: string;
}

export interface IdsCardMenuOption {
  /** Stable id passed to `option-selected` (per-card list; unique within the card). */
  value: string;
  /** Visible label in the overlay list. */
  label: string;
  disabled?: boolean;
}

export function resolveSize(value: unknown): IdsCardSize {
  if (value === "span-2" || value === "span-3") return value;
  return "span-1";
}

export function resolveBoolean(value: unknown, defaultValue: boolean): boolean {
  if (typeof value === "boolean") return value;
  return defaultValue;
}

export function firstEnabledIndex(options: IdsCardMenuOption[]): number {
  const idx = options.findIndex((o) => !o.disabled);
  return idx >= 0 ? idx : 0;
}

export function nextEnabledIndex(
  options: IdsCardMenuOption[],
  from: number,
  delta: number,
): number {
  if (options.length === 0) return 0;
  let i = from;
  for (let step = 0; step < options.length; step += 1) {
    i = (i + delta + options.length) % options.length;
    if (!options[i]?.disabled) return i;
  }
  return from;
}
