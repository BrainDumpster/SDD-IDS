import React from "react";
import "./Tab.css";

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  iconSlug?: string;
  badgeCount?: number;
  hasAlert?: boolean;
  closable?: boolean;
  disabled?: boolean;
}

export interface TabProps {
  items: TabItem[];
  type?: "primary" | "secondary";
  activeItemId?: string;
  defaultActiveItemId?: string;
  onActiveItemChange?: (id: string) => void;
  onTabSelect?: (payload: { id: string; label: string }) => void;
  allowAddTab?: boolean;
  onAddTab?: () => void;
  addTabLabel?: string;
  overflow?: boolean;
  moreLabel?: string;
  onOverflowSelection?: (id: string) => void;
  onItemsChange?: (items: TabItem[]) => void;
}

const Tab: React.FC<TabProps> = ({
  items,
  type = "secondary",
  activeItemId: controlledActiveItemId,
  defaultActiveItemId,
  onActiveItemChange,
  onTabSelect,
  allowAddTab = false,
  onAddTab,
  addTabLabel = "Add Tab",
  overflow = false,
  moreLabel = "More",
  onOverflowSelection,
  onItemsChange,
}) => {
  const [internalActiveItemId, setInternalActiveItemId] = React.useState(
    defaultActiveItemId || (items.length > 0 ? items[0].id : "")
  );
  const isControlled = controlledActiveItemId !== undefined;
  const activeItemId = isControlled ? controlledActiveItemId : internalActiveItemId;

  const handleTabClick = (item: TabItem) => {
    if (item.disabled) return;

    if (!isControlled) {
      setInternalActiveItemId(item.id);
    }
    onActiveItemChange?.(item.id);
    onTabSelect?.({ id: item.id, label: item.label });
  };

  const handleAddTab = () => {
    onAddTab?.();
  };

  const renderIcon = (iconSlug?: string) => {
    if (!iconSlug) return null;
    return <img src={`assets/icons/${iconSlug}.svg`} alt="" className="tab__icon" width={16} height={16} />;
  };

  const renderBadge = (count?: number, hasAlert?: boolean) => {
    if (hasAlert) {
      return <span className="tab__alert" />;
    }
    if (count !== undefined && count > 0) {
      return <span className="tab__badge">{count}</span>;
    }
    return null;
  };

  const renderCloseButton = (item: TabItem) => {
    if (!item.closable) return null;
    return (
      <button
        type="button"
        className="tab__close"
        onClick={(e) => {
          e.stopPropagation();
          // Handle close logic here
        }}
        aria-label={`Close ${item.label} tab`}
      >
        <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </button>
    );
  };

  const activeItem = items.find((item) => item.id === activeItemId);

  return (
    <div className="tab">
      <div className={`tab__list tab__list--${type}`} role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            className={`tab__item ${item.id === activeItemId ? "tab__item--active" : ""} ${item.disabled ? "tab__item--disabled" : ""}`}
            role="tab"
            aria-selected={item.id === activeItemId}
            aria-controls={`panel-${item.id}`}
            disabled={item.disabled}
            onClick={() => handleTabClick(item)}
            type="button"
          >
            {renderIcon(item.iconSlug)}
            <span className="tab__label">{item.label}</span>
            {renderBadge(item.badgeCount, item.hasAlert)}
            {renderCloseButton(item)}
          </button>
        ))}
        {allowAddTab && (
          <button
            type="button"
            className="tab__add"
            onClick={handleAddTab}
            aria-label={addTabLabel}
          >
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
            <span className="tab__label">{addTabLabel}</span>
          </button>
        )}
      </div>
      {activeItem && activeItem.content && (
        <div
          id={`panel-${activeItem.id}`}
          className="tab__panel"
          role="tabpanel"
          aria-labelledby={`tab-${activeItem.id}`}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
};

export default Tab;
