/**
 * IdsTabs — Lit web component root.
 *
 * Tag: `ids-tabs`
 * Spec: `components/ids/tab/design-spec.md`
 * API: `lib/react/ids/tab` (`IdsTabs` / `IdsTab` / `IdsTabButton` / `IdsTabContent`)
 * Theme: `components/ids-theme.css` (via host; do not import in component)
 *
 * Hierarchy:
 *   ids-tabs
 *     ids-tab (repeatable) → ids-tab-button + ids-tab-content
 *   — or —
 *   .items property API
 *
 * Events:
 *   active-item-change  detail: string
 *   tab-select          detail: { id, label }
 *   add-tab
 *   overflow-selection  detail: string
 *   items-change        detail: IdsTabItemInput[]
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { createRef, ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "../badge/register.js";
import "../icon/register.js";
import type { IdsTab } from "./tab-item.element.js";
import {
  PLACEHOLDER_ITEM,
  TAB_ADD_ICON_SLUG,
  TAB_ALERT_ICON_SLUG,
  TAB_API_DEFAULTS,
  TAB_CLOSE_ICON_SLUG,
  TAB_OVERFLOW_MORE_ICON_SIZE_PX,
  TAB_OVERFLOW_MORE_ICON_SLUG,
  TAB_OVERFLOW_MORE_TRIGGER_RESERVE_PX,
  firstEnabledId,
  normalizeItems,
  resolveSurface,
  resolveType,
  type IdsTabItemInput,
  type IdsTabsSurface,
  type IdsTabsType,
} from "./tab.constants.js";
import { OVERFLOW_MENU_STYLES, tabsStyles } from "./tab.styles.js";

let tabsUid = 0;

interface RuntimeTab extends IdsTabItemInput {
  /** When composition mode, hold reference to light-DOM content host. */
  contentHost?: HTMLElement | null;
}

export class IdsTabs extends LitElement {
  static override styles = [tabsStyles];

  private readonly uid = `ids-tabs-${++tabsUid}`;

  /** Ordered tab items (convenience API). When set, composition children are ignored. */
  @property({ attribute: false })
  items?: IdsTabItemInput[];

  /** `"secondary"` (default) or `"primary"`. */
  @property({ type: String, reflect: true })
  type: IdsTabsType | string = TAB_API_DEFAULTS.type;

  /** Backward-compatible alias of `type`; `type` wins when both are set. */
  @property({ type: String, reflect: true })
  variant: IdsTabsType | string = "";

  /** `"elevated"` (default) or `"transparent"`. Legacy `"white"` → `"elevated"`. */
  @property({ type: String, reflect: true })
  surface: IdsTabsSurface | "white" | string = TAB_API_DEFAULTS.surface;

  /** Controlled active tab id. */
  @property({ type: String, attribute: "activeitemid" })
  activeItemId?: string;

  /** Initial tab id for uncontrolled mode. */
  @property({ type: String, attribute: "defaultactiveitemid" })
  defaultActiveItemId = "";

  @property({ type: Boolean, attribute: "allowaddtab", reflect: true })
  allowAddTab = TAB_API_DEFAULTS.allowAddTab;

  @property({ type: String, attribute: "addtablabel" })
  addTabLabel = TAB_API_DEFAULTS.addTabLabel;

  /** Enables responsive overflow-to-`More`; default `true`. */
  @property({ type: Boolean, reflect: true })
  overflow = TAB_API_DEFAULTS.overflow;

  @property({ type: String, attribute: "morelabel" })
  moreLabel = TAB_API_DEFAULTS.moreLabel;

  @state()
  private internalItems: RuntimeTab[] = [{ ...PLACEHOLDER_ITEM }];

  @state()
  private uncontrolledActive = "";

  @state()
  private visibleCount = 1;

  @state()
  private overflowLabel: string | null = null;

  @state()
  private overflowOpen = false;

  @state()
  private highlightedOverflow = 0;

  private readonly listRef = createRef<HTMLDivElement>();
  private readonly measureRef = createRef<HTMLDivElement>();
  private readonly moreTriggerRef = createRef<HTMLButtonElement>();
  private readonly addMeasureRef = createRef<HTMLButtonElement>();
  private readonly moreMeasureRef = createRef<HTMLButtonElement>();

