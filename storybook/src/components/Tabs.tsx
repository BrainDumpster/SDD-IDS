import { Menu } from "@base-ui-components/react/menu";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import shapePlusIcon from "../../../assets/icons/shape-plus.svg";
import chevDownIcon from "../../../assets/icons/chev-down.svg";
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
  minTabWidth?: number;
  maxTabWidth?: number;
}

export function Tabs({
  items,
  defaultActiveTabId,
  showAddTab = false,
  onAddTab,
  minTabWidth = 80,
  maxTabWidth = 250,
}: TabsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState<TabItem[]>(items);
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultActiveTabId ?? items[0]?.id ?? "",
  );
  const [visibleCount, setVisibleCount] = useState<number>(items.length);

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
      const addWidth = showAddTab ? 40 : 0;
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
  }, [tabs.length, showAddTab, minTabWidth]);

  const activeIndex = tabs.findIndex((t) => t.id === activeTabId);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const { visibleTabs, hiddenTabs } = useMemo(() => {
    if (tabs.length <= visibleCount) return { visibleTabs: tabs, hiddenTabs: [] };
    const nextVisible = tabs.slice(0, visibleCount);
    const nextHidden = tabs.slice(visibleCount);
    const activeTab = tabs[safeActiveIndex];
    if (
      activeTab &&
      !nextVisible.some((t) => t.id === activeTab.id) &&
      nextVisible.length > 0
    ) {
      const demoted = nextVisible[nextVisible.length - 1];
      nextVisible[nextVisible.length - 1] = activeTab;
      const hiddenWithoutActive = nextHidden.filter((t) => t.id !== activeTab.id);
      return { visibleTabs: nextVisible, hiddenTabs: [demoted, ...hiddenWithoutActive] };
    }
    return { visibleTabs: nextVisible, hiddenTabs: nextHidden };
  }, [tabs, visibleCount, safeActiveIndex]);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

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
              className={`${styles.tab} ${activeTabId === item.id ? styles.selected : ""}`}
              style={{ minWidth: `${minTabWidth}px`, maxWidth: `${maxTabWidth}px` }}
              onClick={() => setActiveTabId(item.id)}
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
              <Menu.Trigger className={styles.moreTrigger} aria-label="More tabs">
                More
                <img src={chevDownIcon} alt="" className={styles.moreIcon} />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner side="bottom" align="end" sideOffset={4}>
                  <Menu.Popup className={styles.moreMenu}>
                    {hiddenTabs.map((tab) => (
                      <Menu.Item
                        key={tab.id}
                        className={styles.moreItem}
                        onClick={() => setActiveTabId(tab.id)}
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
              className={styles.addButton}
              aria-label="Add tab"
              onClick={onAddTab}
            >
              <img src={shapePlusIcon} alt="" className={styles.addIcon} />
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
