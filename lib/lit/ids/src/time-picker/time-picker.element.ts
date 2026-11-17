/**
 * IdsTimePicker — Lit web component.
 *
 * Tag: `ids-time-picker`
 * Spec: `components/ids/time-picker/design-spec.md`
 * API: `lib/react/ids/time-picker`
 *
 * Events:
 *   change       — { value: string | null }
 *   open-change  — { open: boolean }
 *
 * Live Figma (2026-11-10): TimePicker-Main `42159:132203`,
 * TimePicker-Element-Dropdown `42159:132108`.
 */
import { LitElement, html, nothing, render } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "../icon/register.js";
import {
  TIME_PORTAL_Z_INDEX,
  WHEEL_STEP_PX,
  formatTime12,
  formatTime24,
  isValidTimeText,
  pad2,
  parseTime12,
  parseTime24,
  resolveClockType,
  resolveSize,
  wrap,
  type IdsTimePickerClockType,
  type IdsTimePickerPeriod,
  type IdsTimePickerSize,
} from "./time-picker.constants.js";
import {
  timePickerPopupPortalStyles,
  timePickerStyles,
} from "./time-picker.styles.js";

let timePickerUid = 0;

export class IdsTimePicker extends LitElement {
  static override styles = [timePickerStyles];

  /** Display time (e.g. `09:30 PM`). Omit for uncontrolled. */
  @property({ attribute: false })
  value: string | null | undefined = undefined;

  @property({ type: String, reflect: true })
  size: IdsTimePickerSize | string = "large";

  @property({ type: String })
  placeholder = "HH:MM AM/PM";

  @property({ type: String })
  label = "";

  @property({ type: Boolean, reflect: true })
  required = false;

  /** Input id; generated when empty. */
  @property({ type: String, attribute: "input-id" })
  inputId = "";

  @property({ type: String, attribute: "formathint" })
  formatHint = "HH:MM AM/PM";

  @property({ type: String, attribute: "clocktype", reflect: true })
  clockType: IdsTimePickerClockType | string = "12h";

