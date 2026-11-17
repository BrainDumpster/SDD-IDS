/**
 * IDS Dropdown (shared) — internal base element + portal menu.
 *
 * One implementation for `ids-dropdown-single-select`, `ids-dropdown-multiselect`
 * and `ids-dropdown-combo-box` (React: `DropdownMenu` + `IdsDropdownTriggerShell`
 * in `lib/react/ids/dropdown-shared`). The three public elements extend
 * `IdsDropdownBase` and only supply selection model, field content and the
 * variant-specific footer / bulk-action wiring — so menu behavior cannot drift.
 *
 * Specs: `components/ids/dropdown-single-select|dropdown-multiselect|dropdown-combo-box/design-spec.md`
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, Figma MCP 2026-11-06):
 *   single-select matrix `11099:58099`; field Container `12579:77895` → `radius-none`
 *   multiselect field `12608:96588` → `radius-none` · combo box field `29393:149487` → `radius-none`
 *
 * Events (CustomEvent, bubbles + composed):
 *   ids-change        { value: string | string[] }
 *   ids-open-change   { open: boolean }
 *   ids-search        { query: string }
 *   ids-action        footer action (non-reset) fired
 *   ids-select-all    { visibleValues?: string[] }   cancelable — default toggles Select All
 *   ids-clear-all     { visibleValues?: string[] }   cancelable — default clears
 *   ids-remove-selected-tag { value: string }        cancelable — default deselects
 *
 * Menu is portaled to `document.body` (React: Base UI `Menu.Portal`), attached to
 * the trigger (`sideOffset` −1), flips above when it does not fit below.
 */
