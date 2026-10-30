import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import {
  ACCORDION_CHEVRON_ICON_SLUG,
  type AccordionChevronPosition,
  type AccordionVariant,
} from "@component-contracts/ids/accordion.contract";
import {
  IDS_ACCORDION_CONTEXT,
  type IdsAccordionContext,
} from "./ids-accordion-context";
import { IdsAccordionItemComponent } from "./ids-accordion-item.component";

@Component({
  selector: "ids-accordion",
  standalone: true,
  templateUrl: "./ids-accordion.component.html",
  styleUrl: "./ids-accordion.component.scss",
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: IDS_ACCORDION_CONTEXT, useExisting: IdsAccordionComponent }],
})
export class IdsAccordionComponent
  implements OnInit, OnChanges, AfterContentInit, IdsAccordionContext
{
  readonly chevronSlug = ACCORDION_CHEVRON_ICON_SLUG;

  @ContentChildren(IdsAccordionItemComponent)
  itemQuery!: QueryList<IdsAccordionItemComponent>;

  @Input() multiple = false;
  @Input() defaultValue: string[] = [];
  @Input() chevronPosition: AccordionChevronPosition = "left";
  @Input() variant: AccordionVariant = "default";

  @Output() readonly valueChange = new EventEmitter<string[]>();

  openValues = new Set<string>();
  focusedIndex = 0;

  private items: IdsAccordionItemComponent[] = [];

  ngOnInit(): void {
    this.syncOpenValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["defaultValue"]) {
      this.syncOpenValues();
    }
  }

  ngAfterContentInit(): void {
    this.bindItems();
    this.itemQuery.changes.subscribe(() => this.bindItems());
  }

  private syncOpenValues(): void {
    this.openValues = new Set(this.defaultValue ?? []);
  }

  private bindItems(): void {
    this.registerItems(this.itemQuery.toArray());
  }

  registerItems(items: readonly IdsAccordionItemComponent[]): void {
    this.items = [...items];
    items.forEach((item, index) => item.setItemIndex(index));
    if (this.focusedIndex >= this.items.length) {
      this.focusedIndex = Math.max(0, this.items.length - 1);
    }
  }

  isOpen(value: string): boolean {
    return this.openValues.has(value);
  }

  toggleItem(item: IdsAccordionItemComponent): void {
    if (item.disabled) {
      return;
    }
    const index = this.items.indexOf(item);
    const next = new Set(this.openValues);
    if (next.has(item.value)) {
      next.delete(item.value);
    } else {
      if (!this.multiple) {
        next.clear();
      }
      next.add(item.value);
    }
    this.openValues = next;
    this.focusedIndex = index;
    this.valueChange.emit([...next]);
  }

  onTriggerKeydown(event: KeyboardEvent, item: IdsAccordionItemComponent): void {
    const index = this.items.indexOf(item);
    const enabledIndices = this.items
      .map((row, i) => (row.disabled ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabledIndices.length) {
      return;
    }

    const currentPos = enabledIndices.indexOf(index);
    let targetIndex = index;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        targetIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
        break;
      case "ArrowUp":
        event.preventDefault();
        targetIndex =
          enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
        break;
      case "Home":
        event.preventDefault();
        targetIndex = enabledIndices[0];
        break;
      case "End":
        event.preventDefault();
        targetIndex = enabledIndices[enabledIndices.length - 1];
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        this.toggleItem(item);
        return;
      default:
        return;
    }

    this.focusedIndex = targetIndex;
    const targetValue = this.items[targetIndex]?.value;
    if (targetValue) {
      document.getElementById(this.triggerId(targetValue))?.focus();
    }
  }

  onTriggerFocus(item: IdsAccordionItemComponent): void {
    this.focusedIndex = this.items.indexOf(item);
  }

  triggerTabIndex(item: IdsAccordionItemComponent): number {
    const index = this.items.indexOf(item);
    return index === this.focusedIndex ? 0 : -1;
  }

  panelId(value: string): string {
    return `ids-accordion-panel-${value}`;
  }

  triggerId(value: string): string {
    return `ids-accordion-trigger-${value}`;
  }
}
