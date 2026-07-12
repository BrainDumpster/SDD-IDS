import { useEffect, useId, useMemo, useState, type ComponentProps } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { IdsPagination } from "./IdsPagination";
import { TextInput } from "./TextInput";
import { ToggleSwitch } from "./ToggleSwitch";
import styles from "./IdsWhatsNew.module.css";
import type {
  IdsWhatsNewItem,
  IdsWhatsNewLayout,
  IdsWhatsNewView,
} from "../spec-contracts/ids-whats-new.contract";

export interface IdsWhatsNewProps extends Omit<ComponentProps<"section">, "title" | "children"> {
  /** Modal title. Defaults by view mode. */
  title?: string;
  /** Short descriptive text below the header. */
  summary?: string;
  /** Visual presentation of the panel. */
  view?: IdsWhatsNewView;
  /** Layout context. */
  layout?: IdsWhatsNewLayout;
  /** Visible version label in the list header. */
  version?: string;
  /** Current filter value shown in the dropdown. */
  filterValue?: string;
  /** Optional filter dropdown options. Defaults to ["Newest", "Bookmarked"]. */
  filterOptions?: string[];
  /** Called when the filter dropdown value changes. */
  onFilterChange?: (value: string) => void;
  /** Show the filter dropdown above the update list. */
  showFilter?: boolean;
  /** Show the search input. */
  showSearch?: boolean;
  /** Show pagination controls. */
  showPagination?: boolean;
  /** Total number of pages when pagination is enabled. */
  pageCount?: number;
  /** Current page when pagination is controlled. */
  page?: number;
  /** Called when the page changes. */
  onPageChange?: (page: number) => void;
  /** Auto-dismiss the panel after `autoDismissDelay` milliseconds. */
  autoDismiss?: boolean;
  /** Auto-dismiss delay in milliseconds. */
  autoDismissDelay?: number;
  /** Update items to display. */
  items?: IdsWhatsNewItem[];
  /** Called when the close button is pressed. */
  onClose?: () => void;
  /** Called when the "Don't show again" toggle changes. */
  onToggleDontShow?: (checked: boolean) => void;
  /** Hide the "Don't show again" toggle. */
  hideDontShowToggle?: boolean;
}

const DEFAULT_FILTER_OPTIONS = ["Newest", "Bookmarked"];

function defaultTitle(view: IdsWhatsNewView): string {
  if (view === "preview-single" || view === "preview-multiple") {
    return "Section Header";
  }
  return "What’s New";
}

function defaultSummary(view: IdsWhatsNewView): string | undefined {
  if (view === "preview-single" || view === "preview-multiple") {
    return undefined;
  }
  if (view === "bookmarked") {
    return "The following updates (features, bug fixes) were bookmarked and may be from recent or previous releases/versions.";
  }
  return "The following updates (features, bug fixes) have recently been made.";
}

function defaultFilterValue(view: IdsWhatsNewView): string {
  return view === "bookmarked" ? "Bookmarked" : "Newest";
}

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Icon shapeName="photos" style={{ width: 32, height: 32 }} />
      <p>Swap image</p>
      <a
        href="https://www.figma.com/proto/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library"
        target="_blank"
        rel="noreferrer"
      >
        Learn to swap
      </a>
    </div>
  );
}

function ItemThumbnail({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className={styles.itemThumbnail}>
      {imageUrl ? (
        <img src={imageUrl} alt="" />
      ) : (
        <ImagePlaceholder className={styles.itemThumbnailPlaceholder} />
      )}
    </div>
  );
}

function PreviewThumbnail({
  imageUrl,
  selected,
  onClick,
}: {
  imageUrl?: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={[styles.previewThumb, selected ? styles.previewThumbSelected : ""].join(" ")}
      onClick={onClick}
      aria-pressed={selected}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" />
      ) : (
        <ImagePlaceholder className={styles.previewThumbOverlay} />
      )}
    </button>
  );
}

