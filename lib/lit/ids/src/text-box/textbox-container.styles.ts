/**
 * IdsTextboxContainer layout — checkbox-group field chrome + text-box geometry.
 */
import { css } from "lit";

export const textboxContainerStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
  }

  :host([hidden]) {
    display: none !important;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .ids-textbox-container {
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    gap: var(--spacing-space-16);
    width: 100%;
  }

  .ids-textbox-container[data-label-position="top"] {
    flex-direction: column;
    gap: var(--spacing-space-4);
  }

  .ids-textbox-container-label {
    align-items: center;
    color: var(--color-text-gray-neutral-strong);
    display: inline-flex;
    flex-shrink: 0;
    font-size: var(--font-size-body-2);
    font-weight: 400;
    gap: var(--spacing-space-8);
    line-height: var(--font-line-height-line-height-20);
    margin: 0;
    min-height: 20px;
    padding: var(--padding-padding-10) 0;
    white-space: nowrap;
  }

  .ids-textbox-container[data-size="small"] .ids-textbox-container-label {
    padding: var(--padding-padding-6) 0;
  }

  .ids-textbox-container[data-label-position="top"] .ids-textbox-container-label {
    padding: 0;
  }

  .ids-textbox-container-label[hidden] {
    display: none !important;
  }

  .ids-textbox-container-label-text {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-space-2);
  }

  .ids-textbox-container-label-text ::slotted(*) {
    color: inherit;
    font: inherit;
    white-space: inherit;
  }

  .ids-textbox-container-required {
    color: var(--color-text-gray-neutral-strong);
  }

  .ids-textbox-container-info {
    display: inline-flex;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  .ids-textbox-container-body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-space-4);
    min-width: 70px;
    max-width: 700px;
    width: 100%;
  }

  .ids-textbox-container-control {
    display: block;
    width: 100%;
  }

  .ids-textbox-container-control ::slotted(ids-text-box) {
    display: block;
    width: 100%;
  }

  .ids-textbox-container-message {
    display: block;
    min-height: 20px;
  }

  .ids-textbox-container-message[hidden] {
    display: none !important;
  }

  /* Text Box error copy stays single-line (design-spec). */
  .ids-textbox-container-message ::slotted(ids-control-error) {
    white-space: nowrap;
  }
`;
