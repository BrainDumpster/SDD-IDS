/**
 * IDS Card — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/card`
 * Source: `components/ids/card/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   Card
 *     CardHeader
 *       CardTitleCluster (CardTitle + optional CardTitleDivider + CardSecondaryTitle)
 *       headerMeta?
 *       CardAdditionalFilter?
 *       CardFilter? → DropdownMenu (per-card menuOptions; IdsIcon overflow-menu-dots)
 *     CardBody (required — children | TextTemplate | KeyValueTemplate)
 *     CardFooter?
 *       CardAction+ (IdsButton tertiary + IdsButtonLabel)
 *
 * Composition: `IdsIcon` (kebab / key-value icons), `IdsButton` (+ Label) for footer actions.
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  isValidElement,
  useId,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsButton, IdsButtonLabel } from "../button";
import { IdsIcon } from "../icon";
import {
  IdsCardHeaderOverflowMenu,
  type IdsCardMenuOption,
} from "./IdsCardHeaderMenu";
import styles from "./IdsCard.module.css";

export type { IdsCardMenuOption };

/** Dashboard / grid column span relative to a 3-column Dashboard grid. */
export type IdsCardSize = "span-1" | "span-2" | "span-3";

export interface IdsCardAction {
  id?: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface IdsCardKeyValueItem {
  id?: string;
  label: string;
  value: string;
  /** Optional leading icon slug (e.g. `folder-closed`) per Figma key-value rows. */
  iconSlug?: string;
}

export interface IdsCardProps {
  title?: string;
  /**
   * Secondary title shown inline after a `|` separator (Figma Dashboard-Element-Card
   * `14093:123118` — Body 1 / `var(--color-text-gray-neutral)`).
   */
  secondaryTitle?: ReactNode;
  /** Optional trailing meta before kebab (e.g. “Last 24 Hours” — Body 2 / neutral). */
  headerMeta?: ReactNode;
  /** Optional full custom header replace; kebab still pins trailing when overflow shown. */
  header?: ReactNode;
  /** Optional `CardAdditionalFilter` slot — any Dropdown / filter before the kebab. */
  additionalFilter?: ReactNode;
  /** Required `CardBody` content. */
  children: ReactNode;
  footer?: ReactNode;
  actions?: IdsCardAction[];
  showButtons?: boolean;
  menuOptions?: IdsCardMenuOption[];
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
  size?: IdsCardSize;
  /** Demo-only — not in Figma Card-Main; ignored. */
  elevated?: boolean;
  /** Demo-only — not in Figma Card-Main; ignored. */
  outlined?: boolean;
  className?: string;
}

const SIZE_CLASS: Record<IdsCardSize, string> = {
  "span-1": styles["ids-card--span-1"],
  "span-2": styles["ids-card--span-2"],
  "span-3": styles["ids-card--span-3"],
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveSize(value: unknown): IdsCardSize {
  if (value === "span-2" || value === "span-3") return value;
  return "span-1";
}

function resolveBoolean(value: unknown, defaultValue: boolean): boolean {
  if (typeof value === "boolean") return value;
  return defaultValue;
}

/**
 * Optional secondary title (Figma Dashboard-Element-Card).
 * Rendered inline after `|` when used with `title` — Body 1 / `var(--color-text-gray-neutral)`.
 */
export function IdsCardSecondaryTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(styles["ids-card-secondary-title"], className)}
      data-ids="ids-card-secondary-title"
    >
      {children}
    </span>
  );
}
IdsCardSecondaryTitle.displayName = "IdsCardSecondaryTitle";

/** Content Type=Text — Figma `15718:219736`. */
export function IdsCardTextContent({
  sectionTitle = "Section Title",
  children,
}: {
  sectionTitle?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles["ids-card-text-content"]} data-ids="ids-card-text-content">
      <p className={styles["ids-card-text-section-title"]}>{sectionTitle}</p>
      <div className={styles["ids-card-text-paragraph"]}>{children}</div>
    </div>
  );
}
IdsCardTextContent.displayName = "IdsCardTextContent";

