/**
 * IDS Status Bar — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/status-bar`
 * Source: `components/ids/status-bar/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (main = StatusBar, not StatusBarRoot):
 *   IdsStatusBar
 *     IdsStatusBarTotalItem?
 *       IdsStatusBarItemDivider (left)
 *       IdsStatusBarItemValue
 *       IdsStatusBarItemMeta
 *       IdsStatusBarItemDivider (right)
 *     IdsStatusBarContentViewport
 *       IdsStatusBarItem[]
 *         IdsStatusBarItemDivider? (first item, left)
 *         IdsStatusBarItemIconSlot
 *           IdsStatusBarInventoryMainIcon?
 *           IdsStatusBarInventoryStatusBadge?
 *         IdsStatusBarItemValue
 *         IdsStatusBarItemMeta
 *         IdsStatusBarItemDivider (right)
 *       IdsStatusBarOverflowLayer?
 *         IdsStatusBarOverflowLeft?
 *         IdsStatusBarOverflowRight?
 *
 * Prop-driven `items` / `total` emit this same tree.
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsStatusBar.module.css";

/* -------------------------------------------------------------------------- */
/* Types (Composition & API)                                                  */
/* -------------------------------------------------------------------------- */

export type IdsStatusBarType = "status-large" | "status-small" | "inventory";
export type IdsStatusBarItemState = "default" | "hover" | "press" | "selected" | "disabled";
export type IdsStatusBarOverflowState = "auto" | "beginning" | "middle" | "end";
export type IdsStatusBarSeverity =
  | "critical"
  | "warning"
  | "success"
  | "in-progress"
  | "scheduled"
  | "canceling"
  | "canceled"
  | "skipped"
  | "unknown";

export interface IdsStatusBarItemInput {
  id: string;
  value: number | string;
  category?: string;
  label: string;
  severity?: IdsStatusBarSeverity;
  state?: IdsStatusBarItemState;
  iconShapeName?: string;
}

export interface IdsStatusBarProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  type?: IdsStatusBarType;
  items?: IdsStatusBarItemInput[];
  total?: number | string;
  totalLabel?: string;
  totalCategory?: string;
  /** Demo/testing overflow scenario. Runtime default is `auto` from scroll position. */
  overflowState?: IdsStatusBarOverflowState;
  onItemSelect?: (id: string) => void;
  children?: ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SLOT = Symbol.for("ids.status-bar.slot");

type SlotName =
  | "total-item"
  | "content-viewport"
  | "item"
  | "icon-slot"
  | "value"
  | "meta"
  | "divider"
  | "overflow-layer"
  | "overflow-left"
  | "overflow-right"
  | "inventory-main-icon"
  | "inventory-status-badge";

const SEVERITY_ICON: Record<IdsStatusBarSeverity, string> = {
  critical: "status-critical-square-solid",
  warning: "status-warn-tri-solid",
  success: "status-ok-circ-solid",
  "in-progress": "state-progress-circle",
  scheduled: "state-standby-clock-solid",
  canceling: "state-cancelled-solid",
  canceled: "state-remove-solid",
  skipped: "skip-to-end",
  unknown: "status-unknown-diamond-solid",
};

const SEVERITY_SET = new Set<string>(Object.keys(SEVERITY_ICON));

const OVERFLOW_LEFT_ICON = "chev-left-thick";
const OVERFLOW_RIGHT_ICON = "chev-right-thick";
const INVENTORY_DEFAULT_ICON = "docs-bundle";

const DEFAULT_STATUS_ITEMS: IdsStatusBarItemInput[] = [
  { id: "critical", value: 10, category: "<Category>", label: "Critical", severity: "critical" },
  { id: "warning", value: 10, category: "<Category>", label: "Warning", severity: "warning" },
  { id: "success", value: 10, category: "<Category>", label: "Success", severity: "success" },
];

const DEFAULT_INVENTORY_ITEMS: IdsStatusBarItemInput[] = [
  { id: "default", value: 10, category: "Category", label: "Default", iconShapeName: INVENTORY_DEFAULT_ICON },
  {
    id: "warning",
    value: 10,
    category: "Category",
    label: "Warning",
    severity: "warning",
    iconShapeName: INVENTORY_DEFAULT_ICON,
  },
  {
    id: "critical",
    value: 10,
    category: "Category",
    label: "Critical",
    severity: "critical",
    iconShapeName: INVENTORY_DEFAULT_ICON,
  },
  {
    id: "in-progress",
    value: 10,
    category: "Category",
    label: "In Progress",
    severity: "in-progress",
    iconShapeName: INVENTORY_DEFAULT_ICON,
  },
];

