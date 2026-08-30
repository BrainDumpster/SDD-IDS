import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
} from "@angular/core";
import type { AlertCarouselInput } from "@component-contracts/ids/alert.contract";
import {
  IDS_ALERT_GROUP_CONTEXT,
  type IdsAlertGroupContext,
} from "./ids-alert-group-context";
import { IdsAlertItemComponent } from "./ids-alert-item.component";
import { IdsAlertComponent } from "./ids-alert.component";

@Component({
  selector: "ids-alert-group",
  standalone: true,
  imports: [IdsAlertComponent],
  templateUrl: "./ids-alert-group.component.html",
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: IDS_ALERT_GROUP_CONTEXT, useExisting: IdsAlertGroupComponent }],
})
export class IdsAlertGroupComponent implements AfterContentInit, IdsAlertGroupContext {
  @ContentChildren(IdsAlertItemComponent) itemQuery!: QueryList<IdsAlertItemComponent>;

  @Input() activeIndex = 0;
  @Output() readonly activeIndexChange = new EventEmitter<number>();
  @Output() readonly dismiss = new EventEmitter<void>();

  dismissed = false;
  private items: IdsAlertItemComponent[] = [];

  ngAfterContentInit(): void {
    this.bindItems();
    this.itemQuery.changes.subscribe(() => this.bindItems());
  }

  get activeItem(): IdsAlertItemComponent | null {
    return this.items[this.activeIndex] ?? null;
  }

  get carousel(): AlertCarouselInput | null {
    if (this.items.length <= 1) {
      return null;
    }
    return {
      currentItem: this.activeIndex + 1,
      totalItems: this.items.length,
    };
  }

  isActive(item: IdsAlertItemComponent): boolean {
    return this.activeItem === item;
  }

  previous(): void {
    this.setActiveIndex(this.activeIndex - 1);
  }

  next(): void {
    this.setActiveIndex(this.activeIndex + 1);
  }

  onDismiss(): void {
    this.dismissed = true;
    this.dismiss.emit();
  }

  private bindItems(): void {
    this.items = this.itemQuery.toArray();
    this.items.forEach((item, index) => {
      item.setItemIndex(index);
      item.refreshFromSlots();
    });
    if (this.activeIndex >= this.items.length) {
      this.activeIndex = Math.max(0, this.items.length - 1);
    }
  }

  private setActiveIndex(index: number): void {
    const len = this.items.length;
    if (len === 0) {
      return;
    }
    const wrapped = ((index % len) + len) % len;
    this.activeIndex = wrapped;
    this.activeIndexChange.emit(wrapped);
  }
}
