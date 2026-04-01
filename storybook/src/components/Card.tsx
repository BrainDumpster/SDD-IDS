import { useId, useRef } from "react";
import type { ReactNode } from "react";
import { CardHeaderOverflowMenu, type CardMenuOption } from "./CardHeaderMenu";
import styles from "./Card.module.css";

export type { CardMenuOption };

interface CardProps {
  /** Optional header label — rendered when `header` is not provided */
  title?: string;
  /** Optional leading icon in the title row (ReactNode or icon slug string; omitted if using custom `header`) */
  headerIcon?: ReactNode | string;
  /** Controls whether headerIcon should render in default title row. */
  showIcon?: boolean;
  /** Custom header region — replaces default title row layout; pair with `menuOptions` to keep kebab on the right */
  header?: ReactNode;
  children: ReactNode;
  /** Optional footer for actions or metadata */
  footer?: ReactNode;
  /** Controls whether footer button/content row should render. */
  showButtons?: boolean;
  /**
   * Per-card overflow actions. Each card instance supplies its own list; lists are not shared
   * across cards on a page.
   */
  menuOptions?: CardMenuOption[];
  /** Controls whether the header overflow menu (vertical ellipsis) should render. */
  showOverFlowMenu?: boolean;
  /**
   * Emitted when the user selects an item from the header options overlay.
   * Codegen: React `onOptionSelected(value)`; Angular `optionSelected.emit(value)`;
   * Lit `CustomEvent` `option-selected` with `detail` = selected `value` string.
   */
  onOptionSelected?: (value: string) => void;
  elevated?: boolean;
  outlined?: boolean;
}

export function Card({
  title,
  headerIcon,
  showIcon = false,
  header,
  children,
  footer,
  showButtons = false,
  menuOptions,
  showOverFlowMenu = false,
  onOptionSelected,
  elevated = false,
  outlined = false,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const showMenu =
    showOverFlowMenu && menuOptions != null && menuOptions.length > 0;
  const resolvedHeaderIcon =
    typeof headerIcon === "string" &&
    /^[a-z0-9-]+$/.test(headerIcon) &&
    headerIcon.length > 0
      ? `/assets/icons/${headerIcon}.svg`
      : undefined;
  const showHeaderIcon =
    showIcon &&
    headerIcon != null &&
    (typeof headerIcon === "string" ? resolvedHeaderIcon != null : true);
  const hasHeader =
    header != null ||
    (title != null && String(title).length > 0) ||
    showHeaderIcon ||
    showMenu;
  const hasFooter = showButtons && footer != null;

  const classNames = [
    styles.card,
    elevated ? styles.elevated : "",
    outlined ? styles.outlined : "",
  ]
    .filter(Boolean)
    .join(" ");

  const menu = showMenu ? (
    <CardHeaderOverflowMenu
      options={menuOptions!}
      onOptionSelected={(v) => onOptionSelected?.(v)}
      cardRef={cardRef}
      triggerAriaLabel="Card options"
    />
  ) : null;

  return (
    <div ref={cardRef} className={classNames}>
      {hasHeader && (
        <div
          className={`${styles.header} ${styles.headerDivider}`}
          data-card-header
        >
          {header != null ? (
            showMenu ? (
              <div className={styles.headerRow}>
                <div className={styles.headerTitleCluster}>{header}</div>
                {menu}
              </div>
            ) : (
              header
            )
          ) : (
            <div className={styles.headerRow}>
              <div className={styles.headerTitleCluster}>
                {showHeaderIcon && (
                  <span className={styles.headerIcon}>
                    {typeof headerIcon === "string" ? (
                      resolvedHeaderIcon ? (
                        <img
                          src={resolvedHeaderIcon}
                          alt=""
                          className={styles.headerIconImage}
                        />
                      ) : null
                    ) : (
                      headerIcon
                    )}
                  </span>
                )}
                {title != null && String(title).length > 0 && (
                  <h3 id={titleId} className={styles.title}>
                    {title}
                  </h3>
                )}
              </div>
              {menu}
            </div>
          )}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {hasFooter && (
        <div className={styles.footer} data-card-footer>
          {footer}
        </div>
      )}
    </div>
  );
}
