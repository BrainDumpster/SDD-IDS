import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { SynapseTabs } from "./SynapseTabs";
import {
  SYNAPSE_MODAL_DESIGN_SPEC_PATH,
  SYNAPSE_MODAL_MAIN_NODE_ID,
  SYNAPSE_MODAL_DIALOG_TYPE_NODES,
} from "../spec-contracts/synapse-modal.contract";
import { SYNAPSE_BUTTON_DESIGN_SPEC_PATH } from "../spec-contracts/synapse-button.contract";

const synapseButtonProps = { programme: "synapse" as const, size: "lg" as const };

const FIGMA_BODY =
  "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.";

const meta: Meta<typeof Dialog> = {
  title: "Spec Generated/Synapse/Modal",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Modal (IDS-fork). Source: \`${SYNAPSE_MODAL_DESIGN_SPEC_PATH}\`.`,
          `Figma main set: \`${SYNAPSE_MODAL_MAIN_NODE_ID}\`. Programme delta: \`--modal-control-radius\` → 16px.`,
          `Footer/trigger buttons: \`${SYNAPSE_BUTTON_DESIGN_SPEC_PATH}\`.`,
          "Per-type and usage stories: **Modal/Dialog** subgroup (mirrors IDS).",
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

/** Figma `43461:175961` — Non-Alerting, single primary, 640px Synapse chrome. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate / Non-Alerting",
  render: (args) => (
    <Dialog
      {...args}
      trigger={<Button {...synapseButtonProps}>Open Non-Alerting Dialog</Button>}
      dialogTitle="Non-Alerting"
      dialogType="Non-Alerting"
      description={FIGMA_BODY}
      primaryButtonName="Close"
      enableActionButton
      enableTertiaryButtton={false}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
    />
  ),
};

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
};

export const WarningAndCritical: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Open Warning Dialog</Button>}
        dialogTitle="Warning"
        dialogType="Warning"
        dialogSize="lg"
        dialogClosable
        openDidalog={false}
        description="Warning modal content."
        primaryButtonName="Continue"
        enableActionButton
        tertiaryButtonName="Cancel"
        enableTertiaryButtton
      />
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Open Critical Dialog</Button>}
        dialogTitle="Critical"
        dialogType="Critical"
        dialogSize="lg"
        dialogClosable
        openDidalog={false}
        description="Critical modal content."
        primaryButtonName="Continue"
        enableActionButton
        tertiaryButtonName="Cancel"
        enableTertiaryButtton
      />
    </div>
  ),
};

/** All six `Type=` variants from `ModalDialog-Main` (`43461:175960`). */
export const DialogTypeMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 640 }}>
      {(
        [
          ["Non-Alerting", "Non-Alerting", "Close", false] as const,
          ["Informational", "Informational", "Close", false] as const,
          ["Warning", "Warning", "Continue", true] as const,
          ["Major", "Major", "Continue", true] as const,
          ["Critical", "Critical", "Continue", true] as const,
          ["Destructive", "Destructive", "Continue", true] as const,
        ] as const
      ).map(([label, dialogType, primary, tertiary]) => (
        <Dialog
          key={label}
          programme="synapse"
          trigger={<Button {...synapseButtonProps} variant="secondary">{label}</Button>}
          dialogTitle={label === "Destructive" ? "Critical" : label}
          dialogType={dialogType}
          dialogSize="lg"
          dialogClosable
          openDidalog={false}
          description={
            dialogType === "Warning" || dialogType === "Major" || dialogType === "Critical"
              ? "Continue to <describe the action>?"
              : dialogType === "Destructive"
                ? "Type in CONFIRM below to verify the action."
                : FIGMA_BODY
          }
          primaryButtonName={primary}
          tertiaryButtonName="Cancel"
          enableActionButton
          enableTertiaryButtton={tertiary}
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Matrix nodes: ${Object.values(SYNAPSE_MODAL_DIALOG_TYPE_NODES).join(", ")}.`,
      },
    },
  },
};

export const SingleAndMultiPageUsage: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Open Single-Page Modal</Button>}
        dialogTitle="Header"
        dialogType="Non-Alerting"
        dialogSize="xl"
        dialogClosable
        openDidalog={false}
        description="Single-page modal usage."
        primaryButtonName="Apply"
        enableActionButton
        tertiaryButtonName="Cancel"
        enableTertiaryButtton
      >
        <div
          style={{
            minHeight: 120,
            border: "1px solid var(--color-border-brand-base)",
            background: "var(--color-background-brand-lighter)",
            padding: 16,
          }}
        >
          single page modal swap content
        </div>
      </Dialog>
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Open Multi-Page Modal</Button>}
        dialogTitle="Header"
        dialogType="Non-Alerting"
        dialogSize="xl"
        dialogClosable
        openDidalog={false}
        description="multi page modal usage with tabs/pages"
        primaryButtonName="Apply"
        enableActionButton
        tertiaryButtonName="Cancel"
        enableTertiaryButtton
      >
        <SynapseTabs
          items={[
            { id: "summary", label: "Summary", panel: <div style={{ padding: 8 }}>Summary content</div> },
            { id: "details", label: "Details", panel: <div style={{ padding: 8 }}>Details content</div> },
            { id: "activity", label: "Activity", panel: <div style={{ padding: 8 }}>Activity content</div> },
          ]}
          showAddTab={false}
          minTabWidth={80}
          maxTabWidth={220}
          moreLabel="More"
        />
      </Dialog>
    </div>
  ),
};
