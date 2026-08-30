/**
 * Lib-local Menu primitives (Base UI–compatible surface used by IDS dropdowns).
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
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { mergeRefs } from "../utils/mergeRefs";
import { useControllableState } from "../utils/useControllableState";
import {
  useAnchorPosition,
  type AnchorAlign,
  type AnchorSide,
  type CollisionAvoidance,
} from "../utils/useAnchorPosition";

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface MenuRootContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  modal: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  menuId: string;
  nestingLevel: number;
  closeRoot: () => void;
}

const MenuRootContext = createContext<MenuRootContextValue | null>(null);

function useMenuRoot(optional = false): MenuRootContextValue | null {
  const ctx = useContext(MenuRootContext);
  if (!ctx && !optional) {
    throw new Error("Menu compound parts must be used within Menu.Root");
  }
  return ctx;
}

interface SubmenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
  openOnHover: boolean;
  delay: number;
  closeDelay: number;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  clearTimers: () => void;
  configureHover: (cfg: {
    openOnHover: boolean;
    delay: number;
    closeDelay: number;
  }) => void;
}

const SubmenuContext = createContext<SubmenuContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */

export interface MenuRootProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails?: { reason?: string }) => void;
  disabled?: boolean;
  modal?: boolean;
}

function MenuRoot({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  modal = true,
}: MenuRootProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuId = useId();
  const parent = useMenuRoot(true);

  const [open, setOpenRaw] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen && !disabled,
    onChange: (next) => onOpenChange?.(next),
  });

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled && next) return;
      setOpenRaw(next);
    },
    [disabled, setOpenRaw],
  );

  const closeRoot = useCallback(() => {
    setOpen(false);
    parent?.closeRoot();
  }, [parent, setOpen]);

  const value = useMemo<MenuRootContextValue>(
    () => ({
      open,
      setOpen,
      disabled,
      modal,
      triggerRef,
      menuId,
      nestingLevel: parent ? parent.nestingLevel + 1 : 0,
      closeRoot,
    }),
    [open, setOpen, disabled, modal, menuId, parent, closeRoot],
  );

  return (
    <MenuRootContext.Provider value={value}>{children}</MenuRootContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger                                                                    */
/* -------------------------------------------------------------------------- */

export interface MenuTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  /**
   * Replace the default `<button>` — React element (props merged) or render fn.
   */
  render?:
    | ReactElement<Record<string, unknown>>
    | ((
        props: Record<string, unknown>,
        state: { open: boolean },
      ) => ReactElement);
  openOnHover?: boolean;
  delay?: number;
  closeDelay?: number;
}

function MenuTrigger({
  children,
  disabled: disabledProp = false,
  className,
  style,
  render,
  onClick,
  onKeyDown,
  openOnHover,
  delay = 100,
  closeDelay = 0,
  ...rest
}: MenuTriggerProps) {
  const root = useMenuRoot()!;
  const disabled = root.disabled || disabledProp;
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHover = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  useEffect(() => () => clearHover(), []);

  const toggle = (event: React.SyntheticEvent) => {
    if (disabled) return;
    onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    root.setOpen(!root.open);
  };

  const sharedProps: Record<string, unknown> = {
    ...rest,
    className,
    style,
    disabled: disabled || undefined,
    "aria-expanded": root.open,
    "aria-haspopup": (rest as { "aria-haspopup"?: string })["aria-haspopup"] ?? "menu",
    "aria-controls": root.open ? root.menuId : undefined,
    "data-popup-open": root.open ? "" : undefined,
    ref: mergeRefs(root.triggerRef),
    onClick: toggle,
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
      if (disabled) return;
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        root.setOpen(true);
      }
    },
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      (rest as ButtonHTMLAttributes<HTMLButtonElement>).onMouseEnter?.(
        event as React.MouseEvent<HTMLButtonElement>,
      );
      if (!openOnHover || disabled) return;
      clearHover();
      hoverTimer.current = setTimeout(() => root.setOpen(true), delay);
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      (rest as ButtonHTMLAttributes<HTMLButtonElement>).onMouseLeave?.(
        event as React.MouseEvent<HTMLButtonElement>,
      );
      if (!openOnHover || disabled) return;
      clearHover();
      hoverTimer.current = setTimeout(() => root.setOpen(false), closeDelay);
    },
  };

  if (typeof render === "function") {
    return render(sharedProps, { open: root.open });
  }

  if (render && React.isValidElement(render)) {
    const el = render as ReactElement<Record<string, unknown>>;
    const prevRef = (el as ReactElement & { ref?: Ref<HTMLElement> }).ref;
    return React.cloneElement(el, {
      ...sharedProps,
      ...el.props,
      className: [sharedProps.className, el.props.className].filter(Boolean).join(" ") || undefined,
      style: { ...(sharedProps.style as CSSProperties), ...(el.props.style as CSSProperties) },
      ref: mergeRefs(root.triggerRef, prevRef),
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        (el.props.onClick as ((e: React.MouseEvent<HTMLElement>) => void) | undefined)?.(event);
        toggle(event);
      },
      "aria-expanded": root.open,
      "aria-haspopup":
        (el.props["aria-haspopup"] as string | undefined) ??
        (sharedProps["aria-haspopup"] as string),
      disabled: disabled || (el.props.disabled as boolean | undefined),
    });
  }

  return (
    <button type="button" {...(sharedProps as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Portal                                                                     */
/* -------------------------------------------------------------------------- */

export interface MenuPortalProps {
  children?: ReactNode;
  container?: HTMLElement | RefObject<HTMLElement | null> | null;
  keepMounted?: boolean;
}

function resolveContainer(
  container?: HTMLElement | RefObject<HTMLElement | null> | null,
): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (!container) return document.body;
  if (typeof HTMLElement !== "undefined" && container instanceof HTMLElement) {
    return container;
  }
  return (container as RefObject<HTMLElement | null>).current ?? document.body;
}

function MenuPortal({ children, container, keepMounted = false }: MenuPortalProps) {
  const root = useMenuRoot()!;
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMountNode(resolveContainer(container));
  }, [container]);

  if (!mountNode) return null;
  if (!root.open && !keepMounted) return null;

  return createPortal(
    <div data-ids-menu-portal="" hidden={!root.open ? true : undefined}>
      {children}
    </div>,
    mountNode,
  );
}

