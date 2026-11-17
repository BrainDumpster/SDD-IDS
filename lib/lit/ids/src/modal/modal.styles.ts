/**
 * IDS Modal styles — from `components/ids/modal/design-spec.md`
 * + React `IdsModal.module.css`.
 * Theme: `components/ids-theme.css` (host app / Storybook preview).
 *
 * Live Figma (MCP 2026-11-13): Modal-Main `11348:63064`, Overlay `11348:63172`,
 * ModalDialog-Main `11349:116221` / Non-Alerting `40191:26351`.
 */
import { css } from "lit";

export const modalHostStyles = css`
  :host {
    display: none;
  }

  :host([data-open]) {
    display: block;
  }
`;

export const modalStyles = css`
  .ids-modal-overlay {
    position: fixed;
    inset: 0;
    /* Figma Modal-Element-Overlay: --color-background-surface-overlay (#252525a6). */
    background: var(--color-background-surface-overlay);
    z-index: 1000;
  }

  .ids-modal-surface {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-height: min(85vh, calc(100vh - 48px));
    max-width: calc(100vw - 48px);
    outline: none;
    z-index: 1001;
    overflow: hidden;
    background: var(--color-background-surface-component);
    border: var(--border-width-border-1) solid
      var(--color-border-gray-neutral-base);
    border-radius: var(--corner-radius-radius-none, 0px);
    box-shadow:
      var(--shadow-drop-shadow-2-x) var(--shadow-drop-shadow-2-y)
        var(--shadow-drop-shadow-2-blur) var(--shadow-drop-shadow-2-spread)
        var(--shadow-drop-shadow-2-color),
      var(--shadow-drop-shadow-4-x) var(--shadow-drop-shadow-4-y)
        var(--shadow-drop-shadow-4-blur) var(--shadow-drop-shadow-4-spread)
        var(--shadow-drop-shadow-4-color),
      var(--shadow-drop-shadow-8-x) var(--shadow-drop-shadow-8-y)
        var(--shadow-drop-shadow-8-blur) var(--shadow-drop-shadow-8-spread)
        var(--shadow-drop-shadow-8-color),
      var(--shadow-drop-shadow-16-x) var(--shadow-drop-shadow-16-y)
        var(--shadow-drop-shadow-16-blur) var(--shadow-drop-shadow-16-spread)
        var(--shadow-drop-shadow-16-color);
  }

  /* Dialog (Figma ModalDialog-Main): fixed 640px, height follows content. */
  .ids-modal-surface--dialog {
    width: 640px;
  }

  /* Single-page / multi-page: Shadow 4 elevation. */
  .ids-modal-surface--page {
    box-shadow:
      var(--shadow-shadow-4-drop-shadow-32-x, var(--shadow-drop-shadow-32-x))
        var(--shadow-shadow-4-drop-shadow-32-y, var(--shadow-drop-shadow-32-y))
        var(
          --shadow-shadow-4-drop-shadow-32-blur,
          var(--shadow-drop-shadow-32-blur)
        )
        var(
          --shadow-shadow-4-drop-shadow-32-spread,
          var(--shadow-drop-shadow-32-spread)
        )
        var(--shadow-drop-shadow-32-color),
      var(--shadow-shadow-4-drop-shadow-16-x, var(--shadow-drop-shadow-16-x))
        var(--shadow-shadow-4-drop-shadow-16-y, var(--shadow-drop-shadow-16-y))
        var(
          --shadow-shadow-4-drop-shadow-16-blur,
          var(--shadow-drop-shadow-16-blur)
        )
        var(
          --shadow-shadow-4-drop-shadow-16-spread,
          var(--shadow-drop-shadow-16-spread)
        )
        var(--shadow-drop-shadow-16-color),
      var(--shadow-shadow-4-drop-shadow-8-x, var(--shadow-drop-shadow-8-x))
        var(--shadow-shadow-4-drop-shadow-8-y, var(--shadow-drop-shadow-8-y))
        var(
          --shadow-shadow-4-drop-shadow-8-blur,
          var(--shadow-drop-shadow-8-blur)
        )
        var(
          --shadow-shadow-4-drop-shadow-8-spread,
          var(--shadow-drop-shadow-8-spread)
        )
        var(--shadow-drop-shadow-8-color),
      var(--shadow-shadow-4-drop-shadow-4-x, var(--shadow-drop-shadow-4-x))
        var(--shadow-shadow-4-drop-shadow-4-y, var(--shadow-drop-shadow-4-y))
        var(
          --shadow-shadow-4-drop-shadow-4-blur,
          var(--shadow-drop-shadow-4-blur)
        )
        var(
          --shadow-shadow-4-drop-shadow-4-spread,
          var(--shadow-drop-shadow-4-spread)
        )
        var(--shadow-drop-shadow-4-color);
  }

  .ids-modal-surface--x-small {
    width: 640px;
  }

  .ids-modal-surface--small {
    width: 960px;
  }

  .ids-modal-surface--medium {
    width: 1280px;
  }

  .ids-modal-surface--large {
    width: 1600px;
  }

  .ids-modal-surface--page.ids-modal-surface--x-small {
    height: 328px;
  }

  .ids-modal-surface--page.ids-modal-surface--small {
    height: 497px;
  }

  .ids-modal-surface--page.ids-modal-surface--medium {
    height: 667px;
  }

  .ids-modal-surface--page.ids-modal-surface--large {
    height: 826px;
  }

  .ids-modal-surface--full-screen {
    width: calc(100vw - 48px);
    height: calc(100vh - 48px);
    max-height: calc(100vh - 48px);
  }

  .ids-modal-overlay--carousel {
    z-index: 1002;
  }

  .ids-modal-surface--carousel {
    z-index: 1003;
  }

  .ids-modal-overlay--single-preview {
    z-index: 1004;
  }

  .ids-modal-surface--single-preview {
    z-index: 1005;
  }

  .ids-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-space-8);
    padding: var(--padding-padding-24) var(--padding-padding-24)
      var(--padding-padding-8);
    flex-shrink: 0;
  }

  .ids-modal-surface--page .ids-modal-header {
    box-sizing: border-box;
    min-height: calc(
      var(--padding-padding-24) + var(--scale-40) + var(--padding-padding-4)
    );
    padding-bottom: var(--padding-padding-4);
  }

  .ids-modal-header-left {
    display: flex;
    align-items: center;
    gap: var(--padding-padding-16);
    min-width: 0;
  }

  .ids-modal-severity-icon {
    display: inline-flex;
    width: 24px;
    height: 24px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ids-modal-title {
    margin: 0;
    font-size: var(--font-size-header-5);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-32);
    color: var(--color-text-gray-neutral-strong);
    min-width: 0;
  }

  .ids-modal-header-controls {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-8);
    flex-shrink: 0;
  }

  .ids-modal-description {
    margin: 0;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral);
  }

  .ids-modal-description--non-alerting,
  .ids-modal-description--informational {
    padding: var(--padding-padding-16) var(--padding-padding-24)
      var(--padding-padding-24);
  }

  .ids-modal-description--warning,
  .ids-modal-description--major,
  .ids-modal-description--critical,
  .ids-modal-description--destructive {
    padding: var(--padding-padding-8) var(--padding-padding-24);
  }

  .ids-modal-surface--page .ids-modal-description {
    padding: var(--padding-padding-8) var(--padding-padding-24);
  }

  .ids-modal-tabs {
    padding: var(--padding-padding-8) var(--padding-padding-24);
    flex-shrink: 0;
  }

  .ids-modal-tabs [role="tabpanel"] {
    display: none;
  }

  .ids-modal-content {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral-strong);
    padding: 0 var(--padding-padding-24) var(--padding-padding-24);
  }

  .ids-modal-surface--page .ids-modal-content {
    padding-top: var(--padding-padding-16);
    overflow-y: auto;
  }

  .ids-modal-content--warning,
  .ids-modal-content--major,
  .ids-modal-content--critical,
  .ids-modal-content--destructive {
    padding: var(--padding-padding-16) var(--padding-padding-24) 0;
  }

  .ids-modal-content--scroll {
    overflow-y: auto;
  }

  .ids-modal-content--scroll,
  .ids-modal-surface--page .ids-modal-content {
    scrollbar-width: thin;
    scrollbar-color: var(--color-background-gray-base)
      var(--color-background-gray-lighter);
  }

  .ids-modal-content--scroll::-webkit-scrollbar,
  .ids-modal-surface--page .ids-modal-content::-webkit-scrollbar {
    width: 14px;
  }

  .ids-modal-content--scroll::-webkit-scrollbar-track,
  .ids-modal-surface--page .ids-modal-content::-webkit-scrollbar-track {
    background: var(--color-background-gray-lighter);
  }

  .ids-modal-content--scroll::-webkit-scrollbar-thumb,
  .ids-modal-surface--page .ids-modal-content::-webkit-scrollbar-thumb {
    background: var(--color-background-gray-base);
    background-clip: padding-box;
    border: var(--border-width-border-2) solid transparent;
    border-radius: var(--corner-radius-radius-8);
  }

  .ids-modal-content-scroll-shadow {
    position: relative;
    z-index: 1;
    height: 19px;
    margin-top: -19px;
    pointer-events: none;
    flex-shrink: 0;
    background: linear-gradient(
      180deg,
      var(--color-gradient-overflow-vertical-end, rgba(255, 255, 255, 0)) 0%,
      var(--color-gradient-overflow-vertical-start, rgba(182, 182, 182, 0.4))
        100%
    );
  }

  .ids-modal-footer {
    padding: var(--padding-padding-24);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-space-16);
    flex-shrink: 0;
  }

  .ids-modal-surface--page .ids-modal-footer {
    border-top: var(--border-width-border-1) solid
      var(--color-border-gray-neutral-base);
  }

  .ids-modal-footer-start {
    margin-right: auto;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .ids-modal-footer-checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-8);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral);
    cursor: pointer;
  }

  .ids-modal-footer-checkbox input {
    margin: 0;
  }

  .ids-modal-footer-actions {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-12);
  }

  .ids-modal-empty {
    margin: 0;
    padding: var(--padding-padding-16) var(--padding-padding-24);
    font-size: var(--font-size-body-2);
    color: var(--color-text-gray-neutral);
  }
`;

