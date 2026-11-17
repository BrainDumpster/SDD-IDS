/**
 * IdsCheckbox — Lit web component.
 *
 * Tag: `ids-checkbox` (design-spec / Angular)
 * Visuals: `components/ids/checkbox/design-spec.md`
 *
 * Preferred composition: projected children in `ids-checkbox-group`.
 * Option label is a projected light-DOM `<label>` child (not a `label` prop):
 *
 * ```html
 * <ids-checkbox>
 *   <label>Email</label>
 * </ids-checkbox>
 * ```
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

  private childObserver?: MutationObserver;

  @property({ type: String })
  id = "";

  /** When false, hide the projected option label (use `ariaLabel` for the name). */
  @property({ type: Boolean, attribute: "showlabel", reflect: true })
  showLabel = true;

  /** Accessible name when no visible option label is projected (e.g. datagrid). */
  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

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

  /** Partial / mixed selection (Figma “Partial”; ARIA `mixed`). */
  @property({ type: Boolean, reflect: true })
  partial = false;

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

  @state()
  private hasLabelProjection = false;

  private autoId = `ids-checkbox-${++checkboxUid}`;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-checkbox-host");
    if (this.checked === undefined) {
      this.internalChecked = this.defaultChecked;
    }
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

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has("partial") ||
      changed.has("checked") ||
      changed.has("internalChecked")
    ) {
      this.syncPartial();
    }
    this.syncProjectedLabels();
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

  private resolvedError(): boolean {
    return Boolean(this.error || this.group()?.error);
  }

  private resolvedName(): string {
    return this.name || this.group()?.name || "";
  }

  private projectedLabels(): HTMLLabelElement[] {
    return Array.from(this.children).filter(
      (child): child is HTMLLabelElement => child.tagName === "LABEL",
    );
  }

  private labelText(): string {
    return (
      this.projectedLabels()
        .map((label) => label.textContent?.trim() ?? "")
        .find(Boolean) ?? ""
    );
  }

  private resolvedId(): string {
    if (this.id) return this.id;
    const prefix = this.group()?.idPrefix;
    const slug =
      this.labelText()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "option";
    if (prefix) return `${prefix}-${slug}`;
    return this.autoId;
  }

  /**
   * Route direct `<label>` children into the option-label named slot and wire
   * `for` to the input id (authors write plain `<label>` without `slot=`).
   */
  private syncProjectedLabels(): void {
    const labels = this.projectedLabels();
    const inputId = this.resolvedId();
    for (const label of labels) {
      if (label.getAttribute("slot") !== "label") {
        label.setAttribute("slot", "label");
      }
      label.setAttribute("for", inputId);
      label.setAttribute("data-ids", "ids-checkbox-label");
    }

    const nextHasLabel = labels.length > 0;
    if (nextHasLabel !== this.hasLabelProjection) {
      this.hasLabelProjection = nextHasLabel;
    }
  }

  private syncPartial(): void {
    const el = this.inputEl;
    if (el) el.indeterminate = this.partial;
  }

  private applyToggle(next: boolean): void {
    if (this.partial) {
      this.partial = false;
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
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onInputChange = (event: Event): void => {
    if (this.resolvedDisabled()) {
      event.preventDefault();
      return;
    }
    const input = event.target as HTMLInputElement;
    // Spec: next user toggle from partial → checked.
    const next = this.partial ? true : input.checked;
    this.applyToggle(next);
  };

  private onInputKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" || this.resolvedDisabled()) return;
    event.preventDefault();
    const next = this.partial ? true : !this.resolvedChecked();
    this.applyToggle(next);
  };

  /** Row is a div (projected `<label>` can't nest); clicks on the control toggle. */
  private onRowClick = (event: MouseEvent): void => {
    if (this.resolvedDisabled()) return;
    const path = event.composedPath();
    if (path.includes(this.inputEl as EventTarget)) return;
    if (path.some((node) => node instanceof HTMLLabelElement)) return;
    this.inputEl?.click();
  };

  override render() {
    const checked = this.resolvedChecked();
    const disabled = this.resolvedDisabled();
    const hasError = this.resolvedError();
    const isPartial = this.partial;
    const showChecked = checked && !isPartial;
    const inputId = this.resolvedId();
    const assistiveId = this.helperText ? `${inputId}-assistive` : undefined;
    const demoState =
      this.dataState && this.dataState !== "default" ? this.dataState : nothing;
    const ariaChecked: boolean | "mixed" = isPartial ? "mixed" : checked;
    const visibleLabel = this.showLabel && this.hasLabelProjection;
    const inputAriaLabel =
      !visibleLabel && this.ariaLabel ? this.ariaLabel : nothing;

    return html`
      <div
        class="ids-checkbox"
        data-ids="ids-checkbox"
        data-density=${this.density === "datagrid" ? "datagrid" : nothing}
        data-checked=${showChecked ? "true" : "false"}
        data-partial=${isPartial ? "true" : "false"}
        data-disabled=${disabled ? "true" : "false"}
        data-error=${hasError ? "true" : "false"}
        data-simulate-focus=${this.simulateFocusVisible ? "true" : nothing}
        data-state=${demoState}
      >
        <div
          class="ids-checkbox-row"
          data-ids="ids-checkbox-row"
          data-disabled=${disabled ? "true" : "false"}
          @click=${this.onRowClick}
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
            aria-label=${inputAriaLabel}
            aria-checked=${ariaChecked}
            aria-invalid=${hasError ? "true" : nothing}
            aria-describedby=${assistiveId || nothing}
            @change=${this.onInputChange}
            @keydown=${this.onInputKeydown}
          />
          <span
            class="ids-checkbox-control"
            data-ids="ids-checkbox-control"
            aria-hidden="true"
          >
            <span
              class=${classMap({
                "ids-checkbox-indicator": true,
                "ids-checkbox-indicator--partial": isPartial,
                "ids-checkbox-indicator--check": !isPartial,
              })}
              data-ids="ids-checkbox-indicator"
            ></span>
          </span>
          <span
            class=${visibleLabel
              ? "ids-checkbox-label"
              : "ids-checkbox-label ids-checkbox-label--hidden"}
            data-ids="ids-checkbox-label-slot"
          >
            <slot name="label"></slot>
          </span>
        </div>
        ${this.helperText
          ? html`
              <div
                id=${assistiveId}
                class=${classMap({
                  "ids-checkbox-assistive": true,
                  "ids-checkbox-assistive--error": hasError && !disabled,
                  "ids-checkbox-assistive--disabled": disabled,
                })}
                data-ids="ids-checkbox-assistive"
              >
                ${hasError && !disabled
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
