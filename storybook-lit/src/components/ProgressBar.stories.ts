/**
 * Storybook: IDS Lit Progress Bar from `lib/lit/ids/progress-bar`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/progress-bar/design-spec.md
 * API: lib/react/ids/progress-bar
 * React reference: storybook/src/components/lib-generated/ProgressBar.stories.tsx
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/progress-bar/register.js";
import {
  PROGRESS_BAR_DOCS_DESCRIPTION,
  PROGRESS_BAR_SOURCE_CODE,
} from "./ids-progress-bar.developer-usage";

/**
 * Resizable frame — drag the bottom-right corner to verify min-widths
 * (inline: 80px root / 36px track; with-label: 200px root).
 */
const frameStyle =
  "width: 320px; max-width: 100%; box-sizing: border-box; resize: horizontal; overflow: auto; border: 1px dashed var(--color-border-gray-neutral-base); padding: 8px;";

/** Live Figma `11099:57210` — Determinate/regular, Medium, In Progress + helper. */
const specAccurateArgs = {
  value: 30,
  label: "Label",
  type: "with-label",
  thickness: "medium",
  state: "in-progress",
  showHelperText: true,
  helperText: "Helper text (time estimate)",
};

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
    value: { control: { type: "range", min: 0, max: 100 } },
    label: { control: "text" },
    helperText: { control: "text" },
    showHelperText: { control: "boolean" },
    type: {
      control: "select",
      options: ["with-label", "inline", "indeterminate"],
    },
    thickness: {
      control: "select",
      options: ["thin", "medium", "thick"],
    },
    state: {
      control: "select",
      options: [
        "in-progress",
        "completed-success",
        "completed-warning",
        "failed-error",
      ],
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj;

function renderProgressBar(args: Record<string, unknown>) {
  return html`
    <div style=${frameStyle}>
      <ids-progress-bar
        .value=${args.value as number}
        label=${(args.label as string) ?? ""}
        type=${args.type as string}
        thickness=${args.thickness as string}
        state=${args.state as string}
        ?showhelpertext=${Boolean(args.showHelperText)}
        helpertext=${(args.helperText as string) ?? ""}
      ></ids-progress-bar>
    </div>
  `;
}

/** Live Figma `11099:57210` — Determinate/regular, Medium, In Progress + helper. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => renderProgressBar(args),
};

/** Live Figma `11099:57186` — Determinate/Inline, Medium, 30%. */
export const InlineType: Story = {
  name: "Inline Type",
  args: {
    value: 30,
    type: "inline",
    thickness: "medium",
    state: "in-progress",
    showHelperText: false,
    helperText: "",
    label: "",
  },
  render: (args) => renderProgressBar(args),
};

export const ThicknessReference: Story = {
  name: "Thickness Reference",
  render: () => html`
    <div style="${frameStyle} display: flex; flex-direction: column; gap: 16px;">
      <ids-progress-bar
        .value=${30}
        label="Thin"
        type="with-label"
        thickness="thin"
        state="in-progress"
      ></ids-progress-bar>
      <ids-progress-bar
        .value=${30}
        label="Medium"
        type="with-label"
        thickness="medium"
        state="in-progress"
      ></ids-progress-bar>
      <ids-progress-bar
        .value=${30}
        label="Thick"
        type="with-label"
        thickness="thick"
        state="in-progress"
      ></ids-progress-bar>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="${frameStyle} display: flex; flex-direction: column; gap: 16px;">
      <ids-progress-bar
        .value=${35}
        label="In Progress"
        type="with-label"
        state="in-progress"
        showhelpertext
        helpertext="No status icon for in-progress"
      ></ids-progress-bar>
      <ids-progress-bar
        .value=${100}
        label="Completed/Success"
        type="with-label"
        state="completed-success"
        showhelpertext
        helpertext="Success with status-ok-circ-solid"
      ></ids-progress-bar>
      <ids-progress-bar
        .value=${100}
        label="Completed with Exceptions/Warning"
        type="with-label"
        state="completed-warning"
        showhelpertext
        helpertext="Warning with status-warn-tri-solid"
      ></ids-progress-bar>
      <ids-progress-bar
        .value=${100}
        label="Failed/Error"
        type="with-label"
        state="failed-error"
        showhelpertext
        helpertext="Error with status-critical-square-solid"
      ></ids-progress-bar>
    </div>
  `,
};

/** Helper text wraps up to 2 lines — drag the frame corner to verify. */
export const LongHelperText: Story = {
  name: "Long Helper Text",
  args: {
    ...specAccurateArgs,
    state: "failed-error",
    helperText:
      "The backup job failed because the network connection to the remote storage repository was interrupted. Verify the repository credentials and network route, then retry the job.",
  },
  render: (args) => renderProgressBar(args),
};

export const Indeterminate: Story = {
  args: {
    label: "Processing...",
    type: "indeterminate",
    thickness: "medium",
    state: "in-progress",
    showHelperText: true,
    helperText: "Estimated time unavailable",
    value: 0,
  },
  render: (args) => renderProgressBar(args),
};
