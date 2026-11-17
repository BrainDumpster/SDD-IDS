/**
 * IdsAppLauncher — Lit web component.
 *
 * Tag: `ids-app-launcher`
 * Spec: `components/ids/app-launcher/design-spec.md`
 * API:  `lib/react/ids/app-launcher` (`IdsAppLauncher`)
 *
 * Anatomy (prop-driven tree — root is AppLauncher, not AppLauncherRoot):
 *   IdsAppLauncher
 *     Trigger → Surface (portal) → ProductRegion → ProductRowGroup[] → …
 *     OptionsRegion? → OptionRow[] → FooterAction?
 *
 * Events (bubbles, composed):
 *   ids-open-change     { open: boolean }
 *   ids-product-select  { id: string; name: string }
 *   ids-option-select   { id: string; label: string }
 *   ids-footer-action   { label: string }
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, MCP 2026-11-10):
 *   usage `42266:95081`; 4p `13231:123908`; 2p `13231:124200`; tile `13231:109520`
 */
import { LitElement, html, nothing, render, type TemplateResult } from "lit";
import { property, state, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import "../icon/register.js";
import "../tooltip/register.js";
import {
  APP_LAUNCHER_DEFAULT_PRODUCT_ICON,
  APP_LAUNCHER_LABEL_LINE_HEIGHT,
  APP_LAUNCHER_TRIGGER_ICON,
  APP_LAUNCHER_VIEWPORT_MARGIN,
  isTextOnlyProduct,
  packProductRows,
  productKey,
  productReflowKey,
  productToOption,
  resolveColumns,
  resolveItemIconSlug,
  resolveOptionIconSlug,
  resolveProductIconSlug,
  resolveProgramme,
  resolveTriggerVariant,
  type IdsAppLauncherFooterActionModel,
  type IdsAppLauncherOption,
  type IdsAppLauncherOptionDataState,
  type IdsAppLauncherProduct,
  type IdsAppLauncherProgramme,
  type IdsAppLauncherTileDataState,
  type IdsAppLauncherTriggerVariant,
} from "./app-launcher.constants.js";
import {
  appLauncherHostStyles,
  appLauncherSurfaceStyles,
} from "./app-launcher.styles.js";

let launcherUid = 0;

const adoptedDocuments = new WeakSet<Document>();

function adoptPortalStyles(doc: Document): boolean {
  if (adoptedDocuments.has(doc)) return true;
  const sheet = appLauncherSurfaceStyles.styleSheet;
  if (sheet && "adoptedStyleSheets" in doc) {
    try {
      if (!doc.adoptedStyleSheets.includes(sheet)) {
        doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
      }
      adoptedDocuments.add(doc);
      return true;
    } catch {
      /* fall through */
    }
  }
  return false;
}

export class IdsAppLauncher extends LitElement {
  static override styles = [appLauncherHostStyles, appLauncherSurfaceStyles];

  /** Unknown → `ids`. Synapse chrome via `data-programme` on the surface. */
  @property({ type: String, reflect: true })
  programme: IdsAppLauncherProgramme | string = "ids";

  /** Product tiles — property only. Wins over `apps`. */
  @property({ attribute: false })
  products: IdsAppLauncherProduct[] = [];

  /** @deprecated Use `products`. Ignored when `products` is supplied. */
  @property({ attribute: false })
  apps: IdsAppLauncherProduct[] = [];

  /** Lower options list — property only. */
  @property({ attribute: false })
  options: IdsAppLauncherOption[] = [];

  /** Optional footer CTA — property only. Fires `ids-footer-action`. */
  @property({ attribute: false })
  footerAction: IdsAppLauncherFooterActionModel | null = null;

  /** Unknown / invalid → `2`. */
  @property({ type: Number })
  columns = 2;

  @property({ type: String, attribute: "triggervariant", reflect: true })
  triggerVariant: IdsAppLauncherTriggerVariant | string = "default";

  /**
   * Default `8` for the default trigger; `1` for masthead when omitted
   * (popup top border sits below the masthead's 1px bottom border).
   */
  @property({ type: Number, attribute: "sideoffset" })
  sideOffset: number | undefined = undefined;

  /** Controlled open. Omit for uncontrolled (`defaultOpen`). */
  @property({ type: Boolean })
  open: boolean | undefined = undefined;

  @property({ type: Boolean, attribute: "defaultopen" })
  defaultOpen = false;

  /**
   * Render surface only (no trigger, no portal). Spec/layout matrix stories.
   */
  @property({ type: Boolean, attribute: "panelonly", reflect: true })
  panelOnly = false;

  /**
   * Truncated option labels: `false` (default) → native `title`;
   * `true` → branded `ids-tooltip`.
   */
  @property({ type: Boolean, attribute: "useidsoptiontooltip" })
  useIdsOptionTooltip = false;

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "App launcher";

  @state() private internalOpen = false;
  @state() private fullWidthKeys = new Set<string>();
  @state() private selectedOptionId: string | null = null;
  @state() private popupStyle: Record<string, string> = {};
  @state() private truncatedOptionIds = new Set<string>();

  @query(".ids-app-launcher-trigger")
  private triggerEl!: HTMLButtonElement | null;

  private readonly uid = ++launcherUid;
  private openInitialised = false;
  private portalEl: HTMLDivElement | null = null;
  private portalNeedsInlineStyles = false;
  private ignoreOutsideCloseUntil = 0;
  private listenersBound = false;
  private readonly onDocPointerDown = (event: PointerEvent) =>
    this.handleDocumentPointerDown(event);
  private readonly onDocKeyDown = (event: KeyboardEvent) =>
    this.handleDocumentKeyDown(event);
  private readonly onWinResize = () => this.reposition();
  private readonly onWinScroll = () => this.reposition();

  private get resolvedProgramme(): IdsAppLauncherProgramme {
    return resolveProgramme(this.programme);
  }

  private get resolvedTriggerVariant(): IdsAppLauncherTriggerVariant {
    return resolveTriggerVariant(this.triggerVariant);
  }

  private get resolvedColumns(): number {
    return resolveColumns(this.columns);
  }

  private get list(): IdsAppLauncherProduct[] {
    return this.products?.length ? this.products : (this.apps ?? []);
  }

  private get isOpenControlled(): boolean {
    return this.open !== undefined;
  }

  private get isOpen(): boolean {
    if (this.panelOnly) return true;
    return this.isOpenControlled ? Boolean(this.open) : this.internalOpen;
  }

  private get packed(): {
    rows: IdsAppLauncherProduct[][];
    overflow: IdsAppLauncherProduct[];
  } {
    return packProductRows(this.list, this.fullWidthKeys, this.resolvedColumns);
  }

  private get mergedOptions(): IdsAppLauncherOption[] {
    const overflow = this.packed.overflow.map(productToOption);
    return [...overflow, ...(this.options ?? [])];
  }

  private get showOptions(): boolean {
    return this.mergedOptions.length > 0 || this.footerAction != null;
  }

  private get useTwoProductInternalRail(): boolean {
    return this.list.length === 2 && !this.showOptions;
  }

  private get useSingleProductWidth(): boolean {
    return this.list.length === 1 && !this.showOptions;
  }

  private get popupId(): string {
    return this.id
      ? `${this.id}-surface`
      : `ids-app-launcher-${this.uid}-surface`;
  }

  private get resolvedSideOffset(): number {
    if (typeof this.sideOffset === "number" && Number.isFinite(this.sideOffset)) {
      return this.sideOffset;
    }
    return this.resolvedTriggerVariant === "masthead" ? 1 : 8;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-app-launcher");
    this.setAttribute("data-slot", "AppLauncher");
    if (!this.openInitialised) {
      this.internalOpen = this.panelOnly ? true : this.defaultOpen;
      this.openInitialised = true;
    }
    this.bindListeners();
  }

  override disconnectedCallback(): void {
    this.unbindListeners();
    this.destroyPortal();
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    this.setAttribute("data-programme", this.resolvedProgramme);
    if (this.panelOnly) {
      this.setAttribute("data-panel-only", "true");
    } else {
      this.removeAttribute("data-panel-only");
    }

    if (
      changed.has("products") ||
      changed.has("apps") ||
      changed.has("options") ||
      changed.has("columns")
    ) {
      this.measureFullWidthKeys();
    }

    if (this.panelOnly) {
      this.destroyPortal();
      // Option truncation for native title / ids-tooltip (panel-only stories).
      requestAnimationFrame(() => this.measureOptionTruncation(this.renderRoot));
      return;
    }

    if (this.isOpen) {
      this.ensurePortal();
      this.renderPortal();
      requestAnimationFrame(() => {
        this.reposition();
        requestAnimationFrame(() => this.reposition());
      });
    } else {
      this.destroyPortal();
    }
  }

  private emit<T extends Record<string, unknown>>(
    name: string,
    detail: T,
  ): void {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  private setOpenState(next: boolean): void {
    if (this.panelOnly) return;
    if (this.isOpen === next) return;
    if (!this.isOpenControlled) this.internalOpen = next;
    this.emit("ids-open-change", { open: next });
    this.requestUpdate();
  }

  private bindListeners(): void {
    if (this.listenersBound || typeof document === "undefined") return;
    document.addEventListener("pointerdown", this.onDocPointerDown, true);
    document.addEventListener("keydown", this.onDocKeyDown, true);
    window.addEventListener("resize", this.onWinResize);
    window.addEventListener("scroll", this.onWinScroll, true);
    this.listenersBound = true;
  }

  private unbindListeners(): void {
    if (!this.listenersBound || typeof document === "undefined") return;
    document.removeEventListener("pointerdown", this.onDocPointerDown, true);
    document.removeEventListener("keydown", this.onDocKeyDown, true);
    window.removeEventListener("resize", this.onWinResize);
    window.removeEventListener("scroll", this.onWinScroll, true);
    this.listenersBound = false;
  }

  private handleDocumentPointerDown(event: PointerEvent): void {
    if (!this.isOpen || this.panelOnly) return;
    if (
      typeof performance !== "undefined" &&
      performance.now() < this.ignoreOutsideCloseUntil
    ) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (this.triggerEl?.contains(target)) return;
    if (this.contains(target)) return;
    if (this.portalEl?.contains(target)) return;
    this.setOpenState(false);
  }

  private handleDocumentKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen || this.panelOnly) return;
    if (event.key === "Escape") {
      event.preventDefault();
      this.setOpenState(false);
      this.triggerEl?.focus();
    }
  }

  private measureFullWidthKeys(): void {
    const root = this.renderRoot;
    if (!(root instanceof ShadowRoot)) return;
    const next = new Set<string>();
    this.list.forEach((product, index) => {
      const key = productReflowKey(product, index);
      const el = root.querySelector<HTMLElement>(
        `[data-reflow-key="${CSS.escape(key)}"]`,
      );
      if (!el) return;
      const budget = isTextOnlyProduct(product) ? 3 : 1;
      const lines = Math.round(
        el.scrollHeight / APP_LAUNCHER_LABEL_LINE_HEIGHT,
      );
      if (lines > budget) next.add(key);
    });
    const changed =
      next.size !== this.fullWidthKeys.size ||
      ![...next].every((k) => this.fullWidthKeys.has(k));
    if (changed) this.fullWidthKeys = next;
  }

  private ensurePortal(): HTMLDivElement | null {
    if (typeof document === "undefined") return null;
    if (!this.portalEl) {
      this.portalEl = document.createElement("div");
      this.portalEl.setAttribute("data-ids", "ids-app-launcher-popup");
      this.portalEl.setAttribute("data-programme", this.resolvedProgramme);
      this.portalEl.className = "ids-app-launcher-popup";
      document.body.appendChild(this.portalEl);
      this.portalNeedsInlineStyles = !adoptPortalStyles(document);
    }
    return this.portalEl;
  }

  private destroyPortal(): void {
    if (!this.portalEl) return;
    render(nothing, this.portalEl);
    this.portalEl.remove();
    this.portalEl = null;
  }

  private renderPortal(): void {
    const root = this.ensurePortal();
    if (!root) return;
    render(
      html`
        ${this.portalNeedsInlineStyles
          ? html`<style>
              ${appLauncherSurfaceStyles.cssText}
            </style>`
          : nothing}
        <div
          class="ids-app-launcher-popup"
          data-ids="ids-app-launcher-popup"
          data-programme=${this.resolvedProgramme}
          style=${styleMap(this.popupStyle)}
        >
          ${this.renderSurface()}
        </div>
      `,
      root,
    );
    this.measureOptionTruncation(root);
  }

  private reposition(): void {
    if (!this.isOpen || this.panelOnly || !this.portalEl) return;
    const trigger = this.triggerEl;
    if (!trigger || typeof window === "undefined") return;
    const rect = trigger.getBoundingClientRect();
    const offset = this.resolvedSideOffset;
    const panelWidth = this.useSingleProductWidth ? 150 : 298;
    const margin = APP_LAUNCHER_VIEWPORT_MARGIN;
    // React Popover.Positioner align="end"
    let left = rect.right - panelWidth;
    left = Math.max(
      margin,
      Math.min(left, window.innerWidth - panelWidth - margin),
    );
    let top = rect.bottom + offset;
    const popup = this.portalEl.querySelector<HTMLElement>(
      ".ids-app-launcher-surface",
    );
    const height = popup?.offsetHeight ?? (this.useTwoProductInternalRail ? 127 : 254);
    if (top + height > window.innerHeight - margin) {
      top = Math.max(margin, rect.top - height - offset);
    }
    this.popupStyle = {
      position: "fixed",
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      zIndex: "10000",
      margin: "0",
      visibility: "visible",
    };
    if (this.portalEl) {
      const wrap = this.portalEl.querySelector<HTMLElement>(
        ".ids-app-launcher-popup",
      );
      if (wrap) {
        Object.assign(wrap.style, this.popupStyle);
      }
    }
  }

  private toggleOpen(): void {
    if (this.panelOnly) return;
    const next = !this.isOpen;
    if (next && typeof performance !== "undefined") {
      this.ignoreOutsideCloseUntil = performance.now() + 400;
    }
    this.setOpenState(next);
  }

  private onProductActivate(product: IdsAppLauncherProduct, index: number): void {
    const id = productKey(product, `product-${index}`);
    this.emit("ids-product-select", { id, name: product.name });
    this.setOpenState(false);
  }

  private onOptionActivate(option: IdsAppLauncherOption, index: number): void {
    const id =
      option.id && option.id.trim() ? option.id : `option-${index}`;
    this.selectedOptionId = id;
    this.emit("ids-option-select", { id, label: option.label });
  }

  private onFooterActivate(): void {
    if (!this.footerAction) return;
    this.emit("ids-footer-action", { label: this.footerAction.label });
  }

  private measureOptionTruncation(root: ParentNode): void {
    const next = new Set<string>();
    root
      .querySelectorAll<HTMLElement>("[data-option-label]")
      .forEach((el) => {
        const id = el.dataset.optionId;
        if (!id) return;
        if (el.scrollWidth > el.clientWidth + 1) next.add(id);
      });
    const changed =
      next.size !== this.truncatedOptionIds.size ||
      ![...next].every((k) => this.truncatedOptionIds.has(k));
    // @state update re-runs `updated` → `renderPortal` with tooltip/title wiring.
    if (changed) this.truncatedOptionIds = next;
  }

  private onPopupKeyDown(event: KeyboardEvent): void {
    if (
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) {
      return;
    }
    const popup = event.currentTarget as HTMLElement | null;
    if (!popup) return;
    const active = popup.ownerDocument.activeElement as HTMLElement | null;
    if (!active || !popup.contains(active)) return;

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusables = (node: Element | null): HTMLElement[] =>
      node
        ? Array.from(node.querySelectorAll<HTMLElement>(focusableSelector))
        : [];

    const productsSection = popup.querySelector<HTMLElement>(
      '[data-focus-section="products"]',
    );
    const optionsSection = popup.querySelector<HTMLElement>(
      '[data-focus-section="options"]',
    );
    const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const dir = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const focus = (el?: HTMLElement): void => {
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      el.focus();
    };

    if (productsSection?.contains(active)) {
      const rowEls = Array.from(
        productsSection.querySelectorAll<HTMLElement>(
          ".ids-app-launcher-product-row",
        ),
      );
      const rowIdx = rowEls.findIndex((row) => row.contains(active));
      if (rowIdx === -1) return;
      const rowTiles = getFocusables(rowEls[rowIdx]);
      const colIdx = rowTiles.indexOf(active);
      if (colIdx === -1) return;

      if (horizontal) {
        focus(rowTiles[colIdx + dir]);
        return;
      }

      const nextRow = rowEls[rowIdx + dir];
      if (nextRow) {
        const nextTiles = getFocusables(nextRow);
        focus(nextTiles[Math.min(colIdx, nextTiles.length - 1)]);
        return;
      }
      if (dir > 0) focus(getFocusables(optionsSection)[0]);
      return;
    }

    if (optionsSection?.contains(active)) {
      if (horizontal) return;
      const opts = getFocusables(optionsSection);
      const idx = opts.indexOf(active);
      if (idx === -1) return;
      const nextIdx = idx + dir;
      if (nextIdx >= 0 && nextIdx < opts.length) {
        focus(opts[nextIdx]);
        return;
      }
      if (dir < 0) {
        const tiles = getFocusables(productsSection);
        focus(tiles[tiles.length - 1]);
      }
    }
  }

  private onTriggerKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented || !this.isOpen) return;
    if (event.key === "Tab" && !event.shiftKey) {
      const first = this.portalEl?.querySelector<HTMLElement>(
        "button, a[href], [tabindex]:not([tabindex='-1'])",
      );
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  private renderTile(
    product: IdsAppLauncherProduct,
    rowIndex: number,
    cellIndex: number,
    productCount: number,
  ): TemplateResult {
    const key = productKey(product, `r${rowIndex}-c${cellIndex}`);
    const omitIcon = product.icon === null;
    const twoProduct = this.useTwoProductInternalRail;
    const showRail = twoProduct && cellIndex < 1;
    const showColumnDivider =
      cellIndex > 0 && productCount >= 3 && !twoProduct;
    const iconSlug = resolveItemIconSlug(product);
    const tileClasses = {
      "ids-app-launcher-product-tile": true,
      "ids-app-launcher-product-tile--two-product": twoProduct,
    };

    const inner = html`
      <div
        class=${classMap({
          "ids-app-launcher-label-cluster": true,
          "ids-app-launcher-label-cluster--no-icon": omitIcon,
        })}
        data-ids="ids-app-launcher-label-cluster"
        data-slot="LabelCluster"
      >
        ${omitIcon
          ? nothing
          : html`
              <div
                class="ids-app-launcher-product-icon"
                data-ids="ids-app-launcher-product-icon"
                data-slot="ProductIcon"
                aria-hidden="true"
              >
                <ids-icon
                  shape=${iconSlug}
                  size="32"
                  color="currentColor"
                ></ids-icon>
              </div>
            `}
        <span
          class="ids-app-launcher-product-label"
          data-ids="ids-app-launcher-product-label"
          data-slot="ProductLabel"
          >${product.name}</span
        >
      </div>
      ${showRail
        ? html`
            <span
              class="ids-app-launcher-tile-divider-rail ids-app-launcher-tile-divider-rail--dotted"
              data-ids="ids-app-launcher-tile-divider-rail"
              data-slot="TileDividerRail"
              data-variant="dotted"
              aria-hidden="true"
            ></span>
          `
        : nothing}
    `;

    const tile = product.href
      ? html`
          <a
            class=${classMap(tileClasses)}
            href=${product.href}
            target="_blank"
            rel="noopener noreferrer"
            data-ids="ids-app-launcher-product-tile"
            data-slot="ProductTile"
            @click=${() => this.onProductActivate(product, rowIndex * 10 + cellIndex)}
          >
            ${inner}
          </a>
        `
      : html`
          <button
            type="button"
            class=${classMap(tileClasses)}
            data-ids="ids-app-launcher-product-tile"
            data-slot="ProductTile"
            @click=${() => this.onProductActivate(product, rowIndex * 10 + cellIndex)}
          >
            ${inner}
          </button>
        `;

    return html`
      ${showColumnDivider
        ? html`
            <div
              class="ids-app-launcher-column-divider ids-app-launcher-column-divider--dotted"
              data-ids="ids-app-launcher-column-divider"
              data-slot="AppLauncherColumnDivider"
              data-variant="dotted"
              aria-hidden="true"
            ></div>
          `
        : nothing}
      ${tile}
    `;
  }

  private renderProductRegion(): TemplateResult | typeof nothing {
    const { rows } = this.packed;
    if (rows.length === 0) return nothing;
    const productCount = this.list.length;
    const cols = this.resolvedColumns;

    return html`
      <div
        class="ids-app-launcher-product-region"
        data-ids="ids-app-launcher-product-region"
        data-slot="ProductRegion"
        data-focus-section="products"
      >
        ${repeat(
          rows,
          (_row, rowIndex) => `row-${rowIndex}`,
          (row, rowIndex) => html`
            <div
              class="ids-app-launcher-product-row-group"
              data-ids="ids-app-launcher-product-row-group"
              data-slot="ProductRowGroup"
            >
              ${rowIndex > 0
                ? html`
                    <div
                      class="ids-app-launcher-row-divider"
                      data-ids="ids-app-launcher-row-divider"
                      data-slot="AppLauncherRowDivider"
                      aria-hidden="true"
                    ></div>
                  `
                : nothing}
              <div
                class=${classMap({
                  "ids-app-launcher-product-row": true,
                  "ids-app-launcher-product-row--single":
                    row.length === 1 && cols === 2,
                })}
                data-ids="ids-app-launcher-product-row"
                data-slot="ProductRow"
              >
                ${row.map((product, cellIndex) =>
                  this.renderTile(product, rowIndex, cellIndex, productCount),
                )}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  private renderOptionRow(
    option: IdsAppLauncherOption,
    index: number,
  ): TemplateResult {
    const id =
      option.id && option.id.trim() ? option.id : `option-${index}`;
    const selected = this.selectedOptionId === id;
    const truncated = this.truncatedOptionIds.has(id);
    const visual: IdsAppLauncherOptionDataState | undefined = selected
      ? "press"
      : undefined;

    const label = truncated && this.useIdsOptionTooltip
      ? html`
          <ids-tooltip
            side="right"
            arrowalign="start"
            hugcontent
            class="ids-app-launcher-option-label-trigger"
          >
            <ids-tooltip-trigger display="block">
              <span
                class="ids-app-launcher-option-label"
                data-option-label
                data-option-id=${id}
                >${option.label}</span
              >
            </ids-tooltip-trigger>
            <ids-tooltip-panel>
              <ids-tooltip-body>${option.label}</ids-tooltip-body>
            </ids-tooltip-panel>
          </ids-tooltip>
        `
      : html`
          <span
            class="ids-app-launcher-option-label"
            data-option-label
            data-option-id=${id}
            title=${ifDefined(truncated ? option.label : undefined)}
            >${option.label}</span
          >
        `;

    return html`
      <li>
        <button
          type="button"
          class="ids-app-launcher-option-row"
          data-ids="ids-app-launcher-option-row"
          data-slot="OptionRow"
          data-state=${ifDefined(visual)}
          @click=${() => this.onOptionActivate(option, index)}
        >
          ${resolveOptionIconSlug(option)
            ? html`
                <span class="ids-app-launcher-option-icon" aria-hidden="true">
                  <ids-icon
                    shape=${resolveOptionIconSlug(option)!}
                    size="16"
                    color="var(--color-icon-gray-neutral-strong)"
                  ></ids-icon>
                </span>
              `
            : nothing}
          ${label}
        </button>
      </li>
    `;
  }

  private renderOptionsRegion(): TemplateResult | typeof nothing {
    if (!this.showOptions) return nothing;
    const showSeparator = this.list.length > 0;

    return html`
      <div
        class=${classMap({
          "ids-app-launcher-options-region": true,
          "ids-app-launcher-options-region--separator": showSeparator,
        })}
        data-ids="ids-app-launcher-options-region"
        data-slot="OptionsRegion"
        data-focus-section="options"
      >
        ${this.mergedOptions.length > 0
          ? html`
              <ul class="ids-app-launcher-options-list">
                ${repeat(
                  this.mergedOptions,
                  (opt, i) => opt.id ?? `opt-${i}`,
                  (opt, i) => this.renderOptionRow(opt, i),
                )}
              </ul>
            `
          : nothing}
        ${this.footerAction
          ? html`
              <div
                class="ids-app-launcher-options-footer"
                data-ids="ids-app-launcher-options-footer"
              >
                <button
                  type="button"
                  class="ids-app-launcher-footer-action"
                  data-ids="ids-app-launcher-footer-action"
                  data-slot="FooterAction"
                  @click=${() => this.onFooterActivate()}
                >
                  ${this.footerAction.label}
                </button>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private renderSurface(): TemplateResult {
    return html`
      <div
        class=${classMap({
          "ids-app-launcher-surface": true,
          "ids-app-launcher-surface--two-product": this.useTwoProductInternalRail,
          "ids-app-launcher-surface--single-product": this.useSingleProductWidth,
        })}
        role=${ifDefined(this.panelOnly ? undefined : "dialog")}
        id=${ifDefined(this.panelOnly ? undefined : this.popupId)}
        aria-label=${ifDefined(this.panelOnly ? undefined : this.ariaLabel)}
        data-ids="ids-app-launcher-surface"
        data-slot="AppLauncherSurface"
        data-programme=${this.resolvedProgramme}
        @keydown=${(e: KeyboardEvent) => this.onPopupKeyDown(e)}
      >
        ${this.renderProductRegion()} ${this.renderOptionsRegion()}
      </div>
    `;
  }

  private renderTrigger(): TemplateResult | typeof nothing {
    if (this.panelOnly) return nothing;
    const masthead = this.resolvedTriggerVariant === "masthead";
    return html`
      <button
        type="button"
        class=${classMap({
          "ids-app-launcher-trigger": true,
          "ids-app-launcher-trigger--masthead": masthead,
        })}
        aria-label=${this.ariaLabel}
        aria-expanded=${this.isOpen}
        aria-haspopup="dialog"
        aria-controls=${ifDefined(this.isOpen ? this.popupId : undefined)}
        data-ids="ids-app-launcher-trigger"
        data-slot="AppLauncherTrigger"
        data-state=${ifDefined(this.isOpen ? "open" : undefined)}
        data-variant=${this.resolvedTriggerVariant}
        @click=${() => this.toggleOpen()}
        @keydown=${(e: KeyboardEvent) => this.onTriggerKeyDown(e)}
      >
        <ids-icon
          class="ids-app-launcher-trigger-icon"
          shape=${APP_LAUNCHER_TRIGGER_ICON}
          size="16"
          color="currentColor"
        ></ids-icon>
      </button>
    `;
  }

  private renderMeasure(): TemplateResult {
    return html`
      <div class="ids-app-launcher-measure" aria-hidden="true" data-ids="ids-app-launcher-measure">
        ${this.list.map((product, index) => {
          const key = productReflowKey(product, index);
          return html`
            <span
              class="ids-app-launcher-measure-label"
              data-reflow-key=${key}
              data-reflow-budget=${isTextOnlyProduct(product) ? "3" : "1"}
              >${product.name}</span
            >
          `;
        })}
      </div>
    `;
  }

  override render() {
    return html`
      <span
        class="ids-app-launcher"
        data-ids="ids-app-launcher"
        data-slot="AppLauncher"
        data-programme=${this.resolvedProgramme}
        data-panel-only=${ifDefined(this.panelOnly ? "true" : undefined)}
      >
        ${this.renderTrigger()}
        ${this.panelOnly ? this.renderSurface() : nothing}
        ${this.renderMeasure()}
      </span>
    `;
  }
}

/**
 * Standalone product tile for Tile State Matrix stories
 * (React `IdsAppLauncherProductTile` parity).
 */
export class IdsAppLauncherProductTile extends LitElement {
  static override styles = [appLauncherSurfaceStyles];

  @property({ type: String })
  name = "Product Name";

  /** Pass empty / omit with `dataState="no-icon"` for text-only. */
  @property({ type: String, attribute: "iconslug" })
  iconSlug: string = APP_LAUNCHER_DEFAULT_PRODUCT_ICON;

  @property({ type: Boolean, attribute: "omiticon" })
  omitIcon = false;

  /** Demo/testing visual override — does not block interaction. */
  @property({ type: String, attribute: "datastate", reflect: true })
  dataState: IdsAppLauncherTileDataState | string = "default";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-app-launcher-product-tile-host");
  }

  override render() {
    const noIcon = this.omitIcon || this.dataState === "no-icon";
    const state =
      this.dataState && this.dataState !== "default"
        ? this.dataState
        : undefined;
    return html`
      <button
        type="button"
        class="ids-app-launcher-product-tile"
        data-ids="ids-app-launcher-product-tile"
        data-slot="ProductTile"
        data-state=${ifDefined(state)}
      >
        <div
          class=${classMap({
            "ids-app-launcher-label-cluster": true,
            "ids-app-launcher-label-cluster--no-icon": noIcon,
          })}
          data-ids="ids-app-launcher-label-cluster"
          data-slot="LabelCluster"
        >
          ${noIcon
            ? nothing
            : html`
                <div
                  class="ids-app-launcher-product-icon"
                  data-ids="ids-app-launcher-product-icon"
                  data-slot="ProductIcon"
                  aria-hidden="true"
                >
                  <ids-icon
                    shape=${resolveProductIconSlug(this.iconSlug)}
                    size="32"
                    color="currentColor"
                  ></ids-icon>
                </div>
              `}
          <span
            class="ids-app-launcher-product-label"
            data-ids="ids-app-launcher-product-label"
            data-slot="ProductLabel"
            >${this.name}</span
          >
        </div>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-app-launcher": IdsAppLauncher;
    "ids-app-launcher-product-tile": IdsAppLauncherProductTile;
  }
}
