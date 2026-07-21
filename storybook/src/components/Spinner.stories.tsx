import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { IdsSpinner } from "./IdsSpinner";
import styles from "./Spinner.module.css";

const meta: Meta<typeof IdsSpinner> = {
  title: "Spec Generated/IDS/Spinner",
  component: IdsSpinner,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    labelVisibility: { control: "select", options: ["sr-only", "inline", "below"] },
  },
};

export default meta;
type Story = StoryObj<typeof IdsSpinner>;

export const SmallManual: Story = {
  args: { size: "sm", labelVisibility: "inline", label: "Loading..." },
};

export const MediumManual: Story = {
  args: { size: "md", labelVisibility: "below", label: "Loading..." },
};

export const LargeManual: Story = {
  args: { size: "lg", labelVisibility: "sr-only", label: "Loading..." },
};

export const FigmaUsageFrameManual: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center", padding: 16 }}>
      <div>
        <IdsSpinner size="sm" labelVisibility="inline" label="Loading..." />
      </div>
      <div>
        <IdsSpinner size="md" labelVisibility="below" label="Loading..." />
      </div>
      <div>
        <IdsSpinner size="lg" labelVisibility="sr-only" label="Loading..." />
      </div>
    </div>
  ),
};

export const WithCustomLabel: Story = {
  args: { size: "md", labelVisibility: "below", label: "Fetching data..." },
};

export const OnBrandBackground: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        padding: 16,
        background: "var(--color-background-brand-base)",
      }}
    >
      <div className={styles.onBrandBackgroundOverride}>
        <IdsSpinner size="sm" labelVisibility="inline" label="Loading..." />
      </div>
      <div className={styles.onBrandBackgroundOverride}>
        <IdsSpinner size="md" labelVisibility="below" label="Loading..." />
      </div>
      <div className={styles.onBrandBackgroundOverride}>
        <IdsSpinner size="lg" labelVisibility="sr-only" label="Loading..." />
      </div>
    </div>
  ),
};
