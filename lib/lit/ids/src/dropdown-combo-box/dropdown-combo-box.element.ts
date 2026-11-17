/**
 * IdsDropdownComboBox — Lit web component.
 *
 * Tag: `ids-dropdown-combo-box`
 * Spec: `components/ids/dropdown-combo-box/design-spec.md`
 * API:  `lib/react/ids/dropdown-combo-box/IdsDropdownComboBox.tsx`
 *
 * Modes: `combobox-single` (default) | `combobox-multi`.
 *   - search row in the menu with inline ghost-text autocomplete (unique prefix match;
 *     accept with Tab / → / End)
 *   - single: Reset to Default footer when the selection differs from `defaultValue`
 *   - multi: badge + tooltip in the field, Select All | Clear All row, optional Show Selected panel
 *
 * Events (bubbles, composed):
 *   ids-change       { value: string | string[] }   (string in single, string[] in multi)
 *   ids-open-change  { open: boolean }
 *   ids-search       { query: string }
 *   ids-select-all / ids-clear-all / ids-remove-selected-tag — cancelable (multi)
 *   ids-show-selected-expanded-change { expanded: boolean }
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, Figma MCP 2026-11-06):
 *   combo box field `29393:149487` → `Corner Radius/radius-none`.
 */
import { property, state } from "lit/decorators.js";
import type { TemplateResult } from "lit";
import {
  IdsDropdownBase,
  type IdsDropdownDataIds,
  type IdsDropdownFooter,
  type IdsDropdownKeyboardOpenFocus,
} from "../dropdown-shared/dropdown-menu.js";
import {
  normalizeSelected,
  optionalBooleanConverter,
  type IdsDropdownMenuItem,
} from "../dropdown-shared/dropdown.constants.js";
import {
  DEFAULT_COMBO_RESET_TO_DEFAULT_LABEL,
  DROPDOWN_COMBO_BOX_DATA_IDS,
  resolveComboBoxMode,
  type IdsDropdownComboBoxMode,
} from "./dropdown-combo-box.constants.js";

export class IdsDropdownComboBox extends IdsDropdownBase {
  protected readonly dataIds: IdsDropdownDataIds = DROPDOWN_COMBO_BOX_DATA_IDS;

  /** `combobox-single` | `combobox-multi`. Unknown → `combobox-single`. */
  @property({ type: String, reflect: true })
  mode: IdsDropdownComboBoxMode | string = "combobox-single";

  /**
   * Controlled value(s): `string` (single; attribute or property) / `string[]` (multi; property).
   * Omit for uncontrolled (`defaultValue`); set to control — then update it from `ids-change`.
   */
  @property({ attribute: "value" })
  value: string | string[] | undefined = undefined;

  @property({ attribute: "defaultvalue" })
  defaultValue: string | string[] | undefined = undefined;

  /**
   * Single only — footer "Reset to Default" when the selection differs from `defaultValue`.
   * Default `true`; use `.showResetToDefault=${false}` or `showresettodefault="false"`.
   */
  @property({ converter: optionalBooleanConverter, attribute: "showresettodefault" })
  showResetToDefault: boolean | undefined = undefined;

  @property({ type: String, attribute: "resettodefaultlabel" })
  resetToDefaultLabel = DEFAULT_COMBO_RESET_TO_DEFAULT_LABEL;

  /** @deprecated Alias for `showResetToDefault`. */
  @property({ converter: optionalBooleanConverter, attribute: "showclearall" })
  showClearAll: boolean | undefined = undefined;

  /** Multi only — Show / Hide Selected row + tag chips. */
  @property({ type: Boolean, attribute: "showselectedpanel" })
  showSelectedPanel = false;

  /** Controlled expanded state of the Show Selected panel. */
  @property({ converter: optionalBooleanConverter, attribute: "showselectedexpanded" })
  showSelectedExpanded: boolean | undefined = undefined;

  @state() private internalIds: string[] = [];

  protected get selectionMode(): "single" | "multi" {
    return resolveComboBoxMode(this.mode) === "combobox-multi" ? "multi" : "single";
  }

  protected override get dataMode(): string {
    return resolveComboBoxMode(this.mode);
  }

  override willUpdate(changed: Map<string, unknown>): void {
    super.willUpdate(changed);
    if (changed.has("defaultValue") || changed.has("mode")) {
      this.internalIds = normalizeSelected(this.isMulti, this.defaultValue);
    }
  }

  private get isControlled(): boolean {
    return this.value !== undefined;
  }

  private get defaultIds(): string[] {
    return normalizeSelected(this.isMulti, this.defaultValue);
  }

  protected override getSelectedIds(): string[] {
    return this.isControlled
      ? normalizeSelected(this.isMulti, this.value)
      : this.internalIds;
  }

  private emitChange(ids: string[]): void {
    const next = this.isMulti ? ids : ids.slice(0, 1);
    if (!this.isControlled) this.internalIds = next;
    this.emit("ids-change", { value: this.isMulti ? next : (next[0] ?? "") });
  }

  protected override commitSelection(ids: string[]): void {
    this.emitChange(ids);
  }

  /** Every combo box option is a selectable row (React maps all options). */
  protected override menuItems(): IdsDropdownMenuItem[] {
    return (this.options ?? []).map((option) => ({
      id: option.id,
      label: option.label,
      kind: "option" as const,
      selectable: true,
      disabled: option.disabled,
    }));
  }

  protected override get menuShowSelectAllClearAll(): boolean {
    return this.isMulti;
  }

  protected override get menuShowSelectedPanel(): boolean {
    return this.isMulti && this.showSelectedPanel;
  }

  protected override get menuKeyboardOpenFocus(): IdsDropdownKeyboardOpenFocus {
    // Keyboard open: the selected option, else the search field to type in.
    return "selectedOrSearch";
  }

  protected override get controlledShowSelectedExpanded(): boolean | undefined {
    return this.showSelectedExpanded;
  }

  protected override get emitsShowSelectedExpanded(): boolean {
    return true;
  }

  /** Single only: Reset to Default restores `defaultValue` (placeholder when none). */
  protected override get menuFooter(): IdsDropdownFooter | null {
    if (this.isMulti) return null;
    const resetEnabled = this.showResetToDefault ?? this.showClearAll ?? true;
    const selectedId = this.getSelectedIds()[0] ?? "";
    const defaultId = this.defaultIds[0] ?? "";
    if (!resetEnabled || selectedId === defaultId) return null;
    return {
      label: this.resetToDefaultLabel,
      onClick: () => this.emitChange(this.defaultIds.slice(0, 1)),
    };
  }

  protected override renderFieldContent(): TemplateResult {
    const labels = this.selectedLabels();
    const hasSelection = labels.length > 0;
    if (this.isMulti && hasSelection) {
      // Badge + value text share one tooltip trigger (side top, arrowAlign start).
      return this.renderMultiFieldContent({
        labels,
        showBadge: true,
        showTooltip: true,
      });
    }
    const display = labels.join(", ");
    return this.renderTruncatingValue(
      hasSelection ? display : this.placeholder,
      hasSelection ? display : undefined,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-dropdown-combo-box": IdsDropdownComboBox;
  }
}
