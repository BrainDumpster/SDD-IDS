/**
 * IdsAnchorMenu — Lit web component.
 *
 * Tag: `ids-anchor-menu`
 * Spec: `components/ids/anchor-menu/design-spec.md`
 * API parity: React `lib/react/ids/anchor-menu` (`IdsAnchorMenu`)
 *
 * Anatomy / Codegen slots:
 *   AnchorMenuRoot
 *     AnchorMenuHeader?
 *     repeated AnchorMenuItem
 *     AnchorActiveIndicator (left-border ::before on active/hover)
 *
 * Live Figma (VZJ48bbVYrIynw8DdSukWw, MCP 2026-11-10):
 *   `11067:54486`, Element `11955:229729`, Example `11955:229709`
 *
 * Event: `ids-item-click` { href: string }
 */
import { LitElement, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import "../tooltip/register.js";
import {
  ANCHOR_MENU_RUNTIME_DEFAULTS,
  hasNavigableHref,
  normalizeAnchorMenuItems,
  resolveActiveHref,
  sectionIdFromHref,
  type IdsAnchorMenuItem,
} from "./anchor-menu.constants.js";
import { anchorMenuStyles } from "./anchor-menu.styles.js";

export class IdsAnchorMenu extends LitElement {
  static override styles = [anchorMenuStyles];

  /** Required for a non-empty list. Empty array renders empty nav without crash. */
  @property({ attribute: false })
  items: IdsAnchorMenuItem[] = [];

  /** `aria-label` on nav and header fallback. Default `"On this page"`. */
  @property({ type: String })
  title = ANCHOR_MENU_RUNTIME_DEFAULTS.title;

  /** Show/hide the heading. Default `true`. */
  @property({ type: Boolean })
  header = ANCHOR_MENU_RUNTIME_DEFAULTS.header;

  /** Sticky positioning for long-page usage. Default `true`. */
  @property({ type: Boolean, reflect: true })
  sticky = ANCHOR_MENU_RUNTIME_DEFAULTS.sticky;

  /**
   * Gap (px) left above a section when scrolling to it.
   * Default `24` — matches React.
   */
  @property({ type: Number, attribute: "scrolloffset" })
  scrollOffset = ANCHOR_MENU_RUNTIME_DEFAULTS.scrollOffset;

  /**
   * Reveal truncated labels with the browser `title` attribute instead of
   * branded `ids-tooltip`. Default `false`.
   */
  @property({ type: Boolean, attribute: "nativetooltip" })
  nativeTooltip = ANCHOR_MENU_RUNTIME_DEFAULTS.nativeTooltip;

  @state() private activeHref: string | undefined;
  @state() private truncatedIndexes = new Set<number>();
  @state() private headerTruncated = false;
  @state() private tooltipSide: "left" | "right" = "right";

  @query(".ids-anchor-menu") private navEl!: HTMLElement;
  @query(".ids-anchor-menu-header-label")
  private headerLabelEl!: HTMLSpanElement | null;

  private itemRefs: Array<HTMLAnchorElement | null> = [];
  private labelRefs = new Map<number, HTMLSpanElement>();
  private spyLocked = false;
  private resizeObserver: ResizeObserver | null = null;
  private scrollRaf = 0;
  private scrollSpyBound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-anchor-menu-host");
    this.activeHref = resolveActiveHref(
      normalizeAnchorMenuItems(this.items),
      undefined,
    );
    this.bindScrollSpy();
    window.addEventListener("resize", this.onWindowResize);
  }

  override disconnectedCallback(): void {
    this.teardownResizeObserver();
    this.unbindScrollSpy();
    window.removeEventListener("resize", this.onWindowResize);
    super.disconnectedCallback();
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("items")) {
      const safe = this.safeItems();
      const marked = safe.find((item) => item.active)?.href;
      if (marked !== undefined) {
        this.activeHref = marked;
      } else if (this.activeHref === undefined) {
        this.activeHref = resolveActiveHref(safe, undefined);
      }
    }
  }

  override firstUpdated(): void {
    this.setupResizeObserver();
    this.updateTooltipSide();
    this.measureTruncation();
    this.neutralizeTooltipTabStops();
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has("items") ||
      changed.has("title") ||
      changed.has("header") ||
      changed.has("truncatedIndexes") ||
      changed.has("headerTruncated") ||
      changed.has("nativeTooltip") ||
      changed.has("tooltipSide") ||
      changed.has("activeHref")
    ) {
      // Re-measure after clamp layout settles a frame later.
      requestAnimationFrame(() => {
        this.measureTruncation();
        this.neutralizeTooltipTabStops();
      });
    }
    if (changed.has("sticky")) {
      this.setAttribute("data-sticky", this.sticky ? "true" : "false");
    }
  }

  private safeItems(): IdsAnchorMenuItem[] {
    return normalizeAnchorMenuItems(this.items);
  }

  private onWindowResize = (): void => {
    this.updateTooltipSide();
    if (this.scrollSpyBound) this.onWindowScroll();
  };

  private updateTooltipSide = (): void => {
    if (this.nativeTooltip || typeof window === "undefined") return;
    const nav = this.navEl ?? this;
    const rect = nav.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const next: "left" | "right" =
      center > window.innerWidth / 2 ? "left" : "right";
    if (next !== this.tooltipSide) this.tooltipSide = next;
  };

  private setupResizeObserver(): void {
    this.teardownResizeObserver();
    if (typeof ResizeObserver === "undefined") return;
    this.resizeObserver = new ResizeObserver(() => this.measureTruncation());
    if (this.navEl) this.resizeObserver.observe(this.navEl);
  }

  private teardownResizeObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private measureTruncation = (): void => {
    const nextTruncated = new Set<number>();
    this.labelRefs.forEach((el, index) => {
      if (el.scrollHeight > el.clientHeight) nextTruncated.add(index);
    });
    const sameSize =
      nextTruncated.size === this.truncatedIndexes.size &&
      [...nextTruncated].every((i) => this.truncatedIndexes.has(i));
    if (!sameSize) this.truncatedIndexes = nextTruncated;

    const headerEl = this.headerLabelEl;
    const nextHeader =
      headerEl != null ? headerEl.scrollHeight > headerEl.clientHeight : false;
    if (nextHeader !== this.headerTruncated) {
      this.headerTruncated = nextHeader;
    }
  };

  /** `ids-tooltip-trigger` defaults to tabIndex 0 — demote so only links tab. */
  private neutralizeTooltipTabStops(): void {
    this.renderRoot
      .querySelectorAll<HTMLElement>("ids-tooltip-trigger")
      .forEach((el) => {
        el.tabIndex = -1;
      });
  }

  private lockScrollSpy = (): void => {
    this.spyLocked = true;
  };

  private releaseScrollSpy = (): void => {
    this.spyLocked = false;
  };

  private bindScrollSpy(): void {
    if (this.scrollSpyBound || typeof window === "undefined") return;
    window.addEventListener("scroll", this.onWindowScroll, { passive: true });
    window.addEventListener("wheel", this.releaseScrollSpy, { passive: true });
    window.addEventListener("touchmove", this.releaseScrollSpy, {
      passive: true,
    });
    window.addEventListener("keydown", this.onPageKeyDown);
    this.scrollSpyBound = true;
    this.onWindowScroll();
  }

  private unbindScrollSpy(): void {
    if (!this.scrollSpyBound || typeof window === "undefined") return;
    window.removeEventListener("scroll", this.onWindowScroll);
    window.removeEventListener("wheel", this.releaseScrollSpy);
    window.removeEventListener("touchmove", this.releaseScrollSpy);
    window.removeEventListener("keydown", this.onPageKeyDown);
    if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
    this.scrollSpyBound = false;
  }

  private onPageKeyDown = (event: KeyboardEvent): void => {
    if (!this.spyLocked) return;
    const PAGE_SCROLL_KEYS = new Set(["PageUp", "PageDown", "Home", "End"]);
    if (!PAGE_SCROLL_KEYS.has(event.key)) return;
    const target = event.target as Node | null;
    if (
      (target && this.contains(target)) ||
      (target && this.renderRoot.contains(target))
    ) {
      return;
    }
    this.releaseScrollSpy();
  };

  private onWindowScroll = (): void => {
    if (this.scrollRaf) return;
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0;
      this.computeActiveFromScroll();
    });
  };

  private computeActiveFromScroll(): void {
    if (this.spyLocked) return;
    const hashTargets = this.safeItems()
      .map((item) =>
        hasNavigableHref(item.href) ? sectionIdFromHref(item.href) : null,
      )
      .filter((id): id is string => id != null);

    if (hashTargets.length === 0) return;

    const elements = hashTargets
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (elements.length === 0) return;

    const activeLine = this.scrollOffset + 1;
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;
    if (atBottom) {
      this.activeHref = `#${elements[elements.length - 1].id}`;
      return;
    }

    let currentId: string | null = null;
    let bestTop = -Infinity;
    let topmostId = elements[0].id;
    let topmost = Infinity;
    for (const el of elements) {
      const top = el.getBoundingClientRect().top - activeLine;
      if (top <= 0 && top > bestTop) {
        bestTop = top;
        currentId = el.id;
      }
      if (top < topmost) {
        topmost = top;
        topmostId = el.id;
      }
    }
    this.activeHref = `#${currentId ?? topmostId}`;
  }

  private navigateToHref(href: string): void {
    if (!hasNavigableHref(href)) return;

    this.activeHref = href;
    this.lockScrollSpy();
    this.dispatchEvent(
      new CustomEvent("ids-item-click", {
        detail: { href },
        bubbles: true,
        composed: true,
      }),
    );

    const sectionId = sectionIdFromHref(href);
    if (sectionId != null) {
      const el = document.getElementById(sectionId);
      if (el && typeof window !== "undefined") {
        const top =
          el.getBoundingClientRect().top + window.scrollY - this.scrollOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
      if (typeof window !== "undefined" && window.history?.replaceState) {
        window.history.replaceState(null, "", href);
      }
    } else if (typeof window !== "undefined") {
      window.location.assign(href);
    }
  }

  private focusItemAt(index: number): void {
    const len = this.safeItems().length;
    if (len === 0) return;
    const next = ((index % len) + len) % len;
    this.itemRefs[next]?.focus();
  }

  private onItemClick = (
    event: MouseEvent,
    href: string,
    navigable: boolean,
  ): void => {
    if (!navigable) {
      event.preventDefault();
      return;
    }
    if (href.startsWith("#")) {
      event.preventDefault();
      this.navigateToHref(href);
      return;
    }
    this.activeHref = href;
    this.dispatchEvent(
      new CustomEvent("ids-item-click", {
        detail: { href },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private onItemKeyDown = (
    event: KeyboardEvent,
    index: number,
    href: string,
    navigable: boolean,
  ): void => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusItemAt(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusItemAt(index - 1);
        break;
      case "Enter":
      case " ":
      case "Spacebar": {
        const isSpace = event.key !== "Enter";
        if (isSpace) event.preventDefault();
        if (!navigable) {
          event.preventDefault();
          return;
        }
        if (href.startsWith("#")) {
          event.preventDefault();
          this.navigateToHref(href);
        } else if (isSpace) {
          this.navigateToHref(href);
        }
        break;
      }
      default:
        break;
    }
  };

  private renderLabel(
    item: IdsAnchorMenuItem,
    index: number,
    isTruncated: boolean,
  ) {
    const nativeTitle =
      isTruncated && this.nativeTooltip ? item.label : undefined;

    const labelWithRef = html`
      <span
        class="ids-anchor-menu-label"
        title=${nativeTitle ?? nothing}
        ${ref((el) => {
          if (el instanceof HTMLSpanElement) {
            this.labelRefs.set(index, el);
          } else {
            this.labelRefs.delete(index);
          }
        })}
      >
        ${item.label}
      </span>
    `;

    if (isTruncated && !this.nativeTooltip) {
      return html`
        <ids-tooltip side=${this.tooltipSide} arrowalign="start">
          <ids-tooltip-trigger display="inline">
            ${labelWithRef}
          </ids-tooltip-trigger>
          <ids-tooltip-panel>
            <ids-tooltip-body>${item.label}</ids-tooltip-body>
          </ids-tooltip-panel>
        </ids-tooltip>
      `;
    }

    return labelWithRef;
  }

  private renderHeader() {
    if (!this.header) return nothing;

    const headerLabel = html`
      <span
        class="ids-anchor-menu-header-label"
        title=${this.headerTruncated && this.nativeTooltip
          ? this.title
          : nothing}
      >
        ${this.title}
      </span>
    `;

    return html`
      <span class="ids-anchor-menu-header" data-ids="ids-anchor-menu-header">
        ${this.headerTruncated && !this.nativeTooltip
          ? html`
              <ids-tooltip side=${this.tooltipSide} arrowalign="start">
                <ids-tooltip-trigger display="block">
                  ${headerLabel}
                </ids-tooltip-trigger>
                <ids-tooltip-panel>
                  <ids-tooltip-body>${this.title}</ids-tooltip-body>
                </ids-tooltip-panel>
              </ids-tooltip>
            `
          : headerLabel}
      </span>
    `;
  }

  private renderItem(item: IdsAnchorMenuItem, index: number) {
    const navigable = hasNavigableHref(item.href);
    const href = navigable ? item.href : "";
    const isActive =
      navigable && this.activeHref !== undefined
        ? this.activeHref === item.href
        : Boolean(item.active);
    const isTruncated = this.truncatedIndexes.has(index);

    return html`
      <li class="ids-anchor-menu-item" data-ids="ids-anchor-menu-item">
        <a
          class="ids-anchor-menu-link"
          data-ids="ids-anchor-menu-link"
          href=${navigable ? href : nothing}
          aria-current=${isActive ? "page" : nothing}
          aria-disabled=${navigable ? nothing : "true"}
          tabindex=${navigable ? 0 : -1}
          ${ref((el) => {
            this.itemRefs[index] =
              el instanceof HTMLAnchorElement ? el : null;
          })}
          @click=${(event: MouseEvent) =>
            this.onItemClick(event, href, navigable)}
          @keydown=${(event: KeyboardEvent) =>
            this.onItemKeyDown(event, index, href, navigable)}
        >
          ${this.renderLabel(item, index, isTruncated)}
        </a>
      </li>
    `;
  }

  override render() {
    const safeItems = this.safeItems();
    this.itemRefs.length = safeItems.length;

    return html`
      <nav
        class=${classMap({
          "ids-anchor-menu": true,
          "ids-anchor-menu--sticky": this.sticky,
        })}
        data-ids="ids-anchor-menu"
        data-sticky=${this.sticky ? "true" : "false"}
        aria-label=${this.title}
      >
        ${this.renderHeader()}
        <ul class="ids-anchor-menu-list" data-ids="ids-anchor-menu-list">
          ${repeat(
            safeItems,
            (item, index) => `${item.href}-${index}`,
            (item, index) => this.renderItem(item, index),
          )}
        </ul>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-anchor-menu": IdsAnchorMenu;
  }
}
