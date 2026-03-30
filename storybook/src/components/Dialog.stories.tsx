import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

const meta: Meta<typeof Dialog> = {
  title: "Synapse/Dialog",
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

function BodyStack() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextInput label="Display name" placeholder="Enter your name" />
      <TextInput label="Email" type="email" placeholder="you@example.com" />
    </div>
  );
}

export const None_Closable_Default: Story = {
  render: () => (
    <Dialog
      trigger={<Button>Open Dialog</Button>}
      dialogTitle="Confirm action"
      dialogType="None"
      dialogSize="lg"
      dialogClosable={true}
      openDidalog={false}
      description="Are you sure you want to proceed? This action cannot be undone."
      primaryButtonName="Delete"
      enableActionButton={true}
      tertiaryButtonName="Cancel"
      enableTertiaryButtton={true}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <BodyStack />
    </Dialog>
  ),
};

export const Info_WithPrimaryDisabled: Story = {
  render: () => (
    <Dialog
      trigger={<Button variant="secondary">Open Info Dialog</Button>}
      dialogTitle="Information"
      dialogType="Info"
      dialogSize="lg"
      dialogClosable={true}
      openDidalog={false}
      description="Review details before continuing."
      primaryButtonName="Continue"
      enableActionButton={false}
      tertiaryButtonName="Back"
      enableTertiaryButtton={true}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
        Body content example (children).
      </div>
    </Dialog>
  ),
};

export const Warning_WithTertiaryDisabled_AndOpenByDefault: Story = {
  render: () => (
    <Dialog
      trigger={<Button variant="secondary">Open Warning Dialog</Button>}
      dialogTitle="Warning"
      dialogType="Warning"
      dialogSize="lg"
      dialogClosable={true}
      openDidalog={true}
      description="Some changes may affect system behavior."
      primaryButtonName="Apply"
      enableActionButton={true}
      tertiaryButtonName="Dismiss"
      enableTertiaryButtton={false}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
        This dialog opens by default using `openDidalog=true`.
      </div>
    </Dialog>
  ),
};

export const Major_ClosableFalse: Story = {
  render: () => (
    <Dialog
      trigger={<Button variant="secondary">Open Major Dialog</Button>}
      dialogTitle="Major"
      dialogType="Major"
      dialogSize="lg"
      dialogClosable={false}
      openDidalog={false}
      description="This dialog is not closeable via the close icon."
      primaryButtonName="Confirm"
      enableActionButton={true}
      tertiaryButtonName="Secondary"
      enableTertiaryButtton={true}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
        Close icon is hidden when `dialogClosable=false`.
      </div>
    </Dialog>
  ),
};

export const Danger_Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<"sm" | "lg" | "xl">("lg");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => setSize("sm")}>
            sm
          </Button>
          <Button variant="secondary" onClick={() => setSize("lg")}>
            lg
          </Button>
          <Button variant="secondary" onClick={() => setSize("xl")}>
            xl
          </Button>
        </div>
        <Dialog
          trigger={<Button>Open Danger Dialog</Button>}
          dialogTitle="Danger"
          dialogType="Danger"
          dialogSize={size}
          dialogClosable={true}
          openDidalog={false}
          description="Destructive action example."
          primaryButtonName="Confirm"
          enableActionButton={true}
          tertiaryButtonName="Cancel"
          enableTertiaryButtton={true}
          onClose={logEvent("onClose")}
          onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
          onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
        >
          <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
            Size: {size}
          </div>
        </Dialog>
      </div>
    );
  },
};
