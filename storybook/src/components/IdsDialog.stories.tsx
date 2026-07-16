import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Dialog> = {
  title: "Spec Generated/IDS/Modal/Dialog",
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

function logEvent(name: string) {
  return () => {
    console.log(`[Dialog event] ${name}`);
  };
}

export const NonAlerting: Story = {
  render: () => (
    <Dialog
      trigger={<Button>Open Dialog</Button>}
      dialogTitle="Non-Alerting"
      dialogType="Non-Alerting"      dialogClosable={true}
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
      dialogType="Informational"      dialogClosable={true}
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
      dialogType="Warning"      dialogClosable={true}
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
      dialogType="Major"      dialogClosable={true}
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
      dialogType="Critical"      dialogClosable={true}
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
        dialogType="Destructive"        dialogClosable={true}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ color: "var(--color-text-neutral)", lineHeight: "20px" }}>
            Type in CONFIRM below to verify the action.
          </div>
          <div style={{ width: "300px", "--corner-radius-radius-4": "0" } as React.CSSProperties}>
            <TextInput
              ariaLabel="Type CONFIRM"
              value={confirmText}
              onValueChange={setConfirmText}
              placeholder="CONFIRM"
            />
          </div>
        </div>
      </Dialog>
    );
  },
};

export const SinglePage: Story = {
  render: () => (
    <Dialog
      trigger={<Button variant="secondary">Open Single-Page Modal</Button>}
      dialogTitle="Header"
      dialogType="Non-Alerting"
      scenario="single-page"
      dialogSize="x-small"
      dialogClosable={true}
      openDidalog={false}
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."
      primaryButtonName="Apply"
      enableActionButton={true}
      tertiaryButtonName="Cancel"
      enableTertiaryButtton={true}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
    >
      <div style={{ minHeight: 220, border: "1px solid var(--color-border-brand-base)", background: "var(--color-background-brand-lighter)", padding: 16, color: "var(--color-text-neutral)" }}>
        <strong style={{ display: "block", marginBottom: 8 }}>Swap content</strong>
        Single-page usage keeps one continuous content panel without tab/page switching.
      </div>
    </Dialog>
  ),
};

type MultiPageArgs = { tabVariant: "primary" | "secondary" };

const multiPageTabs = (tabVariant: "primary" | "secondary") => (
  <Tabs
    variant={tabVariant}
    surface="transparent"
    items={[
      { id: "details", label: "Details", panel: null },
      { id: "settings", label: "Settings", panel: null },
      { id: "review", label: "Review", panel: null },
      { id: "audit", label: "Audit Trail", panel: null },
      { id: "integrations", label: "Integrations", panel: null },
    ]}
    moreLabel="More"
  />
);

export const MultiPage: StoryObj<MultiPageArgs> = {
  argTypes: {
    tabVariant: {
      control: "radio",
      options: ["primary", "secondary"],
      name: "Tab Variant",
    },
  },
  args: { tabVariant: "secondary" },
  render: ({ tabVariant }) => (
    <Dialog
      trigger={<Button variant="secondary">Open Multi-Page Modal</Button>}
      dialogTitle="Header"
      dialogType="Non-Alerting"
      scenario="multi-page"
      dialogSize="x-small"
      dialogClosable={true}
      openDidalog={false}
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryButtonName="Apply"
      enableActionButton={true}
      tertiaryButtonName="Cancel"
      enableTertiaryButtton={true}
      onClose={logEvent("onClose")}
      onPrimaryButtonClick={logEvent("onPrimaryButtonClick")}
      onTertiaryButtonClick={logEvent("onTertiaryButtonClick")}
      tabs={multiPageTabs(tabVariant)}
    >
      <div style={{ minHeight: 220, border: "1px solid var(--color-border-brand-base)", background: "var(--color-background-brand-lighter)", padding: 16, color: "var(--color-text-neutral)" }}>
        <strong style={{ display: "block", marginBottom: 8 }}>Swap content</strong>
        Multi-page usage switches content panels via the tab strip above.
      </div>
    </Dialog>
  ),
};
