/**
 * Storybook: IDS Lit Wizard — Modal (`mode="modal"`)
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/wizard/design-spec.md
 * API: lib/react/ids/wizard
 * Examples: storybook/src/components/lib-generated/Wizard.stories.tsx (Modal)
 * Figma: WizardInline-Main 12690:246134 (shared shell); modal uses overlay + dialog role
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
  WIZARD_MODAL_DOCS_DESCRIPTION,
  WIZARD_SOURCE_CODE,
} from "./ids-wizard.developer-usage";

type WizardModalStoryArgs = {
  mode: IdsWizardMode;
  size: IdsWizardSize;
  title: string;
  showCloseButton: boolean;
  open: boolean;
  lastEvent?: string;
};

const meta: Meta<WizardModalStoryArgs> = {
  title: "Spec Generated/IDS/Wizard Modal",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: WIZARD_MODAL_DOCS_DESCRIPTION },
      source: { code: WIZARD_SOURCE_CODE, language: "js" },
    },
  },
  argTypes: {
    mode: { control: "radio", options: ["inline", "modal"] },
    size: {
      control: "radio",
      options: ["medium", "large", "x-large", "full-screen"],
    },
    open: { control: "boolean" },
    showCloseButton: { control: "boolean" },
  },
  args: {
    mode: "modal",
    size: "medium",
    title: "Header",
    showCloseButton: true,
    open: false,
    lastEvent: "No event",
  },
};

export default meta;
type Story = StoryObj<WizardModalStoryArgs>;

const modalSteps: IdsWizardStepInput[] = [
  {
    id: "m1",
    label: "Step One",
    pageTitle: "Modal Step One",
    content: html`
      <div
        style="border:1px solid var(--color-border-brand-base);background:var(--color-background-brand-lighter-slate);padding:16px;min-height:120px;color:var(--color-text-gray-neutral);"
      >
        Simple modal page content.
      </div>
    `,
  },
  {
    id: "m2",
    label: "Step Two",
    pageTitle: "Modal Step Two",
    content: html`
      <div
        style="border:1px solid var(--color-border-brand-base);background:var(--color-background-brand-lighter-slate);padding:16px;min-height:120px;color:var(--color-text-gray-neutral);"
      >
        Simple modal page content.
      </div>
    `,
  },
];

/** Modal variant — backdrop + centered shell (`mode="modal"`). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function Render(args) {
    const [, setArgs] = useArgs();
    const setOpen = (next: boolean) => setArgs({ open: next });
    const log = (name: string, evt: IdsWizardEventPayload) => {
      setArgs({ lastEvent: `${name}: ${evt.stepCode} (${evt.stepId})` });
    };

    return html`
      <div style="padding:24px;min-height:300px;">
        <ids-button
          variant="secondary"
          size="large"
          label="Open Wizard"
          @ids-button-click=${() => setOpen(true)}
        ></ids-button>
        ${args.open
          ? html`
              <ids-wizard
                mode=${args.mode}
                size=${args.size}
                wizardtitle=${args.title}
                .showCloseButton=${args.showCloseButton}
                .steps=${modalSteps}
                .onCancel=${(e: IdsWizardEventPayload) => {
                  log("Cancel", e);
                  setOpen(false);
                }}
                .onPrevious=${(e: IdsWizardEventPayload) => log("Previous", e)}
                .onNext=${(e: IdsWizardEventPayload) => log("Next", e)}
                .onFinish=${(e: IdsWizardEventPayload) => {
                  log("Finish", e);
                  setOpen(false);
                }}
              ></ids-wizard>
            `
          : null}
        <p style="margin-top:16px;color:var(--color-text-gray-neutral-strong);">
          Last event: ${args.lastEvent ?? "No event"}
        </p>
      </div>
    `;
  },
};
