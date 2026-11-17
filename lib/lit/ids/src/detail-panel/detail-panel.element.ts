/**
 * IdsDetailPanel — Lit web component root.
 *
 * Tag: `ids-detail-panel`
 * Spec: `components/ids/detail-panel/design-spec.md`
 * API: `lib/react/ids/detail-panel` + Angular composition children
 *
 * Composition:
 *   ids-detail-panel
 *     ids-detail-panel-content
 *       datagrid: header + body
 *       page: body + footer
 *     ids-detail-panel-collapsed-rail
 *       ids-detail-panel-toggle-button
 *
 * Events:
 *   expanded-change / onExpandedChange  detail: boolean
 *   detached-change / onDetachedChange  detail: boolean
 *   opened / closed
 */
import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import {
  DATAGRID_MAX_WIDTH,
  DATAGRID_MIN_WIDTH,
  DETAIL_PANEL_API_DEFAULTS,
  FLOATING_DRAG_HANDLE,
  FLOATING_MAX_HEIGHT,
  FLOATING_MIN_HEIGHT,
  FLOATING_VIEWPORT_MARGIN,
  PAGE_MAX_WIDTH,
  clamp,
  resolveAttachMode,
  resolveWidth,
  type FloatingRect,
  type IdsDetailPanelAttachMode,
} from "./detail-panel.constants.js";
import { detailPanelRootStyles } from "./detail-panel.styles.js";

let detailPanelUid = 0;

export class IdsDetailPanel extends LitElement {
  static override styles = [detailPanelRootStyles];

  @property({ type: String, attribute: "attachmode", reflect: true })
  attachMode: IdsDetailPanelAttachMode | string =
    DETAIL_PANEL_API_DEFAULTS.attachMode;

  /**
   * Controlled expand state. When omitted (`undefined`), uses local /
   * `defaultExpanded`. Bound as a property (`.isExpanded=`), not a boolean attribute,
   * so absence does not coerce to `false`.
   */
  @property({ attribute: false })
  isExpanded: boolean | undefined = undefined;

  @property({ attribute: false })
  defaultExpanded = DETAIL_PANEL_API_DEFAULTS.defaultExpanded;

  @property({ type: String, attribute: "arialabelexpand" })
  ariaLabelExpand = DETAIL_PANEL_API_DEFAULTS.ariaLabelExpand;

  @property({ type: String, attribute: "arialabelcollapse" })
  ariaLabelCollapse = DETAIL_PANEL_API_DEFAULTS.ariaLabelCollapse;

  @property({ type: Number, attribute: "collapsedwidth" })
  collapsedWidth = DETAIL_PANEL_API_DEFAULTS.collapsedWidth;

  @property({ type: Number, attribute: "expandedwidth" })
  expandedWidth: number | undefined = undefined;

  /**
   * Controlled floating state (datagrid only). Property binding only — see
   * `isExpanded` note (boolean attributes coerce missing → false).
   */
  @property({ attribute: false })
  isDetached: boolean | undefined = undefined;

  @property({ attribute: false })
  defaultDetached = DETAIL_PANEL_API_DEFAULTS.defaultDetached;

  /** React API parity. */
  @property({ attribute: false })
  onExpandedChange?: (next: boolean) => void;

  /** React API parity. */
  @property({ attribute: false })
  onDetachedChange?: (next: boolean) => void;

  @state()
  private uncontrolledExpanded: boolean =
    DETAIL_PANEL_API_DEFAULTS.defaultExpanded;

  @state()
  private uncontrolledDetached: boolean =
    DETAIL_PANEL_API_DEFAULTS.defaultDetached;

  @state()
  private floatingRect: FloatingRect | null = null;

