/**
 * IdsDualListBox — Lit web component.
 *
 * Tag: `ids-dual-list-box`
 * Spec: `components/ids/dual-list-box/design-spec.md`
 * API parity: React `lib/react/ids/dual-list-box` (`IdsDualListBox`)
 *
 * Anatomy (shadow DOM, DualListBoxRoot):
 *   ids-dual-list-box
 *     ListsParent
 *       AvailablePane → header + metrics + list group
 *       TransferButtonGroup → MoveAllRight … MoveAllLeft
 *       SelectedPane → header + metrics + list group
 *
 * Live Figma (0bHk3XhrjFhowgFkz9yLr4, MCP session):
 *   assembly `12114:232557`, list item `12114:230677`, transfer `12337:28658`
 */
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import "../icon/register.js";
import "../tooltip/register.js";
import type { IdsTooltipArrowAlign, IdsTooltipSide } from "../tooltip/index.js";
import {
  DUAL_LIST_BOX_RUNTIME_DEFAULTS,
  DRAG_DATA_TYPE,
  DRAG_HANDLE_ICON,
  SELECTION_CHECK_ICON,
  TRANSFER_BUTTONS,
  assertUniqueIds,
  buildTransferLabels,
  insertAt,
  itemAccessibleName,
  itemFocusKey,
  removeById,
  resolveMetricsFormat,
  resolveTransferStates,
  type DualListBoxDragDropDetail,
  type DualListBoxDragSession,
  type DualListBoxDropIndicator,
  type DualListBoxItem,
  type DualListBoxItemsChangeDetail,
  type DualListBoxMetricsFormat,
  type DualListBoxPane,
  type DualListBoxTransferAction,
  type DualListBoxTransferDetail,
  type TransferVisualState,
} from "./dual-list-box.constants.js";
import {
  dualListBoxHostStyles,
  dualListBoxStyles,
} from "./dual-list-box.styles.js";

let dualListBoxUid = 0;

export class IdsDualListBox extends LitElement {
  static override styles = [dualListBoxHostStyles, dualListBoxStyles];

  private readonly instanceId = `ids-dual-list-box-${++dualListBoxUid}`;

  @property({ attribute: false })
  availableItems: DualListBoxItem[] = [];

  @property({ attribute: false })
  selectedItems: DualListBoxItem[] = [];

  @property({ type: String, attribute: "available-title" })
  availableTitle = DUAL_LIST_BOX_RUNTIME_DEFAULTS.availableTitle;

  @property({ type: String, attribute: "selected-title" })
  selectedTitle = DUAL_LIST_BOX_RUNTIME_DEFAULTS.selectedTitle;

  @property({ type: String, attribute: "available-placeholder" })
  availablePlaceholder = DUAL_LIST_BOX_RUNTIME_DEFAULTS.availablePlaceholder;

  @property({ type: String, attribute: "selected-placeholder" })
  selectedPlaceholder = DUAL_LIST_BOX_RUNTIME_DEFAULTS.selectedPlaceholder;

  @property({ type: String, attribute: "move-selected-right-title" })
  moveSelectedRightTitle =
    DUAL_LIST_BOX_RUNTIME_DEFAULTS.moveSelectedRightTitle;

  @property({ type: String, attribute: "move-selected-left-title" })
  moveSelectedLeftTitle = DUAL_LIST_BOX_RUNTIME_DEFAULTS.moveSelectedLeftTitle;

  @property({ type: String, attribute: "move-all-right-title" })
  moveAllRightTitle?: string;

  @property({ type: String, attribute: "move-all-left-title" })
  moveAllLeftTitle?: string;

  @property({ attribute: false })
  availableSelection?: string[];

  @property({ attribute: false })
  selectedSelection?: string[];

  @property({ attribute: false })
  defaultAvailableSelection: string[] = [];

  @property({ attribute: false })
  defaultSelectedSelection: string[] = [];

  @property({ type: Boolean, attribute: "show-metrics" })
  showMetrics = DUAL_LIST_BOX_RUNTIME_DEFAULTS.showMetrics;

  @property({ type: String, attribute: "metrics-format" })
  metricsFormat: DualListBoxMetricsFormat | string =
    DUAL_LIST_BOX_RUNTIME_DEFAULTS.metricsFormat;

  @property({ type: Boolean, attribute: "enable-drag-drop" })
  enableDragDrop = DUAL_LIST_BOX_RUNTIME_DEFAULTS.enableDragDrop;

