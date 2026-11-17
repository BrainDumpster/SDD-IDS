/**
 * IdsTextBox — Lit web component.
 *
 * Tag: `ids-text-box`
 * Spec: `components/ids/text-box/design-spec.md`
 * API parity:
 *   - React `lib/react/ids/text-box` (label, selectTextOnFocus, focus=selected)
 *   - Angular `lib/angular/ids/text-box` (helperText / errorText props)
 *   - Storybook example `storybook/src/components/IdsTextBox.tsx`
 *     (labelPosition, showInfoIcon)
 *
 * Child / message model:
 *   Standalone (Angular props): label + helperText / errorText on this element.
 *   Preferred composition (React IdsHelper / IdsError parity):
 *     ids-textbox-container
 *       label?
 *       ids-text-box
 *       ids-control-helper? | ids-control-error?
 *
 * Event: `value-change` (detail: string) — React `onValueChange` / Angular `valueChange`.
 *
 * Live Figma: Content `42065:39424` (IDS Design Library).
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "../icon/register.js";
import "../tooltip/register.js";
import {
  TEXT_BOX_ERROR_ICON_SLUG,
  TEXT_BOX_INFO_ICON_SLUG,
  TEXT_BOX_SPEC_ACCURATE_DEFAULTS,
  resolveComponentType,
  resolveLabelPosition,
  resolveSize,
  resolveState,
  type IdsTextBoxComponentType,
  type IdsTextBoxLabelPosition,
  type IdsTextBoxSize,
  type IdsTextBoxState,
} from "./text-box.constants.js";
import { textBoxStyles } from "./text-box.styles.js";

type TextField = HTMLInputElement | HTMLTextAreaElement;

let textBoxUid = 0;

/** `selectTextOnFocus`: select the whole value, or put the caret at the end. */
function applyFocusSelection(field: TextField, selectAll: boolean): void {
  if (document.activeElement !== field) return;
  if (selectAll) {
    field.select();
    return;
  }
  // `email`, `number` and similar types have no caret API and throw on
  // `setSelectionRange`; they keep the browser's own behaviour.
  if (field.selectionStart === null) return;
  const end = field.value.length;
  field.setSelectionRange(end, end);
}

/** Boolean attrs that default to `true` — only `"false"` turns them off. */
const trueByDefault = {
  fromAttribute: (value: string | null) => value !== "false",
  toAttribute: (value: boolean) => (value ? "true" : "false"),
};

export class IdsTextBox extends LitElement {
  static override styles = [textBoxStyles];

  @property({ type: String, attribute: "componenttype", reflect: true })
  componentType: IdsTextBoxComponentType | string =
    TEXT_BOX_SPEC_ACCURATE_DEFAULTS.componentType;

  @property({ type: String, reflect: true })
  size: IdsTextBoxSize | string = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.size;

  /** Demo/testing visual override only — must not block runtime interaction. */
  @property({ type: String, reflect: true })
  state: IdsTextBoxState | string = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.state;

  @property({ type: String })
  label = "";

  @property({
    attribute: "showlabel",
    converter: trueByDefault,
  })
  showLabel: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showLabel;

  @property({ type: String, attribute: "labelposition", reflect: true })
  labelPosition: IdsTextBoxLabelPosition | string =
    TEXT_BOX_SPEC_ACCURATE_DEFAULTS.labelPosition;

  @property({ type: Boolean, reflect: true })
  required: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.required;

  @property({ type: String })
  placeholder = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.placeholder;

