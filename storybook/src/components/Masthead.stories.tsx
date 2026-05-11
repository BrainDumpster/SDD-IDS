import type { Meta, StoryObj } from "@storybook/react";
import {
  IdsMasthead,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
} from "./IdsMasthead";
import { AppLauncher } from "./AppLauncher";
import { Icon } from "./Icon";
import userIcon from "../../../assets/icons/user-single-16.svg";
import "../../../components/ids-ai-theme.css";

const helpIconEl = <Icon shapeName="help-circ-16" style={{ width: 16, height: 16 }} />;

const meta: Meta<typeof IdsMasthead> = {
  title: "IDS-AI/Masthead",
  component: IdsMasthead,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "IDS-AI Masthead per `components/ids-ai/masthead/design-spec.mdx` and Figma nodes `10130:29493`, `10130:29367`, `10130:29944`, scenarios `42155:68316` (see `data/ids-ai-component-figma-map.json`).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsMasthead>;

export const Default: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton aria-label="Help" icon={helpIconEl} />
      </IdsMastheadActionButtonContainer>
    ),
    avatarSlot: <IdsMastheadAvatar initials="YK" />,
  },
};

export const HelpActionOnly: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton aria-label="Help" icon={helpIconEl} />
      </IdsMastheadActionButtonContainer>
    ),
    avatarSlot: <IdsMastheadAvatar initials="YK" />,
  },
};

export const WithActions: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton aria-label="Help" icon={helpIconEl} />
        <IdsMastheadActionIconButton
          aria-label="Custom icon"
          icon={<span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>*</span>}
        />
      </IdsMastheadActionButtonContainer>
    ),
    avatarSlot: <IdsMastheadAvatar initials="YK" />,
  },
};

export const LogoOnly: Story = {
  args: {
    logo: (
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "var(--color-text-white)" }} />
    ),
    productName: "Synapse Platform",
    avatarSlot: <IdsMastheadAvatar initials="YK" />,
  },
};

/** App launcher is embedded in masthead actions (help -> launcher -> user), per design-spec integration. */
export const WithAppLauncherExample: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton aria-label="Help" icon={helpIconEl} />
      </IdsMastheadActionButtonContainer>
    ),
    appLauncherSlot: (
      <AppLauncher
        triggerVariant="masthead"
        sideOffset={0}
        products={[
          { id: "p1", name: "Product Name 1", href: "#" },
          { id: "p2", name: "Product Name 2", href: "#" },
          { id: "p3", name: "Product Name 3", href: "#" },
          { id: "p4", name: "Product Name 4", href: "#" },
        ]}
        options={[
          { id: "o1", label: "Option" },
          { id: "o2", label: "Option" },
          { id: "o3", label: "Option" },
          { id: "o4", label: "Option" },
        ]}
      />
    ),
    avatarSlot: <IdsMastheadAvatar initials="YK" />,
  },
};

export const UserIconAvatar: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton aria-label="Help" icon={helpIconEl} />
      </IdsMastheadActionButtonContainer>
    ),
    avatarSlot: <IdsMastheadAvatar imageSrc={userIcon} imageAlt="User profile" />,
  },
};

export const ProductNameOnlyNoLogoNoLauncher: Story = {
  args: {
    productName: "Synapse",
    avatarSlot: <IdsMastheadAvatar initials="YK" />,
  },
};

export const WithLogoAndAppLauncher: Story = {
  args: {
    logo: (
      <span
        aria-hidden="true"
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: "var(--color-text-white)",
          display: "inline-block",
        }}
      />
    ),
    productName: "Synapse",
    iconsSlot: (
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton aria-label="Help" icon={helpIconEl} />
      </IdsMastheadActionButtonContainer>
    ),
    appLauncherSlot: (
      <AppLauncher
        triggerVariant="masthead"
        sideOffset={0}
        products={[
          { id: "p1", name: "Product Name 1", href: "#" },
          { id: "p2", name: "Product Name 2", href: "#" },
        ]}
      />
    ),
    avatarSlot: <IdsMastheadAvatar initials="YK" />,
  },
};
