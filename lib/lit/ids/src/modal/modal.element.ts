/**
 * IdsModal — Lit web component root.
 *
 * Tag: `ids-modal`
 * Spec: `components/ids/modal/design-spec.md`
 * API: `lib/react/ids/modal` (`IdsModal` prop + compound composition)
 *
 * Anatomy:
 *   ids-modal
 *     overlay + surface
 *       ids-modal-header (severity? | ids-modal-title | ids-modal-close?)
 *       ids-modal-description?
 *       ids-modal-tabs? (multi-page)
 *       ids-modal-content?
 *       ids-modal-footer
 *
 * Events:
 *   open-change / onOpenChange  detail: boolean
 *   close / onClose
 *   primary-action / onPrimaryAction
 *   tertiary-action / onTertiaryAction
 *   secondary-action / onSecondaryAction
 *   page-change / onPageChange  detail: string
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { createRef, ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";
import "../button/register.js";
import "../icon/register.js";
import "../tab/register.js";
import {
  MODAL_ALERTING_TYPES,
  MODAL_API_DEFAULTS,
  MODAL_CLOSE_ICON_SLUG,
  MODAL_COMPOUND_TAGS,
  MODAL_DIALOG_TYPE_ICON,
  MODAL_FOOTER_CHECKBOX_LABEL,
  MODAL_TWO_BUTTON_TYPES,
  getFocusable,
  resolveModalLayer,
  resolveModalScenario,
  resolveModalSize,
  resolveModalType,
  type IdsModalLayer,
  type IdsModalPage,
  type IdsModalScenario,
  type IdsModalSize,
  type IdsModalType,
} from "./modal.constants.js";
import { modalHostStyles, modalStyles } from "./modal.styles.js";

let modalUid = 0;

function isModalPage(scenario: IdsModalScenario): boolean {
  return scenario === "single-page" || scenario === "multi-page";
}

export class IdsModal extends LitElement {
  static override styles = [modalHostStyles, modalStyles];

  private readonly instanceId = `ids-modal-${++modalUid}`;

  /**
   * Controlled open. Property binding only (`.open=`) — boolean attributes
   * coerce missing → false.
   */
  @property({ attribute: false })
  open: boolean | undefined = undefined;

  @property({ attribute: false })
  defaultOpen = MODAL_API_DEFAULTS.defaultOpen;

  @property({ type: String, reflect: true })
  scenario: IdsModalScenario | string = MODAL_API_DEFAULTS.scenario;

  @property({ type: String, reflect: true })
  type: IdsModalType | string = MODAL_API_DEFAULTS.type;

  @property({ type: String, reflect: true })
  size: IdsModalSize | string = MODAL_API_DEFAULTS.size;

  @property({ type: String, reflect: true })
  layer: IdsModalLayer | string = MODAL_API_DEFAULTS.layer;

  /** Avoid reflecting onto the native HTML `title` tooltip attribute. */
  @property({ type: String, attribute: "modaltitle" })
  title = "";

  @property({ type: String })
  description = "";

  @property({ attribute: false })
  closable = MODAL_API_DEFAULTS.closable;

  @property({ attribute: false })
  scrollBar = MODAL_API_DEFAULTS.scrollBar;

  /** Multi-page tab strip; default true when scenario is multi-page (React). */
  @property({ attribute: false })
  tabs: boolean | undefined = undefined;

  @property({ attribute: false })
  footerCheckbox = MODAL_API_DEFAULTS.footerCheckbox;

  @property({ attribute: false })
  fullScreen = MODAL_API_DEFAULTS.fullScreen;

  @property({ attribute: false })
  pages: IdsModalPage[] = [];

  @property({ type: String, attribute: "activepageid" })
  activePageId: string | undefined = undefined;

  @property({ type: String, attribute: "primaryactionlabel" })
  primaryActionLabel = "";

  @property({ type: String, attribute: "tertiaryactionlabel" })
  tertiaryActionLabel = "";

  @property({ type: String, attribute: "secondaryactionlabel" })
  secondaryActionLabel = "";

  @property({ attribute: false })
  enablePrimaryAction = MODAL_API_DEFAULTS.enablePrimaryAction;

  @property({ attribute: false })
  enableTertiaryAction = MODAL_API_DEFAULTS.enableTertiaryAction;

  @property({ attribute: false })
  enableSecondaryAction = MODAL_API_DEFAULTS.enableSecondaryAction;

  @property({ type: String, attribute: "labelledby" })
  labelledBy = "";

  @property({ type: String, attribute: "describedby" })
  describedBy = "";

  /** React API parity callbacks. */
  @property({ attribute: false })
  onOpenChange?: (open: boolean) => void;

  @property({ attribute: false })
  onClose?: () => void;

  @property({ attribute: false })
  onPrimaryAction?: () => void;

  @property({ attribute: false })
  onTertiaryAction?: () => void;

  @property({ attribute: false })
  onSecondaryAction?: () => void;

  @property({ attribute: false })
  onPageChange?: (pageId: string) => void;

  @state()
  private uncontrolledOpen: boolean = MODAL_API_DEFAULTS.defaultOpen;

  @state()
  private uncontrolledPageId = "";

  @state()
  private showScrollShadow = false;

  @state()
  private scrollbarWidth = 0;

  @state()
  private footerChecked = false;

  @state()
  private compound = false;

  private readonly surfaceRef = createRef<HTMLDivElement>();
  private readonly contentRef = createRef<HTMLDivElement>();
  private previouslyFocused: HTMLElement | null = null;
  private homeParent: Node | null = null;
  private homeNext: ChildNode | null = null;
  private mountedOnBody = false;
  private childObserver?: MutationObserver;
  private contentRo?: ResizeObserver;
  private defaultOpenApplied = false;
  private keydownBound = false;

  get titleId(): string {
    return `${this.id || this.instanceId}-title`;
  }

  get descriptionId(): string {
    return `${this.id || this.instanceId}-description`;
  }

  get resolvedScenario(): IdsModalScenario {
    return resolveModalScenario(this.scenario);
  }

  get resolvedType(): IdsModalType {
    return resolveModalType(this.type);
  }

  get resolvedSize(): IdsModalSize {
    return resolveModalSize(this.size);
  }

  get resolvedLayer(): IdsModalLayer {
    return resolveModalLayer(this.layer);
  }

  get resolvedOpen(): boolean {
    return this.open != null ? Boolean(this.open) : this.uncontrolledOpen;
  }

  get showTabs(): boolean {
    const scenario = this.resolvedScenario;
    if (scenario !== "multi-page") return false;
    return this.tabs ?? MODAL_API_DEFAULTS.tabs;
  }

  get resolvedActivePageId(): string {
    const list = this.pages ?? [];
    if (this.activePageId != null) return this.activePageId;
    return this.uncontrolledPageId || list[0]?.id || "";
  }

  get activePage(): IdsModalPage | undefined {
    const list = this.pages ?? [];
    const id = this.resolvedActivePageId;
    return list.find((p) => p.id === id) ?? list[0];
  }

  /** Light-DOM nodes that are not compound anatomy tags (prop-driven body). */
  get hasDefaultSlotContent(): boolean {
    return Array.from(this.childNodes).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return Boolean(node.textContent?.trim());
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        return !(MODAL_COMPOUND_TAGS as readonly string[]).includes(
          el.localName,
        );
      }
      return false;
    });
  }

  /** Public API used by `ids-modal-close`. */
  requestClose(): void {
    if (!this.closable) return;
    this.setOpen(false);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-modal");
    if (!this.id) this.id = this.instanceId;
    if (!this.defaultOpenApplied) {
      this.uncontrolledOpen = this.defaultOpen;
      this.defaultOpenApplied = true;
    }
    this.refreshCompound();
    this.childObserver = new MutationObserver(() => {
      this.refreshCompound();
      this.requestUpdate();
    });
    this.childObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    this.teardownFocusTrap();
    this.contentRo?.disconnect();
    this.contentRo = undefined;
    this.childObserver?.disconnect();
    this.restoreHome();
    super.disconnectedCallback();
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("defaultOpen") && this.open == null && !this.defaultOpenApplied) {
      this.uncontrolledOpen = this.defaultOpen;
      this.defaultOpenApplied = true;
    }
    if (changed.has("pages") && this.activePageId == null) {
      const first = this.pages?.[0]?.id ?? "";
      if (!this.uncontrolledPageId && first) this.uncontrolledPageId = first;
    }
  }

  override updated(changed: Map<string, unknown>): void {
    const isOpen = this.resolvedOpen;
    if (isOpen) this.setAttribute("data-open", "");
    else this.removeAttribute("data-open");

    if (isOpen) {
      this.mountOnBody();
      this.setupFocusTrap();
      this.syncScrollShadow();
    } else {
      this.teardownFocusTrap();
      this.contentRo?.disconnect();
      this.contentRo = undefined;
      this.showScrollShadow = false;
      this.restoreHome();
    }

    if (
      changed.has("scrollBar") ||
      changed.has("pages") ||
      changed.has("activePageId") ||
      changed.has("description") ||
      changed.has("type") ||
      changed.has("scenario") ||
      changed.has("open")
    ) {
      this.syncScrollShadow();
    }
  }

  private refreshCompound(): void {
    this.compound = Array.from(this.children).some((child) =>
      (MODAL_COMPOUND_TAGS as readonly string[]).includes(child.localName),
    );
  }

  private setOpen(next: boolean): void {
    if (this.open == null) this.uncontrolledOpen = next;
    this.onOpenChange?.(next);
    this.dispatchEvent(
      new CustomEvent("open-change", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    if (!next) {
      this.onClose?.();
      this.dispatchEvent(
        new CustomEvent("close", { bubbles: true, composed: true }),
      );
    }
    this.requestUpdate();
  }

  private setActivePageId(pageId: string): void {
    if (this.activePageId == null) this.uncontrolledPageId = pageId;
    this.onPageChange?.(pageId);
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: pageId,
        bubbles: true,
        composed: true,
      }),
    );
    this.requestUpdate();
  }

  private mountOnBody(): void {
    if (typeof document === "undefined" || this.mountedOnBody) return;
    if (this.parentElement === document.body) {
      this.mountedOnBody = true;
      return;
    }
    this.homeParent = this.parentNode;
    this.homeNext = this.nextSibling;
    document.body.appendChild(this);
    this.mountedOnBody = true;
  }

  private restoreHome(): void {
    if (!this.mountedOnBody || !this.homeParent) {
      this.mountedOnBody = false;
      return;
    }
    try {
      this.homeParent.insertBefore(this, this.homeNext);
    } catch {
      /* parent may have been removed */
    }
    this.homeParent = null;
    this.homeNext = null;
    this.mountedOnBody = false;
  }

  private setupFocusTrap(): void {
    if (this.keydownBound || typeof document === "undefined") return;
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.keydownBound = true;
    document.addEventListener("keydown", this.onDocumentKeyDown);

    queueMicrotask(() => {
      const surface = this.surfaceRef.value;
      if (!surface) return;
      const focusables = getFocusable(surface);
      (focusables[0] ?? surface).focus();
    });
  }

  private teardownFocusTrap(): void {
    if (!this.keydownBound || typeof document === "undefined") return;
    document.removeEventListener("keydown", this.onDocumentKeyDown);
    this.keydownBound = false;
    this.previouslyFocused?.focus?.();
    this.previouslyFocused = null;
  }

  private onDocumentKeyDown = (event: KeyboardEvent): void => {
    if (!this.resolvedOpen) return;
    if (event.key === "Escape") {
      if (this.closable) {
        event.preventDefault();
        this.requestClose();
      }
      return;
    }
    if (event.key !== "Tab") return;
    const surface = this.surfaceRef.value;
    if (!surface) return;
    const items = getFocusable(surface);
    if (items.length === 0) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey) {
      if (active === first || !surface.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  private syncScrollShadow(): void {
    if (!this.resolvedOpen || !this.scrollBar) {
      this.showScrollShadow = false;
      this.contentRo?.disconnect();
      this.contentRo = undefined;
      return;
    }

    queueMicrotask(() => {
      const el =
        this.contentRef.value ??
        (this.querySelector("ids-modal-content") as HTMLElement | null);
      if (!el) {
        this.showScrollShadow = false;
        return;
      }

      const update = () => {
        const scrollable = el.scrollHeight - el.clientHeight > 1;
        const atBottom =
          el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        this.showScrollShadow = scrollable && !atBottom;
        this.scrollbarWidth = el.offsetWidth - el.clientWidth;
      };

      update();
      el.addEventListener("scroll", update, { passive: true });
      this.contentRo?.disconnect();
      this.contentRo = new ResizeObserver(update);
      this.contentRo.observe(el);
    });
  }

  private onOverlayClick = (): void => {
    if (this.closable) this.requestClose();
  };

  private onSurfaceClick = (event: Event): void => {
    event.stopPropagation();
  };

  private emitPrimary = (): void => {
    this.onPrimaryAction?.();
    this.dispatchEvent(
      new CustomEvent("primary-action", { bubbles: true, composed: true }),
    );
  };

  private emitTertiary = (): void => {
    this.onTertiaryAction?.();
    this.dispatchEvent(
      new CustomEvent("tertiary-action", { bubbles: true, composed: true }),
    );
  };

  private emitSecondary = (): void => {
    this.onSecondaryAction?.();
    this.dispatchEvent(
      new CustomEvent("secondary-action", { bubbles: true, composed: true }),
    );
  };

  private renderPropDriven() {
    const scenario = this.resolvedScenario;
    const type = this.resolvedType;
    const multiAction =
      scenario !== "dialog" || MODAL_TWO_BUTTON_TYPES.has(type);
    const showTertiary = Boolean(this.tertiaryActionLabel) && multiAction;
    const showSecondary = Boolean(this.secondaryActionLabel) && multiAction;
    const primaryVariant = type === "destructive" ? "destructive" : "primary";
    const pageList = this.pages ?? [];
    const showIcon = scenario === "dialog" && type !== "non-alerting";
    const severitySlug = showIcon
      ? MODAL_DIALOG_TYPE_ICON[type as Exclude<IdsModalType, "non-alerting">]
      : null;
    const descriptionTypeClass = `ids-modal-description--${type}`;
    const contentAlerting = MODAL_ALERTING_TYPES.has(type);

    return html`
      <header class="ids-modal-header" data-ids="ids-modal-header">
        <div class="ids-modal-header-left">
          ${severitySlug
            ? html`
                <span
                  class="ids-modal-severity-icon"
                  data-ids="ids-modal-severity-icon"
                  aria-hidden="true"
                >
                  <ids-icon
                    shape=${severitySlug}
                    variant="img"
                    size="24"
                  ></ids-icon>
                </span>
              `
            : nothing}
          <h2
            id=${this.titleId}
            class="ids-modal-title"
            data-ids="ids-modal-title"
          >
            ${this.title}
          </h2>
        </div>
        ${this.closable
          ? html`
              <div class="ids-modal-header-controls">
                <ids-button
                  type="button"
                  variant="ghostNeutral"
                  size="medium"
                  icononly
                  iconslug=${MODAL_CLOSE_ICON_SLUG}
                  arialabel="Close"
                  data-ids="ids-modal-close"
                  @ids-button-click=${() => this.requestClose()}
                ></ids-button>
              </div>
            `
          : nothing}
      </header>

      ${this.description
        ? html`
            <p
              id=${this.descriptionId}
              class="ids-modal-description ${descriptionTypeClass}"
              data-ids="ids-modal-description"
            >
              ${this.description}
            </p>
          `
        : nothing}

      ${this.showTabs
        ? pageList.length === 0
          ? html`<p class="ids-modal-empty">No pages available.</p>`
          : html`
              <div class="ids-modal-tabs" data-ids="ids-modal-tabs">
                <ids-tabs
                  type="primary"
                  surface="transparent"
                  .items=${pageList.map((page) => ({
                    id: page.id,
                    label: page.label,
                    content: null,
                  }))}
                  activeitemid=${this.resolvedActivePageId}
                  @active-item-change=${(e: CustomEvent<string>) =>
                    this.setActivePageId(e.detail)}
                ></ids-tabs>
              </div>
            `
        : nothing}

      ${scenario === "multi-page"
        ? html`
            <div
              ${ref(this.contentRef)}
              class=${classMap({
                "ids-modal-content": true,
                "ids-modal-content--scroll": this.scrollBar,
                [`ids-modal-content--${type}`]: contentAlerting,
              })}
              data-ids="ids-modal-content"
            >
              ${this.activePage?.content ??
              html`<p class="ids-modal-empty">No pages available.</p>`}
            </div>
          `
        : this.hasDefaultSlotContent
          ? html`
              <div
                ${ref(this.contentRef)}
                class=${classMap({
                  "ids-modal-content": true,
                  "ids-modal-content--scroll": this.scrollBar,
                  [`ids-modal-content--${type}`]: contentAlerting,
                })}
                data-ids="ids-modal-content"
              >
                <slot></slot>
              </div>
            `
          : nothing}

      ${this.showScrollShadow
        ? html`
            <div
              class="ids-modal-content-scroll-shadow"
              style=${styleMap({ marginRight: `${this.scrollbarWidth}px` })}
              aria-hidden="true"
            ></div>
          `
        : nothing}

      <footer class="ids-modal-footer" data-ids="ids-modal-footer">
        ${this.footerCheckbox
          ? html`
              <div class="ids-modal-footer-start">
                <label class="ids-modal-footer-checkbox">
                  <input
                    type="checkbox"
                    .checked=${this.footerChecked}
                    @change=${(e: Event) => {
                      this.footerChecked = (
                        e.target as HTMLInputElement
                      ).checked;
                    }}
                  />
                  ${MODAL_FOOTER_CHECKBOX_LABEL}
                </label>
              </div>
            `
          : nothing}
        <div class="ids-modal-footer-actions">
          ${showTertiary
            ? html`
                <ids-button
                  variant="tertiary"
                  size="large"
                  ?disabled=${!this.enableTertiaryAction}
                  label=${this.tertiaryActionLabel}
                  @ids-button-click=${this.emitTertiary}
                ></ids-button>
              `
            : nothing}
          ${showSecondary
            ? html`
                <ids-button
                  variant="secondary"
                  size="large"
                  ?disabled=${!this.enableSecondaryAction}
                  label=${this.secondaryActionLabel}
                  @ids-button-click=${this.emitSecondary}
                ></ids-button>
              `
            : nothing}
          <ids-button
            variant=${primaryVariant}
            size="large"
            ?disabled=${!this.enablePrimaryAction}
            label=${this.primaryActionLabel}
            @ids-button-click=${this.emitPrimary}
          ></ids-button>
        </div>
      </footer>
    `;
  }

  override render() {
    if (!this.resolvedOpen) return nothing;

    const scenario = this.resolvedScenario;
    const type = this.resolvedType;
    const size = this.resolvedSize;
    const layer = this.resolvedLayer;
    const page = isModalPage(scenario);
    const overlayLayerClass =
      layer === "carousel"
        ? "ids-modal-overlay--carousel"
        : layer === "single-preview"
          ? "ids-modal-overlay--single-preview"
          : "";
    const surfaceLayerClass =
      layer === "carousel"
        ? "ids-modal-surface--carousel"
        : layer === "single-preview"
          ? "ids-modal-surface--single-preview"
          : "";
    const sizeClass = this.fullScreen
      ? "ids-modal-surface--full-screen"
      : scenario === "dialog"
        ? "ids-modal-surface--dialog"
        : `ids-modal-surface--${size}`;

    const labelledBy = this.labelledBy || this.titleId;
    const describedBy =
      this.describedBy ||
      (this.description || this.querySelector("ids-modal-description")
        ? this.descriptionId
        : undefined);

    return html`
      <div
        class="ids-modal-overlay ${overlayLayerClass}"
        data-ids="ids-modal-overlay"
        @click=${this.onOverlayClick}
      ></div>
      <div
        ${ref(this.surfaceRef)}
        class=${classMap({
          "ids-modal-surface": true,
          [sizeClass]: true,
          "ids-modal-surface--page": page,
          [surfaceLayerClass]: Boolean(surfaceLayerClass),
        })}
        role="dialog"
        aria-modal="true"
        aria-labelledby=${labelledBy}
        aria-describedby=${ifDefined(describedBy)}
        data-ids="ids-modal-surface"
        data-scenario=${scenario}
        data-type=${type}
        data-size=${ifDefined(scenario === "dialog" ? undefined : size)}
        data-layer=${layer}
        tabindex="-1"
        @click=${this.onSurfaceClick}
      >
        ${this.compound
          ? html`
              <slot></slot>
              ${this.showScrollShadow
                ? html`
                    <div
                      class="ids-modal-content-scroll-shadow"
                      style=${styleMap({
                        marginRight: `${this.scrollbarWidth}px`,
                      })}
                      aria-hidden="true"
                    ></div>
                  `
                : nothing}
            `
          : this.renderPropDriven()}
      </div>
    `;
  }
}
