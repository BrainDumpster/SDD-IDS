export const IDS_WHATS_NEW_DESIGN_SPEC_PATH = "components/ids/whats-new/design-spec.md";

export const IDS_WHATS_NEW_FIGMA_NODES = {
  main: "27437:44073",
  newest: "27437:44094",
  bookmarked: "27437:44074",
  previewMultiple: "27437:44134",
  previewSingle: "27437:44151",
  sectionHeader: "27437:44183",
  listItem: "27437:44195",
  thumbnail: "27437:44227",
  imageSwap: "27437:44209",
  footer: "27437:44088",
  close: "27437:44081",
} as const;

export type IdsWhatsNewView = "newest" | "bookmarked" | "preview-single" | "preview-multiple";
export type IdsWhatsNewLayout = "modal" | "inline" | "compact";

export interface IdsWhatsNewItem {
  id: string;
  sectionHeader?: string;
  sectionHeaderIcon?: "star" | "star-solid";
  description?: string;
  /** Label for the inline "Read more" / "Show more" action. */
  readMoreLabel?: string;
  onReadMore?: () => void;
  /** Optional thumbnail / preview image URL for the item. */
  imageUrl?: string;
  /** Version string, rendered in the list header when present. */
  version?: string;
  date?: string;
  category?: string;
}
