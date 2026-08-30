/**
 * Storybook: design-spec–generated Masthead from `lib/react/ids/masthead`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy (deterministic child order — root is Masthead / IdsMasthead, not MastheadRoot):
 *   IdsMasthead
 *     IdsMastheadBrandSlot
 *       IdsMastheadLogo?
 *       IdsMastheadProductName
 *     IdsMastheadActionsRow?
 *       IdsMastheadIconsSlot?
 *       IdsMastheadAppLauncherSlot?
 *       IdsMastheadAvatarSlot?
 *
 * Host primitives: ActionButtonContainer, ActionIconButton, Avatar.
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/masthead/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  MASTHEAD_DOCS_DESCRIPTION,
  MASTHEAD_SOURCE_CODE,
} from "./ids-masthead.developer-usage";
import { AppLauncher } from "@ids/react/app-launcher";
import { IdsIcon } from "@ids/react/icon";
import {
  Masthead,
  type IdsMastheadProps,
} from "@ids/react/masthead";

const DESIGN_SPEC_PATH = "components/ids/masthead/design-spec.md";
const icon16 = { width: 16, height: 16 } as const;

const productLogo = (
  <IdsIcon
    shape="appic-dp-cloud-blue"
    variant="img"
    title="Product logo"
    size={32}
  />
);

function FigmaSampleIcons() {
  return (
    <Masthead.ActionButtonContainer>
      <Masthead.ActionIconButton
        aria-label="Search"
        icon={<IdsIcon shape="search-16" size={16} />}
      />
      <Masthead.ActionIconButton
        aria-label="Alerts, 3 unread"
        badgeCount={3}
        badgeType="critical"
        icon={<IdsIcon shape="alert-bell-16" size={16} />}
      />
      <Masthead.ActionIconButton
        aria-label="Jobs queue, 2 active"
        badgeCount={2}
        badgeType="success"
        icon={<IdsIcon shape="jobs-queue-stack" size={16} />}
      />
      <Masthead.ActionIconButton
        aria-label="Settings"
        icon={<IdsIcon shape="setting-gear-16" size={16} />}
      />
      <Masthead.ActionIconButton
        aria-label="Help"
        icon={<IdsIcon shape="help-circ-16" size={16} />}
      />
    </Masthead.ActionButtonContainer>
  );
}

const sampleAppLauncher = (
  <AppLauncher
    triggerVariant="masthead"
    products={[
      { id: "p1", name: "Product Name 1" },
      { id: "p2", name: "Product Name 2" },
    ]}
  />
);

const meta: Meta<IdsMastheadProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Masthead",
  component: Masthead,
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: MASTHEAD_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: MASTHEAD_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<IdsMastheadProps>;

/** Figma `Product Icon=No` — `10130:29494` — product name only. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: function SpecAccurateDesignRender() {
    return (
      <Masthead>
        <Masthead.BrandSlot>
          <Masthead.ProductName>Product Name</Masthead.ProductName>
        </Masthead.BrandSlot>
      </Masthead>
    );
  },
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: function NestedHierarchyRender() {
    return (
      <Masthead>
        <Masthead.BrandSlot>
          <Masthead.Logo>{productLogo}</Masthead.Logo>
          <Masthead.ProductName>Product Name</Masthead.ProductName>
        </Masthead.BrandSlot>
        <Masthead.ActionsRow>
          <Masthead.IconsSlot>
            <FigmaSampleIcons />
          </Masthead.IconsSlot>
          <Masthead.AppLauncherSlot>{sampleAppLauncher}</Masthead.AppLauncherSlot>
          <Masthead.AvatarSlot>
            <Masthead.Avatar initials="DT" aria-label="User settings" />
          </Masthead.AvatarSlot>
        </Masthead.ActionsRow>
      </Masthead>
    );
  },
};

export const ConvenienceProductNameOnly: Story = {
  name: "Convenience Product Name Only",
  render: () => <Masthead productName="Product Name" />,
};

export const WithProductLogo: Story = {
  render: () => <Masthead productName="Product Name" logo={productLogo} />,
};

export const WithFigmaSampleActions: Story = {
  name: "With Figma sample actions",
  render: () => (
    <Masthead productName="Product Name" iconsSlot={<FigmaSampleIcons />} />
  ),
};

export const WithAppLauncher: Story = {
  render: () => (
    <Masthead productName="Product Name" appLauncherSlot={sampleAppLauncher} />
  ),
};

export const WithAvatarInitials: Story = {
  render: () => (
    <Masthead
      productName="Product Name"
      avatarSlot={<Masthead.Avatar initials="DT" aria-label="User settings" />}
    />
  ),
};

export const UserIconAvatar: Story = {
  render: () => (
    <Masthead
      productName="Product Name"
      avatarSlot={
        <Masthead.Avatar
          aria-label="User settings"
          icon={
            <IdsIcon
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
    <Masthead
      productName="Product Name"
      logo={productLogo}
      iconsSlot={<FigmaSampleIcons />}
      appLauncherSlot={sampleAppLauncher}
      avatarSlot={<Masthead.Avatar initials="DT" aria-label="User settings" />}
    />
  ),
};
