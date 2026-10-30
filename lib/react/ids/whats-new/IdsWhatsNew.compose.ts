import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

/** Slot identity for WhatsNew anatomy (root is WhatsNew, not WhatsNewRoot). */
export const WHATS_NEW_SLOT = Symbol.for("ids.whats-new.slot");

export type WhatsNewSlotName =
  | "header"
  | "title"
  | "close"
  | "summary"
  | "body"
  | "version-filter-row"
  | "version"
  | "filter"
  | "sections-scroll"
  | "section"
  | "thumbnail"
  | "section-header"
  | "bookmark"
  | "section-title"
  | "description"
  | "link"
  | "show-more"
  | "images"
  | "image"
  | "footer";

export function getWhatsNewSlot(type: unknown): WhatsNewSlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [WHATS_NEW_SLOT]?: WhatsNewSlotName })[WHATS_NEW_SLOT];
}

export function markWhatsNewSlot<T>(fn: T, name: WhatsNewSlotName): T {
  (fn as { [WHATS_NEW_SLOT]?: WhatsNewSlotName })[WHATS_NEW_SLOT] = name;
  return fn;
}

export function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (isValidElement(node)) {
    return flattenText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

export function findSlotElement(
  children: ReactNode,
  slot: WhatsNewSlotName,
): ReactElement | undefined {
  let found: ReactElement | undefined;
  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    if (getWhatsNewSlot(child.type) === slot) {
      found = child;
      return;
    }
    const nested = (child.props as { children?: ReactNode }).children;
    if (nested) {
      found = findSlotElement(nested, slot);
    }
  });
  return found;
}

export function collectSlotElements(
  children: ReactNode,
  slot: WhatsNewSlotName,
): ReactElement[] {
  const found: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (getWhatsNewSlot(child.type) === slot) {
      found.push(child);
      return;
    }
    const nested = (child.props as { children?: ReactNode }).children;
    if (nested) {
      found.push(...collectSlotElements(nested, slot));
    }
  });
  return found;
}

export interface WhatsNewMainSlots {
  header?: ReactElement;
  title?: ReactElement;
  summary?: ReactElement;
  body?: ReactElement;
  footer?: ReactElement;
  sections: ReactElement[];
}

export function collectMainSlots(children: ReactNode): WhatsNewMainSlots {
  let header: ReactElement | undefined;
  let title: ReactElement | undefined;
  let summary: ReactElement | undefined;
  let body: ReactElement | undefined;
  let footer: ReactElement | undefined;
  const sections: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getWhatsNewSlot(child.type);
    if (slot === "header") header = child;
    else if (slot === "title") title = child;
    else if (slot === "summary") summary = child;
    else if (slot === "body") body = child;
    else if (slot === "footer") footer = child;
    else if (slot === "section") sections.push(child);
    else if (slot === "sections-scroll") {
      sections.push(
        ...collectSlotElements(
          (child.props as { children?: ReactNode }).children,
          "section",
        ),
      );
    }
  });

  if (header && !title) {
    title = findSlotElement((header.props as { children?: ReactNode }).children, "title");
  }
  if (sections.length === 0 && body) {
    sections.push(
      ...collectSlotElements((body.props as { children?: ReactNode }).children, "section"),
    );
  }

  return { header, title, summary, body, footer, sections };
}

export function hasWhatsNewAnatomyChildren(children: ReactNode): boolean {
  const slots = collectMainSlots(children);
  return Boolean(
    slots.header ||
      slots.summary ||
      slots.body ||
      slots.footer ||
      slots.sections.length > 0 ||
      slots.title,
  );
}

export interface ParsedWhatsNewImage {
  id: string;
  src?: string;
  alt?: string;
  label?: string;
  media?: ReactNode;
}

export interface ParsedWhatsNewSection {
  id: string;
  title: string;
  description: string;
  isBookmarked?: boolean;
  showMoreLabel?: string;
  linkText?: string;
  linkHref?: string;
  images: ParsedWhatsNewImage[];
  extraImageCount?: number;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  thumbnailMedia?: ReactNode;
  descriptionNode?: ReactNode;
}

export function parseSectionFromProps(props: {
  id?: string;
  isBookmarked?: boolean;
  showMoreLabel?: string;
  children?: ReactNode;
}): ParsedWhatsNewSection | null {
  if (!props.id) return null;

  const sectionChildren = props.children;
  const thumbnailEl = findSlotElement(sectionChildren, "thumbnail");
  const headerEl = findSlotElement(sectionChildren, "section-header");
  const descriptionEl = findSlotElement(sectionChildren, "description");
  const imagesEl = findSlotElement(sectionChildren, "images");

  let thumbnailSrc: string | undefined;
  let thumbnailAlt: string | undefined;
  let extraImageCount: number | undefined;
  let thumbnailMedia: ReactNode | undefined;

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
    thumbnailMedia = thumbProps.children;
  }

  let title = "";
  if (headerEl) {
    const titleEl = findSlotElement(
      (headerEl.props as { children?: ReactNode }).children,
      "section-title",
    );
    if (titleEl) {
      title = flattenText((titleEl.props as { children?: ReactNode }).children).trim();
    }
  }

  let description = "";
  let descriptionNode: ReactNode | undefined;
  let linkText: string | undefined;
  let linkHref: string | undefined;
  if (descriptionEl) {
    const descChildren = (descriptionEl.props as { children?: ReactNode }).children;
    descriptionNode = descChildren;
    description = flattenText(descChildren).trim();
    const linkEl = findSlotElement(descChildren, "link");
    if (linkEl) {
      const linkProps = linkEl.props as { href?: string; children?: ReactNode };
      linkText = flattenText(linkProps.children).trim() || undefined;
      linkHref = linkProps.href;
    }
  }

  const images: ParsedWhatsNewImage[] = [];
  if (imagesEl) {
    Children.forEach((imagesEl.props as { children?: ReactNode }).children, (imageChild) => {
      if (!isValidElement(imageChild) || getWhatsNewSlot(imageChild.type) !== "image") {
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
        media: imageProps.children,
      });
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

  if (images.length > 0 && thumbnailSrc && images[0] && !images[0].src) {
    images[0] = { ...images[0], src: thumbnailSrc, alt: thumbnailAlt ?? images[0].alt };
  }

  const derivedExtra = extraImageCount ?? (images.length > 1 ? images.length - 1 : undefined);

  return {
    id: props.id,
    title: title || "Section Header",
    description,
    linkText,
    linkHref,
    isBookmarked: props.isBookmarked,
    showMoreLabel: props.showMoreLabel,
    images,
    extraImageCount: derivedExtra,
    thumbnailSrc,
    thumbnailAlt,
    thumbnailMedia,
    descriptionNode,
  };
}

export function parseWhatsNewSections(children: ReactNode): ParsedWhatsNewSection[] {
  return collectMainSlots(children)
    .sections.map((child) =>
      parseSectionFromProps(child.props as {
        id?: string;
        isBookmarked?: boolean;
        showMoreLabel?: string;
        children?: ReactNode;
      }),
    )
    .filter((section): section is ParsedWhatsNewSection => section !== null);
}

export function sectionExtraImageCount(section: {
  extraImageCount?: number;
  images?: { length: number } | undefined;
}): number {
  return section.extraImageCount ?? Math.max(0, (section.images?.length ?? 0) - 1);
}
