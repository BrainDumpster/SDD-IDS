import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { WhatsNewSection, WhatsNewSectionImage } from "./IdsWhatsNew";

/** Display names for compound `IdsWhatsNew` children (Mode B — canonical). */
export const WHATS_NEW_ROOT = "WhatsNew.Root";
export const WHATS_NEW_HEADER = "WhatsNew.Header";
export const WHATS_NEW_TITLE = "WhatsNew.Title";
export const WHATS_NEW_CLOSE_BUTTON = "WhatsNew.CloseButton";
export const WHATS_NEW_SUMMARY = "WhatsNew.Summary";
export const WHATS_NEW_BODY = "WhatsNew.Body";
export const WHATS_NEW_VERSION_FILTER_ROW = "WhatsNew.VersionFilterRow";
export const WHATS_NEW_VERSION = "WhatsNew.Version";
export const WHATS_NEW_FILTER = "WhatsNew.Filter";
export const WHATS_NEW_SECTIONS_SCROLL = "WhatsNew.SectionsScroll";
export const WHATS_NEW_SECTION = "WhatsNew.Section";
export const WHATS_NEW_THUMBNAIL = "WhatsNew.Thumbnail";
export const WHATS_NEW_SECTION_HEADER = "WhatsNew.SectionHeader";
export const WHATS_NEW_BOOKMARK_BUTTON = "WhatsNew.BookmarkButton";
export const WHATS_NEW_SECTION_TITLE = "WhatsNew.SectionTitle";
export const WHATS_NEW_DESCRIPTION = "WhatsNew.Description";
export const WHATS_NEW_LINK = "WhatsNew.Link";
export const WHATS_NEW_SHOW_MORE = "WhatsNew.ShowMore";
export const WHATS_NEW_IMAGES = "WhatsNew.Images";
export const WHATS_NEW_IMAGE = "WhatsNew.Image";
export const WHATS_NEW_FOOTER = "WhatsNew.Footer";

export interface ParsedWhatsNewSection extends WhatsNewSection {
  /** Renders inside description slot (replaces `description` + `linkText` strings). */
  descriptionNode?: ReactNode;
  /** Custom thumbnail media inside list tile chrome. */
  thumbnailNode?: ReactNode;
  /** Custom hero/strip media keyed by `WhatsNewImage` id. */
  imageNodes?: Record<string, ReactNode>;
  /** Overrides +N badge on list thumbnail (else `images.length - 1`). */
  extraImageCount?: number;
}

function elementTypeName(child: ReactElement): string | undefined {
  const type = child.type as { displayName?: string; name?: string };
  return type.displayName ?? type.name;
}

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return flattenText(props.children);
  }
  return "";
}

function findChildByDisplayName(
  children: ReactNode,
  displayName: string,
): ReactElement | undefined {
  let found: ReactElement | undefined;
  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    if (elementTypeName(child) === displayName) {
      found = child;
      return;
    }
    const nested = (child.props as { children?: ReactNode }).children;
    if (nested) {
      found = findChildByDisplayName(nested, displayName);
    }
  });
  return found;
}

function collectSectionElements(children: ReactNode): ReactElement[] {
  const sections: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const name = elementTypeName(child);

    if (name === WHATS_NEW_SECTION) {
      sections.push(child);
      return;
    }

    if (name === WHATS_NEW_SECTIONS_SCROLL) {
      sections.push(...collectSectionElements((child.props as { children?: ReactNode }).children));
      return;
    }

    if (name === WHATS_NEW_BODY) {
      sections.push(...collectSectionElements((child.props as { children?: ReactNode }).children));
    }
  });

  return sections;
}

export function hasWhatsNewSectionChildren(children: ReactNode): boolean {
  return collectSectionElements(children).length > 0;
}

export function extractTitleFromChildren(children: ReactNode): string | undefined {
  let title: string | undefined;

  Children.forEach(children, (child) => {
    if (title || !isValidElement(child)) return;
    const name = elementTypeName(child);

    if (name === WHATS_NEW_TITLE) {
      title = flattenText((child.props as { children?: ReactNode }).children).trim() || undefined;
      return;
    }

    if (name === WHATS_NEW_HEADER) {
      const headerTitle = findChildByDisplayName(
        (child.props as { children?: ReactNode }).children,
        WHATS_NEW_TITLE,
      );
      if (headerTitle) {
        title =
          flattenText((headerTitle.props as { children?: ReactNode }).children).trim() || undefined;
      }
    }
  });

  return title;
}

