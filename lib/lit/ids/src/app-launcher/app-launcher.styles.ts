/**
 * IDS App Launcher styles — from `components/ids/app-launcher/design-spec.md`
 * (React `IdsAppLauncher.module.css` token/geometry parity).
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, MCP session 2026-11-10):
 *   usage products+options `42266:95081`
 *   4 products `13231:123908` — 298×254
 *   2 products `13231:124200` — 298×127
 *   tile default `13231:109520` — surface-secondary / icon+text strong
 */
import { css } from "lit";

/** Host (shadow) + shared class rules used when surface is `panelOnly`. */
export const appLauncherHostStyles = css`
  :host {
    display: inline-flex;
    position: relative;
    max-width: 100%;
    box-sizing: border-box;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
  }

  :host([hidden]) {
    display: none !important;
  }

  .ids-app-launcher {
    display: inline-flex;
    position: relative;
    max-width: 100%;
    box-sizing: border-box;
  }

  .ids-app-launcher-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: var(--border-width-border-1) solid var(--color-border-gray-neutral-light);
    border-radius: var(--corner-radius-radius-4);
    background: var(--color-background-surface-component);
    color: var(--color-text-gray-neutral-strong);
    cursor: pointer;
    transition: background 150ms ease;
  }

  .ids-app-launcher-trigger:hover {
    background: var(--color-background-gray-lighter);
  }

  .ids-app-launcher-trigger:focus-visible {
    outline: var(--border-width-border-2) solid var(--color-border-brand-base);
    outline-offset: 2px;
  }

  .ids-app-launcher-trigger-icon {
    display: block;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    line-height: 0;
  }

  .ids-app-launcher-trigger--masthead {
    width: auto;
    height: auto;
    padding-top: 19px;
    padding-right: var(--padding-padding-16);
    padding-bottom: 19px;
    padding-left: var(--padding-padding-16);
    border: none;
    border-radius: 0;
    background: var(--color-background-masthead-base);
    color: var(--color-icon-gray-white);
  }

  .ids-app-launcher-trigger--masthead:hover {
    background: var(--color-background-masthead-strong);
  }

  .ids-app-launcher-trigger--masthead:active {
    background: var(--color-background-masthead-stronger);
  }

  .ids-app-launcher-trigger--masthead[data-state="open"],
  .ids-app-launcher-trigger--masthead[aria-expanded="true"] {
    background: var(--color-background-masthead-stronger);
  }

  .ids-app-launcher-trigger--masthead[data-state="open"]:hover,
  .ids-app-launcher-trigger--masthead[aria-expanded="true"]:hover {
    background: var(--color-background-masthead-strong);
  }

  .ids-app-launcher-trigger--masthead[data-state="open"]:active,
  .ids-app-launcher-trigger--masthead[aria-expanded="true"]:active {
    background: var(--color-background-masthead-stronger);
  }

  .ids-app-launcher-trigger--masthead:focus-visible {
    outline: var(--border-width-border-1) dashed var(--color-border-gray-white);
    outline-offset: -1px;
  }

  .ids-app-launcher-measure {
    position: absolute;
    left: -9999px;
    top: 0;
    width: 111px;
    pointer-events: none;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
  }

  .ids-app-launcher-measure-label {
    display: block;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
    white-space: normal;
    overflow-wrap: break-word;
    word-break: break-word;
    text-align: center;
  }
`;

/**
 * Surface / tile / options rules — applied in shadow (`panelOnly`) and adopted
 * onto `document` for the body-portaled popup (React portal parity).
 */
