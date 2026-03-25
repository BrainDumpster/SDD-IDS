import type { Meta, StoryObj } from "@storybook/react";
import { ToastSetup, useToast } from "./Toast";
import { Button } from "./Button";

const meta: Meta = {
  title: "Synapse/Toast",
  decorators: [
    (Story) => (
      <ToastSetup>
        <Story />
      </ToastSetup>
    ),
  ],
};

export default meta;
type Story = StoryObj;

function ToastDemo() {
  const toastManager = useToast();

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button
        variant="secondary"
        onClick={() =>
          toastManager.add({
            title: "Information",
            description: "This is an informational message.",
            type: "info",
            data: { variant: "info" },
          })
        }
      >
        Info Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toastManager.add({
            title: "Success",
            description: "The operation completed successfully.",
            type: "success",
            data: { variant: "success" },
          })
        }
      >
        Success Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toastManager.add({
            title: "Warning",
            description: "Please review before proceeding.",
            type: "warning",
            data: { variant: "warning" },
          })
        }
      >
        Warning Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toastManager.add({
            title: "Error",
            description: "Something went wrong. Please try again.",
            type: "error",
            data: { variant: "error" },
            priority: "high",
          })
        }
      >
        Error Toast
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: () => <ToastDemo />,
};
