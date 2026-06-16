import React, { useCallback, useMemo, useState } from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../../../storybook/src/components/Button";
import { SynapseWizard } from "../../../../storybook/src/components/SynapseWizard";
import type { IdsWizardStep } from "../../../../storybook/src/components/IdsWizard";
import {
  SYNAPSE_WIZARD_DESIGN_SPEC_PATH,
  SYNAPSE_WIZARD_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_WIZARD_IDS_MAIN_NODE_ID,
  SYNAPSE_WIZARD_MAIN_NODE_ID,
  WIZARD_DEFAULTS,
  WIZARD_MODE_OPTIONS,
  WIZARD_SIZE_OPTIONS,
} from "../../../../storybook/src/spec-contracts/synapse-wizard.contract";

/** Modal trigger + footer only — inline wizard content toggles use default Button chrome (IDS parity). */
const synapseModalButton = { programme: "synapse" as const, size: "lg" as const };

const meta: Meta<typeof SynapseWizard> = {
  title: "Spec Generated/Synapse/Wizard",
  component: SynapseWizard,
  parameters: {
    layout: "fullscreen",
    controls: { expanded: false },
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Wizard (IDS contract). Source: \`${SYNAPSE_WIZARD_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_WIZARD_IDS_BASELINE_SPEC_PATH}\` (Figma \`${SYNAPSE_WIZARD_IDS_MAIN_NODE_ID}\`).`,
          `Synapse modal evidence: Figma \`${SYNAPSE_WIZARD_MAIN_NODE_ID}\`; modal shell \`--modal-control-radius\` → 16px; footer/trigger \`Button programme=\"synapse\"\`.`,
          "Mirrors all IDS Wizard Storybook examples.",
        ].join(" "),
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
type Story = StoryObj<typeof SynapseWizard>;

const baseStepContentStyle = {
  border: "1px solid var(--color-border-brand-base)",
  background: "var(--color-background-brand-lighter)",
  padding: 16,
  minHeight: 120,
  color: "var(--color-text-neutral)",
} as const;

function SynapseWizardDefaultDemo() {
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
    <div style={{ padding: 24, background: "var(--color-background-surface-1)", minHeight: 860 }}>
      <SynapseWizard
        {...WIZARD_DEFAULTS}
        mode="inline"
        size="large"
        steps={steps}
        onCancel={handleCancel}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFinish={handleFinish}
        onStepChange={handleStepChange}
      />
      <p style={{ marginTop: 16, color: "var(--color-text-neutral-strong)" }}>Last event: {lastEvent}</p>
    </div>
  );
}

/** IDS `Default` — full interactive inline wizard (Synapse theme; inline footer matches IDS). */
export const Default: Story = {
  render: () => <SynapseWizardDefaultDemo />,
};

const inlineDefaultSteps: IdsWizardStep[] = [
  { id: "welcome", label: "Welcome", pageTitle: "Welcome", content: <div style={baseStepContentStyle}>Intro page content.</div>, status: "success" },
  { id: "configure", label: "Configure", pageTitle: "Configure", content: <div style={baseStepContentStyle}>Configuration content.</div>, status: "warning" },
  { id: "review", label: "Review", pageTitle: "Review", content: <div style={baseStepContentStyle}>Review content.</div>, status: "error" },
  { id: "finish", label: "Finish", pageTitle: "Finish", content: <div style={baseStepContentStyle}>Final content.</div>, status: "success" },
];

const modalModeSteps: IdsWizardStep[] = [
  { id: "m1", label: "Step One", pageTitle: "Modal Step One", content: <div style={baseStepContentStyle}>Simple modal page content.</div> },
  { id: "m2", label: "Step Two", pageTitle: "Modal Step Two", content: <div style={baseStepContentStyle}>Simple modal page content.</div> },
];

/** IDS `InlineDefault` (generated gate). */
export const InlineDefault: Story = {
  render: () => {
    const [lastEvent, setLastEvent] = useState("No event");
    const handleStepChange = useCallback((evt: { stepCode: string; stepId: string }) => {
      setLastEvent(`step change ${evt.stepCode} (${evt.stepId})`);
    }, []);
    return (
      <div style={{ padding: 24, background: "var(--color-background-surface-1)", minHeight: 700 }}>
        <SynapseWizard mode="inline" size="large" steps={inlineDefaultSteps} onStepChange={handleStepChange} />
        <p style={{ marginTop: 16, color: "var(--color-text-neutral-strong)" }}>Last event: {lastEvent}</p>
      </div>
    );
  },
};

/** IDS `ModalMode` (generated gate). */
export const ModalMode: Story = {
  render: () => {
    const [lastEvent, setLastEvent] = useState("No event");
    return (
      <div style={{ padding: 24, minHeight: 300 }}>
        <SynapseWizard
          mode="modal"
          size="medium"
          trigger={<Button {...synapseModalButton}>Open Wizard</Button>}
          steps={modalModeSteps}
          onCancel={(evt) => setLastEvent(`cancel ${evt.stepCode}`)}
          onNext={(evt) => setLastEvent(`next ${evt.stepCode}`)}
          onFinish={(evt) => setLastEvent(`finish ${evt.stepCode}`)}
        />
        <p style={{ marginTop: 16 }}>Last event: {lastEvent}</p>
      </div>
    );
  },
};

const specTokens = [
  "--color-gradient-overflow-vertical-start",
  "--color-gradient-overflow-vertical-end",
  "--color-background-component",
  "--color-background-gray-lighter",
  "--color-background-brand-lighter",
  "--color-text-neutral-strong",
  "--color-text-neutral",
  "--color-text-disabled",
  "--color-text-brand-strong",
  "--color-text-white",
  "--color-border-accessible",
  "--color-border-brand-base",
  "--color-border-disabled",
  "--color-border-transparent-brand",
  "--color-background-controls-brand-base",
  "--color-icon-alerting-success",
  "--color-icon-alerting-minor",
  "--color-icon-alerting-critical",
  "--modal-control-radius",
] as const;

/** IDS `TokenInspector` (generated gate). */
export const TokenInspector: Story = {
  render: () => (
    <div className="sbTokenInspector">
      <style>{`
        .sbTokenInspector { display: grid; gap: 8px; max-width: 880px; padding: 16px; }
        .sbTokenHeader { font-size: 12px; opacity: 0.8; }
        .sbTokenRow {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) 72px 120px;
          align-items: center;
          gap: 12px;
          padding: 6px 8px;
          border: 1px solid var(--color-border-neutral-light, #c5c5c5);
          border-radius: 4px;
          background: var(--color-background-component, #ffffff);
        }
        .sbTokenCode {
          font-family: ui-monospace, monospace;
          font-size: 12px;
        }
        .sbTokenSwatch {
          width: 64px;
          height: 20px;
          border: 1px solid var(--color-border-accessible, #757575);
          border-radius: var(--modal-control-radius, 2px);
        }
      `}</style>
      <div className="sbTokenHeader">Spec token inspector (Synapse theme; includes modal radius alias)</div>
      {specTokens.map((token) => (
        <div key={token} className="sbTokenRow">
          <span className="sbTokenCode">{`var(${token})`}</span>
          <span className="sbTokenSwatch" style={{ background: token.includes("radius") ? undefined : `var(${token})` }} />
          <span className="sbTokenSample" style={{ color: token.includes("radius") ? undefined : `var(${token})` }}>
            {token === "--modal-control-radius" ? "modal shell" : "Sample"}
          </span>
        </div>
      ))}
    </div>
  ),
};
