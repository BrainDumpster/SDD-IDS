/**
 * IDS Dropdown (shared) styles — token-only CSS.
 *
 * Port of:
 *   - `lib/react/ids/dropdown-shared/IdsDropdownTriggerShell.module.css`  (trigger shell)
 *   - `lib/react/ids/dropdown-shared/DropdownMenu.module.css`             (portal menu)
 *   - per-variant wrapper CSS (`IdsDropdown*.module.css`): label row, field column, value text
 *
 * Specs: `components/ids/dropdown-single-select|dropdown-multiselect|dropdown-combo-box/design-spec.md`
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, Figma MCP 2026-11-06):
 *   single-select matrix `11099:58099` · field Container `12579:77895` → `Corner Radius/radius-none`
 *   multiselect field `12608:96588` → `radius-none` · combo box field `29393:149487` → `radius-none`
 *
 * Two sheets:
 *   - `dropdownHostStyles`        — shadow DOM of the host element (label, trigger shell, helper/error)
 *   - `dropdownMenuPortalStyles`  — adopted onto `document` for the body-portaled menu; every
 *                                   class is prefixed `ids-dd-` so it cannot collide with page CSS.
 */
import { css } from "lit";

export const dropdownHostStyles = css`
  :host {
    display: block;
    width: max-content;
    max-width: 100%;
    box-sizing: border-box;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
  }

  :host([fullwidth]) {
    width: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  .root {
    display: block;
    width: max-content;
    max-width: 100%;
    box-sizing: border-box;
  }

  .root[data-full-width="true"] {
    width: 100%;
  }

  .fieldRow {
    display: flex;
    /* Label aligns to the control row only — helper/error sit under the control column. */
    align-items: flex-start;
    gap: var(--spacing-space-16);
    min-width: 0;
    width: 100%;
  }

  .label {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: 40px;
    padding: var(--padding-padding-10) 0;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
    color: var(--color-text-gray-neutral-strong);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .label[data-size="small"] {
    height: 32px;
    padding: var(--padding-padding-6) 0;
  }

  .field {
    display: grid;
    gap: var(--spacing-space-4);
    min-width: 0;
    width: max-content;
    flex: 1 1 auto;
  }

  .field[data-full-width="true"] {
    width: 100%;
  }

  /* ---- Trigger (the focusable combobox element) ---- */

  .trigger {
    display: inline-flex;
    /* Size to the field content, not the container (see React .triggerReset). */
    width: max-content;
    justify-self: start;
    box-sizing: border-box;
    outline: none;
    cursor: pointer;
  }

  .trigger[data-full-width="true"] {
    width: 100%;
    /* Allow a full-width trigger to shrink below its content's intrinsic width. */
    min-width: 0;
  }

  .trigger[aria-disabled="true"] {
    cursor: not-allowed;
  }

  /* Focus: the field border turns brand (like the IDS Text Box), no outer ring —
     keyboard focus only. A mouse click opens the menu without leaving a lingering
     brand border (a click never matches :focus-visible on this element). The error
     state sets --trigger-border directly on the shell, so it still wins. */
  .trigger:focus-visible {
    outline: none;
    --trigger-border: var(--color-border-brand-base);
  }

  .triggerMeasure {
    display: inline-flex;
    width: 100%;
    min-width: 0;
  }

  /* ---- Trigger shell (IdsDropdownTriggerShell) ---- */

  .shell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 300px;
    max-width: 700px;
    min-width: 186px;
    min-height: 40px;
    box-sizing: border-box;
    border: var(--border-width-border-1) solid var(--trigger-border, var(--color-border-gray-neutral-base));
    background: var(--trigger-bg, var(--color-background-surface-component));
    color: var(--trigger-fg, var(--color-text-gray-neutral));
    padding: var(--trigger-py, var(--padding-padding-10)) var(--padding-padding-16);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: inherit;
    gap: var(--spacing-space-10);
    border-radius: var(--dropdown-control-radius, var(--corner-radius-radius-none));
  }

  .shell[data-full-width="true"] {
    width: 100%;
  }

  .shell[data-size="small"] {
    --trigger-py: var(--padding-padding-6);
    min-height: 32px;
  }

  .shell[data-disabled="true"] {
    cursor: not-allowed;
    background: var(--color-background-gray-lighter);
    --trigger-border: var(--color-border-gray-disabled);
    color: var(--color-text-gray-disabled);
  }

  .shell[data-error="true"]:not([data-disabled="true"]) {
    --trigger-border: var(--color-border-alerting-critical-base);
  }

  /* Spec hover: border → gray-neutral-strong (not disabled / error / focus-visible). */
  .trigger:not(:focus-visible):hover .shell:not([data-disabled="true"]):not([data-error="true"]) {
    --trigger-border: var(--color-border-gray-neutral-strong);
  }

  /* Menu open: square bottom edge so the popup meets the field (attached dropdown). */
  .trigger[aria-expanded="true"] .shell {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .main {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    gap: var(--spacing-space-4);
  }

  /* Let the value/text child shrink below its content width so ellipsis triggers. */
  .main > * {
    min-width: 0;
  }

  /* Field showing selected option(s): 16px between content and caret. */
  .shell[data-filled="true"] .main {
    padding-right: var(--padding-padding-16);
  }

  /* Caret never rotates when the menu is open (Figma show-dropdown / matrix). */
  .caretWrap {
    flex-shrink: 0;
    display: inline-flex;
    align-items: flex-start;
    padding: 5px var(--padding-padding-1);
    color: var(--color-icon-gray-neutral-base);
    line-height: 0;
  }

  .shell[data-disabled="true"] .caretWrap {
    color: var(--color-border-gray-disabled);
  }

  /* ---- Field content ---- */

  .valueText {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .badgeTrigger {
    display: inline-flex;
    flex-shrink: 0;
  }

  /* Badge + value text laid out as one field-content row so a single tooltip
     trigger can wrap both. The value text absorbs the shrink so ellipsis triggers. */
  .triggerContent {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-4);
    min-width: 0;
    width: 100%;
  }

  ids-tooltip-trigger {
    cursor: inherit;
  }

  .optionsSlot {
    display: none;
  }

  /* ---- Helper / error message (string props instead of IdsHelper / IdsError children) ---- */

  .helper,
  .error {
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8);
    margin: 0;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 400;
  }

  .helper {
    color: var(--color-text-gray-neutral);
  }

  .error {
    color: var(--color-text-alerting-critical-base);
  }

  .helper[data-disabled="true"],
  .error[data-disabled="true"] {
    color: var(--color-text-gray-disabled);
  }

  .error ids-icon {
    flex: 0 0 auto;
  }

  .helperText,
  .errorText {
    min-width: 0;
  }

  .helperText {
    max-width: 900px;
    /* Keep natural width up to the 900px cap — only wrap once the limit is hit. */
    flex-shrink: 0;
  }
`;

