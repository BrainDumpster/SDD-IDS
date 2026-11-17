/**
 * IDS Text Box styles — from `components/ids/text-box/design-spec.md`
 * (React `IdsTextBox.module.css` + Angular helper-row parity).
 *
 * Live Figma: Content `42065:39424`, default TextBox instance `42104:83294`
 * (`Corner Radius/radius-none` → `--text-box-control-radius`).
 */
import { css } from "lit";

export const textBoxStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    width: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .ids-text-box-field {
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    gap: var(--spacing-space-16);
    width: 100%;
  }

  .ids-text-box-field[data-label-position="top"] {
    flex-direction: column;
    gap: var(--spacing-space-4);
  }

  .ids-text-box {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-space-4);
    width: 100%;
    min-width: 70px;
    max-width: 700px;
  }

  .ids-text-box-label {
    align-items: center;
    color: var(--color-text-gray-neutral-strong);
    display: flex;
    flex-shrink: 0;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2);
    font-weight: 400;
    gap: var(--spacing-space-8);
    line-height: var(--font-line-height-line-height-20);
    margin: 0;
    padding: var(--padding-padding-10) 0;
    white-space: nowrap;
  }

  .ids-text-box-label[data-size="small"] {
    padding: var(--padding-padding-6) 0;
  }

  .ids-text-box-field[data-label-position="top"] .ids-text-box-label {
    padding: 0;
  }

  .ids-text-box-label-text-group {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-space-2);
  }

  .ids-text-box-required-mark {
    color: var(--color-text-gray-neutral-strong);
  }

  .ids-text-box-info {
    all: unset;
    align-items: center;
    color: var(--color-icon-gray-neutral-base);
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
  }

  .ids-text-box-info ids-icon {
    display: block;
  }

  span.ids-text-box-info {
    cursor: default;
  }

  .ids-text-box-control {
    align-items: center;
    background: var(--color-background-surface-component);
    border: var(--border-width-border-1) solid
      var(--color-border-gray-neutral-base);
    border-radius: var(
      --text-box-control-radius,
      var(--corner-radius-radius-none)
    );
    display: flex;
    gap: var(--spacing-space-10);
    padding: 0 var(--padding-padding-16);
    position: relative;
    width: 100%;
  }

  .ids-text-box-control--large {
    height: 40px;
  }

  .ids-text-box-control--small {
    height: 32px;
  }

  .ids-text-box-control--text-area {
    align-items: flex-start;
    /* Sample total ~150px = control + 4px gap + helper row (~20px) → control ~126px */
    min-height: 126px;
    height: auto;
    padding-bottom: var(--padding-padding-10);
    padding-top: 9px;
  }

  .ids-text-box-control:hover:not([data-state="disabled"]):not(
      [data-state="error"]
    ) {
    border-color: var(--color-border-gray-neutral-strong);
  }

  .ids-text-box-control[data-state="hover"] {
    border-color: var(--color-border-gray-neutral-strong);
  }

  .ids-text-box-control[data-state="selected"] {
    border-color: var(--color-border-brand-base);
  }

  /* Focus = Selected — brand border, no outer ring (click or Tab). */
  .ids-text-box-control:focus-within:not([data-state="disabled"]):not(
      [data-state="error"]
    ),
  .ids-text-box-control[data-state="focus"] {
    border-color: var(--color-border-brand-base);
  }

  .ids-text-box-control[data-state="disabled"] {
    background: var(--color-background-gray-light);
    border-color: var(--color-border-gray-neutral-base);
  }

  .ids-text-box-control[data-state="error"] {
    border-color: var(--color-border-alerting-critical-base);
  }

  .ids-text-box-value {
    background: transparent;
    border: none;
    color: var(--color-text-gray-neutral);
    flex: 1 1 auto;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-20);
    min-width: 0;
    outline: none;
    resize: none;
    width: 100%;
  }

  .ids-text-box-control--text-area .ids-text-box-value {
    align-self: stretch;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .ids-text-box-value::placeholder {
    color: var(--color-text-gray-disabled);
  }

  .ids-text-box-value::selection {
    background: var(--color-background-brand-lighter-slate);
  }

  .ids-text-box-control[data-state="disabled"] .ids-text-box-value,
  .ids-text-box-control[data-state="disabled"] .ids-text-box-value::placeholder {
    color: var(--color-text-gray-disabled);
  }

  .ids-text-box-suffix-icon {
    color: var(--color-icon-gray-neutral-base);
    display: block;
    flex: 0 0 auto;
  }

  .ids-text-box-suffix-icon ids-icon {
    display: block;
  }

  .ids-text-box-control[data-state="disabled"] .ids-text-box-suffix-icon {
    color: var(--color-icon-gray-disabled);
  }

  .ids-text-box-helper-row {
    align-items: center;
    display: flex;
    gap: var(--spacing-space-8);
    min-height: 20px;
  }

  .ids-text-box-helper-copy {
    color: var(--color-text-gray-neutral);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    margin: 0;
  }

  .ids-text-box-helper-copy--error {
    color: var(--color-text-alerting-critical-base);
    white-space: nowrap;
  }

  .ids-text-box-error-icon {
    color: var(--color-icon-alerting-critical-base);
    display: block;
    flex: 0 0 auto;
  }

  .ids-text-box-error-icon ids-icon {
    display: block;
  }
`;
