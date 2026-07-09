import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from "react";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { Button } from "./Button";
import { DropdownMenu } from "./DropdownMenu";
import { Icon } from "./Icon";
import { IdsDropdownTriggerShell } from "./IdsDropdownTriggerShell";
import { ToggleSwitch } from "./ToggleSwitch";
import {
  WHATS_NEW_BODY,
  WHATS_NEW_BOOKMARK_BUTTON,
  WHATS_NEW_CLOSE_BUTTON,
  WHATS_NEW_DESCRIPTION,
  WHATS_NEW_FILTER,
  WHATS_NEW_FOOTER,
  WHATS_NEW_HEADER,
  WHATS_NEW_IMAGE,
  WHATS_NEW_IMAGES,
  WHATS_NEW_LINK,
  WHATS_NEW_SECTION,
  WHATS_NEW_SECTION_HEADER,
  WHATS_NEW_SECTION_TITLE,
  WHATS_NEW_SECTIONS_SCROLL,
  WHATS_NEW_SHOW_MORE,
  WHATS_NEW_SUMMARY,
  WHATS_NEW_THUMBNAIL,
  WHATS_NEW_TITLE,
  WHATS_NEW_VERSION,
  WHATS_NEW_VERSION_FILTER_ROW,
  extractSummaryNodeFromChildren,
  extractTitleFromChildren,
  hasWhatsNewSectionChildren,
  parseWhatsNewSections,
  sectionExtraImageCount,
  type ParsedWhatsNewSection,
} from "./IdsWhatsNew.compose";
import styles from "./IdsWhatsNew.module.css";

export type WhatsNewFilter = "newest" | "bookmarked";

const FILTER_OPTIONS: { id: WhatsNewFilter; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "bookmarked", label: "Bookmarked" },
];

const FILTER_LABEL: Record<WhatsNewFilter, string> = {
  newest: "Newest",
  bookmarked: "Bookmarked",
};

/** Thumbnail / hover / expand icon box — Figma `32×32` (`27437:44174`). */
const WHATS_NEW_TILE_ICON_SIZE_PX = 32;
const WHATS_NEW_TILE_ICON_STYLE = {
  width: WHATS_NEW_TILE_ICON_SIZE_PX,
  height: WHATS_NEW_TILE_ICON_SIZE_PX,
} as const;

export interface WhatsNewSectionImage {
  id: string;
  src?: string;
  alt?: string;
  label?: string;
}

export interface WhatsNewSection {
  id: string;
  title: string;
  description: string;
  /** When true → filled star; otherwise outline star. */
  isBookmarked?: boolean;
  images?: WhatsNewSectionImage[];
  showMoreLabel?: string;
  linkText?: string;
  linkHref?: string;
}

export interface IdsWhatsNewProps extends Omit<ComponentProps<"div">, "title"> {
  /** Modal visibility. Defaults to `true` (open). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  /** Renders as `Version: {versionNumber}` when provided. */
  versionNumber?: string;
  filter?: WhatsNewFilter;
  onFilterChange?: (filter: WhatsNewFilter) => void;
  /**
   * Convenience data API (Mode A). When omitted and `WhatsNewSection` children are present,
   * sections are parsed from child composition (Mode B — canonical).
   */
  sections?: WhatsNewSection[];
  /** Compound child components (`WhatsNewSection`, slots). Canonical public API. */
  children?: ReactNode;
  /** Root-owned footer toggle state. */
  dontShowAgain?: boolean;
  onDontShowAgainChange?: (value: boolean) => void;
  onClose?: () => void;
  onShowMore?: (sectionId: string, expanded: boolean) => void;
  onSectionBookmarkChange?: (sectionId: string, isBookmarked: boolean) => void;
  onThumbnailClick?: (sectionId: string, imageId?: string) => void;
  onCarouselNavigate?: (sectionId: string, index: number) => void;
  /** Host opens fullscreen/lightbox for the active carousel image. */
  onExpandImage?: (sectionId: string, imageId: string, index: number) => void;
  onCarouselClose?: (sectionId: string) => void;
  onSinglePreviewClose?: (sectionId: string, imageId: string, index: number) => void;
}

const DEFAULT_TITLE = "What's New";
const DEFAULT_DESCRIPTION =
  "The following updates (features, bug fixes) have recently been made.";
const SAMPLE_DESCRIPTION =
  "In the description, describe new features or changes made to an existing feature. Keep this part brief and to the point. An example of description can be something like this - VMware Photon virtual machines created by the vSphere Cluster Service (vCLS) are now automatically excluded from PowerProtect Data Manager protection. This change follows VMware";
