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
        width: 100%;
        min-width: 160px;
        max-height: 366px;
        overflow-y: auto;
        padding: 0 0 var(--padding-padding-4);
        box-sizing: border-box;
        background: var(--color-background-surface-component);
      }

      .filterOption {
        appearance: none;
        -webkit-appearance: none;
        border: none;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 40px;
        text-align: left;
        padding: var(--padding-padding-10) var(--padding-padding-16);
        font-size: var(--font-size-body-2);
        font-weight: 400;
        line-height: var(--font-line-height-line-height-20);
        color: var(--color-text-gray-neutral);
        background: var(--color-background-surface-component);
        cursor: pointer;
        box-sizing: border-box;
        transition: background 80ms ease;
      }

      .filterOption:hover {
        background: var(--color-background-brand-lighter-slate);
        box-shadow:
          inset 0 1px 0 0 var(--color-border-brand-base-neutral),
          inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
      }

      .filterOption:active,
      .filterOptionSelected {
        background: var(--color-background-brand-light-slate);
        color: var(--color-text-brand-strong);
        box-shadow:
          inset 0 1px 0 0 var(--color-border-brand-base-neutral),
          inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
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
