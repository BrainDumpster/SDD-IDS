/**
 * IDS Tab — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/tab`
 * Source: `components/ids/tab/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Hierarchy (user / runtime composition):
 *   IdsTabs
 *     IdsTab (repeatable)
 *       IdsTabButton
 *       IdsTabContent
 *
 * Codegen slots: TabRoot → TabList → TabItem[] → Overflow* → AddTab* → ActiveTabPanel
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IdsBadge } from "../badge";
import { IdsButton, IdsButtonLeadingIcon } from "../button";
import { IdsIcon } from "../icon";
import styles from "./IdsTabs.module.css";

/* -------------------------------------------------------------------------- */
/* Types (Composition & API)                                                  */
/* -------------------------------------------------------------------------- */

export interface IdsTabItemInput {
  id: string;
  label: string;
  content: ReactNode;
  iconSlug?: string;
  badgeCount?: number;
  hasAlert?: boolean;
  closable?: boolean;
  disabled?: boolean;
}

export type IdsTabsType = "primary" | "secondary";
export type IdsTabsSurface = "elevated" | "transparent";

export interface IdsTabsProps {
  children?: ReactNode;
  /** Ordered tab items (convenience API; composes Tab → Button → Content). */
  items?: IdsTabItemInput[];
  /** `"secondary"` (default) or `"primary"`. */
  type?: IdsTabsType | string;
  /** Backward-compatible alias of `type`; `type` wins when both are set. */
  variant?: IdsTabsType | string;
  /** `"elevated"` (default) or `"transparent"`. Legacy `"white"` → `"elevated"`. */
  surface?: IdsTabsSurface | "white" | string;
  /** Controlled active tab id. */
  activeItemId?: string;
  /** Initial tab id for uncontrolled mode. */
  defaultActiveItemId?: string;
  onActiveItemChange?: (id: string) => void;
  /** Payload must include selected tab name (`label`). */
  onTabSelect?: (payload: { id: string; label: string }) => void;
  allowAddTab?: boolean;
  onAddTab?: () => void;
  /** Default `"Add Tab"`. */
  addTabLabel?: string;
  /** Enables responsive overflow-to-`More`; default `true`. */
  overflow?: boolean;
  /** Localized fallback label (default `"More"`). */
  moreLabel?: string;
  onOverflowSelection?: (id: string) => void;
  onItemsChange?: (items: IdsTabItemInput[]) => void;
  className?: string;
}

export interface IdsTabProps {
  id: string;
  disabled?: boolean;
  closable?: boolean;
  iconSlug?: string;
  badgeCount?: number;
  hasAlert?: boolean;
  children?: ReactNode;
}

export interface IdsTabButtonProps {
  children?: ReactNode;
  className?: string;
}

