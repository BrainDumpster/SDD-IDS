import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TAGS_GROUP_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/tag.contract";

@Component({
  selector: "ids-tags",
  standalone: true,
  templateUrl: "./ids-tags.component.html",
  styleUrl: "./ids-tags.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsTagsComponent {
  @Input() wrap = TAGS_GROUP_SPEC_ACCURATE_DEFAULTS.wrap;
  @Input() ariaLabel = TAGS_GROUP_SPEC_ACCURATE_DEFAULTS.ariaLabel;
}