function PreviewView({
  items,
  multiple,
}: {
  items: IdsWhatsNewItem[];
  multiple: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItem = items[selectedIndex] ?? items[0];

  const navigate = (direction: "prev" | "next") => {
    setSelectedIndex((prev) => {
      const next = direction === "prev" ? prev - 1 : prev + 1;
      return Math.max(0, Math.min(items.length - 1, next));
    });
  };

  return (
    <div className={styles.preview}>
      <div className={styles.previewNav}>
        {multiple && (
          <button
            type="button"
            className={styles.previewNavButton}
            onClick={() => navigate("prev")}
            disabled={selectedIndex === 0}
            aria-label="Previous"
          >
            <Icon shapeName="chev-left-thick" style={{ width: 16, height: 16 }} />
          </button>
        )}
        <div className={styles.previewColumn}>
          {multiple && (
            <div className={styles.previewThumbnails}>
              {items.map((item, index) => (
                <PreviewThumbnail
                  key={item.id}
                  imageUrl={item.imageUrl}
                  selected={index === selectedIndex}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
              <div className={styles.previewThumbFade} aria-hidden="true" />
            </div>
          )}
          <div className={styles.previewImage}>
            {selectedItem?.imageUrl ? (
              <img src={selectedItem.imageUrl} alt="" />
            ) : (
              <ImagePlaceholder className={styles.itemThumbnailPlaceholder} />
            )}
          </div>
          <div className={styles.previewStepsRow}>
            <ol className={styles.previewSteps}>
              {items.map((item) => (
                <li key={item.id}>{item.description || "Label"}</li>
              ))}
            </ol>
            <button
              type="button"
              className={styles.popoutButton}
              aria-label="Open in new window"
              onClick={selectedItem?.onReadMore}
            >
              <Icon shapeName="popout-double" style={{ width: 32, height: 32 }} />
            </button>
          </div>
        </div>
        {multiple && (
          <button
            type="button"
            className={styles.previewNavButton}
            onClick={() => navigate("next")}
            disabled={selectedIndex === items.length - 1}
            aria-label="Next"
          >
            <Icon shapeName="chev-right-thick" style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>
    </div>
  );
}

export function IdsWhatsNew({
  title,
  summary,
  view = "newest",
  layout = "modal",
  version,
  filterValue: filterValueProp,
  filterOptions = DEFAULT_FILTER_OPTIONS,
  onFilterChange,
  showFilter = false,
  showSearch = false,
  showPagination = false,
  pageCount = 1,
  page: pageProp = 1,
  onPageChange,
  autoDismiss = false,
  autoDismissDelay = 5000,
  items = [],
  onClose,
  onToggleDontShow,
  hideDontShowToggle = false,
  className,
  ...rest
}: IdsWhatsNewProps) {
  const titleId = useId();
  const resolvedTitle = title ?? defaultTitle(view);
  const resolvedSummary = summary ?? defaultSummary(view);
  const resolvedFilterValue = filterValueProp ?? defaultFilterValue(view);
  const [filterValue, setFilterValue] = useState(resolvedFilterValue);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(pageProp);

  useEffect(() => {
    setFilterValue(resolvedFilterValue);
  }, [resolvedFilterValue]);

  useEffect(() => {
    setCurrentPage(pageProp);
  }, [pageProp]);

  useEffect(() => {
    if (!autoDismiss || !onClose) return undefined;
    const timer = setTimeout(() => onClose(), autoDismissDelay);
    return () => clearTimeout(timer);
  }, [autoDismiss, autoDismissDelay, onClose]);

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    onFilterChange?.(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const filteredItems = useMemo(() => {
    if (!showSearch || !searchQuery.trim() || view === "preview-single" || view === "preview-multiple") {
      return items;
    }
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        (item.sectionHeader ?? "").toLowerCase().includes(query) ||
        (item.description ?? "").toLowerCase().includes(query) ||
        (item.category ?? "").toLowerCase().includes(query) ||
        (item.date ?? "").toLowerCase().includes(query),
    );
  }, [items, searchQuery, showSearch, view]);

  const pagedItems = useMemo(() => {
    if (!showPagination || pageCount <= 1) return filteredItems;
    const start = (currentPage - 1) * 3;
    return filteredItems.slice(start, start + 3);
  }, [filteredItems, showPagination, pageCount, currentPage]);

  const isPreview = view === "preview-single" || view === "preview-multiple";
  const rootClasses = [styles.root, styles[layout], className].filter(Boolean).join(" ");

  return (
    <section
      className={rootClasses}
      role={layout === "inline" ? undefined : "dialog"}
      aria-modal={layout === "inline" ? undefined : "true"}
      aria-labelledby={titleId}
      {...rest}
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {resolvedTitle}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close"
            onClick={onClose}
          >
            <Icon shapeName="close" style={{ width: 16, height: 16 }} />
          </button>
        </header>

        {resolvedSummary && !isPreview && (
          <p className={styles.summary}>{resolvedSummary}</p>
        )}

        {!isPreview && (
          <div className={styles.scrollArea}>
            <div className={styles.contentInner}>
              {(version || showFilter) && (
                <div className={styles.versionHeader}>
                  {version && <p className={styles.versionTitle}>Version: {version}</p>}
                  {showFilter && (
                    <div className={styles.filter}>
                      <select
                        className={styles.filterSelect}
                        value={filterValue}
                        onChange={(event) => handleFilterChange(event.target.value)}
                        aria-label="Filter updates"
                      >
                        {filterOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span className={styles.filterIcon} aria-hidden="true">
                        <Icon shapeName="arrow-drop-tri-caret" style={{ width: 10, height: 10 }} />
                      </span>
                    </div>
                  )}
                </div>
              )}

              {showSearch && (
                <div className={styles.searchRow}>
                  <TextInput
                    ariaLabel="Search updates"
                    placeholder="Search updates"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    showLabel={false}
                  />
                </div>
              )}

              <div className={styles.list}>
                {pagedItems.map((item) => (
                  <article key={item.id} className={styles.item}>
                    <ItemThumbnail imageUrl={item.imageUrl} />
                    <div className={styles.itemBody}>
                      {item.sectionHeader && (
                        <div className={styles.itemSectionHeader}>
                          <span className={styles.itemSectionIcon}>
                            <Icon
                              shapeName={item.sectionHeaderIcon === "star-solid" ? "star-fav-solid" : "star-fav"}
                              style={{ width: 16, height: 16 }}
                              color="var(--color-text-neutral-strong, #252525)"
                            />
                          </span>
                          {item.sectionHeader}
                          {item.date && (
                            <span style={{ fontWeight: 400, color: "var(--color-text-neutral, #4d4d4d)" }}>
                              {" · "}
                              {item.date}
                            </span>
                          )}
                        </div>
                      )}
                      {item.description && (
                        <p className={styles.itemDescription}>{item.description}</p>
                      )}
                      {item.readMoreLabel && (
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={item.onReadMore}
                          className={styles.showMoreButton}
                        >
                          {item.readMoreLabel}
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {isPreview && (
          <div className={styles.scrollArea}>
            <PreviewView items={items} multiple={view === "preview-multiple"} />
          </div>
        )}
      </div>

      {showPagination && pageCount > 1 && (
        <div className={styles.pagination}>
          <IdsPagination
            currentPage={currentPage}
            totalPages={pageCount}
            onPageChange={handlePageChange}
            showPerPage={false}
            background="none"
          />
        </div>
      )}

      {autoDismiss && (
        <div className={styles.dismissBanner}>
          This dialog will close automatically in {Math.ceil(autoDismissDelay / 1000)} seconds.
        </div>
      )}

      <footer className={styles.footer}>
        {!hideDontShowToggle && (
          <ToggleSwitch
            label="Don’t show again until the next update"
            onCheckedChange={onToggleDontShow}
          />
        )}
        <Button variant="primary" size="md" onClick={onClose}>
          Close
        </Button>
      </footer>
    </section>
  );
}
