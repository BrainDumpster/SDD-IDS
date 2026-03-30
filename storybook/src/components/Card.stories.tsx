import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Card, type CardMenuOption } from "./Card";
import { Button } from "./Button";
import { Link } from "./Link";

const meta: Meta<typeof Card> = {
  title: "Synapse/Card",
  component: Card,
  argTypes: {
    elevated: { control: "boolean" },
    outlined: { control: "boolean" },
    showIcon: { control: "boolean" },
    showOverFlowMenu: { control: "boolean" },
    showButtons: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/** Optional leading header icon (swap / component affordance) */
function HeaderSwapIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"
      />
    </svg>
  );
}

/** Layout/swap grid icon (Figma-style placeholder) */
function SwapLayoutIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        color: "var(--color-icon-brand-base)",
      }}
    >
      <path
        fill="currentColor"
        d="M4 4h7.5v7.5H4V4zm8.5 0H20v7.5h-7.5V4zM4 12.5h7.5V20H4v-7.5zm8.5 0H20V20h-7.5v-7.5z"
      />
    </svg>
  );
}

/**
 * Body content matching the card template: nested slot slightly lifted from the
 * card body, brand/cyan outline (dark: #4c9fdd; light: Dell blue), success-green
 * emphasis on the key phrase, link uses Link tokens (aligns with border in dark).
 */
function CardSwapPlaceholderBody() {
  return (
    <div
      style={{
        background: "var(--color-background-brand-light)",
        border:
          "var(--border-width-border-1) solid var(--color-border-brand-base)",
        borderRadius: "var(--corner-radius-radius-8)",
        padding: "var(--padding-padding-16)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--padding-padding-12)",
        }}
      >
        <SwapLayoutIcon />
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              marginBottom: "var(--padding-padding-8)",
              fontSize: "var(--font-size-body-1)",
              fontWeight: 600,
              lineHeight: "var(--font-line-height-line-height-24)",
              color: "var(--color-text-neutral-strong)",
            }}
          >
            Swap content
          </h2>
          <p
            style={{
              margin: 0,
              marginBottom: "var(--padding-padding-12)",
              fontSize: "var(--font-size-body-2)",
              lineHeight: "var(--font-line-height-line-height-20)",
              color: "var(--color-text-neutral)",
            }}
          >
            Customize your content by swapping this component with{" "}
            <strong style={{ fontWeight: 600, color: "var(--color-text-tag-success)" }}>
              your local component or one of the defined templates.
            </strong>{" "}
            Delete it if not needed. Use auto layout in your local component so
            that it fits the container.
          </p>
          <Link href="#" onClick={(e) => e.preventDefault()}>
            Learn how to swap component.
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Basic: Story = {
  args: {
    title: "Card Title",
    children: <CardSwapPlaceholderBody />,
  },
};

export const Elevated: Story = {
  args: {
    title: "Elevated Card",
    elevated: true,
    children: <CardSwapPlaceholderBody />,
  },
};

export const Outlined: Story = {
  args: {
    title: "Outlined Card",
    outlined: true,
    children: <CardSwapPlaceholderBody />,
  },
};

export const WithFooter: Story = {
  args: {
    title: "Card with Footer",
    outlined: true,
    showButtons: true,
    children: <CardSwapPlaceholderBody />,
    footer: (
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="tertiary" size="sm">
          Cancel
        </Button>
        <Button variant="tertiary" size="sm">
          Save
        </Button>
      </div>
    ),
  },
};

export const NoTitle: Story = {
  args: {
    outlined: true,
    children: <CardSwapPlaceholderBody />,
  },
};

/** Header and footer are optional; section dividers appear only when those regions exist */
export const OptionalHeaderFooter: Story = {
  args: {
    title: "Card Title",
    outlined: true,
    showButtons: true,
    children: <CardSwapPlaceholderBody />,
    footer: <Button size="sm">Button</Button>,
  },
};

/** Footer actions using a secondary (outline-style) button */
export const WithFooterSecondaryButton: Story = {
  args: {
    title: "Card Title",
    outlined: true,
    showButtons: true,
    children: <CardSwapPlaceholderBody />,
    footer: (
      <Button variant="secondary" size="sm">
        Secondary action
      </Button>
    ),
  },
};