  @property({ type: String, attribute: "item-tooltip-side" })
  itemTooltipSide: IdsTooltipSide | string =
    DUAL_LIST_BOX_RUNTIME_DEFAULTS.itemTooltipSide;

  @property({ type: String, attribute: "item-tooltip-arrow-align" })
  itemTooltipArrowAlign: IdsTooltipArrowAlign | string =
    DUAL_LIST_BOX_RUNTIME_DEFAULTS.itemTooltipArrowAlign;

  @property({ type: String, attribute: "aria-label" })
  override ariaLabel = DUAL_LIST_BOX_RUNTIME_DEFAULTS.ariaLabel;

  /** React API parity callbacks. */
  @property({ attribute: false })
  onAvailableSelectionChange?: (ids: string[]) => void;

  @property({ attribute: false })
  onSelectedSelectionChange?: (ids: string[]) => void;

  @property({ attribute: false })
  onItemsChange?: (detail: DualListBoxItemsChangeDetail) => void;

  @property({ attribute: false })
  onTransfer?: (detail: DualListBoxTransferDetail) => void;

  @property({ attribute: false })
  onDragDrop?: (detail: DualListBoxDragDropDetail) => void;

  @state() private availableItemsInternal: DualListBoxItem[] = [];
  @state() private selectedItemsInternal: DualListBoxItem[] = [];
  @state() private availableSelectionInternal: string[] = [];
  @state() private selectedSelectionInternal: string[] = [];
  @state() private dragSession: DualListBoxDragSession | null = null;
  @state() private dropIndicator: DualListBoxDropIndicator | null = null;
  @state() private focusedItemKey: string | null = null;

