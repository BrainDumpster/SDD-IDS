import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlobalAlert } from "./GlobalAlert";
import type { GlobalAlertSeverity } from "./GlobalAlert";

const meta: Meta<typeof GlobalAlert> = {
  title: "IDS/Global Alert",
  component: GlobalAlert,
  argTypes: {
    severity: {
      control: "select",
      options: ["critical", "warning-major", "warning-minor", "informational"],
    },
    dismissible: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof GlobalAlert>;

export const Informational: Story = {
  args: {
    severity: "informational",
    message: "This is an application-level alert that communicates an informational message.",
    dismissible: true,
  },
};

export const WarningMinor: Story = {
  args: {
    severity: "warning-minor",
    message: "This is an application-level alert that communicates a warning (minor) message.",
    dismissible: true,
  },
};

export const WarningMajor: Story = {
  args: {
    severity: "warning-major",
    message: "This is an application-level alert that communicates a warning (major) message.",
    dismissible: true,
  },
};

export const Critical: Story = {
  args: {
    severity: "critical",
    message: "This is an application-level alert that communicates a critical message.",
    dismissible: false,
  },
};

export const WithLink: Story = {
  args: {
    severity: "informational",
    message: "This is an application-level alert that communicates an informational message. It may include a",
    linkLabel: "link to another page.",
    dismissible: true,
  },
};

export const WithAction: Story = {
  args: {
    severity: "warning-major",
    message: "This is an application-level alert that communicates a warning (major) message. It may include actions.",
    actionLabel: "Action",
    dismissible: true,
  },
};

export const WithCarousel: Story = {
  args: {
    severity: "critical",
    message: "This is an application-level alert that communicates a critical message.",
    dismissible: false,
    carousel: {
      currentItem: 1,
      totalItems: 4,
    },
  },
};

/** Host-owned alert list: prev/next update index; message reflects the active item. */
function CarouselInteractiveHost({
  severity = "critical",
  initialMessages,
}: {
  severity?: GlobalAlertSeverity;
  initialMessages: string[];
}) {
  const [items, setItems] = useState<string[]>(() => [...initialMessages]);
  const [index, setIndex] = useState(0);
  const total = Math.max(1, items.length);
  const safeIndex = ((index % total) + total) % total;
  const message = items[safeIndex] ?? "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
      <GlobalAlert
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

export const CarouselInteractive: Story = {
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

export const CarouselInteractiveInformational: Story = {
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

export const VariantMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <GlobalAlert severity="critical" message="This is an application-level alert that communicates a critical message." dismissible={false} />
        <GlobalAlert severity="warning-major" message="This is an application-level alert that communicates a warning (major) message." />
        <GlobalAlert severity="warning-minor" message="This is an application-level alert that communicates a warning (minor) message." />
        <GlobalAlert severity="informational" message="This is an application-level alert that communicates an informational message." />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <GlobalAlert severity="critical" message="This is an application-level alert that communicates a critical message. It may include a" linkLabel="link to another page." dismissible={false} />
        <GlobalAlert severity="warning-major" message="This is an application-level alert that communicates a warning (major) message. It may include a" linkLabel="link to another page." />
        <GlobalAlert severity="warning-minor" message="This is an application-level alert that communicates a warning (minor) message. It may include a" linkLabel="link to another page." />
        <GlobalAlert severity="informational" message="This is an application-level alert that communicates an informational message. It may include a" linkLabel="link to another page." />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <GlobalAlert severity="critical" message="This is an application-level alert that communicates a critical message. It may include actions." actionLabel="Action" />
        <GlobalAlert severity="warning-major" message="This is an application-level alert that communicates a warning (major) message. It may include actions." actionLabel="Action" />
        <GlobalAlert severity="warning-minor" message="This is an application-level alert that communicates a warning (minor) message. It may include actions." actionLabel="Action" />
        <GlobalAlert severity="informational" message="This is an application-level alert that communicates an informational message. It may include actions." actionLabel="Action" />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <GlobalAlert severity="critical" message="This is an application-level alert that communicates a critical message. It may include actions or a" linkLabel="link to another page." actionLabel="Action" carousel={{ currentItem: 1, totalItems: 4 }} />
        <GlobalAlert severity="warning-major" message="This is an application-level alert that communicates a warning (major) message. It may include actions or a" linkLabel="link to another page." actionLabel="Action" carousel={{ currentItem: 1, totalItems: 4 }} />
        <GlobalAlert severity="warning-minor" message="This is an application-level alert that communicates a warning (minor) message. It may include actions or a" linkLabel="link to another page." actionLabel="Action" carousel={{ currentItem: 1, totalItems: 4 }} />
        <GlobalAlert severity="informational" message="This is an application-level alert that communicates an informational message. It may include actions or a" linkLabel="link to another page." actionLabel="Action" carousel={{ currentItem: 1, totalItems: 4 }} />
      </div>
    </div>
  ),
};
