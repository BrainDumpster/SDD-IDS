/**
 * IdsCheckboxGroup — Lit web component.
 *
 * Tag: `ids-checkbox-group` (design-spec / Angular / React)
 * Layout wrapper for projected `ids-checkbox` children with form label + error.
 *
 * Form label is **projected** as a light-DOM `<label>` child (not a string prop).
 * The element assigns `slot="label"` for you so authors can write:
 *
 * ```html
 * <ids-checkbox-group>
 *   <label>Notifications:</label>
 *   <ids-checkbox>
 *     <label>Email</label>
 *   </ids-checkbox>
 * </ids-checkbox-group>
 * ```
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../icon/register.js";
import type {
  CheckboxGroupLabelPosition,
  CheckboxGroupOrientation,
} from "./checkbox.constants.js";
import { CHECKBOX_ERROR_ICON_SLUG } from "./checkbox.constants.js";
import { checkboxGroupStyles } from "./checkbox.styles.js";

let checkboxGroupUid = 0;

export class IdsCheckboxGroup extends LitElement {
  static override styles = [checkboxGroupStyles];

  private readonly uid = ++checkboxGroupUid;
  private childObserver?: MutationObserver;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  orientation: CheckboxGroupOrientation = "vertical";

  @property({ type: String })
  name = "";

  @property({ type: String, attribute: "idprefix" })
  idPrefix = "";

  /** When false, hide the projected form label and use `ariaLabel` for the name. */
  @property({ type: Boolean, attribute: "showlabel" })
  showLabel = true;

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  @property({ type: String, attribute: "labelposition", reflect: true })
  labelPosition: CheckboxGroupLabelPosition = "left";

  @property({ type: Boolean, reflect: true })
  required = false;

  /** Truthy → show info icon after form label text. */
  @property({ type: Boolean, attribute: "labelicon" })
  labelIcon = false;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String, attribute: "errortext" })
  errorText = "";

  @state()
  private hasLabelProjection = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-checkbox-group");
    this.syncProjectedLabels();
    this.childObserver = new MutationObserver(() => this.syncProjectedLabels());
    this.childObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    this.childObserver?.disconnect();
    this.childObserver = undefined;
    super.disconnectedCallback();
  }

  protected override firstUpdated(): void {
    this.syncProjectedLabels();
  }

  protected override updated(): void {
    this.syncProjectedLabels();
  }

  private get shouldRenderLabel(): boolean {
    return this.showLabel && this.hasLabelProjection;
  }

  private get hasErrorMessage(): boolean {
    return Boolean(this.error && this.errorText);
  }

  private get labelId(): string {
    return `ids-checkbox-group-${this.uid}-label`;
  }

  private get errorId(): string {
    return `ids-checkbox-group-${this.uid}-error`;
  }

  /**
   * Route direct `<label>` children into the form-label named slot so they sit
   * to the left/top of the items (not inside the items column).
   */
  private syncProjectedLabels(): void {
    let labelCount = 0;
    for (const child of Array.from(this.children)) {
      if (child.tagName === "LABEL") {
        if (child.getAttribute("slot") !== "label") {
          child.setAttribute("slot", "label");
        }
        labelCount += 1;
      } else if (child.getAttribute("slot") === "label") {
        child.removeAttribute("slot");
      }
    }

    const nextHasLabel = this.showLabel && labelCount > 0;
    if (nextHasLabel !== this.hasLabelProjection) {
      this.hasLabelProjection = nextHasLabel;
    }
  }

  override render() {
    const orientation =
      this.orientation === "horizontal" ? "horizontal" : "vertical";
    const labelPosition = this.labelPosition === "top" ? "top" : "left";

    return html`
      <div
        class="IdsCheckboxGroup"
        role="group"
        data-ids="IdsCheckboxGroup"
        data-orientation=${orientation}
        data-label-position=${labelPosition}
        data-error=${this.error ? "true" : nothing}
        data-has-error-message=${this.hasErrorMessage ? "true" : nothing}
        data-disabled=${this.disabled ? "true" : nothing}
        aria-labelledby=${this.shouldRenderLabel ? this.labelId : nothing}
        aria-label=${!this.shouldRenderLabel && this.ariaLabel
          ? this.ariaLabel
          : nothing}
        aria-invalid=${this.error ? "true" : nothing}
        aria-errormessage=${this.hasErrorMessage ? this.errorId : nothing}
        aria-required=${this.required ? "true" : nothing}
      >
        ${this.showLabel
          ? html`
              <div
                class="IdsCheckboxGroupLabel"
                data-ids="IdsCheckboxGroupLabel"
                id=${this.labelId}
                ?hidden=${!this.hasLabelProjection}
              >
                <span class="IdsCheckboxGroupLabelText">
                  <slot name="label"></slot>
                </span>
                ${this.required && this.hasLabelProjection
                  ? html`<span
                      class="IdsCheckboxGroupLabelRequired"
                      aria-hidden="true"
                      >*</span
                    >`
                  : nothing}
                ${this.labelIcon && this.hasLabelProjection
                  ? html`<span
                      class="IdsCheckboxGroupLabelIcon"
                      aria-hidden="true"
                    >
                      <ids-icon
                        shape="info-circ-solid"
                        size="16"
                        variant="img"
                      ></ids-icon>
                    </span>`
                  : nothing}
              </div>
            `
          : nothing}
        <div class="IdsCheckboxGroupBody" data-ids="IdsCheckboxGroupBody">
          <div class="IdsCheckboxGroupItems" data-ids="IdsCheckboxGroupItems">
            <slot></slot>
          </div>
          ${this.hasErrorMessage
            ? html`
                <div
                  id=${this.errorId}
                  class="IdsCheckboxGroupError"
                  role="alert"
                  aria-live="polite"
                  data-ids="IdsCheckboxGroupError"
                >
                  <ids-icon
                    shape=${CHECKBOX_ERROR_ICON_SLUG}
                    size="16"
                    variant="img"
                  ></ids-icon>
                  ${this.errorText}
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-checkbox-group": IdsCheckboxGroup;
  }
}
