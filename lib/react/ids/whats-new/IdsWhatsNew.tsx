/**
 * IDS Whats New — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/whats-new`
 * Source: `components/ids/whats-new/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (deterministic child order — root is WhatsNew / IdsWhatsNew, not WhatsNewRoot):
 *   IdsWhatsNew
 *     IdsWhatsNewHeader
 *       IdsWhatsNewTitle
 *       IdsWhatsNewCloseButton
 *     IdsWhatsNewSummary
 *     IdsWhatsNewBody
 *       IdsWhatsNewVersionFilterRow
 *         IdsWhatsNewVersion?
 *         IdsWhatsNewFilter
 *       IdsWhatsNewSectionsScroll
 *         IdsWhatsNewSection[]
 *           IdsWhatsNewThumbnail
 *           IdsWhatsNewSectionHeader
 *             IdsWhatsNewBookmarkButton
 *             IdsWhatsNewSectionTitle
 *           IdsWhatsNewDescription
 *             IdsWhatsNewLink?
 *           IdsWhatsNewShowMore?
 *           IdsWhatsNewImages
 *             IdsWhatsNewImage[]
 *     IdsWhatsNewFooter
 *
 * Internal stack (not host-mounted): WhatsNewCarouselModal, WhatsNewSinglePreviewModal.
 * Prop-driven `sections[]` emits this tree. Compound `children` fill the same slots.
 * Selectors: `data-ids="IdsWhatsNew"` / class `IdsWhatsNew` (Ids camelCase — not kebab or Base UI `data-slot`).
 * No @base-ui-components dependency.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { IdsButton, IdsButtonLabel } from "../button";
import { IdsDropdownSingleSelect } from "../dropdown-single-select";
import { IdsIcon } from "../icon";
import { IdsModal, IdsModalContent } from "../modal";
import { IdsToggleSwitch } from "../toggle-switch";
import {
  collectMainSlots,
  findSlotElement,
  flattenText,
  hasWhatsNewAnatomyChildren,
  markWhatsNewSlot,
  parseSectionFromProps,
  parseWhatsNewSections,
  sectionExtraImageCount,
  type ParsedWhatsNewImage,
  type ParsedWhatsNewSection,
} from "./IdsWhatsNew.compose";
import styles from "./IdsWhatsNew.module.css";

const TILE_ICON_SIZE = 32;

const s = {
  surface: styles["IdsWhatsNewSurface"],
  modalContent: styles["IdsWhatsNewModalContent"],
  root: styles["IdsWhatsNew"],
  preview: styles["IdsWhatsNew--preview"],
  header: styles["IdsWhatsNewHeader"],
  headerRow: styles["IdsWhatsNewHeaderRow"],
  carouselHeader: styles["IdsWhatsNewCarouselHeader"],
  carouselBody: styles["IdsWhatsNewCarouselBody"],
  title: styles["IdsWhatsNewTitle"],
  close: styles["IdsWhatsNewCloseButton"],
  summary: styles["IdsWhatsNewSummary"],
  version: styles["IdsWhatsNewVersion"],
  body: styles["IdsWhatsNewBody"],
  versionFilterRow: styles["IdsWhatsNewVersionFilterRow"],
  sectionsScroll: styles["IdsWhatsNewSectionsScroll"],
  scrollShadow: styles["IdsWhatsNewScrollShadow"],
  filter: styles["IdsWhatsNewFilter"],
  bookmark: styles["IdsWhatsNewBookmarkButton"],
  sectionsList: styles["IdsWhatsNewSectionsList"],
  section: styles["IdsWhatsNewSection"],
  thumbnail: styles["IdsWhatsNewThumbnail"],
  stripThumbnail: styles["IdsWhatsNewStripThumbnail"],
  thumbnailSelected: styles["IdsWhatsNewThumbnail--selected"],
  thumbnailNoHover: styles["IdsWhatsNewThumbnail--no-hover"],
  thumbnailContent: styles["IdsWhatsNewThumbnailContent"],
  thumbnailHover: styles["IdsWhatsNewThumbnailHover"],
  thumbnailBadge: styles["IdsWhatsNewThumbnailBadge"],
  stripViewport: styles["IdsWhatsNewThumbnailStripViewport"],
  strip: styles["IdsWhatsNewThumbnailStrip"],
  stripFade: styles["IdsWhatsNewStripTrailingOverlay"],
  swap: styles["IdsWhatsNewSwap"],
  swapHero: styles["IdsWhatsNewSwap--hero"],
  swapTitle: styles["IdsWhatsNewSwapTitle"],
  swapLink: styles["IdsWhatsNewSwapLink"],
  swapHelper: styles["IdsWhatsNewSwapHelper"],
  image: styles["IdsWhatsNewImage"],
  sectionText: styles["IdsWhatsNewSectionText"],
  sectionHeader: styles["IdsWhatsNewSectionHeader"],
  sectionTitle: styles["IdsWhatsNewSectionTitle"],
  description: styles["IdsWhatsNewDescription"],
  descriptionCollapsed: styles["IdsWhatsNewDescription--collapsed"],
  link: styles["IdsWhatsNewLink"],
  showMore: styles["IdsWhatsNewShowMore"],
  carouselContent: styles["IdsWhatsNewCarouselContent"],
  singleInner: styles["IdsWhatsNewSinglePreviewInner"],
  carouselInner: styles["IdsWhatsNewCarouselInner"],
  carouselNav: styles["IdsWhatsNewCarouselNav"],
  carouselMain: styles["IdsWhatsNewCarouselMain"],
  hero: styles["IdsWhatsNewHero"],
  captionRow: styles["IdsWhatsNewCaptionRow"],
  caption: styles["IdsWhatsNewCaption"],
  expand: styles["IdsWhatsNewExpand"],
  footer: styles["IdsWhatsNewFooter"],
  footerToggle: styles["IdsWhatsNewFooterToggle"],
  footerToggleLabel: styles["IdsWhatsNewFooterToggleLabel"],
  footerActions: styles["IdsWhatsNewFooterActions"],
  images: styles["IdsWhatsNewImages"],
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export type WhatsNewFilter = "newest" | "bookmarked";
export type IdsWhatsNewLayer = "main" | "carousel" | "single-preview";

export interface IdsWhatsNewSectionImage {
  id: string;
  src?: string;
  alt?: string;
  label?: string;
}

export interface IdsWhatsNewSectionInput {
  id: string;
  title: string;
  description: string;
  isBookmarked?: boolean;
  images?: IdsWhatsNewSectionImage[];
  showMoreLabel?: string;
  linkText?: string;
  linkHref?: string;
}

export interface IdsWhatsNewProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  versionNumber?: string;
  filter?: WhatsNewFilter;
  onFilterChange?: (filter: WhatsNewFilter) => void;
  sections?: IdsWhatsNewSectionInput[];
  children?: ReactNode;
  dontShowAgain?: boolean;
  onDontShowAgainChange?: (value: boolean) => void;
  onClose?: () => void;
  onShowMore?: (sectionId: string, expanded: boolean) => void;
  onSectionBookmarkChange?: (sectionId: string, isBookmarked: boolean) => void;
  onThumbnailClick?: (sectionId: string, imageId?: string) => void;
  onCarouselNavigate?: (sectionId: string, index: number) => void;
  onExpandImage?: (sectionId: string, imageId: string, index: number) => void;
  onCarouselClose?: (sectionId: string) => void;
  onSinglePreviewClose?: (sectionId: string, imageId: string, index: number) => void;
  className?: string;
}

const DEFAULT_TITLE = "What's New";
const DEFAULT_DESCRIPTION =
  "The following updates (features, bug fixes) have recently been made.";
const BOOKMARKED_DESCRIPTION =
  "The following updates (features, bug fixes) were bookmarked and may be from recent or previous releases/versions.";
const FOOTER_TOGGLE_LABEL = "Don't show again until the next update";

const FILTER_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "bookmarked", label: "Bookmarked" },
];

function resolveFilter(value: unknown): WhatsNewFilter {
  return value === "bookmarked" ? "bookmarked" : "newest";
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsWhatsNewContextValue {
  title: string;
  description: string;
  versionNumber?: string;
  filter: WhatsNewFilter;
  setFilter: (filter: WhatsNewFilter) => void;
  dontShowAgain: boolean;
  setDontShowAgain: (value: boolean) => void;
  titleId: string;
  closeCurrentLayer: () => void;
  openCarousel: (sectionId: string, imageId?: string) => void;
  toggleBookmark: (sectionId: string) => void;
  bookmarkOverrides: Record<string, boolean>;
  onShowMore?: (sectionId: string, expanded: boolean) => void;
}

interface IdsWhatsNewSectionContextValue {
  id: string;
  title: string;
  isBookmarked: boolean;
  images: ParsedWhatsNewImage[];
  extraImageCount: number;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  thumbnailMedia?: ReactNode;
  showMoreLabel?: string;
}

const IdsWhatsNewContext = createContext<IdsWhatsNewContextValue | null>(null);
const IdsWhatsNewSectionContext = createContext<IdsWhatsNewSectionContextValue | null>(
  null,
);
const IdsWhatsNewLayerContext = createContext<IdsWhatsNewLayer>("main");

function useWhatsNew(slot: string): IdsWhatsNewContextValue {
  const ctx = useContext(IdsWhatsNewContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within WhatsNew.`);
  }
  return ctx;
}

function useWhatsNewSection(slot: string): IdsWhatsNewSectionContextValue {
  const ctx = useContext(IdsWhatsNewSectionContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within WhatsNew.Section.`);
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Media                                                                      */
/* -------------------------------------------------------------------------- */

