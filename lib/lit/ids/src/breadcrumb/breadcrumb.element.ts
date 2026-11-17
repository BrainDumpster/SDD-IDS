/**
 * IdsBreadcrumb — Lit web component.
 *
 * Tag: `ids-breadcrumb`
 * Spec: `components/ids/breadcrumb/design-spec.md`
 * API parity: Storybook React `IdsBreadcrumb`
 *   (`storybook/src/components/IdsBreadcrumb.tsx` — no `lib/react/ids/breadcrumb`)
 *
 * Anatomy:
 *   nav.ids-breadcrumb
 *     ol.ids-breadcrumb-list
 *       li.ids-breadcrumb-item → ids-link (standalone) + separator `/`
 *       [truncated] overflow ellipsis → Dropdown-SingleSelect-style menu
 *     span.ids-breadcrumb-current? (Two lines / currentPage)
 *
 * Live Figma (VZJ48bbVYrIynw8DdSukWw, MCP 2026-11-10):
 *   `11067:54494`, Standard `11067:56646`, Truncated+overflow `11067:56570`
 *
 * Event: `ids-open-change` { open: boolean } — overflow menu open state.
 */
import { LitElement, html, nothing, render } from "lit";
import { property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import "../link/register.js";
import {
  BREADCRUMB_RUNTIME_DEFAULTS,
  applyLabelCap,
  normalizeBreadcrumbItems,
  resolveMaxVisibleItems,
  type IdsBreadcrumbItem,
} from "./breadcrumb.constants.js";
import {
  breadcrumbOverflowPortalStyles,
  breadcrumbStyles,
} from "./breadcrumb.styles.js";

const adoptedDocuments = new WeakSet<Document>();

function adoptPortalStyles(doc: Document): boolean {
  if (adoptedDocuments.has(doc)) return true;
  const sheet = breadcrumbOverflowPortalStyles.styleSheet;
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

export class IdsBreadcrumb extends LitElement {
  static override styles = [breadcrumbStyles];

  /** Trail items — property only (array). Required for a non-empty trail. */
  @property({ attribute: false })
  items: IdsBreadcrumbItem[] = [];

  /** Current page text below the trail (Figma Two lines=Yes). */
  @property({ type: String, attribute: "currentpage" })
  currentPage = "";

  /** Item count above this triggers first/last + ellipsis overflow. Default 3. */
  @property({ type: Number, attribute: "maxvisibleitems" })
  maxVisibleItems = BREADCRUMB_RUNTIME_DEFAULTS.maxVisibleItems;

  @state() private labelCap: number | null = null;
  @state() private overflowOpen = false;

  @query(".ids-breadcrumb") private navEl!: HTMLElement;
  @query(".ids-breadcrumb-list") private listEl!: HTMLOListElement;
  @query(".ids-breadcrumb-overflow-trigger")
  private overflowTriggerEl!: HTMLElement | null;

  private resizeObserver: ResizeObserver | null = null;
  private portalEl: HTMLDivElement | null = null;
  private portalNeedsInlineStyles = false;
  private listenersBound = false;
  private focusOverflowOnOpen = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-breadcrumb-host");
  }

  override disconnectedCallback(): void {
    this.teardownOverflowObserver();
    this.unbindDocumentListeners();
    this.destroyPortal();
    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.setupOverflowObserver();
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (
      changed.has("items") ||
      changed.has("maxVisibleItems") ||
      changed.has("labelCap")
    ) {
      // Re-measure after trail content changes.
      requestAnimationFrame(() => this.checkLabelOverflow());
    }
    if (changed.has("overflowOpen") || changed.has("items")) {
      this.syncPortal();
    }
    this.syncOverflowTriggerAria();
  }

  /** Forward overflow a11y onto IdsLink's inner button (shadow). */
  private syncOverflowTriggerAria(): void {
    const link = this.overflowTriggerEl?.querySelector("ids-link");
    const control = link?.shadowRoot?.querySelector<HTMLElement>("button, a");
    if (!control) return;
    control.setAttribute("aria-label", "Collapsed breadcrumbs");
    control.setAttribute("aria-haspopup", "menu");
    control.setAttribute(
      "aria-expanded",
      this.overflowOpen ? "true" : "false",
    );
  }

  private focusOverflowTrigger(): void {
    const link = this.overflowTriggerEl?.querySelector("ids-link");
    link?.shadowRoot?.querySelector<HTMLElement>("button, a")?.focus();
  }

  private resolvedItems(): IdsBreadcrumbItem[] {
    return normalizeBreadcrumbItems(this.items);
  }

  private resolvedMaxVisible(): number {
    return resolveMaxVisibleItems(this.maxVisibleItems);
  }

  private shouldTruncate(items: IdsBreadcrumbItem[]): boolean {
    return items.length > this.resolvedMaxVisible();
  }

  private visibleItems(items: IdsBreadcrumbItem[]): IdsBreadcrumbItem[] {
    if (!this.shouldTruncate(items)) return items;
    return [items[0], items[items.length - 1]];
  }

  private hiddenItems(items: IdsBreadcrumbItem[]): IdsBreadcrumbItem[] {
    if (!this.shouldTruncate(items)) return [];
    return items.slice(1, -1);
  }

  private originalMaxLabelLength(items: IdsBreadcrumbItem[]): number {
    const visible = this.visibleItems(items);
    if (visible.length === 0) return 0;
    return Math.max(0, ...visible.map((item) => item.label.length));
  }

  private setupOverflowObserver(): void {
    this.teardownOverflowObserver();
    const nav = this.navEl;
    const list = this.listEl;
    if (!nav || !list) return;
    const parent = this.parentElement;
    this.resizeObserver = new ResizeObserver(() => this.checkLabelOverflow());
    this.resizeObserver.observe(nav);
    this.resizeObserver.observe(list);
    if (parent) this.resizeObserver.observe(parent);
    this.checkLabelOverflow();
  }

  private teardownOverflowObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private checkLabelOverflow = (): void => {
    const nav = this.navEl;
    const list = this.listEl;
    if (!nav || !list) return;

    const items = this.resolvedItems();
    const originalMax = this.originalMaxLabelLength(items);
    if (originalMax <= 0) {
      if (this.labelCap != null) this.labelCap = null;
      return;
    }

    const listRect = list.getBoundingClientRect();
    const contentRight = listRect.left + list.scrollWidth;
    const parent = this.parentElement;

    let nextEdge: number | null = null;
    if (parent) {
      for (const child of Array.from(parent.children)) {
        if (child === this) continue;
        const childRect = (child as HTMLElement).getBoundingClientRect();
        if (childRect.width === 0 || childRect.height === 0) continue;
        if (childRect.right > listRect.left) {
          if (nextEdge == null || childRect.left < nextEdge) {
            nextEdge = childRect.left;
          }
        }
      }
    }

    if (nextEdge == null) {
      const navRect = nav.getBoundingClientRect();
      nextEdge = navRect.left + nav.clientWidth;
    }

    const spacing = nextEdge - contentRight;
    const truncateBelow = BREADCRUMB_RUNTIME_DEFAULTS.truncateBelowPx;
    const revertAt = BREADCRUMB_RUNTIME_DEFAULTS.revertAtOrAbovePx;

    if (spacing < truncateBelow) {
      const next =
        this.labelCap == null
          ? Math.max(1, originalMax - 1)
          : Math.max(1, this.labelCap - 1);
      if (next !== this.labelCap) this.labelCap = next;
    } else if (spacing >= revertAt && this.labelCap != null) {
      const next = this.labelCap + 1;
      this.labelCap = next >= originalMax ? null : next;
    }
  };

  private setOverflowOpen(open: boolean): void {
    if (this.overflowOpen === open) return;
    this.overflowOpen = open;
    this.dispatchEvent(
      new CustomEvent("ids-open-change", {
        detail: { open },
        bubbles: true,
        composed: true,
      }),
    );
    if (open) {
      this.focusOverflowOnOpen = true;
      this.bindDocumentListeners();
    } else {
      this.unbindDocumentListeners();
    }
  }

  private toggleOverflow = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    this.setOverflowOpen(!this.overflowOpen);
  };

  private onOverflowKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.setOverflowOpen(!this.overflowOpen);
    } else if (event.key === "Escape" && this.overflowOpen) {
      event.preventDefault();
      this.setOverflowOpen(false);
      this.focusOverflowTrigger();
    } else if (event.key === "ArrowDown" && !this.overflowOpen) {
      event.preventDefault();
      this.setOverflowOpen(true);
    }
  };

  private bindDocumentListeners(): void {
    if (this.listenersBound) return;
    this.listenersBound = true;
    document.addEventListener("pointerdown", this.onDocumentPointerDown, true);
    document.addEventListener("keydown", this.onDocumentKeydown, true);
    document.addEventListener("focusin", this.onDocumentFocusIn, true);
  }

  private unbindDocumentListeners(): void {
    if (!this.listenersBound) return;
    this.listenersBound = false;
    document.removeEventListener(
      "pointerdown",
      this.onDocumentPointerDown,
      true,
    );
    document.removeEventListener("keydown", this.onDocumentKeydown, true);
    document.removeEventListener("focusin", this.onDocumentFocusIn, true);
  }

  private onDocumentPointerDown = (event: PointerEvent): void => {
    if (!this.overflowOpen) return;
    const path = event.composedPath();
    if (this.portalEl && path.includes(this.portalEl)) return;
    if (path.includes(this)) return;
    this.setOverflowOpen(false);
  };

  private onDocumentKeydown = (event: KeyboardEvent): void => {
    if (!this.overflowOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      this.setOverflowOpen(false);
      this.focusOverflowTrigger();
    }
  };

  private onDocumentFocusIn = (event: FocusEvent): void => {
    if (!this.overflowOpen) return;
    const path = event.composedPath();
    if (this.portalEl && path.includes(this.portalEl)) return;
    if (path.includes(this)) return;
    this.setOverflowOpen(false);
  };

  private ensurePortal(): HTMLDivElement {
    if (!this.portalEl) {
      this.portalEl = document.createElement("div");
      this.portalEl.setAttribute("data-ids", "ids-breadcrumb-overflow-portal");
      this.portalEl.className = "ids-breadcrumb-overflow-portal";
      document.body.appendChild(this.portalEl);
      this.portalNeedsInlineStyles = !adoptPortalStyles(document);
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

  private positionPortal(): void {
    const portal = this.portalEl;
    const trigger = this.overflowTriggerEl;
    if (!portal || !trigger) return;
    const rect = trigger.getBoundingClientRect();
    portal.style.top = `${Math.round(rect.bottom)}px`;
    portal.style.left = `${Math.round(rect.left)}px`;
  }

  private onOverflowOptionClick = (item: IdsBreadcrumbItem): void => {
    this.setOverflowOpen(false);
    window.location.href = item.href ?? "#";
  };

  private syncPortal(): void {
    const hidden = this.hiddenItems(this.resolvedItems());
    if (!this.overflowOpen || hidden.length === 0) {
      if (this.portalEl) {
        render(nothing, this.portalEl);
      }
      return;
    }

    const portal = this.ensurePortal();
    this.positionPortal();

    render(
      html`
        ${this.portalNeedsInlineStyles
          ? html`<style>
              ${breadcrumbOverflowPortalStyles.cssText}
            </style>`
          : nothing}
        <ul
          class="ids-breadcrumb-overflow-menu"
          role="menu"
          data-ids="ids-breadcrumb-overflow-menu"
          aria-label="Collapsed breadcrumbs"
        >
          ${repeat(
            hidden,
            (item, index) => `${item.label}-${index}`,
            (item) => html`
              <li role="none">
                <button
                  type="button"
                  class="ids-breadcrumb-overflow-option"
                  role="menuitem"
                  data-ids="ids-breadcrumb-overflow-option"
                  @click=${() => this.onOverflowOptionClick(item)}
                >
                  ${item.label}
                </button>
              </li>
            `,
          )}
        </ul>
      `,
      portal,
    );

    if (this.focusOverflowOnOpen) {
      this.focusOverflowOnOpen = false;
      requestAnimationFrame(() => {
        portal
          .querySelector<HTMLElement>(
            '.ids-breadcrumb-overflow-option, [role="menuitem"]',
          )
          ?.focus();
      });
    }
  }

  private renderSeparator() {
    return html`
      <span class="ids-breadcrumb-separator" aria-hidden="true">/</span>
    `;
  }

  private renderOverflow(hidden: IdsBreadcrumbItem[]) {
    if (hidden.length === 0) return nothing;
    return html`
      <span class="ids-breadcrumb-overflow">
        <span
          class="ids-breadcrumb-overflow-trigger"
          @keydown=${this.onOverflowKeydown}
        >
          <ids-link
            label="..."
            type="standalone"
            @ids-link-click=${this.toggleOverflow}
          ></ids-link>
        </span>
      </span>
      ${this.renderSeparator()}
    `;
  }

  private renderItem(
    item: IdsBreadcrumbItem,
    index: number,
    displayed: IdsBreadcrumbItem[],
    showOverflowAfterFirst: boolean,
    hidden: IdsBreadcrumbItem[],
  ) {
    const isLast = index === displayed.length - 1;
    return html`
      <li class="ids-breadcrumb-item" data-ids="ids-breadcrumb-item">
        <ids-link
          label=${item.label}
          href=${item.href ?? "#"}
          type="standalone"
        ></ids-link>
        ${!isLast
          ? html`
              ${this.renderSeparator()}
              ${showOverflowAfterFirst && index === 0
                ? this.renderOverflow(hidden)
                : nothing}
            `
          : this.renderSeparator()}
      </li>
    `;
  }

  override render() {
    const items = this.resolvedItems();
    const visible = this.visibleItems(items);
    const hidden = this.hiddenItems(items);
    const displayed = applyLabelCap(visible, this.labelCap);
    const truncated = this.shouldTruncate(items);

    return html`
      <nav
        class="ids-breadcrumb"
        data-ids="ids-breadcrumb"
        aria-label="Breadcrumb"
      >
        <ol class="ids-breadcrumb-list" data-ids="ids-breadcrumb-list">
          ${repeat(
            displayed,
            (item, index) => `${item.label}-${index}`,
            (item, index) =>
              this.renderItem(item, index, displayed, truncated, hidden),
          )}
        </ol>
        ${this.currentPage
          ? html`
              <span
                class="ids-breadcrumb-current"
                data-ids="ids-breadcrumb-current"
                aria-current="page"
              >
                ${this.currentPage}
              </span>
            `
          : nothing}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-breadcrumb": IdsBreadcrumb;
  }
}
