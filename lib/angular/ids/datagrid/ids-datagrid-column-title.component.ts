import { Component, ElementRef } from "@angular/core";

/** Column header label slot — projected into `ids-datagrid-column`. */
@Component({
  selector: "ids-datagrid-column-title",
  standalone: true,
  template: `<ng-content />`,
  styles: [":host { display: none; }"],
})
export class IdsDatagridColumnTitleComponent {
  constructor(private readonly host: ElementRef<HTMLElement>) {}

  get text(): string {
    return this.host.nativeElement.textContent?.trim() ?? "";
  }
}