import { LitElement, html, nothing, render, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import "../icon/register.js";
import "../badge/register.js";
import "../tooltip/register.js";
import {
  DROPDOWN_CARET_ICON_SLUG,
  DROPDOWN_DEFAULT_MAX_VISIBLE_ITEMS,
  DROPDOWN_ERROR_ICON_SLUG,
  DROPDOWN_OPTION_ROW_HEIGHT,
  DROPDOWN_SEARCH_CLEAR_ICON_SLUG,
  DROPDOWN_SEARCH_ICON_SLUG,
  DROPDOWN_SEARCH_MIN_HEIGHT,
  DROPDOWN_SEARCH_SELECT_ALL_MIN_HEIGHT,
  DROPDOWN_SIDE_OFFSET,
  DROPDOWN_TAG_CLOSE_ICON_SLUG,
  DROPDOWN_VIEWPORT_MARGIN,
  computeGhostSuffix,
  filterMenuItems,
  resolveMenuWidth,
  resolveSize,
  toMenuItems,
  type IdsDropdownMenuItem,
  type IdsDropdownMenuWidth,
  type IdsDropdownOption,
  type IdsDropdownSelectionMode,
  type IdsDropdownSize,
} from "./dropdown.constants.js";
import {
  dropdownHostStyles,
  dropdownMenuPortalStyles,
} from "./dropdown.styles.js";

let dropdownUid = 0;

/** Stable `data-ids` contract per variant (matches the React wrappers). */
export interface IdsDropdownDataIds {
  container: string;
  fieldRow: string;
  label: string;
  field: string;
  options: string;
  option: string;
}

/** Footer action slot (bottom of the menu): Reset to Default or custom action. */
export interface IdsDropdownFooter {
  label: string;
  onClick: () => void;
}

export type IdsDropdownKeyboardOpenFocus = "default" | "selectedOrSearch";

/** Document-level adoption of the portal stylesheet — once per document. */
const adoptedDocuments = new WeakSet<Document>();

function adoptPortalStyles(doc: Document): boolean {
  if (adoptedDocuments.has(doc)) return true;
  const sheet = dropdownMenuPortalStyles.styleSheet;
  if (sheet && "adoptedStyleSheets" in doc) {
    try {
      if (!doc.adoptedStyleSheets.includes(sheet)) {
        doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
      }
      adoptedDocuments.add(doc);
      return true;
    } catch {
      /* fall through to inline <style> */
    }
  }
  return false;
}

export abstract class IdsDropdownBase extends LitElement {
  static override styles = [dropdownHostStyles];

  /* ------------------------------------------------------------------ *
   * Public API shared by all three variants
   * ------------------------------------------------------------------ */

  @property({ type: String, reflect: true })
  size: IdsDropdownSize | string = "large";

  @property({ type: String })
  label = "";

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  placeholder = "Select";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  searchable = false;

  /** `trigger` (default): menu = trigger width · `content`: grows to widest option, clamp [trigger, 700px]. */
  @property({ type: String, attribute: "menuwidth", reflect: true })
  menuWidth: IdsDropdownMenuWidth | string = "trigger";

  /** Option model `{ id, label, disabled?, kind? }` — property only. */
  @property({ attribute: false })
  options: IdsDropdownOption[] = [];

  /** String replacement for React `IdsHelper` / `IdsHelperText` children. */
  @property({ type: String, attribute: "helpertext" })
  helperText = "";

  /** String replacement for React `IdsError` / `IdsErrorText` children (wins over helper text). */
  @property({ type: String, attribute: "errortext" })
  errorText = "";

  @property({ type: Boolean, attribute: "fullwidth", reflect: true })
  fullWidth = false;

  /** Initial open state (React `defaultOpen`) — demo / Storybook. */
  @property({ type: Boolean, attribute: "defaultopen" })
  defaultOpen = false;

  /** Storybook / demo — open the menu; user interaction can still close it. */
  @property({ type: Boolean, attribute: "forceopen" })
  forceOpen = false;

  @property({ type: Number, attribute: "maxvisibleitems" })
  maxVisibleItems: number = DROPDOWN_DEFAULT_MAX_VISIBLE_ITEMS;

  @property({ type: String, attribute: "noresultslabel" })
  noResultsLabel = "No results found";

  /* ------------------------------------------------------------------ *
   * Internal state
   * ------------------------------------------------------------------ */

  @state() protected menuOpen = false;
  @state() private searchQuery = "";
  @state() private ghostSuffix = "";
  @state() private searchFocusVisible = false;
  @state() private showSelectedExpandedInternal = false;
  @state() private optionTooltipId: string | null = null;
  @state() private valueTooltipOpen = false;

  private readonly uid = ++dropdownUid;
  private openInitialised = false;
  private focusOnOpen = false;
  private searchPointerDown = false;
  private portalEl: HTMLDivElement | null = null;
  private popupEl: HTMLElement | null = null;
  private portalNeedsInlineStyles = false;
  private listenersBound = false;
  private resizeObserver: ResizeObserver | null = null;
  private scrollbarViewports = new WeakSet<HTMLElement>();

  /* ------------------------------------------------------------------ *
   * Variant hooks
   * ------------------------------------------------------------------ */

  protected abstract readonly selectionMode: IdsDropdownSelectionMode;
  protected abstract readonly dataIds: IdsDropdownDataIds;

  /** Currently selected option ids (in selection order). */
  protected abstract getSelectedIds(): string[];

  /** Apply a new selection (updates uncontrolled state + emits `ids-change`). */
  protected abstract commitSelection(ids: string[]): void;

  /** Content of the field (value text / badge + tooltip). */
  protected abstract renderFieldContent(): TemplateResult;

  protected get menuShowRadio(): boolean {
    return false;
  }
  protected get menuShowSelectAllClearAll(): boolean {
    return false;
  }
  protected get menuSelectAllLabel(): string {
    return "Select All";
  }
  protected get menuClearAllLabel(): string {
    return "Clear All";
  }
  protected get menuShowSelectedPanel(): boolean {
    return false;
  }
  protected get menuKeyboardOpenFocus(): IdsDropdownKeyboardOpenFocus {
    return "default";
  }
  protected get menuFooter(): IdsDropdownFooter | null {
    return null;
  }
  /** Controlled expanded state of the Show Selected panel (combo box). */
  protected get controlledShowSelectedExpanded(): boolean | undefined {
    return undefined;
  }
  /** Whether toggling the panel emits `ids-show-selected-expanded-change` (combo box). */
  protected get emitsShowSelectedExpanded(): boolean {
    return false;
  }
  protected get dataMode(): string | undefined {
    return undefined;
  }
  protected clearAllDisabledDefault(): boolean {
    return this.getSelectedIds().length === 0;
  }
  /** Option → menu rows. Combo box overrides to treat every option as selectable. */
  protected menuItems(): IdsDropdownMenuItem[] {
    return toMenuItems(this.options ?? []);
  }

  /* ------------------------------------------------------------------ *
   * Shared helpers for variants
   * ------------------------------------------------------------------ */

  protected get isMulti(): boolean {
    return this.selectionMode === "multi";
  }

  protected get resolvedSize(): IdsDropdownSize {
    return resolveSize(this.size);
  }

  protected get resolvedMenuWidth(): IdsDropdownMenuWidth {
    return resolveMenuWidth(this.menuWidth);
  }

  protected idToLabel(): Map<string, string> {
    const map = new Map<string, string>();
    for (const item of this.menuItems()) {
      if (item.selectable) map.set(item.id, item.label);
    }
    return map;
  }

  protected selectedLabels(): string[] {
    const map = this.idToLabel();
    return this.getSelectedIds()
      .map((id) => map.get(id) ?? id)
      .filter(Boolean);
  }

  protected emit<T>(name: string, detail: T, cancelable = false): boolean {
    const event = new CustomEvent<T>(name, {
      detail,
      bubbles: true,
      composed: true,
      cancelable,
    });
    return this.dispatchEvent(event);
  }

  protected get listboxId(): string {
    return `${this.rootId}-listbox`;
  }

  protected get rootId(): string {
    return this.id || `${this.tagName.toLowerCase()}-${this.uid}`;
  }

  private get messageId(): string {
    return `${this.rootId}-message`;
  }

  private get triggerId(): string {
    return `${this.rootId}-trigger`;
  }

  /** Single-line value; when (and only when) cut off, hover reveals the full text in an IDS Tooltip. */
  protected renderTruncatingValue(text: string, tooltip?: string): TemplateResult {
    const valueSpan = html`<span class="valueText">${text}</span>`;
    if (!tooltip) return valueSpan;
    return html`
      <ids-tooltip
        side="top"
        arrowalign="start"
        hugcontent
        trigger-display="block"
        .open=${this.valueTooltipOpen}
        @ids-tooltip-open-change=${this.onValueTooltipChange}
      >
        <ids-tooltip-trigger display="block">${valueSpan}</ids-tooltip-trigger>
        <ids-tooltip-panel>
          <ids-tooltip-body>${tooltip}</ids-tooltip-body>
        </ids-tooltip-panel>
      </ids-tooltip>
    `;
  }

  /** Badge count + comma-joined labels; one shared tooltip (bulleted list) when enabled. */
  protected renderMultiFieldContent(options: {
    labels: string[];
    showBadge: boolean;
    showTooltip: boolean;
  }): TemplateResult {
    const { labels, showBadge, showTooltip } = options;
    const hasSelection = labels.length > 0;
    const display = hasSelection ? labels.join(", ") : this.placeholder;
    const content = html`
      <span class="triggerContent">
        ${showBadge && hasSelection
          ? html`<span class="badgeTrigger"
              ><ids-badge
                .value=${labels.length}
                type=${this.disabled ? "disabled" : "default"}
              ></ids-badge
            ></span>`
          : nothing}
        <span class="valueText">${display}</span>
      </span>
    `;
    if (!(showTooltip && hasSelection)) return content;
    return html`
      <ids-tooltip
        side="top"
        arrowalign="start"
        hugcontent
        trigger-display="block"
      >
        <ids-tooltip-trigger display="block">${content}</ids-tooltip-trigger>
        <ids-tooltip-panel>
          <ids-tooltip-header>${`${labels.length} Items`}</ids-tooltip-header>
          <ids-tooltip-body>
            <ul
              style="margin:0;padding-inline-start:var(--spacing-space-16);list-style:disc;display:flex;flex-direction:column;gap:var(--spacing-space-2)"
            >
              ${labels.map((text) => html`<li>${text}</li>`)}
            </ul>
          </ids-tooltip-body>
        </ids-tooltip-panel>
      </ids-tooltip>
    `;
  }

  /* ------------------------------------------------------------------ *
   * Lifecycle
   * ------------------------------------------------------------------ */

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", this.tagName.toLowerCase());
  }

  override disconnectedCallback(): void {
    this.unbindOpenListeners();
    this.destroyPortal();
    super.disconnectedCallback();
  }

  override willUpdate(changed: Map<string, unknown>): void {
    super.willUpdate(changed);
    if (!this.openInitialised) {
      this.openInitialised = true;
      if ((this.defaultOpen || this.forceOpen) && !this.disabled) {
        this.menuOpen = true;
      }
    } else if (changed.has("forceOpen") && !this.disabled) {
      this.menuOpen = this.forceOpen;
    }
    if (changed.has("disabled") && this.disabled && this.menuOpen) {
      this.setMenuOpen(false);
    }
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    this.stripTooltipTabStops(this.renderRoot);
    if (this.menuOpen && !this.disabled) {
      this.bindOpenListeners();
      this.syncPortal();
    } else {
      this.unbindOpenListeners();
      this.destroyPortal();
    }
  }

  /** Tooltip triggers sit inside the (single) combobox tab stop — keep them out of the tab order. */
  private stripTooltipTabStops(root: ParentNode | null): void {
    root?.querySelectorAll("ids-tooltip-trigger").forEach((el) => {
      el.removeAttribute("tabindex");
    });
  }

  /* ------------------------------------------------------------------ *
   * Open state
   * ------------------------------------------------------------------ */

  protected setMenuOpen(next: boolean): void {
    const value = next && !this.disabled;
    if (this.menuOpen === value) return;
    this.menuOpen = value;
    if (!value) {
      this.focusOnOpen = false;
      this.optionTooltipId = null;
    }
    this.emit("ids-open-change", { open: value });
  }

  private get triggerEl(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(".trigger");
  }

  private closeAndFocusTrigger(): void {
    const trigger = this.triggerEl;
    this.setMenuOpen(false);
    trigger?.focus();
  }

  private onTriggerClick = (): void => {
    if (this.disabled) return;
    this.setMenuOpen(!this.menuOpen);
  };

  private onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    switch (event.key) {
      case "Enter":
      case " ":
        // Enter / Space open the menu and move focus into it (selected option / search).
        event.preventDefault();
        if (this.menuOpen) this.focusMenuEntry();
        else {
          this.focusOnOpen = true;
          this.setMenuOpen(true);
        }
        break;
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (this.menuOpen) this.focusMenuEntry();
        else this.setMenuOpen(true);
        break;
      case "Escape":
        if (this.menuOpen) {
          event.preventDefault();
          this.closeAndFocusTrigger();
        }
        break;
      case "Tab":
        // Close and let the browser continue the page tab order from the trigger.
        if (this.menuOpen) this.setMenuOpen(false);
        break;
    }
  };

  private onDocumentPointerDown = (event: MouseEvent): void => {
    const path = event.composedPath();
    if (path.includes(this)) return;
    if (this.portalEl && path.includes(this.portalEl)) return;
    this.setMenuOpen(false);
  };

  private onWindowReposition = (): void => {
    if (this.menuOpen) this.positionPortal();
  };

  private bindOpenListeners(): void {
    if (this.listenersBound) return;
    this.listenersBound = true;
    document.addEventListener("mousedown", this.onDocumentPointerDown);
    window.addEventListener("resize", this.onWindowReposition);
    window.addEventListener("scroll", this.onWindowReposition, true);
  }

  private unbindOpenListeners(): void {
    if (!this.listenersBound) return;
    this.listenersBound = false;
    document.removeEventListener("mousedown", this.onDocumentPointerDown);
    window.removeEventListener("resize", this.onWindowReposition);
    window.removeEventListener("scroll", this.onWindowReposition, true);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  /* ------------------------------------------------------------------ *
   * Tooltips (controlled so they only open when text is really truncated)
   * ------------------------------------------------------------------ */

  private onValueTooltipChange = (event: Event): void => {
    event.stopPropagation();
    const open = (event as CustomEvent<{ open: boolean }>).detail.open;
    if (!open) {
      this.valueTooltipOpen = false;
      return;
    }
    const span = this.renderRoot.querySelector<HTMLElement>(".main .valueText");
    this.valueTooltipOpen = !!span && span.scrollWidth > span.clientWidth + 1;
  };

  private onOptionTooltipChange(event: Event, id: string): void {
    event.stopPropagation();
    const open = (event as CustomEvent<{ open: boolean }>).detail.open;
    if (!open) {
      if (this.optionTooltipId === id) this.optionTooltipId = null;
      return;
    }
    const label = (event.currentTarget as HTMLElement).querySelector<HTMLElement>(
      ".ids-dd-itemLabel",
    );
    this.optionTooltipId =
      label && label.scrollWidth > label.clientWidth + 1 ? id : null;
  }

  /* ------------------------------------------------------------------ *
   * Selection / bulk actions
   * ------------------------------------------------------------------ */

  private selectItem(id: string): void {
    if (!this.isMulti) {
      this.commitSelection([id]);
      return;
    }
    const selected = this.getSelectedIds();
    this.commitSelection(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id],
    );
  }

  private enabledSelectableIds(): string[] {
    return this.menuItems()
      .filter((item) => item.selectable && !item.disabled)
      .map((item) => item.id);
  }

  private handleSelectAll(visible?: string[]): void {
    if (!this.emit("ids-select-all", { visibleValues: visible }, true)) return;
    const enabled = new Set(this.enabledSelectableIds());
    const selected = this.getSelectedIds();
    const scope = (visible ?? [...enabled]).filter((id) => enabled.has(id));
    const allInScope = scope.every((id) => selected.includes(id));
    this.commitSelection(
      allInScope
        ? selected.filter((id) => !scope.includes(id))
        : Array.from(new Set([...selected, ...scope])),
    );
  }

  private handleClearAll(visible?: string[]): void {
    if (!this.emit("ids-clear-all", { visibleValues: visible }, true)) return;
    const selected = this.getSelectedIds();
    this.commitSelection(
      visible ? selected.filter((id) => !visible.includes(id)) : [],
    );
  }

  private handleRemoveTag(id: string): void {
    if (!this.emit("ids-remove-selected-tag", { value: id }, true)) return;
    this.commitSelection(this.getSelectedIds().filter((x) => x !== id));
  }

  private get isShowSelectedExpanded(): boolean {
    return this.controlledShowSelectedExpanded ?? this.showSelectedExpandedInternal;
  }

  private toggleShowSelected(): void {
    const next = !this.isShowSelectedExpanded;
    if (this.controlledShowSelectedExpanded === undefined) {
      this.showSelectedExpandedInternal = next;
    }
    if (this.emitsShowSelectedExpanded) {
      this.emit("ids-show-selected-expanded-change", { expanded: next });
    }
  }

  /* ------------------------------------------------------------------ *
   * Search (ghost-text autocomplete)
   * ------------------------------------------------------------------ */

  private setSearch(next: string): void {
    if (this.searchQuery === next) return;
    this.searchQuery = next;
    this.emit("ids-search", { query: next });
  }

  private ghostFor(typed: string): string {
    return computeGhostSuffix(this.menuItems(), typed);
  }

  private get searchInputEl(): HTMLInputElement | null {
    return (
      this.popupEl?.querySelector<HTMLInputElement>(".ids-dd-searchInput") ?? null
    );
  }

  private onSearchInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const native = event as InputEvent;
    // Never autocomplete into a half-composed IME value; the suggestion is
    // still shown (display only) and accepted after the commit.
    if (native.isComposing) {
      this.setSearch(value);
      this.ghostSuffix = this.ghostFor(value);
      return;
    }
    const inputType = native.inputType;
    const isDeletion =
      typeof inputType === "string"
        ? inputType.startsWith("delete")
        : value.length < this.searchQuery.length;
    this.setSearch(value);
    this.ghostSuffix = isDeletion ? "" : this.ghostFor(value);
  };

  private onSearchCompositionEnd = (event: CompositionEvent): void => {
    const value = (event.currentTarget as HTMLInputElement).value;
    this.setSearch(value);
    this.ghostSuffix = this.ghostFor(value);
  };

  private onSearchKeyDown = (event: KeyboardEvent): void => {
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Tab" || event.key === "ArrowRight" || event.key === "End") {
      const input = event.currentTarget as HTMLInputElement;
      const typed = input.value;
      const atEnd =
        input.selectionStart === typed.length &&
        input.selectionStart === input.selectionEnd;
      if (event.key === "Tab" || atEnd) {
        const suffix = this.ghostFor(typed);
        if (suffix) {
          event.preventDefault();
          this.setSearch(typed + suffix);
          this.ghostSuffix = "";
        }
      }
    }
  };

  /* ------------------------------------------------------------------ *
   * Keyboard model (design review — Windows-style)
   * ------------------------------------------------------------------ */

  private getMenuFocusStops(popup: HTMLElement): HTMLElement[] {
    return Array.from(
      popup.querySelectorAll<HTMLElement>(
        "input:not([disabled]), button:not([disabled])",
      ),
    ).filter((el) => el.tabIndex >= 0);
  }

  private getOptionRows(popup: HTMLElement): HTMLElement[] {
    return Array.from(
      popup.querySelectorAll<HTMLElement>('[data-selectable="true"]:not(:disabled)'),
    );
  }

  private focusSelectedOption(): void {
    const popup = this.popupEl;
    if (!popup) return;
    const rows = this.getOptionRows(popup);
    (rows.find((row) => row.dataset.selected === "true") ?? rows[0])?.focus();
  }

  /** Where a keyboard open puts focus (see `keyboardOpenFocus`). */
  private focusMenuEntry(): void {
    const popup = this.popupEl;
    if (!popup) return;
    if (this.menuKeyboardOpenFocus === "selectedOrSearch") {
      const selected = this.getOptionRows(popup).find(
        (row) => row.dataset.selected === "true",
      );
      const target = selected ?? this.searchInputEl;
      if (target) {
        target.focus();
        return;
      }
    }
    const toggle = this.isMulti
      ? popup.querySelector<HTMLElement>('[data-focus-section="showSelected"] button')
      : null;
    if (toggle) toggle.focus();
    else this.focusSelectedOption();
  }

  /** Capture phase so the search field (which stops propagation of its keys) still takes part. */
  private popupKeyDownCapture = {
    handleEvent: (event: KeyboardEvent): void => {
      if (event.isComposing) return;
      const popup = this.popupEl;
      if (!popup) return;
      const active = popup.ownerDocument.activeElement as HTMLElement | null;
      if (!active || !popup.contains(active)) return;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.closeAndFocusTrigger();
        return;
      }

      if (event.key === "Tab") {
        // Tab in the search field first accepts a pending inline suggestion.
        const search = this.searchInputEl;
        if (active === search && this.ghostFor(search.value)) return;
        // No preventDefault: with focus back on the trigger the browser's own Tab
        // moves to the next (or, with Shift, previous) control on the page.
        this.closeAndFocusTrigger();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const stops = this.getMenuFocusStops(popup);
        if (stops.length === 0) return;
        const index = stops.indexOf(active);
        const down = event.key === "ArrowDown";
        if (index === -1) {
          // Focus parked on the popup itself: step into the first / last control.
          if (active !== popup) return;
          event.preventDefault();
          event.stopPropagation();
          stops[down ? 0 : stops.length - 1].focus();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        stops[(index + (down ? 1 : -1) + stops.length) % stops.length].focus();
      }
    },
    capture: true,
  };

  /** ArrowLeft / ArrowRight within Select All | Clear All and between Show Selected tags. */
  private onPopupKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const popup = this.popupEl;
    if (!popup) return;
    const active = popup.ownerDocument.activeElement as HTMLElement | null;
    if (!active || !popup.contains(active)) return;
    const section = active.closest<HTMLElement>("[data-focus-section]");
    if (!section) return;
    const dir = event.key === "ArrowRight" ? 1 : -1;
    const buttons = (root: Element) =>
      Array.from(root.querySelectorAll<HTMLElement>("button:not([disabled])"));
    let row: HTMLElement[] = [];
    if (section.dataset.focusSection === "selectAllClearAll") {
      row = buttons(section);
    } else if (section.dataset.focusSection === "showSelected") {
      const tagRow = section.querySelector<HTMLElement>(
        '[data-focus-row="showSelectedTags"]',
      );
      row = tagRow ? buttons(tagRow) : [];
    }
    const idx = row.indexOf(active);
    if (idx === -1) return;
    const next = row[idx + dir];
    if (next) {
      event.preventDefault();
      event.stopPropagation();
      next.focus();
    }
  };

  /* ------------------------------------------------------------------ *
   * Portal (document.body) + positioning
   * ------------------------------------------------------------------ */

  private ensurePortal(): HTMLDivElement {
    if (!this.portalEl) {
      this.portalEl = document.createElement("div");
      this.portalEl.setAttribute("data-ids", "ids-dropdown-menu-portal");
      this.portalEl.className = "ids-dropdown-menu-portal";
      document.body.appendChild(this.portalEl);
    }
    return this.portalEl;
  }

  private destroyPortal(): void {
    if (this.portalEl) {
      render(nothing, this.portalEl);
      this.portalEl.remove();
      this.portalEl = null;
    }
    this.popupEl = null;
  }

  private syncPortal(): void {
    const host = this.ensurePortal();
    const adopted = adoptPortalStyles(host.ownerDocument);
    this.portalNeedsInlineStyles = !adopted;
    const wasOpen = this.popupEl !== null;
    render(
      html`
        ${this.portalNeedsInlineStyles
          ? html`<style>
              ${dropdownMenuPortalStyles.cssText}
            </style>`
          : nothing}
        ${this.renderMenu()}
      `,
      host,
    );
    this.popupEl = host.querySelector<HTMLElement>(".ids-dd-popup");
    this.stripTooltipTabStops(host);
    this.observeAnchors();
    this.positionPortal();
    this.syncScrollbars();

    if (!wasOpen) {
      requestAnimationFrame(() => {
        this.positionPortal();
        this.syncScrollbars();
        if (this.focusOnOpen && this.menuOpen) {
          this.focusOnOpen = false;
          this.focusMenuEntry();
        }
      });
    }
  }

  private get anchorEl(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(".shell");
  }

  private observeAnchors(): void {
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.positionPortal();
        this.syncScrollbars();
      });
    }
    this.resizeObserver.disconnect();
    const anchor = this.anchorEl;
    if (anchor) this.resizeObserver.observe(anchor);
    if (this.popupEl) this.resizeObserver.observe(this.popupEl);
  }

  /** Attach to the trigger (sideOffset −1), flip above when it does not fit below. */
  private positionPortal(): void {
    const popup = this.popupEl;
    const positioner = popup?.parentElement as HTMLElement | null | undefined;
    const anchor = this.anchorEl;
    if (!popup || !positioner || !anchor) return;

    const rect = anchor.getBoundingClientRect();
    popup.style.setProperty("--dropdown-trigger-width", `${rect.width}px`);

    const width = popup.offsetWidth;
    const height = popup.offsetHeight;
    const margin = DROPDOWN_VIEWPORT_MARGIN;

    let top = rect.bottom + DROPDOWN_SIDE_OFFSET;
    let side: "bottom" | "top" = "bottom";
    if (top + height > window.innerHeight - margin) {
      const above = rect.top - height - DROPDOWN_SIDE_OFFSET;
      if (above >= margin) {
        top = above;
        side = "top";
      }
    }

    // Cross axis stays glued to the trigger's left edge; only clamp to the viewport.
    let left = rect.left;
    if (left + width > window.innerWidth - margin) {
      left = Math.max(0, window.innerWidth - margin - width);
    }

    positioner.style.top = `${Math.round(top)}px`;
    positioner.style.left = `${Math.round(left)}px`;
    positioner.dataset.side = side;
    positioner.style.visibility = "visible";
  }

  /** Overlay scrollbar (React: Base UI ScrollArea) — thumb tracks the viewport. */
  private syncScrollbars(): void {
    const root = this.portalEl;
    if (!root) return;
    root
      .querySelectorAll<HTMLElement>(
        ".ids-dd-optionsScrollRoot, .ids-dd-showSelectedTagsRoot",
      )
      .forEach((scrollRoot) => {
        const viewport = scrollRoot.querySelector<HTMLElement>("[data-scroll-viewport]");
        const track = scrollRoot.querySelector<HTMLElement>(".ids-dd-optionsScrollbar");
        const thumb = scrollRoot.querySelector<HTMLElement>(".ids-dd-optionsScrollThumb");
        if (!viewport || !track || !thumb) return;
        const update = () => {
          const { scrollHeight, clientHeight, scrollTop } = viewport;
          if (scrollHeight <= clientHeight + 1) {
            track.hidden = true;
            return;
          }
          track.hidden = false;
          const trackHeight = track.clientHeight;
          const thumbHeight = Math.max(
            20,
            (trackHeight * clientHeight) / scrollHeight,
          );
          const maxTop = trackHeight - thumbHeight;
          const top = (maxTop * scrollTop) / (scrollHeight - clientHeight);
          thumb.style.height = `${thumbHeight}px`;
          thumb.style.transform = `translateY(${top}px)`;
        };
        if (!this.scrollbarViewports.has(viewport)) {
          this.scrollbarViewports.add(viewport);
          viewport.addEventListener("scroll", update, { passive: true });
        }
        update();
      });
  }

  private scrollOptionsToTop(): void {
    this.popupEl
      ?.querySelector<HTMLElement>("[data-options-viewport]")
      ?.scrollTo({ top: 0 });
  }

  /* ------------------------------------------------------------------ *
   * Menu rendering (port of React `DropdownMenu`)
   * ------------------------------------------------------------------ */

  private renderOptionLabel(item: IdsDropdownMenuItem): TemplateResult {
    return html`
      <ids-tooltip
        side="right"
        arrowalign="start"
        hugcontent
        trigger-display="block"
        .open=${this.optionTooltipId === item.id}
        @ids-tooltip-open-change=${(event: Event) =>
          this.onOptionTooltipChange(event, item.id)}
      >
        <ids-tooltip-trigger display="block" class="ids-dd-triggerBlock">
          <span class="ids-dd-itemLabel">${item.label}</span>
        </ids-tooltip-trigger>
        <ids-tooltip-panel>
          <ids-tooltip-body>${item.label}</ids-tooltip-body>
        </ids-tooltip-panel>
      </ids-tooltip>
    `;
  }

  private renderMenuItem(
    item: IdsDropdownMenuItem,
    selected: string[],
  ): TemplateResult {
    if (item.kind === "section") {
      return html`<div class="ids-dd-sectionHeader" role="presentation">${item.label}</div>`;
    }
    if (item.kind === "divider") {
      return html`<div class="ids-dd-sectionDivider" role="presentation"></div>`;
    }
    const multi = this.isMulti;
    const isSelected = selected.includes(item.id);
    return html`
      <button
        type="button"
        class="ids-dd-item"
        ?disabled=${item.disabled}
        data-disabled=${ifDefined(item.disabled ? "true" : undefined)}
        data-selectable="true"
        data-selection-mode=${this.selectionMode}
        data-selected=${ifDefined(isSelected ? "true" : undefined)}
        role=${multi ? "menuitemcheckbox" : "menuitemradio"}
        aria-checked=${isSelected ? "true" : "false"}
        @click=${() => {
          if (item.disabled) return;
          this.selectItem(item.id);
          // Multi-select keeps the menu open; single closes and returns focus to the trigger.
          if (!multi) this.closeAndFocusTrigger();
        }}
      >
        ${multi
          ? html`<span class="ids-dd-leadingControl" aria-hidden="true"
              ><span class="ids-dd-checkboxOuter"
                >${isSelected
                  ? html`<span class="ids-dd-checkboxTick"></span>`
                  : nothing}</span
              ></span
            >`
          : this.menuShowRadio
            ? html`<span class="ids-dd-leadingControl" aria-hidden="true"
                ><span class="ids-dd-radioOuter"
                  >${isSelected
                    ? html`<span class="ids-dd-radioInner"></span>`
                    : nothing}</span
                ></span
              >`
            : nothing}
        ${this.renderOptionLabel(item)}
      </button>
    `;
  }

  private renderShowSelectedPanel(
    selected: string[],
    idToLabel: Map<string, string>,
  ): TemplateResult {
    const expanded = this.isShowSelectedExpanded;
    return html`
      <div
        class="ids-dd-showSelectedPanel"
        data-expanded=${ifDefined(expanded ? "true" : undefined)}
        data-focus-section="showSelected"
      >
        <div class="ids-dd-showSelectedHeader">
          <button
            type="button"
            class="ids-dd-showSelectedToggle"
            aria-expanded=${expanded ? "true" : "false"}
            @click=${() => this.toggleShowSelected()}
          >
            <span>${expanded ? "Hide Selected" : "Show Selected"}</span>
            <ids-icon
              class="ids-dd-showSelectedCaret"
              shape=${DROPDOWN_CARET_ICON_SLUG}
              color="var(--color-icon-brand-base)"
              size="10"
            ></ids-icon>
          </button>
        </div>
        ${expanded
          ? html`
              <div class="ids-dd-showSelectedTagsRoot">
                <div
                  class="ids-dd-showSelectedTags"
                  data-scroll-viewport
                  data-focus-row="showSelectedTags"
                  tabindex="-1"
                >
                  ${repeat(
                    selected,
                    (id) => id,
                    (id) => {
                      const text = idToLabel.get(id) ?? id;
                      return html`
                        <span class="ids-dd-tag" data-ids="ids-tag">
                          <span class="ids-dd-tagField" data-ids="ids-tag-editable-field">
                            <span class="ids-dd-tagLabel" data-ids="ids-tag-label">${text}</span>
                          </span>
                          <button
                            type="button"
                            class="ids-dd-tagClose"
                            data-ids="ids-tag-close"
                            aria-label=${`Remove ${text}`}
                            @click=${() => this.handleRemoveTag(id)}
                          >
                            <ids-icon
                              shape=${DROPDOWN_TAG_CLOSE_ICON_SLUG}
                              size="10"
                              color="currentColor"
                            ></ids-icon>
                          </button>
                        </span>
                      `;
                    },
                  )}
                </div>
                <div class="ids-dd-optionsScrollbar">
                  <div class="ids-dd-optionsScrollThumb"></div>
                </div>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private renderSearchRow(visibleGhost: string): TemplateResult {
    const query = this.searchQuery;
    return html`
      <div class="ids-dd-searchRow">
        <div
          class="ids-dd-searchField"
          data-focus-visible=${ifDefined(this.searchFocusVisible ? "true" : undefined)}
        >
          <span class="ids-dd-searchIcon" aria-hidden="true">
            <ids-icon
              shape=${DROPDOWN_SEARCH_ICON_SLUG}
              size="16"
              color="var(--color-icon-brand-base)"
            ></ids-icon>
          </span>
          <div class="ids-dd-searchInputWrap">
            <div class="ids-dd-searchInputBox">
              <input
                class="ids-dd-searchInput"
                type="text"
                .value=${live(query)}
                placeholder="Search"
                @pointerdown=${() => {
                  this.searchPointerDown = true;
                }}
                @focus=${() => {
                  // Keyboard focus (Tab) shows the ring; a pointer press that just moved focus here does not.
                  this.searchFocusVisible = !this.searchPointerDown;
                  this.searchPointerDown = false;
                }}
                @blur=${() => {
                  this.searchFocusVisible = false;
                  this.searchPointerDown = false;
                }}
                @input=${this.onSearchInput}
                @compositionend=${this.onSearchCompositionEnd}
                @keydown=${this.onSearchKeyDown}
              />
              ${visibleGhost
                ? html`<span class="ids-dd-searchGhost" aria-hidden="true"
                    ><span class="ids-dd-searchGhostTyped">${query}</span
                    ><span class="ids-dd-searchGhostSuffix">${visibleGhost}</span></span
                  >`
                : nothing}
            </div>
            ${query.length > 0
              ? html`<button
                  type="button"
                  class="ids-dd-searchClearButton"
                  aria-label="Clear search"
                  tabindex="-1"
                  @click=${() => {
                    this.setSearch("");
                    this.ghostSuffix = "";
                  }}
                >
                  <ids-icon
                    class="ids-dd-searchClearIcon"
                    shape=${DROPDOWN_SEARCH_CLEAR_ICON_SLUG}
                    size="12"
                    color="var(--color-icon-gray-neutral-accessible)"
                  ></ids-icon>
                </button>`
              : nothing}
          </div>
        </div>
      </div>
    `;
  }

  private renderMenu(): TemplateResult {
    const items = this.menuItems();
    const query = this.searchQuery;
    const hasQuery = query.trim().length > 0;
    const displayed = filterMenuItems(items, query, this.searchable);
    const showNoResults = this.searchable && hasQuery && displayed.length === 0;
    const idToLabel = this.idToLabel();
    const selected = this.getSelectedIds();
    const multi = this.isMulti;
    const maxVisible = this.maxVisibleItems > 0
      ? this.maxVisibleItems
      : DROPDOWN_DEFAULT_MAX_VISIBLE_ITEMS;

    const optionRowCount = displayed.filter(
      (item) => item.kind !== "section" && item.kind !== "divider",
    ).length;
    const scrollRegionStyle =
      optionRowCount > maxVisible
        ? { maxHeight: `${maxVisible * DROPDOWN_OPTION_ROW_HEIGHT}px`, overflowY: "auto" }
        : {};

    // Select All / Clear All: always visible when not searching; while searching
    // only when at least 2 options match.
    const showSelectAllRow =
      multi && this.menuShowSelectAllClearAll && (!hasQuery || optionRowCount >= 2);

    const visibleSelectableIds = displayed
      .filter((item) => item.selectable)
      .map((item) => item.id);
    const enabledIds = items
      .filter((item) => item.selectable && !item.disabled)
      .map((item) => item.id);
    const allVisibleSelected =
      visibleSelectableIds.length > 0 &&
      visibleSelectableIds.every((id) => selected.includes(id));
    const someVisibleSelected = visibleSelectableIds.some((id) => selected.includes(id));
    const globalAllChecked =
      enabledIds.length > 0 && enabledIds.every((id) => selected.includes(id));
    const selectAllChecked = hasQuery ? allVisibleSelected : globalAllChecked;
    const selectAllIndeterminate = hasQuery
      ? someVisibleSelected && !allVisibleSelected
      : selected.length > 0 &&
        !globalAllChecked &&
        enabledIds.some((id) => selected.includes(id));
    const clearAllDisabled = hasQuery
      ? !someVisibleSelected
      : this.clearAllDisabledDefault();

    // Combo box popup min-height (Figma): search only 212px; search + Select All row 252px.
    const popupMinHeight = this.searchable
      ? showSelectAllRow
        ? DROPDOWN_SEARCH_SELECT_ALL_MIN_HEIGHT
        : DROPDOWN_SEARCH_MIN_HEIGHT
      : undefined;

    const visibleGhost =
      this.ghostSuffix && this.ghostFor(query) === this.ghostSuffix
        ? this.ghostSuffix
        : "";

    const showSelectedPanelNode =
      multi && this.menuShowSelectedPanel && selected.length > 0 && !showNoResults
        ? this.renderShowSelectedPanel(selected, idToLabel)
        : nothing;

    const footer = this.menuFooter;
    const contentWidth = this.resolvedMenuWidth === "content";

    return html`
      <div
        class="ids-dd-positioner"
        style="visibility:hidden"
        @keydown=${this.onPopupKeyDown}
      >
        <div
          class=${contentWidth ? "ids-dd-popup ids-dd-popupContentWidth" : "ids-dd-popup"}
          id=${this.listboxId}
          role="listbox"
          tabindex="-1"
          style=${styleMap(
            popupMinHeight ? { minHeight: `${popupMinHeight}px` } : {},
          )}
          @keydown=${this.popupKeyDownCapture}
        >
          ${this.searchable ? this.renderSearchRow(visibleGhost) : nothing}
          <div class="ids-dd-menuControls">
            ${showSelectedPanelNode}
            ${showSelectAllRow
              ? html`
                  <div
                    class="ids-dd-selectAllClearAllRow"
                    data-focus-section="selectAllClearAll"
                  >
                    <button
                      type="button"
                      class="ids-dd-selectAllButton"
                      data-checked=${ifDefined(selectAllChecked ? "true" : undefined)}
                      data-indeterminate=${ifDefined(
                        selectAllIndeterminate ? "true" : undefined,
                      )}
                      @click=${() =>
                        this.handleSelectAll(hasQuery ? visibleSelectableIds : undefined)}
                    >
                      <span
                        class="ids-dd-checkboxOuter ids-dd-selectAllCheckbox"
                        aria-hidden="true"
                      >
                        ${selectAllIndeterminate
                          ? html`<span class="ids-dd-checkboxDash"></span>`
                          : selectAllChecked
                            ? html`<span class="ids-dd-checkboxTick"></span>`
                            : nothing}
                      </span>
                      <span>${this.menuSelectAllLabel}</span>
                    </button>
                    <button
                      type="button"
                      class="ids-dd-clearAllButton"
                      data-focus-row="selectAllClearAll"
                      ?disabled=${clearAllDisabled}
                      @click=${(event: Event) => {
                        // Clear All keeps the menu open. Clearing disables this button,
                        // which would drop focus to <body>: park focus on the popup, then
                        // hand it back to Clear All or, once disabled, to Select All.
                        const clearAll = event.currentTarget as HTMLButtonElement;
                        const selectAll =
                          clearAll.previousElementSibling as HTMLElement | null;
                        this.popupEl?.focus();
                        this.handleClearAll(hasQuery ? visibleSelectableIds : undefined);
                        this.scrollOptionsToTop();
                        requestAnimationFrame(() =>
                          (clearAll.isConnected && !clearAll.disabled
                            ? clearAll
                            : selectAll
                          )?.focus(),
                        );
                      }}
                    >
                      ${this.menuClearAllLabel}
                    </button>
                  </div>
                `
              : nothing}
          </div>
          <div class="ids-dd-optionsScrollRoot" data-focus-section="options">
            <div
              class="ids-dd-optionsScrollViewport"
              data-options-viewport="true"
              data-scroll-viewport
              tabindex="-1"
              style=${styleMap(scrollRegionStyle)}
            >
              ${showNoResults
                ? html`<div class="ids-dd-noResults" role="presentation">
                    ${this.noResultsLabel}
                  </div>`
                : nothing}
              ${repeat(
                displayed,
                (item, index) => `${item.id}:${index}`,
                (item) => this.renderMenuItem(item, selected),
              )}
            </div>
            <div class="ids-dd-optionsScrollbar">
              <div class="ids-dd-optionsScrollThumb"></div>
            </div>
          </div>
          ${footer
            ? html`<button
                type="button"
                class="ids-dd-footerAction"
                data-focus-section="footer"
                @click=${() => footer.onClick()}
              >
                <span class="ids-dd-footerActionButton">${footer.label}</span>
              </button>`
            : nothing}
        </div>
      </div>
    `;
  }

  /* ------------------------------------------------------------------ *
   * Host rendering (label + trigger shell + helper / error)
   * ------------------------------------------------------------------ */

  override render(): TemplateResult {
    const size = this.resolvedSize;
    const ids = this.dataIds;
    const labels = this.selectedLabels();
    const hasSelection = labels.length > 0;
    const hasError = Boolean(this.errorText);
    const hasHelper = !hasError && Boolean(this.helperText);
    const hasMessage = hasError || hasHelper;
    // A disabled dropdown showing an empty selection must NOT display the required asterisk.
    const showRequiredMark = this.required && !(this.disabled && !hasSelection);
    const options = this.options ?? [];

    return html`
      <div
        class="root"
        data-ids=${ids.container}
        data-mode=${ifDefined(this.dataMode)}
        data-size=${size}
        data-full-width=${ifDefined(this.fullWidth ? "true" : undefined)}
        data-disabled=${ifDefined(this.disabled ? "true" : undefined)}
        data-invalid=${ifDefined(hasError ? "true" : undefined)}
      >
        <div class="fieldRow" data-ids=${ids.fieldRow}>
          ${this.label
            ? html`<label
                class="label"
                for=${this.triggerId}
                data-size=${ifDefined(size === "small" ? "small" : undefined)}
                data-ids=${ids.label}
                @click=${() => this.triggerEl?.focus()}
                >${this.label}${showRequiredMark
                  ? html`<span aria-hidden="true">*</span>`
                  : nothing}</label
              >`
            : nothing}
          <div
            class="field"
            data-ids=${ids.field}
            data-full-width=${ifDefined(this.fullWidth ? "true" : undefined)}
          >
            <div
              class="trigger"
              id=${this.triggerId}
              role="combobox"
              tabindex=${this.disabled ? "-1" : "0"}
              aria-haspopup="listbox"
              aria-expanded=${this.menuOpen ? "true" : "false"}
              aria-controls=${this.listboxId}
              aria-describedby=${ifDefined(hasMessage ? this.messageId : undefined)}
              aria-invalid=${ifDefined(hasError ? "true" : undefined)}
              aria-label=${ifDefined(this.label || undefined)}
              aria-required=${ifDefined(this.required ? "true" : undefined)}
              aria-disabled=${ifDefined(this.disabled ? "true" : undefined)}
              data-full-width=${ifDefined(this.fullWidth ? "true" : undefined)}
              @click=${this.onTriggerClick}
              @keydown=${this.onTriggerKeyDown}
            >
              <span class="triggerMeasure">
                <span
                  class="shell"
                  data-size=${ifDefined(size === "small" ? "small" : undefined)}
                  data-disabled=${ifDefined(this.disabled ? "true" : undefined)}
                  data-error=${ifDefined(hasError ? "true" : undefined)}
                  data-filled=${ifDefined(hasSelection ? "true" : undefined)}
                  data-full-width=${ifDefined(this.fullWidth ? "true" : undefined)}
                >
                  <span class="main">${this.renderFieldContent()}</span>
                  <span class="caretWrap" aria-hidden="true">
                    <ids-icon shape=${DROPDOWN_CARET_ICON_SLUG} size="10"></ids-icon>
                  </span>
                </span>
              </span>
            </div>
            <div class="optionsSlot" data-ids=${ids.options} hidden>
              ${options.map(
                (opt) => html`<div
                  data-ids=${ids.option}
                  data-option-id=${opt.id}
                  data-kind=${opt.kind ?? "option"}
                  data-disabled=${ifDefined(opt.disabled ? "true" : undefined)}
                >
                  ${opt.label}
                </div>`,
              )}
            </div>
            ${hasError
              ? html`<div
                  class="error"
                  id=${this.messageId}
                  data-ids="ids-error"
                  data-disabled=${ifDefined(this.disabled ? "true" : undefined)}
                >
                  <ids-icon
                    shape=${DROPDOWN_ERROR_ICON_SLUG}
                    variant="img"
                    size="16"
                  ></ids-icon>
                  <span class="errorText" data-ids="ids-error-text">${this.errorText}</span>
                </div>`
              : hasHelper
                ? html`<div
                    class="helper"
                    id=${this.messageId}
                    data-ids="ids-helper"
                    data-disabled=${ifDefined(this.disabled ? "true" : undefined)}
                  >
                    <span class="helperText" data-ids="ids-helper-text"
                      >${this.helperText}</span
                    >
                  </div>`
                : nothing}
          </div>
        </div>
      </div>
    `;
  }
}
