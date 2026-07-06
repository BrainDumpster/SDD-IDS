import { Component } from "@angular/core";

/** Optional footer slot — pagination is grid-owned below the scroll clip. */
@Component({
  selector: "ids-datagrid-footer",
  standalone: true,
  template: `<ng-content />`,
})
export class IdsDatagridFooterComponent {}
