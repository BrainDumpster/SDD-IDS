import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  FORM_LABEL_SIZES,
  FORM_LABEL_SPEC_ACCURATE_DEFAULTS,
} from "../../../compiled/component-contracts/ids/form-label.contract.js";
import { IdsFormLabelComponent } from "../../../compiled/lib/angular/ids/form-label/ids-form-label.component.js";
import { IDS_FORM_LABEL_IMPORTS } from "../../../compiled/lib/angular/ids/form-label/index.js";
import {
  FORM_LABEL_DOCS_DESCRIPTION,
  FORM_LABEL_SOURCE_CODE,
} from "./ids-form-label.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsFormLabelComponent>} */
const meta = {
  title: "Components/IDS/Form Label",
  component: IdsFormLabelComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_FORM_LABEL_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: FORM_LABEL_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "html",
        code: FORM_LABEL_SOURCE_CODE,
      },
    },
  },
  args: { ...FORM_LABEL_SPEC_ACCURATE_DEFAULTS },
  argTypes: {
    label: { control: "text" },
    size: { control: "select", options: [...FORM_LABEL_SIZES] },
    required: { control: "boolean" },
    showInfoIcon: { control: "boolean" },
    infoLabel: { control: "text" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsFormLabelComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  args: { ...FORM_LABEL_SPEC_ACCURATE_DEFAULTS },
};

/** Figma `Size` variants stacked — 24 / 32 / 40px rows. */
/** @type {import("@storybook/angular").StoryObj<IdsFormLabelComponent>} */
export const SizeMatrix = {
  name: "Size Matrix",
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; padding: 16px;">
        <ids-form-label label="Small (24px)" size="sm" [required]="true" [showInfoIcon]="true" infoLabel="More information"></ids-form-label>
        <ids-form-label label="Medium (32px)" size="md" [required]="true" [showInfoIcon]="true" infoLabel="More information"></ids-form-label>
        <ids-form-label label="Large (40px)" size="lg" [required]="true" [showInfoIcon]="true" infoLabel="More information"></ids-form-label>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsFormLabelComponent>} */
export const RequiredOnly = {
  name: "Required (no icon)",
  args: { label: "Email", size: "md", required: true, showInfoIcon: false },
};

/** @type {import("@storybook/angular").StoryObj<IdsFormLabelComponent>} */
export const WithInfoIcon = {
  name: "With Info Icon",
  args: {
    label: "Password",
    size: "md",
    required: false,
    showInfoIcon: true,
    infoLabel: "Must be at least 8 characters",
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsFormLabelComponent>} */
export const Plain = {
  name: "Plain (optional field)",
  args: { label: "Nickname", size: "md", required: false, showInfoIcon: false },
};
