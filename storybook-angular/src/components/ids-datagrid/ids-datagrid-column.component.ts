import {
  AfterContentInit,
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from "@angular/core";
import { IDS_DATAGRID_CONTEXT } from "./ids-datagrid-context";
import { IdsDatagridFilterComponent } from "./ids-datagrid-filter.component";

@Component({
  selector: "ids-datagrid-column",
  standalone: true,
  template: `<ng-content />`,
})
export class IdsDatagridColumnComponent implements AfterContentInit, OnChanges, OnDestroy {
  private readonly grid = inject(IDS_DATAGRID_CONTEXT);

  @Input({ alias: "field", required: true }) key!: string;
  @Input({ required: true }) title!: string;
  @Input() minWidth?: number;
  @Input() width?: number;
  @Input() sortable = false;
  @Input() filterable = false;
  @Input() filterActive = false;
  @Input() columnHideable = false;

  @ContentChild(IdsDatagridFilterComponent)
  filterChild?: IdsDatagridFilterComponent;

  ngAfterContentInit(): void {
    this.syncColumn();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.syncColumn();
  }

  ngOnDestroy(): void {
    this.grid.unregisterColumn(this.key);
  }

  syncRegistration(): void {
    this.syncColumn();
  }

  private syncColumn(): void {
    this.grid.registerColumn({
      field: this.key,
      title: this.title,
      minWidth: this.minWidth,
      width: this.width,
      sortable: this.sortable,
      filterable: this.filterable,
      filterActive: this.filterActive,
      columnHideable: this.columnHideable,
      filterTemplate: this.filterChild?.template ?? null,
    });
  }
}
