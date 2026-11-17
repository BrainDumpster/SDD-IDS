/**
 * IdsTextboxContainer — composition wrapper (checkbox-group pattern).
 *
 * Tag: `ids-textbox-container`
 *
 * Projects label + `ids-text-box` + shared message primitives:
 *
 * ```html
 * <ids-textbox-container>
 *   <label>Email:</label>
 *   <ids-text-box placeholder="Placeholder Text"></ids-text-box>
 *   <ids-control-helper>Helper text</ids-control-helper>
 *   <ids-control-error>Error message</ids-control-error>
 * </ids-textbox-container>
 * ```
 *
 * When `error` / `invalid` is true, the helper slot is hidden and the error
 * slot is shown (mutually exclusive per design-spec). Cascades `invalid` and
 * `disabled` onto the projected `ids-text-box`.
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../icon/register.js";
import "../control/register.js";
import type { IdsTextBox } from "./text-box.element.js";
import {
  TEXT_BOX_INFO_ICON_SLUG,
  resolveLabelPosition,
  resolveSize,
  type IdsTextBoxLabelPosition,
  type IdsTextBoxSize,
} from "./text-box.constants.js";
import { textboxContainerStyles } from "./textbox-container.styles.js";

let textboxContainerUid = 0;

/** Boolean attrs that default to `true` — only `"false"` turns them off. */
const trueByDefault = {
  fromAttribute: (value: string | null) => value !== "false",
  toAttribute: (value: boolean) => (value ? "true" : "false"),
};

export class IdsTextboxContainer extends LitElement {
  static override styles = [textboxContainerStyles];

  private readonly uid = ++textboxContainerUid;
  private childObserver?: MutationObserver;

  /** Demo/runtime error — shows `ids-control-error`, hides helper. */
  @property({ type: Boolean, reflect: true })
  error = false;

  /** Alias of `error` for React/Angular `invalid` naming. */
  @property({ type: Boolean, reflect: true })
  invalid = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({
    attribute: "showlabel",
    converter: trueByDefault,
  })
  showLabel = true;

  @property({ type: String, attribute: "labelposition", reflect: true })
  labelPosition: IdsTextBoxLabelPosition | string = "left";

  /** Aligns label vertical padding with the projected control size. */
  @property({ type: String, reflect: true })
  size: IdsTextBoxSize | string = "large";

  @property({ type: Boolean, attribute: "showinfoicon", reflect: true })
  showInfoIcon = false;

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  @state()
  private hasLabelProjection = false;

  @state()
  private hasHelperProjection = false;

  @state()
  private hasErrorProjection = false;

