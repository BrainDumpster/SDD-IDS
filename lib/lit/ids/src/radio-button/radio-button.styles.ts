/**
 * IDS Radio Button styles — from `components/ids/radio-button/design-spec.md`
 * (Angular SCSS parity).
 */
import { css } from "lit";

export const radioButtonStyles = css`
  :host {
    display: inline-flex;
  }

  .ids-radio {
    display: inline-flex;
    flex-direction: column;
    gap: var(--spacing-space-4);
  }

  .ids-radio-row {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-8);
    cursor: pointer;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2);
    font-weight: 400;
    color: var(--color-text-gray-neutral);
    line-height: var(--font-line-height-line-height-20);
    min-height: 20px;
  }

  .ids-radio-row[data-disabled="true"] {
    cursor: not-allowed;
    color: var(--color-text-gray-disabled);
  }

  .ids-radio-control {
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    border-radius: 50%;
    background: var(--color-background-surface-component);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 100ms ease;
    cursor: inherit;
    outline: none;
    padding: 0;
    position: relative;
  }

  .ids-radio-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }

  .ids-radio-row:hover:not([data-disabled="true"]) .ids-radio-control {
    background: var(--color-background-surface-component);
    border-color: var(--color-border-gray-neutral-strong);
  }

  .ids-radio-control:has(.ids-radio-input:focus-visible),
  .ids-radio-control[data-simulated-state="focus-visible"] {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: 2px;
  }

  .ids-radio[data-checked="true"] .ids-radio-control {
    background: var(--color-background-surface-component);
    border-color: var(--color-border-brand-base);
  }

  .ids-radio[data-checked="true"]
    .ids-radio-row:hover:not([data-disabled="true"])
    .ids-radio-control {
    background: var(--color-background-surface-component);
    border-color: var(--color-border-gray-neutral-strong);
  }

  .ids-radio[data-checked="true"]
    .ids-radio-row:hover:not([data-disabled="true"])
    .ids-radio-indicator {
    background: var(--color-icon-brand-strong);
  }

  .ids-radio-control[data-simulated-state="hover"]:not([data-disabled="true"]) {
    background: var(--color-background-surface-component);
    border-color: var(--color-border-gray-neutral-strong);
  }

  .ids-radio[data-checked="true"]
    .ids-radio-control[data-simulated-state="hover"]:not([data-disabled="true"])
    .ids-radio-indicator {
    background: var(--color-icon-brand-strong);
  }

  .ids-radio[data-disabled="true"] .ids-radio-control {
    background: var(--color-background-gray-light);
    border-color: var(--color-border-gray-disabled);
    cursor: not-allowed;
  }

  .ids-radio-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-icon-brand-base);
    transform: scale(0);
    transition: transform 100ms ease;
    pointer-events: none;
  }

  .ids-radio[data-checked="true"] .ids-radio-indicator {
    transform: scale(1);
  }

  .ids-radio[data-disabled="true"][data-checked="true"] .ids-radio-indicator {
    background: var(--color-icon-gray-disabled);
  }

  .ids-radio[data-error="true"]:not([data-checked="true"]) .ids-radio-control {
    border-color: var(--color-border-gray-neutral-strong);
  }

  .ids-radio-label {
    user-select: none;
  }

  .ids-radio-assistive {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral);
    margin: 0;
  }

  .ids-radio-assistive--error {
    color: var(--color-text-alerting-critical-base);
  }

  .ids-radio-assistive--disabled {
    color: var(--color-text-gray-disabled);
  }

  .ids-radio-error-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    display: block;
  }

  .ids-radio-error-icon ids-icon {
    width: 16px;
    height: 16px;
    display: block;
  }
`;

export const radioButtonGroupStyles = css`
  :host {
    display: inline-flex;
  }

  .ids-radio-group {
    display: flex;
    gap: var(--spacing-space-16);
  }

  .ids-radio-group--vertical {
    flex-direction: column;
  }

  .ids-radio-group--horizontal {
    flex-direction: row;
  }
`;
