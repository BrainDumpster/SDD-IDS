/**
 * Storybook: IDS Lit Toast from `lib/lit/ids/toast`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/toast/design-spec.md
 * API: lib/react/ids/toast
 * Figma: 42903:139523 (no View Details), 42903:139528 (with View Details)
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/toast/register.js";
import type {
  IdsToastLink,
  IdsToastQueueItem,
  IdsToastType,
} from "@ids/core/toast";
import {
  TOAST_DOCS_DESCRIPTION,
  TOAST_SOURCE_CODE,
} from "./ids-toast.developer-usage";

const MESSAGE =
  "This is a temporary and brief notification following a user action.";

const TYPES: IdsToastType[] = [
  "info",
  "critical",
  "major-warning",
  "minor-warning",
  "success",
];

type ToastStoryArgs = {
  type: IdsToastType;
  message: string;
  duration: number;
  closable: boolean;
  showViewDetails: boolean;
  linkHref?: string;
  onClose?: (detail: { id?: string; reason: string }) => void;
  onTimeout?: (detail: { id?: string }) => void;
};

const meta: Meta<ToastStoryArgs> = {
  title: "Spec Generated/IDS/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: TOAST_DOCS_DESCRIPTION },
      source: { code: TOAST_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    type: { control: "select", options: TYPES },
    message: { control: "text" },
    duration: { control: "number" },
    closable: { control: "boolean" },
    showViewDetails: { control: "boolean", name: "Show View Details" },
    onClose: { action: "onClose" },
    onTimeout: { action: "onTimeout" },
  },
  args: {
    type: "info",
    message: MESSAGE,
    duration: 0,
    closable: true,
    showViewDetails: false,
  },
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

function linkFor(args: ToastStoryArgs): IdsToastLink | undefined {
  if (!args.showViewDetails) return undefined;
  return {
    label: "View Details",
    href: args.linkHref,
    target: args.linkHref ? "_blank" : undefined,
    onClick: () => undefined,
  };
}

function toastItemBindings(args: ToastStoryArgs) {
  return html`
    <ids-toast-item
      type=${args.type}
      message=${args.message}
      .duration=${args.duration}
      .closable=${args.closable}
      .link=${linkFor(args)}
      .onClose=${args.onClose}
      .onTimeout=${args.onTimeout}
    ></ids-toast-item>
  `;
}

/** Spec Accurate Design — Figma info toast without View Details (`42903:139523`). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <div style="width: 1200px; max-width: 100%">${toastItemBindings(args)}</div>
  `,
};

/** Figma examples column — all five types, no View Details (`516px` sample). */
export const AllTypes: Story = {
  name: "All Types",
  render: () => html`
    <div
      style="display: grid; gap: 12px; width: 1200px; max-width: 100%; justify-items: start"
    >
      ${TYPES.map(
        (type) => html`
          <ids-toast-item
            type=${type}
            message=${MESSAGE}
            .duration=${0}
            closable
          ></ids-toast-item>
        `,
      )}
    </div>
  `,
};

/** Figma examples with View Details (`617px` sample / `42903:139528`). */
export const WithViewDetails: Story = {
  name: "With View Details",
  render: () => html`
    <div
      style="display: grid; gap: 12px; width: 1200px; max-width: 100%; justify-items: start"
    >
      ${TYPES.map(
        (type) => html`
          <ids-toast-item
            type=${type}
            message=${MESSAGE}
            .duration=${0}
            closable
            .link=${{
              label: "View Details",
              onClick: () => undefined,
            } as IdsToastLink}
          ></ids-toast-item>
        `,
      )}
    </div>
  `,
};

export const ViewDetailsHref: Story = {
  name: "View Details Href",
  args: {
    type: "info",
    message: MESSAGE,
    duration: 0,
    closable: true,
    showViewDetails: true,
    linkHref: "https://example.com",
  },
  render: (args) => html`
    <div style="width: 1200px; max-width: 100%">${toastItemBindings(args)}</div>
  `,
};

export const NotClosable: Story = {
  name: "Not Closable",
  args: {
    type: "critical",
    message: MESSAGE,
    duration: 0,
    closable: false,
    showViewDetails: false,
  },
  render: (args) => html`
    <div style="width: 1200px; max-width: 100%">${toastItemBindings(args)}</div>
  `,
};

export const AutoDismiss: Story = {
  name: "Auto Dismiss",
  args: {
    type: "success",
    message: "Auto-dismisses after 8s (hover/focus pauses timer).",
    duration: 8000,
    closable: true,
  },
  render: (args) => html`
    <div style="width: 1200px; max-width: 100%">${toastItemBindings(args)}</div>
  `,
};

/** Long message hugs content up to 900px and clamps at 5 lines. */
export const LongMessage: Story = {
  name: "Long Message",
  args: {
    type: "info",
    message:
      "The scheduled backup job could not complete because the connection to the remote storage repository timed out after multiple retry attempts. Verify that the repository credentials are still valid, confirm the network route to the storage endpoint is reachable, and check whether a firewall rule is blocking outbound traffic on the configured port. Once connectivity is restored, retry the job from the backup scheduler or wait for the next scheduled run to execute automatically.",
    duration: 0,
    closable: true,
  },
  render: (args) => html`
    <div
      style="width: 1200px; max-width: 100%; resize: horizontal; overflow: auto; padding: 8px; border: 1px dashed #666"
    >
      ${toastItemBindings(args)}
    </div>
  `,
};

/** Short message — toast hugs narrow content instead of stretching. */
export const HugContent: Story = {
  name: "Hug Content",
  args: {
    type: "success",
    message: "Saved.",
    duration: 0,
    closable: true,
    showViewDetails: true,
  },
  render: (args) => html`
    <div
      style="width: 1200px; max-width: 100%; resize: horizontal; overflow: auto; padding: 8px; border: 1px dashed #666"
    >
      ${toastItemBindings(args)}
    </div>
  `,
};

const DEFAULT_QUEUE: IdsToastQueueItem[] = [
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
];

/** Viewport queue — FIFO, maxVisible 3, position top-right (default). */
export const ViewportQueue: Story = {
  name: "Viewport Queue",
  args: {
    // Storybook args bag — queue lives under a custom key via cast in render.
  } as ToastStoryArgs,
  render: function ViewportQueueRender() {
    const [args, updateArgs] = useArgs();
    const items: IdsToastQueueItem[] =
      (args as { queueItems?: IdsToastQueueItem[] }).queueItems ?? DEFAULT_QUEUE;

    const push = () => {
      const id = `t-${Date.now()}`;
      updateArgs({
        queueItems: [
          ...items,
          {
            id,
            type: TYPES[items.length % TYPES.length],
            message: `Queued toast ${id}`,
            duration: 0,
            closable: true,
          },
        ],
      });
    };

    return html`
      <div style="min-height: 280px">
        <button type="button" style="margin-bottom: 16px" @click=${push}>
          Add toast
        </button>
        <p style="margin-bottom: 8px">
          Queue length: ${items.length} (maxVisible 3)
        </p>
        <ids-toast-viewport
          position="top-right"
          maxvisible="3"
          .items=${items}
          .onItemsChange=${(next: IdsToastQueueItem[]) =>
            updateArgs({ queueItems: next })}
          .onItemClose=${(detail: { id: string; reason: string }) => {
            console.info("onItemClose", detail);
          }}
          .onItemTimeout=${(detail: { id: string }) => {
            console.info("onItemTimeout", detail);
          }}
        ></ids-toast-viewport>
      </div>
    `;
  },
};