const s = {
  root: styles["ids-status-bar"],
  large: styles["ids-status-bar--status-large"],
  small: styles["ids-status-bar--status-small"],
  inventory: styles["ids-status-bar--inventory"],
  withTotal: styles["ids-status-bar--with-total"],
  totalItem: styles["ids-status-bar-total-item"],
  viewport: styles["ids-status-bar-content-viewport"],
  strip: styles["ids-status-bar-content-strip"],
  item: styles["ids-status-bar-item"],
  itemDisabled: styles["ids-status-bar-item--disabled"],
  iconSlot: styles["ids-status-bar-item-icon-slot"],
  mainIcon: styles["ids-status-bar-inventory-main-icon"],
  badge: styles["ids-status-bar-inventory-status-badge"],
  value: styles["ids-status-bar-item-value"],
  meta: styles["ids-status-bar-item-meta"],
  category: styles["ids-status-bar-item-category"],
  label: styles["ids-status-bar-item-label"],
  divider: styles["ids-status-bar-item-divider"],
  dividerLeft: styles["ids-status-bar-item-divider--left"],
  dividerRight: styles["ids-status-bar-item-divider--right"],
  overflowLayer: styles["ids-status-bar-overflow-layer"],
  overflowBtn: styles["ids-status-bar-overflow-button"],
  overflowLeft: styles["ids-status-bar-overflow-button--left"],
  overflowRight: styles["ids-status-bar-overflow-button--right"],
  overflowIcon: styles["ids-status-bar-overflow-icon"],
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getSlot(type: unknown): SlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [SLOT]?: SlotName })[SLOT];
}

function markSlot<T>(fn: T, name: SlotName): T {
  (fn as { [SLOT]?: SlotName })[SLOT] = name;
  return fn;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveType(value: unknown): IdsStatusBarType {
  if (value === "status-small" || value === "inventory") return value;
  return "status-large";
}

function resolveOverflowState(value: unknown): IdsStatusBarOverflowState {
  if (value === "beginning" || value === "middle" || value === "end") return value;
  return "auto";
}

function resolveItemState(state: IdsStatusBarItemState | undefined): IdsStatusBarItemState {
  if (
    state === "hover" ||
    state === "press" ||
    state === "selected" ||
    state === "disabled"
  ) {
    return state;
  }
  return "default";
}

function isKnownSeverity(value: string | undefined): value is IdsStatusBarSeverity {
  return value != null && SEVERITY_SET.has(value);
}

function severityIcon(severity: string | undefined): string | undefined {
  if (!isKnownSeverity(severity)) return undefined;
  return SEVERITY_ICON[severity];
}

function iconSizeForType(type: IdsStatusBarType): number {
  return type === "status-small" ? 16 : 32;
}

function defaultItemsForType(type: IdsStatusBarType): IdsStatusBarItemInput[] {
  return type === "inventory" ? DEFAULT_INVENTORY_ITEMS : DEFAULT_STATUS_ITEMS;
}

function resolveItems(
  items: IdsStatusBarItemInput[] | undefined,
  type: IdsStatusBarType,
): IdsStatusBarItemInput[] {
  if (!items || items.length === 0) return defaultItemsForType(type);
  return items;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsStatusBarContextValue {
  type: IdsStatusBarType;
  isInventory: boolean;
  isSmall: boolean;
  hasTotal: boolean;
  iconSize: number;
  overflowState: IdsStatusBarOverflowState;
  showLeft: boolean;
  showRight: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  scrollByDirection: (direction: "left" | "right") => void;
  onItemSelect?: (id: string) => void;
}

const IdsStatusBarContext = createContext<IdsStatusBarContextValue | null>(null);

function useStatusBar(slot: string): IdsStatusBarContextValue {
  const ctx = useContext(IdsStatusBarContext);
  if (!ctx) throw new Error(`${slot} must be used within IdsStatusBar.`);
  return ctx;
}

function hasCompoundSlots(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getSlot(child.type);
    if (slot === "total-item" || slot === "content-viewport" || slot === "item") {
      found = true;
    }
  });
  return found;
}

function partitionViewportChildren(children: ReactNode): {
  items: ReactNode[];
  overflow: ReactElement | null;
} {
  const items: ReactNode[] = [];
  let overflow: ReactElement | null = null;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) items.push(child);
      return;
    }
    if (getSlot(child.type) === "overflow-layer") {
      overflow = child as ReactElement;
      return;
    }
    items.push(child);
  });
  return { items, overflow };
}

