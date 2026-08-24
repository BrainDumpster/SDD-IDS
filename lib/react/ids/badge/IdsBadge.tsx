/**
 * IDS Badge — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/badge`
 * Source: `components/ids/badge/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   BadgeRoot
 *     BadgeContainer
 *       BadgeContent
 *
 * Composition (values ≥ 999): wraps container in lib `IdsTooltip` (`hugContent`)
 * so hover/focus reveals the full value.
 *
 * No @base-ui-components dependency.
 */

import React, {
  type ElementType,
  type HTMLAttributes,
  type ReactElement,
} from "react";
import {
  IdsTooltip,
  TooltipBody,
  TooltipPanel,
  TooltipTrigger,
} from "../tooltip";
import styles from "./IdsBadge.module.css";

export type IdsBadgeType =
  | "default"
  | "critical"
  | "warning"
  | "disabled"
  | "success";

const BADGE_TYPES = new Set<IdsBadgeType>([
  "default",
  "critical",
  "warning",
  "disabled",
  "success",
]);

export interface IdsBadgeProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Required visual content. Empty → render nothing. */
  value: string | number;
  /** Variant axis `Type`. Unknown → `default`. */
  type?: IdsBadgeType | string;
  /** Optional semantic element for BadgeContainer. Default `span`. */
  as?: ElementType;
  /** Explicit accessible name when `value` alone is ambiguous. */
  ariaLabel?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveType(value: unknown): IdsBadgeType {
  if (typeof value === "string" && BADGE_TYPES.has(value as IdsBadgeType)) {
    return value as IdsBadgeType;
  }
  return "default";
}

function digitSizeClass(displayText: string): string {
  const count = displayText.length;
  if (count <= 1) return styles["ids-badge--digits-1"];
  if (count === 2) return styles["ids-badge--digits-2"];
  return styles["ids-badge--digits-3"];
}

function typeClass(type: IdsBadgeType): string {
  return styles[`ids-badge--type-${type}`];
}

export function IdsBadge({
  value,
  type: typeProp = "default",
  as: As = "span",
  ariaLabel,
  className,
  ...rest
}: IdsBadgeProps): ReactElement | null {
  if (value === "" || value == null) return null;

  const valueText = String(value);
  const numericValue = Number(value);
  const isLargeNumber = !Number.isNaN(numericValue) && numericValue >= 999;
  // Established IDS Badge truncate for ≥999 (tooltip shows full `valueText`).
  const displayText = isLargeNumber ? "1K" : valueText;
  const type = resolveType(typeProp);

  const badge = (
    <As
      {...rest}
      className={cx(
        styles["ids-badge"],
        typeClass(type),
        digitSizeClass(displayText),
        className,
      )}
      data-ids="ids-badge"
      data-type={type}
      aria-label={ariaLabel ?? (isLargeNumber ? valueText : undefined)}
    >
      <span
        className={styles["ids-badge-content"]}
        data-ids="ids-badge-content"
      >
        {displayText}
      </span>
    </As>
  );

  if (!isLargeNumber) return badge;

  // Hover/focus of the badge shows full value (Interactions). Trigger owns focus.
  return (
    <IdsTooltip hugContent side="top">
      <TooltipTrigger tabIndex={0}>{badge}</TooltipTrigger>
      <TooltipPanel>
        <TooltipBody>{valueText}</TooltipBody>
      </TooltipPanel>
    </IdsTooltip>
  );
}

IdsBadge.displayName = "IdsBadge";

export default IdsBadge;
