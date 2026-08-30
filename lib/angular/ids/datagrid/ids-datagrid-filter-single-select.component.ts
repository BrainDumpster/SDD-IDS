import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "ids-datagrid-filter-single-select",
  standalone: true,
  template: `
    <div class="filterSingleSelectPanel" role="listbox" [attr.aria-label]="ariaLabel">
      <button type="button" class="filterOption" [class.filterOptionSelected]="selectedValue === null" (click)="select(null)">
        All
      </button>
      @for (option of options; track option) {
        <button
          type="button"
          class="filterOption"
          role="option"
          [class.filterOptionSelected]="selectedValue === option"
          [attr.aria-selected]="selectedValue === option"
          (click)="select(option)"
        >
          {{ option }}
        </button>
      }
    </div>
  `,
  styles: [
    `
      .filterSingleSelectPanel {
        display: flex;
        flex-direction: column;
        min-width: 160px;
        max-height: 240px;
        overflow-y: auto;
        padding: 4px 0;
        box-sizing: border-box;
      }

      .filterOption {
        border: none;
        background: transparent;
        text-align: left;
        padding: 6px 16px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: var(--color-text-gray-neutral-strong);
        cursor: pointer;
      }

      .filterOption:hover {
        background: var(--color-background-brand-lighter-slate);
      }

      .filterOptionSelected {
        color: var(--color-text-brand-strong);
        background: var(--color-background-brand-lighter-slate);
      }
    `,
  ],
})
export class IdsDatagridFilterSingleSelectComponent {
  @Input() options: string[] = [];
  @Input() selectedValue: string | null = null;
  @Input() ariaLabel = "Filter options";

  @Output() readonly selectedValueChange = new EventEmitter<string | null>();

  select(value: string | null): void {
    this.selectedValueChange.emit(value);
  }
}
