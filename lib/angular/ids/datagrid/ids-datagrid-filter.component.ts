import { Component, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: "ids-datagrid-filter",
  standalone: true,
  template: `<ng-template #filterTemplate><ng-content /></ng-template>`,
})
export class IdsDatagridFilterComponent {
  @ViewChild("filterTemplate", { static: true }) template!: TemplateRef<unknown>;
}
