import { Component, Input, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: "ids-tab-item",
  standalone: true,
  template: `
    <ng-template #panelTpl>
      <ng-content select="ids-tab-panel" />
    </ng-template>
  `,
  host: {
    style: "display: none",
  },
})
export class IdsTabItemComponent {
  @ViewChild("panelTpl", { static: true }) panelTpl!: TemplateRef<unknown>;

  @Input({ required: true }) itemId!: string;
  @Input({ required: true }) label!: string;
  @Input() iconSlug?: string;
  @Input() badgeCount?: number;
  @Input() hasAlert = false;
  @Input() disabled = false;
  @Input() simulatedState?: "hover" | "focus-visible";
}
