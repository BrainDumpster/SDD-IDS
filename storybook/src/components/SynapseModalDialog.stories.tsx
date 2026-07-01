import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import { MODAL_FIGMA_BODY } from "@component-contracts/ids/modal.contract";
import { IdsModal } from "./IdsModal";
import { Button } from "./Button";
import { SynapseTabs } from "./SynapseTabs";
import { SynapseTextInput } from "./SynapseTextInput";
import {
  SYNAPSE_MODAL_DESIGN_SPEC_PATH,
  SYNAPSE_MODAL_MAIN_NODE_ID,
} from "../spec-contracts/synapse-modal.contract";

const synapseButtonProps = { programme: "synapse" as const, size: "lg" as const };

const meta: Meta<typeof IdsModal> = {
  title: "Spec Generated/Synapse/Modal/Dialog",
  component: IdsModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Modal dialog (IDS-fork). Source: \`${SYNAPSE_MODAL_DESIGN_SPEC_PATH}\`.`,
          `Composition API: \`IdsModal.Title\` → \`IdsModal.Body\` → \`IdsModal.Footer\` with projected \`Button programme=\"synapse\"\`.`,
          `Figma main set: \`${SYNAPSE_MODAL_MAIN_NODE_ID}\`. Theme: \`--modal-control-radius\` → 16px.`,
        ].join(" "),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsModal>;

function logEvent(name: string) {
  return () => {
    // eslint-disable-next-line no-console
    console.log(`[Synapse Modal Dialog event] ${name}`);
  };
}

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <IdsModal
      trigger={<Button {...synapseButtonProps}>Open Dialog</Button>}
      scenario="dialog"
      type="non-alerting"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Non-Alerting</IdsModal.Title>
      <IdsModal.Body description={MODAL_FIGMA_BODY} />
      <IdsModal.Footer>
        <Button {...synapseButtonProps} onClick={logEvent("onPrimaryAction")}>
          Close
        </Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};

export const NonAlerting: Story = {
  render: () => (
    <IdsModal
      trigger={<Button {...synapseButtonProps}>Open Dialog</Button>}
      scenario="dialog"
      type="non-alerting"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Non-Alerting</IdsModal.Title>
      <IdsModal.Body description={MODAL_FIGMA_BODY} />
      <IdsModal.Footer>
        <Button {...synapseButtonProps} onClick={logEvent("onPrimaryAction")}>
          Close
        </Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};

export const Informational: Story = {
  render: () => (
    <IdsModal
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Informational Dialog</Button>}
      scenario="dialog"
      type="informational"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Informational</IdsModal.Title>
      <IdsModal.Body description={MODAL_FIGMA_BODY} />
      <IdsModal.Footer>
        <Button {...synapseButtonProps}>Close</Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};

export const Warning: Story = {
  render: () => (
    <IdsModal
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Warning Dialog</Button>}
      scenario="dialog"
      type="warning"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Warning</IdsModal.Title>
      <IdsModal.Body description={MODAL_FIGMA_BODY}>
        <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
          Continue to &lt;describe the action&gt;?
        </div>
      </IdsModal.Body>
      <IdsModal.Footer>
        <Button {...synapseButtonProps} variant="tertiary" onClick={logEvent("onTertiaryAction")}>
          Cancel
        </Button>
        <Button {...synapseButtonProps} onClick={logEvent("onPrimaryAction")}>
          Continue
        </Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};

export const Destructive: Story = {
  render: () => {
    const [confirmText, setConfirmText] = useState("");
    const confirmValid = confirmText.trim().toUpperCase() === "CONFIRM";
    return (
      <IdsModal
        trigger={<Button {...synapseButtonProps} variant="secondary">Open Destructive Dialog</Button>}
        scenario="dialog"
        type="destructive"
        size="large"
        defaultOpen={false}
        onClose={logEvent("onClose")}
      >
        <IdsModal.Title>Critical</IdsModal.Title>
        <IdsModal.Body description={MODAL_FIGMA_BODY}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
              Type in CONFIRM below to verify the action.
            </div>
            <SynapseTextInput
              ariaLabel="Type CONFIRM"
              value={confirmText}
              onValueChange={setConfirmText}
              placeholder="CONFIRM"
            />
          </div>
        </IdsModal.Body>
        <IdsModal.Footer>
          <Button {...synapseButtonProps} variant="tertiary">
            Cancel
          </Button>
          <Button {...synapseButtonProps} variant="destructive" disabled={!confirmValid}>
            Action
          </Button>
        </IdsModal.Footer>
      </IdsModal>
    );
  },
};

export const SinglePageModalUsage: Story = {
  name: "Single-Page Modal Usage",
  render: () => (
    <IdsModal
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Single-Page Modal</Button>}
      scenario="single-page"
      type="non-alerting"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Header</IdsModal.Title>
      <IdsModal.Body description="Single-page modal usage.">
        <div
          style={{
            minHeight: 220,
            border: "1px solid var(--color-border-brand-base)",
            background: "var(--color-background-brand-lighter)",
            padding: 16,
            color: "var(--color-text-neutral)",
          }}
        >
          Single-page usage keeps one continuous content panel without tab/page switching.
        </div>
      </IdsModal.Body>
      <IdsModal.Footer>
        <Button {...synapseButtonProps} variant="tertiary" onClick={logEvent("onTertiaryAction")}>
          Cancel
        </Button>
        <Button {...synapseButtonProps} onClick={logEvent("onPrimaryAction")}>
          Apply
        </Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};

export const MultiPageModalUsage: Story = {
  name: "Multi-Page Modal Usage",
  render: () => (
    <IdsModal
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Multi-Page Modal</Button>}
      scenario="multi-page"
      type="non-alerting"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Header</IdsModal.Title>
      <IdsModal.Body description={MODAL_FIGMA_BODY}>
        <SynapseTabs
          items={[
            { id: "details", label: "Details", panel: "Page 1 content." },
            { id: "settings", label: "Settings", panel: "Page 2 content." },
            { id: "review", label: "Review", panel: "Page 3 content." },
          ]}
          moreLabel="More"
        />
      </IdsModal.Body>
      <IdsModal.Footer>
        <Button {...synapseButtonProps} variant="tertiary">
          Cancel
        </Button>
        <Button {...synapseButtonProps}>Apply</Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};
