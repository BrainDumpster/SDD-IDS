import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "./Button";
import { IdsWizard, type IdsWizardStep } from "./IdsWizard";
import {
  IDS_WIZARD_DESIGN_SPEC_PATH,
  WIZARD_DEFAULTS,
  WIZARD_MODE_OPTIONS,
  WIZARD_SIZE_OPTIONS,
} from "../spec-contracts/ids-wizard.contract";

type WizardStoryArgs = {
  mode?: "inline" | "modal";
  size?: "medium" | "large" | "x-large" | "full-screen";
  title?: string;
  showCloseButton?: boolean;
};

const meta: Meta<WizardStoryArgs> = {
  title: "Spec Generated/IDS/Wizard",
  parameters: {
    // React nodes in `steps` must stay out of story args — Storybook prettyPrint2
    // recurses on element fibers → Maximum call stack size exceeded.
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      source: { type: "code" },
      description: {
        component: `Spec-driven IDS Wizard aligned to \`${IDS_WIZARD_DESIGN_SPEC_PATH}\` and Figma node \`12690:246134\`. Prefer Lib Generated/IDS/Wizard for the design-spec React implementation.`,
      },
    },
  },
  argTypes: {
    mode: { control: "radio", options: WIZARD_MODE_OPTIONS },
    size: { control: "radio", options: WIZARD_SIZE_OPTIONS },
    steps: { control: false, table: { disable: true } },
    trigger: { control: false, table: { disable: true } },
    onCancel: { control: false, table: { disable: true } },
    onPrevious: { control: false, table: { disable: true } },
    onNext: { control: false, table: { disable: true } },
    onFinish: { control: false, table: { disable: true } },
    onStepChange: { control: false, table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<WizardStoryArgs>;

const baseStepContentStyle = {
  border: "1px solid var(--color-border-brand-base)",
  background: "var(--color-background-brand-lighter-slate)",
  padding: 16,
  minHeight: 120,
  color: "var(--color-text-gray-neutral)",
} as const;

export const Default: Story = {
  args: {
    ...WIZARD_DEFAULTS,
    mode: "inline",
    size: "large",
  },
  render: (args) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [injectReviewChild, setInjectReviewChild] = useState(false);
    const [lastEvent, setLastEvent] = useState("No event");
    const [isValid, setIsValid] = useState(false);

    const steps = useMemo<IdsWizardStep[]>(() => {
      const reviewChildren: IdsWizardStep[] = [
        {
          id: "review-basic",
          label: "Basic Review",
          pageTitle: "Review - Basic",
          content: <div style={baseStepContentStyle}>Basic review page content.</div>,
          status: "warning",
        },
      ];

      if (injectReviewChild) {
        reviewChildren.push({
          id: "review-deep",
          label: "Deep Review",
          pageTitle: "Review - Deep",
          content: <div style={baseStepContentStyle}>Dynamically injected deep review content.</div>,
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
            <div style={baseStepContentStyle}>
              Intro page content.
              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" onClick={() => setShowAdvanced((prev) => !prev)}>
                  Toggle Advanced Step
                </Button>
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
                <div style={baseStepContentStyle}>
                  Configure network content.
                  <div style={{ marginTop: 12 }}>
                    <Button variant="secondary" onClick={() => setInjectReviewChild((prev) => !prev)}>
                      Toggle Injected Review Child
                    </Button>
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
                <div style={baseStepContentStyle}>
                  Security configuration content.
                  <div style={{ marginTop: 12 }}>
                    <Button variant="secondary" onClick={() => setIsValid((prev) => !prev)}>
                      Toggle Validation ({isValid ? "valid" : "invalid"})
                    </Button>
                  </div>
                </div>
              ),
              status: "error",
              primaryDisabled: !isValid,
            },
          ],
        },
        {
          id: "advanced",
          label: "Advanced",
          pageTitle: "Advanced Options",
          content: <div style={baseStepContentStyle}>Conditionally visible advanced page content.</div>,
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
          content: <div style={baseStepContentStyle}>Final page content.</div>,
          status: "success",
          footerButtons: { primaryLabel: "Finish", showPrevious: true, showCancel: true },
        },
      ];
    }, [injectReviewChild, isValid, showAdvanced]);

    const handleCancel = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`Cancel: ${evt.stepCode} (${evt.stepId})`);
    }, []);
    const handlePrevious = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`Previous: ${evt.stepCode} (${evt.stepId})`);
    }, []);
    const handleNext = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`Next: ${evt.stepCode} (${evt.stepId})`);
    }, []);
    const handleFinish = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`Finish: ${evt.stepCode} (${evt.stepId})`);
    }, []);
    const handleStepChange = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`StepChange: ${evt.stepCode} (${evt.stepId})`);
    }, []);

    return (
      <div style={{ padding: 24, background: "var(--color-background-surface-primary)", minHeight: 860 }}>
        <IdsWizard
          mode={args.mode}
          size={args.size}
          title={args.title ?? WIZARD_DEFAULTS.title}
          showCloseButton={args.showCloseButton}
          steps={steps}
          onCancel={handleCancel}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onFinish={handleFinish}
          onStepChange={handleStepChange}
        />
        <p style={{ marginTop: 16, color: "var(--color-text-gray-neutral-strong)" }}>Last event: {lastEvent}</p>
      </div>
    );
  },
};

export const Modal: Story = {
  args: {
    ...WIZARD_DEFAULTS,
    mode: "modal",
    size: "medium",
  },
  render: (args) => {
    const [lastEvent, setLastEvent] = useState("No event");
    const steps = useMemo<IdsWizardStep[]>(
      () => [
        {
          id: "m1",
          label: "Step One",
          pageTitle: "Modal Step One",
          content: <div style={baseStepContentStyle}>Simple modal page content.</div>,
        },
        {
          id: "m2",
          label: "Step Two",
          pageTitle: "Modal Step Two",
          content: <div style={baseStepContentStyle}>Simple modal page content.</div>,
        },
      ],
      [],
    );

    const handleCancel = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`Cancel: ${evt.stepCode} (${evt.stepId})`);
    }, []);
    const handlePrevious = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`Previous: ${evt.stepCode} (${evt.stepId})`);
    }, []);
    const handleNext = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`Next: ${evt.stepCode} (${evt.stepId})`);
    }, []);
    const handleFinish = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`Finish: ${evt.stepCode} (${evt.stepId})`);
    }, []);

    return (
      <div style={{ padding: 24, minHeight: 300 }}>
        <IdsWizard
          mode={args.mode}
          size={args.size}
          title={args.title ?? WIZARD_DEFAULTS.title}
          showCloseButton={args.showCloseButton}
          trigger={<Button>Open Wizard</Button>}
          steps={steps}
          onCancel={handleCancel}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onFinish={handleFinish}
        />
        <p style={{ marginTop: 16, color: "var(--color-text-gray-neutral-strong)" }}>Last event: {lastEvent}</p>
      </div>
    );
  },
};
