/**
 * Storybook: design-spec–generated Modal from `lib/react/synapse/modal`
 *
 * Anatomy (main layer):
 *   SynapseModal → overlay + surface → Header / Description / Content / Footer
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/modal/design-spec.md
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_MODAL_DOCS_DESCRIPTION,
  SYNAPSE_MODAL_SOURCE_CODE,
} from "./synapse-modal.developer-usage";
import {
  SynapseModal,
  SynapseModalClose,
  SynapseModalContent,
  SynapseModalDescription,
  SynapseModalFooter,
  SynapseModalHeader,
  SynapseModalTitle,
  type SynapseModalProps,
} from "@synapse/react/modal";
import {
  SynapseButton,
  SynapseButtonLabel,
} from "@synapse/react/button";

const meta: Meta<SynapseModalProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Modal",
  component: SynapseModal,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_MODAL_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_MODAL_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseModalProps>;

function Trigger({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <SynapseButton variant="secondary" size="large" onClick={onClick}>
      <SynapseButtonLabel>{label}</SynapseButtonLabel>
    </SynapseButton>
  );
}

/** Main-layer anatomy composition (single-page) — matches design-spec mapping. */
export const MainLayerAnatomy: Story = {
  name: "Main Layer Anatomy",
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    return (
      <>
        <Trigger label="Open Main Layer Modal" onClick={() => setOpen(true)} />
        <SynapseModal
          open={open}
          onOpenChange={setOpen}
          scenario="single-page"
          size="medium"
          layer="main"
          closable
        >
          <SynapseModalHeader>
            <SynapseModalTitle>Header</SynapseModalTitle>
            <SynapseModalClose />
          </SynapseModalHeader>
          <SynapseModalDescription>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit.
          </SynapseModalDescription>
          <SynapseModalContent>
            <div
              style={{
                minHeight: 160,
                border: "1px solid var(--color-border-brand-base)",
                background: "var(--color-background-brand-lighter-slate)",
                padding: 16,
                color: "var(--color-text-gray-neutral)",
              }}
            >
              Content slot — custom body / page panel
            </div>
          </SynapseModalContent>
          <SynapseModalFooter>
            <div className="synapse-modal-footer-start" style={{ marginRight: "auto" }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "var(--font-size-body-2)",
                  color: "var(--color-text-gray-neutral)",
                }}
              >
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                Don’t show again until the next update
              </label>
            </div>
            <div style={{ display: "inline-flex", gap: 12 }}>
              <SynapseButton
                variant="tertiary"
                size="large"
                onClick={() => setOpen(false)}
              >
                <SynapseButtonLabel>Cancel</SynapseButtonLabel>
              </SynapseButton>
              <SynapseButton
                variant="primary"
                size="large"
                onClick={() => setOpen(false)}
              >
                <SynapseButtonLabel>Close</SynapseButtonLabel>
              </SynapseButton>
            </div>
          </SynapseModalFooter>
        </SynapseModal>
      </>
    );
  },
};

function PropDrivenDemo(
  props: Omit<SynapseModalProps, "open" | "onOpenChange"> & { triggerLabel: string },
) {
  const { triggerLabel, ...modalProps } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Trigger label={triggerLabel} onClick={() => setOpen(true)} />
      <SynapseModal {...modalProps} open={open} onOpenChange={setOpen} />
    </>
  );
}

export const NonAlerting: Story = {
  render: () => (
    <PropDrivenDemo
      triggerLabel="Open Dialog"
      scenario="dialog"
      type="non-alerting"
      size="medium"
      title="Non-Alerting"
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryActionLabel="Close"
      enablePrimaryAction
      enableTertiaryAction={false}
      closable
    />
  ),
};

export const Informational: Story = {
  render: () => (
    <PropDrivenDemo
      triggerLabel="Open Informational Dialog"
      scenario="dialog"
      type="informational"
      size="medium"
      title="Informational"
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryActionLabel="Close"
      enablePrimaryAction
      enableTertiaryAction={false}
      closable
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <PropDrivenDemo
      triggerLabel="Open Warning Dialog"
      scenario="dialog"
      type="warning"
      size="medium"
      title="Warning"
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryActionLabel="Continue"
      tertiaryActionLabel="Cancel"
      enablePrimaryAction
      enableTertiaryAction
      closable
    >
      <div style={{ color: "var(--color-text-gray-neutral)", lineHeight: "20px" }}>
        Continue to &lt;describe the action&gt;?
      </div>
    </PropDrivenDemo>
  ),
};

