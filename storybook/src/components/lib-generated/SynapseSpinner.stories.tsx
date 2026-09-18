/**
 * Storybook: design-spec–generated Spinner from `lib/react/synapse/spinner`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy:
 *   backdrop? → spinnerRoot → spinnerVisual (track + arc) → label?
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/spinner/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_SPINNER_DOCS_DESCRIPTION,
  SYNAPSE_SPINNER_SOURCE_CODE,
} from "./synapse-spinner.developer-usage";
import {
  SynapseSpinner,
  type SynapseSpinnerProps,
} from "@synapse/react/spinner";

const DESIGN_SPEC_PATH = "components/synapse/spinner/design-spec.md";

/** Figma usage frame `11099:58972` — sm inline + md below + lg sr-only. */
const specAccurateArgs: SynapseSpinnerProps = {
  size: "md",
  mode: "inline",
  label: "Loading...",
  labelVisibility: "visible-below",
  ariaLive: "polite",
};

const meta: Meta<SynapseSpinnerProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Spinner",
  component: SynapseSpinner,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_SPINNER_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_SPINNER_SOURCE_CODE,
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
type Story = StoryObj<SynapseSpinnerProps>;

/** Primary medium stacked sample from the usage frame. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => <SynapseSpinner {...args} />,
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
      <SynapseSpinner
        size="sm"
        mode="inline"
        label="Loading..."
        labelVisibility="visible-inline"
      />
      <SynapseSpinner
        size="md"
        mode="inline"
        label="Loading..."
        labelVisibility="visible-below"
      />
      <SynapseSpinner
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
      className="synapse-spinner-on-brand-demo"
    >
      <style>{`
        .synapse-spinner-on-brand-demo [data-ids="synapse-spinner-label"] {
          color: var(--color-text-gray-white);
        }
      `}</style>
      <SynapseSpinner
        size="sm"
        mode="inline"
        label="Loading..."
        labelVisibility="visible-inline"
      />
      <SynapseSpinner
        size="md"
        mode="inline"
        label="Loading..."
        labelVisibility="visible-below"
      />
      <SynapseSpinner
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
