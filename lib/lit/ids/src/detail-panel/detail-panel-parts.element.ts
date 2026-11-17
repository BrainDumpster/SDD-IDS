/**
 * IDS Detail Panel composition parts — light-DOM children of `ids-detail-panel`.
 * API mirrors React `lib/react/ids/detail-panel` + Angular selectors.
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import "../icon/register.js";
import type { IdsDetailPanel } from "./detail-panel.element.js";
import {
  DETAIL_PANEL_API_DEFAULTS,
  DETAIL_PANEL_COLLAPSED_ICON,
  DETAIL_PANEL_DETACH_ICON,
  DETAIL_PANEL_EXPANDED_ICON,
} from "./detail-panel.constants.js";
import {
  detailPanelBodyStyles,
  detailPanelCollapsedRailStyles,
  detailPanelContentStyles,
  detailPanelFooterStyles,
  detailPanelHeaderStyles,
  detailPanelTitleStyles,
  detailPanelToggleStyles,
} from "./detail-panel.styles.js";

function findPanel(el: HTMLElement): IdsDetailPanel | null {
  return el.closest("ids-detail-panel") as IdsDetailPanel | null;
}

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

export class IdsDetailPanelContent extends LitElement {
  static override styles = [detailPanelContentStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-content");
    this.syncVisibility();
  }

  override updated(): void {
    this.syncVisibility();
  }

  private syncVisibility(): void {
    const panel = findPanel(this);
    this.hidden = !(panel?.resolvedExpanded ?? true);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export class IdsDetailPanelHeader extends LitElement {
  static override styles = [detailPanelHeaderStyles];

  private childObserver?: MutationObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-header");
    this.assignSlots();
    this.childObserver = new MutationObserver(() => this.assignSlots());
    this.childObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    this.childObserver?.disconnect();
    super.disconnectedCallback();
  }

  /**
   * Pop-out first, expand/collapse toggle last (Figma / React order).
   * Plain text / title children stay in the default slot inside the heading.
   */
  private assignSlots(): void {
    for (const child of Array.from(this.children)) {
      const name = child.localName;
      if (name === "ids-detail-panel-toggle-button") {
        child.setAttribute("slot", "toggle");
      } else if (name === "ids-detail-panel-detach-button") {
        child.setAttribute("slot", "detach");
      } else if (name === "ids-detail-panel-title") {
        child.setAttribute("slot", "title");
      }
    }
  }

  private onPointerDown = (event: PointerEvent): void => {
    const panel = findPanel(this);
    if (
      panel?.resolvedDetached &&
      !event.defaultPrevented &&
      event.button === 0 &&
      !(event.target as Element).closest("button, a, input, select, textarea")
    ) {
      panel.startDetachedDrag(event);
    }
  };

  override render() {
    return html`
      <header
        class="ids-detail-panel-header"
        data-ids="ids-detail-panel-header"
        @pointerdown=${this.onPointerDown}
      >
        <h3 class="ids-detail-panel-title">
          <slot name="title"></slot>
          <slot></slot>
        </h3>
        <div class="ids-detail-panel-controls">
          <slot name="detach"></slot>
          <slot name="toggle"></slot>
        </div>
      </header>
    `;
  }
}

/* -------------------------------------------------------------------------- */
/* Title                                                                      */
/* -------------------------------------------------------------------------- */

