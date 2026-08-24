import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { ChatSystemResponse } from "./ChatSystemResponse";

const meta: Meta<typeof ChatSystemResponse> = {
  title: "Components/Synapse/Chat and Layout/Chat System Response",
  component: ChatSystemResponse,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Spec-driven Synapse Chat System Response. Source: `components/synapse/chatsystemresponse/design-spec.md`.",
          "Primary story: Figma `50756:226212`.",
          "Examples board (Thinking, Recommendation Feedback): `53259:126090`.",
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatSystemResponse>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    content: "Your request has been processed successfully.",
    timestamp: "2:34 PM",
  },
};

export const ShortMessage: Story = {
  args: {
    content: "Your request has been processed successfully.",
    timestamp: "2:34 PM",
  },
};

export const LongMessage: Story = {
  args: {
    content:
      "Based on your query, I found several relevant results. The design system recommends using the primary button variant for the main call-to-action on each page. Secondary buttons should be used for less prominent actions. You can also use ghost buttons for tertiary actions that should not draw attention away from the primary flow.",
    timestamp: "2:35 PM",
  },
};
