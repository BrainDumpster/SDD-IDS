import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Synapse/Select",
  component: Select,
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const basicOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
];

export const Default: Story = {
  args: {
    label: "Fruit",
    options: basicOptions,
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Choose a fruit",
    options: basicOptions,
    placeholder: "Pick one...",
  },
};

export const Disabled: Story = {
  args: {
    label: "Fruit",
    options: basicOptions,
    disabled: true,
  },
};

export const ManyOptions: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "uk", label: "United Kingdom" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "es", label: "Spain" },
      { value: "it", label: "Italy" },
      { value: "jp", label: "Japan" },
      { value: "au", label: "Australia" },
      { value: "br", label: "Brazil" },
      { value: "mx", label: "Mexico" },
      { value: "in", label: "India" },
      { value: "kr", label: "South Korea" },
      { value: "nl", label: "Netherlands" },
      { value: "se", label: "Sweden" },
    ],
  },
};

export const FormExample: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
      <Select
        label="Department"
        options={[
          { value: "eng", label: "Engineering" },
          { value: "design", label: "Design" },
          { value: "product", label: "Product" },
          { value: "marketing", label: "Marketing" },
        ]}
        placeholder="Select department"
      />
      <Select
        label="Role"
        options={[
          { value: "ic", label: "Individual Contributor" },
          { value: "lead", label: "Team Lead" },
          { value: "manager", label: "Manager" },
          { value: "director", label: "Director" },
        ]}
        placeholder="Select role"
      />
    </div>
  ),
};
