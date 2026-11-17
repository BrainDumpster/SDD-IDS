/**
 * Detail panel content blocks — Figma `.Details_Panel-Template`
 * (Section / Field / Block). React: IdsDetailPanelSection / Field / Block.
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import {
  detailPanelBlockStyles,
  detailPanelFieldStyles,
  detailPanelSectionStyles,
} from "./detail-panel.styles.js";

let sectionUid = 0;

export class IdsDetailPanelSection extends LitElement {
  static override styles = [detailPanelSectionStyles];

  /** Section header text (Figma ".Section Header for details panel"). */
  @property({ type: String })
  title = "";

  private readonly titleId = `ids-detail-panel-section-title-${++sectionUid}`;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-section");
  }

  override render() {
    const hasTitle = this.title != null && this.title !== "";
    return html`
      <section
        class="ids-detail-panel-section"
        data-ids="ids-detail-panel-section"
        aria-labelledby=${hasTitle ? this.titleId : nothing}
      >
        ${hasTitle
          ? html`
              <h4 id=${this.titleId} class="ids-detail-panel-section-header">
                ${this.title}
              </h4>
            `
          : nothing}
        <div class="ids-detail-panel-fields" role="list">
          <slot></slot>
        </div>
      </section>
    `;
  }
}

export class IdsDetailPanelField extends LitElement {
  static override styles = [detailPanelFieldStyles];

  /** Label cell, e.g. `"Status:"` (Figma shows the trailing colon). */
  @property({ type: String })
  label = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-field");
  }

  override render() {
    return html`
      <div class="ids-detail-panel-field-label" role="term">${this.label}</div>
      <div class="ids-detail-panel-field-value" role="definition">
        <slot></slot>
      </div>
    `;
  }
}

export class IdsDetailPanelBlock extends LitElement {
  static override styles = [detailPanelBlockStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-detail-panel-block");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-detail-panel-section": IdsDetailPanelSection;
    "ids-detail-panel-field": IdsDetailPanelField;
    "ids-detail-panel-block": IdsDetailPanelBlock;
  }
}
