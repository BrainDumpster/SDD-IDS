/**
 * Storybook: design-spec–generated Checkbox from `lib/react/ids/checkbox`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/checkbox/design-spec.md
 *
 * Projection: IdsCheckboxLabel + optional IdsHelper / IdsError.
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsCheckbox,
  IdsCheckboxLabel,
  type IdsCheckboxProps,
} from "../../../../lib/react/ids/checkbox";
import { IdsError, IdsErrorText } from "../../../../lib/react/ids/error";
import { IdsHelper, IdsHelperText } from "../../../../lib/react/ids/helper";
import { IdsIcon } from "../../../../lib/react/ids/icon";

function Box(
  props: IdsCheckboxProps & {
    label: React.ReactNode;
    helper?: React.ReactNode;
    errorText?: React.ReactNode;
  },
) {
  const { label, helper, errorText, ...rest } = props;
  return (
    <IdsCheckbox {...rest}>
      <IdsCheckboxLabel>{label}</IdsCheckboxLabel>
      {helper != null ? (
        <IdsHelper>
          <IdsHelperText>{helper}</IdsHelperText>
        </IdsHelper>
      ) : null}
      {errorText != null ? (
        <IdsError>
          <IdsErrorText>{errorText}</IdsErrorText>
        </IdsError>
      ) : null}
    </IdsCheckbox>
  );
}

const meta: Meta<IdsCheckboxProps> = {
  title: "Components/IDS/Checkbox",
  component: IdsCheckbox,
  parameters: {
    docs: {
      description: {
        component:
          "React IDS Checkbox from `components/ids/checkbox/design-spec.md`. " +
          "Label style (Figma Body 2): `var(--typography-font-style-primary)`, " +
          "`var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, weight `400`, " +
          "color `var(--color-text-gray-neutral)` (disabled → `var(--color-text-gray-disabled)`). " +
          "Projection: `IdsCheckboxLabel` + optional `IdsHelper` / `IdsError`. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
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
type Story = StoryObj<IdsCheckboxProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <IdsCheckbox {...args}>
      <IdsCheckboxLabel>Option</IdsCheckboxLabel>
    </IdsCheckbox>
  ),
};

/** Label typography/color contract from Figma `8505:14299` / Body 2. */
export const LabelStyle: Story = {
  name: "Label Style",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <IdsCheckbox>
        <IdsCheckboxLabel>Option</IdsCheckboxLabel>
      </IdsCheckbox>
      <IdsCheckbox defaultChecked>
        <IdsCheckboxLabel>Option</IdsCheckboxLabel>
      </IdsCheckbox>
      <IdsCheckbox indeterminate>
        <IdsCheckboxLabel>Option</IdsCheckboxLabel>
      </IdsCheckbox>
      <IdsCheckbox disabled>
        <IdsCheckboxLabel>Option</IdsCheckboxLabel>
      </IdsCheckbox>
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

      <IdsCheckbox>
        <IdsCheckboxLabel>Email with icon helper</IdsCheckboxLabel>
        <IdsHelper>
          <IdsIcon shape="status-ok-circ-solid-16" size={16} variant="img" />
          <IdsHelperText>Optional helper icon projected</IdsHelperText>
        </IdsHelper>
      </IdsCheckbox>

      <Box label="Accept terms" errorText="You must accept the terms to continue." />

      <IdsCheckbox>
        <IdsCheckboxLabel>Custom error icon</IdsCheckboxLabel>
        <IdsError>
          <IdsIcon shape="status-critical-circ-solid" size={16} variant="img" />
          <IdsErrorText>Override default critical icon</IdsErrorText>
        </IdsError>
      </IdsCheckbox>

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
    <IdsCheckbox defaultChecked>
      <IdsCheckboxLabel>
        I agree to the <a href="#">terms of service</a>
      </IdsCheckboxLabel>
      <IdsHelper>
        <IdsHelperText>You can change this later in settings.</IdsHelperText>
      </IdsHelper>
    </IdsCheckbox>
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  render: function ControlledStory() {
    const [checked, setChecked] = React.useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <IdsCheckbox checked={checked} onChange={setChecked}>
          <IdsCheckboxLabel>Controlled checkbox ({checked ? "on" : "off"})</IdsCheckboxLabel>
        </IdsCheckbox>
        <button type="button" onClick={() => setChecked((v) => !v)}>
          Toggle externally
        </button>
      </div>
    );
  },
};