export const appLauncherSurfaceStyles = css`
  .ids-app-launcher-popup {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    box-shadow: none;
    z-index: 1000;
  }

  .ids-app-launcher-surface {
    --app-launcher-divider-inset: var(--padding-padding-16);
    --app-launcher-row-divider-width: 262px;
    --app-launcher-tile-height: 125px;
    --app-launcher-column-divider-height: 110px;
    --app-launcher-column-divider-inset-block: 7px;
    --app-launcher-column-divider-color: var(--color-border-gray-neutral-base);
    box-sizing: border-box;
    background: var(--color-background-surface-secondary);
    border: none;
    border-radius: 0;
    padding: var(--padding-padding-1);
    box-shadow:
      inset 0 0 0 var(--border-width-border-1) var(--color-border-gray-neutral-base),
      var(--shadow-drop-shadow-2-x) var(--shadow-drop-shadow-2-y) var(--shadow-drop-shadow-2-blur)
        var(--shadow-drop-shadow-2-spread) var(--shadow-drop-shadow-2-color),
      var(--shadow-shadow-4-drop-shadow-4-x) var(--shadow-shadow-4-drop-shadow-4-y)
        var(--shadow-shadow-4-drop-shadow-4-blur) var(--shadow-shadow-4-drop-shadow-4-spread)
        var(--shadow-shadow-4-drop-shadow-4-color);
    width: 298px;
    max-width: calc(100vw - 24px);
    position: relative;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
  }

  .ids-app-launcher-surface--two-product {
    padding: var(--padding-padding-1);
  }

  .ids-app-launcher-surface--single-product {
    width: 150px;
  }

  .ids-app-launcher-product-region {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-block: 0;
    width: 100%;
  }

  .ids-app-launcher-product-row-group {
    width: 100%;
  }

  .ids-app-launcher-product-row {
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }

  .ids-app-launcher-product-row--single {
    justify-content: center;
  }

  .ids-app-launcher-product-row--single .ids-app-launcher-product-tile {
    width: 100%;
  }

  .ids-app-launcher-column-divider {
    flex: 0 0 1px;
    width: 1px;
    align-self: stretch;
    min-height: var(--app-launcher-tile-height);
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    position: relative;
    pointer-events: none;
  }

  .ids-app-launcher-column-divider--dotted::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: var(--app-launcher-column-divider-inset-block);
    height: var(--app-launcher-column-divider-height);
    border-inline-start: var(--border-width-border-1) dashed
      var(--app-launcher-column-divider-color);
  }

  .ids-app-launcher-column-divider--solid::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    inset-block: 0;
    width: 0;
    border-inline-start: var(--border-width-border-1) solid
      var(--app-launcher-column-divider-color);
  }

  .ids-app-launcher-row-divider {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-inline: var(--app-launcher-divider-inset);
    flex-shrink: 0;
    margin: 0;
    border: none;
    pointer-events: none;
  }

  .ids-app-launcher-row-divider::before {
    content: "";
    width: var(--app-launcher-row-divider-width);
    height: 0;
    flex-shrink: 0;
    border-top: var(--border-width-border-1) dashed var(--app-launcher-column-divider-color);
  }

  .ids-app-launcher-product-tile {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 148px;
    min-height: 125px;
    padding: 0;
    border: none;
    border-radius: 0;
    appearance: none;
    -webkit-appearance: none;
    background: var(--color-background-surface-secondary);
    cursor: pointer;
    text-decoration: none;
    transition: background 150ms ease, color 150ms ease;
    font-family: inherit;
    color: var(--color-icon-gray-neutral-strong);
    position: relative;
  }

  .ids-app-launcher-product-tile:hover:not([data-state="press"]),
  .ids-app-launcher-product-tile[data-state="hover"] {
    background: var(--color-background-brand-lighter-slate);
    color: var(--color-icon-gray-neutral-strong);
  }

  .ids-app-launcher-product-tile:active,
  .ids-app-launcher-product-tile[data-state="press"] {
    background: var(--color-background-brand-light-slate);
    color: var(--color-icon-brand-strong);
  }

  .ids-app-launcher-product-tile:active .ids-app-launcher-product-label,
  .ids-app-launcher-product-tile[data-state="press"] .ids-app-launcher-product-label {
    color: var(--color-text-brand-strong);
  }

  .ids-app-launcher-product-tile:active .ids-app-launcher-product-icon,
  .ids-app-launcher-product-tile[data-state="press"] .ids-app-launcher-product-icon {
    color: var(--color-icon-brand-strong);
  }

  .ids-app-launcher-product-tile:focus-visible,
  .ids-app-launcher-product-tile[data-state="focus"] {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: -1px;
    border-radius: var(--corner-radius-radius-4);
  }

  .ids-app-launcher-product-tile--two-product {
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
  }

  .ids-app-launcher-product-tile--two-product .ids-app-launcher-label-cluster {
    flex: 1 1 auto;
    width: 147px;
    min-width: 0;
  }

  .ids-app-launcher-tile-divider-rail {
    flex: 0 0 1px;
    width: 1px;
    align-self: stretch;
    position: relative;
    pointer-events: none;
  }

  .ids-app-launcher-tile-divider-rail--solid::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    inset-block: 0;
    border-inline-start: var(--border-width-border-1) solid
      var(--app-launcher-column-divider-color);
  }

  .ids-app-launcher-tile-divider-rail--dotted::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: var(--app-launcher-column-divider-inset-block);
    height: var(--app-launcher-column-divider-height);
    border-inline-start: var(--border-width-border-1) dashed
      var(--app-launcher-column-divider-color);
  }

  .ids-app-launcher-label-cluster {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-space-12);
    width: 100%;
    height: 100%;
    padding: var(--padding-padding-28) 0;
    box-sizing: border-box;
  }

  .ids-app-launcher-label-cluster--no-icon {
    gap: 0;
    padding: var(--padding-padding-28) 0;
  }

  .ids-app-launcher-product-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    overflow: hidden;
    line-height: 0;
    color: inherit;
  }

  .ids-app-launcher-product-label {
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-family: inherit;
    font-weight: 400;
    color: var(--color-text-gray-neutral-strong);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 111px;
    margin: 0;
  }

  .ids-app-launcher-label-cluster--no-icon .ids-app-launcher-product-label {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .ids-app-launcher-product-row--single .ids-app-launcher-product-label {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    overflow-wrap: break-word;
    word-break: break-word;
    max-width: 258px;
  }

  .ids-app-launcher-options-region {
    box-sizing: border-box;
    background: var(--color-background-surface-component);
    border-top: none;
    padding-inline: var(--padding-padding-1);
    padding-block-end: 0;
    overflow: hidden;
  }

  .ids-app-launcher-options-region--separator {
    position: relative;
    padding-block-start: var(--padding-padding-1);
  }

  .ids-app-launcher-options-region--separator::before {
    content: "";
    position: absolute;
    inset-inline: var(--app-launcher-divider-inset);
    inset-block-start: 0;
    border-top: var(--border-width-border-1) dashed var(--app-launcher-column-divider-color);
    pointer-events: none;
  }

  .ids-app-launcher-surface > .ids-app-launcher-options-region:first-child {
    border-top: none;
  }

  .ids-app-launcher-options-list {
    list-style: none;
    margin: 0;
    padding: var(--padding-padding-16) 0;
    --app-launcher-option-row-height: calc(
      var(--padding-padding-10) * 2 + var(--font-line-height-line-height-20)
    );
    max-height: calc(4 * var(--app-launcher-option-row-height) + var(--padding-padding-16) * 2);
    overflow-y: auto;
  }

  .ids-app-launcher-options-list:has(li:nth-child(5)) {
    max-height: calc(4 * var(--app-launcher-option-row-height) + var(--padding-padding-16));
  }

  .ids-app-launcher-option-row {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: var(--padding-padding-10) var(--padding-padding-24) var(--padding-padding-10)
      var(--padding-padding-16);
    border: none;
    appearance: none;
    -webkit-appearance: none;
    background: var(--color-background-surface-component);
    font-family: inherit;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral);
    text-align: start;
    cursor: pointer;
    transition: background 80ms ease, color 80ms ease;
  }

  .ids-app-launcher-option-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 16px;
    margin-inline-end: var(--spacing-space-8);
  }

  .ids-app-launcher-option-icon :where(svg, img, ids-icon) {
    display: block;
    width: 16px;
    height: auto;
  }

  .ids-app-launcher-option-label {
    flex: 1 1 auto;
    min-width: 0;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ids-app-launcher-option-label-trigger {
    flex: 1 1 auto;
    min-width: 0;
  }

  .ids-app-launcher-option-row:hover:not([data-state="press"]),
  .ids-app-launcher-option-row[data-state="hover"] {
    background: var(--color-background-brand-lighter-slate);
    color: var(--color-text-gray-neutral);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-app-launcher-option-row:active,
  .ids-app-launcher-option-row[data-state="press"] {
    background: var(--color-background-brand-light-slate);
    color: var(--color-text-brand-strong);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-app-launcher-option-row:focus-visible,
  .ids-app-launcher-option-row[data-state="focus"] {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: -1px;
    border-radius: var(--corner-radius-radius-4);
  }

  .ids-app-launcher-options-footer {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: var(--padding-padding-8);
    border-top: var(--border-width-border-1) solid var(--color-border-gray-neutral-light);
  }

  .ids-app-launcher-footer-action {
    all: unset;
    display: inline-flex;
    align-items: center;
    position: relative;
    padding: var(--padding-padding-2) var(--padding-padding-8);
    border-radius: var(--corner-radius-radius-2);
    color: var(--color-text-brand-strong);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
  }

  .ids-app-launcher-footer-action:hover {
    text-decoration: underline;
  }

  .ids-app-launcher-footer-action:focus-visible {
    outline: none;
  }

  .ids-app-launcher-footer-action:focus-visible::after {
    content: "";
    position: absolute;
    inset: calc(-1 * (var(--button-focus-ring-offset) + var(--border-width-border-1)));
    border: var(--border-width-border-1) solid var(--color-border-brand-base);
    border-radius: var(--button-focus-ring-radius);
    pointer-events: none;
  }

  .ids-app-launcher-surface[data-programme="synapse"] {
    --app-launcher-column-divider-color: var(
      --color-border-neutral-light,
      var(--color-border-gray-neutral-light)
    );
    gap: var(--spacing-space-1);
  }

  .ids-app-launcher-surface[data-programme="synapse"] .ids-app-launcher-product-region {
    gap: var(--spacing-space-1);
  }

  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile:hover:not([data-state="press"]),
  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile[data-state="hover"] {
    background: var(--color-background-surface-secondary);
    color: var(--color-icon-gray-neutral-strong, var(--color-icon-gray-neutral-base));
  }

  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile:hover:not([data-state="press"])
    .ids-app-launcher-label-cluster,
  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile[data-state="hover"]
    .ids-app-launcher-label-cluster {
    background: var(--color-background-brand-lighter-slate);
  }

  .ids-app-launcher-surface[data-programme="synapse"] .ids-app-launcher-product-tile:active,
  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile[data-state="press"] {
    background: var(--color-background-surface-secondary);
    color: var(--color-icon-brand-strong);
  }

  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile:active
    .ids-app-launcher-label-cluster,
  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile[data-state="press"]
    .ids-app-launcher-label-cluster {
    background: var(--color-background-brand-light-slate);
  }

  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile:active
    .ids-app-launcher-product-label,
  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile[data-state="press"]
    .ids-app-launcher-product-label {
    color: var(--color-text-brand-strong);
  }

  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile:focus-visible,
  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile[data-state="focus"] {
    outline: none;
  }

  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile:focus-visible::after,
  .ids-app-launcher-surface[data-programme="synapse"]
    .ids-app-launcher-product-tile[data-state="focus"]::after {
    content: "";
    position: absolute;
    inset: 2px 2px 2px 3px;
    border: var(--border-width-border-1) solid var(--color-border-brand-base);
    border-radius: var(--corner-radius-radius-4);
    pointer-events: none;
  }

  /* Standalone tile host (Tile State Matrix stories). */
  :host([data-ids="ids-app-launcher-product-tile-host"]) {
    display: inline-flex;
  }
`;
