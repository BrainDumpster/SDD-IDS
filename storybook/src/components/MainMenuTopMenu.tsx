import { Menu } from "@base-ui-components/react/menu";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Icon } from "./Icon";
import menuStyles from "./MainMenuTopMenu.module.css";
import type { MainMenuTopMenuNode } from "./MainMenuTop.types";
import {
  MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH,
  MAIN_MENU_TOP_SUBMENU_SIDE_OFFSET,
  resolveSubmenuSide,
  resolveSubmenuSideFromRects,
  submenuSideFromDataAttribute,
  type SubmenuSide,
} from "./mainMenuTopSubmenuPlacement";

interface MainMenuTopMenuProps {
  nodes: MainMenuTopMenuNode[];
  trigger: ReactNode;
  triggerId?: string;
  triggerClassName?: string;
  triggerTitle?: string;
  triggerAriaExpanded?: boolean;
  triggerAriaCurrent?: "page" | undefined;
  onTriggerFocus?: () => void;
  onTriggerKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOptionSelect?: (optionId: string) => void;
  selectedOptionId?: string;
  menuMinWidth?: number;
}

function SubmenuFlyout({
  node,
  menuMinWidth,
  onOptionSelect,
  selectedOptionId,
}: {
  node: Extract<MainMenuTopMenuNode, { kind: "submenu" }>;
  menuMinWidth: number;
  onOptionSelect?: (optionId: string) => void;
  selectedOptionId?: string;
}) {
  const positionerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [chevronSide, setChevronSide] = useState<SubmenuSide>("right");
  const triggerRef = useRef<HTMLDivElement>(null);

  const syncChevronSide = useCallback(() => {
    const positioner = positionerRef.current;
    const fromAttr = submenuSideFromDataAttribute(positioner?.getAttribute("data-side") ?? null);
    if (fromAttr) {
      setChevronSide(fromAttr);
      return;
    }
    const popup = popupRef.current ?? positioner?.querySelector<HTMLElement>('[role="menu"]');
    setChevronSide(
      resolveSubmenuSideFromRects(triggerRef.current, popup ?? null, menuMinWidth),
    );
  }, [menuMinWidth]);

  useLayoutEffect(() => {
    syncChevronSide();
    if (!submenuOpen) return;

    const positioner = positionerRef.current;
    if (!positioner) return;

    const observer = new MutationObserver(syncChevronSide);
    observer.observe(positioner, { attributes: true, attributeFilter: ["data-side"] });

    const onLayoutChange = () => syncChevronSide();
    window.addEventListener("resize", onLayoutChange);
    window.addEventListener("scroll", onLayoutChange, true);
    requestAnimationFrame(syncChevronSide);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("scroll", onLayoutChange, true);
    };
  }, [submenuOpen, syncChevronSide]);

  const chevronSlug = chevronSide === "left" ? "chev-left-thick" : "chev-right-thick";
  const childSelected = node.children.some(
    (child) => "id" in child && child.id === selectedOptionId,
  );

  return (
    <Menu.SubmenuRoot
      onOpenChange={(nextOpen) => {
        setSubmenuOpen(nextOpen);
        if (nextOpen) {
          requestAnimationFrame(syncChevronSide);
        }
      }}
    >
      <Menu.SubmenuTrigger
        ref={triggerRef}
        className={[menuStyles.optionItem, menuStyles.submenuParent].join(" ")}
        disabled={node.disabled}
        data-selected={childSelected ? "true" : undefined}
        data-submenu-side={chevronSide}
        openOnHover
        delay={80}
        closeDelay={200}
        onMouseEnter={syncChevronSide}
        onFocus={syncChevronSide}
      >
        <span>{node.label}</span>
        <span className={menuStyles.submenuChevron} aria-hidden>
          <Icon shapeName={chevronSlug} style={{ width: 16, height: 16 }} />
        </span>
      </Menu.SubmenuTrigger>
      <Menu.Portal>
        <Menu.Positioner
          ref={positionerRef}
          className={menuStyles.positioner}
          side={chevronSide}
          align="start"
          sideOffset={MAIN_MENU_TOP_SUBMENU_SIDE_OFFSET}
          collisionAvoidance={{ side: "flip", align: "shift" }}
          collisionPadding={8}
        >
          <Menu.Popup
            ref={popupRef}
            className={[menuStyles.popup, menuStyles.submenuFlyoutPopup].join(" ")}
            style={{ minWidth: menuMinWidth }}
          >
            <ul className={menuStyles.optionsList} role="presentation">
              {node.children.map((child) => (
                <MenuNodeRow
                  key={child.kind === "group" ? child.label : child.id}
                  node={child}
                  onOptionSelect={onOptionSelect}
                  selectedOptionId={selectedOptionId}
                  menuMinWidth={menuMinWidth}
                />
              ))}
            </ul>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.SubmenuRoot>
  );
}

