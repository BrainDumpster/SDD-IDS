/**
 * IdsFooter — Lit web component.
 *
 * Tag: `ids-footer`
 * Spec: `components/ids/footer/design-spec.md`
 * API: `lib/react/ids/footer` (`IdsFooter` prop API)
 * Angular composition children live under `lib/angular/ids/footer/` —
 * Lit matches the React runtime prop/event contract used by Spec Accurate Design.
 *
 * Anatomy:
 *   FooterRoot
 *     FooterLeftRegion (HostName? + SwidGroup?)
 *     FooterTimeGroup?
 *     FooterTimeZoneGroup? (IdsButton tertiary/small + world-globe)
 *
 * Events:
 *   copy-swid / onCopySwid  detail: string
 *   time-zone-click / onTimeZoneClick
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import "../icon/register.js";
import "../button/register.js";
import "../tooltip/register.js";
import "../toast/register.js";
import type { IdsToastQueueItem } from "../toast/toast.constants.js";
import {
  COMPACT_BREAKPOINT_PX,
  FOOTER_API_DEFAULTS,
  HOSTNAME_MAX_CHARS,
  copyTextToClipboard,
  resolveShowFlag,
  truncateHostname,
} from "./footer.constants.js";
import { footerStyles } from "./footer.styles.js";

export class IdsFooter extends LitElement {
  static override styles = [footerStyles];

  @property({ type: String })
  hostname = "";

  @property({ type: String })
  swid = "";

  @property({ type: String, attribute: "currentdatetime" })
  currentDateTime = "";

  @property({ type: String, attribute: "timezonelabel" })
  timeZoneLabel = "";

  /**
   * Visibility flags default `true` (Figma). Bound as properties in Storybook
   * (`.showHostname=`) so Lit boolean-attribute coercion does not force `false`.
   */
  @property({ attribute: false })
  showHostname = FOOTER_API_DEFAULTS.showHostname;

  @property({ attribute: false })
  showCurrentDateAndTime = FOOTER_API_DEFAULTS.showCurrentDateAndTime;

  @property({ attribute: false })
  showTimeZone = FOOTER_API_DEFAULTS.showTimeZone;

  @property({ type: Boolean, attribute: "copydisabled" })
  copyDisabled = FOOTER_API_DEFAULTS.copyDisabled;

  @property({ type: Boolean, attribute: "timezonedisabled" })
  timeZoneDisabled = FOOTER_API_DEFAULTS.timeZoneDisabled;

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = FOOTER_API_DEFAULTS.ariaLabel;

  /** React API parity — fired after copy attempt. */
  @property({ attribute: false })
  onCopySwid?: (swid: string) => void;

  /** React API parity — fired when time-zone control activated. */
  @property({ attribute: false })
  onTimeZoneClick?: () => void;

  @state()
  private isCompact = false;

  @state()
  private isOverflowed = false;

  @state()
  private toasts: IdsToastQueueItem[] = [];

  private readonly hostnameValueRef = createRef<HTMLSpanElement>();
  private mediaQuery: MediaQueryList | null = null;
  private resizeObserver: ResizeObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-footer");
    if (typeof window !== "undefined") {
      this.mediaQuery = window.matchMedia(
        `(max-width: ${COMPACT_BREAKPOINT_PX}px)`,
      );
      this.isCompact = this.mediaQuery.matches;
      this.mediaQuery.addEventListener("change", this.onMediaChange);
    }
  }

  override disconnectedCallback(): void {
    this.mediaQuery?.removeEventListener("change", this.onMediaChange);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    super.disconnectedCallback();
  }

  override updated(): void {
    const valueEl = this.hostnameValueRef.value;
    if (!valueEl) {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      return;
    }

    const updateOverflow = () => {
      const next = valueEl.scrollWidth > valueEl.clientWidth;
      if (next !== this.isOverflowed) this.isOverflowed = next;
    };

    updateOverflow();

    if (!this.resizeObserver && typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(updateOverflow);
      this.resizeObserver.observe(valueEl);
    }
  }

  private onMediaChange = (): void => {
    this.isCompact = this.mediaQuery?.matches ?? false;
  };

  private get resolvedShowHostname(): boolean {
    return resolveShowFlag(this.showHostname);
  }

  private get resolvedShowCurrentDateAndTime(): boolean {
    return resolveShowFlag(this.showCurrentDateAndTime);
  }

  private get resolvedShowTimeZone(): boolean {
    return resolveShowFlag(this.showTimeZone);
  }

  private get truncatedHostname(): string {
    return truncateHostname(this.hostname ?? "");
  }

  private get zoneLabel(): string {
    return this.timeZoneLabel != null && this.timeZoneLabel !== ""
      ? this.timeZoneLabel
      : FOOTER_API_DEFAULTS.timeZoneFallbackLabel;
  }

  private get hasSwid(): boolean {
    return this.swid != null && this.swid !== "";
  }

  private get canCopy(): boolean {
    return this.hasSwid && !this.copyDisabled;
  }

  private get showDateTimeTooltip(): boolean {
    return (
      this.isCompact &&
      this.resolvedShowCurrentDateAndTime &&
      (this.currentDateTime ?? "") !== ""
    );
  }

  private get showHostnameTooltip(): boolean {
    return (
      this.isOverflowed || (this.hostname ?? "").length >= HOSTNAME_MAX_CHARS
    );
  }

  private async handleCopy(): Promise<void> {
    if (!this.canCopy || !this.swid) return;
    try {
      await copyTextToClipboard(this.swid);
      this.toasts = [
        ...this.toasts,
        {
          id: `copy-toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: "success",
          message: "Copied",
          closable: true,
          role: "status",
        },
      ];
    } catch {
      /* Clipboard failure still notifies host via onCopySwid (spec fallback). */
    }
    this.onCopySwid?.(this.swid);
    this.dispatchEvent(
      new CustomEvent("copy-swid", {
        detail: this.swid,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("onCopySwid", {
        detail: this.swid,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleTimeZoneClick(): void {
    if (this.timeZoneDisabled) return;
    this.onTimeZoneClick?.();
    this.dispatchEvent(
      new CustomEvent("time-zone-click", {
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("onTimeZoneClick", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private renderHostnameValue() {
    return html`
      <span ${ref(this.hostnameValueRef)} class="ids-footer-hostname-text">
        ${this.truncatedHostname}
      </span>
    `;
  }

  private renderHostname() {
    if (!this.resolvedShowHostname) return nothing;

    const value = this.showHostnameTooltip
      ? html`
          <ids-tooltip hugcontent side="top">
            <ids-tooltip-trigger display="block" tabindex="0">
              ${this.renderHostnameValue()}
            </ids-tooltip-trigger>
            <ids-tooltip-panel>
              <ids-tooltip-body>
                <span class="ids-footer-hostname-tooltip">${this.hostname}</span>
              </ids-tooltip-body>
            </ids-tooltip-panel>
          </ids-tooltip>
        `
      : this.renderHostnameValue();

    return html`
      <div
        class="ids-footer-field ids-footer-hostname"
        data-ids="ids-footer-hostname"
      >
        <span class="ids-footer-label">Host Name:</span>
        <span class="ids-footer-hostname-value">${value}</span>
      </div>
    `;
  }

  private renderSwid() {
    if (!this.hasSwid) return nothing;

    return html`
      <div class="ids-footer-swid-group" data-ids="ids-footer-swid-group">
        <div class="ids-footer-field">
          <span class="ids-footer-label">SWID:</span>
          <span class="ids-footer-value">${this.swid}</span>
        </div>
        <button
          type="button"
          class="ids-footer-copy"
          data-ids="ids-footer-copy"
          aria-label="Copy SWID"
          aria-disabled=${this.canCopy ? nothing : "true"}
          ?disabled=${!this.canCopy}
          @click=${() => void this.handleCopy()}
        >
          <ids-icon
            shape="copy"
            variant="mask"
            size="14"
            color="currentColor"
          ></ids-icon>
        </button>
      </div>
    `;
  }

  private renderTimeGroup() {
    if (!this.resolvedShowCurrentDateAndTime || this.isCompact) return nothing;

    return html`
      <div class="ids-footer-time-group" data-ids="ids-footer-time-group">
        <ids-icon
          shape="time-clock"
          variant="mask"
          size="16"
          color="var(--color-icon-gray-neutral-base)"
        ></ids-icon>
        <span class="ids-footer-datetime">${this.currentDateTime}</span>
      </div>
    `;
  }

  private renderTimeZoneButton() {
    return html`
      <ids-button
        type="button"
        variant="tertiary"
        size="small"
        ?disabled=${this.timeZoneDisabled}
        .label=${this.zoneLabel}
        iconslug="world-globe"
        @click=${() => this.handleTimeZoneClick()}
      ></ids-button>
    `;
  }

  private renderTimeZone() {
    if (!this.resolvedShowTimeZone) return nothing;

    const control = this.showDateTimeTooltip
      ? html`
          <ids-tooltip hugcontent side="top">
            <ids-tooltip-trigger> ${this.renderTimeZoneButton()} </ids-tooltip-trigger>
            <ids-tooltip-panel>
              <ids-tooltip-body>
                <span class="ids-footer-datetime-tooltip"
                  >${this.currentDateTime}</span
                >
              </ids-tooltip-body>
            </ids-tooltip-panel>
          </ids-tooltip>
        `
      : this.renderTimeZoneButton();

    return html`
      <div
        class="ids-footer-timezone-group"
        data-ids="ids-footer-timezone-group"
      >
        ${control}
      </div>
    `;
  }

  override render() {
    return html`
      <footer
        class="ids-footer"
        data-ids="ids-footer"
        aria-label=${this.ariaLabel || FOOTER_API_DEFAULTS.ariaLabel}
      >
        <div class="ids-footer-left" data-ids="ids-footer-left">
          ${this.renderHostname()} ${this.renderSwid()}
        </div>
        ${this.renderTimeGroup()} ${this.renderTimeZone()}
      </footer>
      <ids-toast-viewport
        position="top-right"
        .items=${this.toasts}
        .onItemsChange=${(items: IdsToastQueueItem[]) => {
          this.toasts = items;
        }}
      ></ids-toast-viewport>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-footer": IdsFooter;
  }
}
