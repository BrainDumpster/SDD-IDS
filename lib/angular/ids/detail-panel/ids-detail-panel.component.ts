import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import {
  DETAIL_PANEL_API_DEFAULTS,
  DETAIL_PANEL_COLLAPSED_ICON,
  DETAIL_PANEL_EXPANDED_ICON,
  type DetailPanelAttachMode,
} from "@component-contracts/ids/detail-panel.contract";
import { IDS_DETAIL_PANEL_CONTEXT, type IdsDetailPanelContext } from "./ids-detail-panel-context";

let detailPanelInstanceCounter = 0;

@Component({
  selector: "ids-detail-panel",
  standalone: true,
  templateUrl: "./ids-detail-panel.component.html",
  styleUrl: "./ids-detail-panel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: IDS_DETAIL_PANEL_CONTEXT, useExisting: IdsDetailPanelComponent }],
  host: {
    class: "ids-detail-panel",
    "[style.width.px]": "panelWidth",
    "[attr.aria-label]": "ariaLabel",
    "[attr.data-attach-mode]": "attachMode",
    "[attr.data-expanded]": "expanded",
    role: "complementary",
  },
})
export class IdsDetailPanelComponent implements IdsDetailPanelContext {
  @Input() attachMode: DetailPanelAttachMode = DETAIL_PANEL_API_DEFAULTS.attachMode;
  @Input() expanded: boolean = DETAIL_PANEL_API_DEFAULTS.expanded;
  @Input() title = DETAIL_PANEL_API_DEFAULTS.title;
  @Input() showHeader = DETAIL_PANEL_API_DEFAULTS.showHeader;
  @Input() showFooter = DETAIL_PANEL_API_DEFAULTS.showFooter;
  @Input() ariaLabelExpand = DETAIL_PANEL_API_DEFAULTS.ariaLabelExpand;
  @Input() ariaLabelCollapse = DETAIL_PANEL_API_DEFAULTS.ariaLabelCollapse;
  @Input() collapsedWidth = DETAIL_PANEL_API_DEFAULTS.collapsedWidth;
  @Input() expandedWidth = DETAIL_PANEL_API_DEFAULTS.expandedWidth;

  @Output() readonly expandedChange = new EventEmitter<boolean>();
  @Output() readonly opened = new EventEmitter<void>();
  @Output() readonly closed = new EventEmitter<void>();

  readonly bodyId = `ids-detail-panel-body-${++detailPanelInstanceCounter}`;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get panelWidth(): number {
    return this.expanded ? this.expandedWidth : this.collapsedWidth;
  }

  get toggleIcon(): string {
    return this.expanded ? DETAIL_PANEL_EXPANDED_ICON : DETAIL_PANEL_COLLAPSED_ICON;
  }

  get toggleAriaLabel(): string {
    return this.expanded ? this.ariaLabelCollapse : this.ariaLabelExpand;
  }

  get ariaLabel(): string {
    return `${this.attachMode} details panel`;
  }

  toggle(): void {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
    if (this.expanded) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
    this.cdr.markForCheck();
  }

  onToggleKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggle();
    }
  }
}