export const dropdownMenuPortalStyles = css`
  /* Positioner: fixed, placed by script (attached to the trigger, sideOffset -1). */
  .ids-dd-positioner {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1060;
    box-sizing: border-box;
    font-family: var(--typography-font-style-primary, "Roboto", sans-serif);
  }

  .ids-dd-positioner ids-tooltip-trigger {
    cursor: inherit;
  }

  .ids-dd-popup {
    background: var(--color-background-surface-component);
    /* Column layout so the options region can flex-grow and keep the footer action
       pinned to the bottom border even when a 'min-height' (combo box) makes the
       popup taller than its content — e.g. the "No results found" search state. */
    display: flex;
    flex-direction: column;
    /* Full 1px border. With sideOffset -1 the popup's top border overlaps the
       field's bottom border into a single line (attached-dropdown look, 677bdca3).
       Without the top border, the opaque popup covers the field border → no line. */
    border: var(--border-width-border-1, 1px) solid var(--color-border-gray-neutral-base);
    box-sizing: border-box;
    /* Default (container-driven): menu matches the trigger/field width so it
       tracks the field as its container resizes; long options truncate via
       '.itemLabel'. Content-driven sizing is opt-in via '.popupContentWidth'. */
    width: var(--dropdown-trigger-width, auto) !important;
    min-width: var(--dropdown-trigger-width, auto) !important;
    max-width: var(--dropdown-trigger-width, auto) !important;
    /* Field-attached: bottom corners only (Figma Rounded Corners=True → radius-4). IDS menu radius = 0. */
    border-radius: 0 0 var(--dropdown-menu-radius, var(--corner-radius-radius-none)) var(--dropdown-menu-radius, var(--corner-radius-radius-none));
    box-shadow:
      0 4px 4px 0 var(--shadow-shadow-4-drop-shadow-4-color),
      0 2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color);
    padding: 0;
    outline: none;
    font-family: inherit;
    z-index: 1060;
    overflow: clip;
  }

  /* When Base UI flips/places the menu above the field, drop the shadow entirely
     (a downward drop shadow would fall onto the field/container below) and round
     the **top** corners so the menu stays attached at its bottom edge (mirror of
     the default below-field look). 'data-side' sits on the Base UI positioner
     (the popup's parent), not on '.popup' itself, so key off the ancestor. */

  [data-side="top"] .ids-dd-popup {
    border-radius: var(--dropdown-menu-radius, var(--corner-radius-radius-none)) var(--dropdown-menu-radius, var(--corner-radius-radius-none)) 0 0;
    box-shadow: none;
  }

  /* Content-driven width (menuWidth="content"): grow to the widest option,
     clamped between the trigger width (≥ 186px) and 700px. Options past the max
     truncate via '.itemLabel'. Placed after '.popup' so it wins the cascade. */

  .ids-dd-popupContentWidth {
    width: max-content !important;
    min-width: var(--dropdown-trigger-width, 186px) !important;
    max-width: var(--dropdown-menu-max-width, 700px) !important;
  }

  .ids-dd-searchRow {
    padding: var(--padding-padding-8);
    width: 100%;
    box-sizing: border-box;
  }

  .ids-dd-searchField {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border: var(--border-width-border-1, 1px) solid var(--color-border-gray-neutral-base);
    background: var(--color-background-surface-component);
    padding: var(--padding-padding-2) var(--padding-padding-16);
    border-radius: 0;
  }

  /* The search field is a specialised Text Box, so it mirrors the Text Box states.
     Hover: border '--color-border-gray-neutral-strong' (not while focused). */

  .ids-dd-searchField:hover:not(:focus-within) {
    border-color: var(--color-border-gray-neutral-strong);
  }

  /* Focus matches the IDS Text Box: the field border turns brand, no outer ring,
     on both click and Tab (the search '<input>' sits inside, so ':focus-within'
     covers pointer focus too). */

  .ids-dd-searchField:focus-within,
  .ids-dd-searchField[data-focus-visible="true"] {
    border-color: var(--color-border-brand-base);
  }

  /* Search glyph: <ids-icon shape="search-16"> (React used a CSS mask of search-16.svg). */
  .ids-dd-searchIcon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    line-height: 0;
  }

  .ids-dd-searchInput {
    all: unset;
    flex: 1 1 auto;
    min-width: 0;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    color: var(--color-text-gray-neutral);
  }

  .ids-dd-searchInput::placeholder {
    color: var(--color-text-gray-neutral);
  }

  /* Holds the input plus the greyed-out ghost suggestion, overlaid in the same box. */

  .ids-dd-searchInputBox {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  .ids-dd-searchInputBox .ids-dd-searchInput {
    flex: 1 1 auto;
    width: 100%;
  }

  /* Ghost suggestion overlay: the typed portion is invisible (only reserves the
     caret offset — the real glyphs come from the input on top), the suffix renders
     in disabled grey. Same font metrics as the input so the tail aligns exactly. */

  .ids-dd-searchGhost {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    align-items: center;
    pointer-events: none;
    overflow: hidden;
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    white-space: pre;
  }

  .ids-dd-searchGhostTyped {
    visibility: hidden;
    white-space: pre;
  }

  .ids-dd-searchGhostSuffix {
    color: var(--color-static-gray-400); /* #9E9E9E, fixed in light + dark */
    white-space: pre;
  }

  .ids-dd-searchInputWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-space-10);
    flex: 1 1 auto;
    min-width: 0;
    padding-left: var(--padding-padding-8);
    padding-top: var(--padding-padding-4);
    padding-bottom: var(--padding-padding-4);
  }

  .ids-dd-searchClearButton {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .ids-dd-searchClearButton:focus-visible {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: 1px;
  }

  .ids-dd-searchClearIcon {
    flex-shrink: 0;
  }

  .ids-dd-showSelectedPanel {
    width: 100%;
    box-sizing: border-box;
    border-bottom: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    background: var(--color-background-surface-component);
    padding: var(--padding-padding-8) var(--padding-padding-16) var(--padding-padding-8) 0;
    /* Keep Show/Hide Selected from resizing content-driven popup max-content (avoids
       Floating UI collision-shift “drift” when the tag panel mounts/unmounts). */
    contain: inline-size;
  }

  .ids-dd-showSelectedHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 0 var(--padding-padding-8);
  }

  .ids-dd-showSelectedToggle {
    all: unset;
    display: inline-flex;
    align-items: center;
    position: relative;
    gap: var(--spacing-space-8);
    padding: var(--padding-padding-2) var(--padding-padding-8);
    color: var(--color-text-brand-strong);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
    flex-shrink: 0;
  }

  .ids-dd-showSelectedCaret {
    flex-shrink: 0;
  }

  /* Show/Hide Selected toggle focus ring — same button-style '::after' ring as the
     other popup action buttons (Clear All / footer action), per design-spec. */

  .ids-dd-showSelectedToggle:focus-visible {
    position: relative;
    outline: none;
  }

  .ids-dd-showSelectedToggle:focus-visible::after {
    content: "";
    position: absolute;
    inset: calc(-1 * (var(--button-focus-ring-offset, 3px) + var(--border-width-border-1)));
    border: var(--border-width-border-1) solid var(--color-border-brand-base);
    border-radius: var(--button-focus-ring-radius, var(--corner-radius-radius-4));
    pointer-events: none;
  }

  .ids-dd-showSelectedTagsRoot {
    position: relative;
    /* Stay within the panel content box. Do NOT use width: calc(100% + padding) —
       that bleeds into content-driven popup max-content and shifts the menu on
       expand/collapse. Overlay scrollbar is offset to the popup edge instead. */
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    contain: inline-size;
    overflow: visible;
  }

  .ids-dd-showSelectedTagsRoot .ids-dd-optionsScrollbar {
    /* Panel has padding-right 16px; pull the overlay thumb to the popup edge so it
       still aligns with the options-list scrollbar (same visual as the old width bleed). */
    right: calc(2px - var(--padding-padding-16));
  }

  .ids-dd-showSelectedTags {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    align-content: flex-start;
    gap: var(--spacing-space-4);
    width: 100%;
    box-sizing: border-box;
    /* Contain the inline size so the wrapped tags do NOT contribute their
       "all-on-one-line" width to the content-driven menu's 'max-content'. The menu
       width is driven by the options (each tag is a selected option, so the option
       list is always wide enough); the tags simply wrap within that width. */
    contain: inline-size;
    /* Native scrollbar hidden — the overlay scrollbar (shared with the options
       list) draws on top without taking space. */
    scrollbar-width: none;
    padding: var(--padding-padding-8) var(--padding-padding-24) 0 var(--padding-padding-16);
    /* Cap at 3 rows of tags, then scroll: top (8) + 3 × 28px tag (lg) + 2 × 4px gap = 100px. */
    max-height: 100px;
    overflow-y: auto;
    outline: none;
  }

  .ids-dd-showSelectedTags::-webkit-scrollbar {
    display: none;
  }

  .ids-dd-optionsScrollRoot {
    position: relative;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    /* Grow to fill the popup (incl. a combo-box 'min-height') so the footer action
       stays on the bottom border; 'min-height: 0' lets the viewport scroll. */
    flex: 1 1 auto;
    min-height: 0;
  }

  .ids-dd-optionsScrollViewport {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    overflow-y: auto;
    overscroll-behavior: contain;
    /* App Launcher parity: the options list sits 1px inside the menu border. */
    padding-inline: 1px;
    /* Hide the native scrollbar — the overlay scrollbar below draws on top
       without taking layout space, so option rows keep their full width. */
    scrollbar-width: none;
    outline: none;
  }

  .ids-dd-optionsScrollViewport::-webkit-scrollbar {
    display: none;
  }

  /* Overlay scrollbar (Base UI ScrollArea): absolutely positioned so it does not
     reduce the viewport/option width. Always visible while the list overflows.
     Thumb mirrors the IDS ScrollBar component (6px thumb, radius-4, border-light). */

  .ids-dd-optionsScrollbar {
    position: absolute;
    top: 2px;
    right: 2px;
    bottom: 2px;
    display: flex;
    justify-content: center;
    width: 6px;
    opacity: 1;
  }

  .ids-dd-optionsScrollThumb {
    width: 100%;
    border-radius: var(--corner-radius-radius-4);
    background-color: var(--color-border-gray-neutral-light);
  }

  .ids-dd-optionsScrollThumb:hover {
    background-color: var(--color-text-gray-neutral);
  }

  .ids-dd-selectAllClearAllRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    /* Symmetric 16px: Clear All (right) aligns with the option content right edge,
       matching Select All (left). */
    padding: var(--padding-padding-8) var(--padding-padding-16) var(--padding-padding-8) var(--padding-padding-16);
    border-bottom: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    background: var(--color-background-surface-component);
  }

  /* Wrapper around the Select All / Clear All row, single Clear All, and Show
     Selected panel. Default is layout-transparent ('display: contents') so the
     rows flow exactly as before; 'showSelectedFirst' flips their visual order via
     flex column-reverse (the Show Selected panel renders above the controls). */

  .ids-dd-menuControls {
    display: contents;
  }

  .ids-dd-selectAllButton {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-space-8);
    color: var(--color-text-gray-neutral);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
  }

  .ids-dd-clearAllButton {
    all: unset;
    display: inline-flex;
    align-items: center;
    color: var(--color-text-brand-strong);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
  }

  .ids-dd-clearAllButton:disabled {
    color: var(--color-text-gray-disabled);
    cursor: not-allowed;
  }

  /* Multi-select Clear All keyboard focus ring. '.clearAllButton' renders its
     label directly (no inner '.footerActionButton'), so the shared footer-button
     ring rule does not reach it — draw the ring on the button itself.
     (src's DropdownMenu.module.css has the same latent gap.) */

  .ids-dd-clearAllButton:focus-visible {
    position: relative;
    outline: none;
  }

  .ids-dd-clearAllButton:focus-visible::after {
    content: "";
    position: absolute;
    inset: calc(-1 * (var(--button-focus-ring-offset, 3px) + var(--border-width-border-1)));
    border: var(--border-width-border-1) solid var(--color-border-brand-base);
    border-radius: var(--button-focus-ring-radius, var(--corner-radius-radius-4));
    pointer-events: none;
  }

  /* Select All checkbox focus matches IDS Checkbox focus-visible:
     the control border becomes brand and a 1px brand outline sits 2px outside. */

  .ids-dd-selectAllButton:focus-visible .ids-dd-selectAllCheckbox {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: 2px;
  }

  .ids-dd-selectAllButton:focus-visible:not([data-checked="true"]) .ids-dd-selectAllCheckbox {
    border-color: var(--color-border-brand-base);
  }

  .ids-dd-selectAllButton[data-checked="true"] .ids-dd-selectAllCheckbox {
    background: var(--color-background-controls-base);
    border-color: var(--color-border-brand-transparent-brand);
    color: var(--color-icon-gray-white);
  }

  .ids-dd-selectAllButton[data-checked="true"]:hover .ids-dd-selectAllCheckbox,
  .ids-dd-selectAllButton[data-checked="true"]:active .ids-dd-selectAllCheckbox {
    background: var(--color-background-controls-strong);
    border-color: var(--color-border-brand-transparent-brand);
  }

  .ids-dd-selectAllButton[data-indeterminate="true"] .ids-dd-selectAllCheckbox {
    background: var(--color-background-surface-component);
    border-color: var(--color-border-brand-base);
  }

  .ids-dd-selectAllButton:hover:not([data-checked="true"]) .ids-dd-selectAllCheckbox {
    border-color: var(--color-border-gray-neutral-strong);
  }

  .ids-dd-item {
    appearance: none;
    -webkit-appearance: none;
    display: flex;
    align-items: center;
    gap: var(--spacing-space-8);
    padding: var(--padding-padding-10) var(--padding-padding-16);
    width: 100%;
    box-sizing: border-box;
    border: none;
    background: var(--color-background-surface-component);
    text-align: left;
    font-size: var(--font-size-body-2);
    color: var(--color-text-gray-neutral);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
    outline: none;
    transition: background 80ms ease;
    user-select: none;
    min-height: 40px;
  }

  .ids-dd-item[data-selectable="false"] {
    gap: var(--spacing-space-16);
  }

  /* Option label truncates with an ellipsis when longer than the menu width
     (popup is locked to the trigger width). Flex child must be able to shrink. */

  .ids-dd-itemLabel {
    flex: 1 1 auto;
    min-width: 0;
    /* Block-level so overflow/ellipsis clip in BOTH contexts: as a direct flex
       child of the row, and when wrapped in the (block) tooltip trigger for a
       truncated label. Without this the wrapped span reverts to inline and the
       ellipsis stops working → the full label pops out and the row jumps on hover. */
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Tooltip trigger wrapping a truncated option label: must shrink like the bare
     '.itemLabel' flex child so a long label never forces the menu wider. */

  .ids-dd-triggerBlock {
    flex: 1 1 auto;
    min-width: 0;
  }

  /* Empty search state — first row is "No results found" (Body 2 Medium). */

  .ids-dd-noResults {
    display: flex;
    align-items: center;
    padding: var(--padding-padding-10) var(--padding-padding-16);
    width: 100%;
    box-sizing: border-box;
    min-height: 40px;
    background: var(--color-background-surface-component);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    font-weight: 500;
    font-variation-settings: "wdth" 100;
    color: var(--color-text-gray-neutral);
  }

  .ids-dd-item[data-selection-mode="single"] {
    padding: var(--padding-padding-10) var(--padding-padding-16);
    min-height: 40px;
  }

  /* Figma single-select text-only option aligns content to the top (items-start).
     Radio rows keep center alignment so the control lines up with the label. */

  .ids-dd-item[data-selection-mode="single"]:not(:has(.ids-dd-radioOuter)) {
    align-items: flex-start;
  }

  .ids-dd-item:hover:not([data-disabled]) {
    background: var(--color-background-brand-lighter-slate);
    color: var(--color-text-gray-neutral);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-dd-item[data-highlighted] {
    background: var(--color-background-brand-lighter-slate);
    color: var(--color-text-gray-neutral);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-dd-item[data-selection-mode="single"]:hover:not([data-disabled]),
  .ids-dd-item[data-selection-mode="single"][data-highlighted]:not([data-disabled]) {
    background: var(--color-background-brand-lighter-slate);
    color: var(--color-text-gray-neutral);
    /* Top + bottom border only (no side borders); inset box-shadow is not clipped
       by the options scroll region the way a 0-offset outline is. */
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-dd-item[data-focus-visible] {
    outline: none;
  }

  .ids-dd-item:focus-visible {
    outline: none;
  }

  .ids-dd-item[data-selection-mode="single"]:focus-visible {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: -1px;
    border-radius: var(--corner-radius-radius-4);
  }

  .ids-dd-item[data-selection-mode="single"]:focus-visible .ids-dd-radioOuter::after {
    content: none;
  }

  .ids-dd-item[data-disabled],
  .ids-dd-item:disabled {
    color: var(--color-text-gray-disabled);
    cursor: not-allowed;
    background: var(--color-background-gray-lighter);
    box-shadow: none;
  }

  .ids-dd-item[data-selection-mode="single"]:has(.ids-dd-radioOuter)[data-disabled],
  .ids-dd-item[data-selection-mode="single"]:has(.ids-dd-radioOuter):disabled {
    background: var(--color-background-surface-component);
    outline: none;
  }

  .ids-dd-item[data-selection-mode="single"]:not(:has(.ids-dd-radioOuter))[data-disabled],
  .ids-dd-item[data-selection-mode="single"]:not(:has(.ids-dd-radioOuter)):disabled {
    background: var(--color-background-gray-lighter);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-gray-disabled),
      inset 0 -1px 0 0 var(--color-border-gray-disabled);
  }

  .ids-dd-item[data-selectable="false"][data-disabled],
  .ids-dd-item[data-selectable="false"]:disabled {
    border-bottom: var(--border-width-border-1) solid var(--color-border-gray-neutral-light);
    box-shadow:
      inset 0 -1px 0 0 var(--color-border-gray-neutral-light),
      0 -1px 0 0 var(--color-border-gray-disabled);
  }

  .ids-dd-sectionHeader {
    display: flex;
    align-items: center;
    padding: var(--padding-padding-6) var(--padding-padding-16);
    border-top: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    color: var(--color-text-gray-neutral);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
  }

  .ids-dd-sectionHeader:first-child {
    border-top: none;
  }

  .ids-dd-sectionDivider {
    width: 100%;
    height: 1px;
    background: var(--color-border-gray-neutral-base);
  }

  .ids-dd-footerAction {
    all: unset;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    /* 16px left inset so the label aligns with Select All / options / single Clear
       All. The 8px lives on the row (not the inner span) so the focus ring hugs
       the label — see '.footerAction .footerActionButton' below. */
    padding: var(--padding-padding-8) 0 var(--padding-padding-8) var(--padding-padding-16);
    border-top: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    color: var(--color-text-brand-strong);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
  }

  .ids-dd-footerActionButton {
    display: inline-flex;
    align-items: center;
    position: relative;
    padding: var(--padding-padding-2) var(--padding-padding-8);
    border-radius: var(--corner-radius-radius-2);
  }

  .ids-dd-clearAllButton:focus-visible .ids-dd-footerActionButton,
  .ids-dd-footerAction:focus-visible .ids-dd-footerActionButton,
  .ids-dd-clearAllAction:focus-visible .ids-dd-footerActionButton {
    outline: none;
  }

  .ids-dd-clearAllButton:focus-visible .ids-dd-footerActionButton::after,
  .ids-dd-footerAction:focus-visible .ids-dd-footerActionButton::after,
  .ids-dd-clearAllAction:focus-visible .ids-dd-footerActionButton::after {
    content: "";
    position: absolute;
    inset: calc(-1 * (var(--button-focus-ring-offset, 3px) + var(--border-width-border-1)));
    border: var(--border-width-border-1) solid var(--color-border-brand-base);
    border-radius: var(--button-focus-ring-radius, var(--corner-radius-radius-4));
    pointer-events: none;
  }

  /* Single-select Clear All: placed at the top of the menu with a bottom border
     (instead of the footer's top border). Reuses '.footerActionButton' for the
     inner label span, but with no inner padding so its keyboard focus ring hugs
     the label exactly like the multi/combo Clear All ('.clearAllButton') ring —
     the label position is preserved by moving that 8px onto the row padding. */

  .ids-dd-clearAllAction {
    all: unset;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: var(--padding-padding-8) 0 var(--padding-padding-8) var(--padding-padding-16);
    border-bottom: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    color: var(--color-text-brand-strong);
    font-size: var(--font-size-body-2);
    line-height: var(--font-line-height-line-height-20);
    cursor: pointer;
  }

  .ids-dd-clearAllAction .ids-dd-footerActionButton,
  .ids-dd-footerAction .ids-dd-footerActionButton {
    padding: 0;
  }

  /* Right-aligned single-select Clear All / Reset to Default (clearAllAlign="right"):
     16px right inset, same as the multi-select Clear All in .selectAllClearAllRow. */

  .ids-dd-clearAllAction[data-align="right"] {
    justify-content: flex-end;
    padding-right: var(--padding-padding-16);
  }

  /* 16px = the control size (checkbox/radio), so it aligns left with the Select All
     checkbox with no wrapper-centering offset. */

  .ids-dd-leadingControl {
    display: inline-flex;
    width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    pointer-events: none;
  }

  .ids-dd-radioOuter {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    background: var(--color-background-surface-component);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .ids-dd-radioInner {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-background-controls-base);
  }

  .ids-dd-checkboxOuter {
    width: 18px;
    height: 18px;
    border-radius: var(--corner-radius-radius-2);
    border: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background-surface-component);
    position: relative;
  }

  .ids-dd-selectAllCheckbox {
    width: 16px;
    height: 16px;
  }

  .ids-dd-item[data-selection-mode="multi"] .ids-dd-checkboxOuter {
    width: 16px;
    height: 16px;
  }

  .ids-dd-checkboxTick {
    width: 8px;
    height: 8px;
    background: currentColor;
    clip-path: polygon(0 54%, 12% 42%, 39% 67%, 86% 18%, 100% 32%, 39% 94%);
    transform: translateY(-0.5px);
  }

  .ids-dd-checkboxDash {
    width: 8px;
    height: 2px;
    background: var(--color-icon-brand-base);
    border-radius: 2px;
  }

  /* Focus ring on the whole option row (matches single-select + design-spec
     "Option rows use outline: 1px brand, outline-offset: -1px, radius-4"), not the
     checkbox control alone. */

  .ids-dd-item[data-selection-mode="multi"][data-focus-visible],
  .ids-dd-item[data-selection-mode="multi"]:focus-visible {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: -1px;
    border-radius: var(--corner-radius-radius-4);
  }

  .ids-dd-item[data-selection-mode="multi"]:not([data-selected]):not([data-indeterminate]):not([data-disabled]) {
    color: var(--color-text-gray-neutral-strong);
  }

  .ids-dd-item[data-selected] .ids-dd-checkboxOuter {
    background: var(--color-background-controls-base);
    border-color: var(--color-border-brand-transparent-brand);
    color: var(--color-icon-gray-white);
  }

  .ids-dd-item[data-selected] {
    background: var(--color-background-brand-lighter-slate);
    color: var(--color-text-brand-strong);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-dd-item[data-selection-mode="single"]:not(:has(.ids-dd-radioOuter))[data-selected] {
    background: var(--color-background-brand-lighter-slate);
    color: var(--color-text-brand-strong);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-dd-item[data-selection-mode="single"]:has(.ids-dd-radioOuter)[data-selected] {
    background: var(--color-background-surface-component);
    color: var(--color-text-brand-strong);
    outline: none;
    box-shadow: none;
  }

  /* Keep the keyboard focus ring on a selected radio row — the selected rule above
     sets outline:none at a higher specificity than the generic :focus-visible rule,
     which otherwise swallows the ring so the selected row looks skipped. */

  .ids-dd-item[data-selection-mode="single"]:has(.ids-dd-radioOuter)[data-selected][data-focus-visible],
  .ids-dd-item[data-selection-mode="single"]:has(.ids-dd-radioOuter)[data-selected]:focus-visible {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: -1px;
    border-radius: var(--corner-radius-radius-4);
  }

  .ids-dd-item[data-selection-mode="multi"][data-selected] {
    background: var(--color-background-surface-component);
    color: var(--color-text-gray-neutral);
    box-shadow: none;
  }

  .ids-dd-item[data-selection-mode="multi"][data-indeterminate] .ids-dd-checkboxOuter {
    background: var(--color-background-surface-component);
    border-color: var(--color-border-brand-base);
  }

  .ids-dd-item:active:not([data-disabled]) {
    background: var(--color-background-brand-light-slate);
    color: var(--color-text-brand-strong);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  .ids-dd-item[data-selection-mode="single"]:active:not([data-disabled]) {
    background: var(--color-background-brand-light-slate);
    color: var(--color-text-brand-strong);
    box-shadow:
      inset 0 1px 0 0 var(--color-border-brand-base-neutral),
      inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
  }

  /* --- Control-state parity (delegated from checkbox/radio specs) --- */

  /* Unselected hover/press: control border strengthens. */

  .ids-dd-item:hover:not([data-disabled]) .ids-dd-radioOuter,
  .ids-dd-item:active:not([data-disabled]) .ids-dd-radioOuter {
    border-color: var(--color-border-gray-neutral-strong);
  }

  .ids-dd-item:hover:not([data-disabled]) .ids-dd-checkboxOuter,
  .ids-dd-item:active:not([data-disabled]) .ids-dd-checkboxOuter {
    border-color: var(--color-border-gray-neutral-strong);
    background: var(--color-background-surface-component);
  }

  /* Selected default: radio ring uses brand border. */

  .ids-dd-item[data-selected] .ids-dd-radioOuter {
    border-color: var(--color-border-brand-base);
  }

  .ids-dd-item[data-focus-visible] .ids-dd-radioOuter::after,
  .ids-dd-item:focus-visible .ids-dd-radioOuter::after {
    content: "";
    position: absolute;
    inset: -4px;
    border: var(--border-width-border-1) solid var(--color-border-brand-base);
    border-radius: 50%;
  }

  .ids-dd-item[data-selection-mode="single"][data-focus-visible] .ids-dd-radioOuter::after,
  .ids-dd-item[data-selection-mode="single"]:focus-visible .ids-dd-radioOuter::after {
    content: none;
  }

  /* Selected hover/press: radio ring follows strong border state. */

  .ids-dd-item[data-selected]:hover .ids-dd-radioOuter,
  .ids-dd-item[data-selected]:active .ids-dd-radioOuter {
    border-color: var(--color-border-gray-neutral-strong);
  }

  /* Selected hover/press for checkbox follows controls-brand-strong fill. */

  .ids-dd-item[data-selected]:hover .ids-dd-checkboxOuter,
  .ids-dd-item[data-selected]:active .ids-dd-checkboxOuter {
    background: var(--color-background-controls-strong);
    border-color: var(--color-border-brand-transparent-brand);
  }

  .ids-dd-item[data-selection-mode="multi"][data-indeterminate]:hover .ids-dd-checkboxOuter,
  .ids-dd-item[data-selection-mode="multi"][data-indeterminate]:active .ids-dd-checkboxOuter {
    border-color: var(--color-border-gray-neutral-strong);
  }

  /* Figma parity: disabled selectable rows use component background + disabled controls/text. */

  .ids-dd-item[data-selectable="true"][data-disabled],
  .ids-dd-item[data-selectable="true"]:disabled {
    background: var(--color-background-surface-component);
    color: var(--color-text-gray-disabled);
  }

  .ids-dd-item[data-selectable="true"][data-disabled] .ids-dd-radioOuter,
  .ids-dd-item[data-selectable="true"]:disabled .ids-dd-radioOuter {
    border-color: var(--color-border-gray-disabled);
    background: var(--color-background-gray-lighter);
  }

  .ids-dd-item[data-selectable="true"][data-disabled] .ids-dd-radioInner,
  .ids-dd-item[data-selectable="true"]:disabled .ids-dd-radioInner {
    background: var(--color-icon-gray-disabled);
  }

  .ids-dd-item[data-selectable="true"][data-disabled] .ids-dd-checkboxOuter,
  .ids-dd-item[data-selectable="true"]:disabled .ids-dd-checkboxOuter {
    border-color: var(--color-border-gray-disabled);
    background: var(--color-background-gray-light);
    color: var(--color-icon-gray-inverse);
  }

  .ids-dd-item[data-selectable="true"][data-disabled][data-indeterminate] .ids-dd-checkboxOuter,
  .ids-dd-item[data-selectable="true"]:disabled[data-indeterminate] .ids-dd-checkboxOuter {
    background: var(--color-background-gray-light);
    border-color: var(--color-border-gray-disabled);
  }

  .ids-dd-item[data-selectable="true"][data-disabled][data-indeterminate] .ids-dd-checkboxDash,
  .ids-dd-item[data-selectable="true"]:disabled[data-indeterminate] .ids-dd-checkboxDash {
    background: var(--color-border-gray-disabled);
  }

  .ids-dd-item[data-selectable="true"][data-disabled][data-selected] .ids-dd-checkboxOuter,
  .ids-dd-item[data-selectable="true"]:disabled[data-selected] .ids-dd-checkboxOuter {
    background: var(--color-background-gray-base);
  }

  /* ---- Lit adaptations ---- */

  /* Sections that are not a native control stay focusable programmatically only. */
  .ids-dd-popup:focus {
    outline: none;
  }

  /* Overlay scrollbar (replaces Base UI ScrollArea): track hides when nothing overflows. */
  .ids-dd-optionsScrollbar[hidden] {
    display: none;
  }

  .ids-dd-optionsScrollThumb {
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
  }

  /* Show Selected tag chip (IDS Tag: editable, large, dismissible). */
  .ids-dd-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    gap: var(--spacing-space-4);
    min-height: 28px;
    max-width: 100%;
    min-width: 0;
    padding: var(--padding-padding-4) var(--padding-padding-8) var(--padding-padding-4) var(--padding-padding-12);
    border: var(--border-width-border-1) solid var(--color-border-gray-neutral-base);
    border-radius: var(--corner-radius-radius-24);
    background: var(--color-background-surface-component);
    color: var(--color-text-gray-neutral);
    font-size: var(--font-size-body-2);
    font-weight: 400;
    line-height: var(--font-line-height-line-height-20);
    white-space: nowrap;
  }

  .ids-dd-tagField {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: 20px;
    min-width: 0;
    padding: 0 var(--padding-padding-2);
    border: var(--border-width-border-1) solid transparent;
    border-radius: var(--corner-radius-radius-2);
    color: inherit;
  }

  .ids-dd-tagLabel {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ids-dd-tagClose {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-sizing: border-box;
    width: var(--sizing-size-18);
    height: var(--sizing-size-18);
    margin: 0;
    padding: var(--padding-padding-4);
    border: none;
    border-radius: var(--button-control-radius, var(--corner-radius-radius-2));
    background: transparent;
    color: var(--color-icon-gray-neutral-accessible);
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
  }

  .ids-dd-tagClose:hover {
    background: var(--color-background-controls-lighter);
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--color-border-brand-base);
  }

  .ids-dd-tagClose:active {
    background: var(--color-background-controls-light);
    box-shadow: inset 0 0 0 var(--border-width-border-1) var(--color-border-brand-base);
  }

  .ids-dd-tagClose:focus-visible {
    outline: var(--border-width-border-1) solid var(--color-border-brand-base);
    outline-offset: var(--button-focus-ring-offset, 2px);
  }

  /* Tooltip trigger wrapping a truncated option label. */
  .ids-dd-item ids-tooltip {
    flex: 1 1 auto;
    min-width: 0;
  }
`;
