import React from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "../../../../storybook/src/components/Dialog";
import { Button } from "../../../../storybook/src/components/Button";
import {
  SYNAPSE_MODAL_DESIGN_SPEC_PATH,
  SYNAPSE_MODAL_MAIN_NODE_ID,
} from "../../../../storybook/src/spec-contracts/synapse-modal.contract";
import { SYNAPSE_BUTTON_DESIGN_SPEC_PATH } from "../../../../storybook/src/spec-contracts/synapse-button.contract";

/** Synapse footer/trigger buttons per `components/synapse/button/design-spec.md`. */
const synapseButtonProps = { programme: "synapse" as const, size: "lg" as const };

const FIGMA_BODY =
  "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.";

const meta: Meta<typeof Dialog> = {
  title: "Spec Generated/Synapse/Modal Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Modal Dialog (IDS Modal contract). Source: \`${SYNAPSE_MODAL_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **Non-Alerting** dialog at **640px**, \`radius-16\`, \`border-neutral-light\` (Figma \`${SYNAPSE_MODAL_MAIN_NODE_ID}\` / \`43461:175961\`).`,
          `Footer and trigger buttons: \`${SYNAPSE_BUTTON_DESIGN_SPEC_PATH}\` (\`programme=\"synapse\"\`, \`size=\"lg\"\`).`,
          "Theme: `components/synapse-theme.css`. Programme chrome: `programme=\"synapse\"` on `Dialog` + `Button`.",
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
  return () => console.log(`[Synapse Modal event] ${name}`);
}

/** Figma `43461:175961` — Non-Alerting, single primary, 640px Synapse chrome. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
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

/** All six `Type=` variants from `ModalDialog-Main` (`43461:175960`). */
export const DialogTypeMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 640 }}>
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Non-Alerting</Button>}
        dialogTitle="Non-Alerting"
        dialogType="Non-Alerting"
        dialogSize="lg"
        dialogClosable
        openDidalog={false}
        description={FIGMA_BODY}
        primaryButtonName="Close"
        enableActionButton
        enableTertiaryButtton={false}
      />
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Informational</Button>}
        dialogTitle="Informational"
        dialogType="Informational"
        dialogSize="lg"
        dialogClosable
        openDidalog={false}
        description={FIGMA_BODY}
        primaryButtonName="Close"
        enableActionButton
        enableTertiaryButtton={false}
      />
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Warning</Button>}
        dialogTitle="Warning"
        dialogType="Warning"
        dialogSize="lg"
        dialogClosable
        openDidalog={false}
        description="Continue to <describe the action>?"
        primaryButtonName="Continue"
        tertiaryButtonName="Cancel"
        enableActionButton
        enableTertiaryButtton
      />
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Major</Button>}
        dialogTitle="Major"
        dialogType="Major"
        dialogSize="lg"
        dialogClosable
        openDidalog={false}
        description="Continue to <describe the action>?"
        primaryButtonName="Continue"
        tertiaryButtonName="Cancel"
        enableActionButton
        enableTertiaryButtton
      />
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Critical</Button>}
        dialogTitle="Critical"
        dialogType="Critical"
        dialogSize="lg"
        dialogClosable
        openDidalog={false}
        description="Continue to <describe the action>?"
        primaryButtonName="Continue"
        tertiaryButtonName="Cancel"
        enableActionButton
        enableTertiaryButtton
      />
      <Dialog
        programme="synapse"
        trigger={<Button {...synapseButtonProps} variant="secondary">Destructive</Button>}
        dialogTitle="Critical"
        dialogType="Destructive"
        dialogSize="lg"
        dialogClosable
        openDidalog={false}
        description="Type in CONFIRM below to verify the action."
        primaryButtonName="Continue"
        tertiaryButtonName="Cancel"
        enableActionButton
        enableTertiaryButtton
      />
    </div>
  ),
};
