/** Developer usage + Docs tab copy for IDS Wizard (Angular). */

export const WIZARD_DOCS_DESCRIPTION = `
IDS Wizard — Angular 21 standalone API aligned to \`components/ids/wizard/design-spec.md\` and React \`lib/react/ids/wizard\`.

**Contract defaults:** \`component-contracts/ids/wizard.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-wizard [mode?, size?, title, steps, initialStepId?, showCloseButton?, isPrimaryEnabled?]
  ids-wizard-header
    ids-wizard-header-title
    ids-wizard-close-action?
  ids-wizard-body
    ids-wizard-steps-pane
      ids-wizard-step-item[]
        ids-wizard-step-label
        ids-wizard-step-status-indicator?
        ids-wizard-substep-list?
          ids-wizard-substep-item[]
            ids-wizard-step-label
            ids-wizard-step-status-indicator?
    ids-wizard-content-pane
      ids-wizard-page-title
      ids-wizard-page-content
      ids-wizard-footer
        ids-wizard-progress-label
        ids-wizard-footer-actions
          ids-wizard-cancel-button?
          ids-wizard-previous-button?
          ids-wizard-primary-button
\`\`\`

Prop-driven \`steps\` builds the same tree (React \`IdsWizard\` default). Projecting \`ids-wizard-header\` / \`ids-wizard-body\` replaces chrome, matching React compound slots.

Import \`IDS_WIZARD_IMPORTS\` from \`lib/angular/ids/wizard\`.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
`.trim();

export const WIZARD_SOURCE_CODE = `import { Component } from "@angular/core";
import { IDS_WIZARD_IMPORTS } from "./wizard";

@Component({
  standalone: true,
  imports: [...IDS_WIZARD_IMPORTS],
  template: \`
    <ids-wizard
      mode="inline"
      size="large"
      title="Header"
      [steps]="steps"
      (onCancel)="onCancel($event)"
      (onPrevious)="onPrevious($event)"
      (onNext)="onNext($event)"
      (onFinish)="onFinish($event)"
      (onStepChange)="onStepChange($event)"
    />
  \`,
})
export class AppComponent {
  steps = [
    { id: "welcome", label: "Welcome", pageTitle: "Welcome", content: "Intro page content.", status: "success" },
    { id: "configure", label: "Configure", pageTitle: "Configure", content: "Configuration content.", status: "warning" },
    { id: "review", label: "Review", pageTitle: "Review", content: "Review content.", status: "error" },
    { id: "finish", label: "Finish", pageTitle: "Finish", content: "Final content.", status: "success" },
  ];
  onCancel(event) {}
  onPrevious(event) {}
  onNext(event) {}
  onFinish(event) {}
  onStepChange(event) {}
}`.trim();

export const WIZARD_STORY_SOURCE_CODE = `<ids-wizard
  mode="inline"
  size="large"
  title="Header"
  [steps]="steps"
  (onStepChange)="onStepChange($event)"
></ids-wizard>`.trim();

export const WIZARD_COMPOSITION_TEMPLATE = `
<ids-wizard [title]="title" [steps]="steps" [mode]="mode" [size]="size">
  <ids-wizard-header>
    <ids-wizard-header-title>{{ title }}</ids-wizard-header-title>
    <ids-wizard-close-action />
  </ids-wizard-header>
  <ids-wizard-body>
    <ids-wizard-steps-pane></ids-wizard-steps-pane>
    <ids-wizard-content-pane>
      <ids-wizard-page-title>Welcome</ids-wizard-page-title>
      <ids-wizard-page-content>Intro page content.</ids-wizard-page-content>
      <ids-wizard-footer>
        <ids-wizard-progress-label></ids-wizard-progress-label>
        <ids-wizard-footer-actions>
          <ids-wizard-cancel-button></ids-wizard-cancel-button>
          <ids-wizard-previous-button></ids-wizard-previous-button>
          <ids-wizard-primary-button></ids-wizard-primary-button>
        </ids-wizard-footer-actions>
      </ids-wizard-footer>
    </ids-wizard-content-pane>
  </ids-wizard-body>
</ids-wizard>
`.trim();
