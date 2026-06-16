import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseSpinner } from "./SynapseSpinner";
import {
  SYNAPSE_SPINNER_DESIGN_SPEC_PATH,
  SYNAPSE_SPINNER_ELEMENT_PROTOTYPE_NODE_ID,
  SYNAPSE_SPINNER_EXAMPLE_PANEL_NODES,
  SYNAPSE_SPINNER_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_SPINNER_IDS_USAGE_FRAME_NODE_ID,
  SYNAPSE_SPINNER_MAIN_NODE_ID,
  SYNAPSE_SPINNER_SAMPLE_LABEL,
  SYNAPSE_SPINNER_SIZE_NODES,
  SYNAPSE_SPINNER_SPEC_ACCURATE_NODE_ID,
} from "../spec-contracts/synapse-spinner.contract";

/** Figma `43328:2716` — Medium on light surface, label below. */
const specAccurateArgs = {
  size: "md" as const,
  labelVisibility: "below" as const,
  label: SYNAPSE_SPINNER_SAMPLE_LABEL,
};

const meta: Meta<typeof SynapseSpinner> = {
  title: "Spec Generated/Synapse/Spinner",
  component: SynapseSpinner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Spinner (IDS-fork). Source: \`${SYNAPSE_SPINNER_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_SPINNER_IDS_BASELINE_SPEC_PATH}\` (usage frame \`${SYNAPSE_SPINNER_IDS_USAGE_FRAME_NODE_ID}\`).`,
          `Synapse Figma board: \`${SYNAPSE_SPINNER_MAIN_NODE_ID}\`. Primary story: medium + label below (\`${SYNAPSE_SPINNER_SPEC_ACCURATE_NODE_ID}\`).`,
          "No programme layout deltas — geometry and API inherit IDS; tokens resolve via `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    labelVisibility: { control: "select", options: ["sr-only", "inline", "below"] },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseSpinner>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
};

/** Figma `11099:58972` — IDS usage frame layout (3 sizes). */
export const FigmaUsageFrame: Story = {
  name: "Figma Usage Frame",
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center", padding: 16 }}>
      <SynapseSpinner
        size="sm"
        labelVisibility="inline"
        label={SYNAPSE_SPINNER_SAMPLE_LABEL}
      />
      <SynapseSpinner
        size="md"
        labelVisibility="below"
        label={SYNAPSE_SPINNER_SAMPLE_LABEL}
      />
      <SynapseSpinner size="lg" labelVisibility="sr-only" label={SYNAPSE_SPINNER_SAMPLE_LABEL} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Mirrors IDS usage frame \`${SYNAPSE_SPINNER_IDS_USAGE_FRAME_NODE_ID}\` / Synapse doc board main row.`,
      },
    },
  },
};

/** Figma size nodes — Small `11099:58973`, Medium `11099:58976`, Large `11417:99226`. */
export const SizeMatrix: Story = {
  name: "Size Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 16 }}>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Small — {SYNAPSE_SPINNER_SIZE_NODES.small}
        </p>
        <SynapseSpinner
          size="sm"
          labelVisibility="inline"
          label={SYNAPSE_SPINNER_SAMPLE_LABEL}
        />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Medium — {SYNAPSE_SPINNER_SIZE_NODES.medium}
        </p>
        <SynapseSpinner
          size="md"
          labelVisibility="below"
          label={SYNAPSE_SPINNER_SAMPLE_LABEL}
        />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Large — {SYNAPSE_SPINNER_SIZE_NODES.large}
        </p>
        <SynapseSpinner size="lg" labelVisibility="sr-only" label={SYNAPSE_SPINNER_SAMPLE_LABEL} />
      </div>
    </div>
  ),
};

/** Synapse light + dark example panels (`11466:98482`, `43328:2711`). */
export const LightAndDarkPanels: Story = {
  name: "Light And Dark Panels",
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <div
        style={{
          padding: 24,
          background: "var(--color-background-surface-2)",
          border: "1px solid var(--color-border-neutral-light)",
          borderRadius: 8,
        }}
      >
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Light panel — {SYNAPSE_SPINNER_EXAMPLE_PANEL_NODES.light}
        </p>
        <SynapseSpinner
          size="md"
          labelVisibility="below"
          label={SYNAPSE_SPINNER_SAMPLE_LABEL}
        />
      </div>
      <div
        data-theme="dark"
        style={{
          padding: 24,
          background: "var(--color-background-surface-2)",
          border: "1px solid var(--color-border-neutral-light)",
          borderRadius: 8,
        }}
      >
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          Dark panel — {SYNAPSE_SPINNER_EXAMPLE_PANEL_NODES.dark}
        </p>
        <SynapseSpinner
          size="md"
          labelVisibility="below"
          label={SYNAPSE_SPINNER_SAMPLE_LABEL}
        />
      </div>
    </div>
  ),
};

export const WithCustomLabel: Story = {
  args: { size: "md", labelVisibility: "below", label: "Fetching data..." },
};
