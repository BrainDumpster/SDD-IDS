import { Menu } from "@base-ui-components/react/menu";
import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./DropdownMenu.module.css";

interface MenuItem {
  id?: string;
  label: string;
  value?: string;
  onClick?: () => void;
  disabled?: boolean;
  kind?: "item" | "section";
  selectable?: boolean;
  selected?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  selectionMode?: "single" | "multi" | "none";
  selectedValues?: string[];
  maxHeight?: number;
}

export function DropdownMenu({
  trigger,
  items,
  selectionMode = "none",
  selectedValues = [],
  maxHeight,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Menu.Trigger className={styles.triggerReset}>
        {trigger}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4} alignment="start">
          <Menu.Popup
            className={styles.popup}
            style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
          >
            {items.map((item, i) => {
              if (item.kind === "section") {
                return (
                  <div key={item.id ?? i} className={styles.sectionHeader} role="presentation">
                    {item.label}
                  </div>
                );
              }
              const isSelectable = item.selectable && (selectionMode === "single" || selectionMode === "multi");
              const isSelected =
                item.selected ??
                (item.value ? selectedValues.includes(item.value) : false);
              if (isSelectable) {
                return (
                  <button
                    key={item.id ?? i}
                    type="button"
                    className={styles.item}
                    disabled={item.disabled}
                    data-disabled={item.disabled ? "true" : undefined}
                    data-selectable="true"
                    data-selection-mode={selectionMode}
                    data-selected={isSelected ? "true" : undefined}
                    onClick={() => item.onClick?.()}
                    role={selectionMode === "multi" ? "menuitemcheckbox" : "menuitemradio"}
                    aria-checked={isSelected}
                  >
                    <span className={styles.leadingControl} aria-hidden="true">
                      {selectionMode === "multi" ? (
                        <span className={styles.checkboxOuter}>
                          {isSelected ? (
                            <span className={styles.checkboxTick} />
                          ) : null}
                        </span>
                      ) : (
                        <span className={styles.radioOuter}>
                          {isSelected ? (
                            <span className={styles.radioInner} />
                          ) : null}
                        </span>
                      )}
                    </span>
                    {item.label}
                  </button>
                );
              }
              return (
                <Menu.Item
                  key={item.id ?? i}
                  className={styles.item}
                  onSelect={() => item.onClick?.()}
                  disabled={item.disabled}
                  data-selectable="false"
                  data-selected={isSelected ? "true" : undefined}
                >
                  {item.label}
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
