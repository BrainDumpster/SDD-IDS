/**
 * Storybook: design-spec–generated Wizard from `lib/react/synapse/wizard`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy (main = Wizard):
 *   SynapseWizard
 *     SynapseWizardHeader → SynapseWizardHeaderTitle + SynapseWizardCloseAction?
 *     SynapseWizardBody
 *       SynapseWizardStepsPane → SynapseWizardStepItem / Substep*
 *       SynapseWizardContentPane → PageTitle + PageContent + Footer…
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/wizard/design-spec.md
 *
 * Note: Keep React nodes out of story `args` — Storybook `prettyPrint2`
 * recurses on element fibers and throws Maximum call stack size exceeded.
 */
import React, { useCallback, useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_WIZARD_DOCS_DESCRIPTION,
  SYNAPSE_WIZARD_SOURCE_CODE,
} from "./synapse-wizard.developer-usage";
import {
  SynapseWizard,
  type SynapseWizardEventPayload,
  type SynapseWizardProps,
  type SynapseWizardStepInput,
} from "@synapse/react/wizard";
import {
  SynapseButton,
  SynapseButtonLabel,
} from "@synapse/react/button";
import {
  SYNAPSE_WIZARD_DESIGN_SPEC_PATH,
  WIZARD_DEFAULTS,
  WIZARD_MODE_OPTIONS,
  WIZARD_SIZE_OPTIONS,
} from "../../spec-contracts/synapse-wizard.contract";

type WizardStoryArgs = Pick<SynapseWizardProps, "mode" | "size" | "title" | "showCloseButton">;

const meta: Meta<WizardStoryArgs> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Wizard",
  parameters: {
    layout: "fullscreen",
    // Avoid Controls/docs serializing React-laden step trees (prettyPrint2 stack overflow).
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_WIZARD_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_WIZARD_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    mode: { control: "radio", options: [...WIZARD_MODE_OPTIONS] },
    size: { control: "radio", options: [...WIZARD_SIZE_OPTIONS] },
  },
};

export default meta;
type Story = StoryObj<WizardStoryArgs>;

const sampleBlock = {
  border: "1px solid var(--color-border-brand-base)",
  background: "var(--color-background-brand-lighter-slate)",
  padding: 16,
  minHeight: 120,
  color: "var(--color-text-gray-neutral)",
} as const;

function EventLog({ lastEvent }: { lastEvent: string }) {
  return (
    <p style={{ marginTop: 16, color: "var(--color-text-gray-neutral-strong)" }}>
      Last event: {lastEvent}
    </p>
  );
}

function useWizardEventLog() {
  const [lastEvent, setLastEvent] = useState("No event");
  const log = useCallback((name: string, evt: SynapseWizardEventPayload) => {
    setLastEvent(`${name}: ${evt.stepCode} (${evt.stepId})`);
  }, []);
  return { lastEvent, log };
}

