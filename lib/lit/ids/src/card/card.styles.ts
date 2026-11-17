/**
 * IDS Card styles — from `components/ids/card/design-spec.md`
 * (React IdsCard.module.css + IdsCardHeaderMenu.module.css parity).
 *
 * Live Figma (2026-11-05): Card-Main `8381:14051`, primary `8381:14245`,
 * Card Content `14978:28002`, kebab trigger `15718:197453`, Text `15718:219736`.
 * Radius-none on shell; radius-2 on kebab; body fill surface-secondary.
 */
import { css } from "lit";

export const cardStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 0;
    box-sizing: border-box;
    width: 100%;
    min-width: min(100%, var(--card-min-width, 430px));
    max-width: 100%;
    background: var(--color-background-surface-secondary);
    border: var(--border-width-border-default, 1px) solid
      var(--card-border-color, var(--color-border-gray-neutral-base));
    border-radius: var(--card-control-radius, var(--corner-radius-radius-none, 0));
    font-family: inherit;
    overflow: hidden;
  }

  :host([data-card-size="span-1"]) {
    grid-column: span 1;
    min-width: min(100%, var(--card-min-width, 430px));
  }

  :host([data-card-size="span-2"]) {
    grid-column: span 2;
    min-width: min(
      100%,
      calc((2 * var(--card-min-width, 430px)) + var(--spacing-space-16, 16px))
    );
  }

  :host([data-card-size="span-3"]) {
    grid-column: span 3;
    min-width: min(
      100%,
      calc((3 * var(--card-min-width, 430px)) + (2 * var(--spacing-space-16, 16px)))
    );
  }

  @media (max-width: 991px) {
    :host([data-card-size="span-1"]),
    :host([data-card-size="span-2"]),
    :host([data-card-size="span-3"]) {
      min-width: 0;
    }
  }

  .ids-card-header,
  .ids-card-body,
  .ids-card-footer {
    box-sizing: border-box;
    width: 100%;
    background: transparent;
    border: none;
    border-radius: 0;
    flex-shrink: 0;
  }

  /* Figma Card Title \`8381:14246\` — padding 12px 8px 12px 24px.
   * When kebab shown, padding-right: 0 (trigger pr-16 is end inset).
   */
  .ids-card-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8, 8px);
    padding: var(--padding-padding-12, 12px) var(--padding-padding-8, 8px)
      var(--padding-padding-12, 12px) var(--padding-padding-24, 24px);
    min-height: 56px;
  }

  .ids-card-header[data-has-overflow-menu="true"] {
    padding-right: 0;
  }

  .ids-card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-space-8, 8px);
    min-width: 0;
    width: 100%;
  }

  .ids-card-title-cluster {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8, 8px);
    min-width: 0;
    flex: 1 1 auto;
  }

  .ids-card-header-trailing {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-16, 16px);
    flex-shrink: 0;
  }

  .ids-card-title {
    font-size: var(--font-size-header-6, 18px);
    font-weight: 400;
    color: var(--color-text-gray-neutral-strong);
    margin: 0;
    line-height: var(--font-line-height-line-height-25, 25px);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ids-card-title-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: var(--spacing-space-8, 8px);
    min-width: 0;
    flex: 1 1 auto;
    white-space: nowrap;
  }

  .ids-card-title-inline {
    margin: 0;
    font-size: var(--font-size-body-1, 16px);
    line-height: var(--font-line-height-line-height-24, 24px);
    font-weight: 400;
    color: var(--color-text-gray-neutral-strong);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .ids-card-title-divider {
    margin: 0;
    flex-shrink: 0;
    font-size: var(--font-size-body-1, 16px);
    line-height: var(--font-line-height-line-height-24, 24px);
    font-weight: 400;
    color: var(--color-text-gray-neutral-strong);
  }

  .ids-card-secondary-title {
    margin: 0;
    font-size: var(--font-size-body-1, 16px);
    line-height: var(--font-line-height-line-height-24, 24px);
    font-weight: 400;
    color: var(--color-text-gray-neutral);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ids-card-header-meta {
    margin: 0;
    flex-shrink: 0;
    font-size: var(--font-size-body-2, 14px);
    line-height: var(--font-line-height-line-height-20, 20px);
    font-weight: 400;
    color: var(--color-text-gray-neutral);
    text-align: right;
    white-space: nowrap;
  }

  /* Figma Card Content \`14978:28002\` — Border & divider contract §C */
  .ids-card-body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-space-10, 10px);
    flex: 1 1 auto;
    padding: var(--padding-padding-16, 16px) var(--padding-padding-24, 24px);
    color: var(--color-text-gray-neutral-strong);
    min-height: 0;
    background: var(--color-background-surface-secondary);
    border-top: var(--border-width-border-default, 1px) solid
      var(--card-border-color, var(--color-border-gray-neutral-base));
    border-bottom: none;
  }

  .ids-card-body--no-divider {
    border-top: none;
    border-bottom: none;
  }

  .ids-card-body--with-footer {
    border-bottom: var(--border-width-border-default, 1px) solid
      var(--card-border-color, var(--color-border-gray-neutral-base));
  }

  /* Figma Card Footer \`8381:14252\` */
  .ids-card-footer {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8, 8px);
    padding: var(--padding-padding-16, 16px) var(--padding-padding-24, 24px);
  }

  .ids-card-footer-action {
    display: inline-flex;
  }

  .ids-card-footer ::slotted([data-ids="ids-card-action"]),
  .ids-card-footer ids-button {
    --ids-card-action-color: var(--color-text-brand-strong);
  }

  /* Slot wrappers */
  .ids-card-slot-header,
  .ids-card-slot-filter,
  .ids-card-slot-footer,
  .ids-card-slot-meta {
    display: contents;
  }

  .ids-card-kebab-trigger {
    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    gap: var(--spacing-space-8, 8px);
    padding: var(--padding-padding-8, 8px) var(--padding-padding-16, 16px);
    border-radius: var(--corner-radius-radius-2, 2px);
    color: var(--color-icon-brand-base);
    cursor: pointer;
    outline: none;
  }

  .ids-card-kebab-trigger:hover {
    background: var(--color-background-brand-lighter-slate, #ebf4fb);
  }

  .ids-card-kebab-trigger:focus-visible {
    outline: var(--border-width-border-2, 2px) solid
      var(--color-border-brand-base, #0076ce);
    outline-offset: 2px;
  }

  .ids-card-kebab-trigger[aria-expanded="true"] {
    background: var(--color-background-brand-lighter-slate, #ebf4fb);
  }

  .ids-card-kebab-trigger:disabled {
    color: var(--color-icon-gray-neutral-accessible);
    cursor: not-allowed;
    background: transparent;
  }

  .ids-card-kebab-icon {
    display: block;
    pointer-events: none;
    width: 16px;
    height: 16px;
    color: var(--color-icon-brand-base);
  }
`;

/** Portaled overflow menu (escapes card \`overflow: hidden\`). */
export const cardMenuPortalStyles = css`
  .ids-card-menu-popup {
    box-sizing: border-box;
    min-width: 186px;
    max-width: none;
    margin: 0;
    padding: 0;
    list-style: none;
    background: var(--color-background-surface-component);
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base);
    border-radius: var(--dropdown-menu-radius, var(--corner-radius-radius-none, 0));
    box-shadow:
      0 4px 4px 0
        var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),
      0 2px 2px 0
        var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));
    outline: none;
    font-family: inherit;
    z-index: 1060;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .ids-card-menu-item {
    appearance: none;
    -webkit-appearance: none;
    display: flex;
    align-items: center;
    gap: var(--spacing-space-16, 16px);
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: var(--padding-padding-10, 10px) var(--padding-padding-16, 16px);
    border: none;
    background: var(--color-background-surface-component);
    text-align: left;
    font-family: inherit;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral);
    cursor: pointer;
  }

  .ids-card-menu-item:hover:not(:disabled),
  .ids-card-menu-item[data-highlighted="true"]:not(:disabled) {
    background: var(--color-background-brand-lighter-slate);
    color: var(--color-text-gray-neutral);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base),
      inset 0 -1px 0 0 var(--color-border-brand-base);
  }

  .ids-card-menu-item:active:not(:disabled) {
    background: var(--color-background-brand-light-slate);
    color: var(--color-text-brand-strong);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-card-menu-item:disabled {
    color: var(--color-text-gray-disabled);
    cursor: not-allowed;
    background: var(--color-background-gray-lighter);
    box-shadow: none;
  }

  .ids-card-menu-item-label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const cardTextContentStyles = css`
  :host {
    display: block;
    width: 100%;
    min-width: 0;
  }

  .ids-card-text-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-space-4, 4px);
    width: 100%;
    min-width: 0;
  }

  .ids-card-text-section-title {
    margin: 0;
    width: 100%;
    font-size: var(--font-size-body-1);
    line-height: var(--font-line-height-line-height-24);
    font-weight: 400;
    color: var(--color-text-gray-neutral-strong);
  }

  .ids-card-text-paragraph {
    margin: 0;
    width: 100%;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
    color: var(--color-text-gray-neutral-strong);
  }
`;

export const cardKeyValueContentStyles = css`
  :host {
    display: block;
    width: 100%;
    min-width: 0;
  }

  .ids-card-key-value-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-space-8, 8px);
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
  }

  .ids-card-key-value-row {
    display: grid;
    grid-template-columns: minmax(64px, max-content) minmax(0, 1fr);
    column-gap: var(--spacing-space-8, 8px);
    align-items: start;
    margin: 0;
  }

  .ids-card-key-value-label {
    margin: 0;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 500;
    color: var(--color-text-gray-neutral-strong);
    white-space: nowrap;
  }

  .ids-card-key-value-value {
    margin: 0;
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-space-8, 8px);
    min-width: 0;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
    color: var(--color-text-gray-neutral-strong);
  }

  .ids-card-key-value-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-top: 2px;
    color: var(--color-icon-gray-neutral-base);
  }
`;

export const cardSecondaryTitleStyles = css`
  :host {
    display: contents;
  }

  .ids-card-secondary-title {
    margin: 0;
    font-size: var(--font-size-body-1, 16px);
    line-height: var(--font-line-height-line-height-24, 24px);
    font-weight: 400;
    color: var(--color-text-gray-neutral);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
