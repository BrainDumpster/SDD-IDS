import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";

/** Modal body slot — description + optional tabs + scrollable content region. */
@Component({
  selector: "ids-modal-body",
  standalone: true,
  styles: [`:host { display: contents; }`],
  template: `
    @if (resolvedDescription) {
      <p [id]="modal.descriptionId" class="ids-modal__description">{{ resolvedDescription }}</p>
    }

    <div
      #contentRef
      class="ids-modal__content"
      [class.ids-modal__content--scrollable]="modal.bodyScrollable"
      [class.ids-modal__content--hidden]="!showContentShell"
      [class.ids-modal__content--with-tabs]="modal.showTabs"
      (scroll)="modal.onContentScroll()"
    >
      @if (modal.showTabs) {
        <nav class="ids-modal__tabs" aria-label="Modal pages">
          @for (page of modal.pages; track page.id) {
            <button
              type="button"
              class="ids-modal__tab"
              [class.ids-modal__tab--active]="modal.isPageActive(page.id)"
              [attr.aria-selected]="modal.isPageActive(page.id)"
              role="tab"
              (click)="modal.selectPage(page.id)"
            >
              {{ page.label }}
            </button>
          }
        </nav>
        <div class="ids-modal__page-panel" role="tabpanel">
          {{ modal.activePageContent }}
        </div>
      } @else {
        <ng-content />
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsModalBodyComponent implements AfterContentInit, AfterViewInit {
  readonly modal = inject(IDS_MODAL_CONTEXT);

  /** Shorthand intro copy when not placed as plain markup inside the slot. */
  @Input() description?: string;

  @ViewChild("contentRef") contentRef?: ElementRef<HTMLElement>;

  private hasProjectedContent = false;

  get resolvedDescription(): string | undefined {
    return this.description;
  }

  get showContentShell(): boolean {
    if (this.modal.showTabs) {
      return true;
    }
    if (this.modal.resolvedScenario !== "dialog") {
      return true;
    }
    return this.hasProjectedContent;
  }

  ngAfterContentInit(): void {
    this.detectProjectedContent();
  }

  ngAfterViewInit(): void {
    this.detectProjectedContent();
    this.modal.registerContentElement(
      this.showContentShell ? (this.contentRef?.nativeElement ?? null) : null,
    );
  }

  private detectProjectedContent(): void {
    const el = this.contentRef?.nativeElement;
    this.hasProjectedContent = Boolean(
      el && (el.children.length > 0 || (el.textContent?.trim().length ?? 0) > 0),
    );
  }
}
