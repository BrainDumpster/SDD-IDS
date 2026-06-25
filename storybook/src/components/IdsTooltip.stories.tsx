import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { IdsTooltip } from "./IdsTooltip";

const longContent =
  "Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.";

const meta: Meta<typeof IdsTooltip> = {
  title: "Spec Generated/IDS/Tooltip",
  component: IdsTooltip,
  render: (args) => (
    <IdsTooltip {...args}>
      <Button variant="secondary">{String(args.children ?? "Trigger")}</Button>
    </IdsTooltip>
  ),
  args: {
    title: "Tooltip Title",
    content: longContent,
    side: "top",
    arrowAlign: "start",
    closable: false,
    children: "Hover over me",
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    closable: { control: "boolean" },
    title: { control: "text" },
    content: { control: "text" },
    children: { control: "text" },
    onClose: { action: "onClose" },
  },
};

export default meta;
type Story = StoryObj<typeof IdsTooltip>;

export const NormalNoHeader: Story = {
  args: {
    title: "",
    content: longContent,
    closable: false,
    side: "top",
    arrowAlign: "start",
  },
};

export const WithHeader: Story = {
  args: {
    title: "Tooltip Title",
    content: longContent,
    closable: false,
    side: "top",
    align: "center",
  },
};

export const Closable: Story = {
  args: {
    title: "Tooltip Title",
    content: longContent,
    closable: true,
    side: "top",
    arrowAlign: "end",
    onClose: () => undefined,
  },
};

export const ClosableNoTitle: Story = {
  name: "Closable / No Title",
  args: {
    title: "",
    content: longContent,
    closable: true,
    side: "top",
    arrowAlign: "start",
    onClose: () => undefined,
  },
};

export const RichContent: Story = {
  args: {
    title: "Custom Content",
    closable: false,
    side: "right",
    align: "center",
    content: (
      <div>
        <p style={{ margin: 0 }}>Any content can be rendered here.</p>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          <li>Text</li>
          <li>Lists</li>
          <li>Inline formatting</li>
        </ul>
      </div>
    ),
  },
};

export const ArrowMatrix: Story = {
  args: {
    closable: true
  },

  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
        gap: 20,
        padding: 24,
      }}
    >
      {(["bottom", "top", "right", "left"] as const).flatMap((side) =>
        (["start", "center", "end"] as const).map((align) => (
          <div key={`${side}-${align}`} style={{ display: "flex", justifyContent: "center" }}>
            <IdsTooltip
              title="Tooltip Title"
              content={`${side} - ${align}`}
              side={side}
              align={align}
            >
              <Button variant="secondary">{`${side}-${align}`}</Button>
            </IdsTooltip>
          </div>
        ))
      )}
    </div>
  )
};