  private readonly instanceId = `ids-detail-panel-${++detailPanelUid}`;
  private refocusDetach = false;
  private defaultExpandedApplied = false;
  private defaultDetachedApplied = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel");
    this.setAttribute("role", "complementary");
    if (!this.id) this.id = this.instanceId;
    if (!this.defaultExpandedApplied) {
      this.uncontrolledExpanded = this.defaultExpanded;
      this.defaultExpandedApplied = true;
    }
    if (!this.defaultDetachedApplied) {
      this.uncontrolledDetached = this.defaultDetached;
      this.defaultDetachedApplied = true;
    }
  }

  get resolvedAttachMode(): IdsDetailPanelAttachMode {
    return resolveAttachMode(this.attachMode);
  }

  get resolvedExpanded(): boolean {
    return this.isExpanded != null
      ? Boolean(this.isExpanded)
      : this.uncontrolledExpanded;
  }

  get detachedState(): boolean {
    return this.isDetached != null
      ? Boolean(this.isDetached)
      : this.uncontrolledDetached;
  }

  /** Only an expanded data grid panel floats; collapsed rail always stays docked. */
  get resolvedDetached(): boolean {
    return (
      this.resolvedAttachMode === "datagrid" &&
      this.resolvedExpanded &&
      this.detachedState
    );
  }

  get bodyId(): string {
    return `${this.id || this.instanceId}-body`;
  }

  get toggleIcon(): string {
    return this.resolvedExpanded
      ? "double-chev-right"
      : "double-chev-left";
  }

  get toggleAriaLabel(): string {
    return this.resolvedExpanded
      ? this.ariaLabelCollapse
      : this.ariaLabelExpand;
  }

  toggle(): void {
    const next = !this.resolvedExpanded;
    if (this.isExpanded == null) this.uncontrolledExpanded = next;
    this.onExpandedChange?.(next);
    this.dispatchEvent(
      new CustomEvent("expanded-change", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("onExpandedChange", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent(next ? "opened" : "closed", {
        bubbles: true,
        composed: true,
      }),
    );
    this.notifyChildren();
    this.requestUpdate();
  }

  toggleDetached(): void {
    const next = !this.detachedState;
    if (next) {
      const rect = this.getBoundingClientRect();
      const width = clamp(rect.width, DATAGRID_MIN_WIDTH, DATAGRID_MAX_WIDTH);
      const top = Math.max(FLOATING_VIEWPORT_MARGIN, rect.top);
      const maxHeight = Math.min(
        FLOATING_MAX_HEIGHT,
        window.innerHeight - top - FLOATING_VIEWPORT_MARGIN,
      );
      this.floatingRect = {
        top,
        left: clamp(
          rect.left,
          FLOATING_VIEWPORT_MARGIN,
          window.innerWidth - width - FLOATING_VIEWPORT_MARGIN,
        ),
        width,
        height: clamp(
          rect.height,
          FLOATING_MIN_HEIGHT,
          Math.max(FLOATING_MIN_HEIGHT, maxHeight),
        ),
      };
    }
    this.refocusDetach = true;
    if (this.isDetached == null) this.uncontrolledDetached = next;
    this.onDetachedChange?.(next);
    this.dispatchEvent(
      new CustomEvent("detached-change", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("onDetachedChange", {
        detail: next,
        bubbles: true,
        composed: true,
      }),
    );
    this.notifyChildren();
    this.requestUpdate();
  }

  startDetachedDrag(event: PointerEvent): void {
    if (!this.resolvedDetached) return;
    const start = this.getBoundingClientRect();
    const originX = event.clientX;
    const originY = event.clientY;
    const handle = event.currentTarget as HTMLElement | null;
    handle?.setPointerCapture?.(event.pointerId);
    event.preventDefault();

    const onMove = (moveEvent: PointerEvent) => {
      this.floatingRect = {
        top: clamp(
          start.top + moveEvent.clientY - originY,
          0,
          Math.max(0, window.innerHeight - FLOATING_DRAG_HANDLE),
        ),
        left: clamp(
          start.left + moveEvent.clientX - originX,
          0,
          Math.max(0, window.innerWidth - start.width),
        ),
        width: start.width,
        height: start.height,
      };
      this.applySizeStyles();
    };
    const onEnd = () => {
      handle?.removeEventListener("pointermove", onMove);
      handle?.removeEventListener("pointerup", onEnd);
      handle?.removeEventListener("pointercancel", onEnd);
    };
    handle?.addEventListener("pointermove", onMove);
    handle?.addEventListener("pointerup", onEnd);
    handle?.addEventListener("pointercancel", onEnd);
  }

  onToggleKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggle();
    }
  }

  /** Notify composition children to re-sync visibility / aria. */
  notifyChildren(): void {
    this.dispatchEvent(
      new CustomEvent("ids-detail-panel-change", {
        bubbles: true,
        composed: true,
      }),
    );
    this.querySelectorAll(
      "ids-detail-panel-content, ids-detail-panel-collapsed-rail, ids-detail-panel-body, ids-detail-panel-toggle-button, ids-detail-panel-detach-button, ids-detail-panel-header, ids-detail-panel-footer",
    ).forEach((el) => {
      (el as LitElement).requestUpdate?.();
    });
  }

  private applySizeStyles(): void {
    const collapsed = resolveWidth(
      this.collapsedWidth,
      DETAIL_PANEL_API_DEFAULTS.collapsedWidth,
    );
    const attachMode = this.resolvedAttachMode;
    const isExpanded = this.resolvedExpanded;
    const isDetached = this.resolvedDetached;
    const autoWidth =
      attachMode === "datagrid" && isExpanded && this.expandedWidth == null;

    this.toggleAttribute("data-auto-width", autoWidth && !isDetached);
    this.setAttribute("data-attach-mode", attachMode);
    this.setAttribute("data-expanded", isExpanded ? "true" : "false");
    if (isDetached) this.setAttribute("data-detached", "true");
    else this.removeAttribute("data-detached");

    this.style.top = "";
    this.style.left = "";
    this.style.height = "";

    if (!isExpanded) {
      this.style.width = `${collapsed}px`;
      return;
    }

    if (isDetached && this.floatingRect) {
      this.style.top = `${this.floatingRect.top}px`;
      this.style.left = `${this.floatingRect.left}px`;
      this.style.width = `${this.floatingRect.width}px`;
      this.style.height = `${this.floatingRect.height}px`;
      return;
    }

    if (attachMode === "datagrid") {
      if (autoWidth) {
        this.style.width = "";
      } else {
        this.style.width = `${clamp(
          resolveWidth(this.expandedWidth, DATAGRID_MIN_WIDTH),
          DATAGRID_MIN_WIDTH,
          DATAGRID_MAX_WIDTH,
        )}px`;
      }
      return;
    }

    this.style.width = `${Math.min(
      resolveWidth(this.expandedWidth, PAGE_MAX_WIDTH),
      PAGE_MAX_WIDTH,
    )}px`;
  }

  override willUpdate(): void {
    // Seed floating rect when detached without a prior docked measurement.
    if (this.resolvedDetached && !this.floatingRect) {
      const width = clamp(
        this.offsetWidth || DATAGRID_MAX_WIDTH,
        DATAGRID_MIN_WIDTH,
        DATAGRID_MAX_WIDTH,
      );
      this.floatingRect = {
        top: FLOATING_VIEWPORT_MARGIN,
        left: Math.max(
          FLOATING_VIEWPORT_MARGIN,
          window.innerWidth - width - FLOATING_VIEWPORT_MARGIN,
        ),
        width,
        height: clamp(
          window.innerHeight - 2 * FLOATING_VIEWPORT_MARGIN,
          FLOATING_MIN_HEIGHT,
          FLOATING_MAX_HEIGHT,
        ),
      };
    }
    this.applySizeStyles();
  }

  override updated(): void {
    this.setAttribute(
      "aria-label",
      `${this.resolvedAttachMode} details panel`,
    );
    if (this.refocusDetach) {
      this.refocusDetach = false;
      this.querySelector<HTMLElement>(
        '[data-ids="ids-detail-panel-detach"]',
      )?.focus();
    }
    this.notifyChildren();
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-detail-panel": IdsDetailPanel;
  }
}
