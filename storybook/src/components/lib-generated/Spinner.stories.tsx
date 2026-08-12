/**
 * Storybook: design-spec–generated Spinner from `lib/react/ids/spinner`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy:
 *   backdrop? → spinnerRoot → spinnerVisual (track + arc) → label?
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/spinner/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsSpinner,
  type IdsSpinnerProps,
} from "../../../../lib/react/ids/spinner";

const DESIGN_SPEC_PATH = "components/ids/spinner/design-spec.md";

/** Figma usage frame `11099:58972` — sm inline + md below + lg sr-only. */
const specAccurateArgs: IdsSpinnerProps = {
  size: "md",
  mode: "inline",
  label: "Loading...",
  labelVisibility: "visible-below",
  ariaLive: "polite",
};

const meta: Meta<IdsSpinnerProps> = {
  title: "Lib Generated/IDS/Spinner",
  component: IdsSpinner,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          `React IDS Spinner from \`${DESIGN_SPEC_PATH}\`. ` +
          "Anatomy: backdrop? → spinnerRoot → spinnerVisual (track + arc) → label. " +
          "`size`: sm | md | lg · `mode`: inline | overlay · " +
          "`labelVisibility`: sr-only | visible-below | visible-inline. " +
          "CSS conic-gradient ring (no SVG). Theme: `components/ids-theme.css`. " +
          "No `@base-ui-components`.",
      },
    },
  },
  args: specAccurateArgs,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    mode: {
      control: "select",
      options: ["inline", "overlay"],
    },
    label: { control: "text" },
    labelVisibility: {
      control: "select",
      options: ["sr-only", "visible-below", "visible-inline"],
    },
    ariaLive: {
      control: "select",
      options: ["polite", "assertive", "off"],
    },
  },
};

export default meta;
type Story = StoryObj<IdsSpinnerProps>;

/** Primary medium stacked sample from the usage frame. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => <IdsSpinner {...args} />,
};

/** Figma `11099:58972` — three side-by-side sizes + labels. */
export const FigmaUsageFrame: Story = {
  name: "Figma Usage Frame",
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        padding: 16,
      }}
    >
      <IdsSpinner
        size="sm"
        mode="inline"
        label="Loading..."
        labelVisibility="visible-inline"
      />
      <IdsSpinner
        size="md"
        mode="inline"
        label="Loading..."
        labelVisibility="visible-below"
      />
      <IdsSpinner
        size="lg"
        mode="inline"
        label="Loading..."
        labelVisibility="sr-only"
      />
    </div>
  ),
};

export const SizeSmall: Story = {
  name: "Size Small",
  args: {
    size: "sm",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "visible-inline",
  },
};

export const SizeMedium: Story = {
  name: "Size Medium",
  args: {
    size: "md",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "visible-below",
  },
};

export const SizeLarge: Story = {
  name: "Size Large",
  args: {
    size: "lg",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "sr-only",
  },
};

export const WithCustomLabel: Story = {
  name: "With Custom Label",
  args: {
    size: "md",
    mode: "inline",
    label: "Fetching data...",
    labelVisibility: "visible-below",
  },
};

export const ScreenReaderOnly: Story = {
  name: "Screen Reader Only",
  args: {
    size: "md",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "sr-only",
  },
};

/**
 * Overlay mode — fixed full-viewport backdrop + spinner.
 * Open this story alone to see the blocking overlay.
 */
export const OverlayMode: Story = {
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
 * Implementation note: on brand surfaces, loading text uses
 * `var(--color-text-gray-white)` (host override — not a runtime prop).
 */
export const OnBrandBackground: Story = {
  name: "On Brand Background",
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        padding: 16,
        background: "var(--color-background-brand-base)",
      }}
      className="ids-spinner-on-brand-demo"
    >
      <style>{`
        .ids-spinner-on-brand-demo [data-ids="ids-spinner-label"] {
          color: var(--color-text-gray-white);
        }
      `}</style>
      <IdsSpinner
        size="sm"
        mode="inline"
        label="Loading..."
        labelVisibility="visible-inline"
      />
      <IdsSpinner
        size="md"
        mode="inline"
        label="Loading..."
        labelVisibility="visible-below"
      />
      <IdsSpinner
        size="lg"
        mode="inline"
        label="Loading..."
        labelVisibility="sr-only"
      />
    </div>
  ),
};

/** Optional focusable mode — Tab to see 2px brand focus ring. */
export const Focusable: Story = {
  name: "Focusable",
  args: {
    size: "md",
    mode: "inline",
    label: "Loading...",
    labelVisibility: "visible-below",
    tabIndex: 0,
  },
};
