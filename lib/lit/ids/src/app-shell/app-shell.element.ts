/**
 * IdsAppShell — Lit layout shell (projection-first).
 *
 * Tag: `ids-app-shell`
 * Spec: `components/ids/app-shell/design-spec.md`
 * Types/helpers: `./app-shell.constants.ts` (shell-owned only — no child demo data)
 *
 * Structure only. Project children with **their** APIs:
 *
 * ```html
 * <ids-app-shell .pages=${pages} breakpointpreset="fluid">
 *   <ids-masthead slot="masthead" productname="…">…</ids-masthead>
 *   <ids-main-menu-left slot="main-menu" .items=${…} .expanded=${…}>
 *   </ids-main-menu-left>
 *   <ids-footer slot="footer" hostname="…">…</ids-footer>
 * </ids-app-shell>
 * ```
 *
 * Shell-owned props: `pages`, `activePageId`, `defaultPageId`,
 * `showPageDescription`, `focusManagementOnNavigate`, `pageTitleLevel`,
 * `breakpointPreset`, `persistMenuExpanded`.
 *
 * Behavior: bubbled `ids-navigate` → page change; optional
 * `persistMenuExpanded` writes `ids.app-shell.menuExpanded` on
 * `ids-expanded-change`. Host binds Main Menu `.expanded` (use
 * `resolveMenuExpandedDefault` / `menuExpandedDefault` if needed).
 *
 * Live Figma: `43478:46307` (1920), `43478:90925` (1366).
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import {
  APP_SHELL_API_DEFAULTS,
  APP_SHELL_MAIN_CONTENT_ID,
  APP_SHELL_PAGE_DESCRIPTION_ID,
  MENU_EXPANDED_BREAKPOINT_PX,
  isDev,
  presetMenuExpandedDefault,
  readPersistedMenuExpanded,
  resolveBreakpointPreset,
  resolvePageIdFromTarget,
  resolvePageTitle,
  writePersistedMenuExpanded,
  type AppShellPage,
  type IdsAppShellBreakpointPreset,
  type IdsAppShellPageTitleLevel,
  type MainMenuLeftNavigationTarget,
} from "./app-shell.constants.js";
import { appShellHostStyles, appShellStyles } from "./app-shell.styles.js";

let appShellUid = 0;

export class IdsAppShell extends LitElement {
  static override styles = [appShellHostStyles, appShellStyles];

  private readonly instanceId = `ids-app-shell-${++appShellUid}`;

  /** Catalog of routable views (shell-owned page chrome + body content). */
  @property({ attribute: false })
  pages: AppShellPage[] = [];

  /** Controlled active page id. */
  @property({ type: String, attribute: "activepageid" })
  activePageId: string | undefined = undefined;

  /** Uncontrolled initial page. */
  @property({ type: String, attribute: "defaultpageid" })
  defaultPageId: string | undefined = undefined;

  @property({ attribute: false })
  showPageDescription = APP_SHELL_API_DEFAULTS.showPageDescription;

  @property({ attribute: false })
  focusManagementOnNavigate =
    APP_SHELL_API_DEFAULTS.focusManagementOnNavigate;

  @property({ type: Number, attribute: "pagetitlelevel" })
  pageTitleLevel: IdsAppShellPageTitleLevel =
    APP_SHELL_API_DEFAULTS.pageTitleLevel;

  /** QA frame pin (`fluid` | `1920` | `1600` | `1366` | `1024`). */
  @property({ type: String, attribute: "breakpointpreset" })
  breakpointPreset: IdsAppShellBreakpointPreset | string =
    APP_SHELL_API_DEFAULTS.breakpointPreset;

  /**
   * When true, persist projected Main Menu expand toggles to
   * `sessionStorage` key `ids.app-shell.menuExpanded`.
   * Host still owns `ids-main-menu-left.expanded` binding.
   */
  @property({ attribute: false })
  persistMenuExpanded = APP_SHELL_API_DEFAULTS.persistMenuExpanded;

  @property({ attribute: false })
  onPageChange?: (pageId: string, page: AppShellPage) => void;

  @state() private internalPageId = "";
  @state() private breakpointExpandedDefault = true;

  private readonly pageTitleRef = createRef<HTMLHeadingElement>();
  private mediaQuery: MediaQueryList | null = null;
  private defaultsApplied = false;
  private warnedEmptyPages = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsAppShell");
    if (!this.id) this.id = this.instanceId;
    this.applyInitialDefaults();
    this.bindBreakpointListener();
    // Capture projected Main Menu navigation / expand (light DOM → composed events).
    this.addEventListener("ids-navigate", this.onProjectedNavigate);
    this.addEventListener("ids-expanded-change", this.onProjectedExpandedChange);
    this.devValidate();
  }

  override disconnectedCallback(): void {
    this.unbindBreakpointListener();
    this.removeEventListener("ids-navigate", this.onProjectedNavigate);
    this.removeEventListener(
      "ids-expanded-change",
      this.onProjectedExpandedChange,
    );
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("breakpointPreset")) {
      this.unbindBreakpointListener();
      this.applyBreakpointDefault();
      this.bindBreakpointListener();
    }
    if (
      (changed.has("pages") || changed.has("defaultPageId")) &&
      this.activePageId === undefined
    ) {
      const fallback = this.defaultPageId ?? this.pages[0]?.id ?? "";
      if (!this.pages.find((p) => p.id === this.internalPageId)) {
        this.internalPageId = fallback;
      }
    }
    this.setAttribute(
      "data-breakpoint-preset",
      this.resolvedBreakpointPreset,
    );
    this.setAttribute(
      "data-menu-expanded-default",
      String(this.menuExpandedDefault),
    );
  }

  private applyInitialDefaults(): void {
    if (this.defaultsApplied) return;
    this.defaultsApplied = true;
    this.applyBreakpointDefault();
    this.internalPageId = this.defaultPageId ?? this.pages[0]?.id ?? "";
  }

  private applyBreakpointDefault(): void {
    const pinned = presetMenuExpandedDefault(this.resolvedBreakpointPreset);
    const next =
      pinned !== null
        ? pinned
        : typeof window === "undefined"
          ? true
          : window.matchMedia(
              `(min-width: ${MENU_EXPANDED_BREAKPOINT_PX}px)`,
            ).matches;
    if (next !== this.breakpointExpandedDefault) {
      this.breakpointExpandedDefault = next;
    }
  }

  private bindBreakpointListener(): void {
    if (typeof window === "undefined") return;
    if (presetMenuExpandedDefault(this.resolvedBreakpointPreset) !== null) {
      return;
    }
    this.mediaQuery = window.matchMedia(
      `(min-width: ${MENU_EXPANDED_BREAKPOINT_PX}px)`,
    );
    this.mediaQuery.addEventListener("change", this.onMediaChange);
  }

  private unbindBreakpointListener(): void {
    this.mediaQuery?.removeEventListener("change", this.onMediaChange);
    this.mediaQuery = null;
  }

  private readonly onMediaChange = (): void => {
    if (!this.mediaQuery) return;
    this.breakpointExpandedDefault = this.mediaQuery.matches;
  };

  get resolvedBreakpointPreset(): IdsAppShellBreakpointPreset {
    return resolveBreakpointPreset(this.breakpointPreset);
  }

  /**
   * Suggested Main Menu `expanded` for the host (breakpoint + optional persist).
   * Bind on projected `ids-main-menu-left`: `.expanded=${shell.menuExpandedDefault}`.
   */
  get menuExpandedDefault(): boolean {
    if (this.persistMenuExpanded) {
      const stored = readPersistedMenuExpanded();
      if (stored !== null) return stored;
    }
    return this.breakpointExpandedDefault;
  }

  get pageControlled(): boolean {
    return this.activePageId !== undefined;
  }

  get resolvedActivePageId(): string {
    return this.pageControlled
      ? (this.activePageId as string)
      : this.internalPageId;
  }

  get activePage(): AppShellPage | undefined {
    if (this.pages.length === 0) return undefined;
    const found = this.pages.find((p) => p.id === this.resolvedActivePageId);
    if (found) return found;
    const fallback = this.defaultPageId ?? this.pages[0]?.id ?? "";
    if (isDev() && this.resolvedActivePageId) {
      console.warn(
        `[AppShell] Unknown activePageId "${this.resolvedActivePageId}"; falling back to "${fallback || this.pages[0].id}".`,
      );
    }
    return this.pages.find((p) => p.id === fallback) ?? this.pages[0];
  }

  get showDescription(): boolean {
    const page = this.activePage;
    return (
      this.showPageDescription &&
      page?.showDescription !== false &&
      Boolean(page?.description)
    );
  }

  get resolvedPageTitleLevel(): IdsAppShellPageTitleLevel {
    return this.pageTitleLevel === 2 ? 2 : 1;
  }

  private setActivePage(pageId: string): void {
    const page = this.pages.find((entry) => entry.id === pageId);
    if (!page) return;
    if (!this.pageControlled) {
      this.internalPageId = pageId;
    }
    this.onPageChange?.(pageId, page);
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { pageId, page },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("onPageChange", {
        detail: { pageId, page },
        bubbles: true,
        composed: true,
      }),
    );
    if (this.focusManagementOnNavigate) {
      requestAnimationFrame(() => this.pageTitleRef.value?.focus());
    }
  }

  private readonly onProjectedNavigate = (event: Event): void => {
    const target = (event as CustomEvent<MainMenuLeftNavigationTarget>).detail;
    if (!target) return;
    const pageId = resolvePageIdFromTarget(target, this.pages);
    if (pageId) this.setActivePage(pageId);
  };

  private readonly onProjectedExpandedChange = (event: Event): void => {
    if (!this.persistMenuExpanded) return;
    const detail = (event as CustomEvent<boolean | { expanded: boolean }>)
      .detail;
    const expanded =
      typeof detail === "boolean"
        ? detail
        : Boolean((detail as { expanded?: boolean })?.expanded);
    writePersistedMenuExpanded(expanded);
  };

  private devValidate(): void {
    if (!isDev()) return;
    if (this.pages.length === 0 && !this.warnedEmptyPages) {
      this.warnedEmptyPages = true;
      console.error(
        "[AppShell] pages[] is empty; rendering page header with empty title and body.",
      );
    }
  }

  private renderPageTitle() {
    const title = resolvePageTitle(this.activePage);
    const level = this.resolvedPageTitleLevel;
    const tabIndex = this.focusManagementOnNavigate ? -1 : undefined;
    if (level === 2) {
      return html`
        <h2
          ${ref(this.pageTitleRef)}
          class="IdsAppShellPageTitle"
          data-ids="IdsAppShellPageTitle"
          tabindex=${tabIndex ?? nothing}
        >
          ${title}
        </h2>
      `;
    }
    return html`
      <h1
        ${ref(this.pageTitleRef)}
        class="IdsAppShellPageTitle"
        data-ids="IdsAppShellPageTitle"
        tabindex=${tabIndex ?? nothing}
      >
        ${title}
      </h1>
    `;
  }

  private renderPageDescription() {
    if (!this.showDescription) return nothing;
    const description = this.activePage?.description;
    if (!description) return nothing;
    return html`
      <p
        id=${APP_SHELL_PAGE_DESCRIPTION_ID}
        class="IdsAppShellPageDescription"
        data-ids="IdsAppShellPageDescription"
      >
        ${description}
      </p>
    `;
  }

  override render() {
    return html`
      <div
        class="IdsAppShell"
        data-ids="IdsAppShell"
        data-breakpoint-preset=${this.resolvedBreakpointPreset}
      >
        <div
          class="IdsAppShellMastheadSlot"
          data-ids="IdsAppShellMastheadSlot"
        >
          <slot name="masthead"></slot>
        </div>
        <div class="IdsAppShellBodyRow" data-ids="IdsAppShellBodyRow">
          <div
            class="IdsAppShellMainMenuSlot"
            data-ids="IdsAppShellMainMenuSlot"
          >
            <slot name="main-menu"></slot>
          </div>
          <main
            id=${APP_SHELL_MAIN_CONTENT_ID}
            class="IdsAppShellMainColumn"
            data-ids="IdsAppShellMainColumn"
            aria-describedby=${this.showDescription
              ? APP_SHELL_PAGE_DESCRIPTION_ID
              : nothing}
          >
            <div
              class="IdsAppShellPageHeader"
              data-ids="IdsAppShellPageHeader"
            >
              ${this.renderPageTitle()} ${this.renderPageDescription()}
            </div>
            <div
              class="IdsAppShellBodyViewport"
              data-ids="IdsAppShellBodyViewport"
            >
              <div
                class="IdsAppShellBodyContentSlot"
                data-ids="IdsAppShellBodyContentSlot"
              >
                <slot name="body">${this.activePage?.content ?? nothing}</slot>
              </div>
            </div>
            <div
              class="IdsAppShellFooterSlot"
              data-ids="IdsAppShellFooterSlot"
            >
              <slot name="footer"></slot>
            </div>
          </main>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-app-shell": IdsAppShell;
  }
}
