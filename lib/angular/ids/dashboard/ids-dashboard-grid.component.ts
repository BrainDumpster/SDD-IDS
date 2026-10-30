import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  Input,
  Optional,
  ViewEncapsulation,
} from "@angular/core";
import { cx } from "../../shared/utils/cx";
import {
  IDS_DASHBOARD_CONTEXT,
  type IdsDashboardRuntimeContext,
} from "./ids-dashboard.context";

/**
 * IDS Dashboard grid slot — `IdsDashboardGrid` (React parity).
 * Must be used within `ids-dashboard`.
 */
@Component({
  selector: "ids-dashboard-grid",
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    "[attr.data-ids]": "'IdsDashboardGrid'",
  },
})
export class IdsDashboardGridComponent {
  @Input() className?: string;

  constructor(
    @Optional()
    @Inject(IDS_DASHBOARD_CONTEXT)
    ctx: IdsDashboardRuntimeContext | null,
  ) {
    if (!ctx) {
      throw new Error("IdsDashboardGrid must be used within Dashboard.");
    }
  }

  @HostBinding("class")
  get hostClass(): string {
    return cx("IdsDashboardGrid", this.className);
  }
}