/* -------------------------------------------------------------------------- */
/* Positioner                                                                 */
/* -------------------------------------------------------------------------- */

export interface MenuPositionerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  side?: AnchorSide;
  align?: AnchorAlign;
  sideOffset?: number;
  collisionPadding?: number;
  collisionAvoidance?: CollisionAvoidance;
}

function MenuPositioner({
  children,
  side = "bottom",
  align = "start",
  sideOffset = 0,
  collisionPadding = 8,
  collisionAvoidance,
  className,
  style,
  ...rest
}: MenuPositionerProps) {
  const root = useMenuRoot()!;
  const submenu = useContext(SubmenuContext);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = submenu?.triggerRef ?? root.triggerRef;

  const positioned = useAnchorPosition({
    open: root.open,
    anchorRef,
    floatingRef,
    side,
    align,
    sideOffset,
    collisionPadding,
    collisionAvoidance,
  });

  if (!root.open) return null;

  return (
    <div
      {...rest}
      ref={floatingRef}
      className={className}
      data-side={positioned.side}
      data-align={positioned.align}
      style={{
        ...positioned.style,
        zIndex: 1060 + root.nestingLevel,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Popup                                                                      */
/* -------------------------------------------------------------------------- */

export interface MenuPopupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function MenuPopup({ children, className, style, id, onKeyDown, ...rest }: MenuPopupProps) {
  const root = useMenuRoot()!;
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!root.open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (popupRef.current?.contains(target)) return;
      if (root.triggerRef.current?.contains(target)) return;
      // Nested submenu portals
      const portals = document.querySelectorAll("[data-ids-menu-portal]");
      for (const portal of portals) {
        if (portal.contains(target)) return;
      }
      root.setOpen(false);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        root.setOpen(false);
        root.triggerRef.current?.focus?.();
      }
    };

    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("keydown", onKey, true);

    let prevOverflow = "";
    if (root.modal && root.nestingLevel === 0) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("keydown", onKey, true);
      if (root.modal && root.nestingLevel === 0) {
        document.body.style.overflow = prevOverflow;
      }
    };
  }, [root]);

  return (
    <div
      {...rest}
      ref={popupRef}
      id={id ?? root.menuId}
      tabIndex={-1}
      className={className}
      style={style}
      data-open={root.open ? "" : undefined}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "Escape") {
          root.setOpen(false);
        }
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Item                                                                       */
/* -------------------------------------------------------------------------- */

export interface MenuItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  children?: ReactNode;
  disabled?: boolean;
  label?: string;
  closeOnClick?: boolean;
  /** Fired on activate (Base UI consumers sometimes use this name). */
  onSelect?: (event?: Event) => void;
  nativeButton?: boolean;
}

