import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { IdsCheckboxComponent } from "../ids-checkbox/ids-checkbox.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import type { IdsDatagridColumnModel } from "./ids-datagrid-context";

@Component({
  selector: "ids-datagrid-column-visibility-panel",
  standalone: true,
  imports: [IdsCheckboxComponent, IdsIconComponent],
  templateUrl: "./ids-datagrid-column-visibility-panel.component.html",
  styleUrl: "./ids-datagrid-column-visibility-panel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDatagridColumnVisibilityPanelComponent {
  @Input({ required: true }) hideableColumns: IdsDatagridColumnModel[] = [];
  @Input() hiddenColumnKeys = new Set<string>();
  @Input() validationMessage: string | null = null;

  @Output() readonly columnVisibilityChange = new EventEmitter<{
    field: string;
    visible: boolean;
  }>();

  onVisibilityChange(field: string, visible: boolean): void {
    this.columnVisibilityChange.emit({ field, visible });
  }
}
