import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Icon } from "./Icon";
import styles from "./Select.module.css";

export type SelectSize = "lg" | "md" | "sm";
export type SelectDataState = "default" | "hover" | "active" | "focus-visible" | "disabled";

export interface SelectItem {
  id: string;
  label: string;
  disabled?: boolean;
  hasSubmenu?: boolean;
  keepOpen?: boolean;
}

export interface SelectProps {
  value?: string;
  placeholder?: string;
  size?: SelectSize;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  trailingIconSlug?: string;
  items?: SelectItem[];
  ariaLabel?: string;
  /** Storybook / QA override only — must not replace runtime interaction. */
  dataState?: SelectDataState;
  onOpenChange?: (open: boolean) => void;
  onChange?: (value: string, item: SelectItem) => void;
  onSelect?: (item: SelectItem) => void;
  className?: string;
}

function useControllableOpen(
  open: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange?: (open: boolean) => void,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const value = isControlled ? Boolean(open) : uncontrolled;
  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );
  return [value, setValue] as const;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    value,
    placeholder = "Placeholder",
    size = "lg",
    open,
    defaultOpen = false,
    disabled = false,
    trailingIconSlug = "arrow-tri-down-solid",
    items = [],
    ariaLabel,
    dataState,
    onOpenChange,
    onChange,
    onSelect,
    className,
  },
  forwardedRef,
) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [openState, setOpenState] = useControllableOpen(open, defaultOpen, onOpenChange);
  const [focusVisible, setFocusVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);

  const selectedValue = value !== undefined ? value : internalValue;
  const forcedDisabled = dataState === "disabled" || disabled;
  const forcedOpen = dataState === "active" ? true : dataState === "default" ? false : undefined;
  const isOpen = !forcedDisabled && (forcedOpen ?? openState);
  const showFocusRing = dataState === "focus-visible" || (focusVisible && !forcedDisabled);

  const contentState = selectedValue ? "filled" : placeholder ? "example" : "empty";
  const displayText = selectedValue || (contentState === "example" ? placeholder : "");

  useEffect(() => {
    if (!isOpen) return;
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenState(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [isOpen, setOpenState]);

  const toggle = () => {
    if (forcedDisabled) return;
    setOpenState(!isOpen);
  };

  const selectItem = (item: SelectItem) => {
    if (forcedDisabled || item.disabled) return;
    if (value === undefined) setInternalValue(item.label);
    onSelect?.(item);
    onChange?.(item.label, item);
    if (!item.keepOpen) setOpenState(false);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (forcedDisabled) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) setOpenState(true);
      setActiveIndex(0);
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setOpenState(false);
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (!items.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const item = items[activeIndex];
      if (item) selectItem(item);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpenState(false);
    }
  };

  const rootClass = useMemo(() => {
    const parts = [styles.root, styles[size], className];
    if (isOpen) parts.push(styles.open);
    if (showFocusRing) parts.push(styles.focusVisible);
    return parts.filter(Boolean).join(" ");
  }, [size, className, isOpen, showFocusRing]);

  return (
    <div ref={rootRef} className={rootClass} data-content-state={contentState}>
      <button
        ref={forwardedRef}
        type="button"
        className={styles.trigger}
        disabled={forcedDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
        onFocus={() => setFocusVisible(true)}
        onBlur={() => setFocusVisible(false)}
      >
        <span
          className={[
            styles.value,
            contentState === "example" ? styles.placeholder : "",
            contentState === "empty" ? styles.empty : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {displayText}
        </span>
        <span className={styles.trailingIcon} aria-hidden>
          <Icon shapeName={trailingIconSlug} variant="mask" />
        </span>
        <span className={styles.focusRing} aria-hidden />
      </button>
      {isOpen ? (
        <ul
          id={listboxId}
          className={styles.menu}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
        >
          {items.map((item, index) => (
            <li key={item.id} role="presentation">
              <button
                type="button"
                role="option"
                className={[styles.item, index === activeIndex ? styles.itemActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-selected={selectedValue === item.label}
                disabled={item.disabled}
                onClick={() => selectItem(item)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className={styles.itemLabel}>{item.label}</span>
                {item.hasSubmenu ? (
                  <span className={styles.submenuIcon} aria-hidden>
                    <Icon shapeName="arrow-tri-right-solid" variant="mask" />
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});

Select.displayName = "Select";
