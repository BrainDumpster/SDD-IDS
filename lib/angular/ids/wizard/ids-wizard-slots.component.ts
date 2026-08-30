import { CommonModule } from "@angular/common";
import { Component, Input, ViewEncapsulation, inject } from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_WIZARD_CONTEXT } from "./ids-wizard-context";
import type { IdsWizardStepStatus } from "./ids-wizard.types";

@Component({
  selector: "ids-wizard-header",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: "ids-wizard-header-host" },
  styles: [":host { display: block; flex-shrink: 0; width: 100%; }"],
  template: `<header class="ids-wizard-header"><ng-content /></header>`,
})
export class IdsWizardHeaderComponent {
  constructor() {
    inject(IDS_WIZARD_CONTEXT);
  }
}

@Component({
  selector: "ids-wizard-header-title",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <h2 class="ids-wizard-header-title" [id]="wizard.titleId">
      <ng-content />
    </h2>
  `,
})
export class IdsWizardHeaderTitleComponent {
  readonly wizard = inject(IDS_WIZARD_CONTEXT);
}

@Component({
  selector: "ids-wizard-close-action",
  standalone: true,
  imports: [IdsIconComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      class="ids-wizard-close-action"
      aria-label="Close wizard"
      (click)="wizard.cancel()"
    >
      <ids-icon
        shapeName="ctrl-close-16"
        [size]="16"
        className="ids-wizard-close-icon"
      />
    </button>
  `,
})
export class IdsWizardCloseActionComponent {
  readonly wizard = inject(IDS_WIZARD_CONTEXT);
}

@Component({
  selector: "ids-wizard-body",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: "ids-wizard-body-host" },
  styles: [":host { display: flex; flex: 1 1 auto; min-height: 0; width: 100%; }"],
  template: `<div class="ids-wizard-body"><ng-content /></div>`,
})
export class IdsWizardBodyComponent {
  constructor() {
    inject(IDS_WIZARD_CONTEXT);
  }
}

@Component({
  selector: "ids-wizard-steps-pane",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: "ids-wizard-steps-pane-host" },
  styles: [":host { display: flex; flex-direction: column; flex-shrink: 0; align-self: stretch; width: 256px; min-height: 0; }"],
  template: `
    <nav class="ids-wizard-steps-pane" aria-label="Wizard steps" role="tree">
      <ng-content />
    </nav>
  `,
})
export class IdsWizardStepsPaneComponent {
  constructor() {
    inject(IDS_WIZARD_CONTEXT);
  }
}

@Component({
  selector: "ids-wizard-step-item",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      class="ids-wizard-step-item"
      role="treeitem"
      [class.ids-wizard-step-item--nested]="hasChildren"
      [attr.data-active]="active ? 'true' : null"
      [attr.data-status]="status"
      [attr.aria-current]="active ? 'step' : null"
    >
      <ng-content />
    </button>
  `,
})
export class IdsWizardStepItemComponent {
  @Input() active = false;
  @Input() status: IdsWizardStepStatus = "none";
  @Input() hasChildren = false;
}

@Component({
  selector: "ids-wizard-step-label",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `<span class="ids-wizard-step-label"><ng-content /></span>`,
})
export class IdsWizardStepLabelComponent {}

@Component({
  selector: "ids-wizard-step-status-indicator",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  encapsulation: ViewEncapsulation.None,
  host: {
    "[class.ids-wizard-step-status-indicator--end]": "align === 'end'",
    "[style.display]": "visible ? 'inline-flex' : 'none'",
  },
  styles: [
    ":host { flex-shrink: 0; align-items: center; justify-content: center; width: 16px; height: 16px; }",
  ],
  template: `
    @if (visible) {
      <span class="ids-wizard-step-status-indicator" [attr.data-status]="status">
        <ids-icon [shapeName]="shape || ''" [size]="16" [color]="statusColor" />
      </span>
    }
  `,
})
export class IdsWizardStepStatusIndicatorComponent {
  @Input() status: IdsWizardStepStatus = "none";
  @Input() shape?: string;
  @Input() align: "end" | "after-label" = "end";

  get visible(): boolean {
    return Boolean(this.shape && this.status !== "none");
  }

  get statusColor(): string | undefined {
    if (this.status === "success") {
      return "var(--color-icon-alerting-success-base)";
    }
    if (this.status === "warning") {
      return "var(--color-icon-alerting-minor-base)";
    }
    if (this.status === "error") {
      return "var(--color-icon-alerting-critical-base)";
    }
    return undefined;
  }
}

@Component({
  selector: "ids-wizard-substep-list",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `<div class="ids-wizard-substep-list" role="group"><ng-content /></div>`,
})
export class IdsWizardSubstepListComponent {}

@Component({
  selector: "ids-wizard-substep-item",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      class="ids-wizard-substep-item"
      role="treeitem"
      [attr.data-active]="active ? 'true' : null"
      [attr.data-status]="status"
      [attr.aria-current]="active ? 'step' : null"
    >
      <ng-content />
    </button>
  `,
})
export class IdsWizardSubstepItemComponent {
  @Input() active = false;
  @Input() status: IdsWizardStepStatus = "none";
}

