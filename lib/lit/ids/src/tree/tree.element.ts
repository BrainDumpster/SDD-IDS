/**
 * IdsTree — Lit web component.
 *
 * Tag: `ids-tree`
 * Spec: `components/ids/tree/design-spec.md`
 * API parity: React `lib/react/ids/tree` (`IdsTree`)
 *
 * Composition (preferred Mode B):
 *   <ids-tree>
 *     <ids-tree-item id="t1">
 *       <ids-tree-item-label>Tree1</ids-tree-item-label>
 *       <ids-tree-item id="t1-1">…</ids-tree-item>
 *     </ids-tree-item>
 *   </ids-tree>
 *
 * Mode A: `items: IdsTreeNode[]` — root synthesizes the same nested
 * `ids-tree-item` composition in shadow DOM (nested nodes supported).
 *
 * Live Figma (0bHk3XhrjFhowgFkz9yLr4, MCP 2026-11-13):
 *   Tree-Main `18571:102051`, Element L1 default `18571:101904`, selected `18571:101909`
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { IdsTreeItem } from "./tree-item.element.js";
import {
  TREE_RUNTIME_DEFAULTS,
  type IdsTreeNode,
  type TreeItemClickDetail,
} from "./tree.constants.js";
import { treeStyles } from "./tree.styles.js";

export class IdsTree extends LitElement {
  static override styles = [treeStyles];

  /** Mode A: hierarchical data. When non-empty, slotted Mode B children are ignored. */
  @property({ attribute: false })
  items: IdsTreeNode[] = [];

  /** Controlled selection id. */
  @property({ type: String, attribute: "selected-id" })
  selectedId?: string;

  /** Initial selection (uncontrolled). */
  @property({ type: String, attribute: "default-selected-id" })
  defaultSelectedId?: string;

  /** Initially expanded branch ids. */
  @property({ attribute: false })
  defaultExpandedIds: string[] = [];

  /** Tree default for node icons. */
  @property({ type: Boolean, attribute: "show-icon", reflect: true })
  showIcon: boolean = TREE_RUNTIME_DEFAULTS.showIcon;

  /** Tree default for count badges. */
  @property({ type: Boolean, attribute: "show-badge", reflect: true })
  showBadge: boolean = TREE_RUNTIME_DEFAULTS.showBadge;

  /** Accessible name on `role="tree"`. */
  @property({ type: String, attribute: "aria-label" })
  override ariaLabel = TREE_RUNTIME_DEFAULTS.ariaLabel;

  /** React API parity — root selection / activation. */
  @property({ attribute: false })
  onTreeItemClick?: (detail: TreeItemClickDetail) => void;

  /** @deprecated Prefer `onTreeItemClick`. */
  @property({ attribute: false })
  onSelect?: (id: string) => void;

  /** React API parity — chevron expand/collapse. */
  @property({ attribute: false })
  onExpandChange?: (id: string, expanded: boolean) => void;

  @state() private selectedIdUncontrolled = "";
  @state() private expandedIds = new Set<string>();
  @state() private focusedId: string | null = null;

  private itemsRegistry = new Set<IdsTreeItem>();
  private defaultsApplied = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsTree");
    this.setAttribute("role", "tree");
    this.tabIndex = 0;
    this.addEventListener("keydown", this.onRootKeyDown);
  }

  override disconnectedCallback(): void {
    this.removeEventListener("keydown", this.onRootKeyDown);
    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.applyDefaultsIfNeeded();
    this.syncComposition();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("ariaLabel")) {
      this.setAttribute(
        "aria-label",
        this.ariaLabel || TREE_RUNTIME_DEFAULTS.ariaLabel,
      );
    }
    if (changed.has("defaultExpandedIds") && !this.defaultsApplied) {
      this.expandedIds = new Set(this.defaultExpandedIds ?? []);
    }
    if (
      changed.has("defaultSelectedId") ||
      changed.has("items") ||
      changed.has("selectedId")
    ) {
      this.applyDefaultsIfNeeded();
    }
    if (changed.has("items") || changed.has("showIcon") || changed.has("showBadge")) {
      // Mode A children upgrade asynchronously — resync after paint.
      queueMicrotask(() => this.syncComposition());
    }
    if (changed.has("expandedIds") || changed.has("selectedIdUncontrolled") || changed.has("focusedId") || changed.has("selectedId")) {
      this.refreshRegisteredItems();
    }
    this.syncFocusedRow();
  }

  get useItemsMode(): boolean {
    return this.items != null && this.items.length > 0;
  }

  get resolvedSelectedId(): string {
    return this.selectedId ?? this.selectedIdUncontrolled;
  }

  /** Public — used by `ids-tree-item`. */
  registerItem(item: IdsTreeItem): void {
    this.itemsRegistry.add(item);
    this.applyDefaultsIfNeeded();
    this.syncComposition();
  }

  /** Public — used by `ids-tree-item`. */
  unregisterItem(item: IdsTreeItem): void {
    this.itemsRegistry.delete(item);
  }

  isExpanded(id: string): boolean {
    return this.expandedIds.has(id);
  }

  isSelected(id: string): boolean {
    return this.resolvedSelectedId === id;
  }

  isFocused(id: string): boolean {
    return this.focusedId === id;
  }

  setFocusedId(id: string): void {
    this.focusedId = id;
  }

  toggleExpanded(id: string): void {
    const next = new Set(this.expandedIds);
    const expanded = !next.has(id);
    if (expanded) next.add(id);
    else next.delete(id);
    this.expandedIds = next;
    this.onExpandChange?.(id, expanded);
    this.dispatchEvent(
      new CustomEvent("expand-change", {
        detail: { id, expanded },
        bubbles: true,
        composed: true,
      }),
    );
    this.syncComposition();
  }

  activateItem(item: IdsTreeItem): void {
    if (this.selectedId === undefined) {
      this.selectedIdUncontrolled = item.id;
    }
    this.focusedId = item.id;
    const detail: TreeItemClickDetail = {
      id: item.id,
      label: item.resolvedLabel,
      depth: item.depth,
      parentId: item.parentId,
      hasChildren: item.isBranch,
      selected: true,
      path: item.path,
    };
    this.onTreeItemClick?.(detail);
    this.onSelect?.(item.id);
    this.dispatchEvent(
      new CustomEvent("tree-item-click", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: item.id,
        bubbles: true,
        composed: true,
      }),
    );
    this.refreshRegisteredItems();
  }

  /**
   * Walk composed / slotted items: depth, aria setsize/posinset, visibility
   * under collapsed ancestors, and focus fallback.
   */
  syncComposition(): void {
    const roots = this.useItemsMode
      ? this.shadowRootItems()
      : this.slottedRootItems();

    const walk = (
      items: IdsTreeItem[],
      depth: number,
      ancestorsExpanded: boolean,
    ): void => {
      items.forEach((item, index) => {
        item.depth = depth;
        item.setSize = items.length;
        item.posInSet = index + 1;
        const visible = ancestorsExpanded;
        item.hidden = !visible;
        item.refreshChildMeta();
        const childAncestorsExpanded =
          visible && (!item.isBranch || this.isExpanded(item.id));
        walk(item.childItems, depth + 1, childAncestorsExpanded);
      });
    };

    walk(roots, 0, true);
    this.syncFocusedIdFromVisible();
    this.refreshRegisteredItems();
  }

  private slottedRootItems(): IdsTreeItem[] {
    return Array.from(this.children).filter(
      (el): el is IdsTreeItem => el instanceof IdsTreeItem,
    );
  }

  private shadowRootItems(): IdsTreeItem[] {
    if (!this.shadowRoot) return [];
    return Array.from(this.shadowRoot.children).filter(
      (el): el is IdsTreeItem => el instanceof IdsTreeItem,
    );
  }

  /** Visible items in document / shadow order for keyboard. */
  private visibleItems(): IdsTreeItem[] {
    const out: IdsTreeItem[] = [];
    const roots = this.useItemsMode
      ? this.shadowRootItems()
      : this.slottedRootItems();

    const walk = (items: IdsTreeItem[]): void => {
      for (const item of items) {
        if (item.hidden) continue;
        out.push(item);
        if (item.isBranch && this.isExpanded(item.id)) {
          walk(item.childItems);
        }
      }
    };
    walk(roots);
    return out;
  }

  private applyDefaultsIfNeeded(): void {
    if (this.defaultsApplied) {
      this.syncFocusedIdFromVisible();
      return;
    }
    this.expandedIds = new Set(this.defaultExpandedIds ?? []);
    const firstId =
      this.defaultSelectedId ||
      this.items[0]?.id ||
      this.slottedRootItems()[0]?.id ||
      "";
    if (this.selectedId === undefined) {
      this.selectedIdUncontrolled = firstId;
    }
    this.focusedId = this.defaultSelectedId || firstId || null;
    this.defaultsApplied = true;
  }

  private syncFocusedIdFromVisible(): void {
    const visible = this.visibleItems();
    if (visible.length === 0) {
      this.focusedId = null;
      return;
    }
    if (!this.focusedId || !visible.some((i) => i.id === this.focusedId)) {
      const preferred =
        visible.find((i) => i.id === this.defaultSelectedId) || visible[0];
      this.focusedId = preferred?.id ?? null;
    }
  }

  private syncFocusedRow(): void {
    if (!this.focusedId) return;
    const item = this.visibleItems().find((i) => i.id === this.focusedId);
    item?.focusRow();
  }

  private refreshRegisteredItems(): void {
    for (const item of this.itemsRegistry) {
      item.requestUpdate();
    }
  }

  private onSlotChange = (): void => {
    this.applyDefaultsIfNeeded();
    this.syncComposition();
  };

  private onRootKeyDown = (event: KeyboardEvent): void => {
    const rows = this.visibleItems();
    if (rows.length === 0) return;

    const index = rows.findIndex((r) => r.id === this.focusedId);
    const currentIndex = index >= 0 ? index : 0;
    const row = rows[currentIndex];

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        if (currentIndex < rows.length - 1) {
          this.focusedId = rows[currentIndex + 1].id;
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (currentIndex > 0) {
          this.focusedId = rows[currentIndex - 1].id;
        }
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        if (row.isBranch && !this.isExpanded(row.id)) {
          this.toggleExpanded(row.id);
        } else if (currentIndex < rows.length - 1) {
          this.focusedId = rows[currentIndex + 1].id;
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (row.isBranch && this.isExpanded(row.id)) {
          this.toggleExpanded(row.id);
        } else if (row.parentId) {
          this.focusedId = row.parentId;
        }
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        this.activateItem(row);
        break;
      }
      default:
        break;
    }
  };

  private renderNode(node: IdsTreeNode): unknown {
    const nested = node.children?.length
      ? node.children.map((child) => this.renderNode(child))
      : nothing;
    return html`
      <ids-tree-item
        id=${node.id}
        label=${node.label}
        icon-shape=${node.iconShape ?? nothing}
        badge-count=${node.badgeCount ?? nothing}
        .showIcon=${node.showIcon}
        .showBadge=${node.showBadge}
      >
        <ids-tree-item-label>${node.label}</ids-tree-item-label>
        ${nested}
      </ids-tree-item>
    `;
  }

  override render() {
    // Mode A: synthesize the same nested composition inside shadow.
    if (this.useItemsMode) {
      return html`
        ${repeat(
          this.items,
          (node) => node.id,
          (node) => this.renderNode(node),
        )}
      `;
    }

    // Mode B: project composable light-DOM children.
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }
}

export type { IdsTreeNode, TreeItemClickDetail };
