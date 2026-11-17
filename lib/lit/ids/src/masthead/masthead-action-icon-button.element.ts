/**
 * IdsMastheadActionIconButton — presentational masthead utility button.
 *
 * Tag: `ids-masthead-action-icon-button`
 * Spec: `components/ids/masthead/design-spec.md` → MastheadActionIconButton
 * API: React `IdsMastheadActionIconButton` (icon / badgeCount / badgeType / aria-label)
 *
 * Icon: default slot (host projects `ids-icon` or markup) OR `iconslug` property.
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../badge/register.js";
import "../icon/register.js";
import {
  formatBadgeLabel,
  MASTHEAD_ACTION_BADGE_DEFAULT,
  resolveMastheadBadgeType,
  shouldShowBadge,
  type IdsMastheadBadgeType,
} from "./masthead.constants.js";
import { actionIconButtonStyles } from "./masthead.styles.js";

export class IdsMastheadActionIconButton extends LitElement {
  static override styles = [actionIconButtonStyles];

  /** Required accessible name (React `aria-label`). */
  @property({ type: String, attribute: "arialabel", reflect: true })
  ariaLabel = "";

  /** Optional badge count; hidden when ≤ 0 / unset. */
  @property({ type: Number, attribute: "badgecount" })
  badgeCount?: number;

  /** Badge type — defaults to `critical` (Alerts). */
  @property({ type: String, attribute: "badgetype" })
  badgeType: IdsMastheadBadgeType | string = MASTHEAD_ACTION_BADGE_DEFAULT;

  /** Convenience slug → `ids-icon` when default slot is empty. */
  @property({ type: String, attribute: "iconslug" })
  iconSlug = "";

  /**
   * Open panel/dropdown (React `aria-expanded`).
   * Named `expanded` — HTMLElement already owns `ariaExpanded` as string|null.
   */
  @property({ type: Boolean, attribute: "ariaexpanded", reflect: true })
  expanded = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  private hasIconSlot = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMastheadActionIconButton");
  }

  private onIconSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.hasIconSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private get showBadge(): boolean {
    return shouldShowBadge(this.badgeCount);
  }

  private get badgeLabel(): string {
    if (!this.showBadge || this.badgeCount == null) return "";
    return formatBadgeLabel(this.badgeCount);
  }

  private get resolvedAriaLabel(): string {
    return this.ariaLabel || this.getAttribute("aria-label") || "";
  }

  private renderIcon() {
    if (this.hasIconSlot) {
      return html`<slot @slotchange=${this.onIconSlotChange}></slot>`;
    }
    if (this.iconSlug) {
      return html`
        <slot @slotchange=${this.onIconSlotChange}></slot>
        <ids-icon
          shape=${this.iconSlug}
          variant="mask"
          size="16"
          color="currentColor"
        ></ids-icon>
      `;
    }
    return html`<slot @slotchange=${this.onIconSlotChange}></slot>`;
  }

  override render() {
    return html`
      <button
        type="button"
        class="IdsMastheadActionIconButton"
        data-ids="IdsMastheadActionIconButton"
        aria-label=${this.resolvedAriaLabel}
        aria-expanded=${this.expanded ? "true" : nothing}
        ?disabled=${this.disabled}
      >
        <span class="IdsMastheadActionIconGlyph" aria-hidden="true">
          ${this.renderIcon()}
        </span>
        ${this.showBadge
          ? html`
              <span class="IdsMastheadBadgeWrapper" aria-hidden="true">
                <ids-badge
                  .value=${this.badgeLabel}
                  type=${resolveMastheadBadgeType(this.badgeType)}
                ></ids-badge>
              </span>
            `
          : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-masthead-action-icon-button": IdsMastheadActionIconButton;
  }
}
