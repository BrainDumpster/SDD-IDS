/**
 * IdsSegmentedIcon — Lit web component (icon segment).
 *
 * Tag: `ids-segmented-icon`
 * Must be projected inside `ids-segmented-buttons` with `type="icon"`.
 *
 * Icon sources:
 * - `shape` slug → shared `ids-icon` (`assets/icons/<shape>.svg`)
 * - default slot → custom IconSlot (wins when assigned content present)
 */
import { LitElement, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import "../icon/register.js";
import type { IdsSegmentedButtons } from "./segmented-buttons.element.js";
import {
  SEGMENTED_BUTTON_SHAPE_PATTERN,
  type SegmentedButtonChangeMeta,
  type SegmentedButtonSimulatedState,
} from "./segmented-button.constants.js";
import { segmentedSegmentStyles } from "./segmented-button.styles.js";

function warnDev(message: string): void {
  console.error(`[IdsSegmentedIcon] ${message}`);
}

export class IdsSegmentedIcon extends LitElement {
  static override styles = [segmentedSegmentStyles];

  @query(".ids-segmented-buttons__segment")
  private segmentEl?: HTMLButtonElement;

  @property({ type: String })
  value = "";

  /** Icon slug → `assets/icons/<shape>.svg`. */
  @property({ type: String })
  shape = "";

  /** Uncontrolled initial selection hint when parent has no value/defaultValue. */
  @property({ type: Boolean })
  selected = false;

  @property({ type: String })
  title = "";

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  /** Optional CSS color override on the segment surface. */
  @property({ type: String })
  color = "";

  /** Storybook / QA only — pins hover, press, or focus-visible styling. */
  @property({ type: String, attribute: "simulatedstate", reflect: true })
  simulatedState: SegmentedButtonSimulatedState | "" = "";

  @state()
  private selectionEpoch = 0;

  @state()
  private hasCustomIcon = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-segmented-icon-host");
    this.setAttribute("data-kind", "icon");
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

  notifySelectionChange(): void {
    this.selectionEpoch += 1;
  }

  focusSegment(): void {
    this.segmentEl?.focus();
  }

  getChangeMeta(): SegmentedButtonChangeMeta {
    return { type: "icon", ariaLabel: this.ariaLabel };
  }

  private onSelect = (): void => {
    this.group()?.select(this.segmentValue);
  };

  private onKeydown = (event: KeyboardEvent): void => {
    this.group()?.onItemKeydown(event, this);
  };

  private onIconSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.hasCustomIcon = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private renderShapeIcon() {
    if (!this.shape) {
      warnDev("IdsSegmentedIcon requires `shape` or slotted custom icon.");
      return html`
        <span
          class="ids-segmented-buttons__icon-glyph"
          aria-hidden="true"
        ></span>
      `;
    }

    if (!SEGMENTED_BUTTON_SHAPE_PATTERN.test(this.shape)) {
      warnDev(
        `Invalid shape slug "${this.shape}" — must match ^[a-z0-9-]+$. Rendering empty icon region.`,
      );
      return html`
        <span
          class="ids-segmented-buttons__icon-glyph"
          aria-hidden="true"
        ></span>
      `;
    }

    return html`
      <ids-icon
        shape=${this.shape}
        class="ids-segmented-buttons__icon-glyph"
        size="16"
        variant="mask"
      ></ids-icon>
    `;
  }

  private renderGlyph() {
    // Single 16x14 frame — slot for custom IconSlot XOR shape via IdsIcon.
    // Do not render a separate "hidden" flex sibling (display:flex overrides [hidden]).
    return html`
      <span class="ids-segmented-buttons__glyph" aria-hidden="true">
        <slot @slotchange=${this.onIconSlotChange}></slot>
        ${this.hasCustomIcon ? nothing : this.renderShapeIcon()}
      </span>
    `;
  }

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
    const titleAttr = this.title || this.ariaLabel;

    return html`
      <button
        id=${optionId}
        type="button"
        class="ids-segmented-buttons__segment ids-segmented-buttons__segment--icon"
        role="radio"
        aria-checked=${isSelected ? "true" : "false"}
        aria-label=${this.ariaLabel || nothing}
        title=${titleAttr || nothing}
        tabindex="0"
        data-ids="ids-segmented-button-segment"
        data-selected=${isSelected ? "true" : "false"}
        data-simulated-state=${simulated || nothing}
        data-composite-item-active=${isSelected ? "" : nothing}
        style=${this.color ? `color: ${this.color}` : nothing}
        @click=${this.onSelect}
        @keydown=${this.onKeydown}
      >
        ${this.renderGlyph()}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-segmented-icon": IdsSegmentedIcon;
  }
}