export class IdsDetailPanelTitle extends LitElement {
  static override styles = [detailPanelTitleStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-title");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/* -------------------------------------------------------------------------- */
/* Body                                                                       */
/* -------------------------------------------------------------------------- */

export class IdsDetailPanelBody extends LitElement {
  static override styles = [detailPanelBodyStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-body");
  }

  override render() {
    const panel = findPanel(this);
    const attachMode = panel?.resolvedAttachMode ?? "datagrid";
    const bodyId = panel?.bodyId;
    return html`
      <div
        id=${bodyId ?? nothing}
        class="ids-detail-panel-body ${attachMode === "page"
          ? "ids-detail-panel-body--page"
          : ""}"
        data-ids="ids-detail-panel-body"
      >
        <slot></slot>
      </div>
    `;
  }
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export class IdsDetailPanelFooter extends LitElement {
  static override styles = [detailPanelFooterStyles];

  private childObserver?: MutationObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-footer");
    this.assignSlots();
    this.childObserver = new MutationObserver(() => this.assignSlots());
    this.childObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    this.childObserver?.disconnect();
    super.disconnectedCallback();
  }

  private assignSlots(): void {
    for (const child of Array.from(this.children)) {
      if (child.localName === "ids-detail-panel-toggle-button") {
        child.setAttribute("slot", "toggle");
      }
    }
  }

  override render() {
    return html`
      <footer
        class="ids-detail-panel-footer"
        data-ids="ids-detail-panel-footer"
      >
        <slot></slot>
        <div class="ids-detail-panel-controls">
          <slot name="toggle"></slot>
        </div>
      </footer>
    `;
  }
}

/* -------------------------------------------------------------------------- */
/* Collapsed rail                                                             */
/* -------------------------------------------------------------------------- */

export class IdsDetailPanelCollapsedRail extends LitElement {
  static override styles = [detailPanelCollapsedRailStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-collapsed-rail");
    this.syncVisibility();
  }

  override updated(): void {
    this.syncVisibility();
  }

  private syncVisibility(): void {
    const panel = findPanel(this);
    this.hidden = panel?.resolvedExpanded ?? true;
  }

  override render() {
    const panel = findPanel(this);
    const attachMode = panel?.resolvedAttachMode ?? "datagrid";
    return html`
      <div
        class="ids-detail-panel-collapsed-rail ids-detail-panel-collapsed-rail--${attachMode}"
        data-ids="ids-detail-panel-collapsed-rail"
      >
        <div class="ids-detail-panel-controls">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

/* -------------------------------------------------------------------------- */
/* Toggle                                                                     */
/* -------------------------------------------------------------------------- */

export class IdsDetailPanelToggleButton extends LitElement {
  static override styles = [detailPanelToggleStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-toggle");
  }

  private onClick = (event: MouseEvent): void => {
    if (event.defaultPrevented) return;
    findPanel(this)?.toggle();
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    findPanel(this)?.onToggleKeydown(event);
  };

  override render() {
    const panel = findPanel(this);
    const isExpanded = panel?.resolvedExpanded ?? true;
    const icon = isExpanded
      ? DETAIL_PANEL_EXPANDED_ICON
      : DETAIL_PANEL_COLLAPSED_ICON;
    const ariaLabel =
      panel?.toggleAriaLabel ??
      (isExpanded
        ? DETAIL_PANEL_API_DEFAULTS.ariaLabelCollapse
        : DETAIL_PANEL_API_DEFAULTS.ariaLabelExpand);

    return html`
      <button
        type="button"
        class="ids-detail-panel-toggle"
        data-ids="ids-detail-panel-toggle"
        aria-label=${ariaLabel}
        aria-expanded=${isExpanded ? "true" : "false"}
        aria-controls=${isExpanded ? (panel?.bodyId ?? nothing) : nothing}
        @click=${this.onClick}
        @keydown=${this.onKeyDown}
      >
        <ids-icon
          shape=${icon}
          variant="mask"
          size="16"
          color="currentColor"
        ></ids-icon>
      </button>
    `;
  }
}

/* -------------------------------------------------------------------------- */
/* Detach (pop-out)                                                           */
/* -------------------------------------------------------------------------- */

export class IdsDetailPanelDetachButton extends LitElement {
  static override styles = [detailPanelToggleStyles];

  @property({ type: String, attribute: "arialabeldetach" })
  ariaLabelDetach = DETAIL_PANEL_API_DEFAULTS.ariaLabelDetach;

  @property({ type: String, attribute: "arialabelattach" })
  ariaLabelAttach = DETAIL_PANEL_API_DEFAULTS.ariaLabelAttach;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-detach");
  }

  private onClick = (event: MouseEvent): void => {
    if (event.defaultPrevented) return;
    findPanel(this)?.toggleDetached();
  };

  override render() {
    const panel = findPanel(this);
    if (panel && panel.resolvedAttachMode !== "datagrid") {
      return nothing;
    }
    const isDetached = panel?.resolvedDetached ?? false;
    return html`
      <button
        type="button"
        class="ids-detail-panel-toggle"
        data-ids="ids-detail-panel-detach"
        aria-label=${isDetached ? this.ariaLabelAttach : this.ariaLabelDetach}
        @click=${this.onClick}
      >
        <ids-icon
          shape=${DETAIL_PANEL_DETACH_ICON}
          variant="mask"
          size="16"
          color="currentColor"
        ></ids-icon>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-detail-panel-content": IdsDetailPanelContent;
    "ids-detail-panel-header": IdsDetailPanelHeader;
    "ids-detail-panel-title": IdsDetailPanelTitle;
    "ids-detail-panel-body": IdsDetailPanelBody;
    "ids-detail-panel-footer": IdsDetailPanelFooter;
    "ids-detail-panel-collapsed-rail": IdsDetailPanelCollapsedRail;
    "ids-detail-panel-toggle-button": IdsDetailPanelToggleButton;
    "ids-detail-panel-detach-button": IdsDetailPanelDetachButton;
  }
}
