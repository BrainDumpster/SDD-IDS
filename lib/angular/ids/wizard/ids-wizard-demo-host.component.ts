import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { WIZARD_DEFAULTS } from "@component-contracts/ids/wizard.contract";
import { IdsButtonComponent } from "../button/ids-button.component";
import { IDS_WIZARD_IMPORTS } from "./index";
import type {
  IdsWizardEventPayload,
  IdsWizardMode,
  IdsWizardSize,
  IdsWizardStepInput,
} from "./ids-wizard.types";

@Component({
  selector: "ids-wizard-demo-host",
  standalone: true,
  imports: [CommonModule, ...IDS_WIZARD_IMPORTS, IdsButtonComponent],
  template: `
    <ng-template #welcomeTpl>
      <div [ngStyle]="pageStyle">
        Intro page content.
        <div style="margin-top: 12px;">
          <ids-button variant="secondary" (clicked)="toggleAdvanced()">
            Toggle Advanced Step
          </ids-button>
        </div>
      </div>
    </ng-template>
    <ng-template #networkTpl>
      <div [ngStyle]="pageStyle">
        Configure network content.
        <div style="margin-top: 12px;">
          <ids-button variant="secondary" (clicked)="toggleInjectedReview()">
            Toggle Injected Review Child
          </ids-button>
        </div>
      </div>
    </ng-template>
    <ng-template #securityTpl>
      <div [ngStyle]="pageStyle">
        Security configuration content.
        <div style="margin-top: 12px;">
          <ids-button variant="secondary" (clicked)="toggleValid()">
            Toggle Validation ({{ isValid ? "valid" : "invalid" }})
          </ids-button>
        </div>
      </div>
    </ng-template>
    <ng-template #advancedTpl>
      <div [ngStyle]="pageStyle">Conditionally visible advanced page content.</div>
    </ng-template>
    <ng-template #reviewBasicTpl>
      <div [ngStyle]="pageStyle">Basic review page content.</div>
    </ng-template>
    <ng-template #reviewDeepTpl>
      <div [ngStyle]="pageStyle">Dynamically injected deep review content.</div>
    </ng-template>
    <ng-template #finishTpl>
      <div [ngStyle]="pageStyle">Final page content.</div>
    </ng-template>

    <div
      style="position: relative; display: flex; flex-direction: column; box-sizing: border-box; height: 100vh; min-height: 843px; padding: 24px 24px 48px; background: var(--color-background-surface-primary);"
    >
      <ids-wizard
        [mode]="mode"
        [size]="size"
        [title]="title"
        [steps]="steps"
        [showCloseButton]="showCloseButton"
        [isPrimaryEnabled]="isPrimaryEnabled"
        (onCancel)="onEvent('Cancel', $event)"
        (onPrevious)="onEvent('Previous', $event)"
        (onNext)="onEvent('Next', $event)"
        (onFinish)="onEvent('Finish', $event)"
        (onStepChange)="onEvent('StepChange', $event)"
      />
      <p style="position: absolute; left: 24px; right: 24px; bottom: 8px; margin: 0; color: var(--color-text-gray-neutral-strong);">
        Last event: {{ lastEvent }}
      </p>
    </div>
  `,
})
export class IdsWizardDemoHostComponent implements AfterViewInit {
  @ViewChild("welcomeTpl") welcomeTpl?: TemplateRef<unknown>;
  @ViewChild("networkTpl") networkTpl?: TemplateRef<unknown>;
  @ViewChild("securityTpl") securityTpl?: TemplateRef<unknown>;
  @ViewChild("advancedTpl") advancedTpl?: TemplateRef<unknown>;
  @ViewChild("reviewBasicTpl") reviewBasicTpl?: TemplateRef<unknown>;
  @ViewChild("reviewDeepTpl") reviewDeepTpl?: TemplateRef<unknown>;
  @ViewChild("finishTpl") finishTpl?: TemplateRef<unknown>;

  @Input() mode: IdsWizardMode = WIZARD_DEFAULTS.mode;
  @Input() size: IdsWizardSize = WIZARD_DEFAULTS.size;
  @Input() title = WIZARD_DEFAULTS.title;
  @Input() showCloseButton = WIZARD_DEFAULTS.showCloseButton;

  lastEvent = "No event";
  showAdvanced = false;
  injectReviewChild = false;
  isValid = false;
  steps: IdsWizardStepInput[] = [];

  readonly pageStyle = {
    border: "1px solid var(--color-border-brand-base)",
    background: "var(--color-background-brand-lighter-slate)",
    padding: "16px",
    minHeight: "120px",
    color: "var(--color-text-gray-neutral)",
  };

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.rebuildSteps();
    this.cdr.detectChanges();
  }

  readonly isPrimaryEnabled = (ctx: { currentStepId?: string }) =>
    ctx.currentStepId !== "configure-security" || this.isValid;

  toggleAdvanced(): void {
    this.showAdvanced = !this.showAdvanced;
    this.rebuildSteps();
  }

  toggleInjectedReview(): void {
    this.injectReviewChild = !this.injectReviewChild;
    this.rebuildSteps();
  }

  toggleValid(): void {
    this.isValid = !this.isValid;
    this.rebuildSteps();
  }

  onEvent(name: string, event: IdsWizardEventPayload): void {
    this.lastEvent = `${name}: ${event.stepCode} (${event.stepId})`;
  }

  private rebuildSteps(): void {
    const reviewChildren: IdsWizardStepInput[] = [
      {
        id: "review-basic",
        label: "Basic Review",
        pageTitle: "Review - Basic",
        content: this.reviewBasicTpl,
        status: "warning",
      },
    ];

    if (this.injectReviewChild) {
      reviewChildren.push({
        id: "review-deep",
        label: "Deep Review",
        pageTitle: "Review - Deep",
        content: this.reviewDeepTpl,
        status: "success",
        footerButtons: { primaryLabel: "Next" },
      });
    }

    this.steps = [
      {
        id: "welcome",
        label: "Welcome",
        pageTitle: "Welcome",
        content: this.welcomeTpl,
        status: "success",
      },
      {
        id: "configure",
        label: "Configure",
        status: "none",
        children: [
          {
            id: "configure-network",
            label: "Network",
            pageTitle: "Network Settings",
            content: this.networkTpl,
            status: "warning",
          },
          {
            id: "configure-security",
            label: "Security",
            pageTitle: "Security Settings",
            content: this.securityTpl,
            status: "error",
          },
        ],
      },
      {
        id: "advanced",
        label: "Advanced",
        pageTitle: "Advanced Options",
        content: this.advancedTpl,
        status: "none",
        isVisible: this.showAdvanced,
      },
      {
        id: "review",
        label: "Review",
        children: reviewChildren,
      },
      {
        id: "finish",
        label: "Finish",
        pageTitle: "Finalize",
        content: this.finishTpl,
        status: "success",
        footerButtons: { primaryLabel: "Finish", showPrevious: true, showCancel: true },
      },
    ];
  }
}
