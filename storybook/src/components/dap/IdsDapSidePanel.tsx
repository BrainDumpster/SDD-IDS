import { Icon } from "../Icon";
import styles from "./IdsDapSidePanel.module.css";
import ctrlClose16Icon from "../../../../assets/icons/ctrl-close-16.svg";

export interface DapPropertyItem {
  key: string;
  value: string;
  iconSlug?: string;
  emphasize?: boolean;
}

export interface IdsDapSidePanelProps {
  open: boolean;
  title: string;
  description: string;
  imageSrc?: string;
  actionLabel?: string;
  tags?: string[];
  properties?: DapPropertyItem[];
  panelWidth?: number;
  closeAriaLabel?: string;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onActionClick?: () => void;
  onTagClick?: (tag: string) => void;
}

export function IdsDapSidePanel({
  open,
  title,
  description,
  imageSrc,
  actionLabel = "View and Manage",
  tags = [],
  properties = [],
  panelWidth = 400,
  closeAriaLabel = "Close side panel",
  onOpenChange,
  onClose,
  onActionClick,
  onTagClick,
}: IdsDapSidePanelProps) {
  const effectiveDescription = description?.trim() || "No description available.";
  const hasTagClick = typeof onTagClick === "function";

  return (
    <aside
      className={[styles.root, open ? styles.open : styles.closed].join(" ")}
      style={{ width: panelWidth }}
      aria-label="Details side panel"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.closeButton}
            aria-label={closeAriaLabel}
            onClick={() => {
              onOpenChange?.(false);
              onClose?.();
            }}
          >
            <img
              src={ctrlClose16Icon}
              alt=""
              aria-hidden="true"
              className={styles.closeIcon}
            />
          </button>
        </header>

        <section className={styles.hero}>
          {imageSrc ? (
            <img src={imageSrc} alt="" className={styles.heroImage} aria-hidden="true" />
          ) : (
            <Icon shapeName="device-network-server" className={styles.heroImageIcon} />
          )}
          <h2 className={styles.heroTitle}>{title}</h2>
          <button type="button" className={styles.heroAction} onClick={onActionClick}>
            {actionLabel}
          </button>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>Properties</div>
          <div className={styles.descriptionWrap}>
            <div className={styles.label}>Description:</div>
            <div className={styles.descriptionBody}>{effectiveDescription}</div>
          </div>

          <div className={styles.propertyList}>
            {properties.map((item) => (
              <div className={styles.propertyRow} key={`${item.key}-${item.value}`}>
                <div className={styles.propertyKey}>{item.key}:</div>
                <div className={styles.propertyValueWrap}>
                  {item.iconSlug ? <Icon shapeName={item.iconSlug} className={styles.propertyIcon} /> : null}
                  <span className={[styles.propertyValue, item.emphasize ? styles.propertyValueEmphasize : ""].join(" ")}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>Tags</div>
          <div className={styles.tagsWrap}>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={styles.tag}
                disabled={!hasTagClick}
                onClick={() => onTagClick?.(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
