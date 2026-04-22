import { Menu } from "@base-ui-components/react/menu";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import stateAddCircSolidIcon from "../../../assets/icons/state-add-circ-solid.svg";
import arrowTriDownSolidIcon from "../../../assets/icons/arrow-tri-down-solid.svg";
import shapeXIcon from "../../../assets/icons/shape-x.svg";
import styles from "./Tabs.module.css";

interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
  icon?: ReactNode;
  closable?: boolean;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveTabId?: string;
  showAddTab?: boolean;
  onAddTab?: () => void;
  addTabLabel?: string;
  minTabWidth?: number;
  maxTabWidth?: number;
  variant?: "primary" | "secondary";
  moreLabel?: string;
}

export function Tabs({
  items,
  defaultActiveTabId,
  showAddTab = false,
  onAddTab,
  addTabLabel = "Add Tab",
  minTabWidth = 80,
  maxTabWidth = 250,
  variant = "secondary",
  moreLabel = "More",
}: TabsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState<TabItem[]>(items);
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultActiveTabId ?? items[0]?.id ?? "",
  );
  const [visibleCount, setVisibleCount] = useState<number>(items.length);
  const [overflowLabel, setOverflowLabel] = useState<string | null>(null);

  useEffect(() => {
    setTabs(items);
    if (!items.some((t) => t.id === activeTabId)) {
      setActiveTabId(defaultActiveTabId ?? items[0]?.id ?? "");
    }
  }, [items, activeTabId, defaultActiveTabId]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const recomputeVisibleCount = () => {
      const available = list.clientWidth;
      const moreWidth = 84;
      const addWidth = showAddTab
        ? Math.min(220, Math.max(56, 36 + addTabLabel.length * 8))
        : 0;
      const perTab = Math.max(minTabWidth, 80);
      const maxVisible = Math.max(
        1,
        Math.floor((available - addWidth - moreWidth) / perTab),
      );
      setVisibleCount(Math.min(maxVisible, tabs.length));
    };

    recomputeVisibleCount();
    const ro = new ResizeObserver(recomputeVisibleCount);
    ro.observe(list);
    return () => ro.disconnect();
  }, [tabs.length, showAddTab, minTabWidth, addTabLabel]);

  const { visibleTabs, hiddenTabs } = useMemo(() => {
    if (tabs.length <= visibleCount) return { visibleTabs: tabs, hiddenTabs: [] };
    return {
      visibleTabs: tabs.slice(0, visibleCount),
      hiddenTabs: tabs.slice(visibleCount),
    };
  }, [tabs, visibleCount]);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  useEffect(() => {
    if (hiddenTabs.length === 0 && overflowLabel !== null) {
      setOverflowLabel(null);
    }
  }, [hiddenTabs.length, overflowLabel]);

  const closeTab = (id: string) => {
    if (tabs.length <= 1) return;
    const idx = tabs.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const nextTabs = tabs.filter((t) => t.id !== id);
    setTabs(nextTabs);
    if (activeTabId === id) {
      const nextActive = nextTabs[idx] ?? nextTabs[idx - 1] ?? nextTabs[0];
      if (nextActive) setActiveTabId(nextActive.id);
    }
  };

  const handleVisibleTabSelect = (id: string) => {
    setActiveTabId(id);
    setOverflowLabel(null);
  };

  const handleHiddenTabSelect = (id: string, label: string) => {
    setActiveTabId(id);
    setOverflowLabel(label);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <div ref={listRef} className={styles.listWrap}>
        <div className={styles.list} role="tablist" aria-label="Tabs">
          {visibleTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-controls={`panel-${item.id}`}
              aria-selected={activeTabId === item.id}
              disabled={item.disabled}
              className={[
                styles.tab,
                variant === "primary" ? styles.tabPrimary : styles.tabSecondary,
                activeTabId === item.id ? styles.selected : "",
              ].join(" ")}
              style={{ minWidth: `${minTabWidth}px`, maxWidth: `${maxTabWidth}px` }}
              onClick={() => handleVisibleTabSelect(item.id)}
            >
              {item.icon ? <span className={styles.tabIcon}>{item.icon}</span> : null}
              <span className={styles.tabLabel}>{item.label}</span>
              {item.closable ? (
                <span
                  className={styles.close}
                  role="button"
                  aria-label={`Close ${item.label}`}
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(item.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      closeTab(item.id);
                    }
                  }}
                >
                  <img src={shapeXIcon} alt="" className={styles.closeIcon} />
                </span>
              ) : null}
            </button>
          ))}

          {hiddenTabs.length > 0 ? (
            <Menu.Root>
              <Menu.Trigger
                className={[
                  styles.moreTrigger,
                  overflowLabel ? styles.moreTriggerSelected : "",
                  variant === "primary"
                    ? styles.moreTriggerPrimary
                    : styles.moreTriggerSecondary,
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label="More tabs"
              >
                {overflowLabel ?? moreLabel}
                <img src={arrowTriDownSolidIcon} alt="" className={styles.moreIcon} />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner side="bottom" align="end" sideOffset={4}>
                  <Menu.Popup className={styles.moreMenu}>
                    {hiddenTabs.map((tab) => (
                      <Menu.Item
                        key={tab.id}
                        className={styles.moreItem}
                        onClick={() => handleHiddenTabSelect(tab.id, tab.label)}
                      >
                        {tab.label}
                      </Menu.Item>
                    ))}
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          ) : null}

          {showAddTab ? (
            <button
              type="button"
              className={[
                styles.addButton,
                variant === "primary" ? styles.addButtonPrimary : styles.addButtonSecondary,
              ].join(" ")}
              aria-label={addTabLabel}
              onClick={onAddTab}
            >
              <img src={stateAddCircSolidIcon} alt="" className={styles.addIcon} />
              <span className={styles.addLabel}>{addTabLabel}</span>
            </button>
          ) : null}
        </div>
      </div>

      {activeTab ? (
        <div
          id={`panel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.id}`}
          className={styles.panel}
        >
          {activeTab.panel}
        </div>
      ) : null}
    </div>
  );
}
