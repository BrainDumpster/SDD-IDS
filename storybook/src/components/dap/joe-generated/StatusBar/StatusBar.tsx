import React, { useState, useRef, useEffect } from "react";
import "./StatusBar.css";

export interface StatusBarItem {
  id: string;
  value: number | string;
  category?: string;
  label: string;
  severity?: "critical" | "warning" | "success" | "in-progress" | "scheduled" | "canceling" | "canceled" | "skipped" | "unknown";
  state?: "default" | "hover" | "press" | "selected" | "disabled";
  iconShapeName?: string;
}

export interface StatusBarProps {
  type?: "status-large" | "status-small" | "inventory";
  items: StatusBarItem[];
  total?: number | string;
  totalLabel?: string;
  totalCategory?: string;
  overflowMode?: "none" | "beginning" | "middle" | "end";
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({
  type = "status-large",
  items,
  total,
  totalLabel = "Total",
  totalCategory,
  overflowMode = "none",
  onScrollLeft,
  onScrollRight,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewportRef.current || !contentRef.current) return;

    const checkScroll = () => {
      if (viewportRef.current && contentRef.current) {
        setCanScrollLeft(scrollPosition > 0);
        setCanScrollRight(scrollPosition < contentRef.current.scrollWidth - viewportRef.current.clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [scrollPosition, items]);

  const handleScrollLeft = () => {
    if (viewportRef.current) {
      const newPosition = Math.max(0, scrollPosition - 200);
      setScrollPosition(newPosition);
      viewportRef.current.scrollLeft = newPosition;
      onScrollLeft?.();
    }
  };

  const handleScrollRight = () => {
    if (viewportRef.current && contentRef.current) {
      const newPosition = Math.min(
        contentRef.current.scrollWidth - viewportRef.current.clientWidth,
        scrollPosition + 200
      );
      setScrollPosition(newPosition);
      viewportRef.current.scrollLeft = newPosition;
      onScrollRight?.();
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case "critical":
        return (
          <svg width={type === "status-small" ? 16 : 32} height={type === "status-small" ? 16 : 32} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="16" height="16" rx="2" fill="currentColor" />
          </svg>
        );
      case "warning":
        return (
          <svg width={type === "status-small" ? 16 : 32} height={type === "status-small" ? 16 : 32} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1L1 14H15L8 1Z" fill="currentColor" />
          </svg>
        );
      case "success":
        return (
          <svg width={type === "status-small" ? 16 : 32} height={type === "status-small" ? 16 : 32} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="currentColor" />
          </svg>
        );
      case "in-progress":
        return (
          <svg width={type === "status-small" ? 16 : 32} height={type === "status-small" ? 16 : 32} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth={1.5} />
          </svg>
        );
      case "scheduled":
        return (
          <svg width={type === "status-small" ? 16 : 32} height={type === "status-small" ? 16 : 32} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth={1.5} />
            <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  const showOverflow = total !== undefined && overflowMode !== "none";

  return (
    <div className={`status-bar status-bar--${type}`}>
      {total !== undefined && (
        <div className="status-bar__total">
          <div className="status-bar__total-divider status-bar__total-divider--left" />
          <div className="status-bar__total-content">
            <span className="status-bar__total-value">{total}</span>
            <div className="status-bar__total-meta">
              {totalCategory && <span className="status-bar__total-category">{totalCategory}</span>}
              <span className="status-bar__total-label">{totalLabel}</span>
            </div>
          </div>
          <div className="status-bar__total-divider status-bar__total-divider--right" />
        </div>
      )}

      <div className="status-bar__content-wrapper">
        <div className="status-bar__content-viewport" ref={viewportRef}>
          <div className="status-bar__content" ref={contentRef}>
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`status-bar__item status-bar__item--${item.state || "default"}`}
              >
                <div className="status-bar__item-icon">{getSeverityIcon(item.severity)}</div>
                <span className="status-bar__item-value">{item.value}</span>
                <div className="status-bar__item-meta">
                  {item.category && <span className="status-bar__item-category">{item.category}</span>}
                  <span className="status-bar__item-label">{item.label}</span>
                </div>
                {index < items.length - 1 && <div className="status-bar__item-divider" />}
              </div>
            ))}
          </div>
        </div>

        {showOverflow && (
          <div className="status-bar__overflow-layer">
            {(overflowMode === "middle" || overflowMode === "end") && (
              <button
                className="status-bar__overflow-button status-bar__overflow-button--left"
                onClick={handleScrollLeft}
                disabled={!canScrollLeft}
                type="button"
                aria-label="Scroll left"
              >
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L4 8L10 13" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {(overflowMode === "middle" || overflowMode === "beginning") && (
              <button
                className="status-bar__overflow-button status-bar__overflow-button--right"
                onClick={handleScrollRight}
                disabled={!canScrollRight}
                type="button"
                aria-label="Scroll right"
              >
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 3L12 8L6 13" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
