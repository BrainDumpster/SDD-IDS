import { Accordion as BaseAccordion } from "@base-ui-components/react/accordion";
import type { ReactNode } from "react";
import styles from "./Accordion.module.css";

interface AccordionItem {
  value: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultValue?: string[];
}

export function Accordion({ items, multiple = false, defaultValue }: AccordionProps) {
  return (
    <BaseAccordion.Root
      className={styles.root}
      multiple={multiple}
      defaultValue={defaultValue}
    >
      {items.map((item) => (
        <BaseAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={styles.item}
        >
          <BaseAccordion.Header className={styles.header}>
            <BaseAccordion.Trigger
              className={(state) =>
                [styles.trigger, state.open ? styles.open : ""]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span>{item.title}</span>
              <ChevronIcon className={styles.icon} />
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className={styles.panel}>
            <div className={styles.content}>{item.content}</div>
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
