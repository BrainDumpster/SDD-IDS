/**
 * IdsTab — repeatable tab item composition carrier.
 * Tag: `ids-tab` (React `IdsTab` parity).
 *
 * Hierarchy:
 *   ids-tabs
 *     ids-tab
 *       ids-tab-button
 *       ids-tab-content
 */
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import type { IdsTabButton } from "./tab-button.element.js";
import type { IdsTabContent } from "./tab-content.element.js";
import { tabCarrierStyles } from "./tab.styles.js";

export class IdsTab extends LitElement {
  static override styles = [tabCarrierStyles];

  /** Stable tab id (required). */
  @property({ type: String, reflect: true })
  override id = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  closable = false;

  @property({ type: String, attribute: "iconslug", reflect: true })
  iconSlug = "";

  @property({ type: Number, attribute: "badgecount" })
  badgeCount?: number;

  @property({ type: Boolean, attribute: "hasalert", reflect: true })
  hasAlert = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tab");
  }

  get buttonEl(): IdsTabButton | null {
    return this.querySelector("ids-tab-button");
  }

  get contentEl(): IdsTabContent | null {
    return this.querySelector("ids-tab-content");
  }

  get labelText(): string {
    const fromButton = this.buttonEl?.labelText;
    if (fromButton) return fromButton;
    return this.id || "Tab";
  }

  override render() {
    return html`<slot></slot>`;
  }
}
