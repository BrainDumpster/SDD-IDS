import { Menu } from "@base-ui-components/react/menu";
import { useState } from "react";
import navStyles from "./MainMenuLeft.module.css";
import menuStyles from "./SynapseDropdownActionMenu.module.css";
import { Icon } from "./Icon";

export interface LeftNavSecondaryContextMenuOption {
  id?: string;
  label: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface LeftNavSecondaryContextMenuProps {
  childLabel: string;
  options: LeftNavSecondaryContextMenuOption[];
  /** Storybook / demo — start with menu open. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Secondary-row overflow menu — Synapse detached action menu
 * (`components/synapse/dropdown-combo-box/design-spec.md`, Figma `53325:280088`).
 */
export function LeftNavSecondaryContextMenu({
  childLabel,
  options,
  defaultOpen = false,
  onOpenChange,
}: LeftNavSecondaryContextMenuProps) {
  const [open, setOpen] = useState(defaultOpen);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const closeMenu = () => handleOpenChange(false);

  return (
    <Menu.Root open={open} onOpenChange={handleOpenChange}>
      <Menu.Trigger
        className={navStyles.secondaryContextButton}
        title="More actions"
        aria-label={`More actions for ${childLabel}`}
        onClick={(event) => event.stopPropagation()}
      >
        <Icon
          shapeName="overflow-menu-dots"
          className={navStyles.secondaryContextIcon}
          style={{ width: 16, height: 16 }}
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={4}>
          <Menu.Popup className={menuStyles.popup}>
            {options.map((option, index) => (
              <Menu.Item
                key={option.id ?? index}
                className={menuStyles.optionRow}
                disabled={option.disabled}
                data-selectable="false"
                onClick={() => {
                  option.onSelect?.();
                  closeMenu();
                }}
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
