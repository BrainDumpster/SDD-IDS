/**
 * Storybook: IDS Lit Footer from `lib/lit/ids/footer`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/footer/design-spec.md
 * API: lib/react/ids/footer (prop/event contract)
 * Examples: storybook/src/components/lib-generated/Footer.stories.tsx
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/footer/register.js";
import {
  FOOTER_DOCS_DESCRIPTION,
  FOOTER_SOURCE_CODE,
} from "./ids-footer.developer-usage";

type FooterArgs = {
  hostname: string;
  swid: string;
  currentDateTime: string;
  timeZoneLabel: string;
  showHostname: boolean;
  showCurrentDateAndTime: boolean;
  showTimeZone: boolean;
  copyDisabled: boolean;
  timeZoneDisabled: boolean;
  onCopySwid?: (swid: string) => void;
  onTimeZoneClick?: () => void;
};

/** Spec Accurate Design defaults — Figma `38908:5818`. */
const specAccurateArgs: FooterArgs = {
  hostname: "short_name_first_domain_name",
  swid: "ELMCR00222GBPB",
  currentDateTime: "Tue, 2023-04-23 12:30 AM",
  timeZoneLabel: "Eastern Time (US & Canada)",
  showHostname: true,
  showCurrentDateAndTime: true,
  showTimeZone: true,
  copyDisabled: false,
  timeZoneDisabled: false,
};

const frameStyle =
  "width:100%;min-height:120px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-end;background:var(--color-background-surface-component);";

function renderFooter(args: FooterArgs) {
  return html`
    <ids-footer
      hostname=${args.hostname ?? ""}
      swid=${args.swid ?? ""}
      currentdatetime=${args.currentDateTime ?? ""}
      timezonelabel=${args.timeZoneLabel ?? ""}
      .showHostname=${args.showHostname}
      .showCurrentDateAndTime=${args.showCurrentDateAndTime}
      .showTimeZone=${args.showTimeZone}
      ?copydisabled=${args.copyDisabled}
      ?timezonedisabled=${args.timeZoneDisabled}
      .onCopySwid=${args.onCopySwid}
      .onTimeZoneClick=${args.onTimeZoneClick}
    ></ids-footer>
  `;
}

const meta: Meta<FooterArgs> = {
  title: "Spec Generated/IDS/Footer",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: { component: FOOTER_DOCS_DESCRIPTION },
      source: { code: FOOTER_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    hostname: { control: "text" },
    swid: { control: "text" },
    currentDateTime: { control: "text" },
    timeZoneLabel: { control: "text" },
    showHostname: { control: "boolean" },
    showCurrentDateAndTime: { control: "boolean" },
    showTimeZone: { control: "boolean" },
    copyDisabled: { control: "boolean" },
    timeZoneDisabled: { control: "boolean" },
    onCopySwid: { action: "onCopySwid" },
    onTimeZoneClick: { action: "onTimeZoneClick" },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<FooterArgs>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => html`
    <div style=${frameStyle}>${renderFooter(args)}</div>
  `,
};

export const VisibilityMatrix: Story = {
  name: "Visibility Matrix",
  render: () => html`
    <div style="display:grid;gap:16px;padding:16px;">
      ${renderFooter(specAccurateArgs)}
      ${renderFooter({ ...specAccurateArgs, showHostname: false })}
      ${renderFooter({ ...specAccurateArgs, showCurrentDateAndTime: false })}
      ${renderFooter({ ...specAccurateArgs, showTimeZone: false })}
      ${renderFooter({
        ...specAccurateArgs,
        showHostname: false,
        showCurrentDateAndTime: false,
        showTimeZone: false,
      })}
    </div>
  `,
};

export const HostnameTruncation: Story = {
  name: "Hostname Truncation",
  render: () => html`
    <div style=${frameStyle}>
      ${renderFooter({
        ...specAccurateArgs,
        hostname:
          "this_hostname_exceeds_forty_eight_characters_abcde_extra",
      })}
    </div>
  `,
};

export const DisabledControls: Story = {
  name: "Disabled Controls",
  render: () => html`
    <div style=${frameStyle}>
      ${renderFooter({
        ...specAccurateArgs,
        copyDisabled: true,
        timeZoneDisabled: true,
      })}
    </div>
  `,
};

export const WithoutSwid: Story = {
  name: "Without SWID",
  render: () => html`
    <div style=${frameStyle}>
      ${renderFooter({ ...specAccurateArgs, swid: "" })}
    </div>
  `,
};
