import { useMemo, useState } from "react";
import styles from "./IdsLeftNavigation.module.css";

export interface IdsLeftNavigationItem {
  id: string;
  label: string;
  disabled?: boolean;
  href?: string;
  routeRef?: string;
  state?:
    | "default"
    | "hover"
    | "press"
    | "selected"
    | "default-focus"
    | "selected-focus";
}

export interface IdsLeftNavigationNavigateTarget {
  itemId: string;
  href?: string;
  routeRef?: string;
}

export interface IdsLeftNavigationProps {
  title?: string;
  items: IdsLeftNavigationItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  interactive?: boolean;
  /** Story/demo mode: render explicit per-item visual states. */
  forceStates?: boolean;
  ariaLabel?: string;
  onSelect?: (itemId: string) => void;
  onNavigate?: (target: IdsLeftNavigationNavigateTarget) => void;
}

function firstEnabledItemId(items: IdsLeftNavigationItem[]): string | undefined {
  return items.find((item) => !item.disabled)?.id;
}

export function IdsLeftNavigation({
  title = "Settings",
  items,
  selectedId,
  defaultSelectedId,
  interactive = true,
  forceStates = false,
  ariaLabel = "Left navigation",
  onSelect,
  onNavigate,
}: IdsLeftNavigationProps) {
  const initialSelected = useMemo(() => {
    const fallback = firstEnabledItemId(items);
    if (defaultSelectedId && items.some((item) => item.id === defaultSelectedId && !item.disabled)) {
      return defaultSelectedId;
    }
    return fallback;
  }, [defaultSelectedId, items]);

  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(initialSelected);
  const currentSelectedId = selectedId ?? internalSelectedId;

  return (
    <nav className={styles.root} aria-label={ariaLabel}>
      <div className={styles.title}>{title}</div>
      <div className={styles.list}>
        {items.map((item) => {
          const forcedState = forceStates ? item.state : undefined;
          const forcedSelected =
            forcedState === "selected" || forcedState === "selected-focus";
          const isSelected = forcedSelected || item.id === currentSelectedId;
          return (
            <button
              key={item.id}
              type="button"
              className={[
                styles.item,
                isSelected ? styles.itemSelected : "",
                item.disabled ? styles.itemDisabled : "",
                forcedState ? styles[`state${toPascal(forcedState)}`] : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={isSelected ? "page" : undefined}
              disabled={item.disabled || (!interactive && !forceStates)}
              onClick={() => {
                if (!interactive || item.disabled || forceStates) return;
                if (selectedId == null) setInternalSelectedId(item.id);
                onSelect?.(item.id);
                onNavigate?.({ itemId: item.id, href: item.href, routeRef: item.routeRef });
              }}
            >
              <span className={styles.itemLabel}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function toPascal(
  state: NonNullable<IdsLeftNavigationItem["state"]>,
): string {
  return state
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
