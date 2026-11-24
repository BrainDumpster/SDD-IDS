/**
 * IdsToastItem — Lit web component.
 *
 * Tag: `ids-toast-item`
 * Spec: `components/ids/toast/design-spec.md`
 * API: `lib/react/ids/toast` (`IdsToastItem`)
 *
 * Anatomy (React-inline slots):
 *   ToastItem
 *     Content → IconContainer → StatusIcon; Message
 *     ActionContainer → ViewDetailsAction?; CloseAction?
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import "../icon/register.js";
import "../icon-button/register.js";
import {
  DEFAULT_DURATION,
  DEFAULT_ROLE,
  DEFAULT_TYPE,
  TOAST_TYPE_ICON,
  defaultTrueBooleanConverter,
  resolveToastDuration,
  resolveToastRole,
  resolveToastType,
  warnMissingToastIcon,
  type IdsToastCloseReason,
  type IdsToastLink,
  type IdsToastRole,
  type IdsToastType,
} from "./toast.constants.js";
import { toastItemStyles } from "./toast.styles.js";

export class IdsToastItem extends LitElement {
  static override styles = [toastItemStyles];

  /**
   * Toast payload id (uses the host HTML `id` attribute).
   * Prefer setting `id="…"` on `<ids-toast-item>`; included in close/timeout detail.
   */

  @property({ type: String, reflect: true })
  type: IdsToastType | string = DEFAULT_TYPE;

  @property({ type: String })
  message = "";

  /** Host timeout ms. Default `8000`. `0` disables auto-dismiss. Invalid → `8000`. */
  @property({ type: Number })
  duration = DEFAULT_DURATION;

  @property({
    converter: defaultTrueBooleanConverter,
    reflect: true,
  })
  closable = true;

  /** Structured view-details link (property only — not reflected). */
  @property({ attribute: false })
  link?: IdsToastLink;

  /**
   * Item ARIA role. Default `status`. Synced to the host `role` attribute.
   * Attribute: `itemrole` (avoids clashing with the native Element.role setter).
   */
  @property({ type: String, attribute: "itemrole" })
  itemRole: IdsToastRole | string = DEFAULT_ROLE;

  /** React API parity — called on dismiss (close-click | timeout | programmatic). */
  @property({ attribute: false })
  onClose?: (detail: { id?: string; reason: IdsToastCloseReason }) => void;

  /** React API parity — called when auto-dismiss timer fires. */
  @property({ attribute: false })
  onTimeout?: (detail: { id?: string }) => void;

  private remainingMs = DEFAULT_DURATION;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private timerStartedAt: number | null = null;
  private timerPaused = false;
  private dismissed = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-toast-item");
    this.tabIndex = -1;
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
    this.addEventListener("focusin", this.onFocusIn);
    this.addEventListener("focusout", this.onFocusOut);
    this.addEventListener("keydown", this.onKeyDown);
  }

  override disconnectedCallback(): void {
    this.clearTimer();
    this.removeEventListener("mouseenter", this.onMouseEnter);
    this.removeEventListener("mouseleave", this.onMouseLeave);
    this.removeEventListener("focusin", this.onFocusIn);
    this.removeEventListener("focusout", this.onFocusOut);
    this.removeEventListener("keydown", this.onKeyDown);
    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.remainingMs = this.resolvedDuration;
    this.timerPaused = false;
    this.startTimer();
    this.warnIfIconMissing();
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    const resolvedType = this.resolvedType;
    this.setAttribute("data-type", resolvedType);
    this.setAttribute("role", this.resolvedRole);

    if (changed.has("duration") && changed.get("duration") !== undefined) {
      this.remainingMs = this.resolvedDuration;
      this.timerPaused = false;
      this.startTimer();
    }
  }

  get resolvedType(): IdsToastType {
    return resolveToastType(this.type);
  }

  get resolvedDuration(): number {
    return resolveToastDuration(this.duration);
  }

  get resolvedRole(): IdsToastRole {
    return resolveToastRole(this.itemRole);
  }

  get iconShape(): string {
    return TOAST_TYPE_ICON[this.resolvedType];
  }

  /**
   * Programmatic dismiss — invokes `onClose` / `onTimeout` (React API) and
   * dispatches matching DOM events `onClose` / `onTimeout`.
   */
  dismiss(reason: IdsToastCloseReason = "programmatic"): void {
    if (this.dismissed) return;
    this.dismissed = true;
    this.clearTimer();
    this.setAttribute("hidden", "");
    const id = this.id || undefined;
    const closeDetail = { id, reason };
    this.onClose?.(closeDetail);
    this.dispatchEvent(
      new CustomEvent("onClose", {
        detail: closeDetail,
        bubbles: true,
        composed: true,
      }),
    );
    if (reason === "timeout") {
      const timeoutDetail = { id };
      this.onTimeout?.(timeoutDetail);
      this.dispatchEvent(
        new CustomEvent("onTimeout", {
          detail: timeoutDetail,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private warnIfIconMissing(): void {
    const shape = this.iconShape;
    const missing = this.renderRoot.querySelector(
      `[data-ids="ids-icon"][data-shape="${shape}"][data-missing="true"]`,
    );
    if (missing) warnMissingToastIcon(shape);
  }

  private onMouseEnter = (): void => {
    this.pauseTimer();
  };

  private onMouseLeave = (): void => {
    this.resumeTimer();
  };

  private onFocusIn = (): void => {
    this.pauseTimer();
  };

  private onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && this.isFocusWithin(next)) return;
    this.resumeTimer();
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    const active = document.activeElement;
    if (active && this.isFocusWithin(active)) {
      event.preventDefault();
      this.dismiss("close-click");
    }
  };

  /** Focus can sit inside the open shadow root — `Node.contains` does not pierce it. */
  private isFocusWithin(node: Node): boolean {
    return (
      node === this ||
      this.contains(node) ||
      Boolean(this.shadowRoot?.contains(node))
    );
  }

  private startTimer(): void {
    this.clearTimer();
    if (this.dismissed) return;
    const duration = this.resolvedDuration;
    if (duration <= 0 || this.timerPaused) return;
    this.timerStartedAt = Date.now();
    this.timerId = setTimeout(() => this.dismiss("timeout"), this.remainingMs);
  }

  private pauseTimer(): void {
    if (this.resolvedDuration <= 0 || this.timerPaused) return;
    this.timerPaused = true;
    if (this.timerStartedAt != null) {
      const elapsed = Date.now() - this.timerStartedAt;
      this.remainingMs = Math.max(0, this.remainingMs - elapsed);
    }
    this.clearTimer();
  }

  private resumeTimer(): void {
    if (this.resolvedDuration <= 0) return;
    this.timerPaused = false;
    this.startTimer();
  }

  private clearTimer(): void {
    if (this.timerId != null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.timerStartedAt = null;
  }

  private onViewDetailsClick = (event: MouseEvent): void => {
    this.link?.onClick?.(event);
    this.dispatchEvent(
      new CustomEvent("ids-toast-view-details", {
        detail: { id: this.id || undefined, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private renderViewDetails() {
    const link = this.link;
    if (!link?.label) return nothing;

    const preferRouter = link.routerLink != null;
    const hasHref = Boolean(link.href) && !preferRouter;

    if (hasHref) {
      return html`
        <a
          class="ids-toast-view-details-anchor"
          href=${link.href!}
          target=${link.target || nothing}
          rel=${link.target === "_blank" ? "noopener noreferrer" : nothing}
          data-ids="ids-toast-view-details"
          @click=${this.onViewDetailsClick}
          >${link.label}</a
        >
      `;
    }

    return html`
      <button
        type="button"
        class="ids-toast-view-details"
        data-ids="ids-toast-view-details"
        @click=${this.onViewDetailsClick}
      >
        ${link.label}
      </button>
    `;
  }

  /* Design-spec: on the dark toast surface the close button's hover reuses
     its press state so the background shows up. External CSS cannot reach
     the icon button's shadow internals, so hover forces data-state="press"
     via its public API (cleared on leave). */
  private onCloseMouseEnter = (event: Event): void => {
    (
      event.currentTarget as HTMLElement & { dataState: string }
    ).dataState = "press";
  };

  private onCloseMouseLeave = (event: Event): void => {
    (
      event.currentTarget as HTMLElement & { dataState: string }
    ).dataState = "";
  };

  private renderClose() {
    if (!this.closable) return nothing;
    // IDS Icon Button (ghost neutral · small) — spec CloseAction. data-slot
    // keeps the toast marker; the host overwrites data-ids.
    return html`
      <ids-icon-button
        variant="ghostNeutral"
        size="small"
        shape="shape-x"
        arialabel="Dismiss notification"
        aria-label="Dismiss notification"
        data-slot="ids-toast-close"
        @mouseenter=${this.onCloseMouseEnter}
        @mouseleave=${this.onCloseMouseLeave}
        @ids-icon-button-click=${() => this.dismiss("close-click")}
      ></ids-icon-button>
    `;
  }

  override render() {
    const shape = this.iconShape;

    return html`
      <div class="ids-toast-content" data-ids="ids-toast-content">
        <div
          class="ids-toast-icon-container"
          data-ids="ids-toast-icon-container"
        >
          <ids-icon
            class="ids-toast-status-icon"
            shape=${shape}
            variant="img"
            size="16"
            aria-hidden="true"
          ></ids-icon>
        </div>
        <p class="ids-toast-message" data-ids="ids-toast-message">
          ${this.message}
        </p>
      </div>
      <div
        class="ids-toast-action-container"
        data-ids="ids-toast-action-container"
      >
        ${this.renderViewDetails()} ${this.renderClose()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-toast-item": IdsToastItem;
  }
}
