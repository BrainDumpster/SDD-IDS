import React, { useState, useRef } from "react";
import "./DropdownMultiSelect.css";

export interface DropdownMultiSelectOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownMultiSelectProps {
  options: DropdownMultiSelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  size?: "small" | "large";
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  searchable?: boolean;
  showSelectAllClearAll?: boolean;
  selectAllLabel?: string;
  clearAllLabel?: string;
  onSelectAll?: () => void;
  onClearAll?: () => void;
  clearAllDisabled?: boolean;
  showSelectedBadge?: boolean;
  showSelectedTooltip?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (query: string) => void;
}

const DropdownMultiSelect: React.FC<DropdownMultiSelectProps> = ({
  options,
  value: controlledValue,
  onChange,
  size = "large",
  label,
  placeholder = "Select options...",
  helperText,
  errorText,
  disabled = false,
  searchable = false,
  showSelectAllClearAll = false,
  selectAllLabel = "Select All",
  clearAllLabel = "Clear All",
  onSelectAll,
  onClearAll,
  clearAllDisabled = false,
  showSelectedBadge = false,
  showSelectedTooltip = false,
  actionLabel,
  onAction,
  onOpenChange,
  onSearch,
}) => {
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => value.includes(opt.id) || opt.disabled);
  const someSelected =
    filteredOptions.some((opt) => value.includes(opt.id)) && !allSelected;

  const handleToggle = () => {
    if (disabled) return;
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleOptionClick = (optionId: string) => {
    if (disabled) return;
    const option = options.find((opt) => opt.id === optionId);
    if (option?.disabled) return;

    const newValue = value.includes(optionId)
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const allEnabledIds = filteredOptions
      .filter((opt) => !opt.disabled)
      .map((opt) => opt.id);
    const newValue = [...value, ...allEnabledIds.filter((id) => !value.includes(id))];
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    onSelectAll?.();
  };

  const handleClearAll = () => {
    if (disabled || clearAllDisabled) return;
    if (controlledValue === undefined) {
      setInternalValue([]);
    }
    onChange?.([]);
    onClearAll?.();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.id));
  const selectedCount = selectedOptions.length;

  const renderCheckbox = (checked: boolean, indeterminate: boolean) => (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {indeterminate ? (
        <rect x={3} y={7} width={10} height={2} fill="currentColor" />
      ) : checked ? (
        <path d="M3 8L6 11L13 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
    </svg>
  );

  return (
    <div className={`dropdown-multiselect dropdown-multiselect--${size}`} ref={containerRef}>
      {label && <label className="dropdown-multiselect__label">{label}</label>}
      <div
        className={`dropdown-multiselect__field ${disabled ? "dropdown-multiselect__field--disabled" : ""} ${errorText ? "dropdown-multiselect__field--error" : ""}`}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="dropdown-multiselect__value">
          {selectedCount === 0 ? (
            <span className="dropdown-multiselect__placeholder">{placeholder}</span>
          ) : (
            <span className="dropdown-multiselect__selected-count">{selectedCount} selected</span>
          )}
          {showSelectedBadge && selectedCount > 0 && (
            <span className="dropdown-multiselect__badge">{selectedCount}</span>
          )}
        </div>
        <svg
          className="dropdown-multiselect__caret"
          width={12}
          height={12}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {helperText && !errorText && (
        <div className="dropdown-multiselect__helper-text">{helperText}</div>
      )}
      {errorText && (
        <div className="dropdown-multiselect__error-text">
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx={8} cy={8} r={7} stroke="currentColor" strokeWidth={1.5} />
            <path d="M8 5V9M8 11V12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          {errorText}
        </div>
      )}

      {isOpen && (
        <div className="dropdown-multiselect__menu">
          {searchable && (
            <div className="dropdown-multiselect__search">
              <input
                type="text"
                className="dropdown-multiselect__search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          {showSelectAllClearAll && (
            <div className="dropdown-multiselect__controls">
              <div
                className="dropdown-multiselect__select-all"
                onClick={handleSelectAll}
              >
                <span className="dropdown-multiselect__checkbox">
                  {renderCheckbox(allSelected, someSelected)}
                </span>
                <span>{selectAllLabel}</span>
              </div>
              <button
                className={`dropdown-multiselect__clear-all ${clearAllDisabled ? "dropdown-multiselect__clear-all--disabled" : ""}`}
                onClick={handleClearAll}
                disabled={clearAllDisabled}
              >
                {clearAllLabel}
              </button>
            </div>
          )}
          <div className="dropdown-multiselect__options" role="listbox">
            {filteredOptions.map((option) => {
              const isSelected = value.includes(option.id);
              return (
                <div
                  key={option.id}
                  className={`dropdown-multiselect__option ${isSelected ? "dropdown-multiselect__option--selected" : ""} ${option.disabled ? "dropdown-multiselect__option--disabled" : ""}`}
                  onClick={() => handleOptionClick(option.id)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="dropdown-multiselect__checkbox">
                    {renderCheckbox(isSelected, false)}
                  </span>
                  <span className="dropdown-multiselect__option-label">{option.label}</span>
                </div>
              );
            })}
          </div>
          {actionLabel && (
            <div className="dropdown-multiselect__action">
              <button onClick={onAction}>{actionLabel}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMultiSelect;
