import { Menu } from "@base-ui-components/react/menu";
import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import mastheadStyles from "./SynapseMasthead.module.css";
import helpMenuStyles from "./SynapseMastheadHelpMenu.module.css";

export interface SynapseMastheadHelpMenuOption {
  id?: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}

const DEFAULT_HELP_OPTIONS: SynapseMastheadHelpMenuOption[] = [
  { id: "about", label: "About" },
  { id: "get-started", label: "Get Started" },
];

export interface SynapseMastheadHelpMenuProps {
  /** Menu rows (Figma default: About, Get Started). */
  options?: SynapseMastheadHelpMenuOption[];
  /** Override help icon (default: `help-circ-16`). */
  icon?: ReactNode;
  /** Popover offset from masthead bottom (px). */
  sideOffset?: number;
  /** Start with menu open (Storybook / demo). */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SynapseMastheadHelpMenu({
  options = DEFAULT_HELP_OPTIONS,
  icon,
  sideOffset = 0,
  defaultOpen = false,
  onOpenChange,
}: SynapseMastheadHelpMenuProps) {
  const [open, setOpen] = useState(defaultOpen);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const closeMenu = () => handleOpenChange(false);

  return (
    <Menu.Root open={open} onOpenChange={handleOpenChange}>
      <Menu.Trigger
        className={mastheadStyles.actionIconButton}
        aria-label="Help"
      >
        <span className={mastheadStyles.actionIconGlyph} aria-hidden="true">
          {icon ?? <Icon shapeName="help-circ-16" style={{ width: 16, height: 16 }} />}
        </span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          side="bottom"
          align="end"
          sideOffset={Math.max(sideOffset, 0)}
        >
          <Menu.Popup className={helpMenuStyles.popup}>
            {options.map((opt, index) => (
              <Menu.Item
                key={opt.id ?? index}
                className={helpMenuStyles.optionRow}
                disabled={opt.disabled}
                onClick={() => {
                  opt.onSelect?.();
                  closeMenu();
                }}
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
