/**
 * IDS Main Menu/Top styles — design-spec + React MainMenuTop.module.css /
 * MainMenuTopMenu.module.css.
 *
 * Live Figma (0bHk3XhrjFhowgFkz9yLr4, MCP 2026-11-13):
 *   Main `10189:30280`, Element `11099:56576`, Selected `11099:56577`,
 *   Use cases `42136:57443`
 */
import { css } from "lit";

export const mainMenuTopStyles = css`
:host {
  display: block;
  width: 100%;
  box-sizing: border-box;
}

:host([hidden]) {
  display: none !important;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.root {
  width: 100%;
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: visible;
  position: relative;
}

.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-space-16);
  width: 100%;
  min-height: 40px;
  box-sizing: border-box;
  margin: 0;
  padding: 0 var(--padding-padding-12);
  list-style: none;
  background: var(--color-background-surface-primary);
}

.barItem {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  position: relative;
}

.item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-space-8);
  box-sizing: border-box;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;
  height: 40px;
  min-height: 40px;
  padding: 0 var(--padding-padding-12);
  position: relative;
}

.itemSmall {
  height: 36px;
  min-height: 36px;
  padding-inline: var(--padding-padding-8);
}

.item:hover:not(.itemSelected) {
  background: var(--color-background-brand-lighter-slate);
}

.item:hover:not(.itemSelected) .label {
  color: var(--color-text-gray-neutral-strong);
}

.item:active:not(.itemSelected) {
  background: var(--color-background-brand-light-slate);
}

.itemSelected {
  background: transparent;
  /* Inset underline keeps icon/label vertically centered in the 40px hit target */
  box-shadow: inset 0 -2px 0 var(--color-border-brand-strong);
}

.itemSelected .label {
  color: var(--color-text-brand-strong);
}

.itemSelected .iconSlot,
.itemSelected .chevronSlot {
  color: var(--color-icon-brand-strong);
}

.itemMenuOpen:not(.itemSelected) {
  background: var(--color-background-brand-lighter-slate);
}

.itemMenuOpen:not(.itemSelected) .label {
  color: var(--color-text-gray-neutral-strong);
}

.item:focus-visible {
  outline: var(--border-width-border-strong, 4px) solid var(--color-border-brand-base);
  outline-offset: 0;
  border-radius: var(--corner-radius-radius-4);
}

.itemCluster {
  display: flex;
  align-items: center;
  gap: var(--spacing-space-16);
  height: var(--font-line-height-line-height-24, 24px);
  min-width: 0;
}

.itemClusterSmall {
  height: var(--font-line-height-line-height-20, 20px);
}

.iconSlot {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  line-height: 0;
  color: var(--color-icon-gray-neutral-strong);
}

.iconSlot ids-icon,
.chevronSlot ids-icon {
  display: block;
  flex-shrink: 0;
}

.chevronSlot {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: var(--font-line-height-line-height-24, 24px);
  line-height: 0;
  color: var(--color-icon-gray-neutral-strong);
}

.chevronSlotSmall {
  height: var(--font-line-height-line-height-20, 20px);
}

.label {
  display: flex;
  align-items: center;
  height: var(--font-line-height-line-height-24, 24px);
  font-family: var(--typography-font-style-primary, Roboto, sans-serif);
  font-size: var(--font-size-body-1, 16px);
  line-height: var(--font-line-height-line-height-24, 24px);
  font-weight: 500;
  color: var(--color-text-gray-neutral-strong);
  white-space: nowrap;
}

.labelSmall {
  height: var(--font-line-height-line-height-20, 20px);
  font-size: var(--font-size-body-2, 14px);
  line-height: var(--font-line-height-line-height-20, 20px);
}

@media (max-width: 768px) {
  .container {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .bar {
    flex-wrap: nowrap;
    width: max-content;
    min-width: 100%;
    gap: var(--spacing-space-8);
  }

  .item {
    padding-inline: var(--padding-padding-8);
  }
}
`;

