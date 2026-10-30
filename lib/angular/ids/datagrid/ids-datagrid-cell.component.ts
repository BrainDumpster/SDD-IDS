import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from "@angular/core";
import { IDS_DATAGRID_CONTEXT } from "./ids-datagrid-context";
import { IdsDatagridRowComponent } from "./ids-datagrid-row.component";

@Component({
  selector: "ids-datagrid-cell",
  standalone: true,
  template: `<ng-content>{{ value }}</ng-content>`,
})
export class IdsDatagridCellComponent implements OnChanges {
  private readonly grid = inject(IDS_DATAGRID_CONTEXT);
  private readonly row = inject(IdsDatagridRowComponent);

  @Input({ required: true }) field!: string;
  @Input() value: string | number = "";

  ngOnChanges(_changes: SimpleChanges): void {
    this.sync();
  }

  private sync(): void {
    this.grid.setRowCell(this.row.rowId, this.field, String(this.value ?? ""));
  }
}
