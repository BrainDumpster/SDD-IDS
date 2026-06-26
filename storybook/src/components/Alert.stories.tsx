import "../../../components/ids-theme.css";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import {
  ALERT_SPEC_ACCURATE_DEFAULTS,
  IDS_ALERT_DESIGN_SPEC_PATH,
} from "../spec-contracts/ids-alert.contract";
import {
  Alert,
  AlertAction,
  AlertLink,
  AlertMessage,
} from "./Alert";
import { AlertGroup, AlertItem } from "./AlertGroup";
import type { AlertGlobalSeverity, AlertInlineSeverity } from "./Alert";

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
      <Alert
        display="global"
        severity={globalSeverity}
        dismissible={args.dismissible}
        linkLabel={args.linkLabel || undefined}
        linkHref={args.linkHref || undefined}
        actionLabel={args.actionLabel || undefined}
      >
        {messageSlot}
      </Alert>
    );
  }

  return (
    <Alert
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
    </Alert>
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
  title: "Spec Generated/IDS/Alert",
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "Unified IDS alert with **composition** (`AlertMessage`, `AlertLink`, `AlertAction`) or prop shorthand. " +
          "`display`: `global` (banner) or `inline` (contextual). Inline adds **success** severity. " +
          "Global multi-alert: use `AlertGroup` + `AlertItem` children (one banner + carousel). " +
          `Contract: \`${IDS_ALERT_DESIGN_SPEC_PATH}\`.`,
      },
    },
  },
  argTypes: {
    display: {
      control: "select",
      options: ["global", "inline"],
      description: "Layout mode: global banner vs inline contextual",
    },
    severity: {
      control: "select",
      options: ["informational", "success", "warning-minor", "warning-major", "critical"],
      description: "For `display=\"global\"`, omit `success` (invalid).",
    },
    density: {
      control: "select",
      options: ["compact", "detailed"],
      if: { arg: "display", eq: "inline" },
    },
    title: {
      control: "text",
      if: { arg: "display", eq: "inline" },
    },
    message: { control: "text", name: "message (slot)" },
    linkLabel: { control: "text" },
    linkHref: { control: "text" },
    actionLabel: { control: "text" },
    dismissible: { control: "boolean" },
  },
  args: specAccurateArgs,
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

/** Spec Accurate Design: inline · informational · compact · dismissible — composition markup. */
export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => renderAlertFromControls(args as AlertControlArgs),
  args: specAccurateArgs,
};

/** Global multi-alert composition — `AlertGroup` owns carousel; one internal `Alert` banner. */
export const MultipleAlerts: Story = {
  name: "Multiple Alerts (Global Carousel)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <AlertGroup defaultActiveIndex={1}>
      <AlertItem severity="critical">
        <AlertMessage>
          Critical outage: immediate action required in region us-east-1.
        </AlertMessage>
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
        <AlertMessage>
          Multiple active alerts are available. Review the alert center.
        </AlertMessage>
        <AlertLink label="Open alert center" href="#" />
        <AlertAction label="Acknowledge" />
      </AlertItem>
      <AlertItem severity="informational">
        <AlertMessage>Scheduled maintenance window starts at 02:00 UTC.</AlertMessage>
        <AlertLink label="Open schedule" href="#" />
      </AlertItem>
    </AlertGroup>
  ),
};

export const PlaygroundManual: Story = {
  render: (args) => renderAlertFromControls(args as AlertControlArgs),
  args: {
    display: "global",
    severity: "informational",
    message: "Alert message — use **display** to switch global vs inline.",
    dismissible: true,
    title: "",
    linkLabel: "",
    linkHref: "",
    actionLabel: "",
  },
};

/* ——— Global (banner) ——— */

export const GlobalInformational: Story = {
  args: {
    display: "global",
    severity: "informational",
    message: "This is an application-level alert that communicates an informational message.",
    dismissible: true,
  },
};

export const GlobalWarningMinor: Story = {
  args: {
    display: "global",
    severity: "warning-minor",
    message: "This is an application-level alert that communicates a warning (minor) message.",
    dismissible: true,
  },
};

export const GlobalWarningMajor: Story = {
  args: {
    display: "global",
    severity: "warning-major",
    message: "This is an application-level alert that communicates a warning (major) message.",
    dismissible: true,
  },
};

export const GlobalCritical: Story = {
  args: {
    display: "global",
    severity: "critical",
    message: "This is an application-level alert that communicates a critical message.",
    dismissible: false,
  },
};

export const GlobalWithLink: Story = {
  args: {
    display: "global",
    severity: "informational",
    message: "This is an application-level alert that communicates an informational message. It may include a",
    linkLabel: "link to another page.",
    dismissible: true,
  },
};

export const GlobalWithAction: Story = {
  args: {
    display: "global",
    severity: "warning-major",
    message: "This is an application-level alert that communicates a warning (major) message. It may include actions.",
    actionLabel: "Action",
    dismissible: true,
  },
};

export const GlobalWithCarousel: Story = {
  args: {
    display: "global",
    severity: "critical",
    message: "This is an application-level alert that communicates a critical message.",
    dismissible: false,
    carousel: {
      currentItem: 1,
      totalItems: 4,
    },
  },
};

