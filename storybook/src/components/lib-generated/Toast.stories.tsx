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
  IdsToastItem,
  IdsToastViewport,
  type IdsToastItemProps,
  type IdsToastQueueItem,
  type IdsToastType,
} from "../../../../lib/react/ids/toast";

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

const meta: Meta<IdsToastItemProps> = {
  title: "Lib Generated/IDS/Toast",
  component: IdsToastItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          `React IDS Toast from \`${DESIGN_SPEC_PATH}\`. ` +
          "Anatomy: ToastViewport → ToastItem → Content (IconContainer + Message) + " +
          "ActionContainer (ViewDetailsAction? + CloseAction?). " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
      },
    },
  },
  args: {
    type: "info",
    message: MESSAGE,
    duration: 0,
    closable: true,
  },
  argTypes: {
    type: {
      control: "select",
      options: TYPES,
    },
    message: { control: "text" },
    duration: { control: "number" },
    closable: { control: "boolean" },
    onClose: { action: "onClose" },
    onTimeout: { action: "onTimeout" },
  },
};

export default meta;
type Story = StoryObj<IdsToastItemProps>;

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
    <div style={{ maxWidth: 516 }}>
      <IdsToastItem {...args} />
    </div>
  ),
};

/** Figma examples column — all five types, no View Details (`516px` sample). */
export const AllTypes: Story = {
  name: "All Types",
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 516 }}>
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
    <div style={{ display: "grid", gap: 12, maxWidth: 617 }}>
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
    link: {
      label: "View Details",
      href: "https://example.com",
      target: "_blank",
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 617 }}>
      <IdsToastItem {...args} />
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
    <div style={{ maxWidth: 516 }}>
      <IdsToastItem {...args} />
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
    <div style={{ maxWidth: 516 }}>
      <IdsToastItem {...args} />
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
