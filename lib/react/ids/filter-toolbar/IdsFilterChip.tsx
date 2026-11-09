/**
 * IDS Filter Chip — child of IdsFilterToolbar.
 *
 * Path: `lib/react/ids/filter-toolbar`
 * Source: `components/ids/filter-toolbar/design-spec.md`
 * Figma: Power Filter Chip `52201:256363`
 */

import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsFilterChip.module.css";

export type IdsFilterChipState = "default" | "disabled";

export interface IdsFilterChipProps
  extends Omit<ButtonHTMLAttributes<HTMLDivElement>, "onClick" | "children"> {
  category: string;
  value: string;
  /** When > 0, renders `+{n}` after the value. */
  overflowCount?: number;
  disabled?: boolean;
  /** Demo/testing visual override only. */
  dataState?: IdsFilterChipState;
  removeLabel?: string;
  expandLabel?: string;
  onRemove?: () => void;
  onOpen?: () => void;
  children?: ReactNode;
}

function formatCategory(category: string): string {
  const trimmed = category.trim();
  if (!trimmed) return "";
  return trimmed.endsWith(":") ? trimmed : `${trimmed}:`;
}

export function IdsFilterChip({
  category,
  value,
  overflowCount = 0,
  disabled = false,
  dataState,
  removeLabel = "Remove filter",
  expandLabel = "Edit filter",
  onRemove,
  onOpen,
  className,
  ...rest
}: IdsFilterChipProps) {
  const isDisabled = disabled || dataState === "disabled";
  const count = Number.isFinite(overflowCount) ? Math.max(0, Math.floor(overflowCount)) : 0;

  return (
    <div
      {...rest}
      className={[styles.IdsFilterChip, className].filter(Boolean).join(" ")}
      data-ids="IdsFilterChip"
      data-disabled={isDisabled ? "true" : undefined}
      data-state={dataState}
      role="group"
      aria-disabled={isDisabled || undefined}
      aria-label={[formatCategory(category), value, count > 0 ? `+${count}` : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className={styles.IdsFilterChipRemove}
        data-ids="IdsFilterChipRemove"
        aria-label={removeLabel}
        disabled={isDisabled}
        onClick={(event) => {
          event.stopPropagation();
          if (!isDisabled) onRemove?.();
        }}
      >
        <IdsIcon shape="shape-x" size={12} />
      </button>
      <span className={styles.IdsFilterChipDivider} data-ids="IdsFilterChipDivider" aria-hidden />
      <button
        type="button"
        className={styles.IdsFilterChipContent}
        data-ids="IdsFilterChipContent"
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) onOpen?.();
        }}
      >
        <span className={styles.IdsFilterChipCategory} data-ids="IdsFilterChipCategory">
          {formatCategory(category)}
        </span>
        <span className={styles.IdsFilterChipValue} data-ids="IdsFilterChipValue">
          {value}
        </span>
        {count > 0 ? (
          <span className={styles.IdsFilterChipOverflowCount} data-ids="IdsFilterChipOverflowCount">
            +{count}
          </span>
        ) : null}
      </button>
      <button
        type="button"
        className={styles.IdsFilterChipExpand}
        data-ids="IdsFilterChipExpand"
        aria-label={expandLabel}
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) onOpen?.();
        }}
      >
        <IdsIcon shape="chev-down-thick" size={12} />
      </button>
    </div>
  );
}

IdsFilterChip.displayName = "IdsFilterChip";
