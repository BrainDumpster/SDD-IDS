/**
 * IDS Toggle Switch styles — from `components/ids/toggle-switch/design-spec.md`
 * (React IdsToggleSwitch.module.css token/geometry parity).
 *
 * Live Figma (session): matrix `42848:100536`, set `8505:14389`, Off Default `8505:14390`.
 */
import { css } from "lit";

export const toggleSwitchStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  .ids-toggle-switch {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-8);
    min-height: 44px;
    cursor: pointer;
  }

  .ids-toggle-switch[data-disabled="true"] {
    cursor: not-allowed;
  }

  /* Optional field row: form label left of the switch, space-8 gap. */
  .ids-toggle-switch-field {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-8);
  }

  /* Visually hidden, still focusable (codegen: native checkbox). */
  .ids-toggle-switch-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Focus-ring host around 32×16 body (inset: -3px → 38×22). */
  .ids-toggle-switch-switch {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    width: 32px;
    height: 16px;
  }

  .ids-toggle-switch-input:focus-visible + .ids-toggle-switch-switch::after {
    content: "";
    position: absolute;
    inset: -3px;
    border: var(--border-width-border-1) solid var(--color-border-brand-base);
    border-radius: 999px;
    pointer-events: none;
  }

  .ids-toggle-switch-track {
    display: inline-flex;
    align-items: center;
    width: 32px;
    height: 16px;
    box-sizing: border-box;
    border-radius: 999px;
    /* Default off: transparent base border preserves 32×16 geometry. */
    border: var(--border-width-border-1) solid transparent;
    background: var(--color-background-gray-neutral-strong);
    transition:
      background-color 160ms ease-out,
      border-color 160ms ease-out;
  }

  .ids-toggle-switch-thumb {
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border-radius: 999px;
    border: var(--border-width-border-1) solid
      var(--color-border-gray-neutral-base);
    background: var(--color-background-surface-component);
    /* Off: left edge covers track base border. */
    transform: translateX(-1px);
    transition:
      transform 160ms ease-out,
      background-color 160ms ease-out,
      border-color 160ms ease-out;
  }

  /* Off / hover (suppressed while focus-visible) */
  .ids-toggle-switch:hover:not([data-disabled="true"]):not(
      [data-checked="true"]
    ):not(:has(.ids-toggle-switch-input:focus-visible))
    .ids-toggle-switch-track {
    background: var(--color-background-gray-neutral-stronger);
    border-color: var(--color-border-gray-neutral-stronger);
  }

  .ids-toggle-switch:hover:not([data-disabled="true"]):not(
      [data-checked="true"]
    ):not(:has(.ids-toggle-switch-input:focus-visible))
    .ids-toggle-switch-thumb {
    border-color: var(--color-border-gray-neutral-stronger);
  }

  /* On / default */
  .ids-toggle-switch[data-checked="true"] .ids-toggle-switch-track {
    background: var(--color-background-brand-base);
    border-color: var(--color-border-brand-base);
  }

  .ids-toggle-switch[data-checked="true"] .ids-toggle-switch-thumb {
    /* On: right edge covers track base border (16px travel). */
    transform: translateX(15px);
    border-color: var(--color-border-brand-base);
  }

  /* On / hover (suppressed while focus-visible) */
  .ids-toggle-switch[data-checked="true"]:hover:not([data-disabled="true"]):not(
      :has(.ids-toggle-switch-input:focus-visible)
    )
    .ids-toggle-switch-track {
    background: var(--color-background-brand-strong);
    border-color: var(--color-border-brand-strong);
  }

  .ids-toggle-switch[data-checked="true"]:hover:not([data-disabled="true"]):not(
      :has(.ids-toggle-switch-input:focus-visible)
    )
    .ids-toggle-switch-thumb {
    border-color: var(--color-border-brand-strong);
  }

  /*
   * Off / focus-visible: thumb border uses neutral-base.
   * On / focus-visible: thumb border keeps brand-base.
   */
  .ids-toggle-switch:not([data-checked="true"])
    .ids-toggle-switch-input:focus-visible
    + .ids-toggle-switch-switch
    .ids-toggle-switch-thumb {
    border-color: var(--color-border-gray-neutral-base);
  }

  .ids-toggle-switch[data-checked="true"]
    .ids-toggle-switch-input:focus-visible
    + .ids-toggle-switch-switch
    .ids-toggle-switch-thumb {
    border-color: var(--color-border-brand-base);
  }

  /* Disabled / off + Disabled / on */
  .ids-toggle-switch[data-disabled="true"] .ids-toggle-switch-track {
    background: var(--color-background-gray-light);
    border-color: var(--color-border-gray-disabled);
  }

  .ids-toggle-switch[data-disabled="true"] .ids-toggle-switch-thumb {
    background: var(--color-background-surface-component);
    border-color: var(--color-border-gray-disabled);
  }

  .ids-toggle-switch-status {
    color: var(--color-text-gray-neutral);
    font-size: var(--font-size-body-2, 14px);
    line-height: 16px;
    padding-top: var(--padding-padding-1);
    user-select: none;
  }

  .ids-toggle-switch[data-disabled="true"] .ids-toggle-switch-status {
    color: var(--color-text-gray-disabled);
  }

  /* Inline form-label parity (no Lit form-label package yet). */
  .ids-toggle-switch-label {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-8);
    box-sizing: border-box;
    padding-block: var(--padding-padding-6);
  }

  .ids-toggle-switch-label-group {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-2);
    margin: 0;
    padding: 0;
  }

  /* Spec: padding-top on inner label element (root keeps size padding-block). */
  .ids-toggle-switch-label-group {
    padding-top: var(--padding-padding-1);
  }

  .ids-toggle-switch-label-text,
  .ids-toggle-switch-label-marker {
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
    letter-spacing: 0;
    color: var(--color-text-gray-neutral-strong);
  }

  .ids-toggle-switch-label-info {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }
`;
