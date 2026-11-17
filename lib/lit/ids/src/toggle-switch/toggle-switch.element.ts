/**
 * IdsToggleSwitch — Lit web component.
 *
 * Tag: `ids-toggle-switch`
 * Spec: `components/ids/toggle-switch/design-spec.md`
 * API parity: `lib/react/ids/toggle-switch` (`IdsToggleSwitch`)
 *
 * Anatomy:
 *   field? (when label)
 *     formLabel
 *     root
 *       input → switch → track → thumb → status?
 *
 * Event: `checked-change` (detail: boolean) — React `onCheckedChange`.
 *
 * Live Figma: matrix `42848:100536`, set `8505:14389`.
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../icon/register.js";
import {
  TOGGLE_SWITCH_INFO_ICON_SLUG,
  TOGGLE_SWITCH_RUNTIME_DEFAULTS,
} from "./toggle-switch.constants.js";
import { toggleSwitchStyles } from "./toggle-switch.styles.js";

let toggleSwitchUid = 0;

export class IdsToggleSwitch extends LitElement {
  static override styles = [toggleSwitchStyles];

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
  defaultChecked = TOGGLE_SWITCH_RUNTIME_DEFAULTS.defaultChecked;

  @property({ type: Boolean, reflect: true })
  disabled = TOGGLE_SWITCH_RUNTIME_DEFAULTS.disabled;

  /**
   * Default `true` (spec / React). Lit Boolean attrs treat absence as false,
   * so only `"false"` disables status text.
   */
  @property({
    attribute: "showstatus",
    converter: {
      fromAttribute: (value: string | null) => value !== "false",
      toAttribute: (value: boolean) => (value ? "true" : "false"),
    },
  })
  showStatus = TOGGLE_SWITCH_RUNTIME_DEFAULTS.showStatus;

  /** Optional visible form label to the left of the switch. */
  @property({ type: String })
  label = "";

  @property({ type: Boolean, attribute: "labelrequired", reflect: true })
  labelRequired = TOGGLE_SWITCH_RUNTIME_DEFAULTS.labelRequired;

  @property({ type: Boolean, attribute: "labelshowinfoicon", reflect: true })
  labelShowInfoIcon = TOGGLE_SWITCH_RUNTIME_DEFAULTS.labelShowInfoIcon;

  @property({ type: String, attribute: "labelinfolabel" })
  labelInfoLabel = "";

  @property({ type: String })
  id = "";

  @property({ type: String })
  name = "";

  @property({ type: String })
  value = "";

  /** Required accessible name (visible text is On/Off status only). */
  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  @property({ type: String, attribute: "ariadescribedby" })
  ariaDescribedBy = "";

  @state()
  private internalChecked = false;

  private autoId = `ids-toggle-switch-${++toggleSwitchUid}`;
  private warnedMissingName = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-toggle-switch-host");
    if (this.checked === undefined) {
      this.internalChecked = this.defaultChecked;
    }
  }

  private isControlled(): boolean {
    return this.checked !== undefined;
  }

  private resolvedChecked(): boolean {
    if (this.isControlled()) return Boolean(this.checked);
    return this.internalChecked;
  }

  private resolvedId(): string {
    return this.id || this.autoId;
  }

  private resolveAriaLabel(): string | undefined {
    const trimmed = this.ariaLabel?.trim();
    if (trimmed) return trimmed;
    return undefined;
  }

  private warnMissingAccessibleName(): void {
    if (this.warnedMissingName) return;
    if (this.resolveAriaLabel()) return;
    this.warnedMissingName = true;
    // Validation checklist: accessible name required (visible text is On/Off only).
    // eslint-disable-next-line no-console
    console.error(
      "IdsToggleSwitch: accessible name required — provide `ariaLabel` / `arialabel`.",
    );
  }

  private applyToggle(next: boolean): void {
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
  }

  private onInputChange = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    const input = event.target as HTMLInputElement;
    this.applyToggle(input.checked);
  };

  private onInputKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (this.disabled) return;
    // Programmatic click fires native change → onInputChange.
    (event.currentTarget as HTMLInputElement).click();
  };

  private renderFormLabel(inputId: string) {
    const infoDecorative =
      this.labelInfoLabel == null || this.labelInfoLabel.trim() === "";

    return html`
      <span
        class="ids-toggle-switch-label"
        data-ids="ids-toggle-switch-label"
        data-ids-form-label="ids-form-label"
      >
        <label
          class="ids-toggle-switch-label-group"
          data-ids="ids-form-label-group"
          for=${inputId}
        >
          <span
            class="ids-toggle-switch-label-text"
            data-ids="ids-form-label-text"
            >${this.label}</span
          >
          ${this.labelRequired
            ? html`<span
                class="ids-toggle-switch-label-marker"
                data-ids="ids-form-label-marker"
                aria-hidden="true"
                >*</span
              >`
            : nothing}
        </label>
        ${this.labelShowInfoIcon
          ? html`<span
              class="ids-toggle-switch-label-info"
              data-ids="ids-form-label-info"
              role=${infoDecorative ? nothing : "img"}
              aria-label=${infoDecorative ? nothing : this.labelInfoLabel}
              aria-hidden=${infoDecorative ? "true" : nothing}
            >
              <ids-icon
                shape=${TOGGLE_SWITCH_INFO_ICON_SLUG}
                size="16"
                variant="img"
              ></ids-icon>
            </span>`
          : nothing}
      </span>
    `;
  }

  private renderSwitch(inputId: string, checked: boolean, disabled: boolean) {
    const hasStatus = Boolean(this.showStatus);
    const ariaLabel = this.resolveAriaLabel();

    return html`
      <label
        class="ids-toggle-switch"
        data-ids="ids-toggle-switch"
        data-checked=${checked ? "true" : "false"}
        data-disabled=${disabled ? "true" : "false"}
        data-has-status=${hasStatus ? "true" : "false"}
        for=${inputId}
      >
        <input
          id=${inputId}
          type="checkbox"
          role="switch"
          class="ids-toggle-switch-input"
          name=${this.name || nothing}
          .value=${this.value}
          .checked=${checked}
          ?disabled=${disabled}
          aria-checked=${checked ? "true" : "false"}
          aria-label=${ariaLabel || nothing}
          aria-describedby=${this.ariaDescribedBy || nothing}
          data-ids="ids-toggle-switch-input"
          @change=${this.onInputChange}
          @keydown=${this.onInputKeydown}
        />
        <span
          class="ids-toggle-switch-switch"
          data-ids="ids-toggle-switch-switch"
          aria-hidden="true"
        >
          <span
            class="ids-toggle-switch-track"
            data-ids="ids-toggle-switch-track"
          >
            <span
              class="ids-toggle-switch-thumb"
              data-ids="ids-toggle-switch-thumb"
            ></span>
          </span>
        </span>
        ${hasStatus
          ? html`<span
              class="ids-toggle-switch-status"
              data-ids="ids-toggle-switch-status"
              >${checked ? "On" : "Off"}</span
            >`
          : nothing}
      </label>
    `;
  }

  override render() {
    this.warnMissingAccessibleName();

    const checked = this.resolvedChecked();
    const disabled = Boolean(this.disabled);
    const inputId = this.resolvedId();
    const hasLabel = Boolean(this.label?.trim());
    const switchControl = this.renderSwitch(inputId, checked, disabled);

    if (!hasLabel) {
      return switchControl;
    }

    // Field row: form label left of switch (space-8). Sibling composition —
    // switch root is itself a <label>, so the form label must not nest inside it.
    return html`
      <span
        class="ids-toggle-switch-field"
        data-ids="ids-toggle-switch-field"
      >
        ${this.renderFormLabel(inputId)} ${switchControl}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-toggle-switch": IdsToggleSwitch;
  }
}
