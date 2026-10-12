/**
 * IdsRadioButtonGroup — Lit web component.
 *
 * Tag: `ids-radio-button-group` (design-spec / Angular)
 * Manages single-select value + keyboard for projected `ids-radio-button`.
 *
 * Event: `value-change` (detail: string) — Angular `valueChange`.
 */
import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import type { IdsRadioButton } from "./radio-button.element.js";
import {
  RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS,
  type RadioButtonOrientation,
  type RadioButtonSimulatedState,
} from "./radio-button.constants.js";
import { radioButtonGroupStyles } from "./radio-button.styles.js";

export class IdsRadioButtonGroup extends LitElement {
  static override styles = [radioButtonGroupStyles];

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

  @state()
  private internalValue: string =
    RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultValue;

  @state()
  private focusedIndex = 0;

  private items: IdsRadioButton[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-radio-button-group");
    if (this.value === undefined) {
      this.internalValue = this.defaultValue;
    }
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
    if (changed.has("disabled") || changed.has("name")) {
      this.notifyItems();
    }
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
    return html`
      <div
        class=${classMap({
          "ids-radio-group": true,
          [`ids-radio-group--${orientation}`]: true,
        })}
        role="radiogroup"
        data-ids="ids-radio-button-group"
        data-orientation=${orientation}
        data-disabled=${this.disabled ? "true" : "false"}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-radio-button-group": IdsRadioButtonGroup;
  }
}
