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
  RADIO_BUTTON_DOCS_DESCRIPTION,
  RADIO_BUTTON_SOURCE_CODE,
} from "./ids-radio-button.developer-usage";
import {
  IdsRadioButton,
  IdsRadioGroup,
  IdsRadioLabel,
  type IdsRadioButtonProps,
  type IdsRadioDataState,
  type IdsRadioGroupProps,
} from "@ids/react/radio-button";
import { IdsError, IdsErrorText } from "@ids/react/error";
import { IdsHelper, IdsHelperText } from "@ids/react/helper";
import { IdsIcon } from "@ids/react/icon";

const meta: Meta<IdsRadioButtonProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Radio Button",
  component: IdsRadioButton,
  parameters: {
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: RADIO_BUTTON_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: RADIO_BUTTON_SOURCE_CODE,
      },
    },
  },
  args: {
    name: "demo",
    disabled: false,
    error: false,
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    dataState: {
      control: "select",
      options: [undefined, "default", "hover", "focus-visible", "disabled"],
    },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<IdsRadioButtonProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    value: "a",
  },
  render: (args) => (
    <IdsRadioButton {...args}>
      <IdsRadioLabel>Option</IdsRadioLabel>
    </IdsRadioButton>
  ),
};

/** Label typography/color contract from Figma `8505:14299` / Body 2. */
export const LabelStyle: Story = {
  name: "Label Style",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <IdsRadioButton name="label-default" value="a">
        <IdsRadioLabel>Option</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton name="label-selected" value="a" defaultChecked>
        <IdsRadioLabel>Option</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton name="label-disabled" value="a" disabled>
        <IdsRadioLabel>Option</IdsRadioLabel>
      </IdsRadioButton>
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
        <code>var(--color-text-gray-neutral)</code> for non-disabled states.
        Disabled uses <code>var(--color-text-gray-disabled)</code>. Do not use{" "}
        <code>var(--color-text-gray-neutral-strong)</code> on the option label.
      </p>
    </div>
  ),
};

export const SelectionStates: Story = {
  name: "Selection States",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <IdsRadioButton name="sel-unselected" value="a">
        <IdsRadioLabel>Unselected</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton name="sel-selected" value="a" defaultChecked>
        <IdsRadioLabel>Selected</IdsRadioLabel>
      </IdsRadioButton>
    </div>
  ),
};

export const InteractionMatrix: Story = {
  name: "Interaction Matrix",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: 16 }}>
      <IdsRadioButton name="m-default" value="a">
        <IdsRadioLabel>Default</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton name="m-selected" value="a" defaultChecked>
        <IdsRadioLabel>Selected</IdsRadioLabel>
      </IdsRadioButton>

      <IdsRadioButton name="m-focus" value="a" dataState="focus-visible">
        <IdsRadioLabel>Focus</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton name="m-focus-sel" value="a" defaultChecked dataState="focus-visible">
        <IdsRadioLabel>Selected focus</IdsRadioLabel>
      </IdsRadioButton>

      <IdsRadioButton name="m-dis" value="a" disabled>
        <IdsRadioLabel>Disabled</IdsRadioLabel>
      </IdsRadioButton>
      <IdsRadioButton name="m-dis-sel" value="a" defaultChecked disabled>
        <IdsRadioLabel>Selected disabled</IdsRadioLabel>
      </IdsRadioButton>
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

export const RadioButtonGroup: StoryObj<
  IdsRadioGroupProps & { showIcon?: boolean; checked?: boolean; dataState?: IdsRadioDataState }
> = {
  name: "Radio Button Group",
  argTypes: {
    required: { control: "boolean" },
    showIcon: { control: "boolean" },
    labelPosition: { control: "radio", options: ["left", "top"] },
    orientation: { control: "radio", options: ["vertical", "horizontal"] },
    error: { control: "boolean" },
    errorText: { control: "text" },
    checked: { control: false },
    dataState: { control: false },
  },
  args: {
    label: "Notifications:",
    required: false,
    showIcon: false,
    labelPosition: "left",
    orientation: "vertical",
    error: false,
    errorText: "You must select an option to continue.",
  },
  render: ({ showIcon, checked, dataState, ...args }) => (
    <IdsRadioGroup
      {...args}
      name="radio-group-demo"
      defaultValue="email"
      labelIcon={
        showIcon ? (
          <IdsIcon shape="info-circ-solid" size={16} variant="img" />
        ) : undefined
      }
    >
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
