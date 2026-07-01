import "../../../components/synapse-theme.css";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import { ALERT_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/alert.contract";
import {
  AlertAction,
  AlertLink,
  AlertMessage,
} from "./Alert";
import { SynapseAlert } from "./SynapseAlert";
import { AlertGroup, AlertItem } from "./AlertGroup";
import type { AlertGlobalSeverity, AlertInlineSeverity } from "./Alert";
import {
  SYNAPSE_ALERT_DESIGN_SPEC_PATH,
  SYNAPSE_ALERT_GLOBAL_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_ALERT_INLINE_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_ALERT_SAMPLE_GLOBAL_MESSAGE,
  SYNAPSE_ALERT_SAMPLE_INLINE_MESSAGE,
  SYNAPSE_ALERT_SAMPLE_INLINE_TITLE,
} from "../spec-contracts/synapse-alert.contract";

type AlertControlArgs = {
  display: "global" | "inline";
  severity?: string;
  density?: "compact" | "detailed";
  message?: string;
  title?: string;
  linkLabel?: string;
  linkHref?: string;
  actionLabel?: string;
  dismissible?: boolean;
};

function renderAlertFromControls(args: AlertControlArgs) {
  const messageSlot = args.message ? <AlertMessage>{args.message}</AlertMessage> : null;
  const globalSeverity = (
    args.severity === "success" ? "informational" : args.severity ?? "informational"
  ) as AlertGlobalSeverity;
  const inlineSeverity = (args.severity ?? "informational") as AlertInlineSeverity;

  if (args.display === "global") {
    return (
      <SynapseAlert
        display="global"
        severity={globalSeverity}
        dismissible={args.dismissible}
        linkLabel={args.linkLabel || undefined}
        linkHref={args.linkHref || undefined}
        actionLabel={args.actionLabel || undefined}
      >
        {messageSlot}
      </SynapseAlert>
    );
  }

  return (
    <SynapseAlert
      display="inline"
      severity={inlineSeverity}
      density={args.density ?? "compact"}
      title={args.title || undefined}
      dismissible={args.dismissible}
      linkLabel={args.linkLabel || undefined}
      linkHref={args.linkHref || undefined}
      actionLabel={args.actionLabel || undefined}
    >
      {messageSlot}
    </SynapseAlert>
  );
}

const specAccurateArgs: AlertControlArgs = {
  display: "inline",
  severity: "informational",
  density: "compact",
  message: ALERT_SPEC_ACCURATE_DEFAULTS.message,
  dismissible: true,
  title: "",
  linkLabel: "",
  linkHref: "",
  actionLabel: "",
};

const meta = {
  title: "Spec Generated/Synapse/Alert",
  component: SynapseAlert,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Alert (IDS-fork). Source: \`${SYNAPSE_ALERT_DESIGN_SPEC_PATH}\`.`,
          "Composition: `AlertMessage`, `AlertLink`, `AlertAction`; global carousel via `AlertGroup` + `AlertItem`.",
          "Alert actions use `--alert-action-control-radius` (2px).",
        ].join(" "),
      },
    },
  },
  argTypes: {
    display: { control: "select", options: ["global", "inline"] },
    severity: {
      control: "select",
      options: ["informational", "success", "warning-minor", "warning-major", "critical"],
    },
    density: { control: "select", options: ["compact", "detailed"], if: { arg: "display", eq: "inline" } },
    title: { control: "text", if: { arg: "display", eq: "inline" } },
    message: { control: "text", name: "message (slot)" },
    linkLabel: { control: "text" },
    linkHref: { control: "text" },
    actionLabel: { control: "text" },
    dismissible: { control: "boolean" },
  },
  args: specAccurateArgs,
} satisfies Meta<typeof SynapseAlert>;

export default meta;
type Story = StoryObj<typeof SynapseAlert>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => renderAlertFromControls(args as AlertControlArgs),
  args: specAccurateArgs,
};

export const SpecAccurateGlobalInformational: Story = {
  name: "Spec Accurate / Global Informational",
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_ALERT_GLOBAL_SPEC_ACCURATE_NODE_ID}\`.` } },
  },
  render: () => (
    <SynapseAlert display="global" severity="informational" dismissible linkLabel="Learn more" actionLabel="Action">
      <AlertMessage>{SYNAPSE_ALERT_SAMPLE_GLOBAL_MESSAGE}</AlertMessage>
    </SynapseAlert>
  ),
};

