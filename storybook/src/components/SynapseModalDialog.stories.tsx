import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { SynapseTextInput } from "./SynapseTextInput";
import { SynapseTabs } from "./SynapseTabs";
import {
  SYNAPSE_MODAL_DESIGN_SPEC_PATH,
  SYNAPSE_MODAL_DIALOG_TYPE_NODES,
} from "../spec-contracts/synapse-modal.contract";
import { SYNAPSE_BUTTON_DESIGN_SPEC_PATH } from "../spec-contracts/synapse-button.contract";

const synapseButtonProps = { programme: "synapse" as const, size: "lg" as const };

const FIGMA_BODY =
  "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.";

const meta: Meta<typeof Dialog> = {
  title: "Spec Generated/Synapse/Modal/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Modal dialog (IDS-fork). Source: \`${SYNAPSE_MODAL_DESIGN_SPEC_PATH}\`.`,
          `Footer/trigger buttons: \`${SYNAPSE_BUTTON_DESIGN_SPEC_PATH}\` (\`programme=\"synapse\"\`, \`size=\"lg\"\`).`,
          "Theme: `components/synapse-theme.css` (`--modal-control-radius` → 16px).",
        ].join(" "),
      },
    },
  },
  args: {
    programme: "synapse",
    dialogSize: "lg",
    dialogClosable: true,
    openDidalog: false,
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

function logEvent(name: string) {
  return () => {
    // eslint-disable-next-line no-console
    console.log(`[Synapse Modal event] ${name}`);
  };
}

export const NonAlerting: Story = {
  render: () => (
    <Dialog
      programme="synapse"
      trigger={<Button {...synapseButtonProps}>Open Dialog</Button>}
      dialogTitle="Non-Alerting"
      dialogType="Non-Alerting"
      dialogSize="lg"
      dialogClosable
      openDidalog={false}
      description={FIGMA_BODY}
      primaryButtonName="Close"
      enableActionButton
      enableTertiaryButtton={false}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
    />
  ),
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_MODAL_DIALOG_TYPE_NODES.nonAlerting}\`.` } },
  },
};

export const Informational: Story = {
  render: () => (
    <Dialog
      programme="synapse"
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Informational Dialog</Button>}
      dialogTitle="Informational"
      dialogType="Informational"
      dialogSize="lg"
      dialogClosable
      openDidalog={false}
      description={FIGMA_BODY}
      primaryButtonName="Close"
      enableActionButton
      enableTertiaryButtton={false}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
    />
  ),
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_MODAL_DIALOG_TYPE_NODES.informational}\`.` } },
  },
};

export const Warning: Story = {
  render: () => (
    <Dialog
      programme="synapse"
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Warning Dialog</Button>}
      dialogTitle="Warning"
      dialogType="Warning"
      dialogSize="lg"
      dialogClosable
      openDidalog={false}
      description={FIGMA_BODY}
      primaryButtonName="Continue"
      enableActionButton
      tertiaryButtonName="Cancel"
      enableTertiaryButtton
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
        Continue to &lt;describe the action&gt;?
      </div>
    </Dialog>
  ),
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_MODAL_DIALOG_TYPE_NODES.warning}\`.` } },
  },
};

export const Major: Story = {
  render: () => (
    <Dialog
      programme="synapse"
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Major Dialog</Button>}
      dialogTitle="Major"
      dialogType="Major"
      dialogSize="lg"
      dialogClosable
      openDidalog={false}
      description={FIGMA_BODY}
      primaryButtonName="Continue"
      enableActionButton
      tertiaryButtonName="Cancel"
      enableTertiaryButtton
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
        Continue to &lt;describe the action&gt;?
      </div>
    </Dialog>
  ),
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_MODAL_DIALOG_TYPE_NODES.major}\`.` } },
  },
};

export const Critical: Story = {
  render: () => (
    <Dialog
      programme="synapse"
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Critical Dialog</Button>}
      dialogTitle="Critical"
      dialogType="Critical"
      dialogSize="lg"
      dialogClosable
      openDidalog={false}
      description={FIGMA_BODY}
      primaryButtonName="Continue"
      enableActionButton
      tertiaryButtonName="Cancel"
      enableTertiaryButtton
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
        Continue to &lt;describe the action&gt;?
      </div>
    </Dialog>
  ),
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_MODAL_DIALOG_TYPE_NODES.critical}\`.` } },
  },
};

export const Destructive: Story = {
  render: () => {
    const [confirmText, setConfirmText] = useState("");
    const confirmValid = confirmText.trim().toUpperCase() === "CONFIRM";
    return (
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Open Destructive Dialog</Button>}
        dialogTitle="Critical"
        dialogType="Destructive"
        dialogSize="lg"
        dialogClosable
        openDidalog={false}
        description={FIGMA_BODY}
        primaryButtonName="Action"
        enableActionButton={confirmValid}
        tertiaryButtonName="Cancel"
        enableTertiaryButtton
        onClose={logEvent("onClose")}
        onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
        onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
      >
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
      </Dialog>
    );
  },
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_MODAL_DIALOG_TYPE_NODES.destructive}\`.` } },
  },
};

export const SinglePageModalUsage: Story = {
  render: () => (
    <Dialog
      programme="synapse"
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Single-Page Modal</Button>}
      dialogTitle="Header"
      dialogType="Non-Alerting"
      dialogSize="xl"
      dialogClosable
      openDidalog={false}
      description={FIGMA_BODY}
      primaryButtonName="Apply"
      enableActionButton
      tertiaryButtonName="Cancel"
      enableTertiaryButtton
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div
        style={{
          minHeight: 220,
          border: "1px solid var(--color-border-brand-base)",
          background: "var(--color-background-brand-lighter)",
          padding: 16,
          color: "var(--color-text-neutral)",
        }}
      >
        <strong style={{ display: "block", marginBottom: 8 }}>Swap content</strong>
        Single-page usage keeps one continuous content panel without tab/page switching.
      </div>
    </Dialog>
  ),
};

export const MultiPageModalUsage: Story = {
  render: () => (
    <Dialog
      programme="synapse"
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Multi-Page Modal</Button>}
      dialogTitle="Header"
      dialogType="Non-Alerting"
      dialogSize="xl"
      dialogClosable
      openDidalog={false}
      description={FIGMA_BODY}
      primaryButtonName="Apply"
      enableActionButton
      tertiaryButtonName="Cancel"
      enableTertiaryButtton
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <SynapseTabs
        items={[
          {
            id: "details",
            label: "Details",
            panel: "Page 1 content: overview details and context.",
          },
          {
            id: "settings",
            label: "Settings",
            panel: "Page 2 content: configurable settings and options.",
          },
          {
            id: "review",
            label: "Review",
            panel: "Page 3 content: final review before apply.",
          },
          {
            id: "audit",
            label: "Audit Trail",
            panel: "Optional hidden page content via overflow.",
          },
          {
            id: "integrations",
            label: "Integrations",
            panel: "Optional hidden page content via overflow.",
          },
        ]}
        moreLabel="More"
      />
    </Dialog>
  ),
};
