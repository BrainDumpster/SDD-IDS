import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
  title: "Components/Synapse/Stepper",
  component: Stepper,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 1,
    orientation: "horizontal",
  },
};

export const AtStepTwo: Story = {
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 1,
    orientation: "horizontal",
  },
};

export const WithCompleted: Story = {
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 2,
    completed: [0, 1],
    orientation: "horizontal",
  },
};

export const AllCompleted: Story = {
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 3,
    completed: [0, 1, 2, 3],
    orientation: "horizontal",
  },
};

export const Vertical: Story = {
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 1,
    completed: [0],
    orientation: "vertical",
  },
};
