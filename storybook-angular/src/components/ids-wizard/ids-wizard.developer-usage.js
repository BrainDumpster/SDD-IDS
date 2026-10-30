/** Developer usage + Docs tab copy for IDS Wizard (Angular). */

export const WIZARD_DOCS_DESCRIPTION = `
## Overview

Multi-step guided flow with steps pane, content, and footer actions.

## Props

### \`ids-wizard\`

| Input | Type | Default |
|-------|------|---------|
| \`mode\` | \`IdsWizardMode\` | \`WIZARD_DEFAULTS.mode\` |
| \`size\` | \`IdsWizardSize\` | \`WIZARD_DEFAULTS.size\` |
| \`title\` | \`—\` | \`WIZARD_DEFAULTS.title\` |
| \`steps\` | \`IdsWizardStepInput[]\` | \`[]\` |
| \`showCloseButton\` | \`—\` | \`WIZARD_DEFAULTS.showCloseButton\` |
| \`isPrimaryEnabled\` | \`boolean \\| ((ctx: IdsWizardContext)\` | \`> boolean) = true\` |

### \`ids-wizard-demo-host\`

| Input | Type | Default |
|-------|------|---------|
| \`mode\` | \`IdsWizardMode\` | \`WIZARD_DEFAULTS.mode\` |
| \`size\` | \`IdsWizardSize\` | \`WIZARD_DEFAULTS.size\` |
| \`title\` | \`—\` | \`WIZARD_DEFAULTS.title\` |
| \`showCloseButton\` | \`—\` | \`WIZARD_DEFAULTS.showCloseButton\` |

### \`ids-wizard-header\`

| Input | Type | Default |
|-------|------|---------|
| \`active\` | \`—\` | \`false\` |
| \`status\` | \`IdsWizardStepStatus\` | \`"none"\` |
| \`hasChildren\` | \`—\` | \`false\` |
| \`status\` | \`IdsWizardStepStatus\` | \`"none"\` |
| \`align\` | \`"end" \\| "after-label"\` | \`"end"\` |
| \`active\` | \`—\` | \`false\` |
| \`status\` | \`IdsWizardStepStatus\` | \`"none"\` |
| \`hasProjectedText\` | \`—\` | \`false\` |
| \`hasProjectedText\` | \`—\` | \`false\` |
| \`hasProjectedText\` | \`—\` | \`false\` |
| \`hasProjectedText\` | \`—\` | \`false\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`onCancel\` | \`ids-wizard\` | \`IdsWizardEventPayload\` |
| \`onPrevious\` | \`ids-wizard\` | \`IdsWizardEventPayload\` |
| \`onNext\` | \`ids-wizard\` | \`IdsWizardEventPayload\` |
| \`onFinish\` | \`ids-wizard\` | \`IdsWizardEventPayload\` |
| \`onStepChange\` | \`ids-wizard\` | \`IdsWizardEventPayload\` |

## API

Import \`IDS_WIZARD_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/wizard\`).

\`\`\`ts
import { IDS_WIZARD_IMPORTS } from "@ids/angular/wizard";
\`\`\`
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