function partitionRootChildren(children: ReactNode): {
  total: ReactElement | null;
  viewport: ReactElement | null;
  items: ReactElement[];
} {
  let total: ReactElement | null = null;
  let viewport: ReactElement | null = null;
  const items: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getSlot(child.type);
    if (slot === "total-item") {
      total = child as ReactElement;
      return;
    }
    if (slot === "content-viewport") {
      viewport = child as ReactElement;
      return;
    }
    if (slot === "item") {
      items.push(child as ReactElement);
    }
  });
  return { total, viewport, items };
}

/* -------------------------------------------------------------------------- */
/* Anatomy slots                                                              */
/* -------------------------------------------------------------------------- */

export interface IdsStatusBarItemDividerProps {
  side?: "left" | "right";
  className?: string;
}

export function IdsStatusBarItemDivider({
  side = "right",
  className,
}: IdsStatusBarItemDividerProps) {
  return (
    <span
      className={cx(
        s.divider,
        side === "left" ? s.dividerLeft : s.dividerRight,
        className,
      )}
      data-ids="ids-status-bar-item-divider"
      data-side={side}
      aria-hidden="true"
    />
  );
}
IdsStatusBarItemDivider.displayName = "IdsStatusBarItemDivider";
markSlot(IdsStatusBarItemDivider, "divider");

export interface IdsStatusBarItemValueProps {
  children?: ReactNode;
  className?: string;
}

export function IdsStatusBarItemValue({ children, className }: IdsStatusBarItemValueProps) {
  if (children == null || children === false) return null;
  return (
    <span className={cx(s.value, className)} data-ids="ids-status-bar-item-value">
      {children}
    </span>
  );
}
IdsStatusBarItemValue.displayName = "IdsStatusBarItemValue";
markSlot(IdsStatusBarItemValue, "value");

export interface IdsStatusBarItemMetaProps {
  category?: string;
  children?: ReactNode;
  className?: string;
}

export function IdsStatusBarItemMeta({
  category,
  children,
  className,
}: IdsStatusBarItemMetaProps) {
  if ((children == null || children === false) && !category) return null;
  return (
    <span className={cx(s.meta, className)} data-ids="ids-status-bar-item-meta">
      {category ? (
        <span className={s.category} data-ids="ids-status-bar-item-category">
          {category}
        </span>
      ) : null}
      {children != null && children !== false ? (
        <span className={s.label} data-ids="ids-status-bar-item-label">
          {children}
        </span>
      ) : null}
    </span>
  );
}
IdsStatusBarItemMeta.displayName = "IdsStatusBarItemMeta";
markSlot(IdsStatusBarItemMeta, "meta");

export interface IdsStatusBarInventoryMainIconProps {
  shape?: string;
  className?: string;
}

export function IdsStatusBarInventoryMainIcon({
  shape,
  className,
}: IdsStatusBarInventoryMainIconProps) {
  const { iconSize } = useStatusBar("IdsStatusBarInventoryMainIcon");
  const resolved = shape && shape.trim() ? shape : INVENTORY_DEFAULT_ICON;
  return (
    <span className={cx(s.mainIcon, className)} data-ids="ids-status-bar-inventory-main-icon">
      <IdsIcon shape={resolved} size={iconSize} color="var(--color-icon-brand-base)" />
    </span>
  );
}
IdsStatusBarInventoryMainIcon.displayName = "IdsStatusBarInventoryMainIcon";
markSlot(IdsStatusBarInventoryMainIcon, "inventory-main-icon");

export interface IdsStatusBarInventoryStatusBadgeProps {
  severity?: IdsStatusBarSeverity | string;
  className?: string;
}

export function IdsStatusBarInventoryStatusBadge({
  severity,
  className,
}: IdsStatusBarInventoryStatusBadgeProps) {
  const icon = severityIcon(severity);
  if (!icon) return null;
  return (
    <span className={cx(s.badge, className)} data-ids="ids-status-bar-inventory-status-badge">
      <IdsIcon shape={icon} size={16} variant="img" />
    </span>
  );
}
IdsStatusBarInventoryStatusBadge.displayName = "IdsStatusBarInventoryStatusBadge";
markSlot(IdsStatusBarInventoryStatusBadge, "inventory-status-badge");

export interface IdsStatusBarItemIconSlotProps {
  children?: ReactNode;
  className?: string;
}

