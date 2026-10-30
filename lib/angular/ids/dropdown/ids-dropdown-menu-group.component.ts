import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  inject,
} from "@angular/core";
import { IdsDropdownMenuItemComponent } from "./ids-dropdown-menu-item.component";
import type { IdsDropdownMenuItemModel } from "./ids-dropdown.types";

@Component({
  selector: "ids-dropdown-menu-group",
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDropdownMenuGroupComponent implements AfterContentInit {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) groupName!: string;

  @ContentChildren(IdsDropdownMenuItemComponent)
  itemQuery!: QueryList<IdsDropdownMenuItemComponent>;

  items: IdsDropdownMenuItemComponent[] = [];

  ngAfterContentInit(): void {
    this.bindItems();
    this.itemQuery.changes.subscribe(() => this.bindItems());
  }

  private bindItems(): void {
    this.items = this.itemQuery.toArray();
  }

  toMenuModels(): IdsDropdownMenuItemModel[] {
    const header: IdsDropdownMenuItemModel = {
      id: `section-${this.groupName}`,
      label: this.groupName,
      kind: "section",
    };
    return [header, ...this.items.map((item) => item.toMenuModel())];
  }
}
