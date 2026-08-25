/**
 * Storybook: design-spec–generated Wizard from `lib/react/ids/wizard`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy (main = Wizard):
 *   IdsWizard
 *     IdsWizardHeader → IdsWizardHeaderTitle + IdsWizardCloseAction?
 *     IdsWizardBody
 *       IdsWizardStepsPane → IdsWizardStepItem / Substep*
 *       IdsWizardContentPane → PageTitle + PageContent + Footer…
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/wizard/design-spec.md
 *
 * Note: Keep React nodes out of story `args` — Storybook `prettyPrint2`
 * recurses on element fibers and throws Maximum call stack size exceeded.
 */
import React, { useCallback, useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  WIZARD_DOCS_DESCRIPTION,
  WIZARD_SOURCE_CODE,
} from "./ids-wizard.developer-usage";
import {
  IdsWizard,
  type IdsWizardEventPayload,
  type IdsWizardProps,
  type IdsWizardStepInput,
} from "@ids/react/wizard";
import {
  IdsButton,
  IdsButtonLabel,
} from "@ids/react/button";
import {
  IDS_WIZARD_DESIGN_SPEC_PATH,
  WIZARD_DEFAULTS,
  WIZARD_MODE_OPTIONS,
  WIZARD_SIZE_OPTIONS,
} from "../../spec-contracts/ids-wizard.contract";

type WizardStoryArgs = Pick<IdsWizardProps, "mode" | "size" | "title" | "showCloseButton">;

const meta: Meta<WizardStoryArgs> = {
  tags: ["autodocs"],
  title: "Components/IDS/Wizard",
  parameters: {
    layout: "fullscreen",
    // Avoid Controls/docs serializing React-laden step trees (prettyPrint2 stack overflow).
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: WIZARD_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: WIZARD_SOURCE_CODE,
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
  const log = useCallback((name: string, evt: IdsWizardEventPayload) => {
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
      (e: IdsWizardEventPayload) => log("Cancel", e),
      [log],
    );
    const onPrevious = useCallback(
      (e: IdsWizardEventPayload) => log("Previous", e),
      [log],
    );
    const onNext = useCallback(
      (e: IdsWizardEventPayload) => log("Next", e),
      [log],
    );
    const onFinish = useCallback(
      (e: IdsWizardEventPayload) => log("Finish", e),
      [log],
    );
    const onStepChange = useCallback(
      (e: IdsWizardEventPayload) => log("StepChange", e),
      [log],
    );
    const isPrimaryEnabled = useCallback(
      (ctx: { currentStepId?: string }) =>
        ctx.currentStepId !== "configure-security" || isValid,
      [isValid],
    );

    const steps = useMemo<IdsWizardStepInput[]>(() => {
      const reviewChildren: IdsWizardStepInput[] = [
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
                <IdsButton
                  variant="secondary"
                  size="large"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                >
                  <IdsButtonLabel>Toggle Advanced Step</IdsButtonLabel>
                </IdsButton>
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
                    <IdsButton
                      variant="secondary"
                      size="large"
                      onClick={() => setInjectReviewChild((prev) => !prev)}
                    >
                      <IdsButtonLabel>Toggle Injected Review Child</IdsButtonLabel>
                    </IdsButton>
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
                    <IdsButton
                      variant="secondary"
                      size="large"
                      onClick={() => setIsValid((prev) => !prev)}
                    >
                      <IdsButtonLabel>
                        Toggle Validation ({isValid ? "valid" : "invalid"})
                      </IdsButtonLabel>
                    </IdsButton>
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
        <IdsWizard
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

    const steps = useMemo<IdsWizardStepInput[]>(
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
      (e: IdsWizardEventPayload) => {
        log("Cancel", e);
        setOpen(false);
      },
      [log],
    );
    const onPrevious = useCallback(
      (e: IdsWizardEventPayload) => log("Previous", e),
      [log],
    );
    const onNext = useCallback(
      (e: IdsWizardEventPayload) => log("Next", e),
      [log],
    );
    const onFinish = useCallback(
      (e: IdsWizardEventPayload) => {
        log("Finish", e);
        setOpen(false);
      },
      [log],
    );

    return (
      <div style={{ padding: 24, minHeight: 300 }}>
        <IdsButton variant="secondary" size="large" onClick={() => setOpen(true)}>
          <IdsButtonLabel>Open Wizard</IdsButtonLabel>
        </IdsButton>
        {open ? (
          <IdsWizard
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
    const steps = useMemo<IdsWizardStepInput[]>(
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
        <IdsWizard
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
          {`IdsWizard (Wizard)
  IdsWizardHeader
    IdsWizardHeaderTitle
    IdsWizardCloseAction?
  IdsWizardBody
    IdsWizardStepsPane
      IdsWizardStepItem
        IdsWizardStepLabel
        IdsWizardStepStatusIndicator?
    IdsWizardContentPane
      IdsWizardPageTitle
      IdsWizardPageContent
      IdsWizardFooter
        IdsWizardProgressLabel
        IdsWizardFooterActions
          IdsWizardCancelButton?
          IdsWizardPreviousButton?
          IdsWizardPrimaryButton`}
        </pre>
      </div>
    );
  },
};
