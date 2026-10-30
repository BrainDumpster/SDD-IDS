import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { IDS_TOAST_ITEM_CONTEXT } from "./ids-toast-context";

@Component({
  selector: "ids-toast-message",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <p class="ids-toast-message" data-ids="ids-toast-message">
      <ng-content />
      @if (!hasProjectedText) {
        {{ toast.resolvedMessage }}
      }
    </p>
  `,
})
export class IdsToastMessageComponent implements AfterContentInit {
  readonly toast = inject(IDS_TOAST_ITEM_CONTEXT);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  hasProjectedText = false;

  ngAfterContentInit(): void {
    const text = this.host.nativeElement?.textContent?.trim() ?? "";
    this.hasProjectedText = Boolean(text);
    this.cdr.markForCheck();
  }
}