  @state()
  private hasControlProjection = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-textbox-container");
    this.syncProjectedChildren();
    this.childObserver = new MutationObserver(() => this.syncProjectedChildren());
    this.childObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    this.childObserver?.disconnect();
    this.childObserver = undefined;
    super.disconnectedCallback();
  }

  protected override firstUpdated(): void {
    this.syncProjectedChildren();
    this.syncControlCascade();
  }

  protected override updated(changed: Map<string, unknown>): void {
    this.syncProjectedChildren();
    if (
      changed.has("error") ||
      changed.has("invalid") ||
      changed.has("disabled") ||
      changed.has("required")
    ) {
      this.syncControlCascade();
    }
  }

  private get isErrorMode(): boolean {
    return Boolean(this.error || this.invalid);
  }

  private get shouldRenderLabel(): boolean {
    return this.showLabel && this.hasLabelProjection;
  }

  private get shouldShowHelper(): boolean {
    return !this.isErrorMode && this.hasHelperProjection;
  }

  private get shouldShowError(): boolean {
    return this.isErrorMode && this.hasErrorProjection;
  }

  private get labelId(): string {
    return `ids-textbox-container-${this.uid}-label`;
  }

  private get messageId(): string {
    return `ids-textbox-container-${this.uid}-message`;
  }

  private projectedControl(): IdsTextBox | null {
    for (const child of Array.from(this.children)) {
      if (child.tagName === "IDS-TEXT-BOX") {
        return child as IdsTextBox;
      }
    }
    return null;
  }

  /**
   * Auto-assign slots (checkbox-group pattern):
   *   LABEL → label
   *   IDS-TEXT-BOX → control
   *   IDS-CONTROL-HELPER → helper
   *   IDS-CONTROL-ERROR → error
   */
  private syncProjectedChildren(): void {
    let labelCount = 0;
    let helperCount = 0;
    let errorCount = 0;
    let controlCount = 0;

    for (const child of Array.from(this.children)) {
      const tag = child.tagName;
      if (tag === "LABEL") {
        if (child.getAttribute("slot") !== "label") {
          child.setAttribute("slot", "label");
        }
        labelCount += 1;
      } else if (tag === "IDS-TEXT-BOX") {
        if (child.getAttribute("slot") !== "control") {
          child.setAttribute("slot", "control");
        }
        controlCount += 1;
      } else if (tag === "IDS-CONTROL-HELPER") {
        if (child.getAttribute("slot") !== "helper") {
          child.setAttribute("slot", "helper");
        }
        helperCount += 1;
      } else if (tag === "IDS-CONTROL-ERROR") {
        if (child.getAttribute("slot") !== "error") {
          child.setAttribute("slot", "error");
        }
        // Text Box error copy is single-line per design-spec.
        if (!child.hasAttribute("nowrap")) {
          child.setAttribute("nowrap", "");
        }
        errorCount += 1;
      }
    }

    const nextLabel = this.showLabel && labelCount > 0;
    if (nextLabel !== this.hasLabelProjection) this.hasLabelProjection = nextLabel;
    if ((helperCount > 0) !== this.hasHelperProjection) {
      this.hasHelperProjection = helperCount > 0;
    }
    if ((errorCount > 0) !== this.hasErrorProjection) {
      this.hasErrorProjection = errorCount > 0;
    }
    if ((controlCount > 0) !== this.hasControlProjection) {
      this.hasControlProjection = controlCount > 0;
    }

    this.wireLabelFor();
    this.syncMessageIds();
  }

  private wireLabelFor(): void {
    const control = this.projectedControl();
    const fieldId = control?.getFieldId?.() ?? control?.id;
    if (!fieldId) return;
    for (const child of Array.from(this.children)) {
      if (child.tagName === "LABEL") {
        child.setAttribute("for", fieldId);
      }
    }
  }

  private syncMessageIds(): void {
    for (const child of Array.from(this.children)) {
      if (child.tagName === "IDS-CONTROL-HELPER") {
        if (this.shouldShowHelper) child.id = this.messageId;
        else if (child.id === this.messageId) child.removeAttribute("id");
      }
      if (child.tagName === "IDS-CONTROL-ERROR") {
        if (this.shouldShowError) child.id = this.messageId;
        else if (child.id === this.messageId) child.removeAttribute("id");
      }
    }
  }

  private syncControlCascade(): void {
    const control = this.projectedControl();
    if (!control) return;

    // Prefer composition messages / label from the container.
    control.setAttribute("data-composed", "true");
    control.showLabel = false;
    control.showHelperText = false;
    control.invalid = this.isErrorMode;
    if (this.disabled) control.disabled = true;
    if (this.required) control.required = true;
    control.ariaDescribedBy =
      this.shouldShowHelper || this.shouldShowError ? this.messageId : "";

    this.wireLabelFor();
    this.syncMessageIds();

    for (const child of Array.from(this.children)) {
      if (child.tagName === "IDS-CONTROL-HELPER" || child.tagName === "IDS-CONTROL-ERROR") {
        (child as HTMLElement & { disabled?: boolean }).disabled = this.disabled;
      }
    }
  }

  override render() {
    const labelPosition = resolveLabelPosition(this.labelPosition);
    const size = resolveSize(this.size);
    const showHelper = this.shouldShowHelper;
    const showError = this.shouldShowError;

    return html`
      <div
        class="ids-textbox-container"
        data-ids="ids-textbox-container-root"
        data-label-position=${labelPosition}
        data-size=${size}
        data-error=${this.isErrorMode ? "true" : nothing}
        data-disabled=${this.disabled ? "true" : nothing}
        data-has-control=${this.hasControlProjection ? "true" : nothing}
      >
        ${this.showLabel
          ? html`
              <div
                class="ids-textbox-container-label"
                data-ids="ids-textbox-container-label"
                id=${this.labelId}
                ?hidden=${!this.hasLabelProjection}
              >
                <span class="ids-textbox-container-label-text">
                  <slot name="label"></slot>
                  ${this.required && this.hasLabelProjection
                    ? html`<span
                        class="ids-textbox-container-required"
                        data-ids="ids-textbox-container-required"
                        aria-hidden="true"
                        >*</span
                      >`
                    : nothing}
                </span>
                ${this.showInfoIcon && this.hasLabelProjection
                  ? html`<span
                      class="ids-textbox-container-info"
                      data-ids="ids-textbox-container-info"
                      aria-hidden="true"
                    >
                      <ids-icon
                        shape=${TEXT_BOX_INFO_ICON_SLUG}
                        size="16"
                        variant="img"
                      ></ids-icon>
                    </span>`
                  : nothing}
              </div>
            `
          : nothing}

        <div
          class="ids-textbox-container-body"
          data-ids="ids-textbox-container-body"
        >
          <div
            class="ids-textbox-container-control"
            data-ids="ids-textbox-container-control"
          >
            <slot name="control"></slot>
          </div>

          <div
            class="ids-textbox-container-message"
            data-ids="ids-textbox-container-helper"
            ?hidden=${!showHelper}
          >
            <slot name="helper"></slot>
          </div>

          <div
            class="ids-textbox-container-message"
            data-ids="ids-textbox-container-error"
            ?hidden=${!showError}
          >
            <slot name="error"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-textbox-container": IdsTextboxContainer;
  }
}
