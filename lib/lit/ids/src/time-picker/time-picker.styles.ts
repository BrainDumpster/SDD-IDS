/**
 * IDS Time Picker styles — from components/ids/time-picker/design-spec.md
 * React IdsTimePicker.module.css parity + inline Form Label (no Lit form-label yet).
 *
 * Live Figma (2026-11-10): TimePicker-Main `42159:132203`,
 * TimePicker-Element-Dropdown `42159:132108`.
 */
import { css } from "lit";

export const timePickerStyles = css`
  :host {
    display: inline-flex;
    flex-direction: row;
    gap: 16px;
    align-items: flex-start;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Form Label parity (components/ids/form-label) inside .label slot */
  .formLabel {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-8);
    box-sizing: border-box;
  }

  .formLabel.sizeLg {
    padding-block: var(--padding-padding-10);
  }

  .formLabel.sizeMd {
    padding-block: var(--padding-padding-6);
  }

  .formLabelGroup {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-2);
    margin: 0;
    padding: 0;
  }

  .formLabelText,
  .formLabelMarker {
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
    letter-spacing: 0;
    color: var(--color-text-gray-neutral-strong);
  }

  .label {
    display: inline-flex;
    flex-shrink: 0;
    white-space: nowrap;
    min-width: var(--ids-picker-label-min-width, 0px);
    box-sizing: border-box;
  }

  .fieldGroup {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-space-4, 4px);
    isolation: isolate;
    min-width: 1px;
    position: relative;
    padding-bottom: calc(
      var(--spacing-space-4, 4px) + var(--font-line-height-line-height-20, 20px)
    );
  }

  .positionWrapper {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
  }

  .fieldContainer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    background: var(--color-background-surface-component, #fff);
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base, #757575);
    gap: var(--spacing-space-none, 0px);
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    padding-left: var(--padding-padding-16, 16px);
    padding-right: 0;
    border-radius: var(--time-picker-control-radius);
  }

  .fieldContainer.sizeLarge {
    height: 40px;
  }

  .fieldContainer.sizeSmall {
    height: 32px;
  }

  .fieldContainer:hover:not(.disabled):not(.error):not(.open) {
    border-color: var(--color-border-gray-neutral-stronger, #252525);
  }

  .fieldContainer:has(button:hover):not(.disabled):not(.error):not(.open) {
    border-color: var(--color-border-gray-neutral-base, #757575);
  }

  .fieldContainer:has(button:focus-visible):not(.disabled):not(.error):not(.open) {
    border-color: var(--color-border-gray-neutral-base, #757575);
  }

  .fieldContainer:has(.textInput:focus):not(.open):not(.disabled):not(.error) {
    border-color: var(--color-border-brand-base, #0672cb);
  }

  .fieldContainer.disabled {
    background: var(--color-background-gray-lighter, #f4f4f4);
    border-color: var(--color-border-gray-disabled, #757575);
    cursor: not-allowed;
  }

  .fieldContainer.disabled:hover {
    border-color: var(--color-border-gray-disabled, #757575);
  }

  .fieldContainer.error {
    border-color: var(--color-border-alerting-critical-base, #af0000);
  }

  .fieldContainer.open {
    border-color: var(--color-border-brand-base, #0672cb);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .textInput {
    flex: 1 0 0;
    border: none;
    outline: none;
    background: transparent !important;
    text-overflow: ellipsis;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2, 14px);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-20, 20px);
    color: var(--color-text-gray-neutral-strong, #252525);
    padding: 0;
    min-width: 1px;
  }

  .textInput::placeholder {
    color: var(--color-text-gray-disabled, #757575);
    font-weight: 400;
  }

  .textInput:focus::placeholder {
    color: transparent;
  }

  .textInput:disabled {
    color: var(--color-text-gray-disabled, #757575);
    cursor: not-allowed;
  }

  .textInput.filled {
    font-weight: 400;
    color: var(--color-text-gray-neutral, #4d4d4d);
  }

  .textInput::selection {
    background: var(--color-background-controls-lighter, #ebf4fb);
    color: var(--color-text-gray-neutral, #4d4d4d);
  }

  .formatHint,
  .errorMessage {
    position: absolute;
    left: 0;
    top: calc(100% - var(--font-line-height-line-height-20, 20px));
    width: max-content;
    max-width: 700px;
  }

  .formatHint {
    margin: 0;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2, 14px);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-20, 20px);
    color: var(--color-text-gray-neutral, #4d4d4d);
  }

  .errorMessage {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8, 8px);
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2, 14px);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-20, 20px);
    color: var(--color-text-alerting-critical-base, #af0000);
  }

  /* Clock trigger = tertiary icon button (native for aria-expanded) */
  .clockIconBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: -1px -1px -1px 0;
    flex-shrink: 0;
    border: none;
    box-shadow: inset 0 0 0 var(--border-width-border-1, 1px) transparent;
    background: transparent;
    border-radius: var(--corner-radius-radius-2, 2px);
    cursor: pointer;
    padding: 0;
    outline: none;
    box-sizing: border-box;
    color: var(--color-icon-brand-strong, #055fa9);
  }

  .clockIconBtn.sizeLarge {
    width: var(--sizing-size-40, 40px);
    height: var(--sizing-size-40, 40px);
  }

  .clockIconBtn.sizeSmall {
    width: var(--sizing-size-32, 32px);
    height: var(--sizing-size-32, 32px);
  }

  .clockIconBtn:hover:not(:disabled):not(:focus-visible) {
    background: var(--color-background-controls-lighter, #ebf4fb);
    box-shadow: inset 0 0 0 var(--border-width-border-1, 1px)
      var(--color-border-brand-base, #0672cb);
  }

  .clockIconBtn:active:not(:disabled) {
    background: var(--color-background-controls-light, #daeaf7);
    color: var(--color-icon-brand-stronger, #055fa9);
  }

  .clockIconBtn:focus-visible:not(:disabled) {
    background: var(--color-background-controls-light, #daeaf7);
    box-shadow:
      inset 0 0 0 var(--border-width-border-1, 1px) transparent,
      0 0 0 var(--scale-2, 2px) var(--color-border-gray-white, #fff),
      0 0 0 var(--scale-4, 4px) var(--color-border-brand-base, #0672cb);
  }

  .clockIconBtn:disabled {
    color: var(--color-icon-gray-disabled, #757575);
    cursor: not-allowed;
    background: transparent;
    box-shadow: none;
  }

  .clockIconBtn ids-icon {
    display: block;
  }

  .timePopup {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 100;
    margin-top: -1px;
    background: var(--color-background-surface-secondary, #fff);
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base, #757575);
    box-shadow:
      var(--shadow-shadow-4-drop-shadow-4-x, 0px)
        var(--shadow-shadow-4-drop-shadow-4-y, 4px)
        var(--shadow-shadow-4-drop-shadow-4-blur, 4px)
        var(--shadow-shadow-4-drop-shadow-4-spread, 0px)
        var(--shadow-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),
      var(--shadow-shadow-4-drop-shadow-8-x, 0px)
        var(--shadow-shadow-4-drop-shadow-8-y, 8px)
        var(--shadow-shadow-4-drop-shadow-8-blur, 8px)
        var(--shadow-shadow-4-drop-shadow-8-spread, 0px)
        var(--shadow-drop-shadow-8-color, rgba(37, 37, 37, 0.08));
    padding: var(--padding-padding-16, 16px);
    display: flex;
    flex-direction: row;
    gap: var(--spacing-space-16, 16px);
    align-items: center;
    border-radius: var(--corner-radius-radius-none, 0);
    box-sizing: border-box;
  }

  .timePopup.widePadding {
    padding: var(--padding-padding-16, 16px) var(--padding-padding-40, 40px);
  }

  .timeColumn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-space-16, 16px);
    width: 34px;
  }

  .periodColumn {
    width: 32px;
  }

  .arrowBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--color-icon-gray-neutral-base, #4d4d4d);
    line-height: 0;
  }

  .arrowBtn:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .arrowUp {
    transform: rotate(180deg);
  }

  .valueCell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: var(--padding-padding-8, 8px) var(--padding-padding-12, 12px);
    box-sizing: border-box;
    border-radius: var(--corner-radius-radius-2, 2px);
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2, 14px);
    font-weight: 400;
    line-height: normal;
    color: var(--color-text-gray-neutral-strong, #252525);
    text-align: center;
    white-space: nowrap;
  }

  .visuallyHidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

/** Portaled popup styles adopted onto document (escapes shadow DOM). */
export const timePickerPopupPortalStyles = css`
  .timePopup {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 100;
    margin-top: -1px;
    background: var(--color-background-surface-secondary, #fff);
    border: var(--border-width-border-default, 1px) solid
      var(--color-border-gray-neutral-base, #757575);
    box-shadow:
      var(--shadow-shadow-4-drop-shadow-4-x, 0px)
        var(--shadow-shadow-4-drop-shadow-4-y, 4px)
        var(--shadow-shadow-4-drop-shadow-4-blur, 4px)
        var(--shadow-shadow-4-drop-shadow-4-spread, 0px)
        var(--shadow-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),
      var(--shadow-shadow-4-drop-shadow-8-x, 0px)
        var(--shadow-shadow-4-drop-shadow-8-y, 8px)
        var(--shadow-shadow-4-drop-shadow-8-blur, 8px)
        var(--shadow-shadow-4-drop-shadow-8-spread, 0px)
        var(--shadow-drop-shadow-8-color, rgba(37, 37, 37, 0.08));
    padding: var(--padding-padding-16, 16px);
    display: flex;
    flex-direction: row;
    gap: var(--spacing-space-16, 16px);
    align-items: center;
    border-radius: var(--corner-radius-radius-none, 0);
    box-sizing: border-box;
  }

  .timePopupPortaled {
    position: fixed;
    top: 0;
    left: 0;
    margin-top: 0;
    right: auto;
  }

  .timePopup.widePadding {
    padding: var(--padding-padding-16, 16px) var(--padding-padding-40, 40px);
  }

  .timeColumn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-space-16, 16px);
    width: 34px;
  }

  .periodColumn {
    width: 32px;
  }

  .arrowBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--color-icon-gray-neutral-base, #4d4d4d);
    line-height: 0;
  }

  .arrowBtn:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .arrowUp {
    transform: rotate(180deg);
  }

  .valueCell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: var(--padding-padding-8, 8px) var(--padding-padding-12, 12px);
    box-sizing: border-box;
    border-radius: var(--corner-radius-radius-2, 2px);
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2, 14px);
    font-weight: 400;
    line-height: normal;
    color: var(--color-text-gray-neutral-strong, #252525);
    text-align: center;
    white-space: nowrap;
  }

  .visuallyHidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .ids-time-picker-popup-portal ids-icon {
    display: block;
  }
`;
