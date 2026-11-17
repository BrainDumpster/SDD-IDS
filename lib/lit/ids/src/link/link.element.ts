/**
 * IdsLink — Lit web component.
 *
 * Tag: `ids-link`
 * Visuals / a11y: `components/ids/link/design-spec.md`
 * API: `lib/react/ids/link` (`label`, `type`, `href`, `showExternalLinkIcon`, …)
 *
 * Anatomy:
 *   root (`<a>` | `<button>`)
 *     label
 *     externalIcon?  — lib `ids-icon` (`pop-up-square-corner-big`, 16px)
 *
 * No @base-ui-components dependency.
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "../icon/register.js";
import {
  LINK_EXTERNAL_ICON_SHAPE,
  LINK_EXTERNAL_ICON_SIZE,
  resolveLabel,
  resolveRel,
  resolveTarget,
  resolveType,
  type IdsLinkDataState,
  type IdsLinkTarget,
  type IdsLinkType,
} from "./link.constants.js";
import { linkStyles } from "./link.styles.js";

export class IdsLink extends LitElement {
  static override styles = [linkStyles];

  /** Required visible label. Empty → `"Link"` + development warning. */
  @property({ type: String })
  label = "";

  /** Variant axis `Type`. Unknown → `standalone`. */
  @property({ type: String, reflect: true })
  type: IdsLinkType | string = "standalone";

  /** When set (non-empty), renders native `<a>`; otherwise button semantics. */
  @property({ type: String, reflect: true })
  href = "";

  @property({
    type: Boolean,
    attribute: "show-external-link-icon",
    reflect: true,
  })
  showExternalLinkIcon = false;

  @property({ type: String, reflect: true })
  target: IdsLinkTarget | string = "_self";

  /** When `target="_blank"`, defaults to `noopener noreferrer` unless set. */
  @property({ type: String })
  rel = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Demo/testing visual override only — does not replace interaction logic. */
  @property({ type: String, attribute: "data-state", reflect: true })
  dataState: IdsLinkDataState | "" = "";

  private warnedEmptyLabel = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-link-host");
  }

  private emitClick(event: MouseEvent): void {
    this.dispatchEvent(
      new CustomEvent("ids-link-click", {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.emitClick(event);
  };

  private resolvedLabel(): string {
    const raw = this.label;
    if (raw == null || String(raw).trim() === "") {
      if (!this.warnedEmptyLabel) {
        this.warnedEmptyLabel = true;
        console.warn('IdsLink: empty `label` — rendering fallback text "Link".');
      }
    }
    return resolveLabel(raw);
  }

  private renderIcon() {
    if (!this.showExternalLinkIcon) return nothing;
    return html`
      <span
        class="ids-link-external-icon"
        data-ids="ids-link-external-icon"
        aria-hidden="true"
      >
        <ids-icon
          shape=${LINK_EXTERNAL_ICON_SHAPE}
          size=${String(LINK_EXTERNAL_ICON_SIZE)}
          variant="mask"
        ></ids-icon>
      </span>
    `;
  }

  private renderContent(label: string) {
    return html`
      <span class="ids-link-label" data-ids="ids-link-label">${label}</span>
      ${this.renderIcon()}
    `;
  }

  override render() {
    const type = resolveType(this.type);
    const label = this.resolvedLabel();
    const target = resolveTarget(this.target);
    const rel = resolveRel(target, this.rel || undefined);
    const stateAttr =
      this.dataState && this.dataState !== "default" ? this.dataState : nothing;
    const hasHref = this.href != null && String(this.href).trim() !== "";
    const classes = {
      "ids-link": true,
      [`ids-link--${type}`]: true,
    };

    const sharedAttrs = {
      class: classMap(classes),
      "data-ids": "ids-link",
      "data-type": type,
      "data-state": stateAttr,
      "data-external-icon": this.showExternalLinkIcon ? "true" : nothing,
      "aria-disabled": this.disabled ? "true" : nothing,
    };

    if (hasHref) {
      return html`
        <a
          class=${sharedAttrs.class}
          data-ids=${sharedAttrs["data-ids"]}
          data-type=${sharedAttrs["data-type"]}
          data-state=${sharedAttrs["data-state"]}
          data-external-icon=${sharedAttrs["data-external-icon"]}
          href=${this.disabled ? nothing : this.href}
          target=${target === "_self" ? nothing : target}
          rel=${rel ?? nothing}
          aria-disabled=${sharedAttrs["aria-disabled"]}
          tabindex=${this.disabled ? -1 : nothing}
          @click=${this.onClick}
        >
          ${this.renderContent(label)}
        </a>
      `;
    }

    return html`
      <button
        class=${sharedAttrs.class}
        type="button"
        ?disabled=${this.disabled}
        data-ids=${sharedAttrs["data-ids"]}
        data-type=${sharedAttrs["data-type"]}
        data-state=${sharedAttrs["data-state"]}
        data-external-icon=${sharedAttrs["data-external-icon"]}
        aria-disabled=${sharedAttrs["aria-disabled"]}
        @click=${this.onClick}
      >
        ${this.renderContent(label)}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-link": IdsLink;
  }
}
