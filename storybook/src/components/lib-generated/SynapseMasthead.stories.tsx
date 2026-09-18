/**
 * Storybook: design-spec–generated Masthead from `lib/react/synapse/masthead`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy (deterministic child order — root is Masthead / SynapseMasthead, not MastheadRoot):
 *   SynapseMasthead
 *     SynapseMastheadBrandSlot
 *       SynapseMastheadLogo?
 *       SynapseMastheadProductName
 *     SynapseMastheadActionsRow?
 *       SynapseMastheadIconsSlot?
 *       SynapseMastheadAppLauncherSlot?
 *       SynapseMastheadAvatarSlot?
 *
 * Host primitives: ActionButtonContainer, ActionIconButton, Avatar.
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/masthead/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_MASTHEAD_DOCS_DESCRIPTION,
  SYNAPSE_MASTHEAD_SOURCE_CODE,
} from "./synapse-masthead.developer-usage";
import { SynapseAppLauncher } from "@synapse/react/app-launcher";
import { SynapseIcon } from "@synapse/react/icon";
import {
  SynapseMastheadCompound as SynapseMasthead,
  type SynapseMastheadProps,
} from "@synapse/react/masthead";

const DESIGN_SPEC_PATH = "components/synapse/masthead/design-spec.md";
const icon16 = { width: 16, height: 16 } as const;

const productLogo = (
  <SynapseIcon
    shape="appic-dp-cloud-blue"
    variant="img"
    title="Product logo"
    size={32}
  />
);

function FigmaSampleIcons() {
  return (
    <SynapseMasthead.ActionButtonContainer>
      <SynapseMasthead.ActionIconButton
        aria-label="Search"
        icon={<SynapseIcon shape="search-16" size={16} />}
      />
      <SynapseMasthead.ActionIconButton
        aria-label="Alerts, 3 unread"
        badgeCount={3}
        badgeType="critical"
        icon={<SynapseIcon shape="alert-bell-16" size={16} />}
      />
      <SynapseMasthead.ActionIconButton
        aria-label="Jobs queue, 2 active"
        badgeCount={2}
        badgeType="success"
        icon={<SynapseIcon shape="jobs-queue-stack" size={16} />}
      />
      <SynapseMasthead.ActionIconButton
        aria-label="Settings"
        icon={<SynapseIcon shape="setting-gear-16" size={16} />}
      />
      <SynapseMasthead.ActionIconButton
        aria-label="Help"
        icon={<SynapseIcon shape="help-circ-16" size={16} />}
      />
    </SynapseMasthead.ActionButtonContainer>
  );
}

const sampleAppLauncher = (
  <SynapseAppLauncher
    triggerVariant="masthead"
    products={[
      { id: "p1", name: "Product Name 1" },
      { id: "p2", name: "Product Name 2" },
    ]}
  />
);

const meta: Meta<SynapseMastheadProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Masthead",
  component: SynapseMasthead,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_MASTHEAD_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_MASTHEAD_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SynapseMastheadProps>;

/** Figma `Product Icon=No` — `10130:29494` — product name only. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function SpecAccurateDesignRender() {
    return (
      <SynapseMasthead>
        <SynapseMasthead.BrandSlot>
          <SynapseMasthead.ProductName>Product Name</SynapseMasthead.ProductName>
        </SynapseMasthead.BrandSlot>
      </SynapseMasthead>
    );
  },
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: function NestedHierarchyRender() {
    return (
      <SynapseMasthead>
        <SynapseMasthead.BrandSlot>
          <SynapseMasthead.Logo>{productLogo}</SynapseMasthead.Logo>
          <SynapseMasthead.ProductName>Product Name</SynapseMasthead.ProductName>
        </SynapseMasthead.BrandSlot>
        <SynapseMasthead.ActionsRow>
          <SynapseMasthead.IconsSlot>
            <FigmaSampleIcons />
          </SynapseMasthead.IconsSlot>
          <SynapseMasthead.AppLauncherSlot>{sampleAppLauncher}</SynapseMasthead.AppLauncherSlot>
          <SynapseMasthead.AvatarSlot>
            <SynapseMasthead.Avatar initials="DT" aria-label="User settings" />
          </SynapseMasthead.AvatarSlot>
        </SynapseMasthead.ActionsRow>
      </SynapseMasthead>
    );
  },
};

export const ConvenienceProductNameOnly: Story = {
  name: "Convenience Product Name Only",
  render: () => <SynapseMasthead productName="Product Name" />,
};

export const WithProductLogo: Story = {
  render: () => <SynapseMasthead productName="Product Name" logo={productLogo} />,
};

export const WithFigmaSampleActions: Story = {
  name: "With Figma sample actions",
  render: () => (
    <SynapseMasthead productName="Product Name" iconsSlot={<FigmaSampleIcons />} />
  ),
};

export const WithAppLauncher: Story = {
  render: () => (
    <SynapseMasthead productName="Product Name" appLauncherSlot={sampleAppLauncher} />
  ),
};

export const WithAvatarInitials: Story = {
  render: () => (
    <SynapseMasthead
      productName="Product Name"
      avatarSlot={<SynapseMasthead.Avatar initials="DT" aria-label="User settings" />}
    />
  ),
};

export const UserIconAvatar: Story = {
  render: () => (
    <SynapseMasthead
      productName="Product Name"
      avatarSlot={
        <SynapseMasthead.Avatar
          aria-label="User settings"
          icon={
            <SynapseIcon
              shape="user-single"
              size={16}
              color="var(--color-icon-gray-white)"
            />
          }
        />
      }
    />
  ),
};

export const FullHostComposition: Story = {
  name: "Full host composition",
  render: () => (
    <SynapseMasthead
      productName="Product Name"
      logo={productLogo}
      iconsSlot={<FigmaSampleIcons />}
      appLauncherSlot={sampleAppLauncher}
      avatarSlot={<SynapseMasthead.Avatar initials="DT" aria-label="User settings" />}
    />
  ),
};
