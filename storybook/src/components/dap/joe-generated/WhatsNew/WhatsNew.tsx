import React, { useState } from "react";
import "./WhatsNew.css";

export interface WhatsNewUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  category?: string;
  readMoreLink?: string;
}

export interface WhatsNewProps {
  title?: string;
  updates: WhatsNewUpdate[];
  onClose?: () => void;
  onReadMore?: (updateId: string) => void;
  showCloseButton?: boolean;
  variant?: "default" | "inline" | "modal" | "compact";
}

const WhatsNew: React.FC<WhatsNewProps> = ({
  title = "What's New",
  updates,
  onClose,
  onReadMore,
  showCloseButton = true,
  variant = "default",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(updates.map((u) => u.category).filter(Boolean)));

  const filteredUpdates = selectedCategory
    ? updates.filter((u) => u.category === selectedCategory)
    : updates;

  const handleClose = () => {
    onClose?.();
  };

  const handleReadMore = (updateId: string) => {
    onReadMore?.(updateId);
  };

  return (
    <div className={`whats-new whats-new--${variant}`}>
      <div className="whats-new__header">
        <h2 className="whats-new__title">{title}</h2>
        {showCloseButton && (
          <button
            type="button"
            className="whats-new__close"
            onClick={handleClose}
            aria-label="Close what's new"
          >
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="whats-new__categories">
          <button
            type="button"
            className={`whats-new__category ${selectedCategory === null ? "whats-new__category--active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`whats-new__category ${selectedCategory === category ? "whats-new__category--active" : ""}`}
              onClick={() => setSelectedCategory(category ?? null)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="whats-new__updates">
        {filteredUpdates.map((update) => (
          <div key={update.id} className="whats-new__update">
            <div className="whats-new__update-header">
              <h3 className="whats-new__update-title">{update.title}</h3>
              {update.category && (
                <span className="whats-new__category-badge">{update.category}</span>
              )}
            </div>
            <p className="whats-new__update-description">{update.description}</p>
            <div className="whats-new__update-footer">
              <span className="whats-new__update-date">{update.date}</span>
              {update.readMoreLink && (
                <button
                  type="button"
                  className="whats-new__read-more"
                  onClick={() => handleReadMore(update.id)}
                >
                  Read more
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsNew;
