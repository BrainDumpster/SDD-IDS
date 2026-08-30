/**
 * IDS Detail Panel — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/detail-panel`
 * Source: `components/ids/detail-panel/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Composition (Ids-prefixed):
 *   IdsDetailPanel
 *     IdsDetailPanelContent          — expanded branch wrapper
 *       datagrid: IdsDetailPanelHeader + IdsDetailPanelBody
 *       page:     IdsDetailPanelBody + IdsDetailPanelFooter
 *     IdsDetailPanelCollapsedRail    — collapsed icon-only rail
 *       IdsDetailPanelToggleButton
 *
 * Selectors: ids-detail-panel, ids-detail-panel-header, …
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsDetailPanel.module.css";

export type IdsDetailPanelAttachMode = "datagrid" | "page";

const SLOT = Symbol.for("ids.detailPanel.slot");

type SlotName =
  | "toggle"
  | "title"
  | "header"
  | "body"
  | "footer"
  | "content"
  | "collapsed-rail";

function getSlot(type: unknown): SlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [SLOT]?: SlotName })[SLOT];
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsDetailPanelContextValue {
  attachMode: IdsDetailPanelAttachMode;
  isExpanded: boolean;
  bodyId: string;
  ariaLabelExpand: string;
  ariaLabelCollapse: string;
  toggle: () => void;
}

const IdsDetailPanelContext = createContext<IdsDetailPanelContextValue | null>(
  null,
);

function useDetailPanelContext(slot: string): IdsDetailPanelContextValue {
  const ctx = useContext(IdsDetailPanelContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within IdsDetailPanel`);
  }
  return ctx;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveAttachMode(mode: unknown): IdsDetailPanelAttachMode {
  return mode === "page" ? "page" : "datagrid";
}

function resolveWidth(value: number | undefined, fallback: number): number {
  if (value == null || !(value > 0)) return fallback;
  return value;
}

function partitionHeaderChildren(children: ReactNode): {
  titleNodes: ReactNode[];
  toggle: ReactElement | null;
  other: ReactNode[];
} {
  const titleNodes: ReactNode[] = [];
  const other: ReactNode[] = [];
  let toggle: ReactElement | null = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) titleNodes.push(child);
      return;
    }
    const slot = getSlot(child.type);
    if (slot === "toggle") {
      toggle = child;
      return;
    }
    if (slot === "title") {
      titleNodes.push(child);
      return;
    }
    other.push(child);
  });

  return { titleNodes, toggle, other };
}

function partitionToggleOnly(children: ReactNode): {
  toggle: ReactElement | null;
  other: ReactNode[];
} {
  const other: ReactNode[] = [];
  let toggle: ReactElement | null = null;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && getSlot(child.type) === "toggle") {
      toggle = child;
      return;
    }
    if (child != null && child !== false) other.push(child);
  });

  return { toggle, other };
}

/* -------------------------------------------------------------------------- */
/* Root — DetailPanel                                                         */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelProps
  extends Omit<ComponentPropsWithoutRef<"aside">, "children" | "title"> {
  children?: ReactNode;
  attachMode: IdsDetailPanelAttachMode;
  /** Controlled expand state. When omitted, uses local / `defaultExpanded` state. */
  isExpanded?: boolean;
  onExpandedChange?: (next: boolean) => void;
  ariaLabelExpand?: string;
  ariaLabelCollapse?: string;
  collapsedWidth?: number;
  expandedWidth?: number;
  /** Default expanded state when `isExpanded` is uncontrolled. */
  defaultExpanded?: boolean;
}

export function IdsDetailPanel({
  attachMode: attachModeProp,
  isExpanded: isExpandedProp,
  onExpandedChange,
  ariaLabelExpand = "Expand details panel",
  ariaLabelCollapse = "Collapse details panel",
  collapsedWidth: collapsedWidthProp,
  expandedWidth: expandedWidthProp,
  defaultExpanded = true,
  className,
  id: idProp,
  children,
  ...rest
}: IdsDetailPanelProps) {
  const attachMode = resolveAttachMode(attachModeProp);
  const collapsedWidth = resolveWidth(collapsedWidthProp, 40);
  const expandedWidth = resolveWidth(expandedWidthProp, 398);

  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const isControlled = isExpandedProp != null;
  const isExpanded = isControlled ? Boolean(isExpandedProp) : uncontrolledExpanded;

  const reactId = useId();
  const rootId = idProp ?? `ids-detail-panel-${reactId}`;
  const bodyId = `${rootId}-body`;

  const toggle = useCallback(() => {
    const next = !(isControlled ? Boolean(isExpandedProp) : uncontrolledExpanded);
    if (!isControlled) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  }, [isControlled, isExpandedProp, uncontrolledExpanded, onExpandedChange]);

  const ctx = useMemo<IdsDetailPanelContextValue>(
    () => ({
      attachMode,
      isExpanded,
      bodyId,
      ariaLabelExpand,
      ariaLabelCollapse,
      toggle,
    }),
    [attachMode, isExpanded, bodyId, ariaLabelExpand, ariaLabelCollapse, toggle],
  );

  const panelWidth = isExpanded ? expandedWidth : collapsedWidth;

  return (
    <IdsDetailPanelContext.Provider value={ctx}>
      <aside
        id={rootId}
        className={cx(styles["ids-detail-panel"], className)}
        style={{ width: panelWidth }}
        data-ids="ids-detail-panel"
        data-attach-mode={attachMode}
        data-expanded={isExpanded ? "true" : "false"}
        aria-label={`${attachMode} details panel`}
        {...rest}
      >
        {children}
      </aside>
    </IdsDetailPanelContext.Provider>
  );
}

