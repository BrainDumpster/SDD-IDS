import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IdsIconComponent } from "../icon/ids-icon.component";

@Component({
  selector: "ids-datagrid-filter-search-field",
  standalone: true,
  imports: [FormsModule, IdsIconComponent],
  template: `
    <div class="filterPopupSearchWrap">
      <div class="filterPopupSearchRow">
        <ids-icon shapeName="search-16" className="filterPopupSearchIcon" [size]="16" />
        <input
          type="search"
          class="filterPopupSearchInput"
          [placeholder]="placeholder"
          [attr.aria-label]="ariaLabel"
          [ngModel]="query"
          (ngModelChange)="onQueryChange($event)"
        />
        @if (query.trim()) {
          <button
            type="button"
            class="filterPopupSearchClear"
            aria-label="Clear search"
            (click)="onQueryChange('')"
          >
            <ids-icon shapeName="ctrl-close-16" className="filterPopupSearchClearIcon" [size]="12" />
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .filterPopupSearchWrap {
        padding: 6px 16px;
        box-sizing: border-box;
      }
    `,
  ],
})
export class IdsDatagridFilterSearchFieldComponent {
  @Input() placeholder = "Search";
  @Input({ required: true }) ariaLabel!: string;
  @Input() query = "";

  @Output() readonly queryChange = new EventEmitter<string>();

  onQueryChange(value: string): void {
    this.queryChange.emit(value);
  }
}