export function IdsStatusBarItemIconSlot({ children, className }: IdsStatusBarItemIconSlotProps) {
  if (children == null || children === false) return null;
  return (
    <span className={cx(s.iconSlot, className)} data-ids="ids-status-bar-item-icon-slot">
      {children}
    </span>
  );
}
IdsStatusBarItemIconSlot.displayName = "IdsStatusBarItemIconSlot";
markSlot(IdsStatusBarItemIconSlot, "icon-slot");

function DefaultItemIconSlot({
  item,
}: {
  item: Pick<IdsStatusBarItemInput, "severity" | "iconShapeName">;
}) {
  const { isInventory, iconSize } = useStatusBar("IdsStatusBarItemIconSlot");
  if (isInventory) {
    return (
      <IdsStatusBarItemIconSlot>
        <IdsStatusBarInventoryMainIcon shape={item.iconShapeName} />
        <IdsStatusBarInventoryStatusBadge severity={item.severity} />
      </IdsStatusBarItemIconSlot>
    );
  }
  const icon = severityIcon(item.severity);
  if (!icon) return null;
  return (
    <IdsStatusBarItemIconSlot>
      <IdsIcon shape={icon} size={iconSize} variant="img" />
    </IdsStatusBarItemIconSlot>
  );
}

export interface IdsStatusBarItemProps extends HTMLAttributes<HTMLElement> {
  itemId?: string;
  value?: number | string;
  category?: string;
  label?: string;
  severity?: IdsStatusBarSeverity | string;
  state?: IdsStatusBarItemState;
  iconShapeName?: string;
  showLeadingDivider?: boolean;
  children?: ReactNode;
}