export function extractSummaryNodeFromChildren(children: ReactNode): ReactNode | undefined {
  let summary: ReactNode | undefined;

  Children.forEach(children, (child) => {
    if (summary !== undefined || !isValidElement(child)) return;
    if (elementTypeName(child) === WHATS_NEW_SUMMARY) {
      summary = (child.props as { children?: ReactNode }).children;
    }
  });

  return summary;
}

function parseSectionElement(child: ReactElement): ParsedWhatsNewSection | null {
  const props = child.props as {
    id?: string;
    isBookmarked?: boolean;
    showMoreLabel?: string;
    children?: ReactNode;
  };

  if (!props.id) return null;

  const sectionChildren = props.children;
  let title = "";
  let description = "";
  let linkText: string | undefined;
  let linkHref: string | undefined;
  let descriptionNode: ReactNode | undefined;
  let thumbnailNode: ReactNode | undefined;
  let thumbnailSrc: string | undefined;
  let thumbnailAlt: string | undefined;
  let extraImageCount: number | undefined;
  const images: WhatsNewSectionImage[] = [];
  const imageNodes: Record<string, ReactNode> = {};

  const thumbnailEl = findChildByDisplayName(sectionChildren, WHATS_NEW_THUMBNAIL);
  if (thumbnailEl) {
    const thumbProps = thumbnailEl.props as {
      src?: string;
      alt?: string;
      extraCount?: number;
      children?: ReactNode;
    };
    thumbnailSrc = thumbProps.src;
    thumbnailAlt = thumbProps.alt;
    extraImageCount = thumbProps.extraCount;
    if (thumbProps.children) {
      thumbnailNode = thumbProps.children;
    }
  }

  const headerEl = findChildByDisplayName(sectionChildren, WHATS_NEW_SECTION_HEADER);
  if (headerEl) {
    const titleEl = findChildByDisplayName(
      (headerEl.props as { children?: ReactNode }).children,
      WHATS_NEW_SECTION_TITLE,
    );
    if (titleEl) {
      title = flattenText((titleEl.props as { children?: ReactNode }).children).trim();
    }
  }

  const descriptionEl = findChildByDisplayName(sectionChildren, WHATS_NEW_DESCRIPTION);
  if (descriptionEl) {
    const descChildren = (descriptionEl.props as { children?: ReactNode }).children;
    descriptionNode = descChildren;
    description = flattenText(descChildren).trim();

    const linkEl = findChildByDisplayName(descChildren, WHATS_NEW_LINK);
    if (linkEl) {
      const linkProps = linkEl.props as { href?: string; children?: ReactNode };
      linkText = flattenText(linkProps.children).trim() || undefined;
      linkHref = linkProps.href;
    }
  }

  const imagesEl = findChildByDisplayName(sectionChildren, WHATS_NEW_IMAGES);
  if (imagesEl) {
    Children.forEach((imagesEl.props as { children?: ReactNode }).children, (imageChild) => {
      if (!isValidElement(imageChild) || elementTypeName(imageChild) !== WHATS_NEW_IMAGE) {
        return;
      }
      const imageProps = imageChild.props as {
        id?: string;
        src?: string;
        alt?: string;
        label?: string;
        children?: ReactNode;
      };
      if (!imageProps.id) return;
      images.push({
        id: imageProps.id,
        src: imageProps.src,
        alt: imageProps.alt,
        label: imageProps.label,
      });
      if (imageProps.children) {
        imageNodes[imageProps.id] = imageProps.children;
      }
    });
  }

  if (images.length === 0 && thumbnailSrc) {
    images.push({
      id: `${props.id}-thumb`,
      src: thumbnailSrc,
      alt: thumbnailAlt,
      label: "1. Label",
    });
  }

  const derivedExtra =
    extraImageCount ?? (images.length > 1 ? images.length - 1 : undefined);

  if (images.length > 0 && thumbnailSrc && images[0] && !images[0].src) {
    images[0] = { ...images[0], src: thumbnailSrc, alt: thumbnailAlt ?? images[0].alt };
  }

  return {
    id: props.id,
    title: title || "Section Header",
    description,
    linkText,
    linkHref,
    isBookmarked: props.isBookmarked,
    showMoreLabel: props.showMoreLabel,
    images,
    descriptionNode,
    thumbnailNode,
    imageNodes: Object.keys(imageNodes).length > 0 ? imageNodes : undefined,
    extraImageCount: derivedExtra,
  };
}

export function parseWhatsNewSections(children: ReactNode): ParsedWhatsNewSection[] {
  return collectSectionElements(children)
    .map(parseSectionElement)
    .filter((section): section is ParsedWhatsNewSection => section !== null);
}

export function sectionExtraImageCount(section: ParsedWhatsNewSection): number {
  return section.extraImageCount ?? Math.max(0, (section.images?.length ?? 0) - 1);
}
