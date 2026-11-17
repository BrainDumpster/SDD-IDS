/**
 * IdsMainMenuLeft — Lit web component.
 *
 * Tag: `ids-main-menu-left`
 * Spec: `components/ids/main-menu-left/design-spec.md`
 * API parity: React `lib/react/ids/main-menu-left` (`IdsMainMenuLeft`)
 *
 * Composition (preferred Mode B — Tree-style):
 *   <ids-main-menu-left>
 *     <ids-main-menu-left-item id="dashboard" name="Dashboard" icon-name="home">
 *     </ids-main-menu-left-item>
 *     <ids-main-menu-left-item id="infra" name="Infrastructure" icon-name="network-share">
 *       <ids-main-menu-left-item id="a" name="Secondary A"></ids-main-menu-left-item>
 *     </ids-main-menu-left-item>
 *   </ids-main-menu-left>
 *
 * Mode A: `items: MainMenuLeftPrimaryItem[]` — when non-empty, slotted Mode B is ignored.
 *
 * Live Figma (0bHk3XhrjFhowgFkz9yLr4, MCP 2026-11-13):
 *   Expanded `11099:56218`, Collapsed `11099:56206`,
 *   Primary `11099:56244`, PrimaryIcon `11099:56230`, Secondary `11099:56237`
 *
 * Events / React callback props:
 *   `ids-expanded-change` / `onExpandedChange` — { expanded: boolean } / boolean
 *   `ids-navigate` / `onNavigate` — MainMenuLeftNavigationTarget
 *   `ids-selected` / `onSelected` — MainMenuLeftSelectionDetail
 */
