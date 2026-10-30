import { Component, ViewEncapsulation } from "@angular/core";

/** Datagrid-owned detail-panel slot — sibling of the grid wrap, not a table column. */
@Component({
  selector: "ids-datagrid-detail-panel",
  standalone: true,
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "detailPanel",
    style: "display:flex;align-self:stretch;min-height:0;height:auto;",
  },
})
export class IdsDatagridDetailPanelComponent {}
