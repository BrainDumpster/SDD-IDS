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
  DROPDOWN_BUTTON_DOCS_DESCRIPTION,
  DROPDOWN_BUTTON_SOURCE_CODE,
} from "./ids-dropdown-button.developer-usage";
import {
  IdsDropdownButton,
  IdsDropdownTrigger,
  IdsDropdownMenu,
  IdsDropdownMenuItem,
  type IdsDropdownButtonItem,
} from "@ids/react/dropdown-button";
import {
  IdsButton,
  IdsButtonLabel,
  IdsButtonLeadingIcon,
} from "@ids/react/button";
import { IdsIcon } from "@ids/react/icon";

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
  tags: ["autodocs"],
  title: "Components/IDS/Dropdown Button",
  component: IdsDropdownButton,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: DROPDOWN_BUTTON_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: DROPDOWN_BUTTON_SOURCE_CODE,
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
    disabled: false,
    items: SPEC_ITEMS,
  },
  argTypes: {
    buttonStyle: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
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

/** All button styles in one group (primary / secondary / tertiary). */
export const Variants: Story = {
  name: "Variants",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <IdsDropdownButton label="Primary" buttonStyle="primary" items={SPEC_ITEMS} />
      <IdsDropdownButton label="Secondary" buttonStyle="secondary" items={SPEC_ITEMS} />
      <IdsDropdownButton label="Tertiary" buttonStyle="tertiary" items={SPEC_ITEMS} />
    </div>
  ),
};

/** All three sizes of the dropdown button. */
export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <IdsDropdownButton label="Small" size="small" items={SPEC_ITEMS} />
      <IdsDropdownButton label="Medium" size="medium" items={SPEC_ITEMS} />
      <IdsDropdownButton label="Large" size="large" items={SPEC_ITEMS} />
    </div>
  ),
};

/** All variants and sizes with a leading icon (settings-gear-detailed). */
export const WithLeadingIcon: Story = {
  name: "With leading icon",
  render: () => {
    const gear = (
      <IdsIcon shape="settings-gear-detailed" size={16} color="currentColor" />
    );
    const styles = ["primary", "secondary", "tertiary"] as const;
    const sizes = ["small", "medium", "large"] as const;
    return (
      <div style={{ display: "grid", gap: 16 }}>
        {styles.map((buttonStyle) => (
          <div
            key={buttonStyle}
            style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}
          >
            {sizes.map((size) => (
              <IdsDropdownButton
                key={`${buttonStyle}-${size}`}
                label="Settings"
                buttonStyle={buttonStyle}
                size={size}
                icon={gear}
                items={SPEC_ITEMS}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/** Style × size matrix incl. disabled (closed triggers). */
export const VariantSizeMatrix: Story = {
  name: "Variant × Size Matrix",
  render: () => {
    const styles = ["primary", "secondary", "tertiary"] as const;
    const sizes = ["small", "medium", "large"] as const;
    return (
      <div style={{ display: "grid", gap: 16 }}>
        {styles.map((buttonStyle) => (
          <div
            key={buttonStyle}
            style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}
          >
            {sizes.map((size) => (
              <IdsDropdownButton
                key={`${buttonStyle}-${size}`}
                label={size}
                buttonStyle={buttonStyle}
                size={size}
                items={SPEC_ITEMS}
              />
            ))}
            <IdsDropdownButton
              label="Disabled"
              buttonStyle={buttonStyle}
              disabled
              items={SPEC_ITEMS}
            />
          </div>
        ))}
      </div>
    );
  },
};

/** Open-menu compositions: 3 sizes × 3 variants, label-only and with leading icon. */
export const OpenMenuExamples: Story = {
  name: "Open menu examples",
  render: () => {
    const gear = (
      <IdsIcon shape="settings-gear-detailed" size={16} color="currentColor" />
    );
    const styles = ["primary", "secondary", "tertiary"] as const;
    const sizes = ["small", "medium", "large"] as const;
    return (
      <div style={{ display: "grid", gap: 170 }}>
        {sizes.map((size) => (
          <div
            key={size}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
              rowGap: 170,
              columnGap: 48,
              alignItems: "start",
            }}
          >
            {styles.map((buttonStyle) => (
              <IdsDropdownButton
                key={`${size}-${buttonStyle}`}
                label="Button"
                buttonStyle={buttonStyle}
                size={size}
                defaultOpen
                items={SPEC_ITEMS}
              />
            ))}
            {styles.map((buttonStyle) => (
              <IdsDropdownButton
                key={`${size}-${buttonStyle}-icon`}
                label="Button"
                buttonStyle={buttonStyle}
                size={size}
                icon={gear}
                defaultOpen
                items={SPEC_ITEMS}
              />
            ))}
          </div>
        ))}
      </div>
    );
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
export const TriggerSlot: Story = {
  name: "Trigger Slot",
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
