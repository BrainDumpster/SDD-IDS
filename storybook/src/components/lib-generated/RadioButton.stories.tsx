/**
 * Storybook: design-spec–generated Radio Button from `lib/react/ids/radio-button`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/radio-button/design-spec.md
 *
 * Projection: IdsRadioLabel + optional IdsHelper / IdsError.
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsRadioButton,
  IdsRadioGroup,
  IdsRadioLabel,
  type IdsRadioGroupProps,
} from "../../../../lib/react/ids/radio-button";
import { IdsError, IdsErrorText } from "../../../../lib/react/ids/error";
import { IdsHelper, IdsHelperText } from "../../../../lib/react/ids/helper";
import { IdsIcon } from "../../../../lib/react/ids/icon";

const meta: Meta<IdsRadioGroupProps> = {
  title: "Lib Generated/IDS/Radio Button",
  component: IdsRadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          "React IDS Radio Button from `components/ids/radio-button/design-spec.md`. " +
          "`IdsRadioGroup` + `IdsRadioButton` with projected `IdsRadioLabel` and optional " +
          "`IdsHelper` / `IdsError`. Theme: `components/ids-theme.css`. No `@base-ui-components`.",
      },
    },
  },
  args: {
    name: "demo",
    orientation: "vertical",
    disabled: false,
  },
  argTypes: {
    orientation: { control: "radio", options: ["vertical", "horizontal"] },
    disabled: { control: "boolean" },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<IdsRadioGroupProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <IdsRadioGroup {...args} defaultValue="email">
      <IdsRadioButton value="email">
        <IdsRadioLabel>Email</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton value="sms">
        <IdsRadioLabel>SMS</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton value="push">
        <IdsRadioLabel>Push notification</IdsRadioLabel>
      </IdsRadioButton>
    </IdsRadioGroup>
  ),
};

export const SelectionStates: Story = {
  name: "Selection States",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <IdsRadioGroup name="sel-unselected" defaultValue="">
        <IdsRadioButton value="a">
          <IdsRadioLabel>Unselected</IdsRadioLabel>
        </IdsRadioButton>
      </IdsRadioGroup>
      <IdsRadioGroup name="sel-selected" defaultValue="a">
        <IdsRadioButton value="a">
          <IdsRadioLabel>Selected</IdsRadioLabel>
        </IdsRadioButton>
      </IdsRadioGroup>
    </div>
  ),
};

export const InteractionMatrix: Story = {
  name: "Interaction Matrix",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: 16 }}>
      <IdsRadioGroup name="m-default">
        <IdsRadioButton value="a">
          <IdsRadioLabel>Default</IdsRadioLabel>
        </IdsRadioButton>
      </IdsRadioGroup>
      <IdsRadioGroup name="m-selected" defaultValue="a">
        <IdsRadioButton value="a">
          <IdsRadioLabel>Selected</IdsRadioLabel>
        </IdsRadioButton>
      </IdsRadioGroup>

      <IdsRadioGroup name="m-focus">
        <IdsRadioButton value="a" dataState="focus-visible">
          <IdsRadioLabel>Focus</IdsRadioLabel>
        </IdsRadioButton>
      </IdsRadioGroup>
      <IdsRadioGroup name="m-focus-sel" defaultValue="a">
        <IdsRadioButton value="a" dataState="focus-visible">
          <IdsRadioLabel>Selected focus</IdsRadioLabel>
        </IdsRadioButton>
      </IdsRadioGroup>

      <IdsRadioGroup name="m-dis">
        <IdsRadioButton value="a" disabled>
          <IdsRadioLabel>Disabled</IdsRadioLabel>
        </IdsRadioButton>
      </IdsRadioGroup>
      <IdsRadioGroup name="m-dis-sel" defaultValue="a">
        <IdsRadioButton value="a" disabled>
          <IdsRadioLabel>Selected disabled</IdsRadioLabel>
        </IdsRadioButton>
      </IdsRadioGroup>
    </div>
  ),
};

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => (
    <IdsRadioGroup name="orient" orientation="horizontal" defaultValue="day">
      <IdsRadioButton value="day">
        <IdsRadioLabel>Day</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton value="week">
        <IdsRadioLabel>Week</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton value="month">
        <IdsRadioLabel>Month</IdsRadioLabel>
      </IdsRadioButton>
    </IdsRadioGroup>
  ),
};

export const WithHelperAndError: Story = {
  name: "With Helper And Error",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <IdsRadioGroup name="help" defaultValue="email">
        <IdsRadioButton value="email">
          <IdsRadioLabel>Email</IdsRadioLabel>
          <IdsHelper>
            <IdsHelperText>Receive weekly summary updates.</IdsHelperText>
          </IdsHelper>
        </IdsRadioButton>
        <IdsRadioButton value="sms">
          <IdsRadioLabel>SMS</IdsRadioLabel>
          <IdsHelper>
            <IdsIcon shape="status-ok-circ-solid-16" size={16} variant="img" />
            <IdsHelperText>Optional helper icon</IdsHelperText>
          </IdsHelper>
        </IdsRadioButton>
      </IdsRadioGroup>

      <IdsRadioGroup name="err">
        <IdsRadioButton value="accept">
          <IdsRadioLabel>Accept terms</IdsRadioLabel>
          <IdsError>
            <IdsErrorText>You must select an option to continue.</IdsErrorText>
          </IdsError>
        </IdsRadioButton>
      </IdsRadioGroup>
    </div>
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  render: function ControlledStory() {
    const [value, setValue] = React.useState("b");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <IdsRadioGroup name="ctrl" value={value} onChange={setValue}>
          <IdsRadioButton value="a">
            <IdsRadioLabel>Option A</IdsRadioLabel>
          </IdsRadioButton>
          <IdsRadioButton value="b">
            <IdsRadioLabel>Option B (selected: {value})</IdsRadioLabel>
          </IdsRadioButton>
          <IdsRadioButton value="c" disabled>
            <IdsRadioLabel>Option C (disabled)</IdsRadioLabel>
          </IdsRadioButton>
        </IdsRadioGroup>
        <button type="button" onClick={() => setValue("a")}>
          Select A externally
        </button>
      </div>
    );
  },
};