/** Content Type=Key Value Pair — Figma `15718:220110`. Composes lib `IdsIcon`. */
export function IdsCardKeyValueContent({
  items,
}: {
  items: IdsCardKeyValueItem[];
}) {
  return (
    <dl
      className={styles["ids-card-key-value-list"]}
      data-ids="ids-card-key-value-content"
    >
      {items.map((item, index) => (
        <div
          key={item.id ?? `${item.label}-${index}`}
          className={styles["ids-card-key-value-row"]}
        >
          <dt className={styles["ids-card-key-value-label"]}>{item.label}:</dt>
          <dd className={styles["ids-card-key-value-value"]}>
            {item.iconSlug ? (
              <IdsIcon
                shape={item.iconSlug}
                size={16}
                color="var(--color-icon-gray-neutral-base)"
                className={styles["ids-card-key-value-icon"]}
              />
            ) : null}
            <span>{item.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
IdsCardKeyValueContent.displayName = "IdsCardKeyValueContent";

function resolveSecondaryTitle(secondaryTitle: ReactNode | undefined): ReactNode {
  if (secondaryTitle == null || secondaryTitle === false) return null;
  if (typeof secondaryTitle === "string" || typeof secondaryTitle === "number") {
    return <IdsCardSecondaryTitle>{secondaryTitle}</IdsCardSecondaryTitle>;
  }
  if (
    isValidElement(secondaryTitle) &&
    (secondaryTitle.type === IdsCardSecondaryTitle ||
      (typeof secondaryTitle.type === "function" &&
        (secondaryTitle.type as { displayName?: string }).displayName ===
          "IdsCardSecondaryTitle"))
  ) {
    return secondaryTitle;
  }
  return <IdsCardSecondaryTitle>{secondaryTitle}</IdsCardSecondaryTitle>;
}

export function IdsCard({
  title,
  secondaryTitle,
  headerMeta,
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
  size: sizeProp = "span-1",
  className,
}: IdsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const secondaryId = useId();

  const size = resolveSize(sizeProp);
  const dividerOn = resolveBoolean(showDivider, true);
  const buttonsOn = resolveBoolean(showButtons, false);
  const overflowEnabled =
    showOverflowMenu ?? showOverFlowMenu ?? false;
  const overflowOn = resolveBoolean(overflowEnabled, false);

  const showMenu =
    overflowOn && menuOptions != null && menuOptions.length > 0;
  const secondaryNode = resolveSecondaryTitle(secondaryTitle);
  const hasTitle = title != null && String(title).length > 0;
  const hasHeader =
    header != null ||
    hasTitle ||
    secondaryNode != null ||
    showMenu ||
    additionalFilter != null ||
    headerMeta != null;
  const hasFooter =
    buttonsOn &&
    ((actions != null && actions.length > 0) || footer != null);

  const menu = showMenu ? (
    <IdsCardHeaderOverflowMenu
      options={menuOptions!}
      onOptionSelected={(v) => onOptionSelected?.(v)}
      cardRef={cardRef}
      triggerAriaLabel={hasTitle ? `Options for ${title}` : "Card options"}
    />
  ) : null;

  const metaNode =
    headerMeta == null || headerMeta === false
      ? null
      : typeof headerMeta === "string" || typeof headerMeta === "number" ? (
          <span className={styles["ids-card-header-meta"]}>{headerMeta}</span>
        ) : (
          headerMeta
        );

  const trailing =
    additionalFilter != null || menu != null || metaNode != null ? (
      <div className={styles["ids-card-header-trailing"]}>
        {metaNode}
        {additionalFilter}
        {menu}
      </div>
    ) : null;

  const titleBlock =
    secondaryNode != null ? (
      <div className={styles["ids-card-title-row"]}>
        {hasTitle ? (
          <h3 id={titleId} className={styles["ids-card-title-inline"]}>
            {title}
          </h3>
        ) : null}
        {hasTitle ? (
          <span className={styles["ids-card-title-divider"]} aria-hidden="true">
            |
          </span>
        ) : null}
        <div id={secondaryId}>{secondaryNode}</div>
      </div>
    ) : hasTitle ? (
      <h3 id={titleId} className={styles["ids-card-title"]}>
        {title}
      </h3>
    ) : null;

  return (
    <div
      ref={cardRef}
      className={cx(styles["ids-card"], SIZE_CLASS[size], className)}
      data-ids="ids-card"
      data-card-size={size}
      role="group"
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={secondaryNode != null ? secondaryId : undefined}
    >
      {hasHeader ? (
        <div className={styles["ids-card-header"]} data-card-header data-ids="ids-card-header">
          {header != null ? (
            trailing != null ? (
              <div className={styles["ids-card-header-row"]}>
                <div className={styles["ids-card-title-cluster"]}>{header}</div>
                {trailing}
              </div>
            ) : (
              header
            )
          ) : (
            <div className={styles["ids-card-header-row"]}>
              <div className={styles["ids-card-title-cluster"]}>{titleBlock}</div>
              {trailing}
            </div>
          )}
        </div>
      ) : null}

      <div
        className={cx(
          styles["ids-card-body"],
          !dividerOn && styles["ids-card-body--no-divider"],
          dividerOn && hasFooter && styles["ids-card-body--with-footer"],
        )}
        data-card-show-divider={dividerOn ? "true" : "false"}
        data-ids="ids-card-body"
      >
        {children}
      </div>

      {hasFooter ? (
        <div
          className={styles["ids-card-footer"]}
          data-card-footer
          data-ids="ids-card-footer"
        >
          {actions != null && actions.length > 0
            ? actions.map((action, index) => (
                <IdsButton
                  key={action.id ?? `${action.label}-${index}`}
                  type="button"
                  variant="tertiary"
                  size="small"
                  disabled={action.disabled}
                  onClick={action.onClick}
                  className={styles["ids-card-footer-action"]}
                  data-ids="ids-card-action"
                >
                  <IdsButtonLabel>{action.label}</IdsButtonLabel>
                </IdsButton>
              ))
            : footer}
        </div>
      ) : null}
    </div>
  );
}

IdsCard.displayName = "IdsCard";

/** Type guard for Dashboard children inspection. */
export function isIdsCardElement(
  node: ReactNode,
): node is ReactElement<IdsCardProps> {
  return (
    isValidElement(node) &&
    (node.type === IdsCard ||
      (typeof node.type === "function" &&
        (node.type as { displayName?: string }).displayName === "IdsCard"))
  );
}

export function collectIdsCardChildren(children: ReactNode): ReactElement[] {
  return Children.toArray(children).filter(isValidElement);
}

export const IdsCardCompound = Object.assign(IdsCard, {
  SecondaryTitle: IdsCardSecondaryTitle,
  TextContent: IdsCardTextContent,
  KeyValueContent: IdsCardKeyValueContent,
});

export default IdsCardCompound;
