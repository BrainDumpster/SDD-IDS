import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/lit/progress-bar/register.js";
import {
  PROGRESS_BAR_DOCS_DESCRIPTION,
  PROGRESS_BAR_SOURCE_CODE,
} from "./ids-progress-bar.developer-usage";

const meta: Meta = {
  title: "Spec Generated/IDS/Progress Bar",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: PROGRESS_BAR_DOCS_DESCRIPTION },
      source: { code: PROGRESS_BAR_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    type: {
      control: "select",
      options: ["inline", "with-label", "indeterminate"],
    },
    thickness: { control: "select", options: ["thin", "medium", "thick"] },
    state: {
      control: "select",
      options: [
        "in-progress",
        "completed-success",
        "completed-warning",
        "failed-error",
      ],
    },
    showHelperText: { control: "boolean" },
  },
  args: {
    value: 30,
    label: "Label",
    type: "with-label",
    thickness: "thin",
    state: "in-progress",
    showHelperText: true,
    helperText: "Helper text (time estimate)",
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — Figma `11099:57210`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <div style="max-width: 300px">
      <ids-progress-bar
        .value=${Number(args.value)}
        label=${args.label}
        type=${args.type}
        thickness=${args.thickness}
        state=${args.state}
        ?showHelperText=${Boolean(args.showHelperText)}
        helperText=${args.helperText}
      ></ids-progress-bar>
    </div>
  `,
};

/** Secondary proof — Figma `11099:57186`. */
export const Inline: Story = {
  name: "Inline",
  args: {
    value: 30,
    type: "inline",
    thickness: "medium",
    state: "in-progress",
    showHelperText: false,
    helperText: "",
    label: "",
  },
  render: (args) => html`
    <div style="max-width: 300px">
      <ids-progress-bar
        .value=${Number(args.value)}
        type=${args.type}
        thickness=${args.thickness}
        state=${args.state}
      ></ids-progress-bar>
    </div>
  `,
};

export const Indeterminate: Story = {
  render: () => html`
    <div style="max-width: 300px">
      <ids-progress-bar type="indeterminate" thickness="medium"></ids-progress-bar>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="max-width: 300px; display: grid; gap: 16px">
      <ids-progress-bar
        value="100"
        type="with-label"
        label="Success"
        state="completed-success"
        showHelperText
        helperText="Completed successfully"
      ></ids-progress-bar>
      <ids-progress-bar
        value="100"
        type="with-label"
        label="Warning"
        state="completed-warning"
        showHelperText
        helperText="Completed with exceptions"
      ></ids-progress-bar>
      <ids-progress-bar
        value="40"
        type="with-label"
        label="Error"
        state="failed-error"
        showHelperText
        helperText="Failed"
      ></ids-progress-bar>
    </div>
  `,
};

/** edf-core demo parity samples. */
export const EdfDemoParity: Story = {
  name: "edf-core demo parity",
  render: () => html`
    <div style="max-width: 400px; display: grid; gap: 20px">
      <ids-progress-bar
        value="20"
        progressLabel="Progress Text"
        displayValue="60%"
        displayValuePosition="top"
      ></ids-progress-bar>
      <ids-progress-bar
        type="warning"
        progressLabel="Warning Label"
        value="40"
        displayValue="Step 1 of 3"
        message="Warning/Completed with exception"
        shape="status-warn-tri-solid"
      ></ids-progress-bar>
      <ids-progress-bar
        type="success"
        progressLabel="Success Label"
        value="75"
        displayValue="75%"
        message="Success message"
        displayValuePosition="top"
        shape="status-ok-circ-solid"
      ></ids-progress-bar>
      <ids-progress-bar
        type="danger"
        progressLabel="Danger Label"
        value="90"
        displayValue="90%"
        message="Error"
        shape="status-critical-square-solid"
      ></ids-progress-bar>
      <ids-progress-bar
        type="info"
        progressLabel="Info Label"
        value="99"
        helperText="Estimated Time Remaining/Helper Text"
      ></ids-progress-bar>
      <ids-progress-bar loop></ids-progress-bar>
      <ids-progress-bar value="20" disabled></ids-progress-bar>
    </div>
  `,
};
