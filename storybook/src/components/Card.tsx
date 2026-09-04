import {
  Children,
  isValidElement,
  useId,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { idsAssetUrl } from "../../../lib/shared/ids-assets-base.js";
import { CardHeaderOverflowMenu, type CardMenuOption } from "./CardHeaderMenu";
import { Icon } from "./Icon";
import styles from "./Card.module.css";

export type { CardMenuOption };

/** Dashboard / grid column span relative to a 3-column Dashboard grid. */
export type CardSize = "span-1" | "span-2" | "span-3";

export interface CardAction {
  id?: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface CardKeyValueItem {
  id?: string;
  label: string;
  value: string;
  /** Optional leading icon slug (e.g. `folder-closed`) per Figma key-value rows. */
  iconSlug?: string;
}

interface CardProps {
  title?: string;
  /**
   * Secondary title shown inline after a `|` separator (Figma Dashboard-Element-Card
   * `14093:123118` — Body 1 / `var(--color-text-gray-neutral)`).
   * Prefer `<CardSecondaryTitle>` or a string/node via this prop.
   */
  secondaryTitle?: ReactNode;
  /**
   * Optional trailing meta before kebab (Figma “Last 24 Hours” — Body 2 / neutral).
   */
  headerMeta?: ReactNode;
  headerIcon?: ReactNode | string;
  showIcon?: boolean;
  header?: ReactNode;
  /** Optional `CardAdditionalFilter` slot — any Dropdown / filter before the kebab. */
  additionalFilter?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  actions?: CardAction[];
  showButtons?: boolean;
  menuOptions?: CardMenuOption[];
  showOverflowMenu?: boolean;
  /** @deprecated Alias of `showOverflowMenu` */
  showOverFlowMenu?: boolean;
  onOptionSelected?: (value: string) => void;
  /**
   * When `true` (default), `CardBody` shows header‖body `border-top` and, if a
   * footer is present, body‖footer `border-bottom`. Set `false` to hide both.
   */
  showDivider?: boolean;
  /**
   * Column span inside Dashboard’s 3-column grid.
   * `span-1` (default) | `span-2` (2×) | `span-3` (3× / full row).
   */
  size?: CardSize;
  /** Demo-only — not in Figma Card-Main; ignored. */
  elevated?: boolean;
  /** Demo-only — not in Figma Card-Main; ignored. */
  outlined?: boolean;
  className?: string;
}

const SIZE_CLASS: Record<CardSize, string> = {
  "span-1": styles.sizeSpan1,
  "span-2": styles.sizeSpan2,
  "span-3": styles.sizeSpan3,
};

/**
 * Optional secondary title (Figma Dashboard-Element-Card).
 * Rendered inline after `|` when used with `title` — Body 1 / `var(--color-text-gray-neutral)`.
 */
export function CardSecondaryTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={[styles.secondaryTitle, className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}

/** Content Type=Text — Figma `15718:219736`. */
export function CardTextContent({
  sectionTitle = "Section Title",
  children,
}: {
  sectionTitle?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.textContent}>
      <p className={styles.textSectionTitle}>{sectionTitle}</p>
      <div className={styles.textParagraph}>{children}</div>
    </div>
  );
}

/** Content Type=Key Value Pair — Figma `15718:220110`. */
export function CardKeyValueContent({ items }: { items: CardKeyValueItem[] }) {
  return (
    <dl className={styles.keyValueList}>
      {items.map((item, index) => (
        <div
          key={item.id ?? `${item.label}-${index}`}
          className={styles.keyValueRow}
        >
          <dt className={styles.keyValueLabel}>{item.label}:</dt>
          <dd className={styles.keyValueValue}>
            {item.iconSlug ? (
              <Icon
                shapeName={item.iconSlug}
                className={styles.keyValueIcon}
                style={{ width: 16, height: 16 }}
              />
            ) : null}
            <span>{item.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function resolveSecondaryTitle(secondaryTitle: ReactNode | undefined): ReactNode {
  if (secondaryTitle == null || secondaryTitle === false) return null;
  if (typeof secondaryTitle === "string" || typeof secondaryTitle === "number") {
    return <CardSecondaryTitle>{secondaryTitle}</CardSecondaryTitle>;
  }
  if (
    isValidElement(secondaryTitle) &&
    secondaryTitle.type === CardSecondaryTitle
  ) {
    return secondaryTitle;
  }
  return <CardSecondaryTitle>{secondaryTitle}</CardSecondaryTitle>;
}

export function Card({
  title,
  secondaryTitle,
  headerMeta,
  headerIcon,
  showIcon = false,
  header,
  additionalFilter,
  children,
  footer,
  actions,
  showButtons = false,
  menuOptions,
  showOverflowMenu,
  showOverFlowMenu,
  onOptionSelected,
  showDivider = true,
  size = "span-1",
  className,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const secondaryId = useId();

  const overflowEnabled = showOverflowMenu ?? showOverFlowMenu ?? false;
  const showMenu =
    overflowEnabled && menuOptions != null && menuOptions.length > 0;
  const resolvedHeaderIcon =
    typeof headerIcon === "string" &&
    /^[a-z0-9-]+$/.test(headerIcon) &&
    headerIcon.length > 0
      ? idsAssetUrl(`icons/${headerIcon}.svg`)
      : undefined;
  const showHeaderIcon =
    showIcon &&
    headerIcon != null &&
    (typeof headerIcon === "string" ? resolvedHeaderIcon != null : true);
  const secondaryNode = resolveSecondaryTitle(secondaryTitle);
  const hasTitle = title != null && String(title).length > 0;
  const hasHeader =
    header != null ||
    hasTitle ||
    secondaryNode != null ||
    showHeaderIcon ||
    showMenu ||
    additionalFilter != null ||
    headerMeta != null;
  const hasFooter =
    showButtons &&
    ((actions != null && actions.length > 0) || footer != null);

  const menu = showMenu ? (
    <CardHeaderOverflowMenu
      options={menuOptions!}
      onOptionSelected={(v) => onOptionSelected?.(v)}
      cardRef={cardRef}
      triggerAriaLabel={
        hasTitle ? `Options for ${title}` : "Card options"
      }
    />
  ) : null;

  const metaNode =
    headerMeta == null || headerMeta === false ? null : typeof headerMeta ===
        "string" || typeof headerMeta === "number" ? (
      <span className={styles.headerMeta}>{headerMeta}</span>
    ) : (
      headerMeta
    );

  const trailing =
    additionalFilter != null || menu != null || metaNode != null ? (
      <div className={styles.headerTrailing}>
        {additionalFilter}
        {metaNode}
        {menu}
      </div>
    ) : null;

  const sizeClass = SIZE_CLASS[size] ?? SIZE_CLASS["span-1"];

  const titleBlock =
    secondaryNode != null ? (
      <div className={styles.titleRow}>
        {hasTitle ? (
          <h3 id={titleId} className={styles.titleInline}>
            {title}
          </h3>
        ) : null}
        {hasTitle ? (
          <span className={styles.titleDivider} aria-hidden="true">
            |
          </span>
        ) : null}
        <div id={secondaryId}>{secondaryNode}</div>
      </div>
    ) : hasTitle ? (
      <h3 id={titleId} className={styles.title}>
        {title}
      </h3>
    ) : null;

  return (
    <div
      ref={cardRef}
      className={[styles.card, sizeClass, className].filter(Boolean).join(" ")}
      data-card-size={size}
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={secondaryNode != null ? secondaryId : undefined}
    >
      {hasHeader && (
        <div
          className={styles.header}
          data-card-header
          data-has-overflow-menu={showMenu ? "true" : "false"}
        >
          {header != null ? (
            trailing != null ? (
              <div className={styles.headerRow}>
                <div className={styles.headerTitleCluster}>{header}</div>
                {trailing}
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
                {titleBlock}
              </div>
              {trailing}
            </div>
          )}
        </div>
      )}
      <div
        className={[
          styles.body,
          showDivider ? "" : styles.bodyNoDivider,
          showDivider && hasFooter ? styles.bodyWithFooter : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-card-show-divider={showDivider ? "true" : "false"}
      >
        {children}
      </div>
      {hasFooter && (
        <div className={styles.footer} data-card-footer>
          {actions != null && actions.length > 0
            ? actions.map((action, index) => (
                <button
                  key={action.id ?? `${action.label}-${index}`}
                  type="button"
                  className={styles.footerAction}
                  disabled={action.disabled}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ))
            : footer}
        </div>
      )}
    </div>
  );
}

/** Type guard for Dashboard children inspection. */
export function isCardElement(
  node: ReactNode,
): node is ReactElement<CardProps> {
  return isValidElement(node) && node.type === Card;
}

export function collectCardChildren(children: ReactNode): ReactElement[] {
  return Children.toArray(children).filter(isValidElement);
}