export const SpecAccurateInlineDetailedCritical: Story = {
  name: "Spec Accurate / Inline Detailed Critical",
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_ALERT_INLINE_SPEC_ACCURATE_NODE_ID}\`.` } },
  },
  render: () => (
    <SynapseAlert
      display="inline"
      severity="critical"
      density="detailed"
      title={SYNAPSE_ALERT_SAMPLE_INLINE_TITLE}
      dismissible
      actionLabel="Action"
    >
      <AlertMessage>{SYNAPSE_ALERT_SAMPLE_INLINE_MESSAGE}</AlertMessage>
    </SynapseAlert>
  ),
};

export const MultipleAlerts: Story = {
  name: "Multiple Alerts (Global Carousel)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <AlertGroup defaultActiveIndex={1}>
      <AlertItem severity="critical">
        <AlertMessage>Critical outage: immediate action required in region us-east-1.</AlertMessage>
        <AlertLink label="View status page" href="#" />
        <AlertAction label="Retry" />
      </AlertItem>
      <AlertItem severity="warning-major">
        <AlertMessage>Major degradation detected for alerting service.</AlertMessage>
        <AlertLink label="Learn more" href="#" />
      </AlertItem>
      <AlertItem severity="warning-minor">
        <AlertMessage>Minor warning: configuration drift found in workspace sync.</AlertMessage>
      </AlertItem>
      <AlertItem severity="informational">
        <AlertMessage>Multiple active alerts are available. Review the alert center.</AlertMessage>
        <AlertLink label="Open alert center" href="#" />
        <AlertAction label="Acknowledge" />
      </AlertItem>
    </AlertGroup>
  ),
};

export const InlineSuccessCompact: Story = {
  render: () => (
    <SynapseAlert display="inline" severity="success" density="compact" dismissible>
      <AlertMessage>Operation completed successfully.</AlertMessage>
    </SynapseAlert>
  ),
};

export const GlobalCriticalDismissOnly: Story = {
  render: () => (
    <SynapseAlert display="global" severity="critical" dismissible>
      <AlertMessage>Critical application message requiring attention.</AlertMessage>
    </SynapseAlert>
  ),
};

function CarouselInteractiveHost({
  severity = "critical",
  initialMessages,
}: {
  severity?: AlertGlobalSeverity;
  initialMessages: string[];
}) {
  const [items, setItems] = useState<string[]>(() => [...initialMessages]);
  const [index, setIndex] = useState(0);
  const total = Math.max(1, items.length);
  const safeIndex = ((index % total) + total) % total;
  const message = items[safeIndex] ?? "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
      <SynapseAlert
        display="global"
        severity={severity}
        dismissible={severity !== "critical"}
        carousel={{
          currentItem: safeIndex + 1,
          totalItems: total,
          onPrevious: () => setIndex((i) => (i - 1 + total) % total),
          onNext: () => setIndex((i) => (i + 1) % total),
        }}
      >
        <AlertMessage>{message}</AlertMessage>
      </SynapseAlert>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <button type="button" onClick={() => setItems((prev) => [...prev, `New alert item ${prev.length + 1}.`])}>
          Add alert item
        </button>
        <button
          type="button"
          onClick={() => {
            if (items.length <= 1) return;
            const next = items.filter((_, i) => i !== safeIndex);
            const nextIndex = Math.min(safeIndex, Math.max(0, next.length - 1));
            setItems(next);
            setIndex(nextIndex);
          }}
          disabled={items.length <= 1}
        >
          Remove current item
        </button>
      </div>
    </div>
  );
}

export const GlobalCarouselInteractive: Story = {
  render: () => (
    <CarouselInteractiveHost
      severity="critical"
      initialMessages={[
        "Critical alert 1 of N — host supplies the list; carousel only shows index.",
        "Critical alert 2 of N — onPrevious / onNext are wired in this story.",
        "Critical alert 3 of N — use Add alert item to grow the carousel.",
      ]}
    />
  ),
};
