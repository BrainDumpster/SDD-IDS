import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
  title: "Synapse/Stepper",
  component: Stepper,
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const AtStepTwo: Story = {
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 1,
  },
};

export const WithCompleted: Story = {
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 2,
    completed: [0, 1],
  },
};

export const AllCompleted: Story = {
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 3,
    completed: [0, 1, 2, 3],
  },
};
