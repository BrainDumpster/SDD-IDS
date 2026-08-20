import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  IDS_SPINNER_DESIGN_SPEC_PATH,
  SPINNER_ARIA_LIVES,
  SPINNER_LABEL_VISIBILITIES,
  SPINNER_MODES,
  SPINNER_SIZES,
  SPINNER_SPEC_ACCURATE_DEFAULTS,
} from "../../../compiled/component-contracts/ids/spinner.contract.js";
import { IdsSpinnerComponent } from "../../../compiled/lib/angular/ids/spinner/ids-spinner.component.js";
import { IDS_SPINNER_IMPORTS } from "../../../compiled/lib/angular/ids/spinner/index.js";

/** @type {import("@storybook/angular").Meta<IdsSpinnerComponent>} */
const meta = {
  title: "Spec Generated/IDS/Spinner",
  component: IdsSpinnerComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_SPINNER_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          `Angular IDS Spinner from \`${IDS_SPINNER_DESIGN_SPEC_PATH}\` (` +
          "`lib/angular/ids/spinner`). Anatomy: backdrop? → spinnerRoot → " +
          "spinnerVisual (track + arc) → label. `size`: sm | md | lg · " +
          "`mode`: inline | overlay · `labelVisibility`: sr-only | visible-below | " +
          "visible-inline. CSS conic-gradient ring (no SVG). Theme: `components/ids-theme.css`.",
      },
    },
  },
  args: { ...SPINNER_SPEC_ACCURATE_DEFAULTS },
  argTypes: {
    size: { control: "select", options: [...SPINNER_SIZES] },
    mode: { control: "select", options: [...SPINNER_MODES] },
    label: { control: "text" },
    labelVisibility: {
      control: "select",
      options: [...SPINNER_LABEL_VISIBILITIES],
    },
    ariaLive: { control: "select", options: [...SPINNER_ARIA_LIVES] },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  args: { ...SPINNER_SPEC_ACCURATE_DEFAULTS },
};

/** Figma `11099:58972` — three side-by-side sizes + labels. */
/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const FigmaUsageFrame = {
  name: "Figma Usage Frame",
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center; padding: 16px;">
        <ids-spinner
          size="sm"
          mode="inline"
          label="Loading..."
          labelVisibility="visible-inline"
        ></ids-spinner>
        <ids-spinner
          size="md"
          mode="inline"
          label="Loading..."
          labelVisibility="visible-below"
        ></ids-spinner>
        <ids-spinner
          size="lg"
          mode="inline"
          label="Loading..."
          labelVisibility="sr-only"
        ></ids-spinner>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const SizeSmall = {
  name: "Size Small",
  args: {
    size: "sm",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "visible-inline",
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const SizeMedium = {
  name: "Size Medium",
  args: {
    size: "md",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "visible-below",
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const SizeLarge = {
  name: "Size Large",
  args: {
    size: "lg",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "sr-only",
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const WithCustomLabel = {
  name: "With Custom Label",
  args: {
    size: "md",
    mode: "inline",
    label: "Fetching data...",
    labelVisibility: "visible-below",
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const ScreenReaderOnly = {
  name: "Screen Reader Only",
  args: {
    size: "md",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "sr-only",
  },
};

/** Overlay mode — fixed full-viewport backdrop + spinner. */
/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const OverlayMode = {
  name: "Overlay Mode",
  args: {
    size: "md",
    mode: "overlay",
    label: "Loading...",
    labelVisibility: "visible-below",
  },
  parameters: {
    layout: "fullscreen",
  },
};

/**
 * On brand surfaces, loading text uses `var(--color-text-gray-white)`
 * (host override — not a runtime prop).
 */
/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const OnBrandBackground = {
  name: "On Brand Background",
  render: () => ({
    template: `
      <div
        class="ids-spinner-on-brand-demo"
        style="
          display: flex;
          gap: 24px;
          align-items: center;
          padding: 16px;
          background: var(--color-background-brand-base);
        "
      >
        <style>
          .ids-spinner-on-brand-demo [data-ids="ids-spinner-label"] {
            color: var(--color-text-gray-white);
          }
        </style>
        <ids-spinner
          size="sm"
          mode="inline"
          label="Loading..."
          labelVisibility="visible-inline"
        ></ids-spinner>
        <ids-spinner
          size="md"
          mode="inline"
          label="Loading..."
          labelVisibility="visible-below"
        ></ids-spinner>
        <ids-spinner
          size="lg"
          mode="inline"
          label="Loading..."
          labelVisibility="sr-only"
        ></ids-spinner>
      </div>
    `,
  }),
};

/** Optional focusable mode — Tab to see 2px brand focus ring. */
/** @type {import("@storybook/angular").StoryObj<IdsSpinnerComponent>} */
export const Focusable = {
  name: "Focusable",
  args: {
    size: "md",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "visible-below",
    tabIndex: 0,
  },
};
