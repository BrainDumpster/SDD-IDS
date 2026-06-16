import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseSlider } from "./SynapseSlider";
import {
  SYNAPSE_SLIDER_DEFAULT_ARGS,
  SYNAPSE_SLIDER_DESIGN_SPEC_PATH,
  SYNAPSE_SLIDER_SPEC_ACCURATE_NODE_ID,
} from "../spec-contracts/synapse-slider.contract";

const meta: Meta<typeof SynapseSlider> = {
  title: "Spec Generated/Synapse/Slider",
  component: SynapseSlider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Slider (IDS-fork). Source: \`${SYNAPSE_SLIDER_DESIGN_SPEC_PATH}\`.`,
          `Primary story: Figma \`${SYNAPSE_SLIDER_SPEC_ACCURATE_NODE_ID}\` (default + stepper).`,
        ].join(" "),
      },
    },
  },
  args: { ...SYNAPSE_SLIDER_DEFAULT_ARGS },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    showStepper: { control: "boolean" },
    showValueLabel: { control: "boolean" },
    showValueInput: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseSlider>;

export const SpecAccurateDefaultWithStepper: Story = {
  name: "Spec Accurate / Default + Stepper",
};

export const DefaultNoStepper: Story = {
  args: {
    ...SYNAPSE_SLIDER_DEFAULT_ARGS,
    showStepper: false,
    defaultValue: 50,
  },
};

export const ValueZero: Story = {
  args: {
    ...SYNAPSE_SLIDER_DEFAULT_ARGS,
    showStepper: false,
    defaultValue: 0,
  },
};

export const ValueMax: Story = {
  args: {
    ...SYNAPSE_SLIDER_DEFAULT_ARGS,
    showStepper: false,
    defaultValue: 100,
  },
};

export const RangeDefault: Story = {
  args: {
    mode: "range",
    min: 0,
    max: 100,
    defaultValue: [25, 75],
    minLabel: "0",
    maxLabel: "100",
    showStepper: false,
    showValueLabel: true,
  },
};

export const Disabled: Story = {
  args: {
    ...SYNAPSE_SLIDER_DEFAULT_ARGS,
    disabled: true,
    defaultValue: 40,
  },
};

export const WithValueInput: Story = {
  args: {
    ...SYNAPSE_SLIDER_DEFAULT_ARGS,
    showStepper: false,
    showValueInput: true,
    defaultValue: 50,
  },
};
