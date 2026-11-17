/* Spec Accurate Design — IDS Icon Button */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  ICON_BUTTON_DEMO_SHAPE,
  ICON_BUTTON_SPEC_ACCURATE_DEFAULTS,
} from "@component-contracts/ids/icon-button.contract";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import { IdsIconButton } from "../../../../storybook/src/components/IdsIconButton";

type Variant = "primary" | "secondary" | "tertiary" | "ghostNeutral";
type Size = "small" | "medium" | "large";

function Ib(props: {
  shape?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel: string;
  dataState?: "default" | "hover" | "press" | "focus-visible" | "disabled";
  "data-state"?: "default" | "hover" | "press" | "focus-visible" | "disabled";
}) {
  const {
    shape = ICON_BUTTON_DEMO_SHAPE,
    ariaLabel,
    dataState,
    "data-state": dataStateAttr,
    ...rest
  } = props;
  return (
    <IdsIconButton
      {...rest}
      shape={shape}
      ariaLabel={ariaLabel}
      dataState={dataState ?? dataStateAttr}
    />
  );
}

const meta: Meta<typeof IdsIconButton> = {
  title: "Components/IDS/Icon Button",
  component: IdsIconButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "IDS Icon Button per components/ids/icon-button/design-spec.md. Required `shape` forwarded to IdsIcon; glyphs 12 / 14 / 16.",
      },
    },
  },
  argTypes: {
    shape: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "ghostNeutral"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    ariaLabel: { control: "text" },
    onClick: { action: "onClick" },
  },
  args: {
    shape: ICON_BUTTON_DEMO_SHAPE,
    variant: "primary",
    size: "large",
    disabled: false,
    loading: false,
    ariaLabel: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel,
  },
};

export default meta;
type Story = StoryObj<typeof IdsIconButton>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => (
    <IdsIconButton
      {...args}
      shape={args.shape ?? ICON_BUTTON_DEMO_SHAPE}
      ariaLabel={args.ariaLabel ?? "Add"}
    />
  ),
  args: {
    shape: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.shape,
    variant: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.variant,
    size: "large",
    disabled: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled,
    loading: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.loading,
    ariaLabel: ICON_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Ib variant="primary" ariaLabel="Primary" />
      <Ib variant="secondary" ariaLabel="Secondary" />
      <Ib variant="tertiary" ariaLabel="Tertiary" />
      <Ib variant="ghostNeutral" ariaLabel="Ghost Neutral" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Ib size="small" ariaLabel="Small" />
      <Ib size="medium" ariaLabel="Medium" />
      <Ib size="large" ariaLabel="Large" />
    </div>
  ),
};

export const StatesMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["primary", "secondary", "tertiary", "ghostNeutral"] as const).map((v) => (
          <Ib key={v} variant={v} ariaLabel={v} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["primary", "secondary", "tertiary", "ghostNeutral"] as const).map((v) => (
          <Ib key={`${v}-d`} variant={v} disabled ariaLabel={`${v} disabled`} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["primary", "secondary", "tertiary", "ghostNeutral"] as const).map((v) => (
          <Ib
            key={`${v}-f`}
            variant={v}
            ariaLabel={`${v} focus`}
            data-state="focus-visible"
          />
        ))}
      </div>
    </div>
  ),
};

export const SizeByVariantGrid: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      {(["small", "medium", "large"] as const).map((size) => (
        <div key={size} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {(["primary", "secondary", "tertiary", "ghostNeutral"] as const).map((variant) => (
            <Ib
              key={`${variant}-${size}`}
              variant={variant}
              size={size}
              ariaLabel={`${variant} ${size}`}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};
