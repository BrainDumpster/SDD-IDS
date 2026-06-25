import { type ComponentProps, useCallback, useState } from "react";
import styles from "./Search.module.css";
import search16Icon from "../../../assets/icons/search-16.svg";
import ctrlClose16Icon from "../../../assets/icons/ctrl-close-16.svg";

interface SearchProps extends Omit<ComponentProps<"input">, "onChange" | "type"> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  size?: "large" | "small";
  /** `main` — Search-Main field (Figma `53993:290152`, topology toolbar). */
  variant?: "default" | "main";
}

export function Search({
  placeholder = "Search",
  value,
  defaultValue,
  onChange,
  onClear,
  size = "large",
  variant = "default",
  className,
  ...rest
}: SearchProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue ?? ""));
  const currentValue = value ?? uncontrolledValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (value === undefined) {
        setUncontrolledValue(next);
      }
      onChange?.(next);
    },
    [onChange, value],
  );

  const handleClear = useCallback(() => {
    if (value === undefined) {
      setUncontrolledValue("");
    }
    onClear?.();
    onChange?.("");
  }, [onClear, onChange, value]);

  return (
    <div
      className={`${styles.wrapper} ${className || ""}`}
      data-size={variant === "main" ? "small" : size}
      data-variant={variant}
    >
      <SearchIcon />
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        defaultValue={undefined}
        {...rest}
      />
      {currentValue.length > 0 && (
        <button
          type="button"
          className={styles.clear}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <img
      src={search16Icon}
      width={16}
      height={16}
      className={styles.searchIcon}
      aria-hidden="true"
      alt=""
      data-icon-name="search-16"
    />
  );
}

function ClearIcon() {
  return (
    <img
      src={ctrlClose16Icon}
      width={16}
      height={16}
      aria-hidden="true"
      alt=""
      data-icon-name="ctrl-close-16"
    />
  );
}
