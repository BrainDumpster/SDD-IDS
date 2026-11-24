/**
 * Shared IDS Accordion styles (design-spec tokens).
 * Applied across panel / title / content shadow roots.
 */
import { css } from "lit";

export const accordionHostBase = css`
  :host {
    display: block;
    box-sizing: border-box;
  }
`;

export const accordionPanelStyles = css`
  ${accordionHostBase}

  :host {
    border: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    margin-top: calc(-1 * var(--border-width-border-1));
    background: var(--color-background-surface-component);
  }

  :host(:first-of-type) {
    margin-top: 0;
  }

  .accordion-panel {
    display: block;
  }

  :host([accordionpaneldisabled]),
  :host([idsaccordionpaneldisabled]) {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const accordionTitleStyles = css`
  ${accordionHostBase}

  h3 {
    margin: 0;
    padding: 0;
    font: inherit;
  }

  /* Non-button row — the ids-icon-button chevron inside is the focusable
     trigger control (no nested <button>). */
  .accordion-header {
    width: 100%;
    height: auto;
    min-height: var(--scale-40, 40px);
    box-sizing: border-box;
    display: flex;
    align-items: flex-start; /* design-spec: header content is top-aligned */
    gap: var(--spacing-space-8);
    padding: var(--padding-padding-10) var(--padding-padding-16);
    border: 0;
    margin: 0;
    cursor: pointer;
    text-align: left;
    background: var(--color-background-surface-component);
    color: var(--color-text-gray-neutral-strong);
    font-family: inherit;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
  }

  .accordion-header--left {
    justify-content: flex-start;
  }

  .accordion-header--right {
    justify-content: space-between;
  }

  .accordion-title {
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
    color: var(--color-text-gray-neutral-strong);
    max-width: 900px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Design-spec: the chevron is an ids-icon-button (ghost neutral, small).
     It owns its own state colors — this class only sets layout offsets and
     the expanded rotation. padding-2 top offset implemented as margin-top. */
  .accordion-chevron {
    display: inline-flex;
    flex-shrink: 0;
    margin-top: var(--padding-padding-2, 2px);
    transition: transform 120ms ease;
  }

  .accordion-header:hover:not(.accordion-header--disabled) {
    background: var(--color-background-brand-lighter-slate);
  }

  /* Focus (IDS Design Library .Accordion-Element-Left State=Focus): tinted header,
     1px neutral border (inset shadow, no layout shift), double ring — 2px separator +
     4px brand outer ring — radius-4. z-index keeps the ring above sibling panels.
     Focus lives on the icon button's inner shadow button, so :focus-within
     maps it onto the row (:has() can't pierce the icon button's shadow). */
  .accordion-header:focus-within {
    outline: none;
    position: relative;
    z-index: 1;
    border-radius: var(--corner-radius-radius-4);
    background-color: var(--color-background-brand-lighter-slate);
    box-shadow:
      inset 0 0 0 var(--border-width-border-1) var(--color-border-gray-neutral-base),
      0 0 0 var(--scale-2) var(--color-background-surface-component),
      0 0 0 var(--scale-4) var(--color-border-brand-base);
  }

  .accordion-header--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .accordion-header.active-header {
    background-color: var(--color-background-brand-lighter-slate);
    background-image: linear-gradient(
      90deg,
      var(--color-border-brand-base) 0,
      var(--color-border-brand-base) 4px,
      var(--color-background-brand-lighter-slate) 4px,
      var(--color-background-brand-lighter-slate) 100%
    );
  }

  .accordion-header.active-header:hover:not(.accordion-header--disabled) {
    background-color: var(--color-background-brand-lighter-slate);
    background-image: linear-gradient(
      90deg,
      var(--color-border-brand-base) 0,
      var(--color-border-brand-base) 4px,
      var(--color-background-brand-lighter-slate) 4px,
      var(--color-background-brand-lighter-slate) 100%
    );
  }

  /* Design-spec: the expanded header hides its 4px strip while focused (focus ring is the indicator). */
  .accordion-header.active-header:focus-within,
  .accordion-header.active-header:focus-within:hover:not(.accordion-header--disabled) {
    background-image: none;
  }

  .accordion-meta {
    color: var(--color-text-gray-neutral);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
  }

  /* Expanded: rotate the icon button (glyph colors come from its
     ghost-neutral ladder inside its own shadow styles). */
  .accordion-header.active-header .accordion-chevron {
    transform: rotate(180deg);
  }
`;

export const accordionContentStyles = css`
  ${accordionHostBase}

  :host {
    overflow: hidden;
  }

  :host([hidden]) {
    display: none;
  }

  .panel-content {
    box-sizing: border-box;
    /* Design-spec: 50px floor (padding included). */
    min-width: 50px;
    min-height: 50px;
    /* Design-spec panelMaxHeight: unset grows with content; when set, body scrolls. */
    max-height: var(--ids-accordion-panel-max-height, none);
    overflow-y: auto;
    padding: var(--padding-padding-8) var(--padding-padding-24) var(--padding-padding-16)
      calc(var(--padding-padding-32) + var(--padding-padding-8));
    background-color: var(--color-background-surface-component);
    border-top: none;
    color: var(--color-text-gray-neutral);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
  }

  :host([data-open="true"]) .panel-content {
    background-image: linear-gradient(
      90deg,
      var(--color-border-brand-base) 0,
      var(--color-border-brand-base) 4px,
      var(--color-background-surface-component) 4px,
      var(--color-background-surface-component) 100%
    );
  }

  .content-card {
    /* Spec: optional inner content card — no bg / border / padding */
    padding: 0;
    background: transparent;
    border: 0;
    max-width: 900px;
  }

  .content-card a {
    color: var(--color-text-link-brand-base);
  }
`;
