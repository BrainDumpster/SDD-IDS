import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import type { ReactNode } from "react";
import styles from "./Tabs.module.css";

interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
}

export function Tabs({ items, defaultValue }: TabsProps) {
  const initial = defaultValue || items[0]?.value;

  return (
    <BaseTabs.Root className={styles.root} defaultValue={initial}>
      <BaseTabs.List className={styles.list}>
        {items.map((item) => (
          <BaseTabs.Tab
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={(state) =>
              [
                styles.tab,
                state.active ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            {item.label}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {items.map((item) => (
        <BaseTabs.Panel key={item.value} value={item.value} className={styles.panel}>
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
