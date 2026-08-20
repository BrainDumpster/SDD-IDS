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
import { CommonModule } from "@angular/common";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";

/** Modal body slot — description + optional tabs + scrollable content region. */
@Component({
  selector: "ids-modal-body",
  standalone: true,
  imports: [CommonModule],
  styles: [`:host { display: contents; }`],
  template: `
    @if (resolvedDescription) {
      <p
        [id]="modal.descriptionId"
        [ngClass]="['ids-modal__description', modal.descriptionTypeClass]"
      >
        {{ resolvedDescription }}
      </p>
    }

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
    }

    <div
      #contentRef
      [ngClass]="[
        'ids-modal__content',
        modal.contentTypeClass,
        modal.bodyScrollable ? 'ids-modal__content--scrollable' : '',
        !showContentShell ? 'ids-modal__content--hidden' : '',
      ]"
      (scroll)="modal.onContentScroll()"
    >
      @if (modal.showTabs) {
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
