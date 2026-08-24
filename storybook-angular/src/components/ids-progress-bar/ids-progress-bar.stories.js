import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  IDS_PROGRESS_BAR_DESIGN_SPEC_PATH,
  PROGRESS_BAR_INLINE_DEFAULTS,
  PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS,
  PROGRESS_BAR_STATES,
  PROGRESS_BAR_THICKNESSES,
  PROGRESS_BAR_TYPES,
} from "../../../compiled/component-contracts/ids/progress-bar.contract.js";
import { IdsProgressBarComponent } from "../../../compiled/lib/angular/ids/progress-bar/ids-progress-bar.component.js";
import { IDS_PROGRESS_BAR_IMPORTS } from "../../../compiled/lib/angular/ids/progress-bar/index.js";
import {
  PROGRESS_BAR_DOCS_DESCRIPTION,
  PROGRESS_BAR_FRAME_TEMPLATE,
  PROGRESS_BAR_SOURCE_CODE,
  PROGRESS_BAR_STORY_SOURCE_CODE,
} from "./ids-progress-bar.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsProgressBarComponent>} */
const meta = {
  title: "Components/IDS/Progress Bar",
  component: IdsProgressBarComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_PROGRESS_BAR_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component:
          PROGRESS_BAR_DOCS_DESCRIPTION +
          ` Path: \`${IDS_PROGRESS_BAR_DESIGN_SPEC_PATH}\`.`,
      },
      source: {
        type: "code",
        language: "typescript",
        code: PROGRESS_BAR_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    label: { control: "text" },
    helperText: { control: "text" },
    showHelperText: { control: "boolean" },
    type: { control: "select", options: [...PROGRESS_BAR_TYPES] },
    thickness: { control: "select", options: [...PROGRESS_BAR_THICKNESSES] },
    state: { control: "select", options: [...PROGRESS_BAR_STATES] },
  },
  args: { ...PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsProgressBarComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Figma `11099:57210` — with-label, thin, 30%, helper. Frame max-width 300px.",
      },
      source: {
        type: "code",
        language: "html",
        code: PROGRESS_BAR_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: PROGRESS_BAR_FRAME_TEMPLATE,
  }),
  args: { ...PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS },
};

/** Figma `11099:57186` — Determinate/Inline, Medium, 30%. */
/** @type {import("@storybook/angular").StoryObj<IdsProgressBarComponent>} */
export const InlineType = {
  name: "Inline Type",
  render: (args) => ({
    props: { ...args },
    template: PROGRESS_BAR_FRAME_TEMPLATE,
  }),
  args: { ...PROGRESS_BAR_INLINE_DEFAULTS },
};

/** @type {import("@storybook/angular").StoryObj<IdsProgressBarComponent>} */
export const ThicknessReference = {
  name: "Thickness Reference",
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <ids-progress-bar
          [value]="30"
          label="Thin"
          type="with-label"
          thickness="thin"
          state="in-progress"
        ></ids-progress-bar>
        <ids-progress-bar
          [value]="30"
          label="Medium"
          type="with-label"
          thickness="medium"
          state="in-progress"
        ></ids-progress-bar>
        <ids-progress-bar
          [value]="30"
          label="Thick"
          type="with-label"
          thickness="thick"
          state="in-progress"
        ></ids-progress-bar>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsProgressBarComponent>} */
export const States = {
  name: "States",
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <ids-progress-bar
          [value]="35"
          label="In Progress"
          type="with-label"
          state="in-progress"
          [showHelperText]="true"
          helperText="No status icon for in-progress"
        ></ids-progress-bar>
        <ids-progress-bar
          [value]="100"
          label="Completed/Success"
          type="with-label"
          state="completed-success"
          [showHelperText]="true"
          helperText="Success with status-ok-circ-solid"
        ></ids-progress-bar>
        <ids-progress-bar
          [value]="100"
          label="Completed with Exceptions/Warning"
          type="with-label"
          state="completed-warning"
          [showHelperText]="true"
          helperText="Warning with status-warn-tri-solid"
        ></ids-progress-bar>
        <ids-progress-bar
          [value]="100"
          label="Failed/Error"
          type="with-label"
          state="failed-error"
          [showHelperText]="true"
          helperText="Error with status-critical-square-solid"
        ></ids-progress-bar>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsProgressBarComponent>} */
export const Indeterminate = {
  name: "Indeterminate",
  render: (args) => ({
    props: { ...args },
    template: PROGRESS_BAR_FRAME_TEMPLATE,
  }),
  args: {
    label: "Processing...",
    type: "indeterminate",
    thickness: "medium",
    state: "in-progress",
    showHelperText: true,
    helperText: "Estimated time unavailable",
  },
};
