import React, { useState, useRef, useEffect } from "react";
import "./GlobalSearch.css";

export interface GlobalSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  searchResults?: SearchResult[];
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  placeholder = "Search...",
  onSearch,
  onResultSelect,
  searchResults = [],
  disabled = false,
  isOpen = false,
  onOpenChange,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, searchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleResultSelect(searchResults[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        handleClose();
        break;
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    onResultSelect?.(result);
    setQuery("");
    handleClose();
  };

  const handleClose = () => {
    onOpenChange?.(false);
    setQuery("");
  };

  const handleClear = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const filteredResults = searchResults.filter(
    (result) =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      (result.description &&
        result.description.toLowerCase().includes(query.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="global-search-overlay" onClick={handleClose}>
      <div className="global-search" onClick={(e) => e.stopPropagation()}>
        <div className="global-search__input-wrapper">
          <svg
            className="global-search__search-icon"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth={1.5} />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="global-search__input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoFocus
          />
          {query && (
            <button
              className="global-search__clear-button"
              onClick={handleClear}
              type="button"
              aria-label="Clear search"
            >
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            </button>
          )}
          <button
            className="global-search__close-button"
            onClick={handleClose}
            type="button"
            aria-label="Close search"
          >
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {query && filteredResults.length > 0 && (
          <ul ref={listRef} className="global-search__results">
            {filteredResults.map((result, index) => (
              <li
                key={result.id}
                className={`global-search__result ${index === selectedIndex ? "global-search__result--selected" : ""}`}
                onClick={() => handleResultSelect(result)}
              >
                <div className="global-search__result-content">
                  <span className="global-search__result-title">{result.title}</span>
                  {result.description && (
                    <span className="global-search__result-description">
                      {result.description}
                    </span>
                  )}
                  {result.category && (
                    <span className="global-search__result-category">
                      {result.category}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {query && filteredResults.length === 0 && (
          <div className="global-search__no-results">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
