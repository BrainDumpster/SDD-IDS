/**
 * IDS Anchor Menu styles — from `components/ids/anchor-menu/design-spec.md`
 * and React `lib/react/ids/anchor-menu/IdsAnchorMenu.module.css`.
 *
 * Live Figma (VZJ48bbVYrIynw8DdSukWw, MCP 2026-11-10):
 *   Unselected `11955:229730` — 1.2px gray rail, Body 1, px-24 py-8
 *   Hover `11955:229732` — 4px brand-base rail, neutral text
 *   Selected `11955:229728` — 4px brand-base rail, brand-strong text
 *   Unselected-Focus `11955:230551` / Selected-Focus `11955:230577` —
 *     2px brand ring, radius 4, inside item
 *   Example `11955:229709` — Overview…Redlines, no header
 */
import { css } from "lit";

export const anchorMenuStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    width: fit-content;
    min-width: min(200px, 100%);
    max-width: min(300px, 100%);
  }

  :host([hidden]) {
    display: none !important;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .ids-anchor-menu {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: fit-content;
    min-width: min(200px, 100%);
    max-width: min(300px, 100%);
    margin: 0;
    padding: 0;
    background: transparent;
    border: none;
    color: var(--color-text-gray-neutral);
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
  }

  .ids-anchor-menu--sticky {
    position: sticky;
    top: var(--ids-anchor-menu-sticky-top, 24px);
    align-self: flex-start;
    max-height: calc(100vh - var(--ids-anchor-menu-sticky-top, 24px) - 24px);
    max-height: calc(100dvh - var(--ids-anchor-menu-sticky-top, 24px) - 24px);
    overflow: visible;
  }

  .ids-anchor-menu--sticky .ids-anchor-menu-header {
    flex: 0 0 auto;
  }

  .ids-anchor-menu--sticky .ids-anchor-menu-list {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 0 0 0 5px;
    margin: 0 0 0 -5px;
  }

  /* IDS small scrollbar — Figma Storybook-Test 6191:59167 */
  .ids-anchor-menu--sticky .ids-anchor-menu-list::-webkit-scrollbar {
    width: var(--sizing-size-8);
    background: var(--color-background-gray-neutral-light);
    border-radius: var(--corner-radius-radius-2);
  }

  .ids-anchor-menu--sticky .ids-anchor-menu-list::-webkit-scrollbar-track {
    background: var(--color-background-gray-neutral-light);
    border-radius: var(--corner-radius-radius-2);
  }

  .ids-anchor-menu--sticky .ids-anchor-menu-list::-webkit-scrollbar-thumb {
    background: var(--color-border-gray-neutral-base);
    background-clip: padding-box;
    border: 1px solid transparent;
    border-radius: var(--corner-radius-radius-8);
  }

  .ids-anchor-menu--sticky
    .ids-anchor-menu-list::-webkit-scrollbar-button:vertical {
    display: block;
    width: var(--sizing-size-8);
    height: 10px;
    background-color: var(--color-background-gray-neutral-light);
    background-repeat: no-repeat;
    background-size: 3px 3px, 3px 3px;
  }

  .ids-anchor-menu--sticky
    .ids-anchor-menu-list::-webkit-scrollbar-button:vertical:start:decrement {
    border-radius: var(--corner-radius-radius-2) var(--corner-radius-radius-2) 0
      0;
    background-image:
      linear-gradient(
        to top left,
        var(--color-border-gray-neutral-base) 50%,
        transparent 50%
      ),
      linear-gradient(
        to top right,
        var(--color-border-gray-neutral-base) 50%,
        transparent 50%
      );
    background-position:
      1px 4px,
      4px 4px;
  }

  .ids-anchor-menu--sticky
    .ids-anchor-menu-list::-webkit-scrollbar-button:vertical:end:increment {
    border-radius: 0 0 var(--corner-radius-radius-2)
      var(--corner-radius-radius-2);
    background-image:
      linear-gradient(
        to bottom left,
        var(--color-border-gray-neutral-base) 50%,
        transparent 50%
      ),
      linear-gradient(
        to bottom right,
        var(--color-border-gray-neutral-base) 50%,
        transparent 50%
      );
    background-position:
      1px 3px,
      4px 3px;
  }

  .ids-anchor-menu--sticky
    .ids-anchor-menu-list::-webkit-scrollbar-button:vertical:start:increment,
  .ids-anchor-menu--sticky
    .ids-anchor-menu-list::-webkit-scrollbar-button:vertical:end:decrement {
    display: none;
  }

  .ids-anchor-menu-header {
    display: block;
    box-sizing: border-box;
    max-width: 100%;
    margin: 0;
    padding: var(--padding-padding-12) 0;
    font-size: var(--font-size-body-1);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-24);
    color: var(--color-text-gray-neutral-strong);
    text-transform: none;
    letter-spacing: normal;
  }

  .ids-anchor-menu-header-label {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    overflow-wrap: break-word;
  }

  .ids-anchor-menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ids-anchor-menu-item {
    display: flex;
    margin: 0;
    padding: 0;
  }

  .ids-anchor-menu-link {
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    width: fit-content;
    max-width: 100%;
    min-height: var(--scale-40);
    margin: 0;
    padding: var(--padding-padding-8) var(--padding-padding-24);
    border: none;
    border-left: 1.2px solid var(--color-border-gray-neutral-base);
    border-radius: 0;
    background: transparent;
    color: var(--color-text-gray-neutral);
    font-family: inherit;
    font-size: var(--font-size-body-1);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-24);
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    outline: none;
    transition:
      color 150ms ease,
      border-color 150ms ease;
  }

  .ids-anchor-menu-link:hover:not([aria-disabled="true"]) {
    color: var(--color-text-gray-neutral);
  }

  .ids-anchor-menu-link:hover:not([aria-disabled="true"])::before,
  .ids-anchor-menu-link[aria-current="page"]::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: -2px;
    width: 4px;
    background: var(--color-border-brand-base);
    pointer-events: none;
  }

  .ids-anchor-menu-link[aria-current="page"] {
    color: var(--color-text-brand-strong);
    border-left-color: var(--color-border-brand-base);
  }

  .ids-anchor-menu-link[aria-current="page"]:hover:not([aria-disabled="true"]) {
    color: var(--color-text-brand-strong);
  }

  .ids-anchor-menu-link[aria-current="page"]:hover:not(
      [aria-disabled="true"]
    )::before {
    background: var(--color-border-brand-strong);
  }

  .ids-anchor-menu-link:focus-visible {
    outline: none;
  }

  .ids-anchor-menu-link:focus-visible::after {
    content: "";
    position: absolute;
    inset: 0 var(--padding-padding-4);
    border: var(--border-width-border-2) solid var(--color-border-brand-base);
    border-radius: var(--corner-radius-radius-4);
    pointer-events: none;
  }

  .ids-anchor-menu-link[aria-disabled="true"] {
    cursor: not-allowed;
    pointer-events: none;
  }

  .ids-anchor-menu-label {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    overflow-wrap: break-word;
  }

  /* Keep tooltip triggers out of the tab order; the link is the focusable. */
  .ids-anchor-menu ids-tooltip-trigger {
    outline: none;
  }
`;
