import { Component, ContentChildren, Input, OnDestroy, OnInit, QueryList, inject } from "@angular/core";
import { IDS_DATAGRID_CONTEXT } from "./ids-datagrid-context";
import { IdsDatagridCellComponent } from "./ids-datagrid-cell.component";

@Component({
  selector: "ids-datagrid-row",
  standalone: true,
  template: `<ng-content />`,
})
export class IdsDatagridRowComponent implements OnInit, OnDestroy {
  private readonly grid = inject(IDS_DATAGRID_CONTEXT);

  @Input({ required: true }) rowId!: string;

  @ContentChildren(IdsDatagridCellComponent)
  cellQuery!: QueryList<IdsDatagridCellComponent>;

  ngOnInit(): void {
    this.grid.registerRow({ rowId: this.rowId, cells: new Map() });
  }

  ngOnDestroy(): void {
    this.grid.unregisterRow(this.rowId);
  }
}
