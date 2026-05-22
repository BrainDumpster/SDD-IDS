import {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { extractMenuNodesFromItemChildren } from "./MainMenuTop.compose";
import { MainMenuTopProvider, useMainMenuTopContext } from "./MainMenuTopContext";
import { MainMenuTopMenuPanel } from "./MainMenuTopMenu";
import styles from "./MainMenuTop.module.css";
import { Icon } from "./Icon";
import type {
  MainMenuTopItem,
  MainMenuTopMenuNode,
  MainMenuTopMenuOption,
  MainMenuTopProps,
} from "./MainMenuTop.types";
import { normalizeMenuNodes } from "./MainMenuTop.types";

export type {
  MainMenuTopItem,
  MainMenuTopLink,
  MainMenuTopMenuNode,
  MainMenuTopMenuOption,
  MainMenuTopProps,
  MainMenuTopSelectDetail,
} from "./MainMenuTop.types";

function itemFocusId(id: string): string {
  return `main-menu-top-item-${id}`;
}

function itemButtonClass(
  size: "Large" | "Small",
  showUnderline: boolean,
  showMenuOpenFill: boolean,
): string {
  return [
    styles.item,
    size === "Small" ? styles.itemSmall : "",
    showUnderline ? styles.itemSelected : "",
    showMenuOpenFill ? styles.itemMenuOpen : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function NavItemLabel({
  item,
  size,
  isSelected,
  showDropdown,
}: {
  item: { name: string; iconName?: string; showIcon?: boolean };
  size: "Large" | "Small";
  isSelected: boolean;
  showDropdown: boolean;
}) {
  const showIcon = item.showIcon !== false && Boolean(item.iconName);

  const isSmall = size === "Small";

  return (
    <>
      <span
        className={[styles.itemCluster, isSmall ? styles.itemClusterSmall : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {showIcon ? (
          <span className={styles.iconSlot} aria-hidden>
            <Icon
              className={styles.iconGlyph}
              shapeName={item.iconName ?? "home"}
              style={{ width: 18, height: 18, display: "block" }}
              color={
                isSelected
                  ? "var(--color-icon-brand-strong)"
                  : "var(--color-icon-neutral-strong)"
              }
            />
          </span>
        ) : null}
        <span
          className={[styles.label, isSmall ? styles.labelSmall : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {item.name}
        </span>
      </span>
      {showDropdown ? (
        <span
          className={[styles.chevronSlot, isSmall ? styles.chevronSlotSmall : ""]
            .filter(Boolean)
            .join(" ")}
          aria-hidden
        >
          <Icon
            className={styles.chevronGlyph}
            shapeName="chev-down-thick"
            style={{ width: 12, height: 12, display: "block" }}
            color={
              isSelected
                ? "var(--color-icon-brand-strong)"
                : "var(--color-icon-neutral-strong)"
            }
          />
        </span>
      ) : null}
    </>
  );
}

interface NavItemConfig {
  id: string;
  name: string;
  iconName?: string;
  showIcon?: boolean;
  tooltip?: string;
  dropdown?: boolean;
  link?: MainMenuTopItem["link"];
  menuNodes?: MainMenuTopMenuNode[];
}

function MainMenuTopNavItem({
  config,
  itemIds,
  itemIndex,
}: {
  config: NavItemConfig;
  itemIds: string[];
  itemIndex: number;
}) {
  const ctx = useMainMenuTopContext();
  const menuOpen = ctx.openMenuId === config.id;
  const hasMenu = Boolean(config.menuNodes?.length);
  const showDropdown = config.dropdown !== false || hasMenu;
  /** Menu items: underline only while dropdown is open. Plain items: underline when selected. */
  const showUnderline = hasMenu ? menuOpen : ctx.selectedId === config.id;
  const showActiveChrome = showUnderline;
  const buttonClass = itemButtonClass(
    ctx.size,
    showUnderline,
    menuOpen && !showUnderline,
  );

  const openMenu = useCallback(() => {
    ctx.openTopMenu(config.id);
  }, [ctx, config.id]);

  const handleMenuOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        ctx.openTopMenu(config.id);
      } else {
        ctx.closeTopMenu(config.id);
      }
    },
    [ctx, config.id],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case "Enter":
        case " ": {
          event.preventDefault();
          if (hasMenu) {
            openMenu();
          } else {
            ctx.selectNavItem(config.id, config.name, config.link);
          }
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          const next = itemIds[Math.min(itemIndex + 1, itemIds.length - 1)];
          ctx.setFocusedId(next);
          document.getElementById(itemFocusId(next))?.focus();
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          const prev = itemIds[Math.max(itemIndex - 1, 0)];
          ctx.setFocusedId(prev);
          document.getElementById(itemFocusId(prev))?.focus();
          break;
        }
        case "Home": {
          event.preventDefault();
          ctx.setFocusedId(itemIds[0]);
          document.getElementById(itemFocusId(itemIds[0]))?.focus();
          break;
        }
        case "End": {
          event.preventDefault();
          const last = itemIds[itemIds.length - 1];
          ctx.setFocusedId(last);
          document.getElementById(itemFocusId(last))?.focus();
          break;
        }
        case "Escape": {
          if (menuOpen) ctx.closeTopMenu(config.id);
          break;
        }
        default:
          break;
      }
    },
    [config, ctx, hasMenu, itemIds, itemIndex, menuOpen, openMenu],
  );

  const label = (
    <NavItemLabel
      item={config}
      size={ctx.size}
      isSelected={showActiveChrome}
      showDropdown={showDropdown}
    />
  );

  if (hasMenu && config.menuNodes) {
    return (
      <li className={styles.barItem} role="none">
        <MainMenuTopMenuPanel
          nodes={config.menuNodes}
          open={menuOpen}
          onOpenChange={handleMenuOpenChange}
          selectedOptionId={ctx.selectedOptionByItemId[config.id]}
          onOptionSelect={(optionId) => {
            ctx.selectNavItem(config.id, config.name, config.link, optionId);
          }}
          triggerId={itemFocusId(config.id)}
          triggerClassName={buttonClass}
          triggerTitle={config.tooltip}
          triggerAriaExpanded={menuOpen}
          triggerAriaCurrent={showUnderline ? "page" : undefined}
          onTriggerFocus={() => ctx.setFocusedId(config.id)}
          onTriggerKeyDown={handleKeyDown}
          trigger={label}
        />
      </li>
    );
  }

  return (
    <li className={styles.barItem} role="none">
      <button
        id={itemFocusId(config.id)}
        type="button"
        className={buttonClass}
        title={config.tooltip}
        aria-current={showUnderline ? "page" : undefined}
        onClick={() => ctx.selectNavItem(config.id, config.name, config.link)}
        onFocus={() => ctx.setFocusedId(config.id)}
        onKeyDown={handleKeyDown}
      >
        {label}
      </button>
    </li>
  );
}

function MainMenuTopBar({ navItems }: { navItems: NavItemConfig[] }) {
  const ctx = useMainMenuTopContext();
  const itemIds = useMemo(() => navItems.map((item) => item.id), [navItems]);

  return (
    <ul className={styles.bar} role="list">
      {navItems.map((config, index) => (
        <MainMenuTopNavItem
          key={config.id}
          config={config}
          itemIds={itemIds}
          itemIndex={index}
        />
      ))}
    </ul>
  );
}

function MainMenuTopData({
  items,
  ariaLabel = "Main menu top",
  className,
  ...providerProps
}: MainMenuTopProps) {
  const navItems = useMemo<NavItemConfig[]>(
    () =>
      (items ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        iconName: item.iconName,
        showIcon: item.showIcon,
        tooltip: item.tooltip,
        dropdown: item.dropdown,
        link: item.link,
        menuNodes: normalizeMenuNodes(item.menuOptions),
      })),
    [items],
  );

  return (
    <MainMenuTopProvider {...providerProps}>
      <nav className={[styles.root, className].filter(Boolean).join(" ")} aria-label={ariaLabel}>
        <div className={styles.container}>
          <MainMenuTopBar navItems={navItems} />
        </div>
      </nav>
    </MainMenuTopProvider>
  );
}

