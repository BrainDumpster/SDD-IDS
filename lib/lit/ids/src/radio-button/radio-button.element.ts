/**
 * IdsRadioButton — Lit web component.
 *
 * Tag: `ids-radio-button` (design-spec / Angular)
 * Must be projected inside `ids-radio-button-group`.
 * Visuals: `components/ids/radio-button/design-spec.md`
 *
 * Option label is a projected light-DOM `<label>` child (not a `label` prop).
 * `value` remains a required string prop for selection:
 *
 * ```html
 * <ids-radio-button value="email">
 *   <label>Email</label>
 * </ids-radio-button>
 * ```
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

  private childObserver?: MutationObserver;

  @property({ type: String })
  value = "";

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

  @state()
  private hasLabelProjection = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-radio-button-host");
    this.syncProjectedLabels();
    this.childObserver = new MutationObserver(() => this.syncProjectedLabels());
    this.childObserver.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  override disconnectedCallback(): void {
    this.childObserver?.disconnect();
    this.childObserver = undefined;
    super.disconnectedCallback();
  }

  protected override firstUpdated(): void {
    this.syncProjectedLabels();
  }

  override updated(): void {
    this.syncProjectedLabels();
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

  private projectedLabels(): HTMLLabelElement[] {
    return Array.from(this.children).filter(
      (child): child is HTMLLabelElement => child.tagName === "LABEL",
    );
  }

  /**
   * Route direct `<label>` children into the option-label named slot and wire
   * `for` to the input id (authors write plain `<label>` without `slot=`).
   */
  private syncProjectedLabels(): void {
    const group = this.group();
    const optionId = group
      ? group.optionId(this.value)
      : `ids-radio-${this.value || "option"}`;
    const labels = this.projectedLabels();
    for (const label of labels) {
      if (label.getAttribute("slot") !== "label") {
        label.setAttribute("slot", "label");
      }
      label.setAttribute("for", optionId);
      label.setAttribute("data-ids", "ids-radio-label");
    }

    const nextHasLabel = labels.length > 0;
    if (nextHasLabel !== this.hasLabelProjection) {
      this.hasLabelProjection = nextHasLabel;
    }
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

  /** Row is a div (projected `<label>` can't nest); clicks on the control toggle. */
  private onRowClick = (event: MouseEvent): void => {
    const group = this.group();
    const isDisabled = group ? group.isItemDisabled(this) : this.disabled;
    if (isDisabled) return;
    const path = event.composedPath();
    if (path.includes(this.inputEl as EventTarget)) return;
    if (path.some((node) => node instanceof HTMLLabelElement)) return;
    this.inputEl?.click();
  };

  override render() {
    // Touch selectionEpoch so Lit re-renders when group notifies.
    void this.selectionEpoch;

    const group = this.group();
    const selected = group ? group.isSelected(this.value) : false;
    const isDisabled = group ? group.isItemDisabled(this) : this.disabled;
    const hasError = Boolean(this.error || group?.error);
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
        data-error=${hasError ? "true" : "false"}
      >
        <div
          class="ids-radio-row"
          data-ids="ids-radio-row"
          data-disabled=${isDisabled ? "true" : "false"}
          @click=${this.onRowClick}
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
              aria-invalid=${hasError ? "true" : nothing}
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
          <span
            class=${this.hasLabelProjection
              ? "ids-radio-label"
              : "ids-radio-label ids-radio-label--hidden"}
            data-ids="ids-radio-label-slot"
          >
            <slot name="label"></slot>
          </span>
        </div>
        ${this.helperText
          ? html`
              <div
                id=${assistiveId}
                class=${classMap({
                  "ids-radio-assistive": true,
                  "ids-radio-assistive--error": hasError && !isDisabled,
                  "ids-radio-assistive--disabled": isDisabled,
                })}
                data-ids="ids-radio-assistive"
              >
                ${hasError && !isDisabled
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