export const Major: Story = {
  render: () => (
    <PropDrivenDemo
      triggerLabel="Open Major Dialog"
      scenario="dialog"
      type="major"
      size="medium"
      title="Major"
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryActionLabel="Continue"
      tertiaryActionLabel="Cancel"
      enablePrimaryAction
      enableTertiaryAction
      closable
    >
      <div style={{ color: "var(--color-text-gray-neutral)", lineHeight: "20px" }}>
        Continue to &lt;describe the action&gt;?
      </div>
    </PropDrivenDemo>
  ),
};

export const Critical: Story = {
  render: () => (
    <PropDrivenDemo
      triggerLabel="Open Critical Dialog"
      scenario="dialog"
      type="critical"
      size="medium"
      title="Critical"
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryActionLabel="Continue"
      tertiaryActionLabel="Cancel"
      enablePrimaryAction
      enableTertiaryAction
      closable
    >
      <div style={{ color: "var(--color-text-gray-neutral)", lineHeight: "20px" }}>
        Continue to &lt;describe the action&gt;?
      </div>
    </PropDrivenDemo>
  ),
};

export const Destructive: Story = {
  render: function Render() {
    const [confirmText, setConfirmText] = useState("");
    const confirmValid = confirmText.trim().toUpperCase() === "CONFIRM";
    const [open, setOpen] = useState(false);
    return (
      <>
        <Trigger label="Open Destructive Dialog" onClick={() => setOpen(true)} />
        <SynapseModal
          open={open}
          onOpenChange={setOpen}
          scenario="dialog"
          type="destructive"
          size="medium"
          title="Critical"
          description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
          primaryActionLabel="Action"
          tertiaryActionLabel="Cancel"
          enablePrimaryAction={confirmValid}
          enableTertiaryAction
          closable
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ color: "var(--color-text-gray-neutral)", lineHeight: "20px" }}>
              Type in CONFIRM below to verify the action.
            </div>
            <input
              aria-label="Type CONFIRM"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CONFIRM"
              style={{
                width: 300,
                boxSizing: "border-box",
                borderRadius: 0,
                border: "1px solid var(--color-border-gray-neutral-base)",
                padding: "8px 12px",
                font: "inherit",
              }}
            />
          </div>
        </SynapseModal>
      </>
    );
  },
};

export const SinglePageModalUsage: Story = {
  name: "Single-Page Modal Usage",
  render: () => (
    <PropDrivenDemo
      triggerLabel="Open Single-Page Modal"
      scenario="single-page"
      type="non-alerting"
      size="large"
      title="Header"
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."
      primaryActionLabel="Apply"
      tertiaryActionLabel="Cancel"
      enablePrimaryAction
      enableTertiaryAction
      closable
    >
      <div
        style={{
          minHeight: 220,
          border: "1px solid var(--color-border-brand-base)",
          background: "var(--color-background-brand-lighter-slate)",
          padding: 16,
          color: "var(--color-text-gray-neutral)",
        }}
      >
        <strong style={{ display: "block", marginBottom: 8 }}>Swap content</strong>
        Single-page usage keeps one continuous content panel without tab/page switching.
      </div>
    </PropDrivenDemo>
  ),
};

export const MultiPageModalUsage: Story = {
  name: "Multi-Page Modal Usage",
  render: () => (
    <PropDrivenDemo
      triggerLabel="Open Multi-Page Modal"
      scenario="multi-page"
      type="non-alerting"
      size="large"
      title="Header"
      description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
      primaryActionLabel="Apply"
      tertiaryActionLabel="Cancel"
      enablePrimaryAction
      enableTertiaryAction
      tabs
      closable
      pages={[
        {
          id: "details",
          label: "Details",
          content: "Page 1 content: overview details and context.",
        },
        {
          id: "settings",
          label: "Settings",
          content: "Page 2 content: configurable settings and options.",
        },
        {
          id: "review",
          label: "Review",
          content: "Page 3 content: final review before apply.",
        },
      ]}
    />
  ),
};
