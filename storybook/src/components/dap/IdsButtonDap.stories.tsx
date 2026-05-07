import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/dap-theme.css";
import { DAP_BUTTON_DEFAULTS, IDS_DAP_BUTTON_DESIGN_SPEC_PATH } from "../../spec-contracts/ids-dap-button.contract";
import { IdsButtonDap } from "./IdsButtonDap";

const meta: Meta<typeof IdsButtonDap> = {
  title: "DAP/Button",
  component: IdsButtonDap,
  decorators: [
    (Story) => {
      const html = document.documentElement;
      const body = document.body;
      const prevHtmlDs = html.getAttribute("data-design-system");
      const prevBodyDs = body.getAttribute("data-design-system");
      const prevHtmlTheme = html.getAttribute("data-theme");
      const prevBodyTheme = body.getAttribute("data-theme");

      html.setAttribute("data-design-system", "dap");
      body.setAttribute("data-design-system", "dap");
      html.setAttribute("data-theme", "light");
      body.setAttribute("data-theme", "light");

      const restore = () => {
        if (prevHtmlDs === null) html.removeAttribute("data-design-system");
        else html.setAttribute("data-design-system", prevHtmlDs);
        if (prevBodyDs === null) body.removeAttribute("data-design-system");
        else body.setAttribute("data-design-system", prevBodyDs);
        if (prevHtmlTheme === null) html.removeAttribute("data-theme");
        else html.setAttribute("data-theme", prevHtmlTheme);
        if (prevBodyTheme === null) body.removeAttribute("data-theme");
        else body.setAttribute("data-theme", prevBodyTheme);
      };

      if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", restore, { once: true });
      }

      return Story();
    },
  ],
  parameters: {
    docs: {
      description: {
        component: `Delta-driven DAP Button aligned to \`${IDS_DAP_BUTTON_DESIGN_SPEC_PATH}\` (Figma node \`9662:25120\`).`,
      },
    },
  },
  args: {
    ...DAP_BUTTON_DEFAULTS,
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "tertiary", "destructive"] },
    size: { control: "select", options: ["small", "medium", "large"] },
    iconSlug: {
      control: "text",
      description: "Icon slug from assets/icons/<slug>.svg",
    },
    iconOnly: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof IdsButtonDap>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "large",
  },
};

export const VariantMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <IdsButtonDap variant="primary">Button</IdsButtonDap>
        <IdsButtonDap variant="secondary">Button</IdsButtonDap>
        <IdsButtonDap variant="tertiary">Button</IdsButtonDap>
        <IdsButtonDap variant="destructive">Button</IdsButtonDap>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <IdsButtonDap variant="primary" disabled>
          Button
        </IdsButtonDap>
        <IdsButtonDap variant="secondary" disabled>
          Button
        </IdsButtonDap>
        <IdsButtonDap variant="tertiary" disabled>
          Button
        </IdsButtonDap>
        <IdsButtonDap variant="destructive" disabled>
          Button
        </IdsButtonDap>
      </div>
    </div>
  ),
};

export const SizesAndIcons: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <IdsButtonDap size="small">Button</IdsButtonDap>
        <IdsButtonDap size="medium">Button</IdsButtonDap>
        <IdsButtonDap size="large">Button</IdsButtonDap>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <IdsButtonDap variant="secondary" size="small" iconSlug="settings-gear-detailed">
          Button
        </IdsButtonDap>
        <IdsButtonDap variant="secondary" size="medium" iconSlug="settings-gear-detailed">
          Button
        </IdsButtonDap>
        <IdsButtonDap variant="secondary" size="large" iconSlug="settings-gear-detailed">
          Button
        </IdsButtonDap>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <IdsButtonDap variant="tertiary" size="medium" iconOnly iconSlug="settings-gear-detailed" aria-label="Settings medium" />
        <IdsButtonDap variant="tertiary" size="large" iconOnly iconSlug="settings-gear-detailed" aria-label="Settings large" />
      </div>
    </div>
  ),
};

