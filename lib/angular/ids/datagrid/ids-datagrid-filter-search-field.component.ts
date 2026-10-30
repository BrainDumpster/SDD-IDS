import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IdsIconComponent } from "../icon/ids-icon.component";

@Component({
  selector: "ids-datagrid-filter-search-field",
  standalone: true,
  imports: [FormsModule, IdsIconComponent],
  template: `
    <div class="searchRow">
      <div class="searchField" [attr.data-focus-visible]="searchFocused ? 'true' : null">
        <ids-icon shapeName="search-16" className="searchIcon" [size]="16" />
        <div class="searchInputWrap">
          <input
            type="search"
            class="searchInput"
            [placeholder]="placeholder"
            [attr.aria-label]="ariaLabel"
            [ngModel]="query"
            (ngModelChange)="onQueryChange($event)"
            (focus)="searchFocused = true"
            (blur)="searchFocused = false"
          />
          @if (query.trim()) {
            <button
              type="button"
              class="searchClear"
              aria-label="Clear search"
              (click)="onQueryChange('')"
            >
              <ids-icon shapeName="ctrl-close-16" className="searchClearIcon" [size]="12" />
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .searchRow {
        padding: var(--padding-padding-8);
        width: 100%;
        box-sizing: border-box;
      }

      .searchField {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        border: var(--border-width-border-default, 1px) solid var(--color-border-gray-neutral-base);
        background: var(--color-background-surface-component);
        padding: var(--padding-padding-2) var(--padding-padding-16);
      }

      .searchField[data-focus-visible="true"]::after {
        content: "";
        position: absolute;
        inset: -4px;
        border: var(--border-width-border-default) solid var(--color-border-brand-base);
        border-radius: var(--corner-radius-radius-4);
        pointer-events: none;
      }

      .searchIcon {
        flex-shrink: 0;
        display: inline-flex;
        width: 16px;
        height: 16px;
        color: var(--color-icon-brand-base);
      }

      .searchInputWrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1 1 auto;
        min-width: 0;
        gap: var(--spacing-space-8);
        padding-left: var(--padding-padding-8);
        padding-top: var(--padding-padding-4);
        padding-bottom: var(--padding-padding-4);
      }

      .searchInput {
        all: unset;
        flex: 1 1 auto;
        min-width: 0;
        font-size: var(--font-size-body-2);
        font-weight: 400;
        line-height: var(--font-line-height-line-height-20);
        color: var(--color-text-gray-neutral);
      }

      .searchInput::placeholder {
        color: var(--color-text-gray-neutral);
        font-weight: 400;
      }

      .searchClear {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 12px;
        height: 12px;
        flex-shrink: 0;
        cursor: pointer;
        color: var(--color-icon-gray-neutral-accessible);
      }

      .searchClear:focus-visible {
        outline: var(--border-width-border-default, 1px) solid var(--color-border-brand-base);
        outline-offset: 1px;
      }

      .searchClearIcon {
        display: block;
        color: inherit;
      }
    `,
  ],
})
export class IdsDatagridFilterSearchFieldComponent {
  @Input() placeholder = "Search";
  @Input({ required: true }) ariaLabel!: string;
  @Input() query = "";

  @Output() readonly queryChange = new EventEmitter<string>();

  searchFocused = false;

  onQueryChange(value: string): void {
    this.queryChange.emit(value);
  }
}
