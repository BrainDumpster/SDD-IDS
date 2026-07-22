import React, { useState } from "react";
import "./MainMenuLeft.css";

export interface MainMenuLeftLink {
  type?: "href" | "routerLink" | "action";
  href?: string;
  routerLink?: string | string[];
}

export interface MainMenuLeftSecondaryItem {
  id?: string;
  name?: string;
  label?: string;
  tooltip?: string;
  link?: MainMenuLeftLink;
}

export interface MainMenuLeftPrimaryItem {
  id?: string;
  name?: string;
  label?: string;
  tooltip?: string;
  iconName?: string;
  link?: MainMenuLeftLink;
  children?: MainMenuLeftSecondaryItem[];
  childrenMenu?: "expanded" | "collapsed";
}

export interface MainMenuLeftLogo {
  alt: string;
  src?: string;
  iconName?: string;
  tooltip?: string;
  link?: MainMenuLeftLink;
}

export interface MainMenuLeftSelectionDetail {
  level: "primary" | "secondary";
  itemId: string;
  parentItemId?: string;
  name: string;
  link?: MainMenuLeftLink;
}

export interface MainMenuLeftNavigationTarget {
  itemId: string;
  parentItemId?: string;
  name: string;
  link?: MainMenuLeftLink;
}

export interface MainMenuLeftProps {
  logo?: MainMenuLeftLogo;
  items: MainMenuLeftPrimaryItem[];
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  defaultSelectedItemId?: string;
  onSelected?: (detail: MainMenuLeftSelectionDetail) => void;
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
  forceStates?: boolean;
  ariaLabel?: string;
  hoverToOpen?: boolean;
}

