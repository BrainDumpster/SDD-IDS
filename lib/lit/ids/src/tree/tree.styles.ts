/**
 * IDS Tree styles — design-spec tokens + React IdsTree.module.css parity.
 * Live Figma tokens verified 2026-11-13 (MCP) on `18571:101904` / `18571:101909`.
 */
import { css } from "lit";

const rowChrome = css`
  .row {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8);
    width: 100%;
    box-sizing: border-box;
    padding-top: var(--padding-padding-10);
    padding-bottom: var(--padding-padding-10);
    padding-right: var(--padding-padding-48);
    margin: 0;
    list-style: none;
    background: transparent;
    position: relative;
  }

  .row:hover:not(.rowSelected) {
    background: var(--color-background-gray-lighter);
  }

  .rowSelected {
    background: var(--color-background-brand-lighter-slate);
    box-shadow: inset 4px 0 0 var(--color-border-brand-base);
  }

  .rowFocused {
    outline: var(--border-width-border-2, 2px) solid var(--color-border-brand-base);
    outline-offset: -2px;
  }

  .row:focus {
    outline: none;
  }

  .row:focus-visible {
    outline: var(--border-width-border-2, 2px) solid var(--color-border-brand-base);
    outline-offset: -2px;
  }

  .chevronButton {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: inherit;
  }

  .chevron {
    flex-shrink: 0;
  }

  .chevronExpanded {
    transform: rotate(0deg);
  }

  .chevron:not(.chevronExpanded) {
    transform: rotate(-90deg);
  }

  .chevronSpacer {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
  }

  .folderIcon {
    flex-shrink: 0;
  }

  .labelCluster {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8);
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .labelButton {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 100%;
    padding: 0;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    font: inherit;
  }

  .label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--font-size-body-2);
    line-height: var(--line-height-body-2, 20px);
    font-weight: 400;
    color: var(--color-text-gray-neutral);
  }

  .rowSelected .label {
    color: var(--color-text-brand-strong);
  }

  /* Optional CountBadge — composed via \`ids-badge\` (omit when no count / showBadge=false). */
  .treeBadge {
    flex-shrink: 0;
  }
`;

export const treeStyles = css`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  :host(:focus) {
    outline: none;
  }

  .root {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    box-sizing: border-box;
  }

  ${rowChrome}
`;

export const treeItemStyles = css`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  .group {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .group[hidden] {
    display: none !important;
  }

  ${rowChrome}
`;

export const treeItemLabelStyles = css`
  :host {
    display: contents;
  }
`;