@Component({
  selector: "ids-wizard-content-pane",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: "ids-wizard-content-pane-host" },
  styles: [":host { display: flex; flex-direction: column; flex: 1 1 auto; min-width: 0; min-height: 0; align-self: stretch; }"],
  template: `<section class="ids-wizard-content-pane"><ng-content /></section>`,
})
export class IdsWizardContentPaneComponent {
  constructor() {
    inject(IDS_WIZARD_CONTEXT);
  }
}

@Component({
  selector: "ids-wizard-page-title",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: "ids-wizard-page-title-host" },
  styles: [":host { display: block; flex-shrink: 0; }"],
  template: `<h3 class="ids-wizard-page-title"><ng-content /></h3>`,
})
export class IdsWizardPageTitleComponent {}

@Component({
  selector: "ids-wizard-page-content",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: "ids-wizard-page-content-host" },
  styles: [":host { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; width: 100%; }"],
  template: `<div class="ids-wizard-page-content"><ng-content /></div>`,
})
export class IdsWizardPageContentComponent {}

@Component({
  selector: "ids-wizard-footer",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: "ids-wizard-footer-host" },
  styles: [":host { display: block; flex-shrink: 0; width: 100%; margin-top: auto; }"],
  template: `<footer class="ids-wizard-footer"><ng-content /></footer>`,
})
export class IdsWizardFooterComponent {
  constructor() {
    inject(IDS_WIZARD_CONTEXT);
  }
}

@Component({
  selector: "ids-wizard-progress-label",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <span class="ids-wizard-progress-label">
      <ng-content />
      @if (!hasProjectedText) {
        {{ wizard.progressLabel }}
      }
    </span>
  `,
})
export class IdsWizardProgressLabelComponent {
  readonly wizard = inject(IDS_WIZARD_CONTEXT);
  @Input() hasProjectedText = false;
}

@Component({
  selector: "ids-wizard-footer-actions",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `<div class="ids-wizard-footer-actions"><ng-content /></div>`,
})
export class IdsWizardFooterActionsComponent {}

@Component({
  selector: "ids-wizard-cancel-button",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      class="ids-wizard-cancel-button"
      (click)="wizard.cancel()"
    >
      <ng-content />
      @if (!hasProjectedText) {
        Cancel
      }
    </button>
  `,
})
export class IdsWizardCancelButtonComponent {
  readonly wizard = inject(IDS_WIZARD_CONTEXT);
  @Input() hasProjectedText = false;
}

@Component({
  selector: "ids-wizard-previous-button",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      class="ids-wizard-previous-button"
      [disabled]="wizard.isFirstLeaf"
      (click)="wizard.goPrevious()"
    >
      <ng-content />
      @if (!hasProjectedText) {
        Previous
      }
    </button>
  `,
})
export class IdsWizardPreviousButtonComponent {
  readonly wizard = inject(IDS_WIZARD_CONTEXT);
  @Input() hasProjectedText = false;
}

@Component({
  selector: "ids-wizard-primary-button",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      class="ids-wizard-primary-button"
      [disabled]="!wizard.primaryEnabled"
      (click)="wizard.goNextOrFinish()"
    >
      <ng-content />
      @if (!hasProjectedText) {
        {{ wizard.primaryLabel }}
      }
    </button>
  `,
})
export class IdsWizardPrimaryButtonComponent {
  readonly wizard = inject(IDS_WIZARD_CONTEXT);
  @Input() hasProjectedText = false;
}
