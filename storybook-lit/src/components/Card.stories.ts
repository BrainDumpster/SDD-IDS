/**
 * Storybook: IDS Lit Card from `lib/lit/ids/card`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/card/design-spec.md
 * API: lib/react/ids/card · storybook/src/components/lib-generated/Card.stories.tsx
 *
 * Live Figma verified 2026-11-05: Card-Main `8381:14051`, primary `8381:14245`,
 * Content `14978:28002`, Text `15718:219736`.
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/card/register.js";
import type {
  IdsCardAction,
  IdsCardKeyValueItem,
  IdsCardMenuOption,
} from "@ids/core/card";
import {
  CARD_DOCS_DESCRIPTION,
  CARD_SOURCE_CODE,
} from "./ids-card.developer-usage";

const SPEC_MENU_OPTIONS: IdsCardMenuOption[] = [
  { value: "edit", label: "Edit" },
  { value: "duplicate", label: "Duplicate" },
  { value: "delete", label: "Delete" },
];

const SPEC_ACTIONS: IdsCardAction[] = [
  { id: "a1", label: "Action" },
  { id: "a2", label: "Action" },
];

const FIGMA_TEXT_LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, vulputate dis amet sed ullamcorper massa lorem in. Semper eget nulla ac quis duis mi elementum tristique. Volutpat tincidunt ultrices nulla ut arcu. Ultrices aliquam cursus magna vitae. Ornare interdum a arcu turpis maecenas risus.";

const FIGMA_KEY_VALUE_ITEMS: IdsCardKeyValueItem[] = [
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
];

const cardHost = (content: unknown) => html`
  <div style="width: 430px; min-height: 313px; box-sizing: border-box">
    ${content}
  </div>
`;

const meta: Meta = {
  title: "Spec Generated/IDS/Card",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: { component: CARD_DOCS_DESCRIPTION },
      source: { code: CARD_SOURCE_CODE, language: "html" },
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
  },
  args: {
    title: "Card Title",
    secondaryTitle: "",
    headerMeta: "",
    showButtons: true,
    showOverflowMenu: true,
    showDivider: true,
    size: "span-1",
  },
};

export default meta;
type Story = StoryObj;

/** Figma `8381:14245` — Buttons=Yes, Overflow=Yes + Content Type=Text. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) =>
    cardHost(html`
      <ids-card
        .title=${args.title as string}
        .secondaryTitle=${(args.secondaryTitle as string) || ""}
        .headerMeta=${(args.headerMeta as string) || ""}
        ?showbuttons=${Boolean(args.showButtons)}
        ?showoverflowmenu=${Boolean(args.showOverflowMenu)}
        .showDivider=${args.showDivider !== false}
        size=${args.size as string}
        .menuOptions=${SPEC_MENU_OPTIONS}
        .actions=${SPEC_ACTIONS}
      >
        <ids-card-text-content sectiontitle="Section Title">
          ${FIGMA_TEXT_LOREM}
        </ids-card-text-content>
      </ids-card>
    `),
};

/** Dashboard-Element-Card — Body 1 `Title | Secondary` + headerMeta. */
export const WithSecondaryTitle: Story = {
  name: "With Secondary Title",
  render: () =>
    cardHost(html`
      <ids-card
        card-title="Widget Title"
        secondarytitle="Secondary Title"
        headermeta="Last 24 Hours"
        showbuttons
        showoverflowmenu
        .menuOptions=${SPEC_MENU_OPTIONS}
        .actions=${[{ id: "a1", label: "Link" } satisfies IdsCardAction]}
      >
        <ids-card-text-content sectiontitle="Section Title">
          ${FIGMA_TEXT_LOREM}
        </ids-card-text-content>
      </ids-card>
    `),
};

/** `showDivider=false` — no CardBody top/bottom seams. */
export const WithoutDividers: Story = {
  name: "showDivider false",
  render: () =>
    cardHost(html`
      <ids-card
        card-title="Card Title"
        showbuttons
        showoverflowmenu
        .showDivider=${false}
        .menuOptions=${SPEC_MENU_OPTIONS}
        .actions=${SPEC_ACTIONS}
      >
        <ids-card-text-content sectiontitle="Section Title">
          ${FIGMA_TEXT_LOREM}
        </ids-card-text-content>
      </ids-card>
    `),
};

