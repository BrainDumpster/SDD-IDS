/**
 * IDS Button styles — from `components/ids/button/design-spec.md`
 * (React IdsButton.module.css parity).
 */
import { css } from "lit";

export const buttonStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([fluid]) {
    display: block;
    width: 100%;
  }

  :host([fluid]) .ids-button {
    width: 100%;
  }

  .ids-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-space-8);
    box-sizing: border-box;
    border: none;
    box-shadow: inset 0 0 0 var(--border-width-border-1) transparent;
    border-radius: var(--button-control-radius);
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-weight: 400;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
    transition:
      background-color 150ms ease,
      box-shadow 150ms ease,
      color 150ms ease;
    position: relative;
    white-space: nowrap;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    padding: 0;
    min-width: 56px;
    max-width: 320px;
  }

  .ids-button--small {
    min-height: var(--scale-24, 24px);
    padding: var(--padding-padding-2) var(--padding-padding-16);
  }

  .ids-button--medium {
    min-height: var(--scale-32, 32px);
    padding: var(--padding-padding-6) var(--padding-padding-16);
  }

  .ids-button--large {
    min-height: var(--scale-40, 40px);
    padding: var(--padding-padding-10) var(--padding-padding-16);
  }


  .ids-button-leading-icon {
    display: inline-flex;
    flex-shrink: 0;
    width: var(--ui-icon-spacing-icon-16);
    height: var(--ui-icon-spacing-icon-16);
    min-width: var(--ui-icon-spacing-icon-16);
    min-height: var(--ui-icon-spacing-icon-16);
    align-items: center;
    justify-content: center;
    color: inherit;
  }





  .ids-button-leading-icon ids-icon {
    width: var(--ui-icon-spacing-icon-16);
    height: var(--ui-icon-spacing-icon-16);
    min-width: var(--ui-icon-spacing-icon-16);
    min-height: var(--ui-icon-spacing-icon-16);
  }

  .ids-button-label {
    display: inline-flex;
    align-items: center;
    font-weight: 400;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
  }

  .ids-button--primary .ids-button-leading-icon,
  .ids-button--destructive .ids-button-leading-icon {
    color: var(--color-icon-gray-white);
  }

  .ids-button--secondary .ids-button-leading-icon,
  .ids-button--tertiary .ids-button-leading-icon {
    color: var(--color-icon-brand-base);
  }






  .ids-button:disabled .ids-button-leading-icon,
  .ids-button--disabled .ids-button-leading-icon,
  .ids-button[data-state="disabled"] .ids-button-leading-icon {
    color: var(--color-icon-gray-disabled);
  }

  .ids-button--primary {
    background: var(--color-background-controls-base);
    box-shadow: inset 0 0 0 var(--border-width-border-1)
      var(--color-border-brand-transparent-brand);
    color: var(--color-text-gray-white);
  }

  .ids-button--primary:hover:not(:disabled),
  .ids-button--primary[data-state="hover"] {
    background: var(--color-background-controls-strong);
  }

  .ids-button--primary:active:not(:disabled),
  .ids-button--primary[data-state="press"] {
    background: var(--color-background-controls-stronger);
  }

  .ids-button--primary:disabled,
  .ids-button--primary.ids-button--disabled,
  .ids-button--primary[data-state="disabled"] {
    background: var(--color-background-gray-lighter);
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--color-border-gray-disabled);
    color: var(--color-text-gray-disabled);
  }

  .ids-button--primary:focus-visible:not(:disabled),
  .ids-button--primary[data-state="focus-visible"] {
    background: var(--color-background-controls-strong);
    box-shadow:
      inset 0 0 0 var(--border-width-border-1) var(--color-border-brand-transparent-brand),
      0 0 0 var(--scale-2) var(--color-border-gray-white),
      0 0 0 var(--scale-4) var(--color-border-brand-base);
  }

  .ids-button--secondary {
    background: transparent;
    color: var(--color-text-brand-strong);
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--color-border-brand-base);
  }

  .ids-button--secondary:hover:not(:disabled),
  .ids-button--secondary[data-state="hover"] {
    background: var(--color-background-controls-light);
  }

  .ids-button--secondary:active:not(:disabled),
  .ids-button--secondary[data-state="press"] {
    background: var(--color-background-controls-press, var(--color-background-controls-light));
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--color-border-brand-strong);
  }


  .ids-button--secondary:disabled,
  .ids-button--secondary.ids-button--disabled,
  .ids-button--secondary[data-state="disabled"] {
    background: transparent;
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--color-border-gray-disabled);
    color: var(--color-text-gray-disabled);
  }

  .ids-button--secondary:focus-visible:not(:disabled),
  .ids-button--secondary[data-state="focus-visible"] {
    background: var(--color-background-controls-light);
    box-shadow:
      inset 0 0 0 var(--border-width-border-1) var(--color-border-brand-base),
      0 0 0 var(--scale-2) var(--color-border-gray-white),
      0 0 0 var(--scale-4) var(--color-border-brand-base);
  }

  .ids-button--tertiary {
    background: transparent;
    color: var(--color-text-brand-strong);
    box-shadow: inset 0 0 0 var(--border-width-border-1) transparent;
  }

  .ids-button--tertiary:hover:not(:disabled),
  .ids-button--tertiary[data-state="hover"] {
    background: var(--color-background-controls-light);
    box-shadow: inset 0 0 0 var(--border-width-border-1) transparent;
  }

  .ids-button--tertiary:active:not(:disabled),
  .ids-button--tertiary[data-state="press"] {
    background: var(--color-background-controls-press, var(--color-background-controls-light));
    box-shadow: inset 0 0 0 var(--border-width-border-1) transparent;
  }

  .ids-button--tertiary:disabled,
  .ids-button--tertiary.ids-button--disabled,
  .ids-button--tertiary[data-state="disabled"] {
    background: transparent;
    box-shadow: inset 0 0 0 var(--border-width-border-1) transparent;
    color: var(--color-text-gray-disabled);
  }

  .ids-button--tertiary:focus-visible:not(:disabled),
  .ids-button--tertiary[data-state="focus-visible"] {
    background: var(--color-background-controls-light);
    box-shadow:
      inset 0 0 0 var(--border-width-border-1) transparent,
      0 0 0 var(--scale-2) var(--color-border-gray-white),
      0 0 0 var(--scale-4) var(--color-border-brand-base);
  }

  .ids-button--destructive {
    background: var(--color-background-alerting-critical-base);
    box-shadow: inset 0 0 0 var(--border-width-border-1)
      var(--color-border-alerting-critical-transparent-base);
    color: var(--color-text-gray-white);
  }

  .ids-button--destructive:hover:not(:disabled),
  .ids-button--destructive[data-state="hover"] {
    background: var(--color-background-alerting-critical-strong);
  }

  .ids-button--destructive:active:not(:disabled),
  .ids-button--destructive[data-state="press"] {
    background: var(--color-background-alerting-critical-stronger);
  }

  .ids-button--destructive:disabled,
  .ids-button--destructive.ids-button--disabled,
  .ids-button--destructive[data-state="disabled"] {
    background: var(--color-background-gray-lighter);
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--color-border-gray-disabled);
    color: var(--color-text-gray-disabled);
  }

  .ids-button--destructive:focus-visible:not(:disabled),
  .ids-button--destructive[data-state="focus-visible"] {
    background: var(--color-background-alerting-critical-strong);
    box-shadow:
      inset 0 0 0 var(--border-width-border-1)
        var(--color-border-alerting-critical-transparent-base),
      0 0 0 var(--scale-2) var(--color-border-gray-white),
      0 0 0 var(--scale-4) var(--color-border-brand-base);
  }


  .ids-button:disabled,
  .ids-button--disabled,
  .ids-button[data-state="disabled"] {
    cursor: not-allowed;
  }

  .ids-button:focus-visible:not(:disabled),
  .ids-button[data-state="focus-visible"] {
    outline: none;
  }

  .ids-button--loading {
    cursor: wait;
  }

  .ids-button-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ids-button-spin 0.6s linear infinite;
    position: absolute;
  }

  .ids-button-label--hidden,
  .ids-button-leading-icon--hidden {
    visibility: hidden;
  }

  @keyframes ids-button-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
