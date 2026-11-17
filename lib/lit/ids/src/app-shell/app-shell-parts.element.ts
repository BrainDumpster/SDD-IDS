/**
 * App Shell anatomy part elements (Nested Hierarchy / composition).
 * Public tags mirror React `IdsAppShell*` exports — not dotted compounds.
 */
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import {
  appShellHeaderActionsStyles,
  appShellPagePanelStyles,
  appShellPartHostStyles,
} from "./app-shell.styles.js";

/** Projection wrapper — Masthead icons region. */
export class IdsAppShellHeaderActions extends LitElement {
  static override styles = [appShellHeaderActionsStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsAppShellHeaderActions");
  }

  override render() {
    return html`
      <div class="IdsAppShellHeaderActions" data-ids="IdsAppShellHeaderActions">
        <slot></slot>
      </div>
    `;
  }
}

/** Story / demo body panel — never ships Figma `.SwapContent`. */
export class IdsAppShellPagePanel extends LitElement {
  static override styles = [appShellPagePanelStyles];

  @property({ type: String })
  title = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsAppShellPagePanel");
  }

  override render() {
    return html`
      <section
        class="IdsAppShellPagePanel"
        data-ids="IdsAppShellPagePanel"
        aria-label=${this.title || "Page content"}
      >
        ${this.title
          ? html`<h2 class="IdsAppShellPagePanelTitle">${this.title}</h2>`
          : null}
        <div class="IdsAppShellPagePanelBody"><slot></slot></div>
      </section>
    `;
  }
}

/** Light-DOM anatomy markers — `display: contents`; parent owns layout chrome. */
abstract class IdsAppShellPartHost extends LitElement {
  static override styles = [appShellPartHostStyles];

  protected abstract readonly dataIds: string;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", this.dataIds);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

export class IdsAppShellMastheadSlot extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellMastheadSlot";
}

export class IdsAppShellBodyRow extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellBodyRow";
}

export class IdsAppShellMainMenuSlot extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellMainMenuSlot";
}

export class IdsAppShellMainColumn extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellMainColumn";
}

export class IdsAppShellPageHeader extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellPageHeader";
}

export class IdsAppShellPageTitle extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellPageTitle";
}

export class IdsAppShellPageDescription extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellPageDescription";
}

export class IdsAppShellBodyViewport extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellBodyViewport";
}

export class IdsAppShellBodyContentSlot extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellBodyContentSlot";
}

export class IdsAppShellFooterSlot extends IdsAppShellPartHost {
  protected readonly dataIds = "IdsAppShellFooterSlot";
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-app-shell-header-actions": IdsAppShellHeaderActions;
    "ids-app-shell-page-panel": IdsAppShellPagePanel;
    "ids-app-shell-masthead-slot": IdsAppShellMastheadSlot;
    "ids-app-shell-body-row": IdsAppShellBodyRow;
    "ids-app-shell-main-menu-slot": IdsAppShellMainMenuSlot;
    "ids-app-shell-main-column": IdsAppShellMainColumn;
    "ids-app-shell-page-header": IdsAppShellPageHeader;
    "ids-app-shell-page-title": IdsAppShellPageTitle;
    "ids-app-shell-page-description": IdsAppShellPageDescription;
    "ids-app-shell-body-viewport": IdsAppShellBodyViewport;
    "ids-app-shell-body-content-slot": IdsAppShellBodyContentSlot;
    "ids-app-shell-footer-slot": IdsAppShellFooterSlot;
  }
}
