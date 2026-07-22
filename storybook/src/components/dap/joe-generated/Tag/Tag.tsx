import React from "react";
import "./Tag.css";

export interface TagProps {
  type?: "read-only" | "clickable" | "editable" | "badge";
  size?: "small" | "large";
  tone?: "none" | "informational" | "success" | "minor" | "major" | "critical";
  selected?: boolean;
  disabled?: boolean;
  error?: boolean;
  focusVisible?: boolean;
  focusOnText?: boolean;
  label: string;
  badgeValue?: string | number;
  leadingIconSlug?: string | null;
  closeIconSlug?: string;
  onClick?: () => void;
  onDismiss?: () => void;
  onSelectionChange?: (selected: boolean) => void;
}

const Tag: React.FC<TagProps> = ({
  type = "read-only",
  size,
  tone = "none",
  selected = false,
  disabled = false,
  error = false,
  focusVisible = false,
  focusOnText = false,
  label,
  badgeValue,
  leadingIconSlug,
  closeIconSlug,
  onClick,
  onDismiss,
  onSelectionChange,
}) => {
  const actualSize = size || (type === "read-only" ? "small" : "large");
  const isClickable = type === "clickable";
  const isEditable = type === "editable";
  const isBadge = type === "badge";
  const isReadOnly = type === "read-only";

  const handleClick = () => {
    if (disabled) return;
    if (isClickable) {
      onSelectionChange?.(!selected);
    }
    if (isEditable && !focusOnText) {
      // Focus on text field logic would go here
    }
    onClick?.();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onDismiss?.();
    }
  };

  const renderLeadingIcon = () => {
    if (!leadingIconSlug) return null;
    return (
      <svg className="tag__prefix-icon" width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth={1.5} />
      </svg>
    );
  };

  const renderBadge = () => {
    if (!isBadge || badgeValue === undefined) return null;
    return <span className="tag__badge">{badgeValue}</span>;
  };

  const renderCloseButton = () => {
    if (isReadOnly) return null;
    const CloseComponent = isClickable || isEditable ? "span" : "button";
    return (
      <CloseComponent
        className="tag__close-button"
        onClick={handleDismiss}
        type={isClickable || isEditable ? undefined : "button"}
        aria-label={`Remove ${label}`}
        role={isClickable || isEditable ? "button" : undefined}
        tabIndex={isClickable || isEditable ? 0 : undefined}
        disabled={disabled}
      >
        <svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </CloseComponent>
    );
  };

  const renderEditableField = () => {
    if (!isEditable) return null;
    return (
      <input
        type="text"
        className={`tag__editable-field ${focusOnText ? "tag__editable-field--focused" : ""}`}
        defaultValue={label}
        disabled={disabled}
      />
    );
  };

  const TagComponent = isClickable || isEditable ? "button" : "div";

  return (
    <TagComponent
      className={`tag tag--${type} tag--${actualSize} tag--tone-${tone} ${selected ? "tag--selected" : ""} ${disabled ? "tag--disabled" : ""} ${error ? "tag--error" : ""} ${focusVisible ? "tag--focus-visible" : ""}`}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isClickable ? selected : undefined}
      role={isClickable || isEditable ? "button" : undefined}
    >
      {renderLeadingIcon()}
      {!isEditable && <span className="tag__label">{label}</span>}
      {renderEditableField()}
      {renderBadge()}
      {renderCloseButton()}
    </TagComponent>
  );
};

export default Tag;
