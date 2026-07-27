import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Icon } from "./Icon";
import styles from "./ButtonDropdown.module.css";

export type ButtonDropdownVariant = "primary" | "secondary" | "tertiary";
export type ButtonDropdownSize = "lg" | "md" | "sm";
export type ButtonDropdownDataState = "default" | "open" | "disabled" | "focus-visible";

export interface ButtonDropdownItem {
  id: string;
  label: string;
  disabled?: boolean;
  hasSubmenu?: boolean;
  keepOpen?: boolean;
}

export interface ButtonDropdownProps {
  label?: string;
  variant?: ButtonDropdownVariant;
  size?: ButtonDropdownSize;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  leadingIconSlug?: string;
  trailingIconSlug?: string;
  items?: ButtonDropdownItem[];
  ariaLabel?: string;
  /** Storybook / QA override only — must not replace runtime interaction. */
  dataState?: ButtonDropdownDataState;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: ButtonDropdownItem) => void;
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

export const ButtonDropdown = forwardRef<HTMLButtonElement, ButtonDropdownProps>(
  function ButtonDropdown(
    {
      label,
      variant = "primary",
      size = "lg",
      open,
      defaultOpen = false,
      disabled = false,
      leadingIconSlug,
      trailingIconSlug = "arrow-tri-down-solid",
      items = [],
      ariaLabel,
      dataState,
      onOpenChange,
      onSelect,
      className,
    },
    forwardedRef,
  ) {
    const menuId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const [openState, setOpenState] = useControllableOpen(open, defaultOpen, onOpenChange);
    const [focusVisible, setFocusVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const forcedDisabled = dataState === "disabled" || disabled;
    const forcedOpen = dataState === "open" ? true : dataState === "default" ? false : undefined;
    const isOpen = !forcedDisabled && (forcedOpen ?? openState);
    const showFocusRing = dataState === "focus-visible" || (focusVisible && !forcedDisabled);

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

    const selectItem = (item: ButtonDropdownItem) => {
      if (forcedDisabled || item.disabled) return;
      onSelect?.(item);
      if (!item.keepOpen) setOpenState(false);
    };

    const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (forcedDisabled) return;
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!isOpen) setOpenState(true);
        setActiveIndex(0);
      }
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        setOpenState(false);
      }
    };

    const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const enabled = items.filter((i) => !i.disabled);
      if (!enabled.length) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenState(false);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % enabled.length);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + enabled.length) % enabled.length);
      }
      if (event.key === "Home") {
        event.preventDefault();
        setActiveIndex(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        setActiveIndex(enabled.length - 1);
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectItem(enabled[activeIndex] ?? enabled[0]);
      }
    };

    const leading: ReactNode = leadingIconSlug ? (
      <span className={styles.leadingIcon} aria-hidden="true">
        <Icon shapeName={leadingIconSlug} variant="mask" />
      </span>
    ) : null;

    const trailing: ReactNode = trailingIconSlug ? (
      <span className={styles.trailingIcon} aria-hidden="true">
        <Icon shapeName={trailingIconSlug} variant="mask" />
      </span>
    ) : null;

    const rootClass = useMemo(
      () =>
        [
          styles.root,
          styles[variant],
          styles[size],
          isOpen ? styles.open : "",
          forcedDisabled ? styles.disabled : "",
          showFocusRing ? styles.focusVisible : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" "),
      [variant, size, isOpen, forcedDisabled, showFocusRing, className],
    );

    const enabledItems = items.filter((i) => !i.disabled);

    return (
      <div ref={rootRef} className={rootClass} data-design-system="powerflex">
        <button
          ref={forwardedRef}
          type="button"
          className={styles.trigger}
          disabled={forcedDisabled}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={isOpen ? menuId : undefined}
          aria-label={ariaLabel || (label ? undefined : "Button dropdown")}
          data-state={dataState}
          onClick={toggle}
          onKeyDown={onTriggerKeyDown}
          onFocus={(e) => setFocusVisible(e.target.matches(":focus-visible"))}
          onBlur={() => setFocusVisible(false)}
        >
          <span className={styles.background} aria-hidden="true" />
          {leading}
          {label ? <span className={styles.label}>{label}</span> : null}
          <span className={styles.focusRing} aria-hidden="true" />
          {trailing}
        </button>
        {isOpen ? (
          <div
            id={menuId}
            className={styles.menu}
            role="menu"
            tabIndex={-1}
            onKeyDown={onMenuKeyDown}
          >
            {items.map((item) => {
              const enabledIdx = enabledItems.findIndex((e) => e.id === item.id);
              const active = !item.disabled && enabledIdx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  disabled={item.disabled}
                  data-active={active ? "true" : undefined}
                  onClick={() => selectItem(item)}
                >
                  <span className={styles.menuItemLabel}>{item.label}</span>
                  {item.hasSubmenu ? (
                    <span className={styles.submenuIcon} aria-hidden="true">
                      <Icon shapeName="arrow-tri-right-solid" variant="mask" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  },
);

ButtonDropdown.displayName = "ButtonDropdown";

export default ButtonDropdown;
