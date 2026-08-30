/**
 * IDS Modal — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/modal`
 * Source: `components/ids/modal/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (main layer):
 *   IdsModal
 *     overlay + surface
 *       IdsModalHeader (severityIcon? | IdsModalTitle | IdsModalClose?)
 *       IdsModalDescription?
 *       IdsModalTabs? (multi-page)
 *       IdsModalContent?
 *       IdsModalFooter (footerCheckbox? | actions)
 *
 * Prop-driven chrome (title + primaryActionLabel) builds the same slots.
 * IdsModal.Close === IdsModalClose.
 *
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IdsButton, IdsButtonLabel } from "../button";
import { IdsIcon } from "../icon";
import styles from "./IdsModal.module.css";

export type IdsModalScenario =
  | "single-page"
  | "multi-page"
  | "dialog"
  | "wizard"
  | "custom";

export type IdsModalType =
  | "non-alerting"
  | "informational"
  | "warning"
  | "major"
  | "critical"
  | "destructive";

export type IdsModalSize = "x-small" | "small" | "medium" | "large";
export type IdsModalLayer = "main" | "carousel" | "single-preview";

export interface IdsModalPage {
  id: string;
  label: string;
  content: ReactNode;
}

const SLOT = Symbol.for("ids.modal.slot");
type SlotName =
  | "header"
  | "title"
  | "description"
  | "tabs"
  | "content"
  | "footer"
  | "close";

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

function resolveScenario(value: unknown): IdsModalScenario {
  if (
    value === "multi-page" ||
    value === "dialog" ||
    value === "wizard" ||
    value === "custom"
  ) {
    return value;
  }
  return "single-page";
}

function resolveType(value: unknown): IdsModalType {
  if (
    value === "informational" ||
    value === "warning" ||
    value === "major" ||
    value === "critical" ||
    value === "destructive"
  ) {
    return value;
  }
  return "non-alerting";
}

function resolveSize(value: unknown): IdsModalSize {
  if (value === "x-small" || value === "small" || value === "medium") return value;
  return "large";
}

const SEVERITY_ICON: Record<
  Exclude<IdsModalType, "non-alerting">,
  string
> = {
  informational: "info-circ-solid",
  warning: "status-warn-tri-solid",
  major: "status-error-diamond-solid",
  critical: "status-critical-square-solid",
  destructive: "status-critical-square-solid",
};

const TWO_BUTTON_TYPES: ReadonlySet<IdsModalType> = new Set([
  "warning",
  "major",
  "critical",
  "destructive",
]);

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
  );
}

function hasCompoundSlots(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getSlot(child.type);
    if (
      slot === "header" ||
      slot === "description" ||
      slot === "content" ||
      slot === "footer" ||
      slot === "tabs"
    ) {
      found = true;
    }
  });
  return found;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsModalContextValue {
  close: () => void;
  open: boolean;
  type: IdsModalType;
  scenario: IdsModalScenario;
  titleId: string;
  descriptionId: string;
  scrollBar: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const IdsModalContext = createContext<IdsModalContextValue | null>(null);

function useModalContext(slot: string): IdsModalContextValue {
  const ctx = useContext(IdsModalContext);
  if (!ctx) throw new Error(`${slot} must be used within IdsModal`);
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Close                                                                      */
/* -------------------------------------------------------------------------- */

export interface IdsModalCloseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function IdsModalClose({
  children,
  className,
  onClick,
  ...rest
}: IdsModalCloseProps) {
  const ctx = useContext(IdsModalContext);

  return (
    <button
      type="button"
      className={cx(styles["ids-modal-close"], className)}
      data-ids="ids-modal-close"
      aria-label="Close"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx?.close();
      }}
      {...rest}
    >
      {children ?? (
        <IdsIcon shape="shape-x" variant="mask" size={16} color="currentColor" />
      )}
    </button>
  );
}

IdsModalClose.displayName = "IdsModalClose";
markSlot(IdsModalClose, "close");

/* -------------------------------------------------------------------------- */
/* Title                                                                      */
/* -------------------------------------------------------------------------- */

export interface IdsModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export function IdsModalTitle({
  children,
  className,
  id,
  ...rest
}: IdsModalTitleProps) {
  const { titleId } = useModalContext("IdsModalTitle");
  return (
    <h2
      id={id ?? titleId}
      className={cx(styles["ids-modal-title"], className)}
      data-ids="ids-modal-title"
      {...rest}
    >
      {children}
    </h2>
  );
}

