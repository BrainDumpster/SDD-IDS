/**
 * Storybook: design-spec–generated Dropdown Button from `lib/react/synapse/dropdown-button`
 *
 * Anatomy (deterministic):
 *   SynapseDropdownButton (`dropdown`)
 *     SynapseDropdownTrigger (`trigger-slot`) — button | div | icon | any
 *     SynapseDropdownMenu (`dropdown-menu`) — shared combo-box popup styling
 *       SynapseDropdownMenuItem* (`dropdown-menu-item`)
 *         SynapseDropdownMenu? — nested submenu
 *
 * Theme: components/synapse-theme.css
 * Spec: components/ids/dropdown-button/design-spec.md
 */
import React, { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_DROPDOWN_BUTTON_DOCS_DESCRIPTION,
  SYNAPSE_DROPDOWN_BUTTON_SOURCE_CODE,
} from "./synapse-dropdown-button.developer-usage";
import {
  SynapseDropdownButton,
  SynapseDropdownTrigger,
  SynapseDropdownMenu,
  SynapseDropdownMenuItem,
  type SynapseDropdownButtonItem,
} from "@synapse/react/dropdown-button";
import {
  SynapseButton,
  SynapseButtonLabel,
  SynapseButtonLeadingIcon,
} from "@synapse/react/button";
import { SynapseIcon } from "@synapse/react/icon";

const DESIGN_SPEC_PATH = "components/ids/dropdown-button/design-spec.md";

const SPEC_ITEMS: SynapseDropdownButtonItem[] = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
];

const NESTED_ITEMS: SynapseDropdownButtonItem[] = [
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

type DropdownProps = ComponentProps<typeof SynapseDropdownButton>;

const meta: Meta<typeof SynapseDropdownButton> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Dropdown Button",
  component: SynapseDropdownButton,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_DROPDOWN_BUTTON_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_DROPDOWN_BUTTON_SOURCE_CODE,
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
type Story = StoryObj<typeof SynapseDropdownButton>;

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
      <SynapseIcon shape="settings-gear-detailed" size={16} color="currentColor" />
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
        <SynapseDropdownButton onOpenChange={(o) => console.log("open", o)}>
          <SynapseDropdownTrigger>
            <SynapseButton variant="primary" size="medium">
              <SynapseButtonLeadingIcon>
                <SynapseIcon shape="settings-gear-detailed" size={16} color="currentColor" />
              </SynapseButtonLeadingIcon>
              <SynapseButtonLabel>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  Options
                  <SynapseIcon shape="arrow-drop-tri-caret" size={10} color="currentColor" />
                </span>
              </SynapseButtonLabel>
            </SynapseButton>
          </SynapseDropdownTrigger>
          <SynapseDropdownMenu>
            <SynapseDropdownMenuItem onSelect={() => setLast("Option 1")}>Option 1</SynapseDropdownMenuItem>
            <SynapseDropdownMenuItem onSelect={() => setLast("Option 2")}>Option 2</SynapseDropdownMenuItem>
            <SynapseDropdownMenuItem label="More actions">
              More actions
              <SynapseDropdownMenu>
                <SynapseDropdownMenuItem onSelect={() => setLast("Duplicate")}>
                  Duplicate
                </SynapseDropdownMenuItem>
                <SynapseDropdownMenuItem label="Move to">
                  Move to
                  <SynapseDropdownMenu>
                    <SynapseDropdownMenuItem onSelect={() => setLast("Folder A")}>
                      Folder A
                    </SynapseDropdownMenuItem>
                    <SynapseDropdownMenuItem onSelect={() => setLast("Folder B")}>
                      Folder B
                    </SynapseDropdownMenuItem>
                  </SynapseDropdownMenu>
                </SynapseDropdownMenuItem>
              </SynapseDropdownMenu>
            </SynapseDropdownMenuItem>
            <SynapseDropdownMenuItem disabled onSelect={() => setLast("Disabled")}>
              Disabled
            </SynapseDropdownMenuItem>
          </SynapseDropdownMenu>
        </SynapseDropdownButton>
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
    <SynapseDropdownButton>
      <SynapseDropdownTrigger ariaLabel="Open menu">
        <button
          type="button"
          style={{
            all: "unset",
            display: "inline-flex",
            cursor: "pointer",
            color: "var(--color-icon-brand-base)",
          }}
        >
          <SynapseIcon shape="overflow-menu-dots" size={16} color="currentColor" />
        </button>
      </SynapseDropdownTrigger>
      <SynapseDropdownMenu>
        <SynapseDropdownMenuItem>Edit</SynapseDropdownMenuItem>
        <SynapseDropdownMenuItem>Duplicate</SynapseDropdownMenuItem>
        <SynapseDropdownMenuItem>Delete</SynapseDropdownMenuItem>
      </SynapseDropdownMenu>
    </SynapseDropdownButton>
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
        <SynapseDropdownButton
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
