/**
 * Storybook: design-spec–generated Card from `lib/react/ids/card`
 *
 * Anatomy:
 *   IdsCard → Header (Title cluster + AdditionalFilter? + kebab?) → Body → Footer?
 *
 * Composition: lib `IdsIcon` (kebab `overflow-menu-dots` in `var(--color-icon-brand-base)`;
 * key-value icons), `IdsButton` tertiary for footer actions.
 * Theme: components/ids-theme.css
 * Spec: components/ids/card/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsCard,
  IdsCardKeyValueContent,
  IdsCardTextContent,
  type IdsCardAction,
  type IdsCardMenuOption,
  type IdsCardProps,
} from "../../../../lib/react/ids/card";

const DESIGN_SPEC_PATH = "components/ids/card/design-spec.md";

/** Spec Accurate Design story defaults — design-spec Composition & API. */
const SPEC_MENU_OPTIONS: IdsCardMenuOption[] = [
  { value: "edit", label: "Edit" },
  { value: "duplicate", label: "Duplicate" },
  { value: "delete", label: "Delete" },
];

const SPEC_ACTIONS: IdsCardAction[] = [
  { id: "a1", label: "Action" },
  { id: "a2", label: "Action" },
];

/** Figma Content Type=Text sample copy (`15718:219736`). */
const FIGMA_TEXT_BODY = (
  <IdsCardTextContent sectionTitle="Section Title">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, vulputate dis
    amet sed ullamcorper massa lorem in. Semper eget nulla ac quis duis mi
    elementum tristique. Volutpat tincidunt ultrices nulla ut arcu. Ultrices
    aliquam cursus magna vitae. Ornare interdum a arcu turpis maecenas risus.
  </IdsCardTextContent>
);

/** Figma Content Type=Key Value Pair sample rows (`15718:220110`). */
const FIGMA_KEY_VALUE_BODY = (
  <IdsCardKeyValueContent
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

const cardHostStyle: React.CSSProperties = {
  width: 430,
  minHeight: 313,
  boxSizing: "border-box",
};

const meta: Meta<IdsCardProps> = {
  title: "Components/IDS/Card",
  component: IdsCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          `React IDS Card from \`${DESIGN_SPEC_PATH}\`. ` +
          "Anatomy: Card → CardHeader → CardBody → CardFooter?. " +
          "Border & divider contract: `--card-border-color` cascade + `showDivider`. " +
          "Composes lib `IdsIcon` (kebab `overflow-menu-dots` in `var(--color-icon-brand-base)`; key-value icons) and `IdsButton` tertiary for footer actions. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    secondaryTitle: { control: "text" },
    headerMeta: { control: "text" },
    showButtons: { control: "boolean" },
    showOverflowMenu: { control: "boolean" },
    showDivider: { control: "boolean" },
    size: {
      control: "select",
      options: ["span-1", "span-2", "span-3"],
    },
    onOptionSelected: { action: "onOptionSelected" },
  },
};

export default meta;
type Story = StoryObj<IdsCardProps>;

/**
 * Figma `8381:14245` — Show Buttons=Yes, Show Overflow menu=Yes.
 * Body = Content Type=Text (`15718:219736`) per Spec Accurate Design defaults.
 */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  decorators: [
    (StoryFn) => (
      <div style={cardHostStyle}>
        <StoryFn />
      </div>
    ),
  ],
  args: {
    title: "Card Title",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    showDivider: true,
    actions: SPEC_ACTIONS,
    children: FIGMA_TEXT_BODY,
    size: "span-1",
  },
};

/** Dashboard-Element-Card title pattern — Body 1 `Title | Secondary` + headerMeta. */
export const WithSecondaryTitle: Story = {
  name: "With Secondary Title",
  decorators: [
    (StoryFn) => (
      <div style={cardHostStyle}>
        <StoryFn />
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

/** `showDivider=false` — no CardBody top/bottom seams. */
export const WithoutDividers: Story = {
  name: "showDivider false",
  decorators: [
    (StoryFn) => (
      <div style={cardHostStyle}>
        <StoryFn />
      </div>
    ),
  ],
  args: {
    title: "Card Title",
    showOverflowMenu: true,
    menuOptions: SPEC_MENU_OPTIONS,
    showButtons: true,
    showDivider: false,
    actions: SPEC_ACTIONS,
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
      <IdsCard
        title="Card Title"
        showButtons
        actions={SPEC_ACTIONS}
        showOverflowMenu={false}
      >
        {FIGMA_TEXT_BODY}
      </IdsCard>
      <IdsCard
        title="Card Title"
        showButtons
        actions={SPEC_ACTIONS}
        showOverflowMenu
        menuOptions={SPEC_MENU_OPTIONS}
      >
        {FIGMA_TEXT_BODY}
      </IdsCard>
      <IdsCard title="Card Title" showButtons={false} showOverflowMenu={false}>
        {FIGMA_TEXT_BODY}
      </IdsCard>
      <IdsCard
        title="Card Title"
        showButtons={false}
        showOverflowMenu
        menuOptions={SPEC_MENU_OPTIONS}
      >
        {FIGMA_TEXT_BODY}
      </IdsCard>
    </div>
  ),
};

/** Content Type=Text only — `.Card-Element-Content` `15718:219736`. */
export const ContentTypeText: Story = {
  name: "Content Type Text",
  decorators: [
    (StoryFn) => (
      <div style={{ width: 430 }}>
        <StoryFn />
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
    (StoryFn) => (
      <div style={{ width: 430 }}>
        <StoryFn />
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
    (StoryFn) => (
      <div style={cardHostStyle}>
        <StoryFn />
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
    (StoryFn) => (
      <div style={cardHostStyle}>
        <StoryFn />
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
          color: "var(--color-text-gray-neutral-strong)",
          border: "1px solid var(--color-border-gray-neutral-base)",
          borderRadius: "var(--corner-radius-radius-2)",
          padding: "var(--padding-padding-8) var(--padding-padding-16)",
          background: "var(--color-background-surface-secondary)",
        }}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>
    ),
  },
};
