/* Spec Generated — IDS Footer (design-spec intake wizard) */
import "../../../components/ids-theme.css";
import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IdsFooter } from "./IdsFooter";

const DESIGN_SPEC_PATH = "components/ids/footer/design-spec.md";

/** Defaults from design-spec.md — Spec Accurate Design story defaults (Figma `38908:5818`). */
const specAccurateArgs: ComponentProps<typeof IdsFooter> = {
  hostname: "short_name_first_domain_name",
  swid: "ELMCR00222GBPB",
  currentDateTime: "Tue, 2023-04-23 12:30 AM",
  timeZoneLabel: "Eastern Time (US & Canada)",
  showHostname: true,
  showCurrentDateAndTime: true,
  showTimeZone: true,
};

const meta: Meta<typeof IdsFooter> = {
  title: "Spec Generated/IDS/Footer",
  component: IdsFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Spec-driven IDS application status footer. Source of truth: \`${DESIGN_SPEC_PATH}\`.`,
          "Primary story matches Figma IDS Design Library node `38908:5818` (32px bar, host/SWID/time/zone).",
          "Theme: `components/ids-theme.css`; icons via shared `Icon` + `assets/icons/<slug>.svg`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof IdsFooter>;

function SpecAccurateFrame(props: ComponentProps<typeof IdsFooter>) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "120px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "var(--color-background-component)",
      }}
    >
      <IdsFooter {...props} />
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <SpecAccurateFrame {...args} />,
};
