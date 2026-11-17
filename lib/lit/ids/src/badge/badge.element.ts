/**
 * IdsBadge — Lit web component.
 *
 * Tag: `ids-badge`
 * Visuals / a11y: `components/ids/badge/design-spec.md`
 * API: `lib/react/ids/badge` (`value`, `type`, `as`, `ariaLabel`)
 *
 * Anatomy:
 *   BadgeRoot (host)
 *     BadgeContainer
 *       BadgeContent
 *
 * Values > 999 display as `1K` and wrap `ids-tooltip` (hugContent) so hover
 * reveals the full value — React `IdsTooltip` parity.
 */
import { LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { html, unsafeStatic } from "lit/static-html.js";
import "../tooltip/register.js";
import {
  digitSize,
  resolveAs,
  resolveDisplayText,
  resolveType,
  type IdsBadgeType,
} from "./badge.constants.js";
import { badgeStyles } from "./badge.styles.js";

export class IdsBadge extends LitElement {
  static override styles = [badgeStyles];

  /**
   * Required visual content. Empty string → render nothing.
   * Attribute / property; numbers stringify from attributes.
   */
  @property({ reflect: true })
  value: string | number = "";

  /** Variant axis `Type`. Unknown → `default`. */
  @property({ type: String, reflect: true })
  type: IdsBadgeType | string = "default";

  /** Optional semantic element for BadgeContainer. Default `span`. */
  @property({ type: String, reflect: true })
  as = "span";

  /** Explicit accessible name when `value` alone is ambiguous. */
  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-badge-host");
  }

  private isEmpty(): boolean {
    return this.value === "" || this.value == null;
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (this.isEmpty()) {
      this.setAttribute("data-empty", "");
      this.setAttribute("hidden", "");
    } else {
      this.removeAttribute("data-empty");
      this.removeAttribute("hidden");
    }
  }

  private renderBadge(
    type: ReturnType<typeof resolveType>,
    displayText: string,
    accessibleName: string | undefined,
  ) {
    const tag = unsafeStatic(resolveAs(this.as));
    const digits = digitSize(displayText);
    const classes = {
      "ids-badge": true,
      [`ids-badge--type-${type}`]: true,
      [`ids-badge--digits-${digits}`]: true,
    };

    return html`
      <${tag}
        class=${classMap(classes)}
        data-ids="ids-badge"
        data-type=${type}
        aria-label=${accessibleName || nothing}
      >
        <span
          class="ids-badge-content"
          data-ids="ids-badge-content"
          >${displayText}</span
        >
      </${tag}>
    `;
  }

  override render() {
    if (this.isEmpty()) return nothing;

    const type = resolveType(this.type);
    const { valueText, displayText, isLargeNumber } = resolveDisplayText(
      this.value,
    );
    const accessibleName =
      this.ariaLabel || (isLargeNumber ? valueText : undefined);

    const badge = this.renderBadge(type, displayText, accessibleName);

    if (!isLargeNumber) return badge;

    return html`
      <ids-tooltip hugcontent side="top">
        <ids-tooltip-trigger>${badge}</ids-tooltip-trigger>
        <ids-tooltip-panel>
          <ids-tooltip-body>${valueText}</ids-tooltip-body>
        </ids-tooltip-panel>
      </ids-tooltip>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-badge": IdsBadge;
  }
}
