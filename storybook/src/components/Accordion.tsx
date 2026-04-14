import { Accordion as BaseAccordion } from "@base-ui-components/react/accordion";
import type { ReactNode } from "react";
import chevDownThickIcon from "../../../assets/icons/chev-down-thick.svg";
import styles from "./Accordion.module.css";

interface AccordionItem {
  value: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
  meta?: ReactNode;
  formSlot?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultValue?: string[];
  chevronPosition?: "left" | "right";
  variant?: "default" | "form";
}

export function Accordion({
  items,
  multiple = false,
  defaultValue,
  chevronPosition = "left",
  variant = "default",
}: AccordionProps) {
  return (
    <BaseAccordion.Root
      className={[styles.root, variant === "form" ? styles.rootForm : ""].filter(Boolean).join(" ")}
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
                [
                  styles.trigger,
                  chevronPosition === "left" ? styles.triggerLeft : styles.triggerRight,
                  state.open ? styles.open : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              {chevronPosition === "left" ? <ChevronIcon className={styles.icon} /> : null}
              <span>{item.title}</span>
              {chevronPosition === "right" ? <ChevronIcon className={styles.icon} /> : null}
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className={styles.panel}>
            <div className={styles.content}>{item.content}</div>
            {item.meta ? <div className={styles.meta}>{item.meta}</div> : null}
            {variant === "form" && item.formSlot ? (
              <div className={styles.formSlot}>{item.formSlot}</div>
            ) : null}
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <img src={chevDownThickIcon} alt="" aria-hidden="true" className={className} />
  );
}
