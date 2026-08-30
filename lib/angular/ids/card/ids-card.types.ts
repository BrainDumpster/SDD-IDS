/** Dashboard / grid column span relative to a 3-column Dashboard grid. */
export type IdsCardSize = "span-1" | "span-2" | "span-3";

export interface IdsCardAction {
  id?: string;
  label: string;
  /** Optional per-action callback (React parity). Prefer `(actionClick)` on the card. */
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
  /** Stable id passed to `optionSelected` (per-card list; unique within the card). */
  value: string;
  /** Visible label in the overlay list. */
  label: string;
  disabled?: boolean;
}