/** Spec Accurate Design — prop-driven steps compose full anatomy. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    ...WIZARD_DEFAULTS,
    mode: "inline",
    size: "large",
  },
  render: function Render(args) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [injectReviewChild, setInjectReviewChild] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const { lastEvent, log } = useWizardEventLog();

    const onCancel = useCallback(
      (e: SynapseWizardEventPayload) => log("Cancel", e),
      [log],
    );
    const onPrevious = useCallback(
      (e: SynapseWizardEventPayload) => log("Previous", e),
      [log],
    );
    const onNext = useCallback(
      (e: SynapseWizardEventPayload) => log("Next", e),
      [log],
    );
    const onFinish = useCallback(
      (e: SynapseWizardEventPayload) => log("Finish", e),
      [log],
    );
    const onStepChange = useCallback(
      (e: SynapseWizardEventPayload) => log("StepChange", e),
      [log],
    );
    const isPrimaryEnabled = useCallback(
      (ctx: { currentStepId?: string }) =>
        ctx.currentStepId !== "configure-security" || isValid,
      [isValid],
    );

    const steps = useMemo<SynapseWizardStepInput[]>(() => {
      const reviewChildren: SynapseWizardStepInput[] = [
        {
          id: "review-basic",
          label: "Basic Review",
          pageTitle: "Review - Basic",
          content: <div style={sampleBlock}>Basic review page content.</div>,
          status: "warning",
        },
      ];

      if (injectReviewChild) {
        reviewChildren.push({
          id: "review-deep",
          label: "Deep Review",
          pageTitle: "Review - Deep",
          content: (
            <div style={sampleBlock}>Dynamically injected deep review content.</div>
          ),
          status: "success",
          footerButtons: { primaryLabel: "Next" },
        });
      }

      return [
        {
          id: "welcome",
          label: "Welcome",
          pageTitle: "Welcome",
          content: (
            <div style={sampleBlock}>
              Intro page content.
              <div style={{ marginTop: 12 }}>
                <SynapseButton
                  variant="secondary"
                  size="large"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                >
                  <SynapseButtonLabel>Toggle Advanced Step</SynapseButtonLabel>
                </SynapseButton>
              </div>
            </div>
          ),
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
              content: (
                <div style={sampleBlock}>
                  Configure network content.
                  <div style={{ marginTop: 12 }}>
                    <SynapseButton
                      variant="secondary"
                      size="large"
                      onClick={() => setInjectReviewChild((prev) => !prev)}
                    >
                      <SynapseButtonLabel>Toggle Injected Review Child</SynapseButtonLabel>
                    </SynapseButton>
                  </div>
                </div>
              ),
              status: "warning",
            },
            {
              id: "configure-security",
              label: "Security",
              pageTitle: "Security Settings",
              content: (
                <div style={sampleBlock}>
                  Security configuration content.
                  <div style={{ marginTop: 12 }}>
                    <SynapseButton
                      variant="secondary"
                      size="large"
                      onClick={() => setIsValid((prev) => !prev)}
                    >
                      <SynapseButtonLabel>
                        Toggle Validation ({isValid ? "valid" : "invalid"})
                      </SynapseButtonLabel>
                    </SynapseButton>
                  </div>
                </div>
              ),
              status: "error",
            },
          ],
        },
        {
          id: "advanced",
          label: "Advanced",
          pageTitle: "Advanced Options",
          content: (
            <div style={sampleBlock}>Conditionally visible advanced page content.</div>
          ),
          status: "none",
          isVisible: showAdvanced,
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
          content: <div style={sampleBlock}>Final page content.</div>,
          status: "success",
          footerButtons: {
            primaryLabel: "Finish",
            showPrevious: true,
            showCancel: true,
          },
        },
      ];
    }, [injectReviewChild, isValid, showAdvanced]);

    return (
      <div
        style={{
          padding: 24,
          background: "var(--color-background-surface-primary)",
          minHeight: 860,
        }}
      >
        <SynapseWizard
          mode={args.mode}
          size={args.size}
          title={args.title}
          showCloseButton={args.showCloseButton}
          steps={steps}
          isPrimaryEnabled={isPrimaryEnabled}
          onCancel={onCancel}
          onPrevious={onPrevious}
          onNext={onNext}
          onFinish={onFinish}
          onStepChange={onStepChange}
        />
        <EventLog lastEvent={lastEvent} />
      </div>
    );
  },
};

/** Modal variant — backdrop + centered shell (`mode="modal"`). */
export const Modal: Story = {
  args: {
    ...WIZARD_DEFAULTS,
    mode: "modal",
    size: "medium",
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const { lastEvent, log } = useWizardEventLog();

    const steps = useMemo<SynapseWizardStepInput[]>(
      () => [
        {
          id: "m1",
          label: "Step One",
          pageTitle: "Modal Step One",
          content: <div style={sampleBlock}>Simple modal page content.</div>,
        },
        {
          id: "m2",
          label: "Step Two",
          pageTitle: "Modal Step Two",
          content: <div style={sampleBlock}>Simple modal page content.</div>,
        },
      ],
      [],
    );

    const onCancel = useCallback(
      (e: SynapseWizardEventPayload) => {
        log("Cancel", e);
        setOpen(false);
      },
      [log],
    );
    const onPrevious = useCallback(
      (e: SynapseWizardEventPayload) => log("Previous", e),
      [log],
    );
    const onNext = useCallback(
      (e: SynapseWizardEventPayload) => log("Next", e),
      [log],
    );
    const onFinish = useCallback(
      (e: SynapseWizardEventPayload) => {
        log("Finish", e);
        setOpen(false);
      },
      [log],
    );

    return (
      <div style={{ padding: 24, minHeight: 300 }}>
        <SynapseButton variant="secondary" size="large" onClick={() => setOpen(true)}>
          <SynapseButtonLabel>Open Wizard</SynapseButtonLabel>
        </SynapseButton>
        {open ? (
          <SynapseWizard
            mode={args.mode}
            size={args.size}
            title={args.title}
            showCloseButton={args.showCloseButton}
            steps={steps}
            onCancel={onCancel}
            onPrevious={onPrevious}
            onNext={onNext}
            onFinish={onFinish}
          />
        ) : null}
        <EventLog lastEvent={lastEvent} />
      </div>
    );
  },
};

/** Documents the deterministic anatomy tree (prop-driven composition). */
export const CompoundAnatomy: Story = {
  name: "Compound Anatomy",
  args: {
    ...WIZARD_DEFAULTS,
    mode: "inline",
    size: "large",
  },
  render: function Render(args) {
    const steps = useMemo<SynapseWizardStepInput[]>(
      () => [
        {
          id: "a",
          label: "Alpha",
          pageTitle: "Alpha page",
          content: <div style={sampleBlock}>Alpha content</div>,
          status: "success",
        },
        {
          id: "b",
          label: "Beta",
          pageTitle: "Beta page",
          content: <div style={sampleBlock}>Beta content</div>,
        },
      ],
      [],
    );

    return (
      <div style={{ padding: 24 }}>
        <SynapseWizard
          mode={args.mode}
          size={args.size}
          title={args.title}
          showCloseButton={args.showCloseButton}
          steps={steps}
        />
        <pre
          style={{
            marginTop: 16,
            fontSize: 12,
            color: "var(--color-text-gray-neutral)",
            whiteSpace: "pre-wrap",
          }}
        >
          {`SynapseWizard (Wizard)
  SynapseWizardHeader
    SynapseWizardHeaderTitle
    SynapseWizardCloseAction?
  SynapseWizardBody
    SynapseWizardStepsPane
      SynapseWizardStepItem
        SynapseWizardStepLabel
        SynapseWizardStepStatusIndicator?
    SynapseWizardContentPane
      SynapseWizardPageTitle
      SynapseWizardPageContent
      SynapseWizardFooter
        SynapseWizardProgressLabel
        SynapseWizardFooterActions
          SynapseWizardCancelButton?
          SynapseWizardPreviousButton?
          SynapseWizardPrimaryButton`}
        </pre>
      </div>
    );
  },
};