function MenuNodeRow({
  node,
  onOptionSelect,
  selectedOptionId,
  menuMinWidth,
}: {
  node: MainMenuTopMenuNode;
  onOptionSelect?: (optionId: string) => void;
  selectedOptionId?: string;
  menuMinWidth: number;
}) {
  if (node.kind === "group") {
    return (
      <li role="presentation">
        <div className={menuStyles.groupLabel}>{node.label}</div>
        <ul className={menuStyles.optionsList} role="presentation">
          {node.children.map((child) => (
            <MenuNodeRow
              key={child.kind === "group" ? child.label : child.id}
              node={child}
              onOptionSelect={onOptionSelect}
              selectedOptionId={selectedOptionId}
              menuMinWidth={menuMinWidth}
            />
          ))}
        </ul>
      </li>
    );
  }

  if (node.kind === "submenu") {
    return (
      <li role="presentation">
        <SubmenuFlyout
          node={node}
          menuMinWidth={menuMinWidth}
          onOptionSelect={onOptionSelect}
          selectedOptionId={selectedOptionId}
        />
      </li>
    );
  }

  return (
    <li role="presentation">
      <Menu.Item
        className={[menuStyles.optionItem, menuStyles.submenuFlyoutItem].join(" ")}
        disabled={node.disabled}
        data-selected={selectedOptionId === node.id ? "true" : undefined}
        onClick={() => onOptionSelect?.(node.id)}
      >
        {node.label}
      </Menu.Item>
    </li>
  );
}

export function MainMenuTopMenuPanel({
  nodes,
  trigger,
  triggerId,
  triggerClassName,
  triggerTitle,
  triggerAriaExpanded,
  triggerAriaCurrent,
  onTriggerFocus,
  onTriggerKeyDown,
  open,
  onOpenChange,
  onOptionSelect,
  selectedOptionId,
  menuMinWidth = MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH,
}: MainMenuTopMenuProps) {
  return (
    <Menu.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Menu.Trigger
        id={triggerId}
        type="button"
        className={triggerClassName}
        title={triggerTitle}
        aria-haspopup="menu"
        aria-expanded={triggerAriaExpanded}
        aria-current={triggerAriaCurrent}
        onFocus={onTriggerFocus}
        onKeyDown={onTriggerKeyDown}
      >
        {trigger}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          className={menuStyles.positioner}
          side="bottom"
          align="center"
          sideOffset={10}
          collisionAvoidance={{ side: "flip", align: "shift" }}
          collisionPadding={8}
        >
          <Menu.Popup
            className={menuStyles.popup}
            style={{ minWidth: menuMinWidth, width: "max-content" }}
          >
            <ul className={menuStyles.optionsList} role="menu">
              {nodes.map((node) => (
                <MenuNodeRow
                  key={node.kind === "group" ? node.label : node.id}
                  node={node}
                  onOptionSelect={onOptionSelect}
                  selectedOptionId={selectedOptionId}
                  menuMinWidth={menuMinWidth}
                />
              ))}
            </ul>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
