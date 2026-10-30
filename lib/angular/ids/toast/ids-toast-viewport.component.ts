import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  TOAST_API_DEFAULTS,
  type IdsToastCloseReason,
  type IdsToastPosition,
  type IdsToastQueueItem,
} from "@component-contracts/ids/toast.contract";
import { cx } from "../../shared/utils/cx";
import { IdsToastItemComponent } from "./ids-toast-item.component";
import { resolveToastMaxVisible, resolveToastPosition } from "./ids-toast.utils";
import { Subscription } from "rxjs";

@Component({
  selector: "ids-toast-viewport",
  standalone: true,
  imports: [CommonModule, IdsToastItemComponent],
  templateUrl: "./ids-toast-viewport.component.html",
  styleUrl: "./ids-toast-item.component.scss",
  encapsulation: ViewEncapsulation.None,
  host: {
    "data-ids": "ids-toast-viewport",
    "aria-live": "polite",
    "aria-atomic": "false",
  },
})
export class IdsToastViewportComponent implements AfterContentInit, OnChanges, OnDestroy {
  @ContentChildren(IdsToastItemComponent) private itemQuery?: QueryList<IdsToastItemComponent>;

  @Input() position: IdsToastPosition | string = TOAST_API_DEFAULTS.position;
  @Input() maxVisible = TOAST_API_DEFAULTS.maxVisible;
  @Input() queueStrategy: "FIFO" = TOAST_API_DEFAULTS.queueStrategy;
  @Input() items?: IdsToastQueueItem[];
  @Input() defaultItems: IdsToastQueueItem[] = [];
  @Input() className?: string;

  @Output() readonly onItemsChange = new EventEmitter<IdsToastQueueItem[]>();
  @Output() readonly onItemClose = new EventEmitter<{
    id: string;
    reason: IdsToastCloseReason;
  }>();
  @Output() readonly onItemTimeout = new EventEmitter<{ id: string }>();

  private uncontrolledItems: IdsToastQueueItem[] = [];
  private changesSub?: Subscription;
  private closeSubs: Subscription[] = [];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["defaultItems"] && changes["defaultItems"].firstChange) {
      this.uncontrolledItems = [...this.defaultItems];
    }
  }

  ngAfterContentInit(): void {
    this.syncProjectedQueue();
    this.changesSub = this.itemQuery?.changes.subscribe(() => this.syncProjectedQueue());
  }

  ngOnDestroy(): void {
    this.changesSub?.unsubscribe();
    this.clearCloseSubs();
  }

  @HostBinding("class")
  get hostClass(): string {
    return cx("ids-toast-viewport", this.className);
  }

  @HostBinding("attr.data-position")
  get dataPosition(): IdsToastPosition {
    return resolveToastPosition(this.position);
  }

  get useItemsApi(): boolean {
    return this.items != null;
  }

  get resolvedItems(): IdsToastQueueItem[] {
    return this.useItemsApi ? (this.items ?? []) : this.uncontrolledItems;
  }

  get visibleItems(): IdsToastQueueItem[] {
    return this.resolvedItems.slice(0, resolveToastMaxVisible(this.maxVisible));
  }

  handleItemClose(detail: { id?: string; reason: IdsToastCloseReason }): void {
    const id = detail.id;
    if (!id) {
      return;
    }
    this.setItems(this.resolvedItems.filter((item) => item.id !== id));
    this.onItemClose.emit({ id, reason: detail.reason });
    if (detail.reason === "timeout") {
      this.onItemTimeout.emit({ id });
    }
  }

  private setItems(next: IdsToastQueueItem[]): void {
    if (!this.useItemsApi) {
      this.uncontrolledItems = next;
    }
    this.onItemsChange.emit(next);
    this.cdr.markForCheck();
  }

  private syncProjectedQueue(): void {
    if (this.useItemsApi) {
      return;
    }
    this.clearCloseSubs();
    const items = this.itemQuery?.toArray() ?? [];
    const pending = items.filter((item) => !item.dismissed);
    const limit = resolveToastMaxVisible(this.maxVisible);
    pending.forEach((item, index) => {
      item.setQueuedVisible(index < limit);
      this.closeSubs.push(
        item.onClose.subscribe(() => {
          this.syncProjectedQueue();
          this.cdr.markForCheck();
        }),
      );
    });
    this.cdr.markForCheck();
  }

  private clearCloseSubs(): void {
    this.closeSubs.forEach((sub) => sub.unsubscribe());
    this.closeSubs = [];
  }
}
