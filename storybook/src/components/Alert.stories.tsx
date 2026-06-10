import "../../../components/ids-theme.css";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";
import type { AlertGlobalSeverity } from "./Alert";

const meta = {
  title: "Spec Generated/IDS/Alert",
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "Unified IDS alert: set **display** to `global` (application banner) or `inline` (contextual slate). Only **inline** supports **success** severity. **Carousel** is only valid when `display=\"global\"`.",
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
    dismissible: { control: "boolean" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const PlaygroundManual: Story = {
  args: {
    display: "global",
    severity: "informational",
    message: "Alert message — use **display** to switch global vs inline.",
    dismissible: true,
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