/** Figma Card-Main `8381:14051` — 2×2 buttons × overflow matrix. */
export const FigmaCardMainMatrix: Story = {
  name: "Figma Card-Main matrix",
  parameters: { layout: "padded" },
  render: () => html`
    <div
      style="display: grid; grid-template-columns: 430px 430px; gap: 24px; align-items: start"
    >
      <ids-card
        card-title="Card Title"
        showbuttons
        .actions=${SPEC_ACTIONS}
      >
        <ids-card-text-content sectiontitle="Section Title"
          >${FIGMA_TEXT_LOREM}</ids-card-text-content
        >
      </ids-card>
      <ids-card
        card-title="Card Title"
        showbuttons
        showoverflowmenu
        .menuOptions=${SPEC_MENU_OPTIONS}
        .actions=${SPEC_ACTIONS}
      >
        <ids-card-text-content sectiontitle="Section Title"
          >${FIGMA_TEXT_LOREM}</ids-card-text-content
        >
      </ids-card>
      <ids-card card-title="Card Title">
        <ids-card-text-content sectiontitle="Section Title"
          >${FIGMA_TEXT_LOREM}</ids-card-text-content
        >
      </ids-card>
      <ids-card
        card-title="Card Title"
        showoverflowmenu
        .menuOptions=${SPEC_MENU_OPTIONS}
      >
        <ids-card-text-content sectiontitle="Section Title"
          >${FIGMA_TEXT_LOREM}</ids-card-text-content
        >
      </ids-card>
    </div>
  `,
};

/** Content Type=Text — `.Card-Element-Content` `15718:219736`. */
export const ContentTypeText: Story = {
  name: "Content Type Text",
  render: () =>
    cardHost(html`
      <ids-card card-title="Card Title">
        <ids-card-text-content sectiontitle="Section Title">
          ${FIGMA_TEXT_LOREM}
        </ids-card-text-content>
      </ids-card>
    `),
};

/** Content Type=Key Value Pair — `15718:220110`. */
export const ContentTypeKeyValue: Story = {
  name: "Content Type Key Value Pair",
  render: () =>
    cardHost(html`
      <ids-card card-title="Card Title">
        <ids-card-key-value-content
          .items=${FIGMA_KEY_VALUE_ITEMS}
        ></ids-card-key-value-content>
      </ids-card>
    `),
};

/** Full chrome + Key Value body. */
export const SpecAccurateWithKeyValue: Story = {
  name: "Spec Accurate with Key Value body",
  render: () =>
    cardHost(html`
      <ids-card
        card-title="Card Title"
        showbuttons
        showoverflowmenu
        .menuOptions=${SPEC_MENU_OPTIONS}
        .actions=${SPEC_ACTIONS}
      >
        <ids-card-key-value-content
          .items=${FIGMA_KEY_VALUE_ITEMS}
        ></ids-card-key-value-content>
      </ids-card>
    `),
};

/** Optional CardAdditionalFilter before kebab. */
export const WithAdditionalFilter: Story = {
  name: "With additional filter",
  render: () =>
    cardHost(html`
      <ids-card
        card-title="Card Title"
        showbuttons
        showoverflowmenu
        .menuOptions=${SPEC_MENU_OPTIONS}
        .actions=${SPEC_ACTIONS}
      >
        <select
          slot="additional-filter"
          aria-label="Additional filter"
          style="font-family: inherit; font-size: var(--font-size-body-2); line-height: var(--font-line-height-line-height-20); color: var(--color-text-gray-neutral-strong); border: 1px solid var(--color-border-gray-neutral-base); border-radius: var(--corner-radius-radius-2); padding: var(--padding-padding-8) var(--padding-padding-16); background: var(--color-background-surface-secondary)"
        >
          <option value="all" selected>All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <ids-card-text-content sectiontitle="Section Title">
          ${FIGMA_TEXT_LOREM}
        </ids-card-text-content>
      </ids-card>
    `),
};
