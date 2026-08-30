import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IdsModal } from "./IdsModal";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
import { MODAL_FIGMA_BODY } from "../../../component-contracts/ids/modal.contract";

const meta: Meta<typeof IdsModal> = {
  title: "Components/IDS/Modal/Dialog",
  component: IdsModal,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof IdsModal>;

function logEvent(name: string) {
  return () => {
    // eslint-disable-next-line no-console
    console.log(`[IDS Modal Dialog event] ${name}`);
  };
}

export const NonAlerting: Story = {
  render: () => (
    <IdsModal
      trigger={<Button>Open Dialog</Button>}
      scenario="dialog"
      type="non-alerting"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Non-Alerting</IdsModal.Title>
      <IdsModal.Body description={MODAL_FIGMA_BODY} />
      <IdsModal.Footer>
        <Button size="lg" onClick={logEvent("onPrimaryAction")}>
          Close
        </Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};

export const Informational: Story = {
  render: () => (
    <IdsModal
      trigger={<Button variant="secondary">Open Informational Dialog</Button>}
      scenario="dialog"
      type="informational"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Informational</IdsModal.Title>
      <IdsModal.Body description={MODAL_FIGMA_BODY} />
      <IdsModal.Footer>
        <Button size="lg">Close</Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};

export const Warning: Story = {
  render: () => (
    <IdsModal
      trigger={<Button variant="secondary">Open Warning Dialog</Button>}
      scenario="dialog"
      type="warning"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Warning</IdsModal.Title>
      <IdsModal.Body description={MODAL_FIGMA_BODY}>
        <div style={{ color: "var(--color-text-gray-neutral)", lineHeight: "20px" }}>
          Continue to &lt;describe the action&gt;?
        </div>
      </IdsModal.Body>
      <IdsModal.Footer>
        <Button variant="tertiary" size="lg" onClick={logEvent("onTertiaryAction")}>
          Cancel
        </Button>
        <Button size="lg" onClick={logEvent("onPrimaryAction")}>
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
        trigger={<Button variant="secondary">Open Destructive Dialog</Button>}
        scenario="dialog"
        type="destructive"
        size="large"
        defaultOpen={false}
        onClose={logEvent("onClose")}
      >
        <IdsModal.Title>Critical</IdsModal.Title>
        <IdsModal.Body description={MODAL_FIGMA_BODY}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ color: "var(--color-text-gray-neutral)", lineHeight: "20px" }}>
              Type in CONFIRM below to verify the action.
            </div>
            <TextInput
              ariaLabel="Type CONFIRM"
              value={confirmText}
              onValueChange={setConfirmText}
              placeholder="CONFIRM"
            />
          </div>
        </IdsModal.Body>
        <IdsModal.Footer>
          <Button variant="tertiary" size="lg">
            Cancel
          </Button>
          <Button variant="destructive" size="lg" disabled={!confirmValid}>
            Action
          </Button>
        </IdsModal.Footer>
      </IdsModal>
    );
  },
};
