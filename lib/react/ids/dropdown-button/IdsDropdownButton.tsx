/**
 * IDS Dropdown Button — React implementation from design-spec.
 *
 * Path: `lib/react/ids/dropdown-button`
 * Source: `components/ids/dropdown-button/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Deterministic anatomy (children composition):
 *   IdsDropdownButton              (`dropdown`)
 *     IdsDropdownTrigger           (`trigger-slot`) — button | div | icon | any node
 *     IdsDropdownMenu              (`dropdown-menu`)
 *       IdsDropdownMenuItem*       (`dropdown-menu-item`)
 *         IdsDropdownMenu?         — nested submenu (same popup styling)
 *
 * Popup styling: shared `dropdown-shared/DropdownMenu.module.css`
 * (`.popup` + `.popupStandalone` + `.item`) — same as Dropdown Combo Box detached menu.
 */

import { Menu } from "../../shared/menu";
import React, {
  Children,
  isValidElement,
  useId,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  IdsButton,
  IdsButtonLabel,
  IdsButtonLeadingIcon,
  type IdsButtonSize,
  type IdsButtonVariant,
} from "../button";
import { IdsIcon } from "../icon";
import menuStyles from "../dropdown-shared/DropdownMenu.module.css";
import styles from "./IdsDropdownButton.module.css";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type IdsDropdownButtonStyle = "primary" | "secondary" | "tertiary";
export type IdsDropdownButtonSize = "small" | "medium" | "large";

export interface IdsDropdownButtonItem {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  /** Nested items → submenu under this row. */
  children?: IdsDropdownButtonItem[];
}

export interface IdsDropdownButtonProps {
  children?: ReactNode;
  /** Controlled open. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /**
   * Mode A convenience — when no `IdsDropdownMenu` child is projected,
   * builds menu rows from this list (supports nested `children` → submenu).
   */
  items?: IdsDropdownButtonItem[];
  onSelect?: (item: IdsDropdownButtonItem) => void;
  /**
   * Mode A convenience — when no `IdsDropdownTrigger` is projected,
   * renders a default IDS button trigger.
   */
  label?: string;
  buttonStyle?: IdsDropdownButtonStyle | string;
  size?: IdsDropdownButtonSize | string;
  icon?: ReactNode;
  iconOnly?: boolean;
  /** Accessible name when trigger content is non-textual. */
  ariaLabel?: string;
}

export interface IdsDropdownTriggerProps {
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  /** Accessible name when the projected trigger is not a labelled control. */
  ariaLabel?: string;
}

export interface IdsDropdownMenuProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /**
   * Internal: root menu vs nested submenu positioning.
   * Set automatically when nesting `IdsDropdownMenu` under a menu item.
   */
  placement?: "menu" | "submenu";
}

export interface IdsDropdownMenuItemProps {
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** Keyboard typeahead label override. */
  label?: string;
  /** Fired when a leaf item is activated (not submenu parents). */
  onSelect?: () => void;
  /** Keep menu open after click. Default false (closes). */
  closeOnClick?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveButtonStyle(value: unknown): IdsButtonVariant {
  if (value === "secondary" || value === "tertiary") return value;
  return "primary";
}

function resolveSize(value: unknown): IdsButtonSize {
  if (value === "small" || value === "large") return value;
  return "medium";
}

function displayNameOf(type: unknown): string | undefined {
  if (typeof type === "function" || (typeof type === "object" && type != null)) {
    return (type as { displayName?: string }).displayName;
  }
  return undefined;
}

function isTriggerElement(child: ReactElement): boolean {
  return (
    child.type === IdsDropdownTrigger ||
    displayNameOf(child.type) === "IdsDropdownTrigger"
  );
}

function isMenuElement(child: ReactElement): boolean {
  return (
    child.type === IdsDropdownMenu ||
    displayNameOf(child.type) === "IdsDropdownMenu"
  );
}

function isMenuItemElement(child: ReactElement): boolean {
  return (
    child.type === IdsDropdownMenuItem ||
    displayNameOf(child.type) === "IdsDropdownMenuItem"
  );
}

function partitionRootChildren(children: ReactNode): {
  trigger: ReactElement<IdsDropdownTriggerProps> | null;
  menu: ReactElement<IdsDropdownMenuProps> | null;
} {
  let trigger: ReactElement<IdsDropdownTriggerProps> | null = null;
  let menu: ReactElement<IdsDropdownMenuProps> | null = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isTriggerElement(child) && !trigger) {
      trigger = child as ReactElement<IdsDropdownTriggerProps>;
      return;
    }
    if (isMenuElement(child) && !menu) {
      menu = child as ReactElement<IdsDropdownMenuProps>;
    }
  });

  return { trigger, menu };
}