/** Part host styles (light-DOM composition children). */
export const modalHeaderStyles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-space-8);
    padding: var(--padding-padding-24) var(--padding-padding-24)
      var(--padding-padding-8);
    flex-shrink: 0;
    box-sizing: border-box;
  }

  :host([data-page]) {
    min-height: calc(
      var(--padding-padding-24) + var(--scale-40) + var(--padding-padding-4)
    );
    padding-bottom: var(--padding-padding-4);
  }

  .ids-modal-header-left {
    display: flex;
    align-items: center;
    gap: var(--padding-padding-16);
    min-width: 0;
  }

  .ids-modal-severity-icon {
    display: inline-flex;
    width: 24px;
    height: 24px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ids-modal-header-controls {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-8);
    flex-shrink: 0;
  }
`;

export const modalTitleStyles = css`
  :host {
    display: block;
    margin: 0;
    font-size: var(--font-size-header-5);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-32);
    color: var(--color-text-gray-neutral-strong);
    min-width: 0;
  }
`;

export const modalDescriptionStyles = css`
  :host {
    display: block;
    margin: 0;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral);
  }

  :host([data-type="non-alerting"]),
  :host([data-type="informational"]) {
    padding: var(--padding-padding-16) var(--padding-padding-24)
      var(--padding-padding-24);
  }

  :host([data-type="warning"]),
  :host([data-type="major"]),
  :host([data-type="critical"]),
  :host([data-type="destructive"]) {
    padding: var(--padding-padding-8) var(--padding-padding-24);
  }

  :host([data-page]) {
    padding: var(--padding-padding-8) var(--padding-padding-24);
  }
`;

export const modalTabsStyles = css`
  :host {
    display: block;
    padding: var(--padding-padding-8) var(--padding-padding-24);
    flex-shrink: 0;
  }

  :host ::slotted([role="tabpanel"]),
  [role="tabpanel"] {
    display: none;
  }
`;

export const modalContentStyles = css`
  :host {
    display: block;
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral-strong);
    padding: 0 var(--padding-padding-24) var(--padding-padding-24);
    box-sizing: border-box;
  }

  :host([data-page]) {
    padding-top: var(--padding-padding-16);
    overflow-y: auto;
  }

  :host([data-alerting]) {
    padding: var(--padding-padding-16) var(--padding-padding-24) 0;
  }

  :host([data-scroll]),
  :host([data-page]) {
    scrollbar-width: thin;
    scrollbar-color: var(--color-background-gray-base)
      var(--color-background-gray-lighter);
  }

  :host([data-scroll]) {
    overflow-y: auto;
  }
`;

export const modalFooterStyles = css`
  :host {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-space-16);
    padding: var(--padding-padding-24);
    flex-shrink: 0;
    box-sizing: border-box;
  }

  :host([data-page]) {
    border-top: var(--border-width-border-1) solid
      var(--color-border-gray-neutral-base);
  }
`;
