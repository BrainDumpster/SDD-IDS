import { css } from "lit";

/**
 * IDS Detail Panel styles — from `lib/react/ids/detail-panel/IdsDetailPanel.module.css`
 * + design-spec Layout & Measurements.
 */
export const detailPanelRootStyles = css`
  :host {
    box-sizing: border-box;
    height: 100%;
    border: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    background: var(--color-background-surface-component);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  :host([data-auto-width="true"]:not([data-detached="true"])) {
    width: fit-content;
    min-width: 240px;
    max-width: 480px;
  }

  :host([data-detached="true"]) {
    position: fixed;
    z-index: 1000;
    resize: both;
    min-width: 240px;
    max-width: 480px;
    min-height: 160px;
    max-height: 1280px;
    box-shadow:
      var(--shadow-drop-shadow-4-x, 0px) var(--shadow-drop-shadow-4-y, 4px)
        var(--shadow-drop-shadow-4-blur, 4px) var(--shadow-drop-shadow-4-spread, 0px)
        var(--shadow-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),
      var(--shadow-drop-shadow-8-x, 0px) var(--shadow-drop-shadow-8-y, 8px)
        var(--shadow-drop-shadow-8-blur, 8px) var(--shadow-drop-shadow-8-spread, 0px)
        var(--shadow-drop-shadow-8-color, rgba(37, 37, 37, 0.08));
  }

  :host([data-detached="true"]) ::slotted(ids-detail-panel-header),
  :host([data-detached="true"]) ids-detail-panel-content ids-detail-panel-header {
    cursor: move;
    user-select: none;
    touch-action: none;
  }
`;

export const detailPanelContentStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    height: 100%;
    overflow: hidden;
  }

  :host([hidden]) {
    display: none !important;
  }
`;

export const detailPanelHeaderStyles = css`
  :host {
    display: contents;
  }

  .ids-detail-panel-header {
    box-sizing: border-box;
    min-height: 48px;
    padding: var(--spacing-space-14, 14px) var(--padding-padding-12, 12px)
      var(--spacing-space-14, 14px) var(--padding-padding-24, 24px);
    border-bottom: var(--border-width-border-1) solid
      var(--color-border-gray-neutral-base);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-space-16, 16px);
    background: var(--color-background-surface-component);
    flex-shrink: 0;
  }

  .ids-detail-panel-title {
    margin: 0;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 500;
    color: var(--color-text-gray-neutral-strong);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .ids-detail-panel-controls {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-space-16, 16px);
    flex-shrink: 0;
  }
`;

export const detailPanelTitleStyles = css`
  :host {
    display: contents;
  }
`;

export const detailPanelBodyStyles = css`
  :host {
    display: contents;
  }

  .ids-detail-panel-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-space-8, 8px);
    background: var(--color-background-surface-component);
  }

  .ids-detail-panel-body--page {
    padding-top: var(--padding-padding-16, 16px);
  }
`;

export const detailPanelFooterStyles = css`
  :host {
    display: contents;
  }

  .ids-detail-panel-footer {
    box-sizing: border-box;
    min-height: 44px;
    padding: var(--spacing-space-14, 14px) var(--padding-padding-12, 12px);
    border-top: var(--border-width-border-1) solid
      var(--color-border-gray-neutral-base);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: var(--color-background-surface-component);
    flex-shrink: 0;
  }

  .ids-detail-panel-controls {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-space-16, 16px);
    flex-shrink: 0;
  }
`;

export const detailPanelCollapsedRailStyles = css`
  :host {
    display: block;
    height: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  .ids-detail-panel-collapsed-rail {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    background: var(--color-background-surface-component);
  }

  .ids-detail-panel-collapsed-rail--datagrid {
    align-items: flex-start;
    justify-content: flex-end;
    padding: var(--spacing-space-16, 16px) var(--padding-padding-12, 12px);
  }

  .ids-detail-panel-collapsed-rail--page {
    align-items: flex-end;
    justify-content: center;
    padding: var(--padding-padding-12, 12px);
  }

  .ids-detail-panel-controls {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-space-16, 16px);
    flex-shrink: 0;
  }
`;

export const detailPanelToggleStyles = css`
  :host {
    display: contents;
  }

  .ids-detail-panel-toggle {
    border: 0;
    background: transparent;
    color: var(--color-icon-gray-neutral-base);
    padding: 0;
    width: 16px;
    height: 16px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ids-detail-panel-toggle:focus-visible {
    outline: var(--border-width-border-2) solid var(--color-border-brand-base);
    outline-offset: 2px;
  }
`;

export const detailPanelSectionStyles = css`
  :host {
    display: block;
    flex-shrink: 0;
  }

  :host(:not(:first-of-type)) {
    border-top: var(--border-width-border-1) solid
      var(--color-border-gray-neutral-light);
  }

  .ids-detail-panel-section-header {
    margin: 0;
    min-height: 40px;
    box-sizing: border-box;
    padding: var(--padding-padding-10, 10px) var(--padding-padding-12, 12px)
      var(--padding-padding-10, 10px) var(--padding-padding-24, 24px);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 500;
    color: var(--color-text-gray-neutral-strong);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ids-detail-panel-fields {
    margin: 0;
    display: flex;
    flex-direction: column;
  }
`;

export const detailPanelFieldStyles = css`
  /* Each field is its own 2-column row (shadow-safe; matches Figma key/value). */
  :host {
    display: grid;
    grid-template-columns: fit-content(50%) minmax(0, 1fr);
  }

  .ids-detail-panel-field-label,
  .ids-detail-panel-field-value {
    margin: 0;
    min-height: 40px;
    box-sizing: border-box;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
    overflow-wrap: anywhere;
  }

  .ids-detail-panel-field-label {
    min-width: 72px;
    padding: var(--padding-padding-10, 10px) var(--padding-padding-12, 12px)
      var(--padding-padding-10, 10px) var(--padding-padding-24, 24px);
    color: var(--color-text-gray-neutral-strong);
  }

  .ids-detail-panel-field-value {
    padding: var(--padding-padding-10, 10px) var(--padding-padding-12, 12px)
      var(--padding-padding-10, 10px) var(--padding-padding-16, 16px);
    color: var(--color-text-gray-neutral);
  }
`;

export const detailPanelBlockStyles = css`
  :host {
    display: flex;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: var(--padding-padding-24, 24px);
    flex-direction: column;
    gap: var(--spacing-space-8, 8px);
  }
`;
