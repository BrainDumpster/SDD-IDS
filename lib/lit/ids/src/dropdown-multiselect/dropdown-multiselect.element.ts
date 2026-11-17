/**
 * IdsDropdownMultiSelect — Lit web component.
 *
 * Tag: `ids-dropdown-multiselect`
 * Spec: `components/ids/dropdown-multiselect/design-spec.md`
 * API:  `lib/react/ids/dropdown-multiselect/IdsDropdownMultiSelect.tsx`
 *
 * Anatomy:
 *   Label? → FieldContainer (Badge + value text, shared Tooltip) + portal menu
 *     (Show Selected panel → Select All | Clear All → options → footer action)
 *   HelperText | ErrorText   (string props `helpertext` / `errortext`)
 *
 * Events (bubbles, composed):
 *   ids-change       { value: string[] }
 *   ids-open-change  { open: boolean }
 *   ids-search       { query: string }
 *   ids-action       footer action (`actionLabel`) fired
 *   ids-select-all / ids-clear-all / ids-remove-selected-tag — cancelable; React `onSelectAll` /
 *     `onClearAll` replacement semantics (preventDefault() skips the built-in behavior)
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, Figma MCP 2026-11-06):
 *   multiselect field `12608:96588` → `Corner Radius/radius-none`.
 */
import { property, state } from "lit/decorators.js";
import type { TemplateResult } from "lit";
import {
  IdsDropdownBase,
  type IdsDropdownDataIds,
  type IdsDropdownFooter,
} from "../dropdown-shared/dropdown-menu.js";
import { defaultTrueBooleanConverter } from "../dropdown-shared/dropdown.constants.js";
import {
  DEFAULT_CLEAR_ALL_LABEL,
  DEFAULT_SELECT_ALL_LABEL,
  DROPDOWN_MULTISELECT_DATA_IDS,
} from "./dropdown-multiselect.constants.js";

export class IdsDropdownMultiSelect extends IdsDropdownBase {
  protected readonly selectionMode = "multi" as const;
  protected readonly dataIds: IdsDropdownDataIds = DROPDOWN_MULTISELECT_DATA_IDS;

  /**
   * Controlled selected option ids. Omit for uncontrolled (`defaultValue`);
   * set to control — then update it from `ids-change`.
   */
  @property({ attribute: false })
  value: string[] | undefined = undefined;

  @property({ attribute: false })
  defaultValue: string[] = [];

  /**
   * Select All | Clear All row. Default `false` (React API parity);
   * Storybook Spec Accurate Design sets it `true` like the React stories.
   */
  @property({ type: Boolean, attribute: "showselectallclearall", reflect: true })
  showSelectAllClearAll = false;

  @property({ type: String, attribute: "selectalllabel" })
  selectAllLabel = DEFAULT_SELECT_ALL_LABEL;

  @property({ type: String, attribute: "clearalllabel" })
  clearAllLabel = DEFAULT_CLEAR_ALL_LABEL;

  /** Overrides the derived disabled state of Clear All. */
  @property({ type: Boolean, attribute: "clearalldisabled" })
  clearAllDisabled: boolean | undefined = undefined;

  /** Count badge in the field. Default `true`. */
  @property({ converter: defaultTrueBooleanConverter, attribute: "showselectedbadge" })
  showSelectedBadge = true;

  /** Tooltip (header `N Items` + bulleted list) on the badge / value text. Default `true`. */
  @property({ converter: defaultTrueBooleanConverter, attribute: "showselectedtooltip" })
  showSelectedTooltip = true;

  /** In-menu Show / Hide Selected panel (dismissible tags). Default `true`; auto-hides when empty. */
  @property({ converter: defaultTrueBooleanConverter, attribute: "showselectedpanel" })
  showSelectedPanel = true;

  /** Footer action label — fires `ids-action`. */
  @property({ type: String, attribute: "actionlabel" })
  actionLabel = "";

  @state() private internalValue: string[] = [];

  override willUpdate(changed: Map<string, unknown>): void {
    super.willUpdate(changed);
    if (changed.has("defaultValue")) {
      this.internalValue = [...(this.defaultValue ?? [])];
    }
  }

  private get isControlled(): boolean {
    return this.value !== undefined;
  }

  protected override getSelectedIds(): string[] {
    return this.isControlled ? (this.value ?? []) : this.internalValue;
  }

  protected override commitSelection(ids: string[]): void {
    if (!this.isControlled) this.internalValue = ids;
    this.emit("ids-change", { value: ids });
  }

  protected override get menuShowSelectAllClearAll(): boolean {
    return this.showSelectAllClearAll;
  }

  protected override get menuSelectAllLabel(): string {
    return this.selectAllLabel;
  }

  protected override get menuClearAllLabel(): string {
    return this.clearAllLabel;
  }

  protected override get menuShowSelectedPanel(): boolean {
    return this.showSelectedPanel;
  }

  protected override clearAllDisabledDefault(): boolean {
    return this.clearAllDisabled ?? this.getSelectedIds().length === 0;
  }

  protected override get menuFooter(): IdsDropdownFooter | null {
    if (!this.actionLabel) return null;
    return {
      label: this.actionLabel,
      onClick: () => this.emit("ids-action", {}),
    };
  }

  protected override renderFieldContent(): TemplateResult {
    return this.renderMultiFieldContent({
      labels: this.selectedLabels(),
      showBadge: this.showSelectedBadge,
      showTooltip: this.showSelectedTooltip,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-dropdown-multiselect": IdsDropdownMultiSelect;
  }
}
