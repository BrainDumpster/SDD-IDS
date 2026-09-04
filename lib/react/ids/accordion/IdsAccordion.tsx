/**
 * IDS Accordion — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/accordion`
 * Source: `components/ids/accordion/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Hierarchy (Ids-prefixed):
 *   IdsAccordion
 *     IdsAccordionItem
 *       IdsAccordionHeader
 *         IdsAccordionChevron?
 *         title
 *       IdsAccordionBody (alias IdsAccordionPanel)
 *         IdsAccordionContent  — generic children slot
 *
 * DOM / CSS selectors: ids-accordion, ids-accordion-item, ids-accordion-header, …
 * No @base-ui-components dependency.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./IdsAccordion.module.css";
import { IdsIcon } from "../icon";

const s = {
  accordion: styles["ids-accordion"],
  accordionForm: styles["ids-accordion--form"],
  item: styles["ids-accordion-item"],
  itemFirst: styles["ids-accordion-item--first"],
  itemOpen: styles["ids-accordion-item--open"],
  header: styles["ids-accordion-header"],
  trigger: styles["ids-accordion-trigger"],
  triggerLeft: styles["ids-accordion-trigger--left"],
  triggerRight: styles["ids-accordion-trigger--right"],
  triggerOpen: styles["ids-accordion-trigger--open"],
  triggerDisabled: styles["ids-accordion-trigger--disabled"],
  title: styles["ids-accordion-title"],
  chevron: styles["ids-accordion-chevron"],
  body: styles["ids-accordion-body"],
  bodyHidden: styles["ids-accordion-body--hidden"],
  content: styles["ids-accordion-content"],
  contentCard: styles["ids-accordion-content-card"],
};

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface IdsAccordionItemInput {
  value: string;
  title: string;
  /** Expanded body content — any React nodes / components. */
  content: ReactNode;
  disabled?: boolean;
}

export interface IdsAccordionProps {
  children?: ReactNode;
  /** Convenience API: compose nested parts from an items array. */
  items?: IdsAccordionItemInput[];
  multiple?: boolean;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (openValues: string[]) => void;
  chevronPosition?: "left" | "right";
  variant?: "default" | "form";
  className?: string;
}

type ChevronPosition = "left" | "right";
type Variant = "default" | "form";

interface IdsAccordionContextValue {
  openValues: string[];
  multiple: boolean;
  chevronPosition: ChevronPosition;
  variant: Variant;
  reactId: string;
  toggle: (itemValue: string, disabled?: boolean) => void;
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
  getEnabledValues: () => string[];
  registerItemEnabled: (value: string, disabled: boolean) => void;
  moveFocus: (fromValue: string, direction: 1 | -1) => void;
  focusFirst: () => void;
  focusLast: () => void;
}

interface IdsAccordionItemContextValue {
  value: string;
  disabled: boolean;
  isOpen: boolean;
  isFirst: boolean;
  triggerId: string;
  panelId: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function resolveChevronPosition(pos: unknown): ChevronPosition {
  return pos === "right" ? "right" : "left";
}

function resolveVariant(variant: unknown): Variant {
  return variant === "form" ? "form" : "default";
}

function assertUniqueValues(items: IdsAccordionItemInput[]): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.value) {
      throw new Error("IdsAccordion: each item requires a non-empty `value`.");
    }
    if (seen.has(item.value)) {
      throw new Error(`IdsAccordion: duplicate item value "${item.value}".`);
    }
    seen.add(item.value);
  }
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const IdsAccordionContext = createContext<IdsAccordionContextValue | null>(null);
const IdsAccordionItemContext = createContext<IdsAccordionItemContextValue | null>(null);

function useIdsAccordion(component: string): IdsAccordionContextValue {
  const ctx = useContext(IdsAccordionContext);
  if (!ctx) {
    throw new Error(`${component} must be used within IdsAccordion.`);
  }
  return ctx;
}

