import { Menu } from "@base-ui-components/react/menu";
import { useCallback, useEffect, useState } from "react";
import type { RefObject } from "react";
import dropdownStyles from "./DropdownMenu.module.css";
import styles from "./CardHeaderMenu.module.css";

export interface CardMenuOption {
  /** Stable id passed to `onOptionSelected` (per-card list; unique within the card). */
  value: string;
  /** Visible label in the overlay list. */
  label: string;
  disabled?: boolean;
}

interface CardHeaderOverflowMenuProps {
  options: CardMenuOption[];
  onOptionSelected: (value: string) => void;
  /** Card root element — used as collision boundary and to measure max overlay height. */
  cardRef: RefObject<HTMLElement | null>;
  /** Accessible name for the trigger (e.g. “Options for {title}”). */
  triggerAriaLabel?: string;
}

function VerticalEllipsisIcon() {
  return (
    <svg
      className={styles.kebabIcon}
      width={20}
      height={20}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <circle cx="16" cy="4.5" r="3" fill="currentColor" />
      <circle cx="16" cy="16.5" r="3" fill="currentColor" />
      <circle cx="16" cy="27.5" r="3" fill="currentColor" />
    </svg>
  );
}

/** Header overflow menu: options overlay constrained to the host card’s height. */
export function CardHeaderOverflowMenu({
  options,
  onOptionSelected,
  cardRef,
  triggerAriaLabel = "Card options",
}: CardHeaderOverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState(280);
  const [collisionBoundary, setCollisionBoundary] = useState<Element | null>(
    null,
  );

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

  useEffect(() => {
    if (!open) return;
    const root = cardRef.current;
    if (!root) return;
    recomputeMaxHeight();
    const ro = new ResizeObserver(() => recomputeMaxHeight());
    ro.observe(root);
    return () => ro.disconnect();
  }, [open, cardRef, recomputeMaxHeight]);

  return (
    <Menu.Root
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setCollisionBoundary(cardRef.current);
          recomputeMaxHeight();
          requestAnimationFrame(recomputeMaxHeight);
        } else {
          setCollisionBoundary(null);
        }
      }}
    >
      <Menu.Trigger className={styles.kebabTrigger} aria-label={triggerAriaLabel}>
        <VerticalEllipsisIcon />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          side="bottom"
          align="end"
          sideOffset={4}
          collisionBoundary={collisionBoundary ?? undefined}
          collisionPadding={4}
        >
          <Menu.Popup
            className={dropdownStyles.popup}
            style={{ maxHeight, overflowY: "auto" }}
          >
            {options.map((opt) => (
              <Menu.Item
                key={opt.value}
                className={dropdownStyles.item}
                disabled={opt.disabled}
                onClick={() => onOptionSelected(opt.value)}
              >
                {opt.label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