export const CustomHeaderSlot: Story = {
  args: {
    header: (
      <span style={{ fontSize: 18, fontWeight: 500 }}>
        Custom header node
      </span>
    ),
    outlined: true,
    children: <CardSwapPlaceholderBody />,
  },
};

export const Gallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card title="Default">
        <CardSwapPlaceholderBody />
      </Card>
      <Card title="Elevated" elevated>
        <CardSwapPlaceholderBody />
      </Card>
      <Card title="Outlined" outlined>
        <CardSwapPlaceholderBody />
      </Card>
      <Card
        title="Both"
        elevated
        outlined
        showButtons
        footer={
          <span style={{ fontSize: 12, color: "var(--color-text-disabled)" }}>
            Last updated: today
          </span>
        }
      >
        <CardSwapPlaceholderBody />
      </Card>
    </div>
  ),
};

const sixPlaceholderOptions: CardMenuOption[] = [
  { value: "opt-1", label: "Option" },
  { value: "opt-2", label: "Option" },
  { value: "opt-3", label: "Option" },
  { value: "opt-4", label: "Option" },
  { value: "opt-5", label: "Option" },
  { value: "opt-6", label: "Option" },
];

/**
 * Matches template: optional header icon + title, kebab menu (per-card options),
 * swap body, two tertiary footer buttons. Overlay height stays within the card.
 */
export const WithHeaderOptionsMenu: Story = {
  render: function WithHeaderOptionsMenuRender() {
    const [last, setLast] = useState<string>("—");
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--padding-padding-12)",
          maxWidth: 480,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "var(--font-size-body-2)",
            color: "var(--color-text-neutral)",
          }}
        >
          Last <code>onOptionSelected</code> value:{" "}
          <strong style={{ color: "var(--color-text-neutral-strong)" }}>
            {last}
          </strong>
        </p>
        <Card
          title="Card Title"
          headerIcon={<HeaderSwapIcon />}
          showIcon
          outlined
          showOverFlowMenu
          menuOptions={sixPlaceholderOptions}
          onOptionSelected={(value) => setLast(value)}
          showButtons
          footer={
            <div
              style={{
                display: "flex",
                gap: "var(--padding-padding-8)",
                justifyContent: "flex-start",
              }}
            >
              <Button variant="tertiary" size="sm">
                Button
              </Button>
              <Button variant="tertiary" size="sm">
                Button
              </Button>
            </div>
          }
        >
          <CardSwapPlaceholderBody />
        </Card>
      </div>
    );
  },
};

/** Each card on a page supplies its own `menuOptions`; selections are independent. */
export const MultipleCardsDistinctMenus: Story = {
  render: function MultipleCardsRender() {
    const [a, setA] = useState<string>("—");
    const [b, setB] = useState<string>("—");
    const menuA: CardMenuOption[] = [
      { value: "card-a-open", label: "Open" },
      { value: "card-a-edit", label: "Edit" },
      { value: "card-a-delete", label: "Remove" },
    ];
    const menuB: CardMenuOption[] = [
      { value: "card-b-share", label: "Share" },
      { value: "card-b-copy", label: "Duplicate" },
    ];
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--padding-padding-16)",
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "var(--font-size-body-3)",
              color: "var(--color-text-neutral)",
            }}
          >
            Card A: {a}
          </p>
          <Card
            title="Card A"
            outlined
            showOverFlowMenu
            menuOptions={menuA}
            onOptionSelected={setA}
          >
            <p style={{ margin: 0 }}>Different menu than Card B.</p>
          </Card>
        </div>
        <div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "var(--font-size-body-3)",
              color: "var(--color-text-neutral)",
            }}
          >
            Card B: {b}
          </p>
          <Card
            title="Card B"
            outlined
            showOverFlowMenu
            menuOptions={menuB}
            onOptionSelected={setB}
          >
            <p style={{ margin: 0 }}>Fewer items in the overflow list.</p>
          </Card>
        </div>
      </div>
    );
  },
};
