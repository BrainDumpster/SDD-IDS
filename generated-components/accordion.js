import { LitElement, css, html } from 'https://esm.sh/lit@3';

export class AccordionComponent extends LitElement {
  static properties = {
    title: { type: String },
    expanded: { type: Boolean, reflect: true },
    dataState: { type: String, attribute: 'data-state', reflect: true },
    managed: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.title = 'Accordion title';
    this.expanded = false;
    this.dataState = '';
    this.managed = false;
  }

  _toggle() {
    if (this.dataState) return;
    const nextExpanded = !this.expanded;
    if (!this.managed) {
      this.expanded = nextExpanded;
    }
    this.dispatchEvent(
      new CustomEvent('accordion-toggle', {
        detail: { expanded: nextExpanded },
        bubbles: true,
        composed: true,
      })
    );
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--color-border-accessible, #757575);
      background: var(--color-background-component, #FFFFFF);
      font-family: Roboto, Arial, sans-serif;
    }

    .header {
      width: 100%;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      padding: 10px 16px 10px 16px;
      border: 0;
      border-bottom: 1px solid var(--color-border-accessible, #757575);
      background: var(--color-background-component, #FFFFFF);
      color: var(--color-text-neutral-strong, #252525);
      font: 400 14px/20px Roboto, Arial, sans-serif;
      text-align: left;
      cursor: pointer;
      position: relative;
      transition: background-color 140ms ease, color 140ms ease;
    }

    .icon {
      width: 16px;
      height: 16px;
      color: var(--color-icon-accessible, #757575);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      transition: color 140ms ease, transform 140ms ease;
    }

    .content-wrap {
      display: none;
      padding: 8px 24px 16px 40px;
      background: var(--color-background-component, #FFFFFF);
      color: var(--color-text-neutral-strong, #252525);
    }

    .card {
      background: transparent;
      border: 0;
      padding: 0;
      display: grid;
      gap: 12px;
    }

    .rows {
      display: grid;
      gap: 4px;
    }

    .row {
      display: grid;
      grid-template-columns: 64px minmax(0, 1fr);
      gap: 0;
      font: 400 12px/18px Roboto, Arial, sans-serif;
      color: var(--color-text-neutral-strong, #252525);
    }

    .label {
      color: var(--color-text-neutral-strong, #252525);
    }

    .value {
      color: var(--color-text-neutral-strong, #252525);
    }

    .card h4 {
      margin: 0;
      font: 500 18px/25px Roboto, Arial, sans-serif;
      color: var(--color-text-neutral-strong, #252525);
    }

    .card p {
      margin: 0;
      font: 400 12px/18px Roboto, Arial, sans-serif;
      color: var(--color-text-neutral-strong, #252525);
    }

    .card a {
      color: var(--color-text-link-brand-base, #0062AB);
      text-decoration: underline;
    }

    :host([expanded]) .header {
      background: var(--color-background-brand-lighter, #EBF4FB);
      padding-left: 16px;
      border-bottom: 0;
    }

    :host([expanded])::before,
    :host([data-state="expanded-default"])::before,
    :host([data-state="expanded-hover"])::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.5px;
      bottom: 0.5px;
      width: 4px;
      background: var(--color-border-brand-base, #0076CE);
      pointer-events: none;
      z-index: 2;
    }

    :host([expanded]) .icon {
      color: var(--color-border-strong, #252525);
      transform: rotate(180deg);
    }

    :host([expanded]) .content-wrap {
      display: block;
    }

    .header,
    .content-wrap {
      position: relative;
      z-index: 1;
    }

    .header:hover {
      background: var(--color-background-brand-lighter, #EBF4FB);
    }

    :host([expanded]) .header:hover {
      background: var(--color-background-brand-light, #D9EAF8);
    }

    .header:hover .icon,
    :host([expanded]) .header .icon {
      color: var(--color-border-strong, #252525);
    }

    .header:focus-visible {
      outline: 2px solid var(--color-border-brand-base, #0076CE);
      outline-offset: 2px;
    }

    /* Forced visual states for demo */
    :host([data-state="collapsed-default"]) .header {
      background: var(--color-background-component, #FFFFFF);
      color: var(--color-text-neutral-strong, #252525);
    }
    :host([data-state="collapsed-default"]) .icon {
      color: var(--color-icon-accessible, #757575);
      transform: rotate(0deg);
    }

    :host([data-state="collapsed-hover"]) .header {
      background: var(--color-background-brand-lighter, #EBF4FB);
    }
    :host([data-state="collapsed-hover"]) .icon {
      color: var(--color-border-strong, #252525);
      transform: rotate(0deg);
    }

    :host([data-state="expanded-default"]) .header {
      background: var(--color-background-brand-lighter, #EBF4FB);
      padding-left: 16px;
      border-bottom: 0;
    }
    :host([data-state="expanded-default"]) .icon {
      color: var(--color-border-strong, #252525);
      transform: rotate(180deg);
    }
    :host([data-state="expanded-default"]) .content-wrap {
      display: block;
    }

    :host([data-state="expanded-hover"]) .header {
      background: var(--color-background-brand-light, #D9EAF8);
      padding-left: 16px;
      border-bottom: 0;
    }
    :host([data-state="expanded-hover"]) .icon {
      color: var(--color-border-strong, #252525);
      transform: rotate(180deg);
    }
    :host([data-state="expanded-hover"]) .content-wrap {
      display: block;
    }
  `;

  render() {
    const force = this.dataState;
    const isExpanded = force
      ? force === 'expanded-default' || force === 'expanded-hover'
      : this.expanded;
    const icon = isExpanded ? '▴' : '▾';
    return html`
      <button class="header" type="button" @click=${() => this._toggle()} aria-expanded=${String(isExpanded)}>
        <span class="icon" aria-hidden="true">${icon}</span>
        <span>${this.title}</span>
      </button>
      <div class="content-wrap">
        <div class="card">
          <h4><slot name="heading">Swap content</slot></h4>
          <div class="rows">
            <div class="row"><span class="label">Label:</span><span class="value">Single line content</span></div>
            <div class="row"><span class="label">Label:</span><span class="value">Single line content</span></div>
            <div class="row"><span class="label">Label:</span><span class="value">Some really long description that takes more than one or two lines.</span></div>
          </div>
          <a href="#" @click=${(e) => e.preventDefault()}>Action link</a>
        </div>
      </div>
    `;
  }
}

customElements.define('accordion-component', AccordionComponent);

export class AccordionGroupComponent extends LitElement {
  static properties = {
    mode: { type: String, reflect: true },
    openIndexes: { state: true },
    items: { type: Array },
  };

  constructor() {
    super();
    this.mode = 'single';
    this.openIndexes = [0];
    this.items = [
      { title: 'Panel 1' },
      { title: 'Panel 2' },
      { title: 'Panel 3' },
      { title: 'Panel 4' },
    ];
  }

  _isOpen(index) {
    return this.openIndexes.includes(index);
  }

  _toggleIndex(index) {
    if (this.mode === 'single') {
      this.openIndexes = this._isOpen(index) ? [] : [index];
      return;
    }
    if (this._isOpen(index)) {
      this.openIndexes = this.openIndexes.filter((i) => i !== index);
    } else {
      this.openIndexes = [...this.openIndexes, index].sort((a, b) => a - b);
    }
  }

  render() {
    return html`
      <div class="group">
        ${
          this.items.map(
            (item, idx) => html`
              <accordion-component
                .title=${item.title}
                ?expanded=${this._isOpen(idx)}
                ?managed=${true}
                @accordion-toggle=${() => this._toggleIndex(idx)}
              ></accordion-component>
            `
          )
        }
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .group {
      display: grid;
      gap: 0;
    }
    .group accordion-component + accordion-component {
      margin-top: -1px;
    }
  `;
}

customElements.define('accordion-group', AccordionGroupComponent);
