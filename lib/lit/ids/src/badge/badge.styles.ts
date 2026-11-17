/**
 * IDS Badge styles — from `components/ids/badge/design-spec.md`
 * (React IdsBadge.module.css token/type parity; geometry per design-spec).
 */
import { css } from "lit";

export const badgeStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    line-height: 0;
  }

  :host([hidden]),
  :host([data-empty]) {
    display: none;
  }

  .ids-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    height: 18px;
    min-width: 18px;
    border-width: var(--border-width-border-1);
    border-style: solid;
    border-radius: 100px;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    white-space: nowrap;
    overflow: hidden;
  }

  .ids-badge-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: var(--font-size-body-3, 12px);
    font-weight: 400;
    line-height: 1;
    text-align: center;
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
  }

  .ids-badge--digits-1 {
    padding: 0;
    width: 18px;
  }

  .ids-badge--digits-2 {
    padding: 0 4px;
  }

  .ids-badge--digits-3 {
    padding: 0 5.5px;
  }

  .ids-badge--type-default {
    background: var(--color-background-controls-base);
    border-color: var(--color-border-gray-white);
    color: var(--color-text-gray-white);
  }

  .ids-badge--type-critical {
    background: var(--color-background-alerting-critical-base);
    border-color: var(--color-border-gray-white);
    color: var(--color-text-gray-white);
  }

  .ids-badge--type-warning {
    background: var(--color-background-alerting-minor-base);
    border-color: var(
      --ids-badge-warning-border-color,
      var(--color-border-gray-white)
    );
    color: var(--color-text-gray-black);
  }

  .ids-badge--type-disabled {
    background: var(--color-static-gray-500);
    border-color: var(--color-border-gray-white);
    color: var(--color-text-gray-white);
  }

  .ids-badge--type-success {
    background: var(--color-background-alerting-success-base);
    border-color: var(--color-border-gray-white);
    color: var(--color-text-gray-white);
  }

  .ids-badge:focus-visible {
    outline: var(--border-width-border-2) solid var(--color-border-brand-base);
    outline-offset: 2px;
  }
`;
