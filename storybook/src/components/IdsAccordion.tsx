import { Accordion as BaseAccordion } from "@base-ui-components/react/accordion";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./IdsAccordion.module.css";

export interface IdsAccordionItem {
  value: string;
  title: string;
  content: ReactNode;
  meta?: ReactNode;
}

export interface IdsAccordionProps {
  items: IdsAccordionItem[];
  multiple?: boolean;
  defaultValue?: string[];
  chevronPosition?: "left" | "right";
}

export function IdsAccordion({
  items,
  multiple = false,
  defaultValue,
  chevronPosition = "left",
}: IdsAccordionProps) {
  return (
    <BaseAccordion.Root
      className={styles.root}
      multiple={multiple}
      defaultValue={defaultValue}
    >
      {items.map((item, index) => (
        <BaseAccordion.Item
          key={item.value}
          value={item.value}
          className={styles.item}
          data-first={index === 0 ? "true" : "false"}
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
              {chevronPosition === "left" ? (
                <div className={styles.iconFrame}>
                  <Icon shapeName="chev-down-thick" className={styles.icon} />
                </div>
              ) : null}
              <span className={styles.title}>{item.title}</span>
              {chevronPosition === "right" ? (
                <div className={styles.iconFrame}>
                  <Icon shapeName="chev-down-thick" className={styles.icon} />
                </div>
              ) : null}
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className={styles.panel}>
            <div className={styles.content}>
              <div className={styles.contentCard}>{item.content}</div>
            </div>
            {item.meta ? <div className={styles.meta}>{item.meta}</div> : null}
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}
