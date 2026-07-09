import type {
  IdsWhatsNewProps,
  WhatsNewFilter,
  WhatsNewSection,
} from "../components/IdsWhatsNew";

export const IDS_WHATS_NEW_DESIGN_SPEC_PATH =
  "components/ids/whats-new/design-spec.md" as const;

export const WHATS_NEW_FILTER_OPTIONS: WhatsNewFilter[] = ["newest", "bookmarked"];

export const WHATS_NEW_FILTER_LABELS: Record<WhatsNewFilter, string> = {
  newest: "Newest",
  bookmarked: "Bookmarked",
};

export const WHATS_NEW_DEFAULT_TITLE = "What's New" as const;

export const WHATS_NEW_DESCRIPTION_NEWEST =
  "The following updates (features, bug fixes) have recently been made." as const;

export const WHATS_NEW_DESCRIPTION_BOOKMARKED =
  "The following updates (features, bug fixes) were bookmarked and may be from recent or previous releases/versions." as const;

export const WHATS_NEW_FOOTER_TOGGLE_LABEL =
  "Don't show again until the next update" as const;

export const WHATS_NEW_SHOW_MORE_LABEL = "Show More" as const;
export const WHATS_NEW_SHOW_LESS_LABEL = "Show Less" as const;

export const WHATS_NEW_SWAP_THUMBNAIL_TITLE = "Swap image" as const;
export const WHATS_NEW_SWAP_THUMBNAIL_LINK = "Learn to swap" as const;
export const WHATS_NEW_SWAP_HERO_LINK = "Learn how to swap component" as const;

/** Icon slugs — must match `assets/icons/<slug>.svg` and design-spec Icons table. */
export const WHATS_NEW_ICON_PHOTOS = "photos" as const;
export const WHATS_NEW_ICON_POPOUT_WINDOW_ARROW = "popout-window-arrow" as const;
export const WHATS_NEW_ICON_STAR_FAV = "star-fav" as const;
export const WHATS_NEW_ICON_STAR_FAV_SOLID = "star-fav-solid" as const;
export const WHATS_NEW_ICON_POPOUT_DOUBLE = "popout-double" as const;
export const WHATS_NEW_ICON_CHEV_LEFT = "chev-left" as const;
export const WHATS_NEW_ICON_CHEV_RIGHT = "chev-right" as const;
export const WHATS_NEW_ICON_CLOSE = "shape-x" as const;

export const WHATS_NEW_SPEC_ACCURATE_DEFAULTS: Pick<
  IdsWhatsNewProps,
  | "open"
  | "title"
  | "description"
  | "versionNumber"
  | "filter"
  | "dontShowAgain"
> = {
  open: true,
  title: WHATS_NEW_DEFAULT_TITLE,
  description: WHATS_NEW_DESCRIPTION_NEWEST,
  versionNumber: "1.11.11.1",
  filter: "newest",
  dontShowAgain: false,
};

const SAMPLE_DESCRIPTION =
  "In the description, describe new features or changes made to an existing feature. Keep this part brief and to the point. An example of description can be something like this - VMware Photon virtual machines created by the vSphere Cluster Service (vCLS) are now automatically excluded from PowerProtect Data Manager protection. This change follows VMware";

export const WHATS_NEW_SAMPLE_SECTION_DESCRIPTION = SAMPLE_DESCRIPTION;

export const WHATS_NEW_DESCRIPTION_SUFFIX =
  " these virtual machines solely by vCLS." as const;

export const WHATS_NEW_SPEC_DEMO_SECTIONS: WhatsNewSection[] = [
  {
    id: "section-1",
    title: "Section Header",
    description: SAMPLE_DESCRIPTION,
    linkText: "guidance to manage",
    linkHref: "#",
    isBookmarked: false,
    images: [
      { id: "section-1-img-1", label: "1. Label", alt: "Image 1" },
      { id: "section-1-img-2", label: "2. Label", alt: "Image 2" },
      { id: "section-1-img-3", label: "3. Label", alt: "Image 3" },
      { id: "section-1-img-4", label: "4. Label", alt: "Image 4" },
      { id: "section-1-img-5", label: "5. Label", alt: "Image 5" },
    ],
  },
  {
    id: "section-2",
    title: "Section Header",
    description: SAMPLE_DESCRIPTION,
    linkText: "guidance to manage",
    linkHref: "#",
    isBookmarked: false,
    images: [{ id: "section-2-img-1", label: "1. Label", alt: "Image 1" }],
  },
  {
    id: "section-3",
    title: "Section Header",
    description: SAMPLE_DESCRIPTION,
    linkText: "guidance to manage",
    linkHref: "#",
    isBookmarked: true,
    images: [
      { id: "section-3-img-1", label: "1. Label", alt: "Image 1" },
      { id: "section-3-img-2", label: "2. Label", alt: "Image 2" },
      { id: "section-3-img-3", label: "3. Label", alt: "Image 3" },
    ],
  },
];
