import type { Meta, StoryObj } from "@storybook/react";
import { RadioButton } from "./RadioButton";

const meta: Meta<typeof RadioButton> = {
  title: "Synapse/RadioButton",
  component: RadioButton,
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Default: Story = {
  args: {
    name: "default-radio",
    options: defaultOptions,
  },
};

export const Preselected: Story = {
  args: {
    name: "preselected-radio",
    options: defaultOptions,
    defaultValue: "option2",
  },
};

export const WithDisabledOption: Story = {
  args: {
    name: "disabled-option-radio",
    options: [
      { value: "option1", label: "Available" },
      { value: "option2", label: "Also available" },
      { value: "option3", label: "Unavailable", disabled: true },
    ],
    defaultValue: "option1",
  },
};

export const DisabledSelected: Story = {
  args: {
    name: "disabled-selected-radio",
    options: [
      { value: "selected", label: "Selected (disabled)", disabled: true },
      { value: "other", label: "Other option" },
    ],
    defaultValue: "selected",
  },
};

export const Horizontal: Story = {
  args: {
    name: "horizontal-radio",
    options: defaultOptions,
    orientation: "horizontal",
    defaultValue: "option1",
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 48 }}>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 500 }}>Vertical</p>
        <RadioButton
          name="vertical-demo"
          options={defaultOptions}
          defaultValue="option1"
        />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 500 }}>Horizontal</p>
        <RadioButton
          name="horizontal-demo"
          options={defaultOptions}
          orientation="horizontal"
          defaultValue="option2"
        />
      </div>
    </div>
  ),
};
