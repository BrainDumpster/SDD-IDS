import { Accordion as BaseAccordion } from "@base-ui-components/react/accordion";
import type { IdsAccordionItem, IdsAccordionProps } from "@component-contracts/ids/accordion.react-bridge";
import { Icon } from "./Icon";
import styles from "./IdsAccordion.module.css";

export type { IdsAccordionItem, IdsAccordionProps };

export function IdsAccordion({
  items,
  multiple = false,
  defaultValue,
  variant = "default",
  chevronPosition = "left",
}: IdsAccordionProps) {
  return (
    <BaseAccordion.Root
      className={[styles.root, variant === "form" ? styles.rootForm : ""].filter(Boolean).join(" ")}
      multiple={multiple}
      defaultValue={defaultValue}
    >
      {items.map((item, index) => (
        <BaseAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
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
                  item.disabled ? styles.disabled : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              {chevronPosition === "left" ? (
                <Icon shapeName="chev-down-thick" className={styles.icon} />
              ) : null}
              <span className={styles.title}>{item.title}</span>
              {chevronPosition === "right" ? (
                <Icon shapeName="chev-down-thick" className={styles.icon} />
              ) : null}
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className={styles.panel}>
            <div className={styles.content}>
              <div className={styles.contentCard}>{item.content}</div>
            </div>
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
