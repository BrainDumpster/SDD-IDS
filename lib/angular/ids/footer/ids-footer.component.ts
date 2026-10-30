import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "ids-footer",
  standalone: true,
  templateUrl: "./ids-footer.component.html",
  styleUrl: "./ids-footer.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsFooterComponent {
  @Input() ariaLabel = "Application status";
}
