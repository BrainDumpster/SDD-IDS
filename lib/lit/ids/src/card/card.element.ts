/**
 * IdsCard — Lit web component.
 *
 * Tag: `ids-card`
 * Spec: `components/ids/card/design-spec.md`
 * API: `lib/react/ids/card` / Angular `lib/angular/ids/card`
 *
 * Anatomy:
 *   Card (host)
 *     CardHeader
 *       CardTitleCluster (title ± | ± secondary)
 *       headerMeta?
 *       CardAdditionalFilter? (slot)
 *       CardFilter? → portaled DropdownMenu (per-card menuOptions)
 *     CardBody (default slot)
 *     CardFooter? (actions[] or footer slot)
 *
 * Slots:
 *   (default)           — CardBody content
 *   header              — full custom header replace
 *   secondary-title     — optional projected secondary
 *   header-meta         — optional rich meta before kebab
 *   additional-filter   — CardAdditionalFilter
 *   footer              — custom footer when actions unset
 *
 * Events:
 *   option-selected — { value: string }
 *   action-click    — { action: IdsCardAction }
 */
import { LitElement, html, nothing, render } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import "../button/register.js";
import "../icon/register.js";
import {
  firstEnabledIndex,
  nextEnabledIndex,
  resolveBoolean,
  resolveSize,
  type IdsCardAction,
  type IdsCardMenuOption,
  type IdsCardSize,
} from "./card.constants.js";
import { cardMenuPortalStyles, cardStyles } from "./card.styles.js";

let cardUid = 0;

export class IdsCard extends LitElement {
  static override styles = [cardStyles];

  /**
   * Primary title (React/Angular `title`). Attribute is `card-title` so the
   * native HTML `title` tooltip is not engaged before/after upgrade.
   */
  @property({ type: String, attribute: "card-title", reflect: true })
  title = "";

  /**
   * Secondary title shown inline after `|` (Dashboard-Element-Card Body 1 /
   * `var(--color-text-gray-neutral)`). Prefer string; or slot `secondary-title`.
   */
  @property({ type: String, attribute: "secondarytitle" })
  secondaryTitle = "";

  /** Optional trailing meta before kebab (e.g. “Last 24 Hours”). */
  @property({ type: String, attribute: "headermeta" })
  headerMeta = "";

  @property({ type: Boolean, attribute: "showbuttons", reflect: true })
  showButtons = false;

  @property({ type: Boolean, attribute: "showoverflowmenu", reflect: true })
  showOverflowMenu = false;

  /** @deprecated Alias of `showOverflowMenu` (property-only). */
  @property({ type: Boolean, attribute: false })
  set showOverFlowMenu(value: boolean) {
    this.showOverflowMenu = Boolean(value);
  }
  get showOverFlowMenu(): boolean {
    return this.showOverflowMenu;
  }

  /**
   * When `true` (default), CardBody shows header‖body `border-top` and, if a
   * footer is present, body‖footer `border-bottom`. Bind via property for false:
   * `.showDivider=${false}` (Lit Boolean attribute presence = true).
   */
  @property({ type: Boolean, attribute: "showdivider" })
  showDivider = true;

  /** Column span inside Dashboard’s 3-column grid. */
  @property({ type: String, reflect: true })
  size: IdsCardSize | string = "span-1";

  /** Per-card Dropdown options (property only). */
  @property({ attribute: false })
  menuOptions: IdsCardMenuOption[] = [];

  /** Footer action descriptors (property only). Prefer over footer slot. */
  @property({ attribute: false })
  actions: IdsCardAction[] = [];

  /** Demo-only — not in Figma Card-Main; ignored. */
  @property({ type: Boolean })
  elevated = false;

  /** Demo-only — not in Figma Card-Main; ignored. */
  @property({ type: Boolean })
  outlined = false;

