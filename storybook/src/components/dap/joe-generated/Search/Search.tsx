import React, { useState } from "react";
import "./Search.css";

export interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  disabled?: boolean;
  variant?: "default" | "compact" | "expanded";
}

const Search: React.FC<SearchProps> = ({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  disabled = false,
  variant = "default",
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(internalValue);
    }
  };

  const showClearButton = internalValue.length > 0 && !disabled;

  return (
    <div className={`search search--${variant}`}>
      <div className="search__wrapper">
        <svg
          className="search__icon"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <path
            d="M11 11L14 14"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          className="search__input"
          placeholder={placeholder}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        {showClearButton && (
          <button
            className="search__clear"
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
          >
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
