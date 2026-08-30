import { Component } from "@angular/core";

/** Row collection slot — projected children are data-only (`ids-datagrid-row`). */
@Component({
  selector: "ids-datagrid-body",
  standalone: true,
  template: `<ng-content />`,
  styles: [":host { display: none; }"],
})
export class IdsDatagridBodyComponent {}
