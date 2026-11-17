/**
 * IdsButton — Lit web component (text / icon+text).
 *
 * Tag: `ids-button`
 * Visuals: `components/ids/button/design-spec.md`
 * Icon-only → `ids-icon-button`
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "../icon/register.js";
import {
  resolveNativeType,
  resolveSize,
  resolveVariant,
  type IdsButtonDataState,
  type IdsButtonNativeType,
  type IdsButtonVariant,
} from "./button.constants.js";
import { buttonStyles } from "./button.styles.js";

export class IdsButton extends LitElement {
  static override styles = [buttonStyles];

  @property({ type: String, reflect: true })
  kind = "";

  @property({ type: String, reflect: true })
  variant = "";

  @property({ type: String, reflect: true })
  size = "";

  @property({ type: String, reflect: true })
  type: IdsButtonNativeType = "button";

  @property({ type: Boolean, reflect: true })
  fluid = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: String })
  name = "";

  @property({ type: String })
  value = "";

  @property({ type: String })
  label = "";

  @property({ type: String, attribute: "iconslug", reflect: true })
  iconSlug = "";

  @property({ type: String, reflect: true })
  lineicon = "";

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  @property({ type: String, attribute: "data-state", reflect: true })
  dataState: IdsButtonDataState | "" = "";

  @property({ type: Boolean, reflect: true })
  autofocus = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-button-host");
  }

  private resolvedVariant(): IdsButtonVariant {
    return resolveVariant(this.variant || this.kind || "primary");
  }

  private resolvedSize() {
    return resolveSize(this.size || "large");
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
    this.emit("ids-button-click", { originalEvent: event }, event);
  };

  private onFocus = (event: FocusEvent): void => {
    this.emit("ids-button-focus", { originalEvent: event }, event);
  };

  private onBlur = (event: FocusEvent): void => {
    this.emit("ids-button-blur", { originalEvent: event }, event);
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      this.emit("ids-button-press-start", { originalEvent: event }, event);
    }
    this.emit("ids-button-keydown", { originalEvent: event }, event);
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    if (event.key === " " || event.key === "Enter") {
      this.emit("ids-button-press-end", { originalEvent: event }, event);
    }
    this.emit("ids-button-keyup", { originalEvent: event }, event);
  };

  private onMouseDown = (event: MouseEvent): void => {
    if (!this.isDisabled()) {
      this.emit("ids-button-press-start", { originalEvent: event }, event);
    }
  };

  private onMouseUp = (event: MouseEvent): void => {
    this.emit("ids-button-press-end", { originalEvent: event }, event);
  };

  private onMouseLeave = (event: MouseEvent): void => {
    this.emit("ids-button-press-end", { originalEvent: event }, event);
  };

  private renderIcon(variant: IdsButtonVariant, hide: boolean) {
    const slug = this.iconSlug || this.lineicon;
    if (!slug || variant === "destructive") return nothing;
    return html`
      <span
        class="ids-button-leading-icon ${hide ? "ids-button-leading-icon--hidden" : ""}"
        data-ids="ids-button-leading-icon"
        aria-hidden="true"
      >
        <ids-icon shape=${slug} size="16" variant="mask"></ids-icon>
      </span>
    `;
  }

  override render() {
    const variant = this.resolvedVariant();
    const size = this.resolvedSize();
    const nativeType = resolveNativeType(this.type);
    const disabled = this.isDisabled();
    const slug = this.iconSlug || this.lineicon;
    const hasPropLabel = Boolean(this.label);
    const hasIcon = Boolean(slug) && variant !== "destructive";
    const hideContent = this.loading;
    const accessibleName = (this.ariaLabel || "").trim();

    const classes = {
      "ids-button": true,
      [`ids-button--${variant}`]: true,
      [`ids-button--${size}`]: true,
      "ids-button--loading": this.loading,
      "ids-button--disabled": disabled,
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
        aria-label=${accessibleName || nothing}
        aria-disabled=${disabled ? "true" : nothing}
        aria-busy=${this.loading ? "true" : nothing}
        data-hook-ids="ids-button"
        data-ids="ids-button"
        data-variant=${variant}
        data-size=${size}
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
          ? html`<span class="ids-button-spinner" aria-hidden="true"></span>`
          : nothing}
        ${hasIcon ? this.renderIcon(variant, hideContent) : nothing}
        ${hasPropLabel
          ? html`<span
              class="ids-button-label ${hideContent ? "ids-button-label--hidden" : ""}"
              data-ids="ids-button-label"
              >${this.label}</span
            >`
          : html`<span
              class="ids-button-label ${hideContent ? "ids-button-label--hidden" : ""}"
              data-ids="ids-button-label"
              data-hook-ids="ids-button-content-slot"
              ><slot></slot
            ></span>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-button": IdsButton;
  }
}
