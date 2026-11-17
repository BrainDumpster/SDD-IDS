/**
 * IdsToastViewport — Lit web component queue/stack host.
 *
 * Tag: `ids-toast-viewport`
 * Spec: `components/ids/toast/design-spec.md`
 * API: `lib/react/ids/toast` (`IdsToastViewport`)
 *
 * Queue: FIFO. `maxVisible` default 3.
 * Top positions: newest visible at bottom (column, append).
 * Bottom positions: newest visible at top (column-reverse).
 */
import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { registerElementSafely } from "../internal/registration.js";
import { IdsToastItem } from "./toast-item.element.js";
import {
  DEFAULT_MAX_VISIBLE,
  DEFAULT_POSITION,
  resolveToastMaxVisible,
  resolveToastPosition,
  type IdsToastCloseReason,
  type IdsToastPosition,
  type IdsToastQueueItem,
} from "./toast.constants.js";
import { toastViewportStyles } from "./toast.styles.js";

registerElementSafely("ids-toast-item", IdsToastItem);

export class IdsToastViewport extends LitElement {
  static override styles = [toastViewportStyles];

  @property({ type: String, reflect: true })
  position: IdsToastPosition | string = DEFAULT_POSITION;

  /** Recommended default `3`. */
  @property({ type: Number, attribute: "maxvisible" })
  maxVisible = DEFAULT_MAX_VISIBLE;

  /**
   * Controlled visible+queued list. When set, the viewport is controlled —
   * update from `ids-toast-items-change`. When omitted, use `defaultItems`.
   */
  @property({ attribute: false })
  items?: IdsToastQueueItem[];

  @property({ attribute: false })
  defaultItems: IdsToastQueueItem[] = [];

  /** React API parity — fired when the queue list changes. */
  @property({ attribute: false })
  onItemsChange?: (items: IdsToastQueueItem[]) => void;

  /** React API parity — fired when a queued item closes. */
  @property({ attribute: false })
  onItemClose?: (detail: { id: string; reason: IdsToastCloseReason }) => void;

  /** React API parity — fired when a queued item times out. */
  @property({ attribute: false })
  onItemTimeout?: (detail: { id: string }) => void;

  @state()
  private uncontrolledItems: IdsToastQueueItem[] = [];

  /** Once items[] / defaultItems are used, stay in queue mode (even if list empties). */
  private queueMode = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-toast-viewport");
    this.setAttribute("aria-live", "polite");
    this.setAttribute("aria-atomic", "false");
    if (this.uncontrolledItems.length === 0 && this.defaultItems.length > 0) {
      this.uncontrolledItems = [...this.defaultItems];
      this.queueMode = true;
    }
    if (this.items != null) this.queueMode = true;
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (this.items != null) this.queueMode = true;
    if (
      changed.has("defaultItems") &&
      this.items == null &&
      !this.queueMode &&
      (this.defaultItems?.length ?? 0) > 0
    ) {
      this.uncontrolledItems = [...(this.defaultItems ?? [])];
      this.queueMode = true;
    }
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    this.setAttribute("data-position", this.resolvedPosition);
  }

  get resolvedPosition(): IdsToastPosition {
    return resolveToastPosition(this.position);
  }

  get resolvedMaxVisible(): number {
    return resolveToastMaxVisible(this.maxVisible);
  }

  private get resolvedItems(): IdsToastQueueItem[] {
    return this.items != null ? this.items : this.uncontrolledItems;
  }

  private get visibleItems(): IdsToastQueueItem[] {
    return this.resolvedItems.slice(0, this.resolvedMaxVisible);
  }

  private setItems(next: IdsToastQueueItem[]): void {
    if (this.items == null) {
      this.uncontrolledItems = next;
    }
    this.onItemsChange?.(next);
    this.dispatchEvent(
      new CustomEvent("onItemsChange", {
        detail: { items: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleItemClose = (
    event: CustomEvent<{ id?: string; reason: IdsToastCloseReason }>,
  ): void => {
    const id = event.detail?.id;
    if (!id) return;
    event.stopPropagation();
    const next = this.resolvedItems.filter((item) => item.id !== id);
    this.setItems(next);
    const closeDetail = { id, reason: event.detail.reason };
    this.onItemClose?.(closeDetail);
    this.dispatchEvent(
      new CustomEvent("onItemClose", {
        detail: closeDetail,
        bubbles: true,
        composed: true,
      }),
    );
    if (event.detail.reason === "timeout") {
      const timeoutDetail = { id };
      this.onItemTimeout?.(timeoutDetail);
      this.dispatchEvent(
        new CustomEvent("onItemTimeout", {
          detail: timeoutDetail,
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  override render() {
    if (!this.queueMode) {
      return html`<slot></slot>`;
    }

    return html`
      ${repeat(
        this.visibleItems,
        (item) => item.id,
        (item) => html`
          <ids-toast-item
            id=${item.id}
            type=${item.type ?? "info"}
            message=${item.message}
            .duration=${item.duration ?? 8000}
            .closable=${item.closable ?? true}
            .link=${item.link}
            itemrole=${item.role ?? "status"}
            @onClose=${this.handleItemClose}
          ></ids-toast-item>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-toast-viewport": IdsToastViewport;
  }
}

export type { IdsToastItem };
