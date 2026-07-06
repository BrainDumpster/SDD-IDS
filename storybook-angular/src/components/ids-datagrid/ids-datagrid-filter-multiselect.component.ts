import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IdsCheckboxComponent } from "../ids-checkbox/ids-checkbox.component";

@Component({
  selector: "ids-datagrid-filter-multiselect",
  standalone: true,
  imports: [IdsCheckboxComponent],
  template: `
    <div class="filterMultiselectPanel">
      @for (option of options; track option) {
        <ids-checkbox
          [label]="option"
          [checked]="isSelected(option)"
          density="datagrid"
          (checkedChange)="onToggle(option, $event)"
        />
      }
    </div>
  `,
  styles: [
    `
      .filterMultiselectPanel {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-space-8);
        padding: 6px 16px;
        box-sizing: border-box;
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
