/**
 * IDS Segmented Button styles — Figma-verified + design-spec.
 *
 * Geometry (live Figma MCP 2026-11-09):
 * - text Spec Accurate `42113:67642` / `8218:13150`: **262×34** (host width 260px)
 * - icon 3-option `42113:67622`: **106×39** CSS border-box; segments 33px; gap 2px
 * Selected focus-visible: dashed `var(--color-border-gray-white)` (`9047:20375`)
 *
 * Example CSS reference: `storybook/src/components/SegmentedButton.module.css`
 * (fills parent width for text; icon height corrected to 39px per Figma Dev Mode).
 */
import { css } from "lit";

export const segmentedButtonsGroupStyles = css`
  :host {
    box-sizing: border-box;
    display: inline-flex;
    max-width: 100%;
    vertical-align: middle;
  }

  /*
   * Text fills parent (Spec Accurate wraps at 260px -> control is 260x34).
   * Use block-level flex so width:100% reliably resolves (inline-flex can hug).
   */
  :host([data-type="text"]) {
    display: flex;
    width: 100%;
  }

  .ids-segmented-buttons__root {
    box-sizing: border-box;
    display: flex;
    min-width: min-content;
    max-width: 100%;
    align-items: stretch;
    gap: var(--spacing-space-2);
    padding: var(--padding-padding-2);
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base);
    border-radius: var(--corner-radius-radius-2);
    background: var(--color-background-surface-component);
  }

  .ids-segmented-buttons__root[data-type="text"] {
    box-sizing: border-box;
    width: 100%;
    min-width: min-content;
    height: 34px;
    min-height: 34px;
    align-items: stretch;
  }

  /* Figma MCP screenshot 42113:67622 = 106x39 border-box */
  .ids-segmented-buttons__root[data-type="icon"] {
    box-sizing: border-box;
    width: max-content;
    height: 39px;
    min-height: 39px;
    align-items: center;
  }

  ::slotted(ids-segmented-text) {
    flex: 1 1 0%;
    min-width: 0;
  }

  ::slotted(ids-segmented-icon) {
    flex: 0 0 auto;
    align-self: center;
  }
`;