  private tabButtonMap = new Map<string, HTMLButtonElement>();
  private resizeObserver?: ResizeObserver;
  private slotObserver?: MutationObserver;
  private overflowMenuEl: HTMLUListElement | null = null;
  private overflowStyleEl: HTMLStyleElement | null = null;
  private docListenersBound = false;

  private get resolvedType(): IdsTabsType {
    return resolveType(this.type || undefined, this.variant || undefined);
  }

  private get resolvedSurface(): IdsTabsSurface {
    return resolveSurface(this.surface);
  }

  private get itemsControlled(): boolean {
    return this.items !== undefined;
  }

  private get isActiveControlled(): boolean {
    return this.activeItemId !== undefined;
  }

  private get tabs(): RuntimeTab[] {
    return this.itemsControlled
      ? normalizeItems(this.items)
      : this.internalItems;
  }

  private get resolvedActiveId(): string {
    return this.isActiveControlled
      ? firstEnabledId(this.tabs, this.activeItemId)
      : firstEnabledId(this.tabs, this.uncontrolledActive);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tabs");
    if (!this.isActiveControlled) {
      this.uncontrolledActive = firstEnabledId(
        this.tabs,
        this.defaultActiveItemId || undefined,
      );
    }
  }

  override firstUpdated(): void {
    this.collectFromChildren();
    this.slotObserver = new MutationObserver(() => this.collectFromChildren());
    this.slotObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "id",
        "disabled",
        "closable",
        "iconslug",
        "badgecount",
        "hasalert",
      ],
    });
    this.setupResizeObserver();
    requestAnimationFrame(() => this.recomputeOverflow());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.slotObserver?.disconnect();
    this.closeOverflow();
    this.teardownDocListeners();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("items") && this.itemsControlled) {
      this.internalItems = normalizeItems(this.items);
      if (!this.isActiveControlled) {
        this.uncontrolledActive = firstEnabledId(
          this.internalItems,
          this.uncontrolledActive || this.defaultActiveItemId || undefined,
        );
      }
    }
    if (
      changed.has("activeItemId") &&
      this.isActiveControlled &&
      this.activeItemId !== undefined
    ) {
      /* controlled — resolved via getter */
    }
    if (
      changed.has("defaultActiveItemId") &&
      !this.isActiveControlled &&
      !this.uncontrolledActive
    ) {
      this.uncontrolledActive = firstEnabledId(
        this.tabs,
        this.defaultActiveItemId || undefined,
      );
    }
    if (
      changed.has("overflow") ||
      changed.has("allowAddTab") ||
      changed.has("addTabLabel") ||
      changed.has("type") ||
      changed.has("variant") ||
      changed.has("items")
    ) {
      this.recomputeOverflow();
    }
    if (this.visibleCount >= this.tabs.length && this.overflowLabel !== null) {
      this.overflowLabel = null;
    }
  }

  private collectFromChildren(): void {
    if (this.itemsControlled) return;
    const tabEls = Array.from(this.querySelectorAll(":scope > ids-tab")) as IdsTab[];
    if (!tabEls.length) {
      if (!this.internalItems.length) {
        this.internalItems = [{ ...PLACEHOLDER_ITEM }];
      }
      return;
    }
    const collected: RuntimeTab[] = tabEls.map((el) => {
      const badgeAttr = el.getAttribute("badgecount");
      const badgeCount =
        el.badgeCount != null
          ? el.badgeCount
          : badgeAttr != null && badgeAttr !== ""
            ? Number(badgeAttr)
            : undefined;
      return {
        id: el.id || el.getAttribute("id") || PLACEHOLDER_ITEM.id,
        label: el.labelText,
        content: el.contentEl?.textContent?.trim() ?? "",
        iconSlug: el.iconSlug || undefined,
        badgeCount:
          badgeCount != null && !Number.isNaN(badgeCount) ? badgeCount : undefined,
        hasAlert: Boolean(el.hasAlert),
        closable: Boolean(el.closable),
        disabled: Boolean(el.disabled),
        contentHost: el.contentEl,
      };
    });
    this.internalItems = normalizeItems(collected);
    if (!this.isActiveControlled) {
      this.uncontrolledActive = firstEnabledId(
        this.internalItems,
        this.uncontrolledActive || this.defaultActiveItemId || undefined,
      );
    }
    this.recomputeOverflow();
  }

  private renderPanelBody(activeTab: RuntimeTab) {
    if (activeTab.contentHost) {
      const htmlSource = activeTab.contentHost.innerHTML.trim();
      if (htmlSource) return unsafeHTML(htmlSource);
    }
    return activeTab.content;
  }

  private setupResizeObserver(): void {
    const list = this.listRef.value;
    if (!list) return;
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.recomputeOverflow());
    this.resizeObserver.observe(list);
    this.recomputeOverflow();
  }

  private recomputeOverflow(): void {
    if (!this.overflow) {
      this.visibleCount = this.tabs.length;
      return;
    }
    const list = this.listRef.value;
    const measure = this.measureRef.value;
    if (!list || !measure) {
      this.visibleCount = Math.max(1, this.tabs.length);
      return;
    }

    const available = list.clientWidth;
    const addW = this.allowAddTab
      ? (this.addMeasureRef.value?.offsetWidth ?? 0)
      : 0;
    const tabEls = Array.from(
      measure.querySelectorAll<HTMLElement>("[data-measure-tab]"),
    );
    const widths = tabEls.map((el) => el.offsetWidth);
    const totalTabsW = widths.reduce((a, b) => a + b, 0);

    if (totalTabsW + addW <= available) {
      this.visibleCount = this.tabs.length;
      return;
    }

    const moreW =
      this.moreMeasureRef.value?.offsetWidth ??
      TAB_OVERFLOW_MORE_TRIGGER_RESERVE_PX;
    const budget = Math.max(0, available - addW - moreW);

    let used = 0;
    let count = 0;
    for (let i = 0; i < widths.length; i += 1) {
      const w = widths[i] ?? 0;
      if (used + w > budget && count > 0) break;
      used += w;
      count += 1;
    }
    count = Math.max(1, Math.min(count, this.tabs.length));
    count = Math.max(1, Math.min(count, this.tabs.length - 1));
    this.visibleCount = count;
  }

  private emit(name: string, detail?: unknown): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setActive(id: string): void {
    if (!this.isActiveControlled) {
      this.uncontrolledActive = id;
    }
    this.emit("active-item-change", id);
  }

  private selectTab(
    id: string,
    label: string,
    source: "visible" | "overflow",
  ): void {
    this.setActive(id);
    this.emit("tab-select", { id, label });
    if (source === "overflow") {
      this.overflowLabel = label;
      this.emit("overflow-selection", id);
      this.closeOverflow();
    } else {
      this.overflowLabel = null;
    }
  }

  private closeTab(id: string): void {
    if (this.tabs.length <= 1) return;
    const idx = this.tabs.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const next = this.tabs.filter((t) => t.id !== id);
    if (!this.itemsControlled) {
      this.internalItems = next;
      // Remove matching light-DOM carrier when composition mode
      const el = this.querySelector(`:scope > ids-tab[id="${CSS.escape(id)}"]`);
      el?.remove();
    }
    this.emit("items-change", next);
    if (this.resolvedActiveId === id) {
      const nextActive = next[idx] ?? next[idx - 1] ?? next[0];
      if (nextActive) {
        this.setActive(nextActive.id);
        this.emit("tab-select", {
          id: nextActive.id,
          label: nextActive.label,
        });
      }
    }
  }

  private onAddTab = (): void => {
    this.emit("add-tab");
  };

  private registerTabButton(id: string, el: HTMLButtonElement | null): void {
    if (el) this.tabButtonMap.set(id, el);
    else this.tabButtonMap.delete(id);
  }

  private getVisibleEnabledIds(): string[] {
    return this.tabs
      .slice(0, this.visibleCount)
      .filter((t) => !t.disabled)
      .map((t) => t.id);
  }

  private focusId(id: string): void {
    this.tabButtonMap.get(id)?.focus();
  }

  private moveFocus(fromId: string, direction: 1 | -1): void {
    const enabled = this.getVisibleEnabledIds();
    if (!enabled.length) return;
    const pos = enabled.indexOf(fromId);
    if (pos === -1) return;
    const next =
      enabled[(pos + direction + enabled.length) % enabled.length]!;
    this.focusId(next);
  }

  private focusFirst(): void {
    const enabled = this.getVisibleEnabledIds();
    if (enabled.length) this.focusId(enabled[0]!);
  }

  private focusLast(): void {
    const enabled = this.getVisibleEnabledIds();
    if (enabled.length) this.focusId(enabled[enabled.length - 1]!);
  }

  private onTabKeyDown(event: KeyboardEvent, item: RuntimeTab): void {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        this.moveFocus(item.id, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.moveFocus(item.id, -1);
        break;
      case "Home":
        event.preventDefault();
        this.focusFirst();
        break;
      case "End":
        event.preventDefault();
        this.focusLast();
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!item.disabled) this.selectTab(item.id, item.label, "visible");
        break;
      default:
        break;
    }
  }

  private ensureOverflowStyles(): void {
    if (!this.overflowStyleEl) {
      const style = document.createElement("style");
      style.setAttribute("data-ids", "ids-tabs-overflow-menu-styles");
      document.head.appendChild(style);
      this.overflowStyleEl = style;
    }
    // Always refresh so HMR / rebuild picks up state-token updates.
    this.overflowStyleEl.textContent = OVERFLOW_MENU_STYLES;
  }

  private setOverflowHighlight(menu: HTMLElement, index: number | null): void {
    this.highlightedOverflow = index ?? -1;
    Array.from(menu.querySelectorAll(".ids-tabs-overflow-item")).forEach(
      (el, i) => {
        const btn = el as HTMLElement;
        if (index != null && i === index && !(btn as HTMLButtonElement).disabled) {
          btn.dataset.highlighted = "true";
        } else {
          delete btn.dataset.highlighted;
        }
      },
    );
  }

  private openOverflow(): void {
    const trigger = this.moreTriggerRef.value;
    if (!trigger) return;
    this.ensureOverflowStyles();
    const rect = trigger.getBoundingClientRect();
    this.highlightedOverflow = -1;
    this.overflowOpen = true;

    const menu = document.createElement("ul");
    menu.className = "ids-tabs-overflow-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("data-ids", "ids-tabs-overflow-menu");
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.left = `${Math.max(4, rect.right - 160)}px`;

    const hidden = this.tabs.slice(this.visibleCount);
    hidden.forEach((tab, index) => {
      const li = document.createElement("li");
      li.setAttribute("role", "none");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "menuitem");
      btn.className = "ids-tabs-overflow-item";
      btn.disabled = Boolean(tab.disabled);
      btn.textContent = tab.label;
      btn.addEventListener("mouseenter", () => {
        this.setOverflowHighlight(menu, index);
      });
      btn.addEventListener("focus", () => {
        this.setOverflowHighlight(menu, index);
      });
      btn.addEventListener("click", () => {
        if (tab.disabled) return;
        this.selectTab(tab.id, tab.label, "overflow");
      });
      li.appendChild(btn);
      menu.appendChild(li);
    });

    menu.addEventListener("mouseleave", () => {
      this.setOverflowHighlight(menu, null);
    });

    this.overflowMenuEl?.remove();
    this.overflowMenuEl = menu;
    document.body.appendChild(menu);
    this.bindDocListeners();
  }

  private closeOverflow(): void {
    this.overflowOpen = false;
    this.overflowMenuEl?.remove();
    this.overflowMenuEl = null;
    this.teardownDocListeners();
  }

  private bindDocListeners(): void {
    if (this.docListenersBound) return;
    document.addEventListener("mousedown", this.onDocMouseDown);
    document.addEventListener("keydown", this.onDocKeyDown);
    this.docListenersBound = true;
  }

  private teardownDocListeners(): void {
    if (!this.docListenersBound) return;
    document.removeEventListener("mousedown", this.onDocMouseDown);
    document.removeEventListener("keydown", this.onDocKeyDown);
    this.docListenersBound = false;
  }

  private onDocMouseDown = (event: MouseEvent): void => {
    const t = event.target as Node;
    if (this.moreTriggerRef.value?.contains(t)) return;
    if (this.overflowMenuEl?.contains(t)) return;
    this.closeOverflow();
  };

  private onDocKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") this.closeOverflow();
  };

  private toggleOverflow(): void {
    if (this.overflowOpen) this.closeOverflow();
    else this.openOverflow();
  }

  private renderMeasureRow(type: IdsTabsType) {
    const typeClass =
      type === "primary"
        ? "ids-tab-button--primary"
        : "ids-tab-button--secondary";
    const moreTypeClass =
      type === "primary"
        ? "ids-tabs-overflow-trigger--primary"
        : "ids-tabs-overflow-trigger--secondary";
    return html`
      <div
        class="ids-tabs-measure"
        ${ref(this.measureRef)}
        aria-hidden="true"
      >
        ${this.tabs.map(
          (item) => html`
            <span
              data-measure-tab
              class=${classMap({
                "ids-tab-button": true,
                [typeClass]: true,
                "ids-tab-button--has-close": Boolean(item.closable),
              })}
            >
              <span class="ids-tab-button-inner">
                ${item.iconSlug
                  ? html`<span class="ids-tab-button-icon"></span>`
                  : nothing}
                <span class="ids-tab-button-label">${item.label}</span>
                ${item.badgeCount != null && item.badgeCount > 0
                  ? html`<ids-badge
                      .value=${item.badgeCount}
                      type=${item.hasAlert ? "critical" : "default"}
                    ></ids-badge>`
                  : nothing}
                ${item.hasAlert &&
                !(item.badgeCount != null && item.badgeCount > 0)
                  ? html`<span class="ids-tab-button-icon"></span>`
                  : nothing}
              </span>
              ${item.closable
                ? html`<span style="width:24px;height:24px"></span>`
                : nothing}
            </span>
          `,
        )}
        <button
          type="button"
          ${ref(this.moreMeasureRef)}
          class=${classMap({
            "ids-tabs-overflow-trigger": true,
            [moreTypeClass]: true,
          })}
          tabindex="-1"
        >
          ${this.moreLabel}
          <span class="ids-tabs-overflow-icon"></span>
        </button>
        ${this.allowAddTab
          ? html`
              <button
                type="button"
                ${ref(this.addMeasureRef)}
                class=${classMap({
                  "ids-tabs-add": true,
                  "ids-tabs-add--primary": type === "primary",
                })}
                tabindex="-1"
              >
                <span class="ids-tabs-add-icon"></span>
                <span class="ids-tabs-add-label">${this.addTabLabel}</span>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private renderTabButton(item: RuntimeTab, type: IdsTabsType) {
    const selected = this.resolvedActiveId === item.id;
    const typeClass =
      type === "primary"
        ? "ids-tab-button--primary"
        : "ids-tab-button--secondary";

    return html`
      <button
        type="button"
        role="tab"
        id=${`${this.uid}-tab-${item.id}`}
        aria-controls=${`${this.uid}-panel-${item.id}`}
        aria-selected=${selected ? "true" : "false"}
        ?disabled=${Boolean(item.disabled)}
        data-ids="ids-tab-button"
        class=${classMap({
          "ids-tab-button": true,
          [typeClass]: true,
          "ids-tab-button--has-close": Boolean(item.closable),
        })}
        ${ref((el: Element | undefined) =>
          this.registerTabButton(
            item.id,
            (el as HTMLButtonElement | undefined) ?? null,
          ),
        )}
        @click=${() => {
          if (!item.disabled) this.selectTab(item.id, item.label, "visible");
        }}
        @keydown=${(e: KeyboardEvent) => this.onTabKeyDown(e, item)}
      >
        <span class="ids-tab-button-inner">
          ${item.iconSlug
            ? html`
                <span class="ids-tab-button-icon">
                  <ids-icon
                    shape=${item.iconSlug}
                    size="16"
                    color="currentColor"
                  ></ids-icon>
                </span>
              `
            : nothing}
          <span class="ids-tab-button-label">${item.label}</span>
          ${item.badgeCount != null && item.badgeCount > 0
            ? html`<ids-badge
                .value=${item.badgeCount}
                type=${item.hasAlert ? "critical" : "default"}
              ></ids-badge>`
            : nothing}
          ${item.hasAlert && !(item.badgeCount != null && item.badgeCount > 0)
            ? html`
                <span class="ids-tab-button-icon">
                  <ids-icon
                    shape=${TAB_ALERT_ICON_SLUG}
                    size="16"
                    variant="img"
                  ></ids-icon>
                </span>
              `
            : nothing}
        </span>
        ${item.closable
          ? html`
              <button
                type="button"
                class="ids-tab-button-close"
                data-ids="ids-tab-button-close"
                aria-label=${`Close ${item.label}`}
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this.closeTab(item.id);
                }}
              >
                <ids-icon
                  shape=${TAB_CLOSE_ICON_SLUG}
                  size="16"
                  color="var(--color-icon-gray-neutral-base)"
                ></ids-icon>
              </button>
            `
          : nothing}
      </button>
    `;
  }

  override render() {
    const type = this.resolvedType;
    const surface = this.resolvedSurface;
    const tabs = this.tabs;
    const visibleTabs = tabs.slice(0, this.visibleCount);
    const hiddenTabs =
      this.overflow && this.visibleCount < tabs.length
        ? tabs.slice(this.visibleCount)
        : [];
    const activeTab = tabs.find((t) => t.id === this.resolvedActiveId) ?? tabs[0];
    const overflowSelected = this.overflowLabel != null;
    const moreTypeClass =
      type === "primary"
        ? "ids-tabs-overflow-trigger--primary"
        : "ids-tabs-overflow-trigger--secondary";

    return html`
      <div
        class="ids-tabs"
        data-ids="ids-tabs"
        data-type=${type}
        data-surface=${surface}
        data-overflow=${this.overflow ? "true" : "false"}
      >
        ${this.renderMeasureRow(type)}

        <div class="ids-tabs-list-wrap">
          <div
            ${ref(this.listRef)}
            class="ids-tabs-list"
            role="tablist"
            aria-label="Tabs"
            data-ids="ids-tabs-list"
          >
            ${repeat(
              visibleTabs,
              (item) => item.id,
              (item) => this.renderTabButton(item, type),
            )}

            ${hiddenTabs.length > 0
              ? html`
                  <button
                    ${ref(this.moreTriggerRef)}
                    type="button"
                    class=${classMap({
                      "ids-tabs-overflow-trigger": true,
                      [moreTypeClass]: true,
                    })}
                    data-ids="ids-tabs-overflow-trigger"
                    data-selected=${overflowSelected ? "true" : "false"}
                    aria-label="More tabs"
                    aria-expanded=${this.overflowOpen ? "true" : "false"}
                    aria-haspopup="menu"
                    @click=${() => this.toggleOverflow()}
                  >
                    ${this.overflowLabel ?? this.moreLabel}
                    <ids-icon
                      shape=${TAB_OVERFLOW_MORE_ICON_SLUG}
                      size=${String(TAB_OVERFLOW_MORE_ICON_SIZE_PX)}
                      class="ids-tabs-overflow-icon"
                      color="currentColor"
                    ></ids-icon>
                  </button>
                `
              : nothing}

            ${this.allowAddTab
              ? html`
                  <button
                    type="button"
                    class=${classMap({
                      "ids-tabs-add": true,
                      "ids-tabs-add--primary": type === "primary",
                    })}
                    data-ids="ids-tabs-add"
                    aria-label=${this.addTabLabel}
                    @click=${this.onAddTab}
                  >
                    <ids-icon
                      shape=${TAB_ADD_ICON_SLUG}
                      size="16"
                      class="ids-tabs-add-icon"
                      color="currentColor"
                    ></ids-icon>
                    <span class="ids-tabs-add-label">${this.addTabLabel}</span>
                  </button>
                `
              : nothing}
          </div>
        </div>

        ${activeTab
          ? html`
              <div
                id=${`${this.uid}-panel-${activeTab.id}`}
                role="tabpanel"
                aria-labelledby=${`${this.uid}-tab-${activeTab.id}`}
                class="ids-tab-content"
                data-ids="ids-tab-content"
              >
                ${this.renderPanelBody(activeTab)}
              </div>
            `
          : nothing}
      </div>

      <div class="ids-tabs-carriers" aria-hidden="true">
        <slot @slotchange=${() => this.collectFromChildren()}></slot>
      </div>
    `;
  }
}