import { LitElement, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import "../icon/register.js";
import "../tooltip/register.js";
import { collectSlottedMainMenuLeftItems } from "./main-menu-left-parts.element.js";
import {
  MAIN_MENU_LEFT_RUNTIME_DEFAULTS,
  buildNavigateTarget,
  buildSelectionDetail,
  primaryDisplayName,
  resolveInitialSelectedKey,
  resolvePrimaryId,
  resolveSecondaryId,
  secondaryDisplayName,
  toPascalState,
  type MainMenuLeftLogo,
  type MainMenuLeftNavigationTarget,
  type MainMenuLeftPrimaryItem,
  type MainMenuLeftPrimaryState,
  type MainMenuLeftSecondaryItem,
  type MainMenuLeftSelectionDetail,
} from "./main-menu-left.constants.js";
import { mainMenuLeftStyles } from "./main-menu-left.styles.js";

export class IdsMainMenuLeft extends LitElement {
  static override styles = [mainMenuLeftStyles];

  /** Optional branding block above the menu list. */
  @property({ attribute: false })
  logo?: MainMenuLeftLogo;

  /**
   * Rail width mode. With a listener for `ids-expanded-change`, treat as
   * controlled (parent updates this after toggle). Without: component updates
   * itself (default `true`).
   */
  @property({ type: Boolean })
  expanded: boolean = MAIN_MENU_LEFT_RUNTIME_DEFAULTS.expanded;

  /**
   * Mode A: primary menu rows (React `items` parity).
   * When non-empty, slotted Mode B children are ignored.
   */
  @property({ attribute: false })
  items: MainMenuLeftPrimaryItem[] = [];

  /** Initial primary selection id (Spec Accurate: `"dashboard"`). */
  @property({ type: String, attribute: "defaultselecteditemid" })
  defaultSelectedItemId?: string;

  /** Storybook / QA — freezes `item.state` / `childrenMenu`. */
  @property({ type: Boolean, attribute: "forcestates" })
  forceStates: boolean = MAIN_MENU_LEFT_RUNTIME_DEFAULTS.forceStates;

  /** Overrides default `aria-label` on root `nav`. */
  @property({ type: String, attribute: "arialabel" })
  ariaLabel = MAIN_MENU_LEFT_RUNTIME_DEFAULTS.ariaLabel;

  /** React API parity — footer expand/collapse toggle. */
  @property({ attribute: false })
  onExpandedChange?: (expanded: boolean) => void;

  /** React API parity — row / logo activation. */
  @property({ attribute: false })
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;

  /** React API parity — selection change (not logo). */
  @property({ attribute: false })
  onSelected?: (detail: MainMenuLeftSelectionDetail) => void;

  @state() private hoverExpanded = false;
  @state() private selectedKey: string | null = null;
  @state() private expandedChildrenKey: string | null = null;
  @state() private selectedSecondaryParentKey: string | null = null;
  @state() private selectedSecondaryKey: string | null = null;
  @state() private truncatedKeys = new Set<string>();
  @state() private wrappedKeys = new Set<string>();
  /** Snapshot of Mode B slotted children (refreshed on slotchange). */
  @state() private slottedItems: MainMenuLeftPrimaryItem[] = [];

  @query(".content") private contentEl!: HTMLElement | null;

  private labelEls = new Map<string, HTMLSpanElement>();
  private resizeObserver: ResizeObserver | null = null;
  private selectionInitialized = false;

  get useItemsMode(): boolean {
    return this.items != null && this.items.length > 0;
  }

  private get resolvedItems(): MainMenuLeftPrimaryItem[] {
    return this.useItemsMode ? (this.items ?? []) : this.slottedItems;
  }

  private refreshSlottedItems = (): void => {
    if (this.useItemsMode) {
      if (this.slottedItems.length) this.slottedItems = [];
      return;
    }
    this.slottedItems = collectSlottedMainMenuLeftItems(this);
  };

  private onSlotChange = (): void => {
    this.refreshSlottedItems();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-main-menu-left-host");
  }

  override disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    super.disconnectedCallback();
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (
      !this.selectionInitialized &&
      (changed.has("items") ||
        changed.has("slottedItems") ||
        changed.has("defaultSelectedItemId"))
    ) {
      // Wait for Mode B slot scrape (or Mode A items) before locking defaults.
      if (this.useItemsMode || this.slottedItems.length > 0) {
        this.selectedKey = resolveInitialSelectedKey(
          this.resolvedItems,
          this.defaultSelectedItemId,
        );
        this.selectionInitialized = true;
      }
    }
  }

  override firstUpdated(): void {
    this.refreshSlottedItems();
    this.setupResizeObserver();
    this.measureLabels();
    this.neutralizeTooltipTabStops();
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has("items") ||
      changed.has("slottedItems") ||
      changed.has("expanded") ||
      changed.has("hoverExpanded") ||
      changed.has("expandedChildrenKey") ||
      changed.has("forceStates") ||
      changed.has("truncatedKeys") ||
      changed.has("wrappedKeys")
    ) {
      requestAnimationFrame(() => {
        this.measureLabels();
        this.neutralizeTooltipTabStops();
      });
    }
  }

  private get isFixedExpanded(): boolean {
    return this.expanded ?? true;
  }

  private get overlayExpanded(): boolean {
    return this.hoverExpanded && !this.isFixedExpanded;
  }

  private get showExpanded(): boolean {
    return this.isFixedExpanded || this.overlayExpanded;
  }

  private setRailExpanded(next: boolean): void {
    this.expanded = next;
    this.onExpandedChange?.(next);
    this.dispatchEvent(
      new CustomEvent("ids-expanded-change", {
        detail: { expanded: next },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("onExpandedChange", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitNavigate(detail: MainMenuLeftNavigationTarget): void {
    this.onNavigate?.(detail);
    this.dispatchEvent(
      new CustomEvent("ids-navigate", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("onNavigate", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitSelected(detail: MainMenuLeftSelectionDetail): void {
    this.onSelected?.(detail);
    this.dispatchEvent(
      new CustomEvent("ids-selected", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("onSelected", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.measureLabels());
    for (const el of this.labelEls.values()) {
      this.resizeObserver.observe(el);
    }
  }

  private measureLabels(): void {
    const truncated = new Set<string>();
    const wrapped = new Set<string>();
    for (const [key, el] of this.labelEls) {
      if (
        el.scrollHeight > el.clientHeight + 1 ||
        el.scrollWidth > el.clientWidth + 1
      ) {
        truncated.add(key);
      }
      if (el.clientHeight > 32) {
        wrapped.add(key);
      }
    }
    const sameSet = (a: Set<string>, b: Set<string>) =>
      a.size === b.size && [...a].every((k) => b.has(k));
    if (!sameSet(truncated, this.truncatedKeys)) {
      this.truncatedKeys = truncated;
    }
    if (!sameSet(wrapped, this.wrappedKeys)) {
      this.wrappedKeys = wrapped;
    }
  }

  private neutralizeTooltipTabStops(): void {
    this.renderRoot
      .querySelectorAll<HTMLElement>("ids-tooltip-trigger")
      .forEach((el) => {
        el.tabIndex = -1;
      });
  }

  private setLabelRef(key: string, el: Element | undefined): void {
    if (!(el instanceof HTMLSpanElement)) {
      const prev = this.labelEls.get(key);
      if (prev) {
        this.resizeObserver?.unobserve(prev);
        this.labelEls.delete(key);
      }
      return;
    }
    const prev = this.labelEls.get(key);
    if (prev && prev !== el) {
      this.resizeObserver?.unobserve(prev);
    }
    this.labelEls.set(key, el);
    this.resizeObserver?.observe(el);
  }

  private getFocusableButtons(): HTMLButtonElement[] {
    const container = this.contentEl;
    if (!container) return [];
    return Array.from(
      container.querySelectorAll<HTMLButtonElement>(
        'button:not([tabindex="-1"])',
      ),
    );
  }

  private moveFocus(delta: number): void {
    const buttons = this.getFocusableButtons();
    const active = this.shadowRoot?.activeElement as HTMLButtonElement | null;
    if (!active) return;
    const index = buttons.indexOf(active);
    if (index === -1) return;
    const nextIndex = index + delta;
    if (nextIndex >= 0 && nextIndex < buttons.length) {
      buttons[nextIndex]?.focus();
    }
  }

  private focusFirst(): void {
    this.getFocusableButtons()[0]?.focus();
  }

  private focusLast(): void {
    const buttons = this.getFocusableButtons();
    buttons[buttons.length - 1]?.focus();
  }

  private focusParent(parentItemId: string): void {
    this.contentEl
      ?.querySelector<HTMLButtonElement>(`[data-item-id="${parentItemId}"]`)
      ?.focus();
  }

  private onReserveEnter(): void {
    if (!this.isFixedExpanded) this.hoverExpanded = true;
  }

  private onReserveLeave(): void {
    this.hoverExpanded = false;
  }

  private selectPrimary(item: MainMenuLeftPrimaryItem, itemId: string): void {
    const primaryLabel = primaryDisplayName(item);
    this.selectedKey = itemId;
    this.selectedSecondaryParentKey = null;
    this.selectedSecondaryKey = null;
    this.emitNavigate(
      buildNavigateTarget(itemId, primaryLabel, undefined, item.link, {
        href: item.href,
        routeRef: item.routeRef,
      }),
    );
    this.emitSelected(
      buildSelectionDetail("primary", itemId, undefined, primaryLabel, item.link, {
        href: item.href,
        routeRef: item.routeRef,
      }),
    );
  }

  private togglePrimary(
    item: MainMenuLeftPrimaryItem,
    itemId: string,
    hasChildren: boolean,
    hasForcedState: boolean,
  ): void {
    if (hasForcedState) return;
    if (hasChildren && this.showExpanded) {
      this.expandedChildrenKey =
        this.expandedChildrenKey === itemId ? null : itemId;
      return;
    }
    this.selectPrimary(item, itemId);
  }

  private openPrimary(
    item: MainMenuLeftPrimaryItem,
    itemId: string,
    hasChildren: boolean,
    showChildrenList: boolean,
    hasForcedState: boolean,
  ): void {
    if (hasForcedState) return;
    if (hasChildren && this.showExpanded) {
      if (!showChildrenList) this.expandedChildrenKey = itemId;
      return;
    }
    this.selectPrimary(item, itemId);
  }

  private activateSecondary(
    child: MainMenuLeftSecondaryItem,
    childId: string,
    parentId: string,
  ): void {
    const childLabel = secondaryDisplayName(child);
    this.selectedKey = null;
    this.selectedSecondaryParentKey = parentId;
    this.selectedSecondaryKey = childId;
    this.emitNavigate(
      buildNavigateTarget(childId, childLabel, parentId, child.link, {
        href: child.href,
        routeRef: child.routeRef,
      }),
    );
    this.emitSelected(
      buildSelectionDetail(
        "secondary",
        childId,
        parentId,
        childLabel,
        child.link,
        { href: child.href, routeRef: child.routeRef },
      ),
    );
  }

  private onLogoClick(): void {
    const logo = this.logo;
    if (!logo?.link) return;
    this.emitNavigate(
      buildNavigateTarget("__logo__", logo.alt, undefined, logo.link, {}),
    );
  }

  private renderClampedLabel(
    key: string,
    text: string,
    tooltip: string,
    wrapperClass: string,
    textClass: string,
  ) {
    const isTruncated = this.truncatedKeys.has(key);
    const isWrapped = this.wrappedKeys.has(key);
    const labelSpan = html`
      <span class=${textClass} ${ref((el) => this.setLabelRef(key, el))}>
        ${text}
      </span>
    `;
    return html`
      <span
        class=${wrapperClass}
        data-wrapped=${isWrapped ? "true" : nothing}
      >
        ${isTruncated
          ? html`
              <ids-tooltip side="right" arrowalign="start" hugcontent>
                <ids-tooltip-trigger display="block">
                  ${labelSpan}
                </ids-tooltip-trigger>
                <ids-tooltip-panel>
                  <ids-tooltip-body>${tooltip}</ids-tooltip-body>
                </ids-tooltip-panel>
              </ids-tooltip>
            `
          : labelSpan}
      </span>
    `;
  }

  override render() {
    const showExpanded = this.showExpanded;
    const overlayExpanded = this.overlayExpanded;

    return html`
      <slot @slotchange=${this.onSlotChange} style="display:none"></slot>
      <div
        class=${classMap({
          reserve: true,
          reserveExpanded: this.isFixedExpanded,
          reserveCollapsed: !this.isFixedExpanded,
        })}
        @mouseenter=${this.onReserveEnter}
        @mouseleave=${this.onReserveLeave}
      >
        <nav
          class=${classMap({
            root: true,
            expanded: showExpanded,
            collapsed: !showExpanded,
            overlay: overlayExpanded,
          })}
          aria-label=${this.ariaLabel}
        >
          ${this.renderLogo()}
          <div class="content">
            ${repeat(
              this.resolvedItems,
              (item, index) => resolvePrimaryId(item, index),
              (item, index) => this.renderPrimaryBlock(item, index),
            )}
          </div>
          ${this.renderFooter()}
        </nav>
      </div>
    `;
  }

  private renderLogo() {
    const logo = this.logo;
    if (!logo) return nothing;

    const mark = logo.src
      ? html`<img
          src=${logo.src}
          alt=""
          class="logoImg"
          width="32"
          height="32"
        />`
      : logo.iconName
        ? html`<ids-icon
            shape=${logo.iconName}
            size="24"
            class-name="logoIcon"
          ></ids-icon>`
        : nothing;

    if (logo.link) {
      return html`
        <div class="logoSlot">
          <button
            type="button"
            class="logoButton"
            title=${logo.tooltip ?? logo.alt}
            aria-label=${logo.alt}
            @click=${this.onLogoClick}
          >
            ${mark}
          </button>
        </div>
      `;
    }

    return html`
      <div class="logoSlot">
        <div
          class="logoStatic"
          role="img"
          aria-label=${logo.alt}
          title=${logo.tooltip ?? nothing}
        >
          ${mark}
        </div>
      </div>
    `;
  }

  private renderFooter() {
    const isExpanded = this.isFixedExpanded;
    return html`
      <div class="bottomToggle">
        <button
          type="button"
          class="bottomToggleButton"
          aria-label=${isExpanded
            ? "Collapse navigation"
            : "Expand navigation"}
          @click=${() => {
            this.setRailExpanded(!isExpanded);
            this.expandedChildrenKey = null;
          }}
        >
          <ids-icon
            shape=${isExpanded ? "double-chev-left" : "double-chev-right"}
            size="16"
            class-name="bottomToggleIcon"
          ></ids-icon>
        </button>
      </div>
    `;
  }

  private renderPrimaryBlock(item: MainMenuLeftPrimaryItem, itemIndex: number) {
    const itemId = resolvePrimaryId(item, itemIndex);
    const hasForcedState = this.forceStates && Boolean(item.state);
    const state: MainMenuLeftPrimaryState = hasForcedState
      ? item.state!
      : this.selectedKey === itemId
        ? "selected"
        : "default";
    const isSelected = state === "selected" || state === "selected-focus";
    const isFocused = state === "default-focus" || state === "selected-focus";
    const childList = item.children ?? [];
    const hasChildren = childList.length > 0;
    const showChildrenList =
      this.showExpanded &&
      hasChildren &&
      (hasForcedState
        ? item.childrenMenu === "expanded"
        : this.expandedChildrenKey === itemId);
    const showChevron = this.showExpanded && hasChildren;
    const primaryIconName =
      item.iconName ?? MAIN_MENU_LEFT_RUNTIME_DEFAULTS.defaultIconName;
    const hasSelectedSecondary = this.selectedSecondaryParentKey === itemId;
    const parentSelectedWhileHidden =
      hasSelectedSecondary && !showChildrenList;
    const showSelectedInset = hasForcedState
      ? state === "selected" || state === "selected-focus"
      : hasChildren
        ? parentSelectedWhileHidden
        : this.selectedKey === itemId;
    const primaryIsCurrentPage =
      (isSelected && !hasSelectedSecondary) ||
      (hasSelectedSecondary && !showChildrenList);
    const primaryLabel = primaryDisplayName(item);
    const primaryTitle = item.tooltip ?? primaryLabel;
    const stateClass = `state${toPascalState(state)}`;

    const onPrimaryKeyDown = (event: KeyboardEvent) => {
      if (hasForcedState) return;
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          this.moveFocus(-1);
          break;
        case "ArrowDown":
          event.preventDefault();
          this.moveFocus(1);
          break;
        case "Home":
          event.preventDefault();
          this.focusFirst();
          break;
        case "End":
          event.preventDefault();
          this.focusLast();
          break;
        case "ArrowRight":
          if (hasChildren && this.showExpanded) {
            event.preventDefault();
            if (!showChildrenList) {
              this.expandedChildrenKey = itemId;
              setTimeout(() => this.moveFocus(1), 0);
            } else {
              this.moveFocus(1);
            }
          }
          break;
        case "ArrowLeft":
          if (showChildrenList) {
            event.preventDefault();
            this.expandedChildrenKey = null;
          }
          break;
        case "Escape":
          if (showChildrenList) {
            event.preventDefault();
            this.expandedChildrenKey = null;
          }
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          this.openPrimary(
            item,
            itemId,
            hasChildren,
            showChildrenList,
            hasForcedState,
          );
          break;
      }
    };

    return html`
      <div class="itemBlock">
        <button
          type="button"
          data-item-id=${itemId}
          title=${!this.showExpanded ? primaryTitle : nothing}
          class=${classMap({
            primaryRow: true,
            interactive: !hasForcedState,
            [stateClass]: true,
            secondaryParentSelected: parentSelectedWhileHidden,
            selected: showSelectedInset,
          })}
          aria-current=${primaryIsCurrentPage ? "page" : nothing}
          aria-expanded=${showChevron ? String(showChildrenList) : nothing}
          tabindex=${hasForcedState ? -1 : nothing}
          @click=${() =>
            this.togglePrimary(item, itemId, hasChildren, hasForcedState)}
          @keydown=${onPrimaryKeyDown}
        >
          <ids-icon
            shape=${primaryIconName}
            size="16"
            class-name="primaryIcon"
          ></ids-icon>
          ${this.showExpanded
            ? this.renderClampedLabel(
                `p:${itemId}`,
                primaryLabel,
                item.tooltip ?? primaryLabel,
                "primaryLabel",
                "primaryLabelText",
              )
            : nothing}
          ${showChevron
            ? html`<ids-icon
                shape=${showChildrenList
                  ? "chev-down-thick"
                  : "chev-right-thick"}
                size="16"
                class-name="chevronIcon"
              ></ids-icon>`
            : nothing}
          ${isFocused
            ? html`<span class="focusRing" aria-hidden="true"></span>`
            : nothing}
          ${showSelectedInset
            ? html`<span class="selectedInset" aria-hidden="true"></span>`
            : nothing}
        </button>
        ${showChildrenList
          ? html`
              <div class="secondarySection">
                ${repeat(
                  childList,
                  (child, childIndex) =>
                    resolveSecondaryId(child, itemId, childIndex),
                  (child, childIndex) =>
                    this.renderSecondaryRow(child, itemId, childIndex),
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private renderSecondaryRow(
    child: MainMenuLeftSecondaryItem,
    parentId: string,
    childIndex: number,
  ) {
    const childId = resolveSecondaryId(child, parentId, childIndex);
    const childLabel = secondaryDisplayName(child);
    const isSecondarySelected =
      this.selectedSecondaryParentKey === parentId &&
      this.selectedSecondaryKey === childId;

    const onSecondaryKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          this.moveFocus(-1);
          break;
        case "ArrowDown":
          event.preventDefault();
          this.moveFocus(1);
          break;
        case "Home":
          event.preventDefault();
          this.focusFirst();
          break;
        case "End":
          event.preventDefault();
          this.focusLast();
          break;
        case "ArrowLeft":
          event.preventDefault();
          this.focusParent(parentId);
          break;
        case "Escape":
          event.preventDefault();
          this.expandedChildrenKey = null;
          setTimeout(() => this.focusParent(parentId), 0);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          this.activateSecondary(child, childId, parentId);
          break;
      }
    };

    return html`
      <button
        type="button"
        data-item-id=${childId}
        data-parent-id=${parentId}
        class=${classMap({
          secondaryRow: true,
          secondaryInteractive: true,
          secondaryRowSelected: isSecondarySelected,
        })}
        aria-current=${isSecondarySelected ? "page" : nothing}
        @click=${() => this.activateSecondary(child, childId, parentId)}
        @keydown=${onSecondaryKeyDown}
      >
        ${this.renderClampedLabel(
          `s:${childId}`,
          childLabel,
          child.tooltip ?? childLabel,
          "secondaryLabel",
          "secondaryLabelText",
        )}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-main-menu-left": IdsMainMenuLeft;
  }
}
