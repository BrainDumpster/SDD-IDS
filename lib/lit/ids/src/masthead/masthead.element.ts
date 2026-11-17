/**
 * IdsMasthead — Lit web component.
 *
 * Tag: `ids-masthead`
 * Spec: `components/ids/masthead/design-spec.md`
 * API: `lib/react/ids/masthead` (`IdsMasthead` prop / slot contract)
 *
 * Anatomy (deterministic child order — root is Masthead, not MastheadRoot):
 *   IdsMasthead
 *     IdsMastheadBrandSlot
 *       IdsMastheadLogo?
 *       IdsMastheadProductName
 *     IdsMastheadActionsRow?
 *       IdsMastheadIconsSlot?
 *       IdsMastheadAppLauncherSlot?
 *       IdsMastheadAvatarSlot?
 *
 * Slots (host composition — omit unused):
 *   logo          — optional 32×32 product mark
 *   icons         — optional utilities (search / action icons / …)
 *   app-launcher  — optional App Launcher
 *   avatar        — optional avatar / account control
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, MCP session):
 *   Masthead-Main `10130:29493`
 *   Product Icon=No `10130:29494` · Yes `10130:29512`
 *   User Initials set `10130:29944`
 */
import { LitElement, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import "../tooltip/register.js";
import {
  MASTHEAD_ACTIONS_ARIA_LABEL,
  productNameNeedsTooltip,
  resolveProductName,
} from "./masthead.constants.js";
import { mastheadStyles } from "./masthead.styles.js";

const SLOT_NAMES = ["logo", "icons", "app-launcher", "avatar"] as const;
type MastheadSlotName = (typeof SLOT_NAMES)[number];

function slotHasContent(slot: HTMLSlotElement | null | undefined): boolean {
  if (!slot) return false;
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? "").trim().length > 0;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.hasAttribute("hidden")) return false;
      return true;
    }
    return false;
  });
}

/** Collect focusable buttons, piercing open shadow roots of slotted hosts. */
function collectFocusableButtons(roots: ParentNode[]): HTMLElement[] {
  const out: HTMLElement[] = [];
  const visit = (node: ParentNode) => {
    node.querySelectorAll("button:not([disabled])").forEach((el) => {
      out.push(el as HTMLElement);
    });
    node.querySelectorAll("*").forEach((el) => {
      if (el.shadowRoot) visit(el.shadowRoot);
    });
  };
  for (const root of roots) visit(root);
  return out;
}

export class IdsMasthead extends LitElement {
  static override styles = [mastheadStyles];

  /**
   * Required brand label (React `productName`).
   * Attribute: `productname`.
   */
  @property({ type: String, attribute: "productname", reflect: true })
  productName = "";

  /** Toolbar accessible name override. */
  @property({ type: String, attribute: "actionsarialabel" })
  actionsAriaLabel = MASTHEAD_ACTIONS_ARIA_LABEL;

  @state() private hasLogo = false;
  @state() private hasIcons = false;
  @state() private hasAppLauncher = false;
  @state() private hasAvatar = false;

  @query('slot[name="logo"]') private logoSlot?: HTMLSlotElement;
  @query('slot[name="icons"]') private iconsSlot?: HTMLSlotElement;
  @query('slot[name="app-launcher"]') private appLauncherSlot?: HTMLSlotElement;
  @query('slot[name="avatar"]') private avatarSlotEl?: HTMLSlotElement;

