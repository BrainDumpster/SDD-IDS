/**
 * IDS TreeItem / TreeItemLabel — composable Mode B children.
 *
 * Path: `lib/lit/ids/src/tree`
 * Spec: `components/ids/tree/design-spec.md` (Composition Mode B)
 * API: React `lib/react/ids/tree` (`IdsTreeItem` / `IdsTreeItemLabel`)
 *
 * Renders its own row chrome and nests child `ids-tree-item` nodes in a
 * `role="group"` slot. Coordinates selection / expand with ancestor `ids-tree`.
 */
import { LitElement, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import "../icon/register.js";
import "../badge/register.js";
import type { IdsTree } from "./tree.element.js";
import {
  CHEVRON_ICON_SHAPE,
  DEFAULT_ICON_SHAPE,
  TREE_ICON_SIZE_PX,
  resolveShowBadge,
  resolveShowIcon,
  rowPaddingStart,
  type IdsTreeNode,
} from "./tree.constants.js";
import { treeItemLabelStyles, treeItemStyles } from "./tree.styles.js";

const optionalBooleanConverter = {
  fromAttribute: (value: string | null): boolean | undefined => {
    if (value === null) return undefined;
    if (value === "false") return false;
    return true;
  },
  toAttribute: (value: boolean | undefined): string | null => {
    if (value === undefined) return null;
    return value ? "" : "false";
  },
};

const optionalNumberConverter = {
  fromAttribute: (value: string | null): number | undefined => {
    if (value == null || value === "") return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  },
  toAttribute: (value: number | undefined): string | null => {
    if (value == null) return null;
    return String(value);
  },
};

export class IdsTreeItem extends LitElement {
  static override styles = [treeItemStyles];

  /** Stable row id (required). */
  @property({ type: String, reflect: true })
  override id = "";

  /** Visible label; omit when using `ids-tree-item-label` child. */
  @property({ type: String })
  label = "";

  /** IDS icon slug (`assets/icons/<slug>.svg`). */
  @property({ type: String, attribute: "icon-shape" })
  iconShape?: string;

  /** Numeric badge; omit slot when undefined or 0. */
  @property({ attribute: "badge-count", converter: optionalNumberConverter })
  badgeCount?: number;

  /** Per-row icon override. */
  @property({ attribute: "show-icon", converter: optionalBooleanConverter })
  showIcon?: boolean;

  /** Per-row badge override. */
  @property({ attribute: "show-badge", converter: optionalBooleanConverter })
  showBadge?: boolean;

  /** Runtime depth (0-based). Set by tree / parent sync. */
  @property({ type: Number, reflect: true })
  depth = 0;

  /** Sibling set size for `aria-setsize` (avoid clashing with DOMString ARIA props). */
  @property({ type: Number, attribute: false })
  setSize = 1;

  /** Position among siblings for `aria-posinset`. */
  @property({ type: Number, attribute: false })
  posInSet = 1;

  @state() private childCount = 0;
  @state() private slottedLabel = "";

  @query(".row") private rowEl?: HTMLElement;

  private tree: IdsTree | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsTreeItem");
    this.setAttribute("role", "treeitem");
    this.tree = this.closest("ids-tree");
    this.tree?.registerItem(this);
    this.refreshChildMeta();
  }

  override disconnectedCallback(): void {
    this.tree?.unregisterItem(this);
    this.tree = null;
    super.disconnectedCallback();
  }

  override updated(): void {
    this.syncAria();
  }

  /** Whether this node has nested `ids-tree-item` children. */
  get isBranch(): boolean {
    return this.childCount > 0;
  }

  get isExpanded(): boolean {
    return Boolean(this.tree?.isExpanded(this.id));
  }

  get isSelected(): boolean {
    return Boolean(this.tree?.isSelected(this.id));
  }

  get isFocused(): boolean {
    return Boolean(this.tree?.isFocused(this.id));
  }

  get parentItem(): IdsTreeItem | null {
    const parent = this.parentElement;
    return parent instanceof IdsTreeItem ? parent : null;
  }

  get parentId(): string | undefined {
    return this.parentItem?.id || undefined;
  }

  /** Direct nested item children (composition). */
  get childItems(): IdsTreeItem[] {
    return Array.from(this.children).filter(
      (el): el is IdsTreeItem => el instanceof IdsTreeItem,
    );
  }

  get resolvedLabel(): string {
    return this.label?.trim() || this.slottedLabel.trim() || this.id;
  }

  get path(): string[] {
    const parts: string[] = [];
    let cur: IdsTreeItem | null = this;
    while (cur) {
      if (cur.id) parts.unshift(cur.id);
      cur = cur.parentItem;
    }
    return parts;
  }

  /** Focus the interactive row (roving tabindex). */
  focusRow(): void {
    this.rowEl?.focus();
  }

  /** Recompute nested child count + label from light DOM. */
  refreshChildMeta(): void {
    this.childCount = this.childItems.length;
    const labelEl = Array.from(this.children).find(
      (el) => el instanceof IdsTreeItemLabel,
    ) as IdsTreeItemLabel | undefined;
    this.slottedLabel = labelEl?.textContent?.trim() ?? "";
    this.syncAria();
    this.requestUpdate();
  }

  private syncAria(): void {
    const expanded = this.isBranch ? String(this.isExpanded) : null;
    if (expanded == null) this.removeAttribute("aria-expanded");
    else this.setAttribute("aria-expanded", expanded);
    this.setAttribute("aria-selected", this.isSelected ? "true" : "false");
    this.setAttribute("aria-level", String(this.depth + 1));
    this.setAttribute("aria-setsize", String(this.setSize));
    this.setAttribute("aria-posinset", String(this.posInSet));
  }

  private onSlotChange = (): void => {
    // Ensure labels use the named slot; nested items stay in default slot.
    for (const child of Array.from(this.children)) {
      if (child instanceof IdsTreeItemLabel) {
        if (child.slot !== "label") child.slot = "label";
      } else if (child instanceof IdsTreeItem) {
        if (child.slot) child.removeAttribute("slot");
      }
    }
    this.refreshChildMeta();
    this.tree?.syncComposition();
  };

  private activate(): void {
    this.tree?.activateItem(this);
  }

  private toggleExpand(): void {
    if (!this.isBranch) return;
    this.tree?.toggleExpanded(this.id);
  }

  private toNodeOverrides(): Pick<
    IdsTreeNode,
    "showIcon" | "showBadge" | "badgeCount"
  > {
    return {
      showIcon: this.showIcon,
      showBadge: this.showBadge,
      badgeCount: this.badgeCount,
    };
  }

  override render() {
    const treeShowIcon = this.tree?.showIcon ?? true;
    const treeShowBadge = this.tree?.showBadge ?? true;
    const overrides = this.toNodeOverrides();
    const showIcon = resolveShowIcon(overrides, treeShowIcon);
    const showBadge = resolveShowBadge(overrides, treeShowBadge);
    const iconShape = this.iconShape ?? DEFAULT_ICON_SHAPE;
    const selected = this.isSelected;
    const focused = this.isFocused;
    const expanded = this.isExpanded;
    const branch = this.isBranch;
    const iconColor = selected
      ? "var(--color-icon-brand-base)"
      : "var(--color-icon-gray-neutral-base)";
    const labelText = this.resolvedLabel;

    return html`
      <div
        class=${classMap({
          row: true,
          rowSelected: selected,
          rowFocused: focused,
        })}
        style=${styleMap({ paddingLeft: `${rowPaddingStart(this.depth)}px` })}
        tabindex=${focused ? 0 : -1}
        @focus=${() => this.tree?.setFocusedId(this.id)}
        @click=${(e: MouseEvent) => {
          if ((e.target as HTMLElement).closest("button")) return;
          this.activate();
        }}
      >
        ${branch
          ? html`
              <button
                type="button"
                class="chevronButton"
                aria-label=${expanded ? "Collapse branch" : "Expand branch"}
                tabindex="-1"
                @click=${(e: MouseEvent) => {
                  e.stopPropagation();
                  this.toggleExpand();
                }}
              >
                <ids-icon
                  class=${classMap({
                    chevron: true,
                    chevronExpanded: expanded,
                  })}
                  shape=${CHEVRON_ICON_SHAPE}
                  .size=${TREE_ICON_SIZE_PX}
                  .color=${iconColor}
                ></ids-icon>
              </button>
            `
          : html`<span class="chevronSpacer" aria-hidden="true"></span>`}
        ${showIcon
          ? html`
              <button
                type="button"
                class="chevronButton"
                aria-label=${`Select ${labelText}`}
                tabindex="-1"
                @click=${(e: MouseEvent) => {
                  e.stopPropagation();
                  this.activate();
                }}
              >
                <ids-icon
                  class="folderIcon"
                  shape=${iconShape}
                  .size=${TREE_ICON_SIZE_PX}
                  .color=${iconColor}
                ></ids-icon>
              </button>
            `
          : nothing}
        <div class="labelCluster">
          <button
            type="button"
            class="labelButton"
            tabindex="-1"
            @click=${(e: MouseEvent) => {
              e.stopPropagation();
              this.activate();
            }}
          >
            <span class="label" title=${labelText}>
              <slot name="label">${labelText}</slot>
            </span>
          </button>
          ${showBadge
            ? html`
                <ids-badge
                  class="treeBadge"
                  type="default"
                  .value=${this.badgeCount as number}
                  aria-hidden="true"
                ></ids-badge>
              `
            : nothing}
        </div>
      </div>
      <div
        class="group"
        role="group"
        ?hidden=${!branch || !expanded}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
    `;
  }
}

/** Label slot for composable `ids-tree-item` (maps to `tree-item-label`). */
export class IdsTreeItemLabel extends LitElement {
  static override styles = [treeItemLabelStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsTreeItemLabel");
    if (this.slot !== "label") this.slot = "label";
    const parent = this.parentElement;
    if (parent instanceof IdsTreeItem) parent.refreshChildMeta();
  }

  override disconnectedCallback(): void {
    const parent = this.parentElement;
    super.disconnectedCallback();
    if (parent instanceof IdsTreeItem) parent.refreshChildMeta();
  }

  override render() {
    return html`<slot></slot>`;
  }
}