function MenuItem({
  children,
  disabled = false,
  label,
  closeOnClick = true,
  onSelect,
  onClick,
  className,
  id,
  ...rest
}: MenuItemProps) {
  const root = useMenuRoot()!;

  const activate = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    onSelect?.(event.nativeEvent);
    if (closeOnClick) {
      root.closeRoot();
    }
  };

  return (
    <div
      {...rest}
      id={id}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "true" : undefined}
      data-label={label}
      className={className}
      onClick={activate}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate(event as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Submenu                                                                    */
/* -------------------------------------------------------------------------- */

export interface MenuSubmenuRootProps {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function MenuSubmenuRoot({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: MenuSubmenuRootProps) {
  const parent = useMenuRoot()!;
  const triggerRef = useRef<HTMLElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverConfigRef = useRef({ openOnHover: true, delay: 100, closeDelay: 0 });

  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (!parent.open) setOpen(false);
  }, [parent.open, setOpen]);

  const scheduleOpen = useCallback(() => {
    clearTimers();
    openTimer.current = setTimeout(
      () => setOpen(true),
      hoverConfigRef.current.delay,
    );
  }, [clearTimers, setOpen]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(
      () => setOpen(false),
      hoverConfigRef.current.closeDelay,
    );
  }, [clearTimers, setOpen]);

  const configureHover = useCallback(
    (cfg: { openOnHover: boolean; delay: number; closeDelay: number }) => {
      hoverConfigRef.current = cfg;
    },
    [],
  );

  const submenuCtx = useMemo<SubmenuContextValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      openOnHover: true,
      delay: 100,
      closeDelay: 0,
      scheduleOpen,
      scheduleClose,
      clearTimers,
      configureHover,
    }),
    [open, setOpen, scheduleOpen, scheduleClose, clearTimers, configureHover],
  );

  const nestedRoot = useMemo<MenuRootContextValue>(
    () => ({
      open,
      setOpen,
      disabled: parent.disabled,
      modal: false,
      triggerRef,
      menuId: `${parent.menuId}-sub`,
      nestingLevel: parent.nestingLevel + 1,
      closeRoot: parent.closeRoot,
    }),
    [open, setOpen, parent],
  );

  return (
    <SubmenuContext.Provider value={submenuCtx}>
      <MenuRootContext.Provider value={nestedRoot}>{children}</MenuRootContext.Provider>
    </SubmenuContext.Provider>
  );
}

export interface MenuSubmenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  disabled?: boolean;
  label?: string;
  openOnHover?: boolean;
  delay?: number;
  closeDelay?: number;
}

function MenuSubmenuTrigger({
  children,
  disabled = false,
  label,
  openOnHover = true,
  delay = 100,
  closeDelay = 0,
  className,
  id,
  onClick,
  ...rest
}: MenuSubmenuTriggerProps) {
  const submenu = useContext(SubmenuContext);
  const parent = useMenuRoot()!;

  useEffect(() => {
    submenu?.configureHover({ openOnHover, delay, closeDelay });
  }, [submenu, openOnHover, delay, closeDelay]);

  if (!submenu) {
    throw new Error("Menu.SubmenuTrigger must be used within Menu.SubmenuRoot");
  }

  return (
    <div
      {...rest}
      ref={mergeRefs(submenu.triggerRef) as Ref<HTMLDivElement>}
      id={id}
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={submenu.open}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "true" : undefined}
      data-label={label}
      data-popup-open={submenu.open ? "" : undefined}
      tabIndex={disabled ? -1 : 0}
      className={className}
      onClick={(event) => {
        if (disabled) return;
        onClick?.(event);
        submenu.setOpen(true);
      }}
      onMouseEnter={() => {
        if (disabled || !openOnHover) return;
        submenu.scheduleOpen();
      }}
      onMouseLeave={() => {
        if (disabled || !openOnHover) return;
        submenu.scheduleClose();
      }}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          submenu.setOpen(true);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          submenu.setOpen(false);
          parent.triggerRef.current?.focus?.();
        }
      }}
    >
      {children}
    </div>
  );
}

/* Keep submenu open while pointer is over the submenu popup */
function SubmenuPopupHoverBridge({ children }: { children?: ReactNode }) {
  const submenu = useContext(SubmenuContext);
  if (!submenu) return <>{children}</>;
  return (
    <div
      onMouseEnter={() => submenu.clearTimers()}
      onMouseLeave={() => {
        if (submenu.openOnHover) submenu.scheduleClose();
      }}
    >
      {children}
    </div>
  );
}

function MenuPopupWithSubmenuHover(props: MenuPopupProps) {
  const submenu = useContext(SubmenuContext);
  const popup = <MenuPopup {...props} />;
  if (!submenu) return popup;
  return <SubmenuPopupHoverBridge>{popup}</SubmenuPopupHoverBridge>;
}

/* -------------------------------------------------------------------------- */
/* Public compound                                                            */
/* -------------------------------------------------------------------------- */

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Positioner: MenuPositioner,
  Popup: MenuPopupWithSubmenuHover,
  Item: MenuItem,
  SubmenuRoot: MenuSubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
};

export default Menu;
