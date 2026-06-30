import {
  AfterContentInit,
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
export class IdsMastheadComponent implements AfterContentInit {
  @Input({ required: true }) productName!: string;

  @ContentChild(IdsMastheadLogoComponent)
  private logoSlot?: IdsMastheadLogoComponent;

  /** True when a logo slot is projected (Figma `Show Product Icon=Yes`). */
  hasLogo = false;

  ngAfterContentInit(): void {
    this.hasLogo = !!this.logoSlot;
  }
}
