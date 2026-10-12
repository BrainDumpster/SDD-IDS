/**
 * IdsRadioButton — Lit web component.
 *
 * Tag: `ids-radio-button` (design-spec / Angular)
 * Must be projected inside `ids-radio-button-group`.
 * Visuals: `components/ids/radio-button/design-spec.md`
 */
import { LitElement, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "../icon/register.js";
import type { IdsRadioButtonGroup } from "./radio-button-group.element.js";
import {
  RADIO_BUTTON_ERROR_ICON_SLUG,
  type RadioButtonSimulatedState,
} from "./radio-button.constants.js";
import { radioButtonStyles } from "./radio-button.styles.js";

export class IdsRadioButton extends LitElement {
  static override styles = [radioButtonStyles];

  @query(".ids-radio-input")
  private inputEl?: HTMLInputElement;

  @property({ type: String })
  value = "";

  @property({ type: String })
  label = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String, attribute: "helpertext" })
  helperText = "";

  /** Docs / Storybook only — static matrix states. */
  @property({ type: String, attribute: "simulatedstate", reflect: true })
  simulatedState: RadioButtonSimulatedState | "" = "";

  @state()
  private selectionEpoch = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-radio-button-host");
  }

  private group(): IdsRadioButtonGroup | null {
    return this.closest("ids-radio-button-group");
  }

  /** Called by the group when selection / disabled / name changes. */
  notifySelectionChange(): void {
    this.selectionEpoch += 1;
  }

  focusInput(): void {
    this.inputEl?.focus();
  }

  private onSelect = (): void => {
    const group = this.group();
    if (!group || group.isItemDisabled(this)) return;
    group.select(this.value);
  };

  private onKeydown = (event: KeyboardEvent): void => {
    this.group()?.onItemKeydown(event, this);
  };

  private onFocus = (): void => {
    this.group()?.onItemFocus(this);
  };

  override render() {
    // Touch selectionEpoch so Lit re-renders when group notifies.
    void this.selectionEpoch;

    const group = this.group();
    const selected = group ? group.isSelected(this.value) : false;
    const isDisabled = group ? group.isItemDisabled(this) : this.disabled;
    const optionId = group
      ? group.optionId(this.value)
      : `ids-radio-${this.value || "option"}`;
    const groupName = group?.name ?? "";
    const assistiveId = this.helperText ? `${optionId}-assistive` : undefined;
    const simulated = group
      ? group.simulatedStateAttr(this.simulatedState)
      : this.simulatedState && this.simulatedState !== "default"
        ? this.simulatedState
        : undefined;
    const tabIndex = group ? group.itemTabIndex(this) : 0;

    return html`
      <div
        class="ids-radio"
        data-ids="ids-radio-button"
        data-checked=${selected ? "true" : "false"}
        data-disabled=${isDisabled ? "true" : "false"}
        data-error=${this.error ? "true" : "false"}
      >
        <label
          class="ids-radio-row"
          data-ids="ids-radio-row"
          data-disabled=${isDisabled ? "true" : "false"}
          for=${optionId}
        >
          <span
            class="ids-radio-control"
            data-ids="ids-radio-control"
            data-disabled=${isDisabled ? "true" : nothing}
            data-simulated-state=${simulated || nothing}
            aria-hidden="true"
          >
            <input
              id=${optionId}
              class="ids-radio-input"
              type="radio"
              data-ids="ids-radio-input"
              data-hook-ids="ids-radio-button"
              name=${groupName || nothing}
              .value=${this.value}
              .checked=${selected}
              ?disabled=${isDisabled}
              tabindex=${tabIndex}
              aria-invalid=${this.error ? "true" : nothing}
              aria-describedby=${assistiveId || nothing}
              @change=${this.onSelect}
              @keydown=${this.onKeydown}
              @focus=${this.onFocus}
            />
            <span
              class="ids-radio-indicator"
              data-ids="ids-radio-indicator"
            ></span>
          </span>
          <span class="ids-radio-label" data-ids="ids-radio-label"
            >${this.label}</span
          >
        </label>
        ${this.helperText
          ? html`
              <div
                id=${assistiveId}
                class=${classMap({
                  "ids-radio-assistive": true,
                  "ids-radio-assistive--error": this.error && !isDisabled,
                  "ids-radio-assistive--disabled": isDisabled,
                })}
                data-ids="ids-radio-assistive"
              >
                ${this.error && !isDisabled
                  ? html`<span
                      class="ids-radio-error-icon"
                      aria-hidden="true"
                    >
                      <ids-icon
                        shape=${RADIO_BUTTON_ERROR_ICON_SLUG}
                        size="16"
                        variant="img"
                      ></ids-icon>
                    </span>`
                  : nothing}
                ${this.helperText}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-radio-button": IdsRadioButton;
  }
}
