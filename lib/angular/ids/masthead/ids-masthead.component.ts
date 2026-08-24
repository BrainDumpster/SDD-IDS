import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  ViewEncapsulation,
} from "@angular/core";
import { IdsMastheadLogoComponent } from "./ids-masthead-logo.component";

@Component({
  selector: "ids-masthead",
  standalone: true,
  templateUrl: "./ids-masthead.component.html",
  styleUrl: "./ids-masthead.component.scss",
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "ids-masthead-host",
  },
})
export class IdsMastheadComponent implements AfterContentChecked {
  @Input({ required: true }) productName!: string;

  @ContentChild(IdsMastheadLogoComponent)
  private logoSlot?: IdsMastheadLogoComponent;

  /** True when a logo slot is projected (Figma `Show Product Icon=Yes`). */
  hasLogo = false;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterContentChecked(): void {
    const next = !!this.logoSlot;
    if (next !== this.hasLogo) {
      this.hasLogo = next;
      this.cdr.markForCheck();
    }
  }
}
