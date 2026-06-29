import { Component, Input, ViewChild, ViewEncapsulation, inject, } from "@angular/core";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";
import * as i0 from "@angular/core";
const _c0 = ["contentRef"];
const _c1 = ["*"];
const _forTrack0 = ($index, $item) => $item.id;
function IdsModalBodyComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 1);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵdomProperty("id", ctx_r0.modal.descriptionId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.resolvedDescription);
} }
function IdsModalBodyComponent_Conditional_3_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "button", 6);
    i0.ɵɵdomListener("click", function IdsModalBodyComponent_Conditional_3_For_2_Template_button_click_0_listener() { const page_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.modal.selectPage(page_r3.id)); });
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const page_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("ids-modal__tab--active", ctx_r0.modal.isPageActive(page_r3.id));
    i0.ɵɵattribute("aria-selected", ctx_r0.modal.isPageActive(page_r3.id));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", page_r3.label, " ");
} }
function IdsModalBodyComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "nav", 3);
    i0.ɵɵrepeaterCreate(1, IdsModalBodyComponent_Conditional_3_For_2_Template, 2, 4, "button", 4, _forTrack0);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "div", 5);
    i0.ɵɵtext(4);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.modal.pages);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.modal.activePageContent, " ");
} }
function IdsModalBodyComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0);
} }
/** Modal body slot — description + optional tabs + scrollable content region. */
export class IdsModalBodyComponent {
    modal = inject(IDS_MODAL_CONTEXT);
    /** Shorthand intro copy when not placed as plain markup inside the slot. */
    description;
    contentRef;
    hasProjectedContent = false;
    get resolvedDescription() {
        return this.description;
    }
    get showContentShell() {
        if (this.modal.showTabs) {
            return true;
        }
        if (this.modal.resolvedScenario !== "dialog") {
            return true;
        }
        return this.hasProjectedContent;
    }
    ngAfterContentInit() {
        this.detectProjectedContent();
    }
    ngAfterViewInit() {
        this.detectProjectedContent();
        this.modal.registerContentElement(this.showContentShell ? (this.contentRef?.nativeElement ?? null) : null);
    }
    detectProjectedContent() {
        const el = this.contentRef?.nativeElement;
        this.hasProjectedContent = Boolean(el && (el.children.length > 0 || (el.textContent?.trim().length ?? 0) > 0));
    }
    static ɵfac = function IdsModalBodyComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsModalBodyComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsModalBodyComponent, selectors: [["ids-modal-body"]], viewQuery: function IdsModalBodyComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.contentRef = _t.first);
        } }, inputs: { description: "description" }, ngContentSelectors: _c1, decls: 5, vars: 8, consts: [["contentRef", ""], [1, "ids-modal__description", 3, "id"], [1, "ids-modal__content", 3, "scroll"], ["aria-label", "Modal pages", 1, "ids-modal__tabs"], ["type", "button", "role", "tab", 1, "ids-modal__tab", 3, "ids-modal__tab--active"], ["role", "tabpanel", 1, "ids-modal__page-panel"], ["type", "button", "role", "tab", 1, "ids-modal__tab", 3, "click"]], template: function IdsModalBodyComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵconditionalCreate(0, IdsModalBodyComponent_Conditional_0_Template, 2, 2, "p", 1);
            i0.ɵɵdomElementStart(1, "div", 2, 0);
            i0.ɵɵdomListener("scroll", function IdsModalBodyComponent_Template_div_scroll_1_listener() { return ctx.modal.onContentScroll(); });
            i0.ɵɵconditionalCreate(3, IdsModalBodyComponent_Conditional_3_Template, 5, 1)(4, IdsModalBodyComponent_Conditional_4_Template, 1, 0);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.resolvedDescription ? 0 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("ids-modal__content--scrollable", ctx.modal.bodyScrollable)("ids-modal__content--hidden", !ctx.showContentShell)("ids-modal__content--with-tabs", ctx.modal.showTabs);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.modal.showTabs ? 3 : 4);
        } }, styles: [":host { display: contents; }"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsModalBodyComponent, [{
        type: Component,
        args: [{ selector: "ids-modal-body", standalone: true, template: `
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
  `, encapsulation: ViewEncapsulation.None, styles: [":host { display: contents; }"] }]
    }], null, { description: [{
            type: Input
        }], contentRef: [{
            type: ViewChild,
            args: ["contentRef"]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsModalBodyComponent, { className: "IdsModalBodyComponent", filePath: "src/components/ids-modal/ids-modal-body.component.ts", lineNumber: 56 }); })();