  private defaultsApplied = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-dual-list-box");
    this.setAttribute("role", "group");
    this.setAttribute(
      "aria-label",
      this.ariaLabel || DUAL_LIST_BOX_RUNTIME_DEFAULTS.ariaLabel,
    );
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("availableItems") || changed.has("selectedItems")) {
      assertUniqueIds(this.availableItems ?? [], this.selectedItems ?? []);
      this.availableItemsInternal = [...(this.availableItems ?? [])];
      this.selectedItemsInternal = [...(this.selectedItems ?? [])];
    }
    if (!this.defaultsApplied) {
      this.availableSelectionInternal = [
        ...(this.defaultAvailableSelection ?? []),
      ];
      this.selectedSelectionInternal = [
        ...(this.defaultSelectedSelection ?? []),
      ];
      this.defaultsApplied = true;
    }
    if (changed.has("ariaLabel")) {
      this.setAttribute(
        "aria-label",
        this.ariaLabel || DUAL_LIST_BOX_RUNTIME_DEFAULTS.ariaLabel,
      );
    }
  }

  get resolvedAvailableItems(): DualListBoxItem[] {
    return this.availableItemsInternal;
  }

  get resolvedSelectedItems(): DualListBoxItem[] {
    return this.selectedItemsInternal;
  }

  get resolvedAvailableSelection(): string[] {
    return this.availableSelection ?? this.availableSelectionInternal;
  }

  get resolvedSelectedSelection(): string[] {
    return this.selectedSelection ?? this.selectedSelectionInternal;
  }

  get resolvedMetricsFormat(): DualListBoxMetricsFormat {
    return resolveMetricsFormat(this.metricsFormat);
  }

  get transferLabels(): Record<DualListBoxTransferAction, string> {
    return buildTransferLabels(this.availableTitle, this.selectedTitle, {
      moveSelectedRightTitle: this.moveSelectedRightTitle,
      moveSelectedLeftTitle: this.moveSelectedLeftTitle,
      moveAllRightTitle: this.moveAllRightTitle,
      moveAllLeftTitle: this.moveAllLeftTitle,
    });
  }

  get transferStates(): Record<
    DualListBoxTransferAction,
    TransferVisualState
  > {
    return resolveTransferStates(
      this.resolvedAvailableItems.length,
      this.resolvedSelectedItems.length,
      this.resolvedAvailableSelection.length,
      this.resolvedSelectedSelection.length,
    );
  }

  private setAvailableSelection(ids: string[]): void {
    if (this.availableSelection === undefined) {
      this.availableSelectionInternal = ids;
    }
    this.onAvailableSelectionChange?.(ids);
    this.dispatchEvent(
      new CustomEvent("available-selection-change", {
        detail: ids,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setSelectedSelection(ids: string[]): void {
    if (this.selectedSelection === undefined) {
      this.selectedSelectionInternal = ids;
    }
    this.onSelectedSelectionChange?.(ids);
    this.dispatchEvent(
      new CustomEvent("selected-selection-change", {
        detail: ids,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitItemsChange(
    available: DualListBoxItem[],
    selected: DualListBoxItem[],
  ): void {
    this.availableItemsInternal = available;
    this.selectedItemsInternal = selected;
    const detail = { available, selected };
    this.onItemsChange?.(detail);
    this.dispatchEvent(
      new CustomEvent("items-change", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  runTransfer(action: DualListBoxTransferAction): void {
    if (this.transferStates[action] !== "default") return;

    let movedIds: string[] = [];
    let nextAvailable = [...this.resolvedAvailableItems];
    let nextSelected = [...this.resolvedSelectedItems];

    const moveByIds = (
      ids: string[],
      from: DualListBoxItem[],
      to: DualListBoxItem[],
    ) => {
      const idSet = new Set(ids);
      const moving = from.filter((entry) => idSet.has(entry.id));
      return {
        from: from.filter((entry) => !idSet.has(entry.id)),
        to: [...to, ...moving],
        moved: moving.map((entry) => entry.id),
      };
    };

    switch (action) {
      case "moveAllRight": {
        movedIds = nextAvailable.map((entry) => entry.id);
        nextSelected = [...nextSelected, ...nextAvailable];
        nextAvailable = [];
        break;
      }
      case "moveSelectedRight": {
        const result = moveByIds(
          this.resolvedAvailableSelection,
          nextAvailable,
          nextSelected,
        );
        nextAvailable = result.from;
        nextSelected = result.to;
        movedIds = result.moved;
        this.setAvailableSelection([]);
        break;
      }
      case "moveSelectedLeft": {
        const result = moveByIds(
          this.resolvedSelectedSelection,
          nextSelected,
          nextAvailable,
        );
        nextSelected = result.from;
        nextAvailable = result.to;
        movedIds = result.moved;
        this.setSelectedSelection([]);
        break;
      }
      case "moveAllLeft": {
        movedIds = nextSelected.map((entry) => entry.id);
        nextAvailable = [...nextAvailable, ...nextSelected];
        nextSelected = [];
        break;
      }
      default:
        break;
    }

    this.emitItemsChange(nextAvailable, nextSelected);
    const detail = { action, movedIds };
    this.onTransfer?.(detail);
    this.dispatchEvent(
      new CustomEvent("transfer", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private applyDragDrop(
    session: DualListBoxDragSession,
    targetPane: DualListBoxPane,
    targetItemId: string | null,
    position: "before" | "after",
  ): void {
    const sourceList =
      session.sourcePane === "available"
        ? this.resolvedAvailableItems
        : this.resolvedSelectedItems;
    const item = sourceList.find((entry) => entry.id === session.itemId) ?? null;
    if (!item) return;

    let nextAvailable = [...this.resolvedAvailableItems];
    let nextSelected = [...this.resolvedSelectedItems];

    const resolveInsertIndex = (list: DualListBoxItem[]): number => {
      if (!targetItemId) return list.length;
      const targetIndex = list.findIndex((entry) => entry.id === targetItemId);
      if (targetIndex < 0) return list.length;
      return position === "after" ? targetIndex + 1 : targetIndex;
    };

    if (session.sourcePane === targetPane) {
      const list = targetPane === "available" ? nextAvailable : nextSelected;
      const fromIndex = list.findIndex((entry) => entry.id === session.itemId);
      if (fromIndex < 0) return;
      let insertIndex = resolveInsertIndex(list);
      const reordered = [...list];
      const [moved] = reordered.splice(fromIndex, 1);
      if (fromIndex < insertIndex) insertIndex -= 1;
      reordered.splice(insertIndex, 0, moved!);
      if (targetPane === "available") nextAvailable = reordered;
      else nextSelected = reordered;
    } else {
      if (session.sourcePane === "available") {
        nextAvailable = removeById(nextAvailable, session.itemId);
      } else {
        nextSelected = removeById(nextSelected, session.itemId);
      }
      const listRef = targetPane === "available" ? nextAvailable : nextSelected;
      const insertIndex = resolveInsertIndex(listRef);
      if (targetPane === "available") {
        nextAvailable = insertAt(nextAvailable, insertIndex, item);
      } else {
        nextSelected = insertAt(nextSelected, insertIndex, item);
      }
      if (session.sourcePane === "available") {
        this.setAvailableSelection(
          this.resolvedAvailableSelection.filter(
            (id) => id !== session.itemId,
          ),
        );
      } else {
        this.setSelectedSelection(
          this.resolvedSelectedSelection.filter((id) => id !== session.itemId),
        );
      }
    }

    const toIndex =
      targetPane === "available"
        ? nextAvailable.findIndex((entry) => entry.id === session.itemId)
        : nextSelected.findIndex((entry) => entry.id === session.itemId);

    this.emitItemsChange(nextAvailable, nextSelected);
    const detail: DualListBoxDragDropDetail = {
      itemId: session.itemId,
      from: session.sourcePane,
      to: targetPane,
      toIndex: toIndex >= 0 ? toIndex : 0,
    };
    this.onDragDrop?.(detail);
    this.dispatchEvent(
      new CustomEvent("drag-drop", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private clearDrag(): void {
    this.dragSession = null;
    this.dropIndicator = null;
  }

  private handleDragStart(
    pane: DualListBoxPane,
    itemId: string,
    hadSelection: boolean,
  ): void {
    if (!this.enableDragDrop) return;
    this.dragSession = { itemId, sourcePane: pane, hadSelection };
  }

  private handleDrop(
    pane: DualListBoxPane,
    targetItemId: string | null,
    position: "before" | "after",
  ): void {
    if (!this.dragSession) return;
    this.applyDragDrop(this.dragSession, pane, targetItemId, position);
    this.clearDrag();
  }

  private toggleItem(pane: DualListBoxPane, id: string): void {
    if (pane === "available") {
      const selection = this.resolvedAvailableSelection;
      const next = selection.includes(id)
        ? selection.filter((entry) => entry !== id)
        : [...selection, id];
      this.setAvailableSelection(next);
      return;
    }
    const selection = this.resolvedSelectedSelection;
    const next = selection.includes(id)
      ? selection.filter((entry) => entry !== id)
      : [...selection, id];
    this.setSelectedSelection(next);
  }

  private focusItem(pane: DualListBoxPane, id: string): void {
    this.focusedItemKey = itemFocusKey(pane, id);
    requestAnimationFrame(() => {
      this.renderRoot
        .querySelector<HTMLElement>(
          `#${CSS.escape(`${this.instanceId}-item-${pane}-${id}`)}`,
        )
        ?.focus();
    });
  }

  private handleListKeyDown(
    event: KeyboardEvent,
    pane: DualListBoxPane,
    items: DualListBoxItem[],
  ): void {
    if (!items.length) return;

    const currentIndex = items.findIndex(
      (entry) => this.focusedItemKey === itemFocusKey(pane, entry.id),
    );
    const index = currentIndex >= 0 ? currentIndex : 0;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        this.focusItem(pane, items[Math.min(index + 1, items.length - 1)]!.id);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        this.focusItem(pane, items[Math.max(index - 1, 0)]!.id);
        break;
      }
      case "Home": {
        event.preventDefault();
        this.focusItem(pane, items[0]!.id);
        break;
      }
      case "End": {
        event.preventDefault();
        this.focusItem(pane, items[items.length - 1]!.id);
        break;
      }
      case "Escape": {
        event.preventDefault();
        if (pane === "available") this.setAvailableSelection([]);
        else this.setSelectedSelection([]);
        break;
      }
      default:
        break;
    }
  }

  private renderMetrics(
    pane: DualListBoxPane,
    totalCount: number,
    selectedCount: number,
  ): TemplateResult | typeof nothing {
    if (!this.showMetrics) return nothing;
    const format = this.resolvedMetricsFormat;
    const dataIds =
      pane === "available"
        ? "ids-dual-list-box-available-metrics"
        : "ids-dual-list-box-selected-metrics";
    const slot =
      pane === "available" ? "AvailableMetrics" : "SelectedMetrics";

    return html`
      <p
        class="ids-dual-list-box-metrics"
        data-ids=${dataIds}
        data-slot=${slot}
        aria-live="polite"
      >
        ${format === "total-and-selected" && selectedCount > 0
          ? html`
              <span class="ids-dual-list-box-metrics-selected"
                >Selected: ${selectedCount}</span
              >
              <span class="ids-dual-list-box-metrics-divider" aria-hidden>
                |
              </span>
            `
          : nothing}
        <span class="ids-dual-list-box-metrics-total">
          Total:
          <span class="ids-dual-list-box-metrics-total-value"
            >${totalCount}</span
          >
        </span>
      </p>
    `;
  }

  private renderDragHandle(
    item: DualListBoxItem,
    pane: DualListBoxPane,
    isSelected: boolean,
    isDragging: boolean,
  ): TemplateResult {
    const name = itemAccessibleName(item);
    return html`
      <span
        class="ids-dual-list-box-drag-handle"
        data-ids="ids-dual-list-box-drag-handle"
        data-slot="DragHandle"
        draggable=${this.enableDragDrop ? "true" : "false"}
        aria-label=${`Drag ${name}`}
        @dragstart=${(event: DragEvent) => {
          if (!this.enableDragDrop) return;
          event.stopPropagation();
          event.dataTransfer!.effectAllowed = "move";
          event.dataTransfer!.setData(
            DRAG_DATA_TYPE,
            JSON.stringify({ id: item.id, pane }),
          );
          this.handleDragStart(pane, item.id, isSelected);
        }}
        @dragend=${() => this.clearDrag()}
        @click=${(event: Event) => event.stopPropagation()}
        @mousedown=${(event: Event) => event.stopPropagation()}
      >
        <ids-icon
          shape=${DRAG_HANDLE_ICON}
          size="16"
          color=${isSelected || isDragging
            ? "var(--color-icon-brand-base)"
            : "var(--color-icon-gray-neutral-base)"}
        ></ids-icon>
      </span>
    `;
  }

  private renderItemContent(item: DualListBoxItem): TemplateResult {
    const name = itemAccessibleName(item);
    return html`
      <span
        class="ids-dual-list-box-item-content"
        data-ids="ids-dual-list-box-item-content"
        data-slot="ItemContent"
      >
        <span class="ids-dual-list-box-item-name">${name}</span>
        ${item.description
          ? html`<span class="ids-dual-list-box-item-description"
              >${item.description}</span
            >`
          : nothing}
      </span>
    `;
  }

  private renderListItem(
    item: DualListBoxItem,
    pane: DualListBoxPane,
  ): TemplateResult {
    const selection =
      pane === "available"
        ? this.resolvedAvailableSelection
        : this.resolvedSelectedSelection;
    const isSelected = selection.includes(item.id);
    const isFocused = this.focusedItemKey === itemFocusKey(pane, item.id);
    const isDragging = this.dragSession?.itemId === item.id;
    const dropOnThis =
      this.dropIndicator?.pane === pane &&
      this.dropIndicator.targetItemId === item.id;
    const dropPosition = dropOnThis
      ? (this.dropIndicator?.position ?? null)
      : null;
    const showCheck = isSelected && !isDragging;
    const dragVisual =
      isDragging && this.dragSession
        ? this.dragSession.hadSelection
          ? "dragWithSelection"
          : "dragWithoutSelection"
        : null;

    const resolveDropPosition = (
      event: DragEvent,
      target: HTMLElement,
    ): "before" | "after" => {
      const rect = target.getBoundingClientRect();
      return event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    };

    const row = html`
      ${dropPosition === "before"
        ? html`<div class="ids-dual-list-box-drop-preview" aria-hidden>
            <span class="ids-dual-list-box-drop-preview-inner"></span>
          </div>`
        : nothing}
      <div
        id=${`${this.instanceId}-item-${pane}-${item.id}`}
        role="option"
        aria-selected=${isSelected ? "true" : "false"}
        aria-grabbed=${isDragging ? "true" : "false"}
        tabindex=${isFocused ? 0 : -1}
        class=${classMap({
          "ids-dual-list-box-list-item": true,
          "ids-dual-list-box-list-item--focused": isFocused,
          "ids-dual-list-box-list-item--selected": isSelected && !isDragging,
          "ids-dual-list-box-list-item--drag-with-selection":
            dragVisual === "dragWithSelection",
          "ids-dual-list-box-list-item--drag-without-selection":
            dragVisual === "dragWithoutSelection",
          "ids-dual-list-box-list-item--dragging": isDragging,
        })}
        data-ids="ids-dual-list-box-list-item"
        data-slot="ListItem"
        @click=${() => this.toggleItem(pane, item.id)}
        @focus=${() => this.focusItem(pane, item.id)}
        @keydown=${(event: KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.toggleItem(pane, item.id);
          }
        }}
        @dragover=${(event: DragEvent) => {
          if (!this.enableDragDrop || !this.dragSession) return;
          event.preventDefault();
          event.stopPropagation();
          event.dataTransfer!.dropEffect = "move";
          const target = event.currentTarget as HTMLElement;
          this.dropIndicator = {
            pane,
            targetItemId: item.id,
            position: resolveDropPosition(event, target),
          };
        }}
        @drop=${(event: DragEvent) => {
          event.preventDefault();
          event.stopPropagation();
          const target = event.currentTarget as HTMLElement;
          this.handleDrop(pane, item.id, resolveDropPosition(event, target));
        }}
      >
        ${this.renderDragHandle(item, pane, isSelected, !!isDragging)}
        ${this.renderItemContent(item)}
        ${showCheck
          ? html`
              <span
                class="ids-dual-list-box-selection-check"
                data-ids="ids-dual-list-box-selection-check"
                data-slot="SelectionCheck"
                aria-hidden="true"
              >
                <ids-icon
                  shape=${SELECTION_CHECK_ICON}
                  size="16"
                  color="var(--color-icon-brand-base)"
                ></ids-icon>
              </span>
            `
          : nothing}
      </div>
      ${dropPosition === "after"
        ? html`<div class="ids-dual-list-box-drop-preview" aria-hidden>
            <span class="ids-dual-list-box-drop-preview-inner"></span>
          </div>`
        : nothing}
    `;

    const title = item.tooltipTitle?.trim();
    const description = item.tooltipDescription?.trim();
    const wrapped = html`
      <div class="ids-dual-list-box-list-item-wrap">${row}</div>
    `;

    if (!title && !description) return wrapped;

    return html`
      <ids-tooltip
        side=${this.itemTooltipSide}
        arrowalign=${this.itemTooltipArrowAlign}
        .closable=${false}
        trigger-display="block"
      >
        <ids-tooltip-trigger>${wrapped}</ids-tooltip-trigger>
        <ids-tooltip-panel>
          ${title && description
            ? html`<ids-tooltip-header>${title}</ids-tooltip-header>`
            : nothing}
          <ids-tooltip-body>${description || title}</ids-tooltip-body>
        </ids-tooltip-panel>
      </ids-tooltip>
    `;
  }

  private renderListGroup(pane: DualListBoxPane): TemplateResult {
    const items =
      pane === "available"
        ? this.resolvedAvailableItems
        : this.resolvedSelectedItems;
    const empty = items.length === 0;
    const placeholder =
      pane === "available"
        ? this.availablePlaceholder
        : this.selectedPlaceholder;
    const listboxLabel =
      pane === "available" ? this.availableTitle : this.selectedTitle;
    const isDragOverPane =
      this.enableDragDrop &&
      this.dragSession !== null &&
      (empty || this.dropIndicator?.pane === pane);

    return html`
      <div
        class=${classMap({
          "ids-dual-list-box-list-group": true,
          "ids-dual-list-box-list-group--available": pane === "available",
          "ids-dual-list-box-list-group--selected": pane === "selected",
          "ids-dual-list-box-list-group--empty": empty,
          "ids-dual-list-box-list-group--drag-over": isDragOverPane,
        })}
        role="listbox"
        aria-label=${listboxLabel}
        aria-multiselectable="true"
        data-ids=${pane === "available"
          ? "ids-dual-list-box-available-list-group"
          : "ids-dual-list-box-selected-list-group"}
        data-slot=${pane === "available"
          ? "AvailableListGroup"
          : "SelectedListGroup"}
        @dragover=${(event: DragEvent) => {
          if (!this.enableDragDrop || !this.dragSession) return;
          event.preventDefault();
          event.dataTransfer!.dropEffect = "move";
        }}
        @drop=${(event: DragEvent) => {
          event.preventDefault();
          if (!this.enableDragDrop || !this.dragSession) return;
          if (
            this.dropIndicator?.pane === pane &&
            this.dropIndicator.targetItemId
          ) {
            this.handleDrop(
              pane,
              this.dropIndicator.targetItemId,
              this.dropIndicator.position,
            );
            return;
          }
          this.handleDrop(pane, null, "after");
        }}
        @dragleave=${(event: DragEvent) => {
          const current = event.currentTarget as HTMLElement;
          if (current.contains(event.relatedTarget as Node)) return;
          if (this.dropIndicator?.pane === pane) this.dropIndicator = null;
        }}
      >
        ${empty
          ? html`<p
              class="ids-dual-list-box-empty-placeholder"
              role="status"
              aria-live="polite"
            >
              ${placeholder}
            </p>`
          : html`
              <div
                class="ids-dual-list-box-list-scroll"
                tabindex="0"
                @keydown=${(event: KeyboardEvent) =>
                  this.handleListKeyDown(event, pane, items)}
                @focus=${(event: FocusEvent) => {
                  if (event.target !== event.currentTarget || !items[0]) return;
                  const hasPaneFocus = this.focusedItemKey?.startsWith(
                    `${pane}:`,
                  );
                  if (!hasPaneFocus) this.focusItem(pane, items[0].id);
                }}
              >
                ${repeat(
                  items,
                  (item) => item.id,
                  (item) => this.renderListItem(item, pane),
                )}
              </div>
            `}
      </div>
    `;
  }

  private renderPane(pane: DualListBoxPane): TemplateResult {
    const title =
      pane === "available" ? this.availableTitle : this.selectedTitle;
    const items =
      pane === "available"
        ? this.resolvedAvailableItems
        : this.resolvedSelectedItems;
    const selection =
      pane === "available"
        ? this.resolvedAvailableSelection
        : this.resolvedSelectedSelection;

    return html`
      <div
        class=${pane === "available"
          ? "ids-dual-list-box-available-pane"
          : "ids-dual-list-box-selected-pane"}
        data-ids=${pane === "available"
          ? "ids-dual-list-box-available-pane"
          : "ids-dual-list-box-selected-pane"}
        data-slot=${pane === "available" ? "AvailablePane" : "SelectedPane"}
      >
        <div
          class=${classMap({
            "ids-dual-list-box-pane-header": true,
            "ids-dual-list-box-pane-header--available": pane === "available",
            "ids-dual-list-box-pane-header--selected": pane === "selected",
          })}
          data-ids=${pane === "available"
            ? "ids-dual-list-box-available-pane-header"
            : "ids-dual-list-box-selected-pane-header"}
          data-slot=${pane === "available"
            ? "AvailablePaneHeader"
            : "SelectedPaneHeader"}
        >
          <h3 class="ids-dual-list-box-pane-title">${title}</h3>
          ${this.renderMetrics(pane, items.length, selection.length)}
        </div>
        ${this.renderListGroup(pane)}
      </div>
    `;
  }

  private renderTransferGroup(): TemplateResult {
    return html`
      <div
        class="ids-dual-list-box-transfer-group"
        role="toolbar"
        aria-label="Transfer actions"
        data-ids="ids-dual-list-box-transfer-button-group"
        data-slot="TransferButtonGroup"
      >
        ${TRANSFER_BUTTONS.map((meta) => {
          const isDefault = this.transferStates[meta.action] === "default";
          const label = this.transferLabels[meta.action];
          return html`
            <button
              type="button"
              class=${classMap({
                "ids-dual-list-box-transfer-btn": true,
                "ids-dual-list-box-transfer-btn--default": isDefault,
                "ids-dual-list-box-transfer-btn--disabled": !isDefault,
              })}
              ?disabled=${!isDefault}
              title=${label}
              aria-label=${label}
              aria-disabled=${!isDefault ? "true" : "false"}
              data-ids=${meta.dataIds}
              data-slot=${meta.anatomy}
              @click=${() => this.runTransfer(meta.action)}
              @keydown=${(event: KeyboardEvent) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  this.runTransfer(meta.action);
                }
              }}
            >
              <ids-icon
                shape=${meta.icon}
                size="16"
                color=${isDefault
                  ? "var(--color-icon-gray-white)"
                  : "var(--color-icon-gray-disabled)"}
              ></ids-icon>
            </button>
          `;
        })}
      </div>
    `;
  }

  override render() {
    return html`
      <div
        class="ids-dual-list-box"
        data-ids="ids-dual-list-box"
        data-slot="DualListBoxRoot"
      >
        <div
          class="ids-dual-list-box-lists-parent"
          data-ids="ids-dual-list-box-lists-parent"
          data-slot="ListsParent"
        >
          ${this.renderPane("available")} ${this.renderTransferGroup()}
          ${this.renderPane("selected")}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-dual-list-box": IdsDualListBox;
  }
}