IdsModalTitle.displayName = "IdsModalTitle";
markSlot(IdsModalTitle, "title");

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsModalHeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /** When true, render dialog severity icon from root `type`. */
  showSeverityIcon?: boolean;
}

export function IdsModalHeader({
  children,
  className,
  showSeverityIcon,
  ...rest
}: IdsModalHeaderProps) {
  const { type, scenario } = useModalContext("IdsModalHeader");
  const showIcon =
    showSeverityIcon ?? (scenario === "dialog" && type !== "non-alerting");

  let titleNode: ReactNode = null;
  let closeNode: ReactNode = null;
  const other: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) other.push(child);
      return;
    }
    const slot = getSlot(child.type);
    if (slot === "title") {
      titleNode = child;
      return;
    }
    if (slot === "close") {
      closeNode = child;
      return;
    }
    other.push(child);
  });

  return (
    <header
      className={cx(styles["ids-modal-header"], className)}
      data-ids="ids-modal-header"
      {...rest}
    >
      <div className={styles["ids-modal-header-left"]}>
        {showIcon && type !== "non-alerting" ? (
          <span
            className={styles["ids-modal-severity-icon"]}
            data-ids="ids-modal-severity-icon"
            aria-hidden="true"
          >
            <IdsIcon shape={SEVERITY_ICON[type]} variant="img" size={24} />
          </span>
        ) : null}
        {titleNode}
        {other}
      </div>
      {closeNode ? (
        <div className={styles["ids-modal-header-controls"]}>{closeNode}</div>
      ) : null}
    </header>
  );
}

IdsModalHeader.displayName = "IdsModalHeader";
markSlot(IdsModalHeader, "header");

/* -------------------------------------------------------------------------- */
/* Description                                                                */
/* -------------------------------------------------------------------------- */

export interface IdsModalDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export function IdsModalDescription({
  children,
  className,
  id,
  ...rest
}: IdsModalDescriptionProps) {
  const { type, descriptionId } = useModalContext("IdsModalDescription");
  const typeClass =
    styles[`ids-modal-description--${type}`] ??
    styles["ids-modal-description--non-alerting"];

  return (
    <p
      id={id ?? descriptionId}
      className={cx(styles["ids-modal-description"], typeClass, className)}
      data-ids="ids-modal-description"
      {...rest}
    >
      {children}
    </p>
  );
}

IdsModalDescription.displayName = "IdsModalDescription";
markSlot(IdsModalDescription, "description");

/* -------------------------------------------------------------------------- */
/* Tabs                                                                       */
/* -------------------------------------------------------------------------- */

export interface IdsModalTabsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsModalTabs({
  children,
  className,
  ...rest
}: IdsModalTabsProps) {
  useModalContext("IdsModalTabs");
  return (
    <div
      className={cx(styles["ids-modal-tabs"], className)}
      data-ids="ids-modal-tabs"
      role="tablist"
      {...rest}
    >
      {children}
    </div>
  );
}

IdsModalTabs.displayName = "IdsModalTabs";
markSlot(IdsModalTabs, "tabs");

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

export interface IdsModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsModalContent({
  children,
  className,
  ...rest
}: IdsModalContentProps) {
  const { type, scrollBar, contentRef } = useModalContext("IdsModalContent");
  const typeClass =
    type === "warning" ||
    type === "major" ||
    type === "critical" ||
    type === "destructive"
      ? styles[`ids-modal-content--${type}`]
      : undefined;

  return (
    <div
      ref={contentRef}
      className={cx(
        styles["ids-modal-content"],
        typeClass,
        scrollBar && styles["ids-modal-content--scroll"],
        className,
      )}
      data-ids="ids-modal-content"
      {...rest}
    >
      {children}
    </div>
  );
}

IdsModalContent.displayName = "IdsModalContent";
markSlot(IdsModalContent, "content");

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export interface IdsModalFooterProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsModalFooter({
  children,
  className,
  ...rest
}: IdsModalFooterProps) {
  useModalContext("IdsModalFooter");
  return (
    <footer
      className={cx(styles["ids-modal-footer"], className)}
      data-ids="ids-modal-footer"
      {...rest}
    >
      {children}
    </footer>
  );
}

