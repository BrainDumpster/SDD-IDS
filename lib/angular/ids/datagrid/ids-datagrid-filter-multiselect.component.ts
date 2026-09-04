import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IdsCheckboxComponent } from "../checkbox/ids-checkbox.component";

@Component({
  selector: "ids-datagrid-filter-multiselect",
  standalone: true,
  imports: [IdsCheckboxComponent],
  template: `
    <div class="filterMultiselectPanel">
      @for (option of options; track option) {
        <div class="filterOptionRow">
          <ids-checkbox
            [label]="option"
            [checked]="isSelected(option)"
            density="datagrid"
            (checkedChange)="onToggle(option, $event)"
          />
        </div>
      }
    </div>
  `,
  styles: [
    `
      .filterMultiselectPanel {
        display: flex;
        flex-direction: column;
        gap: 0;
        padding: 0;
        width: 100%;
        box-sizing: border-box;
        background: var(--color-background-surface-component);
      }

      .filterOptionRow {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 40px;
        padding: var(--padding-padding-10) var(--padding-padding-16);
        box-sizing: border-box;
        background: var(--color-background-surface-component);
        transition: background 80ms ease;
        cursor: pointer;
      }

      .filterOptionRow:hover {
        background: var(--color-background-brand-lighter-slate);
        box-shadow:
          inset 0 1px 0 0 var(--color-border-brand-base-neutral),
          inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
      }

      .filterOptionRow:active {
        background: var(--color-background-brand-light-slate);
        box-shadow:
          inset 0 1px 0 0 var(--color-border-brand-base-neutral),
          inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
      }

      .filterOptionRow ids-checkbox {
        display: flex;
        width: 100%;
      }
    `,
  ],
})
export class IdsDatagridFilterMultiselectComponent {
  @Input() options: string[] = [];
  @Input() selectedValues: string[] = [];
  @Input() groupLabel = "Filter";

  @Output() readonly selectedValuesChange = new EventEmitter<string[]>();

  isSelected(option: string): boolean {
    return this.selectedValues.includes(option);
  }

  onToggle(option: string, checked: boolean): void {
    const next = new Set(this.selectedValues);
    if (checked) {
      next.add(option);
    } else {
      next.delete(option);
    }
    this.selectedValuesChange.emit([...next]);
  }
}
