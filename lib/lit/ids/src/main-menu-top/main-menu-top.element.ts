/**
 * IdsMainMenuTop — Lit web component.
 *
 * Tag: `ids-main-menu-top`
 * Spec: `components/ids/main-menu-top/design-spec.md`
 * API parity: storybook/src/components/MainMenuTop*.tsx
 *   (`lib/react/ids/main-menu-top` is not present in this repo)
 *
 * Composition (preferred Mode B — Tree-style):
 *   <ids-main-menu-top>
 *     <ids-main-menu-top-item id="storage" name="Storage" icon-name="storage-volume" dropdown>
 *       <ids-main-menu-top-menu>
 *         <ids-main-menu-top-menu-item id="volumes" label="Volumes"></ids-main-menu-top-menu-item>
 *         <ids-main-menu-top-menu-group label="Management">…</ids-main-menu-top-menu-group>
 *         <ids-main-menu-top-submenu id="nested" label="Option">…</ids-main-menu-top-submenu>
 *       </ids-main-menu-top-menu>
 *     </ids-main-menu-top-item>
 *   </ids-main-menu-top>
 *
 * Mode A: `items: MainMenuTopItem[]` — when non-empty, slotted Mode B is ignored.
 *
 * Live Figma (0bHk3XhrjFhowgFkz9yLr4, MCP 2026-11-13):
 *   Main `10189:30280`, Element `11099:56576`, Selected `11099:56577`,
 *   Use cases `42136:57443`
 *
 * Events / React callback props:
 *   `ids-menu-item-select` / `onMenuItemSelect` — MainMenuTopSelectDetail
 */
