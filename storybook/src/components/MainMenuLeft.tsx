import { useState } from "react";
import styles from "./MainMenuLeft.module.css";
import { Icon } from "./Icon";

export type MainMenuLeftPrimaryState =
  | "default"
  | "hover"
  | "press"
  | "selected"
  | "default-focus"
  | "selected-focus";

export interface MainMenuLeftSecondaryItem {
  id: string;
  label: string;
  href?: string;
  routeRef?: string;
}

export interface MainMenuLeftPrimaryItem {
  id: string;
  label: string;
  /** Canonical icon slug used by the shared Icon component. */
  iconName?: string;
  href?: string;
  routeRef?: string;
  state?: MainMenuLeftPrimaryState;
  secondaryMenu?: "expanded" | "collapsed";
  secondaryItems?: MainMenuLeftSecondaryItem[];
}

export interface MainMenuLeftNavigationTarget {
  itemId: string;
  parentItemId?: string;
  href?: string;
  routeRef?: string;
}

export interface MainMenuLeftProps {
  /** Initial render state for Storybook/demo runtime. */
  expanded?: boolean;
  items: MainMenuLeftPrimaryItem[];
  /** When true, item.state is treated as fixed visual snapshots (no runtime interaction mutations). */
  forceStates?: boolean;
  /** Optional navigation hook with routing metadata from item interfaces. */
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
}

export function MainMenuLeft({
  expanded = true,
  items,
  forceStates = false,
  onNavigate,
}: MainMenuLeftProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [expandedSecondaryKey, setExpandedSecondaryKey] = useState<string | null>(null);
  const [selectedSecondaryParentKey, setSelectedSecondaryParentKey] = useState<string | null>(null);
  const [selectedSecondaryKey, setSelectedSecondaryKey] = useState<string | null>(null);

  return (
    <nav
      className={[styles.root, isExpanded ? styles.expanded : styles.collapsed].join(" ")}
      aria-label="Main menu left"
    >
      <div className={styles.content}>
        {items.map((item) => {
          const hasForcedState = forceStates && Boolean(item.state);
          const state = hasForcedState
            ? item.state!
            : selectedKey === item.id
              ? "selected"
              : "default";
          const isSelected = state === "selected" || state === "selected-focus";
          const isFocused = state === "default-focus" || state === "selected-focus";
          const hasSecondaryItems = (item.secondaryItems?.length ?? 0) > 0;
          const showSecondary = isExpanded && hasSecondaryItems && (hasForcedState
            ? item.secondaryMenu === "expanded"
            : expandedSecondaryKey === item.id);
          const showChevron = isExpanded && hasSecondaryItems;
          const primaryIconName = item.iconName ?? "home";
          const hasSelectedSecondary = selectedSecondaryParentKey === item.id;
          const showSelectedInset = hasForcedState
            ? state === "selected" || state === "selected-focus"
            : hasSecondaryItems
              ? hasSelectedSecondary
              : selectedKey === item.id;

          return (
            <div key={item.id} className={styles.itemBlock}>
              <button
                type="button"
                onClick={() => {
                  if (hasForcedState) return;
                  setSelectedKey(item.id);
                  onNavigate?.({
                    itemId: item.id,
                    href: item.href,
                    routeRef: item.routeRef,
                  });
                  if (!hasSecondaryItems) {
                    setSelectedSecondaryParentKey(null);
                    setSelectedSecondaryKey(null);
                    return;
                  }
                  if (!isExpanded) return;
                  setExpandedSecondaryKey((prev) => {
                    const next = prev === item.id ? null : item.id;
                    if (next === null) {
                      setSelectedSecondaryParentKey(null);
                      setSelectedSecondaryKey(null);
                    }
                    return next;
                  });
                }}
                className={[
                  styles.primaryRow,
                  !hasForcedState ? styles.interactive : "",
                  styles[`state${toPascal(state)}`],
                  hasSelectedSecondary ? styles.secondaryParentSelected : "",
                  showSelectedInset ? styles.selected : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={isSelected ? "page" : undefined}
                aria-expanded={showChevron ? showSecondary : undefined}
              >
                <Icon shapeName={primaryIconName} className={styles.primaryIcon} />
                {isExpanded ? <span className={styles.primaryLabel}>{item.label}</span> : null}
                {showChevron ? (
                  <Icon
                    shapeName={showSecondary ? "chev-down-thick" : "chev-right-thick"}
                    className={styles.chevronIcon}
                  />
                ) : null}
                {isFocused ? <span className={styles.focusRing} aria-hidden="true" /> : null}
                {showSelectedInset ? <span className={styles.selectedInset} aria-hidden="true" /> : null}
              </button>

              {showSecondary ? (
                <div className={styles.secondarySection}>
                  {(item.secondaryItems ?? []).map((secondary) => (
                    <button
                      key={secondary.id}
                      type="button"
                      className={[
                        styles.secondaryRow,
                        styles.secondaryInteractive,
                        selectedSecondaryParentKey === item.id && selectedSecondaryKey === secondary.id
                          ? styles.secondaryRowSelected
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => {
                        setSelectedSecondaryParentKey(item.id);
                        setSelectedSecondaryKey(secondary.id);
                        onNavigate?.({
                          itemId: secondary.id,
                          parentItemId: item.id,
                          href: secondary.href,
                          routeRef: secondary.routeRef,
                        });
                      }}
                    >
                      {secondary.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className={styles.bottomToggle}>
        <button
          type="button"
          className={styles.bottomToggleButton}
          aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
          onClick={() => {
            setIsExpanded((prev) => !prev);
            setExpandedSecondaryKey(null);
          }}
        >
          <Icon
            shapeName={isExpanded ? "double-chev-left" : "double-chev-right"}
            className={styles.bottomToggleIcon}
          />
        </button>
      </div>
    </nav>
  );
}

function toPascal(value: MainMenuLeftPrimaryState): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
