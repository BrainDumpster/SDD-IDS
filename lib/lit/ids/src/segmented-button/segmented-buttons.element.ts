/**
 * IdsSegmentedButtons — Lit web component (group).
 *
 * Tag: `ids-segmented-buttons` (design-spec / Angular)
 * Composition API: `selected` / `defaultSelected` / `selected-change` / `change`
 * React lib aliases: `value` / `defaultValue` (synced to selected)
 *
 * Hierarchy:
 *   ids-segmented-buttons
 *     ids-segmented-text[]   (type="text", 2–5)
 *     ids-segmented-icon[]   (type="icon", 2–3)
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  isValidSegmentedCount,
  SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS,
  type SegmentedButtonChangeMeta,
  type SegmentedButtonSimulatedState,
  type SegmentedButtonType,
} from "./segmented-button.constants.js";
import { segmentedButtonsGroupStyles } from "./segmented-button.styles.js";
import type { IdsSegmentedIcon } from "./segmented-icon.element.js";
import type { IdsSegmentedText } from "./segmented-text.element.js";

export type IdsSegmentedButtonsSegment = IdsSegmentedText | IdsSegmentedIcon;

function warnDev(message: string): void {
  console.error(`[IdsSegmentedButtons] ${message}`);
}

const optionalStringConverter = {
  fromAttribute: (value: string | null) =>
    value === null ? undefined : value,
  toAttribute: (value: string | undefined) =>
    value === undefined ? null : value,
};

export class IdsSegmentedButtons extends LitElement {
  static override styles = [segmentedButtonsGroupStyles];

  @property({ type: String, reflect: true })
  type: SegmentedButtonType = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.type;

  /**
   * Controlled selected value (design-spec Composition API).
   * Omit for uncontrolled (`defaultSelected`).
   */
  @property({ converter: optionalStringConverter })
  selected: string | undefined = undefined;

  @property({ type: String, attribute: "defaultselected" })
  defaultSelected: string =
    SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultSelected;

  /**
   * React lib alias of `selected`. When set, mirrors controlled selection.
   */
  @property({ converter: optionalStringConverter })
  value: string | undefined = undefined;

  /** React lib alias of `defaultSelected`. */
  @property({ type: String, attribute: "defaultvalue" })
  defaultValue: string =
    SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultSelected;

  @property({ type: String, attribute: "arialabel" })
  ariaLabel: string = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel;

  @property({ type: String, attribute: "arialabelledby" })
  ariaLabelledby = "";

  /** Reserved for apps that remap slug root; IdsIcon uses bundled assets. */
  @property({ type: String, attribute: "iconsbasepath" })
  iconsBasePath = "";

  @state()
  private internalSelected: string =
    SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultSelected;

  @state()
  private refuseRender = false;

  private items: IdsSegmentedButtonsSegment[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-segmented-buttons");
    this.setAttribute("data-type", this.type);
    if (!this.isControlled()) {
      this.internalSelected = this.resolveInitialSelected();
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("type")) {
      this.setAttribute("data-type", this.type);
      this.validateAndSync();
    }

    if (this.isControlled()) {
      this.internalSelected = this.controlledSelected();
      this.notifyItems();
    } else if (
      changed.has("defaultSelected") ||
      changed.has("defaultValue")
    ) {
      this.internalSelected = this.resolveInitialSelected();
      this.notifyItems();
    }
  }

  /** Prefer design-spec `selected`; React lib `value` is an alias. */
  private controlledSelected(): string {
    if (this.selected !== undefined) return String(this.selected);
    if (this.value !== undefined) return String(this.value);
    return "";
  }

  private isControlled(): boolean {
    return this.selected !== undefined || this.value !== undefined;
  }

  resolvedSelected(): string {
    return this.isControlled()
      ? this.controlledSelected()
      : this.internalSelected;
  }

  isSelected(itemValue: string): boolean {
    return this.resolvedSelected() === itemValue;
  }

  optionId(itemValue: string): string {
    return `ids-segmented-${itemValue}`;
  }

  simulatedStateAttr(
    state?: SegmentedButtonSimulatedState | "",
  ): string | undefined {
    if (!state) return undefined;
    return state;
  }

  select(next: string): void {
    const target = this.items.find((item) => item.segmentValue === next);
    if (!target) return;
    if (next === this.resolvedSelected()) return;

    if (!this.isControlled()) {
      this.internalSelected = next;
    }

    const meta = target.getChangeMeta();
    this.dispatchEvent(
      new CustomEvent("selected-change", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: next, meta } satisfies {
          value: string;
          meta: SegmentedButtonChangeMeta;
        },
        bubbles: true,
        composed: true,
      }),
    );
    this.notifyItems();
    this.requestUpdate();
  }

  onItemKeydown(event: KeyboardEvent, item: IdsSegmentedButtonsSegment): void {
    const index = this.items.indexOf(item);
    if (index < 0 || !this.items.length) return;

    const last = this.items.length - 1;
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        nextIndex = index >= last ? 0 : index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        nextIndex = index <= 0 ? last : index - 1;
        break;
      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        event.preventDefault();
        nextIndex = last;
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        this.select(item.segmentValue);
        return;
      default:
        return;
    }

    if (nextIndex != null) {
      this.items[nextIndex]?.focusSegment();
    }
  }

  registerItems(items: IdsSegmentedButtonsSegment[]): void {
    this.items = [...items];
    this.validateAndSync();
  }

  private resolveInitialSelected(): string {
    const seed = this.defaultSelected || this.defaultValue;
    if (seed) return String(seed);
    const hinted = this.items.find((item) => item.selectedHint);
    if (hinted) return hinted.segmentValue;
    return this.items[0]?.segmentValue ?? "";
  }

  private validateAndSync(): void {
    const expectedTag =
      this.type === "text" ? "IDS-SEGMENTED-TEXT" : "IDS-SEGMENTED-ICON";
    const mismatched = this.items.filter((el) => el.tagName !== expectedTag);
    if (mismatched.length) {
      warnDev(
        this.type === "text"
          ? `type="text" requires ids-segmented-text children only.`
          : `type="icon" requires ids-segmented-icon children only.`,
      );
    }

    const typedItems = this.items.filter((el) => el.tagName === expectedTag);
    const count = typedItems.length;
    if (!isValidSegmentedCount(this.type, count)) {
      warnDev(
        this.type === "text"
          ? `Invalid text option count ${count}; required 2–5. Refusing render.`
          : `Invalid icon option count ${count}; required 2–3. Refusing render.`,
      );
      this.refuseRender = true;
    } else {
      this.refuseRender = false;
    }

    const values = typedItems.map((s) => s.segmentValue);
    const duplicate = values.find((v, i) => values.indexOf(v) !== i);
    if (duplicate) {
      warnDev(`Duplicate segment value "${duplicate}"; first child wins.`);
    }

    const selectedHints = typedItems.filter((s) => s.selectedHint);
    if (selectedHints.length > 1) {
      warnDev(
        `Multiple children have selected=true; first wins ("${selectedHints[0]!.segmentValue}").`,
      );
    }

    if (!this.isControlled() && !this.internalSelected && typedItems.length) {
      this.internalSelected = this.resolveInitialSelected();
    }

    this.notifyItems();
    this.requestUpdate();
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
      .filter(
        (el): el is IdsSegmentedButtonsSegment =>
          el.tagName === "IDS-SEGMENTED-TEXT" ||
          el.tagName === "IDS-SEGMENTED-ICON",
      );
    this.registerItems(items);
  };

  override render() {
    if (this.refuseRender) {
      return nothing;
    }

    return html`
      <div
        class="ids-segmented-buttons__root"
        role="radiogroup"
        data-ids="ids-segmented-button"
        data-type=${this.type}
        aria-label=${this.ariaLabel || nothing}
        aria-labelledby=${this.ariaLabelledby || nothing}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-segmented-buttons": IdsSegmentedButtons;
  }
}
