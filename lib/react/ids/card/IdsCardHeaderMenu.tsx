/**
 * CardFilter overflow menu — Figma `.Card-Element-OverflowMenu` `15718:197531`.
 *
 * The popup is the shared IDS dropdown menu (`lib/react/ids/dropdown-shared`)
 * in `selectionMode="single"` — the same menu `IdsDropdownSingleSelect` renders:
 * single-select rows, menuitemradio semantics, click → select + close.
 * The trigger slot carries the kebab (overflow-menu-dots 16×16, 8×16 padding,
 * radius-2) and `ariaLabel` names the icon-only Menu.Trigger.
 */

import React, { useCallback, useEffect, useState, type RefObject } from "react";
import { IdsIcon } from "../icon";
import { DropdownMenu } from "../dropdown-shared";
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
  /** Card root element — used to measure the max overlay height. */
  cardRef: RefObject<HTMLElement | null>;
  /** Accessible name for the trigger (e.g. “Options for {title}”). */
  triggerAriaLabel?: string;
}

export function IdsCardHeaderOverflowMenu({
  options,
  onOptionSelected,
  cardRef,
  triggerAriaLabel = "Card options",
}: IdsCardHeaderOverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState(280);

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
    <DropdownMenu
      trigger={
        <span
          className={styles["ids-card-kebab-trigger"]}
          data-ids="ids-card-filter"
        >
          <IdsIcon
            shape="overflow-menu-dots"
            size={16}
            color="var(--color-icon-brand-base)"
            className={styles["ids-card-kebab-icon"]}
          />
        </span>
      }
      ariaLabel={triggerAriaLabel}
      selectionMode="single"
      selectedValues={[]}
      items={options.map((opt) => ({
        id: opt.value,
        value: opt.value,
        label: opt.label,
        disabled: opt.disabled,
        selectable: true,
        onClick: () => onOptionSelected(opt.value),
      }))}
      side="bottom"
      sideOffset={4}
      menuWidth="content"
      matchTriggerWidth={false}
      maxHeight={maxHeight}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          recomputeMaxHeight();
          requestAnimationFrame(recomputeMaxHeight);
        }
      }}
    />
  );
}

IdsCardHeaderOverflowMenu.displayName = "IdsCardHeaderOverflowMenu";