  @property({ type: Boolean, attribute: "showseconds", reflect: true })
  showSeconds = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String, attribute: "errormessage" })
  errorMessage = "";

  /** Storybook/demo — force popup open. */
  @property({ type: Boolean, attribute: "forceopen", reflect: true })
  forceOpen = false;

  /** Portal popup to `document.body` (default true). */
  @property({ type: Boolean, attribute: "popupportal" })
  popupPortal = true;

  @state() private open = false;
  @state() private inputText = "";
  @state() private inputError: string | null = null;
  @state() private popupPos: { top: number; left: number } | null = null;
  @state() private hour12 = 12;
  @state() private hour24 = 0;
  @state() private minute = 0;
  @state() private second = 0;
  @state() private period: IdsTimePickerPeriod = "AM";

  @query(".clockIconBtn") private clockBtnEl!: HTMLButtonElement | null;
  @query(".positionWrapper") private anchorEl!: HTMLDivElement | null;

  private readonly uid = ++timePickerUid;
  private portalEl: HTMLDivElement | null = null;
  private timePopupEl: HTMLDivElement | null = null;
  private portalStylesAdopted = false;
  private didMountFocus = false;
  private positionListenersBound = false;
  private outsideListenersBound = false;
  private valueControlled = false;
  private columnWheelCleanups: Array<() => void> = [];

  private get resolvedInputId(): string {
    return this.inputId || `ids-time-picker-${this.uid}`;
  }

  private get hintId(): string {
    return `${this.resolvedInputId}-hint`;
  }

  private get errorId(): string {
    return `${this.resolvedInputId}-error`;
  }

  private get resolvedClockType(): IdsTimePickerClockType {
    return resolveClockType(this.clockType);
  }

  private get formatted(): string {
    if (this.resolvedClockType === "12h") {
      return formatTime12(
        this.hour12,
        this.minute,
        this.second,
        this.period,
        this.showSeconds,
      );
    }
    return formatTime24(this.hour24, this.minute, this.second, this.showSeconds);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-time-picker");
    this.addEventListener("keydown", this.onRootKeyDown);
    if (this.forceOpen) this.open = true;
    if (this.value !== undefined && this.value !== null) {
      this.inputText = this.value;
    }
  }

  override disconnectedCallback(): void {
    this.removeEventListener("keydown", this.onRootKeyDown);
    this.teardownOutsideListeners();
    this.teardownPositionListeners();
    this.teardownColumnWheels();
    this.destroyPortal();
    super.disconnectedCallback();
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("value")) {
      this.valueControlled = this.value !== undefined;
      if (this.valueControlled) {
        this.inputText = this.value ?? "";
        this.inputError = null;
      }
    }
    if (changed.has("forceOpen") && this.forceOpen !== undefined) {
      this.open = Boolean(this.forceOpen);
    }
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);

    const openToggled =
      changed.has("open") || (changed.has("forceOpen") && this.open);

    if (openToggled) {
      if (this.open) {
        this.syncColumns(this.inputText);
        this.setupOutsideListeners();
        if (this.popupPortal) {
          this.setupPositionListeners();
          this.syncTimePortal();
          this.updatePopupPosition();
        } else {
          this.destroyPortal();
        }
        this.focusFirstPopupControl();
      } else {
        this.teardownOutsideListeners();
        this.teardownPositionListeners();
        this.teardownColumnWheels();
        this.destroyPortal();
      }
    }

    const portalContentChanged =
      this.open &&
      this.popupPortal &&
      (changed.has("hour12") ||
        changed.has("hour24") ||
        changed.has("minute") ||
        changed.has("second") ||
        changed.has("period") ||
        changed.has("clockType") ||
        changed.has("showSeconds") ||
        changed.has("disabled"));

    if (portalContentChanged) {
      this.syncTimePortal();
      this.updatePopupPosition();
    } else if (this.open && this.popupPortal && changed.has("popupPos")) {
      this.syncTimePortal();
    }

    if (this.open && !this.popupPortal) {
      this.bindColumnWheels(this.renderRoot as ShadowRoot | HTMLElement);
    }

    if (!this.didMountFocus) this.didMountFocus = true;
  }

  private emitChange(value: string | null): void {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitOpenChange(open: boolean): void {
    this.dispatchEvent(
      new CustomEvent("open-change", {
        detail: { open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setOpen(next: boolean): void {
    if (this.open === next) return;
    this.open = next;
    this.emitOpenChange(next);
  }

  private commit(text: string): void {
    this.inputText = text;
    if (!this.valueControlled) {
      /* uncontrolled: keep local text */
    }
    this.emitChange(text || null);
  }

  private applyFromColumns(): void {
    this.inputError = null;
    this.commit(this.formatted);
  }

  /** Clicking outside keeps the time picked in the columns. */
  private closePopupAndApply(): void {
    this.applyFromColumns();
    this.setOpen(false);
  }

  /** Esc closes without selecting a time and returns focus to the Choose Time button. */
  private cancelPopup(): void {
    this.setOpen(false);
    this.clockBtnEl?.focus();
  }

  /**
   * Point the columns at `text` — the time in the field. When the field holds
   * no valid time, start from the current time instead.
   */
  private syncColumns(text: string): void {
    const now = new Date();
    const nowSecond = this.showSeconds ? now.getSeconds() : 0;
    if (this.resolvedClockType === "12h") {
      const p = parseTime12(text) ?? {
        hour: now.getHours() % 12 || 12,
        minute: now.getMinutes(),
        second: nowSecond,
        period: (now.getHours() < 12 ? "AM" : "PM") as IdsTimePickerPeriod,
      };
      this.hour12 = p.hour;
      this.minute = p.minute;
      this.second = p.second;
      this.period = p.period;
    } else {
      const p = parseTime24(text) ?? {
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: nowSecond,
      };
      this.hour24 = p.hour;
      this.minute = p.minute;
      this.second = p.second;
    }
  }

  private handleInputBlur(): void {
    const text = this.inputText.trim();
    if (!text) {
      this.inputError = null;
      this.commit("");
      return;
    }
    if (!isValidTimeText(text, this.resolvedClockType)) {
      this.inputError = `Invalid time, use ${this.formatHint || "HH:MM AM/PM"}`;
      return;
    }
    this.inputError = null;
    this.commit(text);
  }

  private updatePopupPosition(): void {
    const anchor = this.anchorEl;
    if (!anchor || !this.popupPortal) return;
    const rect = anchor.getBoundingClientRect();
    const popup = this.timePopupEl;
    const popupWidth = popup?.offsetWidth ?? 220;
    const popupHeight = popup?.offsetHeight ?? 220;
    const margin = 8;
    let top = rect.bottom - 1;
    let left = rect.right - popupWidth;
    left = Math.max(margin, Math.min(left, window.innerWidth - popupWidth - margin));
    if (top + popupHeight > window.innerHeight - margin) {
      const above = rect.top - popupHeight + 1;
      if (above >= margin) top = above;
    }
    if (
      this.popupPos &&
      this.popupPos.top === top &&
      this.popupPos.left === left
    ) {
      return;
    }
    this.popupPos = { top, left };
  }

  private onWindowReposition = (): void => {
    if (!this.open || !this.popupPortal) return;
    this.updatePopupPosition();
  };

  private setupPositionListeners(): void {
    if (this.positionListenersBound) return;
    this.positionListenersBound = true;
    window.addEventListener("resize", this.onWindowReposition);
    window.addEventListener("scroll", this.onWindowReposition, true);
    requestAnimationFrame(() => {
      this.updatePopupPosition();
      requestAnimationFrame(() => this.updatePopupPosition());
    });
  }

  private teardownPositionListeners(): void {
    if (!this.positionListenersBound) return;
    this.positionListenersBound = false;
    window.removeEventListener("resize", this.onWindowReposition);
    window.removeEventListener("scroll", this.onWindowReposition, true);
  }

  private onDocumentPointerDown = (event: MouseEvent): void => {
    const target = event.target as Node;
    if (this.contains(target)) return;
    if (this.renderRoot.contains(target)) return;
    if (this.timePopupEl?.contains(target)) return;
    if (this.portalEl?.contains(target)) return;
    this.closePopupAndApply();
  };

  private setupOutsideListeners(): void {
    if (this.outsideListenersBound) return;
    this.outsideListenersBound = true;
    document.addEventListener("mousedown", this.onDocumentPointerDown);
  }

  private teardownOutsideListeners(): void {
    if (!this.outsideListenersBound) return;
    this.outsideListenersBound = false;
    document.removeEventListener("mousedown", this.onDocumentPointerDown);
  }

  private ensurePortal(): HTMLDivElement {
    if (!this.portalEl) {
      this.portalEl = document.createElement("div");
      this.portalEl.setAttribute("data-ids", "ids-time-picker-popup-portal");
      this.portalEl.className = "ids-time-picker-popup-portal";
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
    this.timePopupEl = null;
  }

  private adoptPortalStyles(doc: Document): void {
    if (this.portalStylesAdopted) return;
    const sheet = timePickerPopupPortalStyles.styleSheet;
    if (sheet && "adoptedStyleSheets" in doc) {
      try {
        if (!doc.adoptedStyleSheets.includes(sheet)) {
          doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
        }
        this.portalStylesAdopted = true;
      } catch {
        /* fall through */
      }
    }
  }

  private syncTimePortal(): void {
    if (!this.open || this.disabled || !this.popupPortal) {
      this.destroyPortal();
      return;
    }
    const host = this.ensurePortal();
    this.adoptPortalStyles(host.ownerDocument);
    const needInline = !this.portalStylesAdopted;
    render(
      html`
        ${needInline
          ? html`<style>
              ${timePickerPopupPortalStyles.cssText}
            </style>`
          : nothing}
        ${this.renderTimePopup(true)}
      `,
      host,
    );
    this.timePopupEl = host.querySelector<HTMLDivElement>(".timePopup");
    this.bindColumnWheels(host);
  }

  private onRootKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      event.stopPropagation();
      this.cancelPopup();
    }
  };

  private getFocusableEls(root: HTMLElement | null): HTMLElement[] {
    if (!root) return [];
    return Array.from(
      root.querySelectorAll<HTMLElement>("button:not([disabled])"),
    ).filter((el) => el.offsetParent !== null);
  }

  private focusFirstPopupControl(): void {
    if (!this.didMountFocus || this.disabled) return;
    requestAnimationFrame(() => {
      const root = this.popupPortal
        ? this.timePopupEl
        : (this.renderRoot.querySelector(".timePopup") as HTMLElement | null);
      this.getFocusableEls(root)[0]?.focus();
    });
  }

  private onPopupKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Tab") return;
    const root = this.popupPortal
      ? this.timePopupEl
      : (this.renderRoot.querySelector(".timePopup") as HTMLElement | null);
    const els = this.getFocusableEls(root);
    if (els.length === 0) return;
    const first = els[0];
    const last = els[els.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  private teardownColumnWheels(): void {
    for (const cleanup of this.columnWheelCleanups) cleanup();
    this.columnWheelCleanups = [];
  }

  private bindColumnWheels(root: ParentNode): void {
    this.teardownColumnWheels();
    const cols = root.querySelectorAll<HTMLElement>("[data-time-column]");
    cols.forEach((el) => {
      let acc = 0;
      const onWheel = (e: WheelEvent) => {
        if (this.disabled) return;
        e.preventDefault();
        const kind = el.dataset.timeColumn;
        acc += e.deltaY;
        while (acc >= WHEEL_STEP_PX) {
          this.stepColumn(kind, 1);
          acc -= WHEEL_STEP_PX;
        }
        while (acc <= -WHEEL_STEP_PX) {
          this.stepColumn(kind, -1);
          acc += WHEEL_STEP_PX;
        }
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      this.columnWheelCleanups.push(() =>
        el.removeEventListener("wheel", onWheel),
      );
    });
  }

  private stepColumn(kind: string | undefined, dir: 1 | -1): void {
    switch (kind) {
      case "hour12":
        this.hour12 = wrap(this.hour12 + dir, 1, 12);
        break;
      case "hour24":
        this.hour24 = wrap(this.hour24 + dir, 0, 23);
        break;
      case "minute":
        this.minute = wrap(this.minute + dir, 0, 59);
        break;
      case "second":
        this.second = wrap(this.second + dir, 0, 59);
        break;
      case "period":
        this.period = this.period === "AM" ? "PM" : "AM";
        break;
      default:
        break;
    }
  }

  private renderTimeColumn(
    label: string,
    display: string,
    kind: string,
    periodCol = false,
  ) {
    return html`
      <div
        class=${classMap({ timeColumn: true, periodColumn: periodCol })}
        role="group"
        aria-label=${label}
        data-time-column=${kind}
      >
        <button
          type="button"
          class="arrowBtn arrowUp"
          aria-label=${`Previous ${label}`}
          ?disabled=${this.disabled}
          @click=${() => this.stepColumn(kind, -1)}
        >
          <ids-icon
            shape="arrow-tri-down-solid"
            size="10"
            color="var(--color-icon-gray-neutral-base)"
          ></ids-icon>
        </button>
        <div class="valueCell">${display}</div>
        <button
          type="button"
          class="arrowBtn"
          aria-label=${`Next ${label}`}
          ?disabled=${this.disabled}
          @click=${() => this.stepColumn(kind, 1)}
        >
          <ids-icon
            shape="arrow-tri-down-solid"
            size="10"
            color="var(--color-icon-gray-neutral-base)"
          ></ids-icon>
        </button>
      </div>
    `;
  }

  private renderTimePopup(portaled: boolean) {
    const clock = this.resolvedClockType;
    const popupStyle =
      portaled && this.popupPos
        ? {
            top: `${this.popupPos.top}px`,
            left: `${this.popupPos.left}px`,
            zIndex: String(TIME_PORTAL_Z_INDEX),
          }
        : portaled
          ? { visibility: "hidden" as const }
          : undefined;

    return html`
      <div
        class=${classMap({
          timePopup: true,
          timePopupPortaled: portaled,
          widePadding: clock === "24h",
        })}
        style=${popupStyle ? styleMap(popupStyle) : nothing}
        role="dialog"
        aria-modal="true"
        aria-label="Choose time"
        @keydown=${this.onPopupKeyDown}
        @mousedown=${portaled
          ? (e: MouseEvent) => e.stopPropagation()
          : undefined}
      >
        ${clock === "12h"
          ? html`
              ${this.renderTimeColumn("Hour", String(this.hour12), "hour12")}
              ${this.renderTimeColumn("Minute", pad2(this.minute), "minute")}
              ${this.showSeconds
                ? this.renderTimeColumn("Second", pad2(this.second), "second")
                : nothing}
              ${this.renderTimeColumn(
                "AM or PM",
                this.period,
                "period",
                true,
              )}
            `
          : html`
              ${this.renderTimeColumn("Hour", String(this.hour24), "hour24")}
              ${this.renderTimeColumn("Minute", pad2(this.minute), "minute")}
              ${this.showSeconds
                ? this.renderTimeColumn("Second", pad2(this.second), "second")
                : nothing}
            `}
        <span class="visuallyHidden" role="status">${this.formatted}</span>
      </div>
    `;
  }

  override render() {
    const size = resolveSize(this.size);
    const showError = this.error || Boolean(this.inputError);
    const shownErrorMessage = this.error
      ? this.errorMessage
      : this.inputError;
    const showFormatHint = this.formatHint !== "" && !showError;
    const inputFilled = this.inputText.trim().length > 0;
    const describedBy =
      [
        showError && shownErrorMessage ? this.errorId : null,
        showFormatHint ? this.hintId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const fieldClasses = {
      fieldContainer: true,
      sizeLarge: size === "large",
      sizeSmall: size === "small",
      disabled: this.disabled,
      error: showError,
      open: this.open,
    };

    return html`
      ${this.label
        ? html`
            <span class="label">
              <span
                class=${classMap({
                  formLabel: true,
                  sizeLg: size === "large",
                  sizeMd: size === "small",
                })}
                data-ids="ids-form-label"
              >
                <label class="formLabelGroup" for=${this.resolvedInputId}>
                  <span class="formLabelText">${this.label}</span>
                  ${this.required
                    ? html`<span class="formLabelMarker" aria-hidden="true"
                        >*</span
                      >`
                    : nothing}
                </label>
              </span>
            </span>
          `
        : nothing}
      <div class="fieldGroup">
        <div class="positionWrapper">
          <div class=${classMap(fieldClasses)}>
            <input
              id=${this.resolvedInputId}
              type="text"
              class=${classMap({ textInput: true, filled: inputFilled })}
              placeholder=${this.placeholder}
              .value=${this.inputText}
              ?disabled=${this.disabled}
              aria-label=${this.label ? nothing : "Time"}
              aria-required=${this.required ? "true" : nothing}
              aria-invalid=${showError ? "true" : nothing}
              aria-describedby=${ifDefined(describedBy)}
              @input=${(e: Event) => {
                this.inputText = (e.target as HTMLInputElement).value;
                if (this.inputError) this.inputError = null;
              }}
              @blur=${() => this.handleInputBlur()}
            />
            <button
              type="button"
              class=${classMap({
                clockIconBtn: true,
                sizeLarge: size === "large",
                sizeSmall: size === "small",
              })}
              aria-label="Open time picker"
              aria-haspopup="dialog"
              aria-expanded=${this.open ? "true" : "false"}
              ?disabled=${this.disabled}
              @mousedown=${() => {
                if (!this.disabled) window.getSelection()?.removeAllRanges();
              }}
              @click=${() => {
                if (!this.disabled) this.setOpen(!this.open);
              }}
            >
              <ids-icon shape="time-clock-16" size="16"></ids-icon>
            </button>
          </div>
          ${!this.popupPortal && this.open && !this.disabled
            ? this.renderTimePopup(false)
            : nothing}
        </div>
        ${showError && shownErrorMessage
          ? html`<div class="errorMessage" id=${this.errorId} role="alert">
              <ids-icon
                shape="status-critical-square-solid"
                variant="img"
                size="16"
                style="flex-shrink:0"
              ></ids-icon>
              <span>${shownErrorMessage}</span>
            </div>`
          : showFormatHint
            ? html`<span class="formatHint" id=${this.hintId}
                >${this.formatHint}</span
              >`
            : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-time-picker": IdsTimePicker;
  }
}
