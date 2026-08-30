import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const meta = {
  title: "Components/IDS/Alert/Inline Alert",
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "IDS inline alert (`display=\"inline\"`): a contextual, page-level slate. Only inline supports **success** severity and the `detailed` density (title + body). **Carousel** is not valid inline.",
      },
    },
  },
  argTypes: {
    display: {
      control: "select",
      options: ["global", "inline"],
      description: "Layout mode: global banner vs inline contextual",
    },
    severity: {
      control: "select",
      options: ["informational", "success", "warning-minor", "warning-major", "critical"],
    },
    density: {
      control: "select",
      options: ["compact", "detailed"],
    },
    title: { control: "text" },
    dismissible: { control: "boolean" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const InlineInformational: Story = {
  args: {
    display: "inline",
    severity: "informational",
    message: "This is informational inline alert text for context.",
    dismissible: true,
  },
};

export const InlineSuccess: Story = {
  args: {
    display: "inline",
    severity: "success",
    message: "Your changes are now saved.",
    dismissible: true,
  },
};

export const InlineWarningMinor: Story = {
  args: {
    display: "inline",
    severity: "warning-minor",
    message: "This action needs additional confirmation.",
    dismissible: true,
  },
};

export const InlineWarningMajor: Story = {
  args: {
    display: "inline",
    severity: "warning-major",
    message: "A blocking issue was found in your request.",
    dismissible: true,
  },
};

export const InlineCriticalWithAction: Story = {
  args: {
    display: "inline",
    severity: "critical",
    message: "Critical alert requires immediate action.",
    actionLabel: "Take action",
    dismissible: false,
  },
};

export const InlineWithLink: Story = {
  args: {
    display: "inline",
    severity: "informational",
    message: "Please review the updated policy.",
    linkLabel: "Learn more",
    dismissible: true,
  },
};

export const InlineDetailedLayout: Story = {
  args: {
    display: "inline",
    severity: "warning-major",
    density: "detailed",
    title: "Policy validation failed",
    message: "You can review the failed checks and update your submission.",
    actionLabel: "Review",
    dismissible: true,
  },
};

export const InlineDetailedWithLinkActionDismiss: Story = {
  args: {
    display: "inline",
    severity: "critical",
    density: "detailed",
    title: "Alert Title",
    message:
      "This is an page-level alert that communicates a critical message. It may include actions.",
    linkLabel: "Learn more",
    actionLabel: "Action",
    dismissible: true,
  },
};

export const InlineVariantMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100 }}>
      <Alert display="inline" severity="informational" message="Informational inline." dismissible />
      <Alert display="inline" severity="success" message="Success inline." dismissible />
      <Alert display="inline" severity="warning-minor" message="Warning minor inline." dismissible />
      <Alert display="inline" severity="warning-major" message="Warning major inline." dismissible />
      <Alert display="inline" severity="critical" message="Critical inline." dismissible />
      <Alert display="inline" severity="informational" message="With link." linkLabel="Learn more" dismissible />
      <Alert display="inline" severity="critical" message="With action." actionLabel="Resolve now" dismissible={false} />
      <Alert
        display="inline"
        severity="warning-major"
        density="detailed"
        title="Expanded alert title"
        message="Detailed inline supports title + body."
        actionLabel="Take action"
        dismissible
      />
    </div>
  ),
};
