/**
 * IdsDropdownSingleSelect — Lit web component.
 *
 * Tag: `ids-dropdown-single-select`
 * Spec: `components/ids/dropdown-single-select/design-spec.md`
 * API:  `lib/react/ids/dropdown-single-select/IdsDropdownSingleSelect.tsx`
 *
 * Anatomy:
 *   Label? → FieldContainer (trigger shell) + portal menu (shared `IdsDropdownBase`)
 *   HelperText | ErrorText   (string props `helpertext` / `errortext`)
 *
 * Events (bubbles, composed):
 *   ids-change       { value: string }
 *   ids-open-change  { open: boolean }
 *   ids-search       { query: string }
 *   ids-action       footer action (`actionLabel`) fired
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, Figma MCP 2026-11-06):
 *   matrix `11099:58099`; field Container `12579:77895` → `Corner Radius/radius-none`.
 */
import { property, state } from "lit/decorators.js";
import type { TemplateResult } from "lit";
import {
  IdsDropdownBase,
  type IdsDropdownDataIds,
  type IdsDropdownFooter,
} from "../dropdown-shared/dropdown-menu.js";
import { optionalBooleanConverter } from "../dropdown-shared/dropdown.constants.js";
import {
  DEFAULT_RESET_TO_DEFAULT_LABEL,
  DROPDOWN_SINGLE_SELECT_DATA_IDS,
} from "./dropdown-single-select.constants.js";

export class IdsDropdownSingleSelect extends IdsDropdownBase {
  protected readonly selectionMode = "single" as const;
  protected readonly dataIds: IdsDropdownDataIds = DROPDOWN_SINGLE_SELECT_DATA_IDS;

  /** Radio visual in option rows. */
  @property({ type: Boolean, attribute: "showradio", reflect: true })
  showRadio = false;

  /**
   * Controlled selected option id. Omit for uncontrolled (`defaultValue`);
   * set (even to `""`) to control — then update it from `ids-change`.
   */
  @property({ type: String })
  value: string | undefined = undefined;

  /** Default selection the field returns to. `""` shows the placeholder. */
  @property({ type: String, attribute: "defaultvalue" })
  defaultValue = "";

  /**
   * Footer "Reset to Default" row whenever the selection differs from `defaultValue`.
   * Default `true`; use `.showResetToDefault=${false}` or `showresettodefault="false"`.
   */
  @property({ converter: optionalBooleanConverter, attribute: "showresettodefault" })
  showResetToDefault: boolean | undefined = undefined;

  @property({ type: String, attribute: "resettodefaultlabel" })
  resetToDefaultLabel = DEFAULT_RESET_TO_DEFAULT_LABEL;

  /** @deprecated Alias for `showResetToDefault`. */
  @property({ converter: optionalBooleanConverter, attribute: "showclearall" })
  showClearAll: boolean | undefined = undefined;

  /** Footer action label (shown when the Reset row is not). Fires `ids-action`. */
  @property({ type: String, attribute: "actionlabel" })
  actionLabel = "";

  @state() private internalValue = "";

  override willUpdate(changed: Map<string, unknown>): void {
    super.willUpdate(changed);
    if (changed.has("defaultValue")) {
      this.internalValue = this.defaultValue ?? "";
    }
  }

  private get isControlled(): boolean {
    return this.value !== undefined;
  }

  private get selectedId(): string {
    return this.isControlled ? (this.value ?? "") : this.internalValue;
  }

  private emitChange(next: string): void {
    if (!this.isControlled) this.internalValue = next;
    this.emit("ids-change", { value: next });
  }

  protected override getSelectedIds(): string[] {
    const id = this.selectedId;
    return id ? [id] : [];
  }

  protected override commitSelection(ids: string[]): void {
    this.emitChange(ids[0] ?? "");
  }

  protected override get menuShowRadio(): boolean {
    return this.showRadio;
  }

  /**
   * Footer slot: "Reset to Default" when the selection differs from `defaultValue`,
   * else the custom `actionLabel` (fires `ids-action`).
   */
  protected override get menuFooter(): IdsDropdownFooter | null {
    const resetEnabled = this.showResetToDefault ?? this.showClearAll ?? true;
    const showResetRow = resetEnabled && this.selectedId !== this.defaultValue;
    if (showResetRow) {
      return {
        label: this.resetToDefaultLabel,
        onClick: () => this.emitChange(this.defaultValue ?? ""),
      };
    }
    if (this.actionLabel) {
      return {
        label: this.actionLabel,
        onClick: () => this.emit("ids-action", {}),
      };
    }
    return null;
  }

  protected override renderFieldContent(): TemplateResult {
    const labels = this.selectedLabels();
    const selectedLabel = labels[0] ?? "";
    const hasSelection = Boolean(selectedLabel);
    return this.renderTruncatingValue(
      hasSelection ? selectedLabel : this.placeholder,
      hasSelection ? selectedLabel : undefined,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-dropdown-single-select": IdsDropdownSingleSelect;
  }
}
