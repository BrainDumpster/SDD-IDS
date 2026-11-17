/**
 * Shared helper / error message styles — React `IdsHelper.module.css` parity.
 */
import { css } from "lit";

export const controlMessageStyles = css`
  :host {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8);
    margin: 0;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([data-ids="ids-control-helper"]) {
    color: var(--color-text-gray-neutral);
  }

  :host([data-ids="ids-control-error"]) {
    color: var(--color-text-alerting-critical-base);
  }

  :host([data-disabled="true"]) {
    color: var(--color-text-gray-disabled);
  }

  /* No icon → no reserved gutter so helper copy aligns with the control edge. */
  :host(:not([data-has-icon])) {
    gap: 0;
  }

  .ids-control-icon {
    display: inline-flex;
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
  }

  /* Keep [hidden] winning over .ids-control-icon { display: inline-flex }. */
  .ids-control-icon[hidden] {
    display: none !important;
  }

  .ids-control-icon ::slotted(*),
  .ids-control-icon ids-icon {
    width: 16px;
    height: 16px;
    max-width: 16px;
    max-height: 16px;
    display: block;
  }

  .ids-control-text {
    min-width: 0;
  }

  :host([data-ids="ids-control-helper"]) .ids-control-text {
    max-width: 900px;
    flex-shrink: 0;
  }

  /* Text Box design-spec: error copy is single-line, no ellipsis. */
  :host([data-ids="ids-control-error"][nowrap]) .ids-control-text {
    white-space: nowrap;
  }
`;
