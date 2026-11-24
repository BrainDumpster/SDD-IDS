/**
 * IDS Tooltip styles — from `components/ids/tooltip/design-spec.md`
 * (React IdsTooltip.module.css parity).
 */
import { css } from "lit";

export const tooltipHostStyles = css`
  :host {
    display: inline;
  }

  :host([trigger-display="block"]) {
    display: block;
    width: 100%;
  }
`;

export const tooltipTriggerStyles = css`
  :host {
    display: inline;
    cursor: default;
  }

  :host([display="block"]) {
    display: block;
    width: 100%;
    cursor: default;
  }
`;

export const tooltipPanelStyles = css`
  :host {
    position: fixed;
    box-sizing: border-box;
    background: transparent;
    border: none;
    box-shadow: none;
    max-width: 264px;
    overflow: visible;
    z-index: 1070;
    display: none;
  }

  :host([data-open]) {
    display: block;
  }

  :host([data-standard]) {
    width: 240px;
  }

  :host([data-closable]) {
    width: 264px;
  }

  :host([data-hug]) {
    width: auto;
    min-width: 0;
    max-width: var(--tooltip-max-width, 244px);
  }

  .ids-tooltip-panel {
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: var(--tooltip-max-height, 300px);
    overflow: hidden;
    background: var(--color-background-surface-secondary);
    color: var(--color-text-gray-neutral);
    border: var(--border-width-border-1) solid
      var(--color-border-gray-neutral-base);
    border-radius: var(--tooltip-control-radius);
    box-shadow: 1px 1px 3px rgba(37, 37, 37, 0.25);
  }

  .ids-tooltip-scroll {
    box-sizing: border-box;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
    padding: var(--padding-padding-12) 0;
  }

  .ids-tooltip-content {
    box-sizing: border-box;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--spacing-space-4);
    width: 100%;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--color-background-gray-base)
      var(--color-background-gray-lighter);
    padding: 0 var(--padding-padding-12);
  }

  /* Closable: the slotted ids-tooltip-close (IDS Icon Button, 24×24) docks to
     the panel's top-right corner — sibling of the header/body column per
     design-spec — and the scroll content reserves padding + 24px + 4px so
     title/body text never flows under it. */
  ::slotted(ids-tooltip-close) {
    position: absolute;
    top: var(--padding-padding-12);
    right: var(--padding-padding-12);
    z-index: 1;
  }

  :host([data-closable]) .ids-tooltip-content {
    padding-right: calc(
      var(--padding-padding-12) + var(--sizing-size-24) +
        var(--spacing-space-4)
    );
  }

  .ids-tooltip-arrow {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    z-index: 1;
    pointer-events: none;
  }

  .ids-tooltip-arrow-graphic {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 6px;
    line-height: 0;
  }

  .ids-tooltip-arrow-svg {
    width: 10px;
    height: 6px;
    display: block;
    flex-shrink: 0;
    overflow: visible;
  }

  .ids-tooltip-arrow-fill {
    fill: var(--color-background-surface-secondary);
  }

  .ids-tooltip-arrow-stroke {
    fill: none;
    stroke: var(--color-border-gray-neutral-base);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    stroke-linecap: butt;
    stroke-linejoin: miter;
  }

  .ids-tooltip-arrow[data-side="top"] .ids-tooltip-arrow-svg {
    transform: rotate(180deg);
  }

  .ids-tooltip-arrow[data-side="bottom"] .ids-tooltip-arrow-svg {
    transform: rotate(0deg);
  }

  .ids-tooltip-arrow[data-side="left"] .ids-tooltip-arrow-graphic,
  .ids-tooltip-arrow[data-side="right"] .ids-tooltip-arrow-graphic {
    width: 6px;
    height: 10px;
  }

  .ids-tooltip-arrow[data-side="left"] .ids-tooltip-arrow-svg {
    transform: rotate(90deg);
  }

  .ids-tooltip-arrow[data-side="right"] .ids-tooltip-arrow-svg {
    transform: rotate(-90deg);
  }

  .ids-tooltip-arrow[data-side="bottom"] {
    top: -5px !important;
    left: var(--ids-tooltip-arrow-offset, calc(50% - 5px)) !important;
  }

  .ids-tooltip-arrow[data-side="top"] {
    bottom: -5px !important;
    left: var(--ids-tooltip-arrow-offset, calc(50% - 5px)) !important;
  }

  .ids-tooltip-arrow[data-side="left"] {
    right: -5px !important;
    top: var(--ids-tooltip-arrow-offset, calc(50% - 5px)) !important;
  }

  .ids-tooltip-arrow[data-side="right"] {
    left: -5px !important;
    top: var(--ids-tooltip-arrow-offset, calc(50% - 5px)) !important;
  }
`;

export const tooltipBodyStyles = css`
  :host {
    display: block;
    color: var(--color-text-gray-neutral);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
  }
`;

export const tooltipHeaderStyles = css`
  :host {
    display: block;
    color: var(--color-text-gray-neutral-strong);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 500;
  }
`;

export const tooltipCloseStyles = css`
  /* Sibling of the header/body column — docks top-right inside the panel.
     The inner ids-icon-button (ghost neutral · small) owns its 24×24 box,
     glyph size, and state colors. */
  :host {
    display: inline-flex;
    flex-shrink: 0;
  }
`;
