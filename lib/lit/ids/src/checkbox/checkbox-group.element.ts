/**
 * IdsCheckboxGroup — Lit web component.
 *
 * Tag: `ids-checkbox-group` (design-spec / Angular)
 * Layout wrapper for projected `ids-checkbox` children.
 */
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import type { CheckboxGroupOrientation } from "./checkbox.constants.js";
import { checkboxGroupStyles } from "./checkbox.styles.js";

export class IdsCheckboxGroup extends LitElement {
  static override styles = [checkboxGroupStyles];

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  orientation: CheckboxGroupOrientation = "vertical";

  @property({ type: String })
  name = "";

  @property({ type: String, attribute: "idprefix" })
  idPrefix = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-checkbox-group");
  }

  override render() {
    const orientation =
      this.orientation === "horizontal" ? "horizontal" : "vertical";
    return html`
      <div
        class=${classMap({
          "ids-checkbox-group": true,
          [`ids-checkbox-group--${orientation}`]: true,
        })}
        role="group"
        data-ids="ids-checkbox-group"
        data-orientation=${orientation}
        data-disabled=${this.disabled ? "true" : "false"}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-checkbox-group": IdsCheckboxGroup;
  }
}