/** Host-owned list: prev/next updates index; `message` reflects the active item. */
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
      <Alert
        display="global"
        severity={severity}
        message={message}
        dismissible={severity !== "critical"}
        carousel={{
          currentItem: safeIndex + 1,
          totalItems: total,
          onPrevious: () => setIndex((i) => (i - 1 + total) % total),
          onNext: () => setIndex((i) => (i + 1) % total),
        }}
      />
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
        <span style={{ fontSize: 13, color: "#444" }}>
          {total} item(s) · index {safeIndex + 1} — use chevrons on the banner to navigate.
        </span>
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
        "Critical alert 3 of N — use “Add alert item” to grow the carousel.",
        "Critical alert 4 of N — remove current item to shrink the list.",
      ]}
    />
  ),
};

export const GlobalCarouselInteractiveInformational: Story = {
  render: () => (
    <CarouselInteractiveHost
      severity="informational"
      initialMessages={[
        "Informational item A — chevrons match white label text on the rail.",
        "Informational item B — severity rail uses info-strong token.",
      ]}
    />
  ),
};

export const GlobalVariantMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 16 }}>
        <Alert display="global" severity="critical" message="Critical global message." dismissible={false} />
        <Alert display="global" severity="warning-major" message="Warning major global message." />
        <Alert display="global" severity="warning-minor" message="Warning minor global message." />
        <Alert display="global" severity="informational" message="Informational global message." />
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <Alert display="global" severity="critical" message="Critical with link." linkLabel="link to another page." dismissible={false} />
        <Alert display="global" severity="warning-major" message="Major with link." linkLabel="link to another page." />
        <Alert display="global" severity="warning-minor" message="Minor with link." linkLabel="link to another page." />
        <Alert display="global" severity="informational" message="Info with link." linkLabel="link to another page." />
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <Alert display="global" severity="critical" message="Critical with action." actionLabel="Action" />
        <Alert display="global" severity="warning-major" message="Major with action." actionLabel="Action" />
        <Alert display="global" severity="warning-minor" message="Minor with action." actionLabel="Action" />
        <Alert display="global" severity="informational" message="Info with action." actionLabel="Action" />
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <Alert display="global" severity="critical" message="Critical with link + action + carousel." linkLabel="link." actionLabel="Action" carousel={{ currentItem: 1, totalItems: 4 }} />
        <Alert display="global" severity="warning-major" message="Major with link + action + carousel." linkLabel="link." actionLabel="Action" carousel={{ currentItem: 1, totalItems: 4 }} />
        <Alert display="global" severity="warning-minor" message="Minor with link + action + carousel." linkLabel="link." actionLabel="Action" carousel={{ currentItem: 1, totalItems: 4 }} />
        <Alert display="global" severity="informational" message="Info with link + action + carousel." linkLabel="link." actionLabel="Action" carousel={{ currentItem: 1, totalItems: 4 }} />
      </div>
    </div>
  ),
};

/* ——— Inline (contextual) ——— */

export const InlineInformational: Story = {
  args: {
    display: "inline",
    severity: "informational",
    message: "This is informational inline alert text for context.",
    dismissible: true,
  },
};

export const InlineSuccess: Story = {
  args: {
    display: "inline",
    severity: "success",
    message: "Your changes are now saved.",
    dismissible: true,
  },
};

export const InlineWarningMinor: Story = {
  args: {
    display: "inline",
    severity: "warning-minor",
    message: "This action needs additional confirmation.",
    dismissible: true,
  },
};

export const InlineWarningMajor: Story = {
  args: {
    display: "inline",
    severity: "warning-major",
    message: "A blocking issue was found in your request.",
    dismissible: true,
  },
};

export const InlineCriticalWithAction: Story = {
  args: {
    display: "inline",
    severity: "critical",
    message: "Critical alert requires immediate action.",
    actionLabel: "Take action",
    dismissible: false,
  },
};

export const InlineWithLink: Story = {
  args: {
    display: "inline",
    severity: "informational",
    message: "Please review the updated policy.",
    linkLabel: "Learn more",
    dismissible: true,
  },
};

export const InlineDetailedLayout: Story = {
  args: {
    display: "inline",
    severity: "warning-major",
    density: "detailed",
    title: "Policy validation failed",
    message: "You can review the failed checks and update your submission.",
    actionLabel: "Review",
    dismissible: true,
  },
};

export const InlineDetailedWithLinkActionDismiss: Story = {
  args: {
    display: "inline",
    severity: "critical",
    density: "detailed",
    title: "Alert Title",
    message:
      "This is an page-level alert that communicates a critical message. It may include actions.",
    linkLabel: "Learn more",
    actionLabel: "Action",
    dismissible: true,
  },
};

export const InlineVariantMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100 }}>
      <Alert display="inline" severity="informational" message="Informational inline." dismissible />
      <Alert display="inline" severity="success" message="Success inline." dismissible />
      <Alert display="inline" severity="warning-minor" message="Warning minor inline." dismissible />
      <Alert display="inline" severity="warning-major" message="Warning major inline." dismissible />
      <Alert display="inline" severity="critical" message="Critical inline." dismissible />
      <Alert display="inline" severity="informational" message="With link." linkLabel="Learn more" dismissible />
      <Alert display="inline" severity="critical" message="With action." actionLabel="Resolve now" dismissible={false} />
      <Alert
        display="inline"
        severity="warning-major"
        density="detailed"
        title="Expanded alert title"
        message="Detailed inline supports title + body."
        actionLabel="Take action"
        dismissible
      />
    </div>
  ),
};
