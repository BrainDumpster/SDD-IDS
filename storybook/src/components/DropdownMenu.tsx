import { Menu } from "@base-ui-components/react/menu";
import type { ReactNode } from "react";
import styles from "./DropdownMenu.module.css";

interface MenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger className={styles.triggerReset}>
        {trigger}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4} alignment="start">
          <Menu.Popup className={styles.popup}>
            {items.map((item, i) => {
              if (item.separator) {
                return <div key={i} className={styles.separator} role="separator" />;
              }
              return (
                <Menu.Item
                  key={i}
                  className={styles.item}
                  onClick={item.onClick}
                  disabled={item.disabled}
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