export const segmentedSegmentStyles = css`
  :host {
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
  }

  :host([data-kind="text"]) {
    flex: 1 1 0%;
    min-width: 0;
  }

  :host([data-kind="icon"]) {
    flex: 0 0 auto;
    align-self: center;
  }

  .ids-segmented-buttons__segment {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    font-family: var(--typography-font-style-primary), "Roboto", sans-serif;
    font-size: var(--font-size-body-2);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-20);
    outline: none;
    border: none;
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px) transparent;
    border-radius: var(--corner-radius-radius-2);
    background: var(--color-background-surface-component);
    color: var(--color-text-gray-neutral);
    flex-shrink: 0;
    transition:
      background-color 120ms ease,
      color 120ms ease,
      box-shadow 120ms ease;
  }

  .ids-segmented-buttons__segment--text {
    box-sizing: border-box;
    height: 28px;
    min-height: 28px;
    padding: var(--padding-padding-4) var(--padding-padding-8);
    white-space: nowrap;
  }

  .ids-segmented-buttons__segment--icon {
    box-sizing: border-box;
    flex-shrink: 0;
    align-self: center;
    /* min-width only — padding 8 + glyph 16 = 32 (Angular / Figma cell) */
    min-width: var(--sizing-size-32);
    height: 33px;
    min-height: 33px;
    max-height: 33px;
    padding: 0 var(--padding-padding-8);
    line-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Icon tint via segment color → ids-icon currentColor */
  :host([data-kind="icon"])
    .ids-segmented-buttons__segment:not([data-selected="true"]),
  :host([data-kind="icon"])
    .ids-segmented-buttons__segment:not([data-selected="true"]):hover,
  :host([data-kind="icon"])
    .ids-segmented-buttons__segment:not([data-selected="true"]):active,
  :host([data-kind="icon"])
    .ids-segmented-buttons__segment[data-simulated-state="hover"]:not(
      [data-selected="true"]
    ),
  :host([data-kind="icon"])
    .ids-segmented-buttons__segment[data-simulated-state="press"]:not(
      [data-selected="true"]
    ) {
    color: var(--color-icon-brand-base);
  }

  :host([data-kind="icon"])
    .ids-segmented-buttons__segment[data-selected="true"] {
    color: var(--color-icon-gray-white);
  }

  /* Unselected — brand lighter / light slate */
  .ids-segmented-buttons__segment:not([data-selected="true"]):hover {
    background: var(--color-background-brand-lighter-slate);
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px) transparent;
    color: var(--color-text-gray-neutral);
  }

  .ids-segmented-buttons__segment:not([data-selected="true"]):active {
    background: var(--color-background-brand-light-slate);
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px) transparent;
    color: var(--color-text-brand-strong);
  }

  .ids-segmented-buttons__segment:not([data-selected="true"]):focus-visible {
    background: var(--color-background-surface-component);
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px)
      var(--color-border-brand-base);
    outline: none;
  }

  /* Demo / visual QA — pin interaction styling */
  .ids-segmented-buttons__segment[data-simulated-state="hover"]:not(
      [data-selected="true"]
    ) {
    background: var(--color-background-brand-lighter-slate);
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px) transparent;
    color: var(--color-text-gray-neutral);
  }

  .ids-segmented-buttons__segment[data-selected="true"][data-simulated-state="hover"] {
    background: var(--color-background-controls-strong) !important;
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px)
      var(--color-border-brand-base) !important;
    color: var(--color-text-gray-white) !important;
  }

  .ids-segmented-buttons__segment[data-simulated-state="press"]:not(
      [data-selected="true"]
    ) {
    background: var(--color-background-brand-light-slate);
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px) transparent;
    color: var(--color-text-brand-strong);
  }

  .ids-segmented-buttons__segment[data-selected="true"][data-simulated-state="press"] {
    background: var(--color-background-controls-stronger) !important;
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px)
      var(--color-border-brand-base) !important;
    color: var(--color-text-gray-white) !important;
  }

  .ids-segmented-buttons__segment[data-simulated-state="focus-visible"]:not(
      [data-selected="true"]
    ) {
    background: var(--color-background-surface-component);
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px)
      var(--color-border-brand-base);
    outline: none;
  }

  .ids-segmented-buttons__segment[data-selected="true"][data-simulated-state="focus-visible"] {
    background: var(--color-background-controls-base) !important;
    box-shadow: none !important;
    outline: var(--border-width-border-default, 1px) dashed
      var(--color-border-gray-white) !important;
    outline-offset: calc(-1 * var(--border-width-border-default, 1px));
    color: var(--color-text-gray-white) !important;
  }

  /* Selected default — Figma same-color edge via border-brand-base */
  .ids-segmented-buttons__segment[data-selected="true"] {
    background: var(--color-background-controls-base) !important;
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px)
      var(--color-border-brand-base) !important;
    color: var(--color-text-gray-white) !important;
  }

  .ids-segmented-buttons__segment[data-selected="true"]:hover {
    background: var(--color-background-controls-strong) !important;
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px)
      var(--color-border-brand-base) !important;
    color: var(--color-text-gray-white) !important;
  }

  .ids-segmented-buttons__segment[data-selected="true"]:active {
    background: var(--color-background-controls-stronger) !important;
    box-shadow: inset 0 0 0 var(--border-width-border-default, 1px)
      var(--color-border-brand-base) !important;
    color: var(--color-text-gray-white) !important;
  }

  .ids-segmented-buttons__segment[data-selected="true"]:focus-visible {
    background: var(--color-background-controls-base) !important;
    box-shadow: none !important;
    outline: var(--border-width-border-default, 1px) dashed
      var(--color-border-gray-white);
    outline-offset: calc(-1 * var(--border-width-border-default, 1px));
    color: var(--color-text-gray-white) !important;
  }

  /* Figma glyph frame 16x14, centered in 33px segment row */
  .ids-segmented-buttons__glyph {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 14px;
    flex-shrink: 0;
    line-height: 0;
    overflow: hidden;
    color: inherit;
  }

  .ids-segmented-buttons__icon-glyph,
  .ids-segmented-buttons__segment--icon ids-icon {
    display: block;
    flex-shrink: 0;
    line-height: 0;
    /* Override IdsIcon applyBoxSize square (size=16 -> 16x16) */
    width: 16px !important;
    height: 14px !important;
    min-width: 16px !important;
    min-height: 14px !important;
    max-width: 16px !important;
    max-height: 14px !important;
  }
`;
