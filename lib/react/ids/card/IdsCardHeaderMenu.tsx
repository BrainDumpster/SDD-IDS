/**
 * CardFilter overflow menu — Figma `.Card-Element-OverflowMenu` `15718:197531`.
 * Composes lib `IdsIcon` (`overflow-menu-dots`). No @base-ui-components.
 */

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { IdsIcon } from "../icon";
import styles from "./IdsCardHeaderMenu.module.css";

export interface IdsCardMenuOption {
  /** Stable id passed to `onOptionSelected` (per-card list; unique within the card). */
  value: string;
  /** Visible label in the overlay list. */
  label: string;
  disabled?: boolean;
}

export interface IdsCardHeaderOverflowMenuProps {
  options: IdsCardMenuOption[];
  onOptionSelected: (value: string) => void;
  /** Card root element — collision boundary + max overlay height. */
  cardRef: RefObject<HTMLElement | null>;
  /** Accessible name for the trigger (e.g. “Options for {title}”). */
  triggerAriaLabel?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function firstEnabledIndex(options: IdsCardMenuOption[]): number {
  const idx = options.findIndex((o) => !o.disabled);
  return idx >= 0 ? idx : 0;
}

function nextEnabledIndex(
  options: IdsCardMenuOption[],
  from: number,
  delta: number,
): number {
  if (options.length === 0) return 0;
  let i = from;
  for (let step = 0; step < options.length; step += 1) {
    i = (i + delta + options.length) % options.length;
    if (!options[i]?.disabled) return i;
  }
  return from;
}

export function IdsCardHeaderOverflowMenu({
  options,
  onOptionSelected,
  cardRef,
  triggerAriaLabel = "Card options",
}: IdsCardHeaderOverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState(280);
  const [highlighted, setHighlighted] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  const recomputeMaxHeight = useCallback(() => {
    const root = cardRef.current;
    if (!root) return;
    const header = root.querySelector<HTMLElement>("[data-card-header]");
    const footer = root.querySelector<HTMLElement>("[data-card-footer]");
    const headerH = header?.offsetHeight ?? 0;
    const footerH = footer?.offsetHeight ?? 0;
    const paddingFudge = 12;
    const next = root.clientHeight - headerH - footerH - paddingFudge;
    setMaxHeight(Math.max(96, next));
  }, [cardRef]);

  const positionPopup = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const popupWidth = Math.max(186, popupRef.current?.offsetWidth ?? 186);
    const left = Math.min(
      Math.max(4, rect.right - popupWidth),
      window.innerWidth - popupWidth - 4,
    );
    const top = rect.bottom + 4;
    setCoords({ top, left });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setCoords(null);
  }, []);

  const openMenu = useCallback(() => {
    recomputeMaxHeight();
    const trigger = triggerRef.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      const popupWidth = 186;
      const left = Math.min(
        Math.max(4, rect.right - popupWidth),
        window.innerWidth - popupWidth - 4,
      );
      setCoords({ top: rect.bottom + 4, left });
    }
    setOpen(true);
  }, [recomputeMaxHeight]);

  useLayoutEffect(() => {
    if (!open) return;
    recomputeMaxHeight();
    positionPopup();
    const onResize = () => {
      recomputeMaxHeight();
      positionPopup();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    const root = cardRef.current;
    const ro = root ? new ResizeObserver(onResize) : null;
    if (root && ro) ro.observe(root);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      ro?.disconnect();
    };
  }, [open, cardRef, recomputeMaxHeight, positionPopup]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const idx = firstEnabledIndex(options);
    setHighlighted(idx);
    requestAnimationFrame(() => {
      popupRef.current
        ?.querySelectorAll<HTMLElement>("[role='menuitem']")
        [idx]?.focus();
    });
  }, [open, options]);

  const selectOption = (opt: IdsCardMenuOption) => {
    if (opt.disabled) return;
    onOptionSelected(opt.value);
    close();
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) openMenu();
    }
  };

  const onPopupKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((h) => nextEnabledIndex(options, h, 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((h) => nextEnabledIndex(options, h, -1));
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setHighlighted(firstEnabledIndex(options));
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setHighlighted(nextEnabledIndex(options, options.length, -1));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const opt = options[highlighted];
      if (opt) selectOption(opt);
    }
  };

  useEffect(() => {
    if (!open) return;
    const items = popupRef.current?.querySelectorAll<HTMLElement>(
      "[role='menuitem']",
    );
    items?.[highlighted]?.focus();
  }, [highlighted, open]);

  const popupStyle: CSSProperties | undefined =
    coords != null
      ? {
          position: "fixed",
          top: coords.top,
          left: coords.left,
          maxHeight,
        }
      : undefined;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles["ids-card-kebab-trigger"]}
        aria-label={triggerAriaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => {
          if (open) close();
          else openMenu();
        }}
        onKeyDown={onTriggerKeyDown}
        data-ids="ids-card-filter"
      >
        <IdsIcon
          shape="overflow-menu-dots"
          size={16}
          color="currentColor"
          className={styles["ids-card-kebab-icon"]}
        />
      </button>
      {open && coords != null
        ? createPortal(
            <ul
              ref={popupRef}
              id={menuId}
              role="menu"
              tabIndex={-1}
              className={styles["ids-card-menu-popup"]}
              style={popupStyle}
              onKeyDown={onPopupKeyDown}
              data-ids="ids-card-filter-menu"
            >
              {options.map((opt, index) => (
                <li key={opt.value} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    tabIndex={highlighted === index ? 0 : -1}
                    disabled={opt.disabled}
                    data-highlighted={highlighted === index ? "true" : undefined}
                    className={cx(styles["ids-card-menu-item"])}
                    onMouseEnter={() => {
                      if (!opt.disabled) setHighlighted(index);
                    }}
                    onClick={() => selectOption(opt)}
                  >
                    <span className={styles["ids-card-menu-item-label"]}>
                      {opt.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </>
  );
}

IdsCardHeaderOverflowMenu.displayName = "IdsCardHeaderOverflowMenu";