/** Body-portaled masthead menu panel (Figma `42136:57466` / `12579:19717`). */
export const mainMenuTopPortalStyles = css`
.ids-mmt-portal {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1200;
}

.ids-mmt-positioner {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
  box-sizing: border-box;
  pointer-events: auto;
  visibility: hidden;
  font-family: var(--typography-font-style-primary, Roboto, sans-serif);
}

.ids-mmt-popup {
  background: var(--color-background-surface-component);
  border: var(--border-width-border-default, 1px) solid var(--color-border-gray-neutral-base);
  border-radius: 0;
  box-sizing: border-box;
  box-shadow:
    0 var(--shadow-shadow-4-drop-shadow-4-y, 2px)
      var(--shadow-shadow-4-drop-shadow-4-blur, 2px)
      var(--shadow-shadow-4-drop-shadow-4-spread, 0)
      var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),
    0 var(--shadow-shadow-4-drop-shadow-4-y, 4px)
      var(--shadow-shadow-4-drop-shadow-4-blur, 4px)
      var(--shadow-shadow-4-drop-shadow-4-spread, 0)
      var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));
  padding: var(--padding-padding-1, 1px);
  outline: none;
  overflow: hidden;
  min-width: 181px;
  width: max-content;
}

.ids-mmt-optionsList {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ids-mmt-groupLabel {
  display: flex;
  align-items: center;
  padding: var(--padding-padding-6) var(--padding-padding-16);
  border-top: var(--border-width-border-default, 1px) solid var(--color-border-neutral-light);
  color: var(--color-text-gray-neutral-strong);
  font-size: var(--font-size-body-2);
  line-height: var(--font-line-height-line-height-20);
  font-weight: 500;
}

.ids-mmt-groupLabel:first-child {
  border-top: none;
}

.ids-mmt-optionItem {
  appearance: none;
  -webkit-appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-space-8);
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-radius: 0;
  background: var(--color-background-surface-component);
  text-align: left;
  font-size: var(--font-size-body-2);
  font-weight: 500;
  color: var(--color-text-gray-neutral);
  line-height: var(--font-line-height-line-height-20);
  padding: var(--padding-padding-10) var(--padding-padding-24) var(--padding-padding-10)
    var(--padding-padding-16);
  min-height: 40px;
  cursor: pointer;
  outline: none;
  user-select: none;
  font-family: inherit;
}

.ids-mmt-optionItem:hover:not([disabled]):not([data-popup-open]),
.ids-mmt-optionItem:focus-visible:not([disabled]):not([data-popup-open]) {
  background: var(--color-background-brand-lighter-slate);
  color: var(--color-text-gray-neutral);
  box-shadow:
    inset 0 1px 0 0 var(--color-border-brand-base-neutral),
    inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
}

.ids-mmt-optionItem[data-selected="true"]:not([data-popup-open]) {
  background: var(--color-background-brand-lighter-slate);
  color: var(--color-text-gray-neutral);
  box-shadow:
    inset 0 1px 0 0 var(--color-border-brand-base-neutral),
    inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
}

.ids-mmt-optionItem[data-popup-open] {
  background: var(--color-background-brand-lighter-slate);
  color: var(--color-text-gray-neutral);
  box-shadow:
    inset 0 1px 0 0 var(--color-border-brand-base-neutral),
    inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
}

.ids-mmt-optionItem[disabled],
.ids-mmt-optionItem:disabled {
  color: var(--color-text-gray-disabled);
  cursor: not-allowed;
  background: var(--color-background-gray-light);
  box-shadow: none;
}

.ids-mmt-submenuChevron {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--color-icon-gray-neutral-strong);
}

.ids-mmt-optionItem[data-popup-open] .ids-mmt-submenuChevron,
.ids-mmt-optionItem[data-selected="true"] .ids-mmt-submenuChevron {
  color: var(--color-icon-brand-strong);
}

.ids-mmt-submenuPositioner {
  z-index: 1201;
}

.ids-mmt-submenuPopup {
  z-index: 1201;
}
`;
