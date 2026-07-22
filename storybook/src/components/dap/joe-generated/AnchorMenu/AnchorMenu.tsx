import React, { useState, useEffect } from "react";
import "./AnchorMenu.css";

export interface AnchorMenuItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface AnchorMenuProps {
  items: AnchorMenuItem[];
  title?: string;
  sticky?: boolean;
  onItemClick?: (href: string) => void;
}

const AnchorMenu: React.FC<AnchorMenuProps> = ({
  items,
  title,
  sticky = true,
  onItemClick,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(
    items.find((item) => item.active)?.href || null
  );

  const handleClick = (href: string) => {
    setActiveItem(href);
    onItemClick?.(href);
  };

  return (
    <nav className={`anchor-menu ${sticky ? "anchor-menu--sticky" : ""}`} aria-label="Anchor navigation">
      {title && <div className="anchor-menu__header">{title}</div>}
      <ul className="anchor-menu__list">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={`anchor-menu__item ${activeItem === item.href ? "anchor-menu__item--active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item.href);
              }}
              aria-current={activeItem === item.href ? "page" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AnchorMenu;