IdsModalFooter.displayName = "IdsModalFooter";
markSlot(IdsModalFooter, "footer");

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */

export interface IdsModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  scenario?: IdsModalScenario;
  pages?: IdsModalPage[];
  activePageId?: string;
  onPageChange?: (pageId: string) => void;
  type?: IdsModalType;
  /** Required for prop-driven chrome when compound slots are not projected. */
  title?: string;
  description?: string;
  closable?: boolean;
  size?: IdsModalSize;
  tabs?: boolean;
  scrollBar?: boolean;
  footerCheckbox?: boolean;
  fullScreen?: boolean;
  children?: ReactNode;
  /** Required for prop-driven chrome when compound slots are not projected. */
  primaryActionLabel?: string;
  tertiaryActionLabel?: string;
  enablePrimaryAction?: boolean;
  enableTertiaryAction?: boolean;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onTertiaryAction?: () => void;
  layer?: IdsModalLayer;
  className?: string;
  labelledBy?: string;
  describedBy?: string;
}

export function IdsModal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  scenario: scenarioProp,
  pages,
  activePageId: activePageIdProp,
  onPageChange,
  type: typeProp,
  title,
  description,
  closable = true,
  size: sizeProp,
  tabs: tabsProp,
  scrollBar = false,
  footerCheckbox = false,
  fullScreen = false,
  children,
  primaryActionLabel,
  tertiaryActionLabel,
  enablePrimaryAction = true,
  enableTertiaryAction = true,
  onClose,
  onPrimaryAction,
  onTertiaryAction,
  layer = "main",
  className,
  labelledBy,
  describedBy,
}: IdsModalProps) {
  const scenario = resolveScenario(scenarioProp);
  const type = resolveType(typeProp);
  const size = resolveSize(sizeProp);
  const compound = hasCompoundSlots(children);
  const showTabs = scenario === "multi-page" && (tabsProp ?? true);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpenControlled = openProp != null;
  const open = isOpenControlled ? Boolean(openProp) : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) onClose?.();
    },
    [isOpenControlled, onOpenChange, onClose],
  );

  const close = useCallback(() => {
    if (!closable) return;
    setOpen(false);
  }, [closable, setOpen]);

  const pageList = pages ?? [];
  const [uncontrolledPageId, setUncontrolledPageId] = useState(
    () => pageList[0]?.id ?? "",
  );
  const isPageControlled = activePageIdProp != null;
  const activePageId = isPageControlled
    ? activePageIdProp
    : uncontrolledPageId || pageList[0]?.id || "";

  const setActivePageId = (pageId: string) => {
    if (!isPageControlled) setUncontrolledPageId(pageId);
    onPageChange?.(pageId);
  };

  const activePage = pageList.find((p) => p.id === activePageId) ?? pageList[0];

  const reactId = useId();
  const titleId = `${reactId}-title`;
  const descriptionId = `${reactId}-description`;

  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [showScrollShadow, setShowScrollShadow] = useState(false);
  const [footerChecked, setFooterChecked] = useState(false);

  const ctx = useMemo<IdsModalContextValue>(
    () => ({
      close,
      open,
      type,
      scenario,
      titleId,
      descriptionId,
      scrollBar,
      contentRef,
    }),
    [close, open, type, scenario, titleId, descriptionId, scrollBar],
  );

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const surface = surfaceRef.current;
    if (!surface) return;
    const focusables = getFocusable(surface);
    (focusables[0] ?? surface).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (closable) {
          event.preventDefault();
          close();
        }
        return;
      }
      if (event.key !== "Tab" || !surfaceRef.current) return;
      const items = getFocusable(surfaceRef.current);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || !surfaceRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open, closable, close]);

  useEffect(() => {
    if (!open || !scrollBar) {
      setShowScrollShadow(false);
      return;
    }
    const el = contentRef.current;
    if (!el) return;
    const update = () => {
      const scrollable = el.scrollHeight - el.clientHeight > 1;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setShowScrollShadow(scrollable && !atBottom);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [open, scrollBar, children, description, activePageId, type, compound]);

  if (!open || typeof document === "undefined") return null;

  const showTertiary =
    Boolean(tertiaryActionLabel) &&
    (scenario !== "dialog" || TWO_BUTTON_TYPES.has(type));
  const primaryVariant = type === "destructive" ? "destructive" : "primary";

  const overlayLayerClass =
    layer === "carousel"
      ? styles["ids-modal-overlay--carousel"]
      : layer === "single-preview"
        ? styles["ids-modal-overlay--single-preview"]
        : undefined;
  const surfaceLayerClass =
    layer === "carousel"
      ? styles["ids-modal-surface--carousel"]
      : layer === "single-preview"
        ? styles["ids-modal-surface--single-preview"]
        : undefined;
  const sizeClass = fullScreen
    ? styles["ids-modal-surface--full-screen"]
    : styles[`ids-modal-surface--${size}`];

  const propDrivenInterior = (
    <>
      <IdsModalHeader>
        <IdsModalTitle>{title}</IdsModalTitle>
        {closable ? <IdsModalClose /> : null}
      </IdsModalHeader>

      {description ? (
        <IdsModalDescription>{description}</IdsModalDescription>
      ) : null}

      {showTabs ? (
        pageList.length === 0 ? (
          <p className={styles["ids-modal-empty"]}>No pages available.</p>
        ) : (
          <IdsModalTabs>
            {pageList.map((page) => (
              <button
                key={page.id}
                type="button"
                role="tab"
                className={styles["ids-modal-tab"]}
                data-active={page.id === activePageId ? "true" : "false"}
                aria-selected={page.id === activePageId}
                onClick={() => setActivePageId(page.id)}
              >
                {page.label}
              </button>
            ))}
          </IdsModalTabs>
        )
      ) : null}

      {scenario === "multi-page" ? (
        <IdsModalContent>
          {activePage?.content ?? (
            <p className={styles["ids-modal-empty"]}>No pages available.</p>
          )}
        </IdsModalContent>
      ) : children != null && children !== false ? (
        <IdsModalContent>{children}</IdsModalContent>
      ) : null}

      {showScrollShadow ? (
        <div
          className={styles["ids-modal-content-scroll-shadow"]}
          aria-hidden="true"
        />
      ) : null}

      <IdsModalFooter>
        {footerCheckbox ? (
          <div className={styles["ids-modal-footer-start"]}>
            <label className={styles["ids-modal-footer-checkbox"]}>
              <input
                type="checkbox"
                checked={footerChecked}
                onChange={(event) => setFooterChecked(event.target.checked)}
              />
              Don’t show again until the next update
            </label>
          </div>
        ) : null}
        <div className={styles["ids-modal-footer-actions"]}>
          {showTertiary ? (
            <IdsButton
              variant="tertiary"
              size="large"
              disabled={!enableTertiaryAction}
              onClick={() => onTertiaryAction?.()}
            >
              <IdsButtonLabel>{tertiaryActionLabel}</IdsButtonLabel>
            </IdsButton>
          ) : null}
          <IdsButton
            variant={primaryVariant}
            size="large"
            disabled={!enablePrimaryAction}
            onClick={() => onPrimaryAction?.()}
          >
            <IdsButtonLabel>{primaryActionLabel}</IdsButtonLabel>
          </IdsButton>
        </div>
      </IdsModalFooter>
    </>
  );

  return createPortal(
    <IdsModalContext.Provider value={ctx}>
      <div
        className={cx(styles["ids-modal-overlay"], overlayLayerClass)}
        data-ids="ids-modal-overlay"
        onClick={() => {
          if (closable) close();
        }}
      />
      <div
        ref={surfaceRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? titleId}
        aria-describedby={
          describedBy ?? (description ? descriptionId : undefined)
        }
        className={cx(
          styles["ids-modal-surface"],
          sizeClass,
          surfaceLayerClass,
          className,
        )}
        data-ids="ids-modal-surface"
        data-scenario={scenario}
        data-type={type}
        data-size={size}
        data-layer={layer}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        {compound ? children : propDrivenInterior}
        {compound && showScrollShadow ? (
          <div
            className={styles["ids-modal-content-scroll-shadow"]}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </IdsModalContext.Provider>,
    document.body,
  );
}

IdsModal.displayName = "IdsModal";
(IdsModal as typeof IdsModal & { Close: typeof IdsModalClose }).Close =
  IdsModalClose;

export default IdsModal;