export interface IdsTabContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsTabSelectPayload {
  id: string;
  label: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const PLACEHOLDER_ITEM: IdsTabItemInput = {
  id: "placeholder",
  label: "Tab",
  content: "Placeholder content",
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveType(type: unknown, variant: unknown): IdsTabsType {
  const raw = type ?? variant;
  return raw === "primary" ? "primary" : "secondary";
}

function resolveSurface(surface: unknown): IdsTabsSurface {
  if (surface === "transparent") return "transparent";
  // Legacy alias `white` → elevated
  return "elevated";
}

function firstEnabledId(items: IdsTabItemInput[], preferred?: string): string {
  if (preferred && items.some((t) => t.id === preferred && !t.disabled)) {
    return preferred;
  }
  const enabled = items.find((t) => !t.disabled);
  return enabled?.id ?? items[0]?.id ?? PLACEHOLDER_ITEM.id;
}

function normalizeItems(items: IdsTabItemInput[] | undefined): IdsTabItemInput[] {
  if (!items || items.length === 0) return [{ ...PLACEHOLDER_ITEM }];
  return items;
}

function isIdsTabElement(node: ReactNode): node is ReactElement<IdsTabProps> {
  return isValidElement(node) && node.type === IdsTab;
}

function isIdsTabButtonElement(
  node: ReactNode,
): node is ReactElement<IdsTabButtonProps> {
  return isValidElement(node) && node.type === IdsTabButton;
}

function isIdsTabContentElement(
  node: ReactNode,
): node is ReactElement<IdsTabContentProps> {
  return isValidElement(node) && node.type === IdsTabContent;
}

function collectItemsFromChildren(children: ReactNode): IdsTabItemInput[] {
  const collected: IdsTabItemInput[] = [];
  Children.forEach(children, (child) => {
    if (!isIdsTabElement(child)) return;
    const {
      id,
      disabled,
      closable,
      iconSlug,
      badgeCount,
      hasAlert,
      children: tabChildren,
    } = child.props;

    let label = id;
    let content: ReactNode = null;

    Children.forEach(tabChildren, (part) => {
      if (isIdsTabButtonElement(part)) {
        const text = part.props.children;
        if (typeof text === "string" || typeof text === "number") {
          label = String(text);
        } else if (text != null) {
          label = String(text);
        }
      }
      if (isIdsTabContentElement(part)) {
        content = part.props.children;
      }
    });

    collected.push({
      id,
      label,
      content,
      iconSlug,
      badgeCount,
      hasAlert,
      closable,
      disabled,
    });
  });
  return collected;
}

/* -------------------------------------------------------------------------- */
/* Marker parts (composition carriers; rendered by IdsTabs)                   */
/* -------------------------------------------------------------------------- */

/** Repeatable tab item — carries Button + Content for parent collection. */
export function IdsTab(_props: IdsTabProps): null {
  return null;
}

/** Tab Button marker — label text is read by IdsTabs. */
export function IdsTabButton(_props: IdsTabButtonProps): null {
  return null;
}

/** Tab Content marker — panel body is read by IdsTabs. */
export function IdsTabContent(_props: IdsTabContentProps): null {
  return null;
}

/* -------------------------------------------------------------------------- */
/* Internal context (keyboard focus among visible tabs)                       */
/* -------------------------------------------------------------------------- */

interface IdsTabsContextValue {
  type: IdsTabsType;
  surface: IdsTabsSurface;
  activeItemId: string;
  reactId: string;
  selectTab: (id: string, label: string, source: "visible" | "overflow") => void;
  closeTab: (id: string) => void;
  registerTabButton: (id: string, el: HTMLButtonElement | null) => void;
  moveFocus: (fromId: string, direction: 1 | -1) => void;
  focusFirst: () => void;
  focusLast: () => void;
  visibleIds: string[];
}

const IdsTabsContext = createContext<IdsTabsContextValue | null>(null);

function useIdsTabs(component: string): IdsTabsContextValue {
  const ctx = useContext(IdsTabsContext);
  if (!ctx) {
    throw new Error(`${component} must be used within IdsTabs.`);
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* IdsTabs (root)                                                             */
/* -------------------------------------------------------------------------- */

export function IdsTabs({
  children,
  items: itemsProp,
  type: typeProp,
  variant: variantProp,
  surface: surfaceProp,
  activeItemId: activeItemIdProp,
  defaultActiveItemId,
  onActiveItemChange,
  onTabSelect,
  allowAddTab = false,
  onAddTab,
  addTabLabel = "Add Tab",
  overflow = true,
  moreLabel = "More",
  onOverflowSelection,
  onItemsChange,
  className,
}: IdsTabsProps) {
  const type = resolveType(typeProp, variantProp);
  const surface = resolveSurface(surfaceProp);
  const reactId = useId();

  const itemsFromChildren = useMemo(
    () => (itemsProp == null && children != null ? collectItemsFromChildren(children) : []),
    [children, itemsProp],
  );

  const sourceItems = useMemo(
    () => normalizeItems(itemsProp ?? (itemsFromChildren.length ? itemsFromChildren : undefined)),
    [itemsProp, itemsFromChildren],
  );

  const [internalItems, setInternalItems] = useState<IdsTabItemInput[]>(sourceItems);
  const itemsControlled = itemsProp !== undefined;

  useEffect(() => {
    if (itemsControlled) {
      setInternalItems(normalizeItems(itemsProp));
    } else if (itemsFromChildren.length) {
      setInternalItems(normalizeItems(itemsFromChildren));
    }
  }, [itemsControlled, itemsProp, itemsFromChildren]);

  const tabs = itemsControlled ? normalizeItems(itemsProp) : internalItems;

  const isActiveControlled = activeItemIdProp !== undefined;
  const [uncontrolledActive, setUncontrolledActive] = useState(() =>
    firstEnabledId(tabs, defaultActiveItemId),
  );

  const activeItemId = isActiveControlled
    ? firstEnabledId(tabs, activeItemIdProp)
    : firstEnabledId(tabs, uncontrolledActive);

  useEffect(() => {
    if (!isActiveControlled) {
      setUncontrolledActive((prev) => firstEnabledId(tabs, prev));
    }
  }, [tabs, isActiveControlled]);

  const setActive = useCallback(
    (id: string) => {
      if (!isActiveControlled) setUncontrolledActive(id);
      onActiveItemChange?.(id);
    },
    [isActiveControlled, onActiveItemChange],
  );

  const commitItems = useCallback(
    (next: IdsTabItemInput[]) => {
      if (!itemsControlled) setInternalItems(next);
      onItemsChange?.(next);
    },
    [itemsControlled, onItemsChange],
  );

  const [overflowLabel, setOverflowLabel] = useState<string | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [overflowCoords, setOverflowCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [highlightedOverflow, setHighlightedOverflow] = useState(0);
  const [visibleCount, setVisibleCount] = useState(tabs.length);

  const listRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);
  const overflowMenuRef = useRef<HTMLUListElement>(null);
  const tabButtonMap = useRef(new Map<string, HTMLButtonElement>());
  const addMeasureRef = useRef<HTMLButtonElement>(null);
  const moreMeasureRef = useRef<HTMLButtonElement>(null);

  const selectTab = useCallback(
    (id: string, label: string, source: "visible" | "overflow") => {
      setActive(id);
      onTabSelect?.({ id, label });
      if (source === "overflow") {
        setOverflowLabel(label);
        onOverflowSelection?.(id);
        setOverflowOpen(false);
      } else {
        setOverflowLabel(null);
      }
    },
    [setActive, onTabSelect, onOverflowSelection],
  );

  const closeTab = useCallback(
    (id: string) => {
      if (tabs.length <= 1) return;
      const idx = tabs.findIndex((t) => t.id === id);
      if (idx < 0) return;
      const next = tabs.filter((t) => t.id !== id);
      commitItems(next);
      if (activeItemId === id) {
        const nextActive = next[idx] ?? next[idx - 1] ?? next[0];
        if (nextActive) {
          setActive(nextActive.id);
          onTabSelect?.({ id: nextActive.id, label: nextActive.label });
        }
      }
    },
    [tabs, commitItems, activeItemId, setActive, onTabSelect],
  );

  const registerTabButton = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) tabButtonMap.current.set(id, el);
    else tabButtonMap.current.delete(id);
  }, []);

  const getVisibleEnabledIds = useCallback(() => {
    const visible = tabs.slice(0, visibleCount).filter((t) => !t.disabled);
    return visible.map((t) => t.id);
  }, [tabs, visibleCount]);

  const focusId = useCallback((id: string) => {
    tabButtonMap.current.get(id)?.focus();
  }, []);

  const moveFocus = useCallback(
    (fromId: string, direction: 1 | -1) => {
      const enabled = getVisibleEnabledIds();
      if (!enabled.length) return;
      const pos = enabled.indexOf(fromId);
      if (pos === -1) return;
      const next = enabled[(pos + direction + enabled.length) % enabled.length]!;
      focusId(next);
    },
    [getVisibleEnabledIds, focusId],
  );

  const focusFirst = useCallback(() => {
    const enabled = getVisibleEnabledIds();
    if (enabled.length) focusId(enabled[0]!);
  }, [getVisibleEnabledIds, focusId]);

  const focusLast = useCallback(() => {
    const enabled = getVisibleEnabledIds();
    if (enabled.length) focusId(enabled[enabled.length - 1]!);
  }, [getVisibleEnabledIds, focusId]);

  /* Overflow width measurement */
  useLayoutEffect(() => {
    if (!overflow) {
      setVisibleCount(tabs.length);
      return;
    }
    const list = listRef.current;
    const measure = measureRef.current;
    if (!list || !measure) return;

    const recompute = () => {
      const available = list.clientWidth;
      const addW = allowAddTab ? (addMeasureRef.current?.offsetWidth ?? 0) : 0;
      const tabEls = Array.from(
        measure.querySelectorAll<HTMLElement>("[data-measure-tab]"),
      );
      const widths = tabEls.map((el) => el.offsetWidth);

      const totalTabsW = widths.reduce((a, b) => a + b, 0);
      if (totalTabsW + addW <= available) {
        setVisibleCount(tabs.length);
        return;
      }

      const moreW = moreMeasureRef.current?.offsetWidth ?? 84;
      const budget = Math.max(0, available - addW - moreW);

      // Keep active tab visible; prefer leading tabs, then ensure active is included.
      let used = 0;
      let count = 0;
      for (let i = 0; i < widths.length; i += 1) {
        const w = widths[i] ?? 0;
        if (used + w > budget && count > 0) break;
        used += w;
        count += 1;
      }
      count = Math.max(1, Math.min(count, tabs.length));

      // Visible slots stay leading tabs; overflow selection does not replace them.
      // Active tab in overflow is reflected via overflow trigger label.
      count = Math.max(1, Math.min(count, tabs.length - 1));
      setVisibleCount(count);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(list);
    return () => ro.disconnect();
  }, [overflow, tabs, allowAddTab, addTabLabel, type]);

  useEffect(() => {
    if (visibleCount >= tabs.length && overflowLabel !== null) {
      setOverflowLabel(null);
    }
  }, [visibleCount, tabs.length, overflowLabel]);

  const visibleTabs = tabs.slice(0, visibleCount);
  const hiddenTabs =
    overflow && visibleCount < tabs.length ? tabs.slice(visibleCount) : [];

  const activeTab = tabs.find((t) => t.id === activeItemId) ?? tabs[0];

  const ctx = useMemo<IdsTabsContextValue>(
    () => ({
      type,
      surface,
      activeItemId,
      reactId,
      selectTab,
      closeTab,
      registerTabButton,
      moveFocus,
      focusFirst,
      focusLast,
      visibleIds: visibleTabs.map((t) => t.id),
    }),
    [
      type,
      surface,
      activeItemId,
      reactId,
      selectTab,
      closeTab,
      registerTabButton,
      moveFocus,
      focusFirst,
      focusLast,
      visibleTabs,
    ],
  );

  const closeOverflow = useCallback(() => {
    setOverflowOpen(false);
    setOverflowCoords(null);
  }, []);

  const openOverflow = useCallback(() => {
    const trigger = moreTriggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setOverflowCoords({ top: rect.bottom + 4, left: Math.max(4, rect.right - 160) });
    setHighlightedOverflow(0);
    setOverflowOpen(true);
  }, []);

  useEffect(() => {
    if (!overflowOpen) return;
    const onDoc = (event: MouseEvent) => {
      const t = event.target as Node;
      if (moreTriggerRef.current?.contains(t)) return;
      if (overflowMenuRef.current?.contains(t)) return;
      closeOverflow();
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeOverflow();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [overflowOpen, closeOverflow]);

  const typeClass =
    type === "primary" ? styles["ids-tab-button--primary"] : styles["ids-tab-button--secondary"];
  const moreTypeClass =
    type === "primary"
      ? styles["ids-tabs-overflow-trigger--primary"]
      : styles["ids-tabs-overflow-trigger--secondary"];
  const addTypeClass = type === "primary" ? styles["ids-tabs-add--primary"] : undefined;

  const overflowSelected = overflowLabel != null;

  return (
    <IdsTabsContext.Provider value={ctx}>
      <div
        className={cx(styles["ids-tabs"], className)}
        data-ids="ids-tabs"
        data-type={type}
        data-surface={surface}
        data-overflow={overflow ? "true" : "false"}
      >
        {/* Measure row */}
        <div className={styles["ids-tabs-measure"]} ref={measureRef} aria-hidden="true">
          {tabs.map((item) => (
            <span
              key={`measure-${item.id}`}
              data-measure-tab
              className={cx(
                styles["ids-tab-button"],
                typeClass,
                item.closable && styles["ids-tab-button--has-close"],
              )}
            >
              <span className={styles["ids-tab-button-inner"]}>
                {item.iconSlug ? <span className={styles["ids-tab-button-icon"]} /> : null}
                <span className={styles["ids-tab-button-label"]}>{item.label}</span>
                {item.badgeCount != null && item.badgeCount > 0 ? (
                  <IdsBadge value={item.badgeCount} type={item.hasAlert ? "critical" : "default"} />
                ) : null}
                {item.hasAlert && !(item.badgeCount != null && item.badgeCount > 0) ? (
                  <span className={styles["ids-tab-button-icon"]} />
                ) : null}
              </span>
              {item.closable ? <span style={{ width: 24, height: 24 }} /> : null}
            </span>
          ))}
          <button
            type="button"
            ref={moreMeasureRef}
            className={cx(styles["ids-tabs-overflow-trigger"], moreTypeClass)}
            tabIndex={-1}
          >
            {moreLabel}
            <span className={styles["ids-tabs-overflow-icon"]} />
          </button>
          {allowAddTab ? (
            <button
              type="button"
              ref={addMeasureRef}
              className={cx(styles["ids-tabs-add"], addTypeClass)}
              tabIndex={-1}
            >
              <span className={styles["ids-tabs-add-icon"]} />
              <span className={styles["ids-tabs-add-label"]}>{addTabLabel}</span>
            </button>
          ) : null}
        </div>

        <div className={styles["ids-tabs-list-wrap"]}>
          <div
            ref={listRef}
            className={styles["ids-tabs-list"]}
            role="tablist"
            aria-label="Tabs"
            data-ids="ids-tabs-list"
          >
            {visibleTabs.map((item) => (
              <TabButtonView key={item.id} item={item} />
            ))}

            {hiddenTabs.length > 0 ? (
              <>
                <button
                  ref={moreTriggerRef}
                  type="button"
                  className={cx(styles["ids-tabs-overflow-trigger"], moreTypeClass)}
                  data-ids="ids-tabs-overflow-trigger"
                  data-selected={overflowSelected ? "true" : "false"}
                  aria-label="More tabs"
                  aria-expanded={overflowOpen}
                  aria-haspopup="menu"
                  onClick={() => (overflowOpen ? closeOverflow() : openOverflow())}
                >
                  {overflowLabel ?? moreLabel}
                  <IdsIcon
                    shape="arrow-tri-down-solid"
                    size={10}
                    className={styles["ids-tabs-overflow-icon"]}
                    color="currentColor"
                  />
                </button>
                {overflowOpen && overflowCoords
                  ? createPortal(
                      <ul
                        ref={overflowMenuRef}
                        className={styles["ids-tabs-overflow-menu"]}
                        role="menu"
                        style={{
                          position: "fixed",
                          top: overflowCoords.top,
                          left: overflowCoords.left,
                        }}
                      >
                        {hiddenTabs.map((tab, index) => (
                          <li key={tab.id} role="none">
                            <button
                              type="button"
                              role="menuitem"
                              className={styles["ids-tabs-overflow-item"]}
                              data-highlighted={highlightedOverflow === index ? "true" : "false"}
                              disabled={tab.disabled}
                              onMouseEnter={() => setHighlightedOverflow(index)}
                              onClick={() => {
                                if (tab.disabled) return;
                                selectTab(tab.id, tab.label, "overflow");
                              }}
                            >
                              {tab.label}
                            </button>
                          </li>
                        ))}
                      </ul>,
                      document.body,
                    )
                  : null}
              </>
            ) : null}

            {allowAddTab ? (
              <button
                type="button"
                className={cx(styles["ids-tabs-add"], addTypeClass)}
                data-ids="ids-tabs-add"
                aria-label={addTabLabel}
                onClick={() => onAddTab?.()}
              >
                <IdsIcon
                  shape="state-add-circ-solid"
                  size={16}
                  className={styles["ids-tabs-add-icon"]}
                  color="currentColor"
                />
                <span className={styles["ids-tabs-add-label"]}>{addTabLabel}</span>
              </button>
            ) : null}
          </div>
        </div>

        {activeTab ? (
          <div
            id={`${reactId}-panel-${activeTab.id}`}
            role="tabpanel"
            aria-labelledby={`${reactId}-tab-${activeTab.id}`}
            className={styles["ids-tab-content"]}
            data-ids="ids-tab-content"
          >
            {activeTab.content}
          </div>
        ) : null}
      </div>
    </IdsTabsContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Tab button (runtime view of IdsTabButton)                                  */
/* -------------------------------------------------------------------------- */

function TabButtonView({ item }: { item: IdsTabItemInput }) {
  const root = useIdsTabs("IdsTabButton");
  const selected = root.activeItemId === item.id;
  const typeClass =
    root.type === "primary"
      ? styles["ids-tab-button--primary"]
      : styles["ids-tab-button--secondary"];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        root.moveFocus(item.id, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        root.moveFocus(item.id, -1);
        break;
      case "Home":
        event.preventDefault();
        root.focusFirst();
        break;
      case "End":
        event.preventDefault();
        root.focusLast();
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!item.disabled) root.selectTab(item.id, item.label, "visible");
        break;
      default:
        break;
    }
  };

  return (
    <button
      type="button"
      role="tab"
      id={`${root.reactId}-tab-${item.id}`}
      aria-controls={`${root.reactId}-panel-${item.id}`}
      aria-selected={selected}
      disabled={item.disabled}
      data-ids="ids-tab-button"
      className={cx(
        styles["ids-tab-button"],
        typeClass,
        item.closable && styles["ids-tab-button--has-close"],
      )}
      onClick={() => {
        if (!item.disabled) root.selectTab(item.id, item.label, "visible");
      }}
      onKeyDown={onKeyDown}
      ref={(el) => root.registerTabButton(item.id, el)}
    >
      <span className={styles["ids-tab-button-inner"]}>
        {item.iconSlug ? (
          <span className={styles["ids-tab-button-icon"]}>
            <IdsIcon shape={item.iconSlug} size={16} color="currentColor" />
          </span>
        ) : null}
        <span className={styles["ids-tab-button-label"]}>{item.label}</span>
        {item.badgeCount != null && item.badgeCount > 0 ? (
          <IdsBadge value={item.badgeCount} type={item.hasAlert ? "critical" : "default"} />
        ) : null}
        {item.hasAlert && !(item.badgeCount != null && item.badgeCount > 0) ? (
          <span className={styles["ids-tab-button-icon"]}>
            <IdsIcon shape="status-critical-circ-solid-16" size={16} variant="img" />
          </span>
        ) : null}
      </span>
      {item.closable ? (
        <IdsButton
          className={styles["ids-tab-button-close"]}
          variant="tertiary"
          size="medium"
          iconOnly
          ariaLabel={`Close ${item.label}`}
          onClick={(event) => {
            event.stopPropagation();
            root.closeTab(item.id);
          }}
        >
          <IdsButtonLeadingIcon>
            <IdsIcon
              shape="ctrl-close-16"
              size={16}
              color="var(--color-icon-gray-neutral-base)"
            />
          </IdsButtonLeadingIcon>
        </IdsButton>
      ) : null}
    </button>
  );
}

/** Compound namespace: Tabs → Tab → Button / Content */
export const IdsTabsCompound = Object.assign(IdsTabs, {
  Tab: IdsTab,
  Button: IdsTabButton,
  Content: IdsTabContent,
});

export default IdsTabsCompound;
