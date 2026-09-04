/**
 * IDS ToastViewport — queue/stack host from design-spec.
 *
 * Path: `lib/react/ids/toast`
 * Source: `components/ids/toast/design-spec.md`
 *
 * Queue: FIFO. `maxVisible` default 3.
 * Top positions: newest visible at bottom (column, append).
 * Bottom positions: newest visible at top (column-reverse).
 */

import React, { useCallback, useMemo, useState } from "react";
import {
  IdsToastItem,
  type IdsToastCloseReason,
  type IdsToastLink,
  type IdsToastType,
} from "./IdsToastItem";
import styles from "./IdsToast.module.css";

export type IdsToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface IdsToastQueueItem {
  id: string;
  type?: IdsToastType | string;
  message: string;
  duration?: number;
  closable?: boolean;
  link?: IdsToastLink;
  role?: "status" | "alert";
}

export interface IdsToastViewportProps {
  position?: IdsToastPosition | string;
  /** Recommended default `3`. */
  maxVisible?: number;
  /** Controlled visible+queued list. When omitted, use imperative `add` via ref API is not exposed; pass `items` + `onItemsChange`. */
  items?: IdsToastQueueItem[];
  defaultItems?: IdsToastQueueItem[];
  onItemsChange?: (items: IdsToastQueueItem[]) => void;
  onItemClose?: (detail: {
    id: string;
    reason: IdsToastCloseReason;
  }) => void;
  onItemTimeout?: (detail: { id: string }) => void;
  className?: string;
}

const POSITIONS = new Set<IdsToastPosition>([
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]);

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolvePosition(value: unknown): IdsToastPosition {
  if (typeof value === "string" && POSITIONS.has(value as IdsToastPosition)) {
    return value as IdsToastPosition;
  }
  return "top-right";
}

function resolveMaxVisible(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 1) {
    return Math.floor(value);
  }
  return 3;
}

export function IdsToastViewport({
  position: positionProp,
  maxVisible: maxVisibleProp,
  items: itemsProp,
  defaultItems = [],
  onItemsChange,
  onItemClose,
  onItemTimeout,
  className,
}: IdsToastViewportProps) {
  const position = resolvePosition(positionProp);
  const maxVisible = resolveMaxVisible(maxVisibleProp);

  const [uncontrolledItems, setUncontrolledItems] =
    useState<IdsToastQueueItem[]>(defaultItems);
  const controlled = itemsProp != null;
  const items = controlled ? itemsProp! : uncontrolledItems;

  const setItems = useCallback(
    (next: IdsToastQueueItem[]) => {
      if (!controlled) setUncontrolledItems(next);
      onItemsChange?.(next);
    },
    [controlled, onItemsChange],
  );

  const visibleItems = useMemo(
    () => items.slice(0, maxVisible),
    [items, maxVisible],
  );

  const handleClose = useCallback(
    (id: string, reason: IdsToastCloseReason) => {
      setItems(items.filter((item) => item.id !== id));
      onItemClose?.({ id, reason });
      if (reason === "timeout") {
        onItemTimeout?.({ id });
      }
    },
    [items, onItemClose, onItemTimeout, setItems],
  );

  return (
    <div
      className={cx(styles["ids-toast-viewport"], className)}
      data-ids="ids-toast-viewport"
      data-position={position}
      aria-live="polite"
      aria-atomic="false"
    >
      {visibleItems.map((item) => (
        <IdsToastItem
          key={item.id}
          id={item.id}
          type={item.type}
          message={item.message}
          duration={item.duration}
          closable={item.closable}
          link={item.link}
          role={item.role}
          onClose={({ reason }) => handleClose(item.id, reason)}
        />
      ))}
    </div>
  );
}

IdsToastViewport.displayName = "IdsToastViewport";