function useIdsAccordionItem(component: string): IdsAccordionItemContextValue {
  const ctx = useContext(IdsAccordionItemContext);
  if (!ctx) {
    throw new Error(`${component} must be used within IdsAccordionItem.`);
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* IdsAccordion (root — was AccordionRoot)                                    */
/* -------------------------------------------------------------------------- */

export function IdsAccordion({
  children,
  items,
  multiple = false,
  defaultValue,
  value: valueProp,
  onValueChange,
  chevronPosition: chevronPositionProp,
  variant: variantProp,
  className,
}: IdsAccordionProps) {
  if (items) {
    assertUniqueValues(items);
  }

  const chevronPosition = resolveChevronPosition(chevronPositionProp);
  const variant = resolveVariant(variantProp);
  const reactId = useId();
  const isControlled = valueProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<string[]>(() => defaultValue ?? []);
  const openValues = isControlled ? (valueProp as string[]) : uncontrolledOpen;

  const triggerMap = useRef(new Map<string, HTMLButtonElement>());
  const enabledMap = useRef(new Map<string, boolean>());
  const orderRef = useRef<string[]>([]);

  const setOpenValues = useCallback(
    (next: string[]) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const toggle = useCallback(
    (itemValue: string, disabled?: boolean) => {
      if (disabled) return;
      const isOpen = openValues.includes(itemValue);
      if (multiple) {
        setOpenValues(
          isOpen
            ? openValues.filter((v: string) => v !== itemValue)
            : [...openValues, itemValue],
        );
        return;
      }
      setOpenValues(isOpen ? [] : [itemValue]);
    },
    [multiple, openValues, setOpenValues],
  );

  const registerTrigger = useCallback((value: string, el: HTMLButtonElement | null) => {
    if (el) {
      triggerMap.current.set(value, el);
      if (!orderRef.current.includes(value)) {
        orderRef.current.push(value);
      }
    } else {
      triggerMap.current.delete(value);
    }
  }, []);

  const registerItemEnabled = useCallback((value: string, disabled: boolean) => {
    enabledMap.current.set(value, !disabled);
    if (!orderRef.current.includes(value)) {
      orderRef.current.push(value);
    }
  }, []);

  const getEnabledValues = useCallback(() => {
    return orderRef.current.filter((v) => enabledMap.current.get(v));
  }, []);

  const focusValue = useCallback((value: string) => {
    triggerMap.current.get(value)?.focus();
  }, []);

  const moveFocus = useCallback(
    (fromValue: string, direction: 1 | -1) => {
      const enabled = getEnabledValues();
      if (!enabled.length) return;
      const pos = enabled.indexOf(fromValue);
      if (pos === -1) return;
      const next = enabled[(pos + direction + enabled.length) % enabled.length]!;
      focusValue(next);
    },
    [focusValue, getEnabledValues],
  );

  const focusFirst = useCallback(() => {
    const enabled = getEnabledValues();
    if (enabled.length) focusValue(enabled[0]!);
  }, [focusValue, getEnabledValues]);

  const focusLast = useCallback(() => {
    const enabled = getEnabledValues();
    if (enabled.length) focusValue(enabled[enabled.length - 1]!);
  }, [focusValue, getEnabledValues]);

  const ctx = useMemo<IdsAccordionContextValue>(
    () => ({
      openValues,
      multiple,
      chevronPosition,
      variant,
      reactId,
      toggle,
      registerTrigger,
      getEnabledValues,
      registerItemEnabled,
      moveFocus,
      focusFirst,
      focusLast,
    }),
    [
      openValues,
      multiple,
      chevronPosition,
      variant,
      reactId,
      toggle,
      registerTrigger,
      getEnabledValues,
      registerItemEnabled,
      moveFocus,
      focusFirst,
      focusLast,
    ],
  );

  const composedChildren =
    items != null
      ? items.map((item, index) => (
          <IdsAccordionItem
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            first={index === 0}
          >
            <IdsAccordionHeader title={item.title} />
            <IdsAccordionBody>
              <IdsAccordionContent>{item.content}</IdsAccordionContent>
            </IdsAccordionBody>
          </IdsAccordionItem>
        ))
      : children;

  return (
    <IdsAccordionContext.Provider value={ctx}>
      <div
        className={cx(s.accordion, variant === "form" && s.accordionForm, className)}
        data-ids="ids-accordion"
        data-variant={variant}
      >
        {composedChildren}
      </div>
    </IdsAccordionContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* IdsAccordionItem                                                           */
/* -------------------------------------------------------------------------- */

export interface IdsAccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  /** Set true on the first item so contiguous border model has no top margin. */
  first?: boolean;
  children?: ReactNode;
}

export function IdsAccordionItem({
  value,
  disabled = false,
  first = false,
  children,
  className,
  ...rest
}: IdsAccordionItemProps) {
  const root = useIdsAccordion("IdsAccordionItem");
  const isOpen = root.openValues.includes(value);
  const triggerId = `${root.reactId}-trigger-${value}`;
  const panelId = `${root.reactId}-panel-${value}`;

  useEffect(() => {
    root.registerItemEnabled(value, disabled);
  }, [root, value, disabled]);

  const itemCtx = useMemo<IdsAccordionItemContextValue>(
    () => ({
      value,
      disabled,
      isOpen,
      isFirst: first,
      triggerId,
      panelId,
    }),
    [value, disabled, isOpen, first, triggerId, panelId],
  );

  return (
    <IdsAccordionItemContext.Provider value={itemCtx}>
      <div
        {...rest}
        className={cx(s.item, first && s.itemFirst, isOpen && s.itemOpen, className)}
        data-ids="ids-accordion-item"
        data-open={isOpen ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        data-value={value}
      >
        {children}
      </div>
    </IdsAccordionItemContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* IdsAccordionHeader                                                         */
/* -------------------------------------------------------------------------- */

export interface IdsAccordionHeaderProps {
  children?: ReactNode;
  className?: string;
  /**
   * Header label. Prefer this prop so title + chevron get design-spec styles.
   * When omitted, `children` are rendered inside the trigger as-is.
   */
  title?: ReactNode;
}

export function IdsAccordionHeader({ children, className, title }: IdsAccordionHeaderProps) {
  const root = useIdsAccordion("IdsAccordionHeader");
  const item = useIdsAccordionItem("IdsAccordionHeader");

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        root.moveFocus(item.value, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        root.moveFocus(item.value, -1);
        break;
      case "Home":
        event.preventDefault();
        root.focusFirst();
        break;
      case "End":
        event.preventDefault();
        root.focusLast();
        break;
      default:
        break;
    }
  };

  const useTitleApi = title != null && children == null;

  const composedChildren = useTitleApi ? (
    <>
      {root.chevronPosition === "left" ? <IdsAccordionChevron /> : null}
      <span className={s.title}>{title}</span>
      {root.chevronPosition === "right" ? <IdsAccordionChevron /> : null}
    </>
  ) : (
    children
  );

  return (
    <h3 className={cx(s.header, className)} data-ids="ids-accordion-header">
      <button
        type="button"
        id={item.triggerId}
        aria-expanded={item.isOpen}
        aria-controls={item.panelId}
        disabled={item.disabled}
        data-ids="ids-accordion-trigger"
        data-open={item.isOpen ? "true" : "false"}
        onClick={() => root.toggle(item.value, item.disabled)}
        onKeyDown={onKeyDown}
        ref={(el) => root.registerTrigger(item.value, el)}
        className={cx(
          s.trigger,
          root.chevronPosition === "left" ? s.triggerLeft : s.triggerRight,
          item.isOpen && s.triggerOpen,
          item.disabled && s.triggerDisabled,
        )}
      >
        {composedChildren}
      </button>
    </h3>
  );
}

/* -------------------------------------------------------------------------- */
/* IdsAccordionChevron                                                        */
/* -------------------------------------------------------------------------- */

export interface IdsAccordionChevronProps {
  className?: string;
}

/** Slug `chev-down-thick` via shared IdsIcon (`assets/icons/chev-down-thick.svg`). */
export function IdsAccordionChevron({ className }: IdsAccordionChevronProps) {
  return (
    <IdsIcon shape="chev-down-thick" size={16} className={cx(s.chevron, className)} />
  );
}

/* -------------------------------------------------------------------------- */
/* IdsAccordionBody / IdsAccordionPanel                                       */
/* -------------------------------------------------------------------------- */

export interface IdsAccordionBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsAccordionBody({ children, className, ...rest }: IdsAccordionBodyProps) {
  const item = useIdsAccordionItem("IdsAccordionBody");

  return (
    <div
      {...rest}
      id={item.panelId}
      role="region"
      aria-labelledby={item.triggerId}
      hidden={!item.isOpen}
      className={cx(s.body, !item.isOpen && s.bodyHidden, className)}
      data-ids="ids-accordion-body"
      data-open={item.isOpen ? "true" : "false"}
    >
      {children}
    </div>
  );
}

/** Framework alias for IdsAccordionBody. */
export const IdsAccordionPanel = IdsAccordionBody;

/* -------------------------------------------------------------------------- */
/* IdsAccordionContent — generic children slot                                */
/* -------------------------------------------------------------------------- */

export interface IdsAccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /**
   * When true (default), apply the optional IDS “Swap content” card chrome.
   * Set false for fully unstyled/generic composition.
   */
  contentCard?: boolean;
}

export function IdsAccordionContent({
  children,
  className,
  contentCard = true,
  ...rest
}: IdsAccordionContentProps) {
  useIdsAccordionItem("IdsAccordionContent");

  return (
    <div {...rest} className={cx(s.content, className)} data-ids="ids-accordion-content">
      {contentCard ? <div className={s.contentCard}>{children}</div> : children}
    </div>
  );
}

/** Compound namespace. */
export const IdsAccordionCompound = Object.assign(IdsAccordion, {
  Item: IdsAccordionItem,
  Header: IdsAccordionHeader,
  Chevron: IdsAccordionChevron,
  Body: IdsAccordionBody,
  Panel: IdsAccordionPanel,
  Content: IdsAccordionContent,
});

export default IdsAccordionCompound;
