import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

const meta: Meta<typeof Dialog> = {
  title: "IDS/Modal/Dialog",
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

function logEvent(name: string) {
  return () => {
    // eslint-disable-next-line no-console
    console.log(`[Dialog event] ${name}`);
  };
}

export const NonAlerting: Story = {
  render: () => (
    <Dialog
      trigger={<Button>Open Dialog</Button>}
      dialogTitle="Non-Alerting"
      dialogType="Non-Alerting"
      dialogSize="lg"
      dialogClosable={true}
      openDidalog={false}
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryButtonName="Close"
      enableActionButton={true}
      enableTertiaryButtton={false}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
    />
  ),
};

export const Informational: Story = {
  render: () => (
    <Dialog
      trigger={<Button variant="secondary">Open Informational Dialog</Button>}
      dialogTitle="Informational"
      dialogType="Informational"
      dialogSize="lg"
      dialogClosable={true}
      openDidalog={false}
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryButtonName="Close"
      enableActionButton={true}
      enableTertiaryButtton={false}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <Dialog
      trigger={<Button variant="secondary">Open Warning Dialog</Button>}
      dialogTitle="Warning"
      dialogType="Warning"
      dialogSize="lg"
      dialogClosable={true}
      openDidalog={false}
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryButtonName="Continue"
      enableActionButton={true}
      tertiaryButtonName="Cancel"
      enableTertiaryButtton={true}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
        Continue to &lt;describe the action&gt;?
      </div>
    </Dialog>
  ),
};

export const Major: Story = {
  render: () => (
    <Dialog
      trigger={<Button variant="secondary">Open Major Dialog</Button>}
      dialogTitle="Major"
      dialogType="Major"
      dialogSize="lg"
      dialogClosable={true}
      openDidalog={false}
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryButtonName="Continue"
      enableActionButton={true}
      tertiaryButtonName="Cancel"
      enableTertiaryButtton={true}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
        Continue to &lt;describe the action&gt;?
      </div>
    </Dialog>
  ),
};

export const Critical: Story = {
  render: () => (
    <Dialog
      trigger={<Button variant="secondary">Open Critical Dialog</Button>}
      dialogTitle="Critical"
      dialogType="Critical"
      dialogSize="lg"
      dialogClosable={true}
      openDidalog={false}
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryButtonName="Continue"
      enableActionButton={true}
      tertiaryButtonName="Cancel"
      enableTertiaryButtton={true}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
        Continue to &lt;describe the action&gt;?
      </div>
    </Dialog>
  ),
};

export const Destructive: Story = {
  render: () => {
    const [confirmText, setConfirmText] = useState("");
    const confirmValid = confirmText.trim().toUpperCase() === "CONFIRM";
    return (
      <Dialog
        trigger={<Button variant="secondary">Open Destructive Dialog</Button>}
        dialogTitle="Critical"
        dialogType="Destructive"
        dialogSize="lg"
        dialogClosable={true}
        openDidalog={false}
        description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
        primaryButtonName="Action"
        enableActionButton={confirmValid}
        tertiaryButtonName="Cancel"
        enableTertiaryButtton={true}
        onClose={logEvent("onClose")}
        onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
        onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
            Type in CONFIRM below to verify the action.
          </div>
          <TextInput
            ariaLabel="Type CONFIRM"
            value={confirmText}
            onValueChange={setConfirmText}
            placeholder="CONFIRM"
          />
        </div>
      </Dialog>
    );
  },
};
