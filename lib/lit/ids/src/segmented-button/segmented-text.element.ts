/**
 * IdsSegmentedText — Lit web component (text segment).
 *
 * Tag: `ids-segmented-text`
 * Must be projected inside `ids-segmented-buttons` with `type="text"`.
 */
import { LitElement, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import type { IdsSegmentedButtons } from "./segmented-buttons.element.js";
import type {
  SegmentedButtonChangeMeta,
  SegmentedButtonSimulatedState,
} from "./segmented-button.constants.js";
import { segmentedSegmentStyles } from "./segmented-button.styles.js";

export class IdsSegmentedText extends LitElement {
  static override styles = [segmentedSegmentStyles];

  @query(".ids-segmented-buttons__segment")
  private segmentEl?: HTMLButtonElement;

  @property({ type: String })
  value = "";

  @property({ type: String })
  label = "";

  /** Uncontrolled initial selection hint when parent has no value/defaultValue. */
  @property({ type: Boolean })
  selected = false;

  @property({ type: String })
  title = "";

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  /** Storybook / QA only — pins hover, press, or focus-visible styling. */
  @property({ type: String, attribute: "simulatedstate", reflect: true })
  simulatedState: SegmentedButtonSimulatedState | "" = "";

  @state()
  private selectionEpoch = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-segmented-text-host");
    this.setAttribute("data-kind", "text");
  }

  get segmentValue(): string {
    return String(this.value);
  }

  get selectedHint(): boolean {
    return this.selected;
  }

  private group(): IdsSegmentedButtons | null {
    return this.closest("ids-segmented-buttons");
  }

  /** Called by the group when selection changes. */
  notifySelectionChange(): void {
    this.selectionEpoch += 1;
  }

  focusSegment(): void {
    this.segmentEl?.focus();
  }

  getChangeMeta(): SegmentedButtonChangeMeta {
    return { type: "text", label: this.label };
  }

  private onSelect = (): void => {
    this.group()?.select(this.segmentValue);
  };

  private onKeydown = (event: KeyboardEvent): void => {
    this.group()?.onItemKeydown(event, this);
  };

  override render() {
    void this.selectionEpoch;

    const group = this.group();
    const isSelected = group ? group.isSelected(this.segmentValue) : false;
    const optionId = group
      ? group.optionId(this.segmentValue)
      : `ids-segmented-${this.segmentValue || "option"}`;
    const simulated = group
      ? group.simulatedStateAttr(this.simulatedState)
      : this.simulatedState || undefined;
    const accessibleName = this.ariaLabel || this.label;

    return html`
      <button
        id=${optionId}
        type="button"
        class="ids-segmented-buttons__segment ids-segmented-buttons__segment--text"
        role="radio"
        aria-checked=${isSelected ? "true" : "false"}
        aria-label=${accessibleName || nothing}
        title=${this.title || nothing}
        tabindex="0"
        data-ids="ids-segmented-button-segment"
        data-selected=${isSelected ? "true" : "false"}
        data-simulated-state=${simulated || nothing}
        data-composite-item-active=${isSelected ? "" : nothing}
        @click=${this.onSelect}
        @keydown=${this.onKeydown}
      >
        ${this.label}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-segmented-text": IdsSegmentedText;
  }
}
