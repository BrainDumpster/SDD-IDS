/**
 * IdsTooltip — Lit web component root.
 *
 * Tag: `ids-tooltip`
 * Spec: `components/ids/tooltip/design-spec.md`
 * API: React `lib/react/ids/tooltip` (side, hugContent, delay, closable…)
 *
 * Composition (light DOM):
 *   ids-tooltip
 *     ids-tooltip-trigger
 *     ids-tooltip-panel
 *       ids-tooltip-header? / ids-tooltip-body / ids-tooltip-close?
 */
import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import {
  computePopupPosition,
  measureTriggerBox,
  resolveAlign,
  resolveSide,
  type IdsTooltipArrowAlign,
  type IdsTooltipCloseReason,
  type IdsTooltipSide,
} from "./tooltip.constants.js";
import { tooltipHostStyles } from "./tooltip.styles.js";
import type { IdsTooltipPanel } from "./tooltip-panel.element.js";
import type { IdsTooltipTrigger } from "./tooltip-trigger.element.js";

let tooltipUid = 0;

export class IdsTooltip extends LitElement {
  static override styles = [tooltipHostStyles];

  @property({ type: String, reflect: true })
  side: IdsTooltipSide | string = "top";

  @property({ type: String, attribute: "arrowalign", reflect: true })
  arrowAlign: IdsTooltipArrowAlign | string = "center";

  @property({ type: Boolean, reflect: true })
  closable = false;

  @property({ type: Boolean, attribute: "hugcontent", reflect: true })
  hugContent = true;

  @property({ type: Number, attribute: "maxwidth" })
  maxWidth = 244;

  @property({ type: Number, attribute: "maxheight" })
  maxHeight = 300;

  /** Hover open delay (ms). Default 300 — matches React. */
  @property({ type: Number })
  delay = 300;

  @property({ type: Boolean, attribute: "defaultopen" })
  defaultOpen = false;

  /** Controlled open when set; omit for uncontrolled hover/focus. */
  @property({ type: Boolean })
  open: boolean | undefined = undefined;

  @property({ type: String, attribute: "trigger-display", reflect: true })
  triggerDisplay: "inline" | "block" = "inline";

  @state()
  private uncontrolledOpen = false;

