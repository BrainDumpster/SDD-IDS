/** Developer usage + Docs tab copy for IDS Lit Wizard (inline + modal). */

export const WIZARD_DOCS_DESCRIPTION = `
## Overview

Multi-step wizard with steps pane + content pane. Modes: \`inline\` (page flow) and \`modal\` (overlay shell).

\`\`\`
ids-wizard
  ids-wizard-header
    ids-wizard-header-title
    ids-wizard-close-action?
  ids-wizard-body
    ids-wizard-steps-pane
      ids-wizard-step-item / ids-wizard-substep-*
    ids-wizard-content-pane
      ids-wizard-page-title
      ids-wizard-page-content
      ids-wizard-footer
\`\`\`

Import via \`@ids/core/wizard/register.js\`.

Prop-driven \`steps\` builds the deterministic anatomy. Optional compound light-DOM slots
(\`ids-wizard-header\` / \`ids-wizard-body\`) replace prop chrome when projected.

## Props

| Prop | Type | Default |
|------|------|---------|
| \`mode\` | \`"inline" \\| "modal"\` | \`"inline"\` |
| \`size\` | \`"medium" \\| "large" \\| "x-large" \\| "full-screen"\` | \`"large"\` |
| \`wizardtitle\` / \`.title\` | \`string\` | \`"Header"\` |
| \`.steps\` | \`IdsWizardStepInput[]\` | required |
| \`initialstepid\` | \`string\` | — |
| \`.showCloseButton\` | \`boolean\` | \`true\` |
| \`.isPrimaryEnabled\` | \`boolean \\| ((ctx) => boolean)\` | \`true\` |

## Events

| Event | Detail | React parity |
|-------|--------|--------------|
| \`cancel\` | \`IdsWizardEventPayload\` | \`onCancel\` |
| \`previous\` | \`IdsWizardEventPayload\` | \`onPrevious\` |
| \`next\` | \`IdsWizardEventPayload\` | \`onNext\` |
| \`finish\` | \`IdsWizardEventPayload\` | \`onFinish\` |
| \`step-change\` | \`IdsWizardEventPayload\` | \`onStepChange\` |

## Usage

\`\`\`html
<ids-wizard
  mode="inline"
  size="large"
  wizardtitle="Header"
  .steps=\${steps}
  .onCancel=\${onCancel}
  .onFinish=\${onFinish}
></ids-wizard>
\`\`\`
`.trim();

export const WIZARD_SOURCE_CODE = `import "@ids/core/wizard/register.js";
import { html } from "lit";

const steps = [
  {
    id: "welcome",
    label: "Welcome",
    pageTitle: "Welcome",
    content: html\`<div>Intro page content.</div>\`,
    status: "success",
  },
  {
    id: "configure",
    label: "Configure",
    children: [
      {
        id: "configure-network",
        label: "Network",
        pageTitle: "Network Settings",
        content: html\`<div>Configure network content.</div>\`,
      },
    ],
  },
  {
    id: "finish",
    label: "Finish",
    pageTitle: "Finalize",
    content: html\`<div>Final page content.</div>\`,
    footerButtons: { primaryLabel: "Finish" },
  },
];

document.querySelector("ids-wizard").steps = steps;
`;

export const WIZARD_INLINE_DOCS_DESCRIPTION = `
## Wizard — Inline

Embedded multi-step flow (\`mode="inline"\`). Close button follows \`showCloseButton\`.
Container-driven width; size presets are max-width constraints.

${WIZARD_DOCS_DESCRIPTION}
`.trim();

export const WIZARD_MODAL_DOCS_DESCRIPTION = `
## Wizard — Modal

Centered overlay shell (\`mode="modal"\`) with \`ids-wizard-overlay\` backdrop.
Close is always shown. Root uses dialog semantics and \`border-radius: var(--modal-control-radius)\`.

${WIZARD_DOCS_DESCRIPTION}
`.trim();
