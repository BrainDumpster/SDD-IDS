import { Accordion as BaseAccordion } from "@base-ui-components/react/accordion";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { IdsAccordionItem, IdsAccordionProps } from "@component-contracts/ids/accordion.react-bridge";
import { Icon } from "./Icon";
import styles from "./IdsAccordion.module.css";

export type { IdsAccordionItem, IdsAccordionProps };

/**
 * Whether the title's rendered text is clipped. `-webkit-line-clamp` hides
 * overflow without making it scrollable, so scrollHeight never exceeds the
 * clamped box — the clamp must be lifted (synchronously, so it never paints)
 * to measure the full content height.
 */
function isTitleTruncated(el: HTMLSpanElement): boolean {
  const clampedHeight = el.clientHeight;
  const clampedWidth = el.clientWidth;

  // `-webkit-box`/`line-clamp` clips text without growing scroll metrics, so
  // temporarily render as a plain block — it then grows to the full content
  // height and scrollWidth reports horizontally-clipped content (the 900px
  // max-width cap). All synchronous, so it never paints.
  el.style.setProperty("display", "block");
  el.style.setProperty("-webkit-line-clamp", "unset");
  el.style.setProperty("line-clamp", "unset");
  const fullHeight = el.offsetHeight;
  const fullScrollWidth = el.scrollWidth;
  el.style.removeProperty("display");
  el.style.removeProperty("-webkit-line-clamp");
  el.style.removeProperty("line-clamp");

  return fullHeight > clampedHeight + 1 || fullScrollWidth > clampedWidth + 1;
}

/**
 * Sets/clears the native `title` tooltip on hover depending on whether the
 * clamped title text is actually truncated (line-clamp 2 in `.title`).
 */
function handleTitleMouseEnter(event: ReactMouseEvent<HTMLSpanElement>) {
  const el = event.currentTarget;
  if (isTitleTruncated(el)) {
    const text = el.textContent ?? "";
    if (el.title !== text) el.title = text;
  } else if (el.title) {
    el.removeAttribute("title");
  }
}

export function IdsAccordion({
  items,
  multiple = false,
  defaultValue,
  variant = "default",
  chevronPosition = "left",
  width,
  maxWidth,
  panelMaxHeight,
}: IdsAccordionProps) {
  const widthValue =
    width !== undefined
      ? typeof width === "number"
        ? `${width}px`
        : width
      : undefined;
  const maxWidthValue =
    maxWidth !== undefined
      ? typeof maxWidth === "number"
        ? `${maxWidth}px`
        : maxWidth
      : undefined;
  const panelMaxHeightValue =
    panelMaxHeight !== undefined
      ? typeof panelMaxHeight === "number"
        ? `${panelMaxHeight}px`
        : panelMaxHeight
      : undefined;
  return (
    <BaseAccordion.Root
      className={[styles.root, variant === "form" ? styles.rootForm : ""].filter(Boolean).join(" ")}
      multiple={multiple}
      defaultValue={defaultValue}
      style={
        widthValue !== undefined || maxWidthValue !== undefined
          ? { width: widthValue, maxWidth: maxWidthValue }
          : undefined
      }
    >
      {items.map((item, index) => (
        <BaseAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={styles.item}
          data-first={index === 0 ? "true" : "false"}
        > onMouseEnter={handleTitleMouseEnter}
                
              
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
          <BaseAccordion.Panel
            className={styles.panel}
            style={
              panelMaxHeightValue !== undefined
                ? { maxHeight: panelMaxHeightValue, overflowY: "auto" }
                : undefined
            }
          >
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