function MainMenuTopComposable({
  children,
  ariaLabel = "Main menu top",
  className,
  ...providerProps
}: MainMenuTopProps) {
  const navItems = useMemo(() => {
    const configs: NavItemConfig[] = [];
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      const el = child as { type?: { displayName?: string }; props: MainMenuTopItemProps };
      if (el.type?.displayName !== "MainMenuTop.Item") return;
      const { id, name, iconName, showIcon, tooltip, dropdown, link, children: itemChildren } =
        el.props;
      configs.push({
        id,
        name,
        iconName,
        showIcon,
        tooltip,
        dropdown,
        link,
        menuNodes: extractMenuNodesFromItemChildren(itemChildren),
      });
    });
    return configs;
  }, [children]);

  return (
    <MainMenuTopProvider {...providerProps}>
      <nav className={[styles.root, className].filter(Boolean).join(" ")} aria-label={ariaLabel}>
        <div className={styles.container}>
          <MainMenuTopBar navItems={navItems} />
        </div>
      </nav>
    </MainMenuTopProvider>
  );
}

export function MainMenuTop({ items, children, ...props }: MainMenuTopProps) {
  if (items?.length) return <MainMenuTopData items={items} {...props} />;
  return <MainMenuTopComposable {...props}>{children}</MainMenuTopComposable>;
}

export interface MainMenuTopItemProps {
  id: string;
  name: string;
  iconName?: string;
  showIcon?: boolean;
  tooltip?: string;
  dropdown?: boolean;
  link?: MainMenuTopItem["link"];
  children?: ReactNode;
}

export function MainMenuTopItem({ children }: MainMenuTopItemProps) {
  return <>{children}</>;
}
MainMenuTopItem.displayName = "MainMenuTop.Item";

export function MainMenuTopMenu({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
MainMenuTopMenu.displayName = "MainMenuTop.Menu";

export interface MainMenuTopMenuItemProps {
  id: string;
  label: string;
  disabled?: boolean;
}

export function MainMenuTopMenuItem(_props: MainMenuTopMenuItemProps) {
  return null;
}
MainMenuTopMenuItem.displayName = "MainMenuTop.MenuItem";

export interface MainMenuTopMenuGroupProps {
  id?: string;
  label: string;
  children?: ReactNode;
}

export function MainMenuTopMenuGroup(_props: MainMenuTopMenuGroupProps) {
  return null;
}
MainMenuTopMenuGroup.displayName = "MainMenuTop.MenuGroup";

export interface MainMenuTopSubmenuProps {
  id: string;
  label: string;
  disabled?: boolean;
  children?: ReactNode;
}

export function MainMenuTopSubmenu(_props: MainMenuTopSubmenuProps) {
  return null;
}
MainMenuTopSubmenu.displayName = "MainMenuTop.Submenu";

MainMenuTop.Item = MainMenuTopItem;
MainMenuTop.Menu = MainMenuTopMenu;
MainMenuTop.MenuItem = MainMenuTopMenuItem;
MainMenuTop.MenuGroup = MainMenuTopMenuGroup;
MainMenuTop.Submenu = MainMenuTopSubmenu;
