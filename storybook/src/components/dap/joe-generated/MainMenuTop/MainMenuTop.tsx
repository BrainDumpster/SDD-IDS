import React, { useState } from "react";
import "./MainMenuTop.css";

export interface MainMenuTopLink {
  type?: "href" | "routerLink" | "action";
  href?: string;
  routerLink?: string | string[];
}

export interface MainMenuTopMenuOption {
  id: string;
  label: string;
  disabled?: boolean;
  kind?: "item" | "group" | "submenu";
  children?: MainMenuTopMenuOption[];
}

export interface MainMenuTopItem {
  id: string;
  name: string;
  iconName?: string;
  dropdown?: boolean;
  showIcon?: boolean;
  tooltip?: string;
  link?: MainMenuTopLink;
  menuOptions?: MainMenuTopMenuOption[];
}

export interface MainMenuTopProps {
  items?: MainMenuTopItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  size?: "Large" | "Small";
  onMenuItemSelect?: (detail: {
    id: string;
    name: string;
    selected: boolean;
    link?: MainMenuTopLink;
    menuOptionId?: string;
  }) => void;
  ariaLabel?: string;
}

const MainMenuTop: React.FC<MainMenuTopProps> = ({
  items,
  selectedId: controlledSelectedId,
  defaultSelectedId,
  size = "Large",
  onMenuItemSelect,
  ariaLabel = "Main menu top",
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState(defaultSelectedId);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const isControlled = controlledSelectedId !== undefined;
  const selectedId = isControlled ? controlledSelectedId : internalSelectedId;

  const handleItemClick = (item: MainMenuTopItem) => {
    if (!isControlled) {
      setInternalSelectedId(item.id);
    }

    // Close any open menu
    setOpenMenuId(null);

    onMenuItemSelect?.({
      id: item.id,
      name: item.name,
      selected: true,
      link: item.link,
    });
  };

  const handleMenuToggle = (itemId: string) => {
    if (openMenuId === itemId) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(itemId);
      // Set selected to the parent when opening menu
      if (!isControlled) {
        setInternalSelectedId(itemId);
      }
    }
  };

  const handleMenuOptionClick = (item: MainMenuTopItem, option: MainMenuTopMenuOption) => {
    if (!isControlled) {
      setInternalSelectedId(item.id);
    }
    setOpenMenuId(null);

    onMenuItemSelect?.({
      id: item.id,
      name: item.name,
      selected: true,
      link: item.link,
      menuOptionId: option.id,
    });
  };

  const renderIcon = (iconName?: string) => {
    const name = iconName || "home";
    return (
      <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6L9 2L16 6V16C16 16.5304 15.7893 17.0391 15.4142 17.4142C15.0391 17.7893 14.5304 18 14 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V6Z" stroke="currentColor" strokeWidth={1.5} />
      </svg>
    );
  };

  const renderChevron = () => (
    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <nav className="main-menu-top" aria-label={ariaLabel}>
      <div className={`main-menu-top__bar main-menu-top__bar--${size}`}>
        {items?.map((item) => {
          const isSelected = selectedId === item.id;
          const isMenuOpen = openMenuId === item.id;
          const hasDropdown = item.dropdown || (item.menuOptions && item.menuOptions.length > 0);

          return (
            <div key={item.id} className="main-menu-top__item-wrapper">
              <button
                type="button"
                className={`main-menu-top__item main-menu-top__item--${size} ${isSelected || isMenuOpen ? "main-menu-top__item--selected" : ""}`}
                onClick={() => hasDropdown ? handleMenuToggle(item.id) : handleItemClick(item)}
                aria-current={isSelected ? "page" : undefined}
                aria-expanded={hasDropdown ? isMenuOpen : undefined}
                title={item.tooltip}
              >
                {item.showIcon !== false && (
                  <span className="main-menu-top__icon">
                    {renderIcon(item.iconName)}
                  </span>
                )}
                <span className="main-menu-top__label">{item.name}</span>
                {hasDropdown && (
                  <span className="main-menu-top__chevron">
                    {renderChevron()}
                  </span>
                )}
              </button>
              {isMenuOpen && item.menuOptions && item.menuOptions.length > 0 && (
                <div className="main-menu-top__dropdown">
                  {item.menuOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="main-menu-top__dropdown-option"
                      disabled={option.disabled}
                      onClick={() => handleMenuOptionClick(item, option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default MainMenuTop;
