import { LitElement, css, html } from 'https://esm.sh/lit@3';

export class ButtonComponent extends LitElement {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    dataState: { type: String, attribute: 'data-state', reflect: true },
    size: { type: String, reflect: true },
    density: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.disabled = false;
    this.dataState = 'default';
    this.size = 'large';
    this.density = 'standard';
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      appearance: none;
      border: 1px solid var(--color-border-brand-base, #0076CE);
      background: var(--color-background-controls-brand-base, #0076CE);
      color: var(--color-text-white, #FFFFFF);
      border-radius: var(--radius-button, 2px);
      height: var(--button-height, 40px);
      min-width: 56px;
      max-width: 320px;
      padding: var(--button-padding-top, 10px) var(--button-padding-x, 16px)
        var(--button-padding-bottom, 10px) var(--button-padding-left, 16px);
      font: 500 14px/20px Roboto, Arial, sans-serif;
      cursor: pointer;
      transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--button-gap, 8px);
      white-space: nowrap;
    }

    :host([size="medium"]) button {
      height: 32px;
      padding: 8px 16px 8px 16px;
      gap: 8px;
      border-radius: 2px;
    }

    :host([size="small"]) button {
      height: 24px;
      padding: 2px 16px 2px 16px;
      gap: 8px;
      border-radius: 2px;
      font-size: 13px;
      line-height: 16px;
    }

    /* Density overrides (vertical rhythm), derived from Density Primitive */
    :host([density="compact"][size="large"]) button {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    :host([density="standard"][size="large"]) button {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    :host([density="loose"][size="large"]) button {
      padding-top: 12px;
      padding-bottom: 12px;
    }

    :host([density="compact"][size="medium"]) button {
      padding-top: 6px;
      padding-bottom: 6px;
    }

    :host([density="standard"][size="medium"]) button {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    :host([density="compact"][size="small"]) button {
      padding-top: 2px;
      padding-bottom: 2px;
    }

    button:hover {
      background: var(--color-background-controls-brand-strong, #0062AB);
      border-color: var(--color-border-brand-base, #0076CE);
      color: var(--color-text-white, #FFFFFF);
    }

    button:active {
      background: var(--color-background-controls-brand-stronger, #06528A);
      border-color: var(--color-border-brand-base, #0076CE);
      color: var(--color-text-white, #FFFFFF);
    }

    button:focus-visible {
      outline: 2px solid var(--color-border-brand-base, #0076CE);
      outline-offset: 2px;
      background: var(--color-background-controls-brand-base, #0076CE);
      border-color: var(--color-border-brand-base, #0076CE);
      color: var(--color-text-white, #FFFFFF);
    }

    :host([disabled]) button,
    button:disabled {
      background: var(--color-background-gray-light, #EAEAEA);
      border-color: var(--color-border-disabled, #757575);
      color: var(--color-text-disabled, #757575);
      cursor: not-allowed;
      pointer-events: none;
    }

    :host([data-state="hover"]:not([disabled])) button {
      background: var(--color-background-controls-brand-strong, #0062AB);
      border-color: var(--color-border-brand-base, #0076CE);
      color: var(--color-text-white, #FFFFFF);
    }

    :host([data-state="active"]:not([disabled])) button {
      background: var(--color-background-controls-brand-stronger, #06528A);
      border-color: var(--color-border-brand-base, #0076CE);
      color: var(--color-text-white, #FFFFFF);
    }

    :host([data-state="focus"]:not([disabled])) button {
      outline: 2px solid var(--color-border-brand-base, #0076CE);
      outline-offset: 2px;
      background: var(--color-background-controls-brand-base, #0076CE);
      border-color: var(--color-border-brand-base, #0076CE);
      color: var(--color-text-white, #FFFFFF);
    }

    :host([data-state="disabled"]) button {
      background: var(--color-background-gray-light, #EAEAEA);
      border-color: var(--color-border-disabled, #757575);
      color: var(--color-text-disabled, #757575);
      cursor: not-allowed;
      pointer-events: none;
    }

    ::slotted([slot="icon"]) {
      width: 14px;
      height: 14px;
      color: currentColor;
      fill: currentColor;
      flex: 0 0 auto;
    }
  `;

  render() {
    const isDisabled = this.disabled || this.dataState === 'disabled';
    return html`
      <button type="button" ?disabled=${isDisabled} aria-disabled=${String(isDisabled)}>
        <slot name="icon"></slot>
        <slot>Button</slot>
      </button>
    `;
  }
}

customElements.define('button-component', ButtonComponent);