  private readonly tooltipId = `ids-tooltip-${++tooltipUid}`;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private manuallyDismissed = false;
  /** Cached — panel is portaled to `document.body` while open. */
  private cachedTrigger: IdsTooltipTrigger | null = null;
  private cachedPanel: IdsTooltipPanel | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tooltip-host");
    if (this.defaultOpen && this.open === undefined) {
      this.uncontrolledOpen = true;
    }
  }

  override disconnectedCallback(): void {
    this.clearTimers();
    this.teardownObservers();
    window.removeEventListener("scroll", this.onReposition, true);
    window.removeEventListener("resize", this.onReposition);
    window.removeEventListener("keydown", this.onKeyDown);
    // Re-parent portaled panel under this host so it is GC'd with the tree.
    const panel = this.cachedPanel;
    if (panel && panel.parentElement === document.body) {
      panel.removeAttribute("data-open");
      panel.style.visibility = "hidden";
      this.appendChild(panel);
    }
    super.disconnectedCallback();
  }

  get isOpen(): boolean {
    return this.open !== undefined ? Boolean(this.open) : this.uncontrolledOpen;
  }

  get resolvedSide(): IdsTooltipSide {
    return resolveSide(this.side);
  }

  get resolvedAlign(): IdsTooltipArrowAlign {
    return resolveAlign(this.arrowAlign);
  }

  get describedById(): string | undefined {
    return this.isOpen ? this.tooltipId : undefined;
  }

  /** Called by trigger / panel children. */
  requestOpenFromHover(): void {
    this.clearCloseTimer();
    this.clearOpenTimer();
    if (this.delay <= 0) {
      this.setOpenValue(true);
      return;
    }
    this.openTimer = setTimeout(() => {
      this.openTimer = null;
      this.setOpenValue(true);
    }, this.delay);
  }

  requestOpenImmediate(): void {
    this.clearCloseTimer();
    this.clearOpenTimer();
    this.setOpenValue(true);
  }

  requestClose(): void {
    this.clearOpenTimer();
    if (this.closable) return;
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      this.setOpenValue(false);
    }, 100);
  }

  dismiss(reason: IdsTooltipCloseReason): void {
    this.clearTimers();
    this.manuallyDismissed = true;
    this.setOpenValue(false);
    this.dispatchEvent(
      new CustomEvent("ids-tooltip-close", {
        detail: { reason },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setOpenValue(next: boolean): void {
    if (this.open !== undefined) {
      this.dispatchEvent(
        new CustomEvent("ids-tooltip-open-change", {
          detail: { open: next },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }
    if (this.closable && !next && !this.manuallyDismissed) return;
    if (next) this.manuallyDismissed = false;
    if (this.uncontrolledOpen === next) {
      if (next) this.schedulePosition();
      return;
    }
    this.uncontrolledOpen = next;
    this.dispatchEvent(
      new CustomEvent("ids-tooltip-open-change", {
        detail: { open: next },
        bubbles: true,
        composed: true,
      }),
    );
    if (next) this.schedulePosition();
    else this.teardownObservers();
    this.syncPanelOpen();
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (
      changed.has("open") ||
      changed.has("uncontrolledOpen") ||
      changed.has("side") ||
      changed.has("arrowAlign") ||
      changed.has("hugContent") ||
      changed.has("closable")
    ) {
      this.syncPanelOpen();
      if (this.isOpen) this.schedulePosition();
    }
  }

  private syncPanelOpen(): void {
    const panel = this.panelEl();
    const trigger = this.triggerEl();
    if (trigger) {
      if (this.describedById) {
        trigger.setAttribute("aria-describedby", this.describedById);
      } else {
        trigger.removeAttribute("aria-describedby");
      }
    }
    if (!panel) return;
    panel.toggleAttribute("data-open", this.isOpen);
    panel.toggleAttribute("data-hug", this.hugContent);
    panel.toggleAttribute("data-closable", this.closable);
    panel.toggleAttribute("data-standard", !this.closable && !this.hugContent);
    panel.id = this.tooltipId;
    panel.style.setProperty("--tooltip-max-width", `${this.maxWidth}px`);
    panel.style.setProperty("--tooltip-max-height", `${this.maxHeight}px`);
    panel.dataset.side = this.resolvedSide;
    panel.dataset.arrowAlign = this.resolvedAlign;
    if (this.isOpen) {
      this.ensurePanelPortaled(panel);
      panel.style.visibility = "hidden";
    } else {
      panel.style.visibility = "hidden";
    }
  }

  private triggerEl(): IdsTooltipTrigger | null {
    if (this.cachedTrigger?.isConnected) return this.cachedTrigger;
    this.cachedTrigger = this.querySelector("ids-tooltip-trigger");
    return this.cachedTrigger;
  }

  private panelEl(): IdsTooltipPanel | null {
    if (this.cachedPanel?.isConnected) return this.cachedPanel;
    this.cachedPanel = this.querySelector("ids-tooltip-panel");
    return this.cachedPanel;
  }

  private ensurePanelPortaled(panel: IdsTooltipPanel): void {
    if (panel.parentElement !== document.body) {
      document.body.appendChild(panel);
    }
  }

  private schedulePosition = (): void => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.updatePosition());
    });
  };

  private onReposition = (): void => {
    if (this.isOpen) this.updatePosition();
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.closable && this.isOpen) {
      this.dismiss("escape");
    }
  };

  private updatePosition(): void {
    const trigger = this.triggerEl();
    const panel = this.panelEl();
    if (!trigger || !panel || !this.isOpen) return;

    this.ensurePanelPortaled(panel);
    const popupRect = panel.getBoundingClientRect();
    if (popupRect.width === 0 || popupRect.height === 0) {
      this.schedulePosition();
      return;
    }

    const next = computePopupPosition(
      measureTriggerBox(trigger),
      popupRect,
      this.resolvedSide,
      this.resolvedAlign,
    );
    panel.style.top = `${next.top}px`;
    panel.style.left = `${next.left}px`;
    panel.style.setProperty(
      "--ids-tooltip-arrow-offset",
      `${next.arrowOffset}px`,
    );
    panel.style.visibility = "visible";
    panel.setArrow(this.resolvedSide, this.resolvedAlign, next.arrowOffset);

    this.teardownObservers();
    this.resizeObserver = new ResizeObserver(() => this.updatePosition());
    this.resizeObserver.observe(trigger);
    this.resizeObserver.observe(panel);
    window.addEventListener("scroll", this.onReposition, true);
    window.addEventListener("resize", this.onReposition);
    if (this.closable) {
      window.addEventListener("keydown", this.onKeyDown);
    }
  }

  private teardownObservers(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.removeEventListener("scroll", this.onReposition, true);
    window.removeEventListener("resize", this.onReposition);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  private clearOpenTimer(): void {
    if (this.openTimer != null) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
  }

  private clearCloseTimer(): void {
    if (this.closeTimer != null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private clearTimers(): void {
    this.clearOpenTimer();
    this.clearCloseTimer();
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-tooltip": IdsTooltip;
  }
}