  @state() private menuOpen = false;
  @state() private menuCoords: { top: number; left: number } | null = null;
  @state() private menuMaxHeight = 280;
  @state() private highlighted = 0;
  @state() private hasProjectedHeader = false;
  @state() private hasProjectedSecondary = false;
  @state() private hasProjectedMeta = false;
  @state() private hasProjectedFilter = false;
  @state() private hasProjectedFooter = false;

  @query('[data-ids="ids-card-filter"]')
  private triggerEl!: HTMLButtonElement | null;

  private readonly titleId = `ids-card-title-${++cardUid}`;
  private readonly secondaryId = `ids-card-secondary-${cardUid}`;
  private readonly menuId = `ids-card-menu-${cardUid}`;

  private portalEl: HTMLDivElement | null = null;
  private popupEl: HTMLUListElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private menuStylesAdopted = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-card");
    this.setAttribute("role", "group");
  }

  override disconnectedCallback(): void {
    this.teardownMenuListeners();
    this.destroyPortal();
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    const size = resolveSize(this.size);
    this.setAttribute("data-card-size", size);
    if (this.hasTitle) {
      this.setAttribute("aria-labelledby", this.titleId);
    } else {
      this.removeAttribute("aria-labelledby");
    }
    if (this.hasSecondary) {
      this.setAttribute("aria-describedby", this.secondaryId);
    } else {
      this.removeAttribute("aria-describedby");
    }
    this.syncMenuPortal();
  }

  private get hasTitle(): boolean {
    return this.title != null && String(this.title).length > 0;
  }

  private get hasSecondary(): boolean {
    return (
      this.hasProjectedSecondary ||
      (this.secondaryTitle != null && String(this.secondaryTitle).length > 0)
    );
  }

  private get overflowOn(): boolean {
    return resolveBoolean(this.showOverflowMenu, false);
  }

  private get dividerOn(): boolean {
    return resolveBoolean(this.showDivider, true);
  }

  private get buttonsOn(): boolean {
    return resolveBoolean(this.showButtons, false);
  }

  private get showMenu(): boolean {
    return (
      this.overflowOn &&
      Array.isArray(this.menuOptions) &&
      this.menuOptions.length > 0
    );
  }

  private get hasFooter(): boolean {
    return (
      this.buttonsOn &&
      ((Array.isArray(this.actions) && this.actions.length > 0) ||
        this.hasProjectedFooter)
    );
  }

  private get hasHeader(): boolean {
    return (
      this.hasProjectedHeader ||
      this.hasTitle ||
      this.hasSecondary ||
      this.showMenu ||
      this.hasProjectedFilter ||
      this.hasProjectedMeta ||
      (this.headerMeta != null && String(this.headerMeta).length > 0)
    );
  }

  private get hasTrailing(): boolean {
    return (
      this.showMenu ||
      this.hasProjectedFilter ||
      this.hasProjectedMeta ||
      (this.headerMeta != null && String(this.headerMeta).length > 0)
    );
  }

  private slotHasContent(slot: HTMLSlotElement): boolean {
    return slot.assignedNodes({ flatten: true }).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      return (n.textContent ?? "").trim().length > 0;
    });
  }

  private onHeaderSlotChange = (event: Event): void => {
    this.hasProjectedHeader = this.slotHasContent(event.target as HTMLSlotElement);
  };

  private onSecondarySlotChange = (event: Event): void => {
    this.hasProjectedSecondary = this.slotHasContent(
      event.target as HTMLSlotElement,
    );
  };

  private onMetaSlotChange = (event: Event): void => {
    this.hasProjectedMeta = this.slotHasContent(event.target as HTMLSlotElement);
  };

  private onFilterSlotChange = (event: Event): void => {
    this.hasProjectedFilter = this.slotHasContent(
      event.target as HTMLSlotElement,
    );
  };

  private onFooterSlotChange = (event: Event): void => {
    this.hasProjectedFooter = this.slotHasContent(
      event.target as HTMLSlotElement,
    );
  };

  private emitOptionSelected(value: string): void {
    this.dispatchEvent(
      new CustomEvent("option-selected", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitActionClick(action: IdsCardAction): void {
    action.onClick?.();
    this.dispatchEvent(
      new CustomEvent("action-click", {
        detail: { action },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private recomputeMaxHeight(): void {
    const header = this.renderRoot.querySelector<HTMLElement>(
      "[data-card-header]",
    );
    const footer = this.renderRoot.querySelector<HTMLElement>(
      "[data-card-footer]",
    );
    const headerH = header?.offsetHeight ?? 0;
    const footerH = footer?.offsetHeight ?? 0;
    const next = this.clientHeight - headerH - footerH - 12;
    this.menuMaxHeight = Math.max(96, next);
  }

  private positionPopup(): void {
    const trigger = this.triggerEl;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const popupWidth = Math.max(186, this.popupEl?.offsetWidth ?? 186);
    const left = Math.min(
      Math.max(4, rect.right - popupWidth),
      window.innerWidth - popupWidth - 4,
    );
    this.menuCoords = { top: rect.bottom + 4, left };
  }

  private openMenu(): void {
    this.recomputeMaxHeight();
    const trigger = this.triggerEl;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      const left = Math.min(
        Math.max(4, rect.right - 186),
        window.innerWidth - 186 - 4,
      );
      this.menuCoords = { top: rect.bottom + 4, left };
    }
    this.highlighted = firstEnabledIndex(this.menuOptions);
    this.menuOpen = true;
    this.setupMenuListeners();
  }

  private closeMenu(restoreFocus = true): void {
    this.menuOpen = false;
    this.menuCoords = null;
    this.teardownMenuListeners();
    this.destroyPortal();
    if (restoreFocus) this.triggerEl?.focus();
  }

  private setupMenuListeners(): void {
    window.addEventListener("resize", this.onWindowReposition);
    window.addEventListener("scroll", this.onWindowReposition, true);
    document.addEventListener("mousedown", this.onDocumentPointerDown);
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(this.onWindowReposition);
    this.resizeObserver.observe(this);
  }

  private teardownMenuListeners(): void {
    window.removeEventListener("resize", this.onWindowReposition);
    window.removeEventListener("scroll", this.onWindowReposition, true);
    document.removeEventListener("mousedown", this.onDocumentPointerDown);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private onWindowReposition = (): void => {
    if (!this.menuOpen) return;
    this.recomputeMaxHeight();
    this.positionPopup();
    this.syncMenuPortal();
  };

  private onDocumentPointerDown = (event: MouseEvent): void => {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.triggerEl?.contains(target)) return;
    if (this.popupEl?.contains(target)) return;
    if (this.portalEl?.contains(target)) return;
    this.closeMenu(false);
  };

  private ensurePortal(): HTMLDivElement {
    if (!this.portalEl) {
      this.portalEl = document.createElement("div");
      this.portalEl.setAttribute("data-ids", "ids-card-filter-menu-portal");
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
    this.popupEl = null;
  }

  private adoptMenuStyles(doc: Document): void {
    if (this.menuStylesAdopted) return;
    const sheet = cardMenuPortalStyles.styleSheet;
    if (sheet && "adoptedStyleSheets" in doc) {
      try {
        if (!doc.adoptedStyleSheets.includes(sheet)) {
          doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
        }
        this.menuStylesAdopted = true;
        return;
      } catch {
        /* fall through to inline style */
      }
    }
  }

  private syncMenuPortal(): void {
    if (!this.menuOpen || this.menuCoords == null || !this.showMenu) {
      this.destroyPortal();
      return;
    }
    const host = this.ensurePortal();
    this.adoptMenuStyles(host.ownerDocument);
    const { top, left } = this.menuCoords;
    const needInlineStyle = !this.menuStylesAdopted;

    render(
      html`
        ${needInlineStyle
          ? html`<style>
              ${cardMenuPortalStyles.cssText}
            </style>`
          : nothing}
        <ul
          id=${this.menuId}
          role="menu"
          tabindex="-1"
          class="ids-card-menu-popup"
          data-ids="ids-card-filter-menu"
          style=${styleMap({
            position: "fixed",
            top: `${top}px`,
            left: `${left}px`,
            maxHeight: `${this.menuMaxHeight}px`,
          })}
          @keydown=${this.onPopupKeyDown}
        >
          ${this.menuOptions.map(
            (opt, index) => html`
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  tabindex=${this.highlighted === index ? 0 : -1}
                  ?disabled=${Boolean(opt.disabled)}
                  data-highlighted=${this.highlighted === index
                    ? "true"
                    : nothing}
                  class="ids-card-menu-item"
                  @mouseenter=${() => {
                    if (!opt.disabled) {
                      this.highlighted = index;
                      this.syncMenuPortal();
                    }
                  }}
                  @click=${() => this.selectOption(opt)}
                >
                  <span class="ids-card-menu-item-label">${opt.label}</span>
                </button>
              </li>
            `,
          )}
        </ul>
      `,
      host,
    );

    this.popupEl = host.querySelector<HTMLUListElement>(".ids-card-menu-popup");
    requestAnimationFrame(() => {
      this.popupEl
        ?.querySelectorAll<HTMLElement>("[role='menuitem']")
        [this.highlighted]?.focus();
    });
  }

  private selectOption(opt: IdsCardMenuOption): void {
    if (opt.disabled) return;
    this.emitOptionSelected(opt.value);
    this.closeMenu(true);
  }

  private onTriggerClick = (): void => {
    if (this.menuOpen) this.closeMenu(false);
    else this.openMenu();
  };

  private onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      if (!this.menuOpen) this.openMenu();
    }
  };

  private onPopupKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      this.closeMenu(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.highlighted = nextEnabledIndex(
        this.menuOptions,
        this.highlighted,
        1,
      );
      this.syncMenuPortal();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.highlighted = nextEnabledIndex(
        this.menuOptions,
        this.highlighted,
        -1,
      );
      this.syncMenuPortal();
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      this.highlighted = firstEnabledIndex(this.menuOptions);
      this.syncMenuPortal();
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      this.highlighted = nextEnabledIndex(
        this.menuOptions,
        this.menuOptions.length,
        -1,
      );
      this.syncMenuPortal();
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const opt = this.menuOptions[this.highlighted];
      if (opt) this.selectOption(opt);
    }
  };

  private renderTitleCluster() {
    if (this.hasProjectedHeader) {
      return html`<slot
        name="header"
        @slotchange=${this.onHeaderSlotChange}
      ></slot>`;
    }

    if (this.hasSecondary) {
      return html`
        <div class="ids-card-title-row">
          ${this.hasTitle
            ? html`<h3 id=${this.titleId} class="ids-card-title-inline">
                ${this.title}
              </h3>`
            : nothing}
          ${this.hasTitle
            ? html`<span class="ids-card-title-divider" aria-hidden="true"
                >|</span
              >`
            : nothing}
          <div id=${this.secondaryId}>
            <slot
              name="secondary-title"
              @slotchange=${this.onSecondarySlotChange}
            ></slot>
            ${!this.hasProjectedSecondary && this.secondaryTitle
              ? html`<span
                  class="ids-card-secondary-title"
                  data-ids="ids-card-secondary-title"
                  >${this.secondaryTitle}</span
                >`
              : nothing}
          </div>
        </div>
        <slot
          name="header"
          @slotchange=${this.onHeaderSlotChange}
          hidden
        ></slot>
      `;
    }

    return html`
      ${this.hasTitle
        ? html`<h3 id=${this.titleId} class="ids-card-title">${this.title}</h3>`
        : nothing}
      <slot
        name="header"
        @slotchange=${this.onHeaderSlotChange}
        hidden
      ></slot>
      <slot
        name="secondary-title"
        @slotchange=${this.onSecondarySlotChange}
        hidden
      ></slot>
    `;
  }

  private renderTrailing() {
    const metaText =
      !this.hasProjectedMeta &&
      this.headerMeta != null &&
      String(this.headerMeta).length > 0
        ? html`<span class="ids-card-header-meta">${this.headerMeta}</span>`
        : nothing;

    if (!this.hasTrailing) {
      return html`
        <slot
          name="header-meta"
          @slotchange=${this.onMetaSlotChange}
          hidden
        ></slot>
        <slot
          name="additional-filter"
          @slotchange=${this.onFilterSlotChange}
          hidden
        ></slot>
      `;
    }

    return html`
      <div class="ids-card-header-trailing">
        <slot
          name="header-meta"
          @slotchange=${this.onMetaSlotChange}
        ></slot>
        ${metaText}
        <slot
          name="additional-filter"
          @slotchange=${this.onFilterSlotChange}
        ></slot>
        ${this.showMenu
          ? html`
              <button
                type="button"
                class="ids-card-kebab-trigger"
                aria-label=${this.hasTitle
                  ? `Options for ${this.title}`
                  : "Card options"}
                aria-haspopup="menu"
                aria-expanded=${this.menuOpen ? "true" : "false"}
                aria-controls=${this.menuOpen ? this.menuId : nothing}
                data-ids="ids-card-filter"
                @click=${this.onTriggerClick}
                @keydown=${this.onTriggerKeyDown}
              >
                <ids-icon
                  class="ids-card-kebab-icon"
                  shape="overflow-menu-dots"
                  size="16"
                  color="var(--color-icon-brand-base)"
                ></ids-icon>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private renderFooter() {
    const useActions =
      Array.isArray(this.actions) && this.actions.length > 0;

    if (!this.hasFooter) {
      return html`<slot
        name="footer"
        @slotchange=${this.onFooterSlotChange}
        hidden
      ></slot>`;
    }

    return html`
      <div
        class="ids-card-footer"
        data-card-footer
        data-ids="ids-card-footer"
      >
        ${useActions
          ? this.actions.map(
              (action) => html`
                <ids-button
                  type="button"
                  variant="tertiary"
                  size="small"
                  ?disabled=${Boolean(action.disabled)}
                  class="ids-card-footer-action"
                  data-ids="ids-card-action"
                  @ids-button-click=${() => this.emitActionClick(action)}
                  >${action.label}</ids-button
                >
              `,
            )
          : html`<slot
              name="footer"
              @slotchange=${this.onFooterSlotChange}
            ></slot>`}
      </div>
      ${useActions
        ? html`<slot
            name="footer"
            @slotchange=${this.onFooterSlotChange}
            hidden
          ></slot>`
        : nothing}
    `;
  }

  override render() {
    const dividerOn = this.dividerOn;
    const hasFooter = this.hasFooter;
    const bodyClasses = {
      "ids-card-body": true,
      "ids-card-body--no-divider": !dividerOn,
      "ids-card-body--with-footer": dividerOn && hasFooter,
    };

    return html`
      ${this.hasHeader
        ? html`
            <div
              class="ids-card-header"
              data-card-header
              data-ids="ids-card-header"
              data-has-overflow-menu=${this.showMenu ? "true" : "false"}
            >
              <div class="ids-card-header-row">
                <div class="ids-card-title-cluster">
                  ${this.renderTitleCluster()}
                </div>
                ${this.renderTrailing()}
              </div>
            </div>
          `
        : html`
            <slot
              name="header"
              @slotchange=${this.onHeaderSlotChange}
              hidden
            ></slot>
            <slot
              name="secondary-title"
              @slotchange=${this.onSecondarySlotChange}
              hidden
            ></slot>
            <slot
              name="header-meta"
              @slotchange=${this.onMetaSlotChange}
              hidden
            ></slot>
            <slot
              name="additional-filter"
              @slotchange=${this.onFilterSlotChange}
              hidden
            ></slot>
          `}

      <div
        class=${classMap(bodyClasses)}
        data-card-show-divider=${dividerOn ? "true" : "false"}
        data-ids="ids-card-body"
      >
        <slot></slot>
      </div>

      ${this.renderFooter()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-card": IdsCard;
  }
}
