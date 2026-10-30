/**
 * IDS AlertGroup — host-owned multi-item global carousel (design-spec).
 *
 * Renders exactly one `IdsAlert` with `display="global"` bound to the active item.
 */

import React, { useCallback, useMemo, useState } from "react";
import {
  IdsAlert,
  type IdsAlertGlobalSeverity,
  type IdsAlertLink,
} from "./IdsAlert";

export interface IdsAlertItem {
  id?: string;
  severity?: IdsAlertGlobalSeverity;
  message: string;
  link?: IdsAlertLink;
  linkLabel?: string;
  linkHref?: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  onLinkClick?: () => void;
}

export interface IdsAlertGroupProps {
  items: IdsAlertItem[];
  /** 0-based. Uncontrolled default when `activeIndex` is omitted. */
  defaultActiveIndex?: number;
  /** Controlled active index. */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  /** When true (default), prev/next wrap; otherwise clamp. */
  wrap?: boolean;
  /** Called after an item is dismissed (removed from the local list when uncontrolled). */
  onItemsChange?: (items: IdsAlertItem[]) => void;
}

export function IdsAlertGroup({
  items: itemsProp,
  defaultActiveIndex = 0,
  activeIndex: activeIndexProp,
  onActiveIndexChange,
  wrap = true,
  onItemsChange,
}: IdsAlertGroupProps) {
  const [uncontrolledItems, setUncontrolledItems] = useState(itemsProp);
  const controlledItems = onItemsChange != null;
  const items = controlledItems ? itemsProp : uncontrolledItems;

  const [uncontrolledIndex, setUncontrolledIndex] = useState(
    Math.min(Math.max(0, defaultActiveIndex), Math.max(0, items.length - 1)),
  );
  const isIndexControlled = activeIndexProp != null;
  const activeIndex = isIndexControlled
    ? Math.min(Math.max(0, activeIndexProp), Math.max(0, items.length - 1))
    : Math.min(uncontrolledIndex, Math.max(0, items.length - 1));

  const setActiveIndex = useCallback(
    (next: number) => {
      if (!isIndexControlled) setUncontrolledIndex(next);
      onActiveIndexChange?.(next);
    },
    [isIndexControlled, onActiveIndexChange],
  );

  const setItems = useCallback(
    (next: IdsAlertItem[]) => {
      if (!controlledItems) setUncontrolledItems(next);
      onItemsChange?.(next);
    },
    [controlledItems, onItemsChange],
  );

  const active = items[activeIndex];

  const goPrevious = useCallback(() => {
    if (items.length <= 1) return;
    if (activeIndex <= 0) {
      if (wrap) setActiveIndex(items.length - 1);
      return;
    }
    setActiveIndex(activeIndex - 1);
  }, [activeIndex, items.length, setActiveIndex, wrap]);

  const goNext = useCallback(() => {
    if (items.length <= 1) return;
    if (activeIndex >= items.length - 1) {
      if (wrap) setActiveIndex(0);
      return;
    }
    setActiveIndex(activeIndex + 1);
  }, [activeIndex, items.length, setActiveIndex, wrap]);

  const carousel = useMemo(
    () =>
      items.length > 1
        ? {
            currentItem: activeIndex + 1,
            totalItems: items.length,
            onPrevious: goPrevious,
            onNext: goNext,
          }
        : undefined,
    [activeIndex, goNext, goPrevious, items.length],
  );

  if (!active || items.length === 0) return null;

  return (
    <IdsAlert
      display="global"
      severity={active.severity}
      message={active.message}
      link={active.link}
      linkLabel={active.linkLabel}
      linkHref={active.linkHref}
      onLinkClick={active.onLinkClick}
      actionLabel={active.actionLabel}
      onAction={active.onAction}
      dismissible={active.dismissible}
      carousel={carousel}
      onDismiss={() => {
        active.onDismiss?.();
        const next = items.filter((_, i) => i !== activeIndex);
        setItems(next);
        if (next.length === 0) return;
        setActiveIndex(Math.min(activeIndex, next.length - 1));
      }}
    />
  );
}

export default IdsAlertGroup;