function ImageSwapContent({ variant = "thumbnail" }: { variant?: "thumbnail" | "hero" }) {
  const photos = (
    <IdsIcon shape="photos" variant="img" size={TILE_ICON_SIZE} />
  );
  if (variant === "hero") {
    return (
      <div className={s.swapHero}>
        {photos}
        <p className={s.swapTitle}>Swap image</p>
        <p className={s.swapHelper}>
          Replace the image by swapping this component with{" "}
          <strong>your local image component</strong>. Use auto layout in your local
          component so that it fits the container.
        </p>
        <span className={s.swapLink}>Learn how to swap component</span>
      </div>
    );
  }
  return (
    <div className={s.swap}>
      {photos}
      <p className={s.swapTitle}>Swap image</p>
      <span className={s.swapLink}>Learn to swap</span>
    </div>
  );
}

function SectionImageMedia({
  image,
  variant = "thumbnail",
  mediaOverride,
}: {
  image?: ParsedWhatsNewImage | IdsWhatsNewSectionImage;
  variant?: "thumbnail" | "hero";
  mediaOverride?: ReactNode;
}) {
  const [broken, setBroken] = useState(false);
  if (mediaOverride) return <>{mediaOverride}</>;
  if (!image?.src || broken) {
    return <ImageSwapContent variant={variant} />;
  }
  return (
    <img
      className={s.image}
      src={image.src}
      alt={image.alt ?? ""}
      onError={() => setBroken(true)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Header / Title / Close                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsWhatsNewTitleProps {
  children?: ReactNode;
  className?: string;
  id?: string;
}

export function IdsWhatsNewTitle({ children, className, id }: IdsWhatsNewTitleProps) {
  const ctx = useWhatsNew("WhatsNew.Title");
  return (
    <h2 id={id ?? ctx.titleId} className={cx(s.title, className)} data-ids="IdsWhatsNewTitle">
      {children ?? ctx.title}
    </h2>
  );
}
IdsWhatsNewTitle.displayName = "IdsWhatsNewTitle";
markWhatsNewSlot(IdsWhatsNewTitle, "title");

export interface IdsWhatsNewCloseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function IdsWhatsNewCloseButton({
  children,
  className,
  onClick,
  ...rest
}: IdsWhatsNewCloseButtonProps) {
  const ctx = useWhatsNew("WhatsNew.CloseButton");
  const layer = useContext(IdsWhatsNewLayerContext);
  const label =
    layer === "carousel"
      ? "Close image preview"
      : layer === "single-preview"
        ? "Close expanded image preview"
        : "Close";

  return (
    <button
      type="button"
      className={cx(s.close, className)}
      data-ids="IdsWhatsNewCloseButton"
      aria-label={rest["aria-label"] ?? label}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.closeCurrentLayer();
      }}
      {...rest}
    >
      {children ?? <IdsIcon shape="shape-x" variant="img" size={16} />}
    </button>
  );
}
IdsWhatsNewCloseButton.displayName = "IdsWhatsNewCloseButton";
markWhatsNewSlot(IdsWhatsNewCloseButton, "close");

export interface IdsWhatsNewHeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsWhatsNewHeader({ children, className, ...rest }: IdsWhatsNewHeaderProps) {
  useWhatsNew("WhatsNew.Header");
  const title = findSlotElement(children, "title") ?? <IdsWhatsNewTitle />;
  const close = findSlotElement(children, "close") ?? <IdsWhatsNewCloseButton />;
  return (
    <header
      className={cx(s.header, className)}
      data-ids="IdsWhatsNewHeader"
      {...rest}
    >
      <div className={s.headerRow}>
        {title}
        {close}
      </div>
    </header>
  );
}
IdsWhatsNewHeader.displayName = "IdsWhatsNewHeader";
markWhatsNewSlot(IdsWhatsNewHeader, "header");

export interface IdsWhatsNewSummaryProps {
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewSummary({ children, className }: IdsWhatsNewSummaryProps) {
  const ctx = useWhatsNew("WhatsNew.Summary");
  const content = children ?? ctx.description;
  if (!content) return null;
  return (
    <p className={cx(s.summary, className)} data-ids="IdsWhatsNewSummary">
      {content}
    </p>
  );
}
IdsWhatsNewSummary.displayName = "IdsWhatsNewSummary";
markWhatsNewSlot(IdsWhatsNewSummary, "summary");

/* -------------------------------------------------------------------------- */
/* Body / version / filter / scroll                                           */
/* -------------------------------------------------------------------------- */

export interface IdsWhatsNewVersionProps {
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewVersion({ children, className }: IdsWhatsNewVersionProps) {
  const ctx = useWhatsNew("WhatsNew.Version");
  const value = children ?? ctx.versionNumber;
  if (!value) return <span />;
  const text = flattenText(value);
  const display = text.startsWith("Version:") ? text : `Version: ${text}`;
  return (
    <p className={cx(s.version, className)} data-ids="IdsWhatsNewVersion">
      {display}
    </p>
  );
}
IdsWhatsNewVersion.displayName = "IdsWhatsNewVersion";
markWhatsNewSlot(IdsWhatsNewVersion, "version");

export interface IdsWhatsNewFilterProps {
  className?: string;
}

export function IdsWhatsNewFilter({ className }: IdsWhatsNewFilterProps) {
  const ctx = useWhatsNew("WhatsNew.Filter");
  return (
    <div className={cx(s.filter, className)} data-ids="IdsWhatsNewFilter">
      <IdsDropdownSingleSelect
        size="small"
        value={ctx.filter}
        onChange={(id) => ctx.setFilter(resolveFilter(id))}
        options={FILTER_OPTIONS}
      />
    </div>
  );
}
IdsWhatsNewFilter.displayName = "IdsWhatsNewFilter";
markWhatsNewSlot(IdsWhatsNewFilter, "filter");

export interface IdsWhatsNewVersionFilterRowProps {
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewVersionFilterRow({
  children,
  className,
}: IdsWhatsNewVersionFilterRowProps) {
  useWhatsNew("WhatsNew.VersionFilterRow");
  const version = findSlotElement(children, "version") ?? <IdsWhatsNewVersion />;
  const filter = findSlotElement(children, "filter") ?? <IdsWhatsNewFilter />;
  return (
    <div
      className={cx(s.versionFilterRow, className)}
      data-ids="IdsWhatsNewVersionFilterRow"
    >
      {version}
      {filter}
    </div>
  );
}
IdsWhatsNewVersionFilterRow.displayName = "IdsWhatsNewVersionFilterRow";
markWhatsNewSlot(IdsWhatsNewVersionFilterRow, "version-filter-row");

export interface IdsWhatsNewSectionsScrollProps {
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewSectionsScroll({
  children,
  className,
}: IdsWhatsNewSectionsScrollProps) {
  useWhatsNew("WhatsNew.SectionsScroll");
  return (
    <div
      className={cx(s.sectionsScroll, className)}
      data-ids="IdsWhatsNewSectionsScroll"
      data-whats-new-scroll="true"
    >
      <div className={s.sectionsList} role="list">
        {children}
      </div>
    </div>
  );
}
IdsWhatsNewSectionsScroll.displayName = "IdsWhatsNewSectionsScroll";
markWhatsNewSlot(IdsWhatsNewSectionsScroll, "sections-scroll");

export interface IdsWhatsNewBodyProps {
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewBody({ children, className }: IdsWhatsNewBodyProps) {
  useWhatsNew("WhatsNew.Body");
  const row =
    findSlotElement(children, "version-filter-row") ?? <IdsWhatsNewVersionFilterRow />;
  const scroll = findSlotElement(children, "sections-scroll");
  return (
    <div className={cx(s.body, className)} data-ids="IdsWhatsNewBody">
      {row}
      {scroll ?? (
        <IdsWhatsNewSectionsScroll>
          {children}
        </IdsWhatsNewSectionsScroll>
      )}
    </div>
  );
}
IdsWhatsNewBody.displayName = "IdsWhatsNewBody";
markWhatsNewSlot(IdsWhatsNewBody, "body");

/* -------------------------------------------------------------------------- */
/* Section slots                                                              */
/* -------------------------------------------------------------------------- */

export interface IdsWhatsNewThumbnailProps {
  src?: string;
  alt?: string;
  extraCount?: number;
  compact?: boolean;
  selected?: boolean;
  showHoverOverlay?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  buttonRef?: (node: HTMLButtonElement | null) => void;
}

export function IdsWhatsNewThumbnail({
  src,
  alt,
  extraCount,
  compact = false,
  selected = false,
  showHoverOverlay = true,
  onClick,
  children,
  className,
  buttonRef,
}: IdsWhatsNewThumbnailProps) {
  const root = useWhatsNew("WhatsNew.Thumbnail");
  const section = useContext(IdsWhatsNewSectionContext);
  const image: ParsedWhatsNewImage | undefined = src
    ? { id: "thumb", src, alt }
    : section?.images[0];
  const count = extraCount ?? section?.extraImageCount ?? 0;
  const media = children ?? section?.thumbnailMedia;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cx(
        compact ? s.stripThumbnail : s.thumbnail,
        selected && s.thumbnailSelected,
        !showHoverOverlay && s.thumbnailNoHover,
        className,
      )}
      data-ids={compact ? "IdsWhatsNewStripThumbnail" : "IdsWhatsNewThumbnail"}
      aria-label={alt ?? image?.alt ?? "Open image preview"}
      aria-current={selected ? "true" : undefined}
      onClick={() => {
        onClick?.();
        if (section && !compact) {
          root.openCarousel(section.id, image?.id);
        }
      }}
    >
      <span className={s.thumbnailContent}>
        <SectionImageMedia image={image} mediaOverride={media} />
      </span>
      {showHoverOverlay ? (
        <span className={s.thumbnailHover} aria-hidden="true">
          <IdsIcon shape="popout-window-arrow" variant="inline" size={TILE_ICON_SIZE} />
        </span>
      ) : null}
      {count > 0 ? <span className={s.thumbnailBadge}>+{count}</span> : null}
    </button>
  );
}
IdsWhatsNewThumbnail.displayName = "IdsWhatsNewThumbnail";
markWhatsNewSlot(IdsWhatsNewThumbnail, "thumbnail");

export interface IdsWhatsNewBookmarkButtonProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  className?: string;
}

export function IdsWhatsNewBookmarkButton({
  pressed,
  onPressedChange,
  className,
}: IdsWhatsNewBookmarkButtonProps) {
  const root = useWhatsNew("WhatsNew.BookmarkButton");
  const section = useWhatsNewSection("WhatsNew.BookmarkButton");
  const isBookmarked = pressed ?? section.isBookmarked;
  return (
    <button
      type="button"
      className={cx(s.bookmark, className)}
      data-ids="IdsWhatsNewBookmarkButton"
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      aria-pressed={isBookmarked}
      onClick={() => {
        onPressedChange?.(!isBookmarked);
        root.toggleBookmark(section.id);
      }}
    >
      <IdsIcon
        shape={isBookmarked ? "star-fav-solid" : "star-fav"}
        variant="img"
        size={16}
      />
    </button>
  );
}
IdsWhatsNewBookmarkButton.displayName = "IdsWhatsNewBookmarkButton";
markWhatsNewSlot(IdsWhatsNewBookmarkButton, "bookmark");

export interface IdsWhatsNewSectionTitleProps {
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewSectionTitle({
  children,
  className,
}: IdsWhatsNewSectionTitleProps) {
  const section = useWhatsNewSection("WhatsNew.SectionTitle");
  return (
    <h3
      className={cx(s.sectionTitle, className)}
      data-ids="IdsWhatsNewSectionTitle"
    >
      {children ?? section.title}
    </h3>
  );
}
IdsWhatsNewSectionTitle.displayName = "IdsWhatsNewSectionTitle";
markWhatsNewSlot(IdsWhatsNewSectionTitle, "section-title");

export interface IdsWhatsNewSectionHeaderProps {
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewSectionHeader({
  children,
  className,
}: IdsWhatsNewSectionHeaderProps) {
  useWhatsNewSection("WhatsNew.SectionHeader");
  const bookmark = findSlotElement(children, "bookmark") ?? <IdsWhatsNewBookmarkButton />;
  const title = findSlotElement(children, "section-title") ?? <IdsWhatsNewSectionTitle />;
  return (
    <div
      className={cx(s.sectionHeader, className)}
      data-ids="IdsWhatsNewSectionHeader"
    >
      {bookmark}
      {title}
    </div>
  );
}
IdsWhatsNewSectionHeader.displayName = "IdsWhatsNewSectionHeader";
markWhatsNewSlot(IdsWhatsNewSectionHeader, "section-header");

export interface IdsWhatsNewLinkProps {
  href: string;
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewLink({ href, children, className }: IdsWhatsNewLinkProps) {
  const external = /^https?:/i.test(href);
  return (
    <a
      className={cx(s.link, className)}
      data-ids="IdsWhatsNewLink"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
    >
      {children}
    </a>
  );
}
IdsWhatsNewLink.displayName = "IdsWhatsNewLink";
markWhatsNewSlot(IdsWhatsNewLink, "link");

export interface IdsWhatsNewShowMoreProps {
  children?: ReactNode;
  expanded?: boolean;
  onClick?: () => void;
  className?: string;
}

export function IdsWhatsNewShowMore({
  children,
  expanded,
  onClick,
  className,
}: IdsWhatsNewShowMoreProps) {
  return (
    <button
      type="button"
      className={cx(s.showMore, className)}
      data-ids="IdsWhatsNewShowMore"
      aria-expanded={expanded}
      onClick={onClick}
    >
      {children ?? (expanded ? "Show Less" : "Show More")}
    </button>
  );
}
IdsWhatsNewShowMore.displayName = "IdsWhatsNewShowMore";
markWhatsNewSlot(IdsWhatsNewShowMore, "show-more");

export interface IdsWhatsNewDescriptionProps {
  children?: ReactNode;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
}

export function IdsWhatsNewDescription({
  children,
  defaultExpanded = false,
  onExpandedChange,
  className,
}: IdsWhatsNewDescriptionProps) {
  const root = useWhatsNew("WhatsNew.Description");
  const section = useContext(IdsWhatsNewSectionContext);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const measure = useCallback(() => {
    const el = descriptionRef.current;
    if (!el || expanded) return;
    setIsTruncated(el.scrollHeight > el.clientHeight + 1);
  }, [expanded]);

  useLayoutEffect(() => {
    measure();
  }, [measure, children]);

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el || expanded) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [expanded, measure]);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    onExpandedChange?.(next);
    if (section) root.onShowMore?.(section.id, next);
  };

  const showToggle = expanded || isTruncated;
  const hostShowMore = findSlotElement(children, "show-more");

  return (
    <>
      <div
        ref={descriptionRef}
        className={cx(s.description, !expanded && s.descriptionCollapsed, className)}
        data-ids="IdsWhatsNewDescription"
      >
        {children}
      </div>
      {showToggle
        ? (hostShowMore ?? (
            <IdsWhatsNewShowMore expanded={expanded} onClick={toggle}>
              {expanded ? "Show Less" : (section?.showMoreLabel ?? "Show More")}
            </IdsWhatsNewShowMore>
          ))
        : null}
    </>
  );
}
IdsWhatsNewDescription.displayName = "IdsWhatsNewDescription";
markWhatsNewSlot(IdsWhatsNewDescription, "description");

export interface IdsWhatsNewImageProps {
  id: string;
  src?: string;
  alt?: string;
  label?: string;
  children?: ReactNode;
}

export function IdsWhatsNewImage(_props: IdsWhatsNewImageProps) {
  return null;
}
IdsWhatsNewImage.displayName = "IdsWhatsNewImage";
markWhatsNewSlot(IdsWhatsNewImage, "image");

export interface IdsWhatsNewImagesProps {
  children?: ReactNode;
}

export function IdsWhatsNewImages({ children }: IdsWhatsNewImagesProps) {
  return (
    <div className={s.images} hidden data-ids="IdsWhatsNewImages">
      {children}
    </div>
  );
}
IdsWhatsNewImages.displayName = "IdsWhatsNewImages";
markWhatsNewSlot(IdsWhatsNewImages, "images");

export interface IdsWhatsNewSectionProps {
  id: string;
  isBookmarked?: boolean;
  showMoreLabel?: string;
  onBookmarkChange?: (bookmarked: boolean) => void;
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewSection({
  id,
  isBookmarked,
  showMoreLabel,
  children,
  className,
}: IdsWhatsNewSectionProps) {
  const root = useWhatsNew("WhatsNew.Section");
  const parsed = parseSectionFromProps({
    id,
    isBookmarked,
    showMoreLabel,
    children,
  });

  const title = parsed?.title ?? "Section Header";
  const images = parsed?.images ?? [];
  const extra = sectionExtraImageCount({
    extraImageCount: parsed?.extraImageCount,
    images,
  });
  const bookmarked =
    root.bookmarkOverrides[id] ?? parsed?.isBookmarked ?? isBookmarked ?? false;

  const sectionCtx: IdsWhatsNewSectionContextValue = {
    id,
    title,
    isBookmarked: bookmarked,
    images,
    extraImageCount: extra,
    thumbnailSrc: parsed?.thumbnailSrc,
    thumbnailAlt: parsed?.thumbnailAlt,
    thumbnailMedia: parsed?.thumbnailMedia,
    showMoreLabel: showMoreLabel ?? parsed?.showMoreLabel,
  };

  const thumbnail = findSlotElement(children, "thumbnail") ?? (
    <IdsWhatsNewThumbnail extraCount={extra > 0 ? extra : undefined} />
  );
  const header = findSlotElement(children, "section-header") ?? (
    <IdsWhatsNewSectionHeader>
      <IdsWhatsNewBookmarkButton />
      <IdsWhatsNewSectionTitle>{title}</IdsWhatsNewSectionTitle>
    </IdsWhatsNewSectionHeader>
  );
  const description = findSlotElement(children, "description");
  const imagesSlot = findSlotElement(children, "images");

  return (
    <IdsWhatsNewSectionContext.Provider value={sectionCtx}>
      <article
        className={cx(s.section, className)}
        data-ids="IdsWhatsNewSection"
        role="listitem"
      >
        {thumbnail}
        <div className={s.sectionText}>
          {header}
          {description}
        </div>
        {imagesSlot}
      </article>
    </IdsWhatsNewSectionContext.Provider>
  );
}
IdsWhatsNewSection.displayName = "IdsWhatsNewSection";
markWhatsNewSlot(IdsWhatsNewSection, "section");

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsWhatsNewFooterProps {
  children?: ReactNode;
  className?: string;
}

export function IdsWhatsNewFooter({ children, className }: IdsWhatsNewFooterProps) {
  const ctx = useWhatsNew("WhatsNew.Footer");
  if (children) {
    return (
      <footer className={cx(s.footer, className)} data-ids="IdsWhatsNewFooter">
        {children}
      </footer>
    );
  }
  return (
    <footer className={cx(s.footer, className)} data-ids="IdsWhatsNewFooter">
      <div className={s.footerToggle}>
        <IdsToggleSwitch
          checked={ctx.dontShowAgain}
          onCheckedChange={ctx.setDontShowAgain}
          aria-label={FOOTER_TOGGLE_LABEL}
        />
        <span className={s.footerToggleLabel}>{FOOTER_TOGGLE_LABEL}</span>
      </div>
      <div className={s.footerActions}>
        <IdsButton variant="primary" onClick={() => ctx.closeCurrentLayer()}>
          <IdsButtonLabel>Close</IdsButtonLabel>
        </IdsButton>
      </div>
    </footer>
  );
}
IdsWhatsNewFooter.displayName = "IdsWhatsNewFooter";
markWhatsNewSlot(IdsWhatsNewFooter, "footer");

/* -------------------------------------------------------------------------- */
/* Internal carousel / single preview                                         */
/* -------------------------------------------------------------------------- */

function WhatsNewCarouselBody({
  section,
  activeIndex,
  onNavigate,
  onExpand,
}: {
  section: ParsedWhatsNewSection;
  activeIndex: number;
  onNavigate: (index: number) => void;
  onExpand: (imageId: string, index: number) => void;
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
  const [showStripFade, setShowStripFade] = useState(false);

  const updateFade = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) {
      setShowStripFade(false);
      return;
    }
    const hasOverflow = strip.scrollWidth > strip.clientWidth + 1;
    const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
    setShowStripFade(hasOverflow && !atEnd);
  }, []);

  useLayoutEffect(() => {
    updateFade();
  }, [images.length, updateFade]);

  useEffect(() => {
    thumbButtonRefs.current[safeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  }, [safeIndex]);

  useEffect(() => {
    const timer = window.setTimeout(updateFade, 320);
    return () => window.clearTimeout(timer);
  }, [safeIndex, updateFade]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !multiple) return;
    strip.addEventListener("scroll", updateFade, { passive: true });
    const ro = new ResizeObserver(updateFade);
    ro.observe(strip);
    return () => {
      strip.removeEventListener("scroll", updateFade);
      ro.disconnect();
    };
  }, [multiple, updateFade]);

  return (
    <div className={s.carouselContent} data-node-id="27437:44198">
      <div className={s.carouselInner}>
        {multiple ? (
          <button
            type="button"
            className={s.carouselNav}
            aria-label="Previous image"
            disabled={!canPrev}
            onClick={() => onNavigate(safeIndex - 1)}
          >
            <IdsIcon
              shape="chev-left"
              variant="mask"
              size={16}
              color="currentColor"
            />
          </button>
        ) : null}

        <div className={s.carouselMain}>
          {multiple ? (
            <div className={s.stripViewport}>
              <div ref={stripRef} className={s.strip}>
                {images.map((image, index) => (
                  <IdsWhatsNewThumbnail
                    key={image.id}
                    compact
                    selected={index === safeIndex}
                    showHoverOverlay={false}
                    src={image.src}
                    alt={image.alt}
                    extraCount={0}
                    onClick={() => onNavigate(index)}
                    buttonRef={(node) => {
                      thumbButtonRefs.current[index] = node;
                    }}
                  >
                    {image.media}
                  </IdsWhatsNewThumbnail>
                ))}
              </div>
              {showStripFade ? (
                <div className={s.stripFade} aria-hidden="true" />
              ) : null}
            </div>
          ) : null}

          <div className={s.hero} key={active.id} data-ids="IdsWhatsNewHero">
            <SectionImageMedia
              image={active}
              variant="hero"
              mediaOverride={active.media}
            />
          </div>

          <div className={s.captionRow} data-ids="IdsWhatsNewCaptionRow">
            <ol className={s.caption} start={safeIndex + 1}>
              <li>{caption}</li>
            </ol>
            <button
              type="button"
              className={s.expand}
              aria-label="Expand image"
              onClick={() => onExpand(active.id, safeIndex)}
            >
              <IdsIcon shape="popout-double" variant="inline" size={TILE_ICON_SIZE} />
            </button>
          </div>
        </div>

        {multiple ? (
          <button
            type="button"
            className={s.carouselNav}
            aria-label="Next image"
            disabled={!canNext}
            onClick={() => onNavigate(safeIndex + 1)}
          >
            <IdsIcon
              shape="chev-right"
              variant="mask"
              size={16}
              color="currentColor"
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function WhatsNewSinglePreviewBody({
  image,
  imageIndex,
}: {
  image: ParsedWhatsNewImage;
  imageIndex: number;
}) {
  const caption = image.label?.replace(/^\d+\.\s*/, "") || "Label";
  return (
    <div className={s.carouselContent} data-node-id="27437:44163">
      <div className={s.singleInner}>
        <div className={s.carouselMain}>
          <div className={s.hero}>
            <SectionImageMedia image={image} variant="hero" mediaOverride={image.media} />
          </div>
          <div className={s.captionRow}>
            <ol className={s.caption} start={imageIndex + 1}>
              <li>{caption}</li>
            </ol>
            <div className={s.expand} aria-hidden="true">
              <IdsIcon shape="popout-double" variant="inline" size={TILE_ICON_SIZE} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function dataSectionToParsed(section: IdsWhatsNewSectionInput): ParsedWhatsNewSection {
  const images = section.images ?? [];
  return {
    id: section.id,
    title: section.title,
    description: section.description,
    isBookmarked: section.isBookmarked,
    showMoreLabel: section.showMoreLabel,
    linkText: section.linkText,
    linkHref: section.linkHref,
    images,
    extraImageCount: images.length > 1 ? images.length - 1 : undefined,
    thumbnailSrc: images[0]?.src,
    thumbnailAlt: images[0]?.alt,
  };
}

function SynthesizedSection({ section }: { section: ParsedWhatsNewSection }) {
  const extra = sectionExtraImageCount(section);
  return (
    <IdsWhatsNewSection
      id={section.id}
      isBookmarked={section.isBookmarked}
      showMoreLabel={section.showMoreLabel}
    >
      <IdsWhatsNewThumbnail
        src={section.thumbnailSrc ?? section.images[0]?.src}
        alt={section.thumbnailAlt ?? section.images[0]?.alt}
        extraCount={extra > 0 ? extra : undefined}
      >
        {section.thumbnailMedia}
      </IdsWhatsNewThumbnail>
      <IdsWhatsNewSectionHeader>
        <IdsWhatsNewBookmarkButton />
        <IdsWhatsNewSectionTitle>{section.title}</IdsWhatsNewSectionTitle>
      </IdsWhatsNewSectionHeader>
      <IdsWhatsNewDescription>
        {section.descriptionNode ?? (
          <>
            {section.description}
            {section.linkText ? (
              <>
                {" "}
                <IdsWhatsNewLink href={section.linkHref ?? "#"}>
                  {section.linkText}
                </IdsWhatsNewLink>
              </>
            ) : null}
          </>
        )}
      </IdsWhatsNewDescription>
      <IdsWhatsNewImages>
        {section.images.map((image) => (
          <IdsWhatsNewImage
            key={image.id}
            id={image.id}
            src={image.src}
            alt={image.alt}
            label={image.label}
          >
            {image.media}
          </IdsWhatsNewImage>
        ))}
      </IdsWhatsNewImages>
    </IdsWhatsNewSection>
  );
}

/* -------------------------------------------------------------------------- */
/* Root — WhatsNew (not WhatsNewRoot)                                         */
/* -------------------------------------------------------------------------- */

export function IdsWhatsNew({
  open: openProp,
  onOpenChange,
  title: titleProp = DEFAULT_TITLE,
  description: descriptionProp,
  versionNumber,
  filter: filterProp = "newest",
  onFilterChange,
  sections: sectionsProp,
  children,
  dontShowAgain: dontShowAgainProp,
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
}: IdsWhatsNewProps) {
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const carouselTitleId = `${reactId}-carousel-title`;
  const singleTitleId = `${reactId}-single-title`;

  const anatomy = hasWhatsNewAnatomyChildren(children);
  const slots = useMemo(() => collectMainSlots(children), [children]);

  useEffect(() => {
    if (anatomy && sectionsProp !== undefined) {
      console.warn(
        "[WhatsNew] `sections` prop takes precedence over WhatsNew.Section child composition.",
      );
    }
  }, [anatomy, sectionsProp]);

  const parsedFromChildren = useMemo(
    () => (anatomy ? parseWhatsNewSections(children) : []),
    [anatomy, children],
  );

  const titleFromChildren = slots.title
    ? flattenText((slots.title.props as { children?: ReactNode }).children).trim()
    : undefined;
  const title = titleFromChildren || titleProp;

  const summaryFromChildren = slots.summary
    ? (slots.summary.props as { children?: ReactNode }).children
    : undefined;

  const sourceSections: ParsedWhatsNewSection[] = useMemo(() => {
    if (sectionsProp !== undefined) {
      return sectionsProp.map(dataSectionToParsed);
    }
    return parsedFromChildren;
  }, [sectionsProp, parsedFromChildren]);

  const isOpenControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(true);
  const open = isOpenControlled ? Boolean(openProp) : uncontrolledOpen;

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [singlePreviewOpen, setSinglePreviewOpen] = useState(false);
  const [bookmarkOverrides, setBookmarkOverrides] = useState<Record<string, boolean>>(
    {},
  );
  const [internalFilter, setInternalFilter] = useState<WhatsNewFilter>(
    resolveFilter(filterProp),
  );
  const filterHostOwned = onFilterChange != null;
  const resolvedFilter = resolveFilter(filterHostOwned ? filterProp : internalFilter);

  const isDontShowControlled = dontShowAgainProp !== undefined;
  const [uncontrolledDontShow, setUncontrolledDontShow] = useState(false);
  const dontShowAgain = isDontShowControlled
    ? Boolean(dontShowAgainProp)
    : uncontrolledDontShow;

  const [showBottomScrollFade, setShowBottomScrollFade] = useState(false);
  const [layer, setLayer] = useState<IdsWhatsNewLayer>("main");

  const carouselOpen = open && activeSectionId !== null;
  const singlePreviewLayerOpen = carouselOpen && singlePreviewOpen;

  useEffect(() => {
    setInternalFilter(resolveFilter(filterProp));
  }, [filterProp]);

  useEffect(() => {
    if (!open) {
      setActiveSectionId(null);
      setActiveImageIndex(0);
      setSinglePreviewOpen(false);
      setBookmarkOverrides({});
      setLayer("main");
    }
  }, [open]);

  useEffect(() => {
    if (singlePreviewLayerOpen) setLayer("single-preview");
    else if (carouselOpen) setLayer("carousel");
    else setLayer("main");
  }, [carouselOpen, singlePreviewLayerOpen]);

  const resolvedSections = useMemo(
    () =>
      sourceSections.map((section) => ({
        ...section,
        isBookmarked: bookmarkOverrides[section.id] ?? section.isBookmarked ?? false,
      })),
    [sourceSections, bookmarkOverrides],
  );

  const visibleSections = useMemo(() => {
    if (resolvedFilter === "bookmarked") {
      return resolvedSections.filter((section) => section.isBookmarked);
    }
    return resolvedSections;
  }, [resolvedSections, resolvedFilter]);

  const defaultDescription =
    descriptionProp ??
    (resolvedFilter === "bookmarked" ? BOOKMARKED_DESCRIPTION : DEFAULT_DESCRIPTION);

  useEffect(() => {
    if (!open) {
      setShowBottomScrollFade(false);
      return;
    }
    const el = document.querySelector<HTMLElement>("[data-whats-new-scroll='true']");
    if (!el) {
      setShowBottomScrollFade(false);
      return;
    }
    const update = () => {
      const scrollable = el.scrollHeight - el.clientHeight > 1;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setShowBottomScrollFade(scrollable && !atBottom);
    };
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [open, visibleSections, layer]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) onClose?.();
    },
    [isOpenControlled, onOpenChange, onClose],
  );

  const closeSinglePreview = useCallback(() => {
    if (!singlePreviewOpen || !activeSectionId) return;
    const section = resolvedSections.find((item) => item.id === activeSectionId);
    const image = section?.images[activeImageIndex];
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

  const closeMain = useCallback(() => {
    setSinglePreviewOpen(false);
    setActiveSectionId(null);
    setActiveImageIndex(0);
    setOpen(false);
  }, [setOpen]);

  const closeCurrentLayer = useCallback(() => {
    if (layer === "single-preview") closeSinglePreview();
    else if (layer === "carousel") closeCarousel();
    else closeMain();
  }, [layer, closeSinglePreview, closeCarousel, closeMain]);

  const openCarousel = useCallback(
    (sectionId: string, imageId?: string) => {
      const section = resolvedSections.find((item) => item.id === sectionId);
      const images = section?.images ?? [];
      const index = imageId ? Math.max(0, images.findIndex((img) => img.id === imageId)) : 0;
      setSinglePreviewOpen(false);
      setActiveSectionId(sectionId);
      setActiveImageIndex(index < 0 ? 0 : index);
      onThumbnailClick?.(sectionId, imageId);
    },
    [onThumbnailClick, resolvedSections],
  );

  const toggleBookmark = useCallback(
    (sectionId: string) => {
      const section = sourceSections.find((item) => item.id === sectionId);
      const current = bookmarkOverrides[sectionId] ?? section?.isBookmarked ?? false;
      const next = !current;
      setBookmarkOverrides((prev) => ({ ...prev, [sectionId]: next }));
      onSectionBookmarkChange?.(sectionId, next);
    },
    [bookmarkOverrides, onSectionBookmarkChange, sourceSections],
  );

  const setFilter = useCallback(
    (next: WhatsNewFilter) => {
      if (!filterHostOwned) setInternalFilter(next);
      onFilterChange?.(next);
    },
    [filterHostOwned, onFilterChange],
  );

  const setDontShowAgain = useCallback(
    (value: boolean) => {
      if (!isDontShowControlled) setUncontrolledDontShow(value);
      onDontShowAgainChange?.(value);
    },
    [isDontShowControlled, onDontShowAgainChange],
  );

  const activeSection =
    resolvedSections.find((item) => item.id === activeSectionId) ?? null;

  const openSinglePreview = (imageId: string, index: number) => {
    if (!activeSectionId) return;
    setSinglePreviewOpen(true);
    onExpandImage?.(activeSectionId, imageId, index);
  };

  const navigateCarousel = (index: number) => {
    if (!activeSectionId) return;
    const section = resolvedSections.find((item) => item.id === activeSectionId);
    const imageCount = Math.max(1, section?.images.length ?? 1);
    const next = Math.min(Math.max(index, 0), imageCount - 1);
    setActiveImageIndex(next);
    if (singlePreviewOpen) setSinglePreviewOpen(false);
    onCarouselNavigate?.(activeSectionId, next);
  };

  const activeCarouselImage: ParsedWhatsNewImage = useMemo(() => {
    if (!activeSection) return { id: "placeholder", label: "1. Label" };
    const images =
      activeSection.images.length > 0
        ? activeSection.images
        : [{ id: `${activeSection.id}-placeholder`, label: "1. Label" }];
    const safeIndex = Math.min(Math.max(activeImageIndex, 0), images.length - 1);
    return images[safeIndex]!;
  }, [activeSection, activeImageIndex]);

  const ctx: IdsWhatsNewContextValue = {
    title,
    description: typeof summaryFromChildren === "string" ? summaryFromChildren : defaultDescription,
    versionNumber,
    filter: resolvedFilter,
    setFilter,
    dontShowAgain,
    setDontShowAgain,
    titleId,
    closeCurrentLayer,
    openCarousel,
    toggleBookmark,
    bookmarkOverrides,
    onShowMore,
  };

  const hostVersionFilterRow = slots.body
    ? findSlotElement(
        (slots.body.props as { children?: ReactNode }).children,
        "version-filter-row",
      )
    : undefined;

  const sectionNodes = visibleSections.map((section) => (
    <SynthesizedSection key={section.id} section={section} />
  ));

  const mainInterior = (
    <div className={cx(s.root, className)} data-ids="IdsWhatsNew">
      {slots.header ?? (
        <IdsWhatsNewHeader>
          <IdsWhatsNewTitle>{title}</IdsWhatsNewTitle>
          <IdsWhatsNewCloseButton />
        </IdsWhatsNewHeader>
      )}
      {slots.summary ?? <IdsWhatsNewSummary>{defaultDescription}</IdsWhatsNewSummary>}
      <IdsWhatsNewBody>
        {hostVersionFilterRow ?? (
          <IdsWhatsNewVersionFilterRow>
            <IdsWhatsNewVersion />
            <IdsWhatsNewFilter />
          </IdsWhatsNewVersionFilterRow>
        )}
        <IdsWhatsNewSectionsScroll>{sectionNodes}</IdsWhatsNewSectionsScroll>
      </IdsWhatsNewBody>
      {showBottomScrollFade && layer === "main" ? (
        <div className={s.scrollShadow} aria-hidden="true" />
      ) : null}
      {slots.footer ?? <IdsWhatsNewFooter />}
    </div>
  );

  const carouselInterior = activeSection ? (
    <div className={cx(s.root, s.preview)} data-ids="IdsWhatsNewCarousel">
      <header className={s.carouselHeader}>
        <h2 id={carouselTitleId} className={s.title}>
          {activeSection.title}
        </h2>
        <IdsWhatsNewCloseButton aria-label="Close image preview" />
      </header>
      <div className={s.carouselBody}>
        <WhatsNewCarouselBody
          section={activeSection}
          activeIndex={activeImageIndex}
          onNavigate={navigateCarousel}
          onExpand={openSinglePreview}
        />
      </div>
      <IdsWhatsNewFooter />
    </div>
  ) : null;

  const singleInterior =
    activeSection && singlePreviewLayerOpen ? (
      <div className={cx(s.root, s.preview)} data-ids="IdsWhatsNewSinglePreview">
        <header className={s.carouselHeader}>
          <h2 id={singleTitleId} className={s.title}>
            {activeSection.title}
          </h2>
          <IdsWhatsNewCloseButton aria-label="Close expanded image preview" />
        </header>
        <div className={s.carouselBody}>
          <WhatsNewSinglePreviewBody
            image={activeCarouselImage}
            imageIndex={activeImageIndex}
          />
        </div>
        <IdsWhatsNewFooter />
      </div>
    ) : null;

  return (
    <IdsWhatsNewContext.Provider value={ctx}>
      <IdsWhatsNewLayerContext.Provider value="main">
        <IdsModal
          open={open}
          onOpenChange={setOpen}
          layer="main"
          labelledBy={titleId}
          className={s.surface}
          closable={!carouselOpen}
        >
          <IdsModalContent className={s.modalContent}>{mainInterior}</IdsModalContent>
        </IdsModal>
      </IdsWhatsNewLayerContext.Provider>

      <IdsWhatsNewLayerContext.Provider value="carousel">
        <IdsModal
          open={carouselOpen}
          onOpenChange={(next) => {
            if (!next) closeCarousel();
          }}
          layer="carousel"
          labelledBy={carouselTitleId}
          className={s.surface}
          closable={!singlePreviewLayerOpen}
        >
          <IdsModalContent className={s.modalContent}>{carouselInterior}</IdsModalContent>
        </IdsModal>
      </IdsWhatsNewLayerContext.Provider>

      <IdsWhatsNewLayerContext.Provider value="single-preview">
        <IdsModal
          open={singlePreviewLayerOpen}
          onOpenChange={(next) => {
            if (!next) closeSinglePreview();
          }}
          layer="single-preview"
          labelledBy={singleTitleId}
          className={s.surface}
        >
          <IdsModalContent className={s.modalContent}>{singleInterior}</IdsModalContent>
        </IdsModal>
      </IdsWhatsNewLayerContext.Provider>
    </IdsWhatsNewContext.Provider>
  );
}

IdsWhatsNew.displayName = "IdsWhatsNew";

export const IdsWhatsNewCompound = Object.assign(IdsWhatsNew, {
  Header: IdsWhatsNewHeader,
  Title: IdsWhatsNewTitle,
  CloseButton: IdsWhatsNewCloseButton,
  Summary: IdsWhatsNewSummary,
  Body: IdsWhatsNewBody,
  VersionFilterRow: IdsWhatsNewVersionFilterRow,
  Version: IdsWhatsNewVersion,
  Filter: IdsWhatsNewFilter,
  SectionsScroll: IdsWhatsNewSectionsScroll,
  Section: IdsWhatsNewSection,
  Thumbnail: IdsWhatsNewThumbnail,
  SectionHeader: IdsWhatsNewSectionHeader,
  BookmarkButton: IdsWhatsNewBookmarkButton,
  SectionTitle: IdsWhatsNewSectionTitle,
  Description: IdsWhatsNewDescription,
  Link: IdsWhatsNewLink,
  ShowMore: IdsWhatsNewShowMore,
  Images: IdsWhatsNewImages,
  Image: IdsWhatsNewImage,
  Footer: IdsWhatsNewFooter,
});

/** Anatomy alias — root is WhatsNew, not WhatsNewRoot. */
export const WhatsNew = IdsWhatsNewCompound;

export default IdsWhatsNewCompound;