const MainMenuLeft: React.FC<MainMenuLeftProps> = ({
  logo,
  items,
  expanded: controlledExpanded,
  onExpandedChange,
  defaultSelectedItemId,
  onSelected,
  onNavigate,
  forceStates,
  ariaLabel = "Main menu left",
  hoverToOpen = true,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(defaultSelectedItemId);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [pinnerExpanded, setPinnerExpanded] = useState(false);

  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const toggleExpanded = () => {
    const newPinnerExpanded = !pinnerExpanded;
    setPinnerExpanded(newPinnerExpanded);
    if (!isControlled) {
      setInternalExpanded(newPinnerExpanded);
    }
    onExpandedChange?.(newPinnerExpanded);
  };

  const handleMouseEnter = () => {
    if (hoverToOpen && !isControlled && !expanded) {
      setInternalExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverToOpen && !isControlled && expanded && !pinnerExpanded) {
      setInternalExpanded(false);
    }
  };

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handlePrimaryClick = (item: MainMenuLeftPrimaryItem) => {
    const itemId = item.id || item.name || item.label || "";
    setSelectedItemId(itemId);
    setSelectedChildId(null);
    onSelected?.({
      level: "primary",
      itemId,
      name: item.name || item.label || "",
      link: item.link,
    });
    onNavigate?.({
      itemId,
      name: item.name || item.label || "",
      link: item.link,
    });
    // Collapse if no children, hoverToOpen is enabled, and not pinned
    if (hoverToOpen && !isControlled && !item.children && !pinnerExpanded) {
      setInternalExpanded(false);
    }
  };

  const handleChevronClick = (e: React.MouseEvent, item: MainMenuLeftPrimaryItem) => {
    e.stopPropagation();
    const itemId = item.id || item.name || item.label || "";
    toggleItemExpanded(itemId);
  };

  const handleSecondaryClick = (item: MainMenuLeftSecondaryItem, parentItem: MainMenuLeftPrimaryItem) => {
    const parentId = parentItem.id || parentItem.name || parentItem.label || "";
    const itemId = item.id || item.name || item.label || "";
    setSelectedItemId(parentId);
    setSelectedChildId(itemId);
    onSelected?.({
      level: "secondary",
      itemId,
      parentItemId: parentId,
      name: item.name || item.label || "",
      link: item.link,
    });
    onNavigate?.({
      itemId,
      parentItemId: parentId,
      name: item.name || item.label || "",
      link: item.link,
    });
    // Collapse when clicking child if hoverToOpen is enabled and not pinned
    if (hoverToOpen && !isControlled && !pinnerExpanded) {
      setInternalExpanded(false);
    }
  };

  const renderIcon = (iconName?: string) => {
    const name = iconName || "home";
    const icons: { [key: string]: JSX.Element } = {
      home: (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 6L8 2L14 6V14C14 14.5304 13.7893 15.0391 13.4142 15.4142C13.0391 15.7893 12.5304 16 12 16H4C3.46957 16 2.96086 15.7893 2.58579 15.4142C2.21071 15.0391 2 14.5304 2 14V6Z" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      ),
      box: (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4L8 2L14 4V12L8 14L2 12V4Z" stroke="currentColor" strokeWidth={1.5} />
          <path d="M2 4L8 8L14 4" stroke="currentColor" strokeWidth={1.5} />
          <path d="M8 8V14" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      ),
      "shopping-cart": (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 2H3L4 12H13L14 4H4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="5" cy="14" r="1.5" stroke="currentColor" strokeWidth={1.5} />
          <circle cx="12" cy="14" r="1.5" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      ),
      "user-group": (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth={1.5} />
          <path d="M1 14C1 11 3 10 6 10C9 10 11 11 11 14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          <circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth={1.5} />
          <path d="M12 7C13.5 7 14.5 8 15 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      ),
      analytics: (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 14V6L6 10L10 4L14 8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      "file-text": (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 2H10L14 6V14H4V2Z" stroke="currentColor" strokeWidth={1.5} />
          <path d="M10 2V6H14" stroke="currentColor" strokeWidth={1.5} />
          <path d="M6 8H10" stroke="currentColor" strokeWidth={1.5} />
          <path d="M6 10H10" stroke="currentColor" strokeWidth={1.5} />
          <path d="M6 12H8" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      ),
      settings: (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth={1.5} />
          <path d="M8 1V3M8 13V15M1 8H3M13 8H15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          <path d="M3.5 3.5L5 5M11 11L12.5 12.5M12.5 3.5L11 5M5 11L3.5 12.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      ),
    };
    return icons[name] || icons.home;
  };

  const renderChevron = (isExpanded: boolean) => (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={isExpanded ? "M2 5L7 10L12 5" : "M5 2L10 7L5 12"} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const renderExpandIcon = () => (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={pinnerExpanded ? "M10 4L6 8L10 12" : "M6 4L10 8L6 12"} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <nav 
      className={`main-menu-left ${!expanded ? "main-menu-left--collapsed" : ""}`} 
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {logo && (
        <div className="main-menu-left__logo">
          {logo.iconName ? (
            <div className="main-menu-left__logo-icon">
              {renderIcon(logo.iconName)}
            </div>
          ) : logo.src && (
            <img src={logo.src} alt={logo.alt} className="main-menu-left__logo-img" />
          )}
        </div>
      )}
      <div className="main-menu-left__list">
        {items.map((item) => {
          const itemId = item.id || item.name || item.label || "";
          const isSelected = selectedItemId === itemId;
          const isItemExpanded = expandedItems.has(itemId);
          const hasChildren = item.children && item.children.length > 0;
          const showChildren = !!(expanded && hasChildren && (forceStates ? item.childrenMenu === "expanded" : isItemExpanded));

          return (
            <div key={itemId} className="main-menu-left__item-group">
              <button
                type="button"
                className={`main-menu-left__primary-item ${isSelected ? "main-menu-left__primary-item--selected" : ""}`}
                onClick={() => handlePrimaryClick(item)}
                aria-current={isSelected ? "page" : undefined}
                aria-expanded={hasChildren ? showChildren : false}
                title={item.tooltip || (expanded ? "" : item.name || item.label)}
              >
                <span className="main-menu-left__primary-icon">
                  {renderIcon(item.iconName)}
                </span>
                {expanded && (
                  <>
                    <span className="main-menu-left__primary-label">{item.name || item.label}</span>
                    {hasChildren && (
                      <span className="main-menu-left__chevron" onClick={(e) => handleChevronClick(e, item)}>
                        {renderChevron(showChildren)}
                      </span>
                    )}
                  </>
                )}
              </button>
              {showChildren && item.children && (
                <div className="main-menu-left__secondary-list">
                  {item.children.map((child) => {
                    const childId = child.id || child.name || child.label || "";
                    const isChildSelected = selectedChildId === childId;
                    return (
                      <button
                        key={childId}
                        type="button"
                        className={`main-menu-left__secondary-item ${isChildSelected ? "main-menu-left__secondary-item--selected" : ""}`}
                        onClick={() => handleSecondaryClick(child, item)}
                        aria-current={isChildSelected ? "page" : undefined}
                        title={child.tooltip}
                      >
                        {child.name || child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="main-menu-left__expand-collapse"
        onClick={toggleExpanded}
        aria-label={expanded ? "Collapse menu" : "Expand menu"}
      >
        <span className="main-menu-left__expand-icon">{renderExpandIcon()}</span>
      </button>
    </nav>
  );
};

export default MainMenuLeft;
