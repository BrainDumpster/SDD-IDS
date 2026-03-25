import type { Meta, StoryObj } from "@storybook/react";
import { WizardModal } from "./WizardModal";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

const meta: Meta<typeof WizardModal> = {
  title: "Synapse/WizardModal",
  component: WizardModal,
};

export default meta;
type Story = StoryObj<typeof WizardModal>;

export const ThreeStepWizard: Story = {
  args: {
    trigger: <Button>Open Wizard</Button>,
    steps: [
      {
        title: "Account Info",
        content: (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextInput label="Full name" placeholder="Enter your full name" />
            <TextInput label="Email" type="email" placeholder="you@company.com" />
          </div>
        ),
      },
      {
        title: "Preferences",
        content: (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0, color: "var(--color-text-neutral)" }}>
              Configure your workspace preferences. These can be changed later in settings.
            </p>
            <TextInput label="Team name" placeholder="My Team" />
            <TextInput label="Timezone" placeholder="UTC-5" />
          </div>
        ),
      },
      {
        title: "Review",
        content: (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0, color: "var(--color-text-neutral)" }}>
              Review your information and click <strong>Finish</strong> to complete setup.
            </p>
            <div
              style={{
                padding: 16,
                background: "var(--color-background-surface-1)",
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              <div><strong>Name:</strong> John Doe</div>
              <div><strong>Email:</strong> john@company.com</div>
              <div><strong>Team:</strong> My Team</div>
              <div><strong>Timezone:</strong> UTC-5</div>
            </div>
          </div>
        ),
      },
    ],
  },
};

export const FourStepWizard: Story = {
  args: {
    trigger: <Button variant="secondary">Setup Guide</Button>,
    steps: [
      {
        title: "Welcome",
        content: (
          <p style={{ margin: 0 }}>
            Welcome to the setup wizard. This will guide you through the initial
            configuration of your workspace.
          </p>
        ),
      },
      {
        title: "Connect",
        content: (
          <p style={{ margin: 0 }}>
            Connect your accounts and data sources to get started.
          </p>
        ),
      },
      {
        title: "Configure",
        content: (
          <p style={{ margin: 0 }}>
            Set up your preferences and notification settings.
          </p>
        ),
      },
      {
        title: "Done",
        content: (
          <p style={{ margin: 0 }}>
            Everything is ready. Click Finish to start using your workspace.
          </p>
        ),
      },
    ],
  },
};
