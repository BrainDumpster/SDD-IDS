/**
 * IDS Toast styles — from `components/ids/toast/design-spec.md`
 * (React `IdsToast.module.css` token/layout parity; Figma `42903:139523` / `42903:139528`).
 */
import { css } from "lit";

export const toastItemStyles = css`
  :host {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-space-32);
    box-sizing: border-box;
    width: fit-content;
    max-width: min(900px, 100%);
    min-height: 48px;
    padding: var(--padding-padding-14) var(--padding-padding-16)
      var(--padding-padding-14) var(--padding-padding-24);
    background: var(--color-static-gray-900);
    box-shadow: inset 0 0 0 var(--border-width-border-1)
      var(--color-border-gray-white);
    border-radius: var(--toast-control-radius);
    color: var(--color-static-gray-white);
    font-family: inherit;
  }

  :host([hidden]) {
    display: none;
  }

  :host([data-type="info"]) {
    --ids-toast-status-icon-color: var(--color-icon-alerting-info-base);
  }

  :host([data-type="critical"]) {
    --ids-toast-status-icon-color: var(--color-icon-alerting-critical-base);
  }

  :host([data-type="major-warning"]) {
    --ids-toast-status-icon-color: var(--color-icon-alerting-major-base);
  }

  :host([data-type="minor-warning"]) {
    --ids-toast-status-icon-color: var(--color-icon-alerting-minor-base);
  }

  :host([data-type="success"]) {
    --ids-toast-status-icon-color: var(--color-icon-alerting-success-base);
  }

  .ids-toast-content {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-space-8);
    flex: 1 1 auto;
    min-width: 0;
    padding-top: var(--padding-padding-2);
  }

  .ids-toast-icon-container {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-block: var(--padding-padding-2);
    color: var(--ids-toast-status-icon-color);
  }

  .ids-toast-status-icon {
    width: var(--scale-16);
    height: var(--scale-16);
    display: block;
    object-fit: contain;
  }

  .ids-toast-message {
    margin: 0;
    flex: 1 1 auto;
    min-width: 0;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-family: var(--typography-font-style-primary), sans-serif;
    font-size: var(--font-size-body-2);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-static-gray-white);
  }

  .ids-toast-action-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-space-4);
    flex-shrink: 0;
  }

  /* View Details — toast chrome on dark surface (design-spec / React overrides). */
  .ids-toast-view-details,
  .ids-toast-view-details-anchor {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--scale-24, 24px);
    padding: var(--padding-padding-2) var(--padding-padding-16);
    font-family: var(--typography-font-style-primary), sans-serif;
    font-size: var(--font-size-body-2);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-white);
    text-decoration: none;
    background: transparent;
    border: none;
    border-radius: var(--button-control-radius, var(--corner-radius-radius-none));
    cursor: pointer;
  }

  .ids-toast-view-details:hover,
  .ids-toast-view-details-anchor:hover {
    background: var(--ui-palette-brand-900);
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--ui-palette-brand-400);
  }

  .ids-toast-view-details:active,
  .ids-toast-view-details-anchor:active {
    background: var(--ui-palette-brand-800);
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--ui-palette-brand-400);
  }

  .ids-toast-view-details:focus-visible,
  .ids-toast-view-details-anchor:focus-visible {
    outline: var(--border-width-border-1) solid
      var(--color-border-controls-base, var(--ui-palette-brand-400));
    outline-offset: 2px;
  }

  /* Close — tertiary icon-only 24×24, padding-6, shape-x 12×12. */
  .ids-toast-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--sizing-size-24);
    height: var(--sizing-size-24);
    min-height: var(--sizing-size-24);
    min-width: var(--sizing-size-24);
    padding: var(--padding-padding-6);
    margin: 0;
    color: var(--color-icon-gray-white);
    background: transparent;
    border: none;
    border-radius: var(--button-control-radius, var(--corner-radius-radius-none));
    cursor: pointer;
  }

  .ids-toast-close:hover {
    background: var(--ui-palette-brand-900);
    color: var(--color-icon-gray-white);
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--ui-palette-brand-400);
  }

  .ids-toast-close:active {
    background: var(--ui-palette-brand-800);
    color: var(--color-icon-gray-white);
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--ui-palette-brand-400);
  }

  .ids-toast-close:focus-visible {
    outline: var(--border-width-border-1) solid
      var(--color-border-controls-base, var(--ui-palette-brand-400));
    outline-offset: 2px;
  }

  .ids-toast-close-icon {
    width: 12px;
    height: 12px;
    display: block;
  }
`;

export const toastViewportStyles = css`
  :host {
    position: fixed;
    z-index: 1100;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-space-8);
    width: fit-content;
    max-width: calc(100vw - 32px);
    outline: none;
    pointer-events: none;
  }

  :host([data-position$="-left"]) {
    align-items: flex-start;
  }

  :host([data-position$="-center"]) {
    align-items: center;
  }

  :host([data-position$="-right"]) {
    align-items: flex-end;
  }

  :host([data-position="top-left"]) {
    top: var(--padding-padding-16);
    left: var(--padding-padding-16);
  }

  :host([data-position="top-center"]) {
    top: var(--padding-padding-16);
    left: 50%;
    transform: translateX(-50%);
  }

  :host([data-position="top-right"]) {
    top: var(--padding-padding-16);
    right: var(--padding-padding-16);
  }

  :host([data-position="bottom-left"]) {
    bottom: var(--padding-padding-16);
    left: var(--padding-padding-16);
  }

  :host([data-position="bottom-center"]) {
    bottom: var(--padding-padding-16);
    left: 50%;
    transform: translateX(-50%);
  }

  :host([data-position="bottom-right"]) {
    bottom: var(--padding-padding-16);
    right: var(--padding-padding-16);
  }

  :host([data-position^="top-"]) {
    flex-direction: column;
  }

  :host([data-position^="bottom-"]) {
    flex-direction: column-reverse;
  }

  ::slotted(*),
  ids-toast-item {
    pointer-events: auto;
  }
`;
