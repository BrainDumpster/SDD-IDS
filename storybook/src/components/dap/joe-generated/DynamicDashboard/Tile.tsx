import React, { useEffect, useRef, useState } from 'react';
import { TileMenuOption, TileFooterButton } from './types';

export interface TileProps {
  /** Widget name/title */
  name: string;
  /** Widget ID */
  id: string;
  /** Custom content for the tile */
  children?: React.ReactNode;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Menu options for title bar */
  menuOptions?: TileMenuOption[];
  /** Footer buttons */
  footerButtons?: TileFooterButton[];
  /** Whether this tile is currently selected */
  selected?: boolean;
  /** Fired when the tile is clicked anywhere (used to select it) */
  onSelect?: () => void;
}

/**
 * Tile component for individual widgets in DynamicDashboard
 * Renders as a grid-stack-item wrapper with title bar, content area, and optional footer
 */
export const Tile: React.FC<TileProps> = ({
  name,
  id,
  children,
  className,
  style,
  menuOptions,
  footerButtons,
  selected,
  onSelect,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Determine if we should show close icon instead of overflow menu
  // (only if there's exactly one menu option and it's "Remove")
  const showCloseIcon = menuOptions && menuOptions.length === 1 && menuOptions[0].label.toLowerCase() === 'remove';

  const handleMenuClick = (option: TileMenuOption) => {
    option.onClick();
    setIsMenuOpen(false);
  };

  // Close the overflow dropdown when clicking outside of it
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className={`grid-stack-item ${className || ''}`} style={style} gs-id={id}>
      <div
        className={`grid-stack-item-content ${selected ? 'selected' : ''}`}
        onClick={onSelect}
      >
        {/* 40px title bar */}
        <div className="tile-header">
          <h3>{name}</h3>
          {menuOptions && menuOptions.length > 0 && (
            <div className="tile-header-actions">
              {showCloseIcon ? (
                <button
                  className="tile-close-button"
                  onClick={() => menuOptions[0].onClick()}
                  aria-label="Close"
                >
                  ✕
                </button>
              ) : (
                <div className="tile-overflow-menu" ref={menuRef}>
                  <button
                    className="tile-overflow-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="More options"
                  >
                    ⋮
                  </button>
                  {isMenuOpen && (
                    <div className="tile-overflow-dropdown">
                      {menuOptions.map((option) => (
                        <button
                          key={option.id}
                          className="tile-overflow-option"
                          onClick={() => handleMenuClick(option)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content area with minimum 150px height */}
        <div className="tile-body">
          {children || <div className="tile-placeholder">Widget Content</div>}
        </div>

        {/* 40px footer with optional buttons */}
        {footerButtons && footerButtons.length > 0 && (
          <div className="tile-footer">
            <div className="tile-footer-buttons">
              {footerButtons.map((button) => (
                <button
                  key={button.id}
                  className={`tile-footer-button tile-footer-button--${button.variant || 'secondary'}`}
                  onClick={button.onClick}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
