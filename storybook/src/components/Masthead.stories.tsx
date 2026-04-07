import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { Masthead, MastheadActionButtonContainer, MastheadActionIconButton } from "./Masthead";
import { AppLauncher } from "./AppLauncher";
import helpIcon from "../../../assets/icons/help-circ-16.svg";
import userIcon from "../../../assets/icons/user-single-16.svg";

const helpGlyphStyle: CSSProperties = {
  width: 16,
  height: 16,
  display: "inline-block",
  backgroundColor: "currentColor",
  WebkitMaskImage: `url(${helpIcon})`,
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  WebkitMaskSize: "contain",
  maskImage: `url(${helpIcon})`,
  maskRepeat: "no-repeat",
  maskPosition: "center",
  maskSize: "contain",
};

const avatarInitialsStyle: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.6)",
  color: "var(--color-text-white)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 500,
};

const avatarIconStyle: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.6)",
  color: "var(--color-text-white)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const avatarUserGlyphStyle: CSSProperties = {
  width: 16,
  height: 16,
  display: "inline-block",
  backgroundColor: "currentColor",
  WebkitMaskImage: `url(${userIcon})`,
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  WebkitMaskSize: "contain",
  maskImage: `url(${userIcon})`,
  maskRepeat: "no-repeat",
  maskPosition: "center",
  maskSize: "contain",
};

const meta: Meta<typeof Masthead> = {
  title: "Synapse/Masthead",
  component: Masthead,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Masthead>;

export const Default: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <MastheadActionButtonContainer>
        <MastheadActionIconButton aria-label="Help" icon={<span style={helpGlyphStyle} />} />
      </MastheadActionButtonContainer>
    ),
    avatarSlot: <span style={avatarInitialsStyle}>YK</span>,
  },
};

export const WithActions: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <MastheadActionButtonContainer>
        <MastheadActionIconButton aria-label="Help" icon={<span style={helpGlyphStyle} />} />
        <MastheadActionIconButton
          aria-label="Custom icon"
          icon={<span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>*</span>}
        />
      </MastheadActionButtonContainer>
    ),
    avatarSlot: <span style={avatarInitialsStyle}>YK</span>,
  },
};

export const LogoOnly: Story = {
  args: {
    logo: (
      <span style={{ width: 12, height: 12, borderRadius: 999, background: "var(--color-text-white)" }} />
    ),
    productName: "Synapse Platform",
    avatarSlot: <span style={avatarInitialsStyle}>YK</span>,
  },
};

/** App launcher is embedded in masthead actions (help -> launcher -> user), per design-spec integration. */
export const WithAppLauncherExample: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <MastheadActionButtonContainer>
        <MastheadActionIconButton aria-label="Help" icon={<span style={helpGlyphStyle} />} />
      </MastheadActionButtonContainer>
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
    avatarSlot: <span style={avatarInitialsStyle}>YK</span>,
  },
};

export const UserIconAvatar: Story = {
  args: {
    productName: "Synapse",
    iconsSlot: (
      <MastheadActionButtonContainer>
        <MastheadActionIconButton aria-label="Help" icon={<span style={helpGlyphStyle} />} />
      </MastheadActionButtonContainer>
    ),
    avatarSlot: (
      <span style={avatarIconStyle}>
        <span style={avatarUserGlyphStyle} aria-hidden="true" />
      </span>
    ),
  },
};

export const ProductNameOnlyNoLogoNoLauncher: Story = {
  args: {
    productName: "Synapse",
    avatarSlot: <span style={avatarInitialsStyle}>YK</span>,
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
      <MastheadActionButtonContainer>
        <MastheadActionIconButton aria-label="Help" icon={<span style={helpGlyphStyle} />} />
      </MastheadActionButtonContainer>
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
    avatarSlot: <span style={avatarInitialsStyle}>YK</span>,
  },
};
