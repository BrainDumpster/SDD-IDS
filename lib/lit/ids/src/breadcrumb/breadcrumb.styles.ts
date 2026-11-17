/**
 * IDS Breadcrumb styles — from `components/ids/breadcrumb/design-spec.md`
 * (Storybook React IdsBreadcrumb.module.css token/geometry parity).
 *
 * Live Figma (file VZJ48bbVYrIynw8DdSukWw, MCP session 2026-11-10):
 *   component page `11067:54494`
 *   Standard Two lines Number=4 `11067:56646` — trail gap 8, current Header 5
 *   Truncated Overflow Menu=Yes `11067:56570` — ellipsis + Dropdown-SingleSelect menu
 */
import { css } from "lit";

export const breadcrumbStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    position: relative;
  }

  :host([hidden]) {
    display: none !important;
  }

  .ids-breadcrumb {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-space-4);
    align-items: flex-start;
    padding: 0;
    margin: 0;
    position: relative;
  }

  .ids-breadcrumb-list {
    display: flex;
    gap: var(--spacing-space-8);
    align-items: flex-start;
    padding: 0;
    margin: 0;
    list-style: none;
    position: relative;
    flex-shrink: 0;
  }

  .ids-breadcrumb-item {
    display: flex;
    gap: var(--spacing-space-8);
    align-items: center;
    padding: 0;
    position: relative;
    flex-shrink: 0;
    min-width: 24px;
    /* Inherited into IdsLink shadow (display:contents host). */
    white-space: nowrap;
  }

  .ids-breadcrumb-separator {
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-weight: 400;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral);
    white-space: nowrap;
    position: relative;
    flex-shrink: 0;
    user-select: none;
  }

  .ids-breadcrumb-current {
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-weight: 400;
    font-size: var(--font-size-header-5);
    line-height: var(--font-line-height-line-height-32);
    color: var(--color-text-gray-neutral-strong);
    white-space: nowrap;
    position: relative;
    flex-shrink: 0;
  }

  .ids-breadcrumb-overflow {
    position: relative;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    white-space: nowrap;
  }
`;

/** Adopted onto `document` for the body-portaled overflow menu. */
export const breadcrumbOverflowPortalStyles = css`
  .ids-breadcrumb-overflow-portal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1060;
    box-sizing: border-box;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
  }

  .ids-breadcrumb-overflow-menu {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    background: var(--color-background-surface-component);
    border: var(--border-width-border-1, 1px) solid
      var(--color-border-gray-neutral-base);
    border-radius: var(--corner-radius-radius-none, 0);
    box-shadow:
      0 2px 3px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));
    width: max-content;
    min-width: max-content;
    max-width: min(700px, 100vw);
    overflow: clip;
    outline: none;
  }

  .ids-breadcrumb-overflow-option {
    all: unset;
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;
    width: 100%;
    min-height: 32px;
    padding: var(--padding-padding-6) var(--padding-padding-16);
    background: var(--color-background-surface-component);
    color: var(--color-text-gray-neutral);
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
    white-space: nowrap;
  }

  .ids-breadcrumb-overflow-option:hover {
    background: var(--color-background-brand-lighter-slate);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-breadcrumb-overflow-option:focus-visible {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: -1px;
    border-radius: var(--corner-radius-radius-4);
  }

  .ids-breadcrumb-overflow-option:active {
    background: var(--color-background-brand-light-slate);
  }
`;
