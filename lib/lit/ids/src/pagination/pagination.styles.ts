/**
 * IDS Pagination styles — from `components/ids/pagination/design-spec.md`
 * (React `IdsPagination.module.css` + Angular portal menu parity).
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`):
 *   Main `11677:157840` / Gray `11677:157841` / None `11677:157848`
 *   Page nav `11677:157817` · Per-page dropdown `37721:115839`
 *   Page input TextBox `11677:157819` → `Corner Radius/radius-none`
 */
import { css } from "lit";

export const paginationStyles = css`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
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

  .root {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-space-16);
    width: 100%;
    min-width: 495px;
    height: 48px;
    overflow: hidden;
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base);
    padding: 0 calc(var(--padding-padding-16) * 2) 0 var(--padding-padding-24);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral-strong);
  }

  .rootGray {
    background: var(--color-background-surface-primary);
  }

  .rootWhite {
    background: var(--color-background-surface-component);
  }

  .rootNone {
    background: transparent;
  }

  /* Datagrid footer: shell owns left/right/bottom; pagination keeps top divider only. */
  .root.rootEmbedded {
    border: 0;
    border-top: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base);
  }

  .resultsGroup {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-16);
    flex-shrink: 0;
    min-width: 0;
  }

  .label {
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral-strong);
    white-space: nowrap;
  }

  .dropdownWrap {
    position: relative;
    flex-shrink: 0;
  }

  .dropdownTrigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-space-10);
    box-sizing: border-box;
    width: 90px;
    height: 32px;
    margin: 0;
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base);
    border-radius: var(--corner-radius-radius-none, 0);
    background: var(--color-background-surface-component);
    color: var(--color-text-gray-neutral);
    padding: 0 var(--padding-padding-16);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
  }

  .dropdownTrigger:hover:not(:disabled) {
    border-color: var(--color-border-gray-neutral-strong);
  }

  .dropdownTrigger:focus-visible {
    outline: none;
    box-shadow: 0 0 0 var(--border-width-border-default, 1px)
      var(--color-border-brand-base);
  }

  .dropdownTrigger:disabled {
    cursor: not-allowed;
    color: var(--color-text-gray-disabled);
    background: var(--color-background-gray-lighter);
    border-color: var(--color-border-gray-disabled);
  }

  .dropdownTrigger ids-icon {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    color: var(--color-icon-gray-neutral-base);
  }

  .dropdownTrigger:disabled ids-icon {
    color: var(--color-icon-gray-disabled);
  }

  .pageNavGroup {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-16);
    flex-shrink: 0;
    margin-left: auto;
    min-width: 0;
  }

  .iconButton {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--color-icon-brand-base);
    cursor: pointer;
    flex-shrink: 0;
  }

  .iconButton ids-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: currentColor;
  }

  .iconButton:hover:not(:disabled) {
    color: var(--color-icon-brand-base);
  }

  .iconButton:focus-visible {
    outline: none;
  }

  .iconButton:focus-visible::after {
    content: "";
    position: absolute;
    inset: -4px;
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-brand-base);
    border-radius: var(--corner-radius-radius-4);
    pointer-events: none;
  }

  .iconButton:disabled {
    color: var(--color-icon-gray-disabled);
    cursor: not-allowed;
  }

  .iconButtonCollapsed {
    display: none;
  }

  .pageInputWrap {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 52px;
    min-width: 52px;
    max-width: 52px;
    height: 32px;
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base);
    border-radius: var(--corner-radius-radius-none, 0);
    background: var(--color-background-surface-component);
    padding: 0 4px;
    flex: 0 0 52px;
  }

  .pageInputWrapCollapsed {
    display: none;
  }

  .pageInput {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--color-text-gray-neutral);
    text-align: center;
    font-family: inherit;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
  }

  .pageInput:focus {
    outline: 0;
  }

  /* Spec: IdsTextBox selected-state brand border; suppress outer focus ring. */
  .pageInputWrap:has(.pageInput:focus-visible) {
    border-color: var(--color-border-brand-base);
  }

  .countText {
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral-strong);
    white-space: nowrap;
    flex-shrink: 0;
  }
`;

/**
 * Portaled per-page menu styles (document-adopted). Prefixed so they cannot
 * collide with page CSS — menu leaves the shadow root for stacking/overflow.
 */
export const paginationMenuPortalStyles = css`
  .ids-pagination-menu {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base);
    border-radius: var(--corner-radius-radius-none, 0);
    background: var(--color-background-surface-component);
    overflow: clip;
    box-shadow:
      var(--shadow-shadow-4-drop-shadow-4-x, 0)
        var(--shadow-shadow-4-drop-shadow-4-y, 4px)
        var(--shadow-shadow-4-drop-shadow-4-blur, 4px)
        var(--shadow-shadow-4-drop-shadow-4-spread, 0)
        var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),
      0 2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));
    z-index: 10000;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
  }

  .ids-pagination-menu[data-placement="below"] {
    border-top: none;
  }

  .ids-pagination-menu[data-placement="above"] {
    border-bottom: none;
    box-shadow: none;
  }

  .ids-pagination-menu-option {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-height: 40px;
    margin: 0;
    border: 0;
    border-top: var(--border-width-border-default, 1px) solid transparent;
    border-bottom: var(--border-width-border-default, 1px) solid transparent;
    border-radius: 0;
    background: var(--color-background-surface-component);
    color: var(--color-text-gray-neutral);
    text-align: left;
    padding: var(--padding-padding-10) var(--padding-padding-16);
    font-family: inherit;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
  }

  .ids-pagination-menu-option:hover {
    background: var(--color-background-brand-lighter-slate);
    border-top-color: var(--color-border-brand-base-neutral);
    border-bottom-color: var(--color-border-brand-base-neutral);
  }

  .ids-pagination-menu-option:active {
    background: var(--color-background-brand-light-slate);
    color: var(--color-text-brand-strong);
    border-top-color: var(--color-border-brand-base-neutral);
    border-bottom-color: var(--color-border-brand-base-neutral);
  }

  .ids-pagination-menu-option[aria-selected="true"] {
    background: var(--color-background-brand-lighter-slate);
    color: var(--color-text-brand-strong);
    border-top-color: var(--color-border-brand-base-neutral);
    border-bottom-color: var(--color-border-brand-base-neutral);
  }

  .ids-pagination-menu-option:focus-visible {
    outline: var(--border-width-border-default, 1px) solid
      var(--color-border-brand-base);
    outline-offset: 4px;
    border-radius: var(--corner-radius-radius-4);
  }
`;
