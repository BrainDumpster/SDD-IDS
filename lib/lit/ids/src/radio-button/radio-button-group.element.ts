/**
 * IdsRadioButtonGroup — Lit web component.
 *
 * Tag: `ids-radio-button-group` (design-spec / Angular)
 * Manages single-select value + keyboard for projected `ids-radio-button`,
 * plus form label / validation error chrome.
 *
 * Form label is **projected** as a light-DOM `<label>` child (not a string prop).
 * The element assigns `slot="label"` for you so authors can write:
 *
 * ```html
 * <ids-radio-button-group name="demo" defaultvalue="a">
 *   <label>Radio Group:</label>
 *   <ids-radio-button value="a"><label>Option 1</label></ids-radio-button>
 * </ids-radio-button-group>
 * ```
 *
 * Event: `value-change` (detail: string) — Angular `valueChange`.
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../icon/register.js";
import type { IdsRadioButton } from "./radio-button.element.js";
import {
  RADIO_BUTTON_ERROR_ICON_SLUG,
  RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS,
  type RadioButtonGroupLabelPosition,
  type RadioButtonOrientation,
  type RadioButtonSimulatedState,
} from "./radio-button.constants.js";
import { radioButtonGroupStyles } from "./radio-button.styles.js";

let radioGroupUid = 0;

export class IdsRadioButtonGroup extends LitElement {
  static override styles = [radioButtonGroupStyles];

  private readonly uid = ++radioGroupUid;
  private childObserver?: MutationObserver;

  @property({ type: String })
  id = "";

  @property({ type: String, reflect: true })
  name = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.name;

  /**
   * Controlled selected value. Omit for uncontrolled (`defaultValue`).
   */
  @property({
    converter: {
      fromAttribute: (value: string | null) =>
        value === null ? undefined : value,
      toAttribute: (value: string | undefined) =>
        value === undefined ? null : value,
    },
  })
  value: string | undefined = undefined;

  @property({ type: String, attribute: "defaultvalue" })
  defaultValue = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultValue;

  @property({ type: Boolean, reflect: true })
  disabled = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;

  @property({ type: String, reflect: true })
  orientation: RadioButtonOrientation =
    RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.orientation;

  /** When false, hide the projected form label and use `ariaLabel` for the name. */
  @property({ type: Boolean, attribute: "showlabel" })
  showLabel = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.showLabel;

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  @property({ type: String, attribute: "labelposition", reflect: true })
  labelPosition: RadioButtonGroupLabelPosition =
    RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.labelPosition;

  @property({ type: Boolean, reflect: true })
  required = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.required;

  /** Truthy → show info icon after form label text. */
  @property({ type: Boolean, attribute: "labelicon" })
  labelIcon = false;

  @property({ type: Boolean, reflect: true })
  error = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.error;

  @property({ type: String, attribute: "errortext" })
  errorText = "";

  @state()
  private internalValue: string =
    RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultValue;

  @state()
  private focusedIndex = 0;

  @state()
  private hasLabelProjection = false;

  private items: IdsRadioButton[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-radio-button-group");
    if (this.value === undefined) {
      this.internalValue = this.defaultValue;
    }
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

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("value") && this.value !== undefined) {
      this.internalValue = this.value;
      this.notifyItems();
    }
    if (
      changed.has("defaultValue") &&
      this.value === undefined &&
      changed.get("defaultValue") !== undefined
    ) {
      this.internalValue = this.defaultValue;
      this.notifyItems();
    }
    if (
      changed.has("disabled") ||
      changed.has("name") ||
      changed.has("error")
    ) {
      this.notifyItems();
    }
    this.syncProjectedLabels();
  }

  private isControlled(): boolean {
    return this.value !== undefined;
  }

  resolvedValue(): string {
    return this.isControlled() ? (this.value ?? "") : this.internalValue;
  }

  isSelected(itemValue: string): boolean {
    return this.resolvedValue() === itemValue;
  }

  isItemDisabled(item: IdsRadioButton): boolean {
    return this.disabled || item.disabled;
  }

  optionId(itemValue: string): string {
    return `${this.id || this.name}-${itemValue}`;
  }

  simulatedStateAttr(
    state?: RadioButtonSimulatedState | "",
  ): string | undefined {
    if (!state || state === "default") return undefined;
    return state;
  }

  select(next: string): void {
    if (!this.isControlled()) {
      this.internalValue = next;
    }
    const index = this.items.findIndex((item) => item.value === next);
    if (index >= 0) this.focusedIndex = index;
    this.dispatchEvent(
      new CustomEvent("value-change", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    this.notifyItems();
    this.requestUpdate();
  }

  itemTabIndex(item: IdsRadioButton): number {
    const index = this.items.indexOf(item);
    return index === this.focusedIndex ? 0 : -1;
  }

  onItemFocus(item: IdsRadioButton): void {
    this.focusedIndex = this.items.indexOf(item);
  }

  onItemKeydown(event: KeyboardEvent, item: IdsRadioButton): void {
    const index = this.items.indexOf(item);
    const enabledIndices = this.items
      .map((row, i) => (this.isItemDisabled(row) ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabledIndices.length) return;

    const currentPos = enabledIndices.indexOf(index);
    let targetIndex = index;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        targetIndex =
          enabledIndices[(currentPos + 1) % enabledIndices.length];
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        targetIndex =
          enabledIndices[
            (currentPos - 1 + enabledIndices.length) % enabledIndices.length
          ];
        break;
      case "Home":
        event.preventDefault();
        targetIndex = enabledIndices[0];
        break;
      case "End":
        event.preventDefault();
        targetIndex = enabledIndices[enabledIndices.length - 1];
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        this.select(item.value);
        return;
      default:
        return;
    }

    this.focusedIndex = targetIndex;
    const target = this.items[targetIndex];
    if (target) {
      this.select(target.value);
      target.focusInput();
    }
  }

  registerItems(items: IdsRadioButton[]): void {
    this.items = [...items];
    if (this.focusedIndex >= this.items.length) {
      this.focusedIndex = Math.max(0, this.items.length - 1);
    }
    // Prefer focusing the selected item when present.
    const selectedIdx = this.items.findIndex((i) =>
      this.isSelected(i.value),
    );
    if (selectedIdx >= 0) this.focusedIndex = selectedIdx;
    this.notifyItems();
  }

  private notifyItems(): void {
    for (const item of this.items) {
      item.notifySelectionChange();
    }
  }

  private get shouldRenderLabel(): boolean {
    return this.showLabel && this.hasLabelProjection;
  }

  private get hasErrorMessage(): boolean {
    return Boolean(this.error && this.errorText);
  }

  private get labelId(): string {
    return `${this.id || `ids-radio-group-${this.uid}`}-label`;
  }

  private get errorId(): string {
    return `${this.id || `ids-radio-group-${this.uid}`}-error`;
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

  private onSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const items = slot
      .assignedElements({ flatten: true })
      .filter((el): el is IdsRadioButton => el.tagName === "IDS-RADIO-BUTTON");
    this.registerItems(items);
  };

  override render() {
    const orientation =
      this.orientation === "horizontal" ? "horizontal" : "vertical";
    const labelPosition = this.labelPosition === "top" ? "top" : "left";

    return html`
      <div
        class="IdsRadioGroup"
        role="radiogroup"
        data-ids="IdsRadioGroup"
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
        aria-disabled=${this.disabled ? "true" : nothing}
      >
        ${this.showLabel
          ? html`
              <div
                class="IdsRadioGroupLabel"
                data-ids="IdsRadioGroupLabel"
                id=${this.labelId}
                ?hidden=${!this.hasLabelProjection}
              >
                <span class="IdsRadioGroupLabelText">
                  <slot name="label"></slot>
                </span>
                ${this.required && this.hasLabelProjection
                  ? html`<span
                      class="IdsRadioGroupLabelRequired"
                      aria-hidden="true"
                      >*</span
                    >`
                  : nothing}
                ${this.labelIcon && this.hasLabelProjection
                  ? html`<span
                      class="IdsRadioGroupLabelIcon"
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
        <div class="IdsRadioGroupBody" data-ids="IdsRadioGroupBody">
          <div class="IdsRadioGroupItems" data-ids="IdsRadioGroupItems">
            <slot @slotchange=${this.onSlotChange}></slot>
          </div>
          ${this.hasErrorMessage
            ? html`
                <div
                  id=${this.errorId}
                  class="IdsRadioGroupError"
                  role="alert"
                  aria-live="polite"
                  data-ids="IdsRadioGroupError"
                >
                  <ids-icon
                    shape=${RADIO_BUTTON_ERROR_ICON_SLUG}
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
    "ids-radio-button-group": IdsRadioButtonGroup;
  }
}