IdsDetailPanel.displayName = "IdsDetailPanel";

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelContentProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDetailPanelContent({
  children,
  className,
  ...rest
}: IdsDetailPanelContentProps) {
  const { isExpanded } = useDetailPanelContext("IdsDetailPanelContent");
  if (!isExpanded) return null;

  return (
    <div
      className={cx(styles["ids-detail-panel-content"], className)}
      data-ids="ids-detail-panel-content"
      {...rest}
    >
      {children}
    </div>
  );
}

IdsDetailPanelContent.displayName = "IdsDetailPanelContent";
(IdsDetailPanelContent as { [SLOT]?: SlotName })[SLOT] = "content";

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelHeaderProps
  extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsDetailPanelHeader({
  children,
  className,
  ...rest
}: IdsDetailPanelHeaderProps) {
  useDetailPanelContext("IdsDetailPanelHeader");
  const { titleNodes, toggle, other } = partitionHeaderChildren(children);

  return (
    <header
      className={cx(styles["ids-detail-panel-header"], className)}
      data-ids="ids-detail-panel-header"
      {...rest}
    >
      {titleNodes.length > 0 ? (
        <h3 className={styles["ids-detail-panel-title"]}>{titleNodes}</h3>
      ) : null}
      {other}
      {toggle ? (
        <div className={styles["ids-detail-panel-controls"]}>{toggle}</div>
      ) : null}
    </header>
  );
}

IdsDetailPanelHeader.displayName = "IdsDetailPanelHeader";
(IdsDetailPanelHeader as { [SLOT]?: SlotName })[SLOT] = "header";

/* -------------------------------------------------------------------------- */
/* Title                                                                      */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelTitleProps
  extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

/** Optional title marker inside Header (lifted into the heading). */
export function IdsDetailPanelTitle({ children }: IdsDetailPanelTitleProps) {
  return <>{children}</>;
}

IdsDetailPanelTitle.displayName = "IdsDetailPanelTitle";
(IdsDetailPanelTitle as { [SLOT]?: SlotName })[SLOT] = "title";

/* -------------------------------------------------------------------------- */
/* Body                                                                       */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelBodyProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDetailPanelBody({
  children,
  className,
  id,
  ...rest
}: IdsDetailPanelBodyProps) {
  const { bodyId } = useDetailPanelContext("IdsDetailPanelBody");

  return (
    <div
      id={id ?? bodyId}
      className={cx(styles["ids-detail-panel-body"], className)}
      data-ids="ids-detail-panel-body"
      {...rest}
    >
      {children}
    </div>
  );
}

IdsDetailPanelBody.displayName = "IdsDetailPanelBody";
(IdsDetailPanelBody as { [SLOT]?: SlotName })[SLOT] = "body";

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelFooterProps
  extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsDetailPanelFooter({
  children,
  className,
  ...rest
}: IdsDetailPanelFooterProps) {
  useDetailPanelContext("IdsDetailPanelFooter");
  const { toggle, other } = partitionToggleOnly(children);

  return (
    <footer
      className={cx(styles["ids-detail-panel-footer"], className)}
      data-ids="ids-detail-panel-footer"
      {...rest}
    >
      {other}
      <div className={styles["ids-detail-panel-controls"]}>
        {toggle ?? null}
      </div>
    </footer>
  );
}

IdsDetailPanelFooter.displayName = "IdsDetailPanelFooter";
(IdsDetailPanelFooter as { [SLOT]?: SlotName })[SLOT] = "footer";

/* -------------------------------------------------------------------------- */
/* Collapsed rail                                                             */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelCollapsedRailProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDetailPanelCollapsedRail({
  children,
  className,
  ...rest
}: IdsDetailPanelCollapsedRailProps) {
  const { isExpanded, attachMode } = useDetailPanelContext(
    "IdsDetailPanelCollapsedRail",
  );
  if (isExpanded) return null;

  return (
    <div
      className={cx(
        styles["ids-detail-panel-collapsed-rail"],
        attachMode === "page"
          ? styles["ids-detail-panel-collapsed-rail--page"]
          : styles["ids-detail-panel-collapsed-rail--datagrid"],
        className,
      )}
      data-ids="ids-detail-panel-collapsed-rail"
      {...rest}
    >
      <div className={styles["ids-detail-panel-controls"]}>{children}</div>
    </div>
  );
}

IdsDetailPanelCollapsedRail.displayName = "IdsDetailPanelCollapsedRail";
(IdsDetailPanelCollapsedRail as { [SLOT]?: SlotName })[SLOT] = "collapsed-rail";

/* -------------------------------------------------------------------------- */
/* Toggle                                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsDetailPanelToggleButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "type"> {}

export function IdsDetailPanelToggleButton({
  className,
  onClick,
  ...rest
}: IdsDetailPanelToggleButtonProps) {
  const {
    isExpanded,
    bodyId,
    ariaLabelExpand,
    ariaLabelCollapse,
    toggle,
  } = useDetailPanelContext("IdsDetailPanelToggleButton");

  const toggleIcon = isExpanded ? "double-chev-right" : "double-chev-left";
  const toggleAriaLabel = isExpanded ? ariaLabelCollapse : ariaLabelExpand;

  return (
    <button
      type="button"
      className={cx(styles["ids-detail-panel-toggle"], className)}
      data-ids="ids-detail-panel-toggle"
      aria-label={toggleAriaLabel}
      aria-expanded={isExpanded}
      aria-controls={isExpanded ? bodyId : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
      {...rest}
    >
      <IdsIcon shape={toggleIcon} variant="mask" size={16} color="currentColor" />
    </button>
  );
}

IdsDetailPanelToggleButton.displayName = "IdsDetailPanelToggleButton";
(IdsDetailPanelToggleButton as { [SLOT]?: SlotName })[SLOT] = "toggle";

export default IdsDetailPanel;