  /**
   * Controlled value. Omit for uncontrolled (`defaultValue` / internal).
   * Assigning `.value` or the `value` attribute enables control.
   */
  @property({
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) =>
        value === null ? undefined : value,
      toAttribute: (value: string | undefined) =>
        value === undefined ? null : value,
    },
  })
  value: string | undefined = undefined;

  @property({ type: String, attribute: "defaultvalue" })
  defaultValue = "";

  @property({ type: Boolean, reflect: true })
  disabled: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.disabled;

  @property({ type: Boolean, reflect: true })
  invalid: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.invalid;

  @property({ type: String, attribute: "helpertext" })
  helperText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.helperText;

  @property({ type: String, attribute: "errortext" })
  errorText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.errorText;

  @property({
    attribute: "showhelpertext",
    converter: trueByDefault,
  })
  showHelperText: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showHelperText;

  @property({
    attribute: "showicon",
    converter: trueByDefault,
  })
  showIcon: boolean = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showIcon;

  @property({ type: String, attribute: "iconname" })
  iconName = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.iconName;

  @property({ type: Boolean, attribute: "showinfoicon", reflect: true })
  showInfoIcon = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showInfoIcon;

  @property({ type: String, attribute: "infotooltip" })
  infoTooltip = "";

  @property({ type: String })
  id = "";

  @property({ type: String })
  name = "";

  @property({ type: Number })
  rows = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.rows;

  @property({ type: String, attribute: "inputtype" })
  inputType = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.inputType;

  /**
   * Figma: "Select text when in focus".
   * `true` (default) selects all; `false` caret at end; `null` browser default
   * (set attribute `selecttextonfocus="null"` for embedding components).
   */
  @property({
    attribute: "selecttextonfocus",
    converter: {
      fromAttribute: (value: string | null): boolean | null => {
        if (value === null) return true;
        if (value === "null" || value === "") return null;
        if (value === "false") return false;
        return true;
      },
      toAttribute: (value: boolean | null) => {
        if (value === null) return "null";
        return value ? "true" : "false";
      },
    },
  })
  selectTextOnFocus: boolean | null =
    TEXT_BOX_SPEC_ACCURATE_DEFAULTS.selectTextOnFocus;

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  @property({ type: String, attribute: "ariadescribedby" })
  ariaDescribedBy = "";

  @state()
  private internalValue = "";

  private autoId = `ids-text-box-${++textBoxUid}`;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-text-box-host");
    if (this.value === undefined) {
      this.internalValue = this.defaultValue;
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has("defaultValue") &&
      this.value === undefined &&
      changed.get("defaultValue") !== undefined
    ) {
      this.internalValue = this.defaultValue;
    }
  }

  private isControlled(): boolean {
    return this.value !== undefined;
  }

  private resolvedValue(): string {
    if (this.isControlled()) return this.value ?? "";
    return this.internalValue;
  }

  private resolvedId(): string {
    return this.id || this.autoId;
  }

  /** Public field id for container `<label for>` / `aria-describedby` wiring. */
  getFieldId(): string {
    return this.resolvedId();
  }

  /** True when projected inside `ids-textbox-container`. */
  private isComposed(): boolean {
    return (
      this.getAttribute("data-composed") === "true" ||
      Boolean(this.closest("ids-textbox-container"))
    );
  }

  private messageId(): string {
    return `${this.resolvedId()}-message`;
  }

  private resolvedComponentType(): IdsTextBoxComponentType {
    return resolveComponentType(this.componentType);
  }

  private resolvedSize(): IdsTextBoxSize {
    return resolveSize(this.size);
  }

  private demoState(): IdsTextBoxState {
    return resolveState(this.state);
  }

  private resolvedLabelPosition(): IdsTextBoxLabelPosition {
    return resolveLabelPosition(this.labelPosition);
  }

  private isDisabled(): boolean {
    return Boolean(this.disabled || this.demoState() === "disabled");
  }

  /**
   * Error mode: `invalid`, demo `state="error"`, or both.
   * Helper vs error copy follows Angular: error wins when invalid.
   */
  private isErrorMode(): boolean {
    return Boolean(this.invalid || this.demoState() === "error");
  }

  private visualState(): IdsTextBoxState {
    if (this.isDisabled()) return "disabled";
    if (this.isErrorMode()) return "error";
    return this.demoState();
  }

  private shouldRenderLabel(): boolean {
    // Container owns the projected `<label>`; skip standalone label chrome.
    if (this.isComposed()) return false;
    return Boolean(this.showLabel && this.label?.trim());
  }

  private shouldRenderHelperRow(): boolean {
    // Container owns `ids-control-helper` / `ids-control-error` slots.
    if (this.isComposed()) return false;
    if (!this.showHelperText) return false;
    if (this.isErrorMode()) return Boolean(this.errorText?.trim());
    return Boolean(this.helperText?.trim());
  }

  private helperCopy(): string {
    return this.isErrorMode() ? this.errorText : this.helperText;
  }

  private describedBy(): string | undefined {
    const parts = [
      this.ariaDescribedBy?.trim() || undefined,
      this.shouldRenderHelperRow() ? this.messageId() : undefined,
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : undefined;
  }

  private placeFocusSelection(field: TextField): void {
    const selectAll = this.selectTextOnFocus;
    if (selectAll == null) return;
    const apply = () => applyFocusSelection(field, selectAll);
    // Apply now (no flash) and again next frame so Tab-select sticks.
    apply();
    requestAnimationFrame(apply);
  }

  private onPointerDown = (event: PointerEvent): void => {
    const field = event.currentTarget as TextField;
    if (this.selectTextOnFocus == null || document.activeElement === field) {
      return;
    }
    document.addEventListener(
      "pointerup",
      () => this.placeFocusSelection(field),
      { once: true },
    );
  };

  private onFocus = (event: FocusEvent): void => {
    this.placeFocusSelection(event.currentTarget as TextField);
  };

  private onInput = (event: Event): void => {
    const next = (event.target as TextField).value;
    if (!this.isControlled()) {
      this.internalValue = next;
    }
    this.dispatchEvent(
      new CustomEvent("value-change", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
  };

  private renderInfoIcon() {
    if (!this.showInfoIcon) return nothing;
    const tooltip = this.infoTooltip?.trim() ?? "";

    if (!tooltip) {
      return html`
        <span
          class="ids-text-box-info"
          data-ids="ids-text-box-info-icon"
          aria-hidden="true"
        >
          <ids-icon
            shape=${TEXT_BOX_INFO_ICON_SLUG}
            size="16"
            variant="img"
          ></ids-icon>
        </span>
      `;
    }

    return html`
      <ids-tooltip hugcontent side="top" arrowalign="start">
        <ids-tooltip-trigger>
          <button
            type="button"
            class="ids-text-box-info"
            data-ids="ids-text-box-info-icon"
            aria-label=${tooltip}
          >
            <ids-icon
              shape=${TEXT_BOX_INFO_ICON_SLUG}
              size="16"
              variant="img"
            ></ids-icon>
          </button>
        </ids-tooltip-trigger>
        <ids-tooltip-panel>
          <ids-tooltip-body>${tooltip}</ids-tooltip-body>
        </ids-tooltip-panel>
      </ids-tooltip>
    `;
  }

  private renderLabel(inputId: string, size: IdsTextBoxSize) {
    return html`
      <label
        class="ids-text-box-label"
        data-ids="ids-text-box-label"
        data-size=${size}
        for=${inputId}
      >
        <span class="ids-text-box-label-text-group">
          ${this.label}
          ${this.required
            ? html`<span
                class="ids-text-box-required-mark"
                data-ids="ids-text-box-required-mark"
                aria-hidden="true"
                >*</span
              >`
            : nothing}
        </span>
        ${this.renderInfoIcon()}
      </label>
    `;
  }

  private renderHelperRow(isError: boolean) {
    return html`
      <div
        class="ids-text-box-helper-row"
        data-ids=${isError ? "ids-text-box-error-row" : "ids-text-box-helper-row"}
        id=${this.messageId()}
      >
        ${isError
          ? html`<span
              class="ids-text-box-error-icon"
              data-ids="ids-text-box-error-icon"
              aria-hidden="true"
            >
              <ids-icon
                shape=${TEXT_BOX_ERROR_ICON_SLUG}
                size="16"
                variant="img"
              ></ids-icon>
            </span>`
          : nothing}
        <p
          class=${classMap({
            "ids-text-box-helper-copy": true,
            "ids-text-box-helper-copy--error": isError,
          })}
          data-ids=${isError ? "ids-text-box-error-text" : "ids-text-box-helper-text"}
        >
          ${this.helperCopy()}
        </p>
      </div>
    `;
  }

  private renderFieldGroup() {
    const componentType = this.resolvedComponentType();
    const size = this.resolvedSize();
    const useTextArea = componentType === "text-area";
    const isDisabled = this.isDisabled();
    const isError = this.isErrorMode();
    const visualState = this.visualState();
    const inputId = this.resolvedId();
    const shouldRenderLabel = this.shouldRenderLabel();
    const showSuffix = Boolean(this.showIcon && this.iconName?.trim());
    const fieldValue = this.resolvedValue();

    const sizeClass = useTextArea
      ? "ids-text-box-control--text-area"
      : size === "small"
        ? "ids-text-box-control--small"
        : "ids-text-box-control--large";

    const shared = {
      id: inputId,
      name: this.name || undefined,
      placeholder: this.placeholder || undefined,
      disabled: isDisabled,
      "aria-invalid": isError ? "true" : undefined,
      "aria-required": this.required ? "true" : undefined,
      "aria-describedby": this.describedBy(),
      "aria-label": shouldRenderLabel
        ? undefined
        : this.ariaLabel?.trim() || undefined,
    };

    return html`
      <div
        class="ids-text-box"
        data-ids="ids-text-box"
        data-error=${isError ? "true" : nothing}
        data-disabled=${isDisabled ? "true" : nothing}
      >
        <div
          class=${classMap({
            "ids-text-box-control": true,
            [sizeClass]: true,
          })}
          data-ids="ids-text-box-control"
          data-state=${visualState !== "default" ? visualState : nothing}
        >
          ${useTextArea
            ? html`<textarea
                class="ids-text-box-value"
                data-ids="ids-text-box-textarea"
                rows=${this.rows}
                cols="1"
                id=${shared.id}
                name=${ifDefined(shared.name)}
                placeholder=${ifDefined(shared.placeholder)}
                ?disabled=${shared.disabled}
                .value=${fieldValue}
                aria-invalid=${ifDefined(shared["aria-invalid"])}
                aria-required=${ifDefined(shared["aria-required"])}
                aria-describedby=${ifDefined(shared["aria-describedby"])}
                aria-label=${ifDefined(shared["aria-label"])}
                @pointerdown=${this.onPointerDown}
                @focus=${this.onFocus}
                @input=${this.onInput}
              ></textarea>`
            : html`<input
                class="ids-text-box-value"
                data-ids="ids-text-box-input"
                type=${this.inputType || "text"}
                id=${shared.id}
                name=${ifDefined(shared.name)}
                placeholder=${ifDefined(shared.placeholder)}
                ?disabled=${shared.disabled}
                .value=${fieldValue}
                aria-invalid=${ifDefined(shared["aria-invalid"])}
                aria-required=${ifDefined(shared["aria-required"])}
                aria-describedby=${ifDefined(shared["aria-describedby"])}
                aria-label=${ifDefined(shared["aria-label"])}
                @pointerdown=${this.onPointerDown}
                @focus=${this.onFocus}
                @input=${this.onInput}
              />`}
          ${showSuffix
            ? html`<span
                class="ids-text-box-suffix-icon"
                data-ids="ids-text-box-suffix-icon"
                aria-hidden="true"
              >
                <ids-icon
                  shape=${this.iconName}
                  size="16"
                  color="currentColor"
                ></ids-icon>
              </span>`
            : nothing}
        </div>
        ${this.shouldRenderHelperRow()
          ? this.renderHelperRow(isError)
          : nothing}
      </div>
    `;
  }

  override render() {
    const shouldRenderLabel = this.shouldRenderLabel();
    const fieldGroup = this.renderFieldGroup();

    if (!shouldRenderLabel) {
      return fieldGroup;
    }

    const size = this.resolvedSize();
    const labelPosition = this.resolvedLabelPosition();

    return html`
      <div
        class="ids-text-box-field"
        data-ids="ids-text-box-field"
        data-label-position=${labelPosition}
      >
        ${this.renderLabel(this.resolvedId(), size)} ${fieldGroup}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-text-box": IdsTextBox;
  }
}