  private readonly actionsRef = createRef<HTMLDivElement>();

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMasthead");
  }

  override firstUpdated(): void {
    this.syncSlotFlags();
  }

  private onSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const name = (slot.name || "") as MastheadSlotName;
    if (!SLOT_NAMES.includes(name)) return;
    this.syncSlotFlags();
  };

  private syncSlotFlags(): void {
    this.hasLogo = slotHasContent(this.logoSlot);
    this.hasIcons = slotHasContent(this.iconsSlot);
    this.hasAppLauncher = slotHasContent(this.appLauncherSlot);
    this.hasAvatar = slotHasContent(this.avatarSlotEl);
  }

  private get resolvedProductName(): string {
    return resolveProductName(this.productName);
  }

  private get showActions(): boolean {
    return this.hasIcons || this.hasAppLauncher || this.hasAvatar;
  }

  private getActionFocusables(): HTMLElement[] {
    const roots: ParentNode[] = [];
    for (const slot of [this.iconsSlot, this.appLauncherSlot, this.avatarSlotEl]) {
      if (!slot) continue;
      for (const el of slot.assignedElements({ flatten: true })) {
        roots.push(el);
      }
    }
    return collectFocusableButtons(roots);
  }

  private handleActionKeyDown = (event: KeyboardEvent): void => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }
    const container = this.actionsRef.value;
    if (!container) return;
    const active = document.activeElement as HTMLElement | null;
    if (!active) return;

    const focusables = this.getActionFocusables();
    if (focusables.length === 0) return;

    const index = focusables.findIndex(
      (el) => el === active || el.contains(active) || el.shadowRoot?.contains(active),
    );
    if (index < 0) return;

    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % focusables.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + focusables.length) % focusables.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = focusables.length - 1;
    focusables[nextIndex]?.focus();
  };

  private renderProductName() {
    const name = this.resolvedProductName;
    const label = html`
      <div
        class="IdsMastheadProductName"
        data-ids="IdsMastheadProductName"
        aria-label=${name || nothing}
      >
        ${name}
      </div>
    `;

    if (!productNameNeedsTooltip(name)) return label;

    return html`
      <ids-tooltip hugcontent side="bottom">
        <ids-tooltip-trigger display="block" tabindex="0">
          ${label}
        </ids-tooltip-trigger>
        <ids-tooltip-panel>
          <ids-tooltip-body>${name}</ids-tooltip-body>
        </ids-tooltip-panel>
      </ids-tooltip>
    `;
  }

  override render() {
    // Keep named slots mounted so late projection still fires slotchange.
    // Spec: hide ActionsRow when icons / launcher / avatar are all empty.
    return html`
      <header class="IdsMasthead" data-ids="IdsMasthead">
        <div class="IdsMastheadBrandSlot" data-ids="IdsMastheadBrandSlot">
          <div
            class="IdsMastheadLogo"
            data-ids="IdsMastheadLogo"
            ?hidden=${!this.hasLogo}
          >
            <slot name="logo" @slotchange=${this.onSlotChange}></slot>
          </div>
          ${this.renderProductName()}
        </div>
        <div
          ${ref(this.actionsRef)}
          class="IdsMastheadActionsRow"
          data-ids="IdsMastheadActionsRow"
          role=${this.showActions ? "toolbar" : nothing}
          aria-label=${this.showActions
            ? this.actionsAriaLabel || MASTHEAD_ACTIONS_ARIA_LABEL
            : nothing}
          ?hidden=${!this.showActions}
          @keydown=${this.handleActionKeyDown}
        >
          <div
            class="IdsMastheadIconsSlot"
            data-ids="IdsMastheadIconsSlot"
            ?hidden=${!this.hasIcons}
          >
            <slot name="icons" @slotchange=${this.onSlotChange}></slot>
          </div>
          <div
            class="IdsMastheadAppLauncherSlot"
            data-ids="IdsMastheadAppLauncherSlot"
            ?hidden=${!this.hasAppLauncher}
          >
            <slot name="app-launcher" @slotchange=${this.onSlotChange}></slot>
          </div>
          <div
            class="IdsMastheadAvatarSlot"
            data-ids="IdsMastheadAvatarSlot"
            ?hidden=${!this.hasAvatar}
          >
            <slot name="avatar" @slotchange=${this.onSlotChange}></slot>
          </div>
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-masthead": IdsMasthead;
  }
}