function partitionMenuItemChildren(children: ReactNode): {
  nestedMenu: ReactElement<IdsDropdownMenuProps> | null;
  content: ReactNode[];
} {
  let nestedMenu: ReactElement<IdsDropdownMenuProps> | null = null;
  const content: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && isMenuElement(child) && !nestedMenu) {
      nestedMenu = child as ReactElement<IdsDropdownMenuProps>;
      return;
    }
    if (child != null && child !== false) content.push(child);
  });

  return { nestedMenu, content };
}

function itemsToMenu(
  items: IdsDropdownButtonItem[],
  onSelect?: (item: IdsDropdownButtonItem) => void,
): ReactNode {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return (
        <IdsDropdownMenuItem key={item.id} id={item.id} disabled={item.disabled} label={item.label}>
          {item.icon}
          {item.label}
          <IdsDropdownMenu>{itemsToMenu(item.children, onSelect)}</IdsDropdownMenu>
        </IdsDropdownMenuItem>
      );
    }
    return (
      <IdsDropdownMenuItem
        key={item.id}
        id={item.id}
        disabled={item.disabled}
        label={item.label}
        onSelect={() => onSelect?.(item)}
      >
        {item.icon}
        {item.label}
      </IdsDropdownMenuItem>
    );
  });
}

/* -------------------------------------------------------------------------- */
/* IdsDropdownTrigger — trigger-slot                                          */
/* -------------------------------------------------------------------------- */

/**
 * Flexible trigger slot. Projects any child (button, div, icon, …).
 * When a single React element is projected, Base UI merges trigger props onto it
 * via `render` (preserves IdsButton / custom markup).
 */
export function IdsDropdownTrigger({
  children,
  disabled = false,
  className,
  ariaLabel,
}: IdsDropdownTriggerProps) {
  const childArray = Children.toArray(children);
  const single =
    childArray.length === 1 && isValidElement(childArray[0]) ? childArray[0] : null;

  if (single) {
    return (
      <Menu.Trigger
        disabled={disabled}
        className={className}
        aria-label={ariaLabel}
        render={single as ReactElement<Record<string, unknown>>}
      />
    );
  }

  return (
    <Menu.Trigger
      disabled={disabled}
      className={cx(styles.triggerReset, className)}
      aria-label={ariaLabel}
      aria-haspopup="menu"
    >
      {children}
    </Menu.Trigger>
  );
}
IdsDropdownTrigger.displayName = "IdsDropdownTrigger";

/* -------------------------------------------------------------------------- */
/* IdsDropdownMenu — dropdown-menu                                            */
/* -------------------------------------------------------------------------- */

/**
 * Popup surface. Reuses combo-box shared popup tokens
 * (`.popup` + `.popupStandalone` for detached / full 4-sided border).
 */
export function IdsDropdownMenu({
  children,
  className,
  style,
  id,
  placement = "menu",
}: IdsDropdownMenuProps) {
  const isSubmenu = placement === "submenu";

  return (
    <Menu.Portal>
      <Menu.Positioner
        side={isSubmenu ? "right" : "bottom"}
        align="start"
        sideOffset={isSubmenu ? 0 : 0}
        collisionPadding={8}
        collisionAvoidance={
          isSubmenu
            ? { side: "flip", align: "shift" }
            : { side: "none", align: "none", fallbackAxisSide: "none" }
        }
      >
        <Menu.Popup
          id={id}
          role="menu"
          className={cx(menuStyles.popup, menuStyles.popupStandalone, className)}
          style={style}
          data-ids="ids-dropdown-menu"
          data-placement={placement}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}
IdsDropdownMenu.displayName = "IdsDropdownMenu";

/* -------------------------------------------------------------------------- */
/* IdsDropdownMenuItem — dropdown-menu-item                                   */
/* -------------------------------------------------------------------------- */

/**
 * Leaf item, or submenu parent when it contains a nested `IdsDropdownMenu`.
 */
export function IdsDropdownMenuItem({
  children,
  disabled = false,
  className,
  id,
  label,
  onSelect,
  closeOnClick = true,
}: IdsDropdownMenuItemProps) {
  const { nestedMenu, content } = partitionMenuItemChildren(children);

  if (nestedMenu) {
    const submenu = React.cloneElement(nestedMenu, {
      placement: "submenu" as const,
    });

    return (
      <Menu.SubmenuRoot>
        <Menu.SubmenuTrigger
          id={id}
          label={label}
          disabled={disabled}
          openOnHover
          delay={80}
          closeDelay={200}
          className={cx(
            menuStyles.item,
            styles.itemWithSubmenu,
            className,
          )}
          data-ids="ids-dropdown-menu-item"
          data-has-submenu="true"
        >
          <span className={menuStyles.itemLabel}>{content}</span>
          <span className={styles.submenuChevron} aria-hidden="true">
            <IdsIcon
              shape="chev-right-thick"
              size={16}
              color="var(--color-icon-gray-neutral-accessible)"
            />
          </span>
        </Menu.SubmenuTrigger>
        {submenu}
      </Menu.SubmenuRoot>
    );
  }

  return (
    <Menu.Item
      id={id}
      label={label}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cx(menuStyles.item, className)}
      data-ids="ids-dropdown-menu-item"
      data-selectable="false"
      onClick={() => onSelect?.()}
    >
      <span className={menuStyles.itemLabel}>{content}</span>
    </Menu.Item>
  );
}
IdsDropdownMenuItem.displayName = "IdsDropdownMenuItem";

