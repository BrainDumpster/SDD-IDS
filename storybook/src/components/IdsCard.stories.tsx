import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardKeyValueContent,
  CardTextContent,
  type CardAction,
  type CardMenuOption,
} from "./Card";

const DESIGN_SPEC_PATH = "components/ids/card/design-spec.md";

/** Spec Accurate Design story defaults — design-spec Composition & API. */
const SPEC_MENU_OPTIONS: CardMenuOption[] = [
  { value: "edit", label: "Edit" },
  { value: "duplicate", label: "Duplicate" },
  { value: "delete", label: "Delete" },
];

const SPEC_ACTIONS: CardAction[] = [
  { id: "a1", label: "Action" },
  { id: "a2", label: "Action" },
];

/** Figma Content Type=Text sample copy (`15718:219736`). */
const FIGMA_TEXT_BODY = (
  <CardTextContent sectionTitle="Section Title">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, vulputate dis
    amet sed ullamcorper massa lorem in. Semper eget nulla ac quis duis mi
    elementum tristique. Volutpat tincidunt ultrices nulla ut arcu. Ultrices
    aliquam cursus magna vitae. Ornare interdum a arcu turpis maecenas risus.
  </CardTextContent>
);

/** Figma Content Type=Key Value Pair sample rows (`15718:220110`). */
const FIGMA_KEY_VALUE_BODY = (
  <CardKeyValueContent
    items={[
      { id: "1", label: "Label", value: "Single line content" },
      { id: "2", label: "Label", value: "Single line content" },
      {
        id: "3",
        label: "Label",
        value: "Single line content",
        iconSlug: "folder-closed",
      },
      {
        id: "4",
        label: "Label",
        value: "Single line content",
        iconSlug: "folder-closed",
      },
      {
        id: "5",
        label: "Label",
        value:
          "Some really long description that takes more than one or two lines.",
      },
    ]}
  />
);

const cardHostStyle = {
  width: 430,
  minHeight: 313,
  boxSizing: "border-box" as const,
};

const meta: Meta<typeof Card> = {
  title: "Spec Generated/IDS/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven IDS Card. Source: \`${DESIGN_SPEC_PATH}\`.`,
          "Figma `Card-Main` variants: Show Buttons × Show Overflow menu.",
          "CardBody fill is `var(--color-background-surface-2)` (Figma Card Content `14978:28002`) — not the pale-blue `.SwapContent` placeholder (`brand-lighter`).",
          "Body uses Content Type templates (Text / Key Value Pair) — not the design-time Swap placeholder.",
          "Kebab opens a per-card Dropdown via `menuOptions`.",
        ].join(" "),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * Figma `8381:14245` — Show Buttons=Yes, Show Overflow menu=Yes.
 * Body = Content Type=Text (`15718:219736`) per Spec Accurate Design defaults.
 */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  decorators: [
    (Story) => (
      <div style={cardHostStyle}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Card Title",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    actions: SPEC_ACTIONS,
    children: FIGMA_TEXT_BODY,
    size: "span-1",
  },
};

/** Dashboard-Element-Card title pattern — Body 1 `Title | Secondary` + headerMeta. */
export const WithSecondaryTitle: Story = {
  name: "With Secondary Title",
  decorators: [
    (Story) => (
      <div style={cardHostStyle}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Widget Title",
    secondaryTitle: "Secondary Title",
    headerMeta: "Last 24 Hours",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    actions: [{ id: "a1", label: "Link" }],
    children: FIGMA_TEXT_BODY,
  },
};

/**
 * Figma `Card-Main` board `8381:14051` — all four axis combinations.
 * Layout mirrors the 2×2 matrix (footer × overflow).
 */
export const FigmaCardMainMatrix: Story = {
  name: "Figma Card-Main matrix",
  parameters: { layout: "padded" },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "430px 430px",
        gap: 24,
        alignItems: "start",
      }}
    >
      {/* Show Buttons=Yes, Show Overflow menu=No — `8381:14305` */}
      <Card
        title="Card Title"
        showButtons
        actions={SPEC_ACTIONS}
        showOverflowMenu={false}
      >
        {FIGMA_TEXT_BODY}
      </Card>
      {/* Show Buttons=Yes, Show Overflow menu=Yes — `8381:14245` */}
      <Card
        title="Card Title"
        showButtons
        actions={SPEC_ACTIONS}
        showOverflowMenu
        menuOptions={SPEC_MENU_OPTIONS}
      >
        {FIGMA_TEXT_BODY}
      </Card>
      {/* Show Buttons=No, Show Overflow menu=No — `15718:197994` */}
      <Card title="Card Title" showButtons={false} showOverflowMenu={false}>
        {FIGMA_TEXT_BODY}
      </Card>
      {/* Show Buttons=No, Show Overflow menu=Yes — `15718:197984` */}
      <Card
        title="Card Title"
        showButtons={false}
        showOverflowMenu
        menuOptions={SPEC_MENU_OPTIONS}
      >
        {FIGMA_TEXT_BODY}
      </Card>
    </div>
  ),
};

/** Content Type=Text only — `.Card-Element-Content` `15718:219736`. */
export const ContentTypeText: Story = {
  name: "Content Type Text",
  decorators: [
    (Story) => (
      <div style={{ width: 430 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Card Title",
    showButtons: false,
    showOverflowMenu: false,
    children: FIGMA_TEXT_BODY,
  },
};

/** Content Type=Key Value Pair — `.Card-Element-Content` `15718:220110`. */
export const ContentTypeKeyValue: Story = {
  name: "Content Type Key Value Pair",
  decorators: [
    (Story) => (
      <div style={{ width: 430 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Card Title",
    showButtons: false,
    showOverflowMenu: false,
    children: FIGMA_KEY_VALUE_BODY,
  },
};

/** Full chrome + Key Value body. */
export const SpecAccurateWithKeyValue: Story = {
  name: "Spec Accurate with Key Value body",
  decorators: [
    (Story) => (
      <div style={cardHostStyle}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Card Title",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    actions: SPEC_ACTIONS,
    children: FIGMA_KEY_VALUE_BODY,
  },
};

/**
 * Optional `CardAdditionalFilter` before kebab — intake composition.
 * Uses a compact select stand-in; production may pass any IDS Dropdown.
 */
export const WithAdditionalFilter: Story = {
  name: "With additional filter",
  decorators: [
    (Story) => (
      <div style={cardHostStyle}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Card Title",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    actions: SPEC_ACTIONS,
    children: FIGMA_TEXT_BODY,
    additionalFilter: (
      <select
        aria-label="Additional filter"
        defaultValue="all"
        style={{
          fontFamily: "inherit",
          fontSize: "var(--font-size-body-2)",
          lineHeight: "var(--font-line-height-line-height-20)",
          color: "var(--color-text-neutral-strong)",
          border: "1px solid var(--color-border-accessible)",
          borderRadius: "var(--corner-radius-radius-2)",
          padding: "var(--padding-padding-8) var(--padding-padding-16)",
          background: "var(--color-background-surface-2)",
        }}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>
    ),
  },
};
