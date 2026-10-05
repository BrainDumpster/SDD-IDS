/**
 * Storybook: design-spec–generated Toast from `lib/react/ids/toast`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy:
 *   ToastViewport → ToastItem → Content (IconContainer + Message) + ActionContainer
 *     (ViewDetailsAction? + CloseAction?)
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/toast/design-spec.md
 */
import React, { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  TOAST_DOCS_DESCRIPTION,
  TOAST_SOURCE_CODE,
} from "./ids-toast.developer-usage";
import {
  IdsToastItem,
  IdsToastViewport,
  type IdsToastItemProps,
  type IdsToastQueueItem,
  type IdsToastType,
} from "@ids/react/toast";

const DESIGN_SPEC_PATH = "components/ids/toast/design-spec.md";

const MESSAGE =
  "This is a temporary and brief notification following a user action.";

const TYPES: IdsToastType[] = [
  "info",
  "critical",
  "major-warning",
  "minor-warning",
  "success",
];

type ToastStoryArgs = IdsToastItemProps & {
  /** Story-only control: toggles the View Details action (`link` prop). */
  showViewDetails?: boolean;
};

const DEFAULT_LINK = { label: "View Details", onClick: () => undefined };

function toastArgs(args: ToastStoryArgs): IdsToastItemProps {
  const { showViewDetails, ...rest } = args;
  return {
    ...rest,
    link: showViewDetails ? (rest.link ?? DEFAULT_LINK) : undefined,
  };
}

const meta: Meta<ToastStoryArgs> = {
  tags: ["autodocs"],
  title: "Components/IDS/Toast",
  component: IdsToastItem,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: TOAST_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: TOAST_SOURCE_CODE,
      },
    },
  },
  args: {
    type: "info",
    message: MESSAGE,
    duration: 0,
    closable: true,
    showViewDetails: false,
  },
  argTypes: {
    type: {
      control: "select",
      options: TYPES,
    },
    message: { control: "text" },
    duration: { control: "number" },
    closable: { control: "boolean" },
    showViewDetails: {
      control: "boolean",
      name: "Show View Details",
    },
    onClose: { action: "onClose" },
    onTimeout: { action: "onTimeout" },
  },
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

/** Spec Accurate Design — Figma info toast without View Details (`42903:139523`). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    type: "info",
    message: MESSAGE,
    duration: 0,
    closable: true,
  },
  render: (args) => (
    <div style={{ width: 1200, maxWidth: "100%" }}>
      <IdsToastItem {...toastArgs(args)} />
    </div>
  ),
};

/** Figma examples column — all five types, no View Details (`516px` sample). */
export const AllTypes: Story = {
  name: "All Types",
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 1200, maxWidth: "100%", justifyItems: "start" }}>
      {TYPES.map((type) => (
        <IdsToastItem
          key={type}
          type={type}
          message={MESSAGE}
          duration={0}
          closable
        />
      ))}
    </div>
  ),
};

/** Figma examples with View Details (`617px` sample). */
export const WithViewDetails: Story = {
  name: "With View Details",
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 1200, maxWidth: "100%", justifyItems: "start" }}>
      {TYPES.map((type) => (
        <IdsToastItem
          key={type}
          type={type}
          message={MESSAGE}
          duration={0}
          closable
          link={{ label: "View Details", onClick: () => undefined }}
        />
      ))}
    </div>
  ),
};

export const ViewDetailsHref: Story = {
  name: "View Details Href",
  args: {
    type: "info",
    message: MESSAGE,
    duration: 0,
    closable: true,
    showViewDetails: true,
    link: {
      label: "View Details",
      href: "https://example.com",
      target: "_blank",
    },
  },
  render: (args) => (
    <div style={{ width: 1200, maxWidth: "100%" }}>
      <IdsToastItem {...toastArgs(args)} />
    </div>
  ),
};

export const NotClosable: Story = {
  name: "Not Closable",
  args: {
    type: "critical",
    message: MESSAGE,
    duration: 0,
    closable: false,
  },
  render: (args) => (
    <div style={{ width: 1200, maxWidth: "100%" }}>
      <IdsToastItem {...toastArgs(args)} />
    </div>
  ),
};

export const AutoDismiss: Story = {
  name: "Auto Dismiss",
  args: {
    type: "success",
    message: "Auto-dismisses after 8s (hover/focus pauses timer).",
    duration: 8000,
    closable: true,
  },
  render: (args) => (
    <div style={{ width: 1200, maxWidth: "100%" }}>
      <IdsToastItem {...toastArgs(args)} />
    </div>
  ),
};

/** Long message hugs content up to 900px and clamps at 5 lines — shrink the frame to verify responsiveness. */
export const LongMessage: Story = {
  name: "Long Message",
  args: {
    type: "info",
    message:
      "The scheduled backup job could not complete because the connection to the remote storage repository timed out after multiple retry attempts. Verify that the repository credentials are still valid, confirm the network route to the storage endpoint is reachable, and check whether a firewall rule is blocking outbound traffic on the configured port. Once connectivity is restored, retry the job from the backup scheduler or wait for the next scheduled run to execute automatically.",
    duration: 0,
    closable: true,
  },
  render: (args) => (
    <div
      style={{
        width: 1200,
        maxWidth: "100%",
        resize: "horizontal",
        overflow: "auto",
        padding: 8,
        border: "1px dashed #666",
      }}
    >
      <IdsToastItem {...toastArgs(args)} />
    </div>
  ),
};

/** Short message — demonstrates the toast hugging narrow content instead of stretching. */
export const HugContent: Story = {
  name: "Hug Content",
  args: {
    type: "success",
    message: "Saved.",
    duration: 0,
    closable: true,
    showViewDetails: true,
  },
  render: (args) => (
    <div
      style={{
        width: 1200,
        maxWidth: "100%",
        resize: "horizontal",
        overflow: "auto",
        padding: 8,
        border: "1px dashed #666",
      }}
    >
      <IdsToastItem {...toastArgs(args)} />
    </div>
  ),
};

/** Viewport queue — FIFO, maxVisible 3, position top-right (default). */
export const ViewportQueue: Story = {
  name: "Viewport Queue",
  render: function ViewportQueueStory() {
    const [items, setItems] = useState<IdsToastQueueItem[]>([
      {
        id: "t1",
        type: "info",
        message: "First visible toast",
        duration: 0,
        closable: true,
      },
      {
        id: "t2",
        type: "success",
        message: "Second visible toast",
        duration: 0,
        closable: true,
        link: { label: "View Details", onClick: () => undefined },
      },
      {
        id: "t3",
        type: "critical",
        message: "Third visible toast",
        duration: 0,
        closable: true,
      },
      {
        id: "t4",
        type: "major-warning",
        message: "Queued until a slot frees",
        duration: 0,
        closable: true,
      },
    ]);

    const push = useCallback(() => {
      const id = `t-${Date.now()}`;
      setItems((prev) => [
        ...prev,
        {
          id,
          type: TYPES[prev.length % TYPES.length],
          message: `Queued toast ${id}`,
          duration: 0,
          closable: true,
        },
      ]);
    }, []);

    return (
      <div style={{ minHeight: 280 }}>
        <button type="button" onClick={push} style={{ marginBottom: 16 }}>
          Add toast
        </button>
        <p style={{ marginBottom: 8 }}>
          Queue length: {items.length} (maxVisible 3)
        </p>
        <IdsToastViewport
          position="top-right"
          maxVisible={3}
          items={items}
          onItemsChange={setItems}
        />
      </div>
    );
  },
};