const SAMPLE_LINK_TEXT = "guidance to manage";
const SAMPLE_DESCRIPTION_SUFFIX =
  " these virtual machines solely by vCLS.";

function sampleImages(sectionId: string, count = 1): WhatsNewSectionImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${sectionId}-img-${i + 1}`,
    label: `${i + 1}. Label`,
    alt: `Image ${i + 1}`,
  }));
}

export const SAMPLE_WHATS_NEW_SECTIONS: WhatsNewSection[] = [
  {
    id: "section-1",
    title: "Section Header",
    description: SAMPLE_DESCRIPTION,
    linkText: SAMPLE_LINK_TEXT,
    linkHref: "#",
    isBookmarked: false,
    images: sampleImages("section-1", 5),
  },
  {
    id: "section-2",
    title: "Section Header",
    description: SAMPLE_DESCRIPTION,
    linkText: SAMPLE_LINK_TEXT,
    linkHref: "#",
    isBookmarked: false,
    images: sampleImages("section-2", 1),
  },
  {
    id: "section-3",
    title: "Section Header",
    description: SAMPLE_DESCRIPTION,
    linkText: SAMPLE_LINK_TEXT,
    linkHref: "#",
    isBookmarked: true,
    images: sampleImages("section-3", 3),
  },
];

function WhatsNewVersion({ versionNumber }: { versionNumber: string }) {
  return (
    <p className={styles.version}>
      <span className={styles.versionPrefix}>Version: </span>
      <span className={styles.versionNumber}>{versionNumber}</span>
    </p>
  );
}

function ImageSwapContent({
  variant = "thumbnail",
}: {
  /** `thumbnail` = list/strip swap tile; `hero` = carousel main placeholder */
  variant?: "thumbnail" | "hero";
}) {
  const photosIcon = (
    <Icon
      shapeName="photos"
      variant="img"
      className={styles.swapPhotosIcon}
      style={WHATS_NEW_TILE_ICON_STYLE}
    />
  );

  if (variant === "hero") {
    return (
      <div className={styles.heroPlaceholderInner}>
        {photosIcon}
        <p className={styles.thumbnailTitle}>Swap image</p>
        <p className={styles.heroHelper}>
          Replace the image by swapping this component with{" "}
          <strong>your local image component</strong>. Use auto layout in your local component so
          that it fits the container.
        </p>
        <span className={styles.thumbnailLink}>Learn how to swap component</span>
      </div>
    );
  }

  return (
    <div className={styles.thumbnailInner}>
      {photosIcon}
      <p className={styles.thumbnailTitle}>Swap image</p>
      <span className={styles.thumbnailLink}>Learn to swap</span>
    </div>
  );
}

function SectionImageMedia({
  image,
  variant = "thumbnail",
  mediaOverride,
}: {
  image?: WhatsNewSectionImage;
  variant?: "thumbnail" | "hero";
  mediaOverride?: ReactNode;
}) {
  const [broken, setBroken] = useState(false);
  const showPlaceholder = !mediaOverride && (!image?.src || broken);

  if (mediaOverride) {
    return <>{mediaOverride}</>;
  }

  if (showPlaceholder) {
    return <ImageSwapContent variant={variant} />;
  }

  const src = image?.src;
  if (!src) {
    return <ImageSwapContent variant={variant} />;
  }

  return (
    <img
      className={styles.sectionImage}
      src={src}
      alt={image?.alt ?? ""}
      onError={() => setBroken(true)}
    />
  );
}

/**
 * `.WhatsNew-Element-Thumbnails` — Figma `27437:44174` default; states `27437:44168`
 * (Default / Hover / Selected). List: **200×112.5**; carousel strip: **184×103**.
 */
function SectionThumbnail({
  image,
  selected = false,
  compact = false,
  extraImageCount = 0,
  showHoverOverlay = true,
  mediaOverride,
  onClick,
  buttonRef,
}: {
  image?: WhatsNewSectionImage;
  selected?: boolean;
  compact?: boolean;
  /** When > 0, show `+N` badge (Figma multiple-images tag). */
  extraImageCount?: number;
  showHoverOverlay?: boolean;
  mediaOverride?: ReactNode;
  onClick?: () => void;
  buttonRef?: (node: HTMLButtonElement | null) => void;
}) {
  const className = [
    styles.thumbnail,
    compact ? styles.stripThumbnail : null,
    selected ? styles.thumbnailSelected : null,
    showHoverOverlay ? null : styles.thumbnailNoHoverOverlay,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={buttonRef}
      type="button"
      className={className}
      onClick={onClick}
      aria-label={image?.alt ?? "Open image preview"}
      aria-current={selected ? "true" : undefined}
    >
      <span className={styles.thumbnailContent}>
        <SectionImageMedia image={image} variant="thumbnail" mediaOverride={mediaOverride} />
      </span>
      <span className={styles.thumbnailHoverOverlay} aria-hidden="true">
        <Icon
          shapeName="popout-window-arrow"
          variant="inline"
          className={styles.thumbnailHoverIcon}
          style={WHATS_NEW_TILE_ICON_STYLE}
        />
      </span>
      {extraImageCount > 0 ? (
        <span className={styles.thumbnailCountBadge}>+{extraImageCount}</span>
      ) : null}
    </button>
  );
}

function WhatsNewFilterDropdown({
  value,
  onChange,
  portalContainer,
}: {
  value: WhatsNewFilter;
  onChange: (next: WhatsNewFilter) => void;
  portalContainer?: RefObject<HTMLElement | null>;
}) {
  const label = FILTER_LABEL[value];

  return (
    <div className={styles.filterDropdown}>
      <DropdownMenu
        trigger={
          <IdsDropdownTriggerShell
            size="small"
            className={styles.filterTriggerShell}
            left={
              <span className={styles.filterValue}>{label}</span>
            }
          />
        }
        items={FILTER_OPTIONS.map((option) => ({
          id: option.id,
          label: option.label,
          value: option.label,
          selectable: true,
          onClick: () => onChange(option.id),
        }))}
        selectionMode="single"
        selectedValues={[label]}
        matchTriggerWidth
        sideOffset={0}
        portalContainer={portalContainer}
      />
    </div>
  );
}

function WhatsNewSectionView({
  section,
  onShowMore,
  onThumbnailClick,
  onBookmarkToggle,
}: {
  section: ParsedWhatsNewSection;
  onShowMore?: (sectionId: string, expanded: boolean) => void;
  onThumbnailClick?: (sectionId: string, imageId?: string) => void;
  onBookmarkToggle?: (sectionId: string) => void;
}) {
  const primary = section.images?.[0];
  const isBookmarked = section.isBookmarked === true;
  const extraImageCount = sectionExtraImageCount(section);
  const [expanded, setExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement | HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const measureTruncation = useCallback(() => {
    const el = descriptionRef.current;
    if (!el || expanded) {
      return;
    }
    setIsTruncated(el.scrollHeight > el.clientHeight + 1);
  }, [expanded]);

  useLayoutEffect(() => {
    measureTruncation();
  }, [measureTruncation, section.description, section.linkText, section.descriptionNode]);

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el || expanded) return;

    const observer = new ResizeObserver(measureTruncation);
    observer.observe(el);
    void document.fonts?.ready.then(measureTruncation);
    return () => observer.disconnect();
  }, [expanded, measureTruncation, section.descriptionNode]);

  const descriptionClassName = [
    styles.sectionDescription,
    expanded ? null : styles.sectionDescriptionCollapsed,
  ]
    .filter(Boolean)
    .join(" ");

  const toggleDescription = () => {
    const next = !expanded;
    setExpanded(next);
    onShowMore?.(section.id, next);
  };

  const showToggle = expanded || isTruncated;

  return (
    <article className={styles.section} role="listitem">
      <SectionThumbnail
        image={primary}
        extraImageCount={extraImageCount}
        mediaOverride={section.thumbnailNode}
        onClick={() => onThumbnailClick?.(section.id, primary?.id)}
      />
      <div className={styles.sectionText}>
        <div className={styles.sectionTitleRow}>
          <button
            type="button"
            className={styles.bookmarkButton}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            aria-pressed={isBookmarked}
            onClick={() => onBookmarkToggle?.(section.id)}
          >
            <Icon
              shapeName={isBookmarked ? "star-fav-solid" : "star-fav"}
              variant="img"
              style={{ width: 16, height: 16 }}
            />
          </button>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
        </div>
        {section.descriptionNode ? (
          <div ref={descriptionRef} className={descriptionClassName}>
            {section.descriptionNode}
          </div>
        ) : (
          <p ref={descriptionRef} className={descriptionClassName}>
            {section.description}
            {section.linkText ? (
              <>
                {" "}
                <a className={styles.inlineLink} href={section.linkHref ?? "#"}>
                  {section.linkText}
                </a>
              </>
            ) : null}
            {SAMPLE_DESCRIPTION_SUFFIX}
          </p>
        )}
        {showToggle ? (
          <button
            type="button"
            className={styles.showMore}
            aria-expanded={expanded}
            onClick={toggleDescription}
          >
            {expanded ? "Show Less" : (section.showMoreLabel ?? "Show More")}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function WhatsNewFooter({
  dontShowAgain,
  onDontShowAgainChange,
  onClose,
}: {
  dontShowAgain: boolean;
  onDontShowAgainChange?: (value: boolean) => void;
  onClose: () => void;
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerToggle}>
        <ToggleSwitch
          checked={dontShowAgain}
          onCheckedChange={(checked) => onDontShowAgainChange?.(checked)}
          ariaLabel="Don't show again until the next update"
        />
        <span className={styles.toggleLabel}>Don&apos;t show again until the next update</span>
      </div>
      <div className={styles.footerActions}>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    </footer>
  );
}

function WhatsNewSinglePreview({
  image,
  imageIndex,
}: {
  image: WhatsNewSectionImage;
  imageIndex: number;
}) {
  const caption = image.label?.replace(/^\d+\.\s*/, "") || "Label";

  return (
    <div className={styles.carouselElementContent} data-node-id="27437:44163">
      <div className={styles.singlePreviewInner}>
        <div className={styles.carouselMain}>
          <div className={styles.heroImage}>
            <SectionImageMedia image={image} variant="hero" />
          </div>
          <div className={styles.captionRow}>
            <ol className={styles.captionLabel} start={imageIndex + 1}>
              <li>{caption}</li>
            </ol>
            <div className={styles.expandButton} aria-hidden="true">
              <Icon
                shapeName="popout-double"
                variant="inline"
                className={styles.expandIcon}
                style={WHATS_NEW_TILE_ICON_STYLE}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatsNewCarousel({
  section,
  activeIndex,
  onNavigate,
  onExpandImage,
}: {
  section: ParsedWhatsNewSection;
  activeIndex: number;
  onNavigate: (index: number) => void;
  onExpandImage?: (imageId: string, index: number) => void;
}) {
  const images =
    section.images && section.images.length > 0
      ? section.images
      : [{ id: `${section.id}-placeholder`, label: "1. Label" }];
  const multiple = images.length > 1;
  const safeIndex = Math.min(Math.max(activeIndex, 0), images.length - 1);
  const active = images[safeIndex]!;
  const canPrev = safeIndex > 0;
  const canNext = safeIndex < images.length - 1;
  const caption = active.label?.replace(/^\d+\.\s*/, "") || "Label";
  const thumbButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  const [showStripTrailingFade, setShowStripTrailingFade] = useState(false);

  const updateStripTrailingFade = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) {
      setShowStripTrailingFade(false);
      return;
    }
    const hasOverflow = strip.scrollWidth > strip.clientWidth + 1;
    const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
    setShowStripTrailingFade(hasOverflow && !atEnd);
  }, []);

  useLayoutEffect(() => {
    updateStripTrailingFade();
  }, [images.length, updateStripTrailingFade]);

  useEffect(() => {
    const node = thumbButtonRefs.current[safeIndex];
    node?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [safeIndex]);

  useEffect(() => {
    const timer = window.setTimeout(updateStripTrailingFade, 320);
    return () => window.clearTimeout(timer);
  }, [safeIndex, updateStripTrailingFade]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !multiple) return;
    strip.addEventListener("scroll", updateStripTrailingFade, { passive: true });
    const resizeObserver = new ResizeObserver(updateStripTrailingFade);
    resizeObserver.observe(strip);
    return () => {
      strip.removeEventListener("scroll", updateStripTrailingFade);
      resizeObserver.disconnect();
    };
  }, [multiple, updateStripTrailingFade]);

  return (
    <div className={styles.carouselElementContent} data-node-id="27437:44198">
      <div className={styles.carouselInner}>
        {multiple ? (
          <button
            type="button"
            className={styles.carouselNav}
            aria-label="Previous image"
            disabled={!canPrev}
            onClick={() => onNavigate(safeIndex - 1)}
          >
            <Icon shapeName="chev-left" className={styles.carouselNavIcon} />
          </button>
        ) : null}

        <div className={styles.carouselMain}>
          {multiple ? (
            <div className={styles.thumbnailStripViewport}>
              <div ref={stripRef} className={styles.thumbnailStrip}>
                {images.map((image, index) => (
                  <SectionThumbnail
                    key={image.id}
                    image={image}
                    compact
                    selected={index === safeIndex}
                    showHoverOverlay={false}
                    mediaOverride={section.imageNodes?.[image.id]}
                    onClick={() => onNavigate(index)}
                    buttonRef={(node) => {
                      thumbButtonRefs.current[index] = node;
                    }}
                  />
                ))}
              </div>
              {showStripTrailingFade ? (
                <div className={styles.stripTrailingOverlay} aria-hidden="true" />
              ) : null}
            </div>
          ) : null}

          <div className={styles.heroImage} key={active.id}>
            <SectionImageMedia
              image={active}
              variant="hero"
              mediaOverride={section.imageNodes?.[active.id]}
            />
          </div>

          <div className={styles.captionRow}>
            <ol className={styles.captionLabel} start={safeIndex + 1}>
              <li>{caption}</li>
            </ol>
            <button
              type="button"
              className={styles.expandButton}
              aria-label="Expand image"
              onClick={() => onExpandImage?.(active.id, safeIndex)}
            >
              <Icon
                shapeName="popout-double"
                variant="inline"
                className={styles.expandIcon}
                style={WHATS_NEW_TILE_ICON_STYLE}
              />
            </button>
          </div>
        </div>

        {multiple ? (
          <button
            type="button"
            className={[styles.carouselNav, styles.carouselNavRight].filter(Boolean).join(" ")}
            aria-label="Next image"
            disabled={!canNext}
            onClick={() => onNavigate(safeIndex + 1)}
          >
            <Icon shapeName="chev-right" className={styles.carouselNavIcon} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function IdsWhatsNew({
  open: openProp,
  onOpenChange,
  title: titleProp = DEFAULT_TITLE,
  description: descriptionProp = DEFAULT_DESCRIPTION,
  versionNumber = "1.11.11.1",
  filter = "newest",
  onFilterChange,
  sections: sectionsProp,
  children,
  dontShowAgain = false,
  onDontShowAgainChange,
  onClose,
  onShowMore,
  onSectionBookmarkChange,
  onThumbnailClick,
  onCarouselNavigate,
  onExpandImage,
  onCarouselClose,
  onSinglePreviewClose,
  className,
  ...rest
}: IdsWhatsNewProps) {
  const compositionMode = useMemo(
    () => hasWhatsNewSectionChildren(children),
    [children],
  );

  useEffect(() => {
    if (compositionMode && sectionsProp !== undefined) {
      console.warn(
        "[IdsWhatsNew] `sections` prop takes precedence over `WhatsNewSection` child composition.",
      );
    }
  }, [compositionMode, sectionsProp]);

  const parsedSections = useMemo(
    () => (compositionMode ? parseWhatsNewSections(children) : []),
    [children, compositionMode],
  );

  const title = compositionMode
    ? (extractTitleFromChildren(children) ?? titleProp)
    : titleProp;

  const summaryContent = compositionMode
    ? extractSummaryNodeFromChildren(children)
    : undefined;

  const sections = useMemo((): ParsedWhatsNewSection[] => {
    if (sectionsProp !== undefined) {
      return sectionsProp;
    }
    if (compositionMode && parsedSections.length > 0) {
      return parsedSections;
    }
    return SAMPLE_WHATS_NEW_SECTIONS;
  }, [sectionsProp, compositionMode, parsedSections]);
  const titleId = useId();
  const carouselTitleId = useId();
  const singlePreviewTitleId = useId();
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(true);
  const open = isControlled ? openProp : uncontrolledOpen;

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [singlePreviewOpen, setSinglePreviewOpen] = useState(false);
  const sectionsScrollRef = useRef<HTMLDivElement>(null);
  const dialogPopupRef = useRef<HTMLDivElement>(null);
  const [showBottomScrollFade, setShowBottomScrollFade] = useState(false);
  const [bookmarkOverrides, setBookmarkOverrides] = useState<Record<string, boolean>>({});
  const [internalFilter, setInternalFilter] = useState<WhatsNewFilter>(filter);

  const resolvedFilter = onFilterChange ? filter : internalFilter;
  const carouselOpen = open && activeSectionId !== null;
  const singlePreviewLayerOpen = carouselOpen && singlePreviewOpen;

  useEffect(() => {
    setInternalFilter(filter);
  }, [filter]);

  useEffect(() => {
    if (!open) {
      setActiveSectionId(null);
      setActiveImageIndex(0);
      setSinglePreviewOpen(false);
      setBookmarkOverrides({});
    }
  }, [open]);

  const resolvedSections = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        isBookmarked: bookmarkOverrides[section.id] ?? section.isBookmarked ?? false,
      })),
    [sections, bookmarkOverrides],
  );

  const visibleSections = useMemo(() => {
    if (resolvedFilter === "bookmarked") {
      return resolvedSections.filter((section) => section.isBookmarked);
    }
    return resolvedSections;
  }, [resolvedSections, resolvedFilter]);

  // Overflow shadow sibling above footer — same pattern as IDS Dialog.
  useEffect(() => {
    if (!open) {
      setShowBottomScrollFade(false);
      return;
    }

    const el = sectionsScrollRef.current;
    if (!el) {
      setShowBottomScrollFade(false);
      return;
    }

    const updateContentOverflow = () => {
      const scrollable = el.scrollHeight - el.clientHeight > 1;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setShowBottomScrollFade(scrollable && !atBottom);
    };

    // Defer one frame so Dialog portal + flex heights have settled.
    const raf = requestAnimationFrame(updateContentOverflow);
    el.addEventListener("scroll", updateContentOverflow, { passive: true });

    const resizeObserver = new ResizeObserver(updateContentOverflow);
    resizeObserver.observe(el);
    if (el.firstElementChild instanceof HTMLElement) {
      resizeObserver.observe(el.firstElementChild);
    }

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", updateContentOverflow);
      resizeObserver.disconnect();
    };
  }, [open, visibleSections]);

  const closeSinglePreview = useCallback(() => {
    if (!singlePreviewOpen || !activeSectionId) return;
    const section = resolvedSections.find((s) => s.id === activeSectionId);
    const images = section?.images ?? [];
    const image = images[activeImageIndex];
    setSinglePreviewOpen(false);
    if (image) {
      onSinglePreviewClose?.(activeSectionId, image.id, activeImageIndex);
    }
  }, [
    activeImageIndex,
    activeSectionId,
    onSinglePreviewClose,
    resolvedSections,
    singlePreviewOpen,
  ]);

  const closeCarousel = useCallback(() => {
    if (!activeSectionId) return;
    const sectionId = activeSectionId;
    setSinglePreviewOpen(false);
    setActiveSectionId(null);
    setActiveImageIndex(0);
    onCarouselClose?.(sectionId);
  }, [activeSectionId, onCarouselClose]);

  const toggleBookmark = (sectionId: string) => {
    const section = sections.find((item) => item.id === sectionId);
    const current = bookmarkOverrides[sectionId] ?? section?.isBookmarked ?? false;
    const next = !current;
    setBookmarkOverrides((prev) => ({ ...prev, [sectionId]: next }));
    onSectionBookmarkChange?.(sectionId, next);
  };

  const handleFilterChange = (next: WhatsNewFilter) => {
    if (!onFilterChange) {
      setInternalFilter(next);
    }
    onFilterChange?.(next);
  };

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
    if (!next) onClose?.();
  };

  const activeSection = useMemo(
    () => resolvedSections.find((s) => s.id === activeSectionId) ?? null,
    [resolvedSections, activeSectionId],
  );

  const openCarousel = (sectionId: string, imageId?: string) => {
    const section = resolvedSections.find((s) => s.id === sectionId);
    const images = section?.images ?? [];
    const index = imageId ? Math.max(0, images.findIndex((img) => img.id === imageId)) : 0;
    setSinglePreviewOpen(false);
    setActiveSectionId(sectionId);
    setActiveImageIndex(index < 0 ? 0 : index);
    onThumbnailClick?.(sectionId, imageId);
  };

  const openSinglePreview = (imageId: string, index: number) => {
    if (!activeSectionId) return;
    setSinglePreviewOpen(true);
    onExpandImage?.(activeSectionId, imageId, index);
  };

  const activeCarouselImage = useMemo(() => {
    if (!activeSection) {
      return { id: "placeholder", label: "1. Label" } satisfies WhatsNewSectionImage;
    }
    const images =
      activeSection.images && activeSection.images.length > 0
        ? activeSection.images
        : [{ id: `${activeSection.id}-placeholder`, label: "1. Label" }];
    const safeIndex = Math.min(Math.max(activeImageIndex, 0), images.length - 1);
    return images[safeIndex]!;
  }, [activeSection, activeImageIndex]);

  const navigateCarousel = (index: number) => {
    if (!activeSectionId) return;
    const section = resolvedSections.find((s) => s.id === activeSectionId);
    const imageCount = section?.images?.length ?? 1;
    const max = Math.max(0, imageCount - 1);
    const next = Math.min(Math.max(index, 0), max);
    setActiveImageIndex(next);
    if (singlePreviewOpen) {
      setSinglePreviewOpen(false);
    }
    onCarouselNavigate?.(activeSectionId, next);
  };

  const mainPanel: ReactNode = (
    <div className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <BaseDialog.Close
            className={styles.closeButton}
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <Icon shapeName="shape-x" variant="img" style={{ width: 16, height: 16 }} />
          </BaseDialog.Close>
        </div>
        {(summaryContent ?? descriptionProp) ? (
          <p className={styles.description}>{summaryContent ?? descriptionProp}</p>
        ) : null}
      </header>

      <div className={styles.body}>
        <div className={styles.versionFilterRow}>
          {versionNumber ? <WhatsNewVersion versionNumber={versionNumber} /> : <span />}
          <WhatsNewFilterDropdown
            value={resolvedFilter}
            onChange={handleFilterChange}
            portalContainer={dialogPopupRef}
          />
        </div>
        <div ref={sectionsScrollRef} className={styles.sectionsScroll}>
          <div className={styles.sectionsList} role="list">
            {visibleSections.map((section) => (
              <WhatsNewSectionView
                key={section.id}
                section={section}
                onShowMore={onShowMore}
                onThumbnailClick={openCarousel}
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </div>
        </div>
      </div>

      {showBottomScrollFade ? (
        <div className={styles.contentScrollShadow} aria-hidden="true" />
      ) : null}

      <WhatsNewFooter
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={onDontShowAgainChange}
        onClose={() => setOpen(false)}
      />
    </div>
  );

  const carouselPanel: ReactNode =
    activeSection ? (
      <div className={[styles.root, styles.previewModalRoot].join(" ")}>
        <header className={styles.carouselHeader}>
          <h2 id={carouselTitleId} className={styles.title}>
            {activeSection.title}
          </h2>
          <BaseDialog.Close
            className={styles.closeButton}
            aria-label="Close image preview"
            onClick={closeCarousel}
          >
            <Icon shapeName="shape-x" variant="img" style={{ width: 16, height: 16 }} />
          </BaseDialog.Close>
        </header>

        <div className={styles.carouselBody}>
          <WhatsNewCarousel
            section={activeSection}
            activeIndex={activeImageIndex}
            onNavigate={navigateCarousel}
            onExpandImage={openSinglePreview}
          />
        </div>

        <WhatsNewFooter
          dontShowAgain={dontShowAgain}
          onDontShowAgainChange={onDontShowAgainChange}
          onClose={closeCarousel}
        />
      </div>
    ) : null;

  const singlePreviewPanel: ReactNode =
    activeSection && singlePreviewLayerOpen ? (
      <div className={[styles.root, styles.previewModalRoot].join(" ")}>
        <header className={styles.carouselHeader}>
          <h2 id={singlePreviewTitleId} className={styles.title}>
            {activeSection.title}
          </h2>
          <BaseDialog.Close
            className={styles.closeButton}
            aria-label="Close expanded image preview"
            onClick={closeSinglePreview}
          >
            <Icon shapeName="shape-x" variant="img" style={{ width: 16, height: 16 }} />
          </BaseDialog.Close>
        </header>

        <div className={styles.carouselBody}>
          <WhatsNewSinglePreview image={activeCarouselImage} imageIndex={activeImageIndex} />
        </div>

        <WhatsNewFooter
          dontShowAgain={dontShowAgain}
          onDontShowAgainChange={onDontShowAgainChange}
          onClose={closeSinglePreview}
        />
      </div>
    ) : null;

  return (
    <>
      <BaseDialog.Root open={open} onOpenChange={setOpen}>
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className={styles.backdrop} />
          <BaseDialog.Popup
            ref={dialogPopupRef}
            className={styles.popup}
            aria-labelledby={titleId}
          >
            {mainPanel}
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>

      <BaseDialog.Root
        open={carouselOpen}
        onOpenChange={(next) => {
          if (!next) closeCarousel();
        }}
      >
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className={styles.carouselBackdrop} />
          <BaseDialog.Popup
            className={styles.carouselPopup}
            aria-labelledby={carouselTitleId}
          >
            {carouselPanel}
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>

      <BaseDialog.Root
        open={singlePreviewLayerOpen}
        onOpenChange={(next) => {
          if (!next) closeSinglePreview();
        }}
      >
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className={styles.singlePreviewBackdrop} />
          <BaseDialog.Popup
            className={styles.singlePreviewPopup}
            aria-labelledby={singlePreviewTitleId}
          >
            {singlePreviewPanel}
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </>
  );
}

// --- Compound API (Mode B — canonical). Markers return null; `IdsWhatsNew` walks children. ---

export interface WhatsNewSectionProps {
  id: string;
  isBookmarked?: boolean;
  showMoreLabel?: string;
  children?: ReactNode;
}

export function WhatsNewSection(_props: WhatsNewSectionProps) {
  return null;
}
WhatsNewSection.displayName = WHATS_NEW_SECTION;

export interface WhatsNewThumbnailProps {
  src?: string;
  alt?: string;
  extraCount?: number;
  children?: ReactNode;
}

export function WhatsNewThumbnail(_props: WhatsNewThumbnailProps) {
  return null;
}
WhatsNewThumbnail.displayName = WHATS_NEW_THUMBNAIL;

export function WhatsNewSectionHeader(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewSectionHeader.displayName = WHATS_NEW_SECTION_HEADER;

export function WhatsNewBookmarkButton(_props: Record<string, never>) {
  return null;
}
WhatsNewBookmarkButton.displayName = WHATS_NEW_BOOKMARK_BUTTON;

export function WhatsNewSectionTitle(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewSectionTitle.displayName = WHATS_NEW_SECTION_TITLE;

export function WhatsNewDescription(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewDescription.displayName = WHATS_NEW_DESCRIPTION;

export function WhatsNewLink(_props: { href: string; children?: ReactNode }) {
  return null;
}
WhatsNewLink.displayName = WHATS_NEW_LINK;

export function WhatsNewShowMore(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewShowMore.displayName = WHATS_NEW_SHOW_MORE;

export function WhatsNewImages(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewImages.displayName = WHATS_NEW_IMAGES;

export interface WhatsNewImageProps {
  id: string;
  src?: string;
  alt?: string;
  label?: string;
  children?: ReactNode;
}

export function WhatsNewImage(_props: WhatsNewImageProps) {
  return null;
}
WhatsNewImage.displayName = WHATS_NEW_IMAGE;

export function WhatsNewHeader(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewHeader.displayName = WHATS_NEW_HEADER;

export function WhatsNewTitle(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewTitle.displayName = WHATS_NEW_TITLE;

export function WhatsNewCloseButton(_props: Record<string, never>) {
  return null;
}
WhatsNewCloseButton.displayName = WHATS_NEW_CLOSE_BUTTON;

export function WhatsNewSummary(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewSummary.displayName = WHATS_NEW_SUMMARY;

export function WhatsNewBody(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewBody.displayName = WHATS_NEW_BODY;

export function WhatsNewVersionFilterRow(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewVersionFilterRow.displayName = WHATS_NEW_VERSION_FILTER_ROW;

export function WhatsNewVersionSlot(_props: Record<string, never>) {
  return null;
}
WhatsNewVersionSlot.displayName = WHATS_NEW_VERSION;

export function WhatsNewFilterSlot(_props: Record<string, never>) {
  return null;
}
WhatsNewFilterSlot.displayName = WHATS_NEW_FILTER;

export function WhatsNewSectionsScroll(_props: { children?: ReactNode }) {
  return null;
}
WhatsNewSectionsScroll.displayName = WHATS_NEW_SECTIONS_SCROLL;

export function WhatsNewFooterSlot(_props: Record<string, never>) {
  return null;
}
WhatsNewFooterSlot.displayName = WHATS_NEW_FOOTER;

IdsWhatsNew.Section = WhatsNewSection;
IdsWhatsNew.Thumbnail = WhatsNewThumbnail;
IdsWhatsNew.SectionHeader = WhatsNewSectionHeader;
IdsWhatsNew.BookmarkButton = WhatsNewBookmarkButton;
IdsWhatsNew.SectionTitle = WhatsNewSectionTitle;
IdsWhatsNew.Description = WhatsNewDescription;
IdsWhatsNew.Link = WhatsNewLink;
IdsWhatsNew.ShowMore = WhatsNewShowMore;
IdsWhatsNew.Images = WhatsNewImages;
IdsWhatsNew.Image = WhatsNewImage;
IdsWhatsNew.Header = WhatsNewHeader;
IdsWhatsNew.Title = WhatsNewTitle;
IdsWhatsNew.CloseButton = WhatsNewCloseButton;
IdsWhatsNew.Summary = WhatsNewSummary;
IdsWhatsNew.Body = WhatsNewBody;
IdsWhatsNew.VersionFilterRow = WhatsNewVersionFilterRow;
IdsWhatsNew.Version = WhatsNewVersionSlot;
IdsWhatsNew.Filter = WhatsNewFilterSlot;
IdsWhatsNew.SectionsScroll = WhatsNewSectionsScroll;
IdsWhatsNew.Footer = WhatsNewFooterSlot;

export type { ParsedWhatsNewSection } from "./IdsWhatsNew.compose";
