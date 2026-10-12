/**
 * IdsCheckbox — Lit web component.
 *
 * Tag: `ids-checkbox` (design-spec / Angular)
 * Visuals: `components/ids/checkbox/design-spec.md`
 *
 * Preferred composition: projected children in `ids-checkbox-group`.
 * edf-core uses a different slotted `ids-checkbox-wrapper` form pattern;
 * this port follows the design-spec / Angular / React API.
 *
 * Event: `checked-change` (detail: boolean) — Angular `checkedChange`.
 */
import { LitElement, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "../icon/register.js";
import type { IdsCheckboxGroup } from "./checkbox-group.element.js";
import {
  CHECKBOX_ERROR_ICON_SLUG,
  type CheckboxDensity,
  type IdsCheckboxDataState,
} from "./checkbox.constants.js";
import { checkboxStyles } from "./checkbox.styles.js";

let checkboxUid = 0;

export class IdsCheckbox extends LitElement {
  static override styles = [checkboxStyles];

  @query(".ids-checkbox-input")
  private inputEl?: HTMLInputElement;

  @property({ type: String })
  id = "";

  @property({ type: String })
  label = "Accept terms and conditions";

  @property({ type: Boolean, attribute: "showlabel", reflect: true })
  showLabel = true;

  /** Storybook/docs only — static focus ring. */
  @property({ type: Boolean, attribute: "simulatefocusvisible", reflect: true })
  simulateFocusVisible = false;

  /**
   * Controlled checked. Omit for uncontrolled (`defaultChecked` / internal).
   * Presence of the `checked` attribute or assigning `.checked` enables control.
   */
  @property({
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) =>
        value === null ? undefined : true,
      toAttribute: (value: boolean | undefined) => {
        if (value === undefined) return null;
        return value ? "" : null;
      },
    },
  })
  checked: boolean | undefined = undefined;

  @property({ type: Boolean, attribute: "defaultchecked" })
  defaultChecked = false;

  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: String, attribute: "helpertext" })
  helperText = "";

  @property({ type: String })
  name = "";

  @property({ type: String })
  value = "";

  @property({ type: String, reflect: true })
  density: CheckboxDensity = "default";

  /** Demo/testing visual override only. */
  @property({ type: String, attribute: "data-state", reflect: true })
  dataState: IdsCheckboxDataState | "" = "";

  @state()
  private internalChecked = false;

  private autoId = `ids-checkbox-${++checkboxUid}`;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-checkbox-host");
    if (this.checked === undefined) {
      this.internalChecked = this.defaultChecked;
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has("indeterminate") ||
      changed.has("checked") ||
      changed.has("internalChecked")
    ) {
      this.syncIndeterminate();
    }
  }

  private group(): IdsCheckboxGroup | null {
    return this.closest("ids-checkbox-group");
  }

  private isControlled(): boolean {
    return this.checked !== undefined;
  }

  private resolvedChecked(): boolean {
    if (this.isControlled()) return Boolean(this.checked);
    return this.internalChecked;
  }

  private resolvedDisabled(): boolean {
    const group = this.group();
    return Boolean(
      this.disabled ||
        this.dataState === "disabled" ||
        group?.disabled,
    );
  }

  private resolvedName(): string {
    return this.name || this.group()?.name || "";
  }

  private resolvedId(): string {
    if (this.id) return this.id;
    const prefix = this.group()?.idPrefix;
    const slug = this.label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "option";
    if (prefix) return `${prefix}-${slug}`;
    return this.autoId;
  }

  private syncIndeterminate(): void {
    const el = this.inputEl;
    if (el) el.indeterminate = this.indeterminate;
  }

  private onInputChange = (event: Event): void => {
    if (this.resolvedDisabled()) {
      event.preventDefault();
      return;
    }
    const input = event.target as HTMLInputElement;
    // Spec: next user toggle from indeterminate → checked.
    const next = this.indeterminate ? true : input.checked;
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    if (!this.isControlled()) {
      this.internalChecked = next;
    }
    this.dispatchEvent(
      new CustomEvent("checked-change", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    // Native-like alias for form consumers.
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: next },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    const checked = this.resolvedChecked();
    const disabled = this.resolvedDisabled();
    const partial = this.indeterminate;
    const showChecked = checked && !partial;
    const inputId = this.resolvedId();
    const assistiveId = this.helperText ? `${inputId}-assistive` : undefined;
    const demoState =
      this.dataState && this.dataState !== "default" ? this.dataState : nothing;
    const ariaChecked: boolean | "mixed" = partial ? "mixed" : checked;

    return html`
      <div
        class="ids-checkbox"
        data-ids="ids-checkbox"
        data-density=${this.density === "datagrid" ? "datagrid" : nothing}
        data-checked=${showChecked ? "true" : "false"}
        data-indeterminate=${partial ? "true" : "false"}
        data-disabled=${disabled ? "true" : "false"}
        data-error=${this.error ? "true" : "false"}
        data-simulate-focus=${this.simulateFocusVisible ? "true" : nothing}
        data-state=${demoState}
      >
        <label
          class="ids-checkbox-row"
          data-ids="ids-checkbox-row"
          data-disabled=${disabled ? "true" : "false"}
          for=${inputId}
        >
          <input
            id=${inputId}
            class="ids-checkbox-input"
            type="checkbox"
            data-ids="ids-checkbox-input"
            data-hook-ids="ids-checkbox"
            name=${this.resolvedName() || nothing}
            .value=${this.value}
            .checked=${checked}
            ?disabled=${disabled}
            aria-checked=${ariaChecked}
            aria-invalid=${this.error ? "true" : nothing}
            aria-describedby=${assistiveId || nothing}
            @change=${this.onInputChange}
          />
          <span
            class="ids-checkbox-control"
            data-ids="ids-checkbox-control"
            aria-hidden="true"
          >
            <span
              class=${classMap({
                "ids-checkbox-indicator": true,
                "ids-checkbox-indicator--partial": partial,
                "ids-checkbox-indicator--check": !partial,
              })}
              data-ids="ids-checkbox-indicator"
            ></span>
          </span>
          <span
            class=${this.showLabel
              ? "ids-checkbox-label"
              : "ids-checkbox-label ids-checkbox-label--hidden"}
            data-ids="ids-checkbox-label"
            >${this.label}</span
          >
        </label>
        ${this.helperText
          ? html`
              <div
                id=${assistiveId}
                class=${classMap({
                  "ids-checkbox-assistive": true,
                  "ids-checkbox-assistive--error": this.error && !disabled,
                  "ids-checkbox-assistive--disabled": disabled,
                })}
                data-ids="ids-checkbox-assistive"
              >
                ${this.error && !disabled
                  ? html`<span
                      class="ids-checkbox-error-icon"
                      aria-hidden="true"
                    >
                      <ids-icon
                        shape=${CHECKBOX_ERROR_ICON_SLUG}
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
    "ids-checkbox": IdsCheckbox;
  }
}