import { LitElement, html, nothing, render, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import "../icon/register.js";
import { collectSlottedMainMenuTopItems } from "./main-menu-top-parts.element.js";
import {
  MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH,
  MAIN_MENU_TOP_DROPDOWN_SIDE_OFFSET,
  MAIN_MENU_TOP_RUNTIME_DEFAULTS,
  MAIN_MENU_TOP_SUBMENU_SIDE_OFFSET,
  itemFocusId,
  normalizeMenuNodes,
  resolveMainMenuTopSize,
  resolveSubmenuSide,
  resolveSubmenuSideFromRects,
  type MainMenuTopItem,
  type MainMenuTopLink,
  type MainMenuTopMenuNode,
  type MainMenuTopSelectDetail,
  type MainMenuTopSize,
  type SubmenuSide,
} from "./main-menu-top.constants.js";
import {
  mainMenuTopPortalStyles,
  mainMenuTopStyles,
} from "./main-menu-top.styles.js";

interface NavItemConfig {
  id: string;
  name: string;
  iconName?: string;
  showIcon?: boolean;
  tooltip?: string;
  dropdown?: boolean;
  link?: MainMenuTopLink;
  menuNodes?: MainMenuTopMenuNode[];
}

export class IdsMainMenuTop extends LitElement {
  static override styles = [mainMenuTopStyles];

  /**
   * Mode A: data-driven nav items (React `items` parity).
   * When non-empty, slotted Mode B children are ignored.
   */
  @property({ attribute: false })
  items: MainMenuTopItem[] = [];

  /** Controlled selection id. */
  @property({
    type: String,
    attribute: "selectedid",
    converter: {
      fromAttribute: (value: string | null) => value || undefined,
      toAttribute: (value: string | undefined) => value ?? null,
    },
  })
  selectedId?: string;

  /** Uncontrolled initial selection (Spec Accurate: `"top-2"`). */
  @property({
    type: String,
    attribute: "defaultselectedid",
    converter: {
      fromAttribute: (value: string | null) => value || undefined,
      toAttribute: (value: string | undefined) => value ?? null,
    },
  })
  defaultSelectedId?: string;

  /** Large (default) or Small item geometry. */
  @property({ type: String })
  size: MainMenuTopSize = MAIN_MENU_TOP_RUNTIME_DEFAULTS.size;

  /** Overrides default `aria-label` on root `nav`. */
  @property({ type: String, attribute: "arialabel" })
  ariaLabel = MAIN_MENU_TOP_RUNTIME_DEFAULTS.ariaLabel;

  /** React API parity — selection / menu option activate. */
  @property({ attribute: false })
  onMenuItemSelect?: (detail: MainMenuTopSelectDetail) => void;

  @state() private selectedIdInternal?: string;
  @state() private openMenuId: string | null = null;
  @state() private selectedOptionByItemId: Record<string, string> = {};
  @state() private focusedId: string | null = null;
  @state() private openSubmenuId: string | null = null;
  @state() private submenuSides: Record<string, SubmenuSide> = {};
  /** Snapshot of Mode B slotted children (refreshed on slotchange). */
  @state() private slottedItems: MainMenuTopItem[] = [];

  private portalEl: HTMLDivElement | null = null;
  private selectionInitialized = false;
  private submenuCloseTimer: number | null = null;

  get useItemsMode(): boolean {
    return this.items != null && this.items.length > 0;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-main-menu-top-host");
    window.addEventListener("resize", this.onWindowReposition);
    window.addEventListener("scroll", this.onWindowReposition, true);
    document.addEventListener("pointerdown", this.onDocumentPointerDown, true);
    document.addEventListener("keydown", this.onDocumentKeyDown, true);
  }

  override disconnectedCallback(): void {
    window.removeEventListener("resize", this.onWindowReposition);
    window.removeEventListener("scroll", this.onWindowReposition, true);
    document.removeEventListener("pointerdown", this.onDocumentPointerDown, true);
    document.removeEventListener("keydown", this.onDocumentKeyDown, true);
    this.clearSubmenuCloseTimer();
    this.destroyPortal();
    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.refreshSlottedItems();
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (
      !this.selectionInitialized &&
      (changed.has("defaultSelectedId") ||
        changed.has("items") ||
        changed.has("slottedItems"))
    ) {
      // Wait for Mode B slot scrape (or Mode A items) before locking defaults.
      if (this.useItemsMode || this.slottedItems.length > 0) {
        this.selectedIdInternal = this.defaultSelectedId;
        this.selectionInitialized = true;
      }
    }
    if (changed.has("size")) {
      this.size = resolveMainMenuTopSize(this.size);
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has("openMenuId") ||
      changed.has("openSubmenuId") ||
      changed.has("selectedOptionByItemId") ||
      changed.has("submenuSides") ||
      changed.has("items") ||
      changed.has("slottedItems") ||
      changed.has("size")
    ) {
      this.syncPortal();
    }
  }

  private get effectiveSelectedId(): string | undefined {
    return this.selectedId ?? this.selectedIdInternal;
  }

  private get resolvedItems(): MainMenuTopItem[] {
    return this.useItemsMode ? (this.items ?? []) : this.slottedItems;
  }

  private get navItems(): NavItemConfig[] {
    return this.resolvedItems.map((item) => ({
      id: item.id,
      name: item.name || item.id,
      iconName: item.iconName,
      showIcon: item.showIcon,
      tooltip: item.tooltip,
      dropdown: item.dropdown,
      link: item.link,
      menuNodes: normalizeMenuNodes(item.menuOptions),
    }));
  }

  private refreshSlottedItems = (): void => {
    if (this.useItemsMode) {
      if (this.slottedItems.length) this.slottedItems = [];
      return;
    }
    this.slottedItems = collectSlottedMainMenuTopItems(this);
  };

  private onSlotChange = (): void => {
    this.refreshSlottedItems();
  };

  private emitSelect(detail: MainMenuTopSelectDetail): void {
    this.onMenuItemSelect?.(detail);
    this.dispatchEvent(
      new CustomEvent("ids-menu-item-select", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("onMenuItemSelect", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private openTopMenu(id: string): void {
    this.openMenuId = id;
    this.openSubmenuId = null;
    if (this.selectedId === undefined) {
      this.selectedIdInternal = undefined;
    }
  }

  private closeTopMenu(id?: string | null): void {
    const target = id ?? this.openMenuId;
    if (!target) return;
    if (this.openMenuId === target) {
      this.openMenuId = null;
      this.openSubmenuId = null;
    }
  }

  private selectNavItem(
    id: string,
    name: string,
    link?: MainMenuTopLink,
    menuOptionId?: string,
  ): void {
    this.openMenuId = null;
    this.openSubmenuId = null;
    if (this.selectedId === undefined) {
      this.selectedIdInternal = id;
    }
    this.selectedOptionByItemId = menuOptionId ? { [id]: menuOptionId } : {};
    this.emitSelect({ id, name, selected: true, link, menuOptionId });
  }

  private onWindowReposition = (): void => {
    if (this.openMenuId) this.positionPortal();
  };

  private onDocumentPointerDown = (event: PointerEvent): void => {
    if (!this.openMenuId) return;
    const path = event.composedPath();
    if (path.includes(this) || (this.portalEl && path.includes(this.portalEl))) {
      return;
    }
    this.closeTopMenu(this.openMenuId);
  };

  private onDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.openMenuId) {
      const id = this.openMenuId;
      this.closeTopMenu(id);
      this.renderRoot
        .querySelector<HTMLElement>(`#${CSS.escape(itemFocusId(id))}`)
        ?.focus();
    }
  };

  private clearSubmenuCloseTimer(): void {
    if (this.submenuCloseTimer != null) {
      window.clearTimeout(this.submenuCloseTimer);
      this.submenuCloseTimer = null;
    }
  }

  private scheduleSubmenuClose(): void {
    this.clearSubmenuCloseTimer();
    this.submenuCloseTimer = window.setTimeout(() => {
      this.openSubmenuId = null;
      this.submenuCloseTimer = null;
      this.syncPortal();
    }, 200);
  }

  private ensurePortal(): HTMLDivElement {
    if (!this.portalEl) {
      this.portalEl = document.createElement("div");
      this.portalEl.setAttribute("data-ids", "ids-main-menu-top-portal");
      this.portalEl.className = "ids-mmt-portal-host";
      document.body.appendChild(this.portalEl);
    }
    return this.portalEl;
  }

  private destroyPortal(): void {
    if (this.portalEl) {
      render(nothing, this.portalEl);
      this.portalEl.remove();
      this.portalEl = null;
    }
  }

  private syncPortal(): void {
    const openId = this.openMenuId;
    if (!openId) {
      this.destroyPortal();
      return;
    }
    const config = this.navItems.find((item) => item.id === openId);
    if (!config?.menuNodes?.length) {
      this.destroyPortal();
      return;
    }

    const host = this.ensurePortal();
    const selectedOptionId = this.selectedOptionByItemId[openId];
    render(
      html`
        <style>
          ${mainMenuTopPortalStyles.cssText}
        </style>
        <div class="ids-mmt-portal">
          ${this.renderMenuPortal(config, selectedOptionId)}
        </div>
      `,
      host,
    );
    requestAnimationFrame(() => this.positionPortal());
  }

  private positionPortal(): void {
    const openId = this.openMenuId;
    if (!openId || !this.portalEl) return;

    const trigger = this.renderRoot.querySelector<HTMLElement>(
      `#${CSS.escape(itemFocusId(openId))}`,
    );
    const positioner = this.portalEl.querySelector<HTMLElement>(
      ".ids-mmt-positioner[data-role='primary']",
    );
    const popup = positioner?.querySelector<HTMLElement>(".ids-mmt-popup");
    if (!trigger || !positioner || !popup) return;

    const rect = trigger.getBoundingClientRect();
    const width = Math.max(popup.offsetWidth, MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH);
    const height = popup.offsetHeight;
    const margin = 8;

    let top = rect.bottom + MAIN_MENU_TOP_DROPDOWN_SIDE_OFFSET;
    let side: "bottom" | "top" = "bottom";
    if (top + height > window.innerHeight - margin) {
      const above = rect.top - height - MAIN_MENU_TOP_DROPDOWN_SIDE_OFFSET;
      if (above >= margin) {
        top = above;
        side = "top";
      }
    }

    // Center-align to the triggering top-menu item (spec / React align: center).
    let left = rect.left + rect.width / 2 - width / 2;
    if (left < margin) left = margin;
    if (left + width > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - margin - width);
    }

    positioner.style.top = `${Math.round(top)}px`;
    positioner.style.left = `${Math.round(left)}px`;
    positioner.dataset.side = side;
    positioner.style.visibility = "visible";

    this.positionOpenSubmenu();
  }

  private positionOpenSubmenu(): void {
    const submenuId = this.openSubmenuId;
    if (!submenuId || !this.portalEl) return;

    const trigger = this.portalEl.querySelector<HTMLElement>(
      `[data-submenu-trigger="${CSS.escape(submenuId)}"]`,
    );
    const positioner = this.portalEl.querySelector<HTMLElement>(
      `.ids-mmt-submenuPositioner[data-submenu-id="${CSS.escape(submenuId)}"]`,
    );
    const popup = positioner?.querySelector<HTMLElement>(".ids-mmt-popup");
    if (!trigger || !positioner || !popup) return;

    const preferred =
      this.submenuSides[submenuId] ??
      resolveSubmenuSide(trigger, MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH);
    const triggerRect = trigger.getBoundingClientRect();
    const width = Math.max(popup.offsetWidth, MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH);
    const height = popup.offsetHeight;
    const margin = 8;
    const gap = MAIN_MENU_TOP_SUBMENU_SIDE_OFFSET;

    let side: SubmenuSide = preferred;
    let left =
      side === "right"
        ? triggerRect.right + gap
        : triggerRect.left - width - gap;

    if (side === "right" && left + width > window.innerWidth - margin) {
      const alt = triggerRect.left - width - gap;
      if (alt >= margin) {
        side = "left";
        left = alt;
      }
    } else if (side === "left" && left < margin) {
      const alt = triggerRect.right + gap;
      if (alt + width <= window.innerWidth - margin) {
        side = "right";
        left = alt;
      } else {
        left = margin;
      }
    }

    let top = triggerRect.top;
    if (top + height > window.innerHeight - margin) {
      top = Math.max(margin, window.innerHeight - margin - height);
    }

    positioner.style.top = `${Math.round(top)}px`;
    positioner.style.left = `${Math.round(left)}px`;
    positioner.dataset.side = side;
    positioner.style.visibility = "visible";

    const fromRects = resolveSubmenuSideFromRects(trigger, popup, width);
    const rendered = side || fromRects;
    if (this.submenuSides[submenuId] !== rendered) {
      this.submenuSides = { ...this.submenuSides, [submenuId]: rendered };
    }
  }

  private onItemKeyDown(
    event: KeyboardEvent,
    config: NavItemConfig,
    itemIds: string[],
    itemIndex: number,
  ): void {
    const hasMenu = Boolean(config.menuNodes?.length);
    const menuOpen = this.openMenuId === config.id;

    switch (event.key) {
      case "Enter":
      case " ": {
        event.preventDefault();
        if (hasMenu) {
          if (menuOpen) this.closeTopMenu(config.id);
          else this.openTopMenu(config.id);
        } else {
          this.selectNavItem(config.id, config.name, config.link);
        }
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        const next = itemIds[Math.min(itemIndex + 1, itemIds.length - 1)];
        if (next) {
          this.focusedId = next;
          this.renderRoot
            .querySelector<HTMLElement>(`#${CSS.escape(itemFocusId(next))}`)
            ?.focus();
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        const prev = itemIds[Math.max(itemIndex - 1, 0)];
        if (prev) {
          this.focusedId = prev;
          this.renderRoot
            .querySelector<HTMLElement>(`#${CSS.escape(itemFocusId(prev))}`)
            ?.focus();
        }
        break;
      }
      case "Home": {
        event.preventDefault();
        const first = itemIds[0];
        if (first) {
          this.focusedId = first;
          this.renderRoot
            .querySelector<HTMLElement>(`#${CSS.escape(itemFocusId(first))}`)
            ?.focus();
        }
        break;
      }
      case "End": {
        event.preventDefault();
        const last = itemIds[itemIds.length - 1];
        if (last) {
          this.focusedId = last;
          this.renderRoot
            .querySelector<HTMLElement>(`#${CSS.escape(itemFocusId(last))}`)
            ?.focus();
        }
        break;
      }
      case "ArrowDown": {
        if (hasMenu) {
          event.preventDefault();
          this.openTopMenu(config.id);
          requestAnimationFrame(() => {
            this.portalEl
              ?.querySelector<HTMLElement>(
                ".ids-mmt-optionItem:not([disabled])",
              )
              ?.focus();
          });
        }
        break;
      }
      case "Escape": {
        if (menuOpen) {
          event.preventDefault();
          this.closeTopMenu(config.id);
        }
        break;
      }
      default:
        break;
    }
  }

  private onItemClick(config: NavItemConfig): void {
    const hasMenu = Boolean(config.menuNodes?.length);
    if (hasMenu) {
      if (this.openMenuId === config.id) this.closeTopMenu(config.id);
      else this.openTopMenu(config.id);
      return;
    }
    this.selectNavItem(config.id, config.name, config.link);
  }

  private renderItemLabel(config: NavItemConfig, showActiveChrome: boolean) {
    const isSmall = this.size === "Small";
    const showIcon =
      config.showIcon !== false && Boolean(config.iconName);
    const hasMenu = Boolean(config.menuNodes?.length);
    const showDropdown = config.dropdown !== false || hasMenu;
    const iconColor = showActiveChrome
      ? "var(--color-icon-brand-strong)"
      : "var(--color-icon-gray-neutral-strong)";

    return html`
      <span
        class=${classMap({
          itemCluster: true,
          itemClusterSmall: isSmall,
        })}
      >
        ${showIcon
          ? html`<span class="iconSlot" aria-hidden="true">
              <ids-icon
                shape=${config.iconName ?? MAIN_MENU_TOP_RUNTIME_DEFAULTS.defaultIconName}
                .color=${iconColor}
                style="width:18px;height:18px;display:block;"
              ></ids-icon>
            </span>`
          : nothing}
        <span
          class=${classMap({
            label: true,
            labelSmall: isSmall,
          })}
        >
          ${config.name}
        </span>
      </span>
      ${showDropdown
        ? html`<span
            class=${classMap({
              chevronSlot: true,
              chevronSlotSmall: isSmall,
            })}
            aria-hidden="true"
          >
            <ids-icon
              shape="chev-down-thick"
              .color=${iconColor}
              style="width:12px;height:12px;display:block;"
            ></ids-icon>
          </span>`
        : nothing}
    `;
  }

  private renderNavItem(
    config: NavItemConfig,
    itemIds: string[],
    itemIndex: number,
  ) {
    const menuOpen = this.openMenuId === config.id;
    const hasMenu = Boolean(config.menuNodes?.length);
    /** Underline marks the selected item — persists after a dropdown option is chosen. An open-but-unselected menu shows the open fill instead. */
    const showUnderline = this.effectiveSelectedId === config.id;
    const showMenuOpenFill = menuOpen && !showUnderline;
    const buttonClass = classMap({
      item: true,
      itemSmall: this.size === "Small",
      itemSelected: showUnderline,
      itemMenuOpen: showMenuOpenFill,
    });

    return html`
      <li class="barItem" role="none">
        <button
          id=${itemFocusId(config.id)}
          type="button"
          class=${buttonClass}
          title=${config.tooltip ?? nothing}
          aria-current=${showUnderline ? "page" : nothing}
          aria-haspopup=${hasMenu ? "menu" : nothing}
          aria-expanded=${hasMenu ? String(menuOpen) : nothing}
          @click=${() => this.onItemClick(config)}
          @focus=${() => {
            this.focusedId = config.id;
          }}
          @keydown=${(event: KeyboardEvent) =>
            this.onItemKeyDown(event, config, itemIds, itemIndex)}
        >
          ${this.renderItemLabel(config, showUnderline)}
        </button>
      </li>
    `;
  }

  private renderMenuPortal(
    config: NavItemConfig,
    selectedOptionId?: string,
  ) {
    const nodes = config.menuNodes ?? [];
    return html`
      <div class="ids-mmt-positioner" data-role="primary">
        <div
          class="ids-mmt-popup"
          role="menu"
          style="min-width:${MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH}px;width:max-content;"
        >
          <ul class="ids-mmt-optionsList" role="presentation">
            ${nodes.map((node) =>
              this.renderMenuNode(node, config, selectedOptionId),
            )}
          </ul>
        </div>
      </div>
      ${this.renderOpenSubmenuFlyout(config, selectedOptionId)}
    `;
  }

  private findSubmenuNode(
    nodes: MainMenuTopMenuNode[],
    id: string,
  ): Extract<MainMenuTopMenuNode, { kind: "submenu" }> | null {
    for (const node of nodes) {
      if (node.kind === "submenu" && node.id === id) return node;
      if (node.kind === "group" || node.kind === "submenu") {
        const found = this.findSubmenuNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  private renderOpenSubmenuFlyout(
    config: NavItemConfig,
    selectedOptionId?: string,
  ) {
    const submenuId = this.openSubmenuId;
    if (!submenuId || !config.menuNodes) return nothing;
    const node = this.findSubmenuNode(config.menuNodes, submenuId);
    if (!node) return nothing;

    return html`
      <div
        class="ids-mmt-positioner ids-mmt-submenuPositioner"
        data-submenu-id=${submenuId}
      >
        <div
          class="ids-mmt-popup ids-mmt-submenuPopup"
          role="menu"
          style="min-width:${MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH}px;width:max-content;"
          @mouseenter=${() => this.clearSubmenuCloseTimer()}
          @mouseleave=${() => this.scheduleSubmenuClose()}
        >
          <ul class="ids-mmt-optionsList" role="presentation">
            ${node.children.map((child) =>
              this.renderMenuNode(child, config, selectedOptionId),
            )}
          </ul>
        </div>
      </div>
    `;
  }

  private renderMenuNode(
    node: MainMenuTopMenuNode,
    parent: NavItemConfig,
    selectedOptionId?: string,
  ): TemplateResult {
    if (node.kind === "group") {
      return html`
        <li role="presentation">
          <div class="ids-mmt-groupLabel">${node.label}</div>
          <ul class="ids-mmt-optionsList" role="presentation">
            ${node.children.map((child) =>
              this.renderMenuNode(child, parent, selectedOptionId),
            )}
          </ul>
        </li>
      `;
    }

    if (node.kind === "submenu") {
      const open = this.openSubmenuId === node.id;
      const side =
        this.submenuSides[node.id] ??
        resolveSubmenuSide(null, MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH);
      const chevronSlug =
        side === "left" ? "chev-left-thick" : "chev-right-thick";
      const childSelected = node.children.some(
        (child) => "id" in child && child.id === selectedOptionId,
      );

      return html`
        <li role="presentation">
          <button
            type="button"
            class="ids-mmt-optionItem"
            data-submenu-trigger=${node.id}
            data-submenu-side=${side}
            data-popup-open=${open ? "" : nothing}
            data-selected=${childSelected ? "true" : nothing}
            ?disabled=${Boolean(node.disabled)}
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded=${String(open)}
            @mouseenter=${(event: MouseEvent) => {
              this.clearSubmenuCloseTimer();
              const trigger = event.currentTarget as HTMLElement;
              const predicted = resolveSubmenuSide(
                trigger,
                MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH,
              );
              this.submenuSides = {
                ...this.submenuSides,
                [node.id]: predicted,
              };
              this.openSubmenuId = node.id;
            }}
            @mouseleave=${() => this.scheduleSubmenuClose()}
            @focus=${(event: FocusEvent) => {
              this.clearSubmenuCloseTimer();
              const trigger = event.currentTarget as HTMLElement;
              const predicted = resolveSubmenuSide(
                trigger,
                MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH,
              );
              this.submenuSides = {
                ...this.submenuSides,
                [node.id]: predicted,
              };
              this.openSubmenuId = node.id;
            }}
            @keydown=${(event: KeyboardEvent) => {
              if (event.key === "ArrowRight" || event.key === "Enter") {
                event.preventDefault();
                this.openSubmenuId = node.id;
                requestAnimationFrame(() => {
                  this.portalEl
                    ?.querySelector<HTMLElement>(
                      `.ids-mmt-submenuPositioner[data-submenu-id="${CSS.escape(node.id)}"] .ids-mmt-optionItem:not([disabled])`,
                    )
                    ?.focus();
                });
              }
              if (event.key === "ArrowLeft" && open) {
                event.preventDefault();
                this.openSubmenuId = null;
              }
            }}
          >
            <span>${node.label}</span>
            <span class="ids-mmt-submenuChevron" aria-hidden="true">
              <ids-icon
                shape=${chevronSlug}
                style="width:16px;height:16px;display:block;"
              ></ids-icon>
            </span>
          </button>
        </li>
      `;
    }

    // leaf item
    return html`
      <li role="presentation">
        <button
          type="button"
          class="ids-mmt-optionItem"
          role="menuitem"
          data-selected=${selectedOptionId === node.id ? "true" : nothing}
          ?disabled=${Boolean(node.disabled)}
          @click=${() => {
            if (node.disabled) return;
            this.selectNavItem(parent.id, parent.name, parent.link, node.id);
          }}
          @keydown=${(event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!node.disabled) {
                this.selectNavItem(
                  parent.id,
                  parent.name,
                  parent.link,
                  node.id,
                );
              }
            }
          }}
        >
          ${node.label}
        </button>
      </li>
    `;
  }

  override render() {
    const navItems = this.navItems;
    const itemIds = navItems.map((item) => item.id);

    return html`
      <slot @slotchange=${this.onSlotChange} style="display:none"></slot>
      <nav
        class="root"
        aria-label=${this.ariaLabel}
        data-focused-id=${this.focusedId ?? nothing}
      >
        <div class="container">
          <ul class="bar" role="list">
            ${repeat(
              navItems,
              (item) => item.id,
              (item, index) => this.renderNavItem(item, itemIds, index),
            )}
          </ul>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-main-menu-top": IdsMainMenuTop;
  }
}
