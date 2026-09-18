/**
 * Storybook: design-spec–generated Checkbox from `lib/react/synapse/checkbox`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/checkbox/design-spec.md
 *
 * Projection: SynapseCheckboxLabel + optional SynapseHelper / SynapseError.
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_CHECKBOX_DOCS_DESCRIPTION,
  SYNAPSE_CHECKBOX_SOURCE_CODE,
} from "./synapse-checkbox.developer-usage";
import {
  SynapseCheckbox,
  SynapseCheckboxLabel,
  type SynapseCheckboxProps,
} from "@synapse/react/checkbox";
import { SynapseError, SynapseErrorText } from "@synapse/react/error";
import { SynapseHelper, SynapseHelperText } from "@synapse/react/helper";
import { SynapseIcon } from "@synapse/react/icon";

function Box(
  props: SynapseCheckboxProps & {
    label: React.ReactNode;
    helper?: React.ReactNode;
    errorText?: React.ReactNode;
  },
) {
  const { label, helper, errorText, ...rest } = props;
  return (
    <SynapseCheckbox {...rest}>
      <SynapseCheckboxLabel>{label}</SynapseCheckboxLabel>
      {helper != null ? (
        <SynapseHelper>
          <SynapseHelperText>{helper}</SynapseHelperText>
        </SynapseHelper>
      ) : null}
      {errorText != null ? (
        <SynapseError>
          <SynapseErrorText>{errorText}</SynapseErrorText>
        </SynapseError>
      ) : null}
    </SynapseCheckbox>
  );
}

const meta: Meta<SynapseCheckboxProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Checkbox",
  component: SynapseCheckbox,
  parameters: {
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_CHECKBOX_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_CHECKBOX_SOURCE_CODE,
      },
    },
  },
  args: {
    disabled: false,
    indeterminate: false,
  },
  argTypes: {
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    dataState: {
      control: "select",
      options: [undefined, "default", "hover", "focus-visible", "disabled"],
    },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<SynapseCheckboxProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <SynapseCheckbox {...args}>
      <SynapseCheckboxLabel>Option</SynapseCheckboxLabel>
    </SynapseCheckbox>
  ),
};

/** Label typography/color contract from Figma `8505:14299` / Body 2. */
export const LabelStyle: Story = {
  name: "Label Style",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SynapseCheckbox>
        <SynapseCheckboxLabel>Option</SynapseCheckboxLabel>
      </SynapseCheckbox>
      <SynapseCheckbox defaultChecked>
        <SynapseCheckboxLabel>Option</SynapseCheckboxLabel>
      </SynapseCheckbox>
      <SynapseCheckbox indeterminate>
        <SynapseCheckboxLabel>Option</SynapseCheckboxLabel>
      </SynapseCheckbox>
      <SynapseCheckbox disabled>
        <SynapseCheckboxLabel>Option</SynapseCheckboxLabel>
      </SynapseCheckbox>
      <p
        style={{
          margin: 0,
          fontSize: "var(--font-size-body-3, 12px)",
          lineHeight: "var(--font-line-height-line-height-16, 16px)",
          color: "var(--color-text-gray-neutral)",
          maxWidth: 420,
        }}
      >
        Label uses Body 2 Regular (`14/20`, weight 400) and{" "}
        <code>var(--color-text-gray-neutral)</code> for default/checked/partial.
        Disabled uses <code>var(--color-text-gray-disabled)</code>. Do not use{" "}
        <code>var(--color-text-gray-neutral-strong)</code> on the option label.
      </p>
    </div>
  ),
};

export const SelectionStates: Story = {
  name: "Selection States",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Box label="Option" />
      <Box label="Option" defaultChecked />
      <Box label="Option" indeterminate />
    </div>
  ),
};

export const InteractionMatrix: Story = {
  name: "Interaction Matrix",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 16 }}>
      <Box label="Option" />
      <Box label="Option" defaultChecked />
      <Box label="Option" indeterminate />

      <Box label="Option" dataState="focus-visible" />
      <Box label="Option" defaultChecked dataState="focus-visible" />
      <Box label="Option" indeterminate dataState="focus-visible" />

      <Box label="Option" disabled />
      <Box label="Option" defaultChecked disabled />
      <Box label="Option" indeterminate disabled />
    </div>
  ),
};

export const WithHelperAndError: Story = {
  name: "With Helper And Error",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Box label="Email notifications" helper="Receive weekly summary updates." />

      <SynapseCheckbox>
        <SynapseCheckboxLabel>Email with icon helper</SynapseCheckboxLabel>
        <SynapseHelper>
          <SynapseIcon shape="status-ok-circ-solid-16" size={16} variant="img" />
          <SynapseHelperText>Optional helper icon projected</SynapseHelperText>
        </SynapseHelper>
      </SynapseCheckbox>

      <Box label="Accept terms" errorText="You must accept the terms to continue." />

      <SynapseCheckbox>
        <SynapseCheckboxLabel>Custom error icon</SynapseCheckboxLabel>
        <SynapseError>
          <SynapseIcon shape="status-critical-circ-solid" size={16} variant="img" />
          <SynapseErrorText>Override default critical icon</SynapseErrorText>
        </SynapseError>
      </SynapseCheckbox>

      <Box
        label="Disabled option"
        disabled
        helper="This option is unavailable for your role."
      />
    </div>
  ),
};

export const ContentProjection: Story = {
  name: "Content Projection",
  render: () => (
    <SynapseCheckbox defaultChecked>
      <SynapseCheckboxLabel>
        I agree to the <a href="#">terms of service</a>
      </SynapseCheckboxLabel>
      <SynapseHelper>
        <SynapseHelperText>You can change this later in settings.</SynapseHelperText>
      </SynapseHelper>
    </SynapseCheckbox>
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  render: function ControlledStory() {
    const [checked, setChecked] = React.useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SynapseCheckbox checked={checked} onChange={setChecked}>
          <SynapseCheckboxLabel>Controlled checkbox ({checked ? "on" : "off"})</SynapseCheckboxLabel>
        </SynapseCheckbox>
        <button type="button" onClick={() => setChecked((v) => !v)}>
          Toggle externally
        </button>
      </div>
    );
  },
};
