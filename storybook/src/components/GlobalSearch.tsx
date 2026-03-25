import { useState, useRef, useEffect, type ComponentProps } from "react";
import styles from "./GlobalSearch.module.css";

interface GlobalSearchProps extends Omit<ComponentProps<"div">, "onSubmit"> {
  placeholder?: string;
  onSearch?: (query: string) => void;
  expanded?: boolean;
}

export function GlobalSearch({
  placeholder = "Search...",
  onSearch,
  expanded: controlledExpanded,
  className,
  ...rest
}: GlobalSearchProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const expanded = controlledExpanded ?? internalExpanded;

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  function handleToggle() {
    if (controlledExpanded === undefined) {
      setInternalExpanded((prev) => !prev);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      onSearch?.(query.trim());
    }
    if (e.key === "Escape" && controlledExpanded === undefined) {
      setInternalExpanded(false);
      setQuery("");
    }
  }

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {expanded ? (
        <div className={styles.inputWrapper}>
          <SearchIcon className={styles.inputIcon} />
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search"
          />
          <button
            className={styles.closeButton}
            onClick={() => {
              handleToggle();
              setQuery("");
            }}
            aria-label="Close search"
          >
            <CloseIcon />
          </button>
        </div>
      ) : (
        <button
          className={styles.trigger}
          onClick={handleToggle}
          aria-label="Open search"
        >
          <SearchIcon />
        </button>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.5 10.5L14 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
