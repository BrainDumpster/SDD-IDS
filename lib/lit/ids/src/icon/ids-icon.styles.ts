/**
 * IdsIcon styles — React `IdsIcon.module.css` parity for Lit host.
 */
import { css } from "lit";

export const idsIconStyles = css`
  :host {
    display: inline-block;
    box-sizing: border-box;
    flex-shrink: 0;
    vertical-align: middle;
    width: var(--ids-icon-size, 16px);
    height: var(--ids-icon-size, 16px);
    line-height: 0;
    color: var(--ids-icon-color, inherit);
  }

  :host([data-variant="mask"]) {
    background-color: var(--ids-icon-color, currentColor);
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
  }

  :host([data-variant="img"]) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }

  :host([data-variant="img"]) img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  :host([data-variant="inline"]) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }

  :host([data-variant="inline"]) svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  :host([data-missing]) {
    background-color: transparent;
    outline: 1px dashed currentColor;
    opacity: 0.4;
    -webkit-mask-image: none;
    mask-image: none;
  }
`;
