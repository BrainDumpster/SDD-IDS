/**
 * Storybook: design-spec–generated Dropdown Button from `lib/react/ids/dropdown-button`
 *
 * Anatomy (deterministic):
 *   IdsDropdownButton (`dropdown`)
 *     IdsDropdownTrigger (`trigger-slot`) — button | div | icon | any
 *     IdsDropdownMenu (`dropdown-menu`) — shared combo-box popup styling
 *       IdsDropdownMenuItem* (`dropdown-menu-item`)
 *         IdsDropdownMenu? — nested submenu
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/dropdown-button/design-spec.md
 */
import React, { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsDropdownButton,
  IdsDropdownTrigger,
  IdsDropdownMenu,
  IdsDropdownMenuItem,
  type IdsDropdownButtonItem,
} from "../../../../lib/react/ids/dropdown-button";
import {
  IdsButton,
  IdsButtonLabel,
  IdsButtonLeadingIcon,
} from "../../../../lib/react/ids/button";
import { IdsIcon } from "../../../../lib/react/ids/icon";

const DESIGN_SPEC_PATH = "components/ids/dropdown-button/design-spec.md";

const SPEC_ITEMS: IdsDropdownButtonItem[] = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
];

const NESTED_ITEMS: IdsDropdownButtonItem[] = [
  { id: "open", label: "Open" },
  {
    id: "share",
    label: "Share",
    children: [
      { id: "share-link", label: "Copy link" },
      { id: "share-email", label: "Email" },
      {
        id: "share-more",
        label: "More",
        children: [
          { id: "share-slack", label: "Slack" },
          { id: "share-teams", label: "Teams" },
        ],
      },
    ],
  },
  { id: "delete", label: "Delete", disabled: true },
];

type DropdownProps = ComponentProps<typeof IdsDropdownButton>;

const meta: Meta<typeof IdsDropdownButton> = {
  title: "Components/IDS/Dropdown Button",
  component: IdsDropdownButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          `React IDS Dropdown Button from \`${DESIGN_SPEC_PATH}\`. ` +
          "Anatomy: `dropdown` → `trigger-slot` + `dropdown-menu` → `dropdown-menu-item*` " +
          "(menu nestable under items). Popup uses shared Dropdown Combo Box menu styling. " +
          "Theme: `components/ids-theme.css`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "80px 24px 200px", minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Dropdown Button",
    buttonStyle: "primary",
    size: "medium",
    iconOnly: false,
    disabled: false,
    items: SPEC_ITEMS,
  },
  argTypes: {
    buttonStyle: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    iconOnly: { control: "boolean" },
    disabled: { control: "boolean" },
    onOpenChange: { action: "onOpenChange" },
    onSelect: { action: "onSelect" },
  },
};

export default meta;
type Story = StoryObj<typeof IdsDropdownButton>;

/** Spec Accurate Design — primary / medium / three options (Mode A items). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    label: "Dropdown Button",
    buttonStyle: "primary",
    size: "medium",
    items: SPEC_ITEMS,
  },
};

export const Secondary: Story = {
  args: {
    label: "Actions",
    buttonStyle: "secondary",
    items: SPEC_ITEMS,
  },
};

export const TertiaryWithIcon: Story = {
  args: {
    label: "Settings",
    buttonStyle: "tertiary",
    icon: (
      <IdsIcon shape="settings-gear-detailed" size={16} color="currentColor" />
    ),
    items: SPEC_ITEMS,
  },
};

export const NestedSubmenus: Story = {
  name: "Nested submenus (Mode A)",
  args: {
    label: "File",
    buttonStyle: "secondary",
    items: NESTED_ITEMS,
  },
};

/** Deterministic child structure — trigger-slot + dropdown-menu + nested menu. */
export const CompoundAnatomy: Story = {
  name: "Compound anatomy",
  render: function CompoundAnatomyStory() {
    const [last, setLast] = useState<string>("—");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <IdsDropdownButton onOpenChange={(o) => console.log("open", o)}>
          <IdsDropdownTrigger>
            <IdsButton variant="primary" size="medium">
              <IdsButtonLeadingIcon>
                <IdsIcon shape="settings-gear-detailed" size={16} color="currentColor" />
              </IdsButtonLeadingIcon>
              <IdsButtonLabel>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  Options
                  <IdsIcon shape="arrow-drop-tri-caret" size={10} color="currentColor" />
                </span>
              </IdsButtonLabel>
            </IdsButton>
          </IdsDropdownTrigger>
          <IdsDropdownMenu>
            <IdsDropdownMenuItem onSelect={() => setLast("Option 1")}>Option 1</IdsDropdownMenuItem>
            <IdsDropdownMenuItem onSelect={() => setLast("Option 2")}>Option 2</IdsDropdownMenuItem>
            <IdsDropdownMenuItem label="More actions">
              More actions
              <IdsDropdownMenu>
                <IdsDropdownMenuItem onSelect={() => setLast("Duplicate")}>
                  Duplicate
                </IdsDropdownMenuItem>
                <IdsDropdownMenuItem label="Move to">
                  Move to
                  <IdsDropdownMenu>
                    <IdsDropdownMenuItem onSelect={() => setLast("Folder A")}>
                      Folder A
                    </IdsDropdownMenuItem>
                    <IdsDropdownMenuItem onSelect={() => setLast("Folder B")}>
                      Folder B
                    </IdsDropdownMenuItem>
                  </IdsDropdownMenu>
                </IdsDropdownMenuItem>
              </IdsDropdownMenu>
            </IdsDropdownMenuItem>
            <IdsDropdownMenuItem disabled onSelect={() => setLast("Disabled")}>
              Disabled
            </IdsDropdownMenuItem>
          </IdsDropdownMenu>
        </IdsDropdownButton>
        <div style={{ fontSize: 14, color: "var(--color-text-gray-neutral)" }}>
          Last select: {last}
        </div>
      </div>
    );
  },
};

/** trigger-slot can be a non-button host (icon / div). */
export const IconTriggerSlot: Story = {
  name: "Trigger slot (icon)",
  render: () => (
    <IdsDropdownButton>
      <IdsDropdownTrigger ariaLabel="Open menu">
        <button
          type="button"
          style={{
            all: "unset",
            display: "inline-flex",
            cursor: "pointer",
            color: "var(--color-icon-brand-base)",
          }}
        >
          <IdsIcon shape="overflow-menu-dots" size={16} color="currentColor" />
        </button>
      </IdsDropdownTrigger>
      <IdsDropdownMenu>
        <IdsDropdownMenuItem>Edit</IdsDropdownMenuItem>
        <IdsDropdownMenuItem>Duplicate</IdsDropdownMenuItem>
        <IdsDropdownMenuItem>Delete</IdsDropdownMenuItem>
      </IdsDropdownMenu>
    </IdsDropdownButton>
  ),
};

export const ControlledOpen: Story = {
  render: function ControlledStory(args: DropdownProps) {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button type="button" onClick={() => setOpen(true)}>
          Open from outside
        </button>
        <IdsDropdownButton
          {...args}
          open={open}
          onOpenChange={setOpen}
          label="Controlled"
          items={SPEC_ITEMS}
        />
      </div>
    );
  },
};
