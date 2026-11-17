/**
 * Storybook: IDS Lit Wizard — Inline (`mode="inline"`)
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/wizard/design-spec.md
 * API: lib/react/ids/wizard
 * Examples: storybook/src/components/lib-generated/Wizard.stories.tsx
 * Figma: WizardInline-Main 12690:246134, sample 12690:246164 (MCP 2026-11-13)
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/wizard/register.js";
import "@ids/core/button/register.js";
import type {
  IdsWizardEventPayload,
  IdsWizardMode,
  IdsWizardSize,
  IdsWizardStepInput,
} from "@ids/core/wizard";
import {
  WIZARD_INLINE_DOCS_DESCRIPTION,
  WIZARD_SOURCE_CODE,
} from "./ids-wizard.developer-usage";

type WizardStoryArgs = {
  mode: IdsWizardMode;
  size: IdsWizardSize;
  title: string;
  showCloseButton: boolean;
  showAdvanced: boolean;
  injectReviewChild: boolean;
  isValid: boolean;
  lastEvent?: string;
};

const sampleBlock = (label: string) => html`
  <div
    style="border:1px solid var(--color-border-brand-base);background:var(--color-background-brand-lighter-slate);padding:16px;min-height:120px;color:var(--color-text-gray-neutral);"
  >
    ${label}
  </div>
`;

const meta: Meta<WizardStoryArgs> = {
  title: "Spec Generated/IDS/Wizard Inline",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: { component: WIZARD_INLINE_DOCS_DESCRIPTION },
      source: { code: WIZARD_SOURCE_CODE, language: "js" },
    },
  },
  argTypes: {
    mode: { control: "radio", options: ["inline", "modal"] },
    size: {
      control: "radio",
      options: ["medium", "large", "x-large", "full-screen"],
    },
    showCloseButton: { control: "boolean" },
    showAdvanced: { control: "boolean" },
    injectReviewChild: { control: "boolean" },
    isValid: { control: "boolean" },
  },
  args: {
    mode: "inline",
    size: "large",
    title: "Header",
    showCloseButton: true,
    showAdvanced: false,
    injectReviewChild: false,
    isValid: false,
    lastEvent: "No event",
  },
};

export default meta;
type Story = StoryObj<WizardStoryArgs>;

function buildSteps(args: WizardStoryArgs, setArgs: (next: Partial<WizardStoryArgs>) => void): IdsWizardStepInput[] {
  const reviewChildren: IdsWizardStepInput[] = [
    {
      id: "review-basic",
      label: "Basic Review",
      pageTitle: "Review - Basic",
      content: sampleBlock("Basic review page content."),
      status: "warning",
    },
  ];

  if (args.injectReviewChild) {
    reviewChildren.push({
      id: "review-deep",
      label: "Deep Review",
      pageTitle: "Review - Deep",
      content: sampleBlock("Dynamically injected deep review content."),
      status: "success",
      footerButtons: { primaryLabel: "Next" },
    });
  }

  return [
    {
      id: "welcome",
      label: "Welcome",
      pageTitle: "Welcome",
      content: html`
        <div
          style="border:1px solid var(--color-border-brand-base);background:var(--color-background-brand-lighter-slate);padding:16px;min-height:120px;color:var(--color-text-gray-neutral);"
        >
          Intro page content.
          <div style="margin-top:12px;">
            <ids-button
              variant="secondary"
              size="large"
              label="Toggle Advanced Step"
              @ids-button-click=${() =>
                setArgs({ showAdvanced: !args.showAdvanced })}
            ></ids-button>
          </div>
        </div>
      `,
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
          content: html`
            <div
              style="border:1px solid var(--color-border-brand-base);background:var(--color-background-brand-lighter-slate);padding:16px;min-height:120px;color:var(--color-text-gray-neutral);"
            >
              Configure network content.
              <div style="margin-top:12px;">
                <ids-button
                  variant="secondary"
                  size="large"
                  label="Toggle Injected Review Child"
                  @ids-button-click=${() =>
                    setArgs({ injectReviewChild: !args.injectReviewChild })}
                ></ids-button>
              </div>
            </div>
          `,
          status: "warning",
        },
        {
          id: "configure-security",
          label: "Security",
          pageTitle: "Security Settings",
          content: html`
            <div
              style="border:1px solid var(--color-border-brand-base);background:var(--color-background-brand-lighter-slate);padding:16px;min-height:120px;color:var(--color-text-gray-neutral);"
            >
              Security configuration content.
              <div style="margin-top:12px;">
                <ids-button
                  variant="secondary"
                  size="large"
                  label=${`Toggle Validation (${args.isValid ? "valid" : "invalid"})`}
                  @ids-button-click=${() => setArgs({ isValid: !args.isValid })}
                ></ids-button>
              </div>
            </div>
          `,
          status: "error",
        },
      ],
    },
    {
      id: "advanced",
      label: "Advanced",
      pageTitle: "Advanced Options",
      content: sampleBlock("Conditionally visible advanced page content."),
      status: "none",
      isVisible: args.showAdvanced,
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
      content: sampleBlock("Final page content."),
      status: "success",
      footerButtons: {
        primaryLabel: "Finish",
        showPrevious: true,
        showCancel: true,
      },
    },
  ];
}

/** Spec Accurate Design — prop-driven steps compose full anatomy. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function Render(args) {
    const [, setArgs] = useArgs();
    const log = (name: string, evt: IdsWizardEventPayload) => {
      setArgs({ lastEvent: `${name}: ${evt.stepCode} (${evt.stepId})` });
    };

    return html`
      <div
        style="padding:24px;background:var(--color-background-surface-primary);min-height:860px;"
      >
        <ids-wizard
          mode=${args.mode}
          size=${args.size}
          wizardtitle=${args.title}
          .showCloseButton=${args.showCloseButton}
          .steps=${buildSteps(args, setArgs)}
          .isPrimaryEnabled=${(ctx: { currentStepId?: string }) =>
            ctx.currentStepId !== "configure-security" || args.isValid}
          .onCancel=${(e: IdsWizardEventPayload) => log("Cancel", e)}
          .onPrevious=${(e: IdsWizardEventPayload) => log("Previous", e)}
          .onNext=${(e: IdsWizardEventPayload) => log("Next", e)}
          .onFinish=${(e: IdsWizardEventPayload) => log("Finish", e)}
          .onStepChange=${(e: IdsWizardEventPayload) => log("StepChange", e)}
        ></ids-wizard>
        <p style="margin-top:16px;color:var(--color-text-gray-neutral-strong);">
          Last event: ${args.lastEvent ?? "No event"}
        </p>
      </div>
    `;
  },
};

/** Documents the deterministic anatomy tree (prop-driven composition). */
export const CompoundAnatomy: Story = {
  name: "Compound Anatomy",
  args: {
    mode: "inline",
    size: "large",
    title: "Header",
    showCloseButton: true,
  },
  render: (args) => {
    const steps: IdsWizardStepInput[] = [
      {
        id: "a",
        label: "Alpha",
        pageTitle: "Alpha page",
        content: sampleBlock("Alpha content"),
        status: "success",
      },
      {
        id: "b",
        label: "Beta",
        pageTitle: "Beta page",
        content: sampleBlock("Beta content"),
      },
    ];

    return html`
      <div style="padding:24px;">
        <ids-wizard
          mode=${args.mode}
          size=${args.size}
          wizardtitle=${args.title}
          .showCloseButton=${args.showCloseButton}
          .steps=${steps}
        ></ids-wizard>
        <pre
          style="margin-top:16px;font-size:12px;color:var(--color-text-gray-neutral);white-space:pre-wrap;"
        >
ids-wizard (Wizard)
  ids-wizard-header
    ids-wizard-header-title
    ids-wizard-close-action?
  ids-wizard-body
    ids-wizard-steps-pane
      ids-wizard-step-item
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
          ids-wizard-primary-button</pre
        >
      </div>
    `;
  },
};
