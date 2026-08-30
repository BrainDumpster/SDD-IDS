import "../../../components/ids-theme.css";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";
import type { AlertGlobalSeverity } from "./Alert";

const meta = {
  title: "Components/IDS/Alert/Global Alert",
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "IDS global alert (`display=\"global\"`): an application-level banner. **Carousel** is only valid in this mode. `success` severity is **not** supported for global — use inline for success.",
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
      options: ["informational", "warning-minor", "warning-major", "critical"],
      description: "For `display=\"global\"`, omit `success` (invalid).",
    },
    dismissible: { control: "boolean" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

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
        dismissible={undefined}
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
      <div style={{ display: "grid", gap: 16 }}>
        <Alert display="global" severity="critical" message="Critical with carousel (dismiss visible)." carousel={{ currentItem: 1, totalItems: 4 }} />
        <Alert display="global" severity="critical" message="Critical with carousel + link (dismiss visible)." linkLabel="link." carousel={{ currentItem: 1, totalItems: 4 }} />
      </div>
    </div>
  ),
};
