import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  QueryList,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { IDS_DROPDOWN_BUTTON_CONTEXT, type IdsDropdownButtonMenuApi } from "./ids-dropdown-button-context";
import { IdsDropdownButtonMenuItemComponent } from "./ids-dropdown-button-menu-item.component";

let nextMenuId = 0;

@Component({
  selector: "ids-dropdown-button-menu",
  standalone: true,
  templateUrl: "./ids-dropdown-button-menu.component.html",
  styleUrl: "./ids-dropdown-button-menu.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDropdownButtonMenuComponent implements AfterContentInit, IdsDropdownButtonMenuApi {
  readonly dropdown = inject(IDS_DROPDOWN_BUTTON_CONTEXT);

  @ContentChildren(IdsDropdownButtonMenuItemComponent)
  itemQuery!: QueryList<IdsDropdownButtonMenuItemComponent>;

  readonly menuId = `ids-dropdown-button-menu-${nextMenuId++}`;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this.dropdown.registerMenu(this);
    this.itemQuery.changes.subscribe(() => this.cdr.markForCheck());
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  focusFirstEnabledItem(): void {
    this.enabledItems()[0]?.focusItem();
  }

  focusLastEnabledItem(): void {
    const items = this.enabledItems();
    items[items.length - 1]?.focusItem();
  }

  focusNextItem(current: IdsDropdownButtonMenuItemComponent): void {
    const items = this.enabledItems();
    const index = items.indexOf(current);
    if (index < 0) {
      items[0]?.focusItem();
      return;
    }
    items[(index + 1) % items.length]?.focusItem();
  }

  focusPreviousItem(current: IdsDropdownButtonMenuItemComponent): void {
    const items = this.enabledItems();
    const index = items.indexOf(current);
    if (index < 0) {
      items[items.length - 1]?.focusItem();
      return;
    }
    items[(index - 1 + items.length) % items.length]?.focusItem();
  }

  enabledItems(): IdsDropdownButtonMenuItemComponent[] {
    return (this.itemQuery?.toArray() ?? []).filter(
      (item: IdsDropdownButtonMenuItemComponent) => !item.disabled,
    );
  }
}
