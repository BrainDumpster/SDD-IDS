import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SynapseSlider } from "./SynapseSlider";
import { SynapseSliderWithButtons } from "./SynapseSliderWithButtons";
import {
  SYNAPSE_SLIDER_DEFAULT_ARGS,
  SYNAPSE_SLIDER_DESIGN_SPEC_PATH,
  SYNAPSE_SLIDER_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_SLIDER_VIEWPORT_DEFAULT_ARGS,
  SYNAPSE_SLIDER_VIEWPORT_SYMBOL_NODE_ID,
  SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE,
  SYNAPSE_SLIDER_WITH_BUTTONS_NODE_ID,
} from "../spec-contracts/synapse-slider.contract";

const meta: Meta<typeof SynapseSlider> = {
  title: "Spec Generated/Synapse/Slider",
  component: SynapseSlider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Slider (IDS-fork + viewport deltas). Source: \`${SYNAPSE_SLIDER_DESIGN_SPEC_PATH}\`.`,
          `Form matrix: Figma \`${SYNAPSE_SLIDER_SPEC_ACCURATE_NODE_ID}\`.`,
          `Viewport: \`${SYNAPSE_SLIDER_VIEWPORT_SYMBOL_NODE_ID}\`; with buttons: \`${SYNAPSE_SLIDER_WITH_BUTTONS_NODE_ID}\`.`,
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

export const ViewportTopology: Story = {
  name: "Viewport / Topology",
  args: {
    ...SYNAPSE_SLIDER_VIEWPORT_DEFAULT_ARGS,
    defaultValue: 100,
  },
  decorators: [
    (Story) => (
      <div data-design-system="synapse" style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export const ViewportWithButtons: Story = {
  name: "Viewport / With Buttons",
  render: function ViewportWithButtonsStory() {
    const [value, setValue] = React.useState(SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.value);
    return (
      <div data-design-system="synapse" style={{ padding: 24 }}>
        <SynapseSliderWithButtons
          min={SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.min}
          max={SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.max}
          step={1}
          value={value}
          onChange={setValue}
          readout={SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.readoutLabel}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: [
          `Figma \`${SYNAPSE_SLIDER_WITH_BUTTONS_NODE_ID}\` design reference.`,
          `Slider at \`${SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.value}\` on \`0–100\` ≈ \`75px\` fill on \`120px\` track; readout \`${SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.readoutLabel}\` matches static Figma comp.`,
          "Topology toolbar uses the same chrome with live zoom `25–300` via `TopologyZoomSlider`.",
        ].join(" "),
      },
    },
  },
};
