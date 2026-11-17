/**
 * IdsPagination — Lit web component.
 *
 * Tag: `ids-pagination`
 * Spec: `components/ids/pagination/design-spec.md`
 * API: `lib/react/ids/pagination` (`IdsPagination`)
 * Examples: `storybook/src/components/lib-generated/Pagination.stories.tsx`
 *
 * Anatomy:
 *   PaginationRoot (nav)
 *     ResultsPerPageGroup?  (Show: + PerPageDropdown + per page)
 *     PageNavigationGroup
 *       First + Prev + PageInput + PageCountText + Next + Last
 *
 * Events:
 *   page-change / onPageChange        detail: number
 *   page-size-change / onPageSizeChange  detail: number
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, Figma MCP):
 *   Main `11677:157840` · Gray `11677:157841` · None `11677:157848`
 *   Page nav `11677:157817` · Per-page `37721:115839` · TextBox `11677:157819`
 */
import { LitElement, html, nothing, render } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { createRef, ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";
import "../icon/register.js";
import {
  PAGINATION_CARET_ICON_SIZE,
  PAGINATION_ICON_SHAPES,
  PAGINATION_NAV_ICON_SIZE,
  PAGINATION_RUNTIME_DEFAULTS,
  clamp,
  defaultPageCountText,
  normalizePageSizeOptions,
  resolveBackground,
  resolveCollapseOrder,
  resolveResponsiveMode,
  trueByDefault,
  type IdsPaginationBackground,
  type IdsPaginationCollapseSlot,
  type IdsPaginationResponsiveMode,
} from "./pagination.constants.js";
import {
  paginationMenuPortalStyles,
  paginationStyles,
} from "./pagination.styles.js";

type MenuPlacement = "below" | "above";
type MenuPos = { top: number; left: number; width: number };

const adoptedDocuments = new WeakSet<Document>();

function adoptMenuPortalStyles(doc: Document): void {
  if (adoptedDocuments.has(doc)) return;
  const sheet = paginationMenuPortalStyles.styleSheet;
  if (sheet && "adoptedStyleSheets" in doc) {
    try {
      if (!doc.adoptedStyleSheets.includes(sheet)) {
        doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
      }
      adoptedDocuments.add(doc);
      return;
    } catch {
      /* fall through */
    }
  }
  if (!doc.getElementById("ids-pagination-menu-portal-styles")) {
    const style = doc.createElement("style");
    style.id = "ids-pagination-menu-portal-styles";
    style.textContent = paginationMenuPortalStyles.cssText;
    doc.head.appendChild(style);
    adoptedDocuments.add(doc);
  }
}

export class IdsPagination extends LitElement {
  static override styles = [paginationStyles];

  @property({ type: Number, attribute: "currentpage" })
  currentPage = PAGINATION_RUNTIME_DEFAULTS.currentPage;

  @property({ type: Number, attribute: "totalpages" })
  totalPages = PAGINATION_RUNTIME_DEFAULTS.totalPages;

  @property({ type: Number, attribute: "pagesize" })
  pageSize = PAGINATION_RUNTIME_DEFAULTS.pageSize;

  /** Positive unique options — property only. */
  @property({ attribute: false })
  pageSizeOptions: number[] = [
    ...PAGINATION_RUNTIME_DEFAULTS.pageSizeOptions,
  ];

  /**
   * Default `true`. Lit boolean attrs treat absence as false, so only
   * `"false"` hides the results-per-page group.
   */
  @property({
    attribute: "showresultsperpage",
    converter: trueByDefault,
  })
  showResultsPerPage = PAGINATION_RUNTIME_DEFAULTS.showResultsPerPage;

  @property({ type: String, reflect: true })
  background: IdsPaginationBackground | string =
    PAGINATION_RUNTIME_DEFAULTS.background;

  /**
   * When true (datagrid footer), apply `rootEmbedded`: top border only —
   * left/right/bottom merge into the datagrid shell.
   */
  @property({ type: Boolean, attribute: "embeddedindatagrid", reflect: true })
  embeddedInDatagrid = false;

  @property({ type: String, attribute: "responsivemode", reflect: true })
  responsiveMode: IdsPaginationResponsiveMode | string =
    PAGINATION_RUNTIME_DEFAULTS.responsiveMode;

  /** Collapse priority when `responsiveMode="auto"`. Property only. */
  @property({ attribute: false })
  collapseOrder: IdsPaginationCollapseSlot[] = [
    ...PAGINATION_RUNTIME_DEFAULTS.collapseOrder,
  ];

  @property({ attribute: false })
  summaryFormatter?: (currentPage: number, totalPages: number) => string;

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = PAGINATION_RUNTIME_DEFAULTS.ariaLabel;

  /** React API parity — fired when the current page commits. */
  @property({ attribute: false })
  onPageChange?: (page: number) => void;

  /** React API parity — fired when a per-page option is selected. */
  @property({ attribute: false })
  onPageSizeChange?: (size: number) => void;

  @state() private pageInputValue = String(
    PAGINATION_RUNTIME_DEFAULTS.currentPage,
  );
  @state() private collapseLevel = 0;
  @state() private perPageMenuOpen = false;
  @state() private menuPlacement: MenuPlacement = "below";
  @state() private perPageMenuPos: MenuPos | null = null;

  private readonly rootRef = createRef<HTMLElement>();
  private readonly perPageTriggerRef = createRef<HTMLButtonElement>();
  private menuHost: HTMLUListElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private overlayCleanup: (() => void) | null = null;
  private documentListenersBound = false;

  private readonly onDocKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || !this.perPageMenuOpen) return;
    this.closePerPageMenu();
    this.perPageTriggerRef.value?.focus();
  };

  private readonly onDocMouseDown = (event: MouseEvent): void => {
    if (!this.perPageMenuOpen) return;
    const target = event.target as Node | null;
    if (!target) return;
    if (this.perPageTriggerRef.value?.contains(target)) return;
    if (this.menuHost?.contains(target)) return;
    this.closePerPageMenu();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-pagination-host");
    this.pageInputValue = String(this.safeCurrentPage());
    if (typeof document !== "undefined") {
      adoptMenuPortalStyles(document);
    }
  }

  override firstUpdated(): void {
    this.setupResponsiveObserver();
    this.scheduleResponsiveCheck();
  }

  override disconnectedCallback(): void {
    this.teardownResponsiveObserver();
    this.closePerPageMenu();
    this.unbindDocumentListeners();
    this.destroyMenuHost();
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has("currentPage") ||
      changed.has("totalPages")
    ) {
      this.pageInputValue = String(this.safeCurrentPage());
    }

    if (
      changed.has("responsiveMode") ||
      changed.has("collapseOrder") ||
      changed.has("showResultsPerPage") ||
      changed.has("totalPages") ||
      changed.has("background") ||
      changed.has("pageSize") ||
      changed.has("pageSizeOptions")
    ) {
      this.setupResponsiveObserver();
      this.scheduleResponsiveCheck();
    }

    if (this.perPageMenuOpen) {
      this.syncMenuPortal();
    }
  }

  private safeTotalPages(): number {
    return Math.max(1, this.totalPages);
  }

  private safeCurrentPage(): number {
    return clamp(this.currentPage, 1, this.safeTotalPages());
  }

  private safePageSizeOptions(): number[] {
    return normalizePageSizeOptions(this.pageSizeOptions);
  }

  private safePageSize(): number {
    const options = this.safePageSizeOptions();
    return options.includes(this.pageSize) ? this.pageSize : options[0];
  }

  private resolvedBackground(): IdsPaginationBackground {
    return resolveBackground(this.background);
  }

  private resolvedResponsiveMode(): IdsPaginationResponsiveMode {
    return resolveResponsiveMode(this.responsiveMode);
  }

  /** Results-per-page is never a collapse candidate (spec / React). */
  private resolvedCollapseOrder(): IdsPaginationCollapseSlot[] {
    return resolveCollapseOrder(this.collapseOrder).filter(
      (slot) => slot !== "results-per-page",
    );
  }

  private collapsedSlots(): Set<IdsPaginationCollapseSlot> {
    return new Set(this.resolvedCollapseOrder().slice(0, this.collapseLevel));
  }

  private emitPageChange(page: number): void {
    this.onPageChange?.(page);
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: page,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitPageSizeChange(size: number): void {
    this.onPageSizeChange?.(size);
    this.dispatchEvent(
      new CustomEvent("page-size-change", {
        detail: size,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private goToPage(nextPage: number): void {
    const clamped = clamp(nextPage, 1, this.safeTotalPages());
    this.pageInputValue = String(clamped);
    this.emitPageChange(clamped);
  }

  private onFirstPage(): void {
    if (this.safeCurrentPage() <= 1) return;
    this.goToPage(1);
  }

  private onPreviousPage(): void {
    if (this.safeCurrentPage() <= 1) return;
    this.goToPage(this.safeCurrentPage() - 1);
  }

  private onNextPage(): void {
    if (this.safeCurrentPage() >= this.safeTotalPages()) return;
    this.goToPage(this.safeCurrentPage() + 1);
  }

  private onLastPage(): void {
    if (this.safeCurrentPage() >= this.safeTotalPages()) return;
    this.goToPage(this.safeTotalPages());
  }

  private onPageInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.pageInputValue = value.replace(/[^\d]/g, "");
  }

  private commitPageInput(): void {
    const parsed = Number.parseInt(this.pageInputValue, 10);
    if (!Number.isFinite(parsed)) {
      this.pageInputValue = String(this.safeCurrentPage());
      return;
    }
    this.goToPage(parsed);
  }

  private onPageInputKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.commitPageInput();
      (event.target as HTMLInputElement | null)?.blur();
    }
  }

  private togglePerPageMenu(): void {
    if (this.perPageMenuOpen) {
      this.closePerPageMenu();
      return;
    }
    this.perPageMenuOpen = true;
    this.bindDocumentListeners();
    this.bindOverlayListeners();
    this.syncMenuPortal();
  }

  private closePerPageMenu(): void {
    this.perPageMenuOpen = false;
    this.perPageMenuPos = null;
    this.unbindOverlayListeners();
    this.clearMenuPortal();
  }

  private selectPageSize(size: number): void {
    this.emitPageSizeChange(size);
    this.closePerPageMenu();
  }

  private ensureMenuHost(): HTMLUListElement {
    if (this.menuHost) return this.menuHost;
    const el = document.createElement("ul");
    el.setAttribute("data-ids-pagination-per-page-menu", "");
    el.setAttribute("role", "listbox");
    el.setAttribute("aria-label", "Items per page options");
    document.body.appendChild(el);
    this.menuHost = el;
    return el;
  }

  private destroyMenuHost(): void {
    if (!this.menuHost) return;
    render(nothing, this.menuHost);
    this.menuHost.remove();
    this.menuHost = null;
  }

  private clearMenuPortal(): void {
    if (!this.menuHost) return;
    render(nothing, this.menuHost);
  }

  private syncMenuPlacement(): void {
    const trigger = this.perPageTriggerRef.value;
    if (!trigger) {
      this.menuPlacement = "below";
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedMenuHeight = Math.max(
      this.menuHost?.offsetHeight ?? 0,
      this.safePageSizeOptions().length * 40,
    );
    this.menuPlacement =
      spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow
        ? "above"
        : "below";
  }

  private computeMenuPos(): MenuPos | null {
    const trigger = this.perPageTriggerRef.value;
    if (!trigger) return null;
    const rect = trigger.getBoundingClientRect();
    const width = rect.width;
    const left = rect.left;
    if (this.menuPlacement === "above") {
      const menuHeight = this.menuHost?.getBoundingClientRect().height ?? 0;
      return { top: rect.top + 1 - menuHeight, left, width };
    }
    return { top: rect.top + rect.height - 1, left, width };
  }

  private syncMenuPortal(): void {
    if (!this.perPageMenuOpen || typeof document === "undefined") return;
    adoptMenuPortalStyles(document);
    this.syncMenuPlacement();
    const host = this.ensureMenuHost();
    const pos = this.computeMenuPos();
    this.perPageMenuPos = pos;
    const selected = this.safePageSize();
    const options = this.safePageSizeOptions();

    render(
      html`${options.map(
        (option) => html`
          <li>
            <button
              type="button"
              role="option"
              class="ids-pagination-menu-option"
              aria-selected=${option === selected ? "true" : "false"}
              @click=${() => this.selectPageSize(option)}
            >
              ${option}
            </button>
          </li>
        `,
      )}`,
      host,
    );

    host.className = "ids-pagination-menu";
    host.dataset.placement = this.menuPlacement;
    Object.assign(host.style, {
      position: "fixed",
      top: `${pos?.top ?? 0}px`,
      left: `${pos?.left ?? 0}px`,
      width: `${pos?.width ?? 90}px`,
    });

    requestAnimationFrame(() => {
      if (!this.perPageMenuOpen) return;
      this.syncMenuPlacement();
      const next = this.computeMenuPos();
      this.perPageMenuPos = next;
      host.dataset.placement = this.menuPlacement;
      Object.assign(host.style, {
        top: `${next?.top ?? 0}px`,
        left: `${next?.left ?? 0}px`,
        width: `${next?.width ?? 90}px`,
      });
    });
  }

  private bindDocumentListeners(): void {
    if (this.documentListenersBound) return;
    document.addEventListener("keydown", this.onDocKeyDown);
    document.addEventListener("mousedown", this.onDocMouseDown);
    this.documentListenersBound = true;
  }

  private unbindDocumentListeners(): void {
    if (!this.documentListenersBound) return;
    document.removeEventListener("keydown", this.onDocKeyDown);
    document.removeEventListener("mousedown", this.onDocMouseDown);
    this.documentListenersBound = false;
  }

  private bindOverlayListeners(): void {
    if (this.overlayCleanup) return;
    const onUpdate = () => {
      if (!this.perPageMenuOpen) return;
      this.syncMenuPortal();
    };
    window.addEventListener("resize", onUpdate);
    window.addEventListener("scroll", onUpdate, true);
    this.overlayCleanup = () => {
      window.removeEventListener("resize", onUpdate);
      window.removeEventListener("scroll", onUpdate, true);
      this.overlayCleanup = null;
    };
  }

  private unbindOverlayListeners(): void {
    this.overlayCleanup?.();
    this.overlayCleanup = null;
  }

  private setupResponsiveObserver(): void {
    this.teardownResponsiveObserver();
    if (this.resolvedResponsiveMode() !== "auto") {
      this.collapseLevel = 0;
      return;
    }
    const root = this.rootRef.value;
    if (!root || typeof ResizeObserver === "undefined") return;
    this.resizeObserver = new ResizeObserver(() => {
      this.collapseLevel = 0;
      requestAnimationFrame(() => this.checkResponsiveCollapse());
    });
    this.resizeObserver.observe(root);
  }

  private teardownResponsiveObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private scheduleResponsiveCheck(): void {
    requestAnimationFrame(() => {
      if (this.resolvedResponsiveMode() !== "auto") {
        this.collapseLevel = 0;
        return;
      }
      this.collapseLevel = 0;
      this.checkResponsiveCollapse();
    });
  }

  private checkResponsiveCollapse(): void {
    if (this.resolvedResponsiveMode() !== "auto") return;
    const root = this.rootRef.value;
    if (!root) return;
    if (root.scrollWidth <= root.clientWidth + 1) return;
    const order = this.resolvedCollapseOrder();
    if (this.collapseLevel < order.length) {
      this.collapseLevel += 1;
      requestAnimationFrame(() => this.checkResponsiveCollapse());
    }
  }

  private countText(): string {
    const current = this.safeCurrentPage();
    const total = this.safeTotalPages();
    return (
      this.summaryFormatter?.(current, total) ??
      defaultPageCountText(current, total)
    );
  }

  override render() {
    const background = this.resolvedBackground();
    const responsiveMode = this.resolvedResponsiveMode();
    const collapsed = this.collapsedSlots();
    const renderResults = this.showResultsPerPage;
    const pageInputCollapsed = collapsed.has("page-input");
    const firstLastCollapsed = collapsed.has("first-last-buttons");
    const atFirst = this.safeCurrentPage() <= 1;
    const atLast = this.safeCurrentPage() >= this.safeTotalPages();
    const isSinglePage = this.safeTotalPages() <= 1;
    const pageSize = this.safePageSize();

    return html`
      <nav
        ${ref(this.rootRef)}
        class=${classMap({
          root: true,
          rootGray: background === "gray",
          rootWhite: background === "white",
          rootNone: background === "none",
          rootEmbedded: this.embeddedInDatagrid,
        })}
        aria-label=${this.ariaLabel || "Pagination"}
        data-ids="ids-pagination"
        data-background=${background}
        data-responsive-mode=${responsiveMode}
        data-embedded-in-datagrid=${this.embeddedInDatagrid ? "true" : nothing}
      >
        ${renderResults
          ? html`
              <div class="resultsGroup" data-ids="ids-pagination-results">
                <span class="label">Show:</span>
                <div class="dropdownWrap">
                  <button
                    ${ref(this.perPageTriggerRef)}
                    type="button"
                    class="dropdownTrigger"
                    aria-haspopup="listbox"
                    aria-expanded=${this.perPageMenuOpen ? "true" : "false"}
                    aria-label="Items per page"
                    @click=${() => this.togglePerPageMenu()}
                  >
                    <span>${pageSize}</span>
                    <ids-icon
                      shape=${PAGINATION_ICON_SHAPES.caret}
                      size=${PAGINATION_CARET_ICON_SIZE}
                      style=${styleMap({
                        width: `${PAGINATION_CARET_ICON_SIZE}px`,
                        height: `${PAGINATION_CARET_ICON_SIZE}px`,
                      })}
                    ></ids-icon>
                  </button>
                </div>
                <span class="label">per page</span>
              </div>
            `
          : nothing}

        <div class="pageNavGroup" data-ids="ids-pagination-nav">
          ${isSinglePage
            ? html`<span class="countText">${this.countText()}</span>`
            : html`
                <button
                  type="button"
                  class=${classMap({
                    iconButton: true,
                    iconButtonCollapsed: firstLastCollapsed,
                  })}
                  aria-label="First page"
                  ?disabled=${atFirst}
                  @click=${() => this.onFirstPage()}
                >
                  <ids-icon
                    shape=${PAGINATION_ICON_SHAPES.first}
                    size=${PAGINATION_NAV_ICON_SIZE}
                    style=${styleMap({
                      width: `${PAGINATION_NAV_ICON_SIZE}px`,
                      height: `${PAGINATION_NAV_ICON_SIZE}px`,
                    })}
                  ></ids-icon>
                </button>
                <button
                  type="button"
                  class="iconButton"
                  aria-label="Previous page"
                  ?disabled=${atFirst}
                  @click=${() => this.onPreviousPage()}
                >
                  <ids-icon
                    shape=${PAGINATION_ICON_SHAPES.previous}
                    size=${PAGINATION_NAV_ICON_SIZE}
                    style=${styleMap({
                      width: `${PAGINATION_NAV_ICON_SIZE}px`,
                      height: `${PAGINATION_NAV_ICON_SIZE}px`,
                    })}
                  ></ids-icon>
                </button>
                <div
                  class=${classMap({
                    pageInputWrap: true,
                    pageInputWrapCollapsed: pageInputCollapsed,
                  })}
                >
                  <input
                    class="pageInput"
                    .value=${this.pageInputValue}
                    inputmode="numeric"
                    aria-label="Current page"
                    @input=${(e: Event) => this.onPageInput(e)}
                    @blur=${() => this.commitPageInput()}
                    @keydown=${(e: KeyboardEvent) => this.onPageInputKeydown(e)}
                  />
                </div>
                <span class="countText">${this.countText()}</span>
                <button
                  type="button"
                  class="iconButton"
                  aria-label="Next page"
                  ?disabled=${atLast}
                  @click=${() => this.onNextPage()}
                >
                  <ids-icon
                    shape=${PAGINATION_ICON_SHAPES.next}
                    size=${PAGINATION_NAV_ICON_SIZE}
                    style=${styleMap({
                      width: `${PAGINATION_NAV_ICON_SIZE}px`,
                      height: `${PAGINATION_NAV_ICON_SIZE}px`,
                    })}
                  ></ids-icon>
                </button>
                <button
                  type="button"
                  class=${classMap({
                    iconButton: true,
                    iconButtonCollapsed: firstLastCollapsed,
                  })}
                  aria-label="Last page"
                  ?disabled=${atLast}
                  @click=${() => this.onLastPage()}
                >
                  <ids-icon
                    shape=${PAGINATION_ICON_SHAPES.last}
                    size=${PAGINATION_NAV_ICON_SIZE}
                    style=${styleMap({
                      width: `${PAGINATION_NAV_ICON_SIZE}px`,
                      height: `${PAGINATION_NAV_ICON_SIZE}px`,
                    })}
                  ></ids-icon>
                </button>
              `}
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-pagination": IdsPagination;
  }
}