/* -------------------------------------------------------------------------- */
/* Default Mode A trigger                                                     */
/* -------------------------------------------------------------------------- */

function DefaultButtonTrigger({
  label,
  buttonStyle,
  size,
  icon,
  iconOnly,
  disabled,
  ariaLabel,
}: {
  label?: string;
  buttonStyle: IdsButtonVariant;
  size: IdsButtonSize;
  icon?: ReactNode;
  iconOnly: boolean;
  disabled: boolean;
  ariaLabel?: string;
}) {
  const caret = (
    <span className={styles.caret} aria-hidden="true">
      <IdsIcon
        shape="arrow-drop-tri-caret"
        size={10}
        color="currentColor"
      />
    </span>
  );

  // Do not set IdsButton `iconOnly` — icon-only dropdown still shows leading icon + caret
  // (design-spec). Label slot always carries the caret; text label is omitted when iconOnly.
  return (
    <IdsDropdownTrigger disabled={disabled} ariaLabel={ariaLabel ?? (iconOnly ? label : undefined)}>
      <IdsButton
        variant={buttonStyle}
        size={size}
        disabled={disabled}
        ariaLabel={ariaLabel ?? (iconOnly ? label || "Open menu" : undefined)}
      >
        {icon ? <IdsButtonLeadingIcon>{icon}</IdsButtonLeadingIcon> : null}
        <IdsButtonLabel>
          <span className={styles.defaultTriggerContent} data-ids="ids-dropdown-trigger-content">
            {!iconOnly && label ? <span data-ids="ids-dropdown-trigger-label">{label}</span> : null}
            {caret}
          </span>
        </IdsButtonLabel>
      </IdsButton>
    </IdsDropdownTrigger>
  );
}

/* -------------------------------------------------------------------------- */
/* IdsDropdownButton — dropdown root                                          */
/* -------------------------------------------------------------------------- */

export function IdsDropdownButton({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  style,
  id,
  items,
  onSelect,
  label,
  buttonStyle: buttonStyleProp,
  size: sizeProp,
  icon,
  iconOnly = false,
  ariaLabel,
}: IdsDropdownButtonProps) {
  const autoId = useId();
  const menuId = id ? `${id}-menu` : `${autoId}-menu`;
  const buttonStyle = resolveButtonStyle(buttonStyleProp);
  const size = resolveSize(sizeProp);

  const { trigger, menu } = partitionRootChildren(children);

  const resolvedTrigger =
    trigger ??
    (label != null || icon != null || iconOnly ? (
      <DefaultButtonTrigger
        label={label}
        buttonStyle={buttonStyle}
        size={size}
        icon={icon}
        iconOnly={iconOnly}
        disabled={disabled}
        ariaLabel={ariaLabel}
      />
    ) : null);

  const resolvedMenu =
    menu ??
    (items && items.length > 0 ? (
      <IdsDropdownMenu id={menuId}>{itemsToMenu(items, onSelect)}</IdsDropdownMenu>
    ) : null);

  return (
    <div
      className={cx(styles.root, className)}
      style={style}
      id={id}
      data-ids="ids-dropdown-button"
    >
      <Menu.Root
        open={open}
        defaultOpen={defaultOpen && !disabled}
        disabled={disabled}
        onOpenChange={(next) => {
          if (disabled) {
            onOpenChange?.(false);
            return;
          }
          onOpenChange?.(next);
        }}
      >
        {resolvedTrigger}
        {resolvedMenu}
      </Menu.Root>
    </div>
  );
}

IdsDropdownButton.displayName = "IdsDropdownButton";

export const IdsDropdownButtonCompound = Object.assign(IdsDropdownButton, {
  Trigger: IdsDropdownTrigger,
  Menu: IdsDropdownMenu,
  MenuItem: IdsDropdownMenuItem,
});

export default IdsDropdownButtonCompound;
