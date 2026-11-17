/**
 * IdsIconButton — Lit web component.
 *
 * Tag: `ids-icon-button`
 * Visuals: `components/ids/icon-button/design-spec.md`
 *
 * Events (design-spec `onClick` and related):
 * - `ids-icon-button-click` — successful activation (`detail.originalEvent`)
 * - `ids-icon-button-focus` / `ids-icon-button-blur`
 * - `ids-icon-button-keydown` / `ids-icon-button-keyup`
 * - `ids-icon-button-press-start` / `ids-icon-button-press-end`
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "../icon/register.js";
import {
  iconGlyphSize,
  resolveNativeType,
  resolveSize,
  resolveVariant,
  type IdsIconButtonDataState,
  type IdsIconButtonNativeType,
} from "./icon-button.constants.js";
import { iconButtonStyles } from "./icon-button.styles.js";

export class IdsIconButton extends LitElement {
  static override styles = [iconButtonStyles];

  @property({ type: String, reflect: true })
  variant = "primary";

  @property({ type: String, reflect: true })
  size = "large";

  @property({ type: String, reflect: true })
  type: IdsIconButtonNativeType = "button";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: String })
  name = "";

  @property({ type: String })
  value = "";

  /**
   * Required icon name — forwarded to `ids-icon` `shape`.
   * Glyph size: small 12 / medium 14 / large 16.
   */
  @property({ type: String, reflect: true })
  shape = "";

  /** @deprecated Use `shape`. */
  @property({ type: String, attribute: "iconslug", reflect: true })
  iconSlug = "";

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  @property({ type: String, attribute: "data-state", reflect: true })
  dataState: IdsIconButtonDataState | "" = "";

  @property({ type: Boolean, reflect: true })
  autofocus = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-icon-button-host");
  }

  private isDisabled(): boolean {
    return Boolean(
      this.disabled || this.loading || this.dataState === "disabled",
    );
  }

  private emit(name: string, detail?: unknown, original?: Event): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: detail ?? { originalEvent: original },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onClick = (event: MouseEvent): void => {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.emit("ids-icon-button-click", { originalEvent: event }, event);
  };

  private onFocus = (event: FocusEvent): void => {
    this.emit("ids-icon-button-focus", { originalEvent: event }, event);
  };

  private onBlur = (event: FocusEvent): void => {
    this.emit("ids-icon-button-blur", { originalEvent: event }, event);
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      this.emit("ids-icon-button-press-start", { originalEvent: event }, event);
    }
    this.emit("ids-icon-button-keydown", { originalEvent: event }, event);
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    if (event.key === " " || event.key === "Enter") {
      this.emit("ids-icon-button-press-end", { originalEvent: event }, event);
    }
    this.emit("ids-icon-button-keyup", { originalEvent: event }, event);
  };

  private onMouseDown = (event: MouseEvent): void => {
    if (!this.isDisabled()) {
      this.emit("ids-icon-button-press-start", { originalEvent: event }, event);
    }
  };

  private onMouseUp = (event: MouseEvent): void => {
    this.emit("ids-icon-button-press-end", { originalEvent: event }, event);
  };

  private onMouseLeave = (event: MouseEvent): void => {
    this.emit("ids-icon-button-press-end", { originalEvent: event }, event);
  };

  override render() {
    const variant = resolveVariant(this.variant);
    const size = resolveSize(this.size);
    const nativeType = resolveNativeType(this.type);
    const disabled = this.isDisabled();
    const glyphSize = iconGlyphSize(size);
    const shape = (this.shape || this.iconSlug || "").trim();
    const accessibleName = (this.ariaLabel || "").trim();
    if (!accessibleName) {
      throw new Error("IdsIconButton: `ariaLabel` is required.");
    }
    if (!shape) {
      throw new Error("IdsIconButton: `shape` (icon name) is required.");
    }

    const variantClass =
      variant === "ghostNeutral" ? "ghost-neutral" : variant;
    const classes = {
      "ids-icon-button": true,
      [`ids-icon-button--${variantClass}`]: true,
      [`ids-icon-button--${size}`]: true,
      "ids-icon-button--loading": this.loading,
      "ids-icon-button--disabled": disabled,
    };

    const demoState =
      this.dataState && this.dataState !== "default" ? this.dataState : nothing;

    return html`
      <button
        class=${classMap(classes)}
        type=${nativeType}
        ?disabled=${disabled}
        name=${this.name || nothing}
        .value=${this.value}
        ?autofocus=${this.autofocus}
        aria-label=${accessibleName}
        aria-disabled=${disabled ? "true" : nothing}
        aria-busy=${this.loading ? "true" : nothing}
        data-ids="ids-icon-button"
        data-variant=${variant}
        data-size=${size}
        data-shape=${shape}
        data-state=${demoState}
        data-loading=${this.loading ? "true" : nothing}
        @click=${this.onClick}
        @focus=${this.onFocus}
        @blur=${this.onBlur}
        @keydown=${this.onKeyDown}
        @keyup=${this.onKeyUp}
        @mousedown=${this.onMouseDown}
        @mouseup=${this.onMouseUp}
        @mouseleave=${this.onMouseLeave}
      >
        ${this.loading
          ? html`<span class="ids-icon-button-spinner" aria-hidden="true"></span>`
          : nothing}
        <span
          class="ids-icon-button-icon ${this.loading ? "ids-icon-button-icon--hidden" : ""}"
          data-ids="ids-icon-button-icon"
          aria-hidden="true"
        >
          <ids-icon shape=${shape} size=${String(glyphSize)} variant="mask"></ids-icon>
        </span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-icon-button": IdsIconButton;
  }
}