export function IdsStatusBarItem({
  itemId,
  value,
  category,
  label,
  severity,
  state: stateProp,
  iconShapeName,
  showLeadingDivider = false,
  children,
  className,
  onClick,
  onKeyDown,
  ...rest
}: IdsStatusBarItemProps) {
  const ctx = useStatusBar("IdsStatusBarItem");
  const state = resolveItemState(stateProp);
  const disabled = state === "disabled";
  const interactive = Boolean(ctx.onItemSelect && itemId) && !disabled;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (itemId) ctx.onItemSelect?.(itemId);
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!interactive) {
      onKeyDown?.(event);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (itemId) ctx.onItemSelect?.(itemId);
    }
    onKeyDown?.(event);
  };

  const composed =
    children ??
    (value != null || label != null ? (
      <>
        {showLeadingDivider ? <IdsStatusBarItemDivider side="left" /> : null}
        <DefaultItemIconSlot item={{ severity: severity as IdsStatusBarSeverity | undefined, iconShapeName }} />
        <IdsStatusBarItemValue>{value}</IdsStatusBarItemValue>
        <IdsStatusBarItemMeta category={category}>{label}</IdsStatusBarItemMeta>
        <IdsStatusBarItemDivider side="right" />
      </>
    ) : null);

  return (
    <div
      {...rest}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-disabled={disabled || undefined}
      data-ids="ids-status-bar-item"
      data-item-id={itemId}
      data-state={state !== "default" ? state : undefined}
      className={cx(s.item, disabled && s.itemDisabled, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {composed}
    </div>
  );
}
IdsStatusBarItem.displayName = "IdsStatusBarItem";
markSlot(IdsStatusBarItem, "item");

export interface IdsStatusBarTotalItemProps {
  value?: number | string;
  label?: string;
  category?: string;
  children?: ReactNode;
  className?: string;
}

export function IdsStatusBarTotalItem({
  value,
  label,
  category,
  children,
  className,
}: IdsStatusBarTotalItemProps) {
  useStatusBar("IdsStatusBarTotalItem");
  const composed =
    children ??
    (value != null ? (
      <>
        <IdsStatusBarItemDivider side="left" />
        <IdsStatusBarItemValue>{value}</IdsStatusBarItemValue>
        <IdsStatusBarItemMeta category={category}>{label ?? "Total"}</IdsStatusBarItemMeta>
        <IdsStatusBarItemDivider side="right" />
      </>
    ) : null);

  return (
    <div
      className={cx(s.totalItem, className)}
      data-ids="ids-status-bar-total-item"
    >
      {composed}
    </div>
  );
}
IdsStatusBarTotalItem.displayName = "IdsStatusBarTotalItem";
markSlot(IdsStatusBarTotalItem, "total-item");

export interface IdsStatusBarOverflowLeftProps {
  className?: string;
}

export function IdsStatusBarOverflowLeft({ className }: IdsStatusBarOverflowLeftProps) {
  const ctx = useStatusBar("IdsStatusBarOverflowLeft");
  if (!ctx.showLeft) return null;
  return (
    <button
      type="button"
      className={cx(s.overflowBtn, s.overflowLeft, className)}
      data-ids="ids-status-bar-overflow-left"
      aria-label="Scroll status bar left"
      onClick={() => ctx.scrollByDirection("left")}
    >
      <IdsIcon
        shape={OVERFLOW_LEFT_ICON}
        size={16}
        color="var(--color-icon-brand-base)"
        className={s.overflowIcon}
      />
    </button>
  );
}
IdsStatusBarOverflowLeft.displayName = "IdsStatusBarOverflowLeft";
markSlot(IdsStatusBarOverflowLeft, "overflow-left");

export interface IdsStatusBarOverflowRightProps {
  className?: string;
}

export function IdsStatusBarOverflowRight({ className }: IdsStatusBarOverflowRightProps) {
  const ctx = useStatusBar("IdsStatusBarOverflowRight");
  if (!ctx.showRight) return null;
  return (
    <button
      type="button"
      className={cx(s.overflowBtn, s.overflowRight, className)}
      data-ids="ids-status-bar-overflow-right"
      aria-label="Scroll status bar right"
      onClick={() => ctx.scrollByDirection("right")}
    >
      <IdsIcon
        shape={OVERFLOW_RIGHT_ICON}
        size={16}
        color="var(--color-icon-brand-base)"
        className={s.overflowIcon}
      />
    </button>
  );
}
IdsStatusBarOverflowRight.displayName = "IdsStatusBarOverflowRight";
markSlot(IdsStatusBarOverflowRight, "overflow-right");

export interface IdsStatusBarOverflowLayerProps {
  children?: ReactNode;
  className?: string;
}

export function IdsStatusBarOverflowLayer({
  children,
  className,
}: IdsStatusBarOverflowLayerProps) {
  const ctx = useStatusBar("IdsStatusBarOverflowLayer");
  if (!ctx.hasTotal) return null;
  const composed =
    children ?? (
      <>
        <IdsStatusBarOverflowLeft />
        <IdsStatusBarOverflowRight />
      </>
    );
  return (
    <div
      className={cx(s.overflowLayer, className)}
      data-ids="ids-status-bar-overflow-layer"
    >
      {composed}
    </div>
  );
}
IdsStatusBarOverflowLayer.displayName = "IdsStatusBarOverflowLayer";
markSlot(IdsStatusBarOverflowLayer, "overflow-layer");

export interface IdsStatusBarContentViewportProps {
  children?: ReactNode;
  className?: string;
}

export function IdsStatusBarContentViewport({
  children,
  className,
}: IdsStatusBarContentViewportProps) {
  const ctx = useStatusBar("IdsStatusBarContentViewport");
  const { items, overflow } = partitionViewportChildren(children);
  return (
    <div
      className={cx(s.viewport, className)}
      data-ids="ids-status-bar-content-viewport"
    >
      <div ref={ctx.contentRef} className={s.strip} data-ids="ids-status-bar-content-strip">
        {items}
      </div>
      {overflow ?? (ctx.hasTotal ? <IdsStatusBarOverflowLayer /> : null)}
    </div>
  );
}
IdsStatusBarContentViewport.displayName = "IdsStatusBarContentViewport";
markSlot(IdsStatusBarContentViewport, "content-viewport");

/* -------------------------------------------------------------------------- */
/* Default anatomy from props                                                 */
/* -------------------------------------------------------------------------- */

function DefaultStatusBarAnatomy({
  items,
  total,
  totalLabel,
  totalCategory,
}: {
  items: IdsStatusBarItemInput[];
  total?: number | string;
  totalLabel: string;
  totalCategory?: string;
}) {
  const lastIndex = items.length - 1;
  return (
    <>
      {total != null ? (
        <IdsStatusBarTotalItem value={total} label={totalLabel} category={totalCategory} />
      ) : null}
      <IdsStatusBarContentViewport>
        {items.map((item, index) => (
          <IdsStatusBarItem
            key={item.id}
            itemId={item.id}
            value={item.value}
            category={item.category}
            label={item.label}
            severity={item.severity}
            state={item.state}
            iconShapeName={item.iconShapeName}
            showLeadingDivider={index === 0}
            data-last={index === lastIndex ? "true" : undefined}
          />
        ))}
      </IdsStatusBarContentViewport>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Root — StatusBar                                                           */
/* -------------------------------------------------------------------------- */

export function IdsStatusBar({
  type: typeProp,
  items: itemsProp,
  total,
  totalLabel = "Total",
  totalCategory,
  overflowState: overflowStateProp,
  onItemSelect,
  children,
  className,
  "aria-label": ariaLabel,
  ...rest
}: IdsStatusBarProps) {
  const type = resolveType(typeProp);
  const overflowState = resolveOverflowState(overflowStateProp);
  const hasTotal = total != null;
  const isInventory = type === "inventory";
  const isSmall = type === "status-small";
  const resolvedItems = resolveItems(itemsProp, type);
  const compound = hasCompoundSlots(children);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateOverflow = useCallback(() => {
    if (!hasTotal || !contentRef.current) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const node = contentRef.current;
    const max = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(node.scrollLeft > 1);
    setCanScrollRight(node.scrollLeft < max - 1);
  }, [hasTotal]);

  useEffect(() => {
    updateOverflow();
    const node = contentRef.current;
    if (!node) return;
    node.addEventListener("scroll", updateOverflow);
    window.addEventListener("resize", updateOverflow);
    return () => {
      node.removeEventListener("scroll", updateOverflow);
      window.removeEventListener("resize", updateOverflow);
    };
  }, [updateOverflow, type, resolvedItems.length, compound]);

  const scrollByDirection = useCallback((direction: "left" | "right") => {
    const node = contentRef.current;
    if (!node) return;
    node.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  }, []);

  const showLeft =
    hasTotal &&
    (overflowState === "middle" ||
      overflowState === "end" ||
      (overflowState === "auto" && canScrollLeft));
  const showRight =
    hasTotal &&
    (overflowState === "beginning" ||
      overflowState === "middle" ||
      (overflowState === "auto" && canScrollRight));

  const runtime = useMemo<IdsStatusBarContextValue>(
    () => ({
      type,
      isInventory,
      isSmall,
      hasTotal,
      iconSize: iconSizeForType(type),
      overflowState,
      showLeft,
      showRight,
      contentRef,
      scrollByDirection,
      onItemSelect,
    }),
    [
      type,
      isInventory,
      isSmall,
      hasTotal,
      overflowState,
      showLeft,
      showRight,
      scrollByDirection,
      onItemSelect,
    ],
  );

  let body: ReactNode;
  if (compound && children != null) {
    const partitioned = partitionRootChildren(children);
    if (partitioned.viewport) {
      body = (
        <>
          {partitioned.total}
          {partitioned.viewport}
        </>
      );
    } else if (partitioned.items.length > 0) {
      body = (
        <>
          {partitioned.total}
          <IdsStatusBarContentViewport>{partitioned.items}</IdsStatusBarContentViewport>
        </>
      );
    } else {
      body = children;
    }
  } else {
    body = (
      <DefaultStatusBarAnatomy
        items={resolvedItems}
        total={total}
        totalLabel={totalLabel}
        totalCategory={totalCategory}
      />
    );
  }

  return (
    <IdsStatusBarContext.Provider value={runtime}>
      <section
        {...rest}
        aria-label={ariaLabel ?? "Status Bar"}
        data-ids="ids-status-bar"
        data-type={type}
        data-has-total={hasTotal ? "true" : undefined}
        data-overflow={hasTotal ? overflowState : undefined}
        className={cx(
          s.root,
          type === "status-small" ? s.small : type === "inventory" ? s.inventory : s.large,
          hasTotal && s.withTotal,
          className,
        )}
      >
        {body}
      </section>
    </IdsStatusBarContext.Provider>
  );
}
IdsStatusBar.displayName = "IdsStatusBar";

export const IdsStatusBarCompound = Object.assign(IdsStatusBar, {
  TotalItem: IdsStatusBarTotalItem,
  ContentViewport: IdsStatusBarContentViewport,
  Item: IdsStatusBarItem,
  ItemIconSlot: IdsStatusBarItemIconSlot,
  ItemValue: IdsStatusBarItemValue,
  ItemMeta: IdsStatusBarItemMeta,
  ItemDivider: IdsStatusBarItemDivider,
  OverflowLayer: IdsStatusBarOverflowLayer,
  OverflowLeft: IdsStatusBarOverflowLeft,
  OverflowRight: IdsStatusBarOverflowRight,
  InventoryMainIcon: IdsStatusBarInventoryMainIcon,
  InventoryStatusBadge: IdsStatusBarInventoryStatusBadge,
});

export default IdsStatusBarCompound;
